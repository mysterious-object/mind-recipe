from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import time
from dataclasses import dataclass
from typing import Dict, Optional
from uuid import uuid4

from fastapi import HTTPException, status

from .config import settings


@dataclass(frozen=True)
class UserAccount:
    id: str
    email: str
    display_name: str
    password_hash: str


class AccountStore:
    """Persistent account store for registration and authenticated sessions."""

    def __init__(self) -> None:
        self.users_by_email: Dict[str, UserAccount] = {}
        self.users_by_id: Dict[str, UserAccount] = {}
        self.database_url = settings.database_url
        self.uses_postgres = self.database_url.startswith("postgresql")
        self.db_path = os.getenv(
            "MIND_RECIPE_AUTH_DB",
            os.getenv("MIND_RECIPE_DB_PATH", os.path.expanduser("~/.mindrecipe/mindrecipe.db")),
        )
        if not self.uses_postgres:
            os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        self._initialize_database()

    def _sqlite_connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _initialize_database(self) -> None:
        if self.uses_postgres:
            import psycopg
            with psycopg.connect(self.database_url) as connection:
                connection.execute(
                    "CREATE TABLE IF NOT EXISTS accounts ("
                    "id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, "
                    "display_name TEXT NOT NULL, password_hash TEXT NOT NULL)"
                )
                rows = connection.execute(
                    "SELECT id, email, display_name, password_hash FROM accounts"
                ).fetchall()
        else:
            with self._sqlite_connect() as connection:
                connection.execute(
                    "CREATE TABLE IF NOT EXISTS accounts ("
                    "id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, "
                    "display_name TEXT NOT NULL, password_hash TEXT NOT NULL)"
                )
                rows = connection.execute(
                    "SELECT id, email, display_name, password_hash FROM accounts"
                ).fetchall()
        for row in rows:
            account = UserAccount(*row)
            self.users_by_email[account.email] = account
            self.users_by_id[account.id] = account

    def clear(self) -> None:
        self.users_by_email.clear()
        self.users_by_id.clear()
        if self.uses_postgres:
            import psycopg
            with psycopg.connect(self.database_url) as connection:
                connection.execute("DELETE FROM accounts")
        else:
            with self._sqlite_connect() as connection:
                connection.execute("DELETE FROM accounts")

    def register(self, email: str, display_name: str, password: str) -> UserAccount:
        normalized = email.strip().lower()
        if normalized in self.users_by_email:
            raise HTTPException(status_code=409, detail="an account already exists for this email")
        account = UserAccount(
            id=f"member-{uuid4()}",
            email=normalized,
            display_name=display_name.strip(),
            password_hash=_hash_password(password),
        )
        self.users_by_email[normalized] = account
        self.users_by_id[account.id] = account
        values = (account.id, account.email, account.display_name, account.password_hash)
        if self.uses_postgres:
            import psycopg
            with psycopg.connect(self.database_url) as connection:
                connection.execute(
                    "INSERT INTO accounts (id, email, display_name, password_hash) VALUES (%s, %s, %s, %s)",
                    values,
                )
        else:
            with self._sqlite_connect() as connection:
                connection.execute(
                    "INSERT INTO accounts (id, email, display_name, password_hash) VALUES (?, ?, ?, ?)",
                    values,
                )
        return account

    def authenticate(self, email: str, password: str) -> UserAccount:
        account = self.users_by_email.get(email.strip().lower())
        if not account or not _verify_password(password, account.password_hash):
            raise HTTPException(status_code=401, detail="email or password is incorrect")
        return account

    def email_exists(self, email: str) -> bool:
        return email.strip().lower() in self.users_by_email

    def reset_password(self, email: str, token: str, new_password: str) -> UserAccount:
        normalized = email.strip().lower()
        account = self.users_by_email.get(normalized)
        expected = self._consume_reset_token(normalized, token)
        if account is None or expected is None or not hmac.compare_digest(token, expected):
            raise HTTPException(status_code=400, detail="reset link is invalid or expired")
        updated = UserAccount(
            id=account.id,
            email=account.email,
            display_name=account.display_name,
            password_hash=_hash_password(new_password),
        )
        self.users_by_email[normalized] = updated
        self.users_by_id[updated.id] = updated
        values = (updated.password_hash, updated.id)
        if self.uses_postgres:
            import psycopg
            with psycopg.connect(self.database_url) as connection:
                connection.execute(
                    "UPDATE accounts SET password_hash = %s WHERE id = %s", values
                )
        else:
            with self._sqlite_connect() as connection:
                connection.execute(
                    "UPDATE accounts SET password_hash = ? WHERE id = ?", values
                )
        return updated

    _reset_tokens: Dict[str, str] = {}

    def create_reset_token(self, email: str) -> Optional[str]:
        """Return a reset token only when the account exists (never 404-lean)."""
        normalized = email.strip().lower()
        if normalized not in self.users_by_email:
            return None
        token = secrets.token_urlsafe(24)
        self._reset_tokens[normalized] = token
        return token

    def _consume_reset_token(self, email: str, token: str) -> Optional[str]:
        return self._reset_tokens.get(email)

    def clear_reset_token(self, email: str) -> None:
        self._reset_tokens.pop(email.strip().lower(), None)


def _hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"{_encode(salt)}.{_encode(digest)}"


def _verify_password(password: str, encoded: str) -> bool:
    try:
        salt_encoded, expected_encoded = encoded.split(".", 1)
        salt = _decode(salt_encoded)
        expected = _decode(expected_encoded)
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def _encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode().rstrip("=")


def _decode(raw: str) -> bytes:
    return base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4))


def _secret() -> bytes:
    configured = os.getenv("MIND_RECIPE_AUTH_SECRET", "")
    if configured:
        if len(configured) < 32:
            raise RuntimeError("MIND_RECIPE_AUTH_SECRET must be at least 32 characters")
        return configured.encode()
    if not settings.development:
        raise RuntimeError("production requires MIND_RECIPE_AUTH_SECRET")
    return _development_secret


_development_secret = secrets.token_bytes(32)


def issue_token(account: UserAccount) -> str:
    payload = _encode(json.dumps({
        "sub": account.id,
        "role": "member",
        "exp": int(time.time()) + 12 * 60 * 60,
    }, separators=(",", ":")).encode())
    signature = _encode(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
    return f"{payload}.{signature}"


def verify_token(token: str) -> str:
    try:
        payload, signature = token.split(".", 1)
        expected = _encode(hmac.new(_secret(), payload.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            raise ValueError
        body = json.loads(_decode(payload))
        if body.get("role") != "member" or int(body.get("exp", 0)) <= int(time.time()):
            raise ValueError
        return str(body["sub"])
    except (ValueError, KeyError, TypeError, json.JSONDecodeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid or expired session")


auth_store = AccountStore()
