// src/app/login/page.js
import { Suspense } from 'react'
import LoginPage from '@/components/LoginPage'

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}
