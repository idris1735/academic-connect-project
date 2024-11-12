import { Users, Eye } from 'lucide-react'

export default function ProfileSidebar() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Strength</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full w-4/5"></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Your profile is looking good!</p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Your Network</h2>
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span>500+ connections</span>
        </div>
        <div className="flex items-center gap-3">
          <Eye className="h-5 w-5 text-gray-400" />
          <span>1,234 profile views</span>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">People Also Viewed</h2>
        <ul className="space-y-4">
          {['Jane Smith', 'Mike Johnson', 'Emily Brown'].map((name) => (
            <li key={name} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-600">Software Engineer</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}