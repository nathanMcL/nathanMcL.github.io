// ============================================================
// MacN_iT — About Page Script (Patched 3-Image Carousel + Pause)
// API Integration with macn-about-api (Azure)
// ============================================================

// ----------------------------
// CONFIG
// ----------------------------
const API_BASE =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://127.0.0.1:5000"
    : "https://macn-about-api.azurewebsites.net";

const VISIBLE = 3;
const PRELOAD_WINDOW = 9;
const AUTO_MS = 5000;
const IMG_HEIGHT = 125;
const FETCH_TIMEOUT_MS = 90000;
const MAX_RETRIES = 3;


// ----------------------------
// Elements
// ----------------------------
const aboutOrbContainer = document.getElementById("about-orb-text");
const carousel = document.getElementById("about-photo-carousel");
const statusMsg = document.getElementById("api-status");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pauseBtn = document.getElementById("pauseBtn");
const reloadBtn = document.getElementById("reload-about");

// ----------------------------
// 🛡️ Trusted Types policy (CSP compliance)
// ----------------------------
if (window.trustedTypes && !window.trustedTypes.defaultPolicy) {
  window.trustedTypes.createPolicy("default", {
    createHTML: (input) => input,
    createScript: (input) => input,
    createScriptURL: (input) => input,
  });
}

// ----------------------------
// 🧩 safeFetch — resilient with retries and logs
// ----------------------------
async function safeFetch(url, options = {}, retries = MAX_RETRIES, timeoutMs = FETCH_TIMEOUT_MS) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        console.warn(`⚠️ Attempt ${attempt}/${retries} failed ${url}: ${response.status}`);
        continue;
      }
      // Only parse JSON for API endpoints
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return await response.json();
      return await response.text();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        console.warn(`⏱️ Timeout ${timeoutMs / 1000}s on ${url} (attempt ${attempt}/${retries})`);
      } else {
        console.warn(`⚠️ Retry ${attempt}/${retries} for ${url}:`, err);
      }
      if (attempt === retries) throw err;
    }
    await new Promise((res) => setTimeout(res, 1200 * attempt));
  }
  throw new Error(`❌ All ${retries} attempts failed for ${url}`);
}

// ====================
// Helpers: ID parsing + proxy URL
// ====================
function extractId(entry) {
  // Accept either a raw ID or a full Google Drive/Googleusercontent URL
  if (!entry) return null;
  const s = String(entry).trim();

  // 1️⃣ Plain Drive ID (no URL)
  if (!/^https?:\/\//i.test(s) && /^[A-Za-z0-9_\-]{20,}$/.test(s)) {
    return s;
  }

  // 2️⃣ Common URL formats
  let m = s.match(/\/d\/([A-Za-z0-9_\-]{20,})/);
  if (m && m[1]) return m[1];

  m = s.match(/[?&]id=([A-Za-z0-9_\-]{20,})/);
  if (m && m[1]) return m[1];

  m = s.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_\-]{20,})/);
  if (m && m[1]) return m[1];

  console.warn("⚠️ Could not extract Drive ID from entry:", s);
  return null;
}

function buildProxyUrl(id) {
  return `${API_BASE}/proxy_drive/${id}`;
}


// ----------------------------
// About Me blurb — complete sentence guarantee
// ----------------------------
async function loadAboutOrb() {
  if (!aboutOrbContainer) return;
  aboutOrbContainer.textContent = "Generating About Me…";
  statusMsg.textContent = "Connecting to API...";

  try {
    const res = await safeFetch(`${API_BASE}/generate-aboutOrb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: "Generate the latest About Me content for MacN_iT.",
      }),
    });

    let text = res?.about ? String(res.about).trim() : "";
    if (text && !/[.!?]$/.test(text)) text += ".";
    aboutOrbContainer.textContent = text || "⚠️ Could not generate About Me right now.";
    statusMsg.textContent = "✅ Synced successfully!";
  } catch (e) {
    aboutOrbContainer.textContent = "❌ API unreachable at the moment.";
    statusMsg.textContent = "API unreachable.";
    console.warn("AboutMe error:", e);
  }
}

// ----------------------------
// Carousel (3 visible, pause/resume, preload 9, skip 404s)
// ----------------------------
let ids = [];
let queue = [];
let index = 0;
let autoTimer = null;
let paused = false;

function buildProxyUrl(id) {
  return `${API_BASE}/proxy_drive/${id}`;
}

function createTrack() {
  const track = document.createElement("div");
  track.className = "carousel-track";
  return track;
}

function createItem(url) {
  const item = document.createElement("div");
  item.className = "carousel-item";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.alt = "About photo";
  img.height = IMG_HEIGHT;
  img.src = url;

  // Recover gracefully from 404s
  img.onerror = () => {
    console.warn(`⚠️ Image failed to load: ${url}`);
    const i = queue.indexOf(url);
    if (i >= 0) {
      queue.splice(i, 1);
      index = Math.max(0, Math.min(index, Math.max(0, queue.length - VISIBLE)));
      render();
    }
  };

  item.appendChild(img);
  return item;
}

function render() {
  if (!carousel) return;

  let track = carousel.querySelector(".carousel-track");
  if (!track) {
    track = createTrack();
    carousel.innerHTML = "";
    carousel.appendChild(track);
  }

  if (queue.length <= VISIBLE) index = 0;
  else if (index > queue.length - VISIBLE) index = queue.length - VISIBLE;

  track.innerHTML = "";
  const visibleSlice = queue.slice(index, index + VISIBLE);
  visibleSlice.forEach((url) => track.appendChild(createItem(url)));

  // Highlight focused (middle) image
  const items = track.querySelectorAll(".carousel-item");
  items.forEach((el, i) => el.classList.toggle("focused", i === 1));

  track.style.transform = "translateX(0)";
}

function next() {
  if (queue.length <= VISIBLE) return;
  index = (index + 1) % queue.length;
  if (index > queue.length - VISIBLE) index = 0;
  render();
}

function prev() {
  if (queue.length <= VISIBLE) return;
  index = (index - 1 + queue.length) % queue.length;
  if (index > queue.length - VISIBLE) index = Math.max(0, queue.length - VISIBLE);
  render();
}

function startAuto() {
  stopAuto();
  autoTimer = setInterval(() => {
    if (!paused) next();
  }, AUTO_MS);
}

function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

function togglePause() {
  paused = !paused;
  if (pauseBtn) pauseBtn.textContent = paused ? "▶︎" : "⏸";
}

// ------------------------------------------------------------
// Preload the first PRELOAD_WINDOW images as proxy URLs
// ------------------------------------------------------------
function primeQueue(allIds) {
  ids = allIds.slice(); // copy
  const first = ids.slice(0, PRELOAD_WINDOW);
  queue = first.map(id => buildProxyUrl(id)); // explicit build
  render();
  startAuto();

  // TODO: expansion: 
  // background-load the remainder of ids for larger queues.
}


// ----------------------------
// Button controls
// ----------------------------
// ------------------------------------------------------------
// Controls (with null safety + auto reset)
// ------------------------------------------------------------
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const track = document.querySelector("#about-photo-carousel .carousel-track");
    if (!track) return; // prevent null errors
    next();
    stopAuto();
    startAuto();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    const track = document.querySelector("#about-photo-carousel .carousel-track");
    if (!track) return; // prevent null errors
    prev();
    stopAuto();
    startAuto();
  });
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", () => togglePause());
}

// ------------------------------------------------------------
// Fetch IDs → normalize → build proxy URLs → render only 3 photos at a time
// ------------------------------------------------------------
async function loadAboutPhotos() {
  if (!carousel) return;
  const status = document.getElementById("carousel-status");
  if (status) status.textContent = "Loading photos…";

  try {
    const data = await safeFetch(`${API_BASE}/aboutMe_photos`, {}, 1, 90000);
    const raw = Array.isArray(data.photos) ? data.photos : [];

    // Normalize everything to Drive IDs
    const idsOnly = raw
      .map(extractId)
      .filter(Boolean);

    if (!idsOnly.length) {
      if (status) status.textContent = "No photos available.";
      console.warn("📭 /aboutMe_photos returned no usable IDs:", raw);
      return;
    }

    // Preload and render using normalized IDs
    primeQueue(idsOnly);
    if (status) {
      status.textContent = `Loaded ${Math.min(idsOnly.length, PRELOAD_WINDOW)} photo${idsOnly.length === 1 ? "" : "s"}.`;
    }
  } catch (e) {
    if (status) status.textContent = "Failed to load photos.";
    console.warn("Photo load error:", e);
  }
}


// ----------------------------
// UI Helpers
// ----------------------------
if (reloadBtn) {
  reloadBtn.addEventListener("click", () => {
    loadAboutOrb();
    loadAboutPhotos();
  });
}

// ----------------------------
// DOMContentLoaded init
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Warming up macn-about-api (non-blocking)...");

  safeFetch(`${API_BASE}/warmup`, {}, 1, 30000).catch(console.warn);
  safeFetch(`${API_BASE}/warmup_drive`, {}, 1, 60000).catch(console.warn);

  loadAboutOrb();
  loadAboutPhotos();

  // Accessibility focus trap for modals
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    popup.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && popup.classList.contains("active")) {
        const focusable = popup.querySelectorAll(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  });
});
