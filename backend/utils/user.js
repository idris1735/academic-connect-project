const e = require('express');
const { db } = require('../config/database');


exports.getUserNameByUid = async (uid) => {
    try {
      console.log(`Fetching user name for uid: ${uid}`);
  
      // Query the `users` collection to find the document with the matching UID
      const usersSnapshot = await db.collection('users').where('uid', '==', uid).get();
  
      // Check if any documents match
      if (usersSnapshot.empty) {
        console.log(`No user found with uid: ${uid}`);
        return 'Unknown User'; // Return a default value instead of null
      }
  
      // Extract the user's name (assuming one document per UID)
      const userDoc = usersSnapshot.docs[0]; // Get the first matching document
      const userData = userDoc.data();
  
      if (!userData || !userData.displayName) {
        console.log(`User found, but name is missing for uid: ${uid}`);
        return 'Unnamed User'; // Return a default value if name is missing
      }
  
      console.log(`Found user name: ${userData.name} for uid: ${uid}`);
      return userData.displayName;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Error: User Not Found'; // Return an error message instead of throwing
    }
  };
  
exports.getRecentActivity = async (uid) => {
  try {
    console.log(`Fetching recent activity for user: ${uid}`);
    
    // Get posts collection reference
    const postsRef = db.collection('posts');
    
    // Get all posts
    const postsSnapshot = await postsRef.where('uid', '==', uid).get();
    
    const activities = [];
    
    // For each post, get its content, comments, and likes
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

    // Sort all activities by timestamp (most recent first)
    const sortedActivities = activities.sort((a, b) => 
      (b.timestamp || 0) - (a.timestamp || 0)
    );

    // Get only the 10 most recent activities
    const recentActivities = sortedActivities.slice(0, 5);

    console.log(`Found ${recentActivities.length} recent activities for user: ${uid}`);
    return recentActivities;

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

// Helper function to format activity for display
exports.formatActivityForDisplay = (activity) => {
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
};
  
  