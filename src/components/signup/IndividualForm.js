'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Loader2,
  User2,
  Upload,
  Eye,
  EyeOff,
  X,
  FileText,
  Plus,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Progress } from '../ui/progress'
import { useToast } from '../ui/use-toast'
import { useSignupStore } from '../../lib/store/signupStore'
import { BackButton } from '../ui/back-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx']

// Occupation options
const occupationCategories = [
  {
    category: 'Academic',
    options: [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Research Fellow',
      'Postdoctoral Researcher',
      'PhD Student',
      'Graduate Student',
    ],
  },
  {
    category: 'Research',
    options: [
      'Research Scientist',
      'Research Director',
      'Research Associate',
      'Lab Manager',
      'Research Assistant',
    ],
  },
  {
    category: 'Industry',
    options: [
      'Research & Development',
      'Data Scientist',
      'Industry Researcher',
      'Research Consultant',
      'Technical Lead',
    ],
  },
]

export function IndividualForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [customOccupation, setCustomOccupation] = useState(false)
  const { toast } = useToast()

  const { setStep, updateFormData, formData } = useSignupStore((state) => ({
    setStep: state.setStep,
    updateFormData: state.updateFormData,
    formData: state.formData,
  }))

  const [form, setForm] = useState({
    firstName: formData?.firstName || '',
    lastName: formData?.lastName || '',
    email: formData?.email || '',
    password: formData?.password || '',
    gender: formData?.gender || 'prefer_not_to_say',
    dateOfBirth: formData?.dateOfBirth || '',
    phoneNumber: formData?.phoneNumber || '',
    occupation: formData?.occupation || '',
    researchInterests: formData?.researchInterests || '',
    skills: formData?.skills || [],
    researchWorks: formData?.researchWorks || [],
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  })

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0
    let feedback = ''

    if (password.length >= 8) score++
    if (password.match(/[A-Z]/)) score++
    if (password.match(/[0-9]/)) score++
    if (password.match(/[^A-Za-z0-9]/)) score++

    switch (score) {
      case 0:
        feedback = 'Very weak'
        break
      case 1:
        feedback = 'Weak'
        break
      case 2:
        feedback = 'Fair'
        break
      case 3:
        feedback = 'Good'
        break
      case 4:
        feedback = 'Strong'
        break
    }

    setPasswordStrength({ score, feedback })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const handleOccupationChange = (value) => {
    if (value === 'custom') {
      setCustomOccupation(true)
      setForm((prev) => ({ ...prev, occupation: '' }))
    } else {
      setCustomOccupation(false)
      setForm((prev) => ({ ...prev, occupation: value }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(validateFile)

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles])
      setForm((prev) => ({
        ...prev,
        researchWorks: [...prev.researchWorks, ...validFiles],
      }))
    }
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    setForm((prev) => ({
      ...prev,
      researchWorks: prev.researchWorks.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    if (!form.firstName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your first name',
        variant: 'destructive',
      })
      return false
    }

    if (!form.lastName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your last name',
        variant: 'destructive',
      })
      return false
    }

    if (!form.email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your email',
        variant: 'destructive',
      })
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return false
    }

    if (form.password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: `File size should not exceed ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`,
        variant: 'destructive',
      })
      return false
    }

    const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      toast({
        title: 'Error',
        description: `Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed`,
        variant: 'destructive',
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Update global state with form data
      updateFormData({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: form.phoneNumber,
        occupation: form.occupation,
        researchInterests: form.researchInterests,
        skills: form.skills,
      })

      toast({
        title: 'Success',
        description: 'Your information has been saved successfully',
      })

      // Move to confirmation step
      setStep(4)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your information. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
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
        {isLoading && (
          <Progress
            value={progress}
            className='absolute top-0 left-0 right-0 h-1 rounded-none bg-indigo-100'
          />
        )}

        <CardHeader className='space-y-6 pb-2 pt-8'>
          <BackButton onClick={() => setStep(2)} disabled={isLoading} />

          {/* User Icon */}
          <div className='mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center transition-transform hover:scale-105'>
            <User2 className='h-8 w-8 text-indigo-600' />
          </div>

          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              Complete Your Profile
            </h2>
            <p className='text-sm text-gray-500'>
              Tell us about yourself and your research interests
            </p>
          </div>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-4'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* First Name */}
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                name='firstName'
                value={form.firstName}
                onChange={handleInputChange}
                placeholder='Enter your first name'
                className='h-12'
                required
              />
            </div>

            {/* Last Name */}
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                name='lastName'
                value={form.lastName}
                onChange={handleInputChange}
                placeholder='Enter your last name'
                className='h-12'
                required
              />
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={form.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                className='h-12'
                required
              />
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder='Create a secure password'
                  className='h-12 pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {form.password && (
                <div className='space-y-1'>
                  <div className='flex gap-1'>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i < passwordStrength.score
                            ? getStrengthColor(passwordStrength.score)
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs ${getStrengthTextColor(
                      passwordStrength.score
                    )}`}
                  >
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className='space-y-2'>
              <Label htmlFor='gender'>Gender</Label>
              <Select
                id='gender'
                name='gender'
                value={form.gender}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, gender: value }))
                }
                required
              >
                <SelectTrigger className='h-12'>
                  <SelectValue placeholder='Select your gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='male'>Male</SelectItem>
                  <SelectItem value='female'>Female</SelectItem>
                  <SelectItem value='prefer_not_to_say'>
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className='space-y-2'>
              <Label htmlFor='dateOfBirth'>Date of Birth</Label>
              <Input
                id='dateOfBirth'
                name='dateOfBirth'
                type='date'
                value={form.dateOfBirth}
                onChange={handleInputChange}
                placeholder='Enter your date of birth'
                className='h-12'
                required
              />
            </div>

            {/* Phone Number */}
            <div className='space-y-2'>
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                value={form.phoneNumber}
                onChange={handleInputChange}
                placeholder='Enter your phone number'
                className='h-12'
                required
              />
            </div>

            {/* Basic occupation and research interests */}
            <div className='space-y-2'>
              <Label htmlFor='occupation'>Occupation</Label>
              <Input
                id='occupation'
                name='occupation'
                value={form.occupation}
                onChange={handleInputChange}
                placeholder='Enter your occupation'
                className='h-12'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='researchInterests'>Research Interests</Label>
              <Textarea
                id='researchInterests'
                name='researchInterests'
                value={form.researchInterests}
                onChange={handleInputChange}
                placeholder='Describe your research interests'
                className='min-h-[100px]'
                required
              />
            </div>

            {/* Skills */}
            <div className='space-y-2'>
              <Label htmlFor='skills'>Skills</Label>
              <Textarea
                id='skills'
                name='skills'
                value={form.skills.join('\n')}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    skills: e.target.value
                      .split('\n')
                      .map((skill) => skill.trim()),
                  }))
                }
                placeholder='Enter your skills (one per line)'
                className='min-h-[100px]'
                required
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4 px-8 pb-8'>
          <Button
            onClick={handleSubmit}
            className='w-full h-12 bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Processing...
              </>
            ) : (
              'Continue'
            )}
          </Button>
          <p className='text-xs text-center text-gray-500'>
            Your information helps us personalize your research experience
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Utility functions for password strength
const getStrengthColor = (score) => {
  switch (score) {
    case 1:
      return 'bg-red-500'
    case 2:
      return 'bg-yellow-500'
    case 3:
      return 'bg-green-500'
    case 4:
      return 'bg-indigo-500'
    default:
      return 'bg-gray-200'
  }
}

const getStrengthTextColor = (score) => {
  switch (score) {
    case 1:
      return 'text-red-500'
    case 2:
      return 'text-yellow-500'
    case 3:
      return 'text-green-500'
    case 4:
      return 'text-indigo-500'
    default:
      return 'text-gray-400'
  }
}

export default IndividualForm
