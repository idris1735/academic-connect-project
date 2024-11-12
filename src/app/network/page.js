import NavComponent from '../../components/NavComponent'
import NetworkSidebar from '../../components/NetworkSidebar'
import ConnectionInvitations from '../../components/ConnectionInvitations'
import PeopleYouMayKnow from '../../components/PeopleYouMayKnow'

export default function NetworkPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavComponent />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <NetworkSidebar />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <ConnectionInvitations />
            <PeopleYouMayKnow />
          </div>
        </div>
      </main>
    </div>
  )
}