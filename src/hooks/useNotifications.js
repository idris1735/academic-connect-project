import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  setNotifications,
} from "@/redux/features/notificationsSlice";
import { playNotificationSound } from "@/utils/notificationSound";
import io from "socket.io-client";

export const useNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        // Check if the API endpoint exists first
        const response = await fetch("/api/notifications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch(() => null); // Catch network errors and return null

        // If the response doesn't exist or isn't ok, don't throw an error
        if (!response?.ok) {
          console.warn("Notifications API not available");
          return;
        }

        const data = await response.json();
        if (isMounted) {
          dispatch(setNotifications(data));
        }
      } catch (error) {
        console.warn("Error fetching notifications:", error);
        // Don't throw the error, just log it to prevent breaking other functionality
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up WebSocket listener for real-time updates
    let socket;
    try {
      socket = io("http://localhost:3000", {
        reconnectionAttempts: 3,
        timeout: 10000,
      });

      socket.on("connect_error", (error) => {
        console.warn("WebSocket connection error:", error);
      });

      socket.on("notification", (notification) => {
        if (isMounted) {
          dispatch(addNotification(notification));
          playNotificationSound();
        }
      });
    } catch (error) {
      console.warn("WebSocket initialization error:", error);
    }

    // Fetch periodically as a backup
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      isMounted = false;
      if (socket?.connected) {
        socket.disconnect();
      }
      clearInterval(interval);
    };
  }, [dispatch]);
};
