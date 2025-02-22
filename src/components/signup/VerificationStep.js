'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Shield, ArrowRight } from 'lucide-react'
import { BackButton } from '../ui/back-button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { auth } from '@/lib/firebase/config'
import { sendEmailVerification } from 'firebase/auth'
import { LoadingSpinner } from '../ui/loading-spinner'
import { toast } from '../ui/use-toast'

export function VerificationStep() {
  const [sending, setSending] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is verified, redirect to feeds
    if (user?.emailVerified) {
      router.push('/feeds')
    }
  }, [user, router])

  const handleResendVerification = async () => {
    try {
      setSending(true)
      await sendEmailVerification(auth.currentUser)
      toast({
        title: 'Verification email sent',
        description: 'Please check your inbox',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-md mx-auto p-6'
    >
      <Card className='relative overflow-hidden border-none shadow-lg'>
        <CardHeader className='space-y-6 pb-2 pt-8'>
          <BackButton />

          {/* Verification Icon */}
          <div className='mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center transition-transform hover:scale-105'>
            <Shield className='h-8 w-8 text-indigo-600' />
          </div>

          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              Verify Your Identity
            </h2>
            <p className='text-sm text-gray-500'>
              Complete the verification process to secure your account
            </p>
          </div>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-4'>
          <div className='space-y-4'>
            {/* Add your verification UI here (e.g., voice, face, or CAPTCHA) */}
            <div className='p-6 border-2 border-dashed border-gray-200 rounded-lg text-center'>
              <p className='text-sm text-gray-500'>
                Verification component will be integrated here
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col gap-4 px-8 pb-8'>
          <Button
            onClick={handleResendVerification}
            className='w-full h-12 bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100'
          >
            {sending ? <LoadingSpinner /> : 'Resend Verification Email'}
          </Button>
          <p className='text-xs text-center text-gray-500'>
            This helps us maintain a secure research community
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
