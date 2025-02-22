import { NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs', // Force Node.js runtime for middleware
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/',
  '/static',
  '/api/auth',
  '/google-login',
  '/placeholder.svg',
  '/favicon.ico'
];

export async function middleware(request) {
  const session = request.cookies.get('session');

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // Session verification will happen in the API routes
    return NextResponse.next();
  }

  // Protect other routes with redirect
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
} 