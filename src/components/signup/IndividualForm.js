// components/signup/IndividualForm.js
import { useState } from 'react'
import { motion } from 'framer-motion'

const IndividualForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    occupation: '',
    interests: '',
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
      <h2 className='text-2xl font-semibold mb-6'>Individual Information</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='occupation'
            className='block text-sm font-medium text-gray-700'
          >
            Occupation
          </label>
          <input
            type='text'
            id='occupation'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.occupation}
            onChange={(e) =>
              setFormData({ ...formData, occupation: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='interests'
            className='block text-sm font-medium text-gray-700'
          >
            Research Interests
          </label>
          <textarea
            id='interests'
            rows='3'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            value={formData.interests}
            onChange={(e) =>
              setFormData({ ...formData, interests: e.target.value })
            }
            required
          ></textarea>
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

export default IndividualForm
