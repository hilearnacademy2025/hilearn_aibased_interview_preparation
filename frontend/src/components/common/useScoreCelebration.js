import { useEffect, useRef } from 'react'

async function loadConfetti() {
  if (window.__hilearnConfetti) return window.__hilearnConfetti
  if (window.confetti) {
    window.__hilearnConfetti = window.confetti
    return window.confetti
  }

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-hilearn-confetti="true"]')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
    script.async = true
    script.dataset.hilearnConfetti = 'true'
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })

  window.__hilearnConfetti = window.confetti
  return window.confetti
}

export function useScoreCelebration(shouldCelebrate) {
  const fired = useRef(false)

  useEffect(() => {
    if (!shouldCelebrate || fired.current) return
    fired.current = true

    loadConfetti()
      .then((confetti) => {
        if (!confetti) return
        confetti({
          particleCount: 90,
          spread: 72,
          origin: { y: 0.55 },
          colors: ['#c8601a', '#f5c96a', '#0f1f3d'],
        })
      })
      .catch(() => {})
  }, [shouldCelebrate])
}
