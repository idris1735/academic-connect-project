"use client";
import { useState, Suspense, useEffect, useRef } from "react";
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
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Pencil,
  Eye,
  EyeOff,
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
import { redirect } from "next/navigation";

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
              <AvatarImage className="rounded-full" src={`/${data.photoURL}`} />
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPublication, setCurrentPublication] = useState(null);
  const [newPublicationName, setNewPublicationName] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

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
              `/api/posts/user?uid=${data.uid}&page=1&limit=${POSTS_PER_PAGE}`
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
        `/api/posts?uid=${data.uid}&page=${page}&limit=${POSTS_PER_PAGE}`
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


 
  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp) return 'Invalid date';
  
    // Convert Firestore Timestamp to JavaScript Date
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';
  
    // Extract components
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // Get short month name
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Determine the suffix for the day (st, nd, rd, th)
    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${suffix(day)}, ${month} ${year}, ${hours}:${minutes}`;
  };

  const fetchPublications = async () => {
    setIsLoadingPubs(true);
    try {
      let response;
      if (isOwnProfile) {
        response = await fetch("/api/profile/publications");
      } else {
        response = await fetch("/api/profile/publications", {
          method: 'POST',
          body: JSON.stringify({ uid:data?.uid }),
          headers: {
            'Content-Type': 'application/json', // Ensure the content type is set
          },
        });
      }
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }
      const pubs = await response.json();

      // Iterate through pubs to create download links and format dates
      const updatedPubs = await Promise.all(pubs.map(async pub => {
        // Fetch the file using the publication URL
        const fileResponse = await fetch(`/${pub.publicationUrl}`);
        if (!fileResponse.ok) {
          throw new Error('Failed to fetch file');
        }
         // Check if the response is a Blob
        const contentType = fileResponse.headers.get('Content-Type');
        console.log('Content-Type:', contentType);

        // Ensure the response is a Blob
        const fileBlob = await fileResponse.blob(); // Get the file as a Blob
        if (!fileBlob || !(fileBlob instanceof Blob)) {
          throw new Error('Response is not a valid Blob');
        }
        const downloadLink = URL.createObjectURL(fileBlob); // Create a temporary download link
        console.log('pub.uploadDate:', pub.uploadDate);
        const formattedDate = formatFirestoreTimestamp(pub.uploadDate); // Assuming pub.uploadDate is a Firestore Timestamp
        return {
          ...pub,
          downloadLink, // Add the temporary download link
          uploadDate: formattedDate, // Update the upload date to a formatted string
        };
      }));

      setPublications(updatedPubs); // Update the state with the modified publications
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


  const handleEdit = (id) => {
    console.log("Edit review:", id);
    // Implement your edit logic here (e.g., open a modal to edit the review)
  };


  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });

      // Refresh the page to show new avatar
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleToggleVisibility = async (publicationId) => {
    setLoading(true); // Set loading to true when the action starts
    try {
      const publication = publications.find(pub => pub.id === publicationId);
      const newVisibility = !publication.isPublic;
      
      const response = await fetch(`/api/profile/publications?action=visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicationId, isPublic: newVisibility }),
      });

      if (!response.ok) {
        throw new Error('Failed to update publication visibility');
      }

      setPublications((prev) =>
        prev.map((pub) =>
          pub.id === publicationId ? { ...pub, isPublic: newVisibility } : pub
        )
      );

      toast({
        title: "Success",
        description: "Publication visibility updated successfully.",
      });
    } catch (error) {
      console.error('Error updating publication visibility:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state after the action completes
    }
  };

  const handleEditPublication = async (publicationId, publicationName, fileType) => {
    console.log('Save publication');
    try {
      const response = await fetch('/api/profile/publications?action=edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicationId, publicationName, fileType }), // Send the publication ID and new name
      });
      console.log('sent request');

      if (!response.ok) {
        throw new Error('Failed to update publication');
      }
      console.log('response ok');
      // Update the local state
      setPublications((prev) =>
        prev.map((pub) =>
          pub.id === publicationId ? { ...pub, fileName: publicationName } : pub
        )
      );
      console.log('updated state');
      toast({
        title: "Success",
        description: "Publication name updated successfully.",
      });
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletePublication = async (publicationId, publicationUrl, publicationName) => {
    try {
      const response = await fetch(`/api/profile/publications`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicationId, publicationUrl, publicationName }), // Send the publication ID
      });

      if (!response.ok) {
        throw new Error('Failed to delete publication');
      }

      // Update the local state
      setPublications((prev) => prev.filter((pub) => pub.id !== publicationId));
      toast({
        title: "Success",
        description: "Publication deleted successfully.",
      });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPublication = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf, .doc, .docx, .ppt, .pptx'; // Accept only document types
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const fileName = file.name;
          const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert size to MB
          const downloadLink = URL.createObjectURL(file); // Create a temporary URL for the file

          const formData = new FormData()
          formData.append('file', file);
          formData.append('fileName', fileName);
          formData.append('fileSize', fileSize);

          
          const response = await fetch('/api/profile/publications', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            toast({
              title: "Error",
              description: `Failed to add publication, ${response.statusText}`,
              variant: "destructive",
            });
            return;
          } 
          const data = await response.json();

          const newPublication = {
            id: data.pub.id, // Simple ID generation
            fileName,
            uploadDate: 'Just now',
            fileSize,
            fileType: data.pub.fileType,
            downloadLink,
            publicationUrl: data.pub.publicationUrl,
            isPublic: data.pub.isPublic,
          };
          console.log(newPublication);  
          setPublications((prev) => [...prev, newPublication]);
          toast({
            title: "Success",
            description: `Publication ${fileName} added successfully.`,
          });
        } catch (error) {
          console.error('Error adding publication:', error);
          toast({
            title: "Error",
            description: `Failed to add publication, ${error.message}`,
            variant: "destructive",
          });
        }
      }
    };
    fileInput.click(); // Open the file dialog
  };

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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Publications
                </h3>
                {isOwnProfile && (
                <Button
                  variant="outline"
                  onClick={handleAddPublication}
                >
                  +
                </Button>
              )}
              </div>
              <div className="space-y-4">
                {isLoadingPubs ? (
                  <p>Loading publications...</p>
                ) : publications.length > 0 ? (
                  publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="flex items-center justify-between border p-4 rounded-md shadow-sm"
                    >
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-gray-500 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {pub.fileName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            File Type: {pub.fileType || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Uploaded on:{" "}
                            {pub.uploadDate}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {pub.fileSize}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={pub.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                        {isOwnProfile && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentPublication(pub);
                                setNewPublicationName(pub.fileName);
                                setEditModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentPublication(pub);
                                setDeleteModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <button
                              onClick={() => handleToggleVisibility(pub.id)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {pub.isPublic ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No publications available.</p>
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center indigo-600 bg-opacity-50 ">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold">Edit Publication Name</h3>
            <input
              type="text"
              value={newPublicationName}
              onChange={(e) => setNewPublicationName(e.target.value)}
              className="border p-2 w-full mt-2"
            />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                variant="outline"
                onClick={() => handleEditPublication(currentPublication.id, newPublicationName, currentPublication.fileType)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center indigo-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this publication?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeletePublication(currentPublication.id, currentPublication.publicationUrl, currentPublication.fileName)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SettingsTab = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatingSocial, setUpdatingSocial] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    gender: data.gender || "",
    department: data.department || "",
    location: data.location || "",
    emailNotifications: data.settings?.notifications?.email ?? true,
    pushNotifications: data.settings?.notifications?.push ?? true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    confirmDelete: false,
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: data.socialLinks?.instagram || "",
    linkedin: data.socialLinks?.linkedin || "",
    twitter: data.socialLinks?.twitter || "",
    website: data.socialLinks?.website || "",
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });

      // Refresh the page to show new avatar
      // window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: formData.gender,
          department: formData.department,
          location: formData.location,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications: formData.emailNotifications,
          pushNotifications: formData.pushNotifications,
        }),
      });

      if (!response.ok)
        throw new Error("Failed to update notification settings");

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!formData.confirmDelete) {
      toast({
        title: "Error",
        description: "Please confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast({
        title: "Success",
        description: "Account deleted successfully",
      });

      // Redirect to login page
      redirect("/signup");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLinkUpdate = async (platform) => {
    if (isLoading || updatingSocial) return;

    setUpdatingSocial(platform);
    try {
      // Log the request payload for debugging
      console.log("Updating social link:", {
        platform,
        url: socialLinks[platform],
      });

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          url: socialLinks[platform] || "", // Ensure url is never undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update social link");
      }

      const data = await response.json();
      console.log("Update response:", data); // Log the response

      toast({
        title: "Success",
        description: `${platform} link updated successfully`,
      });
    } catch (error) {
      console.error("Error updating social link:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingSocial("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar
              className="h-20 w-20 cursor-pointer"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={`/${data.photoURL}`} />
              <AvatarFallback>{data.name?.[0]}</AvatarFallback>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                {isUploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">Profile photo</h3>
            <p className="text-sm text-gray-500">
              Click to update your profile photo
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              defaultValue={data.name}
              className="max-w-md"
              disabled
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              disabled
              defaultValue={data.email}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
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
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="max-w-md"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
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
              <Switch
                name="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailNotifications: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push notifications</Label>
                <p className="text-sm text-gray-500">
                  Get push notifications in-app
                </p>
              </div>
              <Switch
                name="pushNotifications"
                checked={formData.pushNotifications}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    pushNotifications: checked,
                  }))
                }
              />
            </div>
            <Button onClick={handleNotificationUpdate} disabled={isLoading}>
              Update Notifications
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Social Accounts</h3>
          <div className="space-y-4">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {platform === "instagram" && (
                    <Instagram className="h-5 w-5 text-gray-600" />
                  )}
                  {platform === "linkedin" && (
                    <Linkedin className="h-5 w-5 text-gray-600" />
                  )}
                  {platform === "twitter" && (
                    <Twitter className="h-5 w-5 text-gray-600" />
                  )}
                  {platform === "website" && (
                    <Globe className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">{platform}</p>
                  <Input
                    value={url}
                    onChange={(e) =>
                      setSocialLinks((prev) => ({
                        ...prev,
                        [platform]: e.target.value,
                      }))
                    }
                    placeholder={`Enter your ${platform} URL`}
                    className="mt-1"
                    disabled={updatingSocial === platform}
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-28"
                  onClick={() => handleSocialLinkUpdate(platform)}
                  disabled={updatingSocial === platform}
                >
                  {updatingSocial === platform ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : url ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
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
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="max-w-md"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="max-w-md"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="max-w-md"
              />
            </div>
            <Button
              onClick={handlePasswordUpdate}
              disabled={
                isLoading ||
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword
              }
            >
              Update Password
            </Button>
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
              <input
                type="checkbox"
                id="confirm-delete"
                name="confirmDelete"
                checked={formData.confirmDelete}
                onChange={handleInputChange}
                className="mt-1"
              />
              <label htmlFor="confirm-delete" className="text-sm text-gray-600">
                Confirm that I want to delete my account
              </label>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading || !formData.confirmDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={handleProfileUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
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
