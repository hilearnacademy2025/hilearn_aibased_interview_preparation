

// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api/v1',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // ── Request Interceptor: har request pe Authorization header auto-attach ──────
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('hilearn_token')
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // ── Response Interceptor: 401 pe auto token refresh try ──────────────────────
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes('/auth/refresh-token')
//     ) {
//       originalRequest._retry = true
//       try {
//         const token = localStorage.getItem('hilearn_token')
//         if (token) {
//           const { data } = await api.post('/auth/refresh-token', { token })
//           localStorage.setItem('hilearn_token', data.token)
//           api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
//           originalRequest.headers['Authorization'] = `Bearer ${data.token}`
//           return api(originalRequest)
//         }
//       } catch {
//         localStorage.removeItem('hilearn_token')
//         delete api.defaults.headers.common['Authorization']
//         window.location.href = '/login'
//       }
//     }

//     const message =
//       error.response?.data?.detail ||
//       error.response?.data?.message ||
//       error.message ||
//       'Something went wrong while talking to the server.'

//     return Promise.reject(new Error(message))
//   },
// )

// // ── Auth APIs ──────────────────────────────────────────────────────────────────
// export const loginApi = async (email, password) => {
//   const { data } = await api.post('/auth/login', { email, password })
//   return data
// }

// export const signupApi = async (name, email, password) => {
//   const { data } = await api.post('/auth/signup', { name, email, password })
//   return data
// }

// export const logoutApi = async () => {
//   await api.post('/auth/logout')
// }

// export const getMeApi = async () => {
//   const { data } = await api.get('/auth/me')
//   return data
// }

// // ── Interview APIs ─────────────────────────────────────────────────────────────
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

// export const getUserSessions = async (userId) => {
//   const { data } = await api.get(`/interview/sessions/user/${userId}`)
//   return data
// }

// // ── Audio Transcription API ────────────────────────────────────────────────────
// export const transcribeAudio = async (audioBlob, filename = 'recording.webm') => {
//   const formData = new FormData()
//   formData.append('audio_file', audioBlob, filename)
//   const { data } = await api.post('/interview/transcribe-audio', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   })
//   return data
// }

// // ── Health Check ───────────────────────────────────────────────────────────────
// export const healthCheck = async () => {
//   const { data } = await api.get('/health')
//   return data
// }

// // ── Admin APIs ─────────────────────────────────────────────────────────────────
// export const getAdminDashboard = async () => {
//   const { data } = await api.get('/admin/dashboard')
//   return data
// }

// export const getAdminUsers = async (params = {}) => {
//   const { data } = await api.get('/admin/users', { params })
//   return data
// }

// export const updateAdminUser = async (userId, payload) => {
//   const { data } = await api.put(`/admin/users/${userId}`, payload)
//   return data
// }

// export const suspendAdminUser = async (userId, reason) => {
//   const { data } = await api.patch(`/admin/users/${userId}/suspend`, { reason })
//   return data
// }

// export const activateAdminUser = async (userId) => {
//   const { data } = await api.patch(`/admin/users/${userId}/activate`)
//   return data
// }

// export const deleteAdminUser = async (userId) => {
//   const { data } = await api.delete(`/admin/users/${userId}`)
//   return data
// }

// export const getAdminInterviews = async (params = {}) => {
//   const { data } = await api.get('/admin/interviews', { params })
//   return data
// }

// export const getAdminAnalytics = async () => {
//   const { data } = await api.get('/admin/analytics')
//   return data
// }

// // export default api
// // ── Payment APIs ───────────────────────────────────────────────────────────────
// export const getPlans = async () => {
//   const { data } = await api.get("/payment/plans")
//   return data
// }

// export const createPaymentOrder = async (plan) => {
//   const { data } = await api.post("/payment/create-order", { plan })
//   return data
// }

// export const verifyPayment = async (payload) => {
//   const { data } = await api.post("/payment/verify", payload)
//   return data
// }
// // ── MCQ APIs ───────────────────────────────────────────────────────────────────
// export const startMCQ = async (payload) => {
//   const { data } = await api.post('/interview/start-mcq', payload)
//   return data
// }

// export const submitMCQ = async (payload) => {
//   const { data } = await api.post('/interview/submit-mcq', payload)
//   return data
// }

// export const getMCQSession = async (sessionId) => {
//   const { data } = await api.get(`/interview/mcq/${sessionId}`)
//   return data
// }

// // ── Email Results API ──────────────────────────────────────────────────────────
// export const sendResultsEmail = async (sessionId) => {
//   const { data } = await api.post('/interview/send-results-email', { session_id: sessionId })
//   return data
// }

// // ── Resume Upload API ──────────────────────────────────────────────────────────
// export const uploadResume = async (file) => {
//   const formData = new FormData()
//   formData.append('resume_file', file, file.name)
//   const { data } = await api.post('/interview/upload-resume', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   })
//   return data
// }

// // ── Leaderboard APIs ───────────────────────────────────────────────────────────
// export const getLeaderboard = async (role = null, timeframe = null) => {
//   const params = {}
//   if (role) params.role = role
//   if (timeframe) params.timeframe = timeframe
//   const { data } = await api.get('/leaderboard', { params })
//   return data
// }

// export const getMyRank = async () => {
//   const { data } = await api.get('/leaderboard/my-rank')
//   return data
// }

// export const getUserProfile = async (userId) => {
//   const { data } = await api.get(`/admin/users/${userId}`)
//   return data
// }

// // ── Student Job Offers ────────────────────────────────────────────────────────
// export const getJobOffers = async () => {
//   const { data } = await api.get('/company/my-offers')
//   return data
// }

// export const respondToOffer = async (offerId, status, responseMessage = '') => {
//   const { data } = await api.put(`/company/my-offers/${offerId}/respond`, {
//     status,
//     response_message: responseMessage
//   })
//   return data
// }


// // ── Company API ────────────────────────────────────────────────────────────────

// // Separate axios instance for company endpoints (uses its own token)
// // const companyApi = axios.create({
// //   baseURL: API_BASE_URL,
// //   timeout: 30000,
// //   headers: { 'Content-Type': 'application/json' },
// // })
// const companyApi = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
//   timeout: 30000,
//   headers: { 'Content-Type': 'application/json' },
// })

// companyApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('hilearn_company_token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // Auth
// export const companyRegister = async (payload) => {
//   const { data } = await companyApi.post('/company/register', payload)
//   return data
// }

// export const companyLogin = async (email, password) => {
//   const { data } = await companyApi.post('/company/login', { email, password })
//   return data
// }

// export const getCompanyProfile = async () => {
//   const { data } = await companyApi.get('/company/me')
//   return data
// }

// export const updateCompanyProfile = async (updates) => {
//   const { data } = await companyApi.put('/company/profile', updates)
//   return data
// }

// // Candidate Discovery
// export const searchCandidates = async (params = {}) => {
//   const { data } = await companyApi.get('/company/candidates', { params })
//   return data
// }

// export const getCandidateProfile = async (userId) => {
//   const { data } = await companyApi.get(`/company/candidates/${userId}`)
//   return data
// }

// // Shortlisting
// export const shortlistCandidate = async (userId, payload = {}) => {
//   const { data } = await companyApi.post(`/company/shortlist/${userId}`, payload)
//   return data
// }

// export const getShortlistedCandidates = async () => {
//   const { data } = await companyApi.get('/company/shortlisted')
//   return data
// }

// export const removeShortlist = async (userId) => {
//   const { data } = await companyApi.delete(`/company/shortlist/${userId}`)
//   return data
// }

// export const updateShortlistNotes = async (userId, notes) => {
//   const { data } = await companyApi.put(`/company/shortlist/${userId}`, { notes })
//   return data
// }

// // Job Postings
// export const createJob = async (payload) => {
//   const { data } = await companyApi.post('/company/jobs', payload)
//   return data
// }

// export const getCompanyJobs = async () => {
//   const { data } = await companyApi.get('/company/jobs')
//   return data
// }

// export const updateJob = async (jobId, payload) => {
//   const { data } = await companyApi.put(`/company/jobs/${jobId}`, payload)
//   return data
// }

// export const deleteJob = async (jobId) => {
//   const { data } = await companyApi.delete(`/company/jobs/${jobId}`)
//   return data
// }

// // Matching
// export const getMatchedCandidates = async (jobId) => {
//   const { data } = await companyApi.get('/company/matched-candidates', { params: { job_id: jobId } })
//   return data
// }

// // Offers
// export const sendOffer = async (userId, payload) => {
//   const { data } = await companyApi.post(`/company/send-offer/${userId}`, payload)
//   return data
// }

// export const getCandidateResponses = async () => {
//   const { data } = await companyApi.get('/company/candidate-responses')
//   return data
// }

// export default api



import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
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

export const suspendAdminUser = async (userId, reason) => {
  const { data } = await api.patch(`/admin/users/${userId}/suspend`, { reason })
  return data
}

export const activateAdminUser = async (userId) => {
  const { data } = await api.patch(`/admin/users/${userId}/activate`)
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

// export default api
// ── Payment APIs ───────────────────────────────────────────────────────────────
export const getPlans = async () => {
  const { data } = await api.get("/payment/plans")
  return data
}

export const createPaymentOrder = async (plan) => {
  const { data } = await api.post("/payment/create-order", { plan })
  return data
}

export const verifyPayment = async (payload) => {
  const { data } = await api.post("/payment/verify", payload)
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

// ── Leaderboard APIs ───────────────────────────────────────────────────────────
export const getLeaderboard = async (role = null, timeframe = null) => {
  const params = {}
  if (role) params.role = role
  if (timeframe) params.timeframe = timeframe
  const { data } = await api.get('/leaderboard', { params })
  return data
}

export const getMyRank = async () => {
  const { data } = await api.get('/leaderboard/my-rank')
  return data
}

export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/admin/users/${userId}`)
  return data
}

// ── Student Job Offers ────────────────────────────────────────────────────────
export const getJobOffers = async () => {
  const { data } = await api.get('/company/my-offers')
  return data
}

export const respondToOffer = async (offerId, status, responseMessage = '') => {
  const { data } = await api.put(`/company/my-offers/${offerId}/respond`, {
    status,
    response_message: responseMessage
  })
  return data
}


// ── Company API ────────────────────────────────────────────────────────────────

// Separate axios instance for company endpoints (uses its own token)
// const companyApi = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: { 'Content-Type': 'application/json' },
// })
const companyApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

companyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('hilearn_company_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const companyRegister = async (payload) => {
  const { data } = await companyApi.post('/company/register', payload)
  return data
}

export const companyLogin = async (email, password) => {
  const { data } = await companyApi.post('/company/login', { email, password })
  return data
}

export const getCompanyProfile = async () => {
  const { data } = await companyApi.get('/company/me')
  return data
}

export const updateCompanyProfile = async (updates) => {
  const { data } = await companyApi.put('/company/profile', updates)
  return data
}

// Candidate Discovery
export const searchCandidates = async (params = {}) => {
  const { data } = await companyApi.get('/company/candidates', { params })
  return data
}

export const getCandidateProfile = async (userId) => {
  const { data } = await companyApi.get(`/company/candidates/${userId}`)
  return data
}

// Shortlisting
export const shortlistCandidate = async (userId, payload = {}) => {
  const { data } = await companyApi.post(`/company/shortlist/${userId}`, payload)
  return data
}

export const getShortlistedCandidates = async () => {
  const { data } = await companyApi.get('/company/shortlisted')
  return data
}

export const removeShortlist = async (userId) => {
  const { data } = await companyApi.delete(`/company/shortlist/${userId}`)
  return data
}

export const updateShortlistNotes = async (userId, notes) => {
  const { data } = await companyApi.put(`/company/shortlist/${userId}`, { notes })
  return data
}

// Job Postings
export const createJob = async (payload) => {
  const { data } = await companyApi.post('/company/jobs', payload)
  return data
}

export const getCompanyJobs = async () => {
  const { data } = await companyApi.get('/company/jobs')
  return data
}

export const updateJob = async (jobId, payload) => {
  const { data } = await companyApi.put(`/company/jobs/${jobId}`, payload)
  return data
}

export const deleteJob = async (jobId) => {
  const { data } = await companyApi.delete(`/company/jobs/${jobId}`)
  return data
}

// Matching
export const getMatchedCandidates = async (jobId) => {
  const { data } = await companyApi.get('/company/matched-candidates', { params: { job_id: jobId } })
  return data
}

// Offers
export const sendOffer = async (userId, payload) => {
  const { data } = await companyApi.post(`/company/send-offer/${userId}`, payload)
  return data
}

export const getCandidateResponses = async () => {
  const { data } = await companyApi.get('/company/candidate-responses')
  return data
}

export default api