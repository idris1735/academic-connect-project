const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, browserPopupRedirectResolver } = require('firebase/auth');
const { auth } = require('./src/app/firebase-config.js');
const admin = require('firebase-admin');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
const session = require('express-session');

server.use(
  session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
  })
);

const serviceAccount = require('./test.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
server.use(express.json()); // Parse JSON request bodies
server.use(cookieParser()); // Parse cookies

const publicRoutes = ['/login', '/signup', '/', '/static', '_next/*', '/api/custom-route', '/google-login'];


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

      // Get the ID token from the authenticated user
      const idToken = await user.getIdToken();

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
      res.status(200).json({ message: 'Login successful', redirectTo: '/feeds' });
      return res
    } catch (error) {
      console.error('Error during login:', error.message);
      res.status(401).json({ message: 'Login failed', error: error.message });
    }

    
    
    
});




  server.get('/signup', (req, res) => {
    if (req.cookies.session) {
      return res.redirect('/feeds');
    }
    return app.render(req, res, '/signup', req.query);
  });

  server.post('/signup', async (req, res) => {

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
