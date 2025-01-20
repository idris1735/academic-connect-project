const express = require('express')
const next = require('next')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { auth } = require('./config/firebase')
const admin = require('./config/firebase')
const socketService = require('./services/socketService')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const server = express()

// Middleware
server.use(express.json())
server.use(cookieParser())
server.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    },
  })
)

// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/posts')
const profileRoutes = require('./routes/profile')
const networkRoutes = require('./routes/network')
const notificationRoutes = require('./routes/notification')
const messageRoutes = require('./routes/messages')
const workflowRoutes = require('./routes/workflows')
const connectionRoutes = require('./routes/connections')
const chatRoutes = require('./routes/chats')
// Import middleware
const checkAuth = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')

// Wait for Next.js to be ready before starting the server
app
  .prepare()
  .then(() => {
    // API routes
    server.use('/auth', authRoutes)
    server.use('/user', checkAuth, userRoutes)
    server.use('/api/posts', checkAuth, postRoutes)
    server.use('/api/users', checkAuth, userRoutes)
    server.use('/api/profile', checkAuth, profileRoutes)
    server.use('/api/network', checkAuth, networkRoutes)
    server.use('/api/notifications', checkAuth, notificationRoutes)
    server.use('/api/messages', checkAuth, messageRoutes)
    server.use('/api/workflows', checkAuth, workflowRoutes)
    server.use('/api/connections', checkAuth, connectionRoutes)
    server.use('/api/chats', checkAuth, chatRoutes)

    // Handle login route
    server.get('/login', (req, res) => {
      const sessionCookie = req.cookies.session
      if (sessionCookie) {
        return res.redirect('/feeds')
      }
      return app.render(req, res, '/login')
    })

    // Handle all other routes
    server.get('*', checkAuth, (req, res) => {
      return handle(req, res)
    })

    // Error handling
    server.use(errorHandler)

    // Start server
    const httpServer = server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })

    // Initialize socket service
    socketService.initialize(httpServer)

    // Export for use in other services
    exports.socketServer = socketService
  })
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })

// Export for testing
module.exports = server
