export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div className='absolute inset-0 border-4 border-primary/30 rounded-full'></div>
        <div className='absolute inset-0 border-4 border-primary rounded-full animate-[spin_1s_linear_infinite] border-t-transparent'></div>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className='fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center'>
      <div className='flex flex-col items-center'>
        <div className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 mb-8'>
          AcademicConnect
        </div>

        <div className='flex gap-2'>
          <div
            className='w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite]'
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className='w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite]'
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className='w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite]'
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          Loading your research environment...
        </p>
      </div>
    </div>
  )
}
