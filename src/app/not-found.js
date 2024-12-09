import Link from 'next/link'

export default function NotFound() {
  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            404 - Page Not Found
          </h1>
          <p style={{ marginBottom: '2rem' }}>
            {/* The page you're looking for doesn't exist or has been moved. */}
            page not found
          </p>
          <Link
            href='/'
            style={{
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              textDecoration: 'none',
            }}
          >
            Return Home
          </Link>
        </div>
      </body>
    </html>
  )
}
