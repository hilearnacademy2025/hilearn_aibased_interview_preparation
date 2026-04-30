
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Send, Mic, MicOff, Clock, Loader } from 'lucide-react'
import { submitAnswer, transcribeAudio } from '../../utils/api'
import { useToast } from '../../components/common/ToastProvider'
import useQuestionTimer from '../../hooks/useQuestionTimer'

export default function UserInterview() {
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [session] = useState(() => {
    const saved = localStorage.getItem('hilearn_interview_session')
    return saved ? JSON.parse(saved) : null
  })
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem('hilearn_current_question')
    return saved ? JSON.parse(saved) : null
  })
  const [messages, setMessages] = useState(() => {
    if (localStorage.getItem('hilearn_current_question')) {
      const q = JSON.parse(localStorage.getItem('hilearn_current_question'))
      return [{ id: 1, type: 'ai', text: q.question_text }]
    }
    return [{ id: 1, type: 'ai', text: 'Loading your interview...' }]
  })
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [questionsCount, setQuestionsCount] = useState(1)
  const [totalQuestions] = useState(() => {
    const s = localStorage.getItem('hilearn_interview_session')
    return s ? JSON.parse(s).total_questions || 10 : 10
  })

  // ── Audio Recording State ──────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [useBackendSTT, setUseBackendSTT] = useState(true)  // prefer backend STT

  const bottomRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // The custom hook for 2-minute countdown
  const { formattedTime, isWarning } = useQuestionTimer(questionsCount, () => {
    // Auto-submit when time is up
    if (!loading) {
      pushToast({ title: 'Time is up!', description: 'Moving to next step...', type: 'warning' })
      handleSend()
    }
  })

  // Timer for backend payload (duration taken)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!session || !currentQuestion) {
      pushToast({ title: 'No active session', description: 'Please start an interview first.', type: 'error' })
      navigate('/user/interview-setup')
    }
  }, [session, currentQuestion, navigate, pushToast])

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ── Backend STT via MediaRecorder ──────────────────────────────────────────
  const startBackendRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []

      // Prefer webm/opus for smaller size; fallback to default
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        // Stop all tracks to release mic indicator
        stream.getTracks().forEach(t => t.stop())
        setIsTranscribing(true)
        try {
          const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' })
          const result = await transcribeAudio(blob, 'recording.webm')
          if (result?.transcription) {
            setAnswer(prev => (prev ? prev + ' ' : '') + result.transcription.trim())
            pushToast({ title: 'Transcribed ✓', description: 'Voice converted to text.', type: 'success' })
          } else {
            pushToast({ title: 'No speech detected', description: 'Please try again.', type: 'error' })
          }
        } catch (err) {
          // Backend STT failed → fallback to browser STT
          pushToast({ title: 'Backend STT failed', description: 'Switching to browser voice input.', type: 'error' })
          setUseBackendSTT(false)
        } finally {
          setIsTranscribing(false)
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      pushToast({ title: 'Mic access denied', description: 'Allow microphone access in browser settings.', type: 'error' })
    }
  }, [pushToast])

  const stopBackendRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  // ── Browser WebkitSpeechRecognition fallback ───────────────────────────────
  const recognitionRef = useRef(null)

  const startBrowserSTT = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      pushToast({ title: 'Not supported', description: 'Voice input not supported in this browser.', type: 'error' })
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      setAnswer(prev => (prev ? prev + ' ' : '') + text)
    }
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => {
      setIsRecording(false)
      pushToast({ title: 'Voice input error', description: 'Please try again.', type: 'error' })
    }
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [pushToast])

  const stopBrowserSTT = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  // ── Toggle Mic ─────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (isTranscribing) return
    if (isRecording) {
      useBackendSTT ? stopBackendRecording() : stopBrowserSTT()
    } else {
      useBackendSTT ? startBackendRecording() : startBrowserSTT()
    }
  }, [isRecording, isTranscribing, useBackendSTT, startBackendRecording, stopBackendRecording, startBrowserSTT, stopBrowserSTT])

  // ── Submit Answer ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    // If answer is empty and time is up, submit a generic text so the interview continues
    const finalAnswer = answer.trim() || "No answer provided within the time limit."
    if (!answer.trim() && !loading && formattedTime !== "0:00") return
    
    if (loading) return
    if (!session || !currentQuestion) {
      pushToast({ title: 'Error', description: 'Interview session missing. Please restart.', type: 'error' })
      navigate('/user/interview-setup')
      return
    }

    const userMsg = { id: messages.length + 1, type: 'user', text: finalAnswer }
    setMessages(prev => [...prev, userMsg])
    setAnswer('')
    setLoading(true)

    try {
      const payload = {
        session_id: session.session_id,
        question_id: currentQuestion.question_id,
        answer_text: userMsg.text,
        answer_duration_seconds: timer,
      }
      const data = await submitAnswer(payload)

      localStorage.setItem('hilearn_latest_feedback', JSON.stringify(data.feedback))

      let aiText = ''
      if (data.next_question) {
        const score = data.feedback?.overall_score
        aiText = `**Feedback:** ${data.feedback?.strengths?.[0] || 'Good attempt!'}${score != null ? ` (Score: ${score}/10)` : ''}\n\n**Next question:** ${data.next_question.question_text}`
        setCurrentQuestion(data.next_question)
        localStorage.setItem('hilearn_current_question', JSON.stringify(data.next_question))
        setQuestionsCount(prev => prev + 1)
        setTimer(0)
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      } else {
        aiText = `**Interview Complete! 🎉**\n\nFinal Score: ${data.feedback?.overall_score ?? '—'}/10\n\nRedirecting to your feedback summary...`
        localStorage.removeItem('hilearn_interview_session')
        localStorage.removeItem('hilearn_current_question')
        localStorage.setItem('hilearn_complete_feedback', JSON.stringify(data))
        setTimeout(() => navigate('/user/feedback'), 2000)
      }
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: aiText }])
    } catch (err) {
      pushToast({ title: 'Submission failed', description: err.message, type: 'error' })
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: "Let's continue — please try again or type your answer." }])
    } finally {
      setLoading(false)
    }
  }

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader className="animate-spin text-[#c8601a]" size={32} />
        <p className="ml-3 text-[#5c5a57]">Loading interview session...</p>
      </div>
    )
  }

  const micBusy = isRecording || isTranscribing

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#c8601a] font-semibold">Live Interview</p>
          <p className="text-sm font-bold text-[#0f1f3d] mt-0.5">
            {session.job_role || 'Mock Interview'} · {session.interview_type || 'Technical'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 text-sm font-mono transition ${isWarning ? 'text-rose-600 animate-pulse font-bold' : 'text-[#0f1f3d]'}`}>
            <Clock size={14} className={isWarning ? 'text-rose-600' : 'text-[#c8601a]'} /> 
            {formattedTime} left
          </div>
          <span className="text-xs bg-[#f4f2ee] text-[#5c5a57] px-3 py-1 rounded-full font-semibold">
            Q{questionsCount}/{totalQuestions}
          </span>
        </div>
      </motion.div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.type === 'ai'
                ? 'bg-white border border-[#e0dbd3] text-[#0f1f3d] shadow-sm'
                : 'bg-[#c8601a] text-white shadow-md shadow-[#c8601a]/20'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-xs font-bold">AI</div>
            <div className="bg-white border border-[#e0dbd3] rounded-2xl px-4 py-3">
              <Loader size={16} className="animate-spin text-[#c8601a]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-4">
        <div className="flex gap-3 items-end">
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Type your answer here… (Enter to send, Shift+Enter for new line)"
            rows={3}
            className="warm-input flex-1 resize-none text-sm"
          />
          <div className="flex flex-col gap-2">
            {/* Mic button */}
            <button
              onClick={toggleMic}
              disabled={isTranscribing}
              title={useBackendSTT ? 'Backend AI Transcription' : 'Browser Voice Input'}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition relative ${
                isTranscribing
                  ? 'bg-amber-400 text-white cursor-wait'
                  : isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#f4f2ee] text-[#5c5a57] hover:bg-[#e0dbd3]'
              }`}>
              {isTranscribing
                ? <Loader size={18} className="animate-spin" />
                : isRecording
                ? <MicOff size={18} />
                : <Mic size={18} />}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={loading || !answer.trim()}
              className="w-11 h-11 rounded-xl bg-[#c8601a] text-white flex items-center justify-center hover:bg-[#b0541a] transition disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-[#9c9a96]">
            {isTranscribing
              ? '⏳ Transcribing audio...'
              : isRecording
              ? '🔴 Recording... click mic to stop'
              : '🎤 Click mic to record · Enter to send'}
          </p>
          {/* Toggle STT mode */}
          <button
            onClick={() => {
              if (isRecording) return
              setUseBackendSTT(v => !v)
            }}
            className="text-xs text-[#9c9a96] hover:text-[#c8601a] transition"
          >
            {useBackendSTT ? '🤖 AI STT' : '🌐 Browser STT'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}