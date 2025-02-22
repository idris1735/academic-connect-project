const express = require("express");
const router = express.Router();
const messageService = require("../services/messageService");

// Get user's message rooms
router.get("/rooms", messageService.getUserRooms);



// Create a new message room
router.post("/rooms", messageService.createMessageRoom);

// Add user to a discussion room message room
router.post("/rooms/join-room", messageService.joinRoom);

// Add a post to an existing research room
router.post("/rooms/add-post", messageService.addPostToRoom);

// Update room details
router.put("/rooms/:roomId", messageService.updateRoomDetails);

// Update room settings
router.put("/rooms/:roomId/settings", messageService.updateRoomSettings);

// Update member roles
router.put("/rooms/:roomId/members/:memberId/role", messageService.updateMemberRole);

module.exports = router;
