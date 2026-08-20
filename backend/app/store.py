from __future__ import annotations

"""Replaceable repository boundary.

The in-memory implementation is allowed only for development/tests. Production
startup is rejected unless a PostgreSQL repository is configured.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID

from .models import (
    AiArtifact, AiSession, Appointment, AuditEvent, CheckInRecord, ConsentGrant,
    Course, DataCategory, JournalEntry, Lesson, NotificationPreference, SafetyEvent,
    ToolboxItem, TrackerEvent,
)


class DevelopmentStore:
    def __init__(self) -> None:
        self.checkins: Dict[str, List[CheckInRecord]] = {}
        self.consents: Dict[str, ConsentGrant] = {}
        self.audit_events: List[AuditEvent] = []
        self.journal_entries: Dict[str, List[JournalEntry]] = {}
        self.ai_sessions: Dict[str, AiSession] = {}
        self.ai_artifacts: Dict[str, List[AiArtifact]] = {}
        self.toolbox_items: Dict[str, List[ToolboxItem]] = {}
        self.tracker_events: Dict[str, List[TrackerEvent]] = {}
        self.courses: Dict[str, List[Course]] = {}
        self.lessons: Dict[str, List[Lesson]] = {}
        self.exercises: Dict[str, List[dict]] = {}
        self.appointments: Dict[str, List[Appointment]] = {}
        self.notification_preferences: Dict[str, NotificationPreference] = {}
        self.safety_events: Dict[str, List[SafetyEvent]] = {}
        self.daily_summaries: Dict[str, List[dict]] = {}

    def add_checkin(self, record: CheckInRecord) -> CheckInRecord:
        self.checkins.setdefault(record.member_id, []).append(record)
        return record

    def add_consent(self, grant: ConsentGrant) -> ConsentGrant:
        self.consents[str(grant.id)] = grant
        return grant

    def revoke_consent(self, grant_id: str) -> Optional[ConsentGrant]:
        grant = self.consents.get(grant_id)
        if grant and not grant.revoked_at:
            grant.revoked_at = datetime.now(timezone.utc)
        return grant

    def shared_checkins(self, member_id: str, practitioner_id: str) -> List[CheckInRecord]:
        approved = any(
            grant.member_id == member_id
            and grant.recipient_practitioner_id == practitioner_id
            and not grant.revoked_at
            and grant.expires_at > datetime.now(timezone.utc)
            and DataCategory.checkins in grant.categories
            for grant in self.consents.values()
        )
        return self.checkins.get(member_id, []) if approved else []

    def add_journal_entry(self, entry: JournalEntry) -> JournalEntry:
        self.journal_entries.setdefault(entry.member_id, []).append(entry)
        return entry

    def get_journal_entries(self, member_id: str, limit: int = 50) -> List[JournalEntry]:
        return self.journal_entries.get(member_id, [])[-limit:]

    def create_ai_session(self, session: AiSession) -> AiSession:
        self.ai_sessions[str(session.id)] = session
        return session

    def get_ai_session(self, session_id: str) -> Optional[AiSession]:
        return self.ai_sessions.get(session_id)

    def add_ai_artifact(self, artifact: AiArtifact) -> AiArtifact:
        self.ai_artifacts.setdefault(artifact.member_id, []).append(artifact)
        return artifact

    def get_ai_artifacts(self, member_id: str, session_id: Optional[str] = None, limit: int = 50) -> List[AiArtifact]:
        artifacts = self.ai_artifacts.get(member_id, [])
        if session_id:
            artifacts = [a for a in artifacts if str(a.session_id) == session_id]
        return artifacts[-limit:]

    def add_toolbox_item(self, item: ToolboxItem) -> ToolboxItem:
        self.toolbox_items.setdefault(item.member_id, []).append(item)
        return item

    def get_toolbox_items(self, member_id: str) -> List[ToolboxItem]:
        return self.toolbox_items.get(member_id, [])

    def update_toolbox_item(self, member_id: str, item_id: str, updates: dict) -> Optional[ToolboxItem]:
        for item in self.toolbox_items.get(member_id, []):
            if str(item.id) == item_id:
                for key, value in updates.items():
                    if hasattr(item, key):
                        setattr(item, key, value)
                return item
        return None

    def add_tracker_event(self, event: TrackerEvent) -> TrackerEvent:
        self.tracker_events.setdefault(event.member_id, []).append(event)
        return event

    def get_tracker_events(self, member_id: str, tracker_type: Optional[str] = None, limit: int = 100) -> List[TrackerEvent]:
        events = self.tracker_events.get(member_id, [])
        if tracker_type:
            events = [e for e in events if e.tracker_type == tracker_type]
        return events[-limit:]

    def add_course(self, course: Course) -> Course:
        self.courses.setdefault(course.member_id, []).append(course)
        return course

    def get_courses(self, member_id: str) -> List[Course]:
        return self.courses.get(member_id, [])

    def add_lesson(self, lesson: Lesson) -> Lesson:
        self.lessons.setdefault(str(lesson.course_id), []).append(lesson)
        return lesson

    def get_lessons(self, course_id: str) -> List[Lesson]:
        return self.lessons.get(course_id, [])

    def add_appointment(self, appointment: Appointment) -> Appointment:
        self.appointments.setdefault(appointment.member_id, []).append(appointment)
        return appointment

    def get_appointments(self, member_id: str, status: Optional[str] = None) -> List[Appointment]:
        appointments = self.appointments.get(member_id, [])
        if status:
            appointments = [a for a in appointments if a.status == status]
        return appointments

    def update_notification_preference(self, member_id: str, pref: NotificationPreference) -> NotificationPreference:
        self.notification_preferences[member_id] = pref
        return pref

    def get_notification_preference(self, member_id: str) -> Optional[NotificationPreference]:
        return self.notification_preferences.get(member_id)

    def add_safety_event(self, event: SafetyEvent) -> SafetyEvent:
        self.safety_events.setdefault(event.member_id, []).append(event)
        return event

    def get_safety_events(self, member_id: str, limit: int = 50) -> List[SafetyEvent]:
        return self.safety_events.get(member_id, [])[-limit:]

    def export_account(self, member_id: str) -> dict:
        return {
            "member_id": member_id,
            "check_ins": [c.model_dump() for c in self.checkins.get(member_id, [])],
            "journal_entries": [j.model_dump() for j in self.journal_entries.get(member_id, [])],
            "ai_sessions": [s.model_dump() for s in self.ai_sessions.values() if s.member_id == member_id],
            "toolbox_items": [t.model_dump() for t in self.toolbox_items.get(member_id, [])],
            "tracker_events": [e.model_dump() for e in self.tracker_events.get(member_id, [])],
            "consents": [g.model_dump() for g in self.consents.values() if g.member_id == member_id],
            "appointments": [a.model_dump() for a in self.appointments.get(member_id, [])],
        }

    def delete_account(self, member_id: str) -> bool:
        deleted = False
        for store_dict in [self.checkins, self.journal_entries, self.toolbox_items,
                          self.tracker_events, self.appointments, self.safety_events]:
            if member_id in store_dict:
                del store_dict[member_id]
                deleted = True
        keys_to_delete = [k for k, v in self.ai_sessions.items() if v.member_id == member_id]
        for key in keys_to_delete:
            del self.ai_sessions[key]
            deleted = True
        keys_to_delete = [k for k, v in self.consents.items() if v.member_id == member_id]
        for key in keys_to_delete:
            del self.consents[key]
            deleted = True
        return deleted

    def audit(self, event: AuditEvent) -> None:
        self.audit_events.append(event)


store = DevelopmentStore()
