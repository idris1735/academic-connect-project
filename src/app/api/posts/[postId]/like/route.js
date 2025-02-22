import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { createNotification } from '@/services/notificationService';
const { getUserNameByUid, getProfilePhotoURl } = require('@/lib/utils/user');

export const runtime = 'nodejs';

// POST /api/posts/[postId]/like
export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = params;
    const userId = session.user.id;

    // Get the post
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
     likesCount: admin.firestore.FieldValue.increment(-1)
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
     timestamp: admin.firestore.FieldValue.serverTimestamp()
   });
   await postRef.update({
     likesCount: admin.firestore.FieldValue.increment(1)
   });
   newLikeCount = (postDoc.data().likesCount || 0) + 1;

   // Create notification for post owner
   if (postDoc.data().uid === userId) {    // Change this to postDoc.data().uid !== userId
     await createNotification(postDoc.data().uid, 'POST_LIKE', {
       senderId: userId,
       senderName: await getUserNameByUid(userId),
       postId: postId,
       postContent: contentDoc.docs[0]?.data()?.content || '',
       message: 'liked your post',
       timestamp: admin.firestore.FieldValue.serverTimestamp()
     });
   }
 }


    return NextResponse.json({
      message: likeDoc.exists ? 'Like removed' : 'Post liked',
      liked: !likeDoc.exists,
      likesCount: newLikeCount
    });

  } catch (error) {
    console.error('Error liking/unliking post:', error);
    return NextResponse.json({ 
      message: 'Failed to like/unlike post',
      error: error.message 
    }, { status: 500 });
  }
} 