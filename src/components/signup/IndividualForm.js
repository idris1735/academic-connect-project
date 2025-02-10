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
    fullName: formData?.fullName || '',
    password: formData?.password || '',
    occupation: formData?.occupation || '',
    occupationCategory: formData?.occupationCategory || '',
    researchInterests: formData?.researchInterests || '',
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
    if (!form.fullName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your full name',
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

    if (!form.occupation.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your occupation',
        variant: 'destructive',
      })
      return false
    }

    if (!form.researchInterests.trim()) {
      toast({
        title: 'Error',
        description: 'Please describe your research interests',
        variant: 'destructive',
      })
      return false
    }

    if (form.researchWorks.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one research work',
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
      // Simulate form submission with progress
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Update global state
      updateFormData(form)

      toast({
        title: 'Success',
        description: 'Your information has been saved successfully',
      })

      // Move to next step
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
            {/* Full Name */}
            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                name='fullName'
                value={form.fullName}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                className='h-12 text-base border-2 focus:border-indigo-600 transition-colors'
                required
                disabled={isLoading}
              />
            </div>

            {/* Password with strength indicator */}
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
                  className='h-12 text-base border-2 focus:border-indigo-600 transition-colors pr-10'
                  required
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
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

            {/* Dynamic Occupation Selection */}
            <div className='space-y-2'>
              <Label htmlFor='occupation'>Occupation</Label>
              <Select
                value={customOccupation ? 'custom' : form.occupation}
                onValueChange={handleOccupationChange}
              >
                <SelectTrigger className='h-12 border-2 focus:border-indigo-600'>
                  <SelectValue placeholder='Select your occupation' />
                </SelectTrigger>
                <SelectContent className='max-h-[300px] overflow-y-auto'>
                  <div className='max-h-[300px] overflow-y-auto'>
                    {occupationCategories.map((category) => (
                      <div key={category.category}>
                        <div className='px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50 sticky top-0'>
                          {category.category}
                        </div>
                        {category.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className='pl-4'
                          >
                            {option}
                          </SelectItem>
                        ))}
                        {category ===
                          occupationCategories[
                            occupationCategories.length - 1
                          ] && (
                          <SelectItem value='custom' className='border-t'>
                            Enter Custom Occupation
                          </SelectItem>
                        )}
                      </div>
                    ))}
                  </div>
                </SelectContent>
              </Select>
              {customOccupation && (
                <Input
                  placeholder='Enter your occupation'
                  value={form.occupation}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      occupation: e.target.value,
                    }))
                  }
                  className='h-12 text-base border-2 focus:border-indigo-600 transition-colors mt-2'
                />
              )}
            </div>

            {/* Research Interests */}
            <div className='space-y-2'>
              <Label htmlFor='researchInterests'>Research Interests</Label>
              <Textarea
                id='researchInterests'
                name='researchInterests'
                value={form.researchInterests}
                onChange={handleInputChange}
                placeholder='Describe your research interests and areas of expertise'
                className='min-h-[120px] text-base border-2 focus:border-indigo-600 transition-colors'
                required
                disabled={isLoading}
              />
            </div>

            {/* Enhanced File Upload */}
            <div className='space-y-2'>
              <Label htmlFor='researchWorks'>Research Works</Label>
              <div className='space-y-4'>
                <div className='relative'>
                  <Input
                    id='researchWorks'
                    name='researchWorks'
                    type='file'
                    onChange={handleFileChange}
                    accept={ALLOWED_FILE_TYPES.join(',')}
                    multiple
                    className='h-12 text-base border-2 border-dashed focus:border-indigo-600 transition-colors'
                    disabled={isLoading}
                  />
                  <Upload className='absolute right-3 top-3 h-5 w-5 text-gray-400' />
                </div>

                <AnimatePresence>
                  {uploadedFiles.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='space-y-2'
                    >
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                        >
                          <div className='flex items-center space-x-2'>
                            <FileText className='h-4 w-4 text-indigo-600' />
                            <span className='text-sm text-gray-600 truncate max-w-[200px]'>
                              {file.name}
                            </span>
                          </div>
                          <button
                            type='button'
                            onClick={() => removeFile(index)}
                            className='text-gray-400 hover:text-red-500 transition-colors'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className='text-xs text-gray-500 flex items-center gap-1'>
                  <Plus className='h-3 w-3' />
                  Add your research papers or publications (PDF, DOC, DOCX)
                </p>
              </div>
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
