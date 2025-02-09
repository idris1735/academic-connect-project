'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
} from 'firebase/auth'

import { auth } from '@/app/firebase-config'
import { useToast } from '@/components/ui/use-toast'
// import { toast } from '@/components/ui/use-toast'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react' // Import icons
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const carouselItems = [
  {
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: 'Empowering World',
    subtitle: 'Research Excellence',
  },
  {
    image:
      'https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: 'Advancing Knowledge,',
    subtitle: 'Shaping the Future',
  },
  {
    image:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: 'Collaborative Research,',
    subtitle: 'Global Impact',
  },
]

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Add loading state

  const [showToast, setShowToast] = useState(false)
  const [toastDetails, setToastDetails] = useState({
    title: '',
    description: '',
    variant: 'default',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Add this useEffect to handle error messages
  useEffect(() => {
    const error = searchParams.get('error')

    if (error) {
      setToastDetails({
        title: 'Error',
        description:
          error === 'verification_failed'
            ? 'Error verifying session, please log in again'
            : error === 'session_expired'
            ? 'Session expired, please log in again'
            : 'Invalid session, please log in again',
        variant: 'destructive',
      })
      setShowToast(true)
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const idToken = await userCredential.user.getIdToken()

      // Then send the token to your backend
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()

      if (data.redirectTo) {
        router.push(data.redirectTo)
      }
    } catch (error) {
      console.error('Login error:', error)
      setToastDetails({
        title: 'Login failed',
        description:
          error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      })
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true) // Start loading
    const provider = new GoogleAuthProvider()
    try {
      const userCredential = await signInWithPopup(
        auth,
        provider,
        browserPopupRedirectResolver
      )
      const data = userCredential.user
      // Get the ID token
      const idToken = await data.getIdToken()
      data.idToken = idToken
      const user = {}
      user.email = data.email
      user.displayName = data.displayName
      user.photoURL = data.photoURL
      user.idToken = idToken
      user.uid = data.uid

      console.log('Google Sign-In data:', data)
      console.log('Google Sign-In idToken:', idToken)
      const res = await fetch('/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      })
      const info = await res.json()
      console.log('Google Sign-In response:', res)
      if (res.status === 200) {
        setToastDetails({
          title: 'Google Sign-In successful',
          description: 'You have been logged in with Google successfully.',
          variant: 'default',
        })
        setShowToast(true)
        window.location.href = info.redirectTo
      } else {
        setToastDetails({
          title: 'Google Sign-In unsuccessful',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        })
        setShowToast(true)
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return
      } else {
        setToastDetails({
          title: 'Login unsuccessful',
          description: 'This Google account is not registered with us.',
          variant: 'destructive',
        })

        console.error('Google Sign-In error:', error)
      }
    } finally {
      setIsLoading(false) // Stop loading
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F4F7FF] p-4'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row'>
        {/* Left Section - Hero Image Carousel */}
        <div className='w-full lg:w-1/2 relative overflow-hidden bg-primary'>
          <div className='absolute inset-0 bg-gradient-to-br from-black/60 via-primary/50 to-primary/80 z-10' />

          {carouselItems.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={item.image}
                alt={`African researchers ${index + 1}`}
                className='h-full w-full object-cover'
              />
              <div className='absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-20'>
                <h2 className='text-4xl lg:text-5xl font-bold mb-3 text-center drop-shadow-lg'>
                  {item.title}
                </h2>
                <p className='text-xl lg:text-2xl text-center text-white/90 drop-shadow-md'>
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}

          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30'>
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <Link
            href='/'
            className='absolute top-8 left-8 text-white hover:text-white/80 transition-colors'
          >
            <div className='flex items-center space-x-2'>
              <span className='text-2xl font-bold'>AcademicConnect</span>
            </div>
          </Link>
        </div>

        {/* Right Section - Login Form */}
        <div className='w-full lg:w-1/2 p-6 lg:p-8 bg-white'>
          <Link
            href='/'
            className='self-end mb-8 text-gray-500 hover:text-primary transition-colors inline-flex items-center'
          >
            Back to website
            <svg
              className='ml-2 w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </Link>

          <div className='flex-1 flex flex-col justify-center max-w-sm mx-auto w-full'>
            <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
              Welcome back
            </h1>
            <p className='text-gray-600 mb-8'>
              Please enter your details to sign in
            </p>

            <ToastProvider>
              {showToast && (
                <Toast
                  variant={toastDetails.variant}
                  onOpenChange={(open) => setShowToast(open)}
                >
                  <ToastTitle>{toastDetails.title}</ToastTitle>
                  <ToastDescription>
                    {toastDetails.description}
                  </ToastDescription>
                  <ToastClose />
                </Toast>
              )}
              <ToastViewport />
            </ToastProvider>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Email
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='h-10 border-gray-300 focus:border-primary focus:ring-primary rounded-xl'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className='h-10 border-gray-300 focus:border-primary focus:ring-primary rounded-xl pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600'
                    >
                      {showPassword ? (
                        <EyeOffIcon className='w-5 h-5' />
                      ) : (
                        <EyeIcon className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Checkbox
                      id='keep-logged-in'
                      checked={keepLoggedIn}
                      onCheckedChange={setKeepLoggedIn}
                      className='border-gray-300 text-primary focus:ring-primary'
                    />
                    <label
                      htmlFor='keep-logged-in'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Keep me logged in
                    </label>
                  </div>
                  <Link
                    href='/forgot-password'
                    className='text-sm text-primary hover:text-primary/80 transition-colors'
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className='text-center text-xs text-gray-500'>
                  By continuing, you agree to AcademicConnect's{' '}
                  <Link
                    href='/terms'
                    className='text-primary hover:text-primary/80'
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href='/privacy'
                    className='text-primary hover:text-primary/80'
                  >
                    Privacy Policy
                  </Link>
                </div>

                <Button
                  type='submit'
                  className='w-full h-10 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all duration-300'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className='flex items-center justify-center'>
                      <LoadingSpinner size='sm' className='mr-2' />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </div>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 text-gray-500 bg-white'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl'
                  onClick={handleGoogleSignIn}
                >
                  <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z' />
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>

            <div className='mt-8 space-y-4'>
              <p className='text-center text-sm text-gray-600'>
                Don't have an account?{' '}
                <Link
                  href='/signup'
                  className='text-primary hover:text-primary/80'
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
