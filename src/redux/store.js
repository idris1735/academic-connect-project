import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './features/profileSlice'
import networkReducer from './features/networkSlice'
import feedsReducer from './features/feedsSlice'
import notificationsReducer from './features/notificationsSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    network: networkReducer,
    feeds: feedsReducer,
    notifications: notificationsReducer,
  },
})

// Remove type definitions since this is a .js file
