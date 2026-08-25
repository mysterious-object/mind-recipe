from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class Role(str, Enum):
    member = "member"
    practitioner = "practitioner"
    guardian = "guardian"


class AuthRegister(BaseModel):
    email: str = Field(min_length=5, max_length=254, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
    display_name: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=10, max_length=128)


class AuthLogin(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class AuthUser(BaseModel):
    id: str
    email: str
    display_name: str
    role: Role = Role.member


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUser


class DataCategory(str, Enum):
    checkins = "checkins"
    tracker_events = "tracker_events"
    trends = "trends"
    journal = "journal"
    ai_summaries = "ai_summaries"
    recipe_practice = "recipe_practice"
    lessons = "lessons"
    appointments = "appointments"


class ObservationInput(BaseModel):
    kind: str = Field(min_length=1, max_length=80)
    value: Any
    recorded_at: datetime
    timezone: str = Field(min_length=1, max_length=80)
    source: str = Field(default="mobile", max_length=40)
    schema_version: str = Field(default="v1", max_length=20)


class CheckInInput(BaseModel):
    emotions: List[str] = Field(default_factory=list, max_length=20)
    activation: int = Field(ge=-5, le=5)
    body_areas: List[str] = Field(default_factory=list, max_length=20)
    journal: Optional[str] = Field(default=None, max_length=4000)
    zone_label: Optional[str] = Field(default=None, max_length=80)
    observations: List[ObservationInput] = Field(default_factory=list, max_length=50)


class CheckInRecord(CheckInInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    created_at: datetime
    policy_version: str
    safety_interrupted: bool = False


class JournalEntryInput(BaseModel):
    content: str = Field(min_length=1, max_length=10000)
    mood_before: Optional[str] = Field(default=None, max_length=80)
    mood_after: Optional[str] = Field(default=None, max_length=80)
    tags: List[str] = Field(default_factory=list, max_length=20)


class JournalEntry(JournalEntryInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    created_at: datetime
    schema_version: str = "v1"


class AiSession(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    provider: str
    model: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    turn_count: int = 0
    total_tokens: int = 0
    privacy_mode: str = "cloud_byok"
    cloud_opt_in: bool = True


class AiArtifact(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    session_id: UUID
    member_id: str
    kind: str = Field(min_length=1, max_length=80)  # reflection, summary, suggestion
    content: str
    source_events: List[str] = Field(default_factory=list)
    model: str
    created_at: datetime
    schema_version: str = "v1"


class RecipePracticeItemInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)  # breathing, grounding, movement, etc.
    description: Optional[str] = Field(default=None, max_length=2000)
    accessibility_needs: List[str] = Field(default_factory=list, max_length=10)
    recommended_by_practitioner: bool = False
    practitioner_id: Optional[str] = Field(default=None, max_length=120)
    source: str = Field(default="self-discovered", min_length=1, max_length=80)


class RecipePracticeItem(RecipePracticeItemInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    discovered_at: datetime
    is_favorite: bool = False
    practice_count: int = 0
    last_practiced_at: Optional[datetime] = None
    effectiveness_ratings: List[int] = Field(default_factory=list)  # 1-5 scale
    contexts: List[str] = Field(default_factory=list)  # when/where used


class RecipePracticePracticeInput(BaseModel):
    tool_id: UUID
    effectiveness: int = Field(ge=1, le=5)
    context: Optional[str] = Field(default=None, max_length=200)
    notes: Optional[str] = Field(default=None, max_length=500)


class JourneyMode(str, Enum):
    guided_foundations = "guided_foundations"
    co_created = "co_created"


class JourneySettingsInput(BaseModel):
    mode: JourneyMode = JourneyMode.guided_foundations
    active_goal: Optional[str] = Field(default=None, max_length=500)
    preferred_duration_minutes: Optional[int] = Field(default=None, ge=1, le=60)


class JourneySettings(JourneySettingsInput):
    member_id: str
    current_module_id: str = "lesson-1"
    recommended_module_id: Optional[str] = None
    recommendation_reason: str = "Start with the foundations at your own pace."
    updated_at: datetime


class RecipeProposalInput(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    purpose: str = Field(min_length=1, max_length=600)
    trigger: Optional[str] = Field(default=None, max_length=300)
    duration_minutes: int = Field(default=3, ge=1, le=60)
    steps: List[str] = Field(min_length=1, max_length=8)
    evidence_basis: str = Field(default="User-guided wellness practice", max_length=800)
    cautions: List[str] = Field(default_factory=list, max_length=8)
    rationale: str = Field(min_length=1, max_length=1000)
    source_kind: str = Field(default="navigator_proposal", max_length=80)


class RecipeProposal(RecipeProposalInput):
    id: str
    member_id: str
    status: str = "proposed"
    version: int = 1
    created_at: datetime
    updated_at: datetime


class RecipeProposalDecision(BaseModel):
    approved: bool
    edits: Optional[RecipeProposalInput] = None


class MemoryCardInput(BaseModel):
    kind: str = Field(min_length=1, max_length=80)
    content: str = Field(min_length=1, max_length=1000)
    pinned: bool = False


class MemoryCard(MemoryCardInput):
    id: str
    member_id: str
    created_at: datetime
    updated_at: datetime


class MemberEventInput(BaseModel):
    id: str = Field(min_length=8, max_length=120)
    kind: str = Field(min_length=1, max_length=80)
    occurred_at: datetime
    source: str = Field(min_length=1, max_length=80)
    provenance: str = Field(default="member", max_length=80)
    payload: Dict[str, Any] = Field(default_factory=dict)
    consent_scope: str = Field(default="device", max_length=80)
    schema_version: str = Field(default="v1", max_length=20)


class CurriculumProgressInput(BaseModel):
    curriculum_version: str = Field(min_length=1, max_length=40)
    completed_lesson_ids: List[str] = Field(default_factory=list, max_length=30)
    completed_practice_ids: List[str] = Field(default_factory=list, max_length=80)
    current_lesson_id: Optional[str] = Field(default=None, max_length=80)
    updated_at: datetime


class CurriculumProgress(CurriculumProgressInput):
    member_id: str


class TrackerEventInput(BaseModel):
    tracker_type: str = Field(min_length=1, max_length=80)  # mindful_check_in, regulation_tool_used, etc.
    value: Any
    context: Optional[str] = Field(default=None, max_length=500)
    recorded_at: datetime
    timezone: str = Field(min_length=1, max_length=80)


class TrackerEvent(TrackerEventInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    created_at: datetime
    schema_version: str = "v1"


class ExerciseInput(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    category: str = Field(min_length=1, max_length=100)
    duration_minutes: Optional[int] = Field(default=None, ge=1, le=120)
    difficulty: str = Field(default="beginner", pattern="^(beginner|intermediate|advanced)$")
    accessibility_needs: List[str] = Field(default_factory=list, max_length=10)


class Exercise(ExerciseInput):
    id: UUID = Field(default_factory=uuid4)
    lesson_id: Optional[UUID] = None
    created_at: datetime


class LessonInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    content_url: Optional[str] = Field(default=None, max_length=500)
    order: int = Field(ge=0)
    course_id: Optional[UUID] = None


class Lesson(LessonInput):
    id: UUID = Field(default_factory=uuid4)
    course_id: UUID
    created_at: datetime
    schema_version: str = "v1"


class CourseInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    source: str = Field(default="passion_io", max_length=100)  # passion_io, manual, etc.
    source_id: Optional[str] = Field(default=None, max_length=200)


class Course(CourseInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    created_at: datetime
    lesson_count: int = 0
    completed_lessons: int = 0
    schema_version: str = "v1"


class ConsentInput(BaseModel):
    recipient_practitioner_id: str = Field(min_length=1, max_length=120)
    categories: List[DataCategory] = Field(min_length=1)
    purpose: str = Field(min_length=1, max_length=500)
    starts_at: datetime
    expires_at: datetime


class ConsentGrant(ConsentInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    revoked_at: Optional[datetime] = None
    created_at: datetime


class AuditEvent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    actor_id: str
    action: str
    resource_type: str
    resource_id: str
    occurred_at: datetime
    metadata: Dict[str, str] = Field(default_factory=dict)


class AiRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    provider: str = Field(pattern="^(openrouter|anthropic|google|offline)$")
    privacy_mode: str = Field(pattern="^(cloud_byok|offline)$")
    cloud_opt_in: bool = False
    external_research_opt_in: bool = False
    model: Optional[str] = Field(default=None, max_length=120)
    context: Dict[str, Any] = Field(default_factory=dict)
    session_id: Optional[UUID] = None


class AiResponse(BaseModel):
    mode: str
    message: str
    safety_interrupted: bool
    policy_version: str
    context_fields_used: List[str]
    provider: Optional[str] = None
    model: Optional[str] = None
    session_id: Optional[UUID] = None
    tool_actions: List[str] = Field(default_factory=list)


class AppointmentInput(BaseModel):
    practitioner_id: str = Field(min_length=1, max_length=120)
    scheduled_at: datetime
    duration_minutes: int = Field(ge=15, le=180)
    purpose: str = Field(min_length=1, max_length=500)
    notes: Optional[str] = Field(default=None, max_length=1000)


class Appointment(AppointmentInput):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    status: str = Field(default="scheduled", pattern="^(scheduled|completed|cancelled|no_show)$")
    created_at: datetime


class NotificationPreferenceInput(BaseModel):
    enabled: bool = True
    quiet_hours_start: Optional[str] = Field(default=None, pattern="^([01]\d|2[0-3]):[0-5]\d$")
    quiet_hours_end: Optional[str] = Field(default=None, pattern="^([01]\d|2[0-3]):[0-5]\d$")
    check_in_reminder: bool = True
    lesson_reminder: bool = True
    booking_reminder: bool = True
    snooze_minutes: int = Field(default=0, ge=0, le=480)


class NotificationPreference(NotificationPreferenceInput):
    member_id: str
    updated_at: datetime


class SafetyEvent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    member_id: str
    event_type: str = Field(min_length=1, max_length=80)  # crisis_detected, resources_shown, etc.
    policy_version: str
    text_snippet: Optional[str] = Field(default=None, max_length=500)  # redacted
    action_taken: str
    occurred_at: datetime


class AccountExport(BaseModel):
    member_id: str
    exported_at: datetime
    check_ins: List[CheckInRecord] = Field(default_factory=list)
    journal_entries: List[JournalEntry] = Field(default_factory=list)
    ai_sessions: List[AiSession] = Field(default_factory=list)
    recipe_practice_items: List[RecipePracticeItem] = Field(default_factory=list)
    tracker_events: List[TrackerEvent] = Field(default_factory=list)
    consents: List[ConsentGrant] = Field(default_factory=list)
    appointments: List[Appointment] = Field(default_factory=list)


class PrivacyMode(BaseModel):
    mode: str = Field(pattern="^(cloud_byok|offline)$")
    cloud_opt_in: bool = False
    provider: Optional[str] = None


class DailySummary(BaseModel):
    member_id: str
    date: str  # YYYY-MM-DD
    user_reported_facts: List[str] = Field(default_factory=list)
    deterministic_scores: Dict[str, Any] = Field(default_factory=dict)
    ai_reflections: List[str] = Field(default_factory=list)
    wellness_actions_taken: List[str] = Field(default_factory=list)
    safety_events: List[SafetyEvent] = Field(default_factory=list)
    created_at: datetime
