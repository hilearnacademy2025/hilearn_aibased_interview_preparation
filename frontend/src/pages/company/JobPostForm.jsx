import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, X } from 'lucide-react'
import { createJob } from '../../utils/api'

const ROLES = ['Backend Developer', 'Frontend Developer', 'Full Stack', 'DevOps', 'Data Scientist', 'ML Engineer', 'Product Manager', 'QA Engineer', 'UI/UX Designer']
const EXPERIENCES = ['junior', 'mid', 'senior']

export default function JobPostForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    job_title: '', job_description: '', required_role: '',
    required_score: 50, required_skills: [], experience_level: 'mid',
    salary_range: '', location: '', deadline: '',
  })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.required_skills.includes(s)) {
      setForm(prev => ({ ...prev, required_skills: [...prev.required_skills, s] }))
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setForm(prev => ({ ...prev, required_skills: prev.required_skills.filter(s => s !== skill) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createJob({
        ...form,
        required_score: Number(form.required_score),
        deadline: form.deadline || null,
      })
      navigate('/company/jobs')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Post a New Job</h1>
            <p className="text-sm text-slate-500">Fill in the details to find matching candidates</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Title *</label>
              <input name="job_title" value={form.job_title} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                placeholder="Senior Backend Developer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Required Role *</label>
              <select name="required_role" value={form.required_role} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition">
                <option value="">Select role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Job Description</label>
            <textarea name="job_description" value={form.job_description} onChange={handleChange} rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition resize-none"
              placeholder="Describe the role, responsibilities, and requirements..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min Score (%)</label>
              <input type="number" name="required_score" min={0} max={100} value={form.required_score} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience Level</label>
              <select name="experience_level" value={form.experience_level} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition">
                {EXPERIENCES.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deadline</label>
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Salary Range</label>
              <input name="salary_range" value={form.salary_range} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition"
                placeholder="₹8-15 LPA" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/30 transition"
                placeholder="Bangalore, Remote" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Required Skills</label>
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/30 transition"
                placeholder="Type a skill and press Enter" />
              <button type="button" onClick={addSkill}
                className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.required_skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
            {loading ? 'Creating...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
