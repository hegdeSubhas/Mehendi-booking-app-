import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ name, email, password }) => {
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      toast.error(error.message || 'Signup failed. Please try again.')
      return
    }
    toast.success('Account created! Welcome to Sumii Art World 🌿')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center hero-gradient overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1609166214994-502d326bafee?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div className="relative z-10 text-center text-white px-12">
          <div className="text-6xl mb-6">🌿</div>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Join Sumii Art World</h2>
          <p className="text-lg opacity-80 mb-8">Book beautiful mehendi designs for your special moments</p>
          <div className="space-y-3 text-sm text-left max-w-xs mx-auto">
            {['✓ Browse exclusive designs', '✓ Easy online booking', '✓ Track booking status', '✓ Special group discounts'].map(t => (
              <div key={t} className="opacity-80">{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Sumii Art World</span>
          </div>

          <div className="glass-card p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>
                Create Account
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-light)' }}>Join Sumii Art World and book beautiful designs</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-mid)' }}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                    {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-mid)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' }
                    })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-mid)' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                  <input
                    id="signup-password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-light)' }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="btn-gold w-full justify-center py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Creating account...</span>
                  : <><UserPlus size={17} /> Create Account</>
                }
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.2)' }} />
              <span className="text-xs" style={{ color: 'var(--text-light)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(201,168,76,0.2)' }} />
            </div>

            <p className="text-center text-sm" style={{ color: 'var(--text-light)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-bold hover:underline" style={{ color: 'var(--gold-dark)' }}>Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
