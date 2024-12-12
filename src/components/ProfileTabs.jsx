'use client'
import { useState, Suspense, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from './ui/button'
import { Settings, Trash2, MessageSquare, ThumbsUp, Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleEditMode } from '@/redux/features/profileSlice'
import { ProfileEditForm } from './ProfileEditForm'
import { PasswordChangeForm } from './PasswordChangeForm'
import { formatDistanceToNow } from 'date-fns'

const RecentActivities = ({ data }) => {
  const dispatch = useDispatch()
  const { activities, activitiesLastFetched } = useSelector((state) => state.profile)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      // Only fetch if we don't have data or it's older than 5 minutes
      const shouldFetch = !activitiesLastFetched || Date.now() - activitiesLastFetched > 5 * 60 * 1000

      if (!activities || shouldFetch) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/profile/activities/${data.uid}`)
          const activitiesData = await response.json()
          dispatch({
            type: 'profile/setActivities',
            payload: {
              activities: activitiesData,
              timestamp: Date.now(),
            },
          })
        } catch (error) {
          console.error('Error fetching activities:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchActivities()
  }, [data.uid, dispatch, activities, activitiesLastFetched])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
      </div>
    )
  }

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case 'post':
        return (
          <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
        )

      case 'comment':
        return (
          <div className="mt-1">
            <p className="text-sm text-gray-600">{activity.content}</p>
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>Commented on:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || 'Loading post content...'}
              </p>
            </div>
          </div>
        )

      case 'like':
        return (
          <div className="mt-1">
            <div className="mt-2 bg-gray-100 p-3 rounded-md">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ThumbsUp className="h-4 w-4 text-[#6366F1]" />
                <span>Liked:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {activity.postContent || 'Loading post content...'}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {activities?.map((activity, index) => (
        <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#6366F1] text-white">
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {data.name}
              <span className="text-[#6366F1] font-normal ml-2">
                {activity.type === 'post'
                  ? 'created a post'
                  : activity.type === 'comment'
                    ? 'commented'
                    : 'liked a post'}
              </span>
            </p>
            {renderActivityContent(activity)}
            <div className="flex items-center mt-2 text-xs text-gray-400">
              <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
              {activity.category && (
                <>
                  <span className="mx-1">•</span>
                  <span>{activity.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProfileTabs({ data, isOrganization }) {
  const [activeTab, setActiveTab] = useState('overview')
  const dispatch = useDispatch()
  const isEditing = useSelector((state) => state.profile.isEditing)

  const tabItems = [
    { value: 'overview', label: 'Overview' },
    { value: 'publications', label: 'Publications' },
    { value: 'peer-reviews', label: 'Peer Reviews' },
    { value: 'posts', label: 'Posts' },
    { value: 'settings', label: 'Settings' },
    ...(isOrganization ? [{ value: 'members', label: 'Members' }] : []),
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tab" />
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TabsList className="hidden md:grid w-full" style={{ gridTemplateColumns: `repeat(${tabItems.length}, minmax(0, 1fr))` }}>
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="data-[state=active]:bg-[#6366F1] data-[state=active]:text-white"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <Suspense fallback={
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#6366F1]" />
                </div>
              }>
                <RecentActivities data={data} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        {isOrganization && (
          <TabsContent value="members">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Organization Members</h3>
                <div className="grid gap-4">
                  {data.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-[#6366F1] text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-[#6366F1]">{member.role}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="posts">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Posts</h3>
              <div className="space-y-6">
                {data.posts?.map((post, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{post.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-8">
                {isEditing
                  ? (
                  <ProfileEditForm />
                    )
                  : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Profile Views</span>
                          <span className="text-sm font-medium">{data.profileViews || 0}</span>
                        </div>
                        <Button
                          className="w-full bg-[#6366F1] hover:bg-[#5355CC]"
                          onClick={() => dispatch(toggleEditMode())}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <PasswordChangeForm />
                    </div>
                  </>
                    )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
