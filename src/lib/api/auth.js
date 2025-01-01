import { auth } from '@/app/firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'

// Authentication API service
export const authApi = {
  signup: async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Signup failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  verifyEmail: async (email, code) => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/auth/verify-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, code }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Email verification failed')
      }

      return response.json()
    } catch (error) {
      if (error.message) throw error
      throw new Error('Failed to verify email')
    }
  },

  verifyOrganization: async (code, type) => {
    try {
      const response = await fetch('/api/auth/verify-organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, type }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(
          error.error?.message || 'Organization verification failed'
        )
      }

      return response.json()
    } catch (error) {
      throw new Error(error.message)
    }
  },

  // Add logout function
  logout: async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      return response.json()
    } catch (error) {
      throw new Error(error.message)
    }
  },

  login: async (credentials) => {
    try {
      // First, authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      // Get the ID token
      const idToken = await userCredential.user.getIdToken()

      // Store the token
      localStorage.setItem('idToken', idToken)

      // Then send the token to your backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const responseData = await response.json()
      return {
        user: userCredential.user,
        ...responseData,
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error(
          'Unable to connect to server. Please check your internet connection.'
        )
      }
      throw error
    }
  },
}
