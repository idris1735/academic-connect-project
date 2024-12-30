const rateLimit = require('express-rate-limit')

exports.signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 signup attempts per IP
  message: {
    error: 'Too many signup attempts. Please try again in an hour.',
  },
})
