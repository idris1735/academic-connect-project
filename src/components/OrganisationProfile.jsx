import { ProfileHeader } from './ProfileHeader'
import { StatsSection } from './StatsSection'
import { ProfileTabs } from './ProfileTabs'

export function OrganizationProfilePage({ data }) {
  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <ProfileHeader data={data} isOrganization={true} />
      <StatsSection data={data} />
      <ProfileTabs data={data} isOrganization={true} />
    </div>
  )
}
