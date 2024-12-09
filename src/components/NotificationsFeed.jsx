'use client'
import Image from 'next/image'
import { ThumbsUp, MessageSquare, Users, Bell, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dummyNotifications } from '@/lib/dummyNotifications'

export default function NotificationsFeed({ activeFilter }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000)
    
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + ' years ago'
    
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + ' months ago'
    
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + ' days ago'
    
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + ' hours ago'
    
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + ' minutes ago'
    
    return Math.floor(seconds) + ' seconds ago'
  }

  useEffect(() => {
    // // For testing with dummy data
    // setNotifications(dummyNotifications)
    // setLoading(false)

    // Real API implementation (commented out)
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/get_notifications')
        if (!response.ok) throw new Error('Failed to fetch notifications')
        const data = await response.json()
        setNotifications(data.notifications)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
        return <Users className="h-5 w-5 text-purple-500" />
      case 'MESSAGE':
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'LIKE':
        return <ThumbsUp className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getCategory = (type) => {
    switch (type) {
      case 'CONNECTION_REQUEST':
        return 'connections'
      case 'MESSAGE':
        return 'mentions'
      case 'PROJECT':
        return 'projects'
      default:
        return 'all'
    }
  }

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(notification => getCategory(notification.type) === activeFilter)

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications/mark_as_read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })

      if (!response.ok) throw new Error('Failed to mark notification as read')

      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark_all_as_read', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to mark all notifications as read')

      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

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
      {filteredNotifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No notifications found
        </div>
      ) : (
        filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`flex items-start gap-4 p-4 border-b last:border-b-0 ${
              !notification.read ? 'bg-blue-50 cursor-pointer' : ''
            }`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            {notification.sender ? (
              <img
                src={notification.sender.photoURL}
                alt={notification.sender.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                {getIcon(notification.type)}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm">
                {notification.sender && <strong>{notification.sender.name}</strong>}{' '}
                {notification.message}
              </p>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(notification.createdAt.toDate())}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}