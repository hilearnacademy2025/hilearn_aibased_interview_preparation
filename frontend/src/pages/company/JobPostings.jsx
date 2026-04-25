import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Plus, Trash2, Edit3, Users, MapPin, Clock } from 'lucide-react'
import { getCompanyJobs, deleteJob } from '../../utils/api'

export default function JobPostings() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getCompanyJobs()
        setJobs(data)
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    fetchJobs()
  }, [])

  const handleDelete = async (jobId) => {
    if (!confirm('Close this job posting?')) return
    try {
      await deleteJob(jobId)
      setJobs(prev => prev.map(j => j.job_id === jobId ? { ...j, status: 'closed', is_active: false } : j))
    } catch { alert('Failed to close job') }
  }

  const statusBadge = (status) => {
    const map = {
      open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      closed: 'bg-red-50 text-red-600 border-red-200',
      paused: 'bg-amber-50 text-amber-700 border-amber-200',
    }
    return map[status] || map.open
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
          <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-slate-500 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/company/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-xl transition">
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-lg text-slate-600 font-semibold">No jobs posted yet</p>
          <Link to="/company/jobs/new" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">Post your first job →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Users size={14} /> {job.required_role}</span>
                    {job.location && <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>}
                    {job.salary_range && <span className="font-semibold text-emerald-600">{job.salary_range}</span>}
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(job.required_skills || []).slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/company/matched?job=${job.job_id}`}
                    className="px-4 py-2 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition">
                    Matches
                  </Link>
                  {job.is_active && (
                    <button onClick={() => handleDelete(job.job_id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition" title="Close Job">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
