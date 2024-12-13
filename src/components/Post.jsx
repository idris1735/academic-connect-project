'use client'

import { useState } from 'react'
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MessageCircle,
  FileText,
  Film,
  Image as ImageIcon,
  Send,
  X,
} from 'lucide-react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import Image from 'next/image'

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


// Skeleton loading component
const PostSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
    <div className="border-t px-4 py-2 flex justify-between">
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
)

// Move PostSkeletons before the main Post component
const PostSkeletons = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <PostSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
)

const Post = ({ post, isLoading, onLike, onComment }) => {
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Show skeleton loading if post is loading
  if (isLoading) {
    return <PostSkeleton />
  }

  // Use a better placeholder image from a reliable CDN
  const avatarSrc = post.avatar || 'https://ui-avatars.com/api/?name=User&background=6366F1&color=fff'

  // Format time in a consistent way
  const formattedTime = post.timeStamp ? formatTimeAgo(post.timeStamp) : 'recently'

  // Add console log to debug post data
  console.log('Post data:', post)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        onLike(post.id, data.likesCount)
      } else {
        console.error('Failed to like post:', data.message)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = () => {
    setIsCommenting(!isCommenting)
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (comment.trim()) {
      try {
        const response = await fetch(`/api/posts/${post.id}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: comment }),
        })

        const data = await response.json()

        if (response.ok) {
          onComment(post.id, data.comment)
          setComment('')
        } else {
          console.error('Failed to add comment:', data.message)
        }
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }
  }

  const renderAttachment = () => {
    if (!post.attachment) return null

    switch (post.attachment.type) {
      case 'image':
        return (
          <div className="mb-4 relative">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={post.attachment.url}
                alt="Post attachment"
                className="rounded-lg object-cover"
                loading="lazy"
              />
            </div>

          </div>
        )
      case 'video':
        return (
          <div className="mb-4">
            <video
              controls
              className="rounded-lg max-h-96 w-auto mx-auto"

//           <div className='mb-4'>
//             <video
//               src={post.attachment}
//               controls
//               className='w-full h-auto rounded-lg'

            >
              <source src={post.attachment.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      case 'document':
        return (

          <div className="mb-4 flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <FileText className="h-6 w-6 text-gray-500" />
            <a
              href={post.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {post.attachment.name || 'View Document'}
            </a>
          </div>
        )
      default:
        return null
    }
  }


  const handleShare = () => {
    setShowShareModal(true)
  }

  const copyToClipboard = () => {
    const shareableLink = window.location.href; // Customize this to the specific post URL if needed
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        alert('Post link copied to clipboard!');
        setShowShareModal(false); // Close the modal after copying
      })
      .catch((error) => console.error('Error copying to clipboard:', error));
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt={post.userInfo?.author || 'User'}
              className="w-12 h-12 rounded-full bg-indigo-100"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=User&background=6366F1&color=fff'
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{post.userInfo?.author || 'Loading...'}</h3>
              <span className="text-sm text-gray-500">{post.connectionDegree || ''}</span>
            </div>
            <p className="text-sm text-gray-600">{post.authorTitle || 'Academic Researcher'}</p>
            <p className="text-sm text-gray-500">
              {post.authorLocation || 'Loading...'} • {formattedTime}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className='mb-4'>{post.content}</p>

        {/* Attachment */}
        {renderAttachment()}
      </div>

      {/* Action Buttons */}
      <div className='border-t px-4 py-2 flex justify-between'>
        <button
          className='flex items-center gap-2 text-gray-500 hover:text-indigo-500'
          onClick={handleLike}
        >
          <ThumbsUp className='h-5 w-5' />
          <span>Like ({post.likesCount || 0})</span>
        </button>
        <button
          className='flex items-center gap-2 text-gray-500 hover:text-indigo-500'
          onClick={handleComment}
        >
          <MessageSquare className='h-5 w-5' />
          <span>Comment ({post.commentsCount || 0})</span>
        </button>

        {post && post.discussion && (
          <Link
            href={`/messages?discussion=${post.discussion.id}`}

            className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          >
            <MessageCircle className='h-5 w-5' />
            <span>Join Discussion</span>
          </Link>
        )}
        
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommenting && (
        <div className='border-t bg-gray-50'>
          {/* Comment Form */}
          <form onSubmit={submitComment} className='p-4 flex gap-3 sticky top-0 bg-gray-50 z-10'>
            <img
              src={post.avatar || avatarSrc}
              alt="Your avatar"
              className="w-8 h-8 rounded-full"
            />
            <div className='flex-1'>
              <input
                type='text'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Add a comment...'
                className='w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
            </div>
            <button 
              type='submit'
              className='p-2 text-indigo-600 hover:bg-indigo-50 rounded-full'
              disabled={!comment.trim()}
            >
              <Send className='h-5 w-5' />
            </button>
          </form>

          {/* Comments List with fixed height and scroll */}
          <div className="px-4 pb-4 space-y-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {post.comments && post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar || avatarSrc}
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Share this post</h2>
            <p className="mb-4">Copy the link below:</p>
            <input
              type="text"
              readOnly
              value={window.location.href} // Customize this to the specific post URL if needed
              className="border rounded-md p-2 w-full"
            />
            <button
              onClick={copyToClipboard}
              className="mt-4 bg-indigo-600 text-white rounded-md px-4 py-2"
            >
              Copy Link
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-2 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Add Skeletons as a static property
Post.Skeletons = PostSkeletons

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    attachment: PropTypes.string,
    likesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    userInfo: PropTypes.shape({
      author: PropTypes.string.isRequired,
    }).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        timestamp: PropTypes.string,
      })
    ),
    discussion: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
  onJoinDiscussion: PropTypes.func,
  isLoading: PropTypes.bool
}

export default Post

