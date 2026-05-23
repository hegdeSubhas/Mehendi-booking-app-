require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const designRoutes = require('./routes/designs')
const bookingRoutes = require('./routes/bookings')
const contactRoutes = require('./routes/contact')
const uploadRoutes = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

// ── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB()

// ── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

// CORS — allow configured CLIENT_URL in production, any localhost in dev
const allowedOrigins = isProduction
  ? [process.env.CLIENT_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173']

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (!isProduction || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// ── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many auth attempts, try again later.' } }))
app.use('/bookings', rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { message: 'Too many requests.' } }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }))

// ── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  status: 'ok',
  env: process.env.NODE_ENV || 'development',
  db: 'mongodb',
  time: new Date().toISOString(),
}))

// ── API Routes (support both /auth and /api/auth for flexibility) ────────────
const apiRouter = express.Router()
apiRouter.use('/auth', authRoutes)
apiRouter.use('/designs', designRoutes)
apiRouter.use('/bookings', bookingRoutes)
apiRouter.use('/contact', contactRoutes)
apiRouter.use('/upload', uploadRoutes)

app.use('/', apiRouter)      // direct: /auth, /designs etc. (used by Vite proxy in dev)
app.use('/api', apiRouter)   // prefixed: /api/auth, /api/designs etc. (used by client in prod)

// ── Serve React build in production ─────────────────────────────────────────
if (isProduction) {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist')
  app.use(express.static(clientBuild))
  // SPA fallback — all non-API routes serve index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/auth') ||
        req.path.startsWith('/designs') || req.path.startsWith('/bookings') ||
        req.path.startsWith('/contact') || req.path.startsWith('/upload') ||
        req.path.startsWith('/health')) return res.status(404).json({ message: 'Not found' })
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🌿 Sumii Art World server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
