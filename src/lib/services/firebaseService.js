import { auth } from '@/app/firebase-config'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const firebaseService = {
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Firebase signup error:', error)
      throw error
    }
  },

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Firebase signin error:', error)
      throw error
    }
  },

  async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Firebase signout error:', error)
      throw error
    }
  },

  async getIdToken() {
    const user = auth.currentUser
    if (!user) throw new Error('No user logged in')
    return user.getIdToken()
  }
} 