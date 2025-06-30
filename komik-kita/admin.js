import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔑 Firebase Config
const firebaseConfig = {
  apiKey: "AIZA...",
  authDomain: "komik-kita-d3d7b.firebaseapp.com",
  projectId: "komik-kita-d3d7b",
  storageBucket: "komik-kita-d3d7b.appspot.com",
  messagingSenderId: "716576061034",
  appId: "1:71657...",
  measurementId: "G-..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const daftar = document.getElementById("daftar-komik");

// 🔄 Tampilkan semua komik
async function loadKomik() {
  daftar.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";
  const snap = await getDocs(collection(db, "komik"));
  daftar.innerHTML = "";

  snap.forEach((d) => {
    const data = d.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input value="${data.judul}" data-id="${d.id}" class="judul-input">
      </td>
      <td>
        <img src="${data.cover}">
        <input value="${data.cover}" data-id="${d.id}" class="cover-input">
      </td>
      <td>
        <button data-id="${d.id}" class="update-btn">💾 Simpan</button>
        <button data-id="${d.id}" class="hapus-btn">🗑️ Hapus</button>
        <a href="tambah-chapter.html?komik=${d.id}">➕ Chapter</a><br>
        <a href="lihat-chapter.html?komik=${d.id}">📄 Lihat Chapter</a>
      </td>
    `;

    daftar.appendChild(tr);
  });

  setupEventListeners();
}

loadKomik();

// 🟢 Tambah komik baru
document.getElementById("form-komik").addEventListener("submit", async (e) => {
  e.preventDefault();
  const judul = document.getElementById("judul").value;
  const cover = document.getElementById("cover").value;

  await addDoc(collection(db, "komik"), { judul, cover });
  loadKomik();
});

// ✏️ Simpan perubahan judul/cover
function setupEventListeners() {
  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const newJudul = document.querySelector(`.judul-input[data-id="${id}"]`).value;
      const newCover = document.querySelector(`.cover-input[data-id="${id}"]`).value;
      await updateDoc(doc(db, "komik", id), { judul: newJudul, cover: newCover });
      alert("✅ Komik diperbarui");
    });
  });

  // ❌ Hapus komik
  document.querySelectorAll(".hapus-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Yakin ingin menghapus komik ini?")) {
        await deleteDoc(doc(db, "komik", id));
        loadKomik();
      }
    });
  });
}
