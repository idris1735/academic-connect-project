
// export the express and next mdoules
const express = require('express');
const next = require('next');

// import the cookie-parser module
const cookieParser = require('cookie-parser');

// import the firebase-admin module
const { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, browserPopupRedirectResolver, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { auth } = require('./src/app/firebase-config.js');
const admin = require('firebase-admin');

// Create the express server
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const createCookieSession = require('./cookie.js');


const locales = require('date-fns/locale');


// Import the express-session module
const session = require('express-session');
server.use(
  session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
  })
);

// Initialize Firebase Admin SDK
const serviceAccount = require('./test.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Middleware
server.use(express.json()); // Parse JSON request bodies
server.use(cookieParser()); // Parse cookies


// Public routes unprotected by authentication
const publicRoutes = ['/login', '/signup', '/', '/static', '_next/*', '/api/custom-route', '/google-login', '/placeholder.svg', '/favicon.ico'];


// Middleware to check authentication
const checkAuth = async (req, res, next) => {
  console.log(req.path)
 
  const sessionCookie = req.cookies.session;
   // Exclude `_next` static assets and public routes
   if (req.path.startsWith('/_next') || publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for static assets and public routes
  }

  if (!sessionCookie) {
    return res.status(401).json({ message: 'Unauthorized: No session cookie' });
  }

  try {
    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true); // `true` ensures session is not revoked
    req.user = decodedToken; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
    console.log('Shii handles')
  } catch (error) {
    console.error('Error verifying session cookie:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid session', error: error.message });
  }
};


// Initialize the database
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const db = getFirestore();

// Routes
app.prepare().then(() => {

  // Login Route
  server.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log('Login request body:', req.body);

      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // create a user collection in the database
      const userRef = db.collection('users').doc(user.email);
      try{
        await userRef.set({
          lastLogin: FieldValue.serverTimestamp(),

        }, { merge: true });
      }
      catch(error){
        console.error('Error creating user document:', error.message);
        return res.status(401).json({ message: 'Login failed', error: error.message });
      }

      // Get the ID token from the authenticated user
      const idToken = await user.getIdToken();
      await createCookieSession(req, res, idToken, user, req.session, admin);

      console.log('User session cookie set successfully');
      res.status(200).json({ message: 'Login successful', redirectTo: '/feeds' });
      return res
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(401).json({ message: 'Login failed', error: error.message });
    }

  });

  server.post('/google-login', async (req, res) => {
    try {
      console.log('Login request body:', req.body);

      const user = req.body['user']

      // Get the ID token from the authenticated user
      const idToken = user['idToken'];

      // create a user collection in the database
      const userRef = db.collection('users').doc(user.email);
      try{
        await userRef.set({
          lastLogin: FieldValue.serverTimestamp(),

        }, { merge: true });
      }
      catch(error){
        console.error('Error creating user document:', error.message);
        return res.status(401).json({ message: 'Login failed', error: error.message });
      }
  
      await createCookieSession(req, res, idToken, user, req.session, admin);

      console.log('User session cookie set successfully');
      res.status(200).json({ message: 'Login successful', redirectTo: '/feeds' });
      return res
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(401).json({ message: 'Login failed', error: error.message });
    }
  
  });


  server.get('/signup', async (req, res) => {
    if (req.cookies.session) {
      return res.redirect('/feeds');
    }
    return app.render(req, res, '/signup', req.query);
  });

  server.post('/signup', async (req, res) => {
    formData = req.body;
    console.log(formData);

    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
    const user = userCredential.user


    const updated_user = await updateProfile(user, {
      displayName: `${formData.firstName} ${formData.lastName}`,
    })

     // create a user collection in the database
    let userRef = db.collection('users').doc(user.email);
    try{
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        lastLogin: FieldValue.serverTimestamp(),

      }, { merge: true });
    }
    catch(error){
      console.error('Error creating user document:', error.message);
      return res.status(401).json({ message: 'Login failed', error: error.message });
    }

    // Create a user profile in the database
    try{
      let profileRef = db.collection('profiles').doc(user.email);
      await profileRef.set({
        pid: user.uid,
        email: user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoURL: user.photoURL || null,
        bio: '',
        country: formData.country || null,
        institution: formData.institution || null,
        department: formData.department || null,
        dateJoined: FieldValue.serverTimestamp(),
      });
    }
    catch(error){
      // delete the user document
      await userRef.delete();
      console.error('Error creating user profile:', error.message);
      return res.status(401).json({ message: 'Login failed', error: error.message });
    }

    try{
       // Login user  TODO: Refactor this to a function
      let res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      if (res.status !== 200) {
         res.status(401).json({ error: 'Login failed', redirectTo: '/login' });
      }
    }
    catch(error){
      console.error('Error during login:', error.message);
      res.status(401).json({ error: 'Login failed', redirectTo: '/login' });   // TODO rewrite this code
    } 

  });


  server.get('/login', (req, res) => {
    if (req.cookies.session) {
      return res.redirect('/feeds');
    }
    return app.render(req, res, '/login');
  });

  // Logout Route
  server.get('/logout', (req, res) => {
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
  });

  server.get('*', checkAuth, (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
