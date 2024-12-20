'use client'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Loader2 } from 'lucide-react'

export function ConnectionInvitations() {
  const [requests, setRequests] = useState([])
  const [invitation, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // const response = await fetch('/api/network/get_connections?status=received')
        // if (!response.ok) {
        //   throw new Error('Failed to fetch invitations')
        // }
        // const data = await response.json()
        setInvitations([])
      } catch (error) {
        console.error('Error fetching requests:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/connections/pending')
        if (!response.ok) {
          throw new Error('Failed to load pending requests')
        }
        const data = await response.json()
        setRequests(prev => {
          const requestsMap = new Map([...prev, ...data.received].map(request => [request.connectionId, request]));
          return Array.from(requestsMap.values())
        })
        console.log(data.received)
      } catch (error) {
        console.error('Error fetching pending requests:', error)
      } finally {
        setLoading(false)
      }
    }

    // fetchInvitations()
    fetchPendingRequests()
  }, [])

  const handleAccept = async (connectionId, userId) => {
    try {
      const response = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          connectionId,
          userId,
          accept: true
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to accept request')
      }
      setInvitations(prev => 
        prev.filter(inv => inv.connectionId !== connectionId)
      )
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  const handleReject = async (connectionId, userId) => {
    try {
      const response = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          connectionId,
          userId,
          accept: false
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to reject request')
      }
      setInvitations(prev => 
        prev.filter(req => req.connectionId !== connectionId)
      )
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardHeader className="border-b border-indigo-100">
          <CardTitle className="text-2xl font-bold text-indigo-900">Connection Request</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-2 text-sm text-indigo-600">Loading requests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">Connection requests</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {requests.length === 0 ? ( // Check if there are no invitations
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-indigo-600">No connection requests</p>
            </div>
          ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <div key={request.connectionId} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <Avatar className="h-16 w-16 border-2 border-indigo-200">
                <AvatarImage src={request.photoURL} alt={request.displayName} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
                  {request.displayName?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-indigo-900">{request.displayName}</h3>
                <p className="text-sm text-indigo-700">{request.role}</p>
                <p className="text-sm text-indigo-600">{request.university}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                  onClick={() => handleAccept(request.connectionId, request.connectionData.senderId)}
                >
                  <Check className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => handleReject(request.connectionId, request.connectionData.senderId)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
