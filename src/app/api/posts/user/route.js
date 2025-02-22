import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid, getProfilePhotoURl } from '@/lib/utils/user';

const { v4: uuidv4 } = require('uuid');
const notificationService = require('@/services/notificationService');
// const messageService = require('@/lib/services/messageService')
const fs = require('fs/promises');
const path = require('path');
const exp = require('constants');

const clients = new Set();

export const runtime = 'nodejs';

// GET /api/posts/user - Get posts by user ID
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid') || session.user.id;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const startAfter = (page - 1) * limit;

     // Base query
     let query = db.collection('posts').where('uid', '==', uid);


     // Get the paginated data
     const postsSnapshot = await query
       .limit(limit)
       .offset(startAfter)
       .get();
 
     if (postsSnapshot.empty) {
       return NextResponse.json({ 
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
       
       const comments = await Promise.all(commentsSnapshot.docs.map(async (doc) => ({
         ...doc.data(),
         photoURL: await getProfilePhotoURl(doc.data().userId),
         timestamp: doc.data().timestamp?.toDate().toISOString()
       })));
 
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
           author: await getUserNameByUid(uid),
         },
         // Ad the photoURL
         photoURL: await getProfilePhotoURl(uid),
       });
     }));
 
     // Convert map to array
     const posts = Array.from(postsMap.values());
 
 

    return NextResponse.json({
      message: 'Posts retrieved successfully',
      posts,
      hasMore: posts.length === limit,
      currentPage: page
    });

  } catch (error) {
    console.error('Error getting user posts:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to get user posts', 
      error: error.message  });
  }
}
