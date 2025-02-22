const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth'); // Use admin auth

const serviceAccount = require('../../test.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = getAuth(); // This is admin auth

module.exports = { admin, auth, db };