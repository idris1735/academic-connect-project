import { NextResponse } from 'next/server';
import { db, admin } from '@/lib/firebase-admin';
import { auth } from '@/lib/auth';
import { handleError } from '@/lib/error-utils';
import { getUserNameByUid, getProfilePhotoURl } from '@/lib/utils/user';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const clients = new Set();

export const runtime = 'nodejs';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};



// GET /api/posts - Get paginated posts
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 5;
    const currentUserId = session.user.id;

    const startAfter = (page - 1) * limit;
  
  
      // Get user's connections first
      const userDoc = await db.collection('profiles').doc(currentUserId).get();
      const userData = userDoc.data();
      const connections = userData?.connections?.connected || [];
      
      // Include current user in the authors list
      const authorIds = [currentUserId, ...connections];
  
      console.log('Fetching posts for users:', authorIds);
  
      // Modified query to get posts from user and their connections
      let query = db.collection('posts')
        .where('uid', 'in', authorIds)
        .orderBy('timeStamp', 'desc'); // Sort by newest first
  
      // Get the paginated data
      const postsSnapshot = await query
        .limit(limit)
        .offset(startAfter)
        .get();
  
      if (postsSnapshot.empty) {
        return res.status(200).json({ 
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
  
        // Get author details
        const authorName = await getUserNameByUid(postData.uid);
        const authorPhotoURL = await getProfilePhotoURl(postData.uid);
        
        // Determine connection type
        const connectionType = postData.uid === currentUserId 
          ? 'self' 
          : 'connection';
  
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
            author: authorName,
            connectionType: connectionType
          },
          photoURL: authorPhotoURL,
        });
      }));
  
      // Convert map to array and sort by timestamp
      const posts = Array.from(postsMap.values())
        .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  
  
    return NextResponse.json({
      message: 'Posts retrieved successfully',
      posts,
      hasMore: posts.length === limit,
      currentPage: page
    });

  } catch (error) {
    console.error('Error getting posts:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
}

// POST /api/posts - Create new post
export const PUT = async (req) => {
  try {
    // Parse the incoming form data
    const form = formidable({ multiples: true, keepExtensions: true });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Authenticate user
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    const content = fields.content?.[0] || null;
    const category = fields.category?.[0] || null;
    const discussionName = fields.discussionName?.[0] || null;

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    let attachment_info = null;

    // Handle file upload if there's an attachment
    if (files.attachment) {
      const attachment = files.attachment[0];

      // Validate file size (10MB limit)
      if (attachment.size > 10 * 1024 * 1024) {
        return NextResponse.json({ message: 'File size should not exceed 10MB.' }, { status: 400 });
      }

      // Generate unique file name and path
      const fileExtension = path.extname(attachment.originalFilename);
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', `${uuidv4()}${fileExtension}`);

      // Move the file to the desired location
      await fs.rename(attachment.filepath, uploadPath);

      attachment_info = {
        name: attachment.originalFilename,
        fileType: attachment.mimetype,
        url: `/uploads/${path.basename(uploadPath)}`,
      };
    }

    // Create the post document in Firestore
    const postRef = db.collection('posts').doc();
    const postID = postRef.id;

    const postData = {
      id: postID,
      uid: user.uid,
      timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      postCat: category,
      likesCount: 0,
      commentsCount: 0,
      attachment: attachment_info,
      discussion: null,
    };

    await postRef.set(postData);

    // Handle discussion creation if needed
    if (discussionName && discussionName.trim()) {
      // Your logic for creating a discussion goes here...
    }

    return NextResponse.json({
      message: 'Post created successfully',
      post: postData,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500 });
  }
};

// POST /api/posts - Create new post
export const POST = async (req) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;
    const formData = await req.formData();
    const content = formData.get('content');
    const attachment = formData.get('attachment');
    const discussionName = formData.get('discussionName');
    const category = formData.get('category');
    const authorId = session.user.id;
    const storeInCloud = false;

    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }

    let attachment_info;

    let attachmentUrl;
    // Handle file upload if there's an attachment
    if (attachment && storeInCloud) {

      if (attachment) {
        const file = attachment;
        const fileBuffer = await file.arrayBuffer();
        const metadata = {
          contentType: file.type,
        };
  
        const bucket = storage.bucket();
        const fileName = `posts/${authorId}/${Date.now()}_${file.name}`;
        const fileUpload = bucket.file(fileName);
  
        await fileUpload.save(Buffer.from(fileBuffer), {
          metadata: metadata,
        });
  
        attachmentUrl = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500',
        }).then(urls => urls[0]);
      }
    }

    if (attachment) {
      const fileBuffer = await attachment.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);
      let fileExtension;
      if (attachment && attachment.name) {
        fileExtension = path.extname(attachment.name);
      } else {
        throw new Error('Attachment or originalname is undefined');
      }
      let uploadPath;
      let fileType;
    
      if (attachment.type.startsWith('image/')) {
        fileType = 'images';
      } else if (attachment.type.startsWith('video/')) {
        fileType = 'videos';
      } else if (attachment.type.startsWith('application/')) {
        fileType = 'applications';
      } else {
        throw new Error('Invalid file type');
      }
      console.log('fileType', fileType);
      const name = attachment.name;
    
      uploadPath = path.join(process.cwd(), 'public', 'uploads', fileType, `${uuidv4()}${fileExtension}`);
      console.log('uploadPath', uploadPath);
    
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, buffer);
      //  // Write the file to the local storage
      // fs.writeFileSync(uploadPath, attachment.buffer);
      // attachmentUrl = uploadPath; // Store the local path or URL as needed
      attachmentUrl = path.relative(path.join(process.cwd(), 'public'), uploadPath);
      attachment_info = {
        name,
        fileType,
        url: attachmentUrl,
        size: attachment.size,
      }

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
      attachment: attachment ? attachment_info : null,
      discussion: null,
    };

    await postRef.set(postData);

    // If a discussion name is provided, create a discussion object
    if (discussionName && discussionName.trim()) {
     //Create a discussion, that is a research room
      let discussionResponse = await messageService.createResearchRoomForPost(user.uid, discussionName, postID);

      if (discussionResponse.success) {
        // Link the discussion to the post
        console.log('Created discussion room:', discussionResponse.room);
        postData.discussion = {
          id: discussionResponse.room.id,
          name: discussionResponse.room.name,
        }
      } else {
        console.error('Failed to create discussion:', discussionResponse.error);
        // Handle the error as needed
        postRef.delete();
        return res.status(500).json({ 
          message: 'Failed to create discussion for post', 
          error: discussionResponse.error 
        });
      }
    }


    const PostContentRef = postRef.collection('postContent').doc();
    const postContentID = PostContentRef.id;
    await PostContentRef.set({
        id: postContentID,//-
        uid: user.uid,//-
        content: content,//-
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),//-
      });//-


    // Create a research room with the discussion ID
    
    
    const name = await getUserNameByUid(user.uid);
    const fullPost = {
      ...postData,
      content,
      userInfo: {
        author: name,
      }
    };

    // Add this to createPost function after post creation
    const eventData = {
      type: 'NEW_POST',
      post: {
        ...fullPost,
        uid: user.uid,
        timeStamp: new Date().toISOString(),
        userInfo: {
          ...fullPost.userInfo,
          connectionType: 'connection'
        }
      }
    };

    clients.forEach(client => {
      if (client.userId !== user.uid) {
        client.res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      }
    });

    

    return NextResponse.json({
      message: 'Post created successfully', 
      post: fullPost 
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(handleError(error), { status: error.statusCode || 500,  message: 'Failed to create post', 
      error: error.message  });
  }
}; 