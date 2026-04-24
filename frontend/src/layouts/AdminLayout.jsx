
// import { useState } from 'react'
// import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import {
//   LayoutDashboard, Users, BarChart3, Settings,
//   LogOut, Menu, X, ChevronRight, Bell, Shield, Brain
// } from 'lucide-react'

// const adminNavItems = [
//   {
//     group: 'Overview',
//     items: [
//       { icon: LayoutDashboard, label: 'Dashboard',   href: '/admin' },
//       { icon: BarChart3,       label: 'Analytics',   href: '/admin/analytics' },
//     ],
//   },
//   {
//     group: 'Management',
//     items: [
//       { icon: Users,  label: 'Users',      href: '/admin/users' },
//       { icon: Brain,  label: 'Interviews', href: '/admin/interviews' },
//     ],
//   },
//   {
//     group: 'System',
//     items: [
//       { icon: Settings, label: 'Settings', href: '/admin/settings' },
//     ],
//   },
// ]

// function AdminSidebar({ open, onClose }) {
//   const location = useLocation()
//   const { logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   return (
//     <>
//       {/* Mobile overlay */}
//       {open && (
//         <button
//           type="button"
//           onClick={onClose}
//           className="fixed inset-0 z-40 bg-[#0f1f3d]/60 lg:hidden"
//           aria-label="Close sidebar"
//         />
//       )}

//       <aside
//         className={`
//           fixed left-0 top-0 z-50 h-screen w-64 flex flex-col
//           bg-[#0f1f3d] border-r border-white/10
//           transform transition-transform duration-300
//           ${open ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0
//         `}
//       >
//         {/* Brand */}
//         <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-[#c8601a] flex items-center justify-center shadow-lg shadow-[#c8601a]/30">
//               <Shield size={18} className="text-white" />
//             </div>
//             <div>
//               <p className="text-white font-bold text-sm leading-none">HiLearn</p>
//               <p className="text-white/40 text-xs mt-0.5">Admin Console</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
//           {adminNavItems.map((group) => (
//             <div key={group.group}>
//               <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
//                 {group.group}
//               </p>
//               <div className="space-y-0.5">
//                 {group.items.map((item) => {
//                   const Icon = item.icon
//                   const isActive = location.pathname === item.href
//                   return (
//                     <Link
//                       key={item.href}
//                       to={item.href}
//                       onClick={onClose}
//                       className={`
//                         flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
//                         ${isActive
//                           ? 'bg-[#c8601a] text-white shadow-md shadow-[#c8601a]/30'
//                           : 'text-white/60 hover:text-white hover:bg-white/8'
//                         }
//                       `}
//                     >
//                       <Icon size={17} />
//                       <span>{item.label}</span>
//                       {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
//                     </Link>
//                   )
//                 })}
//               </div>
//             </div>
//           ))}
//         </nav>

//         {/* Bottom — admin badge + logout */}
//         <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-4">
//           <div className="rounded-xl bg-white/5 px-4 py-3">
//             <p className="text-white/40 text-[10px] uppercase tracking-widest">Signed in as</p>
//             <p className="text-white text-sm font-semibold mt-0.5">Administrator</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
//           >
//             <LogOut size={16} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }

// function AdminTopBar({ onMenuClick }) {
//   return (
//     <header className="h-16 bg-white/95 backdrop-blur border-b border-[#e0dbd3] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden p-2 rounded-xl hover:bg-[#f4f2ee] transition text-[#0f1f3d]"
//         >
//           <Menu size={22} />
//         </button>
//         <div className="hidden lg:flex items-center gap-2 text-sm text-[#9c9a96]">
//           <Shield size={14} className="text-[#c8601a]" />
//           <span>Admin Panel</span>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="relative p-2 rounded-xl hover:bg-[#f4f2ee] transition">
//           <Bell size={18} className="text-[#5c5a57]" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8601a] rounded-full"></span>
//         </button>
//         <div className="w-9 h-9 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-sm font-bold shadow">
//           A
//         </div>
//       </div>
//     </header>
//   )
// }

// export default function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="min-h-screen bg-[#f4f2ee] flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
//       <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
//         <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 p-4 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }


import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, BarChart3, Settings,
  LogOut, Menu, X, ChevronRight, Bell, Shield, Brain, Trophy
} from 'lucide-react'

const adminNavItems = [
  {
    group: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: BarChart3,       label: 'Analytics', href: '/admin/analytics' },
      { icon: Trophy,          label: 'Leaderboard', href: '/admin/leaderboard' },
    ],
  },
  {
    group: 'Management',
    items: [
      { icon: Users, label: 'Users',      href: '/admin/users' },
      { icon: Brain, label: 'Interviews', href: '/admin/interviews' },
    ],
  },
  {
    group: 'System',
    items: [
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  },
]

function AdminSidebar({ open, onClose }) {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

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
                <Shield size={16} color="white" />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', lineHeight: 1.2, margin: 0 }}>HiLearn</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0 }}>Admin Console</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <X size={18} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
        </div>

        {/* Nav — scrollable, scrollbar hidden, admin badge inside */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {adminNavItems.map((group) => (
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

          {/* Admin badge — inside nav, scrolls with content */}
          <div style={{
            marginTop: 'auto',
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0f2040, #1a3060)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px', fontWeight: 700,
                flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)',
              }}>
                A
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Signed in as</p>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 600, margin: 0 }}>Administrator</p>
              </div>
            </div>
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

function AdminTopBar({ onMenuClick }) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color="#c8601a" />
          <span style={{ fontSize: '14px', color: '#9c9a96' }}>Admin Panel</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #0f2040, #1a3060)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '14px', fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          A
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          background: '#f4f2ee',
          display: 'flex',
          overflow: 'hidden',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
          <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
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