/**
 * useScoreCelebration — confetti celebration hook
 * Loads canvas-confetti from CDN and fires confetti when score >= 80% (8/10).
 */
import { useCallback, useEffect, useRef } from 'react'

export default function useScoreCelebration(score, threshold = 80) {
  const confettiRef = useRef(null)
  const firedRef = useRef(false)

  // Load canvas-confetti from CDN once
  useEffect(() => {
    if (confettiRef.current) return
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
    script.async = true
    script.onload = () => {
      confettiRef.current = window.confetti
    }
    document.head.appendChild(script)
    return () => {
      // cleanup not strictly needed but good practice
    }
  }, [])

  const triggerCelebration = useCallback(() => {
    const confetti = confettiRef.current || window.confetti
    if (!confetti) return

    // Fire multiple bursts for a premium effect
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 }

    // Center burst
    confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.5 } })

    // Left burst
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, origin: { x: 0.2, y: 0.6 } })
    }, 150)

    // Right burst
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 50, origin: { x: 0.8, y: 0.6 } })
    }, 300)

    // Top shower
    setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 270,
        spread: 80,
        origin: { x: 0.5, y: 0 },
        gravity: 1.2,
        ticks: 120,
        zIndex: 9999,
        colors: ['#c8601a', '#f07d2e', '#10b981', '#6366f1', '#f59e0b', '#0f1f3d'],
      })
    }, 500)
  }, [])

  // Auto-trigger when score meets threshold
  useEffect(() => {
    if (score >= threshold && !firedRef.current) {
      firedRef.current = true
      // Small delay to let the score animation play first
      const timeout = setTimeout(() => triggerCelebration(), 1400)
      return () => clearTimeout(timeout)
    }
  }, [score, threshold, triggerCelebration])

  return { triggerCelebration }
}
