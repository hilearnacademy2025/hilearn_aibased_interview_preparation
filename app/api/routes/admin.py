# """
# HiLearn AI Interview Prep - Admin Routes
# ==========================================
# GET  /admin/dashboard                →  Platform stats overview
# GET  /admin/users                    →  Paginated user list
# GET  /admin/users/{user_id}          →  User profile + analytics
# PUT  /admin/users/{user_id}          →  Edit user
# DELETE /admin/users/{user_id}        →  Soft-delete user
# GET  /admin/interviews               →  Paginated interview list
# GET  /admin/interviews/{session_id}  →  Full interview detail
# GET  /admin/analytics                →  Chart data for analytics page

# All endpoints require admin role (403 for non-admins).
# """
# from datetime import datetime, timedelta
# from typing import Any, Dict, List, Optional

# from fastapi import APIRouter, Depends, HTTPException, Query, status
# from loguru import logger

# from app.core.security import get_current_user
# from app.db.database import db
# from app.models.schemas import APIResponse

# router = APIRouter(prefix="/admin", tags=["Admin"])


# # ─────────────────────────────────────────────────────────
# # Admin Guard Dependency
# # ─────────────────────────────────────────────────────────

# async def require_admin(
#     user: Dict[str, Any] = Depends(get_current_user),
# ) -> Dict[str, Any]:
#     """
#     FastAPI dependency that ensures the authenticated user has admin role.
#     Returns 403 Forbidden for non-admin users.
#     """
#     if user.get("role") != "admin":
#         logger.warning(
#             "[ADMIN] Non-admin access attempt | user_id={} | role={}",
#             user.get("sub", "unknown"), user.get("role", "unknown"),
#         )
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Admin access required.",
#         )
#     return user


# # ─────────────────────────────────────────────────────────
# # 1. GET /admin/dashboard
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/dashboard",
#     response_model=APIResponse,
#     summary="Admin Dashboard Stats",
#     description="Platform-wide statistics for the admin dashboard.",
# )
# async def admin_dashboard(
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return total users, interviews, avg score, recent users, recent interviews."""
#     logger.info("[ADMIN] GET /admin/dashboard | admin={}", admin.get("sub"))

#     try:
#         total_users = await db.users.count_documents({})
#         total_interviews = await db.interviews.count_documents({})

#         # Average user score
#         avg_pipeline = [
#             {"$match": {"interview_count": {"$gt": 0}}},
#             {"$group": {"_id": None, "avg_score": {"$avg": "$average_score"}}},
#         ]
#         avg_score = 0.0
#         async for result in db.users.aggregate(avg_pipeline):
#             avg_score = round(result.get("avg_score", 0.0), 1)

#         # Recent 5 users
#         recent_users = []
#         cursor = db.users.find(
#             {}, {"password_hash": 0, "hashed_password": 0}
#         ).sort("created_at", -1).limit(5)
#         async for doc in cursor:
#             recent_users.append({
#                 "name": doc.get("name", ""),
#                 "email": doc.get("email", ""),
#                 "role": doc.get("role", "student"),
#                 "interview_count": doc.get("interview_count", 0),
#                 "created_at": str(doc.get("created_at", "")),
#             })

#         # Recent 5 interviews
#         recent_interviews = []
#         cursor = db.interviews.find({}).sort("created_at", -1).limit(5)
#         async for doc in cursor:
#             # Look up user name
#             user_doc = await db.users.find_one(
#                 {"_id": doc.get("user_id")}, {"name": 1}
#             )
#             user_name = user_doc.get("name", "Unknown") if user_doc else "Unknown"

#             # Calculate overall score from answers
#             answers = doc.get("answers", [])
#             scores = [a.get("content_score", 0) for a in answers if a.get("content_score") is not None]
#             avg = round(sum(scores) / len(scores) * 10, 0) if scores else 0

#             recent_interviews.append({
#                 "session_id": doc.get("_id", ""),
#                 "user": user_name,
#                 "type": doc.get("interview_type", "technical"),
#                 "score": avg,
#                 "status": doc.get("status", "active"),
#                 "date": str(doc.get("created_at", "")),
#             })

#         return APIResponse(
#             message="Dashboard stats retrieved",
#             data={
#                 "total_users": total_users,
#                 "total_interviews": total_interviews,
#                 "average_score": avg_score,
#                 "recent_users": recent_users,
#                 "recent_interviews": recent_interviews,
#             },
#         )

#     except Exception as exc:
#         logger.error("[ADMIN] Dashboard query failed | error={}", exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch dashboard stats.",
#         )


# # ─────────────────────────────────────────────────────────
# # 2. GET /admin/users
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/users",
#     response_model=APIResponse,
#     summary="List All Users",
#     description="Paginated user list with optional search and role filter.",
# )
# async def list_users(
#     page: int = Query(default=1, ge=1, description="Page number"),
#     limit: int = Query(default=10, ge=1, le=100, description="Results per page"),
#     search: Optional[str] = Query(default=None, description="Search by name or email"),
#     role: Optional[str] = Query(default=None, description="Filter by role: student/admin"),
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return paginated list of users."""
#     logger.info(
#         "[ADMIN] GET /admin/users | page={} | limit={} | search={} | role={}",
#         page, limit, search, role,
#     )

#     try:
#         query: Dict[str, Any] = {}

#         if role:
#             query["role"] = role

#         if search:
#             import re
#             regex = {"$regex": re.escape(search), "$options": "i"}
#             query["$or"] = [{"name": regex}, {"email": regex}]

#         skip = (page - 1) * limit
#         total = await db.users.count_documents(query)

#         users = []
#         cursor = db.users.find(
#             query, {"password_hash": 0, "hashed_password": 0}
#         ).sort("created_at", -1).skip(skip).limit(limit)

#         async for doc in cursor:
#             users.append({
#                 "_id": str(doc.get("_id", "")),
#                 "user_id": str(doc.get("_id", "")),
#                 "name": doc.get("name", ""),
#                 "email": doc.get("email", ""),
#                 "role": doc.get("role", "student"),
#                 "interview_count": doc.get("interview_count", 0),
#                 "average_score": doc.get("average_score", 0.0),
#                 "created_at": str(doc.get("created_at", "")),
#                 "is_active": doc.get("status", "active") != "deleted",
#                 "status": doc.get("status", "active"),
#             })

#         return APIResponse(
#             message=f"{len(users)} user(s) found",
#             data={
#                 "users": users,
#                 "total": total,
#                 "page": page,
#                 "limit": limit,
#                 "total_pages": (total + limit - 1) // limit,
#             },
#         )

#     except Exception as exc:
#         logger.error("[ADMIN] List users failed | error={}", exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch users.",
#         )


# # ─────────────────────────────────────────────────────────
# # 3. GET /admin/users/{user_id}
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/users/{user_id}",
#     response_model=APIResponse,
#     summary="Get User Profile + Analytics",
#     description="Full user profile with analytics data.",
# )
# async def get_user_detail(
#     user_id: str,
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return full user profile with analytics (weak_areas, accuracy_trend, etc.)."""
#     logger.info("[ADMIN] GET /admin/users/{} | admin={}", user_id, admin.get("sub"))

#     try:
#         user_doc = await db.users.find_one(
#             {"_id": user_id}, {"password_hash": 0, "hashed_password": 0}
#         )
#         if not user_doc:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"User '{user_id}' not found.",
#             )

#         # Fetch analytics
#         analytics_doc = await db.analytics.find_one({"_id": user_id})
#         analytics = {}
#         if analytics_doc:
#             analytics = {
#                 "total_interviews": analytics_doc.get("total_interviews", 0),
#                 "average_score": analytics_doc.get("average_score", 0.0),
#                 "accuracy_trend": analytics_doc.get("accuracy_trend", []),
#                 "weak_areas": analytics_doc.get("weak_areas", []),
#                 "improvement_rate": analytics_doc.get("improvement_rate", 0.0),
#                 "last_interview_at": str(analytics_doc.get("last_interview_at", "")),
#             }

#         user_data = {
#             "user_id": str(user_doc.get("_id", "")),
#             "name": user_doc.get("name", ""),
#             "email": user_doc.get("email", ""),
#             "role": user_doc.get("role", "student"),
#             "status": user_doc.get("status", "active"),
#             "interview_count": user_doc.get("interview_count", 0),
#             "average_score": user_doc.get("average_score", 0.0),
#             "created_at": str(user_doc.get("created_at", "")),
#             "analytics": analytics,
#         }

#         return APIResponse(
#             message="User profile retrieved",
#             data=user_data,
#         )

#     except HTTPException:
#         raise
#     except Exception as exc:
#         logger.error("[ADMIN] Get user detail failed | user_id={} | error={}", user_id, exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch user profile.",
#         )


# # ─────────────────────────────────────────────────────────
# # 4. PUT /admin/users/{user_id}
# # ─────────────────────────────────────────────────────────
# @router.put(
#     "/users/{user_id}",
#     response_model=APIResponse,
#     summary="Edit User",
#     description="Update user fields (name, role, status).",
# )
# async def update_user(
#     user_id: str,
#     payload: Dict[str, Any],
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Update user name, role, or status."""
#     logger.info(
#         "[ADMIN] PUT /admin/users/{} | admin={} | fields={}",
#         user_id, admin.get("sub"), list(payload.keys()),
#     )

#     try:
#         # Only allow specific fields to be updated
#         allowed_fields = {"name", "role", "status"}
#         update_data = {k: v for k, v in payload.items() if k in allowed_fields}

#         if not update_data:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="No valid fields to update. Allowed: name, role, status.",
#             )

#         update_data["updated_at"] = datetime.utcnow()

#         result = await db.users.update_one(
#             {"_id": user_id},
#             {"$set": update_data},
#         )

#         if result.matched_count == 0:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"User '{user_id}' not found.",
#             )

#         # Fetch updated user
#         updated_doc = await db.users.find_one(
#             {"_id": user_id}, {"password_hash": 0, "hashed_password": 0}
#         )

#         return APIResponse(
#             message="User updated successfully",
#             data={
#                 "user_id": str(updated_doc.get("_id", "")),
#                 "name": updated_doc.get("name", ""),
#                 "email": updated_doc.get("email", ""),
#                 "role": updated_doc.get("role", "student"),
#                 "status": updated_doc.get("status", "active"),
#             },
#         )

#     except HTTPException:
#         raise
#     except Exception as exc:
#         logger.error("[ADMIN] Update user failed | user_id={} | error={}", user_id, exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to update user.",
#         )


# # ─────────────────────────────────────────────────────────
# # 5. DELETE /admin/users/{user_id}
# # ─────────────────────────────────────────────────────────
# @router.delete(
#     "/users/{user_id}",
#     response_model=APIResponse,
#     summary="Soft-Delete User",
#     description="Set user status to 'deleted' (does not remove from DB).",
# )
# async def delete_user(
#     user_id: str,
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Soft-delete user by setting status='deleted'."""
#     logger.info("[ADMIN] DELETE /admin/users/{} | admin={}", user_id, admin.get("sub"))

#     try:
#         result = await db.users.update_one(
#             {"_id": user_id},
#             {"$set": {"status": "deleted", "updated_at": datetime.utcnow()}},
#         )

#         if result.matched_count == 0:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"User '{user_id}' not found.",
#             )

#         logger.info("[ADMIN] User soft-deleted | user_id={}", user_id)
#         return APIResponse(message="User deleted successfully")

#     except HTTPException:
#         raise
#     except Exception as exc:
#         logger.error("[ADMIN] Delete user failed | user_id={} | error={}", user_id, exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to delete user.",
#         )


# # ─────────────────────────────────────────────────────────
# # 6. GET /admin/interviews
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/interviews",
#     response_model=APIResponse,
#     summary="List All Interviews",
#     description="Paginated interview list with optional filters.",
# )
# async def list_interviews(
#     page: int = Query(default=1, ge=1, description="Page number"),
#     limit: int = Query(default=10, ge=1, le=100, description="Results per page"),
#     user_id: Optional[str] = Query(default=None, description="Filter by user_id"),
#     interview_status: Optional[str] = Query(default=None, alias="status", description="Filter by status"),
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return paginated list of interviews."""
#     logger.info(
#         "[ADMIN] GET /admin/interviews | page={} | limit={} | user_id={} | status={}",
#         page, limit, user_id, interview_status,
#     )

#     try:
#         query: Dict[str, Any] = {}
#         if user_id:
#             query["user_id"] = user_id
#         if interview_status:
#             query["status"] = interview_status

#         skip = (page - 1) * limit
#         total = await db.interviews.count_documents(query)

#         interviews = []
#         cursor = db.interviews.find(query).sort("created_at", -1).skip(skip).limit(limit)

#         async for doc in cursor:
#             # Look up user name
#             u_doc = await db.users.find_one({"_id": doc.get("user_id")}, {"name": 1})
#             user_name = u_doc.get("name", "Unknown") if u_doc else "Unknown"

#             # Calculate score
#             answers = doc.get("answers", [])
#             scores = [a.get("content_score", 0) for a in answers if a.get("content_score") is not None]
#             avg = round(sum(scores) / len(scores) * 10, 0) if scores else 0

#             interviews.append({
#                 "id": str(doc.get("_id", "")),
#                 "session_id": str(doc.get("_id", "")),
#                 "user_id": doc.get("user_id", ""),
#                 "user": user_name,
#                 "type": doc.get("interview_type", "technical"),
#                 "job_role": doc.get("job_role", ""),
#                 "difficulty": doc.get("difficulty", "intermediate"),
#                 "score": avg,
#                 "status": doc.get("status", "active"),
#                 "date": str(doc.get("created_at", "")),
#                 "duration_seconds": doc.get("duration_seconds", 0),
#                 "questions_count": len(doc.get("questions", [])),
#                 "answers_count": len(answers),
#             })

#         return APIResponse(
#             message=f"{len(interviews)} interview(s) found",
#             data={
#                 "interviews": interviews,
#                 "total": total,
#                 "page": page,
#                 "limit": limit,
#                 "total_pages": (total + limit - 1) // limit,
#             },
#         )

#     except Exception as exc:
#         logger.error("[ADMIN] List interviews failed | error={}", exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch interviews.",
#         )


# # ─────────────────────────────────────────────────────────
# # 7. GET /admin/interviews/{session_id}
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/interviews/{session_id}",
#     response_model=APIResponse,
#     summary="Get Interview Detail",
#     description="Full interview with all answers and feedback.",
# )
# async def get_interview_detail(
#     session_id: str,
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return full interview detail including answers and feedback."""
#     logger.info("[ADMIN] GET /admin/interviews/{} | admin={}", session_id, admin.get("sub"))

#     try:
#         doc = await db.interviews.find_one({"_id": session_id})
#         if not doc:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail=f"Interview '{session_id}' not found.",
#             )

#         # Look up user info
#         u_doc = await db.users.find_one(
#             {"_id": doc.get("user_id")}, {"name": 1, "email": 1}
#         )

#         # Get feedback for this interview
#         feedback_list = []
#         cursor = db.feedback.find({"interview_id": session_id}).sort("created_at", 1)
#         async for fb in cursor:
#             feedback_list.append({
#                 "question_id": fb.get("question_id", ""),
#                 "content_score": fb.get("content_score", 0),
#                 "communication_score": fb.get("communication_score", 0),
#                 "overall_score": fb.get("overall_score", 0),
#                 "suggestions": fb.get("suggestions", []),
#             })

#         # Serialize answers
#         answers = []
#         for a in doc.get("answers", []):
#             answers.append({
#                 "question_id": a.get("question_id", ""),
#                 "answer_text": a.get("answer_text", ""),
#                 "content_score": a.get("content_score"),
#                 "feedback": a.get("feedback", ""),
#                 "submitted_at": str(a.get("submitted_at", "")),
#             })

#         interview_data = {
#             "session_id": str(doc.get("_id", "")),
#             "user_id": doc.get("user_id", ""),
#             "user_name": u_doc.get("name", "Unknown") if u_doc else "Unknown",
#             "user_email": u_doc.get("email", "") if u_doc else "",
#             "interview_type": doc.get("interview_type", "technical"),
#             "job_role": doc.get("job_role", ""),
#             "difficulty": doc.get("difficulty", "intermediate"),
#             "status": doc.get("status", "active"),
#             "questions": doc.get("questions", []),
#             "answers": answers,
#             "feedback": feedback_list,
#             "duration_seconds": doc.get("duration_seconds", 0),
#             "created_at": str(doc.get("created_at", "")),
#             "completed_at": str(doc.get("completed_at", "")) if doc.get("completed_at") else None,
#         }

#         return APIResponse(
#             message="Interview detail retrieved",
#             data=interview_data,
#         )

#     except HTTPException:
#         raise
#     except Exception as exc:
#         logger.error("[ADMIN] Get interview detail failed | session_id={} | error={}", session_id, exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch interview detail.",
#         )


# # ─────────────────────────────────────────────────────────
# # 8. GET /admin/analytics
# # ─────────────────────────────────────────────────────────
# @router.get(
#     "/analytics",
#     response_model=APIResponse,
#     summary="Admin Analytics Data",
#     description="Chart data for admin analytics page: weekly trends, score trends, role distribution.",
# )
# async def admin_analytics(
#     admin: Dict[str, Any] = Depends(require_admin),
# ) -> APIResponse:
#     """Return chart data for admin analytics page."""
#     logger.info("[ADMIN] GET /admin/analytics | admin={}", admin.get("sub"))

#     try:
#         # ── Daily interviews for the last 7 days ──────────────────────
#         today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
#         week_ago = today - timedelta(days=6)

#         daily_interviews = []
#         daily_users = []
#         day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

#         for i in range(7):
#             day_start = week_ago + timedelta(days=i)
#             day_end = day_start + timedelta(days=1)

#             iv_count = await db.interviews.count_documents({
#                 "created_at": {"$gte": day_start, "$lt": day_end}
#             })
#             u_count = await db.users.count_documents({
#                 "created_at": {"$gte": day_start, "$lt": day_end}
#             })

#             daily_interviews.append({
#                 "day": day_names[day_start.weekday()],
#                 "date": day_start.strftime("%Y-%m-%d"),
#                 "interviews": iv_count,
#                 "users": u_count,
#             })

#         # ── Weekly average scores (last 4 weeks) ─────────────────────
#         score_trend = []
#         for w in range(4, 0, -1):
#             w_start = today - timedelta(weeks=w)
#             w_end = w_start + timedelta(weeks=1)

#             pipeline = [
#                 {"$match": {"created_at": {"$gte": w_start, "$lt": w_end}}},
#                 {"$unwind": {"path": "$answers", "preserveNullAndEmptyArrays": False}},
#                 {"$group": {"_id": None, "avg": {"$avg": "$answers.content_score"}}},
#             ]
#             avg = 0
#             async for result in db.interviews.aggregate(pipeline):
#                 avg = round((result.get("avg", 0) or 0) * 10, 0)

#             score_trend.append({
#                 "week": f"W{5 - w}",
#                 "avg": avg,
#             })

#         # ── Job role distribution ─────────────────────────────────────
#         role_pipeline = [
#             {"$group": {"_id": "$job_role", "count": {"$sum": 1}}},
#             {"$sort": {"count": -1}},
#             {"$limit": 10},
#         ]
#         job_roles = {}
#         async for result in db.interviews.aggregate(role_pipeline):
#             if result.get("_id"):
#                 job_roles[result["_id"]] = result["count"]

#         return APIResponse(
#             message="Analytics data retrieved",
#             data={
#                 "weekly_data": daily_interviews,
#                 "score_trend": score_trend,
#                 "job_roles": job_roles,
#             },
#         )

#     except Exception as exc:
#         logger.error("[ADMIN] Analytics query failed | error={}", exc)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to fetch analytics data.",
#         )








"""
HiLearn AI Interview Prep - Admin Routes
==========================================
GET  /admin/dashboard                →  Platform stats overview
GET  /admin/users                    →  Paginated user list
GET  /admin/users/{user_id}          →  User profile + analytics
PUT  /admin/users/{user_id}          →  Edit user
DELETE /admin/users/{user_id}        →  Soft-delete user
GET  /admin/interviews               →  Paginated interview list
GET  /admin/interviews/{session_id}  →  Full interview detail
GET  /admin/analytics                →  Chart data for analytics page

All endpoints require admin role (403 for non-admins).
"""
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from loguru import logger

from app.core.security import get_current_user
from app.db.database import db
from app.models.schemas import APIResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


# ─────────────────────────────────────────────────────────
# Admin Guard Dependency
# ─────────────────────────────────────────────────────────

async def require_admin(
    user: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    FastAPI dependency that ensures the authenticated user has admin role.
    Returns 403 Forbidden for non-admin users.
    """
    if user.get("role") != "admin":
        logger.warning(
            "[ADMIN] Non-admin access attempt | user_id={} | role={}",
            user.get("sub", "unknown"), user.get("role", "unknown"),
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return user


# ─────────────────────────────────────────────────────────
# 1. GET /admin/dashboard
# ─────────────────────────────────────────────────────────
@router.get(
    "/dashboard",
    response_model=APIResponse,
    summary="Admin Dashboard Stats",
    description="Platform-wide statistics for the admin dashboard.",
)
async def admin_dashboard(
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return total users, interviews, avg score, recent users, recent interviews."""
    logger.info("[ADMIN] GET /admin/dashboard | admin={}", admin.get("sub"))

    try:
        total_users = await db.users.count_documents({})
        total_interviews = await db.interviews.count_documents({})

        # Average user score
        avg_pipeline = [
            {"$match": {"interview_count": {"$gt": 0}}},
            {"$group": {"_id": None, "avg_score": {"$avg": "$average_score"}}},
        ]
        avg_score = 0.0
        async for result in db.users.aggregate(avg_pipeline):
            avg_score = round(result.get("avg_score", 0.0), 1)

        # Recent 5 users
        recent_users = []
        cursor = db.users.find(
            {}, {"password_hash": 0, "hashed_password": 0}
        ).sort("created_at", -1).limit(5)
        async for doc in cursor:
            recent_users.append({
                "name": doc.get("name", ""),
                "email": doc.get("email", ""),
                "role": doc.get("role", "student"),
                "interview_count": doc.get("interview_count", 0),
                "created_at": str(doc.get("created_at", "")),
            })

        # Recent 5 interviews
        recent_interviews = []
        cursor = db.interviews.find({}).sort("created_at", -1).limit(5)
        async for doc in cursor:
            # Look up user name
            user_doc = await db.users.find_one(
                {"_id": doc.get("user_id")}, {"name": 1}
            )
            user_name = user_doc.get("name", "Unknown") if user_doc else "Unknown"

            # Calculate overall score from answers
            answers = doc.get("answers", [])
            scores = [a.get("content_score", 0) for a in answers if a.get("content_score") is not None]
            avg = round(sum(scores) / len(scores) * 10, 0) if scores else 0

            recent_interviews.append({
                "session_id": doc.get("_id", ""),
                "user": user_name,
                "type": doc.get("interview_type", "technical"),
                "score": avg,
                "status": doc.get("status", "active"),
                "date": str(doc.get("created_at", "")),
            })

        return APIResponse(
            message="Dashboard stats retrieved",
            data={
                "total_users": total_users,
                "total_interviews": total_interviews,
                "average_score": avg_score,
                "recent_users": recent_users,
                "recent_interviews": recent_interviews,
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] Dashboard query failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch dashboard stats.",
        )


# ─────────────────────────────────────────────────────────
# 2. GET /admin/users
# ─────────────────────────────────────────────────────────
@router.get(
    "/users",
    response_model=APIResponse,
    summary="List All Users",
    description="Paginated user list with optional search and role filter.",
)
async def list_users(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=100, description="Results per page"),
    search: Optional[str] = Query(default=None, description="Search by name or email"),
    role: Optional[str] = Query(default=None, description="Filter by role: student/admin"),
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return paginated list of users."""
    logger.info(
        "[ADMIN] GET /admin/users | page={} | limit={} | search={} | role={}",
        page, limit, search, role,
    )

    try:
        query: Dict[str, Any] = {}

        if role:
            query["role"] = role

        if search:
            import re
            regex = {"$regex": re.escape(search), "$options": "i"}
            query["$or"] = [{"name": regex}, {"email": regex}]

        skip = (page - 1) * limit
        total = await db.users.count_documents(query)

        users = []
        cursor = db.users.find(
            query, {"password_hash": 0, "hashed_password": 0}
        ).sort("created_at", -1).skip(skip).limit(limit)

        async for doc in cursor:
            users.append({
                "_id": str(doc.get("_id", "")),
                "user_id": str(doc.get("_id", "")),
                "name": doc.get("name", ""),
                "email": doc.get("email", ""),
                "role": doc.get("role", "student"),
                "interview_count": doc.get("interview_count", 0),
                "average_score": doc.get("average_score", 0.0),
                "created_at": str(doc.get("created_at", "")),
                "is_active": doc.get("status", "active") != "deleted",
                "status": doc.get("status", "active"),
                "suspended_at": str(doc.get("suspended_at", "")) if doc.get("suspended_at") else None,
                "suspension_reason": doc.get("suspension_reason", ""),
            })

        return APIResponse(
            message=f"{len(users)} user(s) found",
            data={
                "users": users,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit,
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] List users failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch users.",
        )


# ─────────────────────────────────────────────────────────
# 3. GET /admin/users/{user_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/users/{user_id}",
    response_model=APIResponse,
    summary="Get User Profile + Analytics",
    description="Full user profile with analytics data.",
)
async def get_user_detail(
    user_id: str,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return full user profile with analytics (weak_areas, accuracy_trend, etc.)."""
    logger.info("[ADMIN] GET /admin/users/{} | admin={}", user_id, admin.get("sub"))

    try:
        user_doc = await db.users.find_one(
            {"_id": user_id}, {"password_hash": 0, "hashed_password": 0}
        )
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User '{user_id}' not found.",
            )

        # Fetch analytics
        analytics_doc = await db.analytics.find_one({"_id": user_id})
        analytics = {}
        if analytics_doc:
            analytics = {
                "total_interviews": analytics_doc.get("total_interviews", 0),
                "average_score": analytics_doc.get("average_score", 0.0),
                "accuracy_trend": analytics_doc.get("accuracy_trend", []),
                "weak_areas": analytics_doc.get("weak_areas", []),
                "improvement_rate": analytics_doc.get("improvement_rate", 0.0),
                "last_interview_at": str(analytics_doc.get("last_interview_at", "")),
            }

        user_data = {
            "user_id": str(user_doc.get("_id", "")),
            "name": user_doc.get("name", ""),
            "email": user_doc.get("email", ""),
            "role": user_doc.get("role", "student"),
            "status": user_doc.get("status", "active"),
            "interview_count": user_doc.get("interview_count", 0),
            "average_score": user_doc.get("average_score", 0.0),
            "created_at": str(user_doc.get("created_at", "")),
            "analytics": analytics,
        }

        return APIResponse(
            message="User profile retrieved",
            data=user_data,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Get user detail failed | user_id={} | error={}", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user profile.",
        )


# ─────────────────────────────────────────────────────────
# 4. PUT /admin/users/{user_id}
# ─────────────────────────────────────────────────────────
@router.put(
    "/users/{user_id}",
    response_model=APIResponse,
    summary="Edit User",
    description="Update user fields (name, role, status).",
)
async def update_user(
    user_id: str,
    payload: Dict[str, Any],
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Update user name, role, or status."""
    logger.info(
        "[ADMIN] PUT /admin/users/{} | admin={} | fields={}",
        user_id, admin.get("sub"), list(payload.keys()),
    )

    try:
        # Only allow specific fields to be updated
        allowed_fields = {"name", "role", "status"}
        update_data = {k: v for k, v in payload.items() if k in allowed_fields}

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid fields to update. Allowed: name, role, status.",
            )

        update_data["updated_at"] = datetime.utcnow()

        result = await db.users.update_one(
            {"_id": user_id},
            {"$set": update_data},
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User '{user_id}' not found.",
            )

        # Fetch updated user
        updated_doc = await db.users.find_one(
            {"_id": user_id}, {"password_hash": 0, "hashed_password": 0}
        )

        return APIResponse(
            message="User updated successfully",
            data={
                "user_id": str(updated_doc.get("_id", "")),
                "name": updated_doc.get("name", ""),
                "email": updated_doc.get("email", ""),
                "role": updated_doc.get("role", "student"),
                "status": updated_doc.get("status", "active"),
            },
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Update user failed | user_id={} | error={}", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user.",
        )


# ─────────────────────────────────────────────────────────
# 4a. PATCH /admin/users/{user_id}/suspend
# ─────────────────────────────────────────────────────────
from app.models.schemas import SuspendUserRequest

@router.patch(
    "/users/{user_id}/suspend",
    response_model=APIResponse,
    summary="Suspend User",
    description="Suspend a user account.",
)
async def suspend_user(
    user_id: str,
    payload: SuspendUserRequest,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Set user status to suspended."""
    logger.info("[ADMIN] PATCH /admin/users/{}/suspend | admin={}", user_id, admin.get("sub"))

    try:
        user_doc = await db.users.find_one({"_id": user_id})
        if not user_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")
        
        if user_doc.get("status") == "suspended":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already suspended.")

        update_data = {
            "status": "suspended",
            "suspended_at": datetime.utcnow(),
            "suspension_reason": payload.reason or "",
            "updated_at": datetime.utcnow()
        }

        await db.users.update_one({"_id": user_id}, {"$set": update_data})

        return APIResponse(
            message="User suspended successfully",
            data={
                "user_id": user_id,
                "email": user_doc.get("email"),
                "status": "suspended",
                "suspended_at": str(update_data["suspended_at"]),
                "suspension_reason": update_data["suspension_reason"]
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Suspend user failed | user_id={} | error={}", user_id, exc)
        raise HTTPException(status_code=500, detail="Failed to suspend user.")


# ─────────────────────────────────────────────────────────
# 4b. PATCH /admin/users/{user_id}/activate
# ─────────────────────────────────────────────────────────
@router.patch(
    "/users/{user_id}/activate",
    response_model=APIResponse,
    summary="Activate User",
    description="Reactivate a suspended user account.",
)
async def activate_user(
    user_id: str,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Set user status to active."""
    logger.info("[ADMIN] PATCH /admin/users/{}/activate | admin={}", user_id, admin.get("sub"))

    try:
        user_doc = await db.users.find_one({"_id": user_id})
        if not user_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User '{user_id}' not found.")
        
        if user_doc.get("status") == "active":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already active.")

        update_data = {
            "status": "active",
            "suspended_at": None,
            "suspension_reason": None,
            "updated_at": datetime.utcnow()
        }

        await db.users.update_one({"_id": user_id}, {"$set": update_data})

        return APIResponse(
            message="User activated successfully",
            data={
                "user_id": user_id,
                "email": user_doc.get("email"),
                "status": "active"
            }
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Activate user failed | user_id={} | error={}", user_id, exc)
        raise HTTPException(status_code=500, detail="Failed to activate user.")


# ─────────────────────────────────────────────────────────
# 5. DELETE /admin/users/{user_id}
# ─────────────────────────────────────────────────────────
@router.delete(
    "/users/{user_id}",
    response_model=APIResponse,
    summary="Permanently Delete User",
    description="Permanently removes user and all their interview data from MongoDB.",
)
async def delete_user(
    user_id: str,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Hard-delete: permanently remove user + their interviews from MongoDB."""
    logger.info("[ADMIN] DELETE /admin/users/{} | admin={}", user_id, admin.get("sub"))

    try:
        # Check user exists first
        user_doc = await db.users.find_one({"_id": user_id})
        if not user_doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User '{user_id}' not found.",
            )

        # Delete all interviews belonging to this user
        interviews_result = await db.interviews.delete_many({"user_id": user_id})
        logger.info(
            "[ADMIN] Deleted {} interview(s) for user_id={}",
            interviews_result.deleted_count, user_id,
        )

        # Permanently delete the user from MongoDB
        await db.users.delete_one({"_id": user_id})

        logger.info("[ADMIN] User permanently deleted | user_id={}", user_id)
        return APIResponse(
            message="User and all associated data permanently deleted.",
            data={"interviews_removed": interviews_result.deleted_count},
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Delete user failed | user_id={} | error={}", user_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user.",
        )


# ─────────────────────────────────────────────────────────
# 6. GET /admin/interviews
# ─────────────────────────────────────────────────────────
@router.get(
    "/interviews",
    response_model=APIResponse,
    summary="List All Interviews",
    description="Paginated interview list with optional filters.",
)
async def list_interviews(
    page: int = Query(default=1, ge=1, description="Page number"),
    limit: int = Query(default=10, ge=1, le=100, description="Results per page"),
    user_id: Optional[str] = Query(default=None, description="Filter by user_id"),
    interview_status: Optional[str] = Query(default=None, alias="status", description="Filter by status"),
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return paginated list of interviews."""
    logger.info(
        "[ADMIN] GET /admin/interviews | page={} | limit={} | user_id={} | status={}",
        page, limit, user_id, interview_status,
    )

    try:
        query: Dict[str, Any] = {}
        if user_id:
            query["user_id"] = user_id
        if interview_status:
            query["status"] = interview_status

        skip = (page - 1) * limit
        total = await db.interviews.count_documents(query)

        interviews = []
        pipeline = [
            {"$match": query},
            {"$sort": {"created_at": -1}},
            {"$skip": skip},
            {"$limit": limit},
            {
                "$lookup": {
                    "from": "users",
                    "let": {"uid": "$user_id"},
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
            }
        ]
        cursor = db.interviews.aggregate(pipeline)

        async for doc in cursor:
            # Get user name from joined data
            user_info = doc.get("user_info", {})
            user_name = user_info.get("name", "Unknown") if isinstance(user_info, dict) else "Unknown"

            # Calculate score
            answers = doc.get("answers", [])
            scores = [a.get("content_score", 0) for a in answers if a.get("content_score") is not None]
            avg = round(sum(scores) / len(scores) * 10, 0) if scores else 0

            interviews.append({
                "id": str(doc.get("_id", "")),
                "session_id": str(doc.get("_id", "")),
                "user_id": doc.get("user_id", ""),
                "user": user_name,
                "type": doc.get("interview_type", "technical"),
                "job_role": doc.get("job_role", ""),
                "difficulty": doc.get("difficulty", "intermediate"),
                "score": avg,
                "status": doc.get("status", "active"),
                "date": str(doc.get("created_at", "")),
                "duration_seconds": doc.get("duration_seconds", 0),
                "questions_count": len(doc.get("questions", [])),
                "answers_count": len(answers),
            })

        return APIResponse(
            message=f"{len(interviews)} interview(s) found",
            data={
                "interviews": interviews,
                "total": total,
                "page": page,
                "limit": limit,
                "total_pages": (total + limit - 1) // limit,
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] List interviews failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch interviews.",
        )


# ─────────────────────────────────────────────────────────
# 7. GET /admin/interviews/{session_id}
# ─────────────────────────────────────────────────────────
@router.get(
    "/interviews/{session_id}",
    response_model=APIResponse,
    summary="Get Interview Detail",
    description="Full interview with all answers and feedback.",
)
async def get_interview_detail(
    session_id: str,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return full interview detail including answers and feedback."""
    logger.info("[ADMIN] GET /admin/interviews/{} | admin={}", session_id, admin.get("sub"))

    try:
        doc = await db.interviews.find_one({"_id": session_id})
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Interview '{session_id}' not found.",
            )

        # Look up user info
        u_doc = await db.users.find_one(
            {"_id": doc.get("user_id")}, {"name": 1, "email": 1}
        )

        # Get feedback for this interview
        feedback_list = []
        cursor = db.feedback.find({"interview_id": session_id}).sort("created_at", 1)
        async for fb in cursor:
            feedback_list.append({
                "question_id": fb.get("question_id", ""),
                "content_score": fb.get("content_score", 0),
                "communication_score": fb.get("communication_score", 0),
                "overall_score": fb.get("overall_score", 0),
                "suggestions": fb.get("suggestions", []),
            })

        # Serialize answers
        answers = []
        for a in doc.get("answers", []):
            answers.append({
                "question_id": a.get("question_id", ""),
                "answer_text": a.get("answer_text", ""),
                "content_score": a.get("content_score"),
                "feedback": a.get("feedback", ""),
                "submitted_at": str(a.get("submitted_at", "")),
            })

        interview_data = {
            "session_id": str(doc.get("_id", "")),
            "user_id": doc.get("user_id", ""),
            "user_name": u_doc.get("name", "Unknown") if u_doc else "Unknown",
            "user_email": u_doc.get("email", "") if u_doc else "",
            "interview_type": doc.get("interview_type", "technical"),
            "job_role": doc.get("job_role", ""),
            "difficulty": doc.get("difficulty", "intermediate"),
            "status": doc.get("status", "active"),
            "questions": doc.get("questions", []),
            "answers": answers,
            "feedback": feedback_list,
            "duration_seconds": doc.get("duration_seconds", 0),
            "created_at": str(doc.get("created_at", "")),
            "completed_at": str(doc.get("completed_at", "")) if doc.get("completed_at") else None,
        }

        return APIResponse(
            message="Interview detail retrieved",
            data=interview_data,
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Get interview detail failed | session_id={} | error={}", session_id, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch interview detail.",
        )


# ─────────────────────────────────────────────────────────
# 8. GET /admin/analytics
# ─────────────────────────────────────────────────────────
@router.get(
    "/analytics",
    response_model=APIResponse,
    summary="Admin Analytics Data",
    description="Chart data for admin analytics page: weekly trends, score trends, role distribution.",
)
async def admin_analytics(
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return chart data for admin analytics page."""
    logger.info("[ADMIN] GET /admin/analytics | admin={}", admin.get("sub"))

    try:
        # ── Daily interviews for the last 7 days ──────────────────────
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        week_ago = today - timedelta(days=6)

        daily_interviews = []
        daily_users = []
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

        for i in range(7):
            day_start = week_ago + timedelta(days=i)
            day_end = day_start + timedelta(days=1)

            iv_count = await db.interviews.count_documents({
                "created_at": {"$gte": day_start, "$lt": day_end}
            })
            u_count = await db.users.count_documents({
                "created_at": {"$gte": day_start, "$lt": day_end}
            })

            daily_interviews.append({
                "day": day_names[day_start.weekday()],
                "date": day_start.strftime("%Y-%m-%d"),
                "interviews": iv_count,
                "users": u_count,
            })

        # ── Weekly average scores (last 4 weeks) ─────────────────────
        score_trend = []
        for w in range(4, 0, -1):
            w_start = today - timedelta(weeks=w)
            w_end = w_start + timedelta(weeks=1)

            pipeline = [
                {"$match": {"created_at": {"$gte": w_start, "$lt": w_end}}},
                {"$unwind": {"path": "$answers", "preserveNullAndEmptyArrays": False}},
                {"$group": {"_id": None, "avg": {"$avg": "$answers.content_score"}}},
            ]
            avg = 0
            async for result in db.interviews.aggregate(pipeline):
                avg = round((result.get("avg", 0) or 0) * 10, 0)

            score_trend.append({
                "week": f"W{5 - w}",
                "avg": avg,
            })

        # ── Job role distribution ─────────────────────────────────────
        role_pipeline = [
            {"$group": {"_id": "$job_role", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10},
        ]
        job_roles = {}
        async for result in db.interviews.aggregate(role_pipeline):
            if result.get("_id"):
                job_roles[result["_id"]] = result["count"]

        return APIResponse(
            message="Analytics data retrieved",
            data={
                "weekly_data": daily_interviews,
                "score_trend": score_trend,
                "job_roles": job_roles,
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] Analytics query failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch analytics data.",
        )


# ─────────────────────────────────────────────────────────
# 9. POST /admin/users  (Admin se directly user add karo)
# ─────────────────────────────────────────────────────────
from pydantic import BaseModel as _BaseModel, Field as _Field
from typing import Optional as _Optional

class AdminCreateUserRequest(_BaseModel):
    name: str = _Field(..., min_length=1, max_length=100)
    email: str = _Field(..., min_length=3, max_length=200)
    password: str = _Field(..., min_length=8, max_length=128)
    role: str = _Field(default="student")

@router.post(
    "/users",
    response_model=APIResponse,
    status_code=201,
    summary="Admin: Create User",
    description="Admin panel se directly naya user create karo. User in credentials se login kar sakta hai.",
)
async def admin_create_user(
    payload: AdminCreateUserRequest,
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Admin creates a new user directly without email verification."""
    from app.services.auth_service import auth_service
    from app.models.schemas import SignupRequest
    import re

    logger.info("[ADMIN] POST /admin/users | admin={} | new_email={}", admin.get("sub"), payload.email)

    email = payload.email.lower().strip()

    # Basic email validation
    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        raise HTTPException(status_code=400, detail="Invalid email format.")

    # Check if email already exists
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="Is email se account pehle se exist karta hai.")

    # Validate role
    if payload.role not in ("student", "admin"):
        raise HTTPException(status_code=400, detail="Role 'student' ya 'admin' hona chahiye.")

    try:
        # Use auth_service signup - it handles hashing etc
        signup_req = SignupRequest(name=payload.name, email=email, password=payload.password)
        result = await auth_service.signup(signup_req)

        # Update role if admin was requested
        if payload.role == "admin":
            await db.users.update_one(
                {"email": email},
                {"$set": {"role": "admin"}}
            )

        logger.info("[ADMIN] User created | email={} | role={}", email, payload.role)
        return APIResponse(
            message="User successfully created.",
            data={
                "user_id": result.user_id,
                "email": email,
                "name": payload.name,
                "role": payload.role,
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[ADMIN] Create user failed | error={}", exc)
        raise HTTPException(status_code=500, detail="User create nahi ho saka.")


# ─────────────────────────────────────────────────────────
# GET /admin/real-analytics — Enhanced Analytics
# ─────────────────────────────────────────────────────────
@router.get(
    "/real-analytics",
    response_model=APIResponse,
    summary="Real Platform Analytics",
    description="Real-time analytics: DAU, popular roles, session duration, daily trends, platform stats.",
)
async def real_analytics(
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Return comprehensive real-time analytics data for the admin dashboard."""
    logger.info("[ADMIN] GET /admin/real-analytics | admin={}", admin.get("sub"))

    try:
        from app.services.database import db_service

        daily_active_users = await db_service.get_daily_active_users(days=7)
        popular_roles = await db_service.get_popular_job_roles(days=30)
        avg_session_duration = await db_service.get_average_session_duration()
        new_users_today = await db_service.get_new_users_today()
        daily_interviews = await db_service.get_daily_interview_count(days=7)
        platform_stats = await db_service.get_platform_statistics()

        return APIResponse(
            message="Real analytics retrieved",
            data={
                "daily_active_users": daily_active_users,
                "popular_roles": popular_roles,
                "avg_session_duration": avg_session_duration,
                "new_users_today": new_users_today,
                "daily_interviews": daily_interviews,
                "platform_stats": platform_stats,
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] Real analytics query failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch real analytics data.",
        )


# ─────────────────────────────────────────────────────────
# POST /admin/notifications/send-reminders
# ─────────────────────────────────────────────────────────
@router.post(
    "/notifications/send-reminders",
    response_model=APIResponse,
    summary="Manually Trigger Reminder Emails",
    description="Admin-only: manually trigger practice reminder emails for inactive users.",
)
async def send_reminders(
    admin: Dict[str, Any] = Depends(require_admin),
) -> APIResponse:
    """Manually trigger reminder emails for inactive users."""
    logger.info("[ADMIN] POST /admin/notifications/send-reminders | admin={}", admin.get("sub"))

    try:
        from app.tasks.scheduled_tasks import check_inactive_users

        result = await check_inactive_users()
        return APIResponse(
            message=result.get("message", "Reminders processed"),
            data={
                "emails_sent": result.get("sent", 0),
                "errors": result.get("errors", 0),
            },
        )

    except Exception as exc:
        logger.error("[ADMIN] Send reminders failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send reminder emails.",
        )