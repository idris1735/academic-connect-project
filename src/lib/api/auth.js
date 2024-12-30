import { firebaseService } from '@/lib/services/firebaseService'

export const authApi = {
  signup: async (formData) => {
    try {
      // First create Firebase user
      const firebaseUser = await firebaseService.signUp(
        formData.email,
        formData.password
      )

      // Get ID token
      const idToken = await firebaseUser.getIdToken()

      // Send to backend
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          userType: formData.userType,
          subOption: formData.subOption,
          formData: formData,
        }),
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

  login: async (credentials) => {
    try {
      // First authenticate with Firebase
      const firebaseUser = await firebaseService.signIn(
        credentials.email,
        credentials.password
      )

      // Get ID token
      const idToken = await firebaseUser.getIdToken()

      // Exchange for session cookie
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await firebaseService.signOut()

      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },
}
