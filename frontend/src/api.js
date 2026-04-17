// ─────────────────────────────────────────────────────────
// HiLearn AI Interview Prep — API Service
// Connects React frontend ↔ FastAPI backend
// Base URL: http://localhost:8000/api/v1
// ─────────────────────────────────────────────────────────

const BASE_URL = "/api/v1"; // Vite proxy will forward to http://localhost:8000/api/v1

// ─── 1. Start Interview ───────────────────────────────────
// POST /api/v1/interview/start-interview
export async function startInterview({
  user_id,
  interview_type,
  job_role,
  tech_stack = [],
  difficulty = "intermediate",
  resume_text = null,
  target_companies = [],
}) {
  const response = await fetch(`${BASE_URL}/interview/start-interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      interview_type,
      job_role,
      tech_stack,
      difficulty,
      resume_text,
      target_companies,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to start interview");
  }

  return await response.json();
}

// ─── 2. Submit Answer ─────────────────────────────────────
// POST /api/v1/interview/submit-answer
export async function submitAnswer({
  session_id,
  question_id,
  answer_text,
  answer_duration_seconds = null,
  audio_file_url = null,
}) {
  const response = await fetch(`${BASE_URL}/interview/submit-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id,
      question_id,
      answer_text,
      answer_duration_seconds,
      audio_file_url,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to submit answer");
  }

  return await response.json();
}

// ─── 3. Get Session ───────────────────────────────────────
// GET /api/v1/interview/session/{session_id}
export async function getSession(session_id) {
  const response = await fetch(`${BASE_URL}/interview/session/${session_id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Session not found");
  }

  return await response.json();
}

// ─── 4. Health Check ──────────────────────────────────────
// GET /api/v1/health
export async function healthCheck() {
  const response = await fetch(`${BASE_URL}/health`);
  return await response.json();
}