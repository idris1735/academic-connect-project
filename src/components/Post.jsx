'use client'

import { useState } from 'react'
import { ThumbsUp, MessageSquare, Share2, MessageCircle } from "lucide-react"
import Link from 'next/link'

export default function Post({ post, onLike, onComment, onJoinDiscussion }) {
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = () => {
    onLike(post.id)
  }

  const handleComment = () => {
    setIsCommenting(!isCommenting)
  }

  const submitComment = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      onComment(post.id, comment)
      setComment('')
      setIsCommenting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{post.author}</h3>
              <span className="text-sm text-gray-500">{post.connectionDegree}</span>
            </div>
            <p className="text-sm text-gray-600">{post.authorTitle}</p>
            <p className="text-sm text-gray-500">{post.authorLocation} • {post.timestamp}</p>
          </div>
        </div>

        {/* Post Content */}
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <div className="mb-4">
            <img 
              src={post.image} 
              alt="Post content" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t px-4 py-2 flex justify-between">
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={handleLike}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Like ({post.likes})</span>
        </button>
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={handleComment}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comment ({post.comments.length})</span>
        </button>
        <Link 
          href={`/messages?discussion=${post.discussionId}`}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={() => onJoinDiscussion(post.discussionId)}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Join Discussion</span>
        </Link>
        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-500">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {post.comments.length > 0 && (
        <div className="px-4 py-2 bg-gray-50">
          <h4 className="font-semibold mb-2">Comments</h4>
          {post.comments.map((comment) => (
            <div key={comment.id} className="mb-2">
              <p className="text-sm"><strong>{comment.author}</strong>: {comment.content}</p>
              <p className="text-xs text-gray-500">{comment.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {/* Comment Form */}
      {isCommenting && (
        <div className="px-4 py-2 bg-gray-50">
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  )
}