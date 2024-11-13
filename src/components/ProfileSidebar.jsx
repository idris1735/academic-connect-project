import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, Users } from "lucide-react"

export default function ProfileSidebar() {
  const stats = {
    publications: 47,
    citations: 3200,
    hIndex: 25,
    collaborators: 73
  }

  const education = [
    {
      degree: "Ph.D. in Computer Science",
      institution: "Stanford University",
      year: "2015-2019"
    },
    {
      degree: "M.S. in Computer Science",
      institution: "MIT",
      year: "2013-2015"
    },
    {
      degree: "B.S. in Computer Science",
      institution: "UC Berkeley",
      year: "2009-2013"
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-[#6366F1]" />
            Research Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6366F1]">{stats.publications}</p>
              <p className="text-sm text-gray-600">Publications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6366F1]">{stats.citations}</p>
              <p className="text-sm text-gray-600">Citations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6366F1]">{stats.hIndex}</p>
              <p className="text-sm text-gray-600">h-index</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#6366F1]">{stats.collaborators}</p>
              <p className="text-sm text-gray-600">Collaborators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6366F1]" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6366F1]" />
            Top Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Prof. Sarah Chen", "Dr. Michael Brown", "Dr. Emily Taylor"].map((name, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                  <span className="text-[#6366F1] font-medium">{name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-gray-500">Stanford University</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}