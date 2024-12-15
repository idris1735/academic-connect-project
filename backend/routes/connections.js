const express = require('express');
const router = express.Router();
const connectionService = require('../services/connectionService');

router.post('/connect/:userId', connectionService.connectWithUser);
router.get('/connection-status/:userId', connectionService.getConnectionStatus);

module.exports = router;
