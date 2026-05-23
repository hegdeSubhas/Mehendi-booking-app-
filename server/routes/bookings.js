const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const { authenticate, requireAdmin } = require('../middleware/auth')

// POST /bookings — create booking (authenticated users)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      designId, designTitle, designCategory, designImage, pricePerHead,
      customerName, phone, email, address,
      bookingDate, bookingTime, customerCount, totalPrice, notes,
      // legacy field names from frontend
      customer_name, booking_date, booking_time, customer_count, total_price,
      design_id,
    } = req.body

    const booking = await Booking.create({
      userId: req.user.id === 'admin' ? null : req.user.id,
      designId: designId || design_id || '',
      designTitle: designTitle || '',
      designCategory: designCategory || '',
      designImage: designImage || '',
      pricePerHead: pricePerHead || 0,
      customerName: customerName || customer_name,
      phone,
      email,
      address,
      bookingDate: bookingDate || booking_date,
      bookingTime: bookingTime || booking_time,
      customerCount: Number(customerCount || customer_count || 1),
      totalPrice: Number(totalPrice || total_price || 0),
      notes: notes || '',
      status: 'pending',
    })

    res.status(201).json({ booking, message: 'Booking created successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /bookings — all bookings (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /bookings/my — user's own bookings
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json({ bookings })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /bookings/:id — single booking
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('userId', 'name email')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    // Only allow owner or admin
    if (req.user.role !== 'admin' && booking.userId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }
    res.json({ booking })
  } catch (err) {
    res.status(404).json({ message: 'Booking not found' })
  }
})

// PUT /bookings/:id — update booking status (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ booking, message: `Booking ${status} successfully` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /bookings/:id (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
