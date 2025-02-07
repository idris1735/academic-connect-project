import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-6xl font-bold mb-4'>404</h1>
      <p className='text-xl mb-8'>Page Not Found</p>
      <Link
        href='/'
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Return Home
      </Link>
    </div>
  )
}
