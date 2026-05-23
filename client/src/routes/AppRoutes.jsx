import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'

// Pages
import HomePage from '../pages/HomePage'
import DesignsPage from '../pages/DesignsPage'
import DesignDetailPage from '../pages/DesignDetailPage'
import BookingPage from '../pages/BookingPage'
import ContactPage from '../pages/ContactPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import MyBookingsPage from '../pages/MyBookingsPage'
import BookingConfirmationPage from '../pages/BookingConfirmationPage'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminBookings from '../pages/admin/AdminBookings'
import AdminDesigns from '../pages/admin/AdminDesigns'

// Spinner component
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
    <div className="animate-spin w-10 h-10 rounded-full border-4 border-t-transparent"
      style={{ borderColor: 'var(--gold)', borderTopColor: 'transparent' }} />
  </div>
)

// Protected Route — redirects to /login with return path in state
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Admin-only Route
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/designs/:id" element={<DesignDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<MainLayout />}>
        <Route path="/book/:designId?" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/booking-confirmation/:id" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="designs" element={<AdminDesigns />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
