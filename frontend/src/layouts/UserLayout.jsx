import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Mic, BarChart3, Settings, LogOut,
  Menu, X, ChevronRight, Bell, Award, Zap, FileQuestion, Trophy, Send, Sun, Moon
} from 'lucide-react'
import useDarkMode from '../hooks/useDarkMode'

const userNavItems = [
  {
    group: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/user' },
      { icon: Mic, label: 'Mock Interviews', href: '/user/interview-setup' },
      // { icon: FileQuestion, label: 'MCQ Quiz', href: '/user/mcq-interview' },
      { icon: Trophy, label: 'Leaderboard', href: '/user/leaderboard' },
      { icon: Send, label: 'Job Offers', href: '/user/offers' },
      { icon: BarChart3, label: 'My Progress', href: '/user/analytics' },
      { icon: Award, label: 'My Feedback', href: '/user/feedback' },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      { icon: Settings, label: 'Settings', href: '/user/settings' },
    ],
  },
]

function UserSidebar({ open, onClose, user }) {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen flex flex-col
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{
          width: '280px',
          minWidth: '280px',
          background: 'linear-gradient(160deg, #0d1b2e 0%, #0f2040 50%, #0d1b2e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #f07d2e, #c8601a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(200,96,26,0.5)',
                flexShrink: 0,
              }}>
                <Mic size={16} color="white" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', lineHeight: 1.2, margin: 0 }}>HiLearn</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>Interview Prep</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <X size={18} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
        </div>

        {/* User info */}
        <div style={{ margin: '12px 12px 0', padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f07d2e, #c8601a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '14px', fontWeight: 700,
              flexShrink: 0, boxShadow: '0 2px 8px rgba(200,96,26,0.4)',
              border: '2px solid rgba(255,255,255,0.15)',
            }}>
              {initials}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Student'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation — scrollable, scrollbar hidden */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollbarWidth: 'none',       /* Firefox */
          msOverflowStyle: 'none',      /* IE/Edge */
        }}>
          {/* webkit scrollbar hide via inline style tag trick — handled in global style below */}
          {userNavItems.map((group) => (
            <div key={group.group}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '0 10px', marginBottom: '6px' }}>
                {group.group}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                        transition: 'all 0.2s ease',
                        background: isActive
                          ? 'linear-gradient(135deg, #c8601a, #e07030)'
                          : 'transparent',
                        color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                        boxShadow: isActive ? '0 4px 16px rgba(200,96,26,0.35)' : 'none',
                        border: isActive ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                          e.currentTarget.style.color = 'white'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                        }
                      }}
                    >
                      <Icon size={18} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.75 }} />
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={14} style={{ flexShrink: 0, opacity: 0.8 }} />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Upgrade card — INSIDE nav so it scrolls with content */}
          <div style={{
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(200,96,26,0.9) 0%, rgba(15,32,64,0.95) 100%)',
            padding: '14px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 20px rgba(200,96,26,0.25)',
            marginTop: 'auto',        /* push to bottom of scroll area */
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Zap size={12} color="rgba(255,220,100,0.9)" fill="rgba(255,220,100,0.6)" />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
                Free Plan
              </p>
            </div>
            <p style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: '0 0 4px' }}>Upgrade to Pro</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', margin: '0 0 10px', lineHeight: 1.4 }}>
              Unlimited interviews + AI feedback
            </p>
            <Link
              to="/pricing"
              style={{
                display: 'block', textAlign: 'center', padding: '8px',
                borderRadius: '10px', background: 'white', color: '#c8601a',
                fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Upgrade — ₹299/mo
            </Link>
          </div>
        </nav>

        {/* Logout — FIXED at bottom, never scrolls */}
        <div style={{ padding: '8px 12px 12px', flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '12px', border: 'none',
              background: 'transparent', color: 'rgba(255, 120, 100, 0.8)',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,80,60,0.12)'
              e.currentTarget.style.color = 'rgb(255,120,100)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255,120,100,0.8)'
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

function UserTopBar({ onMenuClick, user }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header style={{
      height: '64px', background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          className="lg:hidden"
          style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <Menu size={22} color="#0f1f3d" />
        </button>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {greeting}, <span style={{ fontWeight: 700, color: '#0f1f3d' }}>{firstName}</span> 👋
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={toggleDarkMode}
          style={{
            padding: '8px', borderRadius: '10px',
            border: 'none', background: 'transparent', cursor: 'pointer',
          }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6b7280" />}
        </button>
        <button style={{
          position: 'relative', padding: '8px', borderRadius: '10px',
          border: 'none', background: 'transparent', cursor: 'pointer',
        }}>
          <Bell size={18} color="#6b7280" />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', background: '#c8601a', borderRadius: '50%',
            border: '2px solid white',
          }} />
        </button>
        <Link
          to="/user/interview-setup"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #c8601a, #e07030)',
            color: 'white', fontSize: '13px', fontWeight: 700,
            padding: '9px 20px', borderRadius: '50px', textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(200,96,26,0.4)',
            transition: 'all 0.2s',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.04)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(200,96,26,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(200,96,26,0.4)'
          }}
        >
          <Mic size={14} />
          Start Interview
        </Link>
      </div>
    </header>
  )
}

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        aside nav::-webkit-scrollbar { display: none; }
        body { overflow: hidden; }
        #root, .app-container { overflow: hidden; height: 100vh; }
      `}</style>
      <div
        className="no-scrollbar"
        style={{
          minHeight: '100vh',
          background: '#f5f3f0',
          display: 'flex',
          overflow: 'hidden',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            marginLeft: '280px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <UserTopBar onMenuClick={() => setSidebarOpen(true)} user={user} />
          <main
            className="no-scrollbar"
            style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}