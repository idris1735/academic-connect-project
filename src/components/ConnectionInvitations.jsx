import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function ConnectionInvitations() {
  const invitations = [
    {
      id: 1,
      name: 'Dr. Emily Chen',
      role: 'Associate Professor of Chemistry',
      university: 'University of California, Berkeley',
      avatar: 'https://picsum.photos/seed/emily/200',
      mutualConnections: 12,
    },
    {
      id: 2,
      name: 'Prof. Michael Brown',
      role: 'Full Professor of Computer Science',
      university: 'Stanford University',
      avatar: 'https://picsum.photos/seed/michael/200',
      mutualConnections: 8,
    },
  ]

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">Collaboration Requests</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
              <Avatar className="h-16 w-16 border-2 border-indigo-200">
                <AvatarImage src={invitation.avatar} alt={invitation.name} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl font-bold">
                  {invitation.name.split(' ').map(n => n[0]).join('')}
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
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                  <Check className="h-5 w-5" />
                </Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}