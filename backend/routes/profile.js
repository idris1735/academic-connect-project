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

const upload_publication = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Only document files are allowed'), false);
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

router.put('/action-publication', profileService.actionPublication);
router.delete('/action-publication', profileService.actionPublication);
router.post('/add-publication', upload_publication.single('file'), profileService.addPublication);

router.get('/publications', profileService.getUserPublications);
router.post('/publications', profileService.getUserPublications);



module.exports = router;
