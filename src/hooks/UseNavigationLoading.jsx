'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => {
      // Delay setting isLoading to false to ensure content is rendered
      setTimeout(() => setIsLoading(false), 300)
    }

    handleStart()

    // Simulate the completion of page load
    const timer = setTimeout(handleComplete, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [pathname, searchParams])

  return isLoading
}

