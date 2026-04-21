import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mic, BarChart3, Award, Zap, ArrowUpRight, ChevronRight, BookOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const stats = [
  { icon: Zap,      label: 'Total Interviews', value: '12',    trend: '+3 this month',  color: 'bg-[#0f1f3d]/8 text-[#0f1f3d]' },
  { icon: BarChart3,label: 'Avg Score',        value: '78%',   trend: '+5% last month', color: 'bg-[#c8601a]/10 text-[#c8601a]' },
  { icon: Award,    label: 'Best Score',       value: '92%',   trend: 'Technical',      color: 'bg-green-50 text-green-700' },
  { icon: Mic,      label: 'Current Streak',   value: '5 days',trend: '🔥 Active',      color: 'bg-purple-50 text-purple-700' },
]

const recentInterviews = [
  { type: 'Technical',     role: 'Backend Engineer',   score: 85, date: 'Today' },
  { type: 'HR Round',      role: 'Frontend Developer', score: 78, date: 'Yesterday' },
  { type: 'Behavioral',    role: 'Product Manager',    score: 82, date: '2 days ago' },
  { type: 'System Design', role: 'Senior Backend',     score: 72, date: '3 days ago' },
]

const tips = [
  { title: 'System Design Mastery',       level: 'Advanced',     progress: 60 },
  { title: 'Behavioral Interview Tips',   level: 'Beginner',     progress: 30 },
  { title: 'Data Structures Deep Dive',   level: 'Intermediate', progress: 45 },
]

export default function UserDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">{greeting}</p>
          <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Welcome back, {firstName} 👋</h1>
          <p className="text-sm text-[#9c9a96] mt-1">Keep up your momentum — you're on a 5-day streak!</p>
        </div>
        <Link
          to="/user/interview-setup"
          className="inline-flex items-center gap-2 bg-[#c8601a] text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#c8601a]/25 hover:bg-[#b0541a] transition text-sm"
        >
          <Mic size={16} /> Start Interview
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="surface-card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={18} />
              </div>
              <p className="mt-4 text-2xl font-bold text-[#0f1f3d]">{stat.value}</p>
              <p className="text-xs text-[#9c9a96] mt-0.5">{stat.label}</p>
              <p className="text-xs text-[#c8601a] font-medium mt-1">{stat.trend}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Recent interviews */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1f3d]">Recent Interviews</h2>
            <Link to="/user/interviews" className="text-xs text-[#c8601a] font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentInterviews.map((iv, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#f4f2ee] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#0f1f3d]">{iv.type}</p>
                  <p className="text-xs text-[#9c9a96]">{iv.role} · {iv.date}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${iv.score >= 80 ? 'bg-green-50 text-green-700' : iv.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                  {iv.score}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning tips */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="surface-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1f3d] flex items-center gap-2">
              <BookOpen size={15} className="text-[#c8601a]" /> Learning Tips
            </h2>
          </div>
          <div className="space-y-4">
            {tips.map((tip) => (
              <div key={tip.title}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-[#0f1f3d]">{tip.title}</p>
                  <span className="text-xs text-[#9c9a96]">{tip.level}</span>
                </div>
                <div className="w-full h-2 bg-[#f4f2ee] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tip.progress}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-[#c8601a] rounded-full"
                  />
                </div>
                <p className="text-xs text-[#9c9a96] mt-1">{tip.progress}% complete</p>
              </div>
            ))}
          </div>

          {/* Quick action */}
          <Link
            to="/user/interview-setup"
            className="mt-5 flex items-center justify-between p-4 rounded-2xl bg-[#0f1f3d] text-white hover:bg-[#0f1f3d]/90 transition"
          >
            <div>
              <p className="text-sm font-bold">Ready for your next round?</p>
              <p className="text-xs text-white/60 mt-0.5">Start a mock interview now</p>
            </div>
            <ArrowUpRight size={18} className="text-[#c8601a]" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
