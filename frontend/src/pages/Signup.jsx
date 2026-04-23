
// import { AnimatePresence, motion } from 'framer-motion'
// import { useEffect, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import PageTransition from '../components/common/PageTransition'
// import { useToast } from '../components/common/ToastProvider'
// import { useAuth } from '../context/AuthContext'
// import api from '../utils/api'

// function Signup() {
//   const { pushToast } = useToast()
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [errors, setErrors] = useState({})

//   useEffect(() => {
//     document.title = 'Sign Up | HiLearn Interview Prep'
//   }, [])

//   const handleChange = (event) => {
//     const { name, value } = event.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
//   }

//   const validateForm = () => {
//     const newErrors = {}
//     if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
//     if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
//     if (!formData.email.trim()) newErrors.email = 'Email is required'
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
//     if (!formData.password) newErrors.password = 'Password is required'
//     else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
//     else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password))
//       newErrors.password = 'Password must have uppercase, lowercase, digit & special character'
//     if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
//     return newErrors
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     const newErrors = validateForm()
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors)
//       return
//     }
//     setIsLoading(true)
//     try {
//       // Call backend signup
//       const fullName = `${formData.firstName} ${formData.lastName}`.trim()
//       await api.post('/auth/signup', {
//         email: formData.email,
//         password: formData.password,
//         name: fullName,
//         role: 'student'
//       })
//       // Signup successful, now login
//       const loginData = await login(formData.email, formData.password)
//       pushToast({ title: 'Account created!', description: loginData.message || 'Welcome to HiLearn!' })
//       // Redirect based on role (login returns data with role)
//       navigate(loginData.role === 'admin' ? '/admin' : '/user', { replace: true })
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || err.message || 'Signup failed'
//       pushToast({ title: 'Signup failed', description: errorMsg, type: 'error' })
//       setErrors({ general: errorMsg })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const inputFields = [
//     { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Aarav', colSpan: false },
//     { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Sharma', colSpan: false },
//     { name: 'email', label: 'Email', type: 'email', placeholder: 'aarav@example.com', colSpan: true },
//     { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 chars, 1 uppercase, 1 number, 1 special', colSpan: true },
//     { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Confirm your password', colSpan: true },
//   ]

//   return (
//     <PageTransition>
//       <section className="section-shell">
//         <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
//           <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
//             <div className="mb-8 text-center">
//               <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Create account</p>
//               <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Start your interview prep journey.</h2>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 {inputFields.map((field) => (
//                   <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
//                     <label className="mb-2 block text-sm font-medium text-[#5c5a57]">{field.label}</label>
//                     <input
//                       type={field.type}
//                       name={field.name}
//                       value={formData[field.name]}
//                       onChange={handleChange}
//                       className="warm-input"
//                       placeholder={field.placeholder}
//                     />
//                     <AnimatePresence>
//                       {errors[field.name] && (
//                         <motion.p
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
//                           exit={{ opacity: 0 }}
//                           className="mt-2 text-xs text-rose-600"
//                         >
//                           {errors[field.name]}
//                         </motion.p>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 ))}
//               </div>
//               <label className="flex items-center gap-3 rounded-2xl border border-[#e0dbd3] bg-[#fffaf4] px-4 py-3 text-sm text-[#5c5a57]">
//                 <input type="checkbox" required className="h-4 w-4 accent-[#c8601a]" />
//                 <span>I agree to the terms and privacy policy.</span>
//               </label>
//               {errors.general && (
//                 <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//                   {errors.general}
//                 </div>
//               )}
//               <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-[#c8601a] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(200,96,26,0.24)]">
//                 {isLoading ? (
//                   <span className="flex items-center gap-3">
//                     <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
//                     Creating account
//                   </span>
//                 ) : 'Create account'}
//               </button>
//             </form>
//             <p className="mt-6 text-center text-sm text-[#5c5a57]">
//               Already have an account? <Link to="/login" className="font-semibold text-[#c8601a]">Sign in</Link>
//             </p>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="navy-panel relative overflow-hidden rounded-[32px] p-8">
//             <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob right-0 top-0 h-48 w-48 bg-[#c8601a]/28" />
//             <div className="relative">
//               <p className="text-sm uppercase tracking-[0.24em] text-white/55">What you unlock</p>
//               <h2 className="display-font mt-4 text-5xl font-bold text-white">A richer practice environment from day one.</h2>
//               <div className="mt-8 space-y-3">
//                 {[
//                   'Role-based AI interview rooms',
//                   'Premium feedback scorecards',
//                   'Dashboard progress tracking',
//                   'Smoother motion and polished warm visuals',
//                 ].map((item, index) => (
//                   <motion.div
//                     key={item}
//                     initial={{ opacity: 0, x: 16 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.16 + index * 0.08 }}
//                     className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/78"
//                   >
//                     {item}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </PageTransition>
//   )
// }

// export default Signup



import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function Signup() {
  const { pushToast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || null

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => { document.title = 'Sign Up | HiLearn Interview Prep' }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
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
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      await api.post('/auth/signup', { email: formData.email, password: formData.password, name: fullName, role: 'student' })
      const loginData = await login(formData.email, formData.password)
      pushToast({ title: 'Account created!', description: loginData.message || 'Welcome to HiLearn!' })
      // redirect URL hai to wahan bhejo, warna dashboard
      if (redirect) {
        navigate(redirect, { replace: true })
      } else {
        navigate(loginData.role === 'admin' ? '/admin' : '/user', { replace: true })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Signup failed'
      pushToast({ title: 'Signup failed', description: errorMsg, type: 'error' })
      setErrors({ general: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const inputFields = [
    { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Aarav', colSpan: false },
    { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'Sharma', colSpan: false },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'aarav@example.com', colSpan: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 chars, 1 uppercase, 1 number, 1 special', colSpan: true },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Confirm your password', colSpan: true },
  ]

  return (
    <PageTransition>
      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Create account</p>
              <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Start your interview prep journey.</h2>
              {redirect && <p className="mt-2 text-sm text-[#c8601a]">Account banao aur continue karo ✓</p>}
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
                {isLoading ? <span className="flex items-center gap-3"><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />Creating account</span> : 'Create account'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#5c5a57]">
              Already have an account?{' '}
              <Link to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} className="font-semibold text-[#c8601a]">Sign in</Link>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="navy-panel relative overflow-hidden rounded-[32px] p-8">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob right-0 top-0 h-48 w-48 bg-[#c8601a]/28" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">What you unlock</p>
              <h2 className="display-font mt-4 text-5xl font-bold text-white">A richer practice environment from day one.</h2>
              <div className="mt-8 space-y-3">
                {['Role-based AI interview rooms', 'Premium feedback scorecards', 'Dashboard progress tracking', 'Smoother motion and polished warm visuals'].map((item, index) => (
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
  )
}

export default Signup