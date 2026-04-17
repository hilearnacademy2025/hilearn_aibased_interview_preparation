"""
HiLearn AI Interview Prep - Pydantic Models
Request / Response schemas for all API endpoints.
"""
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


# ─────────────────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────────────────

class InterviewType(str, Enum):
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    HR = "hr"
    DOMAIN_SPECIFIC = "domain_specific"


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


# ─────────────────────────────────────────────────────────
# Common / Shared Models
# ─────────────────────────────────────────────────────────

class APIResponse(BaseModel):
    """Standard API response wrapper."""
    success: bool = True
    message: str = "OK"
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    error: str
    detail: Optional[str] = None
    status_code: int


# ─────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "healthy"
    app_name: str
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: Dict[str, str] = Field(default_factory=dict)


# ─────────────────────────────────────────────────────────
# Interview Session Models
# ─────────────────────────────────────────────────────────

class StartInterviewRequest(BaseModel):
    """Payload to start a new interview session."""
    user_id: str = Field(..., description="User's unique identifier")
    interview_type: InterviewType = Field(
        default=InterviewType.TECHNICAL,
        description="Type of interview: technical, behavioral, hr, domain_specific",
    )
    job_role: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Target job role, e.g. 'Backend Engineer', 'Data Scientist'",
        examples=["Backend Engineer"],
    )
    tech_stack: Optional[List[str]] = Field(
        default=None,
        description="Relevant tech stack for technical interviews",
        examples=[["Python", "FastAPI", "MongoDB"]],
    )
    difficulty: DifficultyLevel = Field(
        default=DifficultyLevel.INTERMEDIATE,
        description="Interview difficulty level",
    )
    resume_text: Optional[str] = Field(
        default=None,
        description="Extracted resume text for context-aware questions",
    )
    target_companies: Optional[List[str]] = Field(
        default=None,
        description="Target Indian companies (Infosys, TCS, Zomato, etc.)",
        examples=[["Zomato", "Razorpay"]],
    )


class InterviewQuestion(BaseModel):
    """A single interview question with metadata."""
    question_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question_text: str
    question_type: str  # "technical", "behavioral", "follow_up"
    topic: Optional[str] = None  # e.g., "System Design", "Python Basics"
    expected_duration_seconds: int = 120


class StartInterviewResponse(BaseModel):
    """Response after starting an interview session."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    interview_type: InterviewType
    job_role: str
    difficulty: DifficultyLevel
    status: SessionStatus = SessionStatus.ACTIVE
    first_question: InterviewQuestion
    total_questions: int = 10
    started_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_duration_minutes: int = 30
    message: str = "Interview started! Good luck 🎯"


# ─────────────────────────────────────────────────────────
# Answer Submission Models
# ─────────────────────────────────────────────────────────

class SubmitAnswerRequest(BaseModel):
    """Payload for submitting an answer to a question."""
    session_id: str = Field(..., description="Active interview session ID")
    question_id: str = Field(..., description="ID of the question being answered")
    answer_text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="User's answer text (typed or speech-to-text converted)",
    )
    answer_duration_seconds: Optional[int] = Field(
        default=None,
        description="Time taken to answer in seconds",
    )
    audio_file_url: Optional[str] = Field(
        default=None,
        description="URL of uploaded audio file for voice analysis",
    )


class CommunicationAnalysis(BaseModel):
    """Voice / communication quality analysis."""
    filler_words_count: int = 0
    filler_words_detected: List[str] = Field(default_factory=list)  # ["um", "uh", "like"]
    speaking_pace_wpm: Optional[int] = None   # words per minute
    confidence_score: float = 0.0             # 0.0 - 10.0
    clarity_score: float = 0.0               # 0.0 - 10.0
    silence_ratio: Optional[float] = None     # fraction of audio that is silence (Day 3)


class AnswerFeedback(BaseModel):
    """Detailed feedback for a submitted answer."""
    content_score: float = Field(..., ge=0, le=10, description="Content quality: 0-10")
    completeness_score: float = Field(..., ge=0, le=10, description="How complete the answer is")
    relevance_score: float = Field(..., ge=0, le=10, description="Relevance to question")
    overall_score: float = Field(..., ge=0, le=10, description="Overall answer score")

    strengths: List[str] = Field(default_factory=list, description="What was done well")
    improvements: List[str] = Field(default_factory=list, description="Areas to improve")
    ideal_answer_hint: Optional[str] = None   # Brief hint, not the full answer
    lms_course_recommendation: Optional[str] = None  # Linked HiLearn course

    communication: Optional[CommunicationAnalysis] = None


class SubmitAnswerResponse(BaseModel):
    """Response after answer submission with feedback and next question."""
    session_id: str
    question_id: str
    feedback: AnswerFeedback
    next_question: Optional[InterviewQuestion] = None  # None if interview is over
    questions_answered: int
    total_questions: int
    session_status: SessionStatus
    is_follow_up: bool = False   # True if AI asks a follow-up (real-time conversation)
    message: str
    transcription: Optional[str] = None        # Day 3: Whisper STT result (if audio provided)


# ─────────────────────────────────────────────────────────
# Day 3: Voice / Transcription Endpoint Schemas
# ─────────────────────────────────────────────────────────

class TranscribeResponse(BaseModel):
    """Response for POST /interview/transcribe-audio"""
    transcription: str = Field(..., description="Whisper speech-to-text output")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Transcription confidence (0-1)")
    language: Optional[str] = Field(default=None, description="Detected spoken language")
    duration_seconds: float = Field(default=0.0, description="Audio clip duration in seconds")
    voice_analysis: Optional["VoiceAnalysisResponse"] = Field(
        default=None,
        description="Librosa voice metrics derived from the transcription",
    )


class VoiceAnalysisResponse(BaseModel):
    """Librosa voice metrics returned alongside transcription."""
    filler_count: int = Field(..., description="Total filler word occurrences")
    filler_words_detected: List[str] = Field(
        default_factory=list,
        description="Unique filler words found e.g. ['um', 'like']",
    )
    wpm: int = Field(..., description="Speaking pace in words-per-minute")
    confidence_score: float = Field(..., ge=0, le=10, description="Confidence score 0-10")
    clarity_score: float = Field(..., ge=0, le=10, description="Clarity/pacing score 0-10")
    silence_ratio: float = Field(
        ..., ge=0, le=1,
        description="Fraction of audio that is silence (0 = none, 1 = all silence)",
    )


# Allow forward reference resolution
TranscribeResponse.model_rebuild()
