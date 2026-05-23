import React, { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Palette, LogOut,
  Menu, X, ChevronRight, Bell, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const adminNavLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/bookings', icon: BookOpen, label: 'Bookings' },
  { to: '/admin/designs', icon: Palette, label: 'Designs' },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/')
  }

  const Sidebar = ({ mobile = false }) => (
    <div className="h-full flex flex-col" style={{background:'var(--brown)'}}>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3" style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{background:'rgba(201,168,76,0.2)'}}>🌿</div>
        <div>
          <div className="text-white font-bold text-sm" style={{fontFamily:'Playfair Display, serif'}}>Sumii Art World</div>
          <div className="text-xs" style={{color:'var(--gold)'}}>Admin Panel</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/60 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'rgba(201,168,76,0.25)', color: 'var(--gold-light)' } : {}}
          >
            <Icon size={18} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-50" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4" style={{borderTop:'1px solid rgba(255,255,255,0.1)'}}>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all mb-2">
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-left text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen" style={{background:'var(--cream)'}}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden overflow-y-auto"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 shrink-0 shadow-sm" style={{background:'white', borderBottom:'1px solid rgba(201,168,76,0.15)'}}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg"
              style={{color:'var(--brown)'}}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-sm" style={{color:'var(--brown)', fontFamily:'Playfair Display, serif'}}>Admin Dashboard</h1>
              <p className="text-xs" style={{color:'var(--text-light)'}}>Welcome back, {profile?.name || 'Admin'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{background:'var(--gold)'}}>
              {(profile?.name || 'A')?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
