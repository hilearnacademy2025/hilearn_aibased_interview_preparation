import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader, ExternalLink } from 'lucide-react'
import ShareResultCard from '../components/ShareResultCard'

/**
 * ShareResult — public read-only page for sharing interview results
 * Route: /share/:interviewId
 */
export default function ShareResult() {
  const { interviewId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Try to load from localStorage first (for the sharer's own view)
    const stored = localStorage.getItem('hilearn_complete_feedback')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data?.session_id === interviewId || !interviewId) {
          setResult({
            score: data?.feedback?.overall_score ?? data?.overall_score ?? 0,
            jobRole: data?.job_role || '',
            interviewType: data?.interview_type || '',
            userName: data?.user_name || 'HiLearn Student',
            date: data?.completed_at
              ? new Date(data.completed_at).toLocaleDateString()
              : new Date().toLocaleDateString(),
          })
          setLoading(false)
          return
        }
      } catch {
        // Fall through to API
      }
    }

    // Fallback: show a generic shared result
    setResult({
      score: 0,
      jobRole: 'Interview',
      interviewType: 'Mock',
      userName: 'HiLearn Student',
      date: new Date().toLocaleDateString(),
    })
    setLoading(false)
  }, [interviewId])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f4f2ee', fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <Loader className="animate-spin" size={32} color="#c8601a" />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f4f2ee', fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</p>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f1f3d' }}>Result Not Found</h1>
          <p style={{ fontSize: '14px', color: '#9c9a96', marginTop: '8px' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4f2ee 0%, #e8e4df 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: '40px 16px',
    }}>
      {/* SEO Meta */}
      <title>Interview Results | HiLearn AI Interview Prep</title>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <p style={{ fontSize: '11px', color: '#c8601a', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Interview Results
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f1f3d', marginTop: '6px' }}>
            {result.userName}'s Performance
          </h1>
        </motion.div>

        {/* Result Card */}
        <ShareResultCard
          score={result.score}
          jobRole={result.jobRole}
          interviewType={result.interviewType}
          date={result.date}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '32px' }}
        >
          <a
            href="https://hilearn.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #c8601a, #e07030)',
              color: 'white', fontSize: '14px', fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(200,96,26,0.35)',
            }}
          >
            Try HiLearn Free <ExternalLink size={14} />
          </a>
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#9c9a96' }}>
            AI-powered mock interviews · Free to start
          </p>
        </motion.div>
      </div>
    </div>
  )
}
