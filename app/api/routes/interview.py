"""
HiLearn AI Interview Prep - Interview Routes
POST /start-interview   →  Begin a new session
POST /submit-answer     →  Submit answer and get feedback
GET  /session/{id}      →  Retrieve session details
"""
from fastapi import APIRouter, HTTPException
from loguru import logger

from app.models.schemas import (
    APIResponse,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from app.services.interview_service import interview_service

router = APIRouter(prefix="/interview", tags=["Interview"])


# ─────────────────────────────────────────────────────────
# POST /interview/start-interview
# ─────────────────────────────────────────────────────────
@router.post(
    "/start-interview",
    response_model=StartInterviewResponse,
    status_code=201,
    summary="Start Interview Session",
    description=(
        "Initialise a new AI-powered mock interview session. "
        "Returns the first question tailored to job role and interview type. "
        "Supports Technical, Behavioral, HR, and Domain-Specific interview modes."
    ),
)
async def start_interview(payload: StartInterviewRequest) -> StartInterviewResponse:
    """
    Start a new interview session.

    **Flow:**
    1. Validate request (job role, type, difficulty)
    2. Generate context-aware first question (AI-powered, Day 2)
    3. Create session in DB (Day 4)
    4. Return session ID + first question

    **TODO (Day 2):** Replace static question bank with Groq llama-3.3-70b.
    """
    logger.info(
        f"[START-INTERVIEW] user={payload.user_id} role={payload.job_role} "
        f"type={payload.interview_type} difficulty={payload.difficulty}"
    )
    return await interview_service.start_interview(payload)


# ─────────────────────────────────────────────────────────
# POST /interview/submit-answer
# ─────────────────────────────────────────────────────────
@router.post(
    "/submit-answer",
    response_model=SubmitAnswerResponse,
    summary="Submit Answer",
    description=(
        "Submit an answer to the current interview question. "
        "Receive AI-powered feedback (content score, communication analysis) "
        "and the next question. When all questions are answered, the session completes."
    ),
)
async def submit_answer(payload: SubmitAnswerRequest) -> SubmitAnswerResponse:
    """
    Submit answer and get feedback + next question.

    **Flow:**
    1. Validate session exists and is active
    2. Score answer via Groq (Day 2)
    3. Analyse voice if audio provided (Day 3)
    4. Determine if follow-up is needed (real-time conversation, Day 2)
    5. Return feedback + next question

    **TODO (Day 2):** Wire Groq for real content scoring & follow-up generation.
    **TODO (Day 3):** Wire Librosa/Whisper for voice/filler-word analysis.
    """
    logger.info(
        f"[SUBMIT-ANSWER] session={payload.session_id} "
        f"question={payload.question_id} "
        f"answer_length={len(payload.answer_text)}"
    )
    return await interview_service.submit_answer(payload)


# ─────────────────────────────────────────────────────────
# GET /interview/session/{session_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/session/{session_id}",
    response_model=APIResponse,
    summary="Get Session Details",
    description="Retrieve the current state of an interview session by its ID.",
)
async def get_session(session_id: str) -> APIResponse:
    """
    Fetch session metadata (status, progress, answers so far).

    TODO (Day 4): Query MongoDB for persistent session data.
    """
    session = await interview_service.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found. It may have expired or never existed.",
        )

    # Serialize datetime objects for JSON response
    serializable = {
        k: str(v) if hasattr(v, "isoformat") else v
        for k, v in session.items()
        if k != "answers"  # Exclude full transcript to keep response lean
    }
    serializable["answers_count"] = len(session.get("answers", []))

    return APIResponse(
        message="Session retrieved successfully",
        data=serializable,
    )
