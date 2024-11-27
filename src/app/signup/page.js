'use client'
import { useState } from 'react'
import UserTypeSelection from '@/components/signup/UserTypeSelection'
import CorporateForm from '@/components/signup/CorporateForm'
import InstitutionForm from '@/components/signup/InstitutionForm'
import IndividualForm from '@/components/signup/IndividualForm'
import GeneralSignupForm from '@/components/signup/GeneralSignupForm'

const SignupPage = () => {
  const [step, setStep] = useState('userType')
  const [userType, setUserType] = useState(null)
  const [preSignupData, setPreSignupData] = useState({})

  const handleUserTypeSelect = (type) => {
    setUserType(type)
    setStep(type)
  }

  const handlePreSignupComplete = (data) => {
    setPreSignupData({ ...preSignupData, ...data })
    setStep('generalSignup')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100'>
      <div className='container mx-auto px-4 py-8'>
        {step === 'userType' && (
          <UserTypeSelection onSelect={handleUserTypeSelect} />
        )}
        {step === 'corporate' && (
          <CorporateForm onComplete={handlePreSignupComplete} />
        )}
        {step === 'institution' && (
          <InstitutionForm onComplete={handlePreSignupComplete} />
        )}
        {step === 'individual' && (
          <IndividualForm onComplete={handlePreSignupComplete} />
        )}
        {step === 'generalSignup' && (
          <GeneralSignupForm
            preSignupData={preSignupData}
            userType={userType}
          />
        )}
      </div>
    </div>
  )
}

export default SignupPage
