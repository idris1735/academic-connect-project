import { ProfileHeader } from './ProfileHeader'
import { StatsSection } from './StatsSection'
import { ProfileTabs } from './ProfileTabs'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function IndividualProfilePage({ data }) {
  console.log('Profile Data:', data)
  if (!data) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='bg-gray-100 min-h-screen pb-12'>
      <ProfileHeader data={data} isOrganization={false} />
      <StatsSection data={data} />
      <ProfileTabs data={data} isOrganization={false} />
    </div>
  )
}
