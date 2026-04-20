import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 180, damping: 24, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 180, damping: 24, mass: 0.2 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    const updateEnabled = () => setEnabled(mediaQuery.matches)
    updateEnabled()

    const handlePointer = (event) => {
      x.set(event.clientX - 6)
      y.set(event.clientY - 6)
    }

    mediaQuery.addEventListener('change', updateEnabled)
    window.addEventListener('pointermove', handlePointer)

    return () => {
      mediaQuery.removeEventListener('change', updateEnabled)
      window.removeEventListener('pointermove', handlePointer)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[140] h-3 w-3 rounded-full bg-[#c8601a] shadow-[0_0_18px_rgba(200,96,26,0.45)] mix-blend-multiply"
      style={{ x: springX, y: springY }}
    />
  )
}

export default CustomCursor
