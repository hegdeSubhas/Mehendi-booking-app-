const express = require('express')
const router = express.Router()
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const { authenticate, requireAdmin } = require('../middleware/auth')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cloudinary storage — auto-generates public_id, stores in 'sumii-art-world' folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sumii-art-world/designs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
    transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto:good' }],
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif/
  const isValid = allowed.test(file.mimetype.split('/')[1])
  if (isValid) cb(null, true)
  else cb(new Error('Only image files are allowed (jpg, png, gif, webp, avif)'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// POST /upload/image — admin only
router.post('/image', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided' })

  // Cloudinary returns the permanent URL in req.file.path
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,      // full Cloudinary HTTPS URL
    publicId: req.file.filename,  // Cloudinary public_id (for deletion later)
  })
})

// Multer / Cloudinary error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 10MB.' })
    return res.status(400).json({ message: err.message })
  }
  if (err) return res.status(400).json({ message: err.message })
  next()
})

module.exports = router
