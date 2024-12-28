const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');

router.get('/list_chats', chatService.listChats);
router.get('/get_token', chatService.getToken);


module.exports = router;