import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunks
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData) => {
    // Add API call here
    return profileData
  }
)

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async ({ currentPassword, newPassword }) => {
    // Add API call here
    return true
  }
)

export const deletePost = createAsyncThunk(
  'profile/deletePost',
  async (postId) => {
    // Add API call here
    return postId
  }
)

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileData: null,
    isLoading: false,
    error: null,
    isEditing: false,
  },
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload
    },
    toggleEditMode: (state) => {
      state.isEditing = !state.isEditing
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profileData = action.payload
        state.isEditing = false
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.profileData.posts = state.profileData.posts.filter(
          post => post.id !== action.payload
        )
      })
  },
})

export const { setProfileData, toggleEditMode } = profileSlice.actions
export default profileSlice.reducer