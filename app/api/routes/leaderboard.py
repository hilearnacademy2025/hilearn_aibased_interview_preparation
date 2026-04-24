"""
HiLearn AI Interview Prep - Leaderboard Routes
=================================================
GET  /leaderboard          -> Top 5 users (global / by role / weekly)
GET  /leaderboard/my-rank  -> Current user's rank & percentile
"""
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from loguru import logger

from app.core.security import get_current_user
from app.services.database import db_service

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


# ─────────────────────────────────────────────────────────────────────────────
# GET /leaderboard
# ─────────────────────────────────────────────────────────────────────────────

@router.get("")
async def get_leaderboard(
    role: Optional[str] = Query(None, description="Filter by job role (e.g. 'backend', 'frontend', 'devops')"),
    timeframe: Optional[str] = Query(None, description="'weekly' for last-7-day leaderboard"),
    limit: int = Query(5, ge=1, le=20, description="Number of top users to return"),
):
    """
    Return the top N users ranked by average interview score.

    - **No filters** → global leaderboard (all time, all roles)
    - **role=backend** → top 5 among users whose most-recent job_role contains 'backend'
    - **timeframe=weekly** → top 5 from interviews completed in the last 7 days
    """
    try:
        if timeframe and timeframe.lower() == "weekly":
            users = await db_service.get_weekly_leaderboard(limit=limit, role=role)
        else:
            users = await db_service.get_leaderboard(limit=limit, role=role)

        total_users = await db_service.get_total_user_count()

        return {
            "success": True,
            "users": users,
            "total_users": total_users,
            "filters": {
                "role": role,
                "timeframe": timeframe or "all_time",
                "limit": limit,
            },
        }

    except Exception as exc:
        logger.error("[LEADERBOARD] get_leaderboard failed | error={}", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch leaderboard data.",
        )


# ─────────────────────────────────────────────────────────────────────────────
# GET /leaderboard/my-rank
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/my-rank")
async def get_my_rank(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """
    Return the authenticated user's global rank, score, and percentile.
    """
    try:
        user_id = current_user.get("user_id") or current_user.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not determine user identity.",
            )

        rank_data = await db_service.get_user_rank(user_id)

        if not rank_data:
            return {
                "success": True,
                "rank": None,
                "score": 0,
                "interviews_completed": 0,
                "total_users": await db_service.get_total_user_count(),
                "percentile": 0,
                "message": "Complete an interview to appear on the leaderboard.",
            }

        return {
            "success": True,
            **rank_data,
        }

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("[LEADERBOARD] get_my_rank failed | user={} | error={}", current_user, exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch your rank.",
        )
