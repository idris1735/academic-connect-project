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
      const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, idToken }),
        credentials: 'include',
      })

      // Even if backend returns 401, continue if Firebase auth worked
      const data = await res.json().catch(() => ({}))

      // If Firebase auth worked, redirect to feeds
      if (userCredential.user) {
        router.push('/feeds')
        return
      }

      if (!res.ok) {
        throw new Error(`Authentication failed`)
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
                  className='w-full h-12 text-base font-medium bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                      Signing in...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>

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
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
