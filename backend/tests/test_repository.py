from app.postgres_store import POSTGRES_SCHEMA, translate_sql


def test_postgres_schema_covers_every_durable_member_table():
    for table in (
        "checkins",
        "consents",
        "audit_events",
        "trend_cache",
        "pattern_alerts",
        "conversation_memory",
        "recipe_practice_items",
        "practice_outcomes",
        "practice_recommendation_feedback",
        "curriculum_progress",
        "journey_settings",
        "recipe_proposals",
        "memory_cards",
        "memory_proposals",
        "notification_preferences",
        "member_events",
        "commitments",
        "safety_events",
    ):
        assert f"CREATE TABLE IF NOT EXISTS {table}" in POSTGRES_SCHEMA


def test_shared_queries_translate_to_postgres_without_sqlite_mutation_syntax():
    insert = translate_sql(
        "INSERT OR IGNORE INTO member_events (id, member_id) VALUES (?, ?)"
    )
    assert insert == (
        "INSERT INTO member_events (id, member_id) VALUES (%s, %s) "
        "ON CONFLICT DO NOTHING"
    )

    cache = translate_sql(
        "INSERT OR REPLACE INTO trend_cache "
        "(member_id,avg_activation,streak_days,last_checkin_at,updated_at) "
        "VALUES (?,?,?,?,?)"
    )
    assert "ON CONFLICT (member_id) DO UPDATE" in cache
    assert "?" not in cache
    assert "OR REPLACE" not in cache


def test_shared_date_queries_translate_to_postgres():
    translated = translate_sql(
        "SELECT DISTINCT date(created_at) as d FROM checkins "
        "WHERE member_id=? AND created_at >= date('now','-30 days')"
    )
    assert "to_char(CAST(created_at AS timestamptz), 'YYYY-MM-DD') as d" in translated
    assert "CURRENT_TIMESTAMP - INTERVAL '30 days'" in translated
    assert "member_id=%s" in translated


def test_shared_aggregation_uses_postgres_string_aggregation():
    translated = translate_sql(
        "SELECT GROUP_CONCAT(DISTINCT o.context) AS context_examples"
    )
    assert "STRING_AGG(DISTINCT o.context, ',')" in translated
    assert "GROUP_CONCAT" not in translated
