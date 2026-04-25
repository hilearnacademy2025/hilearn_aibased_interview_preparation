import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Eye, X } from 'lucide-react'
import { searchCandidates, shortlistCandidate } from '../../utils/api'

const ROLES = ['', 'Backend Developer', 'Frontend Developer', 'Full Stack', 'DevOps', 'Data Scientist', 'ML Engineer', 'Product Manager', 'QA Engineer']
const EXPERIENCES = ['', 'junior', 'mid', 'senior']

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({ role: '', min_score: 0, max_score: 100, skills: '', experience: '' })
  const [shortlisting, setShortlisting] = useState(null)

  const doSearch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.role) params.role = filters.role
      if (filters.min_score > 0) params.min_score = filters.min_score
      if (filters.max_score < 100) params.max_score = filters.max_score
      if (filters.skills) params.skills = filters.skills
      if (filters.experience) params.experience = filters.experience
      const data = await searchCandidates(params)
      setCandidates(data)
    } catch { setCandidates([]) } finally { setLoading(false) }
  }

  useEffect(() => { doSearch() }, []) // eslint-disable-line

  const handleShortlist = async (userId) => {
    setShortlisting(userId)
    try {
      await shortlistCandidate(userId, {})
      alert('Candidate shortlisted!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to shortlist')
    } finally { setShortlisting(null) }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-500 bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find Candidates</h1>
          <p className="text-slate-500 mt-1">{candidates.length} candidates found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Role</label>
              <select value={filters.role} onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition">
                <option value="">All Roles</option>
                {ROLES.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Min Score</label>
              <input type="number" min={0} max={100} value={filters.min_score}
                onChange={e => setFilters(p => ({ ...p, min_score: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Max Score</label>
              <input type="number" min={0} max={100} value={filters.max_score}
                onChange={e => setFilters(p => ({ ...p, max_score: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Skills</label>
              <input type="text" placeholder="React, Python..." value={filters.skills}
                onChange={e => setFilters(p => ({ ...p, skills: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Experience</label>
              <select value={filters.experience} onChange={e => setFilters(p => ({ ...p, experience: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition">
                <option value="">All Levels</option>
                {EXPERIENCES.filter(Boolean).map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={doSearch} disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              <Search size={16} /> {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Search size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No candidates found</p>
          <p className="text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {candidates.map((c) => (
            <div key={c.user_id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(c.name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{c.name || 'Anonymous'}</h3>
                  <p className="text-sm text-slate-500 truncate">{c.target_role || 'Student'}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${getScoreColor(c.score)}`}>
                  {c.score}%
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(c.skills || []).slice(0, 4).map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">{skill}</span>
                ))}
                {(c.skills || []).length > 4 && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium">+{c.skills.length - 4}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>{c.interviews_completed} interviews</span>
                <span className="capitalize">{c.experience || 'N/A'} level</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/company/candidate/${c.user_id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
                  <Eye size={14} /> Profile
                </Link>
                <button onClick={() => handleShortlist(c.user_id)} disabled={shortlisting === c.user_id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-sm hover:shadow-md transition disabled:opacity-50">
                  <Star size={14} /> {shortlisting === c.user_id ? '...' : 'Shortlist'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
