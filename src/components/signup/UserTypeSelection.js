'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Building2, GraduationCap, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSignupStore } from '@/lib/store/signupStore'

export function UserTypeSelection() {
  const { userType, setUserType, setSubOption, updateFormData, setStep } =
    useSignupStore((state) => ({
      userType: state.userType,
      setUserType: state.setUserType,
      setSubOption: state.setSubOption,
      updateFormData: state.updateFormData,
      setStep: state.setStep,
    }))

  const handleUserTypeChange = (type, subOption = null) => {
    console.log('Selected Type:', type, 'SubOption:', subOption)
    setUserType(type)
    setSubOption(subOption)
    setStep(2)

    updateFormData({
      userType: type,
      subOption: subOption,
      // Reset any previous form data
      fullName: '',
      password: '',
      occupation: '',
      researchInterests: '',
      researchWorks: [],
    })
  }

  const userTypes = [
    {
      id: 'corporate',
      title: 'Government/Corporate',
      description: 'For organizations and government bodies',
      icon: Building2,
      subOptions: [
        { id: 'Admin', label: 'Administrator Access' },
        { id: 'Employee', label: 'Employee Access' },
      ],
    },
    {
      id: 'institution',
      title: 'Educational Institution',
      description: 'For schools, universities, and research centers',
      icon: GraduationCap,
      subOptions: [
        { id: 'Admin', label: 'Institution Administrator' },
        { id: 'Staff', label: 'Academic Staff' },
      ],
    },
    {
      id: 'individual',
      title: 'Individual',
      description: 'For personal use, not affiliated with research',
      icon: User,
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-primary/5 via-background to-background'>
      <div className='container mx-auto px-4 py-16'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='max-w-4xl mx-auto text-center mb-12'
        >
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80'>
            Join AcademicConnect
          </h1>
          <p className='text-lg text-muted-foreground'>
            Select your user type to get started with your research journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid gap-6 md:grid-cols-3 max-w-6xl mx-auto'
        >
          <AnimatePresence mode='wait'>
            {userTypes.map((type) => (
              <motion.div
                key={type.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`relative h-full overflow-hidden cursor-pointer transition-all duration-300
                    ${
                      userType === type.id
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:shadow-lg'
                    }`}
                >
                  <div className='p-6 space-y-4'>
                    <motion.div
                      className='mb-4 flex justify-center'
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className='w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center'>
                        <type.icon className='w-10 h-10 text-primary' />
                      </div>
                    </motion.div>

                    <h2 className='text-2xl font-semibold text-center'>
                      {type.title}
                    </h2>
                    <p className='text-sm text-muted-foreground text-center'>
                      {type.description}
                    </p>

                    {type.subOptions ? (
                      <div className='mt-4 space-y-2'>
                        {type.subOptions.map((subOption) => (
                          <Button
                            key={subOption.id}
                            variant={
                              userType === type.id && subOption.id === subOption
                                ? 'default'
                                : 'outline'
                            }
                            className='w-full justify-start text-left'
                            onClick={() =>
                              handleUserTypeChange(type.id, subOption.id)
                            }
                          >
                            {subOption.label}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Button
                        className='w-full mt-4'
                        variant={userType === type.id ? 'default' : 'outline'}
                        onClick={() => handleUserTypeChange(type.id)}
                      >
                        Continue as {type.title}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='mt-12 text-center'
        >
          <p className='text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm'
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
