// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "therapist-ai-844dc.firebaseapp.com",
  projectId: "therapist-ai-844dc",
  storageBucket: "therapist-ai-844dc.appspot.com",
  messagingSenderId: "296097580333",
  appId: "1:296097580333:web:28efbeb8b27aa3b88bbfa4",
  measurementId: "G-BR3HGR80H8"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInAnonymously(auth).catch(console.error);
const database = getDatabase(app);

export { database };
