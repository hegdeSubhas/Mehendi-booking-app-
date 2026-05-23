import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, Send, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    // Simulate sending (no Supabase - inform user to contact admin)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
    toast.success('Request received!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: 'var(--cream)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 sm:p-10 w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Request Received</h2>
            <p className="text-sm mb-2" style={{ color: 'var(--text-light)' }}>
              Please contact the admin at <strong>sumashreedhar074@gmail.com</strong> to reset your password.
            </p>
            <p className="text-xs mb-6" style={{ color: 'var(--text-light)' }}>
              We'll process your request and get back to you shortly.
            </p>
            <Link to="/login" className="btn-gold py-3 px-6 text-sm">Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Forgot Password</h1>
              <p className="text-sm mt-2" style={{ color: 'var(--text-light)' }}>Enter your email and we'll help you reset your password</p>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl mb-5" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <Info size={14} style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
              <p className="text-xs" style={{ color: 'var(--text-mid)' }}>
                Password resets are handled manually. Please contact admin at sumashreedhar074@gmail.com.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                  <input type="email" placeholder="your@email.com" className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                    {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-60">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <><Send size={16} /> Request Password Reset</>}
              </button>
            </form>
            <p className="text-center text-sm mt-6">
              <Link to="/login" className="flex items-center gap-1 justify-center hover:underline" style={{ color: 'var(--gold-dark)' }}><ArrowLeft size={14} /> Back to Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
