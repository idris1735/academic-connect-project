'use client'

import PropTypes from 'prop-types'
import { useNavigationLoading } from '@/hooks/UseNavigationLoading'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Footer from '@/components/Footer'
import MessagingPopup from '@/components/MessagingPopup'
import './globals.css'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

export default function RootLayout({ children }) {
  const isLoading = useNavigationLoading()

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <div className="flex flex-col min-h-screen">
            {isLoading && <LoadingSpinner />}
            <main className="flex-grow">{children}</main>
            <Footer />
            <MessagingPopup />
          </div>
        </Provider>
      </body>
    </html>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
