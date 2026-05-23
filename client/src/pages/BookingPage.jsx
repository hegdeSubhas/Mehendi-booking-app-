import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, MapPin, Users, Phone, Mail, User, FileText, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { bookingsAPI, designsAPI } from '../services/api'

function normaliseDesign(d) {
  return {
    ...d,
    id: String(d.id || d._id || ''),
    price_per_head: d.price_per_head ?? d.pricePerHead ?? 0,
    image_url: d.image_url || d.imageUrl || '',
  }
}

export default function BookingPage() {
  const { designId } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [designs, setDesigns] = useState([])
  const [loadingDesigns, setLoadingDesigns] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      customerName: profile?.name || user?.name || '',
      email: user?.email || '',
      customerCount: 1,
    }
  })

  // Load designs from DB only
  useEffect(() => {
    setLoadingDesigns(true)
    designsAPI.getAll()
      .then(res => {
        const raw = (res.data?.designs || []).map(normaliseDesign)
        setDesigns(raw)
        // Auto-select if designId in URL
        if (designId) {
          const found = raw.find(d => d.id === String(designId))
          if (found) setSelectedDesign(found)
        }
      })
      .catch(() => setDesigns([]))
      .finally(() => setLoadingDesigns(false))
  }, [designId])

  const count = Number(watch('customerCount')) || 1
  const pricePerHead = selectedDesign?.price_per_head || 0
  const totalPrice = pricePerHead * count
  const gst = Math.round(totalPrice * 0.05)
  const grandTotal = totalPrice + gst

  const onSubmit = async (data) => {
    if (!selectedDesign) { toast.error('Please select a design'); return }
    setSubmitting(true)
    try {
      const payload = {
        designId: selectedDesign.id,
        designTitle: selectedDesign.title,
        designCategory: selectedDesign.category,
        designImage: selectedDesign.image_url,
        pricePerHead,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        customerCount: count,
        totalPrice: grandTotal,
        notes: data.notes || '',
      }
      const res = await bookingsAPI.create(payload)
      const bookingId = res.data?.booking?._id || res.data?.booking?.id || 'success'
      toast.success('Booking submitted! The admin will confirm shortly 🌿')
      navigate(`/booking-confirmation/${bookingId}`)
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const InputField = ({ label, icon: Icon, error, ...props }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />}
        <input {...props} className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-400' : ''}`} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="gold-divider" />
          <h1 className="section-title">Book Your Mehendi</h1>
          <p className="section-subtitle">Fill in the details below to secure your booking</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — Form */}
            <div className="lg:col-span-2 space-y-6">

              {/* Design Selection */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Select a Design</h2>

                {loadingDesigns ? (
                  <div className="flex items-center justify-center py-10 gap-3" style={{ color: 'var(--text-light)' }}>
                    <Loader size={20} className="animate-spin" style={{ color: 'var(--gold)' }} />
                    <span className="text-sm">Loading designs...</span>
                  </div>
                ) : designs.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🌿</div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--brown)' }}>No designs available yet</p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-light)' }}>The admin hasn't added any designs. Please check back soon.</p>
                    <Link to="/designs" className="btn-gold py-2 px-5 text-sm inline-flex">Browse Designs</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {designs.map(d => {
                      const isSelected = selectedDesign?.id === d.id
                      return (
                        <button type="button" key={d.id} onClick={() => setSelectedDesign(d)}
                          className="rounded-xl overflow-hidden border-2 transition-all duration-200 text-left"
                          style={{ borderColor: isSelected ? 'var(--gold)' : 'transparent', transform: isSelected ? 'scale(1.03)' : 'scale(1)' }}>
                          <img src={d.image_url} alt={d.title} className="w-full h-24 object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=300&q=80' }} />
                          <div className="p-2" style={{ background: isSelected ? 'rgba(201,168,76,0.08)' : 'transparent' }}>
                            <div className="text-xs font-semibold truncate" style={{ color: 'var(--brown)' }}>{d.title}</div>
                            <div className="text-xs mt-0.5" style={{ color: 'var(--gold-dark)' }}>₹{d.price_per_head.toLocaleString()}/person</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </motion.div>

              {/* Customer Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Customer Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Full Name *" icon={User} placeholder="Your full name" error={errors.customerName}
                    {...register('customerName', { required: 'Name is required' })} />
                  <InputField label="Email *" icon={Mail} type="email" placeholder="your@email.com" error={errors.email}
                    {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
                  <InputField label="Phone *" icon={Phone} type="tel" placeholder="+91 98765 43210" error={errors.phone}
                    {...register('phone', { required: 'Phone required', minLength: { value: 10, message: 'Min 10 digits' } })} />
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>Number of People *</label>
                    <div className="relative">
                      <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                      <input type="number" min={1} max={100} placeholder="1"
                        className={`input-field pl-10 ${errors.customerCount ? 'border-red-400' : ''}`}
                        {...register('customerCount', { required: true, min: 1 })} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Event Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Event Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Event Date *" icon={Calendar} type="date" error={errors.bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('bookingDate', { required: 'Date is required' })} />
                  <InputField label="Event Time *" icon={Clock} type="time" error={errors.bookingTime}
                    {...register('bookingTime', { required: 'Time is required' })} />
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>Address / Location *</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-3.5" style={{ color: 'var(--gold)' }} />
                      <textarea rows={2} placeholder="Full address for the event"
                        className={`input-field pl-10 resize-none ${errors.address ? 'border-red-400' : ''}`}
                        {...register('address', { required: 'Address required' })} />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-mid)' }}>Special Requests (optional)</label>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3.5 top-3.5" style={{ color: 'var(--gold)' }} />
                      <textarea rows={3} placeholder="Any specific patterns, allergies, or special notes..."
                        className="input-field pl-10 resize-none" {...register('notes')} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right — Summary */}
            <div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Booking Summary</h2>

                {selectedDesign ? (
                  <>
                    <img src={selectedDesign.image_url} alt={selectedDesign.title}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=300&q=80' }} />
                    <div className="font-semibold mb-1" style={{ color: 'var(--brown)' }}>{selectedDesign.title}</div>
                    <div className="badge badge-gold mb-4">{selectedDesign.category}</div>

                    <div className="space-y-3 pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-light)' }}>Price per person</span>
                        <span style={{ color: 'var(--text-mid)' }}>₹{pricePerHead.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-light)' }}>No. of people</span>
                        <span style={{ color: 'var(--text-mid)' }}>× {count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-light)' }}>Subtotal</span>
                        <span style={{ color: 'var(--text-mid)' }}>₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-light)' }}>GST (5%)</span>
                        <span style={{ color: 'var(--text-mid)' }}>₹{gst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-3" style={{ borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                        <span style={{ color: 'var(--brown)' }}>Grand Total</span>
                        <span style={{ color: 'var(--gold-dark)', fontFamily: 'Playfair Display, serif', fontSize: '1.25rem' }}>
                          ₹{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🌿</div>
                    <p className="text-sm" style={{ color: 'var(--text-light)' }}>Select a design to see pricing</p>
                  </div>
                )}

                <button type="submit" disabled={submitting || !selectedDesign || designs.length === 0}
                  className="btn-gold w-full justify-center mt-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting
                    ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" />Submitting...</span>
                    : <span className="flex items-center gap-2"><CheckCircle size={16} />Confirm Booking</span>
                  }
                </button>
                <p className="text-xs text-center mt-3" style={{ color: 'var(--text-light)' }}>Admin will review and confirm your booking</p>
              </motion.div>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
