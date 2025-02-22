'use client'
import Image from 'next/image'
import { ThumbsUp, MessageSquare, Users, Bell, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNotifications } from '@/redux/features/notificationsSlice'
import { useToast } from '@/components/ui/use-toast'
import { useNotifications } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationsFeed({ activeFilter }) {
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state?.notifications?.items) || [];
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useNotifications();

  useEffect(() => {
    setLoading(false);
  }, []);

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'just now';

    let date;
    // Check if it's a Firestore Timestamp
    if (timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      // If it's a string or number, create a new Date
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'just now';

    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_LIKE':
        return <ThumbsUp className="h-5 w-5 text-blue-500" />
      case 'POST_COMMENT':
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'CONNECTION_REQUEST':
        return <Users className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategory = (type) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
        return 'connections'
      case 'POST_COMMENT':
      case 'POST_LIKE':
        return 'interactions'
      case 'WORKFLOW_ASSIGNMENT':
        return 'projects'
      default:
        return 'all'
    }
  }

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'interactions':
        return notifications.filter(n => 
          n.type === 'POST_LIKE' || n.type === 'POST_COMMENT'
        );
      case 'connections':
        return notifications.filter(n => 
          n.type === 'CONNECTION_REQUEST'
        );
      case 'projects':
        return notifications.filter(n => 
          n.type === 'WORKFLOW_ASSIGNMENT' || n.type === 'RESEARCH_ROOM_INVITE'
        );
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications/mark_as_read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      toast({
        title: 'Success',
        description: 'Notification marked as read',
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to mark all notifications as read')

      dispatch(setNotifications(notifications.map(notification => ({ 
        ...notification, 
        read: true 
      }))));

      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive'
      });
    }
  }

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'POST_LIKE':
        return (
          <>
            <p className="text-sm font-medium">
              <span className="text-indigo-600">{notification.data.senderName}</span> liked your post
            </p>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 line-clamp-2">{notification.data.postContent}</p>
            </div>
          </>
        );
      
      case 'POST_COMMENT':
        return (
          <>
            <p className="text-sm font-medium">
              <span className="text-indigo-600">{notification.data.senderName}</span> commented on your post
            </p>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.data.postContent}</p>
              <div className="pl-3 border-l-2 border-indigo-200">
                <p className="text-sm text-gray-700">{notification.data.commentContent}</p>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <p className="text-sm">
             <span className="text-indigo-600">{notification.data.senderName}</span> {notification.data.message}
          </p>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          <div className="mt-4 text-lg">Loading notifications...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-b border-indigo-100 flex justify-between items-center">
          <h3 className="font-semibold text-indigo-900">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)]">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 ${
                  !notification.read ? 'bg-blue-50 cursor-pointer' : ''
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                {notification.sender
                  ? (
                  <img
                    src={notification.sender.photoURL}
                    alt={notification.data.senderName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                    )
                  : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                    {getIcon(notification.type)}
                  </div>
                    )}
                <div className="flex-1">
                  {renderNotificationContent(notification)}
                  {notification.createdAt && (
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
