import { ProfileHeader } from './ProfileHeader'
import { StatsSection } from './StatsSection'
import { ProfileTabs } from './ProfileTabs'

export function IndividualProfilePage({ data }) {
  console.log('Profile Data:', data)
  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <ProfileHeader data={data} isOrganization={false} />
      <StatsSection data={data} />
      <ProfileTabs data={data} isOrganization={false} />
    </div>
  )
}
