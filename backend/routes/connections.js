const express = require('express');
const router = express.Router();
const connectionService = require('../services/connectionService');

// Send connection request
router.post('/request/:userId', connectionService.connectWithUser);

// Accept/Reject connection request
router.post('/respond', connectionService.respondToRequest);

// Get connection status
router.get('/status/:userId', connectionService.getConnectionStatus);

// Get pending requests
router.get('/pending', connectionService.getPendingRequests);

// Get mutual connections
router.get('/mutual/:userId', connectionService.getMutualConnections);

// Get connections
router.get('/connections', connectionService.getConnections);

router.post('/remove_connection', connectionService.removeConnection);

module.exports = router;
