import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const nextToast = { id, tone: 'success', duration: 3200, ...toast }
    setToasts((current) => [...current, nextToast])
    window.setTimeout(() => removeToast(id), nextToast.duration)
  }, [removeToast])

  const value = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[120] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-auto rounded-3xl border border-[#e0dbd3] bg-white px-5 py-4 shadow-[0_18px_42px_rgba(15,31,61,0.15)]"
            >
              <p className="text-sm font-semibold text-[#0f1f3d]">{toast.title}</p>
              {toast.description && <p className="mt-1 text-sm text-[#5c5a57]">{toast.description}</p>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export default ToastProvider
