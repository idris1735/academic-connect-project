'use client'

import { useState, useEffect } from 'react'
import NavComponent from '../../components/NavComponent'
import ProfileSidebar from '../../components/ProfileSlidebar'
import PostCreation from '../../components/PostCreation'
import Post from '../../components/Post'
import RightSidebar from '../../components/RightSidebar'

export default function Feeds() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simulating API call to fetch posts
    const fetchedPosts = [
      {
        id: 1,
        author: 'John Doe',
        avatar: '/placeholder-user.jpg',
        content: 'Excited to share my latest research findings!',
        timestamp: '2h ago',
        likes: 15,
        comments: [
          { id: 1, author: 'Jane Smith', content: 'Great work!', timestamp: '1h ago' },
          { id: 2, author: 'Bob Johnson', content: 'Interesting results.', timestamp: '30m ago' }
        ],
        image: '/research-paper.svg',
        category: 'research'
      },
      {
        id: 2,
        author: 'Alice Brown',
        avatar: '/placeholder-user.jpg',
        content: 'New job opening in our lab. Apply now!',
        timestamp: '4h ago',
        likes: 8,
        comments: [],
        image: '/research-presentation.svg',
        category: 'job'
      },
      {
        id: 3,
        author: 'Emily White',
        avatar: '/placeholder-user.jpg',
        content: 'Just published a new paper in Nature!',
        timestamp: '1d ago',
        likes: 32,
        comments: [
          { id: 3, author: 'David Lee', content: 'Congratulations!', timestamp: '20h ago' }
        ],
        image: '/research-paper.svg',
        category: 'publication'
      }
    ]
    setPosts(fetchedPosts)
  }, [])

  const addPost = (content, image, category) => {
    const newPost = {
      id: posts.length + 1,
      author: 'Current User',
      avatar: '/research-svgrepo-com.svg',
      content,
      image,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      category
    }
    setPosts([newPost, ...posts])
  }

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleComment = (postId, comment) => {
    setPosts(posts.map(post => 
      post.id === postId ? { 
        ...post, 
        comments: [...post.comments, {
          id: post.comments.length + 1,
          author: 'Current User',
          content: comment,
          timestamp: 'Just now'
        }]
      } : post
    ))
  }

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => post.category === filter)

  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileSidebar />
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <PostCreation onPostCreate={addPost} />
            <div className="flex justify-center space-x-4 mb-4">
              <button 
                className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded ${filter === 'research' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFilter('research')}
              >
                Research
              </button>
              <button 
                className={`px-4 py-2 rounded ${filter === 'publication' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFilter('publication')}
              >
                Publication
              </button>
              <button 
                className={`px-4 py-2 rounded ${filter === 'job' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setFilter('job')}
              >
                Job
              </button>
            </div>
            {filteredPosts.map(post => (
              <Post key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
            ))}
          </div>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}