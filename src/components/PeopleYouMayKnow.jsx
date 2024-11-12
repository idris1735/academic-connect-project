import Image from 'next/image'
import { UserPlus } from 'lucide-react'

export default function PeopleYouMayKnow() {
  const suggestions = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Postdoctoral Researcher in Neuroscience',
      university: 'Harvard University',
      avatar: 'https://picsum.photos/seed/sarah/200',
      mutualConnections: 15,
    },
    {
      id: 2,
      name: 'Prof. David Lee',
      role: 'Assistant Professor of Economics',
      university: 'MIT',
      avatar: 'https://picsum.photos/seed/david/200',
      mutualConnections: 7,
    },
    {
      id: 3,
      name: 'Dr. Maria Rodriguez',
      role: 'Research Scientist in Artificial Intelligence',
      university: 'Carnegie Mellon University',
      avatar: 'https://picsum.photos/seed/maria/200',
      mutualConnections: 10,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">People You May Know</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex flex-col items-center text-center">
            <img
              src={suggestion.avatar}
              alt={suggestion.name}
              width={100}
              height={100}
              className="rounded-full mb-2"
            />
            <h3 className="text-lg font-semibold">{suggestion.name}</h3>
            <p className="text-gray-600 text-sm">{suggestion.role}</p>
            <p className="text-gray-500 text-sm">{suggestion.university}</p>
            <p className="text-sm text-gray-500 mt-1">
              {suggestion.mutualConnections} mutual connections
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}