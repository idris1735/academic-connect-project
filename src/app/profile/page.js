import NavComponent from '../../components/NavComponent'
import ProfileHeader from '../../components/ProfileHeader'
import ProfileContent from '../../components/ProfileContent'
import ProfileSidebar from '../../components/ProfileSidebar'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileHeader />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ProfileContent />
          </div>
          <div className="lg:col-span-4">
            <ProfileSidebar />
          </div>
    </div>
    </div>
    </main>
    </div>
  )
}