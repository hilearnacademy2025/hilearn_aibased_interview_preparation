import { motion } from 'framer-motion'
import { Mic, Search } from 'lucide-react'
import { useState } from 'react'

const mockInterviews = [
  { id: '1', user: 'Aarav Sharma',  type: 'Technical',    role: 'Backend Engineer',   score: 85, date: '2026-04-20', status: 'Completed' },
  { id: '2', user: 'Priya Patel',   type: 'HR Round',     role: 'Frontend Developer', score: 91, date: '2026-04-19', status: 'Completed' },
  { id: '3', user: 'Rohan Mehta',   type: 'System Design',role: 'Senior Backend',     score: 68, date: '2026-04-18', status: 'Completed' },
  { id: '4', user: 'Sneha Gupta',   type: 'Behavioral',   role: 'Product Manager',    score: 88, date: '2026-04-17', status: 'Completed' },
  { id: '5', user: 'Kiran Verma',   type: 'Technical',    role: 'Full Stack',         score: 74, date: '2026-04-16', status: 'Completed' },
]

export default function AdminInterviews() {
  const [search, setSearch] = useState('')
  const filtered = mockInterviews.filter(iv =>
    iv.user.toLowerCase().includes(search.toLowerCase()) ||
    iv.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Management</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Interviews</h1>
        <p className="text-sm text-[#9c9a96] mt-1">All platform interview sessions</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="surface-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9a96]" />
          <input type="text" placeholder="Search by user or type..." value={search} onChange={e => setSearch(e.target.value)} className="warm-input pl-9 py-2.5 text-sm" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f4f2ee] text-xs uppercase tracking-widest text-[#9c9a96]">
              <th className="text-left px-6 py-4 font-semibold">User</th>
              <th className="text-left px-6 py-4 font-semibold">Type</th>
              <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Role</th>
              <th className="text-left px-6 py-4 font-semibold">Score</th>
              <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((iv, i) => (
              <motion.tr key={iv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-xs">{iv.user[0]}</div>
                    <span className="text-sm font-semibold text-[#0f1f3d]">{iv.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-[#5c5a57]">{iv.type}</span></td>
                <td className="px-6 py-4 hidden md:table-cell"><span className="text-sm text-[#9c9a96]">{iv.role}</span></td>
                <td className="px-6 py-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold inline-flex ${iv.score >= 80 ? 'bg-green-50 text-green-700' : iv.score >= 60 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>{iv.score}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell"><span className="text-sm text-[#9c9a96]">{iv.date}</span></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
