import { ProfileHeader } from './ProfileHeader'
import { StatsSection } from './StatsSection'
import { ProfileTabs } from './ProfileTabs'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function OrganizationProfilePage({ data }) {
  if (!data) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='bg-gray-100 min-h-screen pb-12'>
      <ProfileHeader data={data} isOrganization={true} />
      <StatsSection data={data} />
      <ProfileTabs data={data} isOrganization={true} />
    </div>
  )
}
