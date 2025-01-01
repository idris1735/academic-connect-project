const admin = require('../config/firebase')

const createCookieSession = async (req, res, idToken) => {
  try {
    // Session duration: 5 days
    const expiresIn = 5 * 24 * 60 * 60 * 1000

    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn,
    })

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    }

    // Set the cookie
    res.cookie('session', sessionCookie, options)

    return sessionCookie
  } catch (error) {
    console.error('Error creating session cookie:', error)
    throw error
  }
}

module.exports = { createCookieSession }
