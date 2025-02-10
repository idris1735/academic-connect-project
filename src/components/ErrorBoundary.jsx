'use client'

import { Component } from 'react'
import { Button } from './ui/button'
import { RefreshCcw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>
          <div className='text-center space-y-4 max-w-md'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Something went wrong
            </h2>
            <p className='text-gray-600'>
              We apologize for the inconvenience. Please try again.
            </p>
            <Button
              onClick={this.handleRetry}
              className='flex items-center gap-2'
            >
              <RefreshCcw className='h-4 w-4' />
              Retry
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
