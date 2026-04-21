import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'
import { startInterview, submitAnswer } from '../utils/api'

// ─── Premium Config ────────────────────────────────────────────────────────────
const FREE_QUESTION_LIMIT = 2

const getPlanFromStorage = () => {
  try { return window.localStorage.getItem('hilearn_plan') === 'premium' } catch { return false }
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const interviewTypes = [
  { value: 'technical',       label: 'Technical',       description: 'Coding, systems, technical depth', icon: '⚙️' },
  { value: 'behavioral',      label: 'Behavioral',      description: 'Stories, teamwork, leadership',    icon: '🤝' },
  { value: 'hr',              label: 'HR',              description: 'Fit, motivation, communication',   icon: '💬' },
  { value: 'domain_specific', label: 'Domain Specific', description: 'Industry and role context',        icon: '🏢' },
]

const difficultyOptions = [
  { value: 'beginner',     label: 'Beginner',     color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  { value: 'intermediate', label: 'Intermediate', color: '#c8601a', bg: '#fff4ea', border: '#fed7aa' },
  { value: 'advanced',     label: 'Advanced',     color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
]

const premiumFeatures = [
  { icon: '∞',  label: 'Unlimited questions per session'    },
  { icon: '🧠', label: 'Detailed AI feedback & scoring'     },
  { icon: '🎯', label: 'Advanced & domain-specific difficulty' },
  { icon: '📊', label: 'Progress analytics & history'       },
  { icon: '⚡', label: 'Priority AI response speed'         },
]

// ─── Background ambient orbs ──────────────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-8%', right: '5%', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,96,26,0.10) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 580, height: 580, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,31,61,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', top: '42%', left: '38%', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)', filter: 'blur(55px)' }}
      />
    </div>
  )
}

// ─── Premium Modal ─────────────────────────────────────────────────────────────
function PremiumModal({ onClose, onUpgrade }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(8,16,40,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 44 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.90, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        style={{ position: 'relative', width: '100%', maxWidth: 480, borderRadius: 36, overflow: 'hidden',
          background: 'linear-gradient(160deg, #0f1f3d 0%, #1a1040 100%)', border: '1px solid rgba(245,166,35,0.18)' }}
      >
        {/* top glow */}
        <div style={{ pointerEvents: 'none', position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 240, height: 240, borderRadius: '50%', opacity: 0.45,
          background: 'radial-gradient(circle, #f5a623 0%, transparent 70%)', filter: 'blur(44px)' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 36px 40px' }}>
          {/* Crown */}
          <motion.div
            initial={{ rotate: -15, scale: 0.6 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.08 }}
            style={{ marginBottom: 24, width: 92, height: 92, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, background: 'linear-gradient(135deg, #f5a623 0%, #c8601a 100%)',
              boxShadow: '0 12px 40px rgba(200,96,26,0.55), 0 0 0 8px rgba(245,166,35,0.12)' }}
          >👑</motion.div>

          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
            style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#fff',
              fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.02em', maxWidth: 340 }}>
            Unlock Full Interview Experience
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.20 }}
            style={{ marginTop: 12, textAlign: 'center', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.52)', maxWidth: 340 }}>
            You've used your {FREE_QUESTION_LIMIT} free questions. Upgrade to practise without limits and get richer AI feedback.
          </motion.p>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            style={{ marginTop: 28, width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {premiumFeatures.map((feat, i) => (
              <motion.div key={feat.label}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.30 + i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <span style={{ fontSize: 20 }}>{feat.icon}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', flex: 1 }}>{feat.label}</span>
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.52 + i * 0.07, type: 'spring' }}
                  style={{ width: 20, height: 20, borderRadius: '50%', background: '#c8601a', color: '#fff',
                    fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</motion.span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(200,96,26,0.65)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onUpgrade}
            style={{ marginTop: 32, width: '100%', borderRadius: 999, padding: '16px 0', fontSize: 16, fontWeight: 700,
              color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #f5a623 0%, #c8601a 100%)',
              boxShadow: '0 4px 24px rgba(200,96,26,0.45)' }}>
            Upgrade to Premium ✦
          </motion.button>

          <button onClick={onClose}
            style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.36)', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 4 }}>
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Lock overlay ──────────────────────────────────────────────────────────────
function LockedOverlay({ onUpgrade, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 10,
        borderRadius: compact ? 20 : 28,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: compact
          ? 'rgba(15,31,61,0.55)'
          : 'linear-gradient(170deg, rgba(15,31,61,0.08) 0%, rgba(15,31,61,0.80) 55%, rgba(15,31,61,0.96) 100%)',
        backdropFilter: 'blur(7px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.08 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', padding: '0 24px' }}
      >
        <div style={{
          width: compact ? 48 : 64, height: compact ? 48 : 64, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 22 : 30,
          background: 'linear-gradient(135deg, #f5a623, #c8601a)',
          boxShadow: '0 6px 24px rgba(200,96,26,0.5)',
        }}>🔒</div>
        {!compact && (
          <>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Premium Question</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.58)', maxWidth: 220, lineHeight: 1.6 }}>Upgrade to unlock all remaining questions.</p>
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
          onClick={onUpgrade}
          style={{
            borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700, color: '#fff',
            padding: compact ? '8px 18px' : '12px 28px', fontSize: compact ? 12 : 14, marginTop: 4,
            background: 'linear-gradient(135deg, #f5a623, #c8601a)',
            boxShadow: '0 4px 16px rgba(200,96,26,0.45)',
          }}>
          Upgrade to Premium
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Plan Badge ───────────────────────────────────────────────────────────────
function PlanBadge({ isPremium, questionsUsed, total, onUpgradeClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999,
        padding: '6px 14px', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
        ...(isPremium
          ? { background: 'linear-gradient(135deg,#f5a623,#c8601a)', color: '#fff', boxShadow: '0 2px 12px rgba(200,96,26,0.35)' }
          : { background: '#f0ebe3', color: '#5c5a57', border: '1px solid #e0dbd3' }),
      }}>
        {isPremium ? '👑 Premium' : '🔓 Free Plan'}
      </span>
      {!isPremium && total > 0 && (
        <button onClick={onUpgradeClick}
          style={{ fontSize: 12, fontWeight: 600, color: '#c8601a', textDecoration: 'underline', textUnderlineOffset: 3,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {Math.min(questionsUsed, FREE_QUESTION_LIMIT)}/{total} questions · Upgrade for full access
        </button>
      )}
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
function Interview() {
  const navigate = useNavigate()
  const { pushToast } = useToast()

  // ── All useState declarations first — no derived state between them ────────
  const [isPremium, setIsPremium]               = useState(getPlanFromStorage)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [stage, setStage]                       = useState('setup')
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState('')
  const [timer, setTimer]                       = useState(0)
  const [session, setSession]                   = useState(null)
  const [question, setQuestion]                 = useState(null)
  const [answer, setAnswer]                     = useState('')
  const [wordPulse, setWordPulse]               = useState(false)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [form, setForm] = useState({
    user_id: 'student_demo', job_role: '', interview_type: 'technical',
    difficulty: 'intermediate', tech_stack: '', resume_text: '', target_companies: '',
  })
  const timerRef = useRef(null)

  // ── Derived — AFTER all useState ─────────────────────────────────────────
  // isPremium is live React state; this recalculates correctly on every render
  const lockedQuestion = !isPremium && currentQuestionNumber > FREE_QUESTION_LIMIT

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { document.title = 'Interview Practice | HiLearn AI Mock Interview' }, [])

  // Pause timer when question is locked
  useEffect(() => {
    if (stage === 'live' && !lockedQuestion) {
      timerRef.current = window.setInterval(() => setTimer((p) => p + 1), 1000)
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [stage, question?.question_id, lockedQuestion])

  const wordCount = useMemo(() => {
    const t = answer.trim(); return t ? t.split(/\s+/).length : 0
  }, [answer])

  useEffect(() => {
    if (wordCount > 0 && wordCount % 50 === 0) {
      setWordPulse(true)
      const to = window.setTimeout(() => setWordPulse(false), 450)
      return () => window.clearTimeout(to)
    }
    return undefined
  }, [wordCount])

  const formattedTime = useMemo(() => {
    const m = String(Math.floor(timer / 60)).padStart(2, '0')
    const s = String(timer % 60).padStart(2, '0')
    return `${m}:${s}`
  }, [timer])

  const progressPercent = useMemo(() => {
    if (!session?.total_questions) return 0
    return Math.min((currentQuestionNumber / session.total_questions) * 100, 100)
  }, [currentQuestionNumber, session?.total_questions])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleUpgrade = () => {
    // Setting isPremium = true makes lockedQuestion = false on next render,
    // so the current question immediately unlocks without needing navigation.
    setIsPremium(true)
    window.localStorage.setItem('hilearn_plan', 'premium')
    setShowPremiumModal(false)
    setTimer(0) // restart timer for the now-unlocked question
    pushToast({ title: '🎉 Welcome to Premium!', description: 'All questions are now unlocked.' })
  }

  const handleStartInterview = async () => {
    if (!form.job_role.trim()) { setError('Add your target job role to start the interview.'); return }
    setLoading(true); setError('')
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((i) => i.trim()).filter(Boolean) : undefined,
        target_companies: form.target_companies ? form.target_companies.split(',').map((i) => i.trim()).filter(Boolean) : undefined,
        resume_text: form.resume_text || undefined,
      }
      const response = await startInterview(payload)
      setSession(response)
      setQuestion(response.first_question)
      setStage('live')
      setTimer(0)
      setCurrentQuestionNumber(1)
      window.localStorage.setItem('hilearn_session_id', response.session_id)
      pushToast({ title: 'Interview room is live', description: 'Your first question is ready.' })
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const handleSubmit = async () => {
    // Guard: if on a locked question, open modal instead of submitting
    if (lockedQuestion) { setShowPremiumModal(true); return }
    if (!answer.trim() || !session || !question) { setError('Write your answer before sending it for feedback.'); return }

    setLoading(true); setError('')
    try {
      const response = await submitAnswer({
        session_id: session.session_id,
        question_id: question.question_id,
        answer_text: answer,
        answer_duration_seconds: timer,
      })
      window.localStorage.setItem('hilearn_latest_score', String(response.feedback.overall_score))
      window.localStorage.setItem('hilearn_feedback', JSON.stringify(response))
      pushToast({ title: 'Answer submitted', description: 'Feedback saved.' })

      if (response.next_question) {
        const nextNumber = currentQuestionNumber + 1
        // Capture isPremium from current render — avoids stale closure issues
        const nextIsLocked = !isPremium && nextNumber > FREE_QUESTION_LIMIT

        // Always advance state
        setQuestion(response.next_question)
        setAnswer('')
        setTimer(0)
        setCurrentQuestionNumber(nextNumber)
        if (timerRef.current) window.clearInterval(timerRef.current)

        // If next question is locked, show the modal after card animates in
        if (nextIsLocked) window.setTimeout(() => setShowPremiumModal(true), 500)
      } else {
        if (timerRef.current) window.clearInterval(timerRef.current)
        navigate('/feedback', { state: { feedbackResponse: response, session } })
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (loading && stage === 'setup') return <Loader label="Starting your interview room…" />

  const shell = { maxWidth: 1440, margin: '0 auto', padding: '44px 24px 80px' }
  const card  = { background: '#fff', border: '1px solid #e8e3db', borderRadius: 32, boxShadow: '0 4px 32px rgba(15,31,61,0.07)' }

  return (
    <PageTransition>
      <BackgroundOrbs />

      <AnimatePresence>
        {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} onUpgrade={handleUpgrade} />
        )}
      </AnimatePresence>

      {/* ══════════ SETUP STAGE ══════════ */}
      {stage === 'setup' && (
        <div style={shell}>
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999,
              padding: '8px 18px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
              background: '#fff8ef', border: '1px solid #fed7aa', color: '#c8601a' }}>
              🎙️ AI-Powered Mock Interview
            </span>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, color: '#0f1f3d',
              marginTop: 22, lineHeight: 1.12, letterSpacing: '-0.025em' }}>
              Step into your{' '}
              <em style={{ fontStyle: 'italic', color: '#c8601a' }}>practice room.</em>
            </h1>
            <p style={{ marginTop: 18, fontSize: 18, color: '#5c5a57', maxWidth: 520, margin: '18px auto 0', lineHeight: 1.7 }}>
              Sharpen your answers, build confidence, and land the role. Configure your session below.
            </p>
            {!isPremium && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20,
                  borderRadius: 999, padding: '10px 22px', fontSize: 13, fontWeight: 600,
                  background: '#fff8ef', border: '1px solid #fed7aa', color: '#c8601a' }}>
                🎁 Free plan: try {FREE_QUESTION_LIMIT} questions — no card needed
              </motion.div>
            )}
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 52 }}>
            {[
              { label: 'Interview types', value: '4',    sub: 'Technical, HR & more',   accent: false },
              { label: 'Difficulty levels', value: '3',   sub: 'Beginner → Advanced',    accent: false },
              { label: 'AI feedback',       value: '100%',sub: 'Per answer',             accent: true  },
              { label: 'Avg session',       value: '~18m',sub: 'Focused practice',       accent: false },
            ].map((s) => (
              <div key={s.label} style={{ borderRadius: 20, padding: '20px 22px',
                background: s.accent ? 'linear-gradient(135deg,#fff8ef,#fff4ea)' : '#faf8f5',
                border: `1px solid ${s.accent ? '#fed7aa' : '#e8e3db'}` }}>
                <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: s.accent ? '#c8601a' : '#9c9a96' }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: s.accent ? '#c8601a' : '#0f1f3d', marginTop: 6,
                  fontFamily: '"DM Mono", monospace' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#9c9a96', marginTop: 2 }}>{s.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* 2-col grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>

            {/* Left column */}
            <motion.div initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Dark hero card */}
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 32, padding: '44px 40px', minHeight: 340,
                background: 'linear-gradient(145deg, #0f1f3d 0%, #1b2f58 100%)' }}>
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.42, 0.2] }} transition={{ duration: 7, repeat: Infinity }}
                  style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%',
                    background: '#c8601a', filter: 'blur(65px)', pointerEvents: 'none' }} />
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.28, 0.12] }} transition={{ duration: 11, repeat: Infinity, delay: 3 }}
                  style={{ position: 'absolute', bottom: -20, right: -20, width: 170, height: 170, borderRadius: '50%',
                    background: '#f5a623', filter: 'blur(55px)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>Interview Setup</p>
                  <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 'clamp(1.8rem,2.8vw,2.6rem)',
                    fontWeight: 800, color: '#fff', marginTop: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    Real questions. Real pressure. Real growth.
                  </h2>
                  <p style={{ marginTop: 14, fontSize: 15, color: 'rgba(255,255,255,0.60)', lineHeight: 1.8 }}>
                    Our AI interviewer adapts to your role, stack, and difficulty — giving you a genuine interview feel with actionable feedback.
                  </p>
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Backend-connected session launch', 'Live AI scoring & feedback', 'Local storage for session continuity'].map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 16, padding: '12px 16px',
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', fontSize: 13, color: 'rgba(255,255,255,0.72)' }}>
                        <span style={{ color: '#f5a623' }}>✦</span> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium teaser (free users only) */}
              {!isPremium && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  style={{ borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(245,166,35,0.28)',
                    background: 'linear-gradient(135deg, #fff8ef 0%, #fff4ea 100%)' }}>
                  <div style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, background: 'linear-gradient(135deg,#f5a623,#c8601a)', boxShadow: '0 4px 16px rgba(200,96,26,0.35)' }}>👑</div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#c8601a' }}>Go Premium</p>
                        <p style={{ fontSize: 11, color: '#9c9a96' }}>Unlock everything</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {premiumFeatures.map((f) => (
                        <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#5c5a57' }}>
                          <span>{f.icon}</span>{f.label}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setShowPremiumModal(true)}
                      style={{ marginTop: 20, width: '100%', borderRadius: 999, padding: '13px 0', fontSize: 14, fontWeight: 700,
                        color: '#fff', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg,#f5a623,#c8601a)', boxShadow: '0 4px 16px rgba(200,96,26,0.35)' }}>
                      Upgrade to Premium ✦
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right: config form */}
            <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              style={{ ...card, padding: '44px 40px' }}>
              <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8601a' }}>Configuration</p>
              <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 'clamp(1.7rem,2.5vw,2.3rem)',
                fontWeight: 800, color: '#0f1f3d', marginTop: 10, marginBottom: 32, letterSpacing: '-0.02em' }}>
                Build your interview room.
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Target role */}
                <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>Target role</span>
                  <input value={form.job_role}
                    onChange={(e) => setForm((p) => ({ ...p, job_role: e.target.value }))}
                    placeholder="Frontend Developer, Data Analyst, SDE Intern"
                    className="warm-input" />
                </label>

                {/* Interview type */}
                <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>Interview type</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {interviewTypes.map((item) => {
                      const sel = form.interview_type === item.value
                      return (
                        <motion.button key={item.value} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setForm((p) => ({ ...p, interview_type: item.value }))}
                          style={{ borderRadius: 20, border: `1.5px solid ${sel ? '#c8601a' : '#e0dbd3'}`,
                            background: sel ? '#fff4ea' : '#fff', padding: '16px', textAlign: 'left',
                            cursor: 'pointer', position: 'relative', transition: 'all 0.18s' }}>
                          {sel && (
                            <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                              style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%',
                                background: '#c8601a', color: '#fff', fontSize: 11, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</motion.span>
                          )}
                          <p style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f1f3d' }}>{item.label}</p>
                          <p style={{ fontSize: 11, color: '#9c9a96', marginTop: 3 }}>{item.description}</p>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Difficulty */}
                <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>Difficulty</span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {difficultyOptions.map((item) => {
                      const sel = form.difficulty === item.value
                      return (
                        <motion.button key={item.value} type="button" whileTap={{ scale: 0.93 }}
                          onClick={() => setForm((p) => ({ ...p, difficulty: item.value }))}
                          style={{ borderRadius: 999, border: `1.5px solid ${sel ? item.border : '#e0dbd3'}`,
                            background: sel ? item.bg : '#fff', padding: '11px 22px', fontSize: 13,
                            fontWeight: 700, color: sel ? item.color : '#5c5a57', cursor: 'pointer', transition: 'all 0.18s' }}>
                          {item.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Tech stack */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>Tech stack</span>
                  <input value={form.tech_stack}
                    onChange={(e) => setForm((p) => ({ ...p, tech_stack: e.target.value }))}
                    placeholder="React, Python, Java" className="warm-input" />
                </label>

                {/* Target companies */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>Target companies</span>
                  <input value={form.target_companies}
                    onChange={(e) => setForm((p) => ({ ...p, target_companies: e.target.value }))}
                    placeholder="Google, TCS, Amazon" className="warm-input" />
                </label>

                {/* Resume */}
                <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>
                    Resume summary{' '}
                    <span style={{ fontWeight: 400, color: '#9c9a96' }}>(optional)</span>
                  </span>
                  <textarea rows={4} value={form.resume_text}
                    onChange={(e) => setForm((p) => ({ ...p, resume_text: e.target.value }))}
                    placeholder="Paste a short summary to personalise the session…"
                    className="warm-input resize-none" />
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ marginTop: 20, borderRadius: 16, border: '1px solid #fecaca', background: '#fef2f2',
                      padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 36px rgba(15,31,61,0.24)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartInterview}
                disabled={loading}
                style={{ marginTop: 32, width: '100%', borderRadius: 999, padding: '18px 0', fontSize: 16,
                  fontWeight: 800, color: '#fff', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0f1f3d 0%, #1b3060 100%)',
                  boxShadow: '0 4px 24px rgba(15,31,61,0.25)' }}>
                {loading ? 'Setting up room…' : 'Start interview →'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}

      {/* ══════════ LIVE STAGE ══════════ */}
      {stage === 'live' && session && question && (
        <div style={shell}>

          {/* Top bar */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
              gap: 12, marginBottom: 28, borderRadius: 24, padding: '14px 24px',
              background: '#fff', border: '1px solid #e8e3db', boxShadow: '0 2px 16px rgba(15,31,61,0.05)' }}>
            <PlanBadge
              isPremium={isPremium}
              questionsUsed={currentQuestionNumber}
              total={session.total_questions}
              onUpgradeClick={() => setShowPremiumModal(true)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {[session.interview_type, session.difficulty].map((t) => (
                <span key={t} style={{ borderRadius: 999, background: '#f0ebe3', padding: '6px 14px',
                  fontSize: 11, fontWeight: 600, color: '#5c5a57', textTransform: 'capitalize' }}>{t}</span>
              ))}
              <span style={{ borderRadius: 999, background: '#fff4ea', padding: '6px 14px',
                fontSize: 11, fontWeight: 800, color: '#c8601a' }}>
                Q{currentQuestionNumber}/{session.total_questions}
              </span>
            </div>
          </motion.div>

          {/* 3-col layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr 250px', gap: 22, alignItems: 'start' }}>

            {/* ─ Left sidebar ─ */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Session card */}
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '28px 26px',
                background: 'linear-gradient(145deg, #0f1f3d, #1b2f58)' }}>
                <motion.div animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.40, 0.18] }} transition={{ duration: 9, repeat: Infinity }}
                  style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%',
                    background: '#c8601a', filter: 'blur(55px)', pointerEvents: 'none' }} />
                <p style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>Live session</p>
                <p style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 20, fontWeight: 800,
                  color: '#fff', marginTop: 8, lineHeight: 1.25 }}>{session.job_role}</p>
                <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[session.interview_type, session.difficulty, `${session.total_questions} Qs`].map((t) => (
                    <span key={t} style={{ borderRadius: 999, background: 'rgba(255,255,255,0.10)',
                      padding: '5px 12px', fontSize: 11, color: 'rgba(255,255,255,0.70)', textTransform: 'capitalize' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div style={{ ...card, borderRadius: 24, padding: '22px 24px' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9c9a96' }}>Elapsed time</p>
                <motion.p
                  animate={timer >= 270 && !lockedQuestion ? { scale: [1, 1.04, 1], color: ['#c8601a', '#ae4f10', '#c8601a'] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ fontFamily: '"DM Mono", monospace', fontSize: 48, fontWeight: 800,
                    color: lockedQuestion ? '#c0bbb5' : '#0f1f3d', marginTop: 6 }}>
                  {formattedTime}
                </motion.p>
                <div style={{ marginTop: 12, height: 6, borderRadius: 999, background: '#f0ebe3' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((timer / 300) * 100, 100)}%` }}
                    style={{ height: 6, borderRadius: 999, background: lockedQuestion ? '#e0dbd3' : '#c8601a' }}
                  />
                </div>
                <p style={{ marginTop: 8, fontSize: 11, color: '#9c9a96' }}>
                  {lockedQuestion ? 'Paused — question locked' : 'Pulses near the 5-min mark'}
                </p>
              </div>

              {/* Progress */}
              <div style={{ ...card, borderRadius: 24, padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9c9a96' }}>Progress</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5c5a57' }}>{currentQuestionNumber}/{session.total_questions}</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: '#f0ebe3', overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }}
                    style={{ height: 6, borderRadius: 999, background: '#0f1f3d' }} />
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                  {Array.from({ length: session.total_questions }).map((_, i) => {
                    const done   = i < currentQuestionNumber
                    const locked = !isPremium && i >= FREE_QUESTION_LIMIT
                    return (
                      <motion.div key={i}
                        initial={{ scaleX: 0 }} animate={{ scaleX: done ? 1 : 0.28 }}
                        style={{ flex: 1, height: 8, borderRadius: 999, transformOrigin: 'left', position: 'relative',
                          background: done ? '#c8601a' : locked ? 'rgba(245,166,35,0.25)' : '#e0dbd3' }}>
                        {locked && !done && (
                          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7 }}>🔒</span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
                {!isPremium && (
                  <button onClick={() => setShowPremiumModal(true)}
                    style={{ marginTop: 14, width: '100%', borderRadius: 16, padding: '10px 0', fontSize: 12, fontWeight: 700,
                      color: '#c8601a', cursor: 'pointer', border: '1px solid rgba(245,166,35,0.28)',
                      background: 'linear-gradient(135deg,#fff8ef,#fff4ea)' }}>
                    👑 Unlock all {session.total_questions} questions
                  </button>
                )}
              </div>
            </motion.div>

            {/* ─ Centre column ─ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Question card */}
              <motion.div key={question.question_id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                style={{ ...card, padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 28 }}>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c8601a' }}>AI Interviewer</p>
                    <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 34, fontWeight: 800,
                      color: '#0f1f3d', marginTop: 8, letterSpacing: '-0.02em' }}>
                      Question {currentQuestionNumber}
                    </h2>
                  </div>
                  <span style={{ borderRadius: 999, background: '#fff4ea', padding: '8px 18px', fontSize: 12,
                    fontWeight: 700, color: '#c8601a', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {question.topic || 'Live round'}
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{
                    borderRadius: 24, border: '1px solid #e0dbd3', background: '#fffaf4',
                    padding: '26px 30px', fontSize: 17, lineHeight: 1.85, color: '#111827',
                    ...(lockedQuestion ? { filter: 'blur(7px)', userSelect: 'none', pointerEvents: 'none' } : {}),
                  }}>
                    {question.question_text}
                  </div>
                  <AnimatePresence>
                    {lockedQuestion && <LockedOverlay onUpgrade={() => setShowPremiumModal(true)} />}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Answer card */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
                style={{ ...card, padding: '36px 40px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 22 }}>
                  <div>
                    <h3 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 28, fontWeight: 800, color: '#0f1f3d' }}>
                      Your answer
                    </h3>
                    <p style={{ fontSize: 13, color: '#5c5a57', marginTop: 5 }}>
                      {lockedQuestion ? 'Upgrade to Premium to answer this question.' : 'Structure with situation, action, and result.'}
                    </p>
                  </div>
                  <motion.span animate={wordPulse ? { y: [0, -6, 0] } : {}}
                    style={{ borderRadius: 999, background: '#fff4ea', padding: '8px 18px', fontSize: 13,
                      fontWeight: 700, color: lockedQuestion ? '#c0bbb5' : '#c8601a', flexShrink: 0 }}>
                    {lockedQuestion ? '🔒 locked' : `${wordCount} words`}
                  </motion.span>
                </div>

                <div style={{ position: 'relative' }}>
                  <textarea
                    rows={13}
                    value={lockedQuestion ? '' : answer}
                    onChange={(e) => !lockedQuestion && setAnswer(e.target.value)}
                    placeholder={lockedQuestion
                      ? 'This question is locked. Upgrade to Premium to continue…'
                      : 'Structure your answer: situation → task → action → result…'}
                    disabled={lockedQuestion}
                    readOnly={lockedQuestion}
                    className="warm-input resize-none w-full"
                    style={{ padding: '20px 22px', fontSize: 15, lineHeight: 1.8, minHeight: 260,
                      ...(lockedQuestion ? { filter: 'blur(4px)', opacity: 0.42, cursor: 'not-allowed', userSelect: 'none' } : {}) }}
                  />
                  <AnimatePresence>
                    {lockedQuestion && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: 20, cursor: 'pointer',
                          background: 'rgba(15,31,61,0.04)', backdropFilter: 'blur(3px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setShowPremiumModal(true)}>
                        <span style={{ fontSize: 30, opacity: 0.40 }}>🔒</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {error && !lockedQuestion && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ marginTop: 16, borderRadius: 16, border: '1px solid #fecaca',
                        background: '#fef2f2', padding: '12px 16px', fontSize: 13, color: '#dc2626' }}>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
                  {lockedQuestion ? (
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(200,96,26,0.55)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowPremiumModal(true)}
                      style={{ flex: 1, borderRadius: 999, padding: '18px 0', fontSize: 15, fontWeight: 800,
                        color: '#fff', border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg,#f5a623,#c8601a)',
                        boxShadow: '0 4px 20px rgba(200,96,26,0.42)' }}>
                      🔒 Unlock with Premium
                    </motion.button>
                  ) : (
                    <>
                      <Button onClick={handleSubmit} className="flex-1 justify-center py-4" disabled={loading}>
                        {loading ? 'Submitting…' : 'Submit for AI feedback'}
                      </Button>
                      <Button variant="secondary" onClick={() => setAnswer('')} className="justify-center px-6 py-4">
                        Clear
                      </Button>
                    </>
                  )}
                </div>

                {/* Inline premium nudge */}
                <AnimatePresence>
                  {lockedQuestion && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden', marginTop: 18 }}>
                      <div style={{ borderRadius: 20, padding: '18px 22px',
                        background: 'linear-gradient(135deg,#fff8ef,#fff4ea)', border: '1px solid rgba(245,166,35,0.28)' }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#c8601a' }}>👑 Unlock Full Interview Experience</p>
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {premiumFeatures.slice(0, 3).map((f) => (
                            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5c5a57' }}>
                              <span>{f.icon}</span>{f.label}
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setShowPremiumModal(true)}
                          style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: '#c8601a',
                            textDecoration: 'underline', textUnderlineOffset: 3,
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          See all Premium benefits →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* ─ Right sidebar ─ */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.13 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Answer tips */}
              <div style={{ ...card, borderRadius: 24, padding: '22px 24px' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9c9a96', marginBottom: 16 }}>Answer tips</p>
                {[
                  { icon: '⭐', tip: 'Use STAR — Situation, Task, Action, Result' },
                  { icon: '⏱️', tip: 'Aim for 2–3 min per answer' },
                  { icon: '📌', tip: 'Be specific — real numbers beat vague claims' },
                  { icon: '🎯', tip: 'Tie answers back to the role requirements' },
                ].map((t) => (
                  <div key={t.tip} style={{ display: 'flex', gap: 10, marginBottom: 13, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                    <p style={{ fontSize: 12, color: '#5c5a57', lineHeight: 1.65 }}>{t.tip}</p>
                  </div>
                ))}
              </div>

              {/* Word count */}
              <div style={{ ...card, borderRadius: 24, padding: '20px 24px' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9c9a96', marginBottom: 10 }}>Word count</p>
                <p style={{ fontFamily: '"DM Mono",monospace', fontSize: 40, fontWeight: 800,
                  color: wordCount >= 80 ? '#16a34a' : wordCount >= 40 ? '#c8601a' : '#0f1f3d' }}>
                  {lockedQuestion ? '—' : wordCount}
                </p>
                <div style={{ marginTop: 8, height: 5, borderRadius: 999, background: '#f0ebe3' }}>
                  <motion.div animate={{ width: `${Math.min((wordCount / 150) * 100, 100)}%` }}
                    style={{ height: 5, borderRadius: 999, background: wordCount >= 80 ? '#16a34a' : '#c8601a' }} />
                </div>
                <p style={{ marginTop: 7, fontSize: 11, color: '#9c9a96' }}>Sweet spot: 80–150 words</p>
              </div>

              {/* Topic badge */}
              {question.topic && (
                <div style={{ borderRadius: 24, padding: '18px 22px', background: '#fff4ea', border: '1px solid #fed7aa' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8601a', marginBottom: 8 }}>Topic</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f1f3d' }}>{question.topic}</p>
                </div>
              )}

              {/* Premium CTA */}
              {!isPremium && (
                <motion.div whileHover={{ scale: 1.02 }} onClick={() => setShowPremiumModal(true)}
                  style={{ borderRadius: 24, padding: '22px 22px', cursor: 'pointer',
                    background: 'linear-gradient(145deg,#0f1f3d,#1b2f58)', border: '1px solid rgba(245,166,35,0.18)' }}>
                  <p style={{ fontSize: 26, marginBottom: 10 }}>👑</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Go Premium</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', lineHeight: 1.65 }}>
                    Unlimited questions, richer feedback, advanced difficulty.
                  </p>
                  <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#f5a623' }}>Upgrade now →</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </PageTransition>
  )
}

export default Interview