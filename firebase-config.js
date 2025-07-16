<!-- firebase-config.js will be replaced with actual implementation -->
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGdIsemWvuUTe7Df6iOK7suxMRC8G0vNg",
  authDomain: "intel-pay-ltd.firebaseapp.com",
  projectId: "intel-pay-ltd",
  storageBucket: "intel-pay-ltd.firebasestorage.app",
  messagingSenderId: "779411397815",
  appId: "1:779411397815:web:7b6d9f34572d13a833c132",
  measurementId: "G-6KVXNG7BG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
