from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    environment: str = os.getenv("MIND_NAV_ENV", "development")
    policy_version: str = os.getenv("MIND_NAV_SAFETY_POLICY", "2026-08-13")
    allowed_origins: str = os.getenv("MIND_NAV_ALLOWED_ORIGINS", "")
    database_url: str = os.getenv("MIND_NAV_DATABASE_URL", "")
    # ── Provider keys ─────────────────────────────────────────────
    openrouter_key: str = os.getenv("MIND_NAV_OPENROUTER_KEY", "")
    anthropic_key: str = os.getenv("MIND_NAV_ANTHROPIC_KEY", "")
    google_key: str = os.getenv("MIND_NAV_GOOGLE_KEY", "")

    @property
    def development(self) -> bool:
        return self.environment in {"development", "test"}

    @property
    def production_ready(self) -> bool:
        return not self.development and self.database_url.startswith("postgresql")


settings = Settings()
