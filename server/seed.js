require('dotenv').config()
const mongoose = require('mongoose')
const Design = require('./models/Design')

const designs = [
  {
    title: 'Royal Bridal Full Hand',
    category: 'Bridal',
    description: 'Exquisite full-hand bridal mehendi with intricate traditional patterns, perfect for your wedding day. Features fine detailing with peacock motifs and floral patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=600&q=80',
    pricePerHead: 3500,
    duration: '4-5 hours',
    rating: 4.9,
  },
  {
    title: 'Arabic Floral Design',
    category: 'Arabic',
    description: 'Modern Arabic-style mehendi with bold floral patterns and elegant vine work. Quick application with striking visual impact.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    pricePerHead: 1200,
    duration: '1.5-2 hours',
    rating: 4.7,
  },
  {
    title: 'Festival Special',
    category: 'Festival',
    description: 'Beautiful festive mehendi designs perfect for Eid, Diwali, and other celebrations. Colorful and vibrant patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
    pricePerHead: 800,
    duration: '1-1.5 hours',
    rating: 4.6,
  },
  {
    title: 'Engagement Glam',
    category: 'Engagement',
    description: 'Sophisticated engagement mehendi with contemporary designs blending traditional and modern elements. Includes couple motifs.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    pricePerHead: 2200,
    duration: '3-4 hours',
    rating: 4.8,
  },
  {
    title: 'Kids Fun Design',
    category: 'Kids',
    description: 'Cute and simple mehendi designs specially crafted for children. Safe ingredients with fun animal and cartoon motifs.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
    pricePerHead: 400,
    duration: '30-45 minutes',
    rating: 4.5,
  },
  {
    title: 'Indo-Western Fusion',
    category: 'Indo-Western',
    description: 'Contemporary fusion designs combining Indian traditional art with modern western aesthetics. Unique mandala and geometric patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=600&q=80',
    pricePerHead: 1800,
    duration: '2-3 hours',
    rating: 4.7,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    const count = await Design.countDocuments()
    if (count > 0) {
      console.log(`ℹ️  ${count} designs already exist. Skipping seed.`)
      console.log('   To re-seed, run: node seed.js --force')
      if (!process.argv.includes('--force')) {
        process.exit(0)
      }
      await Design.deleteMany({})
      console.log('🗑️  Cleared existing designs')
    }
    
    await Design.insertMany(designs)
    console.log(`✅ Seeded ${designs.length} designs successfully!`)
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seed()
