import { NextResponse } from 'next/server'
import { getToken } from 'next-csrf'

const CSRF_TOKEN_SECRET = process.env.CSRF_SECRET || 'your-secret-key'

export async function middleware(request) {
  // Skip CSRF for non-mutation methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return NextResponse.next()
  }

  try {
    // Generate CSRF token
    const token = await getToken({
      token: {
        value: CSRF_TOKEN_SECRET,
      },
    })

    const response = NextResponse.next()

    // Set CSRF token in cookie
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    })

    // Add CSRF token to headers
    response.headers.set('X-CSRF-Token', token)

    return response
  } catch (error) {
    console.error('CSRF Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Invalid CSRF token' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

// Configure which routes need CSRF protection
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/signup/:path*',
    // Add other API routes that need CSRF protection
  ],
}
