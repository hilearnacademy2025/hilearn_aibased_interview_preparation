"""
HiLearn AI Interview Prep - Health Check Router
GET /health  →  System status + service connectivity checks.
"""
from datetime import datetime
from fastapi import APIRouter
from loguru import logger

from app.core.config import get_settings
from app.models.schemas import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])
settings = get_settings()


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health Check",
    description=(
        "Returns the current health status of the HiLearn backend. "
        "Checks connectivity to key services (MongoDB, ChromaDB, Groq API)."
    ),
)
async def health_check() -> HealthResponse:
    """
    Lightweight liveness + readiness probe.
    Safe to call frequently (no DB writes).
    """
    logger.debug("Health check requested")

    services = {
        "api": "healthy",
        # TODO (Day 4): Uncomment after MongoDB is configured
        # "mongodb": await _ping_mongodb(),
        # TODO (Day 2): Uncomment after Groq is configured
        # "groq_llm": await _ping_groq(),
        "mongodb": "not_configured",
        "groq_llm": "not_configured",
        "whisper_stt": "not_configured",
        "chromadb": "not_configured",
    }

    return HealthResponse(
        status="healthy",
        app_name=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
        timestamp=datetime.utcnow(),
        services=services,
    )


# ── Private helpers (activate as services come online) ───────────────────────

# async def _ping_mongodb() -> str:
#     """TODO (Day 4): Ping MongoDB for readiness check."""
#     try:
#         from app.core.database import get_db_client
#         client = get_db_client()
#         await client.admin.command("ping")
#         return "healthy"
#     except Exception as e:
#         logger.error(f"MongoDB ping failed: {e}")
#         return "unhealthy"

# async def _ping_groq() -> str:
#     """TODO (Day 2): Ping Groq API to confirm key validity."""
#     try:
#         from groq import AsyncGroq
#         client = AsyncGroq(api_key=settings.groq_api_key)
#         await client.models.list()
#         return "healthy"
#     except Exception as e:
#         logger.error(f"Groq ping failed: {e}")
#         return "unhealthy"
