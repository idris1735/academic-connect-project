'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const VerificationStep = ({ onBack, onComplete }) => {
  const handleVerify = () => {
    // Simulate verification logic
    onComplete() // Call onComplete to proceed to the next step
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-md mx-auto'
    >
      <h2 className='text-2xl font-bold'>Verification Step</h2>
      <p className='text-sm text-muted-foreground'>
        Please complete the verification process.
      </p>
      {/* Add your verification UI here (e.g., voice, face, or CAPTCHA) */}
      <Button onClick={handleVerify} className='mt-4'>
        Verify
      </Button>
      <Button variant='outline' onClick={onBack} className='mt-2'>
        Back
      </Button>
    </motion.div>
  )
}

export default VerificationStep
