// src/app/page.js
import { Suspense } from 'react'
import HomePage from '@/components/HomePage'
import { LoadingScreen } from '@/components/ui/loading-spinner'

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomePage />
    </Suspense>
  )
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
