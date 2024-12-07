'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner' // or your preferred toast library
// src/app/login/page.js
import LoginPage from '@/components/LoginPage'


export default function Login() {
    const searchParams = useSearchParams()
    
    useEffect(() => {
        const error = searchParams.get('error')
        
        if (error === 'verification_failed') {
            toast.error('Error verifying session, please log in again')
        } else if (error === 'session_expired') {
            toast.error('Session expired, please log in again')
        } else if (error === 'session_invalid') {
            toast.error('Invalid session, please log in again')
        }
    }, [searchParams])

    return <LoginPage />
    // ... rest of your login page code
}
