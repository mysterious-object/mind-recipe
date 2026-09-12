from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    environment: str = os.getenv("MIND_RECIPE_ENV", "development")
    policy_version: str = os.getenv("MIND_RECIPE_SAFETY_POLICY", "2026-08-13")
    allowed_origins: str = os.getenv("MIND_RECIPE_ALLOWED_ORIGINS", "")
    database_url: str = os.getenv("MIND_RECIPE_DATABASE_URL", "")
    oidc_issuer: str = os.getenv("MIND_RECIPE_OIDC_ISSUER", "").rstrip("/")
    oidc_audience: str = os.getenv("MIND_RECIPE_OIDC_AUDIENCE", "")
    oidc_jwks_url: str = os.getenv("MIND_RECIPE_OIDC_JWKS_URL", "")
    # ── Provider keys ─────────────────────────────────────────────
    openrouter_key: str = os.getenv("MIND_RECIPE_OPENROUTER_KEY", "")
    anthropic_key: str = os.getenv("MIND_RECIPE_ANTHROPIC_KEY", "")
    google_key: str = os.getenv("MIND_RECIPE_GOOGLE_KEY", "")
    @property
    def development(self) -> bool:
        return self.environment in {"development", "test"}

    @property
    def production_ready(self) -> bool:
        return (
            not self.development
            and self.database_url.startswith("postgresql")
            and self.oidc_ready
        )

    @property
    def oidc_ready(self) -> bool:
        return bool(self.oidc_issuer and self.oidc_audience)


settings = Settings()
