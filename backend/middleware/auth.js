const { admin } = require('../config/firebase')
const { PUBLIC_ROUTES } = require('../utils/constants')

const checkAuth = async (req, res, next) => {
  // Skip auth for static files and public routes
  if (
    PUBLIC_ROUTES.some((route) => req.path.startsWith(route)) ||
    req.path.includes('/_next/') ||
    req.path.includes('/static/')
  ) {
    return next()
  }

  const sessionCookie = req.cookies.session

  if (!sessionCookie) {
    console.log('No session cookie found')
    return res.status(401).json({ message: 'No session found' })
  }

  try {
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
    console.log('Session verified for:', decodedToken.email)
    req.user = decodedToken
    return next()
  } catch (error) {
    console.error('Session verification failed:', error)
    return res.status(401).json({
      message: 'Invalid session',
      error: error.message,
    })
  }
}

module.exports = checkAuth
