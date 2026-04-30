/**
 * useDarkMode — global dark mode toggle hook
 * Persists preference in localStorage, applies 'dark' class to <html>.
 */
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'hilearn_theme'

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return saved === 'dark'
      // Respect system preference
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
    } catch {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement

    if (isDarkMode) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    try {
      localStorage.setItem(STORAGE_KEY, isDarkMode ? 'dark' : 'light')
    } catch {
      // localStorage unavailable
    }
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  return { isDarkMode, toggleDarkMode }
}
