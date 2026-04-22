

# """
# HiLearn AI Interview Prep - Interview Routes
# POST /start-interview      →  Begin a new session
# POST /submit-answer        →  Submit answer and get AI feedback
# POST /transcribe-audio     →  (Day 3) Google Cloud STT + Librosa voice analysis
# GET  /session/{id}         →  Retrieve session details
# GET  /history/{user_id}    →  (Day 5) Retrieve user's interview history from MongoDB
# """
# from typing import Any, Dict, List, Optional

# from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
# from loguru import logger

# from app.core.security import get_current_user
# from app.models.schemas import (
#     APIResponse,
#     StartInterviewRequest,
#     StartInterviewResponse,
#     SubmitAnswerRequest,
#     SubmitAnswerResponse,
#     TranscribeResponse,
#     VoiceAnalysisResponse,
# )
# from app.services.interview_service import interview_service
# from app.services.voice_service import transcribe_audio, analyze_voice

# router = APIRouter(prefix="/interview", tags=["Interview"])


# # ─────────────────────────────────────────────────────────
# # POST /interview/start-interview
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/start-interview",
#     response_model=StartInterviewResponse,
#     status_code=201,
#     summary="Start Interview Session",
#     description=(
#         "Initialise a new AI-powered mock interview session. "
#         "Returns the first question tailored to job role and interview type. "
#         "Supports Technical, Behavioral, HR, and Domain-Specific interview modes."
#     ),
# )
# async def start_interview(payload: StartInterviewRequest) -> StartInterviewResponse:
#     """
#     Start a new interview session.

#     **Flow:**
#     1. Validate request (job role, type, difficulty)
#     2. Generate context-aware first question (AI-powered, Day 2)
#     3. Create session in DB (Day 5) + in-memory cache
#     4. Return session ID + first question
#     """
#     logger.info(
#         f"[START-INTERVIEW] user={payload.user_id} role={payload.job_role} "
#         f"type={payload.interview_type} difficulty={payload.difficulty}"
#     )
#     return await interview_service.start_interview(payload)


# # ─────────────────────────────────────────────────────────
# # POST /interview/submit-answer
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/submit-answer",
#     response_model=SubmitAnswerResponse,
#     summary="Submit Answer",
#     description=(
#         "Submit an answer to the current interview question. "
#         "Receive AI-powered feedback (content score, communication analysis) "
#         "and the next question. When all questions are answered, the session completes."
#     ),
# )
# async def submit_answer(payload: SubmitAnswerRequest) -> SubmitAnswerResponse:
#     """
#     Submit answer and get feedback + next question.

#     **Flow:**
#     1. Validate session exists and is active
#     2. Score answer via Groq (Day 2)
#     3. Analyse voice if audio provided (Day 3)
#     4. Persist answer + feedback to MongoDB (Day 5)
#     5. Determine if follow-up is needed (real-time conversation, Day 2)
#     6. Return feedback + next question
#     """
#     logger.info(
#         f"[SUBMIT-ANSWER] session={payload.session_id} "
#         f"question={payload.question_id} "
#         f"answer_length={len(payload.answer_text)} "
#         f"has_audio={bool(payload.audio_file_url)}"
#     )
#     return await interview_service.submit_answer(payload)


# # ─────────────────────────────────────────────────────────
# # POST /interview/transcribe-audio  (Day 3)
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/transcribe-audio",
#     response_model=TranscribeResponse,
#     summary="Transcribe & Analyse Audio",
#     description=(
#         "Upload an audio file (MP3 / WAV / OGG / M4A / WebM). "
#         "The endpoint transcribes it using Google Cloud Speech-to-Text and then analyses "
#         "communication quality (filler words, speaking pace, confidence) via Librosa. "
#         "**Max size: 10 MB.** Falls back gracefully on any processing error."
#     ),
#     tags=["Interview"],
# )
# async def transcribe_audio_endpoint(
#     audio_file: UploadFile = File(
#         ...,
#         description="Audio file to transcribe. Accepted formats: MP3, WAV, OGG, M4A, WebM.",
#     ),
# ) -> TranscribeResponse:
#     """
#     **Day 3 — Voice Analysis Pipeline**

#     1. Read uploaded audio bytes
#     2. Call Google Cloud Speech-to-Text for speech-to-text
#     3. Call Librosa for filler-word detection + pacing analysis
#     4. Return combined result

#     If Google STT fails, transcription is empty and confidence = 0.
#     If Librosa fails, voice metrics fall back to sensible defaults.
#     """
#     MAX_BYTES = 10 * 1024 * 1024  # 10 MB hard limit

#     logger.info(
#         "[TRANSCRIBE-AUDIO] file={} | content_type={}",
#         audio_file.filename, audio_file.content_type,
#     )

#     # ── Validate content type ─────────────────────────────────────────
#     # Browser MediaRecorder sends types like 'audio/webm;codecs=opus'
#     # so we check prefix, not exact match
#     ct = (audio_file.content_type or "").lower().split(";")[0].strip()
#     allowed_prefixes = {
#         "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
#         "audio/ogg", "audio/webm", "audio/mp4", "audio/m4a",
#         "audio/x-m4a", "audio/aac", "application/octet-stream",
#     }
#     if ct and ct not in allowed_prefixes:
#         raise HTTPException(
#             status_code=415,
#             detail=f"Unsupported audio format: '{ct}'. Use MP3, WAV, OGG, WebM, or M4A.",
#         )

#     # ── Read bytes with size guard ────────────────────────────────────
#     audio_bytes = await audio_file.read(MAX_BYTES + 1)
#     if len(audio_bytes) > MAX_BYTES:
#         raise HTTPException(
#             status_code=413,
#             detail="Audio file exceeds 10 MB limit.",
#         )

#     filename = audio_file.filename or "audio.mp3"

#     # ── Whisper Transcription ─────────────────────────────────────────
#     transcribe_result = await transcribe_audio(audio_bytes, filename)

#     # ── Librosa Voice Analysis ────────────────────────────────────────
#     voice_result = await analyze_voice(
#         audio_bytes=audio_bytes,
#         filename=filename,
#         transcription=transcribe_result.transcription,
#         duration_seconds=transcribe_result.duration_seconds,
#     )

#     logger.success(
#         "[TRANSCRIBE-AUDIO] done | words={} | fillers={} | wpm={} | confidence_score={}",
#         len(transcribe_result.transcription.split()),
#         voice_result.filler_count,
#         voice_result.wpm,
#         voice_result.confidence_score,
#     )

#     return TranscribeResponse(
#         transcription=transcribe_result.transcription,
#         confidence=transcribe_result.confidence,
#         language=transcribe_result.language,
#         duration_seconds=transcribe_result.duration_seconds,
#         voice_analysis=VoiceAnalysisResponse(
#             filler_count=voice_result.filler_count,
#             filler_words_detected=voice_result.filler_words_detected,
#             wpm=voice_result.wpm,
#             confidence_score=voice_result.confidence_score,
#             clarity_score=voice_result.clarity_score,
#             silence_ratio=voice_result.silence_ratio,
#         ),
#     )


# # ─────────────────────────────────────────────────────────
# # GET /interview/session/{session_id}
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/session/{session_id}",
#     response_model=APIResponse,
#     summary="Get Session Details",
#     description="Retrieve the current state of an interview session by its ID.",
# )
# async def get_session(session_id: str) -> APIResponse:
#     """
#     Fetch session metadata (status, progress, answers so far).

#     Day 5: Checks in-memory cache first, then falls back to MongoDB
#     for historical sessions.
#     """
#     session = await interview_service.get_session(session_id)
#     if not session:
#         raise HTTPException(
#             status_code=404,
#             detail=f"Session '{session_id}' not found. It may have expired or never existed.",
#         )

#     # Serialize datetime objects for JSON response
#     serializable = {
#         k: str(v) if hasattr(v, "isoformat") else v
#         for k, v in session.items()
#         if k != "answers"  # Exclude full transcript to keep response lean
#     }
#     serializable["answers_count"] = len(session.get("answers", []))

#     return APIResponse(
#         message="Session retrieved successfully",
#         data=serializable,
#     )


# # ─────────────────────────────────────────────────────────
# <<<<<<< HEAD
# # GET /interview/sessions/user/{user_id}
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/sessions/user/{user_id}",
#     response_model=APIResponse,
#     summary="Get User Session History",
#     description="Return all past interview sessions for a given user (in-memory store).",
# )
# async def get_user_sessions(user_id: str) -> APIResponse:
#     """
#     Fetch all sessions belonging to user_id.
#     Used by UserDashboard and UserAnalytics to show real data.
#     """
#     sessions = await interview_service.get_user_sessions(user_id)
#     return APIResponse(
#         message=f"{len(sessions)} session(s) found.",
#         data={"sessions": sessions, "total": len(sessions)},
#     )
# =======
# # GET /interview/history/{user_id}  (Day 5)
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/history/{user_id}",
#     response_model=APIResponse,
#     summary="Get Interview History",
#     description=(
#         "Retrieve a user's interview history from MongoDB. "
#         "Returns a paginated list of past interviews, newest first. "
#         "Requires a valid Bearer token."
#     ),
#     responses={
#         200: {"description": "Interview history retrieved"},
#         401: {"description": "Missing or invalid token"},
#     },
# )
# async def get_interview_history(
#     user_id: str,
#     limit: int = Query(default=20, ge=1, le=100, description="Max results to return"),
#     skip: int = Query(default=0, ge=0, description="Number of results to skip"),
#     user: Dict[str, Any] = Depends(get_current_user),
# ) -> APIResponse:
#     """
#     **Day 5 — Interview History from MongoDB**

#     Retrieves the authenticated user's interview history.
#     Validates that the requesting user owns the data (user_id must match token).

#     Args:
#         user_id: User whose history to retrieve.
#         limit: Pagination limit (default 20, max 100).
#         skip: Pagination offset.
#         user: JWT-authenticated user payload (injected via Depends).

#     Returns:
#         APIResponse with list of interview summaries.
#     """
#     # Security: ensure users can only view their own history
#     token_user_id = user.get("sub")
#     token_role = user.get("role", "student")
#     if token_user_id != user_id and token_role != "admin":
#         raise HTTPException(
#             status_code=403,
#             detail="You can only view your own interview history.",
#         )

#     logger.info(
#         "[INTERVIEW-HISTORY] user_id={} | limit={} | skip={}",
#         user_id, limit, skip,
#     )

#     interviews = await interview_service.get_user_interview_history(
#         user_id=user_id, limit=limit, skip=skip,
#     )

#     # Build simplified summaries for the response
#     summaries = []
#     for interview in interviews:
#         summaries.append({
#             "session_id": interview.get("session_id"),
#             "interview_type": interview.get("interview_type"),
#             "job_role": interview.get("job_role"),
#             "difficulty": interview.get("difficulty"),
#             "status": interview.get("status"),
#             "questions_count": len(interview.get("questions", [])),
#             "answers_count": len(interview.get("answers", [])),
#             "created_at": str(interview.get("created_at", "")),
#             "completed_at": str(interview.get("completed_at", "")) if interview.get("completed_at") else None,
#         })

#     return APIResponse(
#         message=f"Found {len(summaries)} interview(s)",
#         data={
#             "user_id": user_id,
#             "total_returned": len(summaries),
#             "limit": limit,
#             "skip": skip,
#             "interviews": summaries,
#         },
#     )
# >>>>>>> origin/rahil






"""
HiLearn AI Interview Prep - Interview Routes
POST /start-interview      →  Begin a new session
POST /submit-answer        →  Submit answer and get AI feedback
POST /transcribe-audio     →  (Day 3) Google Cloud STT + Librosa voice analysis
GET  /session/{id}         →  Retrieve session details
GET  /sessions/user/{id}   →  Retrieve user sessions (in-memory)
GET  /history/{user_id}    →  (Day 5) Retrieve user's interview history from MongoDB
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from loguru import logger

from app.core.security import get_current_user
from app.models.schemas import (
    APIResponse,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    TranscribeResponse,
    VoiceAnalysisResponse,
)
from app.services.interview_service import interview_service
from app.services.voice_service import transcribe_audio, analyze_voice

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
    3. Create session in DB (Day 5) + in-memory cache
    4. Return session ID + first question
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
    4. Persist answer + feedback to MongoDB (Day 5)
    5. Determine if follow-up is needed (real-time conversation, Day 2)
    6. Return feedback + next question
    """
    logger.info(
        f"[SUBMIT-ANSWER] session={payload.session_id} "
        f"question={payload.question_id} "
        f"answer_length={len(payload.answer_text)} "
        f"has_audio={bool(payload.audio_file_url)}"
    )
    return await interview_service.submit_answer(payload)


# ─────────────────────────────────────────────────────────
# POST /interview/transcribe-audio  (Day 3)
# ─────────────────────────────────────────────────────────
@router.post(
    "/transcribe-audio",
    response_model=TranscribeResponse,
    summary="Transcribe & Analyse Audio",
    description=(
        "Upload an audio file (MP3 / WAV / OGG / M4A / WebM). "
        "The endpoint transcribes it using Google Cloud Speech-to-Text and then analyses "
        "communication quality (filler words, speaking pace, confidence) via Librosa. "
        "**Max size: 10 MB.** Falls back gracefully on any processing error."
    ),
    tags=["Interview"],
)
async def transcribe_audio_endpoint(
    audio_file: UploadFile = File(
        ...,
        description="Audio file to transcribe. Accepted formats: MP3, WAV, OGG, M4A, WebM.",
    ),
) -> TranscribeResponse:
    """
    **Day 3 — Voice Analysis Pipeline**

    1. Read uploaded audio bytes
    2. Call Google Cloud Speech-to-Text for speech-to-text
    3. Call Librosa for filler-word detection + pacing analysis
    4. Return combined result

    If Google STT fails, transcription is empty and confidence = 0.
    If Librosa fails, voice metrics fall back to sensible defaults.
    """
    MAX_BYTES = 10 * 1024 * 1024  # 10 MB hard limit

    logger.info(
        "[TRANSCRIBE-AUDIO] file={} | content_type={}",
        audio_file.filename, audio_file.content_type,
    )

    # ── Validate content type ─────────────────────────────────────────
    ct = (audio_file.content_type or "").lower().split(";")[0].strip()
    allowed_prefixes = {
        "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
        "audio/ogg", "audio/webm", "audio/mp4", "audio/m4a",
        "audio/x-m4a", "audio/aac", "application/octet-stream",
    }
    if ct and ct not in allowed_prefixes:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported audio format: '{ct}'. Use MP3, WAV, OGG, WebM, or M4A.",
        )

    # ── Read bytes with size guard ────────────────────────────────────
    audio_bytes = await audio_file.read(MAX_BYTES + 1)
    if len(audio_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Audio file exceeds 10 MB limit.",
        )

    filename = audio_file.filename or "audio.mp3"

    # ── Whisper Transcription ─────────────────────────────────────────
    transcribe_result = await transcribe_audio(audio_bytes, filename)

    # ── Librosa Voice Analysis ────────────────────────────────────────
    voice_result = await analyze_voice(
        audio_bytes=audio_bytes,
        filename=filename,
        transcription=transcribe_result.transcription,
        duration_seconds=transcribe_result.duration_seconds,
    )

    logger.success(
        "[TRANSCRIBE-AUDIO] done | words={} | fillers={} | wpm={} | confidence_score={}",
        len(transcribe_result.transcription.split()),
        voice_result.filler_count,
        voice_result.wpm,
        voice_result.confidence_score,
    )

    return TranscribeResponse(
        transcription=transcribe_result.transcription,
        confidence=transcribe_result.confidence,
        language=transcribe_result.language,
        duration_seconds=transcribe_result.duration_seconds,
        voice_analysis=VoiceAnalysisResponse(
            filler_count=voice_result.filler_count,
            filler_words_detected=voice_result.filler_words_detected,
            wpm=voice_result.wpm,
            confidence_score=voice_result.confidence_score,
            clarity_score=voice_result.clarity_score,
            silence_ratio=voice_result.silence_ratio,
        ),
    )


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

    Day 5: Checks in-memory cache first, then falls back to MongoDB
    for historical sessions.
    """
    session = await interview_service.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found. It may have expired or never existed.",
        )

    serializable = {
        k: str(v) if hasattr(v, "isoformat") else v
        for k, v in session.items()
        if k != "answers"
    }
    serializable["answers_count"] = len(session.get("answers", []))

    return APIResponse(
        message="Session retrieved successfully",
        data=serializable,
    )


# ─────────────────────────────────────────────────────────
# GET /interview/sessions/user/{user_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/sessions/user/{user_id}",
    response_model=APIResponse,
    summary="Get User Session History",
    description="Return all past interview sessions for a given user (in-memory store).",
)
async def get_user_sessions(user_id: str) -> APIResponse:
    """
    Fetch all sessions belonging to user_id.
    Used by UserDashboard and UserAnalytics to show real data.
    """
    sessions = await interview_service.get_user_sessions(user_id)
    return APIResponse(
        message=f"{len(sessions)} session(s) found.",
        data={"sessions": sessions, "total": len(sessions)},
    )


# ─────────────────────────────────────────────────────────
# GET /interview/history/{user_id}  (Day 5)
# ─────────────────────────────────────────────────────────
@router.get(
    "/history/{user_id}",
    response_model=APIResponse,
    summary="Get Interview History",
    description=(
        "Retrieve a user's interview history from MongoDB. "
        "Returns a paginated list of past interviews, newest first. "
        "Requires a valid Bearer token."
    ),
    responses={
        200: {"description": "Interview history retrieved"},
        401: {"description": "Missing or invalid token"},
    },
)
async def get_interview_history(
    user_id: str,
    limit: int = Query(default=20, ge=1, le=100, description="Max results to return"),
    skip: int = Query(default=0, ge=0, description="Number of results to skip"),
    user: Dict[str, Any] = Depends(get_current_user),
) -> APIResponse:
    """
    **Day 5 — Interview History from MongoDB**

    Retrieves the authenticated user's interview history.
    Validates that the requesting user owns the data (user_id must match token).
    """
    # Security: ensure users can only view their own history
    token_user_id = user.get("sub")
    token_role = user.get("role", "student")
    if token_user_id != user_id and token_role != "admin":
        raise HTTPException(
            status_code=403,
            detail="You can only view your own interview history.",
        )

    logger.info(
        "[INTERVIEW-HISTORY] user_id={} | limit={} | skip={}",
        user_id, limit, skip,
    )

    interviews = await interview_service.get_user_interview_history(
        user_id=user_id, limit=limit, skip=skip,
    )

    summaries = []
    for interview in interviews:
        summaries.append({
            "session_id": interview.get("session_id"),
            "interview_type": interview.get("interview_type"),
            "job_role": interview.get("job_role"),
            "difficulty": interview.get("difficulty"),
            "status": interview.get("status"),
            "questions_count": len(interview.get("questions", [])),
            "answers_count": len(interview.get("answers", [])),
            "created_at": str(interview.get("created_at", "")),
            "completed_at": str(interview.get("completed_at", "")) if interview.get("completed_at") else None,
        })

    return APIResponse(
        message=f"Found {len(summaries)} interview(s)",
        data={
            "user_id": user_id,
            "total_returned": len(summaries),
            "limit": limit,
            "skip": skip,
            "interviews": summaries,
        },
    )