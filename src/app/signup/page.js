'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import { motion, AnimatePresence } from 'framer-motion'
import UserTypeSelection from '@/components/signup/UserTypeSelection'
import CorporateForm from '@/components/signup/CorporateForm'
import InstitutionForm from '@/components/signup/InstitutionForm'
import IndividualForm from '@/components/signup/IndividualForm'
import GeneralSignupForm from '@/components/signup/GeneralSignupForm'

const SignupPage = () => {
  const [step, setStep] = useState(1) // Maintain step-based navigation
  const router = useRouter() // Initialize router
  const [userType, setUserType] = useState(null)
  const [subOption, setSubOption] = useState(null)
  const [formData, setFormData] = useState({})

  const handleUserTypeSelect = (type, option) => {
    setUserType(type)
    setSubOption(option)
    setStep(2)
  }

  const handleFormComplete = (data) => {
    setFormData((prevData) => ({ ...prevData, ...data }))
    setStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const handleFinalSubmit = async (data) => {
    const finalData = { ...formData, ...data }
    console.log('Final submission data:', finalData)
    alert('Registration completed successfully!')
    // Reset the form or redirect to a success page
    setStep(1)
    setUserType(null)
    setSubOption(null)
    setFormData({})
    // Navigate to feeds page
    router.push('/feeds')
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <UserTypeSelection onSelect={handleUserTypeSelect} />
      case 2:
        switch (userType) {
          case 'corporate':
            return (
              <CorporateForm
                onComplete={handleFormComplete}
                onBack={handleBack}
                subOption={subOption}
              />
            )
          case 'institution':
            return (
              <InstitutionForm
                onComplete={handleFormComplete}
                onBack={handleBack}
                subOption={subOption}
              />
            )
          case 'individual':
            return (
              <IndividualForm
                onComplete={handleFormComplete}
                onBack={handleBack}
              />
            )
          default:
            return null
        }
      case 3:
        return (
          <GeneralSignupForm
            onComplete={handleFinalSubmit}
            onBack={handleBack}
            userType={userType}
            preSignupData={formData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'>
      <div className='container mx-auto px-4 py-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SignupPage
