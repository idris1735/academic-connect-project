const express = require('express');
const router = express.Router();
const networkService = require('../services/networkService');


// router.post('/send_connection_request', networkService.sendConnectionRequest);
// router.post('/accept_connection_request', networkService.acceptConnectionRequest);
// router.post('/reject_connection_request', networkService.rejectConnectionRequest);

router.get('/get_network_info', networkService.getNetworkInfo);

module.exports = router;