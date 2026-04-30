/**
 * useQuestionTimer — per-question countdown timer hook
 * 2-minute (120s) countdown per question with auto-submit on timeout.
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const QUESTION_TIME_LIMIT = 120 // 2 minutes in seconds

export default function useQuestionTimer(questionIndex, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const intervalRef = useRef(null)
  const callbackRef = useRef(onTimeUp)
  const prevIndexRef = useRef(questionIndex)

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = onTimeUp
  }, [onTimeUp])

  // Reset timer when question changes
  useEffect(() => {
    if (prevIndexRef.current !== questionIndex) {
      prevIndexRef.current = questionIndex
      setTimeLeft(QUESTION_TIME_LIMIT)
      setIsTimeUp(false)
    }
  }, [questionIndex])

  // Main timer countdown
  useEffect(() => {
    if (isTimeUp) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsTimeUp(true)
          // Fire auto-submit callback
          if (callbackRef.current) {
            callbackRef.current()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isTimeUp, questionIndex])

  const startTimer = useCallback(() => {
    setTimeLeft(QUESTION_TIME_LIMIT)
    setIsTimeUp(false)
  }, [])

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTimeLeft(QUESTION_TIME_LIMIT)
    setIsTimeUp(false)
  }, [])

  // Format time as M:SS
  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }, [])

  return {
    timeLeft,
    isTimeUp,
    startTimer,
    resetTimer,
    formattedTime: formatTime(timeLeft),
    isWarning: timeLeft <= 30 && timeLeft > 0,
    QUESTION_TIME_LIMIT,
  }
}
