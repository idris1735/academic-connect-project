import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './features/profileSlice'
import networkReducer from './features/networkSlice'
import feedsReducer from './features/feedsSlice'
import notificationsReducer from './features/notificationsSlice'
import workflowReducer from './features/workflowSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    network: networkReducer,
    feeds: feedsReducer,
    notifications: notificationsReducer,
    workflow: workflowReducer,
  },
})

// Remove type definitions since this is a .js file
