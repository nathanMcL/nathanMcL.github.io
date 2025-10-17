// ============================================================
// MacN_iT — About Page Script
// API Integration with macn-about-api (Azure)
// ============================================================

const API_BASE = window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1")
  ? "http://127.0.0.1:5000"
  : "https://macn-about-api.azurewebsites.net";

const aboutOrbContainer = document.getElementById("about-orb-text");
const carouselContainer = document.getElementById("about-photo-carousel");
const reloadBtn = document.getElementById("reload-about");
const statusMsg = document.getElementById("api-status");

const FETCH_TIMEOUT_MS = 12000; // 12s timeout
const MAX_RETRIES = 3;

// ------------------------------------------------------------
// Helper: timeout-safe fetch
// ------------------------------------------------------------
async function safeFetch(url, options = {}, attempt = 1) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    if (attempt < MAX_RETRIES) {
      console.warn(`⚠️ Retry ${attempt}/${MAX_RETRIES} for ${url}: ${err}`);
      await new Promise(res => setTimeout(res, attempt * 1000)); // exponential backoff
      return safeFetch(url, options, attempt + 1);
    }
    console.error(`❌ All ${MAX_RETRIES} attempts failed for ${url}:`, err);
    throw err;
  }
}

// ------------------------------------------------------------
// Load the “About Me” blurb via macn-about-api
// ------------------------------------------------------------
async function loadAboutOrb() {
  aboutOrbContainer.textContent = "✨ Generating your About Me...";
  statusMsg.textContent = "Connecting to API...";

  try {
    const res = await safeFetch(`${API_BASE}/generate-aboutOrb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "Generate the latest About Me content for MacN_iT." })
    });

    if (res.ok && res.about) {
      aboutOrbContainer.textContent = res.about;
      statusMsg.textContent = "✅ Synced successfully!";
    } else if (res.error) {
      aboutOrbContainer.textContent = "⚠️ The AI service is currently unavailable. Please try again later.";
      statusMsg.textContent = "OpenAI client unavailable.";
      console.warn("API Error:", res.error);
    } else {
      aboutOrbContainer.textContent = "⚠️ Unexpected response from API.";
      statusMsg.textContent = "Response error.";
      console.warn("Unknown API response:", res);
    }
  } catch (error) {
    aboutOrbContainer.textContent = "❌ Could not reach the API server. Please check your connection.";
    statusMsg.textContent = "API unreachable.";
    console.error("Fetch error:", error);
  }
}

// ------------------------------------------------------------
// Load carousel images from /aboutMe_photos
// ------------------------------------------------------------
async function loadAboutPhotos() {
  if (!carouselContainer) return;

  carouselContainer.innerHTML = `<p>📸 Loading images...</p>`;
  try {
    const data = await safeFetch(`${API_BASE}/aboutMe_photos`);
    const photos = Array.isArray(data.photos) ? data.photos : [];

    if (!photos.length) {
      carouselContainer.innerHTML = `<p>No photos available.</p>`;
      return;
    }

    const html = photos.map(
      (url, idx) =>
        `<div class="carousel-item" tabindex="0" aria-label="Photo ${idx + 1}">
           <img src="${url}" alt="About photo ${idx + 1}" loading="lazy" />
         </div>`
    ).join("");

    carouselContainer.innerHTML = html;
    statusMsg.textContent = `🟢 Loaded ${photos.length} photo(s).`;
  } catch (err) {
    carouselContainer.innerHTML = `<p>⚠️ Failed to load photos. Try refreshing later.</p>`;
    console.error("Photo load failed:", err);
  }
}

// ------------------------------------------------------------
// UI Helpers
// ------------------------------------------------------------
if (reloadBtn) {
  reloadBtn.addEventListener("click", () => {
    loadAboutOrb();
    loadAboutPhotos();
  });
}

// ------------------------------------------------------------
// DOMContentLoaded init
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadAboutOrb();
  loadAboutPhotos();

  // Accessibility: focus trap for modal/popup (if used)
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    popup.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && popup.classList.contains("active")) {
        const focusable = popup.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
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
