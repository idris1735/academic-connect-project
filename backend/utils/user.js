const e = require('express');
const db = require('../config/database');


exports.getUserNameByUid = async (uid) => {
    try {
      console.log(`Fetching user name for uid: ${uid}`);
  
      // Query the `users` collection to find the document with the matching UID
      const usersSnapshot = await db.collection('users').where('uid', '==', uid).get();
  
      // Check if any documents match
      if (usersSnapshot.empty) {
        console.log(`No user found with uid: ${uid}`);
        return 'Unknown User'; // Return a default value instead of null
      }
  
      // Extract the user's name (assuming one document per UID)
      const userDoc = usersSnapshot.docs[0]; // Get the first matching document
      const userData = userDoc.data();
  
      if (!userData || !userData.displayName) {
        console.log(`User found, but name is missing for uid: ${uid}`);
        return 'Unnamed User'; // Return a default value if name is missing
      }
  
      console.log(`Found user name: ${userData.name} for uid: ${uid}`);
      return userData.displayName;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'Error: User Not Found'; // Return an error message instead of throwing
    }
  };
  
  