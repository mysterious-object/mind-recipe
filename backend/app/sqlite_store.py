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
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS idx_memory_cards_member ON memory_cards(member_id, pinned, updated_at);
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
            """)
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
        goal = (result.get("active_goal") or "").lower()
        completed = self.get_curriculum_progress(member_id) or {"completed_lesson_ids": []}
        if goal and "sleep" in goal:
            result["recommended_module_id"] = "lesson-4"
            result["recommendation_reason"] = "You named sleep as a current goal, so a baseline-focused module may help you notice what supports recovery."
        elif len(completed.get("completed_lesson_ids", [])):
            result["recommended_module_id"] = "lesson-6"
            result["recommendation_reason"] = "You have completed foundations; a grounding module is a gentle next option."
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
        with self._connect() as conn:
            rows = conn.execute("SELECT * FROM memory_cards WHERE member_id=? ORDER BY pinned DESC, updated_at DESC", (member_id,)).fetchall()
        return [{**dict(row), "pinned": bool(row["pinned"])} for row in rows]

    def save_memory_card(self, member_id: str, values: Dict[str, Any], card_id: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        identifier = card_id or str(uuid4())
        with self._connect() as conn:
            if card_id:
                conn.execute("UPDATE memory_cards SET kind=?,content=?,pinned=?,updated_at=? WHERE id=? AND member_id=?", (values["kind"], values["content"], int(values.get("pinned", False)), now, identifier, member_id))
            else:
                conn.execute("INSERT INTO memory_cards (id,member_id,kind,content,pinned,created_at,updated_at) VALUES (?,?,?,?,?,?,?)", (identifier, member_id, values["kind"], values["content"], int(values.get("pinned", False)), now, now))
            row = conn.execute("SELECT * FROM memory_cards WHERE id=? AND member_id=?", (identifier, member_id)).fetchone()
        return {**dict(row), "pinned": bool(row["pinned"])} if row else None

    def delete_memory_card(self, member_id: str, card_id: str) -> bool:
        with self._connect() as conn:
            return conn.execute("DELETE FROM memory_cards WHERE id=? AND member_id=?", (card_id, member_id)).rowcount > 0

    def add_member_events(self, member_id: str, events: List[Dict[str, Any]]) -> int:
        with self._connect() as conn:
            for event in events:
                conn.execute("INSERT OR IGNORE INTO member_events (id,member_id,kind,occurred_at,source,provenance,payload,consent_scope,schema_version) VALUES (?,?,?,?,?,?,?,?,?)", (event["id"], member_id, event["kind"], event["occurred_at"], event["source"], event["provenance"], json.dumps(event.get("payload", {})), event["consent_scope"], event["schema_version"]))
            return conn.total_changes

    def pulse_summary(self, member_id: str) -> Dict[str, Any]:
        events = []
        with self._connect() as conn:
            rows = conn.execute("SELECT kind,payload,occurred_at,source FROM member_events WHERE member_id=? ORDER BY occurred_at DESC LIMIT 50", (member_id,)).fetchall()
        for row in rows:
            events.append({**dict(row), "payload": json.loads(row["payload"])})
        practices = self.get_recipe_practice_items(member_id)
        ratings = [rating for item in practices for rating in item.get("effectiveness_ratings", [])]
        return {"recent_events": events[:8], "recipe_effectiveness": round(sum(ratings) / len(ratings), 1) if ratings else None,
                "practice_count": sum(int(item.get("practice_count", 0)) for item in practices), "data_sources": sorted({event["source"] for event in events}),
                "uncertainty": "Pulse reflects only the information you chose to share; it is not a diagnosis."}

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
    ) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            ).fetchone()
            if not row:
                return None
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
            updated = conn.execute(
                "SELECT * FROM recipe_practice_items WHERE id=? AND member_id=?",
                (item_id, member_id),
            ).fetchone()
        return self._decode_recipe_practice_item(updated) if updated else None

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
                "INSERT INTO checkins (id,member_id,emotions,activation,body_areas,journal,zone_label,observations,created_at,policy_version,safety_interrupted) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (str(record.id), record.member_id, json.dumps(record.emotions), record.activation,
                 json.dumps(record.body_areas), record.journal, record.zone_label,
                 json.dumps([o.model_dump() if hasattr(o, 'model_dump') else o for o in record.observations]),
                 record.created_at.isoformat(), record.policy_version, int(record.safety_interrupted)))
            self._update_trend_cache(conn, record.member_id)
        return record

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
        return [self._decode_checkin(r) for r in rows]

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
            "total_checkins": len(recent) if recent else 0,
            "avg_activation": round(sum(activations)/len(activations), 2) if activations else 0,
            "top_emotions": sorted(emotions_counter.items(), key=lambda x: x[1], reverse=True)[:5],
            "streak_days": cache["streak_days"] if cache else 0,
            "last_checkin_at": cache["last_checkin_at"] if cache else None,
            "trend": "improving" if activations and sum(activations)/len(activations) > 0 else "stable",
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
                        "description": "Your activation has been trending downward over your last 3 check-ins. A grounding practice might help.",
                        "confidence": 0.78,
                        "detected_at": datetime.now(timezone.utc).isoformat(),
                    })
                elif acts[0] > acts[1] > acts[2]:  # consistently rising
                    patterns.append({
                        "type": "activation_improving",
                        "description": "Your activation has been consistently improving — great progress!",
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

            # Persist patterns
            for p in patterns:
                conn.execute(
                    "INSERT INTO pattern_alerts (id,member_id,pattern_type,description,confidence,detected_at) VALUES (?,?,?,?,?,?)",
                    (str(uuid4()), member_id, p["type"], p["description"], p["confidence"], p["detected_at"]))

        return patterns

store = SqliteStore()
