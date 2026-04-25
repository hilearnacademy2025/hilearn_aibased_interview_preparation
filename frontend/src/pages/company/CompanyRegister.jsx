import { AnimatePresence, motion } from 'framer-motion'
import { Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageTransition from '../../components/common/PageTransition'
import { useToast } from '../../components/common/ToastProvider'
import { useAuth } from '../../context/AuthContext'
import { companyRegister as apiCompanyRegister } from '../../utils/api'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'

function CompanyRegister() {
  const { pushToast } = useToast()
  const { companyLogin } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || null

  const [formData, setFormData] = useState({
    companyName: '', email: '', password: '', confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { document.title = 'Company Register | HiLearn For Companies' }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password))
      newErrors.password = 'Password must have uppercase, lowercase, digit & special character'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    return newErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setIsLoading(true)
    try {
      const payload = {
        company_name: formData.companyName,
        email: formData.email,
        password: formData.password
      }
      const data = await apiCompanyRegister(payload)
      await companyLogin(data)
      pushToast({ title: 'Company account created!', description: 'Welcome to your hiring dashboard.' })
      
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        navigate('/company', { replace: true })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Registration failed'
      pushToast({ title: 'Registration failed', description: errorMsg, type: 'error' })
      setErrors({ general: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const inputFields = [
    { name: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Acme Corp', colSpan: true },
    { name: 'email', label: 'Work Email', type: 'email', placeholder: 'hire@acmecorp.com', colSpan: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 chars, 1 uppercase, 1 number, 1 special', colSpan: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Confirm your password', colSpan: true },
  ]

  return (
    <div className="relative min-h-screen">
      <Header />
      <main>
        <PageTransition>
          <section className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
                <div className="mb-8 text-center flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#c8601a]/10 mb-4">
                    <Building2 className="w-6 h-6 text-[#c8601a]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Create account</p>
                  <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Register Your Company</h2>
                  <p className="mt-2 text-[#5c5a57]">Start hiring top talent today</p>
                  {redirect && <p className="mt-2 text-sm text-[#c8601a]">Register to continue ✓</p>}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {inputFields.map((field) => (
                      <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
                        <label className="mb-2 block text-sm font-medium text-[#5c5a57]">{field.label}</label>
                        <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} className="warm-input" placeholder={field.placeholder} />
                        <AnimatePresence>
                          {errors[field.name] && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }} exit={{ opacity: 0 }} className="mt-2 text-xs text-rose-600">
                              {errors[field.name]}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
                    <input type="checkbox" required className="h-4 w-4 accent-[#c8601a]" />
                    <span>I agree to the terms and privacy policy.</span>
                  </label>
                  {errors.general && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.general}</div>
                  )}
                  <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-[#c8601a] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(200,96,26,0.24)]">
                    {isLoading ? <span className="flex items-center gap-3"><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />Creating account</span> : 'Create Company Account'}
                  </button>
                </form>
                <p className="mt-6 text-center text-sm text-[#5c5a57]">
                  Already have a company account?{' '}
                  <Link to={redirect ? `/company/login?redirect=${encodeURIComponent(redirect)}` : '/company/login'} className="font-semibold text-[#c8601a]">Log in</Link>
                </p>
                <div className="mt-4 text-center">
                  <Link to="/signup" className="text-sm text-[#5c5a57] hover:text-[#0f1f3d] underline">
                    Looking for student signup?
                  </Link>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="navy-panel relative overflow-hidden rounded-[32px] p-8">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob right-0 top-0 h-48 w-48 bg-[#c8601a]/28" />
                <div className="relative">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/55">What you unlock</p>
                  <h2 className="display-font mt-4 text-5xl font-bold text-white">Streamline your hiring process today.</h2>
                  <div className="mt-8 space-y-3">
                    {['Post roles instantly to thousands of candidates', 'Access AI-vetted scores and interview playbacks', 'Filter candidates by specific technical skills', 'Reduce time-to-hire by 60%'].map((item, index) => (
                      <motion.div key={item} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 + index * 0.08 }} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/78">
                        {item}
                      </motion.div>
                    ))}
                  </div>
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

export default CompanyRegister
