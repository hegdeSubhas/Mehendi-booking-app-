const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /auth/signup — Register new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    // Create user
    const user = await User.create({ name, email, password, role: 'customer' })

    const token = generateToken({ id: user._id.toString(), email: user.email, role: 'customer' })

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /auth/login — Login (user or admin on same endpoint)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Check admin credentials first
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (email.toLowerCase() === adminEmail?.toLowerCase()) {
      if (password !== adminPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      const token = generateToken({ email: adminEmail, role: 'admin', isAdmin: true })
      return res.json({
        message: 'Admin login successful',
        token,
        user: { id: 'admin', name: 'Admin', email: adminEmail, role: 'admin' },
      })
    }

    // Regular user login
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role })

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /auth/me — get current user profile
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }
    const token = auth.split(' ')[1]
    const jwt_pkg = require('jsonwebtoken')
    const decoded = jwt_pkg.verify(token, process.env.JWT_SECRET)

    if (decoded.isAdmin) {
      return res.json({ user: { id: 'admin', name: 'Admin', email: decoded.email, role: 'admin' } })
    }

    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

module.exports = router
