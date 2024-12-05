const { admin } = require('../config/firebase');
const { PUBLIC_ROUTES, AUTH_ROUTES } = require('../utils/constants');

const checkAuth = async (req, res, next) => {
    const sessionCookie = req.cookies.session;

    // Allow unprotected routes
    if (
        PUBLIC_ROUTES.includes(req.path) ||
        AUTH_ROUTES.includes(req.path) || req.path.startsWith('/_next')
    ) {
        // console.log('Unprotected route:', req.path);
        // console.log(PUBLIC_ROUTES.some(routes => req.path.startsWith(routes)));
        return next();
    }

    // Protect all other routes (like /feeds)
    if (!sessionCookie) {
        console.log('Unauthorized access to:', req.path);
        return res.status(401).redirect('/login');
    }

    try {
        const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedToken; // Attach user info to the request
        console.log('Authenticated user:', decodedToken.email);
        return next();
    } catch (error) {
        console.error('Session verification failed:', error.message);
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
            console.error('Failed to destroy session:', err.message);
            // Handle session destruction error if necessary
            }
            // Redirect to login page after session is destroyed
            return res.redirect('/login');
        });
    }
};

module.exports = checkAuth;

