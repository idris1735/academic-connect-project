import localFont from 'next/font/local'
import './globals.css'
import Footer from '@/components/Footer' // Add this import
import MessagingPopup from '@/components/MessagingPopup'

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
          <MessagingPopup />
        </div>
      </body>
    </html>
  )
}
