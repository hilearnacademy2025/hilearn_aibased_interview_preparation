import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Briefcase, Send, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { getCompanyJobs, getShortlistedCandidates, getCandidateResponses } from '../../utils/api'

export default function CompanyDashboard() {
  const [stats, setStats] = useState({ jobs: 0, shortlisted: 0, responses: 0, pending: 0 })
  const [recentShortlisted, setRecentShortlisted] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobs, shortlisted, responses] = await Promise.all([
          getCompanyJobs().catch(() => []),
          getShortlistedCandidates().catch(() => []),
          getCandidateResponses().catch(() => []),
        ])
        setStats({
          jobs: jobs.length,
          shortlisted: shortlisted.length,
          responses: responses.length,
          pending: responses.filter(r => r.status === 'pending').length,
        })
        setRecentShortlisted(shortlisted.slice(0, 5))
      } catch { /* ignore */ } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25', href: '/company/jobs' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25', href: '/company/shortlisted' },
    { label: 'Offers Sent', value: stats.responses, icon: Send, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/25', href: '/company/responses' },
    { label: 'Pending', value: stats.pending, icon: TrendingUp, color: 'from-purple-500 to-indigo-500', shadow: 'shadow-purple-500/25', href: '/company/responses' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hiring Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your recruitment pipeline</p>
        </div>
        <Link to="/company/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <Search size={16} /> Find Candidates
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Link key={idx} to={card.href}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl ${card.shadow} hover:scale-[1.02] transition-all group`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-x-4 -translate-y-4" />
              <Icon size={24} className="mb-3 opacity-80" />
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-sm text-white/80 mt-1">{card.label}</p>
              <ArrowRight size={16} className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-80 transition-opacity" />
            </Link>
          )
        })}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { icon: Search, label: 'Search Candidates', desc: 'Browse and filter top talent', href: '/company/search', color: 'bg-blue-50 text-blue-600' },
              { icon: Briefcase, label: 'Post a Job', desc: 'Create a new job listing', href: '/company/jobs/new', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Users, label: 'View Matches', desc: 'AI-matched candidates for your jobs', href: '/company/matched', color: 'bg-purple-50 text-purple-600' },
            ].map((action, idx) => {
              const Icon = action.icon
              return (
                <Link key={idx} to={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{action.label}</p>
                    <p className="text-sm text-slate-500">{action.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Shortlisted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recently Shortlisted</h2>
            <Link to="/company/shortlisted" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">View All →</Link>
          </div>
          {recentShortlisted.length === 0 ? (
            <div className="text-center py-10">
              <Star size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No candidates shortlisted yet</p>
              <Link to="/company/search" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">Start searching →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentShortlisted.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(item.candidate_name || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{item.candidate_name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{item.job_title || 'General'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{item.shortlisted_at ? new Date(item.shortlisted_at).toLocaleDateString() : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
