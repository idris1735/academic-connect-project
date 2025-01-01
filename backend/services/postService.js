const { db } = require('../config/database')
const admin = require('../config/firebase')

exports.createPost = async (req, res) => {
  try {
    const { content, category, location } = req.body
    const userId = req.user.uid

    const postRef = db.collection('posts').doc()
    const post = {
      id: postRef.id,
      content,
      category,
      location,
      authorId: userId,
      userInfo: {
        author: req.user.displayName || 'Anonymous',
        photoURL: req.user.photoURL || null,
        occupation: req.user.occupation || null,
      },
      likesCount: 0,
      commentsCount: 0,
      timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      likes: [],
      comments: [],
    }

    await postRef.set(post)

    return res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        timeStamp: new Date().toISOString(), // Convert for frontend
      },
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return res.status(500).json({ error: 'Failed to create post' })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query
    const offset = (page - 1) * parseInt(limit)

    // Get posts from Firestore with pagination
    const postsRef = db.collection('posts')
    const query = postsRef
      .orderBy('timeStamp', 'desc')
      .limit(parseInt(limit))
      .offset(offset)

    const snapshot = await query.get()
    const posts = []

    snapshot.forEach((doc) => {
      const postData = doc.data()
      posts.push({
        ...postData,
        timeStamp: postData.timeStamp?.toDate().toISOString(),
      })
    })

    // Check if there are more posts
    const nextQuery = postsRef
      .orderBy('timeStamp', 'desc')
      .limit(1)
      .offset(offset + parseInt(limit))
    const nextSnapshot = await nextQuery.get()

    return res.status(200).json({
      posts,
      hasMore: !nextSnapshot.empty,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return res.status(500).json({ error: 'Failed to fetch posts' })
  }
}

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.user.uid

    const postRef = db.collection('posts').doc(postId)
    const post = await postRef.get()

    if (!post.exists) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const postData = post.data()
    const likes = postData.likes || []
    const isLiked = likes.includes(userId)

    if (isLiked) {
      // Unlike the post
      await postRef.update({
        likes: admin.firestore.FieldValue.arrayRemove(userId),
        likesCount: admin.firestore.FieldValue.increment(-1),
      })
    } else {
      // Like the post
      await postRef.update({
        likes: admin.firestore.FieldValue.arrayUnion(userId),
        likesCount: admin.firestore.FieldValue.increment(1),
      })
    }

    return res.status(200).json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      likesCount: postData.likesCount + (isLiked ? -1 : 1),
    })
  } catch (error) {
    console.error('Error liking/unliking post:', error)
    return res.status(500).json({ error: 'Failed to update post like' })
  }
}

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId
    const userId = req.user.uid
    const { content } = req.body

    const commentRef = db
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .doc()
    const comment = {
      id: commentRef.id,
      content,
      authorId: userId,
      userInfo: {
        author: req.user.displayName || 'Anonymous',
        photoURL: req.user.photoURL || null,
      },
      timeStamp: admin.firestore.FieldValue.serverTimestamp(),
    }

    await commentRef.set(comment)

    // Update comment count on post
    await db
      .collection('posts')
      .doc(postId)
      .update({
        commentsCount: admin.firestore.FieldValue.increment(1),
      })

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        ...comment,
        timeStamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return res.status(500).json({ error: 'Failed to add comment' })
  }
}
