'use client'

import { useState } from 'react'
import { ThumbsUp, MessageSquare, Share2 } from "lucide-react"
import Image from 'next/image'

export default function Post({ post, onLike, onComment }) {
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium">
            {post.author.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold">{post.author}</h3>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <div className="mb-4">
            <Image src={post.image} alt="Post image" width={800} height={300} className="rounded-lg" />
          </div>
        )}
      </div>
      <div className="border-t px-4 py-2 flex justify-between">
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-[#6366F1]"
          onClick={handleLike}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Like ({post.likes})</span>
        </button>
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-[#6366F1]"
          onClick={handleComment}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comment ({post.comments.length})</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-[#6366F1]">
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>
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
      {isCommenting && (
        <div className="px-4 py-2 bg-gray-50">
          <form onSubmit={submitComment} className="flex gap-2">
            <input
              className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-[#6366F1] text-white rounded-md hover:bg-[#5457E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  )
}