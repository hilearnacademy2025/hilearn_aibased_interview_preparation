import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, Send, BarChart3, Briefcase, Award, AlertTriangle } from 'lucide-react'
import { getCandidateProfile, shortlistCandidate } from '../../utils/api'

export default function CandidateProfile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shortlisting, setShortlisting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCandidateProfile(userId)
        setProfile(data)
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    fetch()
  }, [userId])

  const handleShortlist = async () => {
    setShortlisting(true)
    try {
      await shortlistCandidate(userId, {})
      alert('Candidate shortlisted!')
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed')
    } finally { setShortlisting(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!profile) return (
    <div className="text-center py-20">
      <p className="text-lg text-slate-600">Candidate not found</p>
      <Link to="/company/search" className="text-blue-600 font-semibold mt-2 inline-block">← Back to search</Link>
    </div>
  )

  const scoreColor = profile.score >= 70 ? 'text-emerald-600' : profile.score >= 40 ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/company/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition">
        <ArrowLeft size={16} /> Back to search
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/25 flex-shrink-0">
            {(profile.name || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{profile.name || 'Anonymous'}</h1>
            <p className="text-slate-500 mt-1">{profile.target_role || 'Student'} • {profile.experience || 'N/A'} level</p>
            <p className="text-sm text-slate-400 mt-1">{profile.email}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {(profile.skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">{skill}</span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreColor}`}>{profile.score}%</div>
            <p className="text-sm text-slate-500 mt-1">Overall Score</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
          <button onClick={handleShortlist} disabled={shortlisting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl transition disabled:opacity-50">
            <Star size={16} /> {shortlisting ? 'Adding...' : 'Shortlist'}
          </button>
          <Link to={`/company/send-offer/${userId}`} state={{ profile }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl transition">
            <Send size={16} /> Send Offer
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={18} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-500">Interviews</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{profile.interviews_completed}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <Award size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold text-slate-500">Strong Areas</span>
          </div>
          <p className="text-sm text-slate-700">{(profile.strong_areas || []).join(', ') || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <span className="text-sm font-semibold text-slate-500">Weak Areas</span>
          </div>
          <p className="text-sm text-slate-700">{(profile.weak_areas || []).join(', ') || 'N/A'}</p>
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase size={18} className="text-slate-400" /> Interview History
        </h2>
        {(profile.interview_history || []).length === 0 ? (
          <p className="text-slate-500 text-center py-8">No interview history available</p>
        ) : (
          <div className="space-y-3">
            {profile.interview_history.map((interview, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{interview.job_role}</p>
                  <p className="text-xs text-slate-500 capitalize">{interview.interview_type} • {interview.questions_count} questions</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${interview.score >= 70 ? 'text-emerald-600 bg-emerald-50' : interview.score >= 40 ? 'text-amber-600 bg-amber-50' : 'text-red-500 bg-red-50'}`}>
                  {interview.score}%
                </div>
                <span className="text-xs text-slate-400">{interview.date ? new Date(interview.date).toLocaleDateString() : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
