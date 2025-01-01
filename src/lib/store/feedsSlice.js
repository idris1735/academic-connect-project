import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', async () => {
  // Add your API call here
  const response = await fetch('your-api-endpoint')
  return response.json()
})

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Add any synchronous reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default feedsSlice.reducer
