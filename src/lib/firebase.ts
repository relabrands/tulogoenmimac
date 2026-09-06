import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyCVTEfxKsQz-dXyBIFayVxYKQtCX_PKfWY",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "tu-logo-en-mi-mac.firebaseapp.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "tu-logo-en-mi-mac",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "tu-logo-en-mi-mac.firebasestorage.app",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "277397962396",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:277397962396:web:daf088c1da12796b61f759",
};

// Initialize Firebase (guard against multiple initializations during HMR or SSR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
