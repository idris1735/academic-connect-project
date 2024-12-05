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
  console.log('Post:', content, attachment, category);

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

      const fullPost = {
        ...postData,
        content,
        attachment,
        userInfo: {
          author: user.name,
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

      // Fetch associated post content from the 'postContent' subcollection
      const postContentSnapshot = await postDoc.ref.collection('postContent').get();
        // postContents.length > 0 ? postContents[0].content : ''
      const postContents = postContentSnapshot.docs.map((doc) => doc.data());

      // Combine main post data with its content and user info
      // console.log(postContents)
      content = postContents[0].content
      const userName = await getUserNameByUid(postData.uid)
      const fullPost = {
        ...postData,
        content,
        attachment: postData.attachment || null,
        category: postData.postCat,
        userInfo: {
          // Replace these with actual user data if needed
          author: userName, // Replace with user data fetched from `req.user` or other sources
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
