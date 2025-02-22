import { NextResponse } from 'next/server'

export function middleware(request) {
  const authCookie = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/signup', '/verify-email']

  // If the path is public, allow access regardless of auth state
  if (publicPaths.includes(pathname)) {
    // If user is already authenticated and tries to access login/signup, redirect to feeds
    if (authCookie) {
      return NextResponse.redirect(new URL('/feeds', request.url))
    }
    return NextResponse.next()
  }

  // For all other paths, check authentication
  if (!authCookie) {
    // Remember the page user tried to visit
    const from = request.nextUrl.pathname + request.nextUrl.search
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  // User is authenticated, allow access
  return NextResponse.next()
}

// Add matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
