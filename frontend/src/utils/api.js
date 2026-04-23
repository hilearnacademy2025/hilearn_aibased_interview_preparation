// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message =
//       error.response?.data?.detail ||
//       error.response?.data?.message ||
//       error.message ||
//       'Something went wrong while talking to the server.'

//     return Promise.reject(new Error(message))
//   },
// )

// export const startInterview = async (payload) => {
//   const { data } = await api.post('/interview/start-interview', payload)
//   return data
// }

// export const submitAnswer = async (payload) => {
//   const { data } = await api.post('/interview/submit-answer', payload)
//   return data
// }

// export const getSession = async (sessionId) => {
//   const { data } = await api.get(`/interview/session/${sessionId}`)
//   return data
// }

// export const healthCheck = async () => {
//   const { data } = await api.get('/health')
//   return data
// }

// export default api


import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor: har request pe Authorization header auto-attach ──────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hilearn_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor: 401 pe auto token refresh try ──────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true
      try {
        const token = localStorage.getItem('hilearn_token')
        if (token) {
          const { data } = await api.post('/auth/refresh-token', { token })
          localStorage.setItem('hilearn_token', data.token)
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          originalRequest.headers['Authorization'] = `Bearer ${data.token}`
          return api(originalRequest)
        }
      } catch {
        localStorage.removeItem('hilearn_token')
        delete api.defaults.headers.common['Authorization']
        window.location.href = '/login'
      }
    }

    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while talking to the server.'

    return Promise.reject(new Error(message))
  },
)

// ── Auth APIs ──────────────────────────────────────────────────────────────────
export const loginApi = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const signupApi = async (name, email, password) => {
  const { data } = await api.post('/auth/signup', { name, email, password })
  return data
}

export const logoutApi = async () => {
  await api.post('/auth/logout')
}

export const getMeApi = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

// ── Interview APIs ─────────────────────────────────────────────────────────────
export const startInterview = async (payload) => {
  const { data } = await api.post('/interview/start-interview', payload)
  return data
}

export const submitAnswer = async (payload) => {
  const { data } = await api.post('/interview/submit-answer', payload)
  return data
}

export const getSession = async (sessionId) => {
  const { data } = await api.get(`/interview/session/${sessionId}`)
  return data
}

export const getUserSessions = async (userId) => {
  const { data } = await api.get(`/interview/sessions/user/${userId}`)
  return data
}

// ── Audio Transcription API ────────────────────────────────────────────────────
export const transcribeAudio = async (audioBlob, filename = 'recording.webm') => {
  const formData = new FormData()
  formData.append('audio_file', audioBlob, filename)
  const { data } = await api.post('/interview/transcribe-audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// ── Health Check ───────────────────────────────────────────────────────────────
export const healthCheck = async () => {
  const { data } = await api.get('/health')
  return data
}

// ── Admin APIs ─────────────────────────────────────────────────────────────────
export const getAdminDashboard = async () => {
  const { data } = await api.get('/admin/dashboard')
  return data
}

export const getAdminUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users', { params })
  return data
}

export const updateAdminUser = async (userId, payload) => {
  const { data } = await api.put(`/admin/users/${userId}`, payload)
  return data
}

export const deleteAdminUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}`)
  return data
}

export const getAdminInterviews = async (params = {}) => {
  const { data } = await api.get('/admin/interviews', { params })
  return data
}

export const getAdminAnalytics = async () => {
  const { data } = await api.get('/admin/analytics')
  return data
}

// ── MCQ APIs ───────────────────────────────────────────────────────────────────
export const startMCQ = async (payload) => {
  const { data } = await api.post('/interview/start-mcq', payload)
  return data
}

export const submitMCQ = async (payload) => {
  const { data } = await api.post('/interview/submit-mcq', payload)
  return data
}

export const getMCQSession = async (sessionId) => {
  const { data } = await api.get(`/interview/mcq/${sessionId}`)
  return data
}

// ── Email Results API ──────────────────────────────────────────────────────────
export const sendResultsEmail = async (sessionId) => {
  const { data } = await api.post('/interview/send-results-email', { session_id: sessionId })
  return data
}

// ── Resume Upload API ──────────────────────────────────────────────────────────
export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('resume_file', file, file.name)
  const { data } = await api.post('/interview/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export default api