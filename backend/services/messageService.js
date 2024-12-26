const { db } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');
const { getUserNameByUid } = require('../utils/user');

exports.createMessageRoom = async (req, res) => {
  try {
    const { roomType, participants, name, description, postId } = req.body;
    const creatorId = req.user.uid;

    // Validate room type
    if (!['DM', 'RR', 'GM'].includes(roomType)) {
      return res.status(400).json({ 
        message: 'Invalid room type. Must be either "DM", "RR", or "GM"' 
      });
    }

    // Validate participants
    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({ 
        message: 'Participants must be provided as an array' 
      });
    }

    // Add creator to participants if not already included
    if (!participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    // Validate based on room type
    switch (roomType) {
      case 'DM':
        if (participants.length !== 2) {
          return res.status(400).json({ 
            message: 'Direct messages must have exactly two participants' 
          });
        }

        // Check if DM already exists between these users
        const existingDMQuery = await db.collection('messageRooms')
          .where('roomType', '==', 'DM')
          .where('participants', 'array-contains', creatorId)
          .get();

        const existingDM = existingDMQuery.docs.find(doc => {
          const roomData = doc.data();
          return roomData.participants.includes(participants[0]) && 
                 roomData.participants.includes(participants[1]);
        });

        if (existingDM) {
          const roomDat = existingDM.data()
          return res.status(200).json({ 
            message: 'Direct message room already exists between these users',
            room : {
              id: existingDM.id,
              ...roomDat
            }
          });
        }
        break;

      case 'GM':
        if (participants.length < 3) {
          return res.status(400).json({ 
            message: 'Group messages must have at least three participants' 
          });
        }
        if (!name) {
          return res.status(400).json({ 
            message: 'Group name is required for group messages' 
          });
        }
        break;

      case 'RR':
        if (!name) {
          return res.status(400).json({ 
            message: 'Room name is required for research rooms' 
          });
        }
        break;
    }

    // Create message room
    const roomRef = db.collection('messageRooms').doc();
    const roomData = {
      id: roomRef.id,
      roomType,
      name: roomType === 'DM' ? null : name,
      description: description || null,
      createdBy: creatorId,
      createdAt: FieldValue.serverTimestamp(),
      participants,
      lastMessage: null,
      lastMessageTime: null,
      isActive: true,
      admins: roomType !== 'DM' ? [creatorId] : null,
      avatar: 'https://picsum.photos/seed/sarah/200',
      settings: {
        canParticipantsAdd: roomType === 'RR',
        canParticipantsRemove: false,
        isPublic: roomType === 'RR'
      },
      // Add postIds array for RR type
      postIds: roomType === 'RR' ? (postId ? [postId] : []) : null
    };

    await roomRef.set(roomData);

    // If postId is provided for RR, update the post with the room reference
    if (roomType === 'RR' && postId) {
      const postRef = db.collection('posts').doc(postId);
      await postRef.update({
        discussion: {
          id: roomRef.id,
          type: 'RR'
        }
      });
    }

    // Get participant details for response
    const participantDetails = await Promise.all(
      participants.map(async (uid) => ({
        uid,
        name: await getUserNameByUid(uid),
        role: roomType !== 'DM' ? (uid === creatorId ? 'admin' : 'member') : 'member'
      }))
    );

    return res.status(201).json({
      message: 'Message room created successfully',
      room: {
        ...roomData,
        participants: participantDetails,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error creating message room:', error);
    return res.status(500).json({ 
      message: 'Failed to create message room', 
      error: error.message 
    });
  }
};

// Add method to link additional posts to an existing RR
exports.addPostToRoom = async (req, res) => {
  try {
    const { roomId, postId } = req.body;
    const userId = req.user.uid;

    // Get room data
    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const roomData = roomDoc.data();

    // Validate room type and permissions
    if (roomData.roomType !== 'RR') {
      return res.status(400).json({ message: 'Only research rooms can be linked to posts' });
    }

    if (!roomData.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to modify this room' });
    }

    // Update room with new postId
    await roomRef.update({
      postIds: FieldValue.arrayUnion(postId)
    });

    // Update post with room reference
    const postRef = db.collection('posts').doc(postId);
    await postRef.update({
      discussion: {
        id: roomId,
        type: 'RR'
      }
    });

    return res.status(200).json({
      message: 'Post successfully linked to research room',
      roomId,
      postId
    });

  } catch (error) {
    console.error('Error adding post to room:', error);
    return res.status(500).json({ 
      message: 'Failed to add post to room', 
      error: error.message 
    });
  }
};
exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id, type, sort = 'latest' } = req.query;
    let query;

   

    if (id) {
      query = db.collection('messageRooms').where('id', '==', id )
      // const roomDoc = query.get()
      // const roomData = await roomDoc.data()
      // query = query.where('id', '==', id)
    } else {
       // Base query - get rooms where user is a participant
      query = db.collection('messageRooms')
      .where('participants', 'array-contains', userId)
      .where('isActive', '==', true);

      // Add type filter only if a valid type is specified
      if (type)  {
        if (!['DM', 'GM', 'RR'].includes(type)) {
          return res.status(400).json({
            message: 'Invalid room type. Must be either "DM", "GM", or "RR"'
          });
        }
      query = query.where('roomType', '==', type);
      }

    }
    
    const roomsSnapshot = await query.get();

    if (roomsSnapshot.empty) {
      return res.status(200).json({
        message: type ? `No ${type} rooms found` : 'No rooms found',
        rooms: [],
        roomType: type || 'all'
      });
    }

    // Get all rooms data with participant details
    const rooms = await Promise.all(roomsSnapshot.docs.map(async (doc) => {
      const roomData = doc.data();

      // Get participant details
      const participantDetails = await Promise.all(
        roomData.participants.map(async (uid) => ({
          uid,
          name: await getUserNameByUid(uid),
          role: roomData.admins?.includes(uid) ? 'admin' : 'member'
        }))
      );

      // Get last message if it exists
      let lastMessageData = null;
      if (roomData.lastMessage) {
        const lastMessageDoc = await db.collection('messageRooms')
          .doc(doc.id)
          .collection('messages')
          .doc(roomData.lastMessage)
          .get();

        if (lastMessageDoc.exists) {
          lastMessageData = lastMessageDoc.data();
        }
      }

      // For DMs, set the room name as the other participant's name
      let displayName = roomData.name;
      if (roomData.roomType === 'DM') {
        const otherParticipant = participantDetails.find(p => p.uid !== userId);
        displayName = otherParticipant?.name || 'Unknown User';
      }

      return {
        id: doc.id,
        type: roomData.roomType,
        name: displayName,
        participants: participantDetails,
        lastMessage: lastMessageData ? {
          content: lastMessageData.content,
          timestamp: lastMessageData.timestamp?.toDate().toISOString(),
          sender: await getUserNameByUid(lastMessageData.senderId)
        } : null,
        lastMessageTime: roomData.lastMessageTime?.toDate().toISOString(),
        unreadCount: 0, // TODO: Implement unread count
        createdAt: roomData.createdAt?.toDate().toISOString(),
        createdBy: roomData.createdBy,
        admins: roomData.admins || [],
        settings: roomData.settings || {},
        postIds: roomData.postIds || [],
        avatar: roomData.avatar,
        description: roomData.description
      };
    }));

    // Sort rooms based on the sort parameter
    const sortedRooms = rooms.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'latest':
        default:
          const aTime = a.lastMessageTime || a.createdAt;
          const bTime = b.lastMessageTime || b.createdAt;
          return new Date(bTime) - new Date(aTime);
      }
    });

    // Group rooms by type if no specific type was requested
    const response = {
      message: 'Rooms retrieved successfully',
      roomType: id ? sortedRooms[0].type : 'all',
      rooms: id ? sortedRooms[0] : {
        DM: sortedRooms.filter(room => room.type === 'DM'),
        GM: sortedRooms.filter(room => room.type === 'GM'),
        RR: sortedRooms.filter(room => room.type === 'RR')
      }
    };

    console.log(response)
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error getting user rooms:', error);
    return res.status(500).json({
      message: 'Failed to get user rooms',
      error: error.message
    });
  }
};

exports.createResearchRoomForPost = async (creatorId, name, postId, description) => {
  try {
    // Validate room name
    if (!name) {
      return { success: false, error: 'Room name is required for research rooms' };
    }

    // Create message room
    const roomRef = db.collection('messageRooms').doc();
    const roomData = {
      id: roomRef.id,
      roomType: 'RR',
      name,
      description: description || null,
      createdBy: creatorId,
      createdAt: FieldValue.serverTimestamp(),
      participants: [creatorId],
      lastMessage: null,
      lastMessageTime: null,
      isActive: true,
      admins: [creatorId],
      avatar: 'https://picsum.photos/seed/sarah/200',
      settings: {
        canParticipantsAdd: true,
        canParticipantsRemove: false,
        isPublic: true
      },
      postIds: postId ? [postId] : []
    };

    await roomRef.set(roomData);

    // Update the post with the room reference
    if (postId) {
      const postRef = db.collection('posts').doc(postId);
      await postRef.update({
        discussion: {
          id: roomRef.id,
          type: 'RR'
        }
      });
    }

    
    // Update user's profile to include the new discussion room
     const profileRef = db.collection('profiles').doc(creatorId);

     await profileRef.update({
       'messageRooms.researchRooms': FieldValue.arrayUnion(roomRef.id)
      });

    return {
      success: true,
      room: {
        ...roomData,
      }
    };

  } catch (error) {
    console.error('Error creating research room for post:', error);
    await roomRef.delete();
    await profileRef.update({
     'messageRooms.researchRooms': FieldValue.arrayRemove(roomRef.id)
    });
    return {
      success: false,
      error: 'Failed to create research room'
    };
   
  }
};

exports.joinRoom = async (req, res) => {
  try {
    // Get the room reference
    const roomId = req.body.roomId;
    const userId = req.body.uid || req.user.uid; 

    // Get the room document from Firestore
    const roomRef = db.collection('messageRooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return { success: false, error: 'Room not found' };
    }

    const roomData = roomDoc.data();

    // Check if the user is already a participant
    if (roomData.participants.includes(userId)) {
      return res.status(200).json({'message': 'User is already a participant' });
    }

    // Add the user to the participants
    await roomRef.update({
      participants: FieldValue.arrayUnion(userId),
    });

    // Update user's profile to include the new discussion room
    const profileRef = db.collection('profiles').doc(userId);

    await profileRef.update({
      'messageRooms.researchRooms': FieldValue.arrayUnion(roomId)
  });
  

  return res.status(200).json({'message': 'User has been added to the discussion room' });
  } catch (error) {
    console.error('Error joining discussion:', error);
    return { success: false, error: 'Failed to join discussion' };
  }
};

