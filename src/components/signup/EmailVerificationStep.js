'use client'

import { useState } from 'react'
import { useSignupStore } from '@/lib/store/signupStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Loader2 } from 'lucide-react'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='w-full max-w-md mx-auto'
    >
      <Card>
        <CardHeader>
          <Button
            variant='ghost'
            className='absolute left-2 top-2'
            onClick={() => setStep(1)}
            disabled={isLoading}
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Go back</span>
          </Button>
          <div className='pt-8 space-y-2'>
            <CardTitle>Verify your email</CardTitle>
            <p className='text-sm text-muted-foreground'>
              {codeSent
                ? 'Enter the verification code sent to your email'
                : "We'll send you a verification code to confirm your email address"}
            </p>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              disabled={codeSent || isLoading}
              className='w-full'
            />
            {!codeSent ? (
              <Button
                onClick={sendVerificationCode}
                className='w-full'
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className='mr-2 h-4 w-4' />
                    Send Verification Code
                  </>
                )}
              </Button>
            ) : (
              <div className='space-y-2'>
                <Input
                  type='text'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder='Enter verification code'
                  className='w-full'
                  disabled={isLoading}
                  maxLength={6}
                />
                <div className='flex gap-2'>
                  <Button
                    onClick={verifyCode}
                    className='flex-1'
                    disabled={isLoading || !verificationCode}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={sendVerificationCode}
                    className='flex-1'
                    disabled={isLoading || resendDisabled}
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
