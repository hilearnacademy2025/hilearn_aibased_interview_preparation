"""
HiLearn AI Interview Prep - Scheduled Tasks
==============================================
Background tasks that run on a schedule using APScheduler.

Tasks:
- check_inactive_users(): Daily at 9 AM — sends practice reminders
"""
import asyncio
from datetime import datetime, timedelta
from typing import Any, Dict

from loguru import logger


async def check_inactive_users() -> Dict[str, Any]:
    """
    Check for users who haven't practiced in 3+ days and send reminder emails.

    Queries users where last_interview_date < today - 3 days.
    Calls email_service.send_practice_reminder() for each.

    Returns:
        Dict with count of emails sent and any errors.
    """
    logger.info("[SCHEDULER] Running check_inactive_users task...")

    sent_count = 0
    error_count = 0

    try:
        from app.services.database import db_service
        from app.services.email_service import email_service

        if not db_service.is_connected:
            logger.warning("[SCHEDULER] MongoDB not connected — skipping inactive user check")
            return {"sent": 0, "errors": 0, "message": "Database not connected"}

        db = db_service._get_db()
        if db is None:
            return {"sent": 0, "errors": 0, "message": "Database not available"}

        # Find users who haven't interviewed in 3+ days
        three_days_ago = datetime.utcnow() - timedelta(days=3)

        # Get users with interviews, check their last activity
        pipeline = [
            {"$match": {"status": {"$ne": "deleted"}}},
            {
                "$lookup": {
                    "from": "interviews",
                    "localField": "_id",
                    "foreignField": "user_id",
                    "as": "interviews",
                }
            },
            {
                "$addFields": {
                    "last_interview_date": {
                        "$max": "$interviews.created_at"
                    },
                    "has_interviews": {
                        "$gt": [{"$size": "$interviews"}, 0]
                    },
                }
            },
            {
                "$match": {
                    "has_interviews": True,
                    "last_interview_date": {"$lt": three_days_ago},
                }
            },
            {
                "$project": {
                    "name": 1,
                    "email": 1,
                    "last_interview_date": 1,
                }
            },
            {"$limit": 100},  # Safety limit
        ]

        async for user_doc in db.users.aggregate(pipeline):
            user_id = str(user_doc.get("_id", ""))
            email = user_doc.get("email", "")
            last_date = user_doc.get("last_interview_date")

            if not email:
                continue

            days_since = (datetime.utcnow() - last_date).days if last_date else 0

            try:
                result = await email_service.send_practice_reminder(
                    user_id=user_id,
                    days_since_last_interview=days_since,
                )
                if result.get("success"):
                    sent_count += 1
                    logger.info(
                        "[SCHEDULER] Reminder sent | user_id={} | days_inactive={}",
                        user_id, days_since,
                    )
                else:
                    error_count += 1
            except Exception as exc:
                error_count += 1
                logger.error(
                    "[SCHEDULER] Failed to send reminder | user_id={} | error={}",
                    user_id, exc,
                )

        logger.success(
            "[SCHEDULER] check_inactive_users complete | sent={} | errors={}",
            sent_count, error_count,
        )

    except Exception as exc:
        logger.error("[SCHEDULER] check_inactive_users failed | error={}", exc)
        return {"sent": sent_count, "errors": error_count + 1, "message": str(exc)}

    return {
        "sent": sent_count,
        "errors": error_count,
        "message": f"Sent {sent_count} reminder(s), {error_count} error(s)",
    }


def run_check_inactive_users():
    """
    Synchronous wrapper for the async check_inactive_users task.
    Required because APScheduler calls sync functions by default.
    """
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If there's already a running loop (FastAPI), create a task
            asyncio.ensure_future(check_inactive_users())
        else:
            loop.run_until_complete(check_inactive_users())
    except RuntimeError:
        # No event loop — create a new one
        asyncio.run(check_inactive_users())
