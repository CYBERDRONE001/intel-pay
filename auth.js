<!-- auth.js will be replaced with actual implementation -->
// auth.js
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const regForm = document.getElementById('registerForm');
const logForm = document.getElementById('loginForm');

// Registration
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = regForm.name.value;
    const email = regForm.email.value;
    const password = regForm.password.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        activated: false,
        earnings: 0,
        admin: false // Default user
      });

      alert("Registered successfully!");
      location.href = "plans.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// Login
if (logForm) {
  logForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = logForm.email.value;
    const password = logForm.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = userSnap.data();

      if (data.admin === true) {
        location.href = "admin-dashboard.html";
      } else {
        location.href = "dashboard.html";
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  });
        }
