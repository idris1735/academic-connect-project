const express = require('express');
const router = express.Router();
const profileService = require('../services/profileService');


router.get('/individual', profileService.getProfileIndividual);
router.get('/get_profiles', profileService.getProfiles);
router.get('/activities/:uid', profileService.getProfileActivities);

module.exports = router;
