from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json
from typing import List, Optional, Tuple

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Response, status
from fastapi.responses import StreamingResponse

from .auth import auth_store, issue_token, verify_token
from .wellness_assistant import managed_provider_available, respond, get_provider_status
from .navigator_agent import agent
from .config import settings
from .models import (
    AiRequest, AiResponse, AuditEvent, AuthLogin, AuthRegister, AuthResetConfirm, AuthResetRequest, AuthToken, AuthUser,
    CheckInInput, CheckInRecord, ConsentGrant, ConsentInput, Role,
    JournalEntry, JournalEntryInput, RecipePracticeItemInput, RecipePracticeItem, RecipePracticePracticeInput,
    CurriculumProgress, CurriculumProgressInput,
    TrackerEventInput, TrackerEvent, AppointmentInput, Appointment,
    NotificationPreferenceInput, NotificationPreference, AccountExport,
    JourneySettings, JourneySettingsInput, RecipeProposal, RecipeProposalInput,
    RecipeProposalDecision, MemoryCard, MemoryCardInput, MemberEventInput,
)
from .sqlite_store import store

@asynccontextmanager
async def lifespan(_: FastAPI):
    if not settings.development and not settings.production_ready:
        raise RuntimeError("production requires a PostgreSQL MIND_RECIPE_DATABASE_URL")
    yield


app = FastAPI(title="Mind Recipe API", version="0.1.0", lifespan=lifespan)


def actor(
    authorization: Optional[str] = Header(default=None),
    x_mind_recipe_user: Optional[str] = Header(default=None),
    x_mind_recipe_role: Role = Header(default=Role.member),
) -> Tuple[str, Role]:
    if authorization and authorization.lower().startswith("bearer "):
        return verify_token(authorization[7:].strip()), Role.member
    if settings.development:
        return x_mind_recipe_user or "dev-member", x_mind_recipe_role
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="authenticated bearer identity required")


def audit(actor_id: str, action: str, resource_type: str, resource_id: str) -> None:
    store.audit(AuditEvent(actor_id=actor_id, action=action, resource_type=resource_type,
                           resource_id=resource_id, occurred_at=datetime.now(timezone.utc)))



@app.get("/v1/agent/status")
def agent_status() -> dict[str, object]:
    return agent.status()


@app.post("/v1/agent/plan")
def agent_plan(payload: dict[str, object], identity: Tuple[str, Role] = Depends(actor)) -> dict[str, object]:
    actor_id, _ = identity
    text = str(payload.get("text", ""))
    plan = agent.plan(text, external_research_approved=bool(payload.get("external_research_opt_in", False)))
    audit(actor_id, "agent_plan", "assistant", plan["tools"][0])
    return plan


@app.post("/v1/agent/research")
async def agent_research(payload: dict[str, object], identity: Tuple[str, Role] = Depends(actor)) -> dict[str, object]:
    actor_id, _ = identity
    result = await agent.research(str(payload.get("query", "")), approved=bool(payload.get("external_research_opt_in", False)))
    audit(actor_id, "agent_research", "public_sources", result.get("status", "unknown"))
    return result


@app.post("/v1/agent/skill-proposals")
def create_skill_proposal(payload: dict[str, object], identity: Tuple[str, Role] = Depends(actor)) -> dict[str, object]:
    actor_id, _ = identity
    proposal = agent.propose_skill(str(payload.get("goal", "")))
    audit(actor_id, "agent_skill_proposed", "skill_proposal", proposal["id"])
    return proposal


@app.post("/v1/agent/skill-proposals/{proposal_id}/activate")
def activate_skill_proposal(proposal_id: str, payload: dict[str, object], identity: Tuple[str, Role] = Depends(actor)) -> dict[str, object]:
    actor_id, _ = identity
    result = agent.activate_skill(proposal_id, approved=bool(payload.get("member_approved", False)))
    audit(actor_id, "agent_skill_activation", "skill_proposal", proposal_id)
    return result


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}


@app.get("/v1/assistant/status")
def assistant_status() -> dict[str, object]:
    provider_status = get_provider_status()
    any_available = any(provider_status.values())
    return {
        "providers": provider_status,
        "available": any_available,
        "mode": "managed" if any_available else "byok",
        "default_model": "openrouter/free",
    }


def auth_response(account) -> AuthToken:
    return AuthToken(access_token=issue_token(account), user=AuthUser(
        id=account.id, email=account.email, display_name=account.display_name))


@app.post("/v1/auth/register", response_model=AuthToken, status_code=status.HTTP_201_CREATED)
def register(payload: AuthRegister) -> AuthToken:
    return auth_response(auth_store.register(payload.email, payload.display_name, payload.password))


@app.post("/v1/auth/login", response_model=AuthToken)
def login(payload: AuthLogin) -> AuthToken:
    return auth_response(auth_store.authenticate(payload.email, payload.password))


@app.post("/v1/auth/reset/request")
def request_password_reset(payload: AuthResetRequest) -> dict[str, str]:
    """Start password reset. Always returns 200 to avoid account enumeration.

    In development/staging the token is returned so the member can finish the
    flow without an email provider. Production wires this to the mailer.
    """
    token = auth_store.create_reset_token(payload.email)
    response: dict[str, str] = {
        "status": "ok",
        "message": "If that email has an account, a reset link is on its way.",
    }
    if token is not None and settings.development:
        response["reset_token"] = token
    if token is not None:
        audit("anonymous", "password_reset_request", "account", payload.email)
    return response


@app.post("/v1/auth/reset/confirm", response_model=AuthToken)
def confirm_password_reset(payload: AuthResetConfirm) -> AuthToken:
    """Complete password reset and sign the member in with the new password."""
    account = auth_store.reset_password(payload.email, payload.token, payload.new_password)
    auth_store.clear_reset_token(payload.email)
    audit(account.id, "password_reset_complete", "account", account.id)
    return auth_response(account)


@app.get("/v1/auth/me", response_model=AuthUser)
def me(identity: Tuple[str, Role] = Depends(actor)) -> AuthUser:
    actor_id, role = identity
    account = auth_store.users_by_id.get(actor_id)
    if not account:
        raise HTTPException(status_code=404, detail="account not found")
    return AuthUser(id=account.id, email=account.email, display_name=account.display_name, role=role)


@app.post("/v1/checkins", response_model=CheckInRecord, status_code=status.HTTP_201_CREATED)
def create_checkin(payload: CheckInInput, identity: Tuple[str, Role] = Depends(actor)) -> CheckInRecord:
    actor_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="only members can create check-ins")
    record = CheckInRecord(**payload.model_dump(), member_id=actor_id, created_at=datetime.now(timezone.utc),
                           policy_version=settings.policy_version)
    store.add_checkin(record)
    audit(actor_id, "create", "checkin", str(record.id))
    return record


@app.post("/v1/consents", response_model=ConsentGrant, status_code=status.HTTP_201_CREATED)
def create_consent(payload: ConsentInput, identity: Tuple[str, Role] = Depends(actor)) -> ConsentGrant:
    actor_id, role = identity
    if role != Role.member or payload.expires_at <= payload.starts_at:
        raise HTTPException(status_code=400, detail="invalid member consent")
    grant = ConsentGrant(**payload.model_dump(), member_id=actor_id, created_at=datetime.now(timezone.utc))
    store.add_consent(grant)
    audit(actor_id, "grant", "consent", str(grant.id))
    return grant


@app.delete("/v1/consents/{grant_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_consent(grant_id: str, identity: Tuple[str, Role] = Depends(actor)) -> Response:
    actor_id, role = identity
    grant = next(
        (grant for grant in store.get_active_consents(actor_id) if str(grant["id"]) == grant_id),
        None,
    )
    if not grant or role != Role.member:
        raise HTTPException(status_code=404, detail="consent not found")
    store.revoke_consent(grant_id, actor_id)
    audit(actor_id, "revoke", "consent", grant_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/v1/practitioner/members/{member_id}/checkins", response_model=List[CheckInRecord])
def practitioner_checkins(member_id: str, identity: Tuple[str, Role] = Depends(actor)) -> List[CheckInRecord]:
    actor_id, role = identity
    if role != Role.practitioner:
        raise HTTPException(status_code=403, detail="practitioner role required")
    records = store.shared_checkins(member_id, actor_id)
    if not records:
        raise HTTPException(status_code=404, detail="no active check-in consent")
    audit(actor_id, "read_shared", "checkin", member_id)
    return records


@app.post("/v1/assistant/respond", response_model=AiResponse)
async def assistant(
    payload: AiRequest,
    identity: Tuple[str, Role] = Depends(actor),
    x_mind_recipe_provider_key: Optional[str] = Header(default=None),
) -> AiResponse:
    actor_id, _ = identity
    # Curriculum progress is authoritative server-side context. Navigator can
    # keep up across devices without trusting a client-supplied member id or
    # requiring the app to resend durable learning history on every turn.
    assistant_context = dict(payload.context)
    assistant_context["member_id"] = actor_id
    progress = store.get_curriculum_progress(actor_id)
    if progress is not None:
        assistant_context["curriculum_progress"] = progress
    assistant_context["journey"] = store.get_journey_settings(actor_id)
    assistant_context["pulse"] = store.pulse_summary(actor_id)
    result = await respond(
        payload.model_copy(update={"context": assistant_context}),
        x_mind_recipe_provider_key,
    )
    audit(actor_id, "ai_process", "assistant_session", result.mode)
    return result


@app.post("/v1/navigator/turn")
async def navigator_turn(
    payload: AiRequest,
    identity: Tuple[str, Role] = Depends(actor),
    x_mind_recipe_provider_key: Optional[str] = Header(default=None),
) -> StreamingResponse:
    """A stable event stream so the app can show progress without waiting on a full reply."""
    actor_id, _ = identity

    async def events():
        yield "event: accepted\ndata: {}\n\n"
        context = dict(payload.context)
        context["member_id"] = actor_id
        context["journey"] = store.get_journey_settings(actor_id)
        context["pulse"] = store.pulse_summary(actor_id)
        result = await respond(payload.model_copy(update={"context": context}), x_mind_recipe_provider_key)
        safe = result.model_dump(mode="json")
        yield f"event: delta\ndata: {json.dumps({'text': safe['message']})}\n\n"
        yield f"event: done\ndata: {json.dumps(safe)}\n\n"
        audit(actor_id, "ai_stream", "navigator_turn", result.mode)

    return StreamingResponse(events(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})

# ── Trends & Patterns ──────────────────────────────────────────

@app.get("/v1/trends/{member_id}")
def get_trends(member_id: str) -> dict[str, object]:
    return store.get_trends(member_id)


@app.get("/v1/patterns/{member_id}")
def detect_patterns(member_id: str) -> list[dict[str, object]]:
    return store.detect_patterns(member_id)


@app.get("/v1/recipes/practices", response_model=List[RecipePracticeItem])
def list_recipe_practice(identity: Tuple[str, Role] = Depends(actor)) -> List[RecipePracticeItem]:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    return [RecipePracticeItem(**item) for item in store.get_recipe_practice_items(member_id)]


@app.get("/v1/recipes/progress", response_model=CurriculumProgress)
def get_curriculum_progress(identity: Tuple[str, Role] = Depends(actor)) -> CurriculumProgress:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    progress = store.get_curriculum_progress(member_id)
    if progress is None:
        progress = {
            "member_id": member_id,
            "curriculum_version": "2026.08.24",
            "completed_lesson_ids": [],
            "completed_practice_ids": [],
            "current_lesson_id": "lesson-1",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    return CurriculumProgress(**progress)


@app.put("/v1/recipes/progress", response_model=CurriculumProgress)
def put_curriculum_progress(
    payload: CurriculumProgressInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> CurriculumProgress:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    merged = store.merge_curriculum_progress(
        member_id,
        {**payload.model_dump(), "updated_at": payload.updated_at.isoformat()},
    )
    audit(member_id, "update", "curriculum_progress", payload.curriculum_version)
    return CurriculumProgress(**merged)


# ── Personal Journey, memory, and Pulse ────────────────────────────

@app.get("/v1/journey", response_model=JourneySettings)
def get_journey(identity: Tuple[str, Role] = Depends(actor)) -> JourneySettings:
    member_id, _ = identity
    return JourneySettings(**store.get_journey_settings(member_id))


@app.put("/v1/journey", response_model=JourneySettings)
def put_journey(
    payload: JourneySettingsInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> JourneySettings:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    result = store.save_journey_settings(member_id, payload.model_dump(mode="json"))
    audit(member_id, "update", "journey", result["mode"])
    return JourneySettings(**result)


@app.get("/v1/recipes/proposals", response_model=List[RecipeProposal])
def list_recipe_proposals(identity: Tuple[str, Role] = Depends(actor)) -> List[RecipeProposal]:
    member_id, _ = identity
    return [RecipeProposal(**proposal) for proposal in store.get_recipe_proposals(member_id)]


@app.post("/v1/recipes/proposals", response_model=RecipeProposal, status_code=status.HTTP_201_CREATED)
def create_recipe_proposal(
    payload: RecipeProposalInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> RecipeProposal:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    proposal = store.create_recipe_proposal(member_id, payload.model_dump(mode="json"))
    audit(member_id, "propose", "recipe", proposal["id"])
    return RecipeProposal(**proposal)


@app.post("/v1/recipes/proposals/{proposal_id}/decision", response_model=RecipeProposal)
def decide_recipe_proposal(
    proposal_id: str,
    payload: RecipeProposalDecision,
    identity: Tuple[str, Role] = Depends(actor),
) -> RecipeProposal:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    edits = payload.edits.model_dump(mode="json") if payload.edits else None
    proposal = store.decide_recipe_proposal(member_id, proposal_id, payload.approved, edits)
    if not proposal:
        raise HTTPException(status_code=404, detail="pending recipe proposal not found")
    if payload.approved:
        item = RecipePracticeItem(
            name=proposal["name"], category="Personalized", description="\n".join(proposal["steps"]),
            accessibility_needs=[], source="navigator-approved", member_id=member_id,
            discovered_at=datetime.now(timezone.utc),
        )
        store.add_recipe_practice_item(item)
    audit(member_id, "approve" if payload.approved else "decline", "recipe_proposal", proposal_id)
    return RecipeProposal(**proposal)


@app.get("/v1/memory", response_model=List[MemoryCard])
def list_memory(identity: Tuple[str, Role] = Depends(actor)) -> List[MemoryCard]:
    member_id, _ = identity
    return [MemoryCard(**item) for item in store.list_memory_cards(member_id)]


@app.post("/v1/memory", response_model=MemoryCard, status_code=status.HTTP_201_CREATED)
def create_memory(payload: MemoryCardInput, identity: Tuple[str, Role] = Depends(actor)) -> MemoryCard:
    member_id, _ = identity
    item = store.save_memory_card(member_id, payload.model_dump())
    audit(member_id, "create", "memory_card", item["id"])
    return MemoryCard(**item)


@app.put("/v1/memory/{card_id}", response_model=MemoryCard)
def update_memory(card_id: str, payload: MemoryCardInput, identity: Tuple[str, Role] = Depends(actor)) -> MemoryCard:
    member_id, _ = identity
    item = store.save_memory_card(member_id, payload.model_dump(), card_id)
    if not item:
        raise HTTPException(status_code=404, detail="memory card not found")
    audit(member_id, "update", "memory_card", card_id)
    return MemoryCard(**item)


@app.delete("/v1/memory/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(card_id: str, identity: Tuple[str, Role] = Depends(actor)) -> Response:
    member_id, _ = identity
    if not store.delete_memory_card(member_id, card_id):
        raise HTTPException(status_code=404, detail="memory card not found")
    audit(member_id, "forget", "memory_card", card_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/v1/member-events")
def add_member_events(payload: List[MemberEventInput], identity: Tuple[str, Role] = Depends(actor)) -> dict[str, int]:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    added = store.add_member_events(member_id, [
        {**event.model_dump(mode="json"), "occurred_at": event.occurred_at.isoformat()} for event in payload
    ])
    audit(member_id, "ingest", "member_events", str(added))
    return {"accepted": added}


@app.get("/v1/pulse/today")
def get_pulse(identity: Tuple[str, Role] = Depends(actor)) -> dict[str, object]:
    member_id, _ = identity
    return store.pulse_summary(member_id)


@app.post("/v1/recipes/practices", response_model=RecipePracticeItem, status_code=status.HTTP_201_CREATED)
def create_recipe_practice_item(
    payload: RecipePracticeItemInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> RecipePracticeItem:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    item = RecipePracticeItem(
        **payload.model_dump(),
        member_id=member_id,
        discovered_at=datetime.now(timezone.utc),
    )
    store.add_recipe_practice_item(item)
    audit(member_id, "create", "recipe_practice_item", str(item.id))
    return item


@app.patch("/v1/recipes/practices/{item_id}/favorite", response_model=RecipePracticeItem)
def favorite_recipe_practice_item(
    item_id: str,
    payload: dict,
    identity: Tuple[str, Role] = Depends(actor),
) -> RecipePracticeItem:
    member_id, _ = identity
    item = store.set_recipe_practice_favorite(member_id, item_id, bool(payload.get("favorite")))
    if not item:
        raise HTTPException(status_code=404, detail="recipe practice not found")
    audit(member_id, "favorite", "recipe_practice_item", item_id)
    return RecipePracticeItem(**item)


@app.post("/v1/recipes/practices/{item_id}/practice", response_model=RecipePracticeItem)
def practice_recipe_practice_item(
    item_id: str,
    payload: RecipePracticePracticeInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> RecipePracticeItem:
    member_id, _ = identity
    if str(payload.tool_id) != item_id:
        raise HTTPException(status_code=400, detail="tool id does not match route")
    item = store.record_recipe_practice_practice(
        member_id, item_id, payload.effectiveness, payload.context,
    )
    if not item:
        raise HTTPException(status_code=404, detail="recipe practice not found")
    audit(member_id, "practice", "recipe_practice_item", item_id)
    return RecipePracticeItem(**item)


@app.delete("/v1/recipes/practices/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe_practice_item(
    item_id: str,
    identity: Tuple[str, Role] = Depends(actor),
) -> Response:
    member_id, _ = identity
    if not store.delete_recipe_practice_item(member_id, item_id):
        raise HTTPException(status_code=404, detail="recipe practice not found")
    audit(member_id, "delete", "recipe_practice_item", item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/v1/recipes/practices/ai-create")
async def ai_create_recipe_practice_item(
    payload: dict,
    identity: Tuple[str, Role] = Depends(actor),
    x_mind_recipe_provider_key: Optional[str] = Header(default=None),
) -> dict[str, object]:
    """Create and persist a bounded personalized wellness practice."""
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    description = str(payload.get("description", "")).strip()
    if not description:
        raise HTTPException(status_code=422, detail="describe the practice you need")

    trends = store.get_trends(member_id)
    patterns = store.detect_patterns(member_id)
    research_prompt = (
        "Create one concise wellness practice. Do not diagnose or prescribe. "
        f"Member request: {description}. "
        f"Recent emotions: {trends.get('top_emotions', [])[:3]}. "
        f"Patterns: {[p['type'] for p in patterns]}. "
        "Give a short rationale and 3 numbered steps."
    )
    ai_request = AiRequest(
        text=research_prompt,
        provider="openrouter",
        privacy_mode="cloud_byok",
        cloud_opt_in=True,
        context={"member_id": member_id},
    )
    ai_response = await respond(ai_request, x_mind_recipe_provider_key)
    if ai_response.mode == "cloud_ai":
        guidance = ai_response.message
    else:
        guidance = (
            f"Use this when you notice the need for {description.lower()}. "
            "1. Pause and name what is present without judging it. "
            "2. Choose one small action that feels manageable for the next two minutes. "
            "3. Check again and record whether it helped."
        )
    lowered = description.lower()
    category = (
        "Breathing" if "breath" in lowered else
        "Movement" if any(word in lowered for word in ("walk", "move", "stretch")) else
        "Reflection" if any(word in lowered for word in ("journal", "reflect", "thought")) else
        "Grounding"
    )
    proposal = store.create_recipe_proposal(member_id, {
        "name": description[:80].strip().capitalize(),
        "purpose": f"A short {category.lower()} practice tailored to the need you described.",
        "trigger": description[:300],
        "duration_minutes": 3,
        "steps": [line.strip(" 1234567890.") for line in guidance.splitlines() if line.strip()][:6] or [guidance],
        "evidence_basis": "Reviewed wellness practice; personal adaptation requires your approval.",
        "cautions": ["Stop or adapt if this does not feel useful."],
        "rationale": "Navigator drafted this from your request. Review it before it becomes part of your active Recipes.",
        "source_kind": "navigator_proposal",
    })
    audit(member_id, "ai_propose", "recipe_proposal", proposal["id"])
    return {"success": True, "recipe_proposal": proposal}


@app.get("/v1/audit/{actor_id}")
def get_audit(actor_id: str, limit: int = 50) -> list[dict[str, object]]:
    return store.get_audit_trail(actor_id, limit)


# ── Practitioner consent listing ───────────────────────────────

@app.get("/v1/consents/{member_id}")
def list_consents(member_id: str) -> list[dict[str, object]]:
    return store.get_active_consents(member_id)



# ── FHIR Export Endpoints ──────────────────────────────────────

@app.get("/v1/fhir/export/{member_id}")
def export_fhir(member_id: str, format: str = "json") -> dict[str, object]:
    """Export member data as FHIR R4 Bundle."""
    from .fhir_mapper import fhir
    
    checkins = store.get_member_checkins(member_id, days=365)
    trends = store.get_trends(member_id)
    consents = store.get_active_consents(member_id)
    
    resources = []
    
    # Patient resource
    resources.append(fhir.patient(member_id, member_id.split("@")[0], member_id))
    
    # Check-in observations
    for c in checkins:
        emotions = c.get("emotions", "[]")
        if isinstance(emotions, str):
            import json
            emotions = json.loads(emotions)
        resources.append(fhir.observation(member_id, "mood", ", ".join(emotions[:3])))
        resources.append(fhir.observation(member_id, "activation", c.get("activation", 0), "scale"))
    
    # Trend observations
    if trends.get("total_checkins", 0) > 0:
        resources.append(fhir.observation(member_id, "checkin-count", trends["total_checkins"]))
        resources.append(fhir.observation(member_id, "avg-activation", trends.get("avg_activation", 0), "scale"))
    
    # Consent resources
    for c in consents:
        categories = c.get("categories", "[]")
        if isinstance(categories, str):
            import json
            categories = json.loads(categories)
        resources.append(fhir.consent(
            grant_id=c.get("id", ""),
            member_id=member_id,
            practitioner_id=c.get("recipient_practitioner_id", ""),
            categories=categories,
            purpose=c.get("purpose", ""),
            starts_at=datetime.fromisoformat(c.get("starts_at", datetime.now(timezone.utc).isoformat())),
            expires_at=datetime.fromisoformat(c.get("expires_at", datetime.now(timezone.utc).isoformat())),
        ))
    
    return {"resourceType": "Bundle", "type": "collection", "entry": [{"resource": r} for r in resources]}


@app.get("/v1/fhir/export-csv/{member_id}")
def export_fhir_csv(member_id: str) -> str:
    """Export check-ins as CSV for FHIR mapping."""
    from .fhir_mapper import fhir
    checkins = store.get_member_checkins(member_id, days=365)
    return fhir.export_csv(checkins)


# ── Voice Synthesis Endpoint ─────────────────────────────────────

@app.post("/v1/voice/synthesize")
async def voice_synthesize(payload: dict) -> dict[str, object]:
    """Synthesize text to natural speech using Edge TTS."""
    from .voice_synthesis import synthesize, get_available_voices
    
    text = payload.get("text", "")
    speed = payload.get("speed", 1.0)
    voice = payload.get("voice", "navigator_companion")
    
    if not text:
        return {"error": "No text provided"}
    
    try:
        result = synthesize(text, speed=speed, voice=voice)
        result["voices"] = get_available_voices()
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get("/v1/voice/voices")
async def voice_list() -> dict[str, object]:
    """List available voice models."""
    from .voice_synthesis import get_available_voices
    return {"voices": get_available_voices()}
