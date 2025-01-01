'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle } from 'lucide-react'
import { useSignupStore } from '@/lib/store/signupStore'

export function ProgressSteps() {
  const { step, userType, subOption } = useSignupStore((state) => ({
    step: state.step,
    userType: state.userType,
    subOption: state.subOption,
  }))

  // Dynamic steps based on user type and sub-option
  const getSteps = () => {
    const baseSteps = [
      { id: 1, name: 'User Type' },
      { id: 2, name: 'Email Verification' },
    ]

    // Add specific form step based on user type
    if (userType === 'individual') {
      baseSteps.push({ id: 3, name: 'Individual Details' })
    } else if (userType === 'corporate') {
      baseSteps.push({
        id: 3,
        name:
          subOption === 'Admin' ? 'Organization Setup' : 'Organization Access',
      })
    } else if (userType === 'institution') {
      baseSteps.push({
        id: 3,
        name:
          subOption === 'Admin' ? 'Institution Setup' : 'Institution Access',
      })
    } else {
      baseSteps.push({ id: 3, name: 'Account Details' })
    }

    // Add confirmation step
    baseSteps.push({ id: 4, name: 'Confirmation' })

    return baseSteps
  }

  const steps = getSteps()
  const progress = ((step - 1) / (steps.length - 1)) * 100

  return (
    <div className='w-full max-w-4xl mx-auto mb-8 px-4'>
      <div className='relative'>
        {/* Progress Bar */}
        <div className='absolute top-5 left-0 w-full h-0.5 bg-muted'>
          <motion.div
            className='absolute top-0 left-0 h-full bg-primary'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className='relative flex justify-between'>
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col items-center ${
                s.id <= step ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: s.id === step ? 1.2 : 1,
                  transition: { type: 'spring', stiffness: 500, damping: 30 },
                }}
                className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full 
                  ${
                    s.id < step
                      ? 'bg-primary text-primary-foreground'
                      : s.id === step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }
                  transition-colors duration-200
                `}
              >
                {s.id < step ? (
                  <CheckCircle2 className='w-6 h-6' />
                ) : (
                  <Circle className='w-6 h-6' />
                )}
              </motion.div>
              <div className='mt-2 text-sm font-medium text-center'>
                <span className='hidden sm:block'>{s.name}</span>
                <span className='sm:hidden'>{s.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
