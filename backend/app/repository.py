"""Environment-selecting persistence boundary."""
from __future__ import annotations

from .config import settings
from .postgres_store import PostgresStore
from .sqlite_store import SqliteStore


def create_store():
    if settings.database_url.startswith("postgresql"):
        return PostgresStore(settings.database_url)
    if not settings.development:
        raise RuntimeError(
            "production requires PostgreSQL; local SQLite is development-only"
        )
    return SqliteStore()


store = create_store()
