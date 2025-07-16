<!-- dashboard.js will be replaced with actual implementation -->
// dashboard.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const userName = document.getElementById("userName");
const earningsEl = document.getElementById("earnings");
const refLink = document.getElementById("refLink");
const planName = document.getElementById("plan");
const miningImg = document.getElementById("miningImage");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);
  const data = snap.data();

  userName.textContent = data.name || user.email;
  refLink.textContent = `${location.origin}/register.html?ref=${user.uid}`;

  if (!data.activated || !data.activatedAt || !data.earningsRate) {
    earningsEl.textContent = "₦0";
    planName.textContent = "No plan selected";
    miningImg.src = "https://i.imgur.com/aDvhZ0n.jpg";
    return;
  }

  const startDate = new Date(data.activatedAt.seconds * 1000);
  const now = new Date();
  const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

  const rate = data.earningsRate;
  const base = data.initialAmount;
  const max = 5500; // limit if needed

  const current = Math.min(base * rate * days, max);
  await updateDoc(docRef, { earnings: current });

  earningsEl.textContent = `₦${current.toFixed(2)}`;
  planName.textContent = data.miningPlan?.toUpperCase() || "—";
  miningImg.src = data.miningImage || "https://i.imgur.com/aDvhZ0n.jpg";
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => location.href = "login.html");
});
