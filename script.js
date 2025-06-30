console.log("script.js berhasil dijalankan");
// Import Firebase library dari CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🧩 Config dari Firebase Console kamu
const firebaseConfig = {
  apiKey: "AIzaSyCWTt38K5tsGSZs-_4sypRT5qRqky1eYNA",
  authDomain: "komik-kita-d3d7b.firebaseapp.com",
  projectId: "komik-kita-d3d7b",
  storageBucket: "komik-kita-d3d7b.firebasestorage.app",
  messagingSenderId: "716576010304",
  appId: "1:716576010304:web:404cce022d92a27d182fa5",
  measurementId: "G-VLNL46Y8QD"
};

// 🔌 Inisialisasi Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// 📄 Ambil daftar komik dari koleksi 'komik'
async function tampilkanKomik() {
  const komikRef = collection(db, "komik");
  const snapshot = await getDocs(komikRef);

  const list = document.getElementById("komik-list");
  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "komik-item";
    item.innerHTML = `
      <a href="komik.html?id=${doc.id}">
        <img src="${data.cover}" alt="cover" width="120">
        <p>${data.judul}</p>
      </a>
    `;
    list.appendChild(item);
  });
}

tampilkanKomik(); // ← jalankan fungsi ini
