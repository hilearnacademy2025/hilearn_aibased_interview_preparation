import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Crown, Medal, Award, Filter, Clock, Globe, Briefcase, ChevronDown, User, Loader, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getLeaderboard, getMyRank } from '../../utils/api'
import YourRankCard from '../../components/YourRankCard'

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'global',  label: 'Global',  icon: Globe,     desc: 'All-time top performers' },
  { id: 'weekly',  label: 'Weekly',  icon: Clock,     desc: 'Top performers this week' },
  { id: 'role',    label: 'By Role', icon: Briefcase, desc: 'Filter by job role' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'backend', label: 'Backend Engineer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data', label: 'Data Scientist' },
  { value: 'product', label: 'Product Manager' },
  { value: 'mobile', label: 'Mobile Developer' },
  { value: 'qa', label: 'QA Engineer' },
]

const RANK_STYLES = {
  1: {
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    border: '2px solid #f59e0b',
    badgeBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    badgeText: '#fff',
    shadow: '0 4px 20px rgba(245,158,11,0.25)',
    icon: Crown,
    color: '#92400e',
    label: '🥇',
  },
  2: {
    bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    border: '2px solid #94a3b8',
    badgeBg: 'linear-gradient(135deg, #94a3b8, #64748b)',
    badgeText: '#fff',
    shadow: '0 4px 16px rgba(148,163,184,0.25)',
    icon: Medal,
    color: '#334155',
    label: '🥈',
  },
  3: {
    bg: 'linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%)',
    border: '2px solid #ea580c',
    badgeBg: 'linear-gradient(135deg, #ea580c, #c2410c)',
    badgeText: '#fff',
    shadow: '0 4px 16px rgba(234,88,12,0.2)',
    icon: Award,
    color: '#7c2d12',
    label: '🥉',
  },
}

const DEFAULT_STYLE = {
  bg: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  badgeBg: '#f4f2ee',
  badgeText: '#5c5a57',
  shadow: '0 2px 8px rgba(0,0,0,0.04)',
  icon: User,
  color: '#0f1f3d',
  label: '',
}


// ─────────────────────────────────────────────────────────
// User Card Component
// ─────────────────────────────────────────────────────────

function LeaderboardUserCard({ user, index }) {
  const style = RANK_STYLES[user.rank] || DEFAULT_STYLE
  const RankIcon = style.icon
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      style={{
        background: style.bg,
        border: style.border,
        borderRadius: '16px',
        padding: '18px 22px',
        marginBottom: '12px',
        boxShadow: style.shadow,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ scale: 1.015, boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}
    >
      {/* Rank badge */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '14px',
        background: style.badgeBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: user.rank <= 3 ? '0 3px 10px rgba(0,0,0,0.15)' : 'none',
      }}>
        {user.rank <= 3 ? (
          <span style={{ fontSize: '20px' }}>{style.label}</span>
        ) : (
          <span style={{ color: style.badgeText, fontSize: '16px', fontWeight: 800 }}>
            #{user.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div style={{
        width: '46px', height: '46px', borderRadius: '50%',
        background: user.rank === 1
          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
          : user.rank === 2
          ? 'linear-gradient(135deg, #94a3b8, #64748b)'
          : user.rank === 3
          ? 'linear-gradient(135deg, #ea580c, #c2410c)'
          : 'linear-gradient(135deg, #c8601a, #e07030)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '15px', fontWeight: 700,
        flexShrink: 0,
        border: '3px solid rgba(255,255,255,0.8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        {initials}
      </div>

      {/* Name & Role */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: style.color, fontSize: '15px', fontWeight: 700,
          margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {user.name || 'Anonymous'}
          {user.rank === 1 && <span style={{ marginLeft: '6px', fontSize: '14px' }}>👑</span>}
        </p>
        <p style={{
          color: user.rank <= 3 ? style.color : '#9c9a96',
          opacity: user.rank <= 3 ? 0.7 : 1,
          fontSize: '12px', margin: '2px 0 0',
        }}>
          {user.role || 'Not specified'}
        </p>
      </div>

      {/* Interviews */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <p style={{ color: style.color, fontSize: '13px', fontWeight: 600, margin: 0 }}>
          {user.interviews_completed}
        </p>
        <p style={{ color: '#9c9a96', fontSize: '10px', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          interviews
        </p>
      </div>

      {/* Score */}
      <div style={{
        textAlign: 'center', flexShrink: 0,
        background: user.rank <= 3 ? 'rgba(255,255,255,0.6)' : '#f8f7f4',
        borderRadius: '12px',
        padding: '8px 16px',
        border: user.rank <= 3 ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(0,0,0,0.05)',
      }}>
        <p style={{
          fontSize: '20px', fontWeight: 800, margin: 0, lineHeight: 1,
          color: user.score >= 8 ? '#16a34a' : user.score >= 5 ? '#d97706' : '#dc2626',
        }}>
          {user.score}
        </p>
        <p style={{ color: '#9c9a96', fontSize: '10px', margin: '2px 0 0' }}>avg score</p>
      </div>
    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────

function EmptyState({ tab }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        textAlign: 'center',
        padding: '60px 24px',
        background: 'rgba(244,242,238,0.5)',
        borderRadius: '20px',
        border: '2px dashed rgba(0,0,0,0.08)',
      }}
    >
      <Trophy size={48} color="#d4d0ca" style={{ margin: '0 auto 16px' }} />
      <p style={{ color: '#0f1f3d', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>
        No data yet
      </p>
      <p style={{ color: '#9c9a96', fontSize: '14px', margin: 0 }}>
        {tab === 'weekly'
          ? 'No interviews completed this week. Be the first!'
          : 'Complete an interview to appear on the leaderboard.'}
      </p>
    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────
// Main Leaderboard Page
// ─────────────────────────────────────────────────────────

export default function Leaderboard() {
  const { user } = useAuth()

  // State
  const [activeTab, setActiveTab] = useState('global')
  const [selectedRole, setSelectedRole] = useState('')
  const [users, setUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rankLoading, setRankLoading] = useState(true)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const params = {}
        if (activeTab === 'weekly') params.timeframe = 'weekly'
        if (activeTab === 'role' && selectedRole) params.role = selectedRole

        const res = await getLeaderboard(
          params.role || null,
          params.timeframe || null
        )
        console.log('[Leaderboard] API response:', res)
        setUsers(res?.users || [])
        setTotalUsers(res?.total_users || 0)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [activeTab, selectedRole])

  // Fetch my rank
  useEffect(() => {
    const fetchMyRank = async () => {
      setRankLoading(true)
      try {
        const res = await getMyRank()
        setMyRank(res)
      } catch {
        setMyRank(null)
      } finally {
        setRankLoading(false)
      }
    }
    if (user?.user_id) {
      fetchMyRank()
    } else {
      setRankLoading(false)
    }
  }, [user?.user_id])

  const currentTabInfo = TABS.find(t => t.id === activeTab)

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
          }}>
            <Trophy size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f1f3d', margin: 0, lineHeight: 1.2 }}>
              Leaderboard
            </h1>
            <p style={{ color: '#9c9a96', fontSize: '13px', margin: 0 }}>
              Top performers on HiLearn
            </p>
          </div>
          {totalUsers > 0 && (
            <div style={{
              marginLeft: 'auto',
              padding: '6px 14px',
              borderRadius: '20px',
              background: '#f4f2ee',
              border: '1px solid rgba(0,0,0,0.06)',
            }}>
              <span style={{ color: '#5c5a57', fontSize: '13px', fontWeight: 600 }}>
                {totalUsers.toLocaleString()} users
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Your Rank Card */}
      <YourRankCard rankData={myRank} loading={rankLoading} />

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {TABS.map(tab => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id !== 'role') setSelectedRole('')
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '50px',
                border: isActive ? '2px solid #c8601a' : '2px solid rgba(0,0,0,0.06)',
                background: isActive
                  ? 'linear-gradient(135deg, #c8601a, #e07030)'
                  : 'white',
                color: isActive ? 'white' : '#5c5a57',
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(200,96,26,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <TabIcon size={15} />
              {tab.label}
            </button>
          )
        })}

        {/* Role filter dropdown (when By Role tab is active) */}
        {activeTab === 'role' && (
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'white', color: '#0f1f3d',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <Filter size={14} />
              {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label || 'All Roles'}
              <ChevronDown size={14} style={{
                transform: roleDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }} />
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0,
                    marginTop: '6px',
                    background: 'white', borderRadius: '14px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    zIndex: 50,
                    minWidth: '200px',
                    overflow: 'hidden',
                  }}
                >
                  {ROLE_OPTIONS.map(role => (
                    <button
                      key={role.value}
                      onClick={() => {
                        setSelectedRole(role.value)
                        setRoleDropdownOpen(false)
                      }}
                      style={{
                        display: 'block', width: '100%',
                        padding: '10px 16px',
                        border: 'none',
                        background: selectedRole === role.value ? '#fef3e6' : 'transparent',
                        color: selectedRole === role.value ? '#c8601a' : '#0f1f3d',
                        fontSize: '13px', fontWeight: selectedRole === role.value ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s',
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
                      }}
                      onMouseEnter={e => {
                        if (selectedRole !== role.value) e.currentTarget.style.background = '#f8f7f4'
                      }}
                      onMouseLeave={e => {
                        if (selectedRole !== role.value) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Tab description */}
      <motion.p
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ color: '#9c9a96', fontSize: '13px', marginBottom: '16px' }}
      >
        {currentTabInfo?.desc}
        {activeTab === 'weekly' && (
          <span style={{ color: '#c8601a', fontWeight: 600 }}> · Resets every Monday</span>
        )}
      </motion.p>

      {/* Leaderboard list */}
      <div>
        {loading ? (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '60px', flexDirection: 'column', gap: '12px',
          }}>
            <Loader
              size={28}
              color="#c8601a"
              style={{ animation: 'spin 0.8s linear infinite' }}
            />
            <p style={{ color: '#9c9a96', fontSize: '14px' }}>Loading leaderboard...</p>
          </div>
        ) : users.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedRole}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {users.map((u, i) => (
                <LeaderboardUserCard key={u.user_id || i} user={u} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer info */}
      {!loading && users.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center',
            padding: '20px',
            marginTop: '8px',
          }}
        >
          <p style={{ color: '#d4d0ca', fontSize: '12px' }}>
            Rankings update after each completed interview
          </p>
        </motion.div>
      )}

      {/* Spin animation keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
