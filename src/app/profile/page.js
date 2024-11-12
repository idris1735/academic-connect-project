import NavComponent from '../../components/NavComponent'
import ProfileHeader from '../../components/ProfileHeader'
import ProfileContent from '../../components/ProfileContent'
import ProfileSidebar from '../../components/ProfileSidebar'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <main className="container mx-auto px-4 py-8">
        <ProfileHeader />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfileContent />
          </div>
          <ProfileSidebar />
        </div>
      </main>
    </div>
  )
}