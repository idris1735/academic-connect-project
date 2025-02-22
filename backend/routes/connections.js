const express = require('express');
const router = express.Router();
const connectionService = require('../services/connectionService');

// Send connection request
router.post('/request/:userId', connectionService.connectWithUser);   // done

// Accept/Reject connection request
router.post('/respond', connectionService.respondToRequest);   // done

// Get connection status
router.get('/status/:userId', connectionService.getConnectionStatus);     //done

// Get pending requests
router.get('/pending', connectionService.getPendingRequests);   // done

// Get mutual connections
router.get('/mutual/:userId', connectionService.getMutualConnections);   // done

// Get connections
router.get('/connections', connectionService.getConnections);   // done

router.post('/remove_connection', connectionService.removeConnection);    //done

module.exports = router;
