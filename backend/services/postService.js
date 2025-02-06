const e = require('express');
const { db } = require('../config/database');
const { Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getDocs, collection, where } = require("firebase/firestore");
const { query } = require('firebase/firestore');
const { getUserNameByUid, getProfilePhotoURl } = require('../utils/user');
const { admin, storage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const notificationService = require('../services/notificationService');
const messageService = require('../services/messageService')
const fs = require('fs/promises');
const path = require('path');
const exp = require('constants');

const clients = new Set();

exports.createPost = async (req, res) => {
  try {
   
    const user = req.user;
    let attachmentUrl = null;
    const storeInCloud = false;

    
    const { content, category, discussionName } = req.body;
    const attachment = req.file;
  
    let attachment_info;

   
    

    // Handle file upload if there's an attachment
    if (req.file && storeInCloud) {
      const bucket = storage.bucket();
      const fileExtension = attachment.originalname.split('.').pop();
      const fileName = `posts/${uuidv4()}.${fileExtension}`;
      
      // Create a new blob in the bucket
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: attachment.mimetype,
        },
      });

      // Return a promise to handle the upload
      await new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        });

        blobStream.on('finish', async () => {
          // Make the file publicly accessible
          await blob.makePublic();
          
          // Get the public URL
          attachmentUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve();
        });

        blobStream.end(req.file.buffer);
      });
    }

    if (attachment) {

      const buffer = attachment.buffer;
      const fileExtension = path.extname(attachment.originalname);
      let uploadPath;
      let fileType;
    
      if (attachment.mimetype.startsWith('image/')) {
        fileType = 'images';
      } else if (attachment.mimetype.startsWith('video/')) {
        fileType = 'videos';
      } else if (attachment.mimetype.startsWith('application/')) {
        fileType = 'applications';
      } else {
        throw new Error('Invalid file type');
      }
    
      uploadPath = path.join(process.cwd(), 'public', 'uploads', fileType, `${uuidv4()}${fileExtension}`);
    
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, buffer);
      //  // Write the file to the local storage
      // fs.writeFileSync(uploadPath, attachment.buffer);
      // attachmentUrl = uploadPath; // Store the local path or URL as needed
      attachmentUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);
      attachment_info = {
        name: attachment.originalname,
        fileType,
        url: attachmentUrl,
      }
    

    }

    // Create the post document
    const postRef = db.collection('posts').doc();
    const postID = postRef.id;
    
    

    const postData = {
      id: postID,
      uid: user.uid,
      timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      postCat: category,
      likesCount: 0,
      commentsCount: 0,
      attachment: attachment ? attachment_info : null,
      discussion: null,
    };

    await postRef.set(postData);

    // If a discussion name is provided, create a discussion object
    if (discussionName && discussionName.trim()) {
     //Create a discussion, that is a research room
      let discussionResponse = await messageService.createResearchRoomForPost(user.uid, discussionName, postID);

      if (discussionResponse.success) {
        // Link the discussion to the post
        console.log('Created discussion room:', discussionResponse.room);
        postData.discussion = {
          id: discussionResponse.room.id,
          name: discussionResponse.room.name,
        }
      } else {
        console.error('Failed to create discussion:', discussionResponse.error);
        // Handle the error as needed
        postRef.delete();
        return res.status(500).json({ 
          message: 'Failed to create discussion for post', 
          error: discussionResponse.error 
        });
      }
    }


    const PostContentRef = postRef.collection('postContent').doc();
    const postContentID = PostContentRef.id;
    await PostContentRef.set({
        id: postContentID,//-
        uid: user.uid,//-
        content: content,//-
        updatedAt: FieldValue.serverTimestamp(),//-
      });//-


    // Create a research room with the discussion ID
    
    
    const name = await getUserNameByUid(user.uid);
    const fullPost = {
      ...postData,
      content,
      userInfo: {
        author: name,
      }
    };

    // Add this to createPost function after post creation
    const eventData = {
      type: 'NEW_POST',
      post: {
        ...fullPost,
        uid: user.uid,
        timeStamp: new Date().toISOString(),
        userInfo: {
          ...fullPost.userInfo,
          connectionType: 'connection'
        }
      }
    };

    clients.forEach(client => {
      if (client.userId !== user.uid) {
        client.res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    });

    return res.status(200).json({ 
      message: 'Post created successfully', 
      post: fullPost 
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ 
      message: 'Failed to create post', 
      error: error.message 
    });
  }
};

exports.getPosts = async (req, res) => {
  const currentUserId = req.user.uid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startAfter = (page - 1) * limit;

  try {
    // Get user's connections first
    const userDoc = await db.collection('profiles').doc(currentUserId).get();
    const userData = userDoc.data();
    const connections = userData?.connections?.connected || [];
    
    // Include current user in the authors list
    const authorIds = [currentUserId, ...connections];

    console.log('Fetching posts for users:', authorIds);

    // Modified query to get posts from user and their connections
    let query = db.collection('posts')
      .where('uid', 'in', authorIds)
      .orderBy('timeStamp', 'desc'); // Sort by newest first

    // Get the paginated data
    const postsSnapshot = await query
      .limit(limit)
      .offset(startAfter)
      .get();

    if (postsSnapshot.empty) {
      return res.status(200).json({ 
        message: 'No posts found', 
        posts: [],
        hasMore: false
      });
    }

    // Use a Map to ensure unique posts
    const postsMap = new Map();
    
    // Process posts in parallel for better performance
    await Promise.all(postsSnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      
      // Skip if we already have this post
      if (postsMap.has(doc.id)) return;
      
      // Get post content
      const contentDoc = await doc.ref.collection('postContent')
        .limit(1)
        .get();
      
      // Get comments
      const commentsSnapshot = await doc.ref.collection('comments')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();
      
      const comments = await Promise.all(commentsSnapshot.docs.map(async (doc) => ({
        ...doc.data(),
        photoURL: await getProfilePhotoURl(doc.data().userId),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      })));

      const content = contentDoc.docs[0]?.data()?.content;

      // Get author details
      const authorName = await getUserNameByUid(postData.uid);
      const authorPhotoURL = await getProfilePhotoURl(postData.uid);
      
      // Determine connection type
      const connectionType = postData.uid === currentUserId 
        ? 'self' 
        : 'connection';

      postsMap.set(doc.id, {
        id: doc.id,
        uid: postData.uid,
        content: content,
        timeStamp: postData.timeStamp?.toDate().toISOString(),
        category: postData.postCat,
        likesCount: postData.likesCount || 0,
        commentsCount: postData.commentsCount || 0,
        comments: comments,
        discussion: postData.discussion || null, 
        attachment: postData.attachment || null,
        userInfo: {
          author: authorName,
          connectionType: connectionType
        },
        photoURL: authorPhotoURL,
      });
    }));

    // Convert map to array and sort by timestamp
    const posts = Array.from(postsMap.values())
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

    return res.status(200).json({
      message: 'Posts retrieved successfully',
      posts,
      hasMore: posts.length === limit,
      currentPage: page
    });

  } catch (error) {
    console.error('Error retrieving posts:', error);
    return res.status(500).json({ 
      message: 'Failed to retrieve posts', 
      error: error.message 
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.uid;

    // Get reference to the post
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get post content first
    const contentDoc = await postRef.collection('postContent')
      .limit(1)
      .get();

    // Check if user has already liked the post
    const likeRef = postRef.collection('likes').doc(userId);
    const likeDoc = await likeRef.get();

    let newLikeCount;
    if (likeDoc.exists) {
      // User already liked the post, remove the like
      await likeRef.delete();
      await postRef.update({
        likesCount: FieldValue.increment(-1)
      });
      newLikeCount = (postDoc.data().likesCount || 1) - 1;

      // Delete the notification
      const notificationsRef = db.collection('notifications')
        .doc(postDoc.data().uid)
        .collection('user_notifications')
        .where('type', '==', 'POST_LIKE')
        .where('data.postId', '==', postId)
        .where('data.senderId', '==', userId);

      const notificationDocs = await notificationsRef.get();
      
      // Delete all matching notifications in a batch
      const batch = db.batch();
      notificationDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

    } else {
      // Add new like
      await likeRef.set({
        userId,
        timestamp: FieldValue.serverTimestamp()
      });
      await postRef.update({
        likesCount: FieldValue.increment(1)
      });
      newLikeCount = (postDoc.data().likesCount || 0) + 1;

      // Create notification for post owner
      if (postDoc.data().uid === userId) {    // Change this to postDoc.data().uid !== userId
        await notificationService.createNotification(postDoc.data().uid, 'POST_LIKE', {
          senderId: userId,
          senderName: await getUserNameByUid(userId),
          postId: postId,
          postContent: contentDoc.docs[0]?.data()?.content || '',
          message: 'liked your post',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    return res.status(200).json({ 
      message: likeDoc.exists ? 'Like removed' : 'Post liked',
      liked: !likeDoc.exists,
      likesCount: newLikeCount
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return res.status(500).json({ message: 'Failed to like post', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body; // parentId for replies
    const userId = req.user.uid;

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create new comment
    const commentRef = postRef.collection('comments').doc();
    const commentId = commentRef.id;
    
    const userName = await getUserNameByUid(userId);

    const commentData = {
      id: commentId,
      content,
      userId,
      author: userName,
      parentId: parentId || null, // null for top-level comments
      likes: 0,
      replies: [], // Array of reply IDs
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    await commentRef.set(commentData);

    // If this is a reply, update parent comment's replies array
    if (parentId) {
      const parentCommentRef = postRef.collection('comments').doc(parentId);
      await parentCommentRef.update({
        replies: admin.firestore.FieldValue.arrayUnion(commentId)
      });
    }

    // Update comment count
    await postRef.update({
      commentsCount: admin.firestore.FieldValue.increment(1)
    });

    // Create notification
    if (postDoc.data().uid !== userId) {
      await notificationService.createNotification(postDoc.data().uid, 'POST_COMMENT', {
        senderId: userId,
        senderName: userName,
        postId: postId,
        commentId: commentId,
        commentContent: content,
        message: parentId ? 'replied to a comment on your post' : 'commented on your post',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return res.status(200).json({
      message: 'Comment added successfully',
      comment: {
        ...commentData,
        photoURL: await getProfilePhotoURl(userId),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

// Add like comment endpoint
exports.likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.uid;

    const postRef = db.collection('posts').doc(postId);
    const commentRef = postRef.collection('comments').doc(commentId);
    
    const [postDoc, commentDoc] = await Promise.all([
      postRef.get(),
      commentRef.get()
    ]);

    if (!postDoc.exists || !commentDoc.exists) {
      return res.status(404).json({ message: 'Post or comment not found' });
    }

    const likeRef = commentRef.collection('likes').doc(userId);
    const likeDoc = await likeRef.get();

    if (likeDoc.exists) {
      // Unlike
      await likeRef.delete();
      await commentRef.update({
        likes: admin.firestore.FieldValue.increment(-1)
      });
    } else {
      // Like
      await likeRef.set({
        userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      await commentRef.update({
        likes: admin.firestore.FieldValue.increment(1)
      });

      // Create notification for comment owner
      if (commentDoc.data().userId !== userId) {
        await notificationService.createNotification(commentDoc.data().userId, 'COMMENT_LIKE', {
          senderId: userId,
          senderName: await getUserNameByUid(userId),
          postId: postId,
          commentId: commentId,
          message: 'liked your comment',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    return res.status(200).json({
      message: likeDoc.exists ? 'Comment unliked' : 'Comment liked',
      likes: (commentDoc.data().likes || 0) + (likeDoc.exists ? -1 : 1)
    });
  } catch (error) {
    console.error('Error liking comment:', error);
    return res.status(500).json({ message: 'Failed to like comment', error: error.message });
  }
};


exports.getPostsByUid = async (req, res) => {
  const uid = req.params.uid || req.user.uid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startAfter = (page - 1) * limit;

  try {
    // Base query
    let query = db.collection('posts').where('uid', '==', uid);


    // Get the paginated data
    const postsSnapshot = await query
      .limit(limit)
      .offset(startAfter)
      .get();

    if (postsSnapshot.empty) {
      return res.status(200).json({ 
        message: 'No posts found', 
        posts: [],
        hasMore: false
      });
    }

    // Use a Map to ensure unique posts
    const postsMap = new Map();
    
    // Process posts in parallel for better performance
    await Promise.all(postsSnapshot.docs.map(async (doc) => {
      const postData = doc.data();
      
      // Skip if we already have this post
      if (postsMap.has(doc.id)) return;
      
      // Get post content
      const contentDoc = await doc.ref.collection('postContent')
        .limit(1)
        .get();
      
      // Get comments
      const commentsSnapshot = await doc.ref.collection('comments')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();
      
      const comments = await Promise.all(commentsSnapshot.docs.map(async (doc) => ({
        ...doc.data(),
        photoURL: await getProfilePhotoURl(doc.data().userId),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      })));

      const content = contentDoc.docs[0]?.data()?.content;

      postsMap.set(doc.id, {
        id: doc.id,
        uid: postData.uid,
        content: content,
        timeStamp: postData.timeStamp?.toDate().toISOString(),
        category: postData.postCat,
        likesCount: postData.likesCount || 0,
        commentsCount: postData.commentsCount || 0,
        comments: comments,
        discussion: postData.discussion || null, 
        attachment: postData.attachment || null,
        userInfo: {
          author: await getUserNameByUid(uid),
        },
        // Ad the photoURL
        photoURL: await getProfilePhotoURl(uid),
      });
    }));

    // Convert map to array
    const posts = Array.from(postsMap.values());

    return res.status(200).json({
      message: 'Posts retrieved successfully',
      posts,
      hasMore: posts.length === limit,
      currentPage: page
    });

  } catch (error) {
    console.error('Error retrieving posts:', error);
    return res.status(500).json({ 
      message: 'Failed to retrieve posts', 
      error: error.message 
    });
  }
};

exports.subscribeToPostEvents = (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    userId: req.user.uid,
    res
  };
  clients.add(newClient);

  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  req.on('close', () => {
    clients.delete(newClient);
    clearInterval(keepAlive);
  });
};

