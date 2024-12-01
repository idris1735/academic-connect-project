const { admin } = require('../config/firebase');
const { SESSION_EXPIRY } = require('./constants');

const createCookieSession = async (req, res, idToken, user) => {
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SESSION_EXPIRY });
    const options = {
      maxAge: SESSION_EXPIRY,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };
    res.cookie('session', sessionCookie, options);

    req.session.user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
};

module.exports = createCookieSession;

