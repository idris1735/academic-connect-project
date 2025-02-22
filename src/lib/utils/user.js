import { db } from '@/lib/firebase-admin';

export async function getUserNameByUid(uid) {
  try {
    console.log(`Fetching user name for uid: ${uid}`);
    const usersSnapshot = await db.collection('users').where('uid', '==', uid).get();

    if (usersSnapshot.empty) {
      console.log(`No user found with uid: ${uid}`);
      return 'Unknown User';
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    if (!userData || !userData.displayName) {
      console.log(`User found, but name is missing for uid: ${uid}`);
      return 'Unnamed User';
    }

    console.log(`Found user name: ${userData.displayName} for uid: ${uid}`);
    return userData.displayName;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Error: User Not Found';
  }
}

export async function getProfilePhotoURl(uid) {
  try {
    const userDoc = await db.collection('profiles').doc(uid).get();

    if (!userDoc.exists) {
      console.log(`No user found with uid: ${uid}`);
      return null;
    }

    const userData = userDoc.data();
    console.log(`Found user profile photo URL: ${userData.photoURL} for uid: ${uid}`);
    return userData.photoURL;
  } catch (error) {
    console.error('Error fetching user profile photo URL:', error);
    return null;
  }
}

export async function getRecentActivity(uid) {
  try {
    console.log(`Fetching recent activity for user: ${uid}`);
    const postsRef = db.collection('posts');
    const postsSnapshot = await postsRef.where('uid', '==', uid).get();
    const activities = [];

    for (const postDoc of postsSnapshot.docs) {
      const post = postDoc.data();
      
      // Get post content
      const postContentSnapshot = await postDoc.ref.collection('postContent').get();
      const postContent = postContentSnapshot.docs[0]?.data();
      
      if (postContent) {
        activities.push({
          id: post.id,
          type: 'post',
          content: postContent.content,
          timestamp: post.timeStamp?.toDate(),
          category: post.postCat
        });
      }

      // Get comments
      const commentsSnapshot = await postDoc.ref.collection('comments').get();
      const commentActivities = await Promise.all(commentsSnapshot.docs.map(async (commentDoc) => {
        const comment = commentDoc.data();
        const postContent = (await postDoc.ref.collection('postContent').get()).docs[0]?.data();
        return {
          id: comment.id,
          type: 'comment',
          content: comment.content,
          timestamp: comment.timestamp?.toDate(),
          postId: post.id,
          author: comment.author,
          postContent: postContent?.content
        };
      }));
      activities.push(...commentActivities);

      // Get likes
      const likesSnapshot = await postDoc.ref.collection('likes').get();
      const likeActivities = await Promise.all(likesSnapshot.docs.map(async (likeDoc) => {
        const like = likeDoc.data();
        const postContent = (await postDoc.ref.collection('postContent').get()).docs[0]?.data();
        return {
          id: likeDoc.id,
          type: 'like',
          timestamp: like.timestamp?.toDate(),
          postId: post.id,
          userId: like.userId,
          postContent: postContent?.content
        };
      }));
      activities.push(...likeActivities);
    }

    const sortedActivities = activities
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 5);

    console.log(`Found ${sortedActivities.length} recent activities for user: ${uid}`);
    return sortedActivities;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

export async function formatActivityForDisplay(activity) {
  try {
    switch (activity.type) {
      case 'post':
        return {
          ...activity,
          description: `Created a new post in ${activity.category}`,
          link: `/posts/${activity.id}`
        };
      
      case 'comment':
        return {
          ...activity,
          description: `Commented: "${activity.content.substring(0, 50)}${activity.content.length > 50 ? '...' : ''}"`,
          link: `/posts/${activity.postId}`
        };
      
      case 'like':
        return {
          ...activity,
          description: 'Liked a post',
          link: `/posts/${activity.postId}`
        };
      
      default:
        return {
          ...activity,
          description: 'Unknown activity',
          link: '#'
        };
    }
  } catch (error) {
    console.error('Error formatting activity:', error);
    return {
      ...activity,
      description: 'Error formatting activity',
      link: '#'
    };
  }
} 


export const getUserRoleInRoom = async (userId, roomRefId) => {
  // Fetch the user's profile
  const userProfileDoc = await db.collection('profiles').doc(userId).get();
  
  if (!userProfileDoc.exists) {
    // throw new Error('User profile not found');
    return 'member';

  }

  const userProfile = userProfileDoc.data();
  
  // Access the rooms collection in the user's profile
  const roomsCollection = userProfile.messageRooms?.researchRooms || []; // Assuming rooms is an array of room objects
  
  // Find the specific room document where roomId matches roomRefId
  const roomDoc = roomsCollection.find(room => room.room === roomRefId);
  

  // Return the role if the room document is found, otherwise return 'member'
  return roomDoc ? roomDoc.role : 'member';
};