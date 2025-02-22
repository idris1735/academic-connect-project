import { NextResponse } from 'next/server';
import { admin, db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';

export const runtime = 'nodejs';

// POST /api/posts/[postId]/like - Like/unlike a post
export const POST = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    
    const userId = session.user.id;
    const postId = params.postId;
    const { action } = await req.json();

    const postRef = db.collection('posts').doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    if (action === 'like') {
      await postRef.update({
        likes: admin.firestore.FieldValue.arrayUnion(userId)
      });
    } else if (action === 'unlike') {
      await postRef.update({
        likes: admin.firestore.FieldValue.arrayRemove(userId)
      });
    }

    return NextResponse.json({ message: `Post ${action}d successfully` });

  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// POST /api/posts/[postId]/comment - Add a comment
export const PUT = async (req, { params }) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const { content } = await req.json();
    const authorId = session.user.id;

    if (!content) {
      return NextResponse.json({ message: 'Comment content is required' }, { status: 400 });
    }

    const postRef = db.collection('posts').doc(postId);
    const post = await postRef.get();

    if (!post.exists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const comment = {
      id: Date.now().toString(),
      content,
      authorId,
      likes: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await postRef.update({
      comments: admin.firestore.FieldValue.arrayUnion(comment)
    });

    return NextResponse.json({
      message: 'Comment added successfully',
      comment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}; 