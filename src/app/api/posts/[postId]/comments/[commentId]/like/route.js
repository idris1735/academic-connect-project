import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { createNotification } from '@/services/notificationService';

export const runtime = 'nodejs';

// POST /api/posts/[postId]/comments/[commentId]/like
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId, commentId } = params;
    const userId = session.user.id;

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
        await createNotification(commentDoc.data().userId, 'COMMENT_LIKE', {
          senderId: userId,
          senderName: await getUserNameByUid(userId),
          postId: postId,
          commentId: commentId,
          message: 'liked your comment',
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    return NextResponse.json({
       message: likeDoc.exists ? 'Comment unliked' : 'Comment liked',
      likes: (commentDoc.data().likes || 0) + (likeDoc.exists ? -1 : 1)
    });

  } catch (error) {
    console.error('Error liking/unliking comment:', error);
    return NextResponse.json({ 
      message: 'Failed to like/unlike comment',
      error: error.message 
    }, { status: 500 });
  }
} 