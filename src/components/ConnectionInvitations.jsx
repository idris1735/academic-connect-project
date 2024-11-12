import Image from 'next/image'
import { UserPlus, X } from 'lucide-react'

export default function ConnectionInvitations() {
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Invitations</h2>
      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div key={invitation.id} className="flex items-start space-x-4">
            <img
              src={invitation.avatar}
              alt={invitation.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{invitation.name}</h3>
              <p className="text-gray-600">{invitation.role}</p>
              <p className="text-gray-500">{invitation.university}</p>
              <p className="text-sm text-gray-500 mt-1">
                {invitation.mutualConnections} mutual connections
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <UserPlus className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}