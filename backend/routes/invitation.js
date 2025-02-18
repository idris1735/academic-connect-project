const express = require('express');
const router = express.Router();
const invitationService = require('../services/invitationService');


// Send room invitation
router.post('/send/:roomId', invitationService.sendInvitation);

// Get invitations for a user
router.get('/received', invitationService.getReceivedInvitations);

// Accept/reject invitation
router.post('/respond/:invitationId', invitationService.respondToInvitation);

// Get pending invitations for a room
router.get('/room/:roomId', invitationService.getRoomInvitations);

// Cancel invitation
router.delete('/:invitationId', invitationService.cancelInvitation);

// Resend invitation
router.post('/resend/:invitationId', invitationService.resendInvitation);

// Add this new route
router.delete('/delete/:invitationId', invitationService.deleteInvitation);

module.exports = router;
