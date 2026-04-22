
# """
# HiLearn AI Interview Prep - Interview Service Layer
# Business logic for managing interview sessions.

# Day 2: Groq AI integrated for question generation & answer evaluation. ✅
# Day 3: Google Cloud Speech-to-Text (STT) + Librosa voice analysis wired in.       ✅
# Day 5: MongoDB persistence via DatabaseService — in-memory cache retained for
#        fast reads during active sessions, DB used for persistence.               ✅
# """
# import json
# import uuid
# from datetime import datetime
# from typing import Any, Dict, List, Optional

# from groq import AsyncGroq
# from loguru import logger

# from app.core.config import get_settings
# from app.models.db_models import (
#     AnswerRecord,
#     FeedbackDocument,
#     InterviewDocument,
#     InterviewStatus,
# )
# from app.models.schemas import (
#     AnswerFeedback,
#     CommunicationAnalysis,
#     DifficultyLevel,
#     InterviewQuestion,
#     InterviewType,
#     SessionStatus,
#     StartInterviewRequest,
#     StartInterviewResponse,
#     SubmitAnswerRequest,
#     SubmitAnswerResponse,
# )
# from app.services.voice_service import process_audio_url

# settings = get_settings()

# # ─────────────────────────────────────────────────────────
# # Groq Async Client (singleton, reused across requests)
# # ─────────────────────────────────────────────────────────
# _groq_client: Optional[AsyncGroq] = None

# GROQ_TIMEOUT_SECONDS = 30


# def _get_groq_client() -> AsyncGroq:
#     """Return a cached AsyncGroq client instance."""
#     global _groq_client
#     if _groq_client is None:
#         _groq_client = AsyncGroq(
#             api_key=settings.groq_api_key,
#             timeout=GROQ_TIMEOUT_SECONDS,
#         )
#         logger.info("Groq AsyncClient initialised (model={})", settings.groq_model)
#     return _groq_client


# # ─────────────────────────────────────────────────────────
# # In-Memory Session Cache (fast reads; DB for persistence)
# # ─────────────────────────────────────────────────────────
# _session_store: dict = {}


# # ─────────────────────────────────────────────────────────
# # Fallback Question Bank (used only when Groq API fails)
# # ─────────────────────────────────────────────────────────
# QUESTION_BANK = {
#     InterviewType.TECHNICAL: [
#         "Tell me about yourself and your technical background.",
#         "Explain the difference between REST and GraphQL. When would you use each?",
#         "What is database indexing and why is it important?",
#         "Explain async/await in Python. How does it differ from multithreading?",
#         "What are SOLID principles? Give an example of each.",
#         "How would you design a URL shortener like bit.ly?",
#         "What is the difference between SQL and NoSQL databases?",
#         "Explain the concept of microservices vs monolith architecture.",
#         "How do you handle errors and exceptions in your code?",
#         "What is your approach to writing unit tests?",
#     ],
#     InterviewType.BEHAVIORAL: [
#         "Tell me about a time you faced a major technical challenge. How did you overcome it?",
#         "Describe a situation where you had to work under pressure to meet a deadline.",
#         "Tell me about a time you disagreed with a teammate. How did you handle it?",
#         "Describe a project you're most proud of and why.",
#         "How do you handle feedback and criticism about your work?",
#     ],
#     InterviewType.HR: [
#         "Why do you want to join our company?",
#         "Where do you see yourself in 5 years?",
#         "What is your expected CTC?",
#         "Are you comfortable with relocation?",
#         "Why are you leaving your current role?",
#     ],
#     InterviewType.DOMAIN_SPECIFIC: [
#         "What motivated you to choose this domain?",
#         "Describe your most impactful project in this domain.",
#         "How do you stay current with industry trends?",
#         "What tools and frameworks are you proficient in?",
#         "Describe a complex problem you solved in this domain.",
#     ],
# }


# # ─────────────────────────────────────────────────────────────────────────────
# # Groq Helper: 1 – Generate Interview Question
# # ─────────────────────────────────────────────────────────────────────────────

# async def _groq_generate_question(
#     job_role: str,
#     interview_type: InterviewType,
#     difficulty: DifficultyLevel,
#     resume_text: Optional[str] = None,
# ) -> str:
#     """
#     Call Groq llama-3.3-70b-versatile to generate a single interview question.

#     Returns the question as a plain string.
#     Falls back to the static question bank on any error.
#     """
#     resume_context = (
#         f" The candidate's resume summary: {resume_text[:500]}"
#         if resume_text
#         else ""
#     )
#     prompt = (
#         f"Generate ONE interview question for a {job_role} ({interview_type.value}) "
#         f"at {difficulty.value} difficulty level.{resume_context} "
#         "Return the question only — no numbering, no explanation, no prefix."
#     )

#     logger.info(
#         "Groq | generate_question | role={} | type={} | difficulty={}",
#         job_role, interview_type.value, difficulty.value,
#     )

#     try:
#         client = _get_groq_client()
#         response = await client.chat.completions.create(
#             model=settings.groq_model,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "You are an expert technical interviewer at a top-tier tech company. "
#                         "Generate concise, relevant interview questions. Return ONLY the question."
#                     ),
#                 },
#                 {"role": "user", "content": prompt},
#             ],
#             max_tokens=150,
#             temperature=settings.groq_temperature,
#         )
#         question = response.choices[0].message.content.strip()
#         logger.success("Groq | generate_question | OK | tokens={}", response.usage.total_tokens)
#         return question

#     except Exception as exc:
#         logger.error("Groq | generate_question | FAILED | error={} | using fallback", exc)
#         # Fallback: first question from the static bank
#         fallback_list = QUESTION_BANK.get(interview_type, QUESTION_BANK[InterviewType.TECHNICAL])
#         return fallback_list[0]


# # ─────────────────────────────────────────────────────────────────────────────
# # Groq Helper: 2 – Evaluate Candidate Answer
# # ─────────────────────────────────────────────────────────────────────────────

# async def _groq_evaluate_answer(
#     question: str,
#     user_answer: str,
#     job_role: str,
#     interview_type: InterviewType,
# ) -> dict:
#     """
#     Call Groq to score and give feedback on a candidate's answer.

#     Returns a dict: {"content_score": float, "feedback": str}
#     Falls back to a word-count heuristic on any error.
#     """
#     prompt = (
#         f"You are evaluating an interview answer for a {job_role} position "
#         f"({interview_type.value} interview).\n\n"
#         f"Question: {question}\n\n"
#         f"Candidate's Answer: {user_answer}\n\n"
#         "Rate this answer from 0 to 10 based on content quality, relevance, and completeness. "
#         "Return ONLY valid JSON with no extra text:\n"
#         '{\"content_score\": <number 0-10>, \"feedback\": \"<one concise sentence>\"}'
#     )

#     logger.info(
#         "Groq | evaluate_answer | role={} | type={} | answer_len={}",
#         job_role, interview_type.value, len(user_answer),
#     )

#     try:
#         client = _get_groq_client()
#         response = await client.chat.completions.create(
#             model=settings.groq_model,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "You are a strict but fair interview evaluator. "
#                         "Always respond with valid JSON only."
#                     ),
#                 },
#                 {"role": "user", "content": prompt},
#             ],
#             max_tokens=200,
#             temperature=0.3,   # lower temp → more consistent JSON
#         )
#         raw = response.choices[0].message.content.strip()
#         logger.debug("Groq | evaluate_answer | raw={}", raw)

#         # Strip markdown code fences if model wraps JSON in ```json … ```
#         if raw.startswith("```"):
#             raw = raw.split("```")[1]
#             if raw.startswith("json"):
#                 raw = raw[4:]
#             raw = raw.strip()

#         result = json.loads(raw)
#         score = float(result.get("content_score", 5.0))
#         score = max(0.0, min(10.0, score))      # clamp to [0, 10]
#         feedback = str(result.get("feedback", "Good attempt. Keep practising."))

#         logger.success(
#             "Groq | evaluate_answer | OK | score={} | tokens={}",
#             score, response.usage.total_tokens,
#         )
#         return {"content_score": score, "feedback": feedback}

#     except Exception as exc:
#         logger.error("Groq | evaluate_answer | FAILED | error={} | using fallback", exc)
#         word_count = len(user_answer.split())
#         fallback_score = round(min(10.0, max(1.0, word_count / 20)), 1)
#         return {
#             "content_score": fallback_score,
#             "feedback": "Could not evaluate at this time. Keep practising!",
#         }


# # ─────────────────────────────────────────────────────────────────────────────
# # Groq Helper: 3 – Generate Follow-Up Question
# # ─────────────────────────────────────────────────────────────────────────────

# async def _groq_generate_followup(
#     question: str,
#     answer: str,
#     content_score: float,
# ) -> str:
#     """
#     Call Groq to generate a smart follow-up question based on the candidate's answer.

#     Returns the follow-up question as a plain string.
#     Falls back to a generic prompt on any error.
#     """
#     depth_hint = (
#         "The answer was weak, so probe for basic understanding."
#         if content_score < 5
#         else "The answer was decent, so probe for depth and edge cases."
#     )

#     prompt = (
#         f"Original question: {question}\n"
#         f"Candidate's answer: {answer}\n\n"
#         f"{depth_hint}\n"
#         "Generate ONE smart follow-up question to probe deeper. "
#         "Return only the question — one sentence, no prefix."
#     )

#     logger.info(
#         "Groq | generate_followup | score={} | answer_len={}",
#         content_score, len(answer),
#     )

#     try:
#         client = _get_groq_client()
#         response = await client.chat.completions.create(
#             model=settings.groq_model,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "You are an experienced interviewer. "
#                         "Generate targeted follow-up questions. Return ONLY the question."
#                     ),
#                 },
#                 {"role": "user", "content": prompt},
#             ],
#             max_tokens=100,
#             temperature=settings.groq_temperature,
#         )
#         followup = response.choices[0].message.content.strip()
#         logger.success("Groq | generate_followup | OK | tokens={}", response.usage.total_tokens)
#         return followup

#     except Exception as exc:
#         logger.error("Groq | generate_followup | FAILED | error={} | using fallback", exc)
#         return "Can you elaborate further on your previous answer with a concrete example?"


# # ─────────────────────────────────────────────────────────────────────────────
# # DB Persistence Helpers (Day 5)
# # ─────────────────────────────────────────────────────────────────────────────

# def _get_db_service():
#     """
#     Lazy import to avoid circular imports at module load time.

#     Returns:
#         The singleton DatabaseService instance.
#     """
#     from app.services.database import db_service
#     return db_service


# async def _persist_interview_to_db(session_data: dict) -> None:
#     """
#     Save a new interview session to MongoDB.
#     Non-blocking — failures are logged but never crash the request.

#     Args:
#         session_data: The in-memory session dict.
#     """
#     try:
#         db = _get_db_service()
#         if not db.is_connected:
#             return

#         interview_doc = InterviewDocument(
#             session_id=session_data["session_id"],
#             user_id=session_data["user_id"],
#             interview_type=session_data["interview_type"].value,
#             difficulty=session_data["difficulty"].value,
#             job_role=session_data["job_role"],
#             questions=session_data["questions"],
#             answers=[],
#             current_index=0,
#             status=InterviewStatus.ACTIVE,
#             created_at=session_data["started_at"],
#         )
#         await db.create_interview(interview_doc)
#     except Exception as exc:
#         logger.error("[DB] _persist_interview_to_db failed | error={}", exc)


# async def _persist_answer_to_db(
#     session_id: str,
#     question_id: str,
#     answer_text: str,
#     content_score: float,
#     feedback_text: str,
# ) -> None:
#     """
#     Append an answer to the interview document in MongoDB.
#     Non-blocking — failures are logged but never crash the request.

#     Args:
#         session_id: Interview session ID.
#         question_id: Question ID being answered.
#         answer_text: User's answer text.
#         content_score: Groq's content score.
#         feedback_text: Groq's feedback.
#     """
#     try:
#         db = _get_db_service()
#         if not db.is_connected:
#             return

#         answer_record = {
#             "question_id": question_id,
#             "answer_text": answer_text,
#             "submitted_at": datetime.utcnow().isoformat(),
#             "content_score": content_score,
#             "feedback": feedback_text,
#         }
#         await db.add_answer_to_interview(session_id, answer_record)
#     except Exception as exc:
#         logger.error("[DB] _persist_answer_to_db failed | error={}", exc)


# async def _persist_feedback_to_db(
#     session_id: str,
#     question_id: str,
#     user_id: str,
#     feedback: AnswerFeedback,
#     communication: CommunicationAnalysis,
# ) -> None:
#     """
#     Save detailed feedback to the ``feedback`` collection in MongoDB.
#     Non-blocking — failures are logged but never crash the request.

#     Args:
#         session_id: Interview session ID.
#         question_id: Question ID.
#         user_id: User ID.
#         feedback: The AnswerFeedback object.
#         communication: The CommunicationAnalysis object.
#     """
#     try:
#         db = _get_db_service()
#         if not db.is_connected:
#             return

#         feedback_doc = FeedbackDocument(
#             interview_id=session_id,
#             question_id=question_id,
#             user_id=user_id,
#             content_score=feedback.content_score,
#             communication_score=communication.confidence_score,
#             filler_words_detected=communication.filler_words_detected,
#             wpm=communication.speaking_pace_wpm or 0,
#             confidence_score=communication.confidence_score,
#             clarity_score=communication.clarity_score,
#             suggestions=feedback.improvements,
#             overall_score=feedback.overall_score,
#         )
#         await db.save_feedback(feedback_doc)
#     except Exception as exc:
#         logger.error("[DB] _persist_feedback_to_db failed | error={}", exc)


# async def _update_session_status_in_db(session_id: str, status: str) -> None:
#     """
#     Update the interview status in MongoDB (e.g. on completion).

#     Args:
#         session_id: Interview session ID.
#         status: New status value.
#     """
#     try:
#         db = _get_db_service()
#         if not db.is_connected:
#             return

#         update_data: Dict[str, Any] = {"status": status}
#         if status == InterviewStatus.COMPLETED.value:
#             update_data["completed_at"] = datetime.utcnow()

#         await db.update_interview(session_id, update_data)
#     except Exception as exc:
#         logger.error("[DB] _update_session_status_in_db failed | error={}", exc)


# async def _update_user_stats_in_db(user_id: str, overall_score: float) -> None:
#     """
#     Update user stats and analytics in MongoDB after an interview completes.

#     Args:
#         user_id: The user's ID.
#         overall_score: The overall score from the interview.
#     """
#     try:
#         db = _get_db_service()
#         if not db.is_connected:
#             return

#         await db.update_user_stats(user_id, overall_score)
#         await db.update_user_analytics(user_id, overall_score)
#         await db.update_admin_stats()
#     except Exception as exc:
#         logger.error("[DB] _update_user_stats_in_db failed | error={}", exc)


# # ─────────────────────────────────────────────────────────────────────────────
# # Interview Service
# # ─────────────────────────────────────────────────────────────────────────────

# class InterviewService:
#     """Handles all interview session business logic."""

#     # ── Start Interview ───────────────────────────────────────────────────

#     async def start_interview(
#         self, payload: StartInterviewRequest
#     ) -> StartInterviewResponse:
#         """
#         Initialize a new interview session and return the first question.
#         Uses Groq llama-3.3-70b-versatile to generate a tailored first question.
#         Persists the session to MongoDB for long-term storage.
#         """
#         session_id = str(uuid.uuid4())
#         logger.info(
#             "Starting interview | session={} | user={} | type={} | role={}",
#             session_id, payload.user_id, payload.interview_type, payload.job_role,
#         )

#         # ── Day 2: Real Groq question generation ──────────────────────────
#         first_question_text = await _groq_generate_question(
#             job_role=payload.job_role,
#             interview_type=payload.interview_type,
#             difficulty=payload.difficulty,
#             resume_text=getattr(payload, "resume_text", None),
#         )

#         first_question = InterviewQuestion(
#             question_text=first_question_text,
#             question_type=payload.interview_type.value,
#             topic=self._get_topic(payload.interview_type, 0),
#         )

#         # Remaining questions come from the static bank (subsequent Groq calls
#         # happen per-answer in submit_answer so the user sees varied questions).
#         fallback_questions = QUESTION_BANK.get(
#             payload.interview_type, QUESTION_BANK[InterviewType.TECHNICAL]
#         )

#         session_data = {
#             "session_id": session_id,
#             "user_id": payload.user_id,
#             "interview_type": payload.interview_type,
#             "job_role": payload.job_role,
#             "difficulty": payload.difficulty,
#             "resume_text": getattr(payload, "resume_text", None),
#             # Store the first Groq question at index-0; rest filled from bank
#             "questions": [first_question_text] + fallback_questions[1:],
#             "current_index": 0,
#             "answers": [],
#             "status": SessionStatus.ACTIVE,
#             "started_at": datetime.utcnow(),
#         }
#         _session_store[session_id] = session_data
#         logger.debug("Session stored in memory: {}", session_id)

#         # ── Day 5: Persist to MongoDB (non-blocking) ─────────────────────
#         await _persist_interview_to_db(session_data)

#         total_q = len(session_data["questions"])
#         return StartInterviewResponse(
#             session_id=session_id,
#             user_id=payload.user_id,
#             interview_type=payload.interview_type,
#             job_role=payload.job_role,
#             difficulty=payload.difficulty,
#             first_question=first_question,
#             total_questions=total_q,
#             estimated_duration_minutes=total_q * 3,
#         )

#     # ── Submit Answer ─────────────────────────────────────────────────────

#     async def submit_answer(
#         self, payload: SubmitAnswerRequest
#     ) -> SubmitAnswerResponse:
#         """
#         Process a user's answer:
#         1. Evaluate with Groq (content score + feedback).
#         2. Generate Groq follow-up question (stored as next question if applicable).
#         3. Advance session to the next question.
#         4. Persist answer + feedback to MongoDB (Day 5).
#         """
#         session = _session_store.get(payload.session_id)
#         if not session:
#             from fastapi import HTTPException
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"Session '{payload.session_id}' not found. It may have expired.",
#             )

#         if session["status"] != SessionStatus.ACTIVE:
#             from fastapi import HTTPException
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"Session is {session['status'].value}. Only active sessions accept answers.",
#             )

#         current_question_text = session["questions"][session["current_index"]]
#         logger.info(
#             "Answer received | session={} | question={} | length={} chars",
#             payload.session_id, payload.question_id, len(payload.answer_text),
#         )

#         # Store the answer
#         answer_record = {
#             "question_id": payload.question_id,
#             "answer_text": payload.answer_text,
#             "submitted_at": datetime.utcnow().isoformat(),
#         }

#         session["answers"].append(answer_record)

# # ✅ Single evaluation call
#         eval_result = await _groq_evaluate_answer(
#              question=current_question_text,
#              user_answer=payload.answer_text,
#              job_role=session["job_role"],
#              interview_type=session["interview_type"],
#         )

#         content_score = eval_result.get("content_score", 5.0)
#         groq_feedback = eval_result.get("feedback", "Good attempt.")

# # ✅ Score assign once
#         answer_record["overall_score"] = round(content_score * 0.95, 1)
#         # ── Day 2: Real Groq answer evaluation ────────────────────────────
#         eval_result = await _groq_evaluate_answer(
#             question=current_question_text,
#             user_answer=payload.answer_text,
#             job_role=session["job_role"],
#             interview_type=session["interview_type"],
#         )
#         content_score = eval_result["content_score"]
#         groq_feedback = eval_result["feedback"]
#         # Save score back into answer record so session history can compute avg
#         answer_record["overall_score"] = round(content_score * 0.95, 1)

#         # ── Day 2: Real Groq follow-up generation ─────────────────────────
#         followup_text = await _groq_generate_followup(
#             question=current_question_text,
#             answer=payload.answer_text,
#             content_score=content_score,
#         )

#         # Build AnswerFeedback using Groq scores
#         derived = round(content_score * 0.95, 1)
#         # ── Day 3: Real Voice Analysis (Google Cloud STT + Librosa) ───────────────
#         transcription_text: Optional[str] = None
#         communication = CommunicationAnalysis(
#             filler_words_count=0,
#             confidence_score=7.5,   # fallback — overwritten below if audio present
#             clarity_score=7.5,      # fallback
#         )

#         audio_url = getattr(payload, "audio_file_url", None)
#         if audio_url:
#             logger.info(
#                 "Voice | audio_url detected | session={} | url={}",
#                 payload.session_id, audio_url,
#             )
#             try:
#                 transcribe_result, voice_result = await process_audio_url(audio_url)

#                 # Prefer Whisper transcription over typed answer when available
#                 if transcribe_result.success and transcribe_result.transcription:
#                     transcription_text = transcribe_result.transcription
#                     logger.info(
#                         "Voice | using Whisper transcription ({} words)",
#                         len(transcription_text.split()),
#                     )

#                 communication = CommunicationAnalysis(
#                     filler_words_count=voice_result.filler_count,
#                     filler_words_detected=voice_result.filler_words_detected,
#                     speaking_pace_wpm=voice_result.wpm if voice_result.wpm > 0 else None,
#                     confidence_score=voice_result.confidence_score,
#                     clarity_score=voice_result.clarity_score,
#                     silence_ratio=voice_result.silence_ratio,
#                 )
#                 logger.success(
#                     "Voice | analysis complete | fillers={} | wpm={} | "
#                     "confidence={} | clarity={}",
#                     voice_result.filler_count,
#                     voice_result.wpm,
#                     voice_result.confidence_score,
#                     voice_result.clarity_score,
#                 )
#             except Exception as exc:
#                 logger.warning(
#                     "Voice | pipeline failed | session={} | error={} | "
#                     "falling back to mock scores",
#                     payload.session_id, exc,
#                 )
#                 # communication already has mock 7.5 fallback values
#         else:
#             logger.debug(
#                 "Voice | no audio_url | session={} | using mock scores",
#                 payload.session_id,
#             )

#         feedback = AnswerFeedback(
#             content_score=round(content_score, 1),
#             completeness_score=round(content_score * 0.9, 1),
#             relevance_score=derived,
#             overall_score=derived,
#             strengths=[
#                 groq_feedback,
#                 "You attempted the question — great start!",
#             ],
#             improvements=[
#                 "Add specific examples from your experience (STAR method).",
#                 "Structure your answer with a brief intro, main points, and conclusion.",
#             ],
#             ideal_answer_hint="Focus on concrete examples and measurable outcomes.",
#             lms_course_recommendation="Check HiLearn course: 'Ace Technical Interviews' 📚",
#             communication=communication,
#         )

#         # ── Day 5: Persist answer + feedback to MongoDB ───────────────────
#         await _persist_answer_to_db(
#             session_id=payload.session_id,
#             question_id=payload.question_id,
#             answer_text=payload.answer_text,
#             content_score=content_score,
#             feedback_text=groq_feedback,
#         )
#         await _persist_feedback_to_db(
#             session_id=payload.session_id,
#             question_id=payload.question_id,
#             user_id=session["user_id"],
#             feedback=feedback,
#             communication=communication,
#         )

#         # ── Advance to Next Question ───────────────────────────────────────
#         session["current_index"] += 1
#         questions = session["questions"]
#         next_q_index = session["current_index"]

#         next_question: Optional[InterviewQuestion] = None
#         is_session_complete = next_q_index >= len(questions)

#         if not is_session_complete:
#             # Inject the Groq follow-up as the upcoming question
#             questions[next_q_index] = followup_text
#             next_question = InterviewQuestion(
#                 question_text=followup_text,
#                 question_type=session["interview_type"].value,
#                 topic=self._get_topic(session["interview_type"], next_q_index),
#             )
#         else:
#             session["status"] = SessionStatus.COMPLETED
#             logger.info("Session completed: {}", payload.session_id)

#             # ── Day 5: Update session status + user stats in MongoDB ──────
#             await _update_session_status_in_db(
#                 payload.session_id, InterviewStatus.COMPLETED.value
#             )
#             await _update_user_stats_in_db(session["user_id"], derived)

#         return SubmitAnswerResponse(
#             session_id=payload.session_id,
#             question_id=payload.question_id,
#             feedback=feedback,
#             next_question=next_question,
#             questions_answered=next_q_index,
#             total_questions=len(questions),
#             session_status=session["status"],
#             transcription=transcription_text,
#             message=(
#                 "Great answer! Here's your next question 🚀"
#                 if not is_session_complete
#                 else "Interview complete! 🎉 Check your performance dashboard."
#             ),
#         )

#     # ── Session Retrieval ──────────────────────────────────────────────────

#     async def get_session(self, session_id: str) -> Optional[dict]:
#         """
#         Retrieve a session — check in-memory cache first, then MongoDB.

#         Args:
#             session_id: The session's unique identifier.

#         Returns:
#             Session dict if found, None otherwise.
#         """
#         # Try in-memory cache first (fast path for active sessions)
#         cached = _session_store.get(session_id)
#         if cached:
#             return cached

#         # Fallback to MongoDB for historical sessions
#         try:
#             db = _get_db_service()
#             if db.is_connected:
#                 interview = await db.get_interview(session_id)
#                 if interview:
#                     logger.debug("Session loaded from MongoDB: {}", session_id)
#                     return interview.model_dump()
#         except Exception as exc:
#             logger.error("get_session DB fallback failed | session_id={} | error={}", session_id, exc)

#         return None

#     # ── User Interview History (Day 5) ─────────────────────────────────────

#     async def get_user_interview_history(
#         self, user_id: str, limit: int = 20, skip: int = 0
#     ) -> List[Dict[str, Any]]:
#         """
#         Retrieve a user's interview history from MongoDB.

#         Args:
#             user_id: The user's unique identifier.
#             limit: Maximum number of results.
#             skip: Number of results to skip for pagination.

#         Returns:
#             List of interview dicts (newest first).
#         """
#         try:
#             db = _get_db_service()
#             if not db.is_connected:
#                 logger.debug("get_user_interview_history skipped — DB not connected")
#                 return []

#             interviews = await db.get_user_interviews(user_id, limit=limit, skip=skip)
#             return [interview.model_dump() for interview in interviews]
#         except Exception as exc:
#             logger.error(
#                 "get_user_interview_history failed | user_id={} | error={}",
#                 user_id, exc,
#             )
#             return []

#     async def get_user_sessions(self, user_id: str) -> list:
#         """Return all sessions for a given user_id from in-memory store."""
#         sessions = []
#         for session_id, session in _session_store.items():
#             if session.get("user_id") == user_id:
#                 answers = session.get("answers", [])
#                 scores = [a.get("overall_score", 0) for a in answers if a.get("overall_score")]
#                 avg_score = round(sum(scores) / len(scores), 1) if scores else 0
#                 sessions.append({
#                     "session_id": session_id,
#                     "interview_type": session.get("interview_type", "technical"),
#                     "job_role": session.get("job_role", ""),
#                     "difficulty": session.get("difficulty", "intermediate"),
#                     "status": str(session.get("status", "active")),
#                     "started_at": str(session.get("started_at", "")),
#                     "questions_answered": session.get("current_index", 0),
#                     "total_questions": len(session.get("questions", [])),
#                     "avg_score": avg_score,
#                 })
#         sessions.sort(key=lambda s: s["started_at"], reverse=True)
#         return sessions

#     # ── Private Helpers ────────────────────────────────────────────────────

#     def _get_topic(self, interview_type: InterviewType, index: int) -> str:
#         topics = {
#             InterviewType.TECHNICAL: [
#                 "Introduction", "Web Concepts", "Databases",
#                 "Async Programming", "Design Principles", "System Design",
#                 "Data Storage", "Architecture", "Error Handling", "Testing",
#             ],
#             InterviewType.BEHAVIORAL: [
#                 "Problem Solving", "Pressure Handling",
#                 "Conflict Resolution", "Achievement", "Growth Mindset",
#             ],
#             InterviewType.HR: [
#                 "Company Fit", "Career Goals", "Compensation",
#                 "Flexibility", "Transition",
#             ],
#             InterviewType.DOMAIN_SPECIFIC: [
#                 "Motivation", "Projects", "Learning Agility",
#                 "Technical Skills", "Domain Expertise",
#             ],
#         }
#         topic_list = topics.get(interview_type, ["General"])
#         return topic_list[index % len(topic_list)]


# # ── Module-level service singleton ────────────────────────────────────────────
# interview_service = InterviewService()



"""
HiLearn AI Interview Prep - Interview Service Layer
Business logic for managing interview sessions.

Day 2: Groq AI integrated for question generation & answer evaluation. ✅
Day 3: Google Cloud Speech-to-Text (STT) + Librosa voice analysis wired in.       ✅
Day 5: MongoDB persistence via DatabaseService — in-memory cache retained for
       fast reads during active sessions, DB used for persistence.               ✅
"""
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from groq import AsyncGroq
from loguru import logger

from app.core.config import get_settings
from app.models.db_models import (
    AnswerRecord,
    FeedbackDocument,
    InterviewDocument,
    InterviewStatus,
)
from app.models.schemas import (
    AnswerFeedback,
    CommunicationAnalysis,
    DifficultyLevel,
    InterviewQuestion,
    InterviewType,
    SessionStatus,
    StartInterviewRequest,
    StartInterviewResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
)
from app.services.voice_service import process_audio_url

settings = get_settings()

# ─────────────────────────────────────────────────────────
# Groq Async Client (singleton, reused across requests)
# ─────────────────────────────────────────────────────────
_groq_client: Optional[AsyncGroq] = None

GROQ_TIMEOUT_SECONDS = 30


def _get_groq_client() -> AsyncGroq:
    """Return a cached AsyncGroq client instance."""
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(
            api_key=settings.groq_api_key,
            timeout=GROQ_TIMEOUT_SECONDS,
        )
        logger.info("Groq AsyncClient initialised (model={})", settings.groq_model)
    return _groq_client


# ─────────────────────────────────────────────────────────
# In-Memory Session Cache (fast reads; DB for persistence)
# ─────────────────────────────────────────────────────────
_session_store: dict = {}


# ─────────────────────────────────────────────────────────
# Fallback Question Bank (used only when Groq API fails)
# ─────────────────────────────────────────────────────────
QUESTION_BANK = {
    InterviewType.TECHNICAL: [
        "Tell me about yourself and your technical background.",
        "Explain the difference between REST and GraphQL. When would you use each?",
        "What is database indexing and why is it important?",
        "Explain async/await in Python. How does it differ from multithreading?",
        "What are SOLID principles? Give an example of each.",
        "How would you design a URL shortener like bit.ly?",
        "What is the difference between SQL and NoSQL databases?",
        "Explain the concept of microservices vs monolith architecture.",
        "How do you handle errors and exceptions in your code?",
        "What is your approach to writing unit tests?",
    ],
    InterviewType.BEHAVIORAL: [
        "Tell me about a time you faced a major technical challenge. How did you overcome it?",
        "Describe a situation where you had to work under pressure to meet a deadline.",
        "Tell me about a time you disagreed with a teammate. How did you handle it?",
        "Describe a project you're most proud of and why.",
        "How do you handle feedback and criticism about your work?",
    ],
    InterviewType.HR: [
        "Why do you want to join our company?",
        "Where do you see yourself in 5 years?",
        "What is your expected CTC?",
        "Are you comfortable with relocation?",
        "Why are you leaving your current role?",
    ],
    InterviewType.DOMAIN_SPECIFIC: [
        "What motivated you to choose this domain?",
        "Describe your most impactful project in this domain.",
        "How do you stay current with industry trends?",
        "What tools and frameworks are you proficient in?",
        "Describe a complex problem you solved in this domain.",
    ],
}


# ─────────────────────────────────────────────────────────────────────────────
# Groq Helper: 1 – Generate Interview Question
# ─────────────────────────────────────────────────────────────────────────────

async def _groq_generate_question(
    job_role: str,
    interview_type: InterviewType,
    difficulty: DifficultyLevel,
    resume_text: Optional[str] = None,
) -> str:
    """
    Call Groq llama-3.3-70b-versatile to generate a single interview question.

    Returns the question as a plain string.
    Falls back to the static question bank on any error.
    """
    resume_context = (
        f" The candidate's resume summary: {resume_text[:500]}"
        if resume_text
        else ""
    )
    prompt = (
        f"Generate ONE interview question for a {job_role} ({interview_type.value}) "
        f"at {difficulty.value} difficulty level.{resume_context} "
        "Return the question only — no numbering, no explanation, no prefix."
    )

    logger.info(
        "Groq | generate_question | role={} | type={} | difficulty={}",
        job_role, interview_type.value, difficulty.value,
    )

    try:
        client = _get_groq_client()
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert technical interviewer at a top-tier tech company. "
                        "Generate concise, relevant interview questions. Return ONLY the question."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=settings.groq_temperature,
        )
        question = response.choices[0].message.content.strip()
        logger.success("Groq | generate_question | OK | tokens={}", response.usage.total_tokens)
        return question

    except Exception as exc:
        logger.error("Groq | generate_question | FAILED | error={} | using fallback", exc)
        fallback_list = QUESTION_BANK.get(interview_type, QUESTION_BANK[InterviewType.TECHNICAL])
        return fallback_list[0]


# ─────────────────────────────────────────────────────────────────────────────
# Groq Helper: 2 – Evaluate Candidate Answer
# ─────────────────────────────────────────────────────────────────────────────

async def _groq_evaluate_answer(
    question: str,
    user_answer: str,
    job_role: str,
    interview_type: InterviewType,
) -> dict:
    """
    Call Groq to score and give feedback on a candidate's answer.

    Returns a dict: {"content_score": float, "feedback": str}
    Falls back to a word-count heuristic on any error.
    """
    prompt = (
        f"You are evaluating an interview answer for a {job_role} position "
        f"({interview_type.value} interview).\n\n"
        f"Question: {question}\n\n"
        f"Candidate's Answer: {user_answer}\n\n"
        "Rate this answer from 0 to 10 based on content quality, relevance, and completeness. "
        "Return ONLY valid JSON with no extra text:\n"
        '{\"content_score\": <number 0-10>, \"feedback\": \"<one concise sentence>\"}'
    )

    logger.info(
        "Groq | evaluate_answer | role={} | type={} | answer_len={}",
        job_role, interview_type.value, len(user_answer),
    )

    try:
        client = _get_groq_client()
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a strict but fair interview evaluator. "
                        "Always respond with valid JSON only."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=200,
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        logger.debug("Groq | evaluate_answer | raw={}", raw)

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        result = json.loads(raw)
        score = float(result.get("content_score", 5.0))
        score = max(0.0, min(10.0, score))
        feedback = str(result.get("feedback", "Good attempt. Keep practising."))

        logger.success(
            "Groq | evaluate_answer | OK | score={} | tokens={}",
            score, response.usage.total_tokens,
        )
        return {"content_score": score, "feedback": feedback}

    except Exception as exc:
        logger.error("Groq | evaluate_answer | FAILED | error={} | using fallback", exc)
        word_count = len(user_answer.split())
        fallback_score = round(min(10.0, max(1.0, word_count / 20)), 1)
        return {
            "content_score": fallback_score,
            "feedback": "Could not evaluate at this time. Keep practising!",
        }


# ─────────────────────────────────────────────────────────────────────────────
# Groq Helper: 3 – Generate Follow-Up Question
# ─────────────────────────────────────────────────────────────────────────────

async def _groq_generate_followup(
    question: str,
    answer: str,
    content_score: float,
) -> str:
    """
    Call Groq to generate a smart follow-up question based on the candidate's answer.

    Returns the follow-up question as a plain string.
    Falls back to a generic prompt on any error.
    """
    depth_hint = (
        "The answer was weak, so probe for basic understanding."
        if content_score < 5
        else "The answer was decent, so probe for depth and edge cases."
    )

    prompt = (
        f"Original question: {question}\n"
        f"Candidate's answer: {answer}\n\n"
        f"{depth_hint}\n"
        "Generate ONE smart follow-up question to probe deeper. "
        "Return only the question — one sentence, no prefix."
    )

    logger.info(
        "Groq | generate_followup | score={} | answer_len={}",
        content_score, len(answer),
    )

    try:
        client = _get_groq_client()
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an experienced interviewer. "
                        "Generate targeted follow-up questions. Return ONLY the question."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=100,
            temperature=settings.groq_temperature,
        )
        followup = response.choices[0].message.content.strip()
        logger.success("Groq | generate_followup | OK | tokens={}", response.usage.total_tokens)
        return followup

    except Exception as exc:
        logger.error("Groq | generate_followup | FAILED | error={} | using fallback", exc)
        return "Can you elaborate further on your previous answer with a concrete example?"


# ─────────────────────────────────────────────────────────────────────────────
# DB Persistence Helpers (Day 5)
# ─────────────────────────────────────────────────────────────────────────────

def _get_db_service():
    """
    Lazy import to avoid circular imports at module load time.

    Returns:
        The singleton DatabaseService instance.
    """
    from app.services.database import db_service
    return db_service


async def _persist_interview_to_db(session_data: dict) -> None:
    """
    Save a new interview session to MongoDB.
    Non-blocking — failures are logged but never crash the request.
    """
    try:
        db = _get_db_service()
        if not db.is_connected:
            return

        interview_doc = InterviewDocument(
            session_id=session_data["session_id"],
            user_id=session_data["user_id"],
            interview_type=session_data["interview_type"].value,
            difficulty=session_data["difficulty"].value,
            job_role=session_data["job_role"],
            questions=session_data["questions"],
            answers=[],
            current_index=0,
            status=InterviewStatus.ACTIVE,
            created_at=session_data["started_at"],
        )
        await db.create_interview(interview_doc)
    except Exception as exc:
        logger.error("[DB] _persist_interview_to_db failed | error={}", exc)


async def _persist_answer_to_db(
    session_id: str,
    question_id: str,
    answer_text: str,
    content_score: float,
    feedback_text: str,
) -> None:
    """
    Append an answer to the interview document in MongoDB.
    Non-blocking — failures are logged but never crash the request.
    """
    try:
        db = _get_db_service()
        if not db.is_connected:
            return

        answer_record = {
            "question_id": question_id,
            "answer_text": answer_text,
            "submitted_at": datetime.utcnow().isoformat(),
            "content_score": content_score,
            "feedback": feedback_text,
        }
        await db.add_answer_to_interview(session_id, answer_record)
    except Exception as exc:
        logger.error("[DB] _persist_answer_to_db failed | error={}", exc)


async def _persist_feedback_to_db(
    session_id: str,
    question_id: str,
    user_id: str,
    feedback: AnswerFeedback,
    communication: CommunicationAnalysis,
) -> None:
    """
    Save detailed feedback to the feedback collection in MongoDB.
    Non-blocking — failures are logged but never crash the request.
    """
    try:
        db = _get_db_service()
        if not db.is_connected:
            return

        feedback_doc = FeedbackDocument(
            interview_id=session_id,
            question_id=question_id,
            user_id=user_id,
            content_score=feedback.content_score,
            communication_score=communication.confidence_score,
            filler_words_detected=communication.filler_words_detected,
            wpm=communication.speaking_pace_wpm or 0,
            confidence_score=communication.confidence_score,
            clarity_score=communication.clarity_score,
            suggestions=feedback.improvements,
            overall_score=feedback.overall_score,
        )
        await db.save_feedback(feedback_doc)
    except Exception as exc:
        logger.error("[DB] _persist_feedback_to_db failed | error={}", exc)


async def _update_session_status_in_db(session_id: str, status: str) -> None:
    """Update the interview status in MongoDB (e.g. on completion)."""
    try:
        db = _get_db_service()
        if not db.is_connected:
            return

        update_data: Dict[str, Any] = {"status": status}
        if status == InterviewStatus.COMPLETED.value:
            update_data["completed_at"] = datetime.utcnow()

        await db.update_interview(session_id, update_data)
    except Exception as exc:
        logger.error("[DB] _update_session_status_in_db failed | error={}", exc)


async def _update_user_stats_in_db(user_id: str, overall_score: float) -> None:
    """Update user stats and analytics in MongoDB after an interview completes."""
    try:
        db = _get_db_service()
        if not db.is_connected:
            return

        await db.update_user_stats(user_id, overall_score)
        await db.update_user_analytics(user_id, overall_score)
        await db.update_admin_stats()
    except Exception as exc:
        logger.error("[DB] _update_user_stats_in_db failed | error={}", exc)


# ─────────────────────────────────────────────────────────────────────────────
# Interview Service
# ─────────────────────────────────────────────────────────────────────────────

class InterviewService:
    """Handles all interview session business logic."""

    # ── Start Interview ───────────────────────────────────────────────────

    async def start_interview(
        self, payload: StartInterviewRequest
    ) -> StartInterviewResponse:
        """
        Initialize a new interview session and return the first question.
        Uses Groq llama-3.3-70b-versatile to generate a tailored first question.
        Persists the session to MongoDB for long-term storage.
        """
        session_id = str(uuid.uuid4())
        logger.info(
            "Starting interview | session={} | user={} | type={} | role={}",
            session_id, payload.user_id, payload.interview_type, payload.job_role,
        )

        first_question_text = await _groq_generate_question(
            job_role=payload.job_role,
            interview_type=payload.interview_type,
            difficulty=payload.difficulty,
            resume_text=getattr(payload, "resume_text", None),
        )

        first_question = InterviewQuestion(
            question_text=first_question_text,
            question_type=payload.interview_type.value,
            topic=self._get_topic(payload.interview_type, 0),
        )

        fallback_questions = QUESTION_BANK.get(
            payload.interview_type, QUESTION_BANK[InterviewType.TECHNICAL]
        )

        session_data = {
            "session_id": session_id,
            "user_id": payload.user_id,
            "interview_type": payload.interview_type,
            "job_role": payload.job_role,
            "difficulty": payload.difficulty,
            "resume_text": getattr(payload, "resume_text", None),
            "questions": [first_question_text] + fallback_questions[1:],
            "current_index": 0,
            "answers": [],
            "status": SessionStatus.ACTIVE,
            "started_at": datetime.utcnow(),
        }
        _session_store[session_id] = session_data
        logger.debug("Session stored in memory: {}", session_id)

        await _persist_interview_to_db(session_data)

        total_q = len(session_data["questions"])
        return StartInterviewResponse(
            session_id=session_id,
            user_id=payload.user_id,
            interview_type=payload.interview_type,
            job_role=payload.job_role,
            difficulty=payload.difficulty,
            first_question=first_question,
            total_questions=total_q,
            estimated_duration_minutes=total_q * 3,
        )

    # ── Submit Answer ─────────────────────────────────────────────────────

    async def submit_answer(
        self, payload: SubmitAnswerRequest
    ) -> SubmitAnswerResponse:
        """
        Process a user's answer:
        1. Evaluate with Groq (content score + feedback).
        2. Generate Groq follow-up question.
        3. Advance session to the next question.
        4. Persist answer + feedback to MongoDB (Day 5).
        """
        session = _session_store.get(payload.session_id)
        if not session:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=404,
                detail=f"Session '{payload.session_id}' not found. It may have expired.",
            )

        if session["status"] != SessionStatus.ACTIVE:
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400,
                detail=f"Session is {session['status'].value}. Only active sessions accept answers.",
            )

        current_question_text = session["questions"][session["current_index"]]
        logger.info(
            "Answer received | session={} | question={} | length={} chars",
            payload.session_id, payload.question_id, len(payload.answer_text),
        )

        # Store the answer
        answer_record = {
            "question_id": payload.question_id,
            "answer_text": payload.answer_text,
            "submitted_at": datetime.utcnow().isoformat(),
        }
        session["answers"].append(answer_record)

        # FIX: Single evaluation call — was being called twice before (double API cost!)
        eval_result = await _groq_evaluate_answer(
            question=current_question_text,
            user_answer=payload.answer_text,
            job_role=session["job_role"],
            interview_type=session["interview_type"],
        )
        content_score = eval_result["content_score"]
        groq_feedback = eval_result["feedback"]
        answer_record["overall_score"] = round(content_score * 0.95, 1)

        # Generate follow-up question
        followup_text = await _groq_generate_followup(
            question=current_question_text,
            answer=payload.answer_text,
            content_score=content_score,
        )

        derived = round(content_score * 0.95, 1)

        # ── Day 3: Voice Analysis (Google Cloud STT + Librosa) ────────────
        transcription_text: Optional[str] = None
        communication = CommunicationAnalysis(
            filler_words_count=0,
            confidence_score=7.5,
            clarity_score=7.5,
        )

        audio_url = getattr(payload, "audio_file_url", None)
        if audio_url:
            logger.info(
                "Voice | audio_url detected | session={} | url={}",
                payload.session_id, audio_url,
            )
            try:
                transcribe_result, voice_result = await process_audio_url(audio_url)

                if transcribe_result.success and transcribe_result.transcription:
                    transcription_text = transcribe_result.transcription
                    logger.info(
                        "Voice | using Whisper transcription ({} words)",
                        len(transcription_text.split()),
                    )

                communication = CommunicationAnalysis(
                    filler_words_count=voice_result.filler_count,
                    filler_words_detected=voice_result.filler_words_detected,
                    speaking_pace_wpm=voice_result.wpm if voice_result.wpm > 0 else None,
                    confidence_score=voice_result.confidence_score,
                    clarity_score=voice_result.clarity_score,
                    silence_ratio=voice_result.silence_ratio,
                )
                logger.success(
                    "Voice | analysis complete | fillers={} | wpm={} | "
                    "confidence={} | clarity={}",
                    voice_result.filler_count,
                    voice_result.wpm,
                    voice_result.confidence_score,
                    voice_result.clarity_score,
                )
            except Exception as exc:
                logger.warning(
                    "Voice | pipeline failed | session={} | error={} | "
                    "falling back to mock scores",
                    payload.session_id, exc,
                )
        else:
            logger.debug(
                "Voice | no audio_url | session={} | using mock scores",
                payload.session_id,
            )

        feedback = AnswerFeedback(
            content_score=round(content_score, 1),
            completeness_score=round(content_score * 0.9, 1),
            relevance_score=derived,
            overall_score=derived,
            strengths=[
                groq_feedback,
                "You attempted the question — great start!",
            ],
            improvements=[
                "Add specific examples from your experience (STAR method).",
                "Structure your answer with a brief intro, main points, and conclusion.",
            ],
            ideal_answer_hint="Focus on concrete examples and measurable outcomes.",
            lms_course_recommendation="Check HiLearn course: 'Ace Technical Interviews' 📚",
            communication=communication,
        )

        # ── Day 5: Persist answer + feedback to MongoDB ───────────────────
        await _persist_answer_to_db(
            session_id=payload.session_id,
            question_id=payload.question_id,
            answer_text=payload.answer_text,
            content_score=content_score,
            feedback_text=groq_feedback,
        )
        await _persist_feedback_to_db(
            session_id=payload.session_id,
            question_id=payload.question_id,
            user_id=session["user_id"],
            feedback=feedback,
            communication=communication,
        )

        # ── Advance to Next Question ───────────────────────────────────────
        session["current_index"] += 1
        questions = session["questions"]
        next_q_index = session["current_index"]

        next_question: Optional[InterviewQuestion] = None
        is_session_complete = next_q_index >= len(questions)

        if not is_session_complete:
            questions[next_q_index] = followup_text
            next_question = InterviewQuestion(
                question_text=followup_text,
                question_type=session["interview_type"].value,
                topic=self._get_topic(session["interview_type"], next_q_index),
            )
        else:
            session["status"] = SessionStatus.COMPLETED
            logger.info("Session completed: {}", payload.session_id)

            await _update_session_status_in_db(
                payload.session_id, InterviewStatus.COMPLETED.value
            )
            await _update_user_stats_in_db(session["user_id"], derived)

        return SubmitAnswerResponse(
            session_id=payload.session_id,
            question_id=payload.question_id,
            feedback=feedback,
            next_question=next_question,
            questions_answered=next_q_index,
            total_questions=len(questions),
            session_status=session["status"],
            transcription=transcription_text,
            message=(
                "Great answer! Here's your next question 🚀"
                if not is_session_complete
                else "Interview complete! 🎉 Check your performance dashboard."
            ),
        )

    # ── Session Retrieval ──────────────────────────────────────────────────

    async def get_session(self, session_id: str) -> Optional[dict]:
        """
        Retrieve a session — check in-memory cache first, then MongoDB.
        """
        cached = _session_store.get(session_id)
        if cached:
            return cached

        try:
            db = _get_db_service()
            if db.is_connected:
                interview = await db.get_interview(session_id)
                if interview:
                    logger.debug("Session loaded from MongoDB: {}", session_id)
                    return interview.model_dump()
        except Exception as exc:
            logger.error("get_session DB fallback failed | session_id={} | error={}", session_id, exc)

        return None

    # ── User Interview History (Day 5) ─────────────────────────────────────

    async def get_user_interview_history(
        self, user_id: str, limit: int = 20, skip: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Retrieve a user's interview history from MongoDB.
        """
        try:
            db = _get_db_service()
            if not db.is_connected:
                logger.debug("get_user_interview_history skipped — DB not connected")
                return []

            interviews = await db.get_user_interviews(user_id, limit=limit, skip=skip)
            return [interview.model_dump() for interview in interviews]
        except Exception as exc:
            logger.error(
                "get_user_interview_history failed | user_id={} | error={}",
                user_id, exc,
            )
            return []

    async def get_user_sessions(self, user_id: str) -> list:
        """Return all sessions for a given user_id from in-memory store."""
        sessions = []
        for session_id, session in _session_store.items():
            if session.get("user_id") == user_id:
                answers = session.get("answers", [])
                scores = [a.get("overall_score", 0) for a in answers if a.get("overall_score")]
                avg_score = round(sum(scores) / len(scores), 1) if scores else 0
                sessions.append({
                    "session_id": session_id,
                    "interview_type": session.get("interview_type", "technical"),
                    "job_role": session.get("job_role", ""),
                    "difficulty": session.get("difficulty", "intermediate"),
                    "status": str(session.get("status", "active")),
                    "started_at": str(session.get("started_at", "")),
                    "questions_answered": session.get("current_index", 0),
                    "total_questions": len(session.get("questions", [])),
                    "avg_score": avg_score,
                })
        sessions.sort(key=lambda s: s["started_at"], reverse=True)
        return sessions

    # ── Private Helpers ────────────────────────────────────────────────────

    def _get_topic(self, interview_type: InterviewType, index: int) -> str:
        topics = {
            InterviewType.TECHNICAL: [
                "Introduction", "Web Concepts", "Databases",
                "Async Programming", "Design Principles", "System Design",
                "Data Storage", "Architecture", "Error Handling", "Testing",
            ],
            InterviewType.BEHAVIORAL: [
                "Problem Solving", "Pressure Handling",
                "Conflict Resolution", "Achievement", "Growth Mindset",
            ],
            InterviewType.HR: [
                "Company Fit", "Career Goals", "Compensation",
                "Flexibility", "Transition",
            ],
            InterviewType.DOMAIN_SPECIFIC: [
                "Motivation", "Projects", "Learning Agility",
                "Technical Skills", "Domain Expertise",
            ],
        }
        topic_list = topics.get(interview_type, ["General"])
        return topic_list[index % len(topic_list)]


# ── Module-level service singleton ────────────────────────────────────────────
interview_service = InterviewService()