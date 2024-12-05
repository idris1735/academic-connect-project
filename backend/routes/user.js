const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


router.get('/profile', userService.getUserProfile);
router.put('/profile', userService.updateUserProfile);

module.exports = router;

