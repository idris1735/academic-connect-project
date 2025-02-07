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
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { toast } from '@/components/ui/use-toast'

export default function FeedsPage() {
  const dispatch = useDispatch()
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const POSTS_PER_PAGE = 5 // Number of posts to load at a time
  const [hasNewPosts, setHasNewPosts] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [hasReachedBottom, setHasReachedBottom] = useState(false)
  const [isLoadingNew, setIsLoadingNew] = useState(false)
  const [noPostsFound, setNoPostsFound] = useState(false)

  // Initial load of posts
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/get_posts?page=1&limit=${POSTS_PER_PAGE}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        
        const data = await response.json()
        
        if (response.ok) {
          const enrichedPosts = data.posts.map((post) => ({
            ...post,
            authorTitle: post.userInfo?.occupation || 'Research Assistant',
            authorLocation: post.userInfo?.location || 'Unknown Location',
            connectionDegree: '1st',
            avatar: post.userInfo?.photoURL || 'https://picsum.photos/seed/currentuser/200',
            timestamp: post.timeStamp || new Date().toISOString(),
          }))

          setPosts(enrichedPosts)
          setHasMore(data.hasMore)
          setPage(2)
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error)
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }

    initialFetch()
  }, [])

  const loadMorePosts = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await fetch(`/api/posts/get_posts?page=${nextPage}&limit=${POSTS_PER_PAGE}`);
      const data = await response.json();
      
      if (response.ok) {
        setPosts(prevPosts => {
          const enrichedNewPosts = data.posts.map((post) => ({
            ...post,
            authorTitle: post.userInfo?.occupation || 'Research Assistant',
            authorLocation: post.userInfo?.location || 'Unknown Location',
            connectionDegree: post.userInfo?.connectionType === 'self' ? 'You' : '1st',
            avatar: post.userInfo?.photoURL || 'https://picsum.photos/seed/currentuser/200',
            timestamp: post.timeStamp || new Date().toISOString(),
          }));

          const newPosts = [...prevPosts, ...enrichedNewPosts];
          // Remove duplicates based on post ID
          const uniquePosts = Array.from(
            new Map(newPosts.map(post => [post.id, post])).values()
          );
          return uniquePosts;
        });
        setHasMore(data.hasMore);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the scroll handler to only manage hasReachedBottom
  const handleScroll = useCallback(() => {
    if (isInitialLoad) return;
    
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight + scrollPosition >= documentHeight - 1000) {
      if (!isLoading && hasMore) {
        loadMorePosts();
      }
      // Set hasReachedBottom when user sees "No more posts"
      if (!hasMore) {
        setHasReachedBottom(true);
      }
    }
  }, [isLoading, hasMore, isInitialLoad]);

  // Add a function to check for new posts
  const checkForNewPosts = async () => {
    try {
      setIsLoadingNew(true);
      setNoPostsFound(false); // Reset the no posts state
      const response = await fetch(`/api/posts/get_posts?page=1&limit=${POSTS_PER_PAGE}`);
      const data = await response.json();
      
      if (response.ok && data.posts.length > 0) {
        const enrichedPosts = data.posts.map((post) => ({
          ...post,
          authorTitle: post.userInfo?.occupation || 'Research Assistant',
          authorLocation: post.userInfo?.location || 'Unknown Location',
          connectionDegree: post.userInfo?.connectionType === 'self' ? 'You' : '1st',
          avatar: post.userInfo?.photoURL || 'https://picsum.photos/seed/currentuser/200',
          timestamp: post.timeStamp || new Date().toISOString(),
        }));

        // Check if we have any new posts
        const newPosts = enrichedPosts.filter(
          newPost => !posts.some(existingPost => existingPost.id === newPost.id)
        );

        if (newPosts.length > 0) {
          setPosts([...newPosts, ...posts]);
          setHasNewPosts(false);
          setHasReachedBottom(false);
        } else {
          setNoPostsFound(true); // Set no posts found state
        }
      }
    } catch (error) {
      console.error('Error checking for new posts:', error);
      toast({
        title: "Error",
        description: "Failed to check for new posts",
        variant: "destructive",
      });
    } finally {
      setIsLoadingNew(false);
    }
  };

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

  // Add this effect to get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/users/current');
        const data = await response.json();
        setCurrentUserId(data.uid);
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  if (isInitialLoad) {
    return <LoadingSpinner />
  }

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

              {hasReachedBottom && (
                <button 
                  onClick={checkForNewPosts}
                  disabled={isLoadingNew}
                  className="w-full py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoadingNew ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Checking for new posts...</span>
                    </>
                  ) : noPostsFound ? (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      No new posts found. Try again
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Load new posts
                    </>
                  )}
                </button>
              )}

              <div className="space-y-4 bg-gray-50 rounded-lg p-4">
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
              </div>
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

