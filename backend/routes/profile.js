const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');
const checkAuth = require('../middleware/auth');

router.get('/individual', checkAuth, profileService.getProfile);

module.exports = router;
