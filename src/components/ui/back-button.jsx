import { ArrowLeft } from 'lucide-react'

export function BackButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='absolute top-6 left-6 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50'
    >
      <ArrowLeft className='h-5 w-5' />
      <span className='sr-only'>Go back</span>
    </button>
  )
}
