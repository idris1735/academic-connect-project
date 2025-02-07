'use client'

import { SignupFlow } from '@/components/signup'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function SignupPage() {
  return (
    <ErrorBoundary>
      <SignupFlow />
    </ErrorBoundary>
  )
}
