const e = require('express');
const { db } = require('../config/database');
const { Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getDocs, collection, where } = require("firebase/firestore");
const { query } = require('firebase/firestore');
const { getUserNameByUid } = require('../utils/user');
const { admin, storage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

exports.createPost = async (req, res) => {
  try {
    const { content, category } = req.body;
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
    };

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
  if (!uid) {
    try {
      // Fetch all posts from the 'posts' collection
      const postsSnapshot = await db.collection('posts')
      .where('uid', '==', req.user.uid)
      .get();
    
      // If there are no posts, return an empty list
      if (postsSnapshot.empty) {
        return res.status(200).json({ message: 'No posts found', posts: [] });
      }

      const posts = [];

      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();

        // Fetch post content
        const postContentSnapshot = await postDoc.ref.collection('postContent').get();
        const postContents = postContentSnapshot.docs.map((doc) => doc.data());
        
        // Fetch comments
        const commentsSnapshot = await postDoc.ref.collection('comments')
          .orderBy('timestamp', 'desc')
          .limit(10)
          .get();
        
        const comments = commentsSnapshot.docs.map(doc => ({
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
        }));

        content = postContents[0].content;
        const userName = await getUserNameByUid(postData.uid);
        
        const fullPost = {
          ...postData,
          content,
          comments,
          attachment: postData.attachment || null,
          category: postData.postCat,
          discussion: postData.discussion,
          userInfo: {
            author: userName,
          },
        };

        posts.push(fullPost);
      }

      return res.status(200).json({ message: 'Posts retrieved successfully', posts });

    } catch (error) {
      console.error('Error retrieving posts:', error);
      return res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
    }
  } else {
    // Fetch posts for a specific user
    
    
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
    }

    // Get the updated post document
    const updatedPostDoc = await postRef.get();
    const currentLikesCount = updatedPostDoc.data().likesCount;

    return res.status(200).json({ 
      message: likeDoc.exists ? 'Like removed' : 'Post liked',
      liked: !likeDoc.exists,
      likesCount: currentLikesCount
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

    // Prepare the response data
    const responseComment = {
      ...commentData,
      timestamp: new Date().toISOString() // Use current time for immediate display
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
