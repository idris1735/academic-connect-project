// File: src/components/ui/use-toast.js
import { useState } from 'react'

/**
 * Custom hook to manage toast notifications.
 * Provides methods to show, update, and dismiss notifications.
 */
export function useToast() {
  const [toasts, setToasts] = useState([])

  // Add a new toast notification
  const showToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])
  }

  // Remove a specific toast notification
  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    dismissToast,
  }
}
