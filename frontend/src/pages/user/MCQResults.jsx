import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Mail, Loader, RotateCcw, ArrowLeft } from 'lucide-react'
import { sendResultsEmail } from '../../utils/api'

export default function MCQResults() {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('hilearn_mcq_results')
    if (!stored) {
      navigate('/user/interview-setup')
      return
    }
    try {
      setResults(JSON.parse(stored))
    } catch {
      navigate('/user/interview-setup')
    }
  }, [navigate])

  const handleSendEmail = async () => {
    if (!results) return
    setSendingEmail(true)
    setEmailError('')
    try {
      await sendResultsEmail(results.session_id)
      setEmailSent(true)
    } catch (err) {
      setEmailError(err.message || 'Failed to send email.')
    } finally {
      setSendingEmail(false)
    }
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size={24} className="animate-spin text-[#c8601a]" />
      </div>
    )
  }

  const { answers = [], total_score = 0, total_questions = 10, job_role, difficulty } = results
  const correctCount = answers.filter(a => a.isCorrect).length
  const pct = Math.round((correctCount / Math.max(total_questions, 1)) * 100)
  const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'
  const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Practicing' : 'Needs Improvement'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('/user/interview-setup')}
          className="flex items-center gap-1 text-sm text-[#9c9a96] hover:text-[#c8601a] transition mb-3"
        >
          <ArrowLeft size={14} /> Back to Setup
        </button>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Results</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">MCQ Performance</h1>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="surface-card p-8"
      >
        <div className="flex items-center gap-8">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f0ebe3" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={gradeColor} strokeWidth="8"
                strokeDasharray={`${pct * 3.27} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: gradeColor }}>{pct}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <p className="text-xl font-bold" style={{ color: gradeColor }}>{grade}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f4f2ee] px-4 py-3">
                <p className="text-xs text-[#9c9a96]">Score</p>
                <p className="text-lg font-bold text-[#0f1f3d]">{total_score} / {total_questions * 10}</p>
              </div>
              <div className="rounded-xl bg-[#f4f2ee] px-4 py-3">
                <p className="text-xs text-[#9c9a96]">Correct</p>
                <p className="text-lg font-bold text-[#0f1f3d]">{correctCount} / {total_questions}</p>
              </div>
              {job_role && (
                <div className="rounded-xl bg-[#f4f2ee] px-4 py-3">
                  <p className="text-xs text-[#9c9a96]">Job Role</p>
                  <p className="text-sm font-semibold text-[#0f1f3d]">{job_role}</p>
                </div>
              )}
              {difficulty && (
                <div className="rounded-xl bg-[#f4f2ee] px-4 py-3">
                  <p className="text-xs text-[#9c9a96]">Difficulty</p>
                  <p className="text-sm font-semibold text-[#0f1f3d] capitalize">{difficulty}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#0f1f3d] text-white rounded-full font-semibold text-sm hover:bg-[#1a3a6b] transition disabled:opacity-60"
          >
            {sendingEmail ? (
              <><Loader size={14} className="animate-spin" /> Sending...</>
            ) : emailSent ? (
              <><CheckCircle2 size={14} /> Sent to Email ✉️</>
            ) : (
              <><Mail size={14} /> Send Results to Email</>
            )}
          </button>
          <button
            onClick={() => navigate('/user/interview-setup')}
            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-[#e0dbd3] rounded-full font-semibold text-sm text-[#5c5a57] hover:border-[#c8601a] transition"
          >
            <RotateCcw size={14} /> Try Again
          </button>
        </div>

        {emailError && (
          <p className="mt-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
            {emailError}
          </p>
        )}
        {emailSent && (
          <p className="mt-3 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
            ✅ Results sent to your registered email!
          </p>
        )}
      </motion.div>

      {/* Question-by-Question Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="surface-card p-6"
      >
        <h2 className="font-bold text-[#0f1f3d] text-lg mb-4">📋 Question Breakdown</h2>
        <div className="space-y-4">
          {answers.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`rounded-xl border-2 p-4 ${item.isCorrect
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-rose-200 bg-rose-50/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${item.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {item.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0f1f3d] mb-1">
                    Q{idx + 1}. {item.question?.question_text || 'Question'}
                  </p>
                  <div className="flex gap-4 text-xs mb-2">
                    <span className={item.isCorrect ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                      Your answer: {item.userAnswer}
                    </span>
                    {!item.isCorrect && (
                      <span className="text-emerald-600 font-bold">
                        Correct: {item.correctAnswer}
                      </span>
                    )}
                    <span className="text-[#c8601a] font-bold">
                      +{item.score} pts
                    </span>
                  </div>
                  <div className="rounded-lg bg-white/70 border border-[#e0dbd3] px-3 py-2">
                    <p className="text-xs text-[#5c5a57]">
                      💡 {item.explanation || 'No explanation available.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="surface-card p-6"
      >
        <h2 className="font-bold text-[#0f1f3d] text-lg mb-3">📚 Recommendations</h2>
        <div className="space-y-2">
          {[
            'Review incorrect answers and study the explanations',
            'Practice similar questions at a higher difficulty',
            'Focus on weak areas identified in this quiz',
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3">
              <span className="text-[#c8601a] font-bold text-sm">→</span>
              <p className="text-sm text-[#5c5a57]">{tip}</p>
            </div>
          ))}
        </div>
        <a
          href="https://hilearn.in/courses"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#c8601a] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#c8601a]/20 hover:bg-[#b0541a] transition"
        >
          📖 Browse HiLearn Courses
        </a>
      </motion.div>
    </div>
  )
}
