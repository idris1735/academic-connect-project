'use client'

import { useState } from 'react'
import { useSignupStore } from '../../lib/store/signupStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'
import { Card, CardHeader, CardContent } from '../ui/card'
import { motion } from 'framer-motion'
import { Mail, Loader2, ArrowRight } from 'lucide-react'
import { BackButton } from '../ui/back-button'

export function EmailVerificationStep() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { setStep, updateFormData } = useSignupStore((state) => ({
    setStep: state.setStep,
    updateFormData: state.updateFormData,
  }))

  const { toast } = useToast()

  // Email validation with proper regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return null
  }

  // Handle countdown for resend button
  const startResendCountdown = () => {
    setResendDisabled(true)
    setCountdown(30)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Simulate sending verification code
  const sendVerificationCode = async () => {
    const emailError = validateEmail(email)
    if (emailError) {
      toast({
        title: 'Error',
        description: emailError,
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // For development, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCodeSent(true)
      startResendCountdown()

      // Store verification code in sessionStorage (for demo only)
      const mockCode = '123456'
      sessionStorage.setItem('verificationCode', mockCode)

      toast({
        title: 'Verification Code Sent',
        description: `A verification code has been sent to ${email}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Verify the code
  const verifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: 'Error',
        description: 'Please enter the verification code',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const storedCode = sessionStorage.getItem('verificationCode')

      if (verificationCode === storedCode) {
        updateFormData({ email })
        sessionStorage.removeItem('verificationCode')
        toast({
          title: 'Success',
          description: 'Email verified successfully',
        })
        setStep(3) // Move to next step
      } else {
        toast({
          title: 'Error',
          description: 'Invalid verification code',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Verification failed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div className='w-full max-w-md mx-auto p-6'>
      <Card className='relative overflow-hidden border-none shadow-lg'>
        <CardHeader className='space-y-6 pb-2 pt-8'>
          <BackButton onClick={() => setStep(1)} disabled={isLoading} />

          {/* Email Icon */}
          <div className='mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center transition-transform hover:scale-105'>
            <Mail className='h-8 w-8 text-indigo-600' />
          </div>

          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              {codeSent ? 'Check your email' : 'Verify your email'}
            </h2>
            <p className='text-sm text-gray-500'>
              {codeSent
                ? `We've sent a verification code to ${email}`
                : 'Enter your email to receive a verification code'}
            </p>
          </div>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-4'>
          <div className='space-y-4'>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              disabled={codeSent || isLoading}
              className='h-12 text-lg border-2 focus:border-indigo-600 transition-colors'
            />

            {codeSent ? (
              <div className='space-y-4'>
                <Input
                  type='text'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder='Enter verification code'
                  className='h-12 text-lg text-center tracking-[0.5em] font-mono border-2 focus:border-indigo-600'
                  maxLength={6}
                />
                <div className='flex gap-3'>
                  <Button
                    onClick={verifyCode}
                    className='flex-1 h-12 text-base font-medium border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100 bg-transparent'
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className='ml-2 h-5 w-5' />
                      </>
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={sendVerificationCode}
                    className='flex-1 h-12 text-base font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all'
                    disabled={isLoading || resendDisabled}
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={sendVerificationCode}
                className='w-full h-12 text-base font-medium border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100 bg-transparent'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
