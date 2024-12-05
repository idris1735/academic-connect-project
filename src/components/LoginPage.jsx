'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { browserPopupRedirectResolver } from "firebase/auth";
import { auth } from '@/app/firebase-config'
// import { toast } from '@/components/ui/use-toast'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'; // Import icons



export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const [showToast, setShowToast] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    title: "",
    description: "",
    variant: "default",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()    
    try {
      const res = await fetch('/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('Response:', data);
    
      if (res.status === 200) {
        setToastDetails({
          title: 'Login successful',
          description: 'You have been logged in successfully.',
          variant: 'default',
        });
        setShowToast(true);
        window.location.href = data.redirectTo;
      } 
       else {
        setToastDetails({
          title: 'Login failed',
          description: 'Please check your email and password and try again.',
          variant: 'destructive',
        });
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setToastDetails({
        title: 'Login failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      setShowToast(true);
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const userCredential =  await signInWithPopup(auth, provider, browserPopupRedirectResolver)
      let data = userCredential.user
       // Get the ID token
      const idToken = await data.getIdToken();
      data['idToken'] = idToken;
      let user = {}
      user.email = data.email;
      user.displayName = data.displayName;
      user.photoURL = data.photoURL;
      user.idToken = idToken;
      user.uid = data.uid;

      console.log('Google Sign-In data:', data);
      console.log('Google Sign-In idToken:', idToken);
      const res = await fetch('/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      let info = await res.json();
      console.log('Google Sign-In response:', res);
      if (res.status === 200) {
        setToastDetails({
          title: "Google Sign-In successful",
          description: "You have been logged in with Google successfully.",
          variant: "default",
        });
        setShowToast(true);
        window.location.href = info.redirectTo;
      }
      else{
        setToastDetails({
          title: "Google Sign-In unsuccessful",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
        setShowToast(true);
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        return ;
      }
      else {
        setToastDetails({
          title: "Login unsuccessful",
          description: "This Google account is not registered with us.",
          variant: "destructive",
        });
     
      console.error('Google Sign-In error:', error)
    }
  }
}
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <header className='bg-primary text-primary-foreground p-4'>
        <h1 className='text-2xl font-bold'>AcademicConnect</h1>
      </header>


      <ToastProvider>

      {showToast && (
        <Toast
          variant={toastDetails.variant}
          onOpenChange={(open) => setShowToast(open)}
        >
          <ToastTitle>{toastDetails.title}</ToastTitle>
          <ToastDescription>{toastDetails.description}</ToastDescription>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>

      <main className='flex-grow container mx-auto px-4 py-8 flex items-center justify-center'>
        <div className='w-full max-w-md'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle type between 'password' and 'text'
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10" // Padding for the show/hide icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" /> // Hide password icon
                  ) : (
                    <EyeIcon className="w-5 h-5" /> // Show password icon
                  )}
                </button>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='keep-logged-in'
                checked={keepLoggedIn}
                onCheckedChange={setKeepLoggedIn}
              />
              <label
                htmlFor='keep-logged-in'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Keep me logged in
              </label>
            </div>
            <Button type='submit' className='w-full'>
              Log in
            </Button>
          </form>

          <div className='mt-4 text-center text-sm text-muted-foreground'>
            or
          </div>

          <Button
            variant='outline'
            className='w-full mt-4 flex items-center justify-center space-x-2'
            onClick={handleGoogleSignIn}
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
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
            <span>Continue with Google</span>
          </Button>

          <div className='mt-6 text-center text-sm'>
            No account?{' '}
            <Link href='/signup' className='text-primary hover:underline'>
              Sign up
            </Link>
          </div>
        </div>
      </main>

      <div className='container mx-auto px-4 py-8 text-center'>
        <div className='flex justify-center space-x-4 mb-4'>
          <Button variant='outline' className='flex items-center space-x-2'>
            <svg viewBox='0 0 24 24' className='w-5 h-5' fill='currentColor'>
              <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
            </svg>
            <span>Download on the App Store</span>
          </Button>
          <Button variant='outline' className='flex items-center space-x-2'>
            <svg viewBox='0 0 24 24' className='w-5 h-5' fill='currentColor'>
              <path d='M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z' />
            </svg>
            <span>Get it on Google Play</span>
          </Button>
        </div>
      </div>

      <footer className='bg-muted py-8'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-3 gap-8 text-sm'>
            <div>
              <h5 className='font-semibold mb-2'>Company</h5>
              <ul className='space-y-1'>
                <li>
                  <a href='#' className='hover:underline'>
                    About us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:underline'>
                    News
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:underline'>
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className='font-semibold mb-2'>Support</h5>
              <ul className='space-y-1'>
                <li>
                  <a href='#' className='hover:underline'>
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className='font-semibold mb-2'>Business solutions</h5>
              <ul className='space-y-1'>
                <li>
                  <a href='#' className='hover:underline'>
                    Advertising
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:underline'>
                    Recruiting
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}