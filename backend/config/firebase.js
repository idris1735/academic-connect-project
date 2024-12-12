const { getAuth } = require('firebase/auth');
const { initializeApp, getApps } = require('firebase/app');
const admin = require('firebase-admin');

const serviceAccount = require('../../test.json');

// Initialize Firebase Admin
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
  apiKey: "AIzaSyB0xMcnwwj7qlZAzDL-UbH8pLBctXVwUcU",
  authDomain: "test-d764f.firebaseapp.com",
  projectId: "test-d764f",
  storageBucket: "test-d764f.firebasestorage.app",
  messagingSenderId: "509210843981",
  appId: "1:509210843981:web:e9db32b667bf0ab651b504",
  measurementId: "G-163HH48S44"
};

// Initialize Firebase Client
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
>>>>>>> 5adfbd7927e1bdd10ed70336f7682ae27b5c7e04
>>>>>>> f2b86b588a845a243163d7be83fbcf0cb1ee8dce
}

// Initialize Firebase
let app

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

const auth = getAuth(app);
// const db = admin.firestore();
// const storage = admin.storage();

module.exports = { 
  admin,
  auth,
};