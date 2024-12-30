// Client-side Firebase config
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB0xMcnwwj7qlZAzDL-UbH8pLBctXVwUcU',
  authDomain: 'test-d764f.firebaseapp.com',
  projectId: 'test-d764f',
  storageBucket: 'test-d764f.firebasestorage.app',
  messagingSenderId: '509210843981',
  appId: '1:509210843981:web:e9db32b667bf0ab651b504',
  measurementId: 'G-163HH48S44',
}

// Initialize Firebase for client
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
}

export const auth = getAuth(app)
