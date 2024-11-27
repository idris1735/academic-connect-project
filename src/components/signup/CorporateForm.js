'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const CorporateForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    employeeCount: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-8'
    >
      <h2 className='text-2xl font-semibold mb-6'>
        Corporate/Government Information
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='organizationName'
            className='block text-sm font-medium text-gray-700'
          >
            Organization Name
          </label>
          <input
            type='text'
            id='organizationName'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.organizationName}
            onChange={(e) =>
              setFormData({ ...formData, organizationName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='industry'
            className='block text-sm font-medium text-gray-700'
          >
            Industry
          </label>
          <input
            type='text'
            id='industry'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='employeeCount'
            className='block text-sm font-medium text-gray-700'
          >
            Number of Employees
          </label>
          <input
            type='number'
            id='employeeCount'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.employeeCount}
            onChange={(e) =>
              setFormData({ ...formData, employeeCount: e.target.value })
            }
            required
          />
        </div>
        <button
          type='submit'
          className='w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50'
        >
          Continue
        </button>
      </form>
    </motion.div>
  )
}

export default CorporateForm
