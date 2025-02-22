const express = require('express');
const router = express.Router();
const invitationService = require('../services/invitationService');


// Send room invitation
router.post('/send/:roomId', invitationService.sendInvitation);  // done

// Get invitations for a user
router.get('/received', invitationService.getReceivedInvitations);  // done

// Accept/reject invitation
router.post('/respond/:invitationId', invitationService.respondToInvitation);  // done//    

// Get pending invitations for a room
router.get('/room/:roomId', invitationService.getRoomInvitations);  // done 

// Cancel invitation
router.delete('/:invitationId', invitationService.cancelInvitation);    // done

// Resend invitation
router.post('/resend/:invitationId', invitationService.resendInvitation);  // done

// Add this new route
router.delete('/delete/:invitationId', invitationService.deleteInvitation);  // done

module.exports = router;
