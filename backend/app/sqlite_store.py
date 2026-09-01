"""SQLite persistent store — replaces in-memory DevelopmentStore.

Supports: trend queries, practitioner sharing with consent gates,
audit trail, and proactive pattern detection.
"""
from __future__ import annotations
import json
import sqlite3
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from uuid import uuid4

from .models import AuditEvent, CheckInRecord, ConsentGrant, DataCategory, RecipePracticeItem

DB_PATH = Path(os.getenv("MIND_RECIPE_DB_PATH", Path.home() / ".mindrecipe" / "mindrecipe.db"))
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


class SqliteStore:
    def __init__(self):
        self.db_path = str(DB_PATH)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        return conn

    def _init_db(self):
        with self._connect() as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS checkins (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    client_id TEXT,
                    emotions TEXT DEFAULT '[]',
                    activation INTEGER DEFAULT 0,
                    body_areas TEXT DEFAULT '[]',
                    journal TEXT,
                    zone_label TEXT,
                    observations TEXT DEFAULT '[]',
                    created_at TEXT NOT NULL,
                    policy_version TEXT DEFAULT '',
                    safety_interrupted INTEGER DEFAULT 0
                );
                CREATE INDEX IF NOT EXISTS idx_checkins_member ON checkins(member_id, created_at);
                CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(created_at);

                CREATE TABLE IF NOT EXISTS consents (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    recipient_practitioner_id TEXT NOT NULL,
                    categories TEXT NOT NULL,
                    purpose TEXT,
                    starts_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    revoked_at TEXT,
                    created_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_consents_member ON consents(member_id);
                CREATE INDEX IF NOT EXISTS idx_consents_practitioner ON consents(recipient_practitioner_id);

                CREATE TABLE IF NOT EXISTS audit_events (
                    id TEXT PRIMARY KEY,
                    actor_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    resource_type TEXT NOT NULL,
                    resource_id TEXT NOT NULL,
                    occurred_at TEXT NOT NULL,
                    metadata TEXT DEFAULT '{}'
                );
                CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_id, occurred_at);

                CREATE TABLE IF NOT EXISTS trend_cache (
                    member_id TEXT PRIMARY KEY,
                    avg_activation REAL DEFAULT 0,
                    top_emotions TEXT DEFAULT '[]',
                    streak_days INTEGER DEFAULT 0,
                    last_checkin_at TEXT,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS pattern_alerts (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    pattern_type TEXT NOT NULL,
                    description TEXT NOT NULL,
                    confidence REAL DEFAULT 0.5,
                    detected_at TEXT NOT NULL,
                    dismissed INTEGER DEFAULT 0
                );
                CREATE INDEX IF NOT EXISTS idx_patterns_member ON pattern_alerts(member_id, dismissed);

                CREATE TABLE IF NOT EXISTS conversation_memory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    member_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_conv_member ON conversation_memory(member_id, created_at);

                CREATE TABLE IF NOT EXISTS recipe_practice_items (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    description TEXT,
                    accessibility_needs TEXT DEFAULT '[]',
                    recommended_by_practitioner INTEGER DEFAULT 0,
                    practitioner_id TEXT,
                    source TEXT NOT NULL,
                    discovered_at TEXT NOT NULL,
                    is_favorite INTEGER DEFAULT 0,
                    practice_count INTEGER DEFAULT 0,
                    last_practiced_at TEXT,
                    effectiveness_ratings TEXT DEFAULT '[]',
                    contexts TEXT DEFAULT '[]'
                );
                CREATE INDEX IF NOT EXISTS idx_recipe_practice_member ON recipe_practice_items(member_id, discovered_at);
                CREATE TABLE IF NOT EXISTS practice_outcomes (
                    id TEXT PRIMARY KEY,
                    client_id TEXT,
                    member_id TEXT NOT NULL,
                    practice_item_id TEXT NOT NULL,
                    effectiveness INTEGER NOT NULL,
                    context TEXT,
                    notes TEXT,
                    before_activation INTEGER,
                    after_activation INTEGER,
                    duration_minutes INTEGER,
                    outcome_confidence INTEGER,
                    occurred_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_practice_outcomes_member ON practice_outcomes(member_id, occurred_at);
                CREATE INDEX IF NOT EXISTS idx_practice_outcomes_item ON practice_outcomes(member_id, practice_item_id, occurred_at);
                CREATE TABLE IF NOT EXISTS practice_recommendation_feedback (
                    member_id TEXT NOT NULL,
                    recommendation_id TEXT NOT NULL,
                    decision TEXT NOT NULL,
                    decided_at TEXT NOT NULL,
                    PRIMARY KEY (member_id, recommendation_id)
                );

                CREATE TABLE IF NOT EXISTS curriculum_progress (
                    member_id TEXT PRIMARY KEY,
                    curriculum_version TEXT NOT NULL,
                    completed_lesson_ids TEXT NOT NULL DEFAULT '[]',
                    completed_practice_ids TEXT NOT NULL DEFAULT '[]',
                    current_lesson_id TEXT,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS journey_settings (
                    member_id TEXT PRIMARY KEY,
                    mode TEXT NOT NULL DEFAULT 'guided_foundations',
                    active_goal TEXT,
                    preferred_duration_minutes INTEGER,
                    current_module_id TEXT NOT NULL DEFAULT 'lesson-1',
                    recommended_module_id TEXT,
                    recommendation_reason TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS recipe_proposals (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    status TEXT NOT NULL,
                    version INTEGER NOT NULL DEFAULT 1,
                    name TEXT NOT NULL,
                    purpose TEXT NOT NULL,
                    trigger_text TEXT,
                    duration_minutes INTEGER NOT NULL,
                    steps TEXT NOT NULL,
                    evidence_basis TEXT NOT NULL,
                    cautions TEXT NOT NULL DEFAULT '[]',
                    rationale TEXT NOT NULL,
                    source_kind TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_recipe_proposals_member ON recipe_proposals(member_id, status, updated_at);
                CREATE TABLE IF NOT EXISTS memory_cards (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    content TEXT NOT NULL,
                    pinned INTEGER NOT NULL DEFAULT 0,
                    source TEXT NOT NULL DEFAULT 'member',
                    expires_at TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_memory_cards_member ON memory_cards(member_id, pinned, updated_at);
                CREATE TABLE IF NOT EXISTS memory_proposals (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    content TEXT NOT NULL,
                    reason TEXT NOT NULL,
                    expires_at TEXT,
                    source TEXT NOT NULL DEFAULT 'assistant',
                    status TEXT NOT NULL DEFAULT 'proposed',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_memory_proposals_member ON memory_proposals(member_id, status, updated_at);
                CREATE TABLE IF NOT EXISTS notification_preferences (
                    member_id TEXT PRIMARY KEY,
                    enabled INTEGER NOT NULL DEFAULT 1,
                    quiet_hours_start TEXT,
                    quiet_hours_end TEXT,
                    check_in_reminder INTEGER NOT NULL DEFAULT 1,
                    lesson_reminder INTEGER NOT NULL DEFAULT 1,
                    booking_reminder INTEGER NOT NULL DEFAULT 1,
                    snooze_minutes INTEGER NOT NULL DEFAULT 0,
                    morning_time TEXT NOT NULL DEFAULT '09:00',
                    midday_time TEXT NOT NULL DEFAULT '13:00',
                    evening_time TEXT NOT NULL DEFAULT '19:00',
                    active_weekdays TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
                    message_style TEXT NOT NULL DEFAULT 'discreet',
                    snooze_until TEXT,
                    pause_until TEXT,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS member_events (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    occurred_at TEXT NOT NULL,
                    source TEXT NOT NULL,
                    provenance TEXT NOT NULL,
                    payload TEXT NOT NULL DEFAULT '{}',
                    consent_scope TEXT NOT NULL,
                    schema_version TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_member_events_member ON member_events(member_id, occurred_at);
                CREATE TABLE IF NOT EXISTS commitments (
                    id TEXT PRIMARY KEY,
                    client_id TEXT,
                    member_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    action_type TEXT NOT NULL,
                    practice_item_id TEXT,
                    scheduled_for TEXT,
                    notes TEXT,
                    source TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    completed_at TEXT,
                    execution_status TEXT NOT NULL DEFAULT 'not_requested',
                    execution_receipt TEXT
                );
                CREATE INDEX IF NOT EXISTS idx_commitments_member ON commitments(member_id, status, scheduled_for);
                CREATE TABLE IF NOT EXISTS safety_events (
                    id TEXT PRIMARY KEY,
                    member_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    policy_version TEXT NOT NULL,
                    action_taken TEXT NOT NULL,
                    occurred_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_safety_events_member ON safety_events(member_id, occurred_at);
            """)
            # Existing staging databases predate idempotent mobile sync.
            # SQLite has no ADD COLUMN IF NOT EXISTS, so make the migration
            # explicit and safe to rerun.
            checkin_columns = {
                row["name"]
                for row in conn.execute("PRAGMA table_info(checkins)").fetchall()
            }
            if "client_id" not in checkin_columns:
                conn.execute("ALTER TABLE checkins ADD COLUMN client_id TEXT")
            conn.execute(
                "CREATE UNIQUE INDEX IF NOT EXISTS idx_checkins_member_client "
                "ON checkins(member_id, client_id) WHERE client_id IS NOT NULL"
            )
            conn.execute(
                "CREATE UNIQUE INDEX IF NOT EXISTS idx_practice_outcomes_member_client "
                "ON practice_outcomes(member_id, client_id) WHERE client_id IS NOT NULL"
            )
            conn.execute(
                "CREATE UNIQUE INDEX IF NOT EXISTS idx_commitments_member_client "
                "ON commitments(member_id, client_id) WHERE client_id IS NOT NULL"
            )
            commitment_columns = {
                row["name"] for row in conn.execute("PRAGMA table_info(commitments)").fetchall()
            }
            if "execution_status" not in commitment_columns:
                conn.execute("ALTER TABLE commitments ADD COLUMN execution_status TEXT NOT NULL DEFAULT 'not_requested'")
            if "execution_receipt" not in commitment_columns:
                conn.execute("ALTER TABLE commitments ADD COLUMN execution_receipt TEXT")
            memory_columns = {
                row["name"] for row in conn.execute("PRAGMA table_info(memory_cards)").fetchall()
            }
            if "source" not in memory_columns:
                conn.execute("ALTER TABLE memory_cards ADD COLUMN source TEXT NOT NULL DEFAULT 'member'")
            if "expires_at" not in memory_columns:
                conn.execute("ALTER TABLE memory_cards ADD COLUMN expires_at TEXT")
            notification_columns = {
                row["name"] for row in conn.execute("PRAGMA table_info(notification_preferences)").fetchall()
            }
            for column, definition in (
                ("morning_time", "TEXT NOT NULL DEFAULT '09:00'"),
                ("midday_time", "TEXT NOT NULL DEFAULT '13:00'"),
                ("evening_time", "TEXT NOT NULL DEFAULT '19:00'"),
                ("active_weekdays", "TEXT NOT NULL DEFAULT '[1,2,3,4,5]'"),
                ("message_style", "TEXT NOT NULL DEFAULT 'discreet'"),
                ("snooze_until", "TEXT"),
                ("pause_until", "TEXT"),
            ):
                if column not in notification_columns:
                    conn.execute(f"ALTER TABLE notification_preferences ADD COLUMN {column} {definition}")
            # One-time preservation migration from the retired practice table.
            legacy_table = "tool" + "box_items"
            exists = conn.execute(
                "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",
                (legacy_table,),
            ).fetchone()
            if exists:
                conn.execute(
                    f"INSERT OR IGNORE INTO recipe_practice_items SELECT * FROM {legacy_table}"
                )

    # ── Adaptive Journey ───────────────────────────────────────────

    def get_journey_settings(self, member_id: str) -> Dict[str, Any]:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM journey_settings WHERE member_id=?", (member_id,)).fetchone()
        if row:
            return dict(row)
        return {
            "member_id": member_id, "mode": "guided_foundations", "active_goal": None,
            "preferred_duration_minutes": None, "current_module_id": "lesson-1",
            "recommended_module_id": "lesson-1",
            "recommendation_reason": "Start with the foundations at your own pace.",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    def save_journey_settings(self, member_id: str, values: Dict[str, Any]) -> Dict[str, Any]:
        existing = self.get_journey_settings(member_id)
        result = {**existing, **values, "member_id": member_id, "updated_at": datetime.now(timezone.utc).isoformat()}
        recommendation = self._journey_recommendation(member_id, result.get("active_goal"))
        result.update(recommendation)
        with self._connect() as conn:
            conn.execute("""INSERT INTO journey_settings
                (member_id,mode,active_goal,preferred_duration_minutes,current_module_id,recommended_module_id,recommendation_reason,updated_at)
                VALUES (?,?,?,?,?,?,?,?)
                ON CONFLICT(member_id) DO UPDATE SET mode=excluded.mode,active_goal=excluded.active_goal,
                preferred_duration_minutes=excluded.preferred_duration_minutes,current_module_id=excluded.current_module_id,
                recommended_module_id=excluded.recommended_module_id,recommendation_reason=excluded.recommendation_reason,updated_at=excluded.updated_at""",
                (result["member_id"], result["mode"], result.get("active_goal"), result.get("preferred_duration_minutes"),
                 result["current_module_id"], result.get("recommended_module_id"), result["recommendation_reason"], result["updated_at"]))
        return result

    def recompute_journey_recommendation(self, member_id: str) -> Dict[str, Any]:
        current = self.get_journey_settings(member_id)
        recommendation = self._journey_recommendation(member_id, current.get("active_goal"))
        if (
            current.get("recommended_module_id") == recommendation["recommended_module_id"]
            and current.get("recommendation_reason") == recommendation["recommendation_reason"]
        ):
            return current
        return self.save_journey_settings(member_id, recommendation)

    def _journey_recommendation(self, member_id: str, active_goal: Optional[str]) -> Dict[str, str]:
        completed = set((self.get_curriculum_progress(member_id) or {}).get("completed_lesson_ids", []))
        ordered = [f"lesson-{number}" for number in range(1, 16)]
        default = next((lesson for lesson in ordered if lesson not in completed), "lesson-15")
        goal = (active_goal or "").lower()
        goal_matches = (
            (("sleep", "rest", "recovery"), "lesson-4", "You named rest or recovery as a goal, so a baseline-focused lesson is an optional next step."),
            (("stress", "overwhelm", "tense", "anxious"), "lesson-6", "You named feeling under pressure, so a grounding lesson is an optional next step."),
            (("relationship", "boundary", "communication"), "lesson-14", "You named a relationship or boundary goal, so that lesson is an optional next step."),
            (("value", "direction", "confidence"), "lesson-11", "You named a direction-setting goal, so a values lesson is an optional next step."),
            (("goal", "plan", "habit"), "lesson-15", "You named a planning goal, so a practical goal-setting lesson is an optional next step."),
        )
        for terms, lesson, reason in goal_matches:
            if any(term in goal for term in terms) and lesson not in completed:
                return {"recommended_module_id": lesson, "recommendation_reason": reason}
        if default == "lesson-1":
            reason = "Start with the foundations at your own pace."
        elif default == "lesson-6":
            reason = "You have completed the foundations; a grounding lesson is an optional next step."
        elif default == "lesson-11":
            reason = "You have explored awareness and patterns; a direction-setting lesson is an optional next step."
        elif default == "lesson-15" and len(completed) >= 15:
            reason = "You have completed the core journey. You can revisit any lesson or create a member-approved next step."
        else:
            reason = "This is the next open lesson in your chosen journey."
        return {"recommended_module_id": default, "recommendation_reason": reason}

    def create_recipe_proposal(self, member_id: str, values: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        result = {**values, "id": str(uuid4()), "member_id": member_id, "status": "proposed", "version": 1, "created_at": now, "updated_at": now}
        with self._connect() as conn:
            conn.execute("""INSERT INTO recipe_proposals
            (id,member_id,status,version,name,purpose,trigger_text,duration_minutes,steps,evidence_basis,cautions,rationale,source_kind,created_at,updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (result["id"], member_id, result["status"], 1, result["name"], result["purpose"], result.get("trigger"),
             result["duration_minutes"], json.dumps(result["steps"]), result["evidence_basis"], json.dumps(result.get("cautions", [])),
             result["rationale"], result["source_kind"], now, now))
        return result

    def get_recipe_proposals(self, member_id: str) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute("SELECT * FROM recipe_proposals WHERE member_id=? ORDER BY updated_at DESC", (member_id,)).fetchall()
        return [self._decode_recipe_proposal(row) for row in rows]

    def decide_recipe_proposal(self, member_id: str, proposal_id: str, approved: bool, edits: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM recipe_proposals WHERE id=? AND member_id=?", (proposal_id, member_id)).fetchone()
            if not row or row["status"] != "proposed":
                return None
            result = self._decode_recipe_proposal(row)
            if edits:
                result.update(edits)
            result["status"] = "approved" if approved else "archived"
            result["updated_at"] = datetime.now(timezone.utc).isoformat()
            conn.execute("""UPDATE recipe_proposals SET status=?,version=?,name=?,purpose=?,trigger_text=?,duration_minutes=?,steps=?,evidence_basis=?,cautions=?,rationale=?,source_kind=?,updated_at=? WHERE id=?""",
                (result["status"], int(row["version"]) + (1 if edits else 0), result["name"], result["purpose"], result.get("trigger"), result["duration_minutes"], json.dumps(result["steps"]), result["evidence_basis"], json.dumps(result.get("cautions", [])), result["rationale"], result["source_kind"], result["updated_at"], proposal_id))
        return self.get_recipe_proposal(member_id, proposal_id)

    def get_recipe_proposal(self, member_id: str, proposal_id: str) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM recipe_proposals WHERE id=? AND member_id=?", (proposal_id, member_id)).fetchone()
        return self._decode_recipe_proposal(row) if row else None

    @staticmethod
    def _decode_recipe_proposal(row: sqlite3.Row) -> Dict[str, Any]:
        value = dict(row)
        value["trigger"] = value.pop("trigger_text")
        value["steps"] = json.loads(value["steps"])
        value["cautions"] = json.loads(value["cautions"])
        return value

    def list_memory_cards(self, member_id: str) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT * FROM memory_cards WHERE member_id=?
                AND (expires_at IS NULL OR expires_at > ?)
                ORDER BY pinned DESC, updated_at DESC""",
                (member_id, now),
            ).fetchall()
        return [{**dict(row), "pinned": bool(row["pinned"])} for row in rows]

    def save_memory_card(self, member_id: str, values: Dict[str, Any], card_id: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        identifier = card_id or str(uuid4())
        with self._connect() as conn:
            if card_id:
                conn.execute("UPDATE memory_cards SET kind=?,content=?,pinned=?,expires_at=?,updated_at=? WHERE id=? AND member_id=?", (values["kind"], values["content"], int(values.get("pinned", False)), values.get("expires_at"), now, identifier, member_id))
            else:
                conn.execute("INSERT INTO memory_cards (id,member_id,kind,content,pinned,source,expires_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)", (identifier, member_id, values["kind"], values["content"], int(values.get("pinned", False)), values.get("source", "member"), values.get("expires_at"), now, now))
            row = conn.execute("SELECT * FROM memory_cards WHERE id=? AND member_id=?", (identifier, member_id)).fetchone()
        return {**dict(row), "pinned": bool(row["pinned"])} if row else None

    def delete_memory_card(self, member_id: str, card_id: str) -> bool:
        with self._connect() as conn:
            return conn.execute("DELETE FROM memory_cards WHERE id=? AND member_id=?", (card_id, member_id)).rowcount > 0

    def create_memory_proposal(self, member_id: str, values: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        identifier = str(uuid4())
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO memory_proposals
                (id,member_id,kind,content,reason,expires_at,source,status,created_at,updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?)""",
                (identifier, member_id, values["kind"], values["content"], values["reason"],
                 values.get("expires_at"), "assistant", "proposed", now, now),
            )
            row = conn.execute("SELECT * FROM memory_proposals WHERE id=?", (identifier,)).fetchone()
        return dict(row)

    def list_memory_proposals(self, member_id: str) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM memory_proposals WHERE member_id=? AND status='proposed' ORDER BY updated_at DESC",
                (member_id,),
            ).fetchall()
        return [dict(row) for row in rows]

    def decide_memory_proposal(self, member_id: str, proposal_id: str, approved: bool) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM memory_proposals WHERE id=? AND member_id=? AND status='proposed'",
                (proposal_id, member_id),
            ).fetchone()
            if not row:
                return None
            result = dict(row)
            status = "approved" if approved else "dismissed"
            conn.execute("UPDATE memory_proposals SET status=?,updated_at=? WHERE id=?", (status, now, proposal_id))
        if approved:
            self.save_memory_card(member_id, {
                "kind": result["kind"], "content": result["content"], "expires_at": result["expires_at"],
                "source": "assistant_proposal", "pinned": False,
            })
        result["status"] = status
        result["updated_at"] = now
        return result

    def add_member_events(self, member_id: str, events: List[Dict[str, Any]]) -> int:
        with self._connect() as conn:
            for event in events:
                conn.execute("INSERT OR IGNORE INTO member_events (id,member_id,kind,occurred_at,source,provenance,payload,consent_scope,schema_version) VALUES (?,?,?,?,?,?,?,?,?)", (event["id"], member_id, event["kind"], event["occurred_at"], event["source"], event["provenance"], json.dumps(event.get("payload", {})), event["consent_scope"], event["schema_version"]))
            return conn.total_changes

    def record_safety_event(self, member_id: str, event_type: str, policy_version: str, action_taken: str) -> None:
        """Record the policy action, never the triggering message itself."""
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO safety_events (id,member_id,event_type,policy_version,action_taken,occurred_at) VALUES (?,?,?,?,?,?)",
                (str(uuid4()), member_id, event_type, policy_version, action_taken,
                 datetime.now(timezone.utc).isoformat()),
            )

    def get_safety_events(self, member_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM safety_events WHERE member_id=? ORDER BY occurred_at DESC LIMIT ?",
                (member_id, limit),
            ).fetchall()
        return [dict(row) for row in rows]

    # ── Member data controls ───────────────────────────────────────

    def get_notification_preference(self, member_id: str) -> Dict[str, Any]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM notification_preferences WHERE member_id=?", (member_id,)
            ).fetchone()
        if row:
            value = dict(row)
            for field in ("enabled", "check_in_reminder", "lesson_reminder", "booking_reminder"):
                value[field] = bool(value[field])
            value["active_weekdays"] = json.loads(value.get("active_weekdays") or "[]")
            return value
        return {
            "member_id": member_id, "enabled": True, "quiet_hours_start": None,
            "quiet_hours_end": None, "check_in_reminder": True, "lesson_reminder": True,
            "booking_reminder": True, "snooze_minutes": 0,
            "morning_time": "09:00", "midday_time": "13:00", "evening_time": "19:00",
            "active_weekdays": [1, 2, 3, 4, 5], "message_style": "discreet",
            "snooze_until": None, "pause_until": None,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    def save_notification_preference(self, member_id: str, values: Dict[str, Any]) -> Dict[str, Any]:
        current = self.get_notification_preference(member_id)
        result = {**current, **values, "member_id": member_id, "updated_at": datetime.now(timezone.utc).isoformat()}
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO notification_preferences
                (member_id,enabled,quiet_hours_start,quiet_hours_end,check_in_reminder,lesson_reminder,booking_reminder,snooze_minutes,morning_time,midday_time,evening_time,active_weekdays,message_style,snooze_until,pause_until,updated_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(member_id) DO UPDATE SET enabled=excluded.enabled,
                quiet_hours_start=excluded.quiet_hours_start,quiet_hours_end=excluded.quiet_hours_end,
                check_in_reminder=excluded.check_in_reminder,lesson_reminder=excluded.lesson_reminder,
                booking_reminder=excluded.booking_reminder,snooze_minutes=excluded.snooze_minutes,
                morning_time=excluded.morning_time,midday_time=excluded.midday_time,evening_time=excluded.evening_time,
                active_weekdays=excluded.active_weekdays,message_style=excluded.message_style,
                snooze_until=excluded.snooze_until,pause_until=excluded.pause_until,updated_at=excluded.updated_at""",
                (member_id, int(result["enabled"]), result.get("quiet_hours_start"), result.get("quiet_hours_end"),
                 int(result["check_in_reminder"]), int(result["lesson_reminder"]), int(result["booking_reminder"]),
                 result["snooze_minutes"], result["morning_time"], result["midday_time"], result["evening_time"],
                 json.dumps(result["active_weekdays"]), result["message_style"], result.get("snooze_until"),
                 result.get("pause_until"), result["updated_at"]),
            )
        return result

    def export_member_data(self, member_id: str) -> Dict[str, Any]:
        tables = {
            "checkins": "checkins", "practice_items": "recipe_practice_items", "practice_outcomes": "practice_outcomes",
            "commitments": "commitments", "memory_cards": "memory_cards", "memory_proposals": "memory_proposals",
            "consents": "consents", "member_events": "member_events", "safety_events": "safety_events",
            "recommendation_feedback": "practice_recommendation_feedback", "audit_events": "audit_events",
        }
        exported: Dict[str, Any] = {"member_id": member_id, "exported_at": datetime.now(timezone.utc).isoformat()}
        with self._connect() as conn:
            for key, table in tables.items():
                actor_column = "actor_id" if table == "audit_events" else "member_id"
                rows = conn.execute(f"SELECT * FROM {table} WHERE {actor_column}=?", (member_id,)).fetchall()
                values = []
                for row in rows:
                    item = dict(row)
                    for field in ("emotions", "body_areas", "observations", "accessibility_needs", "effectiveness_ratings", "contexts", "payload", "categories", "metadata"):
                        if isinstance(item.get(field), str):
                            try:
                                item[field] = json.loads(item[field])
                            except json.JSONDecodeError:
                                pass
                    values.append(item)
                exported[key] = values
            exported["journey"] = self.get_journey_settings(member_id)
            exported["curriculum_progress"] = self.get_curriculum_progress(member_id)
            exported["notification_preferences"] = self.get_notification_preference(member_id)
        return exported

    def delete_member_data(self, member_id: str) -> None:
        tables = (
            "checkins", "consents", "audit_events", "trend_cache", "pattern_alerts", "conversation_memory",
            "recipe_practice_items", "practice_outcomes", "practice_recommendation_feedback", "commitments",
            "safety_events", "journey_settings", "curriculum_progress", "recipe_proposals", "memory_cards",
            "memory_proposals", "member_events", "notification_preferences",
        )
        with self._connect() as conn:
            for table in tables:
                column = "actor_id" if table == "audit_events" else "member_id"
                conn.execute(f"DELETE FROM {table} WHERE {column}=?", (member_id,))

    def pulse_summary(self, member_id: str) -> Dict[str, Any]:
        events = []
        with self._connect() as conn:
            rows = conn.execute("SELECT kind,payload,occurred_at,source FROM member_events WHERE member_id=? ORDER BY occurred_at DESC LIMIT 50", (member_id,)).fetchall()
        for row in rows:
            events.append({**dict(row), "payload": json.loads(row["payload"])})
        outcomes = self.get_practice_outcomes(member_id)
        ratings = [int(outcome["effectiveness"]) for outcome in outcomes]
        changes = [
            int(outcome["after_activation"]) - int(outcome["before_activation"])
            for outcome in outcomes
            if outcome.get("before_activation") is not None and outcome.get("after_activation") is not None
        ]
        return {
            "recent_events": events[:8],
            "recipe_effectiveness": round(sum(ratings) / len(ratings), 1) if ratings else None,
            "practice_count": len(outcomes),
            "average_activation_change": round(sum(changes) / len(changes), 2) if changes else None,
            "most_helpful_practices": self.get_practice_effectiveness(member_id)[:3],
            "data_sources": sorted({event["source"] for event in events}),
            "uncertainty": "Pulse reflects only the information you chose to share. It describes recorded experience, not a diagnosis or clinical finding.",
        }

    # ── RecipePractice ───────────────────────────────────────────────

    def add_recipe_practice_item(self, item: RecipePracticeItem) -> RecipePracticeItem:
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO recipe_practice_items
                (id,member_id,name,category,description,accessibility_needs,
                 recommended_by_practitioner,practitioner_id,source,discovered_at,
                 is_favorite,practice_count,last_practiced_at,effectiveness_ratings,contexts)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    str(item.id), item.member_id, item.name, item.category,
                    item.description, json.dumps(item.accessibility_needs),
                    int(item.recommended_by_practitioner), item.practitioner_id,
                    item.source, item.discovered_at.isoformat(), int(item.is_favorite),
                    item.practice_count,
                    item.last_practiced_at.isoformat() if item.last_practiced_at else None,
                    json.dumps(item.effectiveness_ratings), json.dumps(item.contexts),
                ),
            )
        return item

    def get_recipe_practice_items(self, member_id: str) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE member_id=? ORDER BY discovered_at DESC",
                (member_id,),
            ).fetchall()
        return [self._decode_recipe_practice_item(row) for row in rows]

    def set_recipe_practice_favorite(self, member_id: str, item_id: str, favorite: bool) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            conn.execute(
                "UPDATE recipe_practice_items SET is_favorite=? WHERE id=? AND member_id=?",
                (int(favorite), item_id, member_id),
            )
            row = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            ).fetchone()
        return self._decode_recipe_practice_item(row) if row else None

    def record_recipe_practice_practice(
        self,
        member_id: str,
        item_id: str,
        effectiveness: int,
        context: Optional[str],
        *,
        notes: Optional[str] = None,
        client_id: Optional[str] = None,
        before_activation: Optional[int] = None,
        after_activation: Optional[int] = None,
        duration_minutes: Optional[int] = None,
        outcome_confidence: Optional[int] = None,
    ) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            ).fetchone()
            if not row:
                return None
            if client_id:
                duplicate = conn.execute(
                    "SELECT id FROM practice_outcomes WHERE member_id=? AND client_id=?",
                    (member_id, client_id),
                ).fetchone()
                if duplicate:
                    return self._decode_recipe_practice_item(row)
            ratings = json.loads(row["effectiveness_ratings"] or "[]")
            contexts = json.loads(row["contexts"] or "[]")
            ratings.append(effectiveness)
            if context:
                contexts.append(context)
            now = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """UPDATE recipe_practice_items SET practice_count=practice_count+1,
                last_practiced_at=?, effectiveness_ratings=?, contexts=?
                WHERE id=? AND member_id=?""",
                (now, json.dumps(ratings), json.dumps(contexts), item_id, member_id),
            )
            conn.execute(
                """INSERT INTO practice_outcomes
                (id,client_id,member_id,practice_item_id,effectiveness,context,notes,
                 before_activation,after_activation,duration_minutes,outcome_confidence,occurred_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    str(uuid4()), client_id, member_id, item_id, effectiveness,
                    context, notes, before_activation, after_activation,
                    duration_minutes, outcome_confidence, now,
                ),
            )
            event_id = f"practice-{client_id}" if client_id else f"practice-{uuid4()}"
            conn.execute(
                """INSERT OR IGNORE INTO member_events
                (id,member_id,kind,occurred_at,source,provenance,payload,consent_scope,schema_version)
                VALUES (?,?,?,?,?,?,?,?,?)""",
                (
                    event_id, member_id, "practice_outcome_recorded", now,
                    "mind_recipe", "member",
                    json.dumps({
                        "practice_item_id": item_id,
                        "effectiveness": effectiveness,
                        "before_activation": before_activation,
                        "after_activation": after_activation,
                    }),
                    "recipe_practice", "v1",
                ),
            )
            updated = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            ).fetchone()
        return self._decode_recipe_practice_item(updated) if updated else None

    def get_practice_outcomes(self, member_id: str, item_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query = "SELECT * FROM practice_outcomes WHERE member_id=?"
        values: List[Any] = [member_id]
        if item_id:
            query += " AND practice_item_id=?"
            values.append(item_id)
        query += " ORDER BY occurred_at DESC LIMIT 100"
        with self._connect() as conn:
            rows = conn.execute(query, values).fetchall()
        return [dict(row) for row in rows]

    def get_practice_effectiveness(self, member_id: str) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT p.id, p.name, p.category, COUNT(o.id) AS attempts,
                    ROUND(AVG(o.effectiveness), 2) AS average_effectiveness,
                    ROUND(AVG(CASE WHEN o.before_activation IS NOT NULL AND o.after_activation IS NOT NULL
                        THEN o.after_activation - o.before_activation END), 2) AS average_activation_change,
                    MAX(o.occurred_at) AS last_practiced_at
                FROM recipe_practice_items p
                JOIN practice_outcomes o ON o.practice_item_id=p.id AND o.member_id=p.member_id
                WHERE p.member_id=?
                GROUP BY p.id, p.name, p.category
                ORDER BY attempts DESC, average_effectiveness DESC""",
                (member_id,),
            ).fetchall()
        return [
            {
                **dict(row),
                "interpretation": "Based on your recorded experience; this is not a clinical finding.",
            }
            for row in rows
        ]

    def get_personal_practice_recommendations(self, member_id: str, limit: int = 3) -> List[Dict[str, Any]]:
        """Return only member-reported, repeatable practice signals.

        This deliberately avoids causal language: a recommendation is offered
        only after two direct outcome ratings and can be dismissed by the
        member. Activation is displayed as context when recorded, never as a
        measure of wellness or improvement.
        """
        with self._connect() as conn:
            rows = conn.execute(
                """SELECT p.id AS practice_item_id, p.name AS practice_name,
                    COUNT(o.id) AS attempts, ROUND(AVG(o.effectiveness), 2) AS average_effectiveness,
                    ROUND(AVG(CASE WHEN o.before_activation IS NOT NULL AND o.after_activation IS NOT NULL
                        THEN o.after_activation - o.before_activation END), 2) AS average_activation_change,
                    GROUP_CONCAT(DISTINCT o.context) AS context_examples
                FROM recipe_practice_items p
                JOIN practice_outcomes o ON o.practice_item_id=p.id AND o.member_id=p.member_id
                WHERE p.member_id=?
                GROUP BY p.id, p.name
                HAVING COUNT(o.id) >= 2 AND AVG(o.effectiveness) >= 3.5
                ORDER BY AVG(o.effectiveness) DESC, COUNT(o.id) DESC
                LIMIT ?""",
                (member_id, limit * 3),
            ).fetchall()
            feedback = {
                row["recommendation_id"]: row["decision"]
                for row in conn.execute(
                    "SELECT recommendation_id,decision FROM practice_recommendation_feedback WHERE member_id=?",
                    (member_id,),
                ).fetchall()
            }
        recommendations = []
        for row in rows:
            value = dict(row)
            identifier = f"practice-{value['practice_item_id']}-repeat"
            if feedback.get(identifier) == "dismissed":
                continue
            contexts = [part.strip() for part in (value.pop("context_examples") or "").split(",") if part.strip()][:3]
            attempts = int(value["attempts"])
            average = float(value["average_effectiveness"])
            reason = (
                f"You rated this {average:.1f}/5 on average across {attempts} recorded uses. "
                "Consider it again only if it feels useful in the moment."
            )
            recommendations.append({
                **value,
                "id": identifier,
                "reason": reason,
                "context_examples": contexts,
                "uncertainty": "This reflects your recorded experience, not a prediction or clinical finding.",
            })
            if len(recommendations) >= limit:
                break
        return recommendations

    def save_practice_recommendation_feedback(self, member_id: str, recommendation_id: str, decision: str) -> None:
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO practice_recommendation_feedback (member_id,recommendation_id,decision,decided_at)
                VALUES (?,?,?,?)
                ON CONFLICT(member_id,recommendation_id) DO UPDATE SET
                decision=excluded.decision, decided_at=excluded.decided_at""",
                (member_id, recommendation_id, decision, datetime.now(timezone.utc).isoformat()),
            )

    # ── Commitments ────────────────────────────────────────────────

    def create_commitment(self, member_id: str, values: Dict[str, Any]) -> Dict[str, Any]:
        if values.get("client_id"):
            with self._connect() as conn:
                prior = conn.execute(
                    "SELECT * FROM commitments WHERE member_id=? AND client_id=?",
                    (member_id, values["client_id"]),
                ).fetchone()
            if prior:
                return dict(prior)
        now = datetime.now(timezone.utc).isoformat()
        identifier = str(uuid4())
        scheduled_for = values.get("scheduled_for")
        status = "scheduled" if scheduled_for else "proposed"
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO commitments
                (id,client_id,member_id,title,action_type,practice_item_id,scheduled_for,notes,source,status,created_at,updated_at,completed_at,execution_status,execution_receipt)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    identifier, values.get("client_id"), member_id, values["title"],
                    values.get("action_type", "reflection"), values.get("practice_item_id"),
                    scheduled_for, values.get("notes"), values.get("source", "member"),
                    status, now, now, None, "not_requested", None,
                ),
            )
            self._record_commitment_event(conn, member_id, identifier, status, now)
            row = conn.execute("SELECT * FROM commitments WHERE id=?", (identifier,)).fetchone()
        return dict(row)

    def list_commitments(self, member_id: str, include_closed: bool = False) -> List[Dict[str, Any]]:
        query = "SELECT * FROM commitments WHERE member_id=?"
        if not include_closed:
            query += " AND status NOT IN ('completed','skipped','cancelled')"
        query += " ORDER BY COALESCE(scheduled_for, created_at) ASC"
        with self._connect() as conn:
            rows = conn.execute(query, (member_id,)).fetchall()
        return [dict(row) for row in rows]

    def update_commitment(self, member_id: str, commitment_id: str, status: str, notes: Optional[str]) -> Optional[Dict[str, Any]]:
        allowed = {
            "proposed": {"confirmed", "scheduled", "cancelled"},
            "confirmed": {"scheduled", "completed", "skipped", "cancelled"},
            "scheduled": {"confirmed", "completed", "skipped", "cancelled"},
        }
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            current = conn.execute(
                "SELECT * FROM commitments WHERE id=? AND member_id=?", (commitment_id, member_id)
            ).fetchone()
            if not current or status not in allowed.get(current["status"], set()):
                return None
            completed_at = now if status == "completed" else current["completed_at"]
            next_notes = notes if notes is not None else current["notes"]
            conn.execute(
                "UPDATE commitments SET status=?,notes=?,updated_at=?,completed_at=? WHERE id=? AND member_id=?",
                (status, next_notes, now, completed_at, commitment_id, member_id),
            )
            self._record_commitment_event(conn, member_id, commitment_id, status, now)
            updated = conn.execute("SELECT * FROM commitments WHERE id=?", (commitment_id,)).fetchone()
        return dict(updated) if updated else None

    def record_commitment_execution(
        self, member_id: str, commitment_id: str, action: str, status: str,
        receipt: Optional[str], scheduled_for: Optional[str],
    ) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            current = conn.execute(
                "SELECT * FROM commitments WHERE id=? AND member_id=?", (commitment_id, member_id)
            ).fetchone()
            if not current or current["status"] not in {"confirmed", "scheduled"}:
                return None
            next_status = "scheduled" if status == "requested" and scheduled_for else current["status"]
            conn.execute(
                """UPDATE commitments SET status=?,scheduled_for=COALESCE(?, scheduled_for),
                execution_status=?,execution_receipt=?,updated_at=? WHERE id=? AND member_id=?""",
                (next_status, scheduled_for, status, receipt, now, commitment_id, member_id),
            )
            self._record_commitment_event(conn, member_id, commitment_id, f"{action}_{status}", now)
            updated = conn.execute("SELECT * FROM commitments WHERE id=?", (commitment_id,)).fetchone()
        return dict(updated) if updated else None

    @staticmethod
    def _record_commitment_event(conn: sqlite3.Connection, member_id: str, commitment_id: str, status: str, occurred_at: str) -> None:
        conn.execute(
            """INSERT OR IGNORE INTO member_events
            (id,member_id,kind,occurred_at,source,provenance,payload,consent_scope,schema_version)
            VALUES (?,?,?,?,?,?,?,?,?)""",
            (
                f"commitment-{commitment_id}-{status}", member_id,
                f"commitment_{status}", occurred_at, "mind_nav", "member",
                json.dumps({"commitment_id": commitment_id}), "device", "v1",
            ),
        )

    def delete_recipe_practice_item(self, member_id: str, item_id: str) -> bool:
        with self._connect() as conn:
            cursor = conn.execute(
                "DELETE FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            )
        return cursor.rowcount > 0

    def get_curriculum_progress(self, member_id: str) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM curriculum_progress WHERE member_id=?", (member_id,)
            ).fetchone()
        if not row:
            return None
        progress = dict(row)
        progress["completed_lesson_ids"] = json.loads(progress["completed_lesson_ids"])
        progress["completed_practice_ids"] = json.loads(progress["completed_practice_ids"])
        return progress

    def merge_curriculum_progress(self, member_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        existing = self.get_curriculum_progress(member_id)
        lessons = set(payload.get("completed_lesson_ids", []))
        practices = set(payload.get("completed_practice_ids", []))
        current = payload.get("current_lesson_id")
        updated_at = payload["updated_at"]
        if existing:
            lessons.update(existing["completed_lesson_ids"])
            practices.update(existing["completed_practice_ids"])
            if existing["updated_at"] > updated_at:
                current = existing["current_lesson_id"]
                updated_at = existing["updated_at"]
        result = {
            "member_id": member_id,
            "curriculum_version": payload["curriculum_version"],
            "completed_lesson_ids": sorted(lessons),
            "completed_practice_ids": sorted(practices),
            "current_lesson_id": current,
            "updated_at": updated_at,
        }
        with self._connect() as conn:
            conn.execute(
                """INSERT INTO curriculum_progress
                (member_id,curriculum_version,completed_lesson_ids,completed_practice_ids,current_lesson_id,updated_at)
                VALUES (?,?,?,?,?,?)
                ON CONFLICT(member_id) DO UPDATE SET
                curriculum_version=excluded.curriculum_version,
                completed_lesson_ids=excluded.completed_lesson_ids,
                completed_practice_ids=excluded.completed_practice_ids,
                current_lesson_id=excluded.current_lesson_id,
                updated_at=excluded.updated_at""",
                (
                    member_id,
                    result["curriculum_version"],
                    json.dumps(result["completed_lesson_ids"]),
                    json.dumps(result["completed_practice_ids"]),
                    result["current_lesson_id"],
                    result["updated_at"],
                ),
            )
        self.recompute_journey_recommendation(member_id)
        return result

    @staticmethod
    def _decode_recipe_practice_item(row: sqlite3.Row) -> Dict[str, Any]:
        item = dict(row)
        for field in ("accessibility_needs", "effectiveness_ratings", "contexts"):
            item[field] = json.loads(item.get(field) or "[]")
        item["recommended_by_practitioner"] = bool(item["recommended_by_practitioner"])
        item["is_favorite"] = bool(item["is_favorite"])
        return item

    # ── Check-ins ─────────────────────────────────────────────

    def add_checkin(self, record: CheckInRecord) -> CheckInRecord:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO checkins (id,member_id,client_id,emotions,activation,body_areas,journal,zone_label,observations,created_at,policy_version,safety_interrupted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                (str(record.id), record.member_id, record.client_id, json.dumps(record.emotions), record.activation,
                 json.dumps(record.body_areas), record.journal, record.zone_label,
                 json.dumps([o.model_dump() if hasattr(o, 'model_dump') else o for o in record.observations]),
                 record.created_at.isoformat(), record.policy_version, int(record.safety_interrupted)))
            conn.execute(
                """INSERT OR IGNORE INTO member_events
                (id,member_id,kind,occurred_at,source,provenance,payload,consent_scope,schema_version)
                VALUES (?,?,?,?,?,?,?,?,?)""",
                (
                    f"checkin-{record.id}", record.member_id, "checkin_recorded",
                    record.created_at.isoformat(), "daily_navigation", "member",
                    json.dumps({"checkin_id": str(record.id), "activation": record.activation}),
                    "checkins", "v1",
                ),
            )
            self._update_trend_cache(conn, record.member_id)
        return record

    def get_checkin_by_client_id(
        self, member_id: str, client_id: Optional[str]
    ) -> Optional[Dict[str, Any]]:
        if not client_id:
            return None
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM checkins WHERE member_id=? AND client_id=?",
                (member_id, client_id),
            ).fetchone()
        return self._decode_checkin(row) if row else None

    def get_member_checkins(self, member_id: str, days: int = 30) -> List[Dict]:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM checkins WHERE member_id=? AND created_at>=? ORDER BY created_at DESC",
                (member_id, cutoff)).fetchall()
        return [self._decode_checkin(r) for r in rows]

    @staticmethod
    def _decode_checkin(row: sqlite3.Row) -> Dict[str, Any]:
        """Return API-ready values instead of SQLite's JSON text columns."""
        record = dict(row)
        for field in ("emotions", "body_areas", "observations"):
            try:
                record[field] = json.loads(record.get(field) or "[]")
            except (TypeError, json.JSONDecodeError):
                record[field] = []
        record["safety_interrupted"] = bool(record.get("safety_interrupted"))
        return record

    # ── Consents ──────────────────────────────────────────────

    def add_consent(self, grant: ConsentGrant) -> ConsentGrant:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO consents (id,member_id,recipient_practitioner_id,categories,purpose,starts_at,expires_at,created_at) VALUES (?,?,?,?,?,?,?,?)",
                (str(grant.id), grant.member_id, grant.recipient_practitioner_id,
                 json.dumps([c.value if hasattr(c, 'value') else str(c) for c in grant.categories]),
                 grant.purpose, grant.starts_at.isoformat(), grant.expires_at.isoformat(), grant.created_at.isoformat()))
        return grant

    def revoke_consent(self, grant_id: str, member_id: str) -> Optional[Dict]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute("UPDATE consents SET revoked_at=? WHERE id=? AND member_id=? AND revoked_at IS NULL",
                        (now, grant_id, member_id))
            row = conn.execute("SELECT * FROM consents WHERE id=?", (grant_id,)).fetchone()
        return dict(row) if row else None

    def get_active_consents(self, member_id: str) -> List[Dict]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM consents WHERE member_id=? AND revoked_at IS NULL AND expires_at > ?",
                (member_id, now)).fetchall()
        return [dict(r) for r in rows]

    def shared_checkins(self, member_id: str, practitioner_id: str) -> List[Dict]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            grant = conn.execute(
                "SELECT * FROM consents WHERE member_id=? AND recipient_practitioner_id=? AND revoked_at IS NULL AND expires_at > ?",
                (member_id, practitioner_id, now)).fetchone()
            if not grant:
                return []
            categories = json.loads(grant["categories"])
            if "checkins" not in categories:
                return []
            rows = conn.execute(
                "SELECT * FROM checkins WHERE member_id=? ORDER BY created_at DESC LIMIT 50",
                (member_id,)).fetchall()
        records = [self._decode_checkin(r) for r in rows]
        if "journal" not in categories:
            for record in records:
                record["journal"] = None
        return records

    def shared_member_summary(self, member_id: str, practitioner_id: str) -> Optional[Dict[str, Any]]:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            grant = conn.execute(
                "SELECT * FROM consents WHERE member_id=? AND recipient_practitioner_id=? AND revoked_at IS NULL AND expires_at > ?",
                (member_id, practitioner_id, now),
            ).fetchone()
        if not grant:
            return None
        categories = json.loads(grant["categories"])
        result: Dict[str, Any] = {
            "member_id": member_id,
            "shared_categories": categories,
            "consent_expires_at": grant["expires_at"],
            "wellness_boundary": "This member-controlled wellness summary is not a clinical assessment.",
        }
        if "checkins" in categories:
            result["recent_checkins"] = self.shared_checkins(member_id, practitioner_id)
        if "trends" in categories:
            result["trends"] = self.get_trends(member_id)
        if "recipe_practice" in categories:
            result["practice_effectiveness"] = self.get_practice_effectiveness(member_id)
        return result

    # ── Audit ─────────────────────────────────────────────────

    def audit(self, event: AuditEvent) -> None:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO audit_events (id,actor_id,action,resource_type,resource_id,occurred_at,metadata) VALUES (?,?,?,?,?,?,?)",
                (str(event.id), event.actor_id, event.action, event.resource_type,
                 event.resource_id, event.occurred_at.isoformat(), json.dumps(event.metadata)))

    def get_audit_trail(self, actor_id: str, limit: int = 50) -> List[Dict]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT * FROM audit_events WHERE actor_id=? ORDER BY occurred_at DESC LIMIT ?",
                (actor_id, limit)).fetchall()
        return [dict(r) for r in rows]

    # ── Trend cache & patterns ────────────────────────────────

    def _update_trend_cache(self, conn: sqlite3.Connection, member_id: str):
        now = datetime.now(timezone.utc).isoformat()
        row = conn.execute(
            "SELECT AVG(activation) as avg_act, COUNT(*) as cnt FROM checkins WHERE member_id=? AND created_at >= date('now','-30 days')",
            (member_id,)).fetchone()
        if row and row["cnt"] > 0:
            conn.execute(
                "INSERT OR REPLACE INTO trend_cache (member_id,avg_activation,streak_days,last_checkin_at,updated_at) VALUES (?,?,?,?,?)",
                (member_id, round(row["avg_act"], 2), self._calc_streak(conn, member_id), now, now))

    def _calc_streak(self, conn: sqlite3.Connection, member_id: str) -> int:
        rows = conn.execute(
            "SELECT DISTINCT date(created_at) as d FROM checkins WHERE member_id=? ORDER BY d DESC LIMIT 30",
            (member_id,)).fetchall()
        streak = 0
        expected = datetime.now(timezone.utc).date()
        for r in rows:
            d = datetime.fromisoformat(r["d"]).date()
            if d == expected:
                streak += 1
                expected -= timedelta(days=1)
            elif d == expected - timedelta(days=1):
                streak += 1
                expected = d - timedelta(days=1)
            else:
                break
        return streak

    def get_trends(self, member_id: str) -> Dict[str, Any]:
        with self._connect() as conn:
            cache = conn.execute("SELECT * FROM trend_cache WHERE member_id=?", (member_id,)).fetchone()
            total = conn.execute("SELECT COUNT(*) AS count FROM checkins WHERE member_id=?", (member_id,)).fetchone()["count"]
            recent = conn.execute(
                "SELECT emotions, activation, created_at FROM checkins WHERE member_id=? ORDER BY created_at DESC LIMIT 10",
                (member_id,)).fetchall()

        emotions_counter: Dict[str, int] = {}
        activations = []
        for r in recent:
            activations.append(r["activation"])
            for e in json.loads(r["emotions"]):
                emotions_counter[e] = emotions_counter.get(e, 0) + 1

        return {
            "member_id": member_id,
            "total_checkins": total,
            "avg_activation": round(sum(activations)/len(activations), 2) if activations else 0,
            "top_emotions": sorted(emotions_counter.items(), key=lambda x: x[1], reverse=True)[:5],
            "streak_days": cache["streak_days"] if cache else 0,
            "last_checkin_at": cache["last_checkin_at"] if cache else None,
            "trend": "recent_activation_context" if activations else "insufficient_data",
        }

    def detect_patterns(self, member_id: str) -> List[Dict]:
        with self._connect() as conn:
            # Pattern: activation dropping over last 3 check-ins
            recent = conn.execute(
                "SELECT emotions, activation, created_at FROM checkins WHERE member_id=? ORDER BY created_at DESC LIMIT 5",
                (member_id,)).fetchall()
            patterns = []
            if len(recent) >= 3:
                acts = [r["activation"] for r in recent[:3]]
                if acts[0] < acts[1] < acts[2]:  # consistently dropping
                    patterns.append({
                        "type": "activation_decline",
                        "description": "Your last three recorded activation values were each lower than the one before. This is an observation, not a conclusion about how you are doing.",
                        "confidence": 0.78,
                        "detected_at": datetime.now(timezone.utc).isoformat(),
                    })
                elif acts[0] > acts[1] > acts[2]:  # consistently rising
                    patterns.append({
                        "type": "activation_rising",
                        "description": "Your last three recorded activation values were each higher than the one before. This is an observation, not a judgment about progress.",
                        "confidence": 0.82,
                        "detected_at": datetime.now(timezone.utc).isoformat(),
                    })

            # Pattern: same emotion dominating
            emotions_all = []
            for r in recent:
                emotions_all.extend(json.loads(r["emotions"]))
            from collections import Counter
            ec = Counter(emotions_all)
            if ec and ec.most_common(1)[0][1] >= 3:
                top = ec.most_common(1)[0]
                patterns.append({
                    "type": "dominant_emotion",
                    "description": f"'{top[0]}' has been your most frequent emotion recently.",
                    "confidence": 0.71,
                    "detected_at": datetime.now(timezone.utc).isoformat(),
                })

            # A screen refresh must not create an unbounded stream of the
            # same observation, so retain at most one of each type per day.
            for p in patterns:
                duplicate = conn.execute(
                    "SELECT 1 FROM pattern_alerts WHERE member_id=? AND pattern_type=? AND detected_at >= datetime('now', '-1 day') LIMIT 1",
                    (member_id, p["type"]),
                ).fetchone()
                if not duplicate:
                    conn.execute(
                        "INSERT INTO pattern_alerts (id,member_id,pattern_type,description,confidence,detected_at) VALUES (?,?,?,?,?,?)",
                        (str(uuid4()), member_id, p["type"], p["description"], p["confidence"], p["detected_at"]))

        return patterns

store = SqliteStore()
