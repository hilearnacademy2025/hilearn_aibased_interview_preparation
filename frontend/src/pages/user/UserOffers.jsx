import { useState, useEffect } from 'react'
import { Send, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getJobOffers, respondToOffer } from '../../utils/api'

export default function UserOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [respondingTo, setRespondingTo] = useState(null)
  const [responseMsg, setResponseMsg] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getJobOffers()
        setOffers(data)
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleRespond = async (offerId, status) => {
    try {
      await respondToOffer(offerId, status, responseMsg)
      setOffers(prev => prev.map(o => o.offer_id === offerId ? { ...o, status, responded_at: new Date().toISOString() } : o))
      setRespondingTo(null)
      setResponseMsg('')
    } catch { alert('Failed to respond') }
  }

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
        <h1 className="text-2xl font-bold text-slate-900">Job Offers</h1>
        <p className="text-slate-500 mt-1">Manage job offers from companies</p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Send size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No offers yet</p>
          <p className="text-slate-400 mt-1">Complete more interviews to get noticed by companies</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const config = statusConfig[offer.status] || statusConfig.pending
            const Icon = config.icon
            return (
              <div key={offer.offer_id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {(offer.company_name || 'CO').slice(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{offer.company_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.bg} ${config.color}`}>
                        <Icon size={12} /> {config.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-1">{offer.job_title}</p>
                    
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 text-slate-700 text-sm border border-slate-100">
                      <p className="font-semibold text-slate-900 mb-1">Message from {offer.company_name}:</p>
                      {offer.message}
                      {offer.call_link && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="font-semibold text-slate-900">Meeting Link: </span>
                          <a href={offer.call_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {offer.call_link}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {offer.status === 'pending' && respondingTo !== offer.offer_id && (
                      <div className="mt-4 flex gap-3">
                        <button onClick={() => setRespondingTo(offer.offer_id)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                          Respond
                        </button>
                      </div>
                    )}

                    {respondingTo === offer.offer_id && (
                      <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50 space-y-3">
                        <label className="block text-sm font-semibold text-blue-900">Add a message (optional)</label>
                        <textarea value={responseMsg} onChange={e => setResponseMsg(e.target.value)} rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition resize-none"
                          placeholder="Thank you for the offer..." />
                        <div className="flex gap-2">
                          <button onClick={() => handleRespond(offer.offer_id, 'accepted')}
                            className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
                            Accept
                          </button>
                          <button onClick={() => handleRespond(offer.offer_id, 'rejected')}
                            className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">
                            Decline
                          </button>
                          <button onClick={() => setRespondingTo(null)}
                            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-xs text-slate-400">
                    <p>Received: {new Date(offer.created_at).toLocaleDateString()}</p>
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
