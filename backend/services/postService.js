const e = require('express');
const db = require('../config/database');
const { Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getDocs, collection, where } = require("firebase/firestore");
const { query } = require('firebase/firestore');
const { getUserNameByUid } = require('../utils/user');

exports.createPost = async (req, res) => {
  console.log(req.body)
  const {content, attachment, category} = req.body;
  user = req.user;
  console.log('User:', user);
  // console.log('Post:', content, attachment, category);

  // TODO: If there's an mage, save to storgage and get the URL
  if (attachment == null){
    try{
      const postRef = db.collection('posts').doc();
      const postID = postRef.id;
      
      postData = {
        id: postID,
        uid: user.uid,
        timeStamp: FieldValue.serverTimestamp(),
        postCat: category,
        likesCount: 0,
        commentsCount: 0,
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
      
      const name = await getUserNameByUid(user.uid)
      const fullPost = {
        ...postData,
        content,
        attachment,
        userInfo: {
          author: name,
          // TODO ; fill with other necessary user info
        }
      };
      console.log(fullPost)
      return res.status(200).json({ message: 'Post created successfully', post: fullPost });

    } catch (error) {
      console.error('Error during image upload:', error);
      res.status(500).json({ message: 'Post creation failed, please, try again', error: error.message });
    }
  }

  else{ 
    console.log('Image:', attachment);

  //   try {

  //     // Create a Post document
  //     const postRef = db.collection('Post').doc();
  //     // const postRef = db.collection('posts').doc();
  //     await postRef.set({
  //       postID: postRef.id,
  //       uid: user.uid,
  //       imgURL: image,
  //       timeStamp: FieldValue.serverTimestamp(),
  //       postCat: category,
  //     });

  //     const post = postRef.collection('post').doc();
  //     await post.set({
  //       postID: post.id,
  //       uid: user.uid,
  //       content: content,
  //       timeStamp: FieldValue.serverTimestamp(),

  //       // TODO: Add image URL and other important fields
  //     });

  //     const comment = postRef.collection('comment').doc();
      
  //     const like = postRef.collection('like').doc();

  //     //TODO add media collection once storage is implemented

  //     return res.status(200).json({ message: 'Post created successfully', post: post });
  //     } catch (error) {
  //         console.error('Error during post creation:', error);
  //         res.status(500).json({ message: 'Post creation failed', error: error.message });
  //     }
  }
 }



//  const { FieldValue } = require('firebase-admin/firestore');

exports.getPosts = async (req, res) => {
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
