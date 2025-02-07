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

module.exports = router;
