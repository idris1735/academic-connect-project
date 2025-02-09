const express = require('express')
const router = express.Router()
const chatService = require('../services/chatService')

router.get('/list_chats', chatService.listChats)
router.get('/get_token', async (req, res) => {
  try {
    // Get user from session/auth
    const userId = req.user?.uid
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' })
    }

    // Generate token using the service
    const token = await chatService.generateUserChatToken(userId)

    // Set token in cookie and return it
    res.cookie('chatToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
    })

    return res.json({ token })
  } catch (error) {
    console.error('Error generating token:', error)
    return res.status(500).json({ error: 'Failed to generate token' })
  }
})

module.exports = router
