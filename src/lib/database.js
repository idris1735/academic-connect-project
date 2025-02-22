const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firestore
const db = getFirestore();



export { db }