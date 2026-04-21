import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Award, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

export default function UserFeedback() {
  const feedback = JSON.parse(sessionStorage.getItem('interview_feedback') || '{}')
  const score = feedback.overall_score || 78
  const strengths = feedback.strengths || ['Good technical knowledge', 'Clear communication', 'Structured answers']
  const improvements = feedback.improvements || ['Work on system design depth', 'Practice more DSA problems']

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Interview Complete</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Your Feedback</h1>
      </motion.div>

      {/* Score */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="surface-card p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c8601a] to-[#0f1f3d] flex items-center justify-center mx-auto shadow-xl shadow-[#c8601a]/20">
          <span className="text-white font-bold text-3xl">{score}</span>
        </div>
        <p className="text-sm uppercase tracking-widest text-[#9c9a96] mt-4">Overall Score</p>
        <p className="display-font text-2xl font-bold text-[#0f1f3d] mt-1">
          {score >= 85 ? 'Excellent Performance!' : score >= 70 ? 'Good Job!' : 'Keep Practicing!'}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
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

        {/* Improvements */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="surface-card p-6">
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-4">
        <Link to="/user/interview-setup" className="flex-1 flex items-center justify-center gap-2 bg-[#c8601a] text-white py-4 rounded-full font-bold shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition">
          Practice Again <ArrowRight size={18} />
        </Link>
        <Link to="/user" className="px-6 py-4 border-2 border-[#e0dbd3] rounded-full font-semibold text-[#5c5a57] hover:border-[#c8601a]/50 transition">
          Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
