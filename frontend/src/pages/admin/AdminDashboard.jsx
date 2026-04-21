import { motion } from 'framer-motion'
import { Users, Mic, TrendingUp, Award, ArrowUpRight, Activity } from 'lucide-react'

const stats = [
  { icon: Users,     label: 'Total Users',       value: '1,248',  trend: '+12%',  trendUp: true,  color: 'bg-[#0f1f3d]/8 text-[#0f1f3d]' },
  { icon: Mic,       label: 'Interviews Today',   value: '87',     trend: '+5',    trendUp: true,  color: 'bg-[#c8601a]/10 text-[#c8601a]' },
  { icon: TrendingUp,label: 'Avg Score',          value: '76%',    trend: '+2.4%', trendUp: true,  color: 'bg-green-50 text-green-700' },
  { icon: Award,     label: 'Pro Subscribers',    value: '342',    trend: '+8',    trendUp: true,  color: 'bg-purple-50 text-purple-700' },
]

const recentUsers = [
  { name: 'Aarav Sharma',   email: 'aarav@example.com',    role: 'user',  interviews: 5,  joined: 'Today' },
  { name: 'Priya Patel',    email: 'priya@example.com',    role: 'pro',   interviews: 12, joined: 'Yesterday' },
  { name: 'Rohan Mehta',    email: 'rohan@example.com',    role: 'user',  interviews: 3,  joined: '2 days ago' },
  { name: 'Sneha Gupta',    email: 'sneha@example.com',    role: 'pro',   interviews: 21, joined: '3 days ago' },
  { name: 'Kiran Verma',    email: 'kiran@example.com',    role: 'user',  interviews: 1,  joined: '4 days ago' },
]

const recentInterviews = [
  { user: 'Aarav Sharma',   type: 'Technical',    score: 82, status: 'Completed' },
  { user: 'Priya Patel',    type: 'HR Round',     score: 91, status: 'Completed' },
  { user: 'Rohan Mehta',    type: 'System Design',score: 68, status: 'Completed' },
  { user: 'Sneha Gupta',    type: 'Behavioral',   score: 88, status: 'Completed' },
]

function StatCard({ stat, index }) {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="surface-card p-5"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          <ArrowUpRight size={11} />
          {stat.trend}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-[#0f1f3d]">{stat.value}</p>
      <p className="mt-1 text-sm text-[#9c9a96]">{stat.label}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Admin Overview</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Dashboard</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Platform activity at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="surface-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1f3d] flex items-center gap-2">
              <Users size={16} className="text-[#c8601a]" /> Recent Users
            </h2>
            <span className="text-xs text-[#c8601a] font-semibold cursor-pointer hover:underline">View all →</span>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center justify-between py-2 border-b border-[#f4f2ee] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-sm">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f1f3d]">{u.name}</p>
                    <p className="text-xs text-[#9c9a96]">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.role === 'pro' ? 'bg-[#c8601a]/10 text-[#c8601a]' : 'bg-[#f4f2ee] text-[#9c9a96]'}`}>
                    {u.role.toUpperCase()}
                  </span>
                  <p className="text-xs text-[#9c9a96] mt-1">{u.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Interviews */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="surface-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0f1f3d] flex items-center gap-2">
              <Activity size={16} className="text-[#c8601a]" /> Recent Interviews
            </h2>
            <span className="text-xs text-[#c8601a] font-semibold cursor-pointer hover:underline">View all →</span>
          </div>
          <div className="space-y-3">
            {recentInterviews.map((iv, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#f4f2ee] last:border-0">
                <div>
                  <p className="text-sm font-semibold text-[#0f1f3d]">{iv.user}</p>
                  <p className="text-xs text-[#9c9a96]">{iv.type}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${iv.score >= 80 ? 'bg-green-50 text-green-700' : iv.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                    {iv.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
