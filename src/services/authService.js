import { auth, db } from '@/lib/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { signupService } from './signupService'

class AuthService {
  async signUp(userData, userType, subOption = null) {
    try {
      // 1. Create Firebase Auth user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )

      // 2. Create user profile and related collections
      await signupService.createUserProfile(
        {
          ...userData,
          uid: user.uid,
        },
        userType,
        subOption
      )

      // After successful Firebase authentication
      const idToken = await user.getIdToken()
      // Set cookie with appropriate options
      document.cookie = `session=${idToken}; path=/; max-age=3600; secure; samesite=strict`

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
        },
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async login(email, password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)

      // Check if user exists in users collection
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        throw new Error('User profile not found')
      }

      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      })

      // After successful Firebase authentication
      const idToken = await user.getIdToken()
      // Set cookie with appropriate options
      document.cookie = `session=${idToken}; path=/; max-age=3600; secure; samesite=strict`

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
        },
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
}

export const authService = new AuthService()
