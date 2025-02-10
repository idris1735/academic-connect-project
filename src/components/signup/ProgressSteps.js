'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { useSignupStore } from '../../lib/store/signupStore'

export function ProgressSteps() {
  const { step, userType, subOption } = useSignupStore()

  const getStepTitle = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return 'Account Type'
      case 2:
        return 'Email Verification'
      case 3:
        if (userType === 'individual') return 'Personal Details'
        return subOption === 'Admin' ? 'Organization Setup' : 'Member Details'
      case 4:
        return 'Confirmation'
      default:
        return `Step ${stepNumber}`
    }
  }

  const getStepDescription = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return 'Choose your role'
      case 2:
        return 'Verify your email'
      case 3:
        if (userType === 'individual') return 'Complete your profile'
        return subOption === 'Admin'
          ? 'Setup organization'
          : 'Complete your details'
      case 4:
        return 'Review and finish'
      default:
        return ''
    }
  }

  const steps = [1, 2, 3, 4]
  const progress = ((step - 1) / (steps.length - 1)) * 100

  return (
    <div className='w-full max-w-4xl mx-auto px-4 py-8'>
      <div className='relative'>
        {/* Progress Bar */}
        <div className='absolute top-[1.625rem] left-0 w-full h-1 bg-gray-100 rounded-full'>
          <motion.div
            className='absolute top-0 left-0 h-full bg-indigo-600 rounded-full'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className='relative flex justify-between'>
          {steps.map((s) => (
            <div
              key={s}
              className={`flex flex-col items-center ${
                s <= step ? 'cursor-default' : 'cursor-not-allowed opacity-60'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: s === step ? 1.2 : 1,
                  transition: { type: 'spring', stiffness: 500, damping: 30 },
                }}
                className={`
                  relative z-10 flex items-center justify-center w-13 h-13 rounded-full 
                  bg-white border-2 transition-all duration-200
                  ${
                    s < step
                      ? 'border-indigo-600 text-indigo-600'
                      : s === step
                      ? 'border-indigo-600 text-indigo-600 shadow-md'
                      : 'border-gray-200 text-gray-400'
                  }
                `}
              >
                {s < step ? (
                  <CheckCircle2 className='w-6 h-6 fill-current' />
                ) : (
                  <div className='flex flex-col items-center justify-center'>
                    <Circle className='w-6 h-6' />
                    <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-2 border-current rounded-full' />
                  </div>
                )}
              </motion.div>

              <div className='mt-4 space-y-1 text-center'>
                <p
                  className={`text-sm font-semibold ${
                    s <= step ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {getStepTitle(s)}
                </p>
                <p
                  className={`text-xs ${
                    s <= step ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {getStepDescription(s)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
