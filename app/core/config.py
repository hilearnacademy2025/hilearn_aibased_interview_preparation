"""
HiLearn AI Interview Prep - Application Settings
Loads and validates all environment variables using Pydantic Settings.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────
    app_name: str = "HiLearn AI Interview Prep"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = True
    port: int = 8000

    # ── Security ─────────────────────────────────────────────────────────
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # ── CORS ─────────────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    # ── Database ─────────────────────────────────────────────────────────
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "hilearn_interview"

    # ── ChromaDB ─────────────────────────────────────────────────────────
    chroma_host: str = "localhost"
    chroma_port: int = 8001
    chroma_collection: str = "hilearn_embeddings"

    # ── Groq API (LLM) ───────────────────────────────────────────────────
    # TODO (Day 2): Activate Groq integration
    groq_api_key: str = "gsk_placeholder"
    groq_model: str = "llama-3.3-70b-versatile"
    groq_max_tokens: int = 2048
    groq_temperature: float = 0.7

    # ── OpenAI Whisper (STT) ──────────────────────────────────────────────
    # TODO (Day 3): Activate Whisper integration
    openai_api_key: str = "sk-placeholder"
    whisper_model: str = "whisper-1"

    # ── File Upload ───────────────────────────────────────────────────────
    max_upload_size_mb: int = 10
    upload_dir: str = "./uploads"

    # ── Tier Limits ───────────────────────────────────────────────────────
    free_tier_interviews_per_month: int = 3
    pro_tier_price_inr: int = 299
    premium_tier_price_inr: int = 999


@lru_cache
def get_settings() -> Settings:
    """Return cached Settings instance (singleton pattern)."""
    return Settings()
