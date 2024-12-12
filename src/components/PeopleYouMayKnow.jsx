import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

export function PeopleYouMayKnow() {
  const suggestions = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Postdoctoral Researcher in Neuroscience',
      university: 'Harvard University',
      avatar: 'https://picsum.photos/seed/sarah/200',
      mutualConnections: 15,
      researchInterests: ['Cognitive Neuroscience', 'Brain-Computer Interfaces'],
    },
    {
      id: 2,
      name: 'Prof. David Lee',
      role: 'Assistant Professor of Economics',
      university: 'MIT',
      avatar: 'https://picsum.photos/seed/david/200',
      mutualConnections: 7,
      researchInterests: ['Behavioral Economics', 'Game Theory'],
    },
    {
      id: 3,
      name: 'Dr. Maria Rodriguez',
      role: 'Research Scientist in Artificial Intelligence',
      university: 'Carnegie Mellon University',
      avatar: 'https://picsum.photos/seed/maria/200',
      mutualConnections: 10,
      researchInterests: ['Machine Learning', 'Natural Language Processing'],
    },
  ]

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="border-b border-indigo-100">
        <CardTitle className="text-2xl font-bold text-indigo-900">Researchers in Your Field</CardTitle>
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
                  <h3 className="text-xl font-semibold text-indigo-900 mb-1">{suggestion.name}</h3>
                  <p className="text-sm text-indigo-700 mb-1">{suggestion.role}</p>
                  <p className="text-sm text-indigo-600 mb-2">{suggestion.university}</p>
                  <p className="text-xs text-indigo-500 mb-3">
                    {suggestion.mutualConnections} mutual connections
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {suggestion.researchInterests.map((interest, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
