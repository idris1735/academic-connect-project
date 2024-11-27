// components/signup/InstitutionForm.js
import { useState } from 'react'
import { motion } from 'framer-motion'

const InstitutionForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: '',
    researchFocus: '',
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
        Educational Institution Information
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='institutionName'
            className='block text-sm font-medium text-gray-700'
          >
            Institution Name
          </label>
          <input
            type='text'
            id='institutionName'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.institutionName}
            onChange={(e) =>
              setFormData({ ...formData, institutionName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='institutionType'
            className='block text-sm font-medium text-gray-700'
          >
            Institution Type
          </label>
          <select
            id='institutionType'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.institutionType}
            onChange={(e) =>
              setFormData({ ...formData, institutionType: e.target.value })
            }
            required
          >
            <option value=''>Select Type</option>
            <option value='university'>University</option>
            <option value='college'>College</option>
            <option value='research_center'>Research Center</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor='researchFocus'
            className='block text-sm font-medium text-gray-700'
          >
            Primary Research Focus
          </label>
          <input
            type='text'
            id='researchFocus'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.researchFocus}
            onChange={(e) =>
              setFormData({ ...formData, researchFocus: e.target.value })
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

export default InstitutionForm
