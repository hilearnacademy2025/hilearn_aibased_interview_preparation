// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
  

//   return (
//     <>
//       <h1 className='bg-amber-500 '>hello</h1>
//     </>
//   )
// }

// export default App



import { useState, useEffect, useRef } from "react";
import { startInterview, submitAnswer } from "./api";

// ─── Interview Types & Config ─────────────────────────────
const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical", emoji: "💻", desc: "DSA, System Design, Coding" },
  { value: "behavioral", label: "Behavioral", emoji: "🧠", desc: "STAR method, team work" },
  { value: "hr", label: "HR Round", emoji: "🤝", desc: "Culture fit, salary, goals" },
  { value: "domain_specific", label: "Domain", emoji: "🎯", desc: "Role & industry specific" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", color: "text-green-400" },
  { value: "intermediate", label: "Intermediate", color: "text-yellow-400" },
  { value: "advanced", label: "Advanced", color: "text-red-400" },
];

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | interview | feedback | complete
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup form state
  const [form, setForm] = useState({
    job_role: "",
    interview_type: "technical",
    difficulty: "intermediate",
    tech_stack: "",
    resume_text: "",
  });

  // Interview session state
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [progress, setProgress] = useState({ answered: 0, total: 10 });
  const [timer, setTimer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (screen === "interview") {
      setTimer(0);
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, currentQuestion]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Start Interview ──────────────────────────────────────
  const handleStart = async () => {
    if (!form.job_role.trim()) {
      setError("Please enter your target job role");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await startInterview({
        user_id: "user_" + Date.now(),
        interview_type: form.interview_type,
        job_role: form.job_role,
        difficulty: form.difficulty,
        tech_stack: form.tech_stack ? form.tech_stack.split(",").map((s) => s.trim()) : [],
        resume_text: form.resume_text || null,
      });
      setSession(data);
      setCurrentQuestion(data.first_question);
      setProgress({ answered: 0, total: data.total_questions });
      setScreen("interview");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Submit Answer ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!answer.trim()) {
      setError("Please write your answer before submitting");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await submitAnswer({
        session_id: session.session_id,
        question_id: currentQuestion.question_id,
        answer_text: answer,
        answer_duration_seconds: timer,
      });
      setFeedback(data.feedback);
      setProgress({ answered: data.questions_answered, total: data.total_questions });
      if (data.session_status === "completed" || !data.next_question) {
        setIsComplete(true);
      } else {
        setCurrentQuestion(data.next_question);
      }
      setScreen("feedback");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Next Question ────────────────────────────────────────
  const handleNext = () => {
    if (isComplete) {
      setScreen("complete");
    } else {
      setAnswer("");
      setFeedback(null);
      setError(null);
      setScreen("interview");
    }
  };

  const progressPercent = Math.round((progress.answered / progress.total) * 100);

  // ════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════

  // ── Setup Screen ─────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-6">
              🎯 AI-Powered Interview Prep
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              HiLearn <span className="text-blue-400">Interview</span>
            </h1>
            <p className="text-gray-400 text-lg">
              India-focused mock interviews — ₹299/month
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            
            {/* Job Role */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Job Role *
              </label>
              <input
                type="text"
                placeholder="e.g. Backend Engineer, Data Scientist, Product Manager"
                value={form.job_role}
                onChange={(e) => setForm({ ...form, job_role: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Interview Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Interview Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INTERVIEW_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setForm({ ...form, interview_type: type.value })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form.interview_type === type.value
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setForm({ ...form, difficulty: d.value })}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      form.difficulty === d.value
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span className={form.difficulty === d.value ? d.color : ""}>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack (optional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tech Stack <span className="text-gray-500 font-normal">(optional, comma separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Python, FastAPI, MongoDB, React"
                value={form.tech_stack}
                onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Resume Text (optional) */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resume Summary <span className="text-gray-500 font-normal">(optional — for personalized questions)</span>
              </label>
              <textarea
                placeholder="Paste your resume text here for AI-personalized questions..."
                value={form.resume_text}
                onChange={(e) => setForm({ ...form, resume_text: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Starting Interview...
                </span>
              ) : "Start Interview 🚀"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Interview Screen ──────────────────────────────────────
  if (screen === "interview") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col p-4">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <div className="text-sm text-gray-400">
              <span className="text-white font-medium">{session?.job_role}</span>
              <span className="mx-2">·</span>
              <span className="capitalize">{session?.interview_type}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">
                ⏱ {formatTime(timer)}
              </div>
              <div className="text-sm text-gray-400">
                {progress.answered + 1} / {progress.total}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6 flex-1">
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium mb-4 uppercase tracking-wider">
              <span>🤖 AI Interviewer</span>
              {currentQuestion?.topic && (
                <>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-500">{currentQuestion.topic}</span>
                </>
              )}
            </div>
            <p className="text-xl text-white leading-relaxed font-medium">
              {currentQuestion?.question_text}
            </p>
          </div>

          {/* Answer Area */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
            <label className="block text-sm text-gray-400 mb-3">Your Answer</label>
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific, use examples from your experience."
              rows={6}
              className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-base leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
              <span className="text-xs text-gray-600">{answer.split(/\s+/).filter(Boolean).length} words</span>
              <span className="text-xs text-gray-600">Tip: Use STAR method for behavioral questions</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Getting AI Feedback...
              </span>
            ) : "Submit Answer →"}
          </button>
        </div>
      </div>
    );
  }

  // ── Feedback Screen ───────────────────────────────────────
  if (screen === "feedback" && feedback) {
    const score = feedback.overall_score;
    const scoreColor = score >= 7 ? "text-green-400" : score >= 5 ? "text-yellow-400" : "text-red-400";
    const scoreBg = score >= 7 ? "bg-green-500/10 border-green-500/30" : score >= 5 ? "bg-yellow-500/10 border-yellow-500/30" : "bg-red-500/10 border-red-500/30";

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col p-4">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          
          <div className="pt-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">AI Feedback</h2>
            <p className="text-gray-400 text-sm">
              Question {progress.answered} of {progress.total}
            </p>
          </div>

          {/* Score Card */}
          <div className={`border rounded-2xl p-6 mb-4 text-center ${scoreBg}`}>
            <div className={`text-6xl font-bold mb-1 ${scoreColor}`}>
              {score.toFixed(1)}
            </div>
            <div className="text-gray-400 text-sm">Overall Score / 10</div>
            
            {/* Sub Scores */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Content", value: feedback.content_score },
                { label: "Completeness", value: feedback.completeness_score },
                { label: "Relevance", value: feedback.relevance_score },
              ].map((item) => (
                <div key={item.label} className="bg-gray-900/50 rounded-xl p-3">
                  <div className="text-xl font-bold text-white">{item.value.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                ✅ Strengths
              </h3>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
              <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                💡 Areas to Improve
              </h3>
              <ul className="space-y-2">
                {feedback.improvements.map((imp, i) => (
                  <li key={i} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hint & LMS */}
          {(feedback.ideal_answer_hint || feedback.lms_course_recommendation) && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 mb-6">
              {feedback.ideal_answer_hint && (
                <p className="text-sm text-blue-300 mb-2">
                  <span className="font-medium">💡 Hint: </span>{feedback.ideal_answer_hint}
                </p>
              )}
              {feedback.lms_course_recommendation && (
                <p className="text-sm text-blue-400">
                  📚 {feedback.lms_course_recommendation}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            {isComplete ? "View Final Results 🎉" : "Next Question →"}
          </button>
        </div>
      </div>
    );
  }

  // ── Complete Screen ───────────────────────────────────────
  if (screen === "complete") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-3">Interview Complete!</h1>
          <p className="text-gray-400 mb-2">
            You answered all <span className="text-white font-medium">{progress.total} questions</span>
          </p>
          <p className="text-gray-500 text-sm mb-10">
            Role: {session?.job_role} · {session?.interview_type}
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-left">
            <h3 className="text-sm font-medium text-gray-400 mb-4">What's Next?</h3>
            <div className="space-y-3">
              {[
                { emoji: "📊", text: "Check your dashboard for detailed analytics" },
                { emoji: "📚", text: "Review recommended HiLearn courses" },
                { emoji: "👥", text: "Try a peer mock interview" },
                { emoji: "🔄", text: "Practice again with different difficulty" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <span>{item.emoji}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setScreen("setup");
              setSession(null);
              setCurrentQuestion(null);
              setAnswer("");
              setFeedback(null);
              setIsComplete(false);
              setProgress({ answered: 0, total: 10 });
              setError(null);
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
          >
            Start New Interview 🚀
          </button>
        </div>
      </div>
    );
  }

  return null;
}