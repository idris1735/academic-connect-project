const express = require('express')
const router = express.Router()
const multer = require('multer')
const postService = require('../services/postService')

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Routes
router.post('/create', upload.array('attachments'), postService.createPost)
router.get('/get_posts', postService.getPosts)
router.post('/:postId/like', postService.likePost)
router.post('/:postId/comment', postService.addComment)

module.exports = router
