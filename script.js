/* ================================
   CONFIG
================================ */
const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbD1WEET8Z_X9SGBu_Nzfag8zO6NaBxnNn3HVBUH1erzlZAinL8oDIA1nUWGN07xd71HoR85fgQ2Yq/pub?output=csv";

/* ================================
   ELEMENTS
================================ */
const grid = document.getElementById("wine-grid");
const search = document.getElementById("search");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");

const sortField = document.getElementById("sort-field");
const sortDirection = document.getElementById("sort-direction");

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");
const modalRegion = document.getElementById("modal-region");
const modalGrape = document.getElementById("modal-grape");
const modalTaste = document.getElementById("modal-taste");
const modalPairing = document.getElementById("modal-pairing");
const modalRating = document.getElementById("modal-rating");
const modalBuy = document.getElementById("modal-buy");
const modalExtra = document.getElementById("modal-extra");

/* ================================
   THEME TOGGLE
================================ */
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

/* ================================
   DATA
================================ */
let wines = [];

/* ================================
   GOOGLE DRIVE IMAGE FIX
================================ */
function driveToImageURL(url) {
  if (!url) return "";

  // If multiple uploads, use the first
  if (url.includes(",")) {
    url = url.split(",")[0].trim();
  }

  const match =
    url.match(/\/d\/([^/]+)/) ||
    url.match(/id=([^&]+)/) ||
    url.match(/lh3\.googleusercontent\.com\/d\/([^/?]+)/);

  if (!match) return "";

  return `https://lh3.googleusercontent.com/d/${match[1]}`;
}

/* ================================
   LOAD CSV
================================ */
Papa.parse(sheetURL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: results => {
    wines = results.data.map(row => {
      const clean = {};
      for (let key in row) clean[key.trim()] = row[key];

      return {
        name: clean["Wine Name"] || "",
        vintage: clean["Vintage (Year)"] || "",
        type: clean["Wine Type"] || "",
        grape: clean["Grape Type (Riesling, Baco Noir, Etc.)"] || "",
        price: clean["Price"] || "",
        region: clean["Region"] || "",
        taste: clean["Taste Description"] || "",
        pairing: clean["Paring Notes"] || "",
        rating: clean["What do you Rate the Wine?"] || "",
        buy: clean["Would you Buy this Again?"] || "",
        image: clean["Please enter a photo of the Label"] || "",
        extra: clean["Additional Information"] || ""
      };
    });

    applyFilters();
  }
});

/* ================================
   RENDER
================================ */
function render(data) {
  grid.innerHTML = "";

  data.forEach(w => {
    const card = document.createElement("div");
    card.className = "wine-card";

    const imgSrc =
      driveToImageURL(w.image) ||
      "https://via.placeholder.com/200x180?text=No+Image";

    card.innerHTML = `
      <img src="${imgSrc}" alt="${w.name} Label" loading="lazy">
      <h3>${w.name}</h3>
      <div class="meta">${w.vintage} • ${w.type}</div>
    `;

    card.addEventListener("click", () => openModal(w));
    grid.appendChild(card);
  });
}

/* ================================
   MODAL
================================ */
function openModal(w) {
  modal.classList.remove("hidden");

  modalImg.src =
    driveToImageURL(w.image) ||
    "https://via.placeholder.com/400x300?text=No+Image";

  modalTitle.textContent = w.name;
  modalMeta.textContent = `${w.vintage} • ${w.type}`;
  modalRegion.textContent = w.region;
  modalGrape.textContent = w.grape;
  modalTaste.textContent = w.taste;
  modalPairing.textContent = w.pairing;
  modalRating.textContent = w.rating;
  modalBuy.textContent = w.buy;
  modalExtra.textContent = w.extra;
}

/* ================================
   CLOSE MODAL
================================ */
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") modal.classList.add("hidden");
});

/* ================================
   SORTING
================================ */
function sortWines(data, field, direction) {
  if (!field) return data;

  return [...data].sort((a, b) => {
    let valA = a[field] ?? "";
    let valB = b[field] ?? "";

    if (["vintage", "rating", "price"].includes(field)) {
      valA = parseFloat(valA) || 0;
      valB = parseFloat(valB) || 0;
    } else {
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/* ================================
   SEARCH + SORT COMBINED
================================ */
function applyFilters() {
  const term = search.value.toLowerCase();
  const field = sortField.value;
  const direction = sortDirection.value;

  let filtered = wines.filter(w =>
    Object.values(w).join(" ").toLowerCase().includes(term)
  );

  filtered = sortWines(filtered, field, direction);
  render(filtered);
}

search.addEventListener("input", applyFilters);
sortField.addEventListener("change", applyFilters);
sortDirection.addEventListener("change", applyFilters);
