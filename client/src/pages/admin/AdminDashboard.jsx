import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Palette, TrendingUp, Clock, CheckCircle, XCircle, IndianRupee } from 'lucide-react'
import { bookingsAPI, designsAPI } from '../../services/api'

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="glass-card p-6 flex items-center gap-4">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}20` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>{value}</div>
      <div className="text-xs" style={{ color: 'var(--text-light)' }}>{label}</div>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([bookingsAPI.getAll(), designsAPI.getAll()])
      .then(([b, d]) => {
        setBookings(b.data?.bookings || [])
        setDesigns(d.data?.designs || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending = bookings.filter(b => b.status === 'pending').length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.totalPrice || b.total_price || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Dashboard Overview</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>Manage your mehendi business at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Bookings" value={bookings.length} color="var(--gold)" delay={0} />
        <StatCard icon={Clock} label="Pending" value={pending} color="#F59E0B" delay={0.08} />
        <StatCard icon={CheckCircle} label="Confirmed" value={confirmed} color="#10B981" delay={0.16} />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="var(--gold-dark)" delay={0.24} />
      </div>

      {/* Recent Bookings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="text-lg font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Recent Bookings</h3>
        {loading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-light)' }}>No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
                  {['Customer', 'Design', 'Date', 'People', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--text-light)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 8).map((b) => (
                  <tr key={b._id || b.id} style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                    <td className="py-3 pr-4 font-medium" style={{ color: 'var(--brown)' }}>{b.customerName || b.customer_name}</td>
                    <td className="py-3 pr-4" style={{ color: 'var(--text-mid)' }}>{b.designTitle || b.design?.title || '—'}</td>
                    <td className="py-3 pr-4" style={{ color: 'var(--text-mid)' }}>{b.bookingDate || b.booking_date}</td>
                    <td className="py-3 pr-4" style={{ color: 'var(--text-mid)' }}>{b.customerCount || b.customer_count}</td>
                    <td className="py-3 pr-4 font-semibold" style={{ color: 'var(--gold-dark)' }}>₹{(b.totalPrice || b.total_price || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`status-${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
