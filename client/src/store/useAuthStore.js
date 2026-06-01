import { create } from 'zustand'
import api from '../lib/api'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data))
      set({ user: data, token: data.access_token, loading: false })
      return data
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  register: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/register', payload)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data))
      set({ user: data, token: data.access_token, loading: false })
      return data
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  childLogin: async (childId) => {
    set({ loading: true })
    try {
      const { data } = await api.post(`/auth/child-login/${childId}`)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data))
      set({ user: data, token: data.access_token, loading: false })
      return data
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/users/me')
      const current = get().user || {}
      const updated = { ...current, ...data }
      localStorage.setItem('user', JSON.stringify(updated))
      set({ user: updated })
    } catch {}
  },

  updateUser: (updates) => {
    const current = get().user || {}
    const updated = { ...current, ...updates }
    localStorage.setItem('user', JSON.stringify(updated))
    set({ user: updated })
  },
}))

export default useAuthStore
