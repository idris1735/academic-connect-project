const { getFirestore } = require('firebase-admin/firestore');
const admin = require('./firebase');

// Initialize Firestore
const db = getFirestore();

module.exports =  { db };

