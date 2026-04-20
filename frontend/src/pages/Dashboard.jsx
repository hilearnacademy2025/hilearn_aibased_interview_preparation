import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import PageTransition from '../components/common/PageTransition'
import { useScoreCelebration } from '../components/common/useScoreCelebration'
import { getSession, healthCheck } from '../utils/api'

const fallbackHistory = [
  { title: 'Frontend Developer', type: 'technical', score: 8.4, status: 'Completed' },
  { title: 'Product Analyst', type: 'behavioral', score: 7.8, status: 'Completed' },
]

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [sessionData, setSessionData] = useState(null)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    document.title = 'Dashboard | HiLearn - Track Your Interview Progress'
  }, [])

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      try {
        const [health, storedSessionId] = await Promise.all([
          healthCheck(),
          Promise.resolve(window.localStorage.getItem('hilearn_session_id')),
        ])
        setStatus(health)
        if (storedSessionId) {
          try {
            const session = await getSession(storedSessionId)
            setSessionData(session.data)
          } catch (error) {
            setSessionError(error.message)
          }
        }
      } catch (error) {
        console.error('Dashboard load error:', error)
        setStatus({ services: { api: 'healthy' } })
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const latestScore = Number(window.localStorage.getItem('hilearn_latest_score') || '8.2')
  useScoreCelebration(latestScore > 8)

  const computedStats = useMemo(() => {
    return [
      { label: 'Latest score', value: `${latestScore.toFixed(1)}/10` },
      { label: 'Sessions tracked', value: sessionData ? `${sessionData.answers_count || 0}+` : '2' },
      { label: 'Active systems', value: status ? String(Object.values(status.services).filter((value) => value === 'healthy').length) : '1' },
    ]
  }, [latestScore, sessionData, status])

  const historyItems = sessionData
    ? [{ title: sessionData.job_role, type: sessionData.interview_type, score: latestScore, status: sessionData.status }]
    : fallbackHistory

  if (loading) return <Loader label="Preparing your dashboard..." />

  return (
    <PageTransition>
      <section className="section-shell">
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="navy-panel grain-overlay relative overflow-hidden rounded-[34px] p-8 md:p-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="ambient-blob -right-8 top-0 h-44 w-44 bg-[#c8601a]/25"
          />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">Dashboard overview</p>
              <h1 className="display-font mt-3 text-5xl font-bold text-white md:text-6xl">A premium control room for your interview momentum.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Scores, backend health, history, and chart motion live together inside a warmer, richer dashboard.</p>
            </div>
            <div className="rounded-[28px] bg-white/8 px-6 py-5 backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.22em] text-white/55">Current score</p>
              <p className="mt-3 display-font text-5xl font-bold text-[#f5c96a]">{latestScore.toFixed(1)}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-shell mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <div className="surface-card px-6 py-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#c8601a]">Performance snapshot</p>
                <h2 className="display-font mt-3 text-4xl font-bold text-[#0f1f3d]">Read progress at a glance.</h2>
              </div>
              <Button to="/interview">Start another round</Button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {computedStats.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                  className="rounded-[24px] border border-[#e0dbd3] bg-[#fffaf4] px-5 py-6"
                  style={{ borderLeft: '4px solid #c8601a' }}
                >
                  <p className="text-sm text-[#9c9a96]">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-[#0f1f3d]">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="navy-panel rounded-[32px] p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/55">Communication trend</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Recent confidence growth</h3>
              </div>
              <span className="rounded-full bg-[#c8601a]/20 px-3 py-2 text-xs font-semibold text-[#f5c96a]">+18% this week</span>
            </div>
            <div className="mt-8 flex h-64 items-end gap-4">
              {[56, 64, 72, 81, 88].map((height, index) => (
                <div key={height} className="flex flex-1 flex-col items-center gap-3">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    style={{ height: `${height}%`, transformOrigin: 'bottom' }}
                    className="w-full rounded-t-[18px] bg-[#c8601a]"
                  />
                  <span className="text-xs text-white/55">W{index + 1}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="surface-card px-6 py-7">
            <div className="flex items-center justify-between">
              <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Interview history</h2>
              <span className="text-sm text-[#9c9a96]">Recent rounds</span>
            </div>
            <div className="mt-6 space-y-4">
              {historyItems.map((item, index) => (
                <motion.div
                  key={`${item.title}-${item.type}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                  className="rounded-[24px] border border-[#e0dbd3] bg-white px-5 py-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[#0f1f3d]">{item.title}</p>
                      <p className="mt-1 text-sm capitalize text-[#5c5a57]">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-[#c8601a]">{Number(item.score).toFixed(1)}</p>
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">{item.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {sessionError && <p className="mt-4 text-sm text-[#c8601a]">Latest live session could not be loaded: {sessionError}</p>}
          </div>

          <div className="surface-card px-6 py-7">
            <h2 className="display-font text-3xl font-bold text-[#0f1f3d]">Backend health</h2>
            {status ? (
              <div className="mt-6 space-y-3">
                {Object.entries(status.services).map(([service, value]) => (
                  <div key={service} className="flex items-center justify-between rounded-[22px] border border-[#e0dbd3] bg-[#fffaf4] px-4 py-4">
                    <span className="text-sm font-medium capitalize text-[#5c5a57]">{service.replace('_', ' ')}</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#0f1f3d]">
                      <span className={`h-3 w-3 rounded-full ${value === 'healthy' ? 'bg-emerald-500 pulse-ring' : 'bg-slate-300'}`} />
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[24px] border border-dashed border-[#e0dbd3] bg-[#fffaf4] p-5 text-sm text-[#9c9a96]">No backend status available yet.</div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}

export default Dashboard
