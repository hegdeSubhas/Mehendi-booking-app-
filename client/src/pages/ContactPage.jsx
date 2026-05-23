import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react'

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
import toast from 'react-hot-toast'
import { contactAPI } from '../services/api'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await contactAPI.send(data)
      toast.success('Message sent! We\'ll get back to you soon.')
      reset()
    } catch {
      toast.error('Failed to send message. Please try WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="gold-divider" />
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle">We'd love to hear from you. Reach out for bookings, queries, or collaborations.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            <div className="glass-card p-7">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Contact Details</h2>
              {[
                { icon: Phone, label: 'Phone', value: '+91 7338498524', href: 'tel:+917338498524' },
                { icon: Mail, label: 'Email', value: 'sumashreedhar074@gmail.com', href: 'mailto:sumashreedhar074@gmail.com' },
                { icon: InstagramIcon, label: 'Instagram', value: '@mehndimahal', href: 'https://instagram.com' },
                { icon: MapPin, label: 'Address', value: 'Sirsi karnataka', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,168,76,0.15)' }}>
                    <Icon size={18} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-light)' }}>{label}</div>
                    {href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline" style={{ color: 'var(--text-mid)' }}>{value}</a>
                      : <span className="text-sm" style={{ color: 'var(--text-mid)' }}>{value}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/+917338498524?text=Hi! I'd like to book a mehendi session."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 glass-card p-6 hover:scale-[1.02] transition-transform duration-200">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#25D366' }}>
                <MessageCircle size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>WhatsApp Booking</div>
                <div className="text-sm" style={{ color: 'var(--text-light)' }}>Click to open WhatsApp and book instantly</div>
              </div>
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass-card p-7">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {[
                { label: 'Your Name', name: 'name', type: 'text', placeholder: 'Full name', rules: { required: 'Required' } },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com', rules: { required: 'Required' } },
                { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 9999999999', rules: {} },
              ].map(({ label, name, type, placeholder, rules }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>{label}</label>
                  <input type={type} placeholder={placeholder} className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
                    {...register(name, rules)} />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>Message</label>
                <textarea rows={4} placeholder="Your message or booking inquiry..." className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                  {...register('message', { required: 'Message required' })} />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-60">
                {loading ? <span className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
