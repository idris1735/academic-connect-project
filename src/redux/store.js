import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './features/profileSlice'

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
})

// Remove type definitions since this is a .js file
