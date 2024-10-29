import localFont from 'next/font/local'
import './globals.css'
import Footer from '@/components/Footer' // Add this import

export const metadata = {
  title: 'Academic Connect Project',
  description: 'Connect researchers globally',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <div className='flex flex-col min-h-screen'>
          <main className='flex-grow'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
