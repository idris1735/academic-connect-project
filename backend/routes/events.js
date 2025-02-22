const express = require("express");
const router = express.Router();
const eventService = require("../services/eventService");


// Get events for a research room
router.get("/room/:roomId", eventService.getRoomEvents); // done

// Create new event
router.post("/room/:roomId", eventService.createEvent); // done

// Update event
router.put("/:eventId", eventService.updateEvent); // done

// Delete event
router.delete("/:eventId", eventService.deleteEvent); // done   

// Get event details
router.get("/:eventId", eventService.getEventDetails); // done

// Get user's events (events they're attending)
router.get("/user/events", eventService.getUserEvents); // done

module.exports = router;
