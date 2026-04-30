"""
HiLearn AI Interview Prep - Email Service
============================================
Send formatted interview results via email using SMTP.
Supports both regular interview and MCQ session results.

Uses Python's built-in smtplib + email.mime — no extra dependencies.
"""
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Dict, List, Optional

from loguru import logger

from app.core.config import get_settings

settings = get_settings()


# ─────────────────────────────────────────────────────────
# Email Service
# ─────────────────────────────────────────────────────────

class EmailService:
    """
    Send formatted HTML emails for interview results.

    Usage::

        from app.services.email_service import email_service
        await email_service.send_results_email(session_id)
    """

    def _build_results_html(
        self,
        user_name: str,
        interview_type: str,
        job_role: str,
        difficulty: str,
        overall_score: float,
        max_score: float,
        created_at: str,
        completed_at: str,
        answers: List[Dict[str, Any]],
        mcq_answers: List[Dict[str, Any]],
        mcq_questions: List[Dict[str, Any]],
        weak_areas: List[str],
        feedback_list: List[Dict[str, Any]],
    ) -> str:
        """Build a premium HTML email template for interview results."""

        score_pct = round((overall_score / max(max_score, 1)) * 100, 1)
        score_color = "#22c55e" if score_pct >= 70 else "#f59e0b" if score_pct >= 40 else "#ef4444"

        # Build feedback rows
        feedback_rows = ""
        for i, fb in enumerate(feedback_list, 1):
            feedback_rows += f"""
            <tr>
                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;color:#5c5a57;font-size:14px;">Q{i}</td>
                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;color:#0f1f3d;font-size:14px;">{fb.get('content_score', 0)}/10</td>
                <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;color:#5c5a57;font-size:14px;">{fb.get('feedback', 'N/A')}</td>
            </tr>"""

        # Build MCQ results section
        mcq_section = ""
        if mcq_answers:
            mcq_rows = ""
            # Build a lookup from question_id to question data
            q_lookup = {}
            for q in mcq_questions:
                qid = q.get("question_id", "")
                q_lookup[qid] = q

            for i, ma in enumerate(mcq_answers, 1):
                qid = ma.get("question_id", "")
                q_data = q_lookup.get(qid, {})
                is_correct = ma.get("is_correct", False)
                icon = "✅" if is_correct else "❌"
                correct_ans = ma.get("correct_answer", "?")
                user_ans = ma.get("user_answer", "?")
                explanation = q_data.get("explanation", ma.get("explanation", ""))
                question_text = q_data.get("question_text", f"Question {i}")

                mcq_rows += f"""
                <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;font-size:13px;color:#0f1f3d;">
                        <strong>Q{i}.</strong> {question_text[:80]}{'...' if len(question_text) > 80 else ''}
                    </td>
                    <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;text-align:center;font-size:14px;">
                        {icon} {user_ans}
                    </td>
                    <td style="padding:12px 16px;border-bottom:1px solid #f0ebe3;text-align:center;font-size:14px;font-weight:bold;color:#22c55e;">
                        {correct_ans}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="padding:8px 16px 16px;border-bottom:2px solid #f0ebe3;font-size:12px;color:#9c9a96;">
                        💡 {explanation}
                    </td>
                </tr>"""

            correct_count = sum(1 for a in mcq_answers if a.get("is_correct", False))
            total_mcq = len(mcq_answers)
            mcq_section = f"""
            <div style="margin-top:32px;">
                <h2 style="color:#0f1f3d;font-size:20px;margin-bottom:16px;">📝 MCQ Results ({correct_count}/{total_mcq} correct)</h2>
                <table style="width:100%;border-collapse:collapse;background:#fffaf4;border-radius:12px;overflow:hidden;">
                    <thead>
                        <tr style="background:#0f1f3d;color:white;">
                            <th style="padding:12px 16px;text-align:left;font-size:13px;">Question</th>
                            <th style="padding:12px 16px;text-align:center;font-size:13px;">Your Answer</th>
                            <th style="padding:12px 16px;text-align:center;font-size:13px;">Correct</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mcq_rows}
                    </tbody>
                </table>
            </div>"""

        # Build weak areas section
        weak_areas_html = ""
        if weak_areas:
            items = "".join(f'<li style="padding:4px 0;color:#5c5a57;">{area}</li>' for area in weak_areas)
            weak_areas_html = f"""
            <div style="margin-top:24px;padding:20px;background:#fff5f5;border-radius:12px;border:1px solid #fecaca;">
                <h3 style="color:#ef4444;font-size:16px;margin-bottom:8px;">⚠️ Areas for Improvement</h3>
                <ul style="margin:0;padding-left:20px;font-size:14px;">{items}</ul>
            </div>"""

        html = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                
                <!-- Header -->
                <div style="background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6b 100%);border-radius:20px;padding:32px;text-align:center;margin-bottom:24px;">
                    <h1 style="color:white;font-size:28px;margin:0;">🎯 HiLearn Interview Results</h1>
                    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:8px;">Your performance summary</p>
                </div>

                <!-- Score Card -->
                <div style="background:white;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <div style="text-align:center;margin-bottom:24px;">
                        <div style="display:inline-block;width:120px;height:120px;border-radius:50%;background:conic-gradient({score_color} {score_pct}%, #f0ebe3 {score_pct}%);padding:12px;">
                            <div style="width:96px;height:96px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;">
                                <span style="font-size:32px;font-weight:bold;color:{score_color};">{overall_score}</span>
                            </div>
                        </div>
                        <p style="color:#9c9a96;font-size:14px;margin-top:12px;">Overall Score</p>
                    </div>

                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="padding:8px 0;color:#9c9a96;font-size:13px;">Candidate</td>
                            <td style="padding:8px 0;color:#0f1f3d;font-size:13px;text-align:right;font-weight:600;">{user_name}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9c9a96;font-size:13px;">Interview Type</td>
                            <td style="padding:8px 0;color:#0f1f3d;font-size:13px;text-align:right;font-weight:600;">{interview_type.title()}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9c9a96;font-size:13px;">Job Role</td>
                            <td style="padding:8px 0;color:#0f1f3d;font-size:13px;text-align:right;font-weight:600;">{job_role}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9c9a96;font-size:13px;">Difficulty</td>
                            <td style="padding:8px 0;color:#0f1f3d;font-size:13px;text-align:right;font-weight:600;">{difficulty.title()}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 0;color:#9c9a96;font-size:13px;">Date</td>
                            <td style="padding:8px 0;color:#0f1f3d;font-size:13px;text-align:right;font-weight:600;">{created_at}</td>
                        </tr>
                    </table>
                </div>

                <!-- Feedback Table -->
                {"" if not feedback_rows else f'''
                <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <h2 style="color:#0f1f3d;font-size:20px;margin-bottom:16px;">📋 Question-wise Feedback</h2>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f4f2ee;">
                                <th style="padding:10px 16px;text-align:left;font-size:13px;color:#9c9a96;">#</th>
                                <th style="padding:10px 16px;text-align:left;font-size:13px;color:#9c9a96;">Score</th>
                                <th style="padding:10px 16px;text-align:left;font-size:13px;color:#9c9a96;">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>{feedback_rows}</tbody>
                    </table>
                </div>
                '''}

                <!-- MCQ Section -->
                {"" if not mcq_section else f'<div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">{mcq_section}</div>'}

                <!-- Weak Areas -->
                {weak_areas_html}

                <!-- Recommendations -->
                <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                    <h2 style="color:#0f1f3d;font-size:20px;margin-bottom:16px;">📚 Recommendations</h2>
                    <ul style="margin:0;padding-left:20px;font-size:14px;color:#5c5a57;">
                        <li style="padding:6px 0;">Practice with STAR method for behavioral questions</li>
                        <li style="padding:6px 0;">Focus on system design fundamentals</li>
                        <li style="padding:6px 0;">Review data structures and algorithms</li>
                    </ul>
                    <a href="https://hilearn.in/courses" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c8601a;color:white;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                        📖 Browse HiLearn Courses
                    </a>
                </div>

                <!-- Footer -->
                <div style="text-align:center;padding:24px;color:#9c9a96;font-size:12px;">
                    <p>Sent by HiLearn AI Interview Prep</p>
                    <p style="margin-top:4px;">© {datetime.now().year} HiLearn Academy. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html

    async def send_results_email(self, session_id: str) -> Dict[str, Any]:
        """
        Generate and send interview results email.

        Args:
            session_id: The interview session ID.

        Returns:
            Dict with success status and message.
        """
        try:
            from app.services.database import db_service
            from app.services.interview_service import _session_store

            # 1. Get interview data
            interview = None
            session = _session_store.get(session_id)

            if db_service.is_connected:
                interview = await db_service.get_interview(session_id)

            if not interview and not session:
                return {"success": False, "message": f"Session '{session_id}' not found."}

            # Extract data from either DB or in-memory
            if interview:
                user_id = interview.user_id
                interview_type = interview.interview_type.value if hasattr(interview.interview_type, 'value') else str(interview.interview_type)
                job_role = interview.job_role
                difficulty = interview.difficulty.value if hasattr(interview.difficulty, 'value') else str(interview.difficulty)
                created_at = str(interview.created_at) if interview.created_at else "N/A"
                completed_at = str(interview.completed_at) if interview.completed_at else "N/A"
                answers = [a.model_dump() if hasattr(a, 'model_dump') else a for a in interview.answers]
                mcq_answers = interview.mcq_answers or []
                mcq_questions = interview.mcq_questions or []
            else:
                user_id = session.get("user_id", "")
                it = session.get("interview_type", "technical")
                interview_type = it.value if hasattr(it, 'value') else str(it)
                job_role = session.get("job_role", "N/A")
                diff = session.get("difficulty", "intermediate")
                difficulty = diff.value if hasattr(diff, 'value') else str(diff)
                created_at = str(session.get("started_at", "N/A"))
                completed_at = "N/A"
                answers = session.get("answers", [])
                mcq_answers = session.get("mcq_answers", [])
                mcq_questions = session.get("mcq_questions", [])

            # 2. Get user email
            user_doc = None
            user_name = "Candidate"
            user_email = None

            if db_service.is_connected:
                user_doc = await db_service.get_user_by_id(user_id)
                if user_doc:
                    user_email = user_doc.email
                    user_name = user_doc.name

            if not user_email:
                return {"success": False, "message": "User email not found. Cannot send results."}

            # 3. Get feedback data
            feedback_list = []
            weak_areas = []
            if db_service.is_connected:
                feedbacks = await db_service.get_feedback_for_interview(session_id)
                for fb in feedbacks:
                    feedback_list.append({
                        "content_score": fb.content_score,
                        "feedback": ", ".join(fb.suggestions) if fb.suggestions else "Good attempt.",
                    })
                    if fb.overall_score < 5:
                        weak_areas.append(f"Question scoring {fb.overall_score}/10 — needs practice")

            # 4. Calculate overall score
            if mcq_answers:
                total_score = sum(a.get("score", 0) for a in mcq_answers)
                max_score = len(mcq_answers) * 10
                overall_score = round(total_score / max(max_score, 1) * 10, 1)
            elif answers:
                scores = [a.get("content_score", a.get("overall_score", 0)) for a in answers]
                overall_score = round(sum(scores) / max(len(scores), 1), 1)
                max_score = 10
            else:
                overall_score = 0
                max_score = 10

            # 5. Build HTML
            html = self._build_results_html(
                user_name=user_name,
                interview_type=interview_type,
                job_role=job_role,
                difficulty=difficulty,
                overall_score=overall_score,
                max_score=max_score,
                created_at=created_at,
                completed_at=completed_at,
                answers=answers,
                mcq_answers=mcq_answers,
                mcq_questions=mcq_questions,
                weak_areas=weak_areas,
                feedback_list=feedback_list,
            )

            # 6. Send email
            subject = f"🎯 HiLearn Interview Results — {interview_type.title()} ({job_role})"
            sent = self._send_smtp_email(
                to_email=user_email,
                subject=subject,
                html_body=html,
            )

            if sent:
                logger.success("[EMAIL] Results sent | session={} | to={}", session_id, user_email)
                return {"success": True, "message": f"Results sent to {user_email}"}
            else:
                return {"success": False, "message": "Failed to send email. Check SMTP configuration."}

        except Exception as exc:
            logger.error("[EMAIL] send_results_email failed | session={} | error={}", session_id, exc)
            return {"success": False, "message": f"Email sending failed: {str(exc)}"}

    def _send_smtp_email(self, to_email: str, subject: str, html_body: str) -> bool:
        """
        Send an HTML email via SMTP.

        Args:
            to_email: Recipient email address.
            subject: Email subject line.
            html_body: HTML content of the email.

        Returns:
            True if sent successfully, False otherwise.
        """
        if not settings.smtp_user or not settings.smtp_password:
            logger.warning("[EMAIL] SMTP credentials not configured — skipping email send")
            # In dev mode, log success anyway so the flow works
            logger.info("[EMAIL] (DEV MODE) Would have sent email to {} with subject: {}", to_email, subject)
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = settings.smtp_from_email
            msg["To"] = to_email
            msg["Subject"] = subject

            # Plain text fallback
            text_part = MIMEText("Your interview results are ready. View this email in an HTML-capable client.", "plain")
            html_part = MIMEText(html_body, "html")

            msg.attach(text_part)
            msg.attach(html_part)

            if settings.smtp_use_tls:
                server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port)

            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from_email, to_email, msg.as_string())
            server.quit()

            logger.info("[EMAIL] SMTP sent successfully | to={}", to_email)
            return True

        except Exception as exc:
            logger.error("[EMAIL] SMTP send failed | to={} | error={}", to_email, exc)
            return False

    async def send_practice_reminder(self, user_id: str, days_since_last_interview: int = 3) -> Dict[str, Any]:
        """
        Send a practice reminder email to an inactive user.

        Args:
            user_id: The user's unique identifier.
            days_since_last_interview: Number of days since last practice.

        Returns:
            Dict with success status and message.
        """
        try:
            from app.services.database import db_service

            if not db_service.is_connected:
                return {"success": False, "message": "Database not connected"}

            user_doc = await db_service.get_user_by_id(user_id)
            if not user_doc or not user_doc.email:
                return {"success": False, "message": "User email not found"}

            user_name = user_doc.name or "Student"
            user_email = user_doc.email

            html = f"""
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">

                    <!-- Header -->
                    <div style="background:linear-gradient(135deg,#0f1f3d 0%,#1a3a6b 100%);border-radius:20px;padding:32px;text-align:center;margin-bottom:24px;">
                        <h1 style="color:white;font-size:28px;margin:0;">👋 We miss you, {user_name}!</h1>
                        <p style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:8px;">
                            You haven't practiced in {days_since_last_interview} days
                        </p>
                    </div>

                    <!-- Content -->
                    <div style="background:white;border-radius:16px;padding:32px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                        <p style="font-size:16px;color:#0f1f3d;font-weight:600;margin:0 0 12px;">
                            Come back and ace your next interview! 🎯
                        </p>
                        <p style="font-size:14px;color:#5c5a57;line-height:1.6;margin:0 0 20px;">
                            Consistent practice is key to interview success. Your last session was
                            <strong>{days_since_last_interview} days ago</strong>. Even a quick 10-minute
                            mock interview can sharpen your skills significantly.
                        </p>

                        <div style="padding:16px;background:#f9f7f4;border-radius:12px;border:1px solid #f0ede9;margin-bottom:20px;">
                            <p style="font-size:13px;color:#5c5a57;margin:0;line-height:1.6;">
                                💡 <strong>Quick tip:</strong> Students who practice at least 3 times per week
                                score 40% higher in real interviews.
                            </p>
                        </div>

                        <a href="https://hilearn.in/user/interview-setup"
                           style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#c8601a,#e07030);color:white;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 6px 20px rgba(200,96,26,0.35);">
                            🎤 Start a Mock Interview
                        </a>
                    </div>

                    <!-- Stats reminder -->
                    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
                        <h3 style="color:#0f1f3d;font-size:16px;margin:0 0 12px;">What you can practice:</h3>
                        <ul style="margin:0;padding-left:20px;font-size:14px;color:#5c5a57;">
                            <li style="padding:4px 0;">Technical interviews (DSA, System Design)</li>
                            <li style="padding:4px 0;">Behavioral interviews (STAR method)</li>
                            <li style="padding:4px 0;">HR rounds (Salary negotiation, Culture fit)</li>
                            <li style="padding:4px 0;">MCQ quizzes with instant feedback</li>
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div style="text-align:center;padding:24px;color:#9c9a96;font-size:12px;">
                        <p>Sent by HiLearn AI Interview Prep</p>
                        <p style="margin-top:4px;">© {datetime.now().year} HiLearn Academy. All rights reserved.</p>
                        <p style="margin-top:8px;">
                            <a href="https://hilearn.in/user/settings" style="color:#9c9a96;">Unsubscribe</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """

            subject = f"🎯 {user_name}, it's been {days_since_last_interview} days! Time to practice"
            sent = self._send_smtp_email(
                to_email=user_email,
                subject=subject,
                html_body=html,
            )

            if sent:
                logger.success("[EMAIL] Practice reminder sent | user_id={} | to={}", user_id, user_email)
                return {"success": True, "message": f"Reminder sent to {user_email}"}
            else:
                return {"success": False, "message": "Failed to send reminder email"}

        except Exception as exc:
            logger.error("[EMAIL] send_practice_reminder failed | user_id={} | error={}", user_id, exc)
            return {"success": False, "message": f"Reminder failed: {str(exc)}"}


# ── Module-level service singleton ─────────────────────────────────────────
email_service = EmailService()
