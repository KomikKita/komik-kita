import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

async function loadRanking() {
  const container = document.getElementById("ranking-komik");
  const ref = collection(db, "komik");
  const snap = await getDocs(ref);

  snap.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "rank-item";
    item.innerHTML = `
      <a href="komik.html?komik=${doc.id}">
        <img src="${data.cover}" alt="${data.judul}" width="100%">
        <div>${data.judul}</div>
        <div>${data.lastChapter || ''}</div>
      </a>
    `;
    container.appendChild(item);
  });
}

async function loadRilisan() {
  const container = document.getElementById("rilisan-terbaru");
  const ref = collection(db, "komik");
  const snap = await getDocs(ref);

  snap.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "release-item";
    item.innerHTML = `
      <img src="${data.cover}" alt="${data.judul}">
      <div>
        <h4>${data.judul}</h4>
        <div><a href="baca.html?komik=${doc.id}&chapter=${data.lastChapterId}">${data.lastChapter}</a></div>
      </div>
    `;
    container.appendChild(item);
  });
}

loadRanking();
loadRilisan();
