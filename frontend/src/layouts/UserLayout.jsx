// import { useState } from 'react'
// import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import {
//   LayoutDashboard, Mic, BarChart3, Settings, LogOut,
//   Menu, X, ChevronRight, Bell, BookOpen, Users, Trophy
// } from 'lucide-react'

// const userNavItems = [
//   {
//     group: 'Main',
//     items: [
//       { icon: LayoutDashboard, label: 'Dashboard',       href: '/user' },
//       { icon: Mic,             label: 'Mock Interview',  href: '/user/interview-setup' },
//       { icon: BarChart3,       label: 'My Progress',     href: '/user/analytics' },
//     ],
//   },
//   {
//     group: 'Practice',
//     items: [
//       { icon: BookOpen,  label: 'My Interviews',  href: '/user/interviews' },
//       { icon: Trophy,    label: 'Achievements',   href: '/user/achievements' },
//       { icon: Users,     label: 'Peer Practice',  href: '/user/peer' },
//     ],
//   },
//   {
//     group: 'Account',
//     items: [
//       { icon: Settings,  label: 'Settings',  href: '/user/settings' },
//     ],
//   },
// ]

// function UserSidebar({ open, onClose, user }) {
//   const location = useLocation()
//   const { logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate('/login')
//   }

//   const initials = user?.name
//     ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
//     : user?.email?.[0]?.toUpperCase() || 'U'

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
//               <Mic size={16} className="text-white" />
//             </div>
//             <div>
//               <p className="text-white font-bold text-sm leading-none">HiLearn</p>
//               <p className="text-white/40 text-xs mt-0.5">Interview Prep</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
//             <X size={18} />
//           </button>
//         </div>

//         {/* User info */}
//         <div className="mx-3 mt-4 rounded-xl bg-white/5 px-4 py-3 border border-white/8">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c8601a] to-[#0f1f3d] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
//               {initials}
//             </div>
//             <div className="min-w-0">
//               <p className="text-white text-sm font-semibold truncate">{user?.name || 'Student'}</p>
//               <p className="text-white/40 text-xs truncate">{user?.email || ''}</p>
//             </div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
//           {userNavItems.map((group) => (
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

//         {/* Upgrade card */}
//         <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-[#c8601a]/80 to-[#0f1f3d] p-4 text-white border border-white/10">
//           <p className="text-xs font-bold uppercase tracking-widest text-white/60">Free Plan</p>
//           <p className="text-sm font-bold mt-1">Upgrade to Pro</p>
//           <p className="text-xs text-white/60 mt-1">Unlimited interviews + AI feedback</p>
//           <Link
//             to="/pricing"
//             className="mt-3 inline-block w-full text-center py-1.5 rounded-lg bg-white text-[#c8601a] text-xs font-bold hover:bg-white/90 transition"
//           >
//             Upgrade — ₹299/mo
//           </Link>
//         </div>

//         {/* Logout */}
//         <div className="px-3 pb-5 border-t border-white/10 pt-3">
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

// function UserTopBar({ onMenuClick, user }) {
//   const hour = new Date().getHours()
//   const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
//   const firstName = user?.name?.split(' ')[0] || 'there'

//   return (
//     <header className="h-16 bg-white/95 backdrop-blur border-b border-[#e0dbd3] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={onMenuClick}
//           className="lg:hidden p-2 rounded-xl hover:bg-[#f4f2ee] transition text-[#0f1f3d]"
//         >
//           <Menu size={22} />
//         </button>
//         <p className="hidden sm:block text-sm text-[#5c5a57]">
//           {greeting}, <span className="font-semibold text-[#0f1f3d]">{firstName}</span> 👋
//         </p>
//       </div>
//       <div className="flex items-center gap-3">
//         <button className="relative p-2 rounded-xl hover:bg-[#f4f2ee] transition">
//           <Bell size={18} className="text-[#5c5a57]" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8601a] rounded-full"></span>
//         </button>
//         <Link
//           to="/user/interview-setup"
//           className="hidden sm:inline-flex items-center gap-2 bg-[#c8601a] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md shadow-[#c8601a]/25 hover:bg-[#b0541a] transition"
//         >
//           <Mic size={14} />
//           Start Interview
//         </Link>
//       </div>
//     </header>
//   )
// }

// export default function UserLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const { user } = useAuth()

//   return (
//     <div className="min-h-screen bg-[#f4f2ee] flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
//       <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

//       <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
//         <UserTopBar onMenuClick={() => setSidebarOpen(true)} user={user} />
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
  LayoutDashboard, Mic, BarChart3, Settings, LogOut,
  Menu, X, ChevronRight, Bell, BookOpen, Users, Trophy
} from 'lucide-react'

const userNavItems = [
  {
    group: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/user' },
      { icon: Mic, label: 'Mock Interviews', href: '/user/interview-setup' },
      { icon: BarChart3, label: 'My Progress', href: '/user/analytics' },
    ],
  },
  {
    group: 'PRACTICE',
    items: [
      { icon: BookOpen, label: 'My Interviews', href: '/user/interviews' },
      { icon: Trophy, label: 'Achievements', href: '/user/achievements' },
      { icon: Users, label: 'Peer Practice', href: '/user/peer' },
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
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0f1f3d]/60 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72 flex flex-col
          bg-[#0f1f3d] border-r border-white/10
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c8601a] flex items-center justify-center shadow-lg shadow-[#c8601a]/30">
              <Mic size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">HiLearn</p>
              <p className="text-white/40 text-xs mt-0.5">Interview Prep</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="mx-3 mt-4 rounded-xl bg-white/5 px-4 py-3 border border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8601a] to-[#0f1f3d] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{user?.name || 'Student'}</p>
              <p className="text-white/50 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {userNavItems.map((group) => (
            <div key={group.group}>
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${isActive
                          ? 'bg-[#c8601a] text-white shadow-md shadow-[#c8601a]/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight size={14} className="ml-auto opacity-80" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade & Logout - fixed bottom */}
        <div className="flex-shrink-0 px-3 pb-4 pt-2 border-t border-white/10">
          <div className="rounded-xl bg-gradient-to-br from-[#c8601a]/90 to-[#0f1f3d] p-4 text-white border border-white/15 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">Free Plan</p>
            <p className="text-sm font-bold mt-1">Upgrade to Pro</p>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">Unlimited interviews + AI feedback</p>
            <Link
              to="/pricing"
              className="mt-3 inline-block w-full text-center py-1.5 rounded-lg bg-white text-[#c8601a] text-xs font-bold hover:bg-white/90 transition"
            >
              Upgrade — ₹299/mo
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
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

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-[#e0dbd3] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-[#f4f2ee] transition text-[#0f1f3d]"
        >
          <Menu size={22} />
        </button>
        <p className="hidden sm:block text-sm text-[#5c5a57]">
          {greeting}, <span className="font-semibold text-[#0f1f3d]">{firstName}</span> 👋
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-[#f4f2ee] transition">
          <Bell size={18} className="text-[#5c5a57]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8601a] rounded-full"></span>
        </button>
        <Link
          to="/user/interview-setup"
          className="hidden sm:inline-flex items-center gap-2 bg-[#c8601a] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md shadow-[#c8601a]/25 hover:bg-[#b0541a] transition"
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
    <div className="min-h-screen bg-[#faf8f6] flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      <div className="flex-1 lg:ml-72 min-w-0 flex flex-col">
        <UserTopBar onMenuClick={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}