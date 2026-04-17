import { useMemo } from 'react'
import { motion as Motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Button from '../components/common/Button'

function Feedback() {
  const location = useLocation()
  const feedbackResponse = useMemo(() => {
    if (location.state?.feedbackResponse) {
      return location.state.feedbackResponse
    }

    const stored = window.localStorage.getItem('hilearn_feedback')
    return stored ? JSON.parse(stored) : null
  }, [location.state])

  if (!feedbackResponse) {
    return (
      <Motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="section-shell py-14">
        <div className="glass-panel mx-auto max-w-3xl rounded-[2rem] p-10 text-center shadow-lg shadow-sky-100/40">
          <h1 className="text-3xl font-semibold text-slate-950">No feedback available yet</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Complete an interview round first to see scorecards, communication analysis, and suggestions here.
          </p>
          <Button to="/interview" className="mt-8">
            Start interview
          </Button>
        </div>
      </Motion.div>
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
    <Motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="section-shell py-14">
      <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">Feedback summary</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">Clear signals, not vague advice.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50/90">
              Review the backend response in a polished layout that keeps scoring, communication, and next steps easy to understand.
            </p>
          </div>
          <div className="rounded-[1.4rem] bg-white/14 px-5 py-4 backdrop-blur">
            <p className="text-sm text-blue-100">Questions completed</p>
            <p className="mt-1 text-3xl font-semibold">{questions_answered}/{total_questions}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <section className="glass-panel rounded-[2rem] p-8 shadow-lg shadow-sky-100/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Answer scorecard</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Breakdown by quality and relevance.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Review the backend response in a student-friendly layout with strong hierarchy and simple next actions.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Progress</p>
              <p className="mt-2 text-2xl font-semibold">{questions_answered}/{total_questions}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scoreCards.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{Number(item.value).toFixed(1)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50/80 p-6">
              <h2 className="text-lg font-semibold text-emerald-900">Strengths</h2>
              <div className="mt-4 space-y-3">
                {feedback.strengths?.length ? feedback.strengths.map((item) => (
                  <p key={item} className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-emerald-900">{item}</p>
                )) : <p className="text-sm text-emerald-800">No strengths were returned for this answer.</p>}
              </div>
            </div>
            <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50/80 p-6">
              <h2 className="text-lg font-semibold text-amber-900">Improvements</h2>
              <div className="mt-4 space-y-3">
                {feedback.improvements?.length ? feedback.improvements.map((item) => (
                  <p key={item} className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-amber-900">{item}</p>
                )) : <p className="text-sm text-amber-800">No improvement points were returned for this answer.</p>}
              </div>
            </div>
          </div>

          {(feedback.ideal_answer_hint || feedback.lms_course_recommendation) && (
            <div className="mt-6 rounded-[1.6rem] border border-sky-200 bg-sky-50/80 p-6">
              <h2 className="text-lg font-semibold text-slate-950">Suggested next step</h2>
              {feedback.ideal_answer_hint && <p className="mt-4 text-sm leading-7 text-slate-700">{feedback.ideal_answer_hint}</p>}
              {feedback.lms_course_recommendation && (
                <p className="mt-3 text-sm font-medium text-sky-800">{feedback.lms_course_recommendation}</p>
              )}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-7 shadow-lg shadow-sky-100/40">
            <h2 className="text-xl font-semibold text-slate-950">Communication analysis</h2>
            <div className="mt-6 space-y-5">
              {[
                { label: 'Confidence score', value: communication.confidence_score || 0 },
                { label: 'Clarity score', value: communication.clarity_score || 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span>{Number(item.value).toFixed(1)}/10</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                      style={{ width: `${Math.min(Number(item.value) * 10, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="rounded-[1.4rem] border border-white/70 bg-white/80 p-5">
                <p className="text-sm text-slate-500">Filler words detected</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{communication.filler_words_count || 0}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {(communication.filler_words_detected || []).join(', ') || 'No filler words reported.'}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/70 bg-white/80 p-5">
                <p className="text-sm text-slate-500">Speaking pace</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {communication.speaking_pace_wpm ? `${communication.speaking_pace_wpm} WPM` : 'Not available'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-7 shadow-lg shadow-sky-100/40">
            <h2 className="text-xl font-semibold text-slate-950">What happens next</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Session status: <span className="font-semibold capitalize text-slate-900">{session_status}</span>
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {next_question ? 'The next backend-generated question is ready if you want to continue.' : 'This round is complete. You can start another role-based session anytime.'}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button to="/interview" className="justify-center">
                Continue practicing
              </Button>
              <Button to="/dashboard" variant="secondary" className="justify-center">
                Open dashboard
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Motion.div>
  )
}

export default Feedback
