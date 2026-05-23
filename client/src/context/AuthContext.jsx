import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = '/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const signUp = async (email, password, name) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      setUser(userData)
      return { data: { user: userData }, error: null }
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed'
      return { data: null, error: { message } }
    }
  }

  const signIn = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
      const { token, user: userData } = res.data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      setUser(userData)
      return { data: { user: userData }, error: null }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      return { data: null, error: { message } }
    }
  }

  const signOut = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  const getToken = () => localStorage.getItem('auth_token')

  const isAdmin = user?.role === 'admin'
  // profile is same as user in our MongoDB setup
  const profile = user ? { ...user, name: user.name } : null

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isAdmin,
      signUp, signIn, signOut, getToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
