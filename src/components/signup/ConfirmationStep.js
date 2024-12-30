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
      const response = await authApi.signup({
        ...formData,
        userType,
        subOption,
      })

      if (response.user) {
        toast({
          title: 'Success!',
          description: 'Account created successfully.',
        })

        // Reset the signup store
        resetStore()

        // Navigate to feeds
        router.push('/feeds')
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
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
              </>
            ) : (
              <>
                <p>Employee Name: {formData?.employeeName || 'Not provided'}</p>
                <p>
                  Employee Email: {formData?.employeeEmail || 'Not provided'}
                </p>
                <p>Job Title: {formData?.jobTitle || 'Not provided'}</p>
                <p>Department: {formData?.department || 'Not provided'}</p>
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
            {subOption === 'Admin' ? (
              <>
                <p>Admin Name: {formData?.adminName || 'Not provided'}</p>
                <p>
                  Official Email: {formData?.officialEmail || 'Not provided'}
                </p>
              </>
            ) : (
              <>
                <p>Staff Name: {formData?.staffName || 'Not provided'}</p>
                <p>Staff Email: {formData?.staffEmail || 'Not provided'}</p>
                <p>Department: {formData?.department || 'Not provided'}</p>
                <p>Position: {formData?.position || 'Not provided'}</p>
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
      className='w-full max-w-md mx-auto'
    >
      <Card>
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
        </CardHeader>
        <CardContent>
          <div className='mt-4'>
            <h3 className='font-semibold'>
              {userType === 'individual'
                ? 'Personal Information'
                : `${
                    userType === 'corporate' ? 'Organization' : 'Institution'
                  } ${subOption} Details`}
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
