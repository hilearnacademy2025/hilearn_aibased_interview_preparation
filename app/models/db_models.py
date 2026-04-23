"""
HiLearn AI Interview Prep - MongoDB Document Models
=====================================================
Pydantic models representing MongoDB documents.
Each model maps 1:1 to a MongoDB collection.

Collections:
    - users          → UserDocument
    - interviews     → InterviewDocument
    - questions      → QuestionDocument
    - feedback       → FeedbackDocument
    - analytics      → AnalyticsDocument
    - admin_stats    → AdminStatsDocument

Day 5: Complete database layer for persistence.
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


# ─────────────────────────────────────────────────────────
# Enums (mirror schemas.py but kept local for DB layer)
# ─────────────────────────────────────────────────────────

class UserRole(str, Enum):
    """User role for access control."""
    STUDENT = "student"
    ADMIN = "admin"


class InterviewType(str, Enum):
    """Type of interview session."""
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    HR = "hr"
    DOMAIN_SPECIFIC = "domain_specific"


class DifficultyLevel(str, Enum):
    """Interview difficulty level."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class InterviewStatus(str, Enum):
    """Interview session lifecycle status."""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


# ─────────────────────────────────────────────────────────
# User Document  →  collection: "users"
# ─────────────────────────────────────────────────────────

class UserDocument(BaseModel):
    """
    MongoDB document for a registered user.

    Stored in the ``users`` collection.
    The ``user_id`` field doubles as the MongoDB ``_id``.
    """
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique user identifier")
    email: str = Field(..., description="User email (unique)")
    password_hash: str = Field(..., description="Bcrypt-hashed password — NEVER expose via API")
    name: str = Field(..., description="User's display name")
    role: UserRole = Field(default=UserRole.STUDENT, description="User role")
    phone: Optional[str] = Field(default=None, description="Phone number (optional)")
    bio: Optional[str] = Field(default=None, description="Short bio (optional)")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Account creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last profile update timestamp")
    interview_count: int = Field(default=0, ge=0, description="Total interviews taken")
    average_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Lifetime average score")

    @field_validator("email")
    @classmethod
    def normalise_email(cls, v: str) -> str:
        """Lowercase and strip whitespace from email."""
        return v.lower().strip()

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict with ``_id`` set to ``user_id``."""
        data = self.model_dump()
        data["_id"] = data.pop("user_id")
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "UserDocument":
        """Construct a ``UserDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["user_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# Interview Document  →  collection: "interviews"
# ─────────────────────────────────────────────────────────

class AnswerRecord(BaseModel):
    """A single answer within an interview session."""
    question_id: str = Field(..., description="ID of the question answered")
    answer_text: str = Field(..., description="User's answer text")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    content_score: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    feedback: Optional[str] = Field(default=None, description="Groq evaluation feedback")


class InterviewDocument(BaseModel):
    """
    MongoDB document for an interview session.

    Stored in the ``interviews`` collection.
    Uses ``session_id`` as the logical primary key.
    """
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique session identifier")
    user_id: str = Field(..., description="Owner user ID")
    interview_type: InterviewType = Field(default=InterviewType.TECHNICAL)
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.INTERMEDIATE)
    job_role: str = Field(..., description="Target job role")
    questions: List[str] = Field(default_factory=list, description="Ordered list of question texts")
    answers: List[AnswerRecord] = Field(default_factory=list, description="User's answers with scores")
    current_index: int = Field(default=0, ge=0, description="Index of the current question")
    scores: Optional[Dict[str, Any]] = Field(default=None, description="Aggregated scores")
    duration_seconds: int = Field(default=0, ge=0, description="Total interview duration in seconds")
    status: InterviewStatus = Field(default=InterviewStatus.ACTIVE)
    resume_text: Optional[str] = Field(default=None, description="Extracted resume text for context")
    mcq_questions: List[Dict[str, Any]] = Field(default_factory=list, description="MCQ questions with options")
    mcq_answers: List[Dict[str, Any]] = Field(default_factory=list, description="MCQ answer records")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(default=None)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict with ``_id`` set to ``session_id``."""
        data = self.model_dump()
        data["_id"] = data.pop("session_id")
        # Serialize enums to their string values for MongoDB
        data["interview_type"] = data["interview_type"].value if isinstance(data["interview_type"], InterviewType) else data["interview_type"]
        data["difficulty"] = data["difficulty"].value if isinstance(data["difficulty"], DifficultyLevel) else data["difficulty"]
        data["status"] = data["status"].value if isinstance(data["status"], InterviewStatus) else data["status"]
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "InterviewDocument":
        """Construct an ``InterviewDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["session_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# Question Document  →  collection: "questions"
# ─────────────────────────────────────────────────────────

class QuestionDocument(BaseModel):
    """
    MongoDB document for a reusable interview question.

    Stored in the ``questions`` collection.
    Used to build a curated question bank over time.
    """
    question_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique question ID")
    text: str = Field(..., description="The interview question text")
    job_role: str = Field(..., description="Target job role")
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.INTERMEDIATE)
    interview_type: InterviewType = Field(default=InterviewType.TECHNICAL)
    model_answer: Optional[str] = Field(default=None, description="Ideal / model answer for reference")
    hints: List[str] = Field(default_factory=list, description="Hints for the candidate")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict."""
        data = self.model_dump()
        data["_id"] = data.pop("question_id")
        data["difficulty"] = data["difficulty"].value if isinstance(data["difficulty"], DifficultyLevel) else data["difficulty"]
        data["interview_type"] = data["interview_type"].value if isinstance(data["interview_type"], InterviewType) else data["interview_type"]
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "QuestionDocument":
        """Construct a ``QuestionDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["question_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# Feedback Document  →  collection: "feedback"
# ─────────────────────────────────────────────────────────

class FeedbackDocument(BaseModel):
    """
    MongoDB document for per-answer feedback.

    Stored in the ``feedback`` collection.
    Links to an interview session and a specific question.
    """
    feedback_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique feedback ID")
    interview_id: str = Field(..., description="Parent interview session ID")
    question_id: str = Field(..., description="Question this feedback applies to")
    user_id: str = Field(..., description="User who received the feedback")
    content_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Content quality score")
    communication_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Communication quality score")
    filler_words_detected: List[str] = Field(default_factory=list, description="Filler words found")
    wpm: int = Field(default=0, ge=0, description="Speaking pace in words-per-minute")
    confidence_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Confidence score")
    clarity_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Clarity score")
    suggestions: List[str] = Field(default_factory=list, description="Improvement suggestions")
    overall_score: float = Field(default=0.0, ge=0.0, le=10.0, description="Overall answer score")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict."""
        data = self.model_dump()
        data["_id"] = data.pop("feedback_id")
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "FeedbackDocument":
        """Construct a ``FeedbackDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["feedback_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# Analytics Document  →  collection: "analytics"
# ─────────────────────────────────────────────────────────

class AnalyticsDocument(BaseModel):
    """
    MongoDB document for per-user analytics / performance trends.

    Stored in the ``analytics`` collection.
    One document per user, updated after each interview.
    """
    user_id: str = Field(..., description="User ID (also used as _id)")
    total_interviews: int = Field(default=0, ge=0)
    average_score: float = Field(default=0.0, ge=0.0, le=10.0)
    accuracy_trend: List[float] = Field(default_factory=list, description="Score history over time")
    weak_areas: List[str] = Field(default_factory=list, description="Topics needing improvement")
    improvement_rate: float = Field(default=0.0, description="Score improvement % over last 5 interviews")
    last_interview_at: Optional[datetime] = Field(default=None)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict with ``_id`` set to ``user_id``."""
        data = self.model_dump()
        data["_id"] = data.pop("user_id")
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "AnalyticsDocument":
        """Construct an ``AnalyticsDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["user_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# AdminStats Document  →  collection: "admin_stats"
# ─────────────────────────────────────────────────────────

class AdminStatsDocument(BaseModel):
    """
    MongoDB document for platform-wide admin statistics.

    Stored in the ``admin_stats`` collection.
    Typically a single document (singleton), updated periodically.
    """
    stats_id: str = Field(default="global", description="Fixed ID for singleton document")
    total_users: int = Field(default=0, ge=0)
    total_interviews: int = Field(default=0, ge=0)
    average_user_score: float = Field(default=0.0, ge=0.0, le=10.0)
    daily_active_users: int = Field(default=0, ge=0)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict."""
        data = self.model_dump()
        data["_id"] = data.pop("stats_id")
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "AdminStatsDocument":
        """Construct an ``AdminStatsDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["stats_id"] = doc.pop("_id")
        return cls(**doc)


# ─────────────────────────────────────────────────────────
# MCQ Question Document  →  collection: "mcq_questions"
# ─────────────────────────────────────────────────────────

class MCQAnswerRecord(BaseModel):
    """A single MCQ answer within an interview session."""
    question_id: str = Field(..., description="ID of the MCQ question")
    user_answer: str = Field(..., description="User's answer: A, B, C, or D")
    correct_answer: str = Field(..., description="Correct answer: A, B, C, or D")
    is_correct: bool = Field(default=False)
    score: int = Field(default=0, description="10 if correct, 0 if incorrect")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class MCQQuestionDocument(BaseModel):
    """
    MongoDB document for an MCQ question.

    Stored in the ``mcq_questions`` collection.
    Used for seeding a static MCQ bank that admins can manage.
    """
    question_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique question ID")
    question_text: str = Field(..., description="The MCQ question text")
    option_a: str = Field(..., description="Option A")
    option_b: str = Field(..., description="Option B")
    option_c: str = Field(..., description="Option C")
    option_d: str = Field(..., description="Option D")
    correct_answer: str = Field(..., description="Correct answer: A, B, C, or D")
    explanation: str = Field(default="", description="Why this answer is correct")
    job_role: str = Field(default="General", description="Target job role")
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.INTERMEDIATE)
    interview_type: InterviewType = Field(default=InterviewType.TECHNICAL)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> Dict[str, Any]:
        """Convert to a MongoDB-friendly dict."""
        data = self.model_dump()
        data["_id"] = data.pop("question_id")
        data["difficulty"] = data["difficulty"].value if isinstance(data["difficulty"], DifficultyLevel) else data["difficulty"]
        data["interview_type"] = data["interview_type"].value if isinstance(data["interview_type"], InterviewType) else data["interview_type"]
        return data

    @classmethod
    def from_mongo(cls, doc: Dict[str, Any]) -> "MCQQuestionDocument":
        """Construct an ``MCQQuestionDocument`` from a raw MongoDB document."""
        if doc and "_id" in doc:
            doc["question_id"] = doc.pop("_id")
        return cls(**doc)
