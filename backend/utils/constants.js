module.exports = {
    PUBLIC_ROUTES: ['/login', '/signup', '/', '/static', '_next/*', '/api/custom-route', '/google-login', '/placeholder.svg', '/favicon.ico', '/__nextjs_original-stack-frame'],
    SESSION_EXPIRY: 60 * 60 * 24 * 5 * 1000, // 5 days
    AUTH_ROUTES: ['/auth/login', '/auth/google-login', '/auth/signup', '/auth/logout'],
  };
  