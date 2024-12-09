import { Timestamp, FieldValue } from 'firebase/firestore';

// Main Post document
interface Post {
  id: string;
  authorId: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likesCount: number;
  commentsCount: number;
  category: string;
}

// Post Content subcollection document
interface PostContent {
  id: string;
  text: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Comment subcollection document
interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Like subcollection document
interface Like {
  id: string;
  userId: string;
  createdAt: Timestamp;
}

import { getFirestore, doc, setDoc, updateDoc, collection, addDoc, getDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const db = getFirestore();

// Function to create a new post
exports.createPost = async (authorId, title, content, category, imageUrl) => {
  const postRef = doc(collection(db, 'posts'));
  const postId = postRef.id;

  const postData: Post = {
    id: postId,
    authorId,
    title,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    likesCount: 0,
    commentsCount: 0,
    category
  };

  await setDoc(postRef, postData);

  const contentRef = doc(collection(postRef, 'content'));
  const contentData: PostContent = {
    id: contentRef.id,
    text: content,
    imageUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await setDoc(contentRef, contentData);

  return postId;
}

// Function to add a comment to a post
exports.addComment = async (postId, authorId, text) => {
  const postRef = doc(db, 'posts', postId);
  const commentRef = doc(collection(postRef, 'comments'));

  const commentData: Comment = {
    id: commentRef.id,
    authorId,
    text,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  await setDoc(commentRef, commentData);

  await updateDoc(postRef, {
    commentsCount: FieldValue.increment(1),
    updatedAt: Timestamp.now()
  });

  return commentRef.id;
}

// Function to add a like to a post
exports.addLike = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const likeRef = doc(collection(postRef, 'likes'), userId);

  const likeData: Like = {
    id: userId,
    userId,
    createdAt: Timestamp.now()
  };

  await setDoc(likeRef, likeData);

  await updateDoc(postRef, {
    likesCount: FieldValue.increment(1),
    updatedAt: Timestamp.now()
  });
}

// Function to get a post with its content, comments, and likes
exports.getPost = async (postId) => {
  const postRef = doc(db, 'posts', postId);
  const postDoc = await getDoc(postRef);

  if (!postDoc.exists()) {
    throw new Error('Post not found');
  }

  const post = postDoc.data() as Post;

  const contentQuery = query(collection(postRef, 'content'), limit(1));
  const contentSnapshot = await getDocs(contentQuery);
  const content = contentSnapshot.docs[0].data() as PostContent;

  const commentsQuery = query(collection(postRef, 'comments'), orderBy('createdAt', 'desc'), limit(10));
  const commentsSnapshot = await getDocs(commentsQuery);
  const comments = commentsSnapshot.docs.map(doc => doc.data() as Comment);

  const likesQuery = query(collection(postRef, 'likes'), limit(10));
  const likesSnapshot = await getDocs(likesQuery);
  const likes = likesSnapshot.docs.map(doc => doc.data() as Like);

  return {
    ...post,
    content,
    comments,
    likes
  };
}

