<!-- firebase-config.js will be replaced with actual implementation -->
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGdIsemWvuUTe7Df6iOK7suxMRC8G0vNg",
  authDomain: "intel-pay-ltd.firebaseapp.com",
  projectId: "intel-pay-ltd",
  storageBucket: "intel-pay-ltd.appspot.com", // ✅ FIXED
  messagingSenderId: "779411397815",
  appId: "1:779411397815:web:7b6d9f34572d13a833c132"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
