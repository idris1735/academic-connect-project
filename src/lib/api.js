'use client'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from '@/components/ui/toast'

// Create a standalone toast function using DOM
const showToast = (title, description, variant = 'destructive') => {
  // Create a container for the toast if it doesn't exist
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    document.body.appendChild(toastContainer)
  }

  // Create and render the toast
  const toastRoot = document.createElement('div')
  toastContainer.appendChild(toastRoot)

  // Create and render the toast using createRoot
  const root = ReactDOM.createRoot(toastRoot)

  const ToastComponent = () => {
    const [show, setShow] = React.useState(true)

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShow(false)
        // Remove the toast element after animation
        setTimeout(() => {
          root.unmount() // Properly unmount the root
          toastContainer.removeChild(toastRoot)
          if (toastContainer.childNodes.length === 0) {
            document.body.removeChild(toastContainer)
          }
        }, 300)
      }, 5000)

      return () => clearTimeout(timer)
    }, [])

    return (
      <ToastProvider>
        {show && (
          <Toast variant={variant} onOpenChange={setShow}>
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    )
  }

  root.render(<ToastComponent />)
}

// Utility function to handle specific API errors
export const handleApiError = (response) => {
  if (response.status === 503) {
    showToast(
      'Connection Error',
      'Please check your internet connection and try again'
    )
    return true
  }
  return false
}

// Wrapper function for fetch API calls
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      if (handleApiError(response)) {
        return null
      }
      throw new Error('Network response was not ok')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Example utilisation
// import { fetchWithErrorHandling } from '@/lib/api'

// // In your component
// const fetchData = async () => {
//   try {
//     const data = await fetchWithErrorHandling('/api/some-endpoint')
//     if (data === null) {
//       // Handle connection error case
//       return
//     }
//     // Use the data
//   } catch (error) {
//     // Handle other errors
//   }
// }
