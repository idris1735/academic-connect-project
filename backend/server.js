const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const checkAuth = require('./middleware/auth')
const { PUBLIC_ROUTES } = require('./utils/constants')

const app = express()

// Enable CORS with specific options
app.use(
  cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Basic middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  })
)

// Import routes
const authRoutes = require('./routes/auth')
const postsRoutes = require('./routes/posts')

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postsRoutes)

// Auth middleware for protected routes
app.use((req, res, next) => {
  if (PUBLIC_ROUTES.some((route) => req.path.startsWith(route))) {
    return next()
  }
  return checkAuth(req, res, next)
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ message: 'Internal server error', error: err.message })
})

// Start server on port 3001
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})

module.exports = app
