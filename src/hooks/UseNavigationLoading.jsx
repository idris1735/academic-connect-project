'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleStop = () => {
      setIsLoading(false)
    }

    // Subscribe to router events
    window.addEventListener('beforeunload', handleStart)
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link?.href && !link.href.startsWith('javascript:')) {
        handleStart()
      }
    })

    // Handle route change complete
    const handleRouteChangeComplete = () => {
      handleStop()
    }

    // Add event listeners
    router.events?.on('routeChangeStart', handleStart)
    router.events?.on('routeChangeComplete', handleStop)
    router.events?.on('routeChangeError', handleStop)

    return () => {
      // Cleanup event listeners
      window.removeEventListener('beforeunload', handleStart)
      router.events?.off('routeChangeStart', handleStart)
      router.events?.off('routeChangeComplete', handleStop)
      router.events?.off('routeChangeError', handleStop)
    }
  }, [router])

  // Also trigger loading state on pathname or search params change
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Adjust this timeout as needed

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return isLoading
}

