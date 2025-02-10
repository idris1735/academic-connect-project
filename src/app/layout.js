import { Inter } from 'next/font/google'
import './globals.css'
import { StreamChatProvider } from '@/components/StreamChatProvider'
import MessagingPopup from '@/components/MessagingPopup'
import { Toaster } from '@/components/ui/toaster'
import ClientLayout from '@/components/ClientLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Academic Connect',
  description: 'Connect with researchers and academics worldwide',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ErrorBoundary>
          <StreamChatProvider>
            <ClientLayout>{children}</ClientLayout>
            <MessagingPopup />
            <Toaster />
          </StreamChatProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
