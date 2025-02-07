import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
    }
  },
});

export const { addNotification, setNotifications, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer; 