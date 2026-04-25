import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Users, Star, Eye, Send, Trophy, Sparkles } from 'lucide-react'
import { getMatchedCandidates, getCompanyJobs, sendOffer } from '../../utils/api'

export default function MatchedCandidates() {
  const [searchParams] = useSearchParams()
  const [matched, setMatched] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(searchParams.get('job') || '')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(null)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getCompanyJobs()
        setJobs(data.filter(j => j.is_active))
        if (!selectedJob && data.length > 0) setSelectedJob(data[0].job_id)
      } catch { /* ignore */ }
    }
    fetchJobs()
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!selectedJob) return
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const data = await getMatchedCandidates(selectedJob)
        setMatched(data)
      } catch { setMatched([]) } finally { setLoading(false) }
    }
    fetchMatches()
  }, [selectedJob])

  const handleSendOffer = async (userId) => {
    setSending(userId)
    try {
      await sendOffer(userId, { job_id: selectedJob, message: 'We would like to discuss this opportunity with you.' })
      alert('Offer sent successfully!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to send offer')
    } finally { setSending(null) }
  }

  const getMatchColor = (score) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500'
    if (score >= 40) return 'from-amber-500 to-orange-500'
    return 'from-slate-400 to-slate-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={24} className="text-purple-500" /> AI Matched Candidates
          </h1>
          <p className="text-slate-500 mt-1">Automatically matched based on job requirements</p>
        </div>
      </div>

      {/* Job Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Job Posting</label>
        <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition">
          <option value="">Choose a job...</option>
          {jobs.map(j => <option key={j.job_id} value={j.job_id}>{j.title} — {j.required_role}</option>)}
        </select>
      </div>

      {/* Results */}
      {!selectedJob ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">Select a job to see matches</p>
          <p className="text-slate-400 mt-1">Our AI will rank candidates by fit score</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : matched.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Users size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No matches found</p>
          <p className="text-slate-400 mt-1">Try adjusting job requirements or wait for more candidates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matched.map((c) => (
            <div key={c.user_id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Rank Badge */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getMatchColor(c.match_score)} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                    {c.rank <= 3 ? <Trophy size={22} /> : <span className="text-lg font-bold">#{c.rank}</span>}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{c.name || 'Anonymous'}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getMatchColor(c.match_score)}`}>
                      {c.match_score}% match
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{c.target_role || 'Student'} • {c.experience || 'N/A'} level • Score: {c.score}%</p>
                  <p className="text-sm text-blue-600 mt-2 font-medium">{c.reason}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(c.skills || []).slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/company/candidate/${c.user_id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition">
                    <Eye size={14} /> View
                  </Link>
                  <button onClick={() => handleSendOffer(c.user_id)} disabled={sending === c.user_id}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition disabled:opacity-50">
                    <Send size={14} /> {sending === c.user_id ? '...' : 'Offer'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
