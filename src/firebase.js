// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBL7YM5DW1q-miNUGqH5YnOm1OrDnXYql0",
  authDomain: "tech-ccf6f.firebaseapp.com",
  projectId: "tech-ccf6f",
  storageBucket: "tech-ccf6f.appspot.com",
  messagingSenderId: "1052342620194",
  appId: "1:1052342620194:web:631373e9332468ed993a7b",
  measurementId: "G-QM4NK5JDWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
