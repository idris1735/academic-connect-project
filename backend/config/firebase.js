
const { getAuth} = require('firebase/auth');
const { initializeApp, getApps } = require('firebase/app');


const admin = require('firebase-admin');

const serviceAccount = require('../../test.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



const firebaseConfig = {
  
}

// Initialize Firebase
let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);


module.exports = { admin, auth };