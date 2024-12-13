'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  User,
  Mail,
  Lock,
  BookOpen,
  Upload,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import PropTypes from 'prop-types'

const IndividualForm = ({ onComplete, onBack }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    occupation: '',
    researchInterests: '',
    researchWorks: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        researchWorks: Array.from(e.target.files),
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission with progress
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    onComplete(formData)
    setIsLoading(false)
  }

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.occupation &&
    formData.researchInterests &&
    formData.researchWorks.length >= 2

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
            onClick={onBack}
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
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email address'
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
                value={formData.password}
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
                value={formData.occupation}
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
                value={formData.researchInterests}
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
                accept='.pdf,.doc,.docx'
                multiple
                required
                disabled={isLoading}
              />
              <p className='text-sm text-muted-foreground'>
                Upload at least two research works (PDF, DOC, or DOCX)
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex flex-col gap-4'>
          <Button
            onClick={handleSubmit}
            className='w-full'
            disabled={!isFormValid || isLoading}
          >
            {isLoading
              ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
                )
              : (
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

IndividualForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
}

export default IndividualForm
