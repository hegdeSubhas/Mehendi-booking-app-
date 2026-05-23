import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, BookOpen, MessageCircle } from 'lucide-react'

export default function BookingConfirmationPage() {
  const { id } = useParams()
  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--cream)' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="glass-card p-10 max-w-lg w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))' }}>
          <CheckCircle size={40} className="text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Booking Confirmed!</h1>
        <p className="mb-2" style={{ color: 'var(--text-mid)' }}>Your booking <strong style={{ color: 'var(--gold-dark)' }}>#{id}</strong> has been received.</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-light)' }}>We'll reach out shortly to confirm details. Check your email for confirmation.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-bookings" className="btn-gold py-3 px-6 text-sm"><BookOpen size={16} />My Bookings</Link>
          <Link to="/designs" className="btn-outline-gold py-3 px-6 text-sm"><Calendar size={16} />Browse Designs</Link>
        </div>
        <a href="https://wa.me/+917338498524" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm transition-colors hover:opacity-80"
          style={{ color: '#25D366' }}>
          <MessageCircle size={15} /> WhatsApp us for quick assistance
        </a>
      </motion.div>
    </div>
  )
}
