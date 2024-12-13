import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './features/profileSlice'
import networkReducer from './features/networkSlice'
import feedsReducer from './features/feedsSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    network: networkReducer,
    feeds: feedsReducer,
  },
})

// Remove type definitions since this is a .js file
