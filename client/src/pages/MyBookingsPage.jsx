import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, Loader, CheckCircle, XCircle, Clock3, Award } from 'lucide-react'
import { bookingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', icon: Clock3, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'Rejected', icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  completed: { label: 'Completed', icon: Award, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    bookingsAPI.getMyBookings()
      .then(r => setBookings(r.data?.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="gold-divider" />
          <h1 className="section-title">My Bookings</h1>
          <p className="section-subtitle">Track all your mehendi appointments</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader size={32} className="animate-spin" style={{ color: 'var(--gold)' }} /></div>
        ) : bookings.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>No bookings yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-light)' }}>You haven't made any bookings. Book your first mehendi session!</p>
            <a href="/book" className="btn-gold">Book Now</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending
              const StatusIcon = cfg.icon
              return (
                <motion.div key={b._id || b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card overflow-hidden">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>
                          {b.designTitle || 'Mehendi Booking'}
                        </h3>
                        {b.designCategory && (
                          <span className="badge badge-gold">{b.designCategory}</span>
                        )}
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                          style={{ color: cfg.color, background: cfg.bg }}>
                          <StatusIcon size={11} /> {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-light)' }}>
                        <span className="flex items-center gap-1"><Calendar size={12} style={{ color: 'var(--gold)' }} />{b.bookingDate || b.booking_date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} style={{ color: 'var(--gold)' }} />{b.bookingTime || b.booking_time}</span>
                        <span className="flex items-center gap-1"><Users size={12} style={{ color: 'var(--gold)' }} />{b.customerCount || b.customer_count} {(b.customerCount || b.customer_count) === 1 ? 'person' : 'people'}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} style={{ color: 'var(--gold)' }} />{(b.address || '').slice(0, 35)}{b.address?.length > 35 ? '...' : ''}</span>
                      </div>
                      {b.adminNote && (
                        <div className="mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(201,168,76,0.08)', color: 'var(--text-mid)' }}>
                          <strong style={{ color: 'var(--gold-dark)' }}>Admin note:</strong> {b.adminNote}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold-dark)' }}>
                        ₹{(b.totalPrice || b.total_price || 0).toLocaleString()}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-light)' }}>
                        ₹{(b.pricePerHead || 0).toLocaleString()} × {b.customerCount || b.customer_count}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                        {new Date(b.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
