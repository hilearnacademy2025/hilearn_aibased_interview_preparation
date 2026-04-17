"""
HiLearn AI Interview Prep - Interview Service Layer
Business logic for managing interview sessions.

Day 2: Groq AI integrated for question generation & answer evaluation. ✅
TODO (Day 3): Wire up OpenAI Whisper for voice analysis.
TODO (Day 4): Wire up MongoDB for session persistence.
"""
import json
import uuid
from datetime import datetime
from typing import Optional

from groq import AsyncGroq
from loguru import logger

from app.core.config import get_settings
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
# In-Memory Session Store (temporary until MongoDB Day 4)
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
        # Fallback: first question from the static bank
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
            temperature=0.3,   # lower temp → more consistent JSON
        )
        raw = response.choices[0].message.content.strip()
        logger.debug("Groq | evaluate_answer | raw={}", raw)

        # Strip markdown code fences if model wraps JSON in ```json … ```
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        result = json.loads(raw)
        score = float(result.get("content_score", 5.0))
        score = max(0.0, min(10.0, score))      # clamp to [0, 10]
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
        """
        session_id = str(uuid.uuid4())
        logger.info(
            "Starting interview | session={} | user={} | type={} | role={}",
            session_id, payload.user_id, payload.interview_type, payload.job_role,
        )

        # ── Day 2: Real Groq question generation ──────────────────────────
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

        # Remaining questions come from the static bank (subsequent Groq calls
        # happen per-answer in submit_answer so the user sees varied questions).
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
            # Store the first Groq question at index-0; rest filled from bank
            "questions": [first_question_text] + fallback_questions[1:],
            "current_index": 0,
            "answers": [],
            "status": SessionStatus.ACTIVE,
            "started_at": datetime.utcnow(),
        }
        _session_store[session_id] = session_data
        logger.debug("Session stored in memory: {}", session_id)

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
        2. Generate Groq follow-up question (stored as next question if applicable).
        3. Advance session to the next question.

        TODO (Day 3): Call Librosa for filler word / pacing detection if audio provided.
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
        session["answers"].append({
            "question_id": payload.question_id,
            "answer_text": payload.answer_text,
            "submitted_at": datetime.utcnow(),
        })

        # ── Day 2: Real Groq answer evaluation ────────────────────────────
        eval_result = await _groq_evaluate_answer(
            question=current_question_text,
            user_answer=payload.answer_text,
            job_role=session["job_role"],
            interview_type=session["interview_type"],
        )
        content_score = eval_result["content_score"]
        groq_feedback = eval_result["feedback"]

        # ── Day 2: Real Groq follow-up generation ─────────────────────────
        followup_text = await _groq_generate_followup(
            question=current_question_text,
            answer=payload.answer_text,
            content_score=content_score,
        )

        # Build AnswerFeedback using Groq scores
        derived = round(content_score * 0.95, 1)
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
            communication=CommunicationAnalysis(
                filler_words_count=0,       # TODO (Day 3): Librosa analysis
                confidence_score=7.5,       # TODO (Day 3): voice analysis
                clarity_score=7.5,          # TODO (Day 3): voice analysis
            ),
        )

        # ── Advance to Next Question ───────────────────────────────────────
        session["current_index"] += 1
        questions = session["questions"]
        next_q_index = session["current_index"]

        next_question: Optional[InterviewQuestion] = None
        is_session_complete = next_q_index >= len(questions)

        if not is_session_complete:
            # Inject the Groq follow-up as the upcoming question
            questions[next_q_index] = followup_text
            next_question = InterviewQuestion(
                question_text=followup_text,
                question_type=session["interview_type"].value,
                topic=self._get_topic(session["interview_type"], next_q_index),
            )
        else:
            session["status"] = SessionStatus.COMPLETED
            logger.info("Session completed: {}", payload.session_id)

        return SubmitAnswerResponse(
            session_id=payload.session_id,
            question_id=payload.question_id,
            feedback=feedback,
            next_question=next_question,
            questions_answered=next_q_index,
            total_questions=len(questions),
            session_status=session["status"],
            message=(
                "Great answer! Here's your next question 🚀"
                if not is_session_complete
                else "Interview complete! 🎉 Check your performance dashboard."
            ),
        )

    # ── Session Retrieval ──────────────────────────────────────────────────

    async def get_session(self, session_id: str) -> Optional[dict]:
        """Retrieve a session from the in-memory store."""
        return _session_store.get(session_id)

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
