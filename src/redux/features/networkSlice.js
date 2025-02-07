import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Dummy data
const dummySuggestions = [
  {
    id: 'researcher_1',
    userId: 'user_123',
    name: 'Dr. Sarah Johnson',
    role: 'Postdoctoral Researcher in Neuroscience',
    university: 'Harvard University',
    avatar: 'https://picsum.photos/seed/sarah/200',
    mutualConnections: 15,
    researchInterests: ['Cognitive Neuroscience', 'Brain-Computer Interfaces'],
    connectionStatus: 'none'
  },
  {
    id: 'researcher_2',
    userId: 'user_124',
    name: 'Prof. David Lee',
    role: 'Assistant Professor of Economics',
    university: 'MIT',
    avatar: 'https://picsum.photos/seed/david/200',
    mutualConnections: 7,
    researchInterests: ['Behavioral Economics', 'Game Theory'],
    connectionStatus: 'none'
  },
  {
    id: 'researcher_3',
    userId: 'user_125',
    name: 'Dr. Maria Rodriguez',
    role: 'Research Scientist in Artificial Intelligence',
    university: 'Carnegie Mellon University',
    avatar: 'https://picsum.photos/seed/maria/200',
    mutualConnections: 10,
    researchInterests: ['Machine Learning', 'Natural Language Processing'],
    connectionStatus: 'none'
  },
]

// Simulated async thunks
export const fetchSuggestions = createAsyncThunk(
  'network/fetchSuggestions',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return dummySuggestions
  }
)

export const sendConnectionRequest = createAsyncThunk(
  'network/sendConnectionRequest',
  async (userId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return { userId }
  }
)

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    suggestions: [],
    connections: [],
    pendingRequests: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false
        state.suggestions = action.payload
        state.error = null
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        const suggestion = state.suggestions.find(
          s => s.userId === action.payload.userId
        )
        if (suggestion) {
          suggestion.connectionStatus = 'pending'
        }
      })
  }
})

export default networkSlice.reducer 