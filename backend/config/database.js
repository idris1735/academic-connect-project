const { getFirestore } = require('firebase-admin/firestore');


// Initialize Firestore
const db = getFirestore();

module.exports =  { db };

