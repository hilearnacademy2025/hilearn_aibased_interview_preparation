import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { getAdminInterviews } from '../../utils/api'

export default function AdminInterviews() {
  const [interviews, setInterviews] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getAdminInterviews({ page, limit: 10 })
        setInterviews(res.data?.interviews || [])
        setTotalPages(res.data?.total_pages || 1)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [page])

  const filtered = interviews.filter(iv =>
    (iv.user||'').toLowerCase().includes(search.toLowerCase()) ||
    (iv.type||'').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c8601a]" size={32}/></div>

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Management</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Interviews</h1>
        <p className="text-sm text-[#9c9a96] mt-1">All platform interview sessions</p>
      </motion.div>
      <div className="surface-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9a96]"/>
          <input type="text" placeholder="Search by user or type..." value={search} onChange={e=>setSearch(e.target.value)} className="warm-input pl-9 py-2.5 text-sm"/>
        </div>
      </div>
      <div className="surface-card overflow-hidden">
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
            {filtered.map((iv,i)=>(
              <tr key={iv.id||i} className="border-b border-[#f4f2ee] last:border-0 hover:bg-[#fffaf4] transition">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#0f1f3d]/8 flex items-center justify-center text-[#0f1f3d] font-bold text-xs">{(iv.user||'?')[0]}</div><span className="text-sm font-semibold text-[#0f1f3d]">{iv.user}</span></div></td>
                <td className="px-6 py-4 text-sm text-[#5c5a57]">{iv.type}</td>
                <td className="px-6 py-4 hidden md:table-cell text-sm text-[#9c9a96]">{iv.job_role}</td>
                <td className="px-6 py-4"><span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold inline-flex ${iv.score>=80?'bg-green-50 text-green-700':iv.score>=60?'bg-amber-50 text-amber-700':'bg-red-50 text-red-600'}`}>{iv.score}</span></td>
                <td className="px-6 py-4 hidden lg:table-cell text-sm text-[#9c9a96]">{iv.date?iv.date.split('T')[0]:''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="text-center py-12 text-[#9c9a96]">No interviews found.</div>}
        {totalPages>1&&(
          <div className="flex items-center justify-center gap-2 py-4 border-t border-[#f4f2ee]">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40">← Prev</button>
            <span className="text-sm text-[#9c9a96]">Page {page} of {totalPages}</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="px-3 py-1 text-sm rounded-lg border border-[#e0dbd3] disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
