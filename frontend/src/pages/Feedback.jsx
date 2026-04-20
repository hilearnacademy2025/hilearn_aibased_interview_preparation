import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../components/common/Button'
import AnimatedCounter from '../components/common/AnimatedCounter'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'
import { useScoreCelebration } from '../components/common/useScoreCelebration'

function CircularScore({ score }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(score, 10) / 10) * circumference

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#eadfd2" strokeWidth="12" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#c8601a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <AnimatedCounter value={score} decimals={1} className="display-font text-4xl font-bold text-[#0f1f3d]" />
        <p className="text-sm text-[#9c9a96]">overall</p>
      </div>
    </div>
  )
}

function Feedback() {
  const location = useLocation()
  const { pushToast } = useToast()

  useEffect(() => {
    document.title = 'Interview Feedback | HiLearn Score & Analysis'
  }, [])

  const feedbackResponse = useMemo(() => {
    if (location.state?.feedbackResponse) return location.state.feedbackResponse
    const stored = window.localStorage.getItem('hilearn_feedback')
    return stored ? JSON.parse(stored) : null
  }, [location.state])

  useEffect(() => {
    if (feedbackResponse) {
      pushToast({
        title: 'Feedback loaded',
        description: 'Your scorecards and communication signals are ready.',
      })
    }
  }, [feedbackResponse, pushToast])

  useScoreCelebration(Number(feedbackResponse?.feedback?.overall_score || 0) > 8)

  if (!feedbackResponse) {
    return (
      <PageTransition>
        <section className="section-shell py-10">
          <div className="surface-card mx-auto max-w-3xl px-8 py-14 text-center">
            <h1 className="display-font text-4xl font-bold text-[#0f1f3d]">No feedback available yet</h1>
            <p className="mt-4 text-[#5c5a57]">Complete an interview round first to see scorecards and analysis.</p>
            <Button to="/interview" className="mt-8">Start interview</Button>
          </div>
        </section>
      </PageTransition>
    )
  }

  const { feedback, questions_answered, total_questions, session_status, next_question } = feedbackResponse
  const communication = feedback.communication || {}
  const scoreCards = [
    { label: 'Overall', value: feedback.overall_score },
    { label: 'Content', value: feedback.content_score },
    { label: 'Completeness', value: feedback.completeness_score },
    { label: 'Relevance', value: feedback.relevance_score },
  ]

  return (
    <PageTransition>
      <section className="section-shell">
        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="surface-card px-6 py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Feedback summary</p>
                <h1 className="display-font mt-3 text-5xl font-bold text-[#0f1f3d]">Clear signals, not vague advice.</h1>
                <p className="mt-4 max-w-xl text-lg leading-8 text-[#5c5a57]">Scorecards, strengths, and communication guidance in a warm premium layout.</p>
              </div>
              <CircularScore score={Number(feedback.overall_score)} />
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {scoreCards.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                  className="rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5"
                >
                  <p className="text-sm text-[#9c9a96]">{item.label}</p>
                  <AnimatedCounter value={Number(item.value)} decimals={1} className="mt-3 block text-3xl font-semibold text-[#0f1f3d]" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="navy-panel rounded-[32px] p-8">
            <p className="text-sm uppercase tracking-[0.22em] text-white/55">Session progress</p>
            <p className="mt-3 display-font text-5xl font-bold">{questions_answered}/{total_questions}</p>
            <p className="mt-3 text-white/70">Session status: <span className="capitalize">{session_status}</span></p>
            <div className="mt-8 space-y-4">
              {[
                { label: 'Confidence score', value: communication.confidence_score || 0 },
                { label: 'Clarity score', value: communication.clarity_score || 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm text-white/70">
                    <span>{item.label}</span>
                    <span>{Number(item.value).toFixed(1)}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(item.value * 10, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-3 rounded-full bg-[#c8601a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Strengths</h2>
            <div className="mt-5 space-y-3">
              {feedback.strengths?.length ? feedback.strengths.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-900"
                >
                  {item}
                </motion.div>
              )) : <p className="text-sm text-[#9c9a96]">None returned</p>}
            </div>
          </div>

          <div className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Improvements</h2>
            <div className="mt-5 space-y-3">
              {feedback.improvements?.length ? feedback.improvements.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[22px] border border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-900"
                >
                  {item}
                </motion.div>
              )) : <p className="text-sm text-[#9c9a96]">None returned</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Communication analysis</h2>
            <div className="mt-6 space-y-5">
              <div className="rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <p className="text-sm text-[#9c9a96]">Filler words detected</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f1f3d]">{communication.filler_words_count || 0}</p>
                <p className="mt-2 text-sm text-[#5c5a57]">{(communication.filler_words_detected || []).join(', ') || 'None'}</p>
              </div>
              <div className="rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                <p className="text-sm text-[#9c9a96]">Speaking pace</p>
                <p className="mt-2 text-2xl font-semibold text-[#0f1f3d]">{communication.speaking_pace_wpm ? `${communication.speaking_pace_wpm} WPM` : 'Not available'}</p>
              </div>
              {(feedback.ideal_answer_hint || feedback.lms_course_recommendation) && (
                <div className="rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Suggested next step</p>
                  {feedback.ideal_answer_hint && <p className="mt-3 text-[#5c5a57]">{feedback.ideal_answer_hint}</p>}
                  {feedback.lms_course_recommendation && <p className="mt-3 text-sm font-medium text-[#0f1f3d]">{feedback.lms_course_recommendation}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">What happens next</h2>
            <p className="mt-4 text-[#5c5a57]">{next_question ? 'Next question ready.' : 'Round complete. Start a new session.'}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button to="/interview">Continue practicing</Button>
              <Button to="/dashboard" variant="secondary">Open dashboard</Button>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

export default Feedback
