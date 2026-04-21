import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const performanceData = [
  { week: 'Week 1', score: 65 }, { week: 'Week 2', score: 72 },
  { week: 'Week 3', score: 78 }, { week: 'Week 4', score: 80 },
]
const skillData = [
  { name: 'Technical', value: 82, color: '#0f1f3d' },
  { name: 'Communication', value: 78, color: '#c8601a' },
  { name: 'Problem Solving', value: 80, color: '#5c5a57' },
  { name: 'Confidence', value: 85, color: '#9c9a96' },
]
const improvements = [
  { skill: 'System Design', progress: 75 },
  { skill: 'Communication', progress: 65 },
  { skill: 'Coding Speed', progress: 50 },
  { skill: 'DSA', progress: 85 },
]

export default function UserAnalytics() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Progress</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">My Analytics</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Track your interview performance over time</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Score Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9c9a96' }} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: '#9c9a96' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0dbd3', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#c8601a" strokeWidth={2.5} dot={{ fill: '#c8601a', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Skill Breakdown</h2>
          <div className="space-y-3">
            {skillData.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[#5c5a57]">{s.name}</span>
                  <span className="font-bold text-[#0f1f3d]">{s.value}%</span>
                </div>
                <div className="w-full h-2 bg-[#f4f2ee] rounded-full">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-full rounded-full" style={{ background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="surface-card p-6">
        <h2 className="font-bold text-[#0f1f3d] mb-5">Improvement Areas</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {improvements.map(item => (
            <div key={item.skill} className="rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-[#0f1f3d]">{item.skill}</span>
                <span className="text-[#c8601a] font-bold">{item.progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#f4f2ee] rounded-full">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.progress}%` }} transition={{ delay: 0.4, duration: 0.8 }}
                  className="h-full bg-[#c8601a] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
