'use client'

import { useState } from 'react'
import { useSignupStore } from '../../lib/store/signupStore'
import { UserTypeSelection } from './UserTypeSelection'
import { EmailVerificationStep } from './EmailVerificationStep'
import IndividualForm from './IndividualForm'
import CorporateForm from './CorporateForm'
import InstitutionForm from './InstitutionForm'
import { ProgressSteps } from './ProgressSteps'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmationStep from './ConfirmationStep'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function SignupFlow() {
  const { step, userType, formData, setStep } = useSignupStore()

  const renderForm = () => {
    switch (userType) {
      case 'corporate':
        return <CorporateForm />
      case 'institution':
        return <InstitutionForm />
      case 'individual':
        return <IndividualForm />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center py-8 px-4'>
      <div className='w-full max-w-4xl'>
        {/* Logo & Sign In Link */}
        <div className='flex justify-between items-center mb-8'>
          <Link
            href='/'
            className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800'
          >
            AcademicConnect
          </Link>
          <Link
            href='/login'
            className='text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2'
          >
            Already have an account?
            <span className='font-medium text-indigo-600'>Sign in</span>
          </Link>
        </div>

        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Create your account
          </h1>
          <p className='text-gray-600'>
            Join our community of researchers and innovators
          </p>
        </div>

        {/* Progress Steps */}
        <div className='mb-8'>
          <ProgressSteps />
        </div>

        {/* Main Form Container */}
        <div className='bg-white rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className='min-h-[400px]'
            >
              {step === 1 && <UserTypeSelection />}
              {step === 2 && <EmailVerificationStep />}
              {step === 3 && renderForm()}
              {step === 4 && (
                <ConfirmationStep
                  formData={formData}
                  onBack={() => setStep(step - 1)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className='text-center text-sm text-gray-500 mt-8'>
          By continuing, you agree to our{' '}
          <Link
            href='/terms'
            className='text-indigo-600 hover:text-indigo-700 font-medium'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy'
            className='text-indigo-600 hover:text-indigo-700 font-medium'
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
