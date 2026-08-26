import os
from datetime import datetime, timedelta, timezone
from uuid import uuid4

os.environ.setdefault("MIND_RECIPE_DB_PATH", "/tmp/mind-recipe-api-tests.sqlite3")

from fastapi.testclient import TestClient

from app.main import app
from app.auth import auth_store
from app.sqlite_store import store
from app.voice_synthesis import VOICE_PRESETS, get_available_voices, prepare_delivery, _delivery_tone
from app.wellness_assistant import _client_conversation
import app.wellness_assistant as wellness_assistant

client = TestClient(app)


def reset_store():
    with store._connect() as conn:
        for table in ("checkins", "consents", "audit_events", "trend_cache", "pattern_alerts", "conversation_memory", "recipe_practice_items", "journey_settings", "recipe_proposals", "memory_cards", "member_events"):
            conn.execute(f"DELETE FROM {table}")
    auth_store.clear()


def test_register_login_and_authenticated_session():
    reset_store()
    registered = client.post("/v1/auth/register", json={
        "email": "navigator@example.com", "display_name": "Navigator", "password": "very-secure-passphrase"})
    assert registered.status_code == 201
    token = registered.json()["access_token"]
    me = client.get("/v1/auth/me", headers={"authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["display_name"] == "Navigator"
    assert client.post("/v1/auth/login", json={
        "email": "navigator@example.com", "password": "wrong-password"}).status_code == 401
    logged_in = client.post("/v1/auth/login", json={
        "email": "navigator@example.com", "password": "very-secure-passphrase"})
    assert logged_in.status_code == 200
    assert logged_in.json()["user"]["email"] == "navigator@example.com"


def test_member_checkin_and_consent_scoped_practitioner_read():
    reset_store()
    headers = {"x-mind-recipe-user": "member-a", "x-mind-recipe-role": "member"}
    checkin = client.post("/v1/checkins", headers=headers, json={
        "emotions": ["Anxious"], "activation": 2, "body_areas": ["Chest"],
        "journal": "A difficult meeting.", "zone_label": "steady",
    })
    assert checkin.status_code == 201
    starts = datetime.now(timezone.utc)
    consent = client.post("/v1/consents", headers=headers, json={
        "recipient_practitioner_id": "practitioner-a", "categories": ["checkins"],
        "purpose": "weekly wellness review", "starts_at": starts.isoformat(),
        "expires_at": (starts + timedelta(days=7)).isoformat(),
    })
    assert consent.status_code == 201
    shared = client.get("/v1/practitioner/members/member-a/checkins", headers={
        "x-mind-recipe-user": "practitioner-a", "x-mind-recipe-role": "practitioner"})
    assert shared.status_code == 200
    assert shared.json()[0]["journal"] == "A difficult meeting."
    revoked = client.delete(f"/v1/consents/{consent.json()['id']}", headers=headers)
    assert revoked.status_code == 204
    assert client.get("/v1/practitioner/members/member-a/checkins", headers={
        "x-mind-recipe-user": "practitioner-a", "x-mind-recipe-role": "practitioner"}).status_code == 404


def test_ai_requires_cloud_opt_in_and_interrupts_crisis_language():
    reset_store()
    no_opt_in = client.post("/v1/assistant/respond", json={
        "text": "I feel worn out", "provider": "openrouter", "privacy_mode": "cloud_byok", "cloud_opt_in": False})
    assert no_opt_in.status_code == 200
    assert no_opt_in.json()["mode"] == "consent_required"
    missing_key = client.post("/v1/assistant/respond", json={
        "text": "I feel worn out", "provider": "openrouter", "privacy_mode": "cloud_byok", "cloud_opt_in": True})
    assert missing_key.json()["mode"] == "provider_key_required"
    crisis = client.post("/v1/assistant/respond", json={
        "text": "I want to kill myself", "provider": "offline", "privacy_mode": "offline"})
    assert crisis.status_code == 200
    assert crisis.json()["safety_interrupted"] is True


def test_voice_presets_are_non_identifying_and_default_to_mind_recipe():
    assert "navigator_companion" in VOICE_PRESETS
    assert "saved_british" in VOICE_PRESETS
    assert "stewie" not in VOICE_PRESETS
    voices = get_available_voices()
    assert all("character" not in voice["description"].lower() for voice in voices)
    status = client.get("/v1/assistant/status")
    assert status.status_code == 200
    assert status.json()["default_model"] == "openrouter/free"


def test_guided_voice_adds_step_pauses_without_slowing_ordinary_chat():
    conversational, conversational_speed, guided = prepare_delivery(
        "I am here with you.", 1.0,
    )
    assert conversational == "I am here with you."
    assert conversational_speed == 1.0
    assert guided is False
    steps, guided_speed, guided = prepare_delivery(
        "First, notice your feet.\nNext, soften your shoulders.\nThen take one breath.", 1.0,
    )
    assert " … " in steps
    assert guided_speed == 0.965
    assert guided is True


def test_voice_shapes_conversation_and_varies_question_inflection():
    spoken, speed, guided = prepare_delivery(
        "I hear how tiring that was. What feels most important now?", 0.97,
    )
    assert " … " in spoken
    assert speed == 0.97
    assert guided is False
    rate, pitch, tone = _delivery_tone(spoken)
    assert (rate, pitch, tone) == (0, 2, "curious")


def test_client_conversation_becomes_native_turns_without_current_duplicate():
    history = _client_conversation([
        {"role": "member", "text": "Work was rough."},
        {"role": "assistant", "text": "What made it rough?"},
        {"role": "member", "text": "My manager dismissed me."},
    ], "My manager dismissed me.")
    assert history == [
        {"role": "user", "content": "Work was rough."},
        {"role": "assistant", "content": "What made it rough?"},
    ]


def test_cloud_assistant_receives_follow_up_as_real_dialogue(monkeypatch):
    reset_store()
    captured = {}

    async def fake_provider(provider, messages, model, provider_key, temperature=0.82, max_tokens=360):
        captured["messages"] = messages
        return "Being dismissed by your manager sounds like the part that stayed with you."

    monkeypatch.setattr(wellness_assistant, "_call_provider", fake_provider)
    response = client.post(
        "/v1/assistant/respond",
        headers={"x-mind-recipe-provider-key": "ephemeral-test-key"},
        json={
            "text": "That is what bothered me most.",
            "provider": "openrouter",
            "privacy_mode": "cloud_byok",
            "cloud_opt_in": True,
            "session_id": str(uuid4()),
            "context": {"conversation": [
                {"role": "member", "text": "My manager dismissed my work."},
                {"role": "assistant", "text": "Did the dismissal or the setting affect you more?"},
                {"role": "member", "text": "That is what bothered me most."},
            ]},
        },
    )
    assert response.status_code == 200
    turns = captured["messages"]
    assert turns[1] == {"role": "user", "content": "My manager dismissed my work."}
    assert turns[2]["role"] == "assistant"
    assert turns[-1]["role"] == "user"
    assert "That is what bothered me most." in turns[-1]["content"]


def test_authenticated_recipe_practice_crud_and_practice_persist():
    reset_store()
    registered = client.post("/v1/auth/register", json={
        "email": "tools@example.com", "display_name": "Tools", "password": "very-secure-passphrase"})
    token = registered.json()["access_token"]
    headers = {"authorization": f"Bearer {token}"}
    created = client.post("/v1/recipes/practices", headers=headers, json={
        "name": "Two-minute reset", "category": "Grounding",
        "description": "Name five neutral details nearby.", "source": "self-discovered",
    })
    assert created.status_code == 201
    item_id = created.json()["id"]
    assert client.get("/v1/recipes/practices", headers=headers).json()[0]["name"] == "Two-minute reset"
    favorite = client.patch(
        f"/v1/recipes/practices/{item_id}/favorite", headers=headers, json={"favorite": True})
    assert favorite.json()["is_favorite"] is True
    practice = client.post(
        f"/v1/recipes/practices/{item_id}/practice", headers=headers,
        json={"tool_id": item_id, "effectiveness": 4, "context": "After work"},
    )
    assert practice.json()["practice_count"] == 1
    assert practice.json()["effectiveness_ratings"] == [4]
    assert client.delete(f"/v1/recipes/practices/{item_id}", headers=headers).status_code == 204
    assert client.get("/v1/recipes/practices", headers=headers).json() == []


def test_adaptive_journey_recipe_approval_memory_and_pulse_event():
    reset_store()
    registered = client.post("/v1/auth/register", json={
        "email": "journey@example.com", "display_name": "Journey", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {registered.json()['access_token']}"}
    journey = client.put("/v1/journey", headers=headers, json={
        "mode": "co_created", "active_goal": "sleep more steadily", "preferred_duration_minutes": 3,
    })
    assert journey.status_code == 200
    assert journey.json()["mode"] == "co_created"
    assert journey.json()["recommended_module_id"] == "lesson-4"
    proposal = client.post("/v1/recipes/proposals", headers=headers, json={
        "name": "Evening pause", "purpose": "Wind down", "duration_minutes": 3,
        "steps": ["Pause", "Breathe"], "rationale": "A short option before bed.",
    })
    assert proposal.status_code == 201
    approved = client.post(f"/v1/recipes/proposals/{proposal.json()['id']}/decision", headers=headers, json={"approved": True})
    assert approved.json()["status"] == "approved"
    assert client.get("/v1/recipes/practices", headers=headers).json()[0]["source"] == "navigator-approved"
    memory = client.post("/v1/memory", headers=headers, json={"kind": "preference", "content": "Keep practices short."})
    assert memory.status_code == 201
    assert client.get("/v1/memory", headers=headers).json()[0]["content"] == "Keep practices short."
    event = client.post("/v1/member-events", headers=headers, json=[{
        "id": "navigation-event-001", "kind": "daily_navigation_completed", "recorded_at": None,
        "occurred_at": datetime.now(timezone.utc).isoformat(), "source": "mobile",
    }])
    assert event.status_code == 200
    assert client.get("/v1/pulse/today", headers=headers).json()["recent_events"][0]["kind"] == "daily_navigation_completed"


def test_agent_requires_explicit_approval_for_external_research_and_skill_activation():
    reset_store()
    headers = {"x-mind-recipe-user": "member-a", "x-mind-recipe-role": "member"}
    status = client.get("/v1/agent/status")
    assert status.status_code == 200
    assert status.json()["device_control"] == "disabled"
    assert status.json()["source_code_writes"] == "disabled"

    plan = client.post("/v1/agent/plan", headers=headers, json={
        "text": "Can you research evidence for breathing exercises?",
        "external_research_opt_in": False,
    })
    assert plan.status_code == 200
    assert plan.json()["tools"] == ["evidence_research"]
    assert plan.json()["requires_approval"] is True

    proposed = client.post("/v1/agent/skill-proposals", headers=headers, json={
        "goal": "Create a short evening wind-down practice",
    })
    assert proposed.status_code == 200
    assert proposed.json()["status"] == "proposed"
    assert proposed.json()["execution"] == "declarative_only"
    proposal_id = proposed.json()["id"]
    blocked = client.post(
        f"/v1/agent/skill-proposals/{proposal_id}/activate",
        headers=headers,
        json={"member_approved": False},
    )
    assert blocked.json()["status"] == "proposed"
    active = client.post(
        f"/v1/agent/skill-proposals/{proposal_id}/activate",
        headers=headers,
        json={"member_approved": True},
    )
    assert active.json()["status"] == "active"
