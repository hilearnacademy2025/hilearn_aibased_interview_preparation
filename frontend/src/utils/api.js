import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong while talking to the server.'

    return Promise.reject(new Error(message))
  },
)

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

export const healthCheck = async () => {
  const { data } = await api.get('/health')
  return data
}

export default api
