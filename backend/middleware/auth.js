const { admin } = require('../config/firebase');
const { PUBLIC_ROUTES, AUTH_ROUTES } = require('../utils/constants');
const generateUserChatToken = require('../services/chatService').generateUserChatToken;


const checkAuth = async (req, res, next) => {
    const sessionCookie = req.cookies.session;
    const chatToken = req.cookies.chatToken;

    // Allow unprotected routes
    if (
        PUBLIC_ROUTES.includes(req.path) ||
        AUTH_ROUTES.includes(req.path) || 
        req.path.startsWith('/_next')
    ) {
        return next();
    }

    // Protect all other routes
    if (!sessionCookie) {
        console.log('Unauthorized access to:', req.path);
        return res.status(401).redirect('/login');
    }

    try {
        const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
        console.log('Authenticated user:', decodedToken.email);
        console.log(req.path);
        console.log('Chat token:', chatToken);
        req.user = decodedToken;
        return next();
    } catch (error) {
        console.error('Session verification failed:', error.message);
        
        // Check specifically for internet connection error
        if (error.message.includes('getaddrinfo EAI_AGAIN') || error.code === 'EAI_AGAIN') {
            // Send a 503 status with a specific error code for connection issues
            return res.status(503).json({
                error: 'network_error',
                message: 'Please check your internet connection and try again'
            });
        }

        // For other session errors, redirect to login
        res.clearCookie('session');
        return res.redirect('/login');
    }
};


module.exports = checkAuth;

