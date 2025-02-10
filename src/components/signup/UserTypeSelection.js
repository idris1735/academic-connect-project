'use client'

import { useSignupStore } from '../../lib/store/signupStore'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { User, Building2, GraduationCap, ChevronRight } from 'lucide-react'

export function UserTypeSelection() {
  const { setUserType, setSubOption, setStep } = useSignupStore()

  const handleSelect = (type, subOption = null) => {
    setUserType(type)
    setSubOption(subOption)
    setStep(2)
  }

  const userTypes = [
    {
      id: 'individual',
      title: 'Individual Researcher',
      description: 'For independent researchers and academics',
      icon: User,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      hoverBg: 'hover:bg-indigo-50/50',
      hoverBorder: 'hover:border-indigo-200',
      buttonStyle:
        'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm hover:shadow-indigo-100',
    },
    {
      id: 'corporate',
      title: 'Corporate Organization',
      description: 'For companies and research organizations',
      icon: Building2,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50/50',
      hoverBorder: 'hover:border-blue-200',
      subOptions: [
        {
          id: 'Admin',
          label: 'Administrator Access',
          description: 'Organization setup & management',
          buttonStyle:
            'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-blue-100',
        },
        {
          id: 'Employee',
          label: 'Employee Access',
          description: 'Team member access',
          buttonStyle:
            'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-emerald-100',
        },
      ],
    },
    {
      id: 'institution',
      title: 'Academic Institution',
      description: 'For universities and educational bodies',
      icon: GraduationCap,
      color: 'bg-violet-50',
      textColor: 'text-violet-600',
      hoverBg: 'hover:bg-violet-50/50',
      hoverBorder: 'hover:border-violet-200',
      subOptions: [
        {
          id: 'Admin',
          label: 'Institution Administrator',
          description: 'Institution setup & management',
          buttonStyle:
            'border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white shadow-sm hover:shadow-violet-100',
        },
        {
          id: 'Staff',
          label: 'Academic Staff',
          description: 'Faculty member access',
          buttonStyle:
            'border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white shadow-sm hover:shadow-rose-100',
        },
      ],
    },
  ]

  return (
    <motion.div
      className='p-6 md:p-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Choose your account type
        </h2>
        <p className='text-gray-500'>
          Select the option that best describes you
        </p>
      </div>

      <div className='space-y-4'>
        {userTypes.map((type) => {
          const Icon = type.icon
          return (
            <Card
              key={type.id}
              className={`group cursor-pointer border-2 transition-all duration-200 ${type.hoverBorder} ${type.hoverBg} shadow-md hover:shadow-lg`}
            >
              <CardContent className='p-6'>
                <div className='flex items-center'>
                  <div
                    className={`w-12 h-12 rounded-xl ${type.color} ${type.textColor} flex items-center justify-center mr-4 transition-transform group-hover:scale-110`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 mb-1'>
                      {type.title}
                    </h3>
                    <p className='text-sm text-gray-500'>{type.description}</p>
                  </div>
                  {!type.subOptions && (
                    <ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors' />
                  )}
                </div>

                {type.subOptions ? (
                  <div className='mt-4 grid grid-cols-2 gap-3 pt-4 border-t'>
                    {type.subOptions.map((subOption) => (
                      <Button
                        key={subOption.id}
                        className={`h-auto p-4 justify-start text-left transition-all bg-transparent ${subOption.buttonStyle}`}
                        onClick={() => handleSelect(type.id, subOption.id)}
                      >
                        <div>
                          <div className='font-medium'>{subOption.label}</div>
                          <div className='text-xs mt-1 opacity-80'>
                            {subOption.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Button
                    className='w-full mt-4 h-12 bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100'
                    onClick={() => handleSelect(type.id)}
                  >
                    Continue as Individual
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className='mt-8 text-center text-sm text-gray-500'>
        Not sure which to choose?{' '}
        <Button
          variant='link'
          className='text-indigo-600 hover:text-indigo-700 font-medium'
        >
          Compare account types
        </Button>
      </div>
    </motion.div>
  )
}
