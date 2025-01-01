import { configureStore } from '@reduxjs/toolkit'
import feedsReducer from './feedsSlice'

export const store = configureStore({
  reducer: {
    feeds: feedsReducer,
  },
}) 
