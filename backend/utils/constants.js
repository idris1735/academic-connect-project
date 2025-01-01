const PUBLIC_ROUTES = [
  // Auth routes
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/verify-email',

  // Public pages
  '/login',
  '/signup',
  '/',
  '/feeds',

  // Static files and Next.js routes
  '/_next',
  '/static',
  '/images',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',

  // Add any other public routes here
  '/api/posts/get_posts',
]

const SESSION_EXPIRY = 15 * 24 * 60 * 60 * 1000 // 15 days

module.exports = {
  PUBLIC_ROUTES,
  SESSION_EXPIRY,
}
