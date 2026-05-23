const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware: verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // For admin (stored in env, not DB), check special flag
    if (decoded.isAdmin) {
      req.user = { id: 'admin', email: decoded.email, role: 'admin', isAdmin: true }
      return next()
    }
    
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found' })
    
    req.user = { id: user._id.toString(), email: user.email, role: user.role, name: user.name }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Middleware: require admin role
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = { authenticate, requireAdmin }
