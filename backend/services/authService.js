const { auth } = require('../config/firebase');
const admin = require('../config/firebase');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const createCookieSession = require('../utils/cookieSession');
const db = require('../config/database');
const { Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = db.collection('users').doc(user.uid);
    await userRef.update({
      lastLogin: FieldValue.serverTimestamp(),
    });

    const idToken = await user.getIdToken();
    await createCookieSession(req, res, idToken, user);

    res.status(200).json({ message: 'Login successful', redirectTo: '/feeds', user: user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { user } = req.body;
    const idToken = user.idToken;

    const userRef = db.collection('users').doc(user.uid);
    await userRef.set({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    await createCookieSession(req, res, idToken, user);

    res.status(200).json({ message: 'Login successful', redirectTo: '/feeds' });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(401).json({ message: 'Login failed', error: error.message });
  }
};

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName, country, userType, occupation, interests } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    const userRef = db.collection('users').doc(user.uid);
    await userRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: FieldValue.serverTimestamp(),
      country,
      userType,
    });

    const profileRef = db.collection('profiles').doc(user.uid);
    await profileRef.set({
      pid: user.uid,
      email: user.email,
      firstName,
      lastName,
      displayName: user.displayName,
      photoURL: user.photoURL,
      bio: '',
      country,
      dateJoined: FieldValue.serverTimestamp(),
      userType,
      occupation: userType === 'individual' ? occupation : undefined,
      interests: userType === 'individual' ? interests : undefined,
    });

    if (userType === 'individual') {
      const individualRef = db.collection('userType').doc('individual');
      await individualRef.set({
        uid: user.uid,
        occupation,
        interests,
      });
    }

    const idToken = await user.getIdToken();
    await createCookieSession(req, res, idToken, user);

    res.status(200).json({ message: 'Signup successful', redirectTo: '/feeds' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: 'Signup failed', error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logout successful' });
};


