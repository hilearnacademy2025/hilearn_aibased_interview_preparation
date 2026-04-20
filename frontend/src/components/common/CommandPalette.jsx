import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const routes = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Interview', path: '/interview' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'Login', path: '/login' },
  { label: 'Signup', path: '/signup' },
  { label: 'Resume Upload', path: '/resume' },
]

function CommandPalette() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKeyDown = (event) => {
      const isModifier = event.metaKey || event.ctrlKey
      if (isModifier && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
      }
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setOpen(false)
    setQuery('')
  }, [location.pathname])

  const filteredRoutes = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return routes
    return routes.filter((route) => route.label.toLowerCase().includes(needle) || route.path.includes(needle))
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-start justify-center bg-[#0f1f3d]/35 px-4 pt-24 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-2xl rounded-[28px] border border-[#e0dbd3] bg-[#fffdf9] p-4 shadow-[0_28px_70px_rgba(15,31,61,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-[#e0dbd3] bg-white px-4 py-3">
              <span className="text-[#9c9a96]">Search</span>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Jump to a page"
                className="w-full bg-transparent text-base text-[#111827] outline-none"
              />
              <span className="rounded-md border border-[#e0dbd3] px-2 py-1 text-xs text-[#5c5a57]">Esc</span>
            </div>
            <div className="mt-4 space-y-2">
              {filteredRoutes.map((route) => (
                <button
                  key={route.path}
                  type="button"
                  onClick={() => navigate(route.path)}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-[#fff4ea]"
                >
                  <span className="font-medium text-[#111827]">{route.label}</span>
                  <span className="text-sm text-[#9c9a96]">{route.path}</span>
                </button>
              ))}
              {!filteredRoutes.length && <p className="px-4 py-6 text-sm text-[#9c9a96]">No matching routes.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandPalette
