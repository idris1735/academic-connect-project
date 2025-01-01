const express = require('express')
const router = express.Router()
const admin = require('../config/firebase')
const { signupLimiter } = require('../middleware/rateLimiter')
const { createCookieSession } = require('../utils/cookieSession')

// Auth routes
router.post('/signup', signupLimiter, async (req, res) => {
  try {
    const { email, password, userType, subOption, formData } = req.body

    // Create user in Firebase
    const userCredential = await admin.auth().createUser({
      email,
      password,
    })

    // You can store additional user data in your database here
    // For example: role, profile info, etc.

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userCredential.uid,
        email: userCredential.email,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(400).json({
      message: error.message || 'Failed to create user',
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    // Get the ID token from the Authorization header
    const idToken = req.headers.authorization?.split('Bearer ')[1]

    if (!idToken) {
      return res.status(401).json({ message: 'No token provided' })
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken)

    // Create a session cookie
    const sessionCookie = await createCookieSession(req, res, idToken)

    return res.status(200).json({
      message: 'Logged in successfully',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message,
    })
  }
})

router.get('/logout', (req, res) => {
  res.clearCookie('session')
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router
