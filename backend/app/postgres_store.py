"""PostgreSQL persistence for production MindRecipe deployments.

The application store intentionally keeps JSON-shaped fields as text for
wire compatibility with the existing SQLite development database.  Business
logic remains in :class:`SqliteStore`; this class replaces only the connection
and schema layers so production does not silently write to a pod-local file.
"""
from __future__ import annotations

import re
from typing import Any, Iterable, Optional

from .sqlite_store import SqliteStore


POSTGRES_SCHEMA = """
CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, client_id TEXT,
    emotions TEXT DEFAULT '[]', activation INTEGER DEFAULT 0,
    body_areas TEXT DEFAULT '[]', journal TEXT, zone_label TEXT,
    observations TEXT DEFAULT '[]', created_at TEXT NOT NULL,
    policy_version TEXT DEFAULT '', safety_interrupted INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_checkins_member ON checkins(member_id, created_at);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_checkins_member_client
    ON checkins(member_id, client_id) WHERE client_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL,
    recipient_practitioner_id TEXT NOT NULL, categories TEXT NOT NULL,
    purpose TEXT, starts_at TEXT NOT NULL, expires_at TEXT NOT NULL,
    revoked_at TEXT, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_consents_member ON consents(member_id);
CREATE INDEX IF NOT EXISTS idx_consents_practitioner ON consents(recipient_practitioner_id);

CREATE TABLE IF NOT EXISTS audit_events (
    id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, action TEXT NOT NULL,
    resource_type TEXT NOT NULL, resource_id TEXT NOT NULL,
    occurred_at TEXT NOT NULL, metadata TEXT DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_id, occurred_at);

CREATE TABLE IF NOT EXISTS trend_cache (
    member_id TEXT PRIMARY KEY, avg_activation DOUBLE PRECISION DEFAULT 0,
    top_emotions TEXT DEFAULT '[]', streak_days INTEGER DEFAULT 0,
    last_checkin_at TEXT, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS pattern_alerts (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, pattern_type TEXT NOT NULL,
    description TEXT NOT NULL, confidence DOUBLE PRECISION DEFAULT 0.5,
    detected_at TEXT NOT NULL, dismissed INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_patterns_member ON pattern_alerts(member_id, dismissed);

CREATE TABLE IF NOT EXISTS conversation_memory (
    id BIGSERIAL PRIMARY KEY, member_id TEXT NOT NULL, role TEXT NOT NULL,
    content TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_conv_member ON conversation_memory(member_id, created_at);

CREATE TABLE IF NOT EXISTS recipe_practice_items (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, name TEXT NOT NULL,
    category TEXT NOT NULL, description TEXT,
    accessibility_needs TEXT DEFAULT '[]',
    recommended_by_practitioner INTEGER DEFAULT 0, practitioner_id TEXT,
    source TEXT NOT NULL, discovered_at TEXT NOT NULL,
    is_favorite INTEGER DEFAULT 0, practice_count INTEGER DEFAULT 0,
    last_practiced_at TEXT, effectiveness_ratings TEXT DEFAULT '[]',
    contexts TEXT DEFAULT '[]'
);
CREATE INDEX IF NOT EXISTS idx_recipe_practice_member
    ON recipe_practice_items(member_id, discovered_at);

CREATE TABLE IF NOT EXISTS practice_outcomes (
    id TEXT PRIMARY KEY, client_id TEXT, member_id TEXT NOT NULL,
    practice_item_id TEXT NOT NULL, effectiveness INTEGER NOT NULL,
    context TEXT, notes TEXT, before_activation INTEGER,
    after_activation INTEGER, duration_minutes INTEGER,
    outcome_confidence INTEGER, occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_practice_outcomes_member
    ON practice_outcomes(member_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_practice_outcomes_item
    ON practice_outcomes(member_id, practice_item_id, occurred_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_practice_outcomes_member_client
    ON practice_outcomes(member_id, client_id) WHERE client_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS practice_recommendation_feedback (
    member_id TEXT NOT NULL, recommendation_id TEXT NOT NULL,
    decision TEXT NOT NULL, decided_at TEXT NOT NULL,
    PRIMARY KEY (member_id, recommendation_id)
);

CREATE TABLE IF NOT EXISTS curriculum_progress (
    member_id TEXT PRIMARY KEY, curriculum_version TEXT NOT NULL,
    completed_lesson_ids TEXT NOT NULL DEFAULT '[]',
    completed_practice_ids TEXT NOT NULL DEFAULT '[]',
    current_lesson_id TEXT, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS journey_settings (
    member_id TEXT PRIMARY KEY, mode TEXT NOT NULL DEFAULT 'guided_foundations',
    active_goal TEXT, preferred_duration_minutes INTEGER,
    current_module_id TEXT NOT NULL DEFAULT 'lesson-1',
    recommended_module_id TEXT, recommendation_reason TEXT NOT NULL,
    recommendation_inputs TEXT NOT NULL DEFAULT '[]',
    alternatives TEXT NOT NULL DEFAULT '[]', last_recalculated_at TEXT,
    updated_at TEXT NOT NULL
);
ALTER TABLE journey_settings ADD COLUMN IF NOT EXISTS recommendation_inputs TEXT NOT NULL DEFAULT '[]';
ALTER TABLE journey_settings ADD COLUMN IF NOT EXISTS alternatives TEXT NOT NULL DEFAULT '[]';
ALTER TABLE journey_settings ADD COLUMN IF NOT EXISTS last_recalculated_at TEXT;
CREATE TABLE IF NOT EXISTS recipe_proposals (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, status TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1, name TEXT NOT NULL,
    purpose TEXT NOT NULL, trigger_text TEXT, duration_minutes INTEGER NOT NULL,
    steps TEXT NOT NULL, evidence_basis TEXT NOT NULL,
    cautions TEXT NOT NULL DEFAULT '[]', rationale TEXT NOT NULL,
    source_kind TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_recipe_proposals_member
    ON recipe_proposals(member_id, status, updated_at);

CREATE TABLE IF NOT EXISTS memory_cards (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, kind TEXT NOT NULL,
    content TEXT NOT NULL, pinned INTEGER NOT NULL DEFAULT 0,
    source TEXT NOT NULL DEFAULT 'member', expires_at TEXT,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_cards_member
    ON memory_cards(member_id, pinned, updated_at);
CREATE TABLE IF NOT EXISTS memory_proposals (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, kind TEXT NOT NULL,
    content TEXT NOT NULL, reason TEXT NOT NULL, expires_at TEXT,
    source TEXT NOT NULL DEFAULT 'assistant',
    status TEXT NOT NULL DEFAULT 'proposed',
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_memory_proposals_member
    ON memory_proposals(member_id, status, updated_at);

CREATE TABLE IF NOT EXISTS notification_preferences (
    member_id TEXT PRIMARY KEY, enabled INTEGER NOT NULL DEFAULT 1,
    quiet_hours_start TEXT, quiet_hours_end TEXT,
    check_in_reminder INTEGER NOT NULL DEFAULT 1,
    lesson_reminder INTEGER NOT NULL DEFAULT 1,
    booking_reminder INTEGER NOT NULL DEFAULT 1,
    snooze_minutes INTEGER NOT NULL DEFAULT 0,
    morning_time TEXT NOT NULL DEFAULT '09:00',
    midday_time TEXT NOT NULL DEFAULT '13:00',
    evening_time TEXT NOT NULL DEFAULT '19:00',
    active_weekdays TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
    message_style TEXT NOT NULL DEFAULT 'discreet',
    snooze_until TEXT, pause_until TEXT, updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS member_events (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, kind TEXT NOT NULL,
    occurred_at TEXT NOT NULL, source TEXT NOT NULL, provenance TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}', consent_scope TEXT NOT NULL,
    schema_version TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_member_events_member
    ON member_events(member_id, occurred_at);

CREATE TABLE IF NOT EXISTS commitments (
    id TEXT PRIMARY KEY, client_id TEXT, member_id TEXT NOT NULL,
    title TEXT NOT NULL, action_type TEXT NOT NULL, practice_item_id TEXT,
    scheduled_for TEXT, notes TEXT, source TEXT NOT NULL, status TEXT NOT NULL,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL, completed_at TEXT,
    execution_status TEXT NOT NULL DEFAULT 'not_requested', execution_receipt TEXT
);
CREATE INDEX IF NOT EXISTS idx_commitments_member
    ON commitments(member_id, status, scheduled_for);
CREATE UNIQUE INDEX IF NOT EXISTS idx_commitments_member_client
    ON commitments(member_id, client_id) WHERE client_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS safety_events (
    id TEXT PRIMARY KEY, member_id TEXT NOT NULL, event_type TEXT NOT NULL,
    policy_version TEXT NOT NULL, action_taken TEXT NOT NULL,
    occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_safety_events_member
    ON safety_events(member_id, occurred_at);
"""


def translate_sql(sql: str) -> str:
    """Translate the small SQLite SQL dialect used by shared store methods."""
    translated = sql
    ignore = bool(re.search(r"\bINSERT\s+OR\s+IGNORE\s+INTO\b", translated, re.I))
    translated = re.sub(
        r"\bINSERT\s+OR\s+IGNORE\s+INTO\b", "INSERT INTO", translated,
        flags=re.I,
    )
    if re.search(r"\bINSERT\s+OR\s+REPLACE\s+INTO\s+trend_cache\b", translated, re.I):
        translated = re.sub(
            r"\bINSERT\s+OR\s+REPLACE\s+INTO\b", "INSERT INTO", translated,
            flags=re.I,
        ).rstrip().rstrip(";")
        translated += (
            " ON CONFLICT (member_id) DO UPDATE SET "
            "avg_activation=EXCLUDED.avg_activation, "
            "streak_days=EXCLUDED.streak_days, "
            "last_checkin_at=EXCLUDED.last_checkin_at, "
            "updated_at=EXCLUDED.updated_at"
        )
    elif ignore:
        translated = translated.rstrip().rstrip(";") + " ON CONFLICT DO NOTHING"
    translated = translated.replace(
        "date('now','-30 days')",
        "to_char(CURRENT_TIMESTAMP - INTERVAL '30 days', 'YYYY-MM-DD')",
    )
    translated = translated.replace(
        "datetime('now', '-1 day')",
        "to_char(CURRENT_TIMESTAMP - INTERVAL '1 day', 'YYYY-MM-DD\"T\"HH24:MI:SS')",
    )
    translated = translated.replace(
        "date(created_at) as d",
        "to_char(CAST(created_at AS timestamptz), 'YYYY-MM-DD') as d",
    )
    translated = translated.replace(
        "GROUP_CONCAT(DISTINCT o.context)",
        "STRING_AGG(DISTINCT o.context, ',')",
    )
    return translated.replace("?", "%s")


class _PostgresConnection:
    def __init__(self, database_url: str):
        import psycopg
        from psycopg.rows import dict_row

        self._connection = psycopg.connect(database_url, row_factory=dict_row)
        self.total_changes = 0

    def __enter__(self) -> "_PostgresConnection":
        self._connection.__enter__()
        return self

    def __exit__(self, exc_type: Any, exc: Any, traceback: Any) -> Optional[bool]:
        return self._connection.__exit__(exc_type, exc, traceback)

    def execute(self, sql: str, parameters: Optional[Iterable[Any]] = None):
        cursor = self._connection.execute(
            translate_sql(sql), tuple(parameters or ()),
        )
        if cursor.rowcount > 0:
            self.total_changes += cursor.rowcount
        return cursor


class PostgresStore(SqliteStore):
    """Production repository with the same behavior as the local store."""

    def __init__(self, database_url: str):
        if not database_url.startswith("postgresql"):
            raise ValueError("PostgreSQL database URL required")
        self.database_url = database_url
        self._init_db()

    def _connect(self) -> _PostgresConnection:
        return _PostgresConnection(self.database_url)

    def _init_db(self) -> None:
        statements = [part.strip() for part in POSTGRES_SCHEMA.split(";") if part.strip()]
        with self._connect() as connection:
            for statement in statements:
                connection.execute(statement)
