'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/app/firebase-config'

const GeneralSignupForm = ({ preSignupData, userType }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  })
  const [error, setError] = useState('')
  const [countries, setCountries] = useState([])
  const [showPassword, setShowPassword] = useState(false)

  // Dummy country list to avoid API dependency
  useEffect(() => {
    const dummyCountries = [
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Canada', code: 'CA' },
      { name: 'Australia', code: 'AU' },
      { name: 'India', code: 'IN' },
      { name: 'Nigeria', code: 'NG' },
      { name: 'Germany', code: 'DE' },
    ]
    setCountries(dummyCountries)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Log formData for debugging
    console.log('Form Data:', formData)

    // Validate email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user

      // Update profile with first and last name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      })

      // Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userType: userType,
        country: formData.country,
        createdAt: serverTimestamp(),
        [userType]: preSignupData,
      })

      // Redirect to dashboard
      router.push('/feeds')
    } catch (error) {
      console.error('Signup Error:', error)
      setError(error.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'
    >
      <h2 className='text-2xl font-semibold mb-6 text-gray-800 dark:text-white'>
        Create Your Account
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='firstName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            First Name
          </label>
          <input
            type='text'
            id='firstName'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='lastName'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Last Name
          </label>
          <input
            type='text'
            id='lastName'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Password
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              id='password'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label
            htmlFor='country'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Country
          </label>
          <select
            id='country'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
          >
            <option value=''>Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button
          type='submit'
          className='w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200'
        >
          Create Account
        </button>
      </form>
    </motion.div>
  )
}

export default GeneralSignupForm
