import { motion } from 'framer-motion'
import { Award, Briefcase, Calendar, Share2 } from 'lucide-react'

/**
 * ShareResultCard — screenshot-friendly interview result card
 * Shows score, job role, interview type, and date in a premium gradient design.
 */
export default function ShareResultCard({ score = 0, jobRole = '', interviewType = '', date = '', maxScore = 10 }) {
  const pct = Math.round((score / maxScore) * 100)
  const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444'
  const gradeText = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good Job' : 'Keep Going'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      id="share-result-card"
      style={{
        background: 'linear-gradient(145deg, #0f1f3d 0%, #1a3a6b 50%, #0f1f3d 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '420px',
        margin: '0 auto',
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(200,96,26,0.15)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20px', left: '-20px',
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(200,96,26,0.1)',
      }} />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #f07d2e, #c8601a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Share2 size={13} color="white" />
        </div>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>HiLearn Interview Prep</span>
      </div>

      {/* Score */}
      <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: '4px',
        }}>
          <span style={{
            fontSize: '56px', fontWeight: 800, lineHeight: 1,
            background: `linear-gradient(135deg, ${gradeColor}, ${gradeColor}cc)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {score}
          </span>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/{maxScore}</span>
        </div>
        <p style={{
          margin: '8px 0 0', fontSize: '14px', fontWeight: 700,
          color: gradeColor, letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          {gradeText}
        </p>
      </div>

      {/* Info */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '14px', padding: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative', zIndex: 1,
      }}>
        {jobRole && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={14} color="#c8601a" />
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{jobRole}</p>
            </div>
          </div>
        )}
        {interviewType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={14} color="#c8601a" />
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{interviewType}</p>
            </div>
          </div>
        )}
        {date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#c8601a" />
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{date}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{
        margin: '16px 0 0', textAlign: 'center',
        fontSize: '11px', color: 'rgba(255,255,255,0.35)',
        position: 'relative', zIndex: 1,
      }}>
        hilearn.in · AI-Powered Interview Prep
      </p>
    </motion.div>
  )
}
