import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // { user_id, name, email, role }
  const [token, setToken] = useState(() => localStorage.getItem('hilearn_token'))
  const [loading, setLoading] = useState(true)

  // Set axios auth header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('hilearn_token', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('hilearn_token')
    }
  }, [token])

  // On mount — verify token & fetch user
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await api.get('/auth/me')
        setUser(data)
      } catch {
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser({ user_id: data.user_id, role: data.role, email })
    return data  // caller can read data.role for redirect
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    setToken(null)
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isUser  = user?.role === 'user'
  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, isUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
