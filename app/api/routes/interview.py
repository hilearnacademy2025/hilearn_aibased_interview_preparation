
# """
# HiLearn AI Interview Prep - Interview Routes
# POST /start-interview      →  Begin a new session
# POST /submit-answer        →  Submit answer and get AI feedback
# POST /transcribe-audio     →  (Day 3) Google Cloud STT + Librosa voice analysis
# GET  /session/{id}         →  Retrieve session details
# GET  /sessions/user/{id}   →  Retrieve user sessions (in-memory)
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
#     StartMCQRequest,
#     StartMCQResponse,
#     SubmitMCQRequest,
#     SubmitMCQResponse,
#     MCQSessionResponse,
#     SendResultsEmailRequest,
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

#     serializable = {
#         k: str(v) if hasattr(v, "isoformat") else v
#         for k, v in session.items()
#         if k != "answers"
#     }
#     serializable["answers_count"] = len(session.get("answers", []))

#     return APIResponse(
#         message="Session retrieved successfully",
#         data=serializable,
#     )


# # ─────────────────────────────────────────────────────────
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


# # ─────────────────────────────────────────────────────────
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


# # ─────────────────────────────────────────────────────────
# # POST /interview/start-mcq
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/start-mcq",
#     response_model=StartMCQResponse,
#     status_code=201,
#     summary="Start MCQ Interview Session",
#     description=(
#         "Initialize a new MCQ-based interview session. "
#         "Returns the first MCQ question with 4 options. "
#         "Questions are generated by AI, tailored to job role and difficulty."
#     ),
# )
# async def start_mcq(payload: StartMCQRequest) -> StartMCQResponse:
#     """
#     Start a new MCQ interview session.

#     **Flow:**
#     1. Validate request (job role, type, difficulty)
#     2. Generate first MCQ question via Groq AI
#     3. Create session in DB + in-memory cache
#     4. Return session ID + first MCQ question
#     """
#     logger.info(
#         f"[START-MCQ] user={payload.user_id} role={payload.job_role} "
#         f"type={payload.interview_type} difficulty={payload.difficulty} "
#         f"num_questions={payload.num_questions}"
#     )
#     result = await interview_service.start_mcq_session(payload)
#     return StartMCQResponse(**result)


# # ─────────────────────────────────────────────────────────
# # POST /interview/submit-mcq
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/submit-mcq",
#     response_model=SubmitMCQResponse,
#     summary="Submit MCQ Answer",
#     description=(
#         "Submit an answer (A/B/C/D) to an MCQ question. "
#         "Returns whether the answer is correct, the explanation, "
#         "score, and the next question if available."
#     ),
# )
# async def submit_mcq(payload: SubmitMCQRequest) -> SubmitMCQResponse:
#     """
#     Submit an MCQ answer and get evaluation + next question.

#     **Flow:**
#     1. Validate session exists and is active
#     2. Check answer against correct_answer
#     3. Return is_correct, explanation, score
#     4. Generate next MCQ question (or complete session)
#     """
#     logger.info(
#         f"[SUBMIT-MCQ] session={payload.session_id} "
#         f"question={payload.question_id} answer={payload.answer}"
#     )
#     result = await interview_service.submit_mcq_answer(payload)
#     return SubmitMCQResponse(**result)


# # ─────────────────────────────────────────────────────────
# # GET /interview/mcq/{session_id}
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/mcq/{session_id}",
#     response_model=MCQSessionResponse,
#     summary="Get MCQ Session Details",
#     description="Retrieve full details of an MCQ interview session.",
# )
# async def get_mcq_session(session_id: str) -> MCQSessionResponse:
#     """
#     Fetch MCQ session metadata (status, questions, answers, scores).

#     Checks in-memory cache first, then falls back to MongoDB.
#     """
#     session = await interview_service.get_mcq_session(session_id)
#     if not session:
#         raise HTTPException(
#             status_code=404,
#             detail=f"MCQ session '{session_id}' not found.",
#         )
#     return MCQSessionResponse(**session)


# # ─────────────────────────────────────────────────────────
# # POST /interview/send-results-email
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/send-results-email",
#     response_model=APIResponse,
#     summary="Send Interview Results via Email",
#     description=(
#         "Generate a comprehensive results report and send it to the user's email. "
#         "Includes scores, feedback, MCQ answers, weak areas, and LMS recommendations."
#     ),
# )
# async def send_results_email(payload: SendResultsEmailRequest) -> APIResponse:
#     """
#     Send formatted interview results to the user's registered email.

#     **Flow:**
#     1. Fetch interview session + feedback from DB
#     2. Get user email from DB
#     3. Build HTML email with scores, feedback, recommendations
#     4. Send via SMTP
#     """
#     logger.info("[SEND-EMAIL] session={}", payload.session_id)

#     from app.services.email_service import email_service
#     result = await email_service.send_results_email(payload.session_id)

#     if result["success"]:
#         return APIResponse(
#             message=result["message"],
#             data={"session_id": payload.session_id, "email_sent": True},
#         )
#     else:
#         raise HTTPException(
#             status_code=400,
#             detail=result["message"],
#         )


# # ─────────────────────────────────────────────────────────
# # POST /interview/upload-resume
# # ─────────────────────────────────────────────────────────
# @router.post(
#     "/upload-resume",
#     response_model=APIResponse,
#     summary="Upload & Parse Resume",
#     description=(
#         "Upload a resume file (PDF, DOCX, TXT). "
#         "Extracts text and returns structured resume data "
#         "(skills, experience, companies, tech stack)."
#     ),
# )
# async def upload_resume(
#     resume_file: UploadFile = File(
#         ...,
#         description="Resume file. Accepted formats: PDF, DOCX, TXT. Max 10MB.",
#     ),
# ) -> APIResponse:
#     """
#     Upload a resume file and extract structured information.

#     **Flow:**
#     1. Read file bytes
#     2. Extract text (PDF/DOCX/TXT)
#     3. Parse structured data via Groq AI
#     4. Return structured resume context
#     """
#     MAX_BYTES = 10 * 1024 * 1024  # 10 MB

#     logger.info(
#         "[UPLOAD-RESUME] file={} | content_type={}",
#         resume_file.filename, resume_file.content_type,
#     )

#     # Read file bytes
#     file_bytes = await resume_file.read(MAX_BYTES + 1)
#     if len(file_bytes) > MAX_BYTES:
#         raise HTTPException(
#             status_code=413,
#             detail="Resume file exceeds 10 MB limit.",
#         )

#     filename = resume_file.filename or "resume.pdf"

#     # Extract text
#     from app.services.resume_service import extract_text_from_file, parse_resume_structured

#     raw_text = extract_text_from_file(file_bytes, filename)
#     if not raw_text or len(raw_text.strip()) < 10:
#         raise HTTPException(
#             status_code=422,
#             detail="Could not extract text from the uploaded file. Try a different format.",
#         )

#     # Parse structured data
#     structured = await parse_resume_structured(raw_text)

#     logger.success(
#         "[UPLOAD-RESUME] done | filename={} | chars={} | skills={}",
#         filename, len(raw_text), len(structured.get("skills", [])),
#     )

#     return APIResponse(
#         message="Resume parsed successfully",
#         data={
#             "filename": filename,
#             "raw_text": raw_text[:2000],
#             "structured": structured,
#         },
#     )





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
    StartMCQRequest,
    StartMCQResponse,
    SubmitMCQRequest,
    SubmitMCQResponse,
    MCQSessionResponse,
    SendResultsEmailRequest,
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

    # Calculate total documents to give the frontend an accurate total count
    total_count = await interview_service.count_user_interviews(user_id) if hasattr(interview_service, "count_user_interviews") else len(interviews)

    summaries = []
    for interview in interviews:
        answers = interview.get("answers", [])
        scores = []
        for a in answers:
            if a.get("overall_score"):
                scores.append(a.get("overall_score"))
            elif a.get("content_score"):
                # derive overall_score from content_score if missing
                scores.append(round(a.get("content_score") * 0.95, 1))
                
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0
        
        summaries.append({
            "session_id": interview.get("session_id"),
            "interview_type": interview.get("interview_type"),
            "job_role": interview.get("job_role"),
            "difficulty": interview.get("difficulty"),
            "status": interview.get("status"),
            "total_questions": len(interview.get("questions", [])),
            "questions_answered": len(interview.get("answers", [])),
            "started_at": str(interview.get("created_at", "")),
            "completed_at": str(interview.get("completed_at", "")) if interview.get("completed_at") else None,
            "avg_score": avg_score,
        })

    return APIResponse(
        message=f"Found {len(summaries)} interview(s)",
        data={
            "user_id": user_id,
            "total_returned": len(summaries),
            "total_count": total_count,
            "limit": limit,
            "skip": skip,
            "interviews": summaries,
        },
    )


# ─────────────────────────────────────────────────────────
# POST /interview/start-mcq
# ─────────────────────────────────────────────────────────
@router.post(
    "/start-mcq",
    response_model=StartMCQResponse,
    status_code=201,
    summary="Start MCQ Interview Session",
    description=(
        "Initialize a new MCQ-based interview session. "
        "Returns the first MCQ question with 4 options. "
        "Questions are generated by AI, tailored to job role and difficulty."
    ),
)
async def start_mcq(payload: StartMCQRequest) -> StartMCQResponse:
    """
    Start a new MCQ interview session.

    **Flow:**
    1. Validate request (job role, type, difficulty)
    2. Generate first MCQ question via Groq AI
    3. Create session in DB + in-memory cache
    4. Return session ID + first MCQ question
    """
    logger.info(
        f"[START-MCQ] user={payload.user_id} role={payload.job_role} "
        f"type={payload.interview_type} difficulty={payload.difficulty} "
        f"num_questions={payload.num_questions}"
    )
    result = await interview_service.start_mcq_session(payload)
    return StartMCQResponse(**result)


# ─────────────────────────────────────────────────────────
# POST /interview/submit-mcq
# ─────────────────────────────────────────────────────────
@router.post(
    "/submit-mcq",
    response_model=SubmitMCQResponse,
    summary="Submit MCQ Answer",
    description=(
        "Submit an answer (A/B/C/D) to an MCQ question. "
        "Returns whether the answer is correct, the explanation, "
        "score, and the next question if available."
    ),
)
async def submit_mcq(payload: SubmitMCQRequest) -> SubmitMCQResponse:
    """
    Submit an MCQ answer and get evaluation + next question.

    **Flow:**
    1. Validate session exists and is active
    2. Check answer against correct_answer
    3. Return is_correct, explanation, score
    4. Generate next MCQ question (or complete session)
    """
    logger.info(
        f"[SUBMIT-MCQ] session={payload.session_id} "
        f"question={payload.question_id} answer={payload.answer}"
    )
    result = await interview_service.submit_mcq_answer(payload)
    return SubmitMCQResponse(**result)


# ─────────────────────────────────────────────────────────
# GET /interview/mcq/{session_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/mcq/{session_id}",
    response_model=MCQSessionResponse,
    summary="Get MCQ Session Details",
    description="Retrieve full details of an MCQ interview session.",
)
async def get_mcq_session(session_id: str) -> MCQSessionResponse:
    """
    Fetch MCQ session metadata (status, questions, answers, scores).

    Checks in-memory cache first, then falls back to MongoDB.
    """
    session = await interview_service.get_mcq_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"MCQ session '{session_id}' not found.",
        )
    return MCQSessionResponse(**session)


# ─────────────────────────────────────────────────────────
# POST /interview/send-results-email
# ─────────────────────────────────────────────────────────
@router.post(
    "/send-results-email",
    response_model=APIResponse,
    summary="Send Interview Results via Email",
    description=(
        "Generate a comprehensive results report and send it to the user's email. "
        "Includes scores, feedback, MCQ answers, weak areas, and LMS recommendations."
    ),
)
async def send_results_email(payload: SendResultsEmailRequest) -> APIResponse:
    """
    Send formatted interview results to the user's registered email.

    **Flow:**
    1. Fetch interview session + feedback from DB
    2. Get user email from DB
    3. Build HTML email with scores, feedback, recommendations
    4. Send via SMTP
    """
    logger.info("[SEND-EMAIL] session={}", payload.session_id)

    from app.services.email_service import email_service
    result = await email_service.send_results_email(payload.session_id)

    if result["success"]:
        return APIResponse(
            message=result["message"],
            data={"session_id": payload.session_id, "email_sent": True},
        )
    else:
        raise HTTPException(
            status_code=400,
            detail=result["message"],
        )


# ─────────────────────────────────────────────────────────
# POST /interview/upload-resume
# ─────────────────────────────────────────────────────────
@router.post(
    "/upload-resume",
    response_model=APIResponse,
    summary="Upload & Parse Resume",
    description=(
        "Upload a resume file (PDF, DOCX, TXT). "
        "Extracts text and returns structured resume data "
        "(skills, experience, companies, tech stack)."
    ),
)
async def upload_resume(
    resume_file: UploadFile = File(
        ...,
        description="Resume file. Accepted formats: PDF, DOCX, TXT. Max 10MB.",
    ),
) -> APIResponse:
    """
    Upload a resume file and extract structured information.

    **Flow:**
    1. Read file bytes
    2. Extract text (PDF/DOCX/TXT)
    3. Parse structured data via Groq AI
    4. Return structured resume context
    """
    MAX_BYTES = 10 * 1024 * 1024  # 10 MB

    logger.info(
        "[UPLOAD-RESUME] file={} | content_type={}",
        resume_file.filename, resume_file.content_type,
    )

    # Read file bytes
    file_bytes = await resume_file.read(MAX_BYTES + 1)
    if len(file_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Resume file exceeds 10 MB limit.",
        )

    filename = resume_file.filename or "resume.pdf"

    # Extract text
    from app.services.resume_service import extract_text_from_file, parse_resume_structured

    raw_text = extract_text_from_file(file_bytes, filename)
    if not raw_text or len(raw_text.strip()) < 10:
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from the uploaded file. Try a different format.",
        )

    # Parse structured data
    structured = await parse_resume_structured(raw_text)

    logger.success(
        "[UPLOAD-RESUME] done | filename={} | chars={} | skills={}",
        filename, len(raw_text), len(structured.get("skills", [])),
    )

    return APIResponse(
        message="Resume parsed successfully",
        data={
            "filename": filename,
            "raw_text": raw_text[:2000],
            "structured": structured,
        },
    )

# ─────────────────────────────────────────────────────────
# GET /interview/share/{session_id}   — PUBLIC (no auth)
# ─────────────────────────────────────────────────────────
@router.get(
    "/share/{session_id}",
    response_model=APIResponse,
    summary="Get Public Share Data",
    description="Public endpoint — no login required. Returns limited session data for share page.",
)
async def get_share_session(session_id: str) -> APIResponse:
    """
    Fetch limited public data for a shared interview result.

    No authentication needed — anyone with the link can view.
    Returns only: score, job_role, interview_type, user_name, completed_at.
    """
    session = await interview_service.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{session_id}' not found.",
        )

    feedback = session.get("feedback") or session.get("latest_feedback") or {}

    public_data = {
        "session_id": session_id,
        "score": feedback.get("overall_score", 0),
        "job_role": session.get("job_role", ""),
        "interview_type": session.get("interview_type", ""),
        "user_name": session.get("user_name", "HiLearn Student"),
        "completed_at": str(session.get("completed_at", "")) if session.get("completed_at") else "",
    }

    return APIResponse(
        message="Share data retrieved successfully",
        data=public_data,
    )

# ─────────────────────────────────────────────────────────
# GET /interview/latest-feedback/{user_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/latest-feedback/{user_id}",
    response_model=APIResponse,
    summary="Get Latest Interview Feedback",
)
async def get_latest_feedback(
    user_id: str,
    user: Dict[str, Any] = Depends(get_current_user),
) -> APIResponse:
    """
    Fetch the fully aggregated feedback for a user's most recent completed interview.
    """
    token_user_id = user.get("sub")
    if token_user_id != user_id and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    from app.services.database import db_service
    if not db_service.is_connected:
        raise HTTPException(status_code=503, detail="Database not connected")

    interviews = await db_service.get_user_interviews(user_id, limit=10)
    # Find the most recent completed interview
    latest = next((iv for iv in interviews if iv.status.value == "completed"), None)
    if not latest:
        # If no completed, fallback to the most recent one overall
        latest = interviews[0] if interviews else None

    if not latest:
        return APIResponse(message="No interviews found", data=None)

    session_id = latest.session_id
    feedbacks = await db_service.get_feedback_for_interview(session_id)

    answers = latest.answers
    scores = []
    content_scores = []
    for a in answers:
        if a.overall_score:
            scores.append(a.overall_score)
        elif a.content_score:
            scores.append(round(a.content_score * 0.95, 1))
        
        if a.content_score:
            content_scores.append(a.content_score)

    avg_overall = round(sum(scores) / len(scores), 1) if scores else 0
    avg_content = round(sum(content_scores) / len(content_scores), 1) if content_scores else 0

    strengths = ["Completed the interview session"]
    improvements = []
    fillers = []
    wpms = []
    confidences = []
    clarities = []

    for f in feedbacks:
        if f.suggestions:
            improvements.extend(f.suggestions)
        if f.filler_words_detected:
            fillers.extend(f.filler_words_detected)
        if getattr(f, "wpm", 0) > 0:
            wpms.append(f.wpm)
        if getattr(f, "confidence_score", 0) > 0:
            confidences.append(f.confidence_score)
        if getattr(f, "clarity_score", 0) > 0:
            clarities.append(f.clarity_score)

    if avg_overall > 70:
        strengths.append("Strong overall performance and subject matter knowledge")
    elif avg_overall > 50:
        strengths.append("Good foundational understanding")

    # Deduplicate
    improvements = list(set(improvements))[:4]
    if not improvements:
        improvements = ["Focus on providing structured answers (e.g. STAR method)"]
        
    fillers = list(set(fillers))

    avg_wpm = int(sum(wpms) / len(wpms)) if wpms else 0
    avg_conf = round(sum(confidences) / len(confidences), 1) if confidences else 0
    avg_clarity = round(sum(clarities) / len(clarities), 1) if clarities else 0

    return APIResponse(
        message="Latest feedback retrieved",
        data={
            "session_id": session_id,
            "job_role": latest.job_role,
            "interview_type": latest.interview_type.value if hasattr(latest.interview_type, 'value') else latest.interview_type,
            "total_questions": len(latest.questions),
            "questions_answered": latest.current_index,
            "feedback": {
                "overall_score": avg_overall,
                "content_score": avg_content,
                "completeness_score": round(avg_content * 0.9, 1),
                "relevance_score": avg_overall,
                "strengths": strengths,
                "improvements": improvements,
                "ideal_answer_hint": "Try to back up your answers with specific examples and measurable outcomes.",
                "communication": {
                    "speaking_pace_wpm": avg_wpm,
                    "filler_words_count": len(fillers),
                    "filler_words_detected": fillers,
                    "confidence_score": avg_conf,
                    "clarity_score": avg_clarity
                }
            }
        }
    )