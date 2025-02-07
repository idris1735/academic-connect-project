const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.get('/profile', userService.getUserProfile);
router.put('/update_profile', userService.updateUserProfile);
router.get('/current', userService.getCurrentUser);
router.get('/photo_url', userService.getProfilePhotoURL);


module.exports = router;

