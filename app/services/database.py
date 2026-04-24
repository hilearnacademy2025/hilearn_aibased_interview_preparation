# """
# HiLearn AI Interview Prep - MongoDB Database Service
# ======================================================
# Singleton async MongoDB connection manager with full CRUD operations
# for every collection (users, interviews, questions, feedback, analytics,
# admin_stats).

# Uses Motor (AsyncIOMotorClient) for non-blocking I/O.
# Gracefully falls back to in-memory when MongoDB is unavailable.

# Day 5: Complete database layer for persistence.
# """
# from datetime import datetime
# from typing import Any, Dict, List, Optional

# from loguru import logger
# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# from pymongo import ASCENDING, DESCENDING, IndexModel
# from pymongo.errors import (
#     ConnectionFailure,
#     DuplicateKeyError,
#     OperationFailure,
#     ServerSelectionTimeoutError,
# )

# from app.core.config import get_settings
# from app.models.db_models import (
#     AdminStatsDocument,
#     AnalyticsDocument,
#     FeedbackDocument,
#     InterviewDocument,
#     QuestionDocument,
#     UserDocument,
# )

# settings = get_settings()


# # ─────────────────────────────────────────────────────────────────────────────
# # Database Service (Singleton)
# # ─────────────────────────────────────────────────────────────────────────────

# class DatabaseService:
#     """
#     Async MongoDB connection manager and CRUD service.

#     Usage::

#         from app.services.database import db_service
#         await db_service.connect()
#         user = await db_service.get_user_by_email("rahil@hilearn.in")
#         await db_service.disconnect()

#     Matches the singleton pattern used by InterviewService and AuthService.
#     """

#     def __init__(self) -> None:
#         """Initialise with no active connection."""
#         self._client: Optional[AsyncIOMotorClient] = None
#         self._db: Optional[AsyncIOMotorDatabase] = None
#         self._connected: bool = False

#     # ───────────────────────────────────────────────────────────────────────
#     # Connection Management
#     # ───────────────────────────────────────────────────────────────────────

#     async def connect(self) -> bool:
#         """
#         Establish an async connection to MongoDB.

#         Returns:
#             True if connection succeeded, False otherwise.
#         """
#         try:
#             logger.info(
#                 "[DB] Connecting to MongoDB | url={} | db={}",
#                 settings.mongodb_url, settings.mongodb_db_name,
#             )
#             self._client = AsyncIOMotorClient(
#                 settings.mongodb_url,
#                 serverSelectionTimeoutMS=5000,  # 5s timeout for initial connect
#                 connectTimeoutMS=5000,
#                 socketTimeoutMS=10000,
#             )
#             # Ping to verify the connection is live
#             await self._client.admin.command("ping")
#             self._db = self._client[settings.mongodb_db_name]
#             self._connected = True
#             logger.success(
#                 "[DB] MongoDB connected successfully | db={}",
#                 settings.mongodb_db_name,
#             )
#             return True

#         except (ConnectionFailure, ServerSelectionTimeoutError) as exc:
#             logger.warning(
#                 "[DB] MongoDB connection FAILED | error={} | "
#                 "App will continue with in-memory stores only",
#                 exc,
#             )
#             self._connected = False
#             return False

#         except Exception as exc:
#             logger.error("[DB] Unexpected error during MongoDB connect | error={}", exc)
#             self._connected = False
#             return False

#     async def disconnect(self) -> None:
#         """Close the MongoDB connection gracefully."""
#         if self._client:
#             self._client.close()
#             self._connected = False
#             logger.info("[DB] MongoDB connection closed")

#     @property
#     def is_connected(self) -> bool:
#         """Check if the database is currently connected."""
#         return self._connected

#     def _get_db(self) -> Optional[AsyncIOMotorDatabase]:
#         """Return the database handle, or None if not connected."""
#         if not self._connected or self._db is None:
#             return None
#         return self._db

#     # ───────────────────────────────────────────────────────────────────────
#     # Index Management
#     # ───────────────────────────────────────────────────────────────────────

#     async def create_indexes(self) -> None:
#         """
#         Create all required indexes on MongoDB collections.

#         Called once during application startup. Indexes are idempotent —
#         calling this multiple times is safe.
#         """
#         db = self._get_db()
#         if db is None:
#             logger.warning("[DB] Skipping index creation — not connected")
#             return

#         try:
#             # ── Users collection ──────────────────────────────────────────
#             users_indexes = [
#                 IndexModel([("email", ASCENDING)], unique=True, name="idx_users_email_unique"),
#                 IndexModel([("created_at", DESCENDING)], name="idx_users_created_at"),
#             ]
#             await db.users.create_indexes(users_indexes)
#             logger.info("[DB] Indexes created on 'users' collection")

#             # ── Interviews collection ─────────────────────────────────────
#             interviews_indexes = [
#                 IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="idx_interviews_user_date"),
#                 IndexModel([("status", ASCENDING)], name="idx_interviews_status"),
#             ]
#             await db.interviews.create_indexes(interviews_indexes)
#             logger.info("[DB] Indexes created on 'interviews' collection")

#             # ── Feedback collection ───────────────────────────────────────
#             feedback_indexes = [
#                 IndexModel([("interview_id", ASCENDING)], name="idx_feedback_interview"),
#                 IndexModel([("user_id", ASCENDING)], name="idx_feedback_user"),
#             ]
#             await db.feedback.create_indexes(feedback_indexes)
#             logger.info("[DB] Indexes created on 'feedback' collection")

#             # ── Analytics collection ──────────────────────────────────────
#             # user_id is _id, so already indexed

#             # ── Questions collection ──────────────────────────────────────
#             questions_indexes = [
#                 IndexModel(
#                     [("job_role", ASCENDING), ("interview_type", ASCENDING), ("difficulty", ASCENDING)],
#                     name="idx_questions_role_type_diff",
#                 ),
#             ]
#             await db.questions.create_indexes(questions_indexes)
#             logger.info("[DB] Indexes created on 'questions' collection")

#             logger.success("[DB] All indexes created successfully")

#         except OperationFailure as exc:
#             logger.error("[DB] Index creation failed | error={}", exc)
#         except Exception as exc:
#             logger.error("[DB] Unexpected error during index creation | error={}", exc)

#     # ───────────────────────────────────────────────────────────────────────
#     # User CRUD
#     # ───────────────────────────────────────────────────────────────────────

#     async def create_user(self, user: UserDocument) -> Optional[str]:
#         """
#         Insert a new user document into the ``users`` collection.

#         Args:
#             user: Validated UserDocument instance.

#         Returns:
#             The inserted user_id, or None on failure.
#         """
#         db = self._get_db()
#         if db is None:
#             logger.debug("[DB] create_user skipped — not connected")
#             return None

#         try:
#             doc = user.to_mongo()
#             result = await db.users.insert_one(doc)
#             logger.info("[DB] User created | user_id={} | email={}", user.user_id, user.email)
#             return str(result.inserted_id)

#         except DuplicateKeyError:
#             logger.warning("[DB] Duplicate email on create_user | email={}", user.email)
#             return None
#         except Exception as exc:
#             logger.error("[DB] create_user failed | error={}", exc)
#             return None

#     async def get_user_by_id(self, user_id: str) -> Optional[UserDocument]:
#         """
#         Find a user by their unique ID.

#         Args:
#             user_id: The user's unique identifier.

#         Returns:
#             UserDocument if found, None otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = await db.users.find_one({"_id": user_id})
#             if doc:
#                 return UserDocument.from_mongo(doc)
#             return None
#         except Exception as exc:
#             logger.error("[DB] get_user_by_id failed | user_id={} | error={}", user_id, exc)
#             return None

#     async def get_user_by_email(self, email: str) -> Optional[UserDocument]:
#         """
#         Find a user by their email address.

#         Args:
#             email: The email to search for (case-insensitive).

#         Returns:
#             UserDocument if found, None otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = await db.users.find_one({"email": email.lower().strip()})
#             if doc:
#                 return UserDocument.from_mongo(doc)
#             return None
#         except Exception as exc:
#             logger.error("[DB] get_user_by_email failed | email={} | error={}", email, exc)
#             return None

#     async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
#         """
#         Update specific fields on a user document.

#         Args:
#             user_id: The user's unique identifier.
#             update_data: Dict of fields to update.

#         Returns:
#             True if the document was modified, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             update_data["updated_at"] = datetime.utcnow()
#             result = await db.users.update_one(
#                 {"_id": user_id},
#                 {"$set": update_data},
#             )
#             if result.modified_count > 0:
#                 logger.info("[DB] User updated | user_id={} | fields={}", user_id, list(update_data.keys()))
#                 return True
#             return False
#         except Exception as exc:
#             logger.error("[DB] update_user failed | user_id={} | error={}", user_id, exc)
#             return False

#     async def update_user_stats(self, user_id: str, new_score: float) -> bool:
#         """
#         Increment interview_count and recalculate average_score for a user.

#         Uses MongoDB's ``$inc`` and atomic update to avoid race conditions.

#         Args:
#             user_id: The user's unique identifier.
#             new_score: The score from the latest interview.

#         Returns:
#             True if the document was modified, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             # Fetch current stats to recalculate average
#             user_doc = await db.users.find_one({"_id": user_id}, {"interview_count": 1, "average_score": 1})
#             if not user_doc:
#                 return False

#             current_count = user_doc.get("interview_count", 0)
#             current_avg = user_doc.get("average_score", 0.0)
#             new_count = current_count + 1
#             new_avg = round(((current_avg * current_count) + new_score) / new_count, 2)

#             result = await db.users.update_one(
#                 {"_id": user_id},
#                 {
#                     "$set": {
#                         "interview_count": new_count,
#                         "average_score": new_avg,
#                         "updated_at": datetime.utcnow(),
#                     }
#                 },
#             )
#             if result.modified_count > 0:
#                 logger.info(
#                     "[DB] User stats updated | user_id={} | count={} | avg={}",
#                     user_id, new_count, new_avg,
#                 )
#                 return True
#             return False
#         except Exception as exc:
#             logger.error("[DB] update_user_stats failed | user_id={} | error={}", user_id, exc)
#             return False

#     # ───────────────────────────────────────────────────────────────────────
#     # Interview CRUD
#     # ───────────────────────────────────────────────────────────────────────

#     async def create_interview(self, interview: InterviewDocument) -> Optional[str]:
#         """
#         Insert a new interview session into the ``interviews`` collection.

#         Args:
#             interview: Validated InterviewDocument instance.

#         Returns:
#             The inserted session_id, or None on failure.
#         """
#         db = self._get_db()
#         if db is None:
#             logger.debug("[DB] create_interview skipped — not connected")
#             return None

#         try:
#             doc = interview.to_mongo()
#             result = await db.interviews.insert_one(doc)
#             logger.info(
#                 "[DB] Interview created | session_id={} | user_id={} | type={}",
#                 interview.session_id, interview.user_id, interview.interview_type.value,
#             )
#             return str(result.inserted_id)

#         except DuplicateKeyError:
#             logger.warning("[DB] Duplicate session_id | session_id={}", interview.session_id)
#             return None
#         except Exception as exc:
#             logger.error("[DB] create_interview failed | error={}", exc)
#             return None

#     async def get_interview(self, session_id: str) -> Optional[InterviewDocument]:
#         """
#         Retrieve an interview session by its session_id.

#         Args:
#             session_id: The unique session identifier.

#         Returns:
#             InterviewDocument if found, None otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = await db.interviews.find_one({"_id": session_id})
#             if doc:
#                 return InterviewDocument.from_mongo(doc)
#             return None
#         except Exception as exc:
#             logger.error("[DB] get_interview failed | session_id={} | error={}", session_id, exc)
#             return None

#     async def update_interview(self, session_id: str, update_data: Dict[str, Any]) -> bool:
#         """
#         Update specific fields on an interview document.

#         Args:
#             session_id: The session's unique identifier.
#             update_data: Dict of fields to update.

#         Returns:
#             True if the document was modified, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             result = await db.interviews.update_one(
#                 {"_id": session_id},
#                 {"$set": update_data},
#             )
#             if result.modified_count > 0:
#                 logger.info("[DB] Interview updated | session_id={} | fields={}", session_id, list(update_data.keys()))
#                 return True
#             return False
#         except Exception as exc:
#             logger.error("[DB] update_interview failed | session_id={} | error={}", session_id, exc)
#             return False

#     async def add_answer_to_interview(self, session_id: str, answer: Dict[str, Any]) -> bool:
#         """
#         Push a new answer onto the interview's answers array
#         and update current_index.

#         Args:
#             session_id: The session's unique identifier.
#             answer: Answer dict to append.

#         Returns:
#             True if the document was modified, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             result = await db.interviews.update_one(
#                 {"_id": session_id},
#                 {
#                     "$push": {"answers": answer},
#                     "$inc": {"current_index": 1},
#                 },
#             )
#             if result.modified_count > 0:
#                 logger.debug("[DB] Answer added to interview | session_id={}", session_id)
#                 return True
#             return False
#         except Exception as exc:
#             logger.error("[DB] add_answer_to_interview failed | session_id={} | error={}", session_id, exc)
#             return False

#     async def get_user_interviews(
#         self, user_id: str, limit: int = 20, skip: int = 0
#     ) -> List[InterviewDocument]:
#         """
#         Retrieve a user's interview history, newest first.

#         Args:
#             user_id: The user's unique identifier.
#             limit: Maximum number of results (default 20).
#             skip: Number of results to skip for pagination.

#         Returns:
#             List of InterviewDocument instances.
#         """
#         db = self._get_db()
#         if db is None:
#             return []

#         try:
#             cursor = db.interviews.find(
#                 {"user_id": user_id}
#             ).sort("created_at", DESCENDING).skip(skip).limit(limit)

#             results = []
#             async for doc in cursor:
#                 results.append(InterviewDocument.from_mongo(doc))
#             logger.debug("[DB] get_user_interviews | user_id={} | count={}", user_id, len(results))
#             return results

#         except Exception as exc:
#             logger.error("[DB] get_user_interviews failed | user_id={} | error={}", user_id, exc)
#             return []

#     # ───────────────────────────────────────────────────────────────────────
#     # Feedback CRUD
#     # ───────────────────────────────────────────────────────────────────────

#     async def save_feedback(self, feedback: FeedbackDocument) -> Optional[str]:
#         """
#         Insert a feedback document into the ``feedback`` collection.

#         Args:
#             feedback: Validated FeedbackDocument instance.

#         Returns:
#             The inserted feedback_id, or None on failure.
#         """
#         db = self._get_db()
#         if db is None:
#             logger.debug("[DB] save_feedback skipped — not connected")
#             return None

#         try:
#             doc = feedback.to_mongo()
#             result = await db.feedback.insert_one(doc)
#             logger.info(
#                 "[DB] Feedback saved | feedback_id={} | interview_id={} | score={}",
#                 feedback.feedback_id, feedback.interview_id, feedback.overall_score,
#             )
#             return str(result.inserted_id)
#         except Exception as exc:
#             logger.error("[DB] save_feedback failed | error={}", exc)
#             return None

#     async def get_feedback_for_interview(self, interview_id: str) -> List[FeedbackDocument]:
#         """
#         Retrieve all feedback documents for a given interview.

#         Args:
#             interview_id: The interview session ID.

#         Returns:
#             List of FeedbackDocument instances.
#         """
#         db = self._get_db()
#         if db is None:
#             return []

#         try:
#             cursor = db.feedback.find({"interview_id": interview_id}).sort("created_at", ASCENDING)
#             results = []
#             async for doc in cursor:
#                 results.append(FeedbackDocument.from_mongo(doc))
#             return results
#         except Exception as exc:
#             logger.error("[DB] get_feedback_for_interview failed | interview_id={} | error={}", interview_id, exc)
#             return []

#     # ───────────────────────────────────────────────────────────────────────
#     # Analytics CRUD
#     # ───────────────────────────────────────────────────────────────────────

#     async def get_user_analytics(self, user_id: str) -> Optional[AnalyticsDocument]:
#         """
#         Retrieve analytics for a specific user.

#         Args:
#             user_id: The user's unique identifier.

#         Returns:
#             AnalyticsDocument if found, None otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = await db.analytics.find_one({"_id": user_id})
#             if doc:
#                 return AnalyticsDocument.from_mongo(doc)
#             return None
#         except Exception as exc:
#             logger.error("[DB] get_user_analytics failed | user_id={} | error={}", user_id, exc)
#             return None

#     async def update_user_analytics(
#         self, user_id: str, score: float, weak_areas: Optional[List[str]] = None
#     ) -> bool:
#         """
#         Update or create analytics for a user (upsert).

#         Appends the latest score to accuracy_trend, recalculates averages,
#         and optionally updates weak_areas.

#         Args:
#             user_id: The user's unique identifier.
#             score: The latest interview score.
#             weak_areas: Optional list of weak topic areas.

#         Returns:
#             True if the document was modified/created, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             # Build update operations
#             update_ops: Dict[str, Any] = {
#                 "$push": {"accuracy_trend": {"$each": [score], "$slice": -50}},  # Keep last 50 scores
#                 "$inc": {"total_interviews": 1},
#                 "$set": {
#                     "last_interview_at": datetime.utcnow(),
#                     "updated_at": datetime.utcnow(),
#                 },
#             }

#             if weak_areas:
#                 update_ops["$addToSet"] = {"weak_areas": {"$each": weak_areas}}

#             result = await db.analytics.update_one(
#                 {"_id": user_id},
#                 update_ops,
#                 upsert=True,
#             )

#             # Recalculate average_score and improvement_rate from the trend
#             analytics_doc = await db.analytics.find_one({"_id": user_id})
#             if analytics_doc:
#                 trend = analytics_doc.get("accuracy_trend", [])
#                 avg = round(sum(trend) / len(trend), 2) if trend else 0.0

#                 # Improvement rate: compare last 5 vs previous 5
#                 improvement = 0.0
#                 if len(trend) >= 10:
#                     recent = sum(trend[-5:]) / 5
#                     previous = sum(trend[-10:-5]) / 5
#                     improvement = round(((recent - previous) / max(previous, 0.01)) * 100, 1)

#                 await db.analytics.update_one(
#                     {"_id": user_id},
#                     {"$set": {"average_score": avg, "improvement_rate": improvement}},
#                 )

#             logger.info("[DB] Analytics updated | user_id={} | score={}", user_id, score)
#             return True

#         except Exception as exc:
#             logger.error("[DB] update_user_analytics failed | user_id={} | error={}", user_id, exc)
#             return False

#     # ───────────────────────────────────────────────────────────────────────
#     # Admin Stats
#     # ───────────────────────────────────────────────────────────────────────

#     async def get_admin_stats(self) -> Optional[AdminStatsDocument]:
#         """
#         Retrieve the global admin statistics document.

#         Returns:
#             AdminStatsDocument or None if not found / not connected.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = await db.admin_stats.find_one({"_id": "global"})
#             if doc:
#                 return AdminStatsDocument.from_mongo(doc)
#             return None
#         except Exception as exc:
#             logger.error("[DB] get_admin_stats failed | error={}", exc)
#             return None

#     async def update_admin_stats(self) -> bool:
#         """
#         Recalculate and upsert the global admin statistics document.

#         Counts total users, total interviews, and computes the
#         platform-wide average user score.

#         Returns:
#             True on success, False otherwise.
#         """
#         db = self._get_db()
#         if db is None:
#             return False

#         try:
#             total_users = await db.users.count_documents({})
#             total_interviews = await db.interviews.count_documents({})

#             # Calculate average user score across all users
#             pipeline = [
#                 {"$match": {"interview_count": {"$gt": 0}}},
#                 {"$group": {"_id": None, "avg_score": {"$avg": "$average_score"}}},
#             ]
#             cursor = db.users.aggregate(pipeline)
#             avg_score = 0.0
#             async for result in cursor:
#                 avg_score = round(result.get("avg_score", 0.0), 2)

#             stats = AdminStatsDocument(
#                 total_users=total_users,
#                 total_interviews=total_interviews,
#                 average_user_score=avg_score,
#                 last_updated=datetime.utcnow(),
#             )

#             await db.admin_stats.update_one(
#                 {"_id": "global"},
#                 {"$set": stats.to_mongo()},
#                 upsert=True,
#             )
#             logger.info(
#                 "[DB] Admin stats updated | users={} | interviews={} | avg_score={}",
#                 total_users, total_interviews, avg_score,
#             )
#             return True

#         except Exception as exc:
#             logger.error("[DB] update_admin_stats failed | error={}", exc)
#             return False

#     # ───────────────────────────────────────────────────────────────────────
#     # Question CRUD
#     # ───────────────────────────────────────────────────────────────────────

#     async def save_question(self, question: QuestionDocument) -> Optional[str]:
#         """
#         Insert a question document into the ``questions`` collection.

#         Args:
#             question: Validated QuestionDocument instance.

#         Returns:
#             The inserted question_id, or None on failure.
#         """
#         db = self._get_db()
#         if db is None:
#             return None

#         try:
#             doc = question.to_mongo()
#             result = await db.questions.insert_one(doc)
#             logger.debug("[DB] Question saved | question_id={}", question.question_id)
#             return str(result.inserted_id)
#         except Exception as exc:
#             logger.error("[DB] save_question failed | error={}", exc)
#             return None

#     async def get_questions(
#         self,
#         job_role: Optional[str] = None,
#         interview_type: Optional[str] = None,
#         difficulty: Optional[str] = None,
#         limit: int = 10,
#     ) -> List[QuestionDocument]:
#         """
#         Query questions with optional filters.

#         Args:
#             job_role: Filter by target job role.
#             interview_type: Filter by interview type.
#             difficulty: Filter by difficulty level.
#             limit: Maximum number of results.

#         Returns:
#             List of QuestionDocument instances.
#         """
#         db = self._get_db()
#         if db is None:
#             return []

#         try:
#             query: Dict[str, Any] = {}
#             if job_role:
#                 query["job_role"] = job_role
#             if interview_type:
#                 query["interview_type"] = interview_type
#             if difficulty:
#                 query["difficulty"] = difficulty

#             cursor = db.questions.find(query).limit(limit)
#             results = []
#             async for doc in cursor:
#                 results.append(QuestionDocument.from_mongo(doc))
#             return results
#         except Exception as exc:
#             logger.error("[DB] get_questions failed | error={}", exc)
#             return []

#     # ───────────────────────────────────────────────────────────────────────
#     # Health Check Helper
#     # ───────────────────────────────────────────────────────────────────────

#     async def health_check(self) -> Dict[str, Any]:
#         """
#         Return MongoDB connection health status.

#         Returns:
#             Dict with ``connected`` bool and optional ``latency_ms``.
#         """
#         if not self._connected or self._client is None:
#             return {"connected": False, "status": "disconnected"}

#         try:
#             import time
#             start = time.monotonic()
#             await self._client.admin.command("ping")
#             latency = round((time.monotonic() - start) * 1000, 1)
#             return {"connected": True, "status": "healthy", "latency_ms": latency}
#         except Exception as exc:
#             logger.warning("[DB] Health check failed | error={}", exc)
#             return {"connected": False, "status": "unhealthy", "error": str(exc)}


# # ── Module-level service singleton ─────────────────────────────────────────
# db_service = DatabaseService()





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


# ── Module-level service singleton ─────────────────────────────────────────
db_service = DatabaseService()