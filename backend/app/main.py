from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional, Tuple

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Response, status

from .auth import auth_store, issue_token, verify_token
from .wellness_assistant import managed_provider_available, respond, get_provider_status
from .mind_nav_agent import agent
from .config import settings
from .models import (
    AiRequest, AiResponse, AuditEvent, AuthLogin, AuthRegister, AuthToken, AuthUser,
    CheckInInput, CheckInRecord, ConsentGrant, ConsentInput, Role,
    JournalEntry, JournalEntryInput, ToolboxItemInput, ToolboxItem, ToolboxPracticeInput,
    TrackerEventInput, TrackerEvent, AppointmentInput, Appointment,
    NotificationPreferenceInput, NotificationPreference, AccountExport,
)
from .sqlite_store import store

@asynccontextmanager
async def lifespan(_: FastAPI):
    if not settings.development and not settings.production_ready:
        raise RuntimeError("production requires a PostgreSQL MIND_NAV_DATABASE_URL")
    yield


app = FastAPI(title="Mind Nav API", version="0.1.0", lifespan=lifespan)


def actor(
    authorization: Optional[str] = Header(default=None),
    x_mind_nav_user: Optional[str] = Header(default=None),
    x_mind_nav_role: Role = Header(default=Role.member),
) -> Tuple[str, Role]:
    if authorization and authorization.lower().startswith("bearer "):
        return verify_token(authorization[7:].strip()), Role.member
    if settings.development:
        return x_mind_nav_user or "dev-member", x_mind_nav_role
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
    x_mind_nav_provider_key: Optional[str] = Header(default=None),
) -> AiResponse:
    actor_id, _ = identity
    result = await respond(payload, x_mind_nav_provider_key)
    audit(actor_id, "ai_process", "assistant_session", result.mode)
    return result

# ── Trends & Patterns ──────────────────────────────────────────

@app.get("/v1/trends/{member_id}")
def get_trends(member_id: str) -> dict[str, object]:
    return store.get_trends(member_id)


@app.get("/v1/patterns/{member_id}")
def detect_patterns(member_id: str) -> list[dict[str, object]]:
    return store.detect_patterns(member_id)


@app.get("/v1/toolbox", response_model=List[ToolboxItem])
def list_toolbox(identity: Tuple[str, Role] = Depends(actor)) -> List[ToolboxItem]:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    return [ToolboxItem(**item) for item in store.get_toolbox_items(member_id)]


@app.post("/v1/toolbox", response_model=ToolboxItem, status_code=status.HTTP_201_CREATED)
def create_toolbox_item(
    payload: ToolboxItemInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> ToolboxItem:
    member_id, role = identity
    if role != Role.member:
        raise HTTPException(status_code=403, detail="member role required")
    item = ToolboxItem(
        **payload.model_dump(),
        member_id=member_id,
        discovered_at=datetime.now(timezone.utc),
    )
    store.add_toolbox_item(item)
    audit(member_id, "create", "toolbox_item", str(item.id))
    return item


@app.patch("/v1/toolbox/{item_id}/favorite", response_model=ToolboxItem)
def favorite_toolbox_item(
    item_id: str,
    payload: dict,
    identity: Tuple[str, Role] = Depends(actor),
) -> ToolboxItem:
    member_id, _ = identity
    item = store.set_toolbox_favorite(member_id, item_id, bool(payload.get("favorite")))
    if not item:
        raise HTTPException(status_code=404, detail="toolbox item not found")
    audit(member_id, "favorite", "toolbox_item", item_id)
    return ToolboxItem(**item)


@app.post("/v1/toolbox/{item_id}/practice", response_model=ToolboxItem)
def practice_toolbox_item(
    item_id: str,
    payload: ToolboxPracticeInput,
    identity: Tuple[str, Role] = Depends(actor),
) -> ToolboxItem:
    member_id, _ = identity
    if str(payload.tool_id) != item_id:
        raise HTTPException(status_code=400, detail="tool id does not match route")
    item = store.record_toolbox_practice(
        member_id, item_id, payload.effectiveness, payload.context,
    )
    if not item:
        raise HTTPException(status_code=404, detail="toolbox item not found")
    audit(member_id, "practice", "toolbox_item", item_id)
    return ToolboxItem(**item)


@app.delete("/v1/toolbox/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_toolbox_item(
    item_id: str,
    identity: Tuple[str, Role] = Depends(actor),
) -> Response:
    member_id, _ = identity
    if not store.delete_toolbox_item(member_id, item_id):
        raise HTTPException(status_code=404, detail="toolbox item not found")
    audit(member_id, "delete", "toolbox_item", item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/v1/toolbox/ai-create")
async def ai_create_toolbox_item(
    payload: dict,
    identity: Tuple[str, Role] = Depends(actor),
    x_mind_nav_provider_key: Optional[str] = Header(default=None),
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
    ai_response = await respond(ai_request, x_mind_nav_provider_key)
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
    item = ToolboxItem(
        name=description[:80].strip().capitalize(),
        description=guidance,
        category=category,
        source="mind-nav-created",
        member_id=member_id,
        discovered_at=datetime.now(timezone.utc),
    )
    store.add_toolbox_item(item)
    audit(member_id, "ai_create", "toolbox_item", str(item.id))
    return {"success": True, "toolbox_item": item.model_dump(mode="json")}


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
    voice = payload.get("voice", "mind_nav_companion")
    
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
