import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-ByFHFmooLNJgLDjS-2LHrhdsQGzOVVU",
  authDomain: "todo-app-1e2f2.firebaseapp.com",
  projectId: "todo-app-1e2f2",
  storageBucket: "todo-app-1e2f2.firebasestorage.app",
  messagingSenderId: "189558981658",
  appId: "1:189558981658:web:452ae187cadd3592be3da3",
  measurementId: "G-4WD95GGLJK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
