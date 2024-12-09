const { getAuth } = require('firebase/auth')
const { initializeApp, getApps } = require('firebase/app')

const admin = require('firebase-admin')

const serviceAccount = require('../../test.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firebaseConfig = {
<<<<<<< HEAD
  apiKey: 'AIzaSyB0xMcnwwj7qlZAzDL-UbH8pLBctXVwUcU',
  authDomain: 'test-d764f.firebaseapp.com',
  projectId: 'test-d764f',
  storageBucket: 'test-d764f.firebasestorage.app',
  messagingSenderId: '509210843981',
  appId: '1:509210843981:web:e9db32b667bf0ab651b504',
  measurementId: 'G-163HH48S44',
=======
  
}

// Initialize Firebase
let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
>>>>>>> 5adfbd7927e1bdd10ed70336f7682ae27b5c7e04
}

// Initialize Firebase
let app

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const auth = getAuth(app)

module.exports = { admin, auth }
