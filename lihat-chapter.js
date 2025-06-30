import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
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

// Ambil ID komik dari URL
const params = new URLSearchParams(location.search);
const komikId = params.get("komik");
const daftar = document.getElementById("daftar-chapter");

// Tampilkan nama komik
async function tampilkanJudulKomik() {
  const snap = await getDoc(doc(db, "komik", komikId));
  if (snap.exists()) {
    document.getElementById("judul-komik").textContent = "Chapter dari: " + snap.data().judul;
  }
}

tampilkanJudulKomik();

// Tampilkan semua chapter
async function loadChapter() {
  const col = collection(db, "komik", komikId, "chapter");
  const snap = await getDocs(col);

  daftar.innerHTML = "";
  snap.forEach((docu) => {
    const data = docu.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input value="${data.judul}" class="judul" data-id="${docu.id}">
      </td>
      <td>
        <textarea class="halaman" data-id="${docu.id}">${(data.halaman || []).join("\n")}</textarea>
      </td>
      <td>
        <button class="simpan" data-id="${docu.id}">💾 Simpan</button>
        <button class="hapus" data-id="${docu.id}">🗑️ Hapus</button>
      </td>
    `;

    daftar.appendChild(tr);
  });

  setupEvents();
}

loadChapter();

function setupEvents() {
  document.querySelectorAll(".simpan").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const judul = document.querySelector(`.judul[data-id="${id}"]`).value;
      const halamanText = document.querySelector(`.halaman[data-id="${id}"]`).value;
      const halaman = halamanText.split("\n").map(x => x.trim()).filter(x => x);

      await updateDoc(doc(db, "komik", komikId, "chapter", id), { judul, halaman });
      alert("✅ Chapter diperbarui");
    });
  });

  document.querySelectorAll(".hapus").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Yakin hapus chapter ini?")) {
        await deleteDoc(doc(db, "komik", komikId, "chapter", id));
        loadChapter();
      }
    });
  });
}
