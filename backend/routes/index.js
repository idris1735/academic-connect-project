const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const termsRoutes = require('./terms')
const privacyRoutes = require('./privacy')
// const userRoutes = require('./userRoutes');

// Export a function that returns the configured router
module.exports = () => {
  // Mount the routes
  router.use('/auth', authRoutes)
  router.use('/', termsRoutes)
  router.use('/', privacyRoutes)
  // router.use('/user', userRoutes(app)); // Pass app instance to user routes

  return router
}
