const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileService = require('../services/profileService');
const userService = require('../services/userService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.get('/individual', profileService.getProfileIndividual);
router.get('/get_profiles', profileService.getProfiles);
router.get('/activities/:uid', profileService.getProfileActivities);
router.get('/get_current_user', userService.getCurrentUser);

router.put('/update-profile', profileService.updateProfile);
router.put('/update-notifications', profileService.updateNotificationSettings);
router.put('/update-password', profileService.updatePassword);
router.post('/update-avatar', upload.single('avatar'), profileService.updateAvatar);
router.delete('/delete-account', profileService.deleteAccount);
router.put('/update-social-links', profileService.updateSocialLinks);

module.exports = router;
