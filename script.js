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
const clearSearchBtn = document.getElementById("clear-search");
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
const modalExtraSection = document.getElementById("modal-extra-section");

const totalCount = document.getElementById("total-count");
const displayCount = document.getElementById("display-count");
const avgRating = document.getElementById("avg-rating");

// Filter elements
const filterToggle = document.getElementById("filter-toggle");
const filtersPanel = document.getElementById("filters-panel");
const clearFiltersBtn = document.getElementById("clear-filters");
const activeFilterCount = document.getElementById("active-filter-count");
const typeFilters = document.getElementById("type-filters");
const regionFilters = document.getElementById("region-filters");
const grapeFilters = document.getElementById("grape-filters");
const minRatingInput = document.getElementById("min-rating");
const ratingValue = document.getElementById("rating-value");
const buyYes = document.getElementById("buy-yes");
const buyNo = document.getElementById("buy-no");
const vintageMin = document.getElementById("vintage-min");
const vintageMax = document.getElementById("vintage-max");

// View toggle
const gridViewBtn = document.getElementById("grid-view");
const listViewBtn = document.getElementById("list-view");
const exportBtn = document.getElementById("export-csv");

// Modal navigation
const prevWineBtn = document.getElementById("prev-wine");
const nextWineBtn = document.getElementById("next-wine");
const winePosition = document.getElementById("wine-position");

// Notes elements
const editNotesBtn = document.getElementById("edit-notes-btn");
const notesDisplay = document.getElementById("notes-display");
const notesEditor = document.getElementById("notes-editor");
const notesTextarea = document.getElementById("notes-textarea");
const saveNotesBtn = document.getElementById("save-notes-btn");
const cancelNotesBtn = document.getElementById("cancel-notes-btn");

/* ================================
   STATE
================================ */
let wines = [];
let filteredWines = [];
let currentWineIndex = -1;
let currentView = 'grid'; // 'grid' or 'list'
let personalNotes = {}; // Store notes by wine name

// Load notes from localStorage
try {
  const savedNotes = localStorage.getItem('wineNotes');
  if (savedNotes) {
    personalNotes = JSON.parse(savedNotes);
  }
} catch (e) {
  console.error('Error loading notes:', e);
}

/* ================================
   THEME TOGGLE
================================ */
const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

/* ================================
   GOOGLE DRIVE IMAGE FIX
================================ */
function driveToImageURL(url) {
  if (!url) return "";

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

    totalCount.textContent = wines.length;
    buildFilterOptions();
    applyFilters();
  },
  error: error => {
    console.error("Error loading data:", error);
    grid.innerHTML = `
      <div class="loading-state">
        <p>Failed to load collection. Please refresh the page.</p>
      </div>
    `;
  }
});

/* ================================
   BUILD FILTER OPTIONS
================================ */
function buildFilterOptions() {
  // Get unique values
  const types = [...new Set(wines.map(w => w.type).filter(Boolean))].sort();
  const regions = [...new Set(wines.map(w => w.region).filter(Boolean))].sort();
  const grapes = [...new Set(wines.map(w => w.grape).filter(Boolean))].sort();

  // Build type checkboxes
  types.forEach(type => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" class="type-filter" value="${escapeHtml(type)}">
      <span>${escapeHtml(type)}</span>
    `;
    typeFilters.appendChild(label);
  });

  // Build region checkboxes
  regions.forEach(region => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" class="region-filter" value="${escapeHtml(region)}">
      <span>${escapeHtml(region)}</span>
    `;
    regionFilters.appendChild(label);
  });

  // Build grape checkboxes
  grapes.forEach(grape => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" class="grape-filter" value="${escapeHtml(grape)}">
      <span>${escapeHtml(grape)}</span>
    `;
    grapeFilters.appendChild(label);
  });

  // Add event listeners to all filter inputs
  document.querySelectorAll('.type-filter, .region-filter, .grape-filter').forEach(input => {
    input.addEventListener('change', applyFilters);
  });

  buyYes.addEventListener('change', applyFilters);
  buyNo.addEventListener('change', applyFilters);
  vintageMin.addEventListener('input', debounce(applyFilters, 500));
  vintageMax.addEventListener('input', debounce(applyFilters, 500));
}

/* ================================
   RENDER
================================ */
function render(data) {
  filteredWines = data;
  displayCount.textContent = data.length;

  // Calculate average rating
  const ratings = data.map(w => parseFloat(w.rating)).filter(r => !isNaN(r) && r > 0);
  if (ratings.length > 0) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    avgRating.textContent = avg.toFixed(1);
  } else {
    avgRating.textContent = "—";
  }

  if (data.length === 0) {
    grid.innerHTML = `
      <div class="loading-state">
        <p>No wines found matching your criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";

  data.forEach((w, index) => {
    const card = document.createElement("div");
    card.className = "wine-card";
    card.style.animationDelay = `${index * 0.05}s`;

    const imgSrc =
      driveToImageURL(w.image) ||
      "https://via.placeholder.com/320x320/722f37/ffffff?text=No+Image";

    const vintage = w.vintage || "N/A";
    const type = w.type || "Unknown Type";

    if (currentView === 'grid') {
      card.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(w.name)} Label" loading="lazy">
        <h3>${escapeHtml(w.name)}</h3>
        <div class="meta">${escapeHtml(vintage)} · ${escapeHtml(type)}</div>
      `;
    } else {
      // List view
      card.innerHTML = `
        <img src="${imgSrc}" alt="${escapeHtml(w.name)} Label" loading="lazy">
        <div class="card-content">
          <div class="card-info">
            <h3>${escapeHtml(w.name)}</h3>
            <div class="meta">${escapeHtml(vintage)} · ${escapeHtml(type)}</div>
          </div>
          <div class="card-details">
            <div class="detail-chip">
              <span class="detail-chip-label">Region</span>
              <span class="detail-chip-value">${escapeHtml(w.region || 'N/A')}</span>
            </div>
            <div class="detail-chip">
              <span class="detail-chip-label">Rating</span>
              <span class="detail-chip-value">${escapeHtml(w.rating || 'N/A')}</span>
            </div>
          </div>
        </div>
      `;
    }

    card.addEventListener("click", () => openModal(index));
    
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });

    grid.appendChild(card);
  });
}

/* ================================
   ESCAPE HTML
================================ */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ================================
   MODAL
================================ */
function openModal(index) {
  currentWineIndex = index;
  const w = filteredWines[index];
  
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  modalImg.src =
    driveToImageURL(w.image) ||
    "https://via.placeholder.com/500x500/722f37/ffffff?text=No+Image";

  modalTitle.textContent = w.name;
  modalMeta.textContent = `${w.vintage || "N/A"} · ${w.type || "Unknown Type"}`;
  modalRegion.textContent = w.region || "Not specified";
  modalGrape.textContent = w.grape || "Not specified";
  modalTaste.textContent = w.taste || "No tasting notes available.";
  modalPairing.textContent = w.pairing || "No pairing suggestions available.";
  modalRating.textContent = w.rating || "Not rated";
  modalBuy.textContent = w.buy || "Not specified";
  
  if (w.extra && w.extra.trim()) {
    modalExtra.textContent = w.extra;
    modalExtraSection.classList.remove("hidden");
  } else {
    modalExtraSection.classList.add("hidden");
  }

  // Update navigation
  winePosition.textContent = `${index + 1} / ${filteredWines.length}`;
  prevWineBtn.disabled = index === 0;
  nextWineBtn.disabled = index === filteredWines.length - 1;

  // Load personal notes
  loadNotes(w.name);

  closeBtn.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  currentWineIndex = -1;
}

/* ================================
   MODAL NAVIGATION
================================ */
prevWineBtn.addEventListener('click', () => {
  if (currentWineIndex > 0) {
    openModal(currentWineIndex - 1);
  }
});

nextWineBtn.addEventListener('click', () => {
  if (currentWineIndex < filteredWines.length - 1) {
    openModal(currentWineIndex + 1);
  }
});

// Keyboard navigation in modal
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('hidden')) {
    if (e.key === 'ArrowLeft' && !prevWineBtn.disabled) {
      openModal(currentWineIndex - 1);
    } else if (e.key === 'ArrowRight' && !nextWineBtn.disabled) {
      openModal(currentWineIndex + 1);
    }
  }
});

/* ================================
   PERSONAL NOTES
================================ */
function loadNotes(wineName) {
  const note = personalNotes[wineName];
  
  notesEditor.classList.add('hidden');
  notesDisplay.classList.remove('hidden');
  
  if (note && note.trim()) {
    notesDisplay.innerHTML = `<p>${escapeHtml(note)}</p>`;
  } else {
    notesDisplay.innerHTML = '<p class="empty-notes">No personal notes yet. Click Edit to add your thoughts.</p>';
  }
}

editNotesBtn.addEventListener('click', () => {
  const wineName = filteredWines[currentWineIndex].name;
  notesTextarea.value = personalNotes[wineName] || '';
  notesDisplay.classList.add('hidden');
  notesEditor.classList.remove('hidden');
  notesTextarea.focus();
});

saveNotesBtn.addEventListener('click', () => {
  const wineName = filteredWines[currentWineIndex].name;
  const note = notesTextarea.value.trim();
  
  if (note) {
    personalNotes[wineName] = note;
  } else {
    delete personalNotes[wineName];
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('wineNotes', JSON.stringify(personalNotes));
  } catch (e) {
    console.error('Error saving notes:', e);
  }
  
  loadNotes(wineName);
});

cancelNotesBtn.addEventListener('click', () => {
  const wineName = filteredWines[currentWineIndex].name;
  loadNotes(wineName);
});

/* ================================
   CLOSE MODAL
================================ */
closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", e => {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
    closeModal();
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/* ================================
   SEARCH
================================ */
search.addEventListener("input", (e) => {
  if (e.target.value) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  debounce(applyFilters, 300)();
});

clearSearchBtn.addEventListener('click', () => {
  search.value = '';
  clearSearchBtn.classList.add('hidden');
  applyFilters();
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

sortField.addEventListener("change", applyFilters);
sortDirection.addEventListener("change", applyFilters);

/* ================================
   ADVANCED FILTERS
================================ */
filterToggle.addEventListener('click', () => {
  filtersPanel.classList.toggle('hidden');
});

clearFiltersBtn.addEventListener('click', () => {
  // Clear all checkboxes
  document.querySelectorAll('.type-filter, .region-filter, .grape-filter').forEach(input => {
    input.checked = false;
  });
  buyYes.checked = false;
  buyNo.checked = false;
  minRatingInput.value = 0;
  ratingValue.textContent = '0+';
  vintageMin.value = '';
  vintageMax.value = '';
  
  applyFilters();
});

minRatingInput.addEventListener('input', (e) => {
  ratingValue.textContent = e.target.value + '+';
  applyFilters();
});

/* ================================
   APPLY FILTERS
================================ */
function applyFilters() {
  const term = search.value.toLowerCase();
  const field = sortField.value;
  const direction = sortDirection.value;

  // Get selected filters
  const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
  const selectedRegions = Array.from(document.querySelectorAll('.region-filter:checked')).map(cb => cb.value);
  const selectedGrapes = Array.from(document.querySelectorAll('.grape-filter:checked')).map(cb => cb.value);
  const minRating = parseFloat(minRatingInput.value) || 0;
  const vinMin = vintageMin.value ? parseInt(vintageMin.value) : null;
  const vinMax = vintageMax.value ? parseInt(vintageMax.value) : null;

  let filtered = wines.filter(w => {
    // Text search
    if (term && !Object.values(w).join(" ").toLowerCase().includes(term)) {
      return false;
    }

    // Type filter
    if (selectedTypes.length > 0 && !selectedTypes.includes(w.type)) {
      return false;
    }

    // Region filter
    if (selectedRegions.length > 0 && !selectedRegions.includes(w.region)) {
      return false;
    }

    // Grape filter
    if (selectedGrapes.length > 0 && !selectedGrapes.includes(w.grape)) {
      return false;
    }

    // Rating filter
    const rating = parseFloat(w.rating) || 0;
    if (rating < minRating) {
      return false;
    }

    // Buy again filter
    if (buyYes.checked && !buyNo.checked) {
      if (!w.buy || !w.buy.toLowerCase().includes('yes')) {
        return false;
      }
    }
    if (buyNo.checked && !buyYes.checked) {
      if (!w.buy || !w.buy.toLowerCase().includes('no')) {
        return false;
      }
    }

    // Vintage range
    const vintage = parseInt(w.vintage);
    if (vinMin && vintage < vinMin) return false;
    if (vinMax && vintage > vinMax) return false;

    return true;
  });

  // Update active filter count
  let activeFilters = 0;
  activeFilters += selectedTypes.length;
  activeFilters += selectedRegions.length;
  activeFilters += selectedGrapes.length;
  if (minRating > 0) activeFilters++;
  if (buyYes.checked || buyNo.checked) activeFilters++;
  if (vinMin || vinMax) activeFilters++;

  if (activeFilters > 0) {
    activeFilterCount.textContent = activeFilters;
    activeFilterCount.classList.remove('hidden');
  } else {
    activeFilterCount.classList.add('hidden');
  }

  filtered = sortWines(filtered, field, direction);
  render(filtered);
}

/* ================================
   VIEW TOGGLE
================================ */
gridViewBtn.addEventListener('click', () => {
  currentView = 'grid';
  grid.classList.remove('list-view');
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
  render(filteredWines);
});

listViewBtn.addEventListener('click', () => {
  currentView = 'list';
  grid.classList.add('list-view');
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
  render(filteredWines);
});

/* ================================
   EXPORT TO CSV
================================ */
exportBtn.addEventListener('click', () => {
  if (filteredWines.length === 0) {
    alert('No wines to export');
    return;
  }

  const headers = ['Wine Name', 'Vintage', 'Type', 'Grape', 'Region', 'Rating', 'Buy Again', 'Tasting Notes', 'Pairing', 'Personal Notes'];
  const rows = filteredWines.map(w => [
    w.name,
    w.vintage,
    w.type,
    w.grape,
    w.region,
    w.rating,
    w.buy,
    w.taste,
    w.pairing,
    personalNotes[w.name] || ''
  ]);

  let csvContent = headers.map(h => `"${h}"`).join(',') + '\n';
  csvContent += rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `wine-collection-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

/* ================================
   UTILITY FUNCTIONS
================================ */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* ================================
   TOUCH IMPROVEMENTS
================================ */
let touchStartY = 0;
let touchEndY = 0;
let modalStartScroll = 0;

const modalContent = document.querySelector(".modal-content");

if (modalContent) {
  modalContent.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
    modalStartScroll = modalContent.scrollTop;
  }, { passive: true });

  modalContent.addEventListener("touchmove", e => {
    touchEndY = e.touches[0].clientY;
  }, { passive: true });

  modalContent.addEventListener("touchend", () => {
    const swipeDistance = touchEndY - touchStartY;
    
    if (modalStartScroll === 0 && swipeDistance > 100) {
      closeModal();
    }
  }, { passive: true });
}

/* ================================
   INITIAL LOAD
================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    if (wines.length === 0) {
      grid.innerHTML = `
        <div class="loading-state">
          <div class="loader"></div>
          <p>Loading collection...</p>
        </div>
      `;
    }
  }, 100);
});
