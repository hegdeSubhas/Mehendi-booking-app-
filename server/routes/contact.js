const express = require('express')
const router = express.Router()
const { sendContactEmail } = require('../services/emailService')

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required' })
    await sendContactEmail({ name, email, phone, message })
    res.json({ message: 'Message sent successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' })
  }
})

module.exports = router
