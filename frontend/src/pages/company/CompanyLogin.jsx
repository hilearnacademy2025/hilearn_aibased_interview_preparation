import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageTransition from '../../components/common/PageTransition'
import { useToast } from '../../components/common/ToastProvider'
import { useAuth } from '../../context/AuthContext'
import { companyLogin as apiCompanyLogin } from '../../utils/api'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'

function CompanyLogin() {
  const { pushToast } = useToast()
  const { companyLogin, logout, isCompany, company, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { document.title = 'Company Login | HiLearn For Companies' }, [])

  // Already logged in + redirect URL hai → seedha wahan bhejo
  useEffect(() => {
    if (isCompany && redirect) {
      navigate(redirect, { replace: true })
    }
  }, [isCompany, redirect, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) { setError('Enter both email and password.'); return }
    setError('')
    setIsLoading(true)
    try {
      const data = await apiCompanyLogin(email.trim(), password)
      await companyLogin(data)
      pushToast({ title: 'Welcome back!', description: 'Logged into company dashboard.' })
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        navigate('/company', { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoutAndStay = async () => {
    await logout()
    pushToast({ title: 'Logged out', description: 'You can now login with different account.' })
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <main>
        <PageTransition>
          <section className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="navy-panel relative overflow-hidden rounded-[32px] p-8">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob -left-8 top-0 h-44 w-44 bg-[#c8601a]/30" />
                <div className="relative">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/55">Company Portal</p>
                  <h1 className="display-font mt-4 text-5xl font-bold text-white">Hire top talent effortlessly.</h1>
                  <p className="mt-4 text-lg leading-8 text-white/72">Manage your hiring dashboard and find the best candidates.</p>
                  <div className="mt-8 space-y-3">
                    {['Access AI-vetted candidate profiles', 'Review detailed mock interview scores', 'Post new jobs in seconds', 'Streamline your hiring process'].map((item, index) => (
                      <motion.div key={item} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 + index * 0.08 }} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/78">{item}</motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
                <div className="mb-8 text-center flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#c8601a]/10 mb-4">
                    <Building2 className="w-6 h-6 text-[#c8601a]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Company Login</p>
                  <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Login to your dashboard</h2>
                  {redirect && (
                    <p className="mt-2 text-sm text-[#c8601a]">Please login to continue ✓</p>
                  )}
                </div>

                {/* If logged in as student or already logged in */}
                {isAuthenticated && user && !isCompany && (
                   <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p>✅ Currently logged in as student: <strong>{user.email}</strong></p>
                    <button onClick={handleLogoutAndStay} className="mt-2 text-sm font-semibold text-[#c8601a] underline">
                      Logout to sign in as company →
                    </button>
                   </div>
                )}

                {isCompany && company && (
                  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <p>✅ Already logged in as <strong>{company.email}</strong></p>
                    <button onClick={handleLogoutAndStay} className="mt-2 text-sm font-semibold text-[#c8601a] underline">
                      Switch account →
                    </button>
                    <button onClick={() => navigate(redirect || '/company')} className="ml-4 text-sm font-semibold text-[#0f1f3d] underline">
                      {redirect ? 'Continue →' : 'Go to Dashboard'}
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-[#5c5a57]">Work email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="warm-input" placeholder="hire@company.com" autoComplete="email" />
                  </label>
                  <label className="block space-y-2 relative">
                    <span className="text-sm font-medium text-[#5c5a57]">Password</span>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="warm-input pr-12" placeholder="Enter your password" autoComplete="current-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c5a57] hover:text-[#0f1f3d] transition">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>
                  <div className="text-right">
                    <Link to={redirect ? `/company/register?redirect=${encodeURIComponent(redirect)}` : '/company/register'} className="text-sm text-[#c8601a]">
                      Don't have a company account? Register
                    </Link>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }} exit={{ opacity: 0 }} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-[#c8601a] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(200,96,26,0.24)] hover:bg-[#b0541a] transition disabled:opacity-70">
                    {isLoading ? <span className="flex items-center gap-3"><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />Logging in…</span> : 'Login'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-[#5c5a57] hover:text-[#0f1f3d] underline">
                    Student? Student Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default CompanyLogin