'use client'
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Loader2 } from "lucide-react"

export function ConnectionInvitations() {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await fetch('/api/network/get_connections?status=received')
        if (!response.ok) {
          throw new Error('Failed to fetch invitations')
        }
        const data = await response.json()
        setInvitations(data.connections)
      } catch (error) {
        console.error('Error fetching invitations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvitations()
  }, [])

  const handleAccept = async (connectionId, userId) => {
    try {
      const response = await fetch('/api/network/accept_connection_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          connectionId,
          userId,
          action: 'accept'
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to accept invitation')
      }
      // Remove the invitation from the list
      setInvitations(prev => 
        prev.filter(inv => inv.connectionId !== connectionId)
      )
    } catch (error) {
      console.error('Error accepting invitation:', error)
    }
  }

  const handleReject = async (connectionId, userId) => {
    try {
      const response = await fetch('/api/network/reject_connection_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          connectionId,
          userId,
          action: 'reject'
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to reject invitation')
      }
      // Remove the invitation from the list
      setInvitations(prev => 
        prev.filter(inv => inv.connectionId !== connectionId)
      )
    } catch (error) {
      console.error('Error rejecting invitation:', error)
    }
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">Collaboration Requests</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-2 text-sm text-indigo-600">Loading requests...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex justify-center items-center py-5">
            <p className="text-indigo-900 text-lg">No connection requests</p>
          </div>
        ) : (
          <div className="space-y-6">
            {invitations.map((invitation) => (
              <div key={invitation.connectionId} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
                <Avatar className="h-16 w-16 border-2 border-indigo-200">
                  <AvatarImage src={invitation.photoURL} alt={invitation.name} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
                    {invitation.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-indigo-900">{invitation.name}</h3>
                  <p className="text-sm text-indigo-700">{invitation.role}</p>
                  <p className="text-sm text-indigo-600">{invitation.university}</p>
                  <p className="text-xs text-indigo-500 mt-1">
                    {invitation.mutualConnections} mutual connections
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                    onClick={() => handleAccept(invitation.connectionId, invitation.userId)}
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => handleReject(invitation.connectionId, invitation.userId)}
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

