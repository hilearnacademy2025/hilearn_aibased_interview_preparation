// import { motion } from 'framer-motion'
// import { Link } from 'react-router-dom'
// import { Award, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

// export default function UserFeedback() {
//   const feedback = JSON.parse(sessionStorage.getItem('interview_feedback') || '{}')
//   const score = feedback.overall_score || 78
//   const strengths = feedback.strengths || ['Good technical knowledge', 'Clear communication', 'Structured answers']
//   const improvements = feedback.improvements || ['Work on system design depth', 'Practice more DSA problems']

//   return (
//     <div className="max-w-3xl space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Interview Complete</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Your Feedback</h1>
//       </motion.div>

//       {/* Score */}
//       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="surface-card p-8 text-center">
//         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c8601a] to-[#0f1f3d] flex items-center justify-center mx-auto shadow-xl shadow-[#c8601a]/20">
//           <span className="text-white font-bold text-3xl">{score}</span>
//         </div>
//         <p className="text-sm uppercase tracking-widest text-[#9c9a96] mt-4">Overall Score</p>
//         <p className="display-font text-2xl font-bold text-[#0f1f3d] mt-1">
//           {score >= 85 ? 'Excellent Performance!' : score >= 70 ? 'Good Job!' : 'Keep Practicing!'}
//         </p>
//       </motion.div>

//       <div className="grid md:grid-cols-2 gap-4">
//         {/* Strengths */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
//           <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
//             <CheckCircle size={16} className="text-green-600" /> Strengths
//           </h2>
//           <ul className="space-y-2">
//             {strengths.map((s, i) => (
//               <li key={i} className="flex items-start gap-2 text-sm text-[#5c5a57]">
//                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
//                 {s}
//               </li>
//             ))}
//           </ul>
//         </motion.div>

//         {/* Improvements */}
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface-card p-6">
//           <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
//             <BarChart3 size={16} className="text-[#c8601a]" /> Areas to Improve
//           </h2>
//           <ul className="space-y-2">
//             {improvements.map((s, i) => (
//               <li key={i} className="flex items-start gap-2 text-sm text-[#5c5a57]">
//                 <span className="w-1.5 h-1.5 rounded-full bg-[#c8601a] mt-2 flex-shrink-0" />
//                 {s}
//               </li>
//             ))}
//           </ul>
//         </motion.div>
//       </div>

//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
//         <Link to="/user/interview-setup" className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white py-4 rounded-full font-bold shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition">
//           Practice Again <ArrowRight size={18} />
//         </Link>
//         <Link to="/user" className="px-6 py-4 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition">
//           Dashboard
//         </Link>
//       </motion.div>
//     </div>
//   )
// }


import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, BarChart3, CheckCircle, ArrowRight, Mic, Clock, Zap, Mail, Loader } from 'lucide-react'
import { sendResultsEmail } from '../../utils/api'

export default function UserFeedback() {
  // UserInterview.jsx ne yeh localStorage me save kiya tha interview complete hone par
  const completeFeedback = JSON.parse(localStorage.getItem('hilearn_complete_feedback') || '{}')
  const latestFeedback   = JSON.parse(localStorage.getItem('hilearn_latest_feedback') || '{}')

  // Complete feedback pehle dekho, phir latest, phir defaults
  const feedback = completeFeedback?.feedback || latestFeedback || {}

  const score       = feedback.overall_score ?? 0
  const strengths   = feedback.strengths   || ['Keep practicing to see your strengths here.']
  const improvements = feedback.improvements || ['Complete an interview to see improvement areas.']

  // Voice analysis (agar backend ne diya)
  const voice = feedback.voice_analysis || null

  const hasRealData = score > 0

  // Email state
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState('')

  const sessionId = completeFeedback?.session_id || localStorage.getItem('hilearn_session_id') || ''

  const handleSendEmail = async () => {
    if (!sessionId) {
      setEmailError('No session found to send results for.')
      return
    }
    setSendingEmail(true)
    setEmailError('')
    try {
      await sendResultsEmail(sessionId)
      setEmailSent(true)
    } catch (err) {
      setEmailError(err.message || 'Failed to send email.')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Interview Complete</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Your Feedback</h1>
        {!hasRealData && (
          <p className="text-sm text-[#9c9a96] mt-1">Complete an interview to see real feedback here.</p>
        )}
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="surface-card p-8 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c8601a] to-[#0f1f3d] flex items-center justify-center mx-auto shadow-xl shadow-[#c8601a]/20">
          <span className="text-white font-bold text-3xl">{score > 0 ? score : '—'}</span>
        </div>
        <p className="text-sm uppercase tracking-widest text-[#9c9a96] mt-4">Overall Score</p>
        <p className="display-font text-2xl font-bold text-[#0f1f3d] mt-1">
          {!hasRealData
            ? 'No data yet'
            : score >= 85
            ? 'Excellent Performance!'
            : score >= 70
            ? 'Good Job!'
            : 'Keep Practicing!'}
        </p>
        {feedback.content_score != null && (
          <div className="flex justify-center gap-6 mt-4 text-sm text-[#5c5a57]">
            <span>Content: <strong className="text-[#0f1f3d]">{feedback.content_score}/10</strong></span>
            {feedback.communication_score != null && (
              <span>Communication: <strong className="text-[#0f1f3d]">{feedback.communication_score}/10</strong></span>
            )}
          </div>
        )}
      </motion.div>

      {/* Strengths + Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="surface-card p-6"
        >
          <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" /> Strengths
          </h2>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#5c5a57]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="surface-card p-6"
        >
          <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#c8601a]" /> Areas to Improve
          </h2>
          <ul className="space-y-2">
            {improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#5c5a57]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8601a] mt-2 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Voice Analysis — only show if backend gave data */}
      {voice && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-card p-6"
        >
          <h2 className="font-bold text-[#0f1f3d] mb-4 flex items-center gap-2">
            <Mic size={16} className="text-[#c8601a]" /> Voice Analysis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {voice.wpm != null && (
              <div className="text-center p-3 bg-[#f4f2ee] rounded-xl">
                <p className="text-xl font-bold text-[#0f1f3d]">{voice.wpm}</p>
                <p className="text-xs text-[#9c9a96] mt-1">Words/min</p>
              </div>
            )}
            {voice.filler_count != null && (
              <div className="text-center p-3 bg-[#f4f2ee] rounded-xl">
                <p className="text-xl font-bold text-[#0f1f3d]">{voice.filler_count}</p>
                <p className="text-xs text-[#9c9a96] mt-1">Filler words</p>
              </div>
            )}
            {voice.confidence_score != null && (
              <div className="text-center p-3 bg-[#f4f2ee] rounded-xl">
                <p className="text-xl font-bold text-[#0f1f3d]">{Math.round(voice.confidence_score * 100)}%</p>
                <p className="text-xs text-[#9c9a96] mt-1">Confidence</p>
              </div>
            )}
          </div>
          {voice.filler_words_detected?.length > 0 && (
            <p className="text-xs text-[#9c9a96] mt-3">
              Filler words detected: <span className="text-[#c8601a]">{voice.filler_words_detected.join(', ')}</span>
            </p>
          )}
        </motion.div>
      )}

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          to="/user/interview-setup"
          className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white py-4 rounded-full font-bold shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition"
        >
          Practice Again <ArrowRight size={18} />
        </Link>
        {hasRealData && sessionId && (
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-[#0f1f3d] text-white rounded-full font-bold hover:bg-[#1a3a6b] transition disabled:opacity-60"
          >
            {sendingEmail ? (
              <><Loader size={14} className="animate-spin" /> Sending...</>
            ) : emailSent ? (
              <><CheckCircle size={14} /> Sent ✉️</>
            ) : (
              <><Mail size={14} /> Email Results</>
            )}
          </button>
        )}
        <Link
          to="/user"
          className="px-6 py-4 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition"
        >
          Dashboard
        </Link>
      </motion.div>

      {emailError && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
          {emailError}
        </p>
      )}
      {emailSent && (
        <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
          ✅ Results sent to your registered email!
        </p>
      )}
    </div>
  )
}