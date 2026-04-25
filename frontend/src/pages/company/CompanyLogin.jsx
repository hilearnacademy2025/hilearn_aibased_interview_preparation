  import { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { Building2, ArrowRight, Eye, EyeOff } from 'lucide-react'
  import { companyLogin as apiCompanyLogin } from '../../utils/api'
  import { useAuth } from '../../context/AuthContext'

  export default function CompanyLogin() {
    const navigate = useNavigate()
    const { companyLogin } = useAuth()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      setLoading(true)
      try {
        const data = await apiCompanyLogin(form.email, form.password)
        await companyLogin(data)
        navigate('/company')
      } catch (err) {
        setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Company Login</h1>
            <p className="text-blue-200/70">Access your hiring dashboard</p>
          </div>

          <div className="bg-white/[0.08] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  placeholder="hire@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1.5">Password</label>
                <div className="relative">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition pr-12"
                    placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-blue-200 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {loading ? 'Logging in...' : <>Login <ArrowRight size={18} /></>}
              </button>
            </form>

            <p className="text-center text-blue-200/50 text-sm mt-6">
              Don't have a company account?{' '}
              <Link to="/company/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">Register</Link>
            </p>
            <p className="text-center text-blue-200/40 text-xs mt-3">
              Student? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">Student Login</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }





 