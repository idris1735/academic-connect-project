'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Loader2 } from 'lucide-react'
import { fetchSuggestions, sendConnectionRequest } from '@/redux/features/networkSlice'
import { addNotification } from '@/redux/features/notificationsSlice'

export function PeopleYouMayKnow() {
  const dispatch = useDispatch()
  const { suggestions, loading, error } = useSelector((state) => state.network)

  useEffect(() => {
    dispatch(fetchSuggestions())
  }, [dispatch])

  const handleConnect = async (userId, suggestion) => {
    try {
      await dispatch(sendConnectionRequest(userId)).unwrap()
      const notification = {
        type: 'CONNECTION_REQUEST',
        message: `You are now connected with ${suggestion.name}`,
        createdAt: new Date().toISOString(),
        sender: { name: suggestion.name, photoURL: suggestion.avatar },
      };
      dispatch(addNotification(notification));
      const audio = new Audio('/mixkit-correct-answer-tone-2870.wav');
      audio.play();
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
        <CardContent className="text-red-500 text-center py-8">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">
          Researchers in Your Field
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex flex-col items-center text-center flex-grow">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-indigo-200">
                    <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-bold">
                      {suggestion.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-indigo-900 mb-1">
                    {suggestion.name}
                  </h3>
                  <p className="text-sm text-indigo-700 mb-1">{suggestion.role}</p>
                  <p className="text-sm text-indigo-600 mb-2">
                    {suggestion.university}
                  </p>
                  <p className="text-xs text-indigo-500 mb-3">
                    {suggestion.mutualConnections} mutual connections
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {suggestion.researchInterests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="bg-data = {
      //   connectionData,
      //   connections,
      // }indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-auto"
                  onClick={() => handleConnect(suggestion.userId, suggestion)}
                  disabled={suggestion.connectionStatus === 'pending'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {suggestion.connectionStatus === 'pending' ? 'Request Sent' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
