import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { handleError } from '@/lib/error-utils';
import { auth } from '@/lib/auth';


export const runtime = 'nodejs';
// POST /api/posts/[postId]/comments/[commentId] - Like comment
exports.POST = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId, commentId } = params;
    const userId = session.user.id;

    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const postData = postDoc.data();
    const comment = postData.comments.find(c => c.id === commentId);

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    const isLiked = comment.likes.includes(userId);
    const commentIndex = postData.comments.findIndex(c => c.id === commentId);

    if (isLiked) {
      comment.likes = comment.likes.filter(id => id !== userId);
      comment.likeCount--;
    } else {
      comment.likes.push(userId);
      comment.likeCount++;
    }

    postData.comments[commentIndex] = comment;
    await postRef.update({ comments: postData.comments });

    return NextResponse.json({
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      liked: !isLiked
    });

  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 