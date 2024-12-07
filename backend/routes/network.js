const express = require('express');
const router = express.Router();
const networkService = require('../services/networkService');


router.post('/send_connection_request', networkService.sendConnectionRequest);
router.post('/accept_connection_request', networkService.acceptConnectionRequest);
router.post('/reject_connection_request', networkService.rejectConnectionRequest);
router.post('/remove_connection', networkService.removeConnection);
router.get('/get_connections', networkService.getConnections);

module.exports = router;