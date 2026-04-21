import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, FileText, BarChart3, Settings,
  LogOut, Menu, X, ChevronRight, Bell, Shield,
  Brain, TrendingUp, BookOpen
} from 'lucide-react'

const adminNavItems = [
  {
    group: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard',    href: '/admin' },
      { icon: BarChart3,       label: 'Analytics',    href: '/admin/analytics' },
    ],
  },
  {
    group: 'Management',
    items: [
      { icon: Users,     label: 'Users',      href: '/admin/users' },
      { icon: Brain,     label: 'Interviews',  href: '/admin/interviews' },
      { icon: FileText,  label: 'Reports',     href: '/admin/reports' },
    ],
  },
  {
    group: 'System',
    items: [
      { icon: Settings,  label: 'Settings',    href: '/admin/settings' },
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
          fixed left-0 top-0 z-50 h-screen w-64 flex flex-col
          bg-[#0f1f3d] border-r border-white/10
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c8601a] flex items-center justify-center shadow-lg shadow-[#c8601a]/30">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">HiLearn</p>
              <p className="text-white/40 text-xs mt-0.5">Admin Console</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {adminNavItems.map((group) => (
            <div key={group.group}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                {group.group}
              </p>
              <div className="space-y-0.5">
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
                          : 'text-white/60 hover:text-white hover:bg-white/8'
                        }
                      `}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom — admin badge + logout */}
        <div className="px-3 pb-5 space-y-2 border-t border-white/10 pt-4">
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Signed in as</p>
            <p className="text-white text-sm font-semibold mt-0.5">Administrator</p>
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

function AdminTopBar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-[#e0dbd3] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-[#f4f2ee] transition text-[#0f1f3d]"
        >
          <Menu size={22} />
        </button>
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#9c9a96]">
          <Shield size={14} className="text-[#c8601a]" />
          <span>Admin Panel</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-[#f4f2ee] transition">
          <Bell size={18} className="text-[#5c5a57]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8601a] rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-[#0f1f3d] flex items-center justify-center text-white text-sm font-bold shadow">
          A
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        <AdminTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
