import axios from 'axios'

// In production: client is served by the same Express server,
// so API calls go to same origin (no /api prefix needed — vite proxy handles dev).
// In production all API routes are at /auth, /designs, /bookings etc.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    return Promise.reject({ message, status: err.response?.status })
  }
)

// ===== Auth =====
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  me: () => api.get('/auth/me'),
}

// ===== Designs =====
export const designsAPI = {
  getAll: (params) => api.get('/designs', { params }),
  getById: (id) => api.get(`/designs/${id}`),
  create: (data) => api.post('/designs', data),
  update: (id, data) => api.put(`/designs/${id}`, data),
  delete: (id) => api.delete(`/designs/${id}`),
}

// ===== Bookings =====
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my'),
  updateStatus: (id, status, adminNote) => api.put(`/bookings/${id}`, { status, adminNote }),
  delete: (id) => api.delete(`/bookings/${id}`),
}

// ===== Contact =====
export const contactAPI = {
  send: (data) => api.post('/contact', data),
}

// ===== Upload =====
export const uploadAPI = {
  image: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post('/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
