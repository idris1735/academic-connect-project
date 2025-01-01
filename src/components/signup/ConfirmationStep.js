'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSignupStore } from '@/lib/store/signupStore'
import { nigerianInstitutions } from '@/data/institutions'
import { useToast } from '@/components/ui/use-toast'
import { authApi } from '@/lib/api/auth'

const ConfirmationStep = ({ formData = {}, onBack }) => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const { userType, subOption, resetStore } = useSignupStore()

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const signupData = {
        ...formData,
        userType,
        subOption,
        password: formData.password || formData.confirmPassword, // Ensure password is included
      }

      console.log('Submitting signup data:', signupData) // Debug log

      const response = await authApi.signup(signupData)

      if (response.user) {
        toast({
          title: 'Success!',
          description: 'Account created successfully.',
        })

        // Reset the signup store
        resetStore()

        // Navigate to feeds
        router.push('/feeds')
      } else {
        throw new Error('No user data received')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const renderSummary = () => {
    switch (userType) {
      case 'individual':
        return (
          <div className='space-y-2'>
            <p>Full Name: {formData?.fullName || 'Not provided'}</p>
            <p>Email: {formData?.email || 'Not provided'}</p>
            {formData?.occupation && <p>Occupation: {formData.occupation}</p>}
            {formData?.researchInterests && (
              <p>Research Interests: {formData.researchInterests}</p>
            )}
            {formData?.researchWorks && (
              <p>
                Research Works:{' '}
                {Array.isArray(formData.researchWorks)
                  ? formData.researchWorks.length
                  : 0}{' '}
                files uploaded
              </p>
            )}
          </div>
        )

      case 'corporate':
        return (
          <div className='space-y-2'>
            <p>
              Organization Name: {formData?.organizationName || 'Not provided'}
            </p>
            <p>
              Organization Type: {formData?.organizationType || 'Not provided'}
            </p>
            <p>Industry: {formData?.industry || 'Not provided'}</p>
            {subOption === 'Admin' ? (
              <>
                <p>Admin Name: {formData?.adminName || 'Not provided'}</p>
                <p>
                  Official Email: {formData?.officialEmail || 'Not provided'}
                </p>
                {formData?.logo && <p>Logo: Uploaded</p>}
                {formData?.address && <p>Address: {formData.address}</p>}
                {formData?.website && <p>Website: {formData.website}</p>}
              </>
            ) : (
              <>
                <p>Employee Name: {formData?.employeeName || 'Not provided'}</p>
                <p>
                  Employee Email: {formData?.employeeEmail || 'Not provided'}
                </p>
                <p>Job Title: {formData?.jobTitle || 'Not provided'}</p>
                {formData?.department && (
                  <p>Department: {formData.department}</p>
                )}
                <p>Access Code: {formData?.accessCode || 'Not provided'}</p>
              </>
            )}
          </div>
        )

      case 'institution':
        return (
          <div className='space-y-2'>
            <p>
              Institution Name:{' '}
              {formData?.institution
                ? nigerianInstitutions.find(
                    (inst) => inst.abbreviation === formData.institution
                  )?.name
                : 'Not provided'}
            </p>
            <p>
              Institution Type: {formData?.institutionType || 'Not provided'}
            </p>
            <p>
              State:{' '}
              {formData?.state === 'all'
                ? 'All States'
                : formData?.state || 'Not provided'}
            </p>
            {subOption === 'Admin' ? (
              <>
                <p>Admin Name: {formData?.adminName || 'Not provided'}</p>
                <p>
                  Official Email: {formData?.officialEmail || 'Not provided'}
                </p>
                <p>
                  Administrator Access Code:{' '}
                  {formData?.adminAccessCode || 'Not provided'}
                </p>
                {formData?.institutionLogo && <p>Logo: Uploaded</p>}
                {formData?.address && <p>Address: {formData.address}</p>}
                {formData?.website && <p>Website: {formData.website}</p>}
              </>
            ) : (
              <>
                <p>Staff Name: {formData?.staffName || 'Not provided'}</p>
                <p>Staff Email: {formData?.staffEmail || 'Not provided'}</p>
                <p>Department: {formData?.department || 'Not provided'}</p>
                <p>Position: {formData?.position || 'Not provided'}</p>
                <p>Staff ID: {formData?.staffId || 'Not provided'}</p>
                <p>Access Code: {formData?.accessCode || 'Not provided'}</p>
              </>
            )}
          </div>
        )

      default:
        return <p>No summary available</p>
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
        <CardHeader>
          <Button
            variant='ghost'
            className='absolute left-2 top-2'
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Go back</span>
          </Button>
          <CardTitle>Confirm Your Details</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Please review the information below before proceeding.
          </p>
        </CardHeader>
        <CardContent>
          <div className='mt-4'>
            <h3 className='font-semibold'>
              {userType === 'individual'
                ? 'Personal Information'
                : userType === 'corporate'
                ? `Organization ${subOption} Details`
                : `Institution ${subOption} Details`}
            </h3>
            {renderSummary()}
          </div>
          <div className='flex justify-between pt-4'>
            <Button variant='outline' onClick={onBack} disabled={loading}>
              Edit
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating Account...
                </>
              ) : (
                'Confirm & Create Account'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ConfirmationStep
