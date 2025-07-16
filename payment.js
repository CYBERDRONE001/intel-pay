<!-- payment.js will be replaced with actual implementation -->
// payment.js
import { auth, db } from './firebase-config.js';
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

function generatePDFReceipt(name, email, method, amount) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("IntelPay Payment Receipt", 20, 20);
  doc.setFontSize(12);
  doc.text(`Name: ${name}`, 20, 40);
  doc.text(`Email: ${email}`, 20, 50);
  doc.text(`Method: ${method}`, 20, 60);
  doc.text(`Amount: ₦${amount}`, 20, 70);
  doc.text(`Date: ${new Date().toLocaleString()}`, 20, 80);
  doc.text("Thank you for investing with IntelPay.", 20, 100);
  doc.save("IntelPay-Receipt.pdf");
}

const paystackKey = "pk_test_xxxxxxxxxxxxx"; // ✅ Replace
const flutterwaveKey = "FLWPUBK_TEST-xxxxxxxxxxxxx"; // ✅ Replace

const user = auth.currentUser;

document.getElementById("paystackBtn")?.addEventListener("click", async () => {
  const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
  const data = snap.data();
  const amount = data.initialAmount * 100;

  PaystackPop.setup({
    key: paystackKey,
    email: auth.currentUser.email,
    amount: amount,
    currency: "NGN",
    callback: async (res) => {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        activated: true,
        activatedAt: new Date(),
        paymentMethod: "Paystack",
        transactionRef: res.reference
      });
      generatePDFReceipt(data.name, data.email, "Paystack", data.initialAmount);
      alert("Payment successful!");
      location.href = "dashboard.html";
    }
  }).openIframe();
});

document.getElementById("flutterwaveBtn")?.addEventListener("click", async () => {
  const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
  const data = snap.data();

  FlutterwaveCheckout({
    public_key: flutterwaveKey,
    tx_ref: "INTELPAY_" + Date.now(),
    amount: data.initialAmount,
    currency: "NGN",
    customer: {
      email: auth.currentUser.email
    },
    callback: async function (response) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        activated: true,
        activatedAt: new Date(),
        paymentMethod: "Flutterwave",
        transactionId: response.transaction_id
      });
      generatePDFReceipt(data.name, data.email, "Flutterwave", data.initialAmount);
      alert("Payment successful!");
      location.href = "dashboard.html";
    }
  });
});

document.getElementById("submitLink")?.addEventListener("click", async () => {
  const link = document.getElementById("cryptoLink").value;
  if (!link.startsWith("http")) return alert("Enter valid image link");
  const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
  const data = snap.data();

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    cryptoPaymentProof: link,
    paymentMethod: "Crypto Screenshot",
    activated: false
  });

  generatePDFReceipt(data.name, data.email, "Crypto Screenshot", data.initialAmount);
  document.getElementById("linkSaved").classList.remove("hidden");
});
