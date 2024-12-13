'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PropTypes from 'prop-types'

const GeneralSignupForm = ({ onComplete, onBack, userType, preSignupData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: preSignupData.email || '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    country: '',
    termsAccepted: false,
    userType,

    ...preSignupData,
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords don\'t match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        onComplete(data.redirectTo)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.dateOfBirth &&
    formData.country &&
    formData.termsAccepted

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-md mx-auto'
    >
      <Card className='relative overflow-hidden'>
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
            <CardTitle>Complete Your Registration</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Fill in the details below to complete your registration.
            </p>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
                {error}
              </div>
            )}

            {/* Name Fields */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder='Enter your first name'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder='Enter your last name'
                  required
                />
              </div>
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
                disabled={!!preSignupData.email}
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
              />
            </div>

            {/* Confirm Password */}
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirm your password'
                required
              />
            </div>

            {/* Date of Birth */}
            <div className='space-y-2'>
              <Label htmlFor='dateOfBirth'>Date of Birth</Label>
              <Input
                id='dateOfBirth'
                name='dateOfBirth'
                type='date'
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Country Selector */}
            <div className='space-y-2'>
              <Label htmlFor='country'>Country</Label>
              <Select
                onValueChange={handleSelectChange('country')}
                value={formData.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select your country' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='us'>United States</SelectItem>
                  <SelectItem value='uk'>United Kingdom</SelectItem>
                  <SelectItem value='ca'>Canada</SelectItem>
                  <SelectItem value='au'>Australia</SelectItem>
                  <SelectItem value='ng'>Nigeria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Fields for User Types */}
            {userType === 'individual' && (
              <div className='space-y-2'>
                <Label htmlFor='occupation'>Occupation</Label>
                <Input
                  id='occupation'
                  name='occupation'
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder='Enter your occupation'
                  required
                />
              </div>
            )}
            {(userType === 'corporate' || userType === 'institution') && (
              <div className='space-y-2'>
                <Label htmlFor='jobTitle'>Job Title</Label>
                <Input
                  id='jobTitle'
                  name='jobTitle'
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder='Enter your job title'
                  required
                />
              </div>
            )}

            {/* Terms and Conditions */}
            <div className='flex items-center space-x-2'>
              <Input
                id='termsAccepted'
                name='termsAccepted'
                type='checkbox'
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                required
              />
              <Label htmlFor='termsAccepted'>
                I agree to the{' '}
                <a href='/terms' className='text-primary hover:underline'>
                  Terms and Conditions
                </a>
              </Label>
            </div>

            {/* Buttons */}
            <div className='flex justify-between pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button type='submit' disabled={!isFormValid || isLoading}>
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

GeneralSignupForm.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  userType: PropTypes.oneOf(['individual', 'corporate', 'institution'])
    .isRequired,
  preSignupData: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dateOfBirth: PropTypes.string,
    country: PropTypes.string,
    occupation: PropTypes.string,
    jobTitle: PropTypes.string,
  }),
}

GeneralSignupForm.defaultProps = {
  preSignupData: {},
}

export default GeneralSignupForm
