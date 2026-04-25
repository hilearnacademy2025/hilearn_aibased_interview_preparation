import { useState, useEffect } from 'react'
import { Send, Clock, CheckCircle, XCircle } from 'lucide-react'
import { getCandidateResponses } from '../../utils/api'

export default function CompanyResponses() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCandidateResponses()
        setResponses(data)
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const filtered = filter === 'all' ? responses : responses.filter(r => r.status === filter)

  const statusConfig = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', label: 'Pending' },
    accepted: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Accepted' },
    rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Rejected' },
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Offer Responses</h1>
        <p className="text-slate-500 mt-1">Track responses from candidates you've reached out to</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'accepted', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${
              filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>
            {f} {f !== 'all' && `(${responses.filter(r => f === 'all' || r.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Send size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No {filter === 'all' ? '' : filter} offers yet</p>
          <p className="text-slate-400 mt-1">Send offers to candidates to see their responses here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const config = statusConfig[r.status] || statusConfig.pending
            const Icon = config.icon
            return (
              <div key={r.offer_id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(r.candidate_name || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900">{r.candidate_name || 'Unknown'}</h3>
                    <p className="text-sm text-slate-500">{r.job_title || 'General'}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${config.bg} ${config.color}`}>
                    <Icon size={14} /> {config.label}
                  </span>
                  <div className="text-right text-sm text-slate-400 hidden sm:block">
                    <p>Sent: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</p>
                    {r.responded_at && <p>Responded: {new Date(r.responded_at).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
