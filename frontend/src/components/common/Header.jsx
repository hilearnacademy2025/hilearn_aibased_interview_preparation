import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Interview', to: '/interview' },
  { label: 'About', to: '/about' },
]

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const homeSectionLinks = useMemo(() => ([]), [])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="sticky top-0 z-[110] px-4 pt-4"
      >
        <div
          className={`section-shell flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${
            scrolled
              ? 'border-[#e0dbd3] bg-white/88 shadow-[0_18px_50px_rgba(15,31,61,0.12)] backdrop-blur-xl'
              : 'border-transparent bg-white/72 backdrop-blur-md'
          }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1f3d] text-xl font-bold text-white shadow-[0_12px_22px_rgba(15,31,61,0.18)]">
              H
            </div>
            <div>
              <p className="display-font text-xl font-bold text-[#0f1f3d]">HiLearn</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#9c9a96]">Interview Studio</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onMouseEnter={() => setHovered(link.to)}
                onMouseLeave={() => setHovered(null)}
                className="relative py-2 text-sm font-medium text-[#5c5a57] transition hover:text-[#0f1f3d]"
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-[#0f1f3d]' : ''}>{link.label}</span>
                    {(isActive || hovered === link.to) && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#c8601a]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login" className="text-sm font-medium text-[#5c5a57] transition hover:text-[#c8601a]">
              Sign in
            </Link>
            <Button to="/signup" variant="primary" className="px-5 py-3">
              Start free <ArrowRight size={16} />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e0dbd3] bg-white text-[#0f1f3d] lg:hidden"
            aria-label="Open menu"
          >
            <span className="relative block h-4 w-5">
              <span className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[6px] h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[12px] h-[2px] w-full rounded-full bg-current" />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[125] bg-[#0f1f3d]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="ml-auto flex h-full w-full max-w-sm flex-col bg-[#0f1f3d] px-6 py-8 text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="display-font text-2xl font-bold">HiLearn</p>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full border border-white/20 px-3 py-2 text-sm">
                  Close
                </button>
              </div>
              <div className="mt-10 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-2xl px-4 py-4 text-lg ${isActive ? 'bg-white/12 text-[#f5c96a]' : 'text-white/80'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-3">
                  <Button to="/login" variant="white" className="w-full justify-center">
                  Sign in
                </Button>
                <Button to="/signup" className="w-full justify-center">
                  Start free <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
