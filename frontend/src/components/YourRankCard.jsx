import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Users, Star } from 'lucide-react'

function getPercentileLabel(p) {
  if (p >= 99) return 'Top 1%'
  if (p >= 95) return 'Top 5%'
  if (p >= 90) return 'Top 10%'
  if (p >= 75) return 'Top 25%'
  if (p >= 50) return 'Top 50%'
  return `Top ${Math.max(100 - Math.floor(p), 1)}%`
}

function getPercentileColor(p) {
  if (p >= 90) return { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', border: 'rgba(34,197,94,0.25)' }
  if (p >= 70) return { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', border: 'rgba(59,130,246,0.25)' }
  if (p >= 40) return { bg: 'rgba(245,158,11,0.12)', text: '#d97706', border: 'rgba(245,158,11,0.25)' }
  return { bg: 'rgba(200,96,26,0.12)', text: '#c8601a', border: 'rgba(200,96,26,0.25)' }
}

export default function YourRankCard({ rankData, loading }) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(15,31,61,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <span
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#c8601a',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      </motion.div>
    )
  }

  if (!rankData || rankData.rank === null) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 100%)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '28px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(15,31,61,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Trophy size={32} color="rgba(255,255,255,0.3)" style={{ margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', fontWeight: 500, margin: 0 }}>
          {rankData?.message || 'Complete an interview to see your rank!'}
        </p>
      </motion.div>
    )
  }

  const pColors = getPercentileColor(rankData.percentile)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #162d55 50%, #1a3a6b 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: '0 8px 32px rgba(15,31,61,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow decoration */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,96,26,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #c8601a, #e07030)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(200,96,26,0.4)',
        }}>
          <Star size={16} color="white" fill="white" />
        </div>
        <div>
          <p style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>Your Ranking</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>Global leaderboard position</p>
        </div>

        {/* Percentile badge */}
        <div style={{
          marginLeft: 'auto',
          padding: '6px 14px', borderRadius: '20px',
          background: pColors.bg,
          border: `1px solid ${pColors.border}`,
        }}>
          <span style={{ color: pColors.text, fontSize: '13px', fontWeight: 700 }}>
            {getPercentileLabel(rankData.percentile)}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px',
      }}>
        {/* Rank */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <Trophy size={18} color="#c8601a" style={{ margin: '0 auto 6px' }} />
          <p style={{
            color: 'white', fontSize: '28px', fontWeight: 800,
            margin: '0', lineHeight: 1,
            background: 'linear-gradient(135deg, #fff, #c8601a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            #{rankData.rank}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>
            of {rankData.total_users?.toLocaleString() || '—'} users
          </p>
        </div>

        {/* Score */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <TrendingUp size={18} color="#22c55e" style={{ margin: '0 auto 6px' }} />
          <p style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: '0', lineHeight: 1 }}>
            {rankData.score}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>
            Avg Score
          </p>
        </div>

        {/* Interviews */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <Users size={18} color="#3b82f6" style={{ margin: '0 auto 6px' }} />
          <p style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: '0', lineHeight: 1 }}>
            {rankData.interviews_completed}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>
            Interviews
          </p>
        </div>

        {/* Percentile */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <Star size={18} color="#f59e0b" style={{ margin: '0 auto 6px' }} />
          <p style={{ color: 'white', fontSize: '28px', fontWeight: 800, margin: '0', lineHeight: 1 }}>
            {rankData.percentile}%
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>
            Percentile
          </p>
        </div>
      </div>
    </motion.div>
  )
}
