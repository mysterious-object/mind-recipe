from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import tempfile
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


class DevelopmentAuthStore:
    """In-memory account store for local development and emulator testing only."""

    def __init__(self) -> None:
        self.users_by_email: Dict[str, UserAccount] = {}
        self.users_by_id: Dict[str, UserAccount] = {}
        self.db_path = os.getenv(
            "MIND_NAV_DEV_AUTH_DB",
            os.path.join(tempfile.gettempdir(), "mind-nav-development-auth.sqlite3"),
        )
        self._initialize_database()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _initialize_database(self) -> None:
        with self._connect() as connection:
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
        with self._connect() as connection:
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
        with self._connect() as connection:
            connection.execute(
                "INSERT INTO accounts (id, email, display_name, password_hash) VALUES (?, ?, ?, ?)",
                (account.id, account.email, account.display_name, account.password_hash),
            )
        return account

    def authenticate(self, email: str, password: str) -> UserAccount:
        account = self.users_by_email.get(email.strip().lower())
        if not account or not _verify_password(password, account.password_hash):
            raise HTTPException(status_code=401, detail="email or password is incorrect")
        return account


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
    configured = os.getenv("MIND_NAV_AUTH_SECRET", "")
    if configured:
        if len(configured) < 32:
            raise RuntimeError("MIND_NAV_AUTH_SECRET must be at least 32 characters")
        return configured.encode()
    if not settings.development:
        raise RuntimeError("production requires MIND_NAV_AUTH_SECRET")
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


auth_store = DevelopmentAuthStore()
