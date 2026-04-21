// import { motion } from 'framer-motion'
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// const performanceData = [
//   { week: 'Week 1', score: 65 }, { week: 'Week 2', score: 72 },
//   { week: 'Week 3', score: 78 }, { week: 'Week 4', score: 80 },
// ]
// const skillData = [
//   { name: 'Technical', value: 82, color: '#0f1f3d' },
//   { name: 'Communication', value: 78, color: '#c8601a' },
//   { name: 'Problem Solving', value: 80, color: '#5c5a57' },
//   { name: 'Confidence', value: 85, color: '#9c9a96' },
// ]
// const improvements = [
//   { skill: 'System Design', progress: 75 },
//   { skill: 'Communication', progress: 65 },
//   { skill: 'Coding Speed', progress: 50 },
//   { skill: 'DSA', progress: 85 },
// ]

// export default function UserAnalytics() {
//   return (
//     <div className="space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Progress</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">My Analytics</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Track your interview performance over time</p>
//       </motion.div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6">
//           <h2 className="font-bold text-[#0f1f3d] mb-5">Score Progress</h2>
//           <ResponsiveContainer width="100%" height={200}>
//             <LineChart data={performanceData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee" />
//               <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9c9a96' }} />
//               <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: '#9c9a96' }} />
//               <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0dbd3', fontSize: 12 }} />
//               <Line type="monotone" dataKey="score" stroke="#c8601a" strokeWidth={2.5} dot={{ fill: '#c8601a', r: 4 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card p-6">
//           <h2 className="font-bold text-[#0f1f3d] mb-5">Skill Breakdown</h2>
//           <div className="space-y-3">
//             {skillData.map(s => (
//               <div key={s.name}>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="font-medium text-[#5c5a57]">{s.name}</span>
//                   <span className="font-bold text-[#0f1f3d]">{s.value}%</span>
//                 </div>
//                 <div className="w-full h-2 bg-[#f4f2ee] rounded-full">
//                   <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ delay: 0.3, duration: 0.8 }}
//                     className="h-full rounded-full" style={{ background: s.color }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>
//       </div>

//       <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
//         <h2 className="font-bold text-[#0f1f3d] mb-5">Improvement Areas</h2>
//         <div className="grid md:grid-cols-2 gap-4">
//           {improvements.map(item => (
//             <div key={item.skill} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] p-4">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="font-semibold text-[#0f1f3d]">{item.skill}</span>
//                 <span className="text-[#c8601a] font-bold">{item.progress}%</span>
//               </div>
//               <div className="w-full h-2 bg-[#f4f2ee] rounded-full">
//                 <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ delay: 0.4, duration: 0.8 }}
//                   className="h-full bg-[#c8601a] rounded-full" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUserSessions } from '../../utils/api'
import { Link } from 'react-router-dom'

const typeColorMap = {
  technical: '#0f1f3d',
  behavioral: '#c8601a',
  hr: '#22c55e',
  domain_specific: '#9c9a96',
}

export default function UserAnalytics() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.user_id) { setLoading(false); return }
    getUserSessions(user.user_id)
      .then(res => setSessions(res?.data?.sessions || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [user?.user_id])

  // Build chart data from sessions (up to last 10, oldest→newest)
  const chartData = [...sessions]
    .reverse()
    .slice(-10)
    .map((s, i) => ({
      label: `#${i + 1}`,
      score: s.avg_score || 0,
      type: String(s.interview_type).toLowerCase(),
    }))

  // Skill breakdown: avg score by interview type
  const typeGroups = {}
  sessions.forEach(s => {
    const t = String(s.interview_type).toLowerCase()
    if (!typeGroups[t]) typeGroups[t] = []
    if (s.avg_score > 0) typeGroups[t].push(s.avg_score)
  })
  const skillData = Object.entries(typeGroups).map(([type, scores]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
    value: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) : 0,
    color: typeColorMap[type] || '#9c9a96',
  }))

  const totalInterviews = sessions.length
  const allScores = sessions.filter(s => s.avg_score > 0).map(s => s.avg_score)
  const avgScore = allScores.length ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 0
  const completedCount = sessions.filter(s => String(s.status).includes('completed')).length

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Progress</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">My Analytics</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Track your interview performance over time</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader className="animate-spin text-[#c8601a]" size={28} />
        </div>
      ) : totalInterviews === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="text-[#9c9a96] text-sm">No interview data yet.</p>
          <Link to="/user/interview-setup" className="mt-3 inline-block text-sm text-[#c8601a] font-semibold hover:underline">
            Start an interview to see analytics →
          </Link>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Sessions', value: totalInterviews },
              { label: 'Avg Score', value: avgScore ? `${avgScore}/10` : '—' },
              { label: 'Completed', value: completedCount },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="surface-card p-5 text-center">
                <p className="text-2xl font-bold text-[#0f1f3d]">{stat.value}</p>
                <p className="text-xs text-[#9c9a96] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Score chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6">
              <h2 className="font-bold text-[#0f1f3d] mb-5">Score Progress (last 10)</h2>
              {chartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9c9a96' }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9c9a96' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0dbd3', fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="#c8601a" strokeWidth={2.5} dot={{ fill: '#c8601a', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-[#9c9a96] text-center py-8">Complete at least 2 interviews to see the trend.</p>
              )}
            </motion.div>

            {/* Skill breakdown */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card p-6">
              <h2 className="font-bold text-[#0f1f3d] mb-5">Avg Score by Interview Type</h2>
              {skillData.length === 0 ? (
                <p className="text-sm text-[#9c9a96] text-center py-8">No scored sessions yet.</p>
              ) : (
                <div className="space-y-3">
                  {skillData.map(s => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-[#5c5a57]">{s.name}</span>
                        <span className="font-bold text-[#0f1f3d]">{s.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#f4f2ee] rounded-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.value}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Session history table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
            <h2 className="font-bold text-[#0f1f3d] mb-5">All Sessions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-[#9c9a96] border-b border-[#f4f2ee]">
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Questions</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.session_id} className="border-b border-[#f4f2ee] last:border-0">
                      <td className="py-3 font-medium text-[#0f1f3d]">{s.job_role}</td>
                      <td className="py-3 capitalize text-[#5c5a57]">{String(s.interview_type).replace('_', ' ')}</td>
                      <td className="py-3 text-[#5c5a57]">{s.questions_answered}/{s.total_questions}</td>
                      <td className="py-3 font-bold text-[#c8601a]">{s.avg_score > 0 ? `${s.avg_score}/10` : '—'}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          String(s.status).includes('completed') ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {String(s.status).replace('SessionStatus.', '')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}