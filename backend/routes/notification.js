const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

router.get('/get_notifications', notificationService.getNotifications);
router.post('/mark_as_read', notificationService.markAsRead);

module.exports = router;
