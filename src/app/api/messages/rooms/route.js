const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
const { createChannel, getChannel } = require('@/lib/chat');
const { getUserNameByUid } = require('@/lib/utils/user');
const { FieldValue } = require('firebase-admin/firestore');
import { auth } from '@/lib/auth';


export const runtime = 'nodejs';
// Helper function to get user role in room
async function getUserRoleInRoom(userId, roomRefId) {
  const userProfileDoc = await db.collection('profiles').doc(userId).get();
  
  if (!userProfileDoc.exists) {
    return 'member';
  }

  const userProfile = userProfileDoc.data();
  const roomsCollection = userProfile.messageRooms?.researchRooms || [];
  const roomDoc = roomsCollection.find(room => room.room === roomRefId);
  
  return roomDoc ? roomDoc.role : 'member';
}

// GET /api/messages/rooms
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort') || 'latest';

    let query;

    if (id) {
      query = db.collection('messageRooms').where('id', '==', id);
    } else {
      query = db.collection('messageRooms')
        .where('participants', 'array-contains', userId)
        .where('isActive', '==', true);

      if (type) {
        if (!['DM', 'GM', 'RR'].includes(type)) {
          return NextResponse.json({
            message: 'Invalid room type. Must be either "DM", "GM", or "RR"'
          }, { status: 400 });
        }
        query = query.where('roomType', '==', type);
      }
    }

    const roomsSnapshot = await query.get();

    if (roomsSnapshot.empty) {
      return NextResponse.json({
        message: type ? `No ${type} rooms found` : 'No rooms found',
        rooms: [],
        roomType: type || 'all'
      });
    }

    const rooms = await Promise.all(roomsSnapshot.docs.map(async (doc) => {
      const roomData = doc.data();

      const participantDetails = await Promise.all(
        roomData.participants.map(async (uid) => ({
          uid,
          name: await getUserNameByUid(uid),
          role: await getUserRoleInRoom(uid, doc.id)
        }))
      );

      let lastMessageData = null;
      if (roomData.lastMessage) {
        const lastMessageDoc = await doc.ref.collection('messages')
          .doc(roomData.lastMessage)
          .get();

        if (lastMessageDoc.exists) {
          lastMessageData = lastMessageDoc.data();
        }
      }

      let displayName = roomData.name;
      let active;
      if (roomData.roomType === 'DM') {
        const otherParticipant = participantDetails.find(p => p.uid !== userId);
        displayName = otherParticipant?.name || 'Unknown User';
        active = otherParticipant?.name ? true : false;
      }

      return {
        id: doc.id,
        type: roomData.roomType,
        name: displayName,
        participants: participantDetails,
        members: participantDetails,
        lastMessage: lastMessageData ? {
          content: lastMessageData.content,
          timestamp: lastMessageData.timestamp?.toDate().toISOString(),
          sender: await getUserNameByUid(lastMessageData.senderId)
        } : null,
        lastMessageTime: roomData.lastMessageTime?.toDate().toISOString(),
        unreadCount: 0,
        createdAt: roomData.createdAt?.toDate().toISOString(),
        createdBy: roomData.createdBy,
        admins: roomData.admins || [],
        settings: roomData.settings || {},
        postIds: roomData.postIds || [],
        avatar: roomData.avatar,
        description: roomData.description,
        resources: roomData.resources || [],
        schedule: roomData.schedule || [],
        inviteLink: roomData.inviteLink || ''
      };
    }));

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

    const response = {
      message: 'Rooms retrieved successfully',
      roomType: id ? sortedRooms[0].type : type || 'all',
      rooms: id ? sortedRooms[0] : {
        DM: sortedRooms.filter(room => room.type === 'DM'),
        GM: sortedRooms.filter(room => room.type === 'GM'),
        RR: sortedRooms.filter(room => room.type === 'RR')
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error getting user rooms:', error);
    return NextResponse.json({
      message: 'Failed to get user rooms',
      error: error.message
    }, { status: 500 });
  }
};

// POST /api/messages/rooms
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { roomType, participants, name, description, postId } = await req.json();
    const creatorId = session.user.id;

    if (!['DM', 'RR', 'GM'].includes(roomType)) {
      return NextResponse.json({ 
        message: 'Invalid room type. Must be either "DM", "RR", or "GM"' 
      }, { status: 400 });
    }

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json({ 
        message: 'Participants must be provided as an array' 
      }, { status: 400 });
    }

    if (!participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    switch (roomType) {
      case 'DM':
        if (participants.length !== 2) {
          return NextResponse.json({ 
            message: 'Direct messages must have exactly two participants' 
          }, { status: 400 });
        }

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
          const roomData = existingDM.data();
          let channel = await getChannel(existingDM.id);
          if (!channel) {
            channel = await createChannel(creatorId, participants, existingDM.id, roomType, name);
          }

          return NextResponse.json({ 
            message: 'Direct message room already exists between these users',
            room: {
              id: existingDM.id,
              ...roomData,
              channel: channel.id,
            }
          });
        }
        break;

      case 'GM':
        if (participants.length < 3) {
          return NextResponse.json({ 
            message: 'Group messages must have at least three participants' 
          }, { status: 400 });
        }
        if (!name) {
          return NextResponse.json({ 
            message: 'Group name is required for group messages' 
          }, { status: 400 });
        }
        break;

      case 'RR':
        if (!name) {
          return NextResponse.json({ 
            message: 'Room name is required for research rooms' 
          }, { status: 400 });
        }
    }

    const roomRef = db.collection('messageRooms').doc();
    const roomData = {
      id: roomRef.id,
      roomType,
      name: roomType === 'DM' ? null : name,
      description: description || null,
      createdBy: creatorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
      postIds: roomType === 'RR' ? (postId ? [postId] : []) : null,
      resources: roomType === 'RR' ? [] : null,
      schedule: roomType === 'RR' ? [] : null,
      members: roomType === 'RR' ? await Promise.all(participants.map(async (uid) => ({
        uid,
        role: uid === creatorId ? 'admin' : 'channel_member'
      }))) : null,
    };

    await roomRef.set(roomData);

    if (roomType === 'RR') {
      // Update the user's profile with the room reference
      for (const uid of participants) {
        if (uid === creatorId) continue; // Skip the creator
        const userProfileRef = db.collection('profiles').doc(uid);
        await userProfileRef.update({
          'messageRooms.researchRooms': FieldValue.arrayUnion({'room': roomRef.id, 'role':'channel_member' })
        });
      }
      const userProfileRef = db.collection('profiles').doc(creatorId);
      await userProfileRef.update({
        'messageRooms.researchRooms': FieldValue.arrayUnion({'room': roomRef.id, 'role': 'channel_moderator' })
       });
    }

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

    const channel = await createChannel(creatorId, participants, roomRef.id, roomType, roomData.name);

    const participantDetails = await Promise.all(
      participants.map(async (uid) => {
        const memberRole = roomType !== 'DM' 
        ? await getUserRoleInRoom(uid, roomRef.id) // Pass the roomRef.id to get the role
        : 'member'; // Default role fo
    
        return {
          uid,
          name: await getUserNameByUid(uid),
          role: memberRole, // Use the updated role logic
        };
      })
    );

    return NextResponse.json({
      message: 'Message room created successfully',
      room: {
        ...roomData,
        participants: participantDetails,
        createdAt: new Date().toISOString(),
        channel: channel.id,
      }
    });

  } catch (error) {
    console.error('Error creating message room:', error);
    return NextResponse.json({ 
      message: 'Failed to create message room', 
      error: error.message 
    }, { status: 500 });
  }
}; 