const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  designId: {
    type: String,
    default: '',
  },
  designTitle: {
    type: String,
    default: '',
  },
  designCategory: {
    type: String,
    default: '',
  },
  designImage: {
    type: String,
    default: '',
  },
  pricePerHead: {
    type: Number,
    default: 0,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  bookingDate: {
    type: String,
    required: [true, 'Booking date is required'],
  },
  bookingTime: {
    type: String,
    required: [true, 'Booking time is required'],
  },
  customerCount: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Booking', bookingSchema)
