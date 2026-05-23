const mongoose = require('mongoose')

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Bridal', 'Arabic', 'Festival', 'Engagement', 'Kids', 'Indo-Western'],
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  pricePerHead: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: String,
    default: '2-3 hours',
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Design', designSchema)
