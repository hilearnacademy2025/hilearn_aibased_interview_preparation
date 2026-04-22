
"""
HiLearn AI Interview Prep - FastAPI Application Entry Point
=============================================================
Run locally:
    uvicorn main:app --reload --port 8000

API Docs:
    http://localhost:8000/docs     (Swagger UI)
    http://localhost:8000/redoc    (ReDoc)
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.db.database import db
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.api.routes import health, interview, auth

# ─────────────────────────────────────────────────────────
# Settings
# ─────────────────────────────────────────────────────────
settings = get_settings()


# ─────────────────────────────────────────────────────────
# Lifespan (startup / shutdown events)
# ─────────────────────────────────────────────────────────
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     """
#     Application lifecycle hooks.

#     Startup:
#         - Validate environment config
#         - TODO (Day 4): Connect to MongoDB
#         - TODO (Day 2): Warm up Groq client
#         - TODO (Day 3): Initialise ChromaDB collection

#     Shutdown:
#         - TODO (Day 4): Close MongoDB connection pool
#     """
#     # ── STARTUP ─────────────────────────────────────────
#     logger.info("=" * 60)
#     logger.info(f"  🚀 {settings.app_name} v{settings.app_version}")
#     logger.info(f"  Environment : {settings.environment}")
#     logger.info(f"  Debug mode  : {settings.debug}")
#     logger.info(f"  CORS origins: {settings.cors_origins}")
#     logger.info("=" * 60)

#     # TODO (Day 4): MongoDB connection
#     # from app.core.database import connect_to_mongo
#     # await connect_to_mongo()
#     # logger.info("✅ MongoDB connected")

#     # TODO (Day 2): Groq client warm-up
#     # from groq import AsyncGroq
#     # app.state.groq = AsyncGroq(api_key=settings.groq_api_key)
#     # logger.info("✅ Groq client initialised (llama-3.3-70b)")
    
#     try:
#         collections = await db.list_collection_names()
#         logger.info(f"✅ MongoDB connected | Collections: {collections}")
#     except Exception as e:
#         logger.error(f"❌ MongoDB connection failed: {e}")



#     logger.info("✅ HiLearn backend started successfully!")

#     yield   # ← app is running

#    # ── SHUTDOWN ─────────────────────────────────────────
# logger.info("🛑 Shutting down HiLearn backend...")

# try:
#     db.client.close()
#     logger.info("✅ MongoDB connection closed")
# except Exception as e:
#     logger.error(f"Error closing MongoDB: {e}")

# logger.info("Bye! 👋")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup:
        - Validate environment config
        - Day 5: Connect to MongoDB + create indexes
        - Warm up Groq client

    Shutdown:
        - Day 5: Close MongoDB connection pool
    """
    # ── STARTUP ─────────────────────────────────────────
    logger.info("=" * 60)
    logger.info(f"  🚀 {settings.app_name} v{settings.app_version}")
    logger.info(f"  Environment : {settings.environment}")
    logger.info(f"  Debug mode  : {settings.debug}")
    logger.info(f"  CORS origins: {settings.cors_origins}")
    logger.info("=" * 60)

    # ── Day 5: MongoDB Connection ──────────────────────────────────────
    from app.services.database import db_service

    mongo_connected = await db_service.connect()
    if mongo_connected:
        logger.info("✅ MongoDB connected")
        await db_service.create_indexes()
        logger.info("✅ MongoDB indexes verified")
    else:
        logger.warning(
            "⚠️  MongoDB NOT connected — app will run with in-memory stores only. "
            "Data will NOT persist across restarts."
        )

    logger.info("✅ HiLearn backend started successfully!")

    yield   # ← app is running

    # ── SHUTDOWN ─────────────────────────────────────────
    logger.info("🛑 Shutting down HiLearn backend...")

    # Day 5: Close MongoDB connection
    await db_service.disconnect()
    logger.info("✅ MongoDB disconnected")

    logger.info("Bye! 👋")


# ─────────────────────────────────────────────────────────
# FastAPI App Instance
# ─────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
## HiLearn AI Interview Prep API 🎯

AI-powered mock interview platform for Indian students and professionals.

### Key Features
- **Real-time conversational AI** — asks follow-ups, not just Q&A
- **India-specific questions** — targets Indian companies & roles
- **Voice analysis** — filler words, pacing, confidence detection
- **LMS integration** — linked to HiLearn courses for improvement
- **Affordable pricing** — ₹299/month Pro (competitors charge ₹1000+)
- **MongoDB persistence** — all data persists across restarts (Day 5)

### Tech Stack
- **LLM**: Groq API (llama-3.3-70b) — fast & cost-effective
- **STT**: Google Cloud Speech-to-Text — accurate speech-to-text
- **Voice Analysis**: Librosa
- **DB**: MongoDB (Motor async driver) + ChromaDB (vector store)
- **Real-time**: WebSockets (coming soon)

### Interview Types
| Type | Description |
|------|-------------|
| `technical` | DSA, System Design, Coding, Frameworks |
| `behavioral` | STAR-method situational questions |
| `hr` | Cultural fit, salary, career goals |
| `domain_specific` | Role & industry specific deep dives |
    """,
    contact={
        "name": "HiLearn Team",
        "url": "https://hilearn.in",
        "email": "support@hilearn.in",
    },
    license_info={
        "name": "Proprietary",
    },
    openapi_tags=[
        {"name": "Health", "description": "Liveness and readiness probes"},
        {"name": "Interview", "description": "Interview session management and AI feedback"},
        {"name": "Authentication", "description": "User signup, login, logout, and token management"},
    ],
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ─────────────────────────────────────────────────────────
# Middleware
# ─────────────────────────────────────────────────────────

# CORS — allow frontend (React/Next.js on localhost:3000 or hilearn.in)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────
# Exception Handlers
# ─────────────────────────────────────────────────────────
register_exception_handlers(app)


# ─────────────────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────────────────
app.include_router(health.router, prefix="/api/v1")
app.include_router(interview.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")


# ─────────────────────────────────────────────────────────
# Root Endpoint
# ─────────────────────────────────────────────────────────
@app.get("/", tags=["Root"], summary="API Root")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}! 🎯",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/v1/health",
        "environment": settings.environment,
    }


# ─────────────────────────────────────────────────────────
# Dev Runner
# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info",
    )