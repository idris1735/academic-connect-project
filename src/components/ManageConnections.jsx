import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserMinus, Loader2, MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast' // Import toast for notifications
import { chatService } from '@/services/chatService'
import { useRouter } from 'next/navigation'

export function ManageConnections() {
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchConnections = async () => {
      try {
        // Simulate network delay
        const response = await fetch('/api/connections')
        if (!response.ok) {
          throw new Error('Failed to load connections')
        }
        const data = await response.json()
        console.log('data', data)
        setConnections(data.validConnections)
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  const handleRemoveConnection = async (connectionId, userId) => {
    try {
      // Simulate API call to remove connection
      await fetch('/api/connections/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId }), //TODO: To be tested with a proper user
      })
      setConnections((prev) =>
        prev.filter((conn) => conn.connectionId !== connectionId)
      )
      toast({
        title: 'Succcess',
        description: 'Connection removed successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: e.message,
        variant: 'destructive',
      })
      console.error('Error removing connection:', error)
      return
    }
  }

  const handleStartChat = async (connectionId) => {
    try {
      const channel = await chatService.createDirectChannel(connectionId)
      router.push(`/messages?id=${channel.id}&type=DM`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card className='bg-white/50 backdrop-blur-sm border-none shadow-lg'>
        <CardHeader className='border-b border-indigo-100'>
          <CardTitle className='text-2xl font-bold text-indigo-900'>
            Your Connections
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-indigo-600' />
            <p className='mt-2 text-sm text-indigo-600'>
              Loading connections...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='bg-white/50 backdrop-blur-sm border-none shadow-lg'>
      <CardHeader className='border-b border-indigo-100'>
        <CardTitle className='text-2xl font-bold text-indigo-900'>
          Your Connections
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-6'>
        {connections.length === 0 ? (
          <div className='flex items-center justify-center py-8'>
            <p className='text-sm text-indigo-600'>No connections yet</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {connections.map((connection) => (
              <div
                key={connection.connectionId}
                className='flex items-center space-x-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow'
              >
                <Avatar className='h-16 w-16 border-2 border-indigo-200'>
                  <AvatarImage
                    src={connection.photoURL}
                    alt={connection.displayName}
                  />
                  <AvatarFallback className='bg-indigo-100 text-indigo-700 text-xl font-bold'>
                    {connection.displayName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-indigo-900'>
                    {connection.displayName}
                  </h3>
                  <p className='text-sm text-indigo-700'>{connection.role}</p>
                  <p className='text-sm text-indigo-600'>
                    {connection.university}
                  </p>
                </div>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-red-500 text-red-500 hover:bg-red-50 rounded-full transition-colors'
                  onClick={() =>
                    handleRemoveConnection(
                      connection.connectionId,
                      connection.userId
                    )
                  }
                >
                  <UserMinus className='h-5 w-5' />
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='ml-2'
                  onClick={() => handleStartChat(connection.connectionId)}
                >
                  <MessageCircle className='h-4 w-4 mr-1' />
                  Message
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
