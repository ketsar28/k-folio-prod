// Firebase Configuration for k-folio Dashboard
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-UZMJewsFFkFa5mHao-MQ8bTSuZuGjNE",
  authDomain: "ketsar-portfolio.firebaseapp.com",
  projectId: "ketsar-portfolio",
  storageBucket: "ketsar-portfolio.firebasestorage.app",
  messagingSenderId: "86486975538",
  appId: "1:86486975538:web:34b5c99dd31391d387e82b",
  measurementId: "G-XR34XYFK72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
