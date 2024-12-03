'use client'

import { useNavigationLoading } from '@/hooks/UseNavigationLoading'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Footer from '@/components/Footer'
import MessagingPopup from '@/components/MessagingPopup'
import './globals.css'

export default function RootLayout({ children }) {
  const isLoading = useNavigationLoading()

  return (
    <html lang='en'>
      <body>
        <div className='flex flex-col min-h-screen'>
          {isLoading && <LoadingSpinner />}
          <main className='flex-grow'>{children}</main>
          <Footer />
          <MessagingPopup />
        </div>
      </body>
    </html>
  )
}

