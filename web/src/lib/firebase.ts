// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCsayWlm2_MVumHWmYf8H78igeJAIIMN8",
  authDomain: "cave-4760d.firebaseapp.com",
  projectId: "cave-4760d",
  storageBucket: "cave-4760d.firebasestorage.app",
  messagingSenderId: "1016414017565",
  appId: "1:1016414017565:web:e013cbd6e051f01131cef4",
  measurementId: "G-ZLZWMQH4CN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 