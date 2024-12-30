const express = require('express')
const router = express.Router()
const authService = require('../services/authService')
const { signupLimiter } = require('../middleware/rateLimiter')

router.post('/signup', signupLimiter, authService.signup)
router.post('/login', authService.login)
router.post('/logout', authService.logout)

module.exports = router
