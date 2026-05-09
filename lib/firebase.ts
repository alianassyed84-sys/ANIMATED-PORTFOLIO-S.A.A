import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// We only import analytics if we're on the client side
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBxKGbUVI6QQN5345Ok6OvPL4V1dFc7BNg",
  authDomain: "sanaaaliportfolio.firebaseapp.com",
  projectId: "sanaaaliportfolio",
  storageBucket: "sanaaaliportfolio.firebasestorage.app",
  messagingSenderId: "358242400415",
  appId: "1:358242400415:web:4f96510c26f25ef7d00aaa",
  measurementId: "G-HNK0HQ05H1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Analytics conditionally (only in browser)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;
