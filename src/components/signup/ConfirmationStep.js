'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { BackButton } from '../ui/back-button'
import { CheckCircle2, Loader2, FileText, Building2, User2 } from 'lucide-react'
import { useSignupStore } from '../../lib/store/signupStore'
import { useToast } from '../ui/use-toast'

export function ConfirmationStep() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { formData, userType, subOption, setStep } = useSignupStore()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: 'Registration Successful',
        description: 'Your account has been created successfully.',
      })

      // Redirect to dashboard or login
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete registration. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = () => {
    switch (userType) {
      case 'individual':
        return User2
      case 'corporate':
      case 'institution':
        return Building2
      default:
        return CheckCircle2
    }
  }

  const Icon = getIcon()

  const formatRole = (subOption) => {
    switch (subOption) {
      case 'Admin':
        return 'Administrator'
      case 'Staff':
        return 'Staff Member'
      case 'Employee':
        return 'Team Member'
      default:
        return subOption
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
        <CardHeader className='space-y-6 pb-2 pt-8'>
          <BackButton onClick={() => setStep(3)} disabled={isLoading} />

          <div className='mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center transition-transform hover:scale-105'>
            <Icon className='h-8 w-8 text-indigo-600' />
          </div>

          <div className='space-y-2 text-center'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              Confirm Your Details
            </h2>
            <p className='text-sm text-gray-500'>
              Please review your information before completing registration
            </p>
          </div>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-4'>
          <div className='space-y-6'>
            {/* Account Type */}
            <div className='bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-gray-900 mb-2'>Account Type</h3>
              <div className='space-y-1'>
                <p className='text-sm'>
                  <span className='font-medium text-gray-700'>TYPE: </span>
                  <span className='text-gray-900 font-semibold'>
                    {userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </span>
                </p>
                {subOption && (
                  <p className='text-sm'>
                    <span className='font-medium text-gray-700'>Role: </span>
                    <span className='text-gray-900 font-semibold'>
                      {formatRole(subOption)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-2'>
                Basic Information
              </h3>
              <div className='grid gap-4'>
                {Object.entries(formData)
                  .filter(
                    ([key, value]) =>
                      !['researchWorks', 'logo', 'password'].includes(key) &&
                      value
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className='flex justify-between items-center'
                    >
                      <p className='text-sm font-medium text-gray-700 capitalize'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className='text-sm font-semibold text-gray-900'>
                        {value}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Uploaded Files */}
            {(formData.researchWorks?.length > 0 || formData.logo) && (
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Uploaded Files
                </h3>
                <div className='space-y-2 bg-gray-50 p-4 rounded-lg'>
                  {formData.researchWorks?.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-indigo-600' />
                        <span className='text-sm font-medium text-gray-700'>
                          Research Work {index + 1}:
                        </span>
                      </div>
                      <span className='text-sm font-semibold text-gray-900'>
                        {file.name}
                      </span>
                    </div>
                  ))}
                  {formData.logo && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <FileText className='h-4 w-4 text-indigo-600' />
                        <span className='text-sm font-medium text-gray-700'>
                          Organization Logo:
                        </span>
                      </div>
                      <span className='text-sm font-semibold text-gray-900'>
                        {formData.logo.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
                Completing Registration...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
          <p className='text-xs text-center text-gray-500'>
            By completing registration, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ConfirmationStep
