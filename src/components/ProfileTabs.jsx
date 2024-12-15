"use client";
import { useState, Suspense, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import {
  Settings,
  Trash2,
  MessageSquare,
  ThumbsUp,
  Loader2,
  Camera,
  LinkIcon,
  FileText,
  Download,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleEditMode, setPosts } from "@/redux/features/profileSlice";
import { ProfileEditForm } from "./ProfileEditForm";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { formatDistanceToNow } from "date-fns";
import Post from "./Post";
import ProfilePost from "./ProfilePost";
import { useSearchParams } from "next/navigation";
import PropTypes from "prop-types"; // Import PropTypes
import { Label } from "@/components/ui/label"; // Added import statement
import { Input } from "@/components/ui/input"; // Added import statement
import { Switch } from "@/components/ui/switch"; // Ensure this path is correct
import { PeerReview } from "@/components/PeerReview"; // Ensure this import is present
import { useToast } from "@/components/ui/use-toast"; // Import toast for notifications

const RecentActivities = ({ data }) => {
  const dispatch = useDispatch();
  const { activities, activitiesLastFetched } = useSelector(
    (state) => state.profile
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      // Only fetch if we don't have data or it's older than 5 minutes
      const shouldFetch =
        !activitiesLastFetched ||
        Date.now() - activitiesLastFetched > 5 * 60 * 1000;

      if (!activities || shouldFetch) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/profile/activities/${data.uid}`);
          const activitiesData = await response.json();
          dispatch({
            type: "profile/setActivities",
            payload: {
              activities: activitiesData,
              timestamp: Date.now(),
            },
          });
        } catch (error) {
          console.error("Error fetching activities:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchActivities();
  }, [data.uid, dispatch, activities, activitiesLastFetched]);

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case "post":
        return <p className="text-sm text-gray-600 mt-1">{activity.content}</p>;

      case "comment":
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600">{activity.content}</p>
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>Commented on:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || "Loading post content..."}
              </p>
            </div>
          </div>
        );

      case "like":
        return (
          <div className="mt-1">
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ThumbsUp className="h-4 w-4 text-[#6366F1]" />
                <span>Liked:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || "Loading post content..."}
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
            <div
              key={n}
              className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
            >
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
          <div
            key={index}
            className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#6366F1] text-white">
                {data.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {data.name}
                <span className="text-[#6366F1] font-normal ml-2">
                  {activity.type === "post"
                    ? "created a post"
                    : activity.type === "comment"
                    ? "commented"
                    : "liked a post"}
                </span>
              </p>
              {renderActivityContent(activity)}
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <span>
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </span>
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
  );
};

export function ProfileTabs({ data, isOrganization }) {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();
  const isEditing = useSelector((state) => state.profile.isEditing);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const POSTS_PER_PAGE = 5;
  const [publications, setPublications] = useState([]);
  const [peerReviews, setPeerReviews] = useState([]);
  const [isLoadingPubs, setIsLoadingPubs] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const { posts: cachedPosts, postsLastFetched } = useSelector(
    (state) => state.profile
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid");
  const { toast } = useToast(); // Toast for notifications

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log("Fetching current user...");
        console.log("Current pid:", pid);
        console.log("Current data.uid:", data?.uid);

        const response = await fetch("/api/users/current");
        if (response.ok) {
          const userData = await response.json();
          console.log("Current user data:", userData);
          setCurrentUser(userData.user);

          // Check if this is own profile
          const isOwn = !pid || userData.user.uid === data?.uid;
          console.log("Is own profile?", isOwn);
          setIsOwnProfile(isOwn);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    // Only fetch if we have data
    if (data) {
      fetchCurrentUser();
    }
  }, [data, pid]);

  const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "publications", label: "Publications" },
    { value: "peer-reviews", label: "Peer Reviews" },
    { value: "posts", label: "Posts" },
    ...(!pid || isOwnProfile ? [{ value: "settings", label: "Settings" }] : []),
    ...(isOrganization ? [{ value: "members", label: "Members" }] : []),
  ];

  console.log("isOwnProfile:", isOwnProfile);
  console.log("Current tab items:", tabItems);

  useEffect(() => {
    if (activeTab === "posts" && data?.uid) {
      const loadInitialPosts = async () => {
        // Check if we can use cached posts
        const shouldFetch =
          !postsLastFetched || Date.now() - postsLastFetched > 5 * 60 * 1000;

        if (!cachedPosts || shouldFetch) {
          try {
            setIsLoadingPosts(true);
            setPage(1);
            const response = await fetch(
              `/api/posts/get_posts?uid=${data.uid}&page=1&limit=${POSTS_PER_PAGE}`
            );
            const responseData = await response.json();

            if (response.ok) {
              const newPosts = responseData.posts.map((post) => ({
                ...post,
                authorTitle: data.occupation || "Research Assistant",
                authorLocation: `${data.city || ""}, ${data.country || ""}`,
                connectionDegree: "1st",
                avatar:
                  data.photoURL || "https://picsum.photos/seed/currentuser/200",
                timestamp: post.timestamp || new Date().toISOString(),
              }));

              setPosts(newPosts);
              setHasMore(responseData.hasMore);
              setPage(2); // Set to 2 for next fetch

              // Update cache
              dispatch({
                type: "profile/setPosts",
                payload: {
                  posts: newPosts,
                  timestamp: Date.now(),
                },
              });
            }
          } catch (error) {
            console.error("Error fetching posts:", error);
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
  }, [
    activeTab,
    data?.uid,
    cachedPosts,
    postsLastFetched,
    dispatch,
    POSTS_PER_PAGE,
  ]);

  const fetchPosts = async () => {
    if (!hasMore || isLoadingPosts || !data?.uid) return;

    try {
      setIsLoadingPosts(true);
      const response = await fetch(
        `/api/posts/get_posts?uid=${data.uid}&page=${page}&limit=${POSTS_PER_PAGE}`
      );
      const responseData = await response.json();

      if (response.ok) {
        const newPosts = responseData.posts.map((post) => ({
          ...post,
          authorTitle: data.occupation || "Research Assistant",
          authorLocation: `${data.city || ""}, ${data.country || ""}`,
          connectionDegree: "1st",
          avatar: data.photoURL || "https://picsum.photos/seed/currentuser/200",
          timestamp: post.timestamp || new Date().toISOString(),
        }));

        // Append new posts to existing ones
        setPosts((prevPosts) => {
          // Create a Map of existing posts for deduplication
          const postsMap = new Map(prevPosts.map((post) => [post.id, post]));

          // Add new posts if they don't exist
          newPosts.forEach((post) => {
            if (!postsMap.has(post.id)) {
              postsMap.set(post.id, post);
            }
          });

          // Convert back to array while maintaining order
          return Array.from(postsMap.values());
        });

        setHasMore(responseData.hasMore);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        activeTab === "posts" && // Only fetch if posts tab is active
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 1000 &&
        !isLoadingPosts &&
        hasMore
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingPosts, hasMore, activeTab]);

  useEffect(() => {
    if (activeTab === "publications" && data?.uid) {
      fetchPublications();
    }
  }, [activeTab, data?.uid]);

  useEffect(() => {
    if (activeTab === "peer-reviews" && data?.uid) {
      fetchPeerReviews();
    }
  }, [activeTab, data?.uid]);

  const fetchPublications = async () => {
    setIsLoadingPubs(true);
    try {
      // Simulate fetching data (replace with actual API call)
      const pubs = dummyPublications; // Use dummy data for now
      setPublications(pubs);
    } catch (error) {
      console.error("Error fetching publications:", error);
      toast({
        title: "Error",
        description: "Failed to load publications.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPubs(false);
    }
  };

  const fetchPeerReviews = async () => {
    setIsLoadingReviews(true);
    try {
      // Simulate fetching data (replace with actual API call)
      const reviews = [dummyPeerReview]; // Use dummy data for now
      setPeerReviews(reviews);
    } catch (error) {
      console.error("Error fetching peer reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load peer reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleLike = async (postId, newLikesCount) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likesCount: newLikesCount } : post
      )
    );
  };

  const handleComment = (postId, newComment) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
              commentsCount: (post.commentsCount || 0) + 1,
            }
          : post
      )
    );
  };

  const handleEditPost = (post) => {
    // Implement your post editing logic here
    console.log("Edit post:", post);
  };

  const handleDeletePost = (postId) => {
    // Implement your post deletion logic here
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleToggleVisibility = (id) => {
    setPeerReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, visibility: !review.visibility } : review
      )
    );
    toast({
      title: "Visibility Toggled",
      description: `Peer review visibility has been updated.`,
    });
  };

  const handleEdit = (id) => {
    console.log("Edit review:", id);
    // Implement your edit logic here (e.g., open a modal to edit the review)
  };

  const dummyPeerReview = {
    id: 1,
    author: {
      name: "John Doe",
      avatar: "https://picsum.photos/seed/johndoe/200",
      title: "Senior Researcher",
    },
    relationship: "Colleague",
    date: new Date().toISOString(),
    content:
      "This is a sample peer review content. It provides feedback on the research paper.",
    visibility: true,
  };

  const dummyPublications = [
    {
      id: 1,
      fileName: "AI in Healthcare Research.pdf",
      uploadDate: new Date().toISOString(),
      fileSize: "1.2 MB",
      downloadLink: "https://example.com/download/ai_in_healthcare_research.pdf",
    },
    {
      id: 2,
      fileName: "Climate Change Mitigation Strategies.docx",
      uploadDate: new Date().toISOString(),
      fileSize: "850 KB",
      downloadLink: "https://example.com/download/climate_change_mitigation_strategies.docx",
    },
  ];

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
        <TabsList
          className="hidden md:grid w-full"
          style={{
            gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))`,
          }}
        >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <RecentActivities data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        {isOrganization && (
          <TabsContent value="members">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Organization Members
                </h3>
                <div className="grid gap-4">
                  {data.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#6366F1] text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-xs text-[#6366F1]">{member.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10"
                      >
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Posts
              </h3>
              <div className="space-y-4">
                {isLoadingPosts && posts.length === 0 ? (
                  <Post.Skeletons count={3} />
                ) : (
                  <>
                    {posts.map((post) => (
                      <ProfilePost
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                        showActions={isOwnProfile}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Publications
              </h3>
              <div className="space-y-4">
                {isLoadingPubs ? (
                  <p>Loading publications...</p> // Loading state
                ) : publications.length > 0 ? (
                  publications.map((pub) => (
                    <div key={pub.id} className="flex items-center justify-between border p-4 rounded-md shadow-sm">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-gray-500 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">{pub.fileName}</h4>
                          <p className="text-sm text-gray-500">Uploaded on: {new Date(pub.uploadDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Size: {pub.fileSize}</p>
                        </div>
                      </div>
                      <a
                        href={pub.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <p>No publications available.</p> // No publications state
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peer-reviews">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Peer Reviews
              </h3>
              <div className="space-y-6">
                {isLoadingReviews ? (
                  <p>Loading peer reviews...</p> // Loading state
                ) : peerReviews.length > 0 ? (
                  peerReviews.map((review) => (
                    <PeerReview
                      key={review.id}
                      review={review}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={handleEdit}
                    />
                  ))
                ) : (
                  <p>No peer reviews available.</p> // No reviews state
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(!pid || isOwnProfile) && (
          <TabsContent value="settings">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <SettingsTab data={data} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

const SettingsTab = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 relative group">
            <AvatarImage src={data.photoURL} />
            <AvatarFallback>{data.name?.charAt(0)}</AvatarFallback>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">Profile photo</h3>
            <p className="text-sm text-gray-500">
              This will be displayed on your profile
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={data.name} className="max-w-md" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={data.email}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select defaultValue={data.gender}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              defaultValue={data.department}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              defaultValue={data.location}
              className="max-w-md"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email notifications</Label>
                <p className="text-sm text-gray-500">
                  Get emails to find out what's going on when you're not online
                </p>
              </div>
              <Switch defaultChecked={data.emailNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push notifications</Label>
                <p className="text-sm text-gray-500">
                  Get push notifications to find out what's going on when you're
                  online
                </p>
              </div>
              <Switch defaultChecked={data.pushNotifications} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Social Accounts</h3>
          <div className="space-y-4">
            {Object.entries(data.socialLinks || {}).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <LinkIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{platform}</p>
                  <p className="text-sm text-gray-500">Not Connected</p>
                </div>
                <Button variant="outline" className="w-28">
                  {url ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Password & Security</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                className="max-w-md"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" className="max-w-md" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                className="max-w-md"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
          <div>
            <p className="text-sm text-gray-500 mb-4">
              When you delete your account, you lose access to Front account
              services, and we permanently delete your personal data.
            </p>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="confirm-delete" className="mt-1" />
              <label htmlFor="confirm-delete" className="text-sm text-gray-600">
                Confirm that I want to delete my account
              </label>
            </div>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          Update
        </Button>
      </div>
    </div>
  );
};

const PostActions = ({ post, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(post)}
        className="text-gray-600 hover:text-gray-900"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(post.id)}
        className="text-red-600 hover:text-red-900"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

Post.propTypes = {
  // ... existing props
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
};

Post.defaultProps = {
  onEdit: () => {},
  onDelete: () => {},
  showActions: false,
};
