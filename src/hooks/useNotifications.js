import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification, setNotifications } from '@/redux/features/notificationsSlice';
import { playNotificationSound } from '@/utils/notificationSound';
import io from 'socket.io-client';

export const useNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/get_notifications');
        if (response.ok) {
          const data = await response.json();
          dispatch(setNotifications(data.notifications));
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up WebSocket listener for real-time updates
    const socket = io('http://localhost:3000');
    
    socket.on('notification', (notification) => {
      // Add the new notification to the existing ones
      dispatch(addNotification(notification));
      playNotificationSound();
    });

    // No need for polling if we have real-time updates
    // Only fetch periodically as a backup
    const interval = setInterval(fetchNotifications, 60000); // Every minute as backup

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [dispatch]);
}; 