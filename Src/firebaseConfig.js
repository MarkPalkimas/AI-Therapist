import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

// **Directly embedded Firebase config**
const firebaseConfig = {
  apiKey: "AIzaSyCu4swb2WAFFMq6MgaB3IUJxPm6l3oCBOU",
  authDomain: "therapist-ai-844dc.firebaseapp.com",
  databaseURL: "https://therapist-ai-844dc-default-rtdb.firebaseio.com",
  projectId: "therapist-ai-844dc",
  storageBucket: "therapist-ai-844dc.firebasestorage.app",
  messagingSenderId: "296097580333",
  appId: "1:296097580333:web:28efbeb8b27aa3b88bbfa4",
  measurementId: "G-BR3HGR80H8"
};

const app = initializeApp(firebaseConfig);
signInAnonymously(getAuth(app)).catch(console.error);
export const database = getDatabase(app);

