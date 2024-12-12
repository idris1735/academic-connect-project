const { auth } = require('../config/firebase');
const admin = require('../config/firebase');
const { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const createCookieSession = require('../utils/cookieSession');
const { db } = require('../config/database');
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
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      country, 
      userType,
      dateOfBirth,
      occupation,
    } = req.body;

    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user's display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Base user data
    const baseUserData = {
      uid: user.uid,
      email: user.email,
      displayName: `${firstName} ${lastName}`,
      photoURL: user.photoURL || null,
      lastLogin: null,
      dateCreated: FieldValue.serverTimestamp(),
      country,
      userType,
    };

    // Base profile data
    const baseProfileData = {
      pid: user.uid,
      email: user.email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      photoURL: user.photoURL || null,
      bio: '',
      country,
      dateJoined: FieldValue.serverTimestamp(),
      dateOfBirth,
      userType,
      occupation,
    };

    // Handle specific user type data
    switch(userType) {
      case 'individual':

        const { occupation, researchInterests } = req.body;
        
        // Add individual-specific fields to profile
        baseProfileData.occupation = occupation;
        baseProfileData.researchInterests = researchInterests;

        // Create individual type document
        const individualRef = db.collection('userTypes').doc('individual');
        await individualRef.set({
          uid: user.uid,
          occupation,
          researchInterests,
          dateOfBirth
        });
        break;

      case 'institution':
        const { institutionName, institutionType } = req.body;
        
        // Add institution-specific fields to profile
        baseProfileData.institutionName = institutionName;
        baseProfileData.institutionType = institutionType;

        // Create institution type document
        const institutionRef = db.collection('userTypes').doc(user.uid);
        await institutionRef.set({
          uid: user.uid,
          institutionName,
          institutionType,
          dateOfBirth
        });
        break;

      case 'corporate':
        const { companyName, industry } = req.body;
        
        // Add corporate-specific fields to profile
        baseProfileData.companyName = companyName;
        baseProfileData.industry = industry;

        // Create corporate type document
        const corporateRef = db.collection('userTypes').doc(user.uid);
        await corporateRef.set({
          uid: user.uid,
          companyName,
          industry,
          dateOfBirth
        });
        break;
    }

    // Save base user and profile data
    const userRef = db.collection('users').doc(user.uid);
    await userRef.set(baseUserData);

    const profileRef = db.collection('profiles').doc(user.uid);
    await profileRef.set(baseProfileData);

    // Create session cookie
    const idToken = await user.getIdToken();
    await createCookieSession(req, res, idToken, user);

    res.status(200).json({ 
      message: 'Signup successful', 
      redirectTo: '/feeds',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: `${firstName} ${lastName}`,
      }
    });
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


