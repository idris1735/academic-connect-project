'use client'

import { useSignupStore } from '@/lib/store/signupStore'
import { UserTypeSelection } from './UserTypeSelection'
import { EmailVerificationStep } from './EmailVerificationStep'
import IndividualForm from './IndividualForm'
import CorporateForm from './CorporateForm'
import InstitutionForm from './InstitutionForm'
import { ProgressSteps } from './ProgressSteps'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmationStep from './ConfirmationStep'
import GeneralSignupForm from './GeneralSignupForm'


export function SignupFlow() {
  const { step, userType, subOption, formData, setStep } = useSignupStore(
    (state) => ({
      step: state.step,
      userType: state.userType,
      subOption: state.subOption,
      formData: state.formData,
      setStep: state.setStep,
    })
  )

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleComplete = (data) => {
    // Handle form completion
    console.log('Completed with data:', data)
  }

  const renderForm = () => {
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
    <div className='min-h-screen bg-gradient-to-b from-primary/5 via-background to-background'>
      <div className='container mx-auto px-4 py-8'>
        <ProgressSteps />

        <AnimatePresence mode='wait'>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='mt-8'
          >
            {step === 1 && <UserTypeSelection />}
            {step === 2 && <EmailVerificationStep />}
            {step === 3 && renderForm()}
            {step === 4 && (
              <ConfirmationStep
                formData={formData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
