const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');
const userService = require('../services/userService');

router.get('/individual', profileService.getProfileIndividual);
router.get('/get_profiles', profileService.getProfiles);
router.get('/activities/:uid', profileService.getProfileActivities);
router.get('/get_current_user', userService.getCurrentUser);

module.exports = router;
