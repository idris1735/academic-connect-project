const express = require("express");
const router = express.Router();
const eventService = require("../services/eventService");


// Get events for a research room
router.get("/room/:roomId", eventService.getRoomEvents);

// Create new event
router.post("/room/:roomId", eventService.createEvent);

// Update event
router.put("/:eventId", eventService.updateEvent);

// Delete event
router.delete("/:eventId", eventService.deleteEvent);

// Get event details
router.get("/:eventId", eventService.getEventDetails);

// Get user's events (events they're attending)
router.get("/user/events", eventService.getUserEvents);

module.exports = router;
