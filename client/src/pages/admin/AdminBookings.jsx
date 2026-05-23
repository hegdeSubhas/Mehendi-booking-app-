import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle, XCircle, Loader, Clock, Calendar, MapPin, Users, Phone, Mail, IndianRupee, MessageSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { bookingsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'rejected', 'completed']

const statusConfig = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: '⏳ Pending' },
  confirmed: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: '✅ Confirmed' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: '❌ Rejected' },
  completed: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: '🎉 Completed' },
}

function BookingCard({ booking, onUpdate, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const [adminNote, setAdminNote] = useState(booking.adminNote || '')
  const [expanded, setExpanded] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)

  const cfg = statusConfig[booking.status] || statusConfig.pending

  const handleAction = async (status) => {
    setUpdating(true)
    try {
      await onUpdate(booking._id, status, adminNote)
    } finally {
      setUpdating(false)
      setShowNoteInput(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this booking permanently?')) return
    setUpdating(true)
    try {
      await onDelete(booking._id)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="font-bold text-lg" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>
              {booking.customerName}
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ color: cfg.color, background: cfg.bg }}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-light)' }}>{booking.designTitle || 'Design not specified'} • {booking.designCategory || ''}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: 'var(--gold-dark)', fontFamily: 'Playfair Display, serif' }}>
            ₹{booking.totalPrice?.toLocaleString() || 0}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-light)' }}>
            ₹{booking.pricePerHead?.toLocaleString() || 0} × {booking.customerCount} {booking.customerCount === 1 ? 'person' : 'people'}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
        <div className="flex items-center gap-2">
          <Calendar size={13} style={{ color: 'var(--gold)' }} />
          <span style={{ color: 'var(--text-mid)' }}>{booking.bookingDate || booking.booking_date || '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: 'var(--gold)' }} />
          <span style={{ color: 'var(--text-mid)' }}>{booking.bookingTime || booking.booking_time || '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} style={{ color: 'var(--gold)' }} />
          <span style={{ color: 'var(--text-mid)' }}>{booking.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={13} style={{ color: 'var(--gold)' }} />
          <span className="truncate" style={{ color: 'var(--text-mid)' }}>{booking.email}</span>
        </div>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between text-sm transition-colors hover:bg-amber-50/30"
        style={{ color: 'var(--text-light)' }}
      >
        <span>{expanded ? 'Hide details' : 'Show details'}</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 text-sm" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
              <div className="pt-3 flex items-start gap-2">
                <MapPin size={13} style={{ color: 'var(--gold)', marginTop: 2 }} />
                <span style={{ color: 'var(--text-mid)' }}>{booking.address}</span>
              </div>
              {booking.notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare size={13} style={{ color: 'var(--gold)', marginTop: 2 }} />
                  <span style={{ color: 'var(--text-mid)' }}>{booking.notes}</span>
                </div>
              )}
              {booking.adminNote && (
                <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(201,168,76,0.08)', color: 'var(--text-mid)' }}>
                  <strong style={{ color: 'var(--gold-dark)' }}>Admin Note:</strong> {booking.adminNote}
                </div>
              )}
              <div className="text-xs" style={{ color: 'var(--text-light)' }}>
                Submitted: {new Date(booking.createdAt).toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="px-5 py-4 flex items-center gap-3 flex-wrap" style={{ borderTop: '1px solid rgba(201,168,76,0.1)', background: 'rgba(255,252,247,0.5)' }}>
        {booking.status === 'pending' && (
          <>
            {showNoteInput ? (
              <div className="flex-1 flex gap-2">
                <input
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a note (optional)..."
                  className="input-field text-sm flex-1 py-2"
                />
                <button
                  onClick={() => handleAction('confirmed')}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{ background: '#10B981', color: 'white' }}
                >
                  {updating ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Accept
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{ background: '#EF4444', color: 'white' }}
                >
                  {updating ? <Loader size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Reject
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setShowNoteInput(true); setAdminNote('') }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                >
                  <CheckCircle size={15} /> Accept Booking
                </button>
                <button
                  onClick={() => handleAction('rejected')}
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: 'white', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
                >
                  {updating ? <Loader size={14} className="animate-spin" /> : <XCircle size={15} />} Reject
                </button>
              </>
            )}
          </>
        )}
        {booking.status === 'confirmed' && (
          <button
            onClick={() => handleAction('completed')}
            disabled={updating}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
          >
            {updating ? <Loader size={14} className="animate-spin" /> : '🎉'} Mark Completed
          </button>
        )}
        <div className="ml-auto">
          <button
            onClick={handleDelete}
            disabled={updating}
            className="p-2.5 rounded-lg transition-all hover:bg-red-50"
            style={{ color: '#EF4444' }}
            title="Delete booking"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = () => {
    setLoading(true)
    bookingsAPI.getAll()
      .then(r => setBookings(r.data?.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleUpdate = async (id, status, adminNote) => {
    try {
      await bookingsAPI.updateStatus(id, status, adminNote)
      toast.success(`Booking ${status}! ✅`)
      load()
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try {
      await bookingsAPI.delete(id)
      toast.success('Booking deleted')
      setBookings(prev => prev.filter(b => b._id !== id))
    } catch { toast.error('Delete failed') }
  }

  const filtered = bookings.filter(b => {
    const s = statusFilter === 'all' || b.status === statusFilter
    const q = !search ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.designTitle?.toLowerCase().includes(search.toLowerCase())
    return s && q
  })

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status !== 'rejected').reduce((acc, b) => acc + (b.totalPrice || 0), 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Manage Bookings</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>Review and accept or reject customer booking requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: stats.total, color: 'var(--brown)' },
          { label: 'Pending Review', value: stats.pending, color: '#F59E0B' },
          { label: 'Confirmed', value: stats.confirmed, color: '#10B981' },
          { label: 'Est. Revenue', value: `₹${stats.revenue.toLocaleString()}`, color: 'var(--gold-dark)' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: 'Playfair Display, serif' }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }} />
          <input placeholder="Search by name, email or design..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: statusFilter === s ? 'var(--gold)' : 'rgba(201,168,76,0.1)',
                color: statusFilter === s ? 'white' : 'var(--text-mid)',
              }}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader size={28} className="animate-spin" style={{ color: 'var(--gold)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p style={{ color: 'var(--text-light)' }}>No bookings found</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filtered.map(b => (
              <BookingCard key={b._id} booking={b} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
