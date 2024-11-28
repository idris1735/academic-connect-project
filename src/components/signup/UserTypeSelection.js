'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Building2, GraduationCap, User, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/components/ui/card'

const UserTypeSelection = ({ onSelect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  const handleSelect = async (typeId) => {
    setSelectedType(typeId)
    setIsLoading(true)
    // Simulate loading state
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    onSelect(typeId)
  }

  const userTypes = [
    {
      id: 'corporate',
      title: 'Government/Corporate',
      description: 'For organizations and government bodies',
      icon: Building2,
    },
    {
      id: 'institution',
      title: 'Educational Institution',
      description: 'For schools, universities, and research centers',
      icon: GraduationCap,
    },
    {
      id: 'individual',
      title: 'Individual',
      description: 'For personal use, not affiliated with research',
      icon: User,
    },
  ]

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
                      selectedType === type.id
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'hover:shadow-lg'
                    }
                    ${
                      isLoading && selectedType === type.id ? 'opacity-80' : ''
                    }`}
                  onClick={() => !isLoading && handleSelect(type.id)}
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

                    <button
                      disabled={isLoading}
                      className={`w-full mt-4 relative inline-flex items-center justify-center px-4 py-3 text-sm font-medium
                        transition-colors rounded-lg
                        ${
                          selectedType === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-primary/10 hover:bg-primary/20 text-primary'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading && selectedType === type.id ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Processing...
                        </>
                      ) : (
                        `Continue as ${type.title}`
                      )}
                    </button>
                  </div>

                  {/* Decorative corner accent */}
                  <div className='absolute top-0 right-0 w-20 h-20 transform translate-x-10 -translate-y-10'>
                    <div className='absolute transform rotate-45 bg-primary/5 w-full h-full' />
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
            <button
              onClick={() => onSelect('login')}
              className='text-primary hover:text-primary/80 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm'
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default UserTypeSelection
