// import { useState, useRef, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { useNavigate } from 'react-router-dom'
// import { Send, Mic, MicOff, Clock, ChevronRight, Loader } from 'lucide-react'
// import api from '../../utils/api'

// export default function UserInterview() {
//   const navigate = useNavigate()
//   const session = JSON.parse(sessionStorage.getItem('interview_session') || '{}')
//   const sessionId = session.session_id

//   const [messages, setMessages] = useState([
//     { id: 1, type: 'ai', text: session.first_question || 'Hello! I am your AI interviewer. Tell me about yourself and your experience.' }
//   ])
//   const [answer, setAnswer] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [timer, setTimer] = useState(0)
//   const [questionsCount, setQuestionsCount] = useState(1)
//   const [isRecording, setIsRecording] = useState(false)
//   const bottomRef = useRef(null)
//   const recognitionRef = useRef(null)

//   useEffect(() => {
//     const interval = setInterval(() => setTimer(t => t + 1), 1000)
//     return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

//   const toggleMic = () => {
//     if (!('webkitSpeechRecognition' in window)) { alert('Voice not supported in this browser.'); return }
//     if (isRecording) {
//       recognitionRef.current?.stop()
//       setIsRecording(false)
//       return
//     }
//     const recognition = new window.webkitSpeechRecognition()
//     recognition.lang = 'en-IN'
//     recognition.continuous = false
//     recognition.interimResults = false
//     recognition.onresult = (e) => {
//       const text = e.results[0][0].transcript
//       setAnswer(prev => prev + ' ' + text)
//     }
//     recognition.onend = () => setIsRecording(false)
//     recognitionRef.current = recognition
//     recognition.start()
//     setIsRecording(true)
//   }

//   const handleSend = async () => {
//     if (!answer.trim() || loading) return
//     const userMsg = { id: messages.length + 1, type: 'user', text: answer.trim() }
//     setMessages(prev => [...prev, userMsg])
//     setAnswer('')
//     setLoading(true)

//     try {
//       const { data } = await api.post('/interview/submit-answer', {
//         session_id: sessionId,
//         answer: userMsg.text,
//         question_number: questionsCount,
//       })
//       setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: data.next_question || data.feedback || 'Thank you! Great answer.' }])
//       setQuestionsCount(q => q + 1)

//       // If interview is complete, go to feedback
//       if (data.interview_complete) {
//         sessionStorage.setItem('interview_feedback', JSON.stringify(data))
//         setTimeout(() => navigate('/user/feedback'), 1500)
//       }
//     } catch {
//       setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: "Great answer! Let's continue — can you describe a challenging project you worked on?" }])
//       setQuestionsCount(q => q + 1)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
//       {/* Header */}
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-4 mb-4 flex items-center justify-between">
//         <div>
//           <p className="text-xs uppercase tracking-widest text-[#c8601a] font-semibold">Live Interview</p>
//           <p className="text-sm font-bold text-[#0f1f3d] mt-0.5">{session.job_role || 'Mock Interview'} · {session.interview_type || 'Technical'}</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 text-sm font-mono text-[#0f1f3d]">
//             <Clock size={14} className="text-[#c8601a]" /> {formatTime(timer)}
//           </div>
//           <span className="text-xs bg-[#f4f2ee] text-[#5c5a57] px-3 py-1 rounded-full font-semibold">Q{questionsCount}</span>
//         </div>
//       </motion.div>

//       {/* Chat */}
//       <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
//         {messages.map((msg) => (
//           <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//             {msg.type === 'ai' && (
//               <div className="w-8 h-8 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">AI</div>
//             )}
//             <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
//               msg.type === 'ai'
//                 ? 'bg-white border border-[#e0dbd3] text-[#0f1f3d] shadow-sm'
//                 : 'bg-[#c8601a] text-white shadow-md shadow-[#c8601a]/20'
//             }`}>
//               {msg.text}
//             </div>
//           </motion.div>
//         ))}
//         {loading && (
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-xs font-bold">AI</div>
//             <div className="bg-white border border-[#e0dbd3] rounded-2xl px-4 py-3">
//               <Loader size={16} className="animate-spin text-[#c8601a]" />
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input */}
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-4">
//         <div className="flex gap-3 items-end">
//           <textarea
//             value={answer}
//             onChange={e => setAnswer(e.target.value)}
//             onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
//             placeholder="Type your answer here… (Enter to send, Shift+Enter for new line)"
//             rows={3}
//             className="warm-input flex-1 resize-none text-sm"
//           />
//           <div className="flex flex-col gap-2">
//             <button onClick={toggleMic}
//               className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isRecording ? 'bg-red-500 text-white' : 'bg-[#f4f2ee] text-[#5c5a57] hover:bg-[#e0dbd3]'}`}>
//               {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
//             </button>
//             <button onClick={handleSend} disabled={loading || !answer.trim()}
//               className="w-11 h-11 rounded-xl bg-[#c8601a] text-white flex items-center justify-center hover:bg-[#b0541a] transition disabled:opacity-50">
//               <Send size={18} />
//             </button>
//           </div>
//         </div>
//         <p className="text-xs text-[#9c9a96] mt-2">🎤 Click mic for voice input · Press Enter to send</p>
//       </motion.div>
//     </div>
//   )
// }


import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Send, Mic, MicOff, Clock, Loader } from 'lucide-react'
import api from '../../utils/api'
import { useToast } from '../../components/common/ToastProvider'

export default function UserInterview() {
  const navigate = useNavigate()
  const { pushToast } = useToast()

  // Get session from localStorage (set by UserInterviewSetup)
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem('hilearn_interview_session')
    return saved ? JSON.parse(saved) : null
  })
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem('hilearn_current_question')
    return saved ? JSON.parse(saved) : null
  })
  const [messages, setMessages] = useState(() => {
    if (currentQuestion) {
      return [{ id: 1, type: 'ai', text: currentQuestion.question_text }]
    }
    return [{ id: 1, type: 'ai', text: 'Loading your interview...' }]
  })
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [questionsCount, setQuestionsCount] = useState(1)
  const [totalQuestions, setTotalQuestions] = useState(session?.total_questions || 10)
  const [isRecording, setIsRecording] = useState(false)
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  // Timer effect
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // If no session, redirect to setup
  useEffect(() => {
    if (!session || !currentQuestion) {
      pushToast({ title: 'No active session', description: 'Please start an interview first.', type: 'error' })
      navigate('/user/interview-setup')
    }
  }, [session, currentQuestion, navigate, pushToast])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window)) {
      pushToast({ title: 'Not supported', description: 'Voice input is not supported in this browser.', type: 'error' })
      return
    }
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      setAnswer(prev => prev + ' ' + text)
    }
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const handleSend = async () => {
    if (!answer.trim() || loading) return
    if (!session || !currentQuestion) {
      pushToast({ title: 'Error', description: 'Interview session missing. Please restart.', type: 'error' })
      navigate('/user/interview-setup')
      return
    }

    const userMsg = { id: messages.length + 1, type: 'user', text: answer.trim() }
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
      const { data } = await api.post('/interview/submit-answer', payload)

      // Store feedback for later
      localStorage.setItem('hilearn_latest_feedback', JSON.stringify(data.feedback))

      // Add AI response (feedback + next question)
      let aiText = ''
      if (data.next_question) {
        aiText = `**Feedback:** Score ${data.feedback.overall_score}/10\n\n**Next question:** ${data.next_question.question_text}`
        setCurrentQuestion(data.next_question)
        localStorage.setItem('hilearn_current_question', JSON.stringify(data.next_question))
        setQuestionsCount(prev => prev + 1)
        setTimer(0)
        // Reset timer interval to avoid overlap
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      } else {
        // Interview complete
        aiText = `**Interview Complete!**\n\nFinal Score: ${data.feedback.overall_score}/10\n\nYou will now be redirected to your feedback summary.`
        localStorage.removeItem('hilearn_interview_session')
        localStorage.removeItem('hilearn_current_question')
        localStorage.setItem('hilearn_complete_feedback', JSON.stringify(data))
        setTimeout(() => navigate('/user/feedback'), 2000)
      }
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: aiText }])
    } catch (err) {
      console.error('Submit error:', err)
      pushToast({ title: 'Submission failed', description: err.response?.data?.detail || err.message, type: 'error' })
      // Fallback: add a generic AI response
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'ai', text: "Thanks for your answer. Let's move to the next question." }])
      setQuestionsCount(prev => prev + 1)
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
          <div className="flex items-center gap-2 text-sm font-mono text-[#0f1f3d]">
            <Clock size={14} className="text-[#c8601a]" /> {formatTime(timer)}
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
            <button onClick={toggleMic}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                isRecording ? 'bg-red-500 text-white' : 'bg-[#f4f2ee] text-[#5c5a57] hover:bg-[#e0dbd3]'
              }`}>
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button onClick={handleSend} disabled={loading || !answer.trim()}
              className="w-11 h-11 rounded-xl bg-[#c8601a] text-white flex items-center justify-center hover:bg-[#b0541a] transition disabled:opacity-50">
              <Send size={18} />
            </button>
          </div>
        </div>
        <p className="text-xs text-[#9c9a96] mt-2">🎤 Click mic for voice input · Press Enter to send</p>
      </motion.div>
    </div>
  )
}