import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIZA...", // 🔒 Ganti dengan milikmu
  authDomain: "komik-kita-d3d7b.firebaseapp.com",
  projectId: "komik-kita-d3d7b",
  storageBucket: "komik-kita-d3d7b.appspot.com",
  messagingSenderId: "716576061034",
  appId: "1:71657...",
  measurementId: "G-..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);
const komikId = params.get("komik");
const chapterId = params.get("chapter");

// Ambil elemen HTML
const gambarContainer = document.getElementById("gambar-komik");
const dropdownTop = document.getElementById("dropdown-chapter");
const dropdownBottom = document.getElementById("dropdown-chapter-bottom");
const judulEl = document.getElementById("judul-chapter");
const prevBtnTop = document.getElementById("prev-btn");
const nextBtnTop = document.getElementById("next-btn");
const prevBtnBottom = document.getElementById("prev-btn-bottom");
const nextBtnBottom = document.getElementById("next-btn-bottom");

async function loadChapter() {
  const ref = doc(db, "komik", komikId, "chapter", chapterId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    document.body.innerHTML = "<p>Chapter tidak ditemukan.</p>";
    return;
  }

  const data = snap.data();
  judulEl.textContent = data.judul;

  // Tampilkan gambar komik
  gambarContainer.innerHTML = "";
  data.halaman.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.style = "width:100%;display:block;margin:0;padding:0;";
    gambarContainer.appendChild(img);
  });

  // Ambil semua chapter
  const chapterRef = collection(db, "komik", komikId, "chapter");
  const allChapters = await getDocs(chapterRef);

  const list = [];
  allChapters.forEach((docu) => {
    list.push({ id: docu.id, ...docu.data() });
  });

  // Urutkan berdasarkan judul
  list.sort((a, b) => a.judul.localeCompare(b.judul));
  const index = list.findIndex(ch => ch.id === chapterId);

  // Isi dropdown atas dan bawah
  [dropdownTop, dropdownBottom].forEach(dropdown => {
    dropdown.innerHTML = "";
    list.forEach((ch) => {
      const opt = document.createElement("option");
      opt.value = ch.id;
      opt.textContent = ch.judul;
      if (ch.id === chapterId) opt.selected = true;
      dropdown.appendChild(opt);
    });

    dropdown.addEventListener("change", () => {
      const newId = dropdown.value;
      window.location.href = `baca.html?komik=${komikId}&chapter=${newId}`;
    });
  });

  // Tombol navigasi
  if (index > 0) {
    const prevURL = `baca.html?komik=${komikId}&chapter=${list[index - 1].id}`;
    prevBtnTop.href = prevBtnBottom.href = prevURL;
    prevBtnTop.style.display = prevBtnBottom.style.display = "inline-block";
  } else {
    prevBtnTop.style.display = prevBtnBottom.style.display = "none";
  }

  if (index < list.length - 1) {
    const nextURL = `baca.html?komik=${komikId}&chapter=${list[index + 1].id}`;
    nextBtnTop.href = nextBtnBottom.href = nextURL;
    nextBtnTop.style.display = nextBtnBottom.style.display = "inline-block";
  } else {
    nextBtnTop.style.display = nextBtnBottom.style.display = "none";
  }
}

loadChapter();
