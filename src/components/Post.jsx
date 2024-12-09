'use client'

import { useState } from 'react'
import { ThumbsUp, MessageSquare, Share2, MessageCircle, FileText, Film, Image as ImageIcon, Send } from "lucide-react"
import Link from 'next/link'

// Add time formatting function
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'just now'
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return 'just now'

  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

export default function Post({ post, onLike, onComment, onJoinDiscussion }) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')

  // Add console log to debug post data
  console.log('Post data:', post)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        onLike(post.id, data.likesCount);
      } else {
        console.error('Failed to like post:', data.message);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  const handleComment = () => {
    setIsCommenting(!isCommenting)
  }

  const submitComment = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const response = await fetch(`/api/posts/${post.id}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: comment }),
        });

        const data = await response.json();
        
        if (response.ok) {
          onComment(post.id, data.comment);
          setComment('');
        } else {
          console.error('Failed to add comment:', data.message);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  }

  const renderAttachment = () => {
    if (!post.attachment) return null;

    // Helper function to get file type from URL or mimetype
    const getFileType = (url) => {
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return 'image';
      if (url.match(/\.(mp4|webm|mov)$/i)) return 'video';
      return 'document';
    };

    const fileType = getFileType(post.attachment);

    switch (fileType) {
      case 'image':
        return (
          <div className="mb-4">
            <img 
              src={post.attachment} 
              alt="Post attachment" 
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-4">
            <video 
              src={post.attachment} 
              controls 
              className="w-full h-auto rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'document':
        return (
          <div className="mb-4">
            <a 
              href={post.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700 truncate">
                View Attachment
              </span>
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Post Content */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={post.avatar}
              alt={post.userInfo.author}
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{post.userInfo.author}</h3>
              <span className="text-sm text-gray-500">{post.connectionDegree}</span>
            </div>
            <p className="text-sm text-gray-600">{post.authorTitle}</p>
            <p className="text-sm text-gray-500">
              {post.authorLocation} • {formatTimeAgo(post.timestamp)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="mb-4">{post.content}</p>
        
        {/* Attachment */}
        {renderAttachment()}
      </div>

      {/* Action Buttons */}
      <div className="border-t px-4 py-2 flex justify-between">
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={handleLike}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Like ({post.likesCount || 0})</span>
        </button>
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={handleComment}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comment ({post.commentsCount || 0})</span>
        </button>
        
        {post && post.discussion && (
          <Link 
            href={`/messages?discussion=${post.discussion.id}`}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
            onClick={() => onJoinDiscussion && onJoinDiscussion(post.discussion.id)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Join Discussion</span>
          </Link>
        )}
        
        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommenting && (
        <div className="border-t bg-gray-50">
          {/* Comment Form */}
          <form onSubmit={submitComment} className="p-4 flex gap-3">
            <img
              src={post.avatar} // Replace with current user's avatar
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button 
              type="submit"
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
              disabled={!comment.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          {/* Comments List */}
          <div className="px-4 pb-4 space-y-4">
            {post.comments && post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={post.avatar} // Replace with comment author's avatar
                  alt={comment.author}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-white rounded-2xl px-4 py-2">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{formatTimeAgo(comment.timestamp)}</span>
                    <button className="hover:text-gray-700">Like</button>
                    <button className="hover:text-gray-700">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}