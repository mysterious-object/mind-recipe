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
        for table in ("checkins", "consents", "audit_events", "trend_cache", "pattern_alerts", "conversation_memory", "recipe_practice_items", "practice_outcomes", "practice_recommendation_feedback", "commitments", "safety_events", "journey_settings", "recipe_proposals", "memory_cards", "memory_proposals", "member_events", "notification_preferences"):
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


def test_member_export_notification_preferences_and_confirmed_account_deletion():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "controls@example.com", "display_name": "Controls", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    client.post("/v1/checkins", headers=headers, json={
        "client_id": "controls-checkin-001", "emotions": ["Steady"], "activation": 0,
    })
    preferences = client.put("/v1/notification-preferences", headers=headers, json={
        "enabled": True, "quiet_hours_start": "22:00", "quiet_hours_end": "07:00",
        "check_in_reminder": True, "lesson_reminder": False, "booking_reminder": True,
        "snooze_minutes": 0, "morning_time": "08:30", "midday_time": "13:00",
        "evening_time": "19:30", "active_weekdays": [1, 3, 5], "message_style": "gentle",
    })
    assert preferences.status_code == 200
    assert preferences.json()["active_weekdays"] == [1, 3, 5]
    exported = client.get("/v1/account/export", headers=headers)
    assert exported.status_code == 200
    assert exported.json()["checkins"][0]["emotions"] == ["Steady"]
    assert exported.json()["notification_preferences"]["message_style"] == "gentle"
    assert client.delete("/v1/account", headers=headers, json={"confirmation": "REMOVE"}).status_code == 422
    assert client.delete("/v1/account", headers=headers, json={"confirmation": "DELETE"}).status_code == 204
    assert client.get("/v1/auth/me", headers=headers).status_code == 404


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
    assert shared.json()[0]["journal"] is None
    revoked = client.delete(f"/v1/consents/{consent.json()['id']}", headers=headers)
    assert revoked.status_code == 204
    assert client.get("/v1/practitioner/members/member-a/checkins", headers={
        "x-mind-recipe-user": "practitioner-a", "x-mind-recipe-role": "practitioner"}).status_code == 404


def test_provisioned_practitioner_bearer_identity_can_read_only_consented_checkins():
    reset_store()
    member = client.post("/v1/auth/register", json={
        "email": "member-care@example.com", "display_name": "Member", "password": "very-secure-passphrase"})
    practitioner = client.post("/v1/auth/register", json={
        "email": "practitioner-care@example.com", "display_name": "Practitioner", "password": "very-secure-passphrase"})
    member_headers = {"authorization": f"Bearer {member.json()['access_token']}"}
    practitioner_id = practitioner.json()["user"]["id"]
    auth_store.provision_role(practitioner_id, "practitioner")
    practitioner_login = client.post("/v1/auth/login", json={
        "email": "practitioner-care@example.com", "password": "very-secure-passphrase"})
    practitioner_headers = {"authorization": f"Bearer {practitioner_login.json()['access_token']}"}
    assert practitioner_login.json()["user"]["role"] == "practitioner"
    client.post("/v1/checkins", headers=member_headers, json={
        "client_id": "care-checkin-001", "emotions": ["Tense"], "activation": 2,
    })
    starts = datetime.now(timezone.utc)
    client.post("/v1/consents", headers=member_headers, json={
        "recipient_practitioner_id": practitioner_id, "categories": ["checkins"],
        "purpose": "wellness review", "starts_at": starts.isoformat(),
        "expires_at": (starts + timedelta(days=7)).isoformat(),
    })
    member_id = member.json()["user"]["id"]
    shared = client.get(
        f"/v1/practitioner/members/{member_id}/checkins", headers=practitioner_headers,
    )
    assert shared.status_code == 200
    assert shared.json()[0]["emotions"] == ["Tense"]
    summary = client.get(
        f"/v1/practitioner/members/{member_id}/summary", headers=practitioner_headers,
    )
    assert summary.status_code == 200
    assert summary.json()["shared_categories"] == ["checkins"]


def test_checkin_retry_is_idempotent_and_trends_are_scoped_to_the_member():
    reset_store()
    first = client.post("/v1/auth/register", json={
        "email": "first@example.com", "display_name": "First", "password": "very-secure-passphrase"})
    second = client.post("/v1/auth/register", json={
        "email": "second@example.com", "display_name": "Second", "password": "very-secure-passphrase"})
    first_headers = {"authorization": f"Bearer {first.json()['access_token']}"}
    second_headers = {"authorization": f"Bearer {second.json()['access_token']}"}
    payload = {
        "client_id": "daily-nav-retry-001",
        "emotions": ["Anxious"],
        "activation": 2,
        "body_areas": ["Chest"],
        "zone_label": "steady",
    }
    created = client.post("/v1/checkins", headers=first_headers, json=payload)
    retried = client.post("/v1/checkins", headers=first_headers, json=payload)
    assert created.status_code == retried.status_code == 201
    assert created.json()["id"] == retried.json()["id"]
    assert client.post("/v1/checkins", headers=second_headers, json={
        **payload, "client_id": "daily-nav-second-001", "emotions": ["Calm"], "activation": -1,
    }).status_code == 201

    first_trends = client.get("/v1/trends", headers=first_headers)
    second_trends = client.get("/v1/trends", headers=second_headers)
    assert first_trends.status_code == second_trends.status_code == 200
    assert first_trends.json()["total_checkins"] == 1
    assert second_trends.json()["total_checkins"] == 1
    assert first_trends.json()["top_emotions"] == [["Anxious", 1]]
    assert second_trends.json()["top_emotions"] == [["Calm", 1]]
    assert client.get("/v1/patterns", headers=first_headers).status_code == 200
    assert client.get(
        "/v1/trends", headers={"authorization": "Bearer invalid"}
    ).status_code == 401
    assert client.get("/v1/trends/member-a", headers=first_headers).status_code == 404
    assert client.get("/v1/patterns/member-a", headers=first_headers).status_code == 404


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
    events = client.get("/v1/safety/events", headers={
        "x-mind-recipe-user": "dev-member", "x-mind-recipe-role": "member"})
    assert events.status_code == 200
    assert events.json()[0]["action_taken"] == "resources_shown"


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


def test_practice_outcomes_are_idempotent_and_yield_member_scoped_insights():
    reset_store()
    first = client.post("/v1/auth/register", json={
        "email": "outcomes@example.com", "display_name": "Outcomes", "password": "very-secure-passphrase"})
    second = client.post("/v1/auth/register", json={
        "email": "other-outcomes@example.com", "display_name": "Other", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {first.json()['access_token']}"}
    other_headers = {"authorization": f"Bearer {second.json()['access_token']}"}
    item = client.post("/v1/recipes/practices", headers=headers, json={
        "name": "Desk reset", "category": "Grounding", "source": "self-discovered"}).json()
    payload = {
        "tool_id": item["id"], "client_id": "practice-attempt-001", "effectiveness": 4,
        "context": "Before a meeting", "before_activation": 3, "after_activation": 1,
        "outcome_confidence": 4,
    }
    assert client.post(f"/v1/recipes/practices/{item['id']}/practice", headers=headers, json=payload).status_code == 200
    retried = client.post(f"/v1/recipes/practices/{item['id']}/practice", headers=headers, json=payload)
    assert retried.status_code == 200
    assert retried.json()["practice_count"] == 1
    outcomes = client.get(f"/v1/recipes/practices/{item['id']}/outcomes", headers=headers)
    assert outcomes.status_code == 200
    assert outcomes.json()[0]["after_activation"] == 1
    insight = client.get("/v1/effectiveness", headers=headers)
    assert insight.status_code == 200
    assert insight.json()[0]["average_activation_change"] == -2.0
    assert client.get("/v1/effectiveness", headers=other_headers).json() == []


def test_personal_practice_recommendations_require_repeated_ratings_and_honor_dismissal():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "recommendations@example.com", "display_name": "Recommendations", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    item = client.post("/v1/recipes/practices", headers=headers, json={
        "name": "Window reset", "category": "Grounding", "source": "self-discovered"}).json()
    first = client.post(f"/v1/recipes/practices/{item['id']}/practice", headers=headers, json={
        "tool_id": item["id"], "client_id": "recommendation-one", "effectiveness": 5,
    })
    assert first.status_code == 200
    assert client.get("/v1/recommendations/practices", headers=headers).json() == []
    client.post(f"/v1/recipes/practices/{item['id']}/practice", headers=headers, json={
        "tool_id": item["id"], "client_id": "recommendation-two", "effectiveness": 4,
        "context": "Before a call",
    })
    recommendations = client.get("/v1/recommendations/practices", headers=headers)
    assert recommendations.status_code == 200
    suggestion = recommendations.json()[0]
    assert suggestion["practice_name"] == "Window reset"
    assert suggestion["attempts"] == 2
    assert "recorded experience" in suggestion["uncertainty"]
    dismissed = client.post(
        f"/v1/recommendations/practices/{suggestion['id']}/feedback", headers=headers,
        json={"decision": "dismissed"},
    )
    assert dismissed.status_code == 204
    assert client.get("/v1/recommendations/practices", headers=headers).json() == []


def test_private_audit_consents_and_exports_cannot_be_addressed_by_member_id():
    reset_store()
    first = client.post("/v1/auth/register", json={
        "email": "private@example.com", "display_name": "Private", "password": "very-secure-passphrase"})
    second = client.post("/v1/auth/register", json={
        "email": "other-private@example.com", "display_name": "Other", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {first.json()['access_token']}"}
    other_headers = {"authorization": f"Bearer {second.json()['access_token']}"}
    checkin = client.post("/v1/checkins", headers=headers, json={
        "client_id": "private-checkin-001", "emotions": ["Calm"], "activation": 0,
    })
    assert checkin.status_code == 201
    assert client.get("/v1/audit", headers=headers).status_code == 200
    assert client.get("/v1/consents", headers=headers).json() == []
    assert client.get("/v1/fhir/export", headers=headers).status_code == 200
    assert client.get("/v1/fhir/export-csv", headers=headers).status_code == 200
    assert client.get("/v1/audit/member-a", headers=other_headers).status_code == 404
    assert client.get("/v1/consents/member-a", headers=other_headers).status_code == 404
    assert client.get("/v1/fhir/export/member-a", headers=other_headers).status_code == 404


def test_commitments_are_idempotent_and_follow_safe_lifecycle_transitions():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "commitments@example.com", "display_name": "Commitments", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    payload = {
        "client_id": "commitment-retry-001", "title": "Take a short pause",
        "action_type": "practice", "source": "member",
    }
    created = client.post("/v1/commitments", headers=headers, json=payload)
    retried = client.post("/v1/commitments", headers=headers, json=payload)
    assert created.status_code == retried.status_code == 201
    assert created.json()["id"] == retried.json()["id"]
    commitment_id = created.json()["id"]
    assert created.json()["status"] == "proposed"
    confirmed = client.patch(
        f"/v1/commitments/{commitment_id}", headers=headers,
        json={"status": "confirmed"},
    )
    assert confirmed.json()["status"] == "confirmed"
    completed = client.patch(
        f"/v1/commitments/{commitment_id}", headers=headers,
        json={"status": "completed"},
    )
    assert completed.json()["completed_at"] is not None
    assert client.patch(
        f"/v1/commitments/{commitment_id}", headers=headers,
        json={"status": "scheduled"},
    ).status_code == 409
    assert client.get("/v1/commitments", headers=headers).json() == []
    closed = client.get("/v1/commitments?include_closed=true", headers=headers)
    assert closed.json()[0]["status"] == "completed"


def test_commitment_device_action_requires_confirmation_and_records_requested_not_completion():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "actions@example.com", "display_name": "Actions", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    created = client.post("/v1/commitments", headers=headers, json={
        "client_id": "commitment-action-001", "title": "Take a walk", "action_type": "practice",
    }).json()
    rejected = client.post(f"/v1/commitments/{created['id']}/execution", headers=headers, json={
        "action": "reminder", "status": "requested", "receipt": "intent_launched",
        "scheduled_for": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
    })
    assert rejected.status_code == 409
    client.patch(f"/v1/commitments/{created['id']}", headers=headers, json={"status": "confirmed"})
    requested = client.post(f"/v1/commitments/{created['id']}/execution", headers=headers, json={
        "action": "reminder", "status": "requested", "receipt": "intent_launched",
        "scheduled_for": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
    })
    assert requested.status_code == 200
    assert requested.json()["status"] == "scheduled"
    assert requested.json()["execution_status"] == "requested"
    assert requested.json()["completed_at"] is None


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


def test_memory_proposals_require_member_decision_and_preserve_provenance():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "memory-proposal@example.com", "display_name": "Memory", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    proposal = client.post("/v1/memory/proposals", headers=headers, json={
        "kind": "preference", "content": "Prefer short practices before meetings.",
        "reason": "The member repeatedly selected brief practices around meetings.",
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
    })
    assert proposal.status_code == 201
    assert client.get("/v1/memory", headers=headers).json() == []
    pending = client.get("/v1/memory/proposals", headers=headers)
    assert pending.json()[0]["status"] == "proposed"
    decided = client.post(
        f"/v1/memory/proposals/{proposal.json()['id']}/decision", headers=headers,
        json={"approved": True},
    )
    assert decided.json()["status"] == "approved"
    memory = client.get("/v1/memory", headers=headers).json()[0]
    assert memory["source"] == "assistant_proposal"
    assert memory["expires_at"] is not None


def test_curriculum_progress_recomputes_an_explainable_next_lesson():
    reset_store()
    account = client.post("/v1/auth/register", json={
        "email": "curriculum@example.com", "display_name": "Curriculum", "password": "very-secure-passphrase"})
    headers = {"authorization": f"Bearer {account.json()['access_token']}"}
    initial = client.get("/v1/journey", headers=headers)
    assert initial.json()["recommended_module_id"] == "lesson-1"
    progress = client.put("/v1/recipes/progress", headers=headers, json={
        "curriculum_version": "2026.08.24",
        "completed_lesson_ids": ["lesson-1", "lesson-2", "lesson-3", "lesson-4", "lesson-5"],
        "completed_practice_ids": [], "current_lesson_id": "lesson-6",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    assert progress.status_code == 200
    journey = client.get("/v1/journey", headers=headers)
    assert journey.json()["recommended_module_id"] == "lesson-6"
    assert "grounding" in journey.json()["recommendation_reason"].lower()


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
