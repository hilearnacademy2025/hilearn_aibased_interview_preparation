import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { companyRegister } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Consulting', 'Media', 'Other']
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']

export default function CompanyRegister() {
  const navigate = useNavigate()
  const { companyLogin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    company_name: '', email: '', password: '',
    industry: '', company_size: '', website: '', description: '',
  })

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await companyRegister(form)
      await companyLogin(data)
      navigate('/company')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Register Your Company</h1>
          <p className="text-blue-200/70">Find & hire the best interview-ready candidates</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.08] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Company Name *</label>
                <input name="company_name" value={form.company_name} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  placeholder="Acme Corp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                  placeholder="hire@acme.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Password *</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required minLength={8}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition pr-12"
                  placeholder="Min 8 chars, uppercase, number, symbol" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none">
                  <option value="" className="bg-slate-900">Select industry</option>
                  {INDUSTRIES.map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Company Size</label>
                <select name="company_size" value={form.company_size} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none">
                  <option value="" className="bg-slate-900">Select size</option>
                  {SIZES.map(s => <option key={s} value={s} className="bg-slate-900">{s} employees</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Website</label>
              <input name="website" value={form.website} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                placeholder="https://acme.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                placeholder="Tell candidates about your company..." />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : <>Create Company Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-blue-200/50 text-sm mt-6">
            Already have a company account?{' '}
            <Link to="/company/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">Log in</Link>
          </p>
          <p className="text-center text-blue-200/40 text-xs mt-3">
            Looking for interview prep? <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition">Student Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
