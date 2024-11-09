'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/app/firebase-config'
// import { useToast } from "@/components/ui/use-toast"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@/components/ui/toast'


export default function SignupForm() {
  const router = useRouter()
  // const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    institution: '',
    department: '',
    firstName: '',
    lastName: '',
    country: '',
    email: '',
    password: '',
    agreeTerms: false,
  })

  const [showToast, setShowToast] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    title: "",
    description: "",
    variant: "default",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({ ...prevData, country: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prevData) => ({ ...prevData, agreeTerms: checked }))
  }

  const handleContinue = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      handleSignup()
    }
  }

  const handleSkip = () => {
    setStep(2)
  }

  const handleSignup = async () => {
    if (!formData.agreeTerms) {
      // toast({
      //   title: "Terms not accepted",
      //   description: "Please agree to the Terms of Service and Privacy Policy.",
      //   variant: "destructive",
      // })
      console.log("terms not accepted")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      })
      setToastDetails({
        title: "Sign up successful",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      setShowToast(true);
      console.log("Sign up successful")

      router.push('/feeds')
    } catch (error) {
      setToastDetails({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setShowToast(true);
      console.error('Sign up error:', error)
    }
  }

  return (
    <div className='min-h-screen bg-background'>
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

      <main className='container mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold text-center mb-2'>
          Join 25+ million researchers, including 80 Nobel Laureates
        </h2>
        <p className='text-center mb-8 text-muted-foreground'>
          Read the latest publications in your field • Discuss your work with
          other specialists • Collaborate with colleagues
        </p>

        <form onSubmit={handleContinue} className='max-w-md mx-auto space-y-4'>
          {step === 1 && (
            <>
              <h3 className='text-xl font-semibold mb-4'>
                Show where you conduct research
              </h3>
              <p className='text-sm text-muted-foreground mb-4'>
                Enter your institution details to quickly find your colleagues
                and keep up with their research.
              </p>
              <div className='space-y-2'>
                <Label htmlFor='institution'>Institution</Label>
                <Input
                  id='institution'
                  name='institution'
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='department'>Department</Label>
                <Input
                  id='department'
                  name='department'
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First name</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last name</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='country'>Country/Region</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder='Select your country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='us'>United States</SelectItem>
                    <SelectItem value='uk'>United Kingdom</SelectItem>
                    <SelectItem value='ca'>Canada</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Your institution email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='terms'
                  checked={formData.agreeTerms}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <label
                  htmlFor='terms'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  I agree to the{' '}
                  <a href='#' className='text-primary hover:underline'>
                    Terms of Service
                  </a>{' '}
                  and acknowledge the{' '}
                  <a href='#' className='text-primary hover:underline'>
                    Privacy Policy
                  </a>
                </label>
              </div>
            </>
          )}

          <Button type='submit' className='w-full'>
            {step === 1 ? 'Continue' : 'Sign Up'}
          </Button>
          {step === 1 && (
            <Button
              type='button'
              variant='link'
              className='w-full'
              onClick={handleSkip}
            >
              Skip this step
            </Button>
          )}
        </form>
      </main>

      <footer className='bg-muted mt-8 py-8'>
        <div className='container mx-auto px-4'>
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