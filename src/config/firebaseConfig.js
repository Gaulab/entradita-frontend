// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0-UNHMFMbjFRFCQ-H9Sg-jd4zpEmOvFc",
  authDomain: "entradita-bf72b.firebaseapp.com",
  projectId: "entradita-bf72b",
  storageBucket: "entradita-bf72b.firebasestorage.app",
  messagingSenderId: "6084885171",
  appId: "1:6084885171:web:2fd5cca31e604255918ec6",
  measurementId: "G-WY0PG127VV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()