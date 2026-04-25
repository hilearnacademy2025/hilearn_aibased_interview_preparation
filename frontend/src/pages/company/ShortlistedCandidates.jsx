import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Trash2, Eye, Edit3, X, Check, Send } from 'lucide-react'
import { getShortlistedCandidates, removeShortlist, updateShortlistNotes } from '../../utils/api'

export default function ShortlistedCandidates() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingNotes, setEditingNotes] = useState(null)
  const [noteText, setNoteText] = useState('')

  const fetchData = async () => {
    try {
      const data = await getShortlistedCandidates()
      setCandidates(data)
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const handleRemove = async (userId) => {
    if (!confirm('Remove this candidate from shortlist?')) return
    try {
      await removeShortlist(userId)
      setCandidates(prev => prev.filter(c => c.user_id !== userId))
    } catch { alert('Failed to remove') }
  }

  const handleSaveNotes = async (userId) => {
    try {
      await updateShortlistNotes(userId, noteText)
      setCandidates(prev => prev.map(c => c.user_id === userId ? { ...c, notes: noteText } : c))
      setEditingNotes(null)
    } catch { alert('Failed to save notes') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shortlisted Candidates</h1>
          <p className="text-slate-500 mt-1">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} shortlisted</p>
        </div>
        <Link to="/company/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          <Star size={16} /> Add More
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Star size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No candidates shortlisted yet</p>
          <p className="text-slate-400 mt-1">Start by searching and shortlisting candidates</p>
          <Link to="/company/search" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">Find Candidates →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <div key={c.shortlist_id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(c.candidate_name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{c.candidate_name || 'Unknown'}</h3>
                  <p className="text-sm text-slate-500">{c.job_title ? `For: ${c.job_title}` : 'General shortlist'}</p>
                </div>
                <span className="text-xs text-slate-400 hidden sm:block">
                  {c.shortlisted_at ? new Date(c.shortlisted_at).toLocaleDateString() : ''}
                </span>
                <div className="flex items-center gap-2">
                  <Link to={`/company/candidate/${c.user_id}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="View Profile">
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => { setEditingNotes(c.user_id); setNoteText(c.notes || '') }}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition" title="Edit Notes">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleRemove(c.user_id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Notes */}
              {c.notes && editingNotes !== c.user_id && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
                  <span className="font-semibold">Notes:</span> {c.notes}
                </div>
              )}

              {/* Edit Notes */}
              {editingNotes === c.user_id && (
                <div className="mt-3 flex gap-2">
                  <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition"
                    placeholder="Add notes about this candidate..." />
                  <button onClick={() => handleSaveNotes(c.user_id)}
                    className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingNotes(null)}
                    className="p-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 transition">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
