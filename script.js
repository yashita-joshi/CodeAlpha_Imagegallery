

const PHOTOS = [
  { thumb: "images/kellogg_church.jpg", full: "images/kellogg_church.jpg", w: 960,  h: 1280, title: "Kellogg Church, Landour", category: "mussoorie" },
  { thumb: "images/biryani.jpg",        full: "images/biryani.jpg",        w: 720,  h: 1280, title: "Biryani",                category: "food" },
  { thumb: "images/rose.jpg",           full: "images/rose.jpg",           w: 960,  h: 1280, title: "Red rose",               category: "flowers" },
  { thumb: "images/park.jpg",           full: "images/park.jpg",           w: 1280, h: 960,  title: "Steps through the pines", category: "mussoorie" },
  { thumb: "images/cheesecake.jpg",     full: "images/cheesecake.jpg",     w: 960,  h: 1280, title: "Cheesecake",             category: "food" },
  { thumb: "images/flower.jpg",         full: "images/flower.jpg",         w: 960,  h: 1280, title: "Pink hibiscus",          category: "flowers" },
  { thumb: "images/sky.jpg",            full: "images/sky.jpg",            w: 1280, h: 960,  title: "Evening sky",            category: "mussoorie" },
  { thumb: "images/carrot_cake.jpg",    full: "images/carrot_cake.jpg",    w: 720,  h: 1280, title: "Carrot cake",            category: "food" },
  { thumb: "images/red_flower.jpg",     full: "images/red_flower.jpg",     w: 960,  h: 1280, title: "Red blooms",             category: "flowers" },
  { thumb: "images/trees.jpg",          full: "images/trees.jpg",          w: 1280, h: 960,  title: "Deodars and sky",        category: "mussoorie" },
  { thumb: "images/pizza.jpg",          full: "images/pizza.jpg",          w: 960,  h: 1280, title: "Pizza",                  category: "food" },
];

const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const countEl = document.getElementById("count");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");

let activeCategory = "all";
let visible = [...PHOTOS];   // photos currently shown; lightbox navigates through these
let current = 0;
let lastFocused = null;

/* ---------- filters ---------- */
function buildFilters() {
  const cats = ["all", ...new Set(PHOTOS.map(p => p.category))];
  filtersEl.innerHTML = cats.map(c =>
    `<button class="filter-btn${c === activeCategory ? " active" : ""}" data-cat="${c}">${c[0].toUpperCase() + c.slice(1)}</button>`
  ).join("");
}

filtersEl.addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn || btn.dataset.cat === activeCategory) return;
  activeCategory = btn.dataset.cat;
  filtersEl.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));

  // fade the old cards out, then swap in the new set
  const cards = grid.querySelectorAll(".card");
  cards.forEach(c => c.classList.add("hiding"));
  setTimeout(renderGrid, cards.length ? 300 : 0);
});

/* ---------- grid ---------- */
function renderGrid() {
  visible = activeCategory === "all" ? [...PHOTOS] : PHOTOS.filter(p => p.category === activeCategory);
  grid.innerHTML = "";

  visible.forEach((p, i) => {
    const card = document.createElement("button");
    card.className = "card hiding";
    card.type = "button";
    card.setAttribute("aria-label", `Open ${p.title}`);
    card.innerHTML = `<img src="${p.thumb}" alt="${p.title}" width="${p.w}" height="${p.h}" loading="lazy"><span class="label">${p.title}</span>`;
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
    // next frame so the transition actually runs
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("hiding")));
  });

  countEl.textContent = `${visible.length} photo${visible.length === 1 ? "" : "s"}`;
}

/* ---------- lightbox ---------- */
function showPhoto(i, animate = true) {
  current = (i + visible.length) % visible.length;   // wrap around
  const p = visible[current];
  const apply = () => {
    lbImg.src = p.full;
    lbImg.alt = p.title;
    lbCaption.textContent = `${p.title}  (${current + 1} of ${visible.length})`;
    lbImg.classList.remove("swap");
  };
  if (animate) {
    lbImg.classList.add("swap");
    setTimeout(apply, 150);
  } else {
    apply();
  }
  // warm the cache for neighbours
  [current - 1, current + 1].forEach(n => {
    new Image().src = visible[(n + visible.length) % visible.length].full;
  });
}

function openLightbox(i) {
  lastFocused = document.activeElement;
  lb.hidden = false;
  showPhoto(i, false);
  requestAnimationFrame(() => lb.classList.add("open"));
  document.body.style.overflow = "hidden";
  document.getElementById("lbClose").focus();
}

function closeLightbox() {
  lb.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => { lb.hidden = true; }, 300);
  if (lastFocused) lastFocused.focus();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => showPhoto(current - 1));
document.getElementById("lbNext").addEventListener("click", () => showPhoto(current + 1));
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPhoto(current - 1);
  if (e.key === "ArrowRight") showPhoto(current + 1);
  if (e.key === "Tab") {   // keep focus inside the viewer
    const btns = [...lb.querySelectorAll("button")];
    const first = btns[0], last = btns[btns.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// swipe on touch screens
let touchX = null;
lb.addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

buildFilters();
renderGrid();
