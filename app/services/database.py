
"""
HiLearn AI Interview Prep - MongoDB Database Service
======================================================
Singleton async MongoDB connection manager with full CRUD operations
for every collection (users, interviews, questions, feedback, analytics,
admin_stats).

Uses Motor (AsyncIOMotorClient) for non-blocking I/O.
Gracefully falls back to in-memory when MongoDB is unavailable.

Day 5: Complete database layer for persistence.
"""
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from loguru import logger
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, IndexModel
from pymongo.errors import (
    ConnectionFailure,
    DuplicateKeyError,
    OperationFailure,
    ServerSelectionTimeoutError,
)

from app.core.config import get_settings
from app.models.db_models import (
    AdminStatsDocument,
    AnalyticsDocument,
    FeedbackDocument,
    InterviewDocument,
    MCQQuestionDocument,
    QuestionDocument,
    UserDocument,
)

settings = get_settings()


# ─────────────────────────────────────────────────────────────────────────────
# Database Service (Singleton)
# ─────────────────────────────────────────────────────────────────────────────

class DatabaseService:
    """
    Async MongoDB connection manager and CRUD service.

    Usage::

        from app.services.database import db_service
        await db_service.connect()
        user = await db_service.get_user_by_email("rahil@hilearn.in")
        await db_service.disconnect()
    """

    def __init__(self) -> None:
        self._client: Optional[AsyncIOMotorClient] = None
        self._db: Optional[AsyncIOMotorDatabase] = None
        self._connected: bool = False

    # ───────────────────────────────────────────────────────────────────────
    # Connection Management
    # ───────────────────────────────────────────────────────────────────────

    async def connect(self) -> bool:
        try:
            logger.info(
                "[DB] Connecting to MongoDB | url={} | db={}",
                settings.mongodb_url, settings.mongodb_db_name,
            )
            self._client = AsyncIOMotorClient(
                settings.mongodb_url,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=10000,
            )
            await self._client.admin.command("ping")
            self._db = self._client[settings.mongodb_db_name]
            self._connected = True
            logger.success(
                "[DB] MongoDB connected successfully | db={}",
                settings.mongodb_db_name,
            )
            return True

        except (ConnectionFailure, ServerSelectionTimeoutError) as exc:
            logger.warning(
                "[DB] MongoDB connection FAILED | error={} | "
                "App will continue with in-memory stores only",
                exc,
            )
            self._connected = False
            return False

        except Exception as exc:
            logger.error("[DB] Unexpected error during MongoDB connect | error={}", exc)
            self._connected = False
            return False

    async def disconnect(self) -> None:
        if self._client:
            self._client.close()
            self._connected = False
            logger.info("[DB] MongoDB connection closed")

    @property
    def is_connected(self) -> bool:
        return self._connected

    def _get_db(self) -> Optional[AsyncIOMotorDatabase]:
        if not self._connected or self._db is None:
            return None
        return self._db

    # ───────────────────────────────────────────────────────────────────────
    # Index Management
    # ───────────────────────────────────────────────────────────────────────

    async def create_indexes(self) -> None:
        db = self._get_db()
        if db is None:
            logger.warning("[DB] Skipping index creation — not connected")
            return

        try:
            users_indexes = [
                IndexModel([("email", ASCENDING)], unique=True, name="idx_users_email_unique"),
                IndexModel([("created_at", DESCENDING)], name="idx_users_created_at"),
            ]
            await db.users.create_indexes(users_indexes)
            logger.info("[DB] Indexes created on 'users' collection")

            interviews_indexes = [
                IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="idx_interviews_user_date"),
                IndexModel([("status", ASCENDING)], name="idx_interviews_status"),
            ]
            await db.interviews.create_indexes(interviews_indexes)
            logger.info("[DB] Indexes created on 'interviews' collection")

            feedback_indexes = [
                IndexModel([("interview_id", ASCENDING)], name="idx_feedback_interview"),
                IndexModel([("user_id", ASCENDING)], name="idx_feedback_user"),
            ]
            await db.feedback.create_indexes(feedback_indexes)
            logger.info("[DB] Indexes created on 'feedback' collection")

            questions_indexes = [
                IndexModel(
                    [("job_role", ASCENDING), ("interview_type", ASCENDING), ("difficulty", ASCENDING)],
                    name="idx_questions_role_type_diff",
                ),
            ]
            await db.questions.create_indexes(questions_indexes)
            logger.info("[DB] Indexes created on 'questions' collection")

            # ── MCQ Questions collection ───────────────────────────────
            mcq_indexes = [
                IndexModel(
                    [("job_role", ASCENDING), ("interview_type", ASCENDING), ("difficulty", ASCENDING)],
                    name="idx_mcq_questions_role_type_diff",
                ),
            ]
            await db.mcq_questions.create_indexes(mcq_indexes)
            logger.info("[DB] Indexes created on 'mcq_questions' collection")

            logger.success("[DB] All indexes created successfully")

        except OperationFailure as exc:
            logger.error("[DB] Index creation failed | error={}", exc)
        except Exception as exc:
            logger.error("[DB] Unexpected error during index creation | error={}", exc)

    # ───────────────────────────────────────────────────────────────────────
    # User CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def create_user(self, user: UserDocument) -> Optional[str]:
        db = self._get_db()
        if db is None:
            logger.debug("[DB] create_user skipped — not connected")
            return None

        try:
            doc = user.to_mongo()
            result = await db.users.insert_one(doc)
            logger.info("[DB] User created | user_id={} | email={}", user.user_id, user.email)
            return str(result.inserted_id)

        except DuplicateKeyError:
            logger.warning("[DB] Duplicate email on create_user | email={}", user.email)
            return None
        except Exception as exc:
            logger.error("[DB] create_user failed | error={}", exc)
            return None

    async def get_user_by_id(self, user_id: str) -> Optional[UserDocument]:
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = await db.users.find_one({"_id": user_id})
            if doc:
                # FIX: purane users mein 'hashed_password' tha, naye mein 'password_hash'
                if "hashed_password" in doc and "password_hash" not in doc:
                    doc["password_hash"] = doc.pop("hashed_password")
                # FIX: ObjectId → str
                if "_id" in doc and not isinstance(doc["_id"], str):
                    doc["_id"] = str(doc["_id"])
                return UserDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_user_by_id failed | user_id={} | error={}", user_id, exc)
            return None

    async def get_user_by_email(self, email: str) -> Optional[UserDocument]:
        db = self._get_db()
        if db is None:
            return None

        try:
            import re as _re
            clean_email = email.lower().strip()
            doc = await db.users.find_one({
                "email": {"$regex": f"^{_re.escape(clean_email)}$", "$options": "i"}
            })
            if doc:
                # FIX: purane users mein 'hashed_password' tha, naye mein 'password_hash'
                if "hashed_password" in doc and "password_hash" not in doc:
                    doc["password_hash"] = doc.pop("hashed_password")
                # FIX: ObjectId → str
                if "_id" in doc and not isinstance(doc["_id"], str):
                    doc["_id"] = str(doc["_id"])
                return UserDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_user_by_email failed | email={} | error={}", email, exc)
            return None

    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            update_data["updated_at"] = datetime.utcnow()
            result = await db.users.update_one(
                {"_id": user_id},
                {"$set": update_data},
            )
            if result.modified_count > 0:
                logger.info("[DB] User updated | user_id={} | fields={}", user_id, list(update_data.keys()))
                return True
            return False
        except Exception as exc:
            logger.error("[DB] update_user failed | user_id={} | error={}", user_id, exc)
            return False

    async def update_user_stats(self, user_id: str, new_score: float) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            user_doc = await db.users.find_one({"_id": user_id}, {"interview_count": 1, "average_score": 1})
            if not user_doc:
                return False

            current_count = user_doc.get("interview_count", 0)
            current_avg = user_doc.get("average_score", 0.0)
            new_count = current_count + 1
            new_avg = round(((current_avg * current_count) + new_score) / new_count, 2)

            result = await db.users.update_one(
                {"_id": user_id},
                {
                    "$set": {
                        "interview_count": new_count,
                        "average_score": new_avg,
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
            if result.modified_count > 0:
                logger.info(
                    "[DB] User stats updated | user_id={} | count={} | avg={}",
                    user_id, new_count, new_avg,
                )
                return True
            return False
        except Exception as exc:
            logger.error("[DB] update_user_stats failed | user_id={} | error={}", user_id, exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Interview CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def create_interview(self, interview: InterviewDocument) -> Optional[str]:
        db = self._get_db()
        if db is None:
            logger.debug("[DB] create_interview skipped — not connected")
            return None

        try:
            doc = interview.to_mongo()
            result = await db.interviews.insert_one(doc)
            logger.info(
                "[DB] Interview created | session_id={} | user_id={} | type={}",
                interview.session_id, interview.user_id, interview.interview_type.value,
            )
            return str(result.inserted_id)

        except DuplicateKeyError:
            logger.warning("[DB] Duplicate session_id | session_id={}", interview.session_id)
            return None
        except Exception as exc:
            logger.error("[DB] create_interview failed | error={}", exc)
            return None

    async def get_interview(self, session_id: str) -> Optional[InterviewDocument]:
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = await db.interviews.find_one({"_id": session_id})
            if doc:
                return InterviewDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_interview failed | session_id={} | error={}", session_id, exc)
            return None

    async def update_interview(self, session_id: str, update_data: Dict[str, Any]) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            result = await db.interviews.update_one(
                {"_id": session_id},
                {"$set": update_data},
            )
            if result.modified_count > 0:
                logger.info("[DB] Interview updated | session_id={} | fields={}", session_id, list(update_data.keys()))
                return True
            return False
        except Exception as exc:
            logger.error("[DB] update_interview failed | session_id={} | error={}", session_id, exc)
            return False

    async def add_answer_to_interview(self, session_id: str, answer: Dict[str, Any]) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            result = await db.interviews.update_one(
                {"_id": session_id},
                {
                    "$push": {"answers": answer},
                    "$inc": {"current_index": 1},
                },
            )
            if result.modified_count > 0:
                logger.debug("[DB] Answer added to interview | session_id={}", session_id)
                return True
            return False
        except Exception as exc:
            logger.error("[DB] add_answer_to_interview failed | session_id={} | error={}", session_id, exc)
            return False

    async def get_user_interviews(
        self, user_id: str, limit: int = 20, skip: int = 0
    ) -> List[InterviewDocument]:
        db = self._get_db()
        if db is None:
            return []

        try:
            cursor = db.interviews.find(
                {"user_id": user_id}
            ).sort("created_at", DESCENDING).skip(skip).limit(limit)

            results = []
            async for doc in cursor:
                results.append(InterviewDocument.from_mongo(doc))
            logger.debug("[DB] get_user_interviews | user_id={} | count={}", user_id, len(results))
            return results

        except Exception as exc:
            logger.error("[DB] get_user_interviews failed | user_id={} | error={}", user_id, exc)
            return []

    # ───────────────────────────────────────────────────────────────────────
    # Feedback CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def save_feedback(self, feedback: FeedbackDocument) -> Optional[str]:
        db = self._get_db()
        if db is None:
            logger.debug("[DB] save_feedback skipped — not connected")
            return None

        try:
            doc = feedback.to_mongo()
            result = await db.feedback.insert_one(doc)
            logger.info(
                "[DB] Feedback saved | feedback_id={} | interview_id={} | score={}",
                feedback.feedback_id, feedback.interview_id, feedback.overall_score,
            )
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] save_feedback failed | error={}", exc)
            return None

    async def get_feedback_for_interview(self, interview_id: str) -> List[FeedbackDocument]:
        db = self._get_db()
        if db is None:
            return []

        try:
            cursor = db.feedback.find({"interview_id": interview_id}).sort("created_at", ASCENDING)
            results = []
            async for doc in cursor:
                results.append(FeedbackDocument.from_mongo(doc))
            return results
        except Exception as exc:
            logger.error("[DB] get_feedback_for_interview failed | interview_id={} | error={}", interview_id, exc)
            return []

    # ───────────────────────────────────────────────────────────────────────
    # Analytics CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def get_user_analytics(self, user_id: str) -> Optional[AnalyticsDocument]:
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = await db.analytics.find_one({"_id": user_id})
            if doc:
                return AnalyticsDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_user_analytics failed | user_id={} | error={}", user_id, exc)
            return None

    async def update_user_analytics(
        self, user_id: str, score: float, weak_areas: Optional[List[str]] = None
    ) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            update_ops: Dict[str, Any] = {
                "$push": {"accuracy_trend": {"$each": [score], "$slice": -50}},
                "$inc": {"total_interviews": 1},
                "$set": {
                    "last_interview_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
            }

            if weak_areas:
                update_ops["$addToSet"] = {"weak_areas": {"$each": weak_areas}}

            result = await db.analytics.update_one(
                {"_id": user_id},
                update_ops,
                upsert=True,
            )

            analytics_doc = await db.analytics.find_one({"_id": user_id})
            if analytics_doc:
                trend = analytics_doc.get("accuracy_trend", [])
                avg = round(sum(trend) / len(trend), 2) if trend else 0.0

                improvement = 0.0
                if len(trend) >= 10:
                    recent = sum(trend[-5:]) / 5
                    previous = sum(trend[-10:-5]) / 5
                    improvement = round(((recent - previous) / max(previous, 0.01)) * 100, 1)

                await db.analytics.update_one(
                    {"_id": user_id},
                    {"$set": {"average_score": avg, "improvement_rate": improvement}},
                )

            logger.info("[DB] Analytics updated | user_id={} | score={}", user_id, score)
            return True

        except Exception as exc:
            logger.error("[DB] update_user_analytics failed | user_id={} | error={}", user_id, exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Admin Stats
    # ───────────────────────────────────────────────────────────────────────

    async def get_admin_stats(self) -> Optional[AdminStatsDocument]:
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = await db.admin_stats.find_one({"_id": "global"})
            if doc:
                return AdminStatsDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_admin_stats failed | error={}", exc)
            return None

    async def update_admin_stats(self) -> bool:
        db = self._get_db()
        if db is None:
            return False

        try:
            total_users = await db.users.count_documents({})
            total_interviews = await db.interviews.count_documents({})

            pipeline = [
                {"$match": {"interview_count": {"$gt": 0}}},
                {"$group": {"_id": None, "avg_score": {"$avg": "$average_score"}}},
            ]
            cursor = db.users.aggregate(pipeline)
            avg_score = 0.0
            async for result in cursor:
                avg_score = round(result.get("avg_score", 0.0), 2)

            stats = AdminStatsDocument(
                total_users=total_users,
                total_interviews=total_interviews,
                average_user_score=avg_score,
                last_updated=datetime.utcnow(),
            )

            await db.admin_stats.update_one(
                {"_id": "global"},
                {"$set": stats.to_mongo()},
                upsert=True,
            )
            logger.info(
                "[DB] Admin stats updated | users={} | interviews={} | avg_score={}",
                total_users, total_interviews, avg_score,
            )
            return True

        except Exception as exc:
            logger.error("[DB] update_admin_stats failed | error={}", exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Question CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def save_question(self, question: QuestionDocument) -> Optional[str]:
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = question.to_mongo()
            result = await db.questions.insert_one(doc)
            logger.debug("[DB] Question saved | question_id={}", question.question_id)
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] save_question failed | error={}", exc)
            return None

    async def get_questions(
        self,
        job_role: Optional[str] = None,
        interview_type: Optional[str] = None,
        difficulty: Optional[str] = None,
        limit: int = 10,
    ) -> List[QuestionDocument]:
        db = self._get_db()
        if db is None:
            return []

        try:
            query: Dict[str, Any] = {}
            if job_role:
                query["job_role"] = job_role
            if interview_type:
                query["interview_type"] = interview_type
            if difficulty:
                query["difficulty"] = difficulty

            cursor = db.questions.find(query).limit(limit)
            results = []
            async for doc in cursor:
                results.append(QuestionDocument.from_mongo(doc))
            return results
        except Exception as exc:
            logger.error("[DB] get_questions failed | error={}", exc)
            return []

    # ───────────────────────────────────────────────────────────────────────
    # Health Check Helper
    # ───────────────────────────────────────────────────────────────────────

    async def health_check(self) -> Dict[str, Any]:
        if not self._connected or self._client is None:
            return {"connected": False, "status": "disconnected"}

        try:
            import time
            start = time.monotonic()
            await self._client.admin.command("ping")
            latency = round((time.monotonic() - start) * 1000, 1)
            return {"connected": True, "status": "healthy", "latency_ms": latency}
        except Exception as exc:
            logger.warning("[DB] Health check failed | error={}", exc)
            return {"connected": False, "status": "unhealthy", "error": str(exc)}

    # ───────────────────────────────────────────────────────────────────────
    # MCQ Question CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def save_mcq_question(self, question: MCQQuestionDocument) -> Optional[str]:
        """
        Insert an MCQ question into the ``mcq_questions`` collection.

        Args:
            question: Validated MCQQuestionDocument instance.

        Returns:
            The inserted question_id, or None on failure.
        """
        db = self._get_db()
        if db is None:
            return None

        try:
            doc = question.to_mongo()
            result = await db.mcq_questions.insert_one(doc)
            logger.debug("[DB] MCQ question saved | question_id={}", question.question_id)
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] save_mcq_question failed | error={}", exc)
            return None

    async def get_mcq_questions(
        self,
        job_role: Optional[str] = None,
        interview_type: Optional[str] = None,
        difficulty: Optional[str] = None,
        limit: int = 10,
    ) -> List[MCQQuestionDocument]:
        """
        Query MCQ questions with optional filters.

        Args:
            job_role: Filter by target job role.
            interview_type: Filter by interview type.
            difficulty: Filter by difficulty level.
            limit: Maximum number of results.

        Returns:
            List of MCQQuestionDocument instances.
        """
        db = self._get_db()
        if db is None:
            return []

        try:
            query: Dict[str, Any] = {}
            if job_role:
                query["job_role"] = job_role
            if interview_type:
                query["interview_type"] = interview_type
            if difficulty:
                query["difficulty"] = difficulty

            cursor = db.mcq_questions.find(query).limit(limit)
            results = []
            async for doc in cursor:
                results.append(MCQQuestionDocument.from_mongo(doc))
            logger.debug("[DB] get_mcq_questions | count={}", len(results))
            return results
        except Exception as exc:
            logger.error("[DB] get_mcq_questions failed | error={}", exc)
            return []

    async def add_mcq_answer_to_interview(
        self, session_id: str, mcq_answer: Dict[str, Any]
    ) -> bool:
        """
        Push a new MCQ answer onto the interview's mcq_answers array.

        Args:
            session_id: The session's unique identifier.
            mcq_answer: MCQ answer dict to append.

        Returns:
            True if the document was modified, False otherwise.
        """
        db = self._get_db()
        if db is None:
            return False

        try:
            result = await db.interviews.update_one(
                {"_id": session_id},
                {"$push": {"mcq_answers": mcq_answer}},
            )
            if result.modified_count > 0:
                logger.debug("[DB] MCQ answer added | session_id={}", session_id)
                return True
            return False
        except Exception as exc:
            logger.error("[DB] add_mcq_answer failed | session_id={} | error={}", session_id, exc)
            return False


    # ───────────────────────────────────────────────────────────────────────
    # Leaderboard Methods
    # ───────────────────────────────────────────────────────────────────────

    async def get_leaderboard(
        self, limit: int = 5, role: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Return the top N users ranked by average score (all-time).

        Aggregates from the `interviews` collection (completed interviews),
        computes per-user average from answer scores, and $lookup users
        collection to get names.

        Args:
            limit: Number of top users to return (default 5).
            role: Optional job role filter (case-insensitive substring match).

        Returns:
            List of dicts with rank, user_id, name, score, interviews_completed, role.
        """
        db = self._get_db()
        if db is None:
            return []

        try:
            # Match only completed interviews
            match_stage: Dict[str, Any] = {"status": "completed"}
            if role:
                match_stage["job_role"] = {"$regex": role, "$options": "i"}

            pipeline = [
                {"$match": match_stage},
                # Compute per-interview score from answers
                {
                    "$addFields": {
                        "_answer_scores": {
                            "$map": {
                                "input": {"$ifNull": ["$answers", []]},
                                "as": "a",
                                "in": {
                                    "$ifNull": [
                                        "$$a.content_score",
                                        {"$ifNull": ["$$a.overall_score", 0]}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$addFields": {
                        "_interview_score": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$_answer_scores"}, 0]},
                                "then": {"$avg": "$_answer_scores"},
                                "else": 0
                            }
                        }
                    }
                },
                # Group by user
                {
                    "$group": {
                        "_id": "$user_id",
                        "avg_score": {"$avg": "$_interview_score"},
                        "interviews_completed": {"$sum": 1},
                        "job_role": {"$last": "$job_role"},
                    }
                },
                {"$match": {"avg_score": {"$gt": 0}}},
                {"$sort": {"avg_score": -1, "interviews_completed": -1}},
                {"$limit": limit},
                # Lookup user name from users collection (handles ObjectId/string mismatch)
                {
                    "$lookup": {
                        "from": "users",
                        "let": {"uid": "$_id"},
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$or": [
                                            {"$eq": ["$_id", "$$uid"]},
                                            {"$eq": [{"$toString": "$_id"}, "$$uid"]},
                                        ]
                                    }
                                }
                            }
                        ],
                        "as": "user_info",
                    }
                },
                {
                    "$unwind": {
                        "path": "$user_info",
                        "preserveNullAndEmptyArrays": True,
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "user_id": "$_id",
                        "name": {"$ifNull": ["$user_info.name", "Unknown User"]},
                        "score": {"$round": ["$avg_score", 1]},
                        "interviews_completed": 1,
                        "role": {"$ifNull": ["$job_role", "Not specified"]},
                        "avatar": "",
                    }
                },
            ]

            results = []
            cursor = db.interviews.aggregate(pipeline)
            rank = 1
            async for doc in cursor:
                doc["rank"] = rank
                results.append(doc)
                rank += 1

            logger.debug(
                "[DB] get_leaderboard | role={} | limit={} | results={}",
                role, limit, len(results),
            )
            return results

        except Exception as exc:
            logger.error("[DB] get_leaderboard failed | error={}", exc)
            return []

    async def get_weekly_leaderboard(
        self, limit: int = 5, role: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Return the top N users ranked by average score from the last 7 days.

        Aggregates from the interviews collection, computes per-interview
        score from answers, filtering by created_at.

        Args:
            limit: Number of top users to return.
            role: Optional job role filter.

        Returns:
            List of dicts with rank, user_id, name, score, interviews_completed, role.
        """
        db = self._get_db()
        if db is None:
            return []

        try:
            now = datetime.utcnow()
            week_start = now - timedelta(days=7)

            match_stage: Dict[str, Any] = {
                "created_at": {"$gte": week_start},
                "status": "completed",
            }
            if role:
                match_stage["job_role"] = {"$regex": role, "$options": "i"}

            pipeline = [
                {"$match": match_stage},
                # Compute per-interview score from answers
                {
                    "$addFields": {
                        "_answer_scores": {
                            "$map": {
                                "input": {"$ifNull": ["$answers", []]},
                                "as": "a",
                                "in": {
                                    "$ifNull": [
                                        "$$a.content_score",
                                        {"$ifNull": ["$$a.overall_score", 0]}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$addFields": {
                        "_interview_score": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$_answer_scores"}, 0]},
                                "then": {"$avg": "$_answer_scores"},
                                "else": 0
                            }
                        }
                    }
                },
                # Group by user
                {
                    "$group": {
                        "_id": "$user_id",
                        "avg_score": {"$avg": "$_interview_score"},
                        "interviews_completed": {"$sum": 1},
                        "job_role": {"$last": "$job_role"},
                    }
                },
                {"$sort": {"avg_score": -1, "interviews_completed": -1}},
                {"$limit": limit},
                # Lookup user name (handles ObjectId/string mismatch)
                {
                    "$lookup": {
                        "from": "users",
                        "let": {"uid": "$_id"},
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$or": [
                                            {"$eq": ["$_id", "$$uid"]},
                                            {"$eq": [{"$toString": "$_id"}, "$$uid"]},
                                        ]
                                    }
                                }
                            }
                        ],
                        "as": "user_info",
                    }
                },
                {
                    "$unwind": {
                        "path": "$user_info",
                        "preserveNullAndEmptyArrays": True,
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "user_id": "$_id",
                        "name": {"$ifNull": ["$user_info.name", "Unknown User"]},
                        "score": {"$round": ["$avg_score", 1]},
                        "interviews_completed": 1,
                        "role": {"$ifNull": ["$job_role", "Not specified"]},
                        "avatar": "",
                    }
                },
            ]

            results = []
            cursor = db.interviews.aggregate(pipeline)
            rank = 1
            async for doc in cursor:
                doc["rank"] = rank
                results.append(doc)
                rank += 1

            logger.debug(
                "[DB] get_weekly_leaderboard | role={} | limit={} | results={}",
                role, limit, len(results),
            )
            return results

        except Exception as exc:
            logger.error("[DB] get_weekly_leaderboard failed | error={}", exc)
            return []

    async def get_user_rank(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a specific user's global rank, score, and percentile.

        Aggregates from the interviews collection to compute real scores,
        then determines rank by counting users with higher scores.

        Args:
            user_id: The user's unique identifier.

        Returns:
            Dict with rank, score, interviews_completed, total_users, percentile.
            None if user has no completed interviews.
        """
        db = self._get_db()
        if db is None:
            return None

        try:
            # First, get the user's name from users collection
            # Try string match first, then ObjectId match (handles type mismatch)
            user_doc = await db.users.find_one({"_id": user_id})
            if not user_doc:
                from bson import ObjectId as BsonObjectId
                try:
                    user_doc = await db.users.find_one({"_id": BsonObjectId(user_id)})
                except Exception:
                    pass
            user_name = user_doc.get("name", "Unknown User") if user_doc else "Unknown User"

            # Aggregate this user's stats from interviews
            user_pipeline = [
                {"$match": {"user_id": user_id, "status": "completed"}},
                {
                    "$addFields": {
                        "_answer_scores": {
                            "$map": {
                                "input": {"$ifNull": ["$answers", []]},
                                "as": "a",
                                "in": {
                                    "$ifNull": [
                                        "$$a.content_score",
                                        {"$ifNull": ["$$a.overall_score", 0]}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$addFields": {
                        "_interview_score": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$_answer_scores"}, 0]},
                                "then": {"$avg": "$_answer_scores"},
                                "else": 0
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$user_id",
                        "avg_score": {"$avg": "$_interview_score"},
                        "interviews_completed": {"$sum": 1},
                        "job_role": {"$last": "$job_role"},
                    }
                },
            ]

            user_stats = None
            async for doc in db.interviews.aggregate(user_pipeline):
                user_stats = doc

            if not user_stats or user_stats.get("interviews_completed", 0) == 0:
                return None

            user_score = user_stats["avg_score"]
            user_interviews = user_stats["interviews_completed"]
            user_role = user_stats.get("job_role", "Not specified")

            # Get all users' scores to determine rank
            all_users_pipeline = [
                {"$match": {"status": "completed"}},
                {
                    "$addFields": {
                        "_answer_scores": {
                            "$map": {
                                "input": {"$ifNull": ["$answers", []]},
                                "as": "a",
                                "in": {
                                    "$ifNull": [
                                        "$$a.content_score",
                                        {"$ifNull": ["$$a.overall_score", 0]}
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$addFields": {
                        "_interview_score": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$_answer_scores"}, 0]},
                                "then": {"$avg": "$_answer_scores"},
                                "else": 0
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$user_id",
                        "avg_score": {"$avg": "$_interview_score"},
                        "interviews_completed": {"$sum": 1},
                    }
                },
                {"$match": {"avg_score": {"$gt": 0}}},
            ]

            # Count users with higher score
            rank = 1
            total_active = 0
            async for doc in db.interviews.aggregate(all_users_pipeline):
                total_active += 1
                if doc["_id"] != user_id:
                    if doc["avg_score"] > user_score:
                        rank += 1
                    elif doc["avg_score"] == user_score and doc["interviews_completed"] > user_interviews:
                        rank += 1

            total_users = await db.users.count_documents({})

            # Percentile: % of users you scored better than
            percentile = round(
                ((total_active - rank) / max(total_active, 1)) * 100, 1
            ) if total_active > 0 else 0

            logger.debug(
                "[DB] get_user_rank | user_id={} | rank={} | percentile={}",
                user_id, rank, percentile,
            )

            return {
                "rank": rank,
                "score": round(user_score, 1),
                "interviews_completed": user_interviews,
                "total_users": total_users,
                "total_active_users": total_active,
                "percentile": percentile,
                "name": user_name,
                "role": user_role,
            }

        except Exception as exc:
            logger.error("[DB] get_user_rank failed | user_id={} | error={}", user_id, exc)
            return None

    async def get_total_user_count(self) -> int:
        """Return total number of registered users."""
        db = self._get_db()
        if db is None:
            return 0

        try:
            return await db.users.count_documents({})
        except Exception as exc:
            logger.error("[DB] get_total_user_count failed | error={}", exc)
            return 0

    async def update_leaderboard_stats(self, user_id: str) -> bool:
        """
        Recalculate and store rank + percentile for a specific user.

        Called after each interview completes to keep leaderboard data fresh.

        Args:
            user_id: The user's unique identifier.

        Returns:
            True if stats were updated, False otherwise.
        """
        db = self._get_db()
        if db is None:
            return False

        try:
            rank_data = await self.get_user_rank(user_id)
            if not rank_data:
                return False

            result = await db.users.update_one(
                {"_id": user_id},
                {
                    "$set": {
                        "rank": rank_data["rank"],
                        "percentile": rank_data["percentile"],
                        "updated_at": datetime.utcnow(),
                    }
                },
            )
            if result.modified_count > 0:
                logger.info(
                    "[DB] Leaderboard stats updated | user_id={} | rank={} | percentile={}",
                    user_id, rank_data["rank"], rank_data["percentile"],
                )
                return True
            return False

        except Exception as exc:
            logger.error("[DB] update_leaderboard_stats failed | user_id={} | error={}", user_id, exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Company CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def save_company(self, company_doc) -> Optional[str]:
        """Insert a new company document."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = company_doc.to_mongo()
            result = await db.companies.insert_one(doc)
            logger.info("[DB] Company created | company_id={} | name={}", company_doc.company_id, company_doc.name)
            return str(result.inserted_id)
        except DuplicateKeyError:
            logger.warning("[DB] Duplicate email on save_company | email={}", company_doc.email)
            return None
        except Exception as exc:
            logger.error("[DB] save_company failed | error={}", exc)
            return None

    async def get_company_by_email(self, email: str):
        """Find a company by email address."""
        db = self._get_db()
        if db is None:
            return None
        try:
            import re as _re
            clean_email = email.lower().strip()
            doc = await db.companies.find_one({
                "email": {"$regex": f"^{_re.escape(clean_email)}$", "$options": "i"}
            })
            if doc:
                if "_id" in doc and not isinstance(doc["_id"], str):
                    doc["_id"] = str(doc["_id"])
                from app.models.db_models import CompanyDocument
                return CompanyDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_company_by_email failed | email={} | error={}", email, exc)
            return None

    async def get_company_by_id(self, company_id: str):
        """Find a company by ID."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = await db.companies.find_one({"_id": company_id})
            if doc:
                if "_id" in doc and not isinstance(doc["_id"], str):
                    doc["_id"] = str(doc["_id"])
                from app.models.db_models import CompanyDocument
                return CompanyDocument.from_mongo(doc)
            return None
        except Exception as exc:
            logger.error("[DB] get_company_by_id failed | company_id={} | error={}", company_id, exc)
            return None

    async def update_company(self, company_id: str, update_data: Dict[str, Any]) -> bool:
        """Update company profile fields."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.companies.update_one(
                {"_id": company_id},
                {"$set": update_data},
            )
            return result.modified_count > 0
        except Exception as exc:
            logger.error("[DB] update_company failed | company_id={} | error={}", company_id, exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Candidate Search & Profile
    # ───────────────────────────────────────────────────────────────────────

    async def get_candidates_for_search(
        self,
        role: Optional[str] = None,
        min_score: float = 0,
        max_score: float = 100,
        skills: Optional[List[str]] = None,
        experience: Optional[str] = None,
        limit: int = 50,
        skip: int = 0,
    ) -> List[Dict[str, Any]]:
        """Query candidates with filters, joining user + interview data."""
        db = self._get_db()
        if db is None:
            return []
        try:
            # Build user query
            user_query: Dict[str, Any] = {"role": "student"}
            # Only show candidates who opted in (or field doesn't exist)
            user_query["$or"] = [
                {"show_to_companies": True},
                {"show_to_companies": {"$exists": False}},
            ]
            if role:
                user_query["target_role"] = {"$regex": role, "$options": "i"}
            if experience:
                user_query["experience_level"] = experience

            cursor = db.users.find(user_query).skip(skip).limit(limit)
            candidates = []

            async for user_doc in cursor:
                user_id = str(user_doc.get("_id", ""))

                # Get interview stats via aggregation
                pipeline = [
                    {"$match": {"user_id": user_id, "status": "completed"}},
                    {"$addFields": {
                        "_answer_scores": {
                            "$map": {
                                "input": {"$ifNull": ["$answers", []]},
                                "as": "a",
                                "in": {"$ifNull": [{"$toDouble": "$$a.content_score"}, 0]}
                            }
                        }
                    }},
                    {"$addFields": {
                        "_interview_score": {
                            "$cond": {
                                "if": {"$gt": [{"$size": "$_answer_scores"}, 0]},
                                "then": {"$avg": "$_answer_scores"},
                                "else": 0
                            }
                        }
                    }},
                    {"$group": {
                        "_id": "$user_id",
                        "avg_score": {"$avg": "$_interview_score"},
                        "interviews_completed": {"$sum": 1},
                        "job_roles": {"$addToSet": "$job_role"},
                    }},
                ]
                stats = {"avg_score": 0, "interviews_completed": 0}
                async for doc in db.interviews.aggregate(pipeline):
                    stats = doc

                # Normalize score to 0-100
                avg_score = round(stats.get("avg_score", 0) * 10, 1)  # 0-10 -> 0-100

                # Apply score filter
                if avg_score < min_score or avg_score > max_score:
                    continue

                user_skills = user_doc.get("skills", []) or user_doc.get("tech_stack", []) or []

                # Apply skills filter
                if skills:
                    candidate_skills_lower = [s.lower() for s in user_skills]
                    if not any(s.lower() in candidate_skills_lower for s in skills):
                        continue

                candidates.append({
                    "user_id": user_id,
                    "name": user_doc.get("name", ""),
                    "email": user_doc.get("email", ""),
                    "phone": user_doc.get("phone", None),
                    "target_role": user_doc.get("target_role", ""),
                    "score": avg_score,
                    "interviews_completed": stats.get("interviews_completed", 0),
                    "skills": user_skills,
                    "experience": user_doc.get("experience_level", ""),
                })

            return candidates
        except Exception as exc:
            logger.error("[DB] get_candidates_for_search failed | error={}", exc)
            return []

    async def get_candidate_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get full candidate profile with interview history."""
        db = self._get_db()
        if db is None:
            return None
        try:
            from bson import ObjectId
            query = {"_id": user_id}
            if len(user_id) == 24:
                try:
                    query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}
                except Exception:
                    pass
            user_doc = await db.users.find_one(query)
            if not user_doc:
                return None

            # Get interview history
            interview_cursor = db.interviews.find(
                {"user_id": user_id, "status": "completed"}
            ).sort("created_at", DESCENDING).limit(20)

            interview_history = []
            all_scores = []
            weak_areas = set()
            strong_areas = set()

            async for interview in interview_cursor:
                answers = interview.get("answers", [])
                scores = [float(a.get("content_score", 0)) for a in answers if a.get("content_score") is not None]
                avg = round(sum(scores) / len(scores), 1) if scores else 0
                all_scores.append(avg)

                # Identify weak/strong based on individual answer scores
                for a in answers:
                    score = float(a.get("content_score", 0)) if a.get("content_score") else 0
                    feedback = a.get("feedback", "")
                    if score < 5:
                        weak_areas.add(interview.get("job_role", "General"))
                    elif score >= 7:
                        strong_areas.add(interview.get("job_role", "General"))

                interview_history.append({
                    "session_id": str(interview.get("_id", "")),
                    "job_role": interview.get("job_role", ""),
                    "interview_type": interview.get("interview_type", ""),
                    "score": avg * 10,  # Normalize to 0-100
                    "questions_count": len(interview.get("questions", [])),
                    "date": str(interview.get("created_at", "")),
                })

            overall_score = round((sum(all_scores) / len(all_scores)) * 10, 1) if all_scores else 0

            # Get analytics for weak areas
            analytics = await db.analytics.find_one({"_id": user_id})
            if analytics:
                weak_areas.update(analytics.get("weak_areas", []))

            return {
                "user_id": user_id,
                "name": user_doc.get("name", ""),
                "email": user_doc.get("email", ""),
                "phone": user_doc.get("phone", None),
                "target_role": user_doc.get("target_role", ""),
                "skills": user_doc.get("skills", []) or user_doc.get("tech_stack", []) or [],
                "experience": user_doc.get("experience_level", ""),
                "score": overall_score,
                "interviews_completed": len(interview_history),
                "interview_history": interview_history,
                "weak_areas": list(weak_areas),
                "strong_areas": list(strong_areas),
                "resume_url": user_doc.get("resume_url", None),
                "last_interview_at": interview_history[0]["date"] if interview_history else None,
            }
        except Exception as exc:
            logger.error("[DB] get_candidate_profile failed | user_id={} | error={}", user_id, exc)
            return None

    # ───────────────────────────────────────────────────────────────────────
    # Shortlist CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def shortlist_candidate(self, shortlist_doc) -> Optional[str]:
        """Add candidate to company shortlist."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = shortlist_doc.to_mongo()
            result = await db.candidate_shortlist.insert_one(doc)
            logger.info("[DB] Candidate shortlisted | company={} | user={}", shortlist_doc.company_id, shortlist_doc.user_id)
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] shortlist_candidate failed | error={}", exc)
            return None

    async def get_shortlisted_candidates(self, company_id: str) -> List[Dict[str, Any]]:
        """Get all shortlisted candidates for a company with user & job details."""
        db = self._get_db()
        if db is None:
            return []
        try:
            cursor = db.candidate_shortlist.find({"company_id": company_id}).sort("shortlisted_at", DESCENDING)
            results = []
            async for doc in cursor:
                # Enrich with user name
                u_id = doc.get("user_id")
                try:
                    from bson import ObjectId
                    if isinstance(u_id, str) and len(u_id) == 24:
                        u_query = {"$or": [{"_id": u_id}, {"_id": ObjectId(u_id)}]}
                    else:
                        u_query = {"_id": u_id}
                except Exception:
                    u_query = {"_id": u_id}
                user = await db.users.find_one(u_query, {"name": 1})
                # Enrich with job title
                job_title = ""
                if doc.get("job_id"):
                    job = await db.job_postings.find_one({"_id": doc["job_id"]}, {"title": 1})
                    job_title = job.get("title", "") if job else ""

                results.append({
                    "shortlist_id": str(doc.get("_id", "")),
                    "company_id": doc.get("company_id", ""),
                    "user_id": doc.get("user_id", ""),
                    "job_id": doc.get("job_id", ""),
                    "candidate_name": user.get("name", "") if user else "",
                    "job_title": job_title,
                    "notes": doc.get("notes", ""),
                    "shortlisted_at": doc.get("shortlisted_at"),
                })
            return results
        except Exception as exc:
            logger.error("[DB] get_shortlisted_candidates failed | error={}", exc)
            return []

    async def remove_shortlist(self, company_id: str, user_id: str) -> bool:
        """Remove candidate from company shortlist."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.candidate_shortlist.delete_one({"company_id": company_id, "user_id": user_id})
            return result.deleted_count > 0
        except Exception as exc:
            logger.error("[DB] remove_shortlist failed | error={}", exc)
            return False

    async def update_shortlist_notes(self, company_id: str, user_id: str, notes: str) -> bool:
        """Update notes on a shortlist entry."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.candidate_shortlist.update_one(
                {"company_id": company_id, "user_id": user_id},
                {"$set": {"notes": notes}},
            )
            return result.modified_count > 0
        except Exception as exc:
            logger.error("[DB] update_shortlist_notes failed | error={}", exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Job Postings CRUD
    # ───────────────────────────────────────────────────────────────────────

    async def save_job(self, job_doc) -> Optional[str]:
        """Insert a new job posting."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = job_doc.to_mongo()
            result = await db.job_postings.insert_one(doc)
            logger.info("[DB] Job posting created | job_id={} | company={}", job_doc.job_id, job_doc.company_id)
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] save_job failed | error={}", exc)
            return None

    async def get_company_jobs(self, company_id: str) -> List[Dict[str, Any]]:
        """List all jobs posted by a company."""
        db = self._get_db()
        if db is None:
            return []
        try:
            cursor = db.job_postings.find({"company_id": company_id}).sort("created_at", DESCENDING)
            results = []
            async for doc in cursor:
                results.append({
                    "job_id": str(doc.get("_id", "")),
                    "company_id": doc.get("company_id", ""),
                    "title": doc.get("title", ""),
                    "description": doc.get("description", ""),
                    "required_role": doc.get("required_role", ""),
                    "required_score": doc.get("required_score", 0),
                    "required_skills": doc.get("required_skills", []),
                    "experience_level": doc.get("experience_level", "mid"),
                    "salary_range": doc.get("salary_range", ""),
                    "location": doc.get("location", ""),
                    "deadline": str(doc.get("deadline", "")) if doc.get("deadline") else None,
                    "status": doc.get("status", "open"),
                    "is_active": doc.get("is_active", True),
                    "applications_count": doc.get("applications_count", 0),
                    "created_at": doc.get("created_at"),
                })
            return results
        except Exception as exc:
            logger.error("[DB] get_company_jobs failed | error={}", exc)
            return []

    async def get_job_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a single job posting by ID."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = await db.job_postings.find_one({"_id": job_id})
            if doc:
                doc["job_id"] = str(doc.pop("_id"))
                return doc
            return None
        except Exception as exc:
            logger.error("[DB] get_job_by_id failed | error={}", exc)
            return None

    async def update_job(self, job_id: str, data: Dict[str, Any]) -> bool:
        """Update job posting fields."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.job_postings.update_one({"_id": job_id}, {"$set": data})
            return result.modified_count > 0
        except Exception as exc:
            logger.error("[DB] update_job failed | error={}", exc)
            return False

    async def delete_job(self, job_id: str) -> bool:
        """Delete/close a job posting."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.job_postings.update_one(
                {"_id": job_id},
                {"$set": {"is_active": False, "status": "closed"}},
            )
            return result.modified_count > 0
        except Exception as exc:
            logger.error("[DB] delete_job failed | error={}", exc)
            return False

    # ───────────────────────────────────────────────────────────────────────
    # Candidate Matching Algorithm
    # ───────────────────────────────────────────────────────────────────────

    async def get_matched_candidates(self, job_id: str) -> List[Dict[str, Any]]:
        """
        Auto-match candidates against a job posting using scoring algorithm:
        - Role match:       40 points (exact match)
        - Score match:      30 points (proportional)
        - Skills match:     20 points (proportional)
        - Experience match: 10 points (exact=10, adjacent=5)
        """
        db = self._get_db()
        if db is None:
            return []
        try:
            job = await db.job_postings.find_one({"_id": job_id})
            if not job:
                return []

            required_role = (job.get("required_role", "") or "").lower()
            required_score = job.get("required_score", 0) or 1
            required_skills = [s.lower() for s in (job.get("required_skills", []) or [])]
            required_experience = (job.get("experience_level", "mid") or "mid").lower()

            # Adjacent experience levels
            adjacent_map = {
                "junior": ["mid"],
                "mid": ["junior", "senior"],
                "senior": ["mid"],
            }

            # Get all visible candidates
            candidates = await self.get_candidates_for_search(limit=200)
            matched = []

            for c in candidates:
                # Role match (40 points)
                candidate_role = (c.get("target_role", "") or "").lower()
                role_points = 40 if candidate_role and required_role and required_role in candidate_role else 0

                # Score match (30 points)
                candidate_score = c.get("score", 0) or 0
                if required_score > 0:
                    score_points = min(candidate_score / required_score, 1.0) * 30
                else:
                    score_points = 30

                # Skills match (20 points)
                candidate_skills = [s.lower() for s in (c.get("skills", []) or [])]
                if required_skills:
                    matching = sum(1 for s in required_skills if s in candidate_skills)
                    skills_points = (matching / len(required_skills)) * 20
                else:
                    skills_points = 20

                # Experience match (10 points)
                candidate_exp = (c.get("experience", "") or "").lower()
                if candidate_exp == required_experience:
                    exp_points = 10
                elif candidate_exp in adjacent_map.get(required_experience, []):
                    exp_points = 5
                else:
                    exp_points = 0

                total_score = round(role_points + score_points + skills_points + exp_points, 1)

                # Build reason string
                reasons = []
                if role_points == 40:
                    reasons.append("Role match")
                if candidate_score >= required_score:
                    reasons.append(f"Score {candidate_score}")
                matched_skills = [s for s in required_skills if s in candidate_skills]
                if matched_skills:
                    reasons.append(f"Skills: {', '.join(matched_skills[:3])}")
                if exp_points >= 5:
                    reasons.append(f"{candidate_exp} level")

                matched.append({
                    "user_id": c["user_id"],
                    "name": c.get("name", ""),
                    "match_score": total_score,
                    "reason": ", ".join(reasons) if reasons else "Partial match",
                    "score": candidate_score,
                    "skills": c.get("skills", []),
                    "experience": c.get("experience", ""),
                    "target_role": c.get("target_role", ""),
                })

            # Sort by match_score descending
            matched.sort(key=lambda x: x["match_score"], reverse=True)

            # Assign ranks
            for i, m in enumerate(matched):
                m["rank"] = i + 1

            return matched
        except Exception as exc:
            logger.error("[DB] get_matched_candidates failed | error={}", exc)
            return []

    # ───────────────────────────────────────────────────────────────────────
    # Job Offers
    # ───────────────────────────────────────────────────────────────────────

    async def save_offer(self, offer_doc) -> Optional[str]:
        """Insert a new job offer."""
        db = self._get_db()
        if db is None:
            return None
        try:
            doc = offer_doc.to_mongo()
            result = await db.job_offers.insert_one(doc)
            logger.info("[DB] Offer sent | offer_id={} | company={} | user={}",
                        offer_doc.offer_id, offer_doc.company_id, offer_doc.user_id)
            return str(result.inserted_id)
        except Exception as exc:
            logger.error("[DB] save_offer failed | error={}", exc)
            return None

    async def get_candidate_offers(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all offers received by a candidate."""
        db = self._get_db()
        if db is None:
            return []
        try:
            cursor = db.job_offers.find({"user_id": user_id}).sort("created_at", DESCENDING)
            results = []
            async for doc in cursor:
                # Enrich with company name
                company = await db.companies.find_one({"_id": doc.get("company_id")}, {"name": 1})
                # Enrich with job details
                job = await db.job_postings.find_one({"_id": doc.get("job_id")}, {"title": 1, "salary_range": 1})

                results.append({
                    "offer_id": str(doc.get("_id", "")),
                    "company_id": doc.get("company_id", ""),
                    "user_id": doc.get("user_id", ""),
                    "job_id": doc.get("job_id", ""),
                    "company_name": company.get("name", "") if company else "",
                    "job_title": job.get("title", "") if job else "",
                    "salary_range": job.get("salary_range", "") if job else "",
                    "message": doc.get("message", ""),
                    "call_link": doc.get("call_link", ""),
                    "status": doc.get("status", "pending"),
                    "created_at": doc.get("created_at"),
                    "responded_at": doc.get("responded_at"),
                })
            return results
        except Exception as exc:
            logger.error("[DB] get_candidate_offers failed | error={}", exc)
            return []

    async def get_company_responses(self, company_id: str) -> List[Dict[str, Any]]:
        """Get all offer responses for a company."""
        db = self._get_db()
        if db is None:
            return []
        try:
            cursor = db.job_offers.find({"company_id": company_id}).sort("created_at", DESCENDING)
            results = []
            from bson import ObjectId
            
            async for doc in cursor:
                try:
                    # Robust user lookup
                    u_id = doc.get("user_id")
                    u_query = {"_id": u_id}
                    if isinstance(u_id, str) and len(u_id) == 24:
                        try:
                            u_query = {"$or": [{"_id": u_id}, {"_id": ObjectId(u_id)}]}
                        except Exception:
                            pass
                            
                    user = await db.users.find_one(u_query, {"name": 1})
                    candidate_name = user.get("name", "Unknown Candidate") if user else "Unknown Candidate"

                    # Robust job lookup
                    j_id = doc.get("job_id")
                    j_query = {"_id": j_id}
                    if isinstance(j_id, str) and len(j_id) == 24:
                        try:
                            j_query = {"$or": [{"_id": j_id}, {"_id": ObjectId(j_id)}]}
                        except Exception:
                            pass
                            
                    job = await db.job_postings.find_one(j_query, {"title": 1})
                    job_title = job.get("title", "Unknown Job") if job else "Unknown Job"

                    # Robust datetime conversion
                    created_at = doc.get("created_at")
                    if hasattr(created_at, 'isoformat'):
                        created_at = created_at.isoformat()
                    elif not isinstance(created_at, str):
                        created_at = None

                    responded_at = doc.get("responded_at")
                    if hasattr(responded_at, 'isoformat'):
                        responded_at = responded_at.isoformat()
                    elif not isinstance(responded_at, str):
                        responded_at = None

                    results.append({
                        "offer_id": str(doc.get("_id", "")),
                        "company_id": doc.get("company_id", company_id),
                        "user_id": str(u_id) if u_id else "",
                        "job_id": str(j_id) if j_id else "",
                        "candidate_name": candidate_name,
                        "job_title": job_title,
                        "message": doc.get("message", ""),
                        "call_link": doc.get("call_link", ""),
                        "status": doc.get("status", "pending"),
                        "created_at": created_at,
                        "responded_at": responded_at,
                        "response_message": doc.get("response_message", ""),
                    })
                except Exception as doc_exc:
                    logger.error("[DB] Error processing offer doc {} | error={}", doc.get("_id"), doc_exc)
                    continue
                    
            return results
        except Exception as exc:
            logger.error("[DB] get_company_responses failed | error={}", exc)
            return []

    # async def update_offer_status(self, offer_id: str, status: str, response_message: str = "") -> bool:
    async def update_offer_status(self, offer_id: str, user_id: str, status: str, response_message: str = "") -> bool:
        """Update offer status (accept/reject)."""
        db = self._get_db()
        if db is None:
            return False
        try:
            result = await db.job_offers.update_one(
                {"_id": offer_id, "user_id": user_id},
                {"$set": {
                    "status": status,
                    "responded_at": datetime.utcnow(),
                    "response_message": response_message,
                }},
            )
            return result.modified_count > 0
        except Exception as exc:
            logger.error("[DB] update_offer_status failed | error={}", exc)
            return False

    async def create_company_indexes(self) -> None:
        """Create indexes for company-related collections."""
        db = self._get_db()
        if db is None:
            return
        try:
            # Companies
            await db.companies.create_indexes([
                IndexModel([("email", ASCENDING)], unique=True, name="idx_companies_email_unique"),
                IndexModel([("created_at", DESCENDING)], name="idx_companies_created_at"),
            ])
            # Job Postings
            await db.job_postings.create_indexes([
                IndexModel([("company_id", ASCENDING)], name="idx_jobs_company"),
                IndexModel([("required_role", ASCENDING)], name="idx_jobs_role"),
                IndexModel([("created_at", DESCENDING)], name="idx_jobs_created_at"),
            ])
            # Candidate Shortlist
            await db.candidate_shortlist.create_indexes([
                IndexModel([("company_id", ASCENDING)], name="idx_shortlist_company"),
                IndexModel([("user_id", ASCENDING)], name="idx_shortlist_user"),
                IndexModel([("company_id", ASCENDING), ("user_id", ASCENDING)], name="idx_shortlist_compound"),
            ])
            # Job Offers
            await db.job_offers.create_indexes([
                IndexModel([("user_id", ASCENDING)], name="idx_offers_user"),
                IndexModel([("company_id", ASCENDING)], name="idx_offers_company"),
                IndexModel([("status", ASCENDING)], name="idx_offers_status"),
            ])
            logger.success("[DB] Company-related indexes created successfully")
        except Exception as exc:
            logger.error("[DB] create_company_indexes failed | error={}", exc)


# ── Module-level service singleton ─────────────────────────────────────────
db_service = DatabaseService()