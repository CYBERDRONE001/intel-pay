<!-- admin.js will be replaced with actual implementation -->
// admin.js
import { db } from './firebase-config.js';
import {
  getDocs, collection, updateDoc, doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

if (localStorage.getItem("adminLoggedIn") !== "true") {
  location.href = "admin-login.html";
}

const table = document.getElementById("userTable");

async function loadUsers() {
  const snap = await getDocs(collection(db, "users"));
  let html = "";

  snap.forEach(d => {
    const data = d.data();
    html += `
      <tr class="border-t border-gray-600">
        <td class="p-2">${data.name || "-"}</td>
        <td class="p-2">${data.email}</td>
        <td class="p-2">${data.miningPlan?.toUpperCase() || "—"}</td>
        <td class="p-2">₦${data.earnings?.toFixed(2) || 0}</td>
        <td class="p-2">${data.cryptoPaymentProof ? `<a href="${data.cryptoPaymentProof}" class="text-blue-400" target="_blank">View</a>` : "—"}</td>
        <td class="p-2">${data.activated ? "✅" : "❌"}</td>
        <td class="p-2">
          ${!data.activated ? `<button class="bg-green-600 px-2 py-1 rounded text-sm" onclick="activate('${d.id}')">Activate</button>` : ""}
        </td>
      </tr>
    `;
  });

  table.innerHTML = html;
}

window.activate = async (id) => {
  await updateDoc(doc(db, "users", id), {
    activated: true,
    activatedAt: new Date()
  });
  alert("User activated!");
  loadUsers();
};

loadUsers();
