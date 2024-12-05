'use client'

import { useState, useEffect } from 'react'
import NavComponent from '../../components/NavComponent'
import ProfileSidebar from '../../components/ProfileSlidebar'
import PostCreation from '../../components/PostCreation'
import Post from '../../components/Post'
import RightSidebar from '../../components/RightSidebar'
import SearchBar from '../../components/SearchBar'
import { MapPin, Clock } from 'lucide-react'

export default function Feeds() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')

  // useEffect(() => {
  //   // Simulating API call to fetch posts
   
  //   const fetchedPosts = [
  //     {
  //       id: 1,
  //       author: 'Dr. Sarah Johnson',
  //       authorTitle: 'Research Scientist | AI & Machine Learning | PhD Stanford',
  //       authorLocation: 'San Francisco, CA',
  //       connectionDegree: '1st',
  //       avatar: 'https://picsum.photos/seed/user1/200',
  //       content: 'Excited to announce our new research project on quantum computing applications in drug discovery. Looking for collaborators!',
  //       timestamp: '2h ago',
  //       likes: 15,
  //       comments: [
  //         { id: 1, author: 'Prof. Jane Smith', content: 'Interested in collaboration!', timestamp: '1h ago' }
  //       ],
  //       image: 'https://picsum.photos/seed/quantum/800/600',
  //       category: 'research',
  //       location: 'San Francisco',
  //       projectRoom: 'quantum-computing-research'
  //     },
  //     {
  //       id: 2,
  //       author: 'Prof. Michael Chen',
  //       authorTitle: 'Department Head | Molecular Biology | Harvard University',
  //       authorLocation: 'Boston, MA',
  //       connectionDegree: '2nd',
  //       avatar: 'https://picsum.photos/seed/user2/200',
  //       content: 'Publishing our findings on CRISPR applications in cancer treatment. Open for discussion and future collaboration.',
  //       timestamp: '4h ago',
  //       likes: 28,
  //       comments: [],
  //       image: 'https://picsum.photos/seed/biology/800/600',
  //       category: 'publication',
  //       location: 'Boston',
  //       projectRoom: 'crispr-research'
  //     }
  //   ]
  //   setPosts(fetchedPosts)
  // }, [])
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/get_posts');
        const data = await response.json();
        console.log(data.posts);
  
        // Enrich each post with additional information
        const enrichedPosts = data.posts.map((post) => ({
          ...post,
          authorTitle: 'Research Assistant | Computer Science | MIT',
          authorLocation: 'Cambridge, MA',
          connectionDegree: '1st',
          avatar: 'https://picsum.photos/seed/currentuser/200',
          timestamp: post.timestamp || new Date().toISOString(), // Use server timestamp or fallback
        }));
        console.log(enrichedPosts);
        // Update the state with enriched posts
        setPosts(enrichedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []); // Dependency array is empty to run only once
  

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
    };
  
    // Prepend the complete post to the list
    setPosts([completePost, ...posts]);
  };
  

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
          id: Date.now(),
          author: 'Current User',
          content: comment,
          timestamp: 'Just now'
        }]
      } : post
    ))
  }

  const handleJoinRoom = (projectRoom) => {
    console.log(`Joining chat room: ${projectRoom}`)
    // Implement chat room joining logic here
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    // You can add additional search logic here if needed
  }

  const filteredPosts = posts
    .filter(post => filter === 'all' || post.category === filter)
    .filter(post => locationFilter === 'all' || post.location === locationFilter)
    .filter(post => 
      post.userInfo.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfileSidebar />
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            <PostCreation onPostCreate={addPost} />
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <SearchBar
                placeholder="Search profiles or posts..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setFilter('all')}
                >
                  All Posts
                </button>
                <button 
                  className={`px-4 py-2 rounded-full ${filter === 'research' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setFilter('research')}
                >
                  Research
                </button>
                <button 
                  className={`px-4 py-2 rounded-full ${filter === 'publication' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => setFilter('publication')}
                >
                  Publications
                </button>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <select 
                    className="border rounded-md px-2 py-1"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Boston">Boston</option>
                    <option value="Cambridge">Cambridge</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <select 
                    className="border rounded-md px-2 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="relevant">Most Relevant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts */}
            {filteredPosts.map(post => (
              <Post 
                key={post.id} 
                post={post} 
                onLike={handleLike} 
                onComment={handleComment}
                onJoinRoom={handleJoinRoom}
              />
            ))}
          </div>
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}

