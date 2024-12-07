const { admin } = require('../config/firebase');
const { PUBLIC_ROUTES, AUTH_ROUTES } = require('../utils/constants');

const checkAuth = async (req, res, next) => {
    const sessionCookie = req.cookies.session;

    // Allow unprotected routes
    if (
        PUBLIC_ROUTES.includes(req.path) ||
        AUTH_ROUTES.includes(req.path) || 
        req.path.startsWith('/_next')
    ) {
        return next();
    }

    // Protect all other routes (like /feeds)
    if (!sessionCookie) {
        console.log('Unauthorized access to:', req.path);
        return res.status(401).redirect('/login?error=session_expired');
    }

    try {
        const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedToken;
        return next();
    } catch (error) {
        console.error('Session verification failed:', error.message);
        
        // Clear the session cookie
        res.clearCookie('session');
        
        // Handle network-related errors specifically
        if (error.code === 'EAI_AGAIN') {
            return res.redirect('/login?error=verification_failed');
        }

        // Handle other session verification errors
        return res.redirect('/login?error=session_invalid');
    }
};

module.exports = checkAuth;

