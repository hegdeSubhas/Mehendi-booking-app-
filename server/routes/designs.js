const express = require('express')
const router = express.Router()
const Design = require('../models/Design')
const { authenticate, requireAdmin } = require('../middleware/auth')

// GET /designs — fetch all designs (public)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    let query = { isActive: true }
    if (category && category !== 'All') query.category = category
    if (search) query.title = { $regex: search, $options: 'i' }

    const designs = await Design.find(query).sort({ createdAt: -1 })

    // Map to legacy-compatible field names for frontend
    const mapped = designs.map(d => ({
      id: d._id.toString(),
      _id: d._id,
      title: d.title,
      category: d.category,
      description: d.description,
      image_url: d.imageUrl,
      imageUrl: d.imageUrl,
      price_per_head: d.pricePerHead,
      pricePerHead: d.pricePerHead,
      duration: d.duration,
      rating: d.rating,
    }))

    res.json({ designs: mapped })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /designs/:id — single design
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
    if (!design) return res.status(404).json({ message: 'Design not found' })
    res.json({
      design: {
        id: design._id.toString(),
        _id: design._id,
        title: design.title,
        category: design.category,
        description: design.description,
        image_url: design.imageUrl,
        imageUrl: design.imageUrl,
        price_per_head: design.pricePerHead,
        pricePerHead: design.pricePerHead,
        duration: design.duration,
        rating: design.rating,
      }
    })
  } catch (err) {
    res.status(404).json({ message: 'Design not found' })
  }
})

// POST /designs (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, category, description, image_url, imageUrl, price_per_head, pricePerHead, duration, rating } = req.body
    const design = await Design.create({
      title,
      category,
      description,
      imageUrl: imageUrl || image_url,
      pricePerHead: pricePerHead || price_per_head,
      duration,
      rating,
    })
    res.status(201).json({ design })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /designs/:id (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, category, description, image_url, imageUrl, price_per_head, pricePerHead, duration, rating, isActive } = req.body
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { title, category, description, imageUrl: imageUrl || image_url, pricePerHead: pricePerHead || price_per_head, duration, rating, isActive },
      { new: true, runValidators: true }
    )
    if (!design) return res.status(404).json({ message: 'Design not found' })
    res.json({ design })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// DELETE /designs/:id (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await Design.findByIdAndDelete(req.params.id)
    res.json({ message: 'Design deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
