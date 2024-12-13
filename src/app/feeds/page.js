'use client'

import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, setFilter, setLocationFilter, setSortBy, setSearchQuery } from '@/redux/features/feedsSlice'
import NavComponent from '../../components/NavComponent'
import ProfileSlidebar from '../../components/ProfileSlidebar'
import PostCreation from '../../components/PostCreation'
import Post from '../../components/Post'
import RightSidebar from '../../components/RightSidebar'
import SearchBar from '../../components/SearchBar'
import { PostSkeletons } from '@/components/Post'

export default function FeedsPage() {
  const dispatch = useDispatch()
  const { 
    posts, 
    loading, 
    error, 
    filter, 
    locationFilter, 
    sortBy, 
    searchQuery,
    currentPage,
    hasMore,
    initialLoading
  } = useSelector(state => state.feeds)


 


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/get_posts')
        const data = await response.json()
        console.log(data.posts)

        // Enrich each post with additional information
        const enrichedPosts = data.posts.map((post) => ({
          ...post,
          authorTitle: 'Research Assistant | Computer Science | MIT',
          authorLocation: 'Cambridge, MA',
          connectionDegree: '1st',
          avatar: 'https://picsum.photos/seed/currentuser/200',
          timestamp: post.timestamp || new Date().toISOString(), // Use server timestamp or fallback
        }))
        console.log(enrichedPosts)
        // Update the state with enriched posts
        setPosts(enrichedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchPosts()
  }, []) // Dependency array is empty to run only once
  
  // Load initial posts
  useEffect(() => {
    dispatch(fetchPosts(1))
  }, [dispatch])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (!loading && hasMore) {
        dispatch(fetchPosts(currentPage + 1))
      }
    }
  }, [currentPage, loading, hasMore, dispatch])

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handle Scroll])

  // const addPost = async (content, image, category, location) => {
  //   const newPost = {
  //     id: posts.length + 1,
  //     author: 'Current User',
  //     authorTitle: 'Research Assistant | Computer Science | MIT',
  //     authorLocation: 'Cambridge, MA',
  //     connectionDegree: '1st',
  //     avatar: 'https://picsum.photos/seed/currentuser/200',
  //     content,
  //     image,
  //     timestamp: 'Just now',
  //     likes: 0,
  //     comments: [],
  //     category,
  //     location,
  //     projectRoom: `project-${Date.now()}`
  //   }
  //   setPosts([newPost, ...posts])
  // }
  const addPost = (serverPost) => {
    // Add client-specific fields to the server-generated post
    const completePost = {
      ...serverPost, // Spread the server's data
      authorTitle: 'Research Assistant | Computer Science | MIT',
      authorLocation: 'Cambridge, MA',
      connectionDegree: '1st',
      avatar: 'https://picsum.photos/seed/currentuser/200',
      // timestamp: new Date().toISOString(), // Fallback if `timestamp` isn't set
    }

    // Prepend the complete post to the list
    setPosts([completePost, ...posts])
  }

  const handleLike = async (postId, newLikeCount) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likesCount: newLikeCount }
        : post,
    ))
  }

  const handleComment = async (postId, newComment) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            commentsCount: (post.commentsCount || 0) + 1,
            comments: [...(post.comments || []), newComment],
          }
        : post,
    ))
  }
>
  const handleSearch = (query) => {
    dispatch(setSearchQuery(query))
  }


  const handleFilterChange = (e) => {
    dispatch(setFilter(e.target.value))
  }

  const filteredPosts = posts
    .filter(post => filter === 'all' || post.category === filter)
    .filter(post => locationFilter === 'all' || post.location === locationFilter)

    .filter(post => {
      if (!post.userInfo?.author || !post.content) return true
      return post.userInfo.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.content.toLowerCase().includes(searchQuery.toLowerCase())
    })

    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.timestamp) - new Date(a.timestamp)
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileSlidebar />
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <PostCreation />
            
            {/* Search Bar */}

            <SearchBar
              placeholder="Search profiles or posts..."
              value={searchQuery}
              onChange={handleSearch}
            />

            {/* Filter Options */}
            <div className="flex space-x-4 mb-4">
              <select value={filter} onChange={handleFilterChange} className="border rounded-md p-2">
                <option value="all">All Posts</option>
                <option value="research">Research</option>
                <option value="publication">Publication</option>
              </select>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Post 
                  key={post.id} 
                  post={post}
                />
              ))}
              
              {/* Show loading skeletons at the bottom while fetching more */}
              {loading && (
                <PostSkeletons count={2} />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-500 bg-white p-4 rounded-lg shadow">
                {error}
              </div>
            )}

          </div>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}

