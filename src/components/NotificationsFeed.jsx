import Image from 'next/image'
import { ThumbsUp, MessageSquare, Users, Bell } from 'lucide-react'

export default function NotificationsFeed({ activeFilter }) {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: {
        name: 'John Doe',
        avatar: 'https://picsum.photos/seed/user1/200',
      },
      content: 'liked your post',
      timestamp: '2h ago',
      category: 'connections',
    },
    {
      id: 2,
      type: 'comment',
      user: {
        name: 'Jane Smith',
        avatar: 'https://picsum.photos/seed/user2/200',
      },
      content: 'commented on your post',
      timestamp: '4h ago',
      category: 'mentions',
    },
    {
      id: 3,
      type: 'connection',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://picsum.photos/seed/user3/200',
      },
      content: 'accepted your connection request',
      timestamp: '1d ago',
      category: 'connections',
    },
    {
      id: 4,
      type: 'job',
      content: 'New job opening: Frontend Developer at TechCorp',
      timestamp: '2d ago',
      category: 'jobs',
    },
  ]

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(notification => notification.category === activeFilter)

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-5 w-5 text-blue-500" />
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'connection':
        return <Users className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {filteredNotifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-4 p-4 border-b last:border-b-0">
          {notification.user ? (
            <img
              src={notification.user.avatar}
              alt={notification.user.name}
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
              {notification.user && <strong>{notification.user.name}</strong>}{' '}
              {notification.content}
            </p>
            <span className="text-xs text-gray-500">{notification.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  )
}