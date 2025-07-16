<!-- withdraw.js will be replaced with actual implementation -->
// withdraw.js
import { auth, db } from './firebase-config.js';
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const form = document.getElementById("withdrawForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return alert("User not found");

  const data = snap.data();
  const amount = Math.min(data.earnings || 0, 5500);
  if (amount < 1000) return alert("You must earn at least ₦1000 to withdraw.");

  await setDoc(doc(db, "withdrawals", `${user.uid}_${Date.now()}`), {
    userId: user.uid,
    name: form.accountName.value,
    bank: form.bankName.value,
    number: form.accountNumber.value,
    amount,
    status: "pending",
    createdAt: serverTimestamp()
  });

  // Send email alert (formsubmit or your method)
  const emailForm = document.createElement("form");
  emailForm.action = "https://formsubmit.co/YOUR_EMAIL@example.com";
  emailForm.method = "POST";
  emailForm.style.display = "none";

  const inputs = {
    "Account Name": form.accountName.value,
    "Bank Name": form.bankName.value,
    "Account Number": form.accountNumber.value,
    "Amount": "₦" + amount
  };

  for (const label in inputs) {
    const input = document.createElement("input");
    input.name = label;
    input.value = inputs[label];
    emailForm.appendChild(input);
  }

  const hidden = document.createElement("input");
  hidden.name = "_captcha";
  hidden.value = "false";
  emailForm.appendChild(hidden);

  document.body.appendChild(emailForm);
  emailForm.submit();

  alert("Withdrawal submitted. We’ll review it shortly.");
});
