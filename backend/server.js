const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { auth } = require('./config/firebase');
const admin = require('./config/firebase');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

// Middleware
server.use(express.json());
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    },
  })
);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

// Import middleware
const checkAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Use routes
server.use('/auth', authRoutes);
server.use('/user', checkAuth, userRoutes);
server.use('/api/posts', checkAuth, postRoutes);
server.use('/api/users', checkAuth, userRoutes);

app.prepare().then(() => {
    
    server.get('/login', (req, res)=>{
        const sessionCookie = req.cookies.session;
        if (sessionCookie){
            return res.redirect('/feeds');
        }
        return app.render(req, res, '/login');
    })

  server.get('/feeds', checkAuth, (req, res) => {
    return app.render(req, res, '/feeds', { user: req.session.user });
  });

  server.get('*', checkAuth, (req, res) => {
    return handle(req, res);
  });

  // Error handling middleware
  server.use(errorHandler);

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

module.exports = server;

