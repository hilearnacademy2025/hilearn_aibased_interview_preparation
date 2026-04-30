import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Loader, ChevronRight, CheckCircle2, XCircle, Volume2, Clock } from 'lucide-react'
import { submitMCQ } from '../../utils/api'
import useQuestionTimer from '../../hooks/useQuestionTimer'

export default function UserMCQInterview() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [questionNum, setQuestionNum] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(10)
  const [totalScore, setTotalScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')

  // The custom hook for 2-minute countdown
  const { formattedTime, isWarning } = useQuestionTimer(questionNum, () => {
    if (!submitting && !feedback) {
      // Auto-submit logic when time is up
      if (!selectedAnswer) {
        setSelectedAnswer('Z') // Dummy answer to force submission and get wrong mark
      }
      handleSubmit()
    }
  })

  // Load session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('hilearn_mcq_session')
    if (!stored) {
      console.log('No session, going to setup');
      navigate('/user/interview-setup')
      return
    }
    try {
      const data = JSON.parse(stored)
      setSession(data)
      setCurrentQuestion(data.first_question)
      setTotalQuestions(data.total_questions || 10)
    } catch {
      navigate('/user/interview-setup')
    }
  }, [navigate])

  // ── Voice Recognition ──────────────────────────────────────────────
  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setListening(true)
      setVoiceText('Listening...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toUpperCase()
      setVoiceText(transcript)
      setListening(false)

      // Map voice input to answer
      const mapping = {
        'A': 'A', 'OPTION A': 'A', 'AY': 'A', 'ALPHA': 'A',
        'B': 'B', 'OPTION B': 'B', 'BEE': 'B', 'BRAVO': 'B',
        'C': 'C', 'OPTION C': 'C', 'SEE': 'C', 'CHARLIE': 'C',
        'D': 'D', 'OPTION D': 'D', 'DEE': 'D', 'DELTA': 'D',
      }

      const answer = mapping[transcript] || transcript.charAt(0)
      if (['A', 'B', 'C', 'D'].includes(answer)) {
        setSelectedAnswer(answer)
        setVoiceText(`Detected: ${answer}`)
      } else {
        setVoiceText(`"${transcript}" — couldn't map to A/B/C/D. Try again.`)
      }
    }

    recognition.onerror = (event) => {
      setListening(false)
      setVoiceText(`Error: ${event.error}. Try again.`)
    }

    recognition.onend = () => setListening(false)
    recognition.start()
  }, [])

  // ── Submit Answer ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion || !session) return
    setSubmitting(true)

    try {
      const result = await submitMCQ({
        session_id: session.session_id,
        question_id: currentQuestion.question_id,
        answer: selectedAnswer,
      })

      setFeedback(result)
      setTotalScore(result.total_score || 0)
      setAnswers(prev => [...prev, {
        question: currentQuestion,
        userAnswer: selectedAnswer,
        isCorrect: result.is_correct,
        correctAnswer: result.correct_answer,
        explanation: result.explanation,
        score: result.score,
      }])

      if (result.session_complete) {
        setIsComplete(true)
        // Save results for the results page
        localStorage.setItem('hilearn_mcq_results', JSON.stringify({
          session_id: session.session_id,
          total_score: result.total_score,
          total_questions: result.total_questions,
          job_role: session.job_role,
          difficulty: session.difficulty,
          answers: [...answers, {
            question: currentQuestion,
            userAnswer: selectedAnswer,
            isCorrect: result.is_correct,
            correctAnswer: result.correct_answer,
            explanation: result.explanation,
            score: result.score,
          }],
        }))
      } else {
        // Auto-advance to next question after 3 seconds
        setTimeout(() => {
          setCurrentQuestion(result.next_question)
          setQuestionNum(prev => prev + 1)
          setSelectedAnswer('')
          setFeedback(null)
          setVoiceText('')
        }, 3000)
      }
    } catch (err) {
      console.error('MCQ submit failed:', err)
      setFeedback({ error: err.message || 'Failed to submit answer.' })
    } finally {
      setSubmitting(false)
    }
  }

  // ── View Results ───────────────────────────────────────────────────
  const handleViewResults = () => {
    navigate('/user/mcq-results')
  }

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader size={24} className="animate-spin text-[#c8601a]" />
      </div>
    )
  }

  const progressPct = (questionNum / totalQuestions) * 100
  const options = [
    { key: 'A', text: currentQuestion.option_a },
    { key: 'B', text: currentQuestion.option_b },
    { key: 'C', text: currentQuestion.option_c },
    { key: 'D', text: currentQuestion.option_d },
  ]

  // ── Complete Screen ────────────────────────────────────────────────
  if (isComplete) {
    const correctCount = answers.filter(a => a.isCorrect).length
    const pct = Math.round((correctCount / totalQuestions) * 100)
    const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Practicing' : 'Needs Work'
    const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface-card p-8 text-center"
        >
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '📚'}</div>
          <h1 className="display-font text-3xl font-bold text-[#0f1f3d]">MCQ Complete!</h1>
          <div className="mt-6 inline-flex items-center gap-3 px-8 py-4 rounded-2xl" style={{ background: `${gradeColor}15` }}>
            <span className="text-4xl font-bold" style={{ color: gradeColor }}>{totalScore}</span>
            <span className="text-lg text-[#9c9a96]">/ {totalQuestions * 10}</span>
          </div>
          <p className="mt-3 text-lg font-semibold" style={{ color: gradeColor }}>{grade}</p>
          <p className="mt-1 text-sm text-[#9c9a96]">{correctCount} of {totalQuestions} correct ({pct}%)</p>

          <div className="mt-8 flex gap-3 justify-center">
            <button
              onClick={handleViewResults}
              className="px-6 py-3 bg-[#c8601a] text-white rounded-full font-semibold shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition text-sm"
            >
              View Detailed Results →
            </button>
            <button
              onClick={() => navigate('/user/interview-setup')}
              className="px-6 py-3 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a] transition text-sm"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">MCQ Interview</p>
            <h1 className="display-font text-2xl font-bold text-[#0f1f3d] mt-1">
              Question {questionNum} of {totalQuestions}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex flex-col items-end transition ${isWarning ? 'text-rose-600 animate-pulse font-bold' : 'text-[#0f1f3d]'}`}>
              <div className="flex items-center gap-1.5 text-sm font-mono">
                <Clock size={14} className={isWarning ? 'text-rose-600' : 'text-[#c8601a]'} />
                {formattedTime}
              </div>
            </div>
            <div className="text-right border-l-2 border-[#e0dbd3] pl-4">
              <p className="text-xs text-[#9c9a96]">Score</p>
              <p className="text-lg font-bold text-[#c8601a]">{totalScore}</p>
            </div>
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              className={`p-2.5 rounded-xl border-2 transition ${voiceMode
                ? 'border-[#c8601a] bg-[#c8601a]/10 text-[#c8601a]'
                : 'border-[#e0dbd3] text-[#9c9a96] hover:border-[#c8601a]/50'
              }`}
              title={voiceMode ? 'Switch to text mode' : 'Switch to voice mode'}
            >
              {voiceMode ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-[#f0ebe3] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#c8601a] to-[#e88a4a]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.question_id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="surface-card p-6"
        >
          {/* Question Text */}
          <div className="mb-6">
            <p className="text-base font-semibold text-[#0f1f3d] leading-relaxed">
              {currentQuestion.question_text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options.map(opt => {
              const isSelected = selectedAnswer === opt.key
              const isCorrect = feedback && opt.key === feedback.correct_answer
              const isWrong = feedback && isSelected && !feedback.is_correct

              let borderColor = 'border-[#e0dbd3]'
              let bgColor = ''
              let textColor = 'text-[#5c5a57]'

              if (feedback) {
                if (isCorrect) {
                  borderColor = 'border-emerald-400'
                  bgColor = 'bg-emerald-50'
                  textColor = 'text-emerald-700'
                } else if (isWrong) {
                  borderColor = 'border-rose-400'
                  bgColor = 'bg-rose-50'
                  textColor = 'text-rose-700'
                }
              } else if (isSelected) {
                borderColor = 'border-[#c8601a]'
                bgColor = 'bg-[#c8601a]/5'
                textColor = 'text-[#c8601a]'
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => !feedback && setSelectedAnswer(opt.key)}
                  disabled={!!feedback}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${borderColor} ${bgColor} ${feedback ? 'cursor-default' : 'hover:border-[#c8601a]/50 cursor-pointer'}`}
                >
                  <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${isSelected && !feedback
                    ? 'bg-[#c8601a] text-white'
                    : isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#f4f2ee] text-[#5c5a57]'
                    }`}>
                    {feedback && isCorrect ? <CheckCircle2 size={16} /> : feedback && isWrong ? <XCircle size={16} /> : opt.key}
                  </span>
                  <span className={`text-sm font-medium ${textColor}`}>{opt.text}</span>
                </button>
              )
            })}
          </div>

          {/* Voice Input */}
          {voiceMode && !feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-xl bg-[#0f1f3d]/5 border border-[#0f1f3d]/10"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={startVoiceInput}
                  disabled={listening}
                  className={`p-3 rounded-full transition ${listening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-[#c8601a] text-white hover:bg-[#b0541a]'
                  }`}
                >
                  <Mic size={20} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0f1f3d]">
                    {listening ? '🎤 Listening...' : 'Click to speak your answer'}
                  </p>
                  {voiceText && (
                    <p className="text-xs text-[#9c9a96] mt-1">{voiceText}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Banner */}
          <AnimatePresence>
            {feedback && !feedback.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-5 p-4 rounded-xl border-2 ${feedback.is_correct
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-rose-300 bg-rose-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {feedback.is_correct
                    ? <CheckCircle2 size={20} className="text-emerald-600" />
                    : <XCircle size={20} className="text-rose-600" />
                  }
                  <span className={`font-bold text-sm ${feedback.is_correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {feedback.is_correct ? '✅ Correct! +10 points' : `❌ Incorrect — Answer: ${feedback.correct_answer}`}
                  </span>
                </div>
                <p className="text-sm text-[#5c5a57] leading-relaxed">
                  💡 {feedback.explanation}
                </p>
                <p className="text-xs text-[#9c9a96] mt-2">Next question in 3 seconds...</p>
              </motion.div>
            )}
            {feedback?.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 p-4 rounded-xl border-2 border-rose-300 bg-rose-50"
              >
                <p className="text-sm text-rose-700">{feedback.error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          {!feedback && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || submitting}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#c8601a] text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? <><Loader size={16} className="animate-spin" /> Submitting...</>
                : <>Submit Answer <ChevronRight size={16} /></>
              }
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
