'use client'

import { useEffect, useState } from 'react'
import { IndividualProfilePage } from '@/components/IndividualProfile'
import NavComponent from '../../../components/NavComponent'
import { useSearchParams } from 'next/navigation'

export default function IndividualProfilePreview() {
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams()
  const pid = searchParams.get('pid')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = pid
          ? `/api/profile/individual?pid=${pid}`
          : '/api/profile/individual'

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [pid])

  if (error) {
    return (
      <div className='min-h-screen bg-gray-100'>
        <NavComponent />
        <div className='text-red-500'>Error: {error}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <NavComponent />
      <div className='container mx-auto px-4 py-8'>
        <IndividualProfilePage data={profileData} />
      </div>
    </div>
  )
}
