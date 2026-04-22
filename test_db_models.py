"""Quick smoke test for Day 5 database models and service imports."""

# ── 1. Test DB Model Imports ──────────────────────────────────
from app.models.db_models import (
    UserDocument,
    InterviewDocument,
    QuestionDocument,
    FeedbackDocument,
    AnalyticsDocument,
    AdminStatsDocument,
)
print("✅ All 6 DB models import successfully")

# ── 2. Test Model Instantiation ──────────────────────────────
u = UserDocument(email="Test@HiLearn.com", password_hash="bcrypt_hash", name="Rahil")
assert u.email == "test@hilearn.com", "Email normalisation failed"
assert u.role.value == "student"
print(f"  UserDocument OK — email={u.email}, role={u.role.value}")

i = InterviewDocument(user_id="u1", job_role="Backend Engineer")
assert i.status.value == "active"
print(f"  InterviewDocument OK — status={i.status.value}")

q = QuestionDocument(text="What is REST?", job_role="Backend Engineer")
print(f"  QuestionDocument OK — difficulty={q.difficulty.value}")

f = FeedbackDocument(interview_id="i1", question_id="q1", user_id="u1")
assert f.content_score == 0.0
print(f"  FeedbackDocument OK — content_score={f.content_score}")

a = AnalyticsDocument(user_id="u1")
assert a.total_interviews == 0
print(f"  AnalyticsDocument OK — total_interviews={a.total_interviews}")

s = AdminStatsDocument()
assert s.stats_id == "global"
print(f"  AdminStatsDocument OK — stats_id={s.stats_id}")

# ── 3. Test to_mongo / from_mongo Round-Trip ──────────────────
mongo_doc = u.to_mongo()
assert "_id" in mongo_doc, "to_mongo should set _id"
assert "user_id" not in mongo_doc, "to_mongo should remove user_id"
u2 = UserDocument.from_mongo(mongo_doc)
assert u2.email == u.email
print("  to_mongo / from_mongo round-trip OK")

mongo_int = i.to_mongo()
assert "_id" in mongo_int
i2 = InterviewDocument.from_mongo(mongo_int)
assert i2.user_id == "u1"
print("  InterviewDocument round-trip OK")

# ── 4. Test Database Service Import ──────────────────────────
from app.services.database import DatabaseService, db_service
assert db_service is not None
assert db_service.is_connected is False  # No MongoDB running during test
print("✅ DatabaseService singleton imports OK (not connected — expected)")

# ── 5. Test Interview Service Import ─────────────────────────
from app.services.interview_service import interview_service
assert interview_service is not None
print("✅ InterviewService imports OK")

# ── 6. Test Auth Service Import ──────────────────────────────
from app.services.auth_service import auth_service
assert auth_service is not None
print("✅ AuthService imports OK")

print("\n" + "=" * 50)
print("🎉 ALL DAY 5 SMOKE TESTS PASSED!")
print("=" * 50)
