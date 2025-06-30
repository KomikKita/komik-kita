import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// 🔍 Ambil ID komik dari URL
const params = new URLSearchParams(window.location.search);
const komikId = params.get("komik");
const infoDiv = document.getElementById("info");

// Tampilkan info komik
async function tampilkanInfo() {
  const komikRef = doc(db, "komik", komikId);
  const snap = await getDoc(komikRef);
  if (snap.exists()) {
    const data = snap.data();
    infoDiv.innerHTML = `Menambahkan chapter ke: <strong>${data.judul}</strong>`;
  } else {
    infoDiv.textContent = "Komik tidak ditemukan.";
  }
}

tampilkanInfo();

// Proses tambah chapter
document.getElementById("form-chapter").addEventListener("submit", async (e) => {
  e.preventDefault();

  const judul = document.getElementById("judul").value;
  const halamanText = document.getElementById("halaman").value;
  const halamanArray = halamanText.split("\n").map(x => x.trim()).filter(x => x);

  try {
    const chapterRef = collection(db, "komik", komikId, "chapter");
    await addDoc(chapterRef, {
      judul: judul,
      halaman: halamanArray
    });

    document.getElementById("hasil").innerHTML = `✅ Chapter berhasil ditambahkan! <br><a href="baca.html?komik=${komikId}&chapter=...">Cek Halaman</a>`;
  } catch (err) {
    document.getElementById("hasil").textContent = "❌ Gagal tambah chapter: " + err.message;
  }
});
