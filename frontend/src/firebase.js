// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-ef1c6.firebaseapp.com",
  projectId: "ecommerce-ef1c6",
  storageBucket: "ecommerce-ef1c6.firebasestorage.app",
  messagingSenderId: "384854483391",
  appId: "1:384854483391:web:1f732c6f2bc2e1b824410a",
  measurementId: "G-GD7V6EHCFY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);