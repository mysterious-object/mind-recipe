from app.auth import _roles_from_oidc_claims
from app.config import Settings


def test_production_readiness_requires_postgres_and_oidc():
    assert Settings(
        environment="production",
        database_url="postgresql://database/mindrecipe",
        oidc_issuer="https://identity.example/realms/mindrecipe",
        oidc_audience="mindrecipe-mobile",
    ).production_ready
    assert not Settings(
        environment="production",
        database_url="postgresql://database/mindrecipe",
    ).production_ready
    assert not Settings(
        environment="production",
        database_url="",
        oidc_issuer="https://identity.example/realms/mindrecipe",
        oidc_audience="mindrecipe-mobile",
    ).production_ready


def test_oidc_roles_come_only_from_signed_claims():
    assert _roles_from_oidc_claims({"mindrecipe_role": "practitioner"}) == {
        "practitioner"
    }
    assert _roles_from_oidc_claims(
        {"realm_access": {"roles": ["member", "guardian"]}}
    ) == {"member", "guardian"}
    assert _roles_from_oidc_claims({"x-mind-recipe-role": "practitioner"}) == set()
