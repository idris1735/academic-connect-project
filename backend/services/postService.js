const e = require('express');
const { db } = require('../config/database');
const { Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getDocs, collection, where } = require("firebase/firestore");
const { query } = require('firebase/firestore');
const { getUserNameByUid } = require('../utils/user');
const { admin, storage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const notificationService = require('../services/notificationService');

exports.createPost = async (req, res) => {
  try {
    const { content, category, discussionName } = req.body;
    const user = req.user;
    let attachmentUrl = null;

    // Handle file upload if there's an attachment
    if (req.file) {
      const bucket = storage.bucket();
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `posts/${uuidv4()}.${fileExtension}`;
      
      // Create a new blob in the bucket
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
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
      attachment: attachmentUrl,
      discussion: null,
    };

    // If a discussion name is provided, create a discussion object
    if (discussionName && discussionName.trim()) {
      const discussionRef = db.collection('discussions').doc();
      const discussionID = discussionRef.id;

      // Create the discussion document
      await discussionRef.set({
        id: discussionID,
        name: discussionName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Link the discussion to the post
      postData.discussion = {
        id: discussionID,
        name: discussionName,
      };
    }

    await postRef.set(postData);

    const PostContentRef = postRef.collection('postContent').doc();
    const postContentID = PostContentRef.id;
    await PostContentRef.set({
      id: postContentID,
      uid: user.uid,
      content: content,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    const name = await getUserNameByUid(user.uid);
    const fullPost = {
      ...postData,
      content,
      userInfo: {
        author: name,
      }
    };

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
  const uid = req.params.uid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startAfter = (page - 1) * limit;

  try {
    // Base query
    let query = db.collection('posts');

    // Add user filter
    if (uid) {
      query = query.where('uid', '==', uid);
    } else {
      query = query.where('uid', '==', req.user.uid);
    }

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
      
      const comments = commentsSnapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString()
      }));

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
          author: await getUserNameByUid(postData.uid),
        }
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
    const { content } = req.body;
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

    // Create new comment
    const commentRef = postRef.collection('comments').doc();
    const commentId = commentRef.id;
    
    // Get user name for the comment
    const userName = await getUserNameByUid(userId);

    const commentData = {
      id: commentId,
      content,
      userId,
      author: userName,
      timestamp: FieldValue.serverTimestamp()
    };

    // Save the comment
    await commentRef.set(commentData);

    // Update comment count
    await postRef.update({
      commentsCount: FieldValue.increment(1)
    });

    // Create notification for post owner
    if (postDoc.data().uid === userId) {   // Change this to postDoc.data().uid !== userId
      await notificationService.createNotification(postDoc.data().uid, 'POST_COMMENT', {
        senderId: userId,
        senderName: await getUserNameByUid(userId),
        postId: postId,
        commentId: commentId,
        commentContent: content,
        postContent: contentDoc.docs[0]?.data()?.content || '',
        message: 'commented on your post',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Prepare the response data with the current timestamp
    const responseComment = {
      ...commentData,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({ 
      message: 'Comment added successfully',
      comment: responseComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};
