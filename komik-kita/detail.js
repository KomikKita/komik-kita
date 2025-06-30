// ✅ Import semua yang dibutuhkan
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Ganti dengan config Firebase milik kamu
const firebaseConfig = {
  apiKey: "AIZA...",
  authDomain: "komik-kita-d3d7b.firebaseapp.com",
  projectId: "komik-kita-d3d7b",
  storageBucket: "komik-kita-d3d7b.appspot.com",
  messagingSenderId: "716576061034",
  appId: "1:71657...",
  measurementId: "G-VNL..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Ambil ID dari URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// ✅ Ambil dan tampilkan data komik + chapter
async function loadDetail() {
  const docRef = doc(db, "komik", id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();
    const container = document.getElementById("detail-komik");
    container.innerHTML = `
      <h2>${data.judul}</h2>
      <img src="${data.cover}" width="150">
      <h3>Chapter</h3>
      <ul id="daftar-chapter"></ul>
    `;

    // 🔽 Ambil subcollection "chapter"
    const chapterRef = collection(db, "komik", id, "chapter");
    const chapterSnap = await getDocs(chapterRef);
    const list = document.getElementById("daftar-chapter");

    chapterSnap.forEach((chap) => {
      const ch = chap.data();
      const li = document.createElement("li");
      li.innerHTML = `<a href="baca.html?komik=${id}&chapter=${chap.id}">${ch.judul}</a>`;
      list.appendChild(li);
    });

  } else {
    document.body.innerHTML = "<p>Komik tidak ditemukan.</p>";
  }
}

loadDetail();
