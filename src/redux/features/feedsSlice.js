import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Fetch posts in smaller chunks
export const fetchPosts = createAsyncThunk(
  'feeds/fetchPosts',
  async (page = 1, { dispatch }) => {
    const response = await fetch(`/api/posts/get_posts?page=${page}&limit=5`)
    if (!response.ok) throw new Error('Failed to fetch posts')
    const data = await response.json()

    // Process and dispatch each post immediately
    data.posts.forEach((post) => {
      const processedPost = {
        ...post,
        id: post.id || `post_${Date.now()}_${Math.random()}`,
        authorTitle: post.authorTitle || 'Research Assistant',
        avatar:
          post.avatar ||
          'https://ui-avatars.com/api/?name=User&background=6366F1&color=fff',
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        comments: post.comments || [],
      }
      dispatch(addProcessedPost(processedPost)) // Dispatch each post as it is processed
    })

    return {
      hasMore: data.hasMore,
      currentPage: page,
    }
  }
)

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    filter: 'all',
    locationFilter: 'all',
    sortBy: 'recent',
    searchQuery: '',
    currentPage: 1,
    hasMore: true,
    initialLoading: true,
  },
  reducers: {
    addProcessedPost: (state, action) => {
      // Avoid duplicates
      const exists = state.posts.some((post) => post.id === action.payload.id)
      if (!exists) {
        state.posts.push(action.payload)
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload // Set the filter
    },
    setLocationFilter: (state, action) => {
      state.locationFilter = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.hasMore = action.payload.hasMore
        state.currentPage = action.payload.currentPage
        state.loading = false
        state.initialLoading = false
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.initialLoading = false
        state.error = action.error.message
      })
  },
})

export const {
  addProcessedPost,
  setFilter,
  setLocationFilter,
  setSortBy,
  setSearchQuery,
} = feedsSlice.actions
export default feedsSlice.reducer
