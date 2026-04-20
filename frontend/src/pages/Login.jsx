import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/common/PageTransition'
import { useToast } from '../components/common/ToastProvider'

function Login() {
  const { pushToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Login | HiLearn Interview Prep'
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Enter both email and password to continue.')
      return
    }
    setError('')
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      pushToast({
        title: 'Login submitted',
        description: 'Your sign-in flow has been acknowledged.',
      })
      console.log('Login attempted', { email, password })
    }, 1000)
  }

  return (
    <PageTransition>
      <section className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="navy-panel relative overflow-hidden rounded-[32px] p-8">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="ambient-blob -left-8 top-0 h-44 w-44 bg-[#c8601a]/30" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">Welcome back</p>
              <h1 className="display-font mt-4 text-5xl font-bold text-white">Return to your premium practice workspace.</h1>
              <p className="mt-4 text-lg leading-8 text-white/72">A warmer sign-in surface with staggered benefit reveals and stronger focus states.</p>
              <div className="mt-8 space-y-3">
                {['Track interview streaks', 'Review your feedback history', 'Jump back into the dashboard', 'Continue your active prep cycle'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 + index * 0.08 }}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-white/78"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="surface-card px-6 py-8 md:px-8">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Sign in</p>
              <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Login to your account</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[#5c5a57]">Email address</span>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="warm-input" placeholder="student@college.edu" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[#5c5a57]">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="warm-input" placeholder="Enter your password" />
              </label>
              <div className="text-right">
                <Link to="/signup" className="text-sm text-[#c8601a]">Need an account?</Link>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center rounded-full bg-[#c8601a] px-5 py-4 text-base font-semibold text-white shadow-[0_16px_28px_rgba(200,96,26,0.24)]">
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    Signing in
                  </span>
                ) : 'Sign in'}
              </button>
            </form>
            <div className="mt-6 rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-4 text-sm text-[#5c5a57]">
              Demo credentials: `demo@hilearn.ai` / `demo123`
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}

export default Login
