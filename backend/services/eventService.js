const { db } = require('../config/database');
const { admin } = require('../config/firebase');
const { getUserNameByUid } = require('../utils/user');
const notificationService = require('./notificationService');

exports.getRoomEvents = async (req, res) => {
    try {
        const { roomId } = req.params;
        const eventsRef = db.collection('messageRooms').doc(roomId).collection('events');
        const eventsSnapshot = await eventsRef.orderBy('date', 'asc').get();

        const events = await Promise.all(eventsSnapshot.docs.map(async (doc) => {
            const eventData = doc.data();
            const creatorName = await getUserNameByUid(eventData.createdBy);
            
            return {
                id: doc.id,
                ...eventData,
                creatorName
            };
        }));

        return res.status(200).json({
            message: 'Events retrieved successfully',
            events
        });
    } catch (error) {
        console.error('Error retrieving events:', error);
        return res.status(500).json({
            message: 'Failed to retrieve events',
            error: error.message
        });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { title, description, date, time } = req.body;
        const userId = req.user.uid;

        if (!title || !date || !time) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        // Create event document
        const eventRef = db.collection('messageRooms').doc(roomId).collection('events').doc();
        const eventData = {
            id: eventRef.id,
            title,
            description,
            date: admin.firestore.Timestamp.fromDate(new Date(date)),
            time,
            createdBy: userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            attendees: [userId] // Creator automatically attends
        };

        await eventRef.set(eventData);

        // Get creator's name for response
        const creatorName = await getUserNameByUid(userId);

        return res.status(201).json({
            message: 'Event created successfully',
            event: {
                ...eventData,
                creatorName
            }
        });
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({
            message: 'Failed to create event',
            error: error.message
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, date, time } = req.body;
        const userId = req.user.uid;

        // Find the event
        const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
        
        if (eventRef.empty) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const eventDoc = eventRef.docs[0];
        const eventData = eventDoc.data();

        // Check if user has permission to update
        if (eventData.createdBy !== userId) {
            return res.status(403).json({
                message: 'Not authorized to update this event'
            });
        }

        // Update the event
        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(date && { date: admin.firestore.Timestamp.fromDate(new Date(date)) }),
            ...(time && { time }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await eventDoc.ref.update(updateData);

        return res.status(200).json({
            message: 'Event updated successfully',
            event: {
                ...eventData,
                ...updateData
            }
        });
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(500).json({
            message: 'Failed to update event',
            error: error.message
        });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.uid;

        // Find the event
        const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
        
        if (eventRef.empty) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const eventDoc = eventRef.docs[0];
        const eventData = eventDoc.data();

        // Check if user has permission to delete
        if (eventData.createdBy !== userId) {
            return res.status(403).json({
                message: 'Not authorized to delete this event'
            });
        }

        // Delete the event
        await eventDoc.ref.delete();

        return res.status(200).json({
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).json({
            message: 'Failed to delete event',
            error: error.message
        });
    }
};

exports.getEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find the event
        const eventRef = await db.collectionGroup('events').where('id', '==', eventId).get();
        
        if (eventRef.empty) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        const eventDoc = eventRef.docs[0];
        const eventData = eventDoc.data();

        // Get creator's name
        const creatorName = await getUserNameByUid(eventData.createdBy);

        // Get attendees' names
        const attendeeNames = await Promise.all(
            eventData.attendees.map(uid => getUserNameByUid(uid))
        );

        return res.status(200).json({
            message: 'Event details retrieved successfully',
            event: {
                ...eventData,
                creatorName,
                attendeeNames
            }
        });
    } catch (error) {
        console.error('Error retrieving event details:', error);
        return res.status(500).json({
            message: 'Failed to retrieve event details',
            error: error.message
        });
    }
};

exports.getUserEvents = async (req, res) => {
    try {
        const userId = req.user.uid;
        
        // Get all events where user is an attendee
        const eventsRef = await db.collectionGroup('events')
            .where('attendees', 'array-contains', userId)
            .orderBy('date', 'asc')
            .get();

        const events = await Promise.all(eventsRef.docs.map(async (doc) => {
            const eventData = doc.data();
            const creatorName = await getUserNameByUid(eventData.createdBy);
            eventData.date = eventData.date.toDate().toISOString() || null;
            
            return {
                ...eventData,
                creatorName
            };
        }));

        return res.status(200).json({
            message: 'User events retrieved successfully',
            events
        });
    } catch (error) {
        console.error('Error retrieving user events:', error);
        return res.status(500).json({
            message: 'Failed to retrieve user events',
            error: error.message
        });
    }
};
