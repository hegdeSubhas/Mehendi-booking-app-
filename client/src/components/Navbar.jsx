import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, LayoutDashboard, BookOpen, ChevronDown, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

// Pages with dark hero backgrounds — navbar can be transparent with white text
const HERO_PAGES = ['/']

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/designs', label: 'Designs' },
  { to: '/contact', label: 'Contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Force dark-text mode on non-hero pages (auth, designs, gallery, etc.)
  const isHeroPage = HERO_PAGES.includes(location.pathname)
  const showDarkMode = scrolled || !isHeroPage  // true = cream bg + dark text

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    toast.success('Logged out successfully')
    navigate('/')
    setUserMenuOpen(false)
  }

  // showDarkMode = true → dark text on light bg (auth pages, scrolled, non-hero)
  // showDarkMode = false → white text on dark hero bg (homepage top)
  const textColor = showDarkMode ? 'var(--brown)' : 'rgba(255,255,255,0.95)'
  const subColor  = showDarkMode ? 'var(--gold-dark)' : 'var(--gold-light)'
  const linkColor = showDarkMode ? 'var(--text-dark)' : 'rgba(255,255,255,0.88)'
  const mobileIconColor = showDarkMode ? 'var(--brown)' : 'white'

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showDarkMode ? 'shadow-lg py-3' : 'py-5'}`}
      style={{
        background: showDarkMode ? 'rgba(253,246,236,0.97)' : 'transparent',
        backdropFilter: showDarkMode ? 'blur(20px)' : 'none',
        borderBottom: showDarkMode ? '1px solid rgba(201,168,76,0.25)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-xl leading-none tracking-wide transition-colors duration-300"
              style={{ fontFamily: 'Playfair Display, serif', color: textColor }}>
              Sumii Art World
            </div>
            <div className="text-xs font-medium transition-colors duration-300"
              style={{ color: subColor, fontFamily: 'Poppins, sans-serif' }}>
              Premium Mehendi Art
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar-link text-sm font-medium ${isActive ? 'active' : ''}`}
              style={{ color: linkColor }}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: showDarkMode ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.35)',
                  color: showDarkMode ? 'var(--text-dark)' : 'white',
                  background: showDarkMode ? 'transparent' : 'rgba(255,255,255,0.1)'
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'var(--gold)' }}>
                  {(profile?.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold max-w-[100px] truncate">{profile?.name || 'Account'}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl"
                    style={{ background: 'white', border: '1px solid rgba(201,168,76,0.2)' }}
                  >
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-amber-50 transition-colors"
                        style={{ color: 'var(--brown)' }}>
                        <LayoutDashboard size={16} style={{ color: 'var(--gold)' }} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-bookings" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-amber-50 transition-colors"
                      style={{ color: 'var(--text-dark)' }}>
                      <BookOpen size={16} style={{ color: 'var(--gold)' }} />
                      My Bookings
                    </Link>
                    <div style={{ height: '1px', background: 'rgba(201,168,76,0.15)' }} />
                    <button onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left hover:bg-red-50 transition-colors"
                      style={{ color: '#EF4444' }}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                style={{ color: linkColor }}>
                Sign In
              </Link>
              <Link to="/book" className="btn-gold text-sm py-2.5 px-6">
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-xl" onClick={() => setIsOpen(!isOpen)}
          style={{ color: mobileIconColor }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(253,246,236,0.99)', borderTop: '1px solid rgba(201,168,76,0.2)' }}
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.to} to={link.to} end={link.to === '/'} onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `text-base font-medium py-2 ${isActive ? '' : ''}`}
                  style={({ isActive }) => ({ color: isActive ? 'var(--gold-dark)' : 'var(--text-dark)' })}
                >
                  {link.label}
                </NavLink>
              ))}
              <div style={{ height: '1px', background: 'rgba(201,168,76,0.2)' }} />
              {user ? (
                <>
                  <Link to="/my-bookings" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm py-1" style={{ color: 'var(--text-dark)' }}>
                    <BookOpen size={16} style={{ color: 'var(--gold)' }} /> My Bookings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-sm py-1" style={{ color: 'var(--text-dark)' }}>
                      <LayoutDashboard size={16} style={{ color: 'var(--gold)' }} /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="flex items-center gap-2 text-sm py-1 text-red-500">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline-gold text-center text-sm">Sign In</Link>
                  <Link to="/book" onClick={() => setIsOpen(false)} className="btn-gold text-center text-sm justify-center">Book Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
