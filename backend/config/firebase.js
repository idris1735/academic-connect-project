const { getAuth } = require('firebase/auth');
const { initializeApp, getApps } = require('firebase/app');
const admin = require('firebase-admin');

const serviceAccount = require('../../test.json');

// Initialize Firebase Admin
const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



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