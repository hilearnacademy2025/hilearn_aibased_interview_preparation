// import { motion } from 'framer-motion'
// import { useState, useEffect } from 'react'
// import { Users, Search, Loader2 } from 'lucide-react'
// import { getAdminUsers } from '../../utils/api'

// export default function AdminUsers() {
//   const [users, setUsers] = useState([])
//   const [search, setSearch] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const fetchUsers = async (p = 1, s = '') => {
//     setLoading(true)
//     try {
//       const params = { page: p, limit: 10 }
//       if (s) params.search = s
//       const res = await getAdminUsers(params)
//       setUsers(res.data?.users || [])
//       setTotalPages(res.data?.total_pages || 1)
//     } catch (err) {
//       console.error('Failed to fetch users:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchUsers(page, search)
//   }, [page])

//   // Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setPage(1)
//       fetchUsers(1, search)
//     }, 400)
//     return () => clearTimeout(timer)
//   }, [search])

//   return (
//     <div className="space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Management</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Users</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Manage all registered users</p>
//       </motion.div>

//       {/* Search */}
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-4 flex gap-3">
//         <div className="relative flex-1">
//           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9a96]" />
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="warm-input pl-9 py-2.5 text-sm"
//           />
//         </div>
//       </motion.div>

//       {/* Table */}
//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface-card overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="animate-spin text-[#c8601a]" size={28} />
//           </div>
//         ) : (
//           <>
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-[#f4f2ee] text-xs uppercase tracking-widest text-[#9c9a96]">
//                   <th className="text-left px-6 py-4 font-semibold">User</th>
//                   <th className="text-left px-6 py-4 font-semibold hidden md:table-cell">Role</th>
//                   <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Interviews</th>
//                   <th className="text-left px-6 py-4 font-semibold hidden lg:table-cell">Joined</th>
//                   <th className="text-left px-6 py-4 font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u, i) => (
//                   <motion.tr
//                     key={u._id || i}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: i * 0.05 }}
//                     className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-sm flex-shrink-0">
//                           {(u.name || '?')[0]}
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-[#0f1f3d]">{u.name}</p>
//                           <p className="text-xs text-[#9c9a96]">{u.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 hidden md:table-cell">
//                       <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#c8601a]/10 text-[#c8601a]' : 'bg-[#f4f2ee] text-[#9c9a96]'}`}>
//                         {(u.role || 'student').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 hidden lg:table-cell">
//                       <span className="text-sm font-semibold text-[#0f1f3d]">{u.interview_count || 0}</span>
//                     </td>
//                     <td className="px-6 py-4 hidden lg:table-cell">
//                       <span className="text-sm text-[#9c9a96]">{u.created_at ? u.created_at.split('T')[0] : ''}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
//                         {u.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//             {users.length === 0 && (
//               <div className="text-center py-12 text-[#9c9a96]">No users found.</div>
//             )}
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 py-4 border-t border-[#f4f2ee]">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page <= 1}
//                   className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition"
//                 >
//                   ← Prev
//                 </button>
//                 <span className="text-sm text-[#9c9a96]">Page {page} of {totalPages}</span>
//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page >= totalPages}
//                   className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition"
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </motion.div>
//     </div>
//   )
// }



import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Search, Loader2, UserPlus, X, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react'
import { getAdminUsers, deleteAdminUser } from '../../utils/api'
import api from '../../utils/api'

// ── Add User Modal ────────────────────────────────────────────────────────────
function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Sab fields fill karo')
      return
    }
    setLoading(true)
    try {
      await api.post('/admin/users', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'User add nahi ho saka')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="display-font text-xl font-bold text-[#0f1f3d]">Add New User</h2>
            <p className="text-xs text-[#9c9a96] mt-0.5">User seedha admin panel se add hoga</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#f4f2ee] transition">
            <X size={18} className="text-[#5c5a57]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">Full Name</label>
            <input type="text" placeholder="Rahil Shah" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="warm-input mt-1.5 w-full py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">Email</label>
            <input type="email" placeholder="rahil@hilearn.in" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="warm-input mt-1.5 w-full py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">Password</label>
            <div className="relative mt-1.5">
              <input type={showPass ? 'text' : 'password'}
                placeholder="Min 8 chars, uppercase, digit, special char"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="warm-input w-full py-2.5 text-sm pr-10" />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9c9a96] hover:text-[#5c5a57]">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#5c5a57] uppercase tracking-wide">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="warm-input mt-1.5 w-full py-2.5 text-sm">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e0dbd3] text-sm font-semibold text-[#5c5a57] hover:bg-[#f4f2ee] transition">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#c8601a] text-sm font-semibold text-white hover:bg-[#b8541a] transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteConfirmModal({ user, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      await deleteAdminUser(user._id)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'User delete nahi ho saka')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={26} className="text-red-500" />
          </div>
        </div>

        <h2 className="display-font text-xl font-bold text-[#0f1f3d] text-center">Remove User?</h2>
        <p className="text-sm text-[#5c5a57] text-center mt-2">
          Are you sure you want to permanently remove <span className="font-semibold text-[#0f1f3d]">{user.name}</span>?
        </p>
        <p className="text-xs text-[#9c9a96] text-center mt-1">{user.email}</p>

        <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 text-xs text-red-600 text-center">
          This action is permanent. The user and all their interview data will be deleted from the database and cannot be recovered.
        </div>

        {error && (
          <div className="mt-3 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100 text-center">{error}</div>
        )}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#e0dbd3] text-sm font-semibold text-[#5c5a57] hover:bg-[#f4f2ee] transition">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {loading ? 'Removing...' : 'Yes, Remove'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // user to delete

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

  useEffect(() => { fetchUsers(page, search) }, [page])

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchUsers(1, search) }, 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Management</p>
          <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Users</h1>
          <p className="text-sm text-[#9c9a96] mt-1">Manage all registered users</p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1f3d] text-white text-sm font-semibold rounded-xl hover:bg-[#1a2f52] transition shadow-sm"
        >
          <UserPlus size={16} />
          Add User
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9a96]" />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="warm-input pl-9 py-2.5 text-sm w-full" />
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
                  <th className="text-left px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-sm flex-shrink-0">
                          {(u.name || '?')[0].toUpperCase()}
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
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.is_active !== false ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {u.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* REMOVE BUTTON */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition opacity-0 group-hover:opacity-100"
                        title="Remove user"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-12 text-[#9c9a96]">No users found.</div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4 border-t border-[#f4f2ee]">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition">
                  ← Prev
                </button>
                <span className="text-sm text-[#9c9a96]">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40 hover:bg-[#fffaf4] transition">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => fetchUsers(1, search)}
          />
        )}
        {deleteTarget && (
          <DeleteConfirmModal
            user={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onSuccess={() => fetchUsers(page, search)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}