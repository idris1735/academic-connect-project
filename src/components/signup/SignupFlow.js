import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UserTypeSelection from './UserTypeSelection'
import CorporateForm from './CorporateForm'
import InstitutionForm from './InstitutionForm'
import IndividualForm from './IndividualForm'
import GeneralSignupForm from './GeneralSignupForm'

const SignupFlow = () => {
  const [step, setStep] = useState(1)
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
    // Typically, you would send the data to your backend
    // await submitToBackend(finalData)
    alert('Registration completed successfully!')
    // Reset the form or redirect to a success page
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
    <div className='min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
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

export default SignupFlow
