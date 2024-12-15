"use client"
import { useState, Suspense, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from './ui/button'
import { Settings, Trash2, MessageSquare, ThumbsUp, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleEditMode, setPosts } from '@/redux/features/profileSlice'
import { ProfileEditForm } from './ProfileEditForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { formatDistanceToNow } from 'date-fns'
import Post from './Post'
import { useSearchParams } from 'next/navigation'

const RecentActivities = ({ data }) => {
  const dispatch = useDispatch()
  const { activities, activitiesLastFetched } = useSelector((state) => state.profile)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      // Only fetch if we don't have data or it's older than 5 minutes
      const shouldFetch = !activitiesLastFetched || Date.now() - activitiesLastFetched > 5 * 60 * 1000
      
      if (!activities || shouldFetch) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/profile/activities/${data.uid}`)
          const activitiesData = await response.json()
          dispatch({
            type: 'profile/setActivities',
            payload: {
              activities: activitiesData,
              timestamp: Date.now()
            }
          })
        } catch (error) {
          console.error('Error fetching activities:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchActivities()
  }, [data.uid, dispatch, activities, activitiesLastFetched])

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case 'post':
        return (
          <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
        );
      
      case 'comment':
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600">{activity.content}</p>
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>Commented on:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || 'Loading post content...'}
              </p>
            </div>
          </div>
        );
      
      case 'like':
        return (
          <div className="mt-1">
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ThumbsUp className="h-4 w-4 text-[#6366F1]" />
                <span>Liked:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || 'Loading post content...'}
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        // Loading skeleton
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                {/* Name and action skeleton */}
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                
                {/* Content skeleton */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                
                {/* Activity box skeleton */}
                <div className="mt-2 bg-gray-100 p-3 rounded-md">
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                
                {/* Timestamp skeleton */}
                <div className="mt-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activities?.length > 0 ? (
        // Actual content
        activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#6366F1] text-white">
                {data.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {data.name} 
                <span className="text-[#6366F1] font-normal ml-2">
                  {activity.type === 'post' ? 'created a post' : 
                   activity.type === 'comment' ? 'commented' : 
                   'liked a post'}
                </span>
              </p>
              {renderActivityContent(activity)}
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                {activity.category && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{activity.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        // Empty state
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activities</p>
        </div>
      )}
    </div>
  )
}

export function ProfileTabs({ data, isOrganization }) {
  const [activeTab, setActiveTab] = useState("overview")
  const dispatch = useDispatch()
  const isEditing = useSelector((state) => state.profile.isEditing)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const POSTS_PER_PAGE = 5
  const [publications, setPublications] = useState([])
  const [peerReviews, setPeerReviews] = useState([])
  const [isLoadingPubs, setIsLoadingPubs] = useState(false)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const { posts: cachedPosts, postsLastFetched } = useSelector((state) => state.profile)
  const [currentUser, setCurrentUser] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const searchParams = useSearchParams()
  const pid = searchParams.get('pid')

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('Fetching current user...');
        console.log('Current pid:', pid);
        console.log('Current data.uid:', data?.uid);
        
        const response = await fetch('/api/users/current')
        if (response.ok) {
          const userData = await response.json()
          console.log('Current user data:', userData);
          setCurrentUser(userData.user)
          
          // Check if this is own profile
          const isOwn = !pid || userData.user.uid === data?.uid;
          console.log('Is own profile?', isOwn);
          setIsOwnProfile(isOwn);
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    // Only fetch if we have data
    if (data) {
      fetchCurrentUser()
    }
  }, [data, pid])

  const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "publications", label: "Publications" },
    { value: "peer-reviews", label: "Peer Reviews" },
    { value: "posts", label: "Posts" },
    ...((!pid || isOwnProfile) ? [{ value: "settings", label: "Settings" }] : []),
    ...(isOrganization ? [{ value: "members", label: "Members" }] : [])
  ]

  console.log('isOwnProfile:', isOwnProfile);
  console.log('Current tab items:', tabItems);

  useEffect(() => {
    if (activeTab === 'posts' && data?.uid) {
      const loadInitialPosts = async () => {
        // Check if we can use cached posts
        const shouldFetch = !postsLastFetched || Date.now() - postsLastFetched > 5 * 60 * 1000;
        
        if (!cachedPosts || shouldFetch) {
          try {
            setIsLoadingPosts(true);
            setPage(1);
            const response = await fetch(`/api/posts/get_posts?uid=${data.uid}&page=1&limit=${POSTS_PER_PAGE}`);
            const responseData = await response.json();
            
            if (response.ok) {
              const newPosts = responseData.posts.map(post => ({
                ...post,
                authorTitle: data.occupation || 'Research Assistant',
                authorLocation: `${data.city || ''}, ${data.country || ''}`,
                connectionDegree: '1st',
                avatar: data.photoURL || 'https://picsum.photos/seed/currentuser/200',
                timestamp: post.timestamp || new Date().toISOString(),
              }));

              setPosts(newPosts);
              setHasMore(responseData.hasMore);
              setPage(2); // Set to 2 for next fetch

              // Update cache
              dispatch({
                type: 'profile/setPosts',
                payload: {
                  posts: newPosts,
                  timestamp: Date.now()
                }
              });
            }
          } catch (error) {
            console.error('Error fetching posts:', error);
          } finally {
            setIsLoadingPosts(false);
          }
        } else {
          // Use cached posts for initial load
          setPosts(cachedPosts);
          setPage(Math.ceil(cachedPosts.length / POSTS_PER_PAGE) + 1);
          setHasMore(true);
        }
      };

      loadInitialPosts();
    }
  }, [activeTab, data?.uid, cachedPosts, postsLastFetched, dispatch, POSTS_PER_PAGE]);

  const fetchPosts = async () => {
    if (!hasMore || isLoadingPosts || !data?.uid) return;

    try {
      setIsLoadingPosts(true);
      const response = await fetch(`/api/posts/get_posts?uid=${data.uid}&page=${page}&limit=${POSTS_PER_PAGE}`);
      const responseData = await response.json();
      
      if (response.ok) {
        const newPosts = responseData.posts.map(post => ({
          ...post,
          authorTitle: data.occupation || 'Research Assistant',
          authorLocation: `${data.city || ''}, ${data.country || ''}`,
          connectionDegree: '1st',
          avatar: data.photoURL || 'https://picsum.photos/seed/currentuser/200',
          timestamp: post.timestamp || new Date().toISOString(),
        }));

        // Append new posts to existing ones
        setPosts(prevPosts => {
          // Create a Map of existing posts for deduplication
          const postsMap = new Map(prevPosts.map(post => [post.id, post]));
          
          // Add new posts if they don't exist
          newPosts.forEach(post => {
            if (!postsMap.has(post.id)) {
              postsMap.set(post.id, post);
            }
          });

          // Convert back to array while maintaining order
          return Array.from(postsMap.values());
        });

        setHasMore(responseData.hasMore);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        activeTab === 'posts' && // Only fetch if posts tab is active
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !isLoadingPosts && 
        hasMore
      ) {
        fetchPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingPosts, hasMore, activeTab]);

  useEffect(() => {
    if (activeTab === 'publications' && data?.uid) {
      fetchPublications()
    }
  }, [activeTab, data?.uid])

  useEffect(() => {
    if (activeTab === 'peer-reviews' && data?.uid) {
      fetchPeerReviews()
    }
  }, [activeTab, data?.uid])

  const fetchPublications = async () => {
    setPublications([])
    // setIsLoadingPubs(true)
    // try {
    //   const response = await fetch(`/api/publications?uid=${data.uid}`)
    //   const data = await response.json()
    //   if (response.ok) {
    //     setPublications(data.publications)
    //   }
    // } catch (error) {
    //   console.error('Error fetching publications:', error)
    // } finally {
    //   setIsLoadingPubs(false)
    // }
  }

  const fetchPeerReviews = async () => {
    setPeerReviews([])
    // setIsLoadingReviews(true)
    // try {
    //   const response = await fetch(`/api/peer-reviews?uid=${data.uid}`)
    //   const data = await response.json()
    //   if (response.ok) {
    //     setPeerReviews(data.reviews)
    //   }
    // } catch (error) {
    //   console.error('Error fetching peer reviews:', error)
    // } finally {
    //   setIsLoadingReviews(false)
    // }
  }

  const handleLike = async (postId, newLikesCount) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likesCount: newLikesCount } : post
    ))
  }

  const handleComment = (postId, newComment) => {
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: [...(post.comments || []), newComment],
        commentsCount: (post.commentsCount || 0) + 1
      } : post
    ))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tab" />
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TabsList className="hidden md:grid w-full" style={{ gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))` }}>
          {tabItems.map((item) => (
            <TabsTrigger 
              key={item.value} 
              value={item.value}
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <RecentActivities data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        {isOrganization && (
          <TabsContent value="members">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization Members</h3>
                <div className="grid gap-4">
                  {data.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#6366F1] text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-[#6366F1]">{member.role}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="posts">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Posts</h3>
              <div className="space-y-4">
                {isLoadingPosts && posts.length === 0 ? (
                  <Post.Skeletons count={3} />
                ) : (
                  <>
                    {posts.map(post => (
                      <Post 
                        key={post.id} 
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                      />
                    ))}
                    
                    {isLoadingPosts && <Post.Skeletons count={2} />}
                    
                    {!hasMore && posts.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No more posts to load</p>
                      </div>
                    )}
                    
                    {!isLoadingPosts && posts.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No posts yet</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="publications">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Publications</h3>
              <div className="space-y-6">
                {isLoadingPubs ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="bg-white rounded-lg shadow-md p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : publications.length > 0 ? (
                  publications.map((pub) => (
                    <div key={pub.id} className="bg-white rounded-lg shadow p-4">
                      <h4 className="font-medium text-gray-900">{pub.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{pub.authors}</p>
                      <p className="text-sm text-gray-500 mt-1">{pub.journal} • {pub.year}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-600">Citations: {pub.citations}</span>
                        <a 
                          href={pub.doi} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          View Publication
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No publications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="peer-reviews">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Peer Reviews</h3>
              <div className="space-y-6">
                {isLoadingReviews ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="bg-white rounded-lg shadow-md p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : peerReviews.length > 0 ? (
                  peerReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow p-4">
                      <h4 className="font-medium text-gray-900">{review.title}</h4>
                      <p className="text-sm text-gray-600 mt-2">{review.journal}</p>
                      <p className="text-sm text-gray-500 mt-1">Reviewed on {new Date(review.date).toLocaleDateString()}</p>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          review.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          review.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {review.status.replace('_', ' ').charAt(0).toUpperCase() + review.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No peer reviews yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {(!pid || isOwnProfile) && (
          <TabsContent value="settings">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-8">
                  {isEditing ? (
                    <ProfileEditForm />
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Profile Views</span>
                            <span className="text-sm font-medium">{data.profileViews || 0}</span>
                          </div>
                          <Button 
                            className="w-full bg-[#6366F1] hover:bg-[#5355CC]"
                            onClick={() => dispatch(toggleEditMode())}
                          >
                            Edit Profile
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        <PasswordChangeForm />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

