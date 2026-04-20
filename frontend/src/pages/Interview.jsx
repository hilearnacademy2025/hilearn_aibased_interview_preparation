import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'
import { startInterview, submitAnswer } from '../utils/api'

const interviewTypes = [
  { value: 'technical', label: 'Technical', description: 'Coding, systems, technical depth' },
  { value: 'behavioral', label: 'Behavioral', description: 'Stories, teamwork, leadership' },
  { value: 'hr', label: 'HR', description: 'Fit, motivation, communication' },
  { value: 'domain_specific', label: 'Domain specific', description: 'Industry and role context' },
]

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', description: 'Foundational questions' },
  { value: 'intermediate', label: 'Intermediate', description: 'Practical scenario prompts' },
  { value: 'advanced', label: 'Advanced', description: 'Complex, high-pressure prompts' },
]

function Interview() {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [stage, setStage] = useState('setup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  const [session, setSession] = useState(null)
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [wordPulse, setWordPulse] = useState(false)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [form, setForm] = useState({
    user_id: 'student_demo',
    job_role: '',
    interview_type: 'technical',
    difficulty: 'intermediate',
    tech_stack: '',
    resume_text: '',
    target_companies: '',
  })
  const timerRef = useRef(null)

  useEffect(() => {
    document.title = 'Interview Practice | HiLearn AI Mock Interview'
  }, [])

  useEffect(() => {
    if (stage === 'live') {
      timerRef.current = window.setInterval(() => setTimer((prev) => prev + 1), 1000)
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [stage, question?.question_id])

  const wordCount = useMemo(() => {
    const trimmed = answer.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
  }, [answer])

  useEffect(() => {
    if (wordCount > 0 && wordCount % 50 === 0) {
      setWordPulse(true)
      const timeout = window.setTimeout(() => setWordPulse(false), 450)
      return () => window.clearTimeout(timeout)
    }
    return undefined
  }, [wordCount])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0')
    const seconds = String(timer % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [timer])

  const progressPercent = useMemo(() => {
    if (!session?.total_questions) return 0
    return Math.min((currentQuestionNumber / session.total_questions) * 100, 100)
  }, [currentQuestionNumber, session?.total_questions])

  const handleStartInterview = async () => {
    if (!form.job_role.trim()) {
      setError('Add your target job role to start the interview.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
        target_companies: form.target_companies ? form.target_companies.split(',').map((item) => item.trim()).filter(Boolean) : undefined,
        resume_text: form.resume_text || undefined,
      }
      const response = await startInterview(payload)
      setSession(response)
      setQuestion(response.first_question)
      setStage('live')
      setTimer(0)
      setCurrentQuestionNumber(1)
      window.localStorage.setItem('hilearn_session_id', response.session_id)
      pushToast({
        title: 'Interview room is live',
        description: 'Your first question is ready.',
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim() || !session || !question) {
      setError('Write your answer before sending it for feedback.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const response = await submitAnswer({
        session_id: session.session_id,
        question_id: question.question_id,
        answer_text: answer,
        answer_duration_seconds: timer,
      })
      window.localStorage.setItem('hilearn_latest_score', String(response.feedback.overall_score))
      window.localStorage.setItem('hilearn_feedback', JSON.stringify(response))

      pushToast({
        title: 'Answer submitted',
        description: 'Feedback was saved and your progress is updated.',
      })

      if (response.next_question) {
        setQuestion(response.next_question)
        setAnswer('')
        setTimer(0)
        setCurrentQuestionNumber((prev) => prev + 1)
        if (timerRef.current) window.clearInterval(timerRef.current)
      } else {
        if (timerRef.current) window.clearInterval(timerRef.current)
        navigate('/feedback', { state: { feedbackResponse: response, session } })
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && stage === 'setup') {
    return <Loader label="Starting your interview room..." />
  }

  return (
    <PageTransition>
      <section className="section-shell">
        {stage === 'setup' && (
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="navy-panel relative overflow-hidden rounded-[32px] p-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="ambient-blob -left-10 top-0 h-44 w-44 bg-[#c8601a]/30"
                />
                <div className="relative">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/55">Interview setup</p>
                  <h1 className="display-font mt-3 text-5xl font-bold text-white">Step into a focused practice room.</h1>
                  <p className="mt-4 text-lg leading-8 text-white/70">
                    Choose interview type, role, and difficulty. The API flow and state logic stay exactly as they are while the room becomes visually richer.
                  </p>
                  <div className="mt-6 space-y-3 text-sm text-white/76">
                    {[
                      'Backend-connected session launch',
                      'Live answer submission and scoring',
                      'Lightweight local storage for continuity',
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="surface-card px-6 py-7">
                <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Session benefits</p>
                <div className="mt-5 grid gap-3">
                  {[
                    'Warm-focus setup that lowers friction before a session',
                    'Animated selection cards for interview type and difficulty',
                    'Clean field treatment with subtle amber focus states',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-4 text-sm text-[#5c5a57]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Configuration</p>
                <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Build your interview room.</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Target role</span>
                  <input
                    value={form.job_role}
                    onChange={(event) => setForm((prev) => ({ ...prev, job_role: event.target.value }))}
                    placeholder="Frontend Developer, Data Analyst, SDE Intern"
                    className="warm-input"
                  />
                </label>

                <div className="space-y-3 md:col-span-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Interview type</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {interviewTypes.map((item) => {
                      const selected = form.interview_type === item.value
                      return (
                        <motion.button
                          key={item.value}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setForm((prev) => ({ ...prev, interview_type: item.value }))}
                          className={`relative rounded-[24px] border px-4 py-5 text-left transition ${selected ? 'border-[#c8601a] bg-[#fff4ea]' : 'border-[#e0dbd3] bg-white'}`}
                        >
                          {selected && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#c8601a] text-xs text-white"
                            >
                              ✓
                            </motion.span>
                          )}
                          <p className="text-lg font-semibold text-[#0f1f3d]">{item.label}</p>
                          <p className="mt-2 text-sm text-[#5c5a57]">{item.description}</p>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Difficulty</span>
                  <div className="flex flex-wrap gap-3">
                    {difficultyOptions.map((item) => {
                      const selected = form.difficulty === item.value
                      return (
                        <motion.button
                          key={item.value}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                          onClick={() => setForm((prev) => ({ ...prev, difficulty: item.value }))}
                          className={`rounded-full border px-5 py-3 text-sm font-medium transition ${selected ? 'border-[#c8601a] bg-[#fff4ea] text-[#c8601a]' : 'border-[#e0dbd3] bg-white text-[#5c5a57]'}`}
                        >
                          {item.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Tech stack</span>
                  <input
                    value={form.tech_stack}
                    onChange={(event) => setForm((prev) => ({ ...prev, tech_stack: event.target.value }))}
                    placeholder="React, Python, Java"
                    className="warm-input"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Target companies</span>
                  <input
                    value={form.target_companies}
                    onChange={(event) => setForm((prev) => ({ ...prev, target_companies: event.target.value }))}
                    placeholder="Google, TCS, Amazon"
                    className="warm-input"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-[#5c5a57]">Resume summary</span>
                  <textarea
                    rows={4}
                    value={form.resume_text}
                    onChange={(event) => setForm((prev) => ({ ...prev, resume_text: event.target.value }))}
                    placeholder="Paste a short summary to personalize the session..."
                    className="warm-input resize-none"
                  />
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button onClick={handleStartInterview} className="mt-6 w-full justify-center py-4 text-base">
                Start interview <motion.span whileHover={{ x: 4 }}>→</motion.span>
              </Button>
            </motion.div>
          </div>
        )}

        {stage === 'live' && session && question && (
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="navy-panel rounded-[32px] p-7">
                <p className="text-sm uppercase tracking-[0.24em] text-white/55">Session</p>
                <h2 className="display-font mt-3 text-4xl font-bold text-white">{session.job_role}</h2>
                <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/78">
                  <span className="rounded-full bg-white/10 px-3 py-2 capitalize">{session.interview_type}</span>
                  <span className="rounded-full bg-white/10 px-3 py-2 capitalize">{session.difficulty}</span>
                  <span className="rounded-full bg-white/10 px-3 py-2">{session.total_questions} questions</span>
                </div>
              </div>

              <div className="surface-card px-6 py-7">
                <p className="text-sm uppercase tracking-[0.22em] text-[#9c9a96]">Elapsed time</p>
                <motion.p
                  animate={timer >= 270 ? { scale: [1, 1.03, 1], color: ['#c8601a', '#ae5317', '#c8601a'] } : {}}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="mt-3 display-font text-5xl font-bold text-[#0f1f3d]"
                >
                  {formattedTime}
                </motion.p>
                <div className="mt-4 h-3 rounded-full bg-[#f0ebe3]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((timer / 300) * 100, 100)}%` }}
                    className="h-3 rounded-full bg-[#c8601a]"
                  />
                </div>
                <p className="mt-3 text-sm text-[#5c5a57]">The timer pulses amber when you dip under 30 seconds of the five-minute pacing window.</p>
              </div>

              <div className="surface-card px-6 py-7">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.22em] text-[#9c9a96]">Progress</p>
                  <span className="text-sm text-[#5c5a57]">Question {currentQuestionNumber}/{session.total_questions}</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-[#f0ebe3]">
                  <motion.div animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} className="h-3 rounded-full bg-[#0f1f3d]" />
                </div>
                <div className="mt-4 flex gap-2">
                  {Array.from({ length: session.total_questions }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentQuestionNumber ? 1 : 0.25 }}
                      style={{ transformOrigin: 'left' }}
                      className={`h-2 flex-1 rounded-full ${index < currentQuestionNumber ? 'bg-[#c8601a]' : 'bg-[#e0dbd3]'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                key={question.question_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="surface-card px-6 py-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#c8601a]">AI interviewer</p>
                    <h1 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Question {currentQuestionNumber}</h1>
                  </div>
                  <span className="rounded-full bg-[#fff4ea] px-4 py-2 text-sm font-medium text-[#c8601a]">
                    {question.topic || 'Live round'}
                  </span>
                </div>
                <div className="mt-6 rounded-[28px] border border-[#e0dbd3] bg-[#fffaf4] p-6">
                  <p className="text-lg leading-8 text-[#111827]">{question.question_text}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="surface-card px-6 py-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Your answer</h2>
                    <p className="mt-2 text-sm text-[#5c5a57]">Type naturally and keep your answer structured.</p>
                  </div>
                  <motion.span
                    animate={wordPulse ? { y: [0, -6, 0] } : {}}
                    className="rounded-full bg-[#fff4ea] px-4 py-2 text-sm font-medium text-[#c8601a]"
                  >
                    {wordCount} words
                  </motion.span>
                </div>
                <textarea
                  rows={10}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Structure your answer with context, action, and outcomes..."
                  className="warm-input mt-5 resize-none px-5 py-4"
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={handleSubmit} className="flex-1 justify-center py-4" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit for AI feedback'}
                  </Button>
                  <Button variant="secondary" onClick={() => setAnswer('')} className="flex-1 justify-center py-4">
                    Clear answer
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </section>
    </PageTransition>
  )
}

export default Interview
