import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Users, Search, Filter, MoreVertical, Mail, Calendar } from 'lucide-react'
import api from '../../utils/api'

const mockUsers = [
  { _id: '1', name: 'Aarav Sharma',  email: 'aarav@example.com',  role: 'user', interviews_count: 5,  created_at: '2026-04-15', is_active: true },
  { _id: '2', name: 'Priya Patel',   email: 'priya@example.com',   role: 'pro',  interviews_count: 12, created_at: '2026-04-10', is_active: true },
  { _id: '3', name: 'Rohan Mehta',   email: 'rohan@example.com',   role: 'user', interviews_count: 3,  created_at: '2026-04-08', is_active: true },
  { _id: '4', name: 'Sneha Gupta',   email: 'sneha@example.com',   role: 'pro',  interviews_count: 21, created_at: '2026-04-05', is_active: false },
  { _id: '5', name: 'Kiran Verma',   email: 'kiran@example.com',   role: 'user', interviews_count: 1,  created_at: '2026-04-01', is_active: true },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Management</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Users</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Manage all registered users</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9a96]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="warm-input pl-9 py-2.5 text-sm"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f4f2ee] text-xs uppercase tracking-widest text-[#9c9a96]">
              <th className="text-left px-6 py-4 font-semibold">User</th>
              <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Plan</th>
              <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Interviews</th>
              <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Joined</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-sm flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0f1f3d]">{u.name}</p>
                      <p className="text-xs text-[#9c9a96]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'pro' ? 'bg-[#c8601a]/10 text-[#c8601a]' : 'bg-[#f4f2ee] text-[#9c9a96]'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm font-semibold text-[#0f1f3d]">{u.interviews_count}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-[#9c9a96]">{u.created_at}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9c9a96]">No users found.</div>
        )}
      </motion.div>
    </div>
  )
}
