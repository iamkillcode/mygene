// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "mygene-rgd71",
  "appId": "1:404007391232:web:19610f018e1c1e7f6f88e5",
  "storageBucket": "mygene-rgd71.firebasestorage.app",
  "apiKey": "AIzaSyApiu3fL-osK1kMtgdwTmVNkSJPSGWvHOE",
  "authDomain": "mygene-rgd71.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "404007391232"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
