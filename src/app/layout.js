'use client'

import PropTypes from 'prop-types'
import { useNavigationLoading } from '@/hooks/UseNavigationLoading'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Footer from '@/components/Footer'
import MessagingPopup from '@/components/MessagingPopup'
import { Toaster } from '@/components/ui/use-toast'
import './globals.css'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'
import { store } from '@/lib/store/store'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const isLoading = useNavigationLoading()

  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider store={store}>
          <div className='flex flex-col min-h-screen'>
            {isLoading && <LoadingSpinner />}
            <main className='flex-grow'>{children}</main>
            <Footer />
            <MessagingPopup />
            <Toaster />
          </div>
        </Provider>
      </body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
