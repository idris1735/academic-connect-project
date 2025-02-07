const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', authService.login);
router.post('/google-login', authService.googleLogin);
router.post('/signup', authService.signup);
router.get('/logout', authService.logout);
module.exports = router;