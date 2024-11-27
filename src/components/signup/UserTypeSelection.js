// components/signup/UserTypeSelection.js
import { motion } from 'framer-motion'
import { Building2, GraduationCap, User } from 'lucide-react'

const UserTypeSelection = ({ onSelect }) => {
  const userTypes = [
    {
      id: 'corporate',
      title: 'Government/Corporate',
      description: 'For organizations and government bodies',
      icon: <Building2 className='w-12 h-12 text-indigo-600' />,
    },
    {
      id: 'institution',
      title: 'Educational Institution',
      description: 'For schools, universities, and research centers',
      icon: <GraduationCap className='w-12 h-12 text-indigo-600' />,
    },
    {
      id: 'individual',
      title: 'Individual',
      description: 'For personal use, not affiliated with research',
      icon: <User className='w-12 h-12 text-indigo-600' />,
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50/50 to-white'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto text-center mb-12'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl mb-4'>
            Join AcademicConnect
          </h1>
          <p className='text-lg text-muted-foreground'>
            Select your user type to get started
          </p>
        </div>
        <div className='grid gap-6 md:grid-cols-3'>
          {userTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-indigo-600 ${
                type.id === 'active' ? 'border-indigo-600 scale-[1.02]' : ''
              }`}
              onClick={() => onSelect(type.id)}
            >
              <div className='mb-4 flex justify-center'>
                <div className='w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center'>
                  {type.icon}
                </div>
              </div>
              <h2 className='text-2xl font-semibold mb-2'>{type.title}</h2>
              <p className='text-sm text-gray-600 dark:text-gray-300 mb-4'>
                {type.description}
              </p>
              <button className='w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200'>
                Continue as {type.title}
              </button>
            </motion.div>
          ))}
        </div>
        <div className='mt-12 text-center'>
          <p className='text-sm text-muted-foreground'>
            Already have an account?{' '}
            <button
              className='text-indigo-600 underline'
              onClick={() => onSelect('login')}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection
