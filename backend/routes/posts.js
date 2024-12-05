const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

router.post('/create_post', postService.createPost);
router.get('/get_posts', postService.getPosts);
router.post('/:postId/like', postService.likePost);
router.post('/:postId/comment', postService.addComment);

module.exports = router;