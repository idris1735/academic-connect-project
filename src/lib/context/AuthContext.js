'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { LoadingScreen } from '@/components/ui/loading-spinner'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
