<!-- admin-dashboard.js will be replaced with actual implementation -->
// admin-dashboard.js
import { db } from './firebase-config.js';
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const userCountEl = document.getElementById("userCount");
const earningsEl = document.getElementById("totalEarnings");
const withdrawalsEl = document.getElementById("totalWithdrawals");

let totalUsers = 0;
let totalEarnings = 0;
let totalWithdrawals = 0;
let chartData = [];

async function loadData() {
  const users = await getDocs(collection(db, "users"));
  totalUsers = users.size;
  users.forEach(doc => {
    const d = doc.data();
    totalEarnings += d.earnings || 0;
    chartData.push(d.earnings || 0);
  });

  const withdrawals = await getDocs(collection(db, "withdrawals"));
  withdrawals.forEach(doc => {
    const w = doc.data();
    totalWithdrawals += w.amount || 0;
  });

  userCountEl.textContent = totalUsers;
  earningsEl.textContent = `₦${totalEarnings.toLocaleString()}`;
  withdrawalsEl.textContent = `₦${totalWithdrawals.toLocaleString()}`;

  new Chart(document.getElementById('earningsChart'), {
    type: 'bar',
    data: {
      labels: chartData.map((_, i) => `User ${i + 1}`),
      datasets: [{
        label: 'Earnings',
        data: chartData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

document.getElementById("exportBtn").addEventListener("click", async () => {
  const snap = await getDocs(collection(db, "users"));
  let csv = "Name,Email,Earnings,Plan\\n";
  snap.forEach(doc => {
    const d = doc.data();
    csv += `${d.name || '-'},${d.email},${d.earnings || 0},${d.miningPlan || '—'}\\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "intelpay_users.csv";
  link.click();
});

loadData();
