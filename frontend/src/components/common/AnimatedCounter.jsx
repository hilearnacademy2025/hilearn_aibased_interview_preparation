import { useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return undefined

    const duration = 1400
    const start = performance.now()
    let frameId

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayValue(progress * Number(value))
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [isInView, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export default AnimatedCounter
