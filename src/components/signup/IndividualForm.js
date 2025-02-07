'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { useSignupStore } from '@/lib/store/signupStore'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx']

export function IndividualForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
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
    researchInterests: formData?.researchInterests || '',
    researchWorks: formData?.researchWorks || [],
  })

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(validateFile)

    if (validFiles.length > 0) {
      setForm((prev) => ({
        ...prev,
        researchWorks: validFiles,
      }))
    }
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
      className='w-full max-w-md mx-auto'
    >
      <Card className='relative overflow-hidden'>
        {isLoading && (
          <Progress
            value={progress}
            className='absolute top-0 left-0 right-0 h-1 rounded-none'
          />
        )}

        <CardHeader>
          <Button
            variant='ghost'
            className='absolute left-2 top-2'
            onClick={() => setStep(2)}
            disabled={isLoading}
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Go back</span>
          </Button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='space-y-2'
          >
            <h2 className='text-2xl font-bold tracking-tight'>
              Individual Registration
            </h2>
            <p className='text-sm text-muted-foreground'>
              Tell us about yourself and your research interests
            </p>
          </motion.div>
        </CardHeader>

        <CardContent>
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
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={form.password}
                onChange={handleInputChange}
                placeholder='Create a password'
                required
                disabled={isLoading}
              />
            </div>

            {/* Occupation */}
            <div className='space-y-2'>
              <Label htmlFor='occupation'>Occupation</Label>
              <Input
                id='occupation'
                name='occupation'
                value={form.occupation}
                onChange={handleInputChange}
                placeholder='Enter your current occupation'
                required
                disabled={isLoading}
              />
            </div>

            {/* Research Interests */}
            <div className='space-y-2'>
              <Label htmlFor='researchInterests'>Research Interests</Label>
              <Textarea
                id='researchInterests'
                name='researchInterests'
                value={form.researchInterests}
                onChange={handleInputChange}
                placeholder='Describe your research interests'
                rows={3}
                required
                disabled={isLoading}
              />
            </div>

            {/* Research Works */}
            <div className='space-y-2'>
              <Label htmlFor='researchWorks'>Research Works</Label>
              <Input
                id='researchWorks'
                name='researchWorks'
                type='file'
                onChange={handleFileChange}
                accept={ALLOWED_FILE_TYPES.join(',')}
                multiple
                required
                disabled={isLoading}
              />
              <p className='text-sm text-muted-foreground'>
                Upload at least one research work (PDF, DOC, or DOCX)
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button
            onClick={handleSubmit}
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Continue'
            )}
          </Button>
          <p className='text-xs text-center text-muted-foreground'>
            Your information helps us personalize your research experience
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default IndividualForm
