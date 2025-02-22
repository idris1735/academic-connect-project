const { NextResponse } = require('next/server');
const { admin, db } = require('@/lib/firebase-admin');
import { auth } from '@/lib/auth';
const { handleError } = require('@/lib/error-utils');
const { getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');
const { v4: uuidv4 } = require('uuid');
import { createNotification } from '@/services/notificationService';

export const runtime = 'nodejs';
// POST /api/posts/[postId]/comments - Add comment
export const POST = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const { content, parentId } = await req.json();
    const userId = session.user.id;

    
    if (!content) {
      return NextResponse.json({ message: 'Comment content is required' }, { status: 400 });
    }

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
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
      await createNotification(postDoc.data().uid, 'POST_COMMENT', {
        senderId: userId,
        senderName: userName,
        postId: postId,
        commentId: commentId,
        commentContent: content,
        message: parentId ? 'replied to a comment on your post' : 'commented on your post',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }


    return NextResponse.json({
      message: 'Comment added successfully',
      comment: {
        ...commentData,
        photoURL: await getProfilePhotoURl(userId),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to add comment', 
      error: error.message  });
  }
}; 