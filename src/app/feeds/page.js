'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, setFilter, setLocationFilter, setSortBy, setSearchQuery } from '@/redux/features/feedsSlice'
import NavComponent from '../../components/NavComponent'
import ProfileSlidebar from '../../components/ProfileSlidebar'
import PostCreation from '../../components/PostCreation'
import Post from '@/components/Post'
import RightSidebar from '../../components/RightSidebar'
import SearchBar from '../../components/SearchBar'

export default function FeedsPage() {
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const POSTS_PER_PAGE = 5 // Number of posts to load at a time

  // Initial load of posts
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/get_posts?page=1&limit=${POSTS_PER_PAGE}`)
        const data = await response.json()
        
        if (response.ok) {
          const enrichedPosts = data.posts.map((post) => ({
            ...post,
            authorTitle: 'Research Assistant | Computer Science | MIT',
            authorLocation: 'Cambridge, MA',
            connectionDegree: '1st',
            avatar: 'https://picsum.photos/seed/currentuser/200',
            timestamp: post.timestamp || new Date().toISOString(),
          }))

          setPosts(enrichedPosts)
          setHasMore(enrichedPosts.length === POSTS_PER_PAGE)
          setPage(2) // Set to 2 for next fetch
        } else {
          console.error('Failed to fetch posts:', data.message)
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error)
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }

    initialFetch()
  }, []) // Empty dependency array for initial load

  const fetchPosts = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/get_posts?page=${page}&limit=${POSTS_PER_PAGE}`);
      const data = await response.json();
      
      if (response.ok) {
        const newPosts = data.posts.map(post => ({
          ...post,
          authorTitle: 'Research Assistant | Computer Science | MIT',
          authorLocation: 'Cambridge, MA',
          connectionDegree: '1st',
          avatar: 'https://picsum.photos/seed/currentuser/200',
          timestamp: post.timeStamp || new Date().toISOString(),
        }));

        // Append new posts to existing ones without replacing the entire array
        setPosts(prevPosts => {
          const postsMap = new Map([...prevPosts, ...newPosts].map(post => [post.id, post]));
          return Array.from(postsMap.values());
        });

        setHasMore(data.hasMore);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the scroll handler to use window scroll
  const handleScroll = useCallback(() => {
    if (isInitialLoad) return // Don't trigger scroll loading during initial load
    
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    if (windowHeight + scrollPosition >= documentHeight - 1000) {
      if (!isLoading && hasMore) {
        fetchPosts()
      }
    }
  }, [isLoading, hasMore, isInitialLoad])

  // Update scroll listener to use window
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

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
    setPosts(prevPosts => {
      // Check if post already exists
      const exists = prevPosts.some(post => post.id === serverPost.id);
      if (exists) return prevPosts;
      
      const completePost = {
        ...serverPost,
        authorTitle: 'Research Assistant | Computer Science | MIT',
        authorLocation: 'Cambridge, MA',
        connectionDegree: '1st',
        avatar: 'https://picsum.photos/seed/currentuser/200',
      };
      return [completePost, ...prevPosts];
    });
  };

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  }

  const handleFilterChange = (value) => {
    setFilter(value);
  }

  const filteredPosts = posts
    .filter(post => filter === 'all' || post.category === filter)
    .filter(post => {
      if (!searchQuery) return true
      if (!post.userInfo?.author || !post.content) return true
      return post.userInfo.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.content.toLowerCase().includes(searchQuery.toLowerCase())
    })

  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <div className="pt-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProfileSlidebar />
            <div className="md:col-span-2 lg:col-span-2 space-y-6">
              <PostCreation onPostCreate={addPost} />
              
              <SearchBar
                placeholder="Search profiles or posts..."
                value={searchQuery}
                onChange={handleSearch}
              />

              <div className="flex space-x-4">
                <select 
                  value={filter} 
                  onChange={(e) => handleFilterChange(e.target.value)} 
                  className="border rounded-md p-2"
                >
                  <option value="all">All Posts</option>
                  <option value="research">Research</option>
                  <option value="publication">Publication</option>
                </select>
              </div>

              <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                {isInitialLoad ? (
                  <Post.Skeletons count={POSTS_PER_PAGE} />
                ) : (
                  <>
                    {filteredPosts.map(post => (
                      <Post 
                        key={post.id} 
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                      />
                    ))}
                    
                    {isLoading && <Post.Skeletons count={2} />}
                    
                    {!hasMore && posts.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No more posts to load</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

