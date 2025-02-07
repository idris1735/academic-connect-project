// import the cookie-parser module
const cookieParser = require('cookie-parser');

// Middleware

const createCookieSession = async (req, res, idToken, user, session, admin) => {
    // Create a session cookie with Firebase Admin SDK
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set the session cookie in the response
    res.cookie('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: expiresIn,
    });

      // Save user info in the session
    req.session.user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
    };
    console.log('User session cookie set successfully');

}

module.exports = createCookieSession;
