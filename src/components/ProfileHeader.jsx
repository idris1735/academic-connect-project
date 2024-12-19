import { CheckCircle, Instagram, Linkedin, Twitter, Globe, Building2, User, MapPin, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export function ProfileHeader({ data, isOrganization }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionState, setConnectionState] = useState({
    connected: false,
    pendingSent: false,
    pendingReceived: false
  });
  const { toast } = useToast()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/users/current')
        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData.user)
          setIsOwnProfile(userData.user.uid === data.uid)

          if (userData.user.uid !== data.uid) {
            const statusResponse = await fetch(`/api/connections/status/${data.uid}`)
            if (statusResponse.ok) {
              const { connected, pendingSent, pendingReceived } = await statusResponse.json()
              console.log('Connection Status:', { connected, pendingReceived, pendingSent })
              if (pendingSent) {
                setConnectionState('sent')
                console.log('Connection State:', 'pending')
              } else if (connected) {
                setConnectionState('connected')
                console.log('Connection State:', 'connected')
              } else if (pendingReceived) {
                setConnectionState('received')
                console.log('Connection State:', 'none')
              }
              else {
                setConnectionState('none')
              }
            }
          }
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchCurrentUser()
  }, [data.uid])

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/connections/request/${data.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) throw new Error('Failed to send request')

      setConnectionState('pending')
      toast({
        title: 'Success',
        description: 'Connection request sent successfully'
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderConnectionButton = () => {
    if (isLoading) {
      return (
        <Button disabled className="bg-[#6366F1]">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Connecting...
        </Button>
      )
    }

    switch (connectionState) {
      case 'sent':
        return (
          <Button disabled className="bg-gray-500">
            Request Sent
          </Button>
        )
      case 'connected':
        return (
          <Button disabled className="bg-green-500">
            Connected
          </Button>
        )
      case 'received':
        return (
          <Button disabled className="bg-gray-500">
            Request Received
          </Button>
        )
      default:
        return (
          <Button 
            className="bg-[#6366F1] hover:bg-[#5355CC]"
            onClick={handleConnect}
            disabled={connectionState === 'sent' || connectionState === 'connected' || connectionState === 'received'}
          >
            Connect
          </Button>
        )
    }
  }

  if (!data) {
    return <div>Loading...</div>
  }

  const formatMemberSince = (dateString) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: false })
    } catch (error) {
      console.error('Error formatting date:', error)
      return dateString
    }
  }

  return (
    <div className="relative">
      <div className="h-48 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-24 text-center">
          <Avatar className="h-32 w-32 rounded-full ring-4 ring-white inline-flex">
            <AvatarFallback className="text-4xl font-semibold bg-[#6366F1] text-white">
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 flex items-center justify-center">
            {data.name}
            {data.verified && (
              <CheckCircle className="h-5 w-5 text-[#6366F1] fill-current ml-2" />
            )}
          </h1>
        </div>
        <div className="mt-6 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <Building2 className="h-4 w-4 mr-1" />
              <span>{data.institution}</span>
            </div>
            {!isOrganization && data.department && (
              <div className="flex items-center justify-center text-gray-600 text-sm">
                <User className="h-4 w-4 mr-1" />
                <span>{data.department}</span>
              </div>
            )}
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{data.location}</span>
            </div>
            <div className="flex items-center justify-center text-gray-600 text-sm">
              <User className="h-4 w-4 mr-1" />
              <span>Member for {formatMemberSince(data.memberSince)}</span>
            </div>
          </div>
          {!isOwnProfile && (
            <div className="mt-6 flex justify-center space-x-4">
              {renderConnectionButton()}
              <Button variant="outline" className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
                Message
              </Button>
            </div>
          )}
          <div className="mt-6 flex justify-center space-x-6">
            {Object.entries(data.socialLinks).map(([platform, url]) => {
              const Icon = { instagram: Instagram, linkedin: Linkedin, twitter: Twitter, website: Globe }[platform]
              return (
                <a key={platform} href={url} className="text-gray-500 hover:text-[#6366F1] transition-colors">
                  <span className="sr-only">{platform}</span>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
