import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Users, Search, Loader2 } from 'lucide-react'
import { getAdminUsers } from '../../utils/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async (p = 1, s = '') => {
    setLoading(true)
    try {
      const params = { page: p, limit: 10 }
      if (s) params.search = s
      const res = await getAdminUsers(params)
      setUsers(res.data?.users || [])
      setTotalPages(res.data?.total_pages || 1)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page, search)
  }, [page])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchUsers(1, search)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#c8601a]" size={28} />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f4f2ee] text-xs uppercase tracking-widest text-[#9c9a96]">
                  <th className="text-left px-6 py-4 font-semibold">User</th>
                  <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Role</th>
                  <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Interviews</th>
                  <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Joined</th>
                  <th className="text-left px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-sm flex-shrink-0">
                          {(u.name || '?')[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f1f3d]">{u.name}</p>
                          <p className="text-xs text-[#9c9a96]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#c8601a]/10 text-[#c8601a]' : 'bg-[#f4f2ee] text-[#9c9a96]'}`}>
                        {(u.role || 'student').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm font-semibold text-[#0f1f3d]">{u.interview_count || 0}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#9c9a96]">{u.created_at ? u.created_at.split('T')[0] : ''}</span>
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
            {users.length === 0 && (
              <div className="text-center py-12 text-[#9c9a96]">No users found.</div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4 border-t border-[#f4f2ee]">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition"
                >
                  ← Prev
                </button>
                <span className="text-sm text-[#9c9a96]">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
