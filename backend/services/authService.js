const { auth } = require('../config/firebase')
const admin = require('../config/firebase')
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require('firebase/auth')
const { createCookieSession, AddChatToken } = require('../utils/cookieSession')
const { db } = require('../config/database')
const { FieldValue } = require('firebase-admin/firestore')

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const userCredential = await admin
      .auth()
      .signInWithEmailAndPassword(email, password)
    const idToken = await userCredential.user.getIdToken()

    // Create session cookie or handle login success
    return res.status(200).json({ user: userCredential.user, idToken })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(400).json({ message: error.message })
  }
}

exports.signup = async (req, res) => {
  console.log('Received signup data:', req.body) // Debug log

  const { email, password, userType, subOption, formData } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const userCredential = await admin.auth().createUser({
      email,
      password,
    })

    return res.status(201).json({ user: userCredential })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(400).json({ message: error.message })
  }
}

exports.logout = (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })
  res.status(200).json({ message: 'Logout successful' })
}
