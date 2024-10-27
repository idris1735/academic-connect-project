import localFont from 'next/font/local'
import './globals.css'

// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'Academic Connect Project',
  description: 'Connect researchers globally',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
