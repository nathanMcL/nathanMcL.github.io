// ============================================================
// MacN_iT — About Page Script
// API Integration with macn-about-api (Azure)
// ============================================================

const API_BASE =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://127.0.0.1:5000"
    : "https://macn-about-api.azurewebsites.net";

const aboutOrbContainer = document.getElementById("about-orb-text");
const carouselContainer = document.getElementById("about-photo-carousel");
const reloadBtn = document.getElementById("reload-about");
const statusMsg = document.getElementById("api-status");

const FETCH_TIMEOUT_MS = 12000; // 12s timeout
const MAX_RETRIES = 3;

// ====================
// 🧩 safeFetch — tolerant with clearer diagnostics
// ====================
async function safeFetch(url, options = {}, retries = 3, timeoutMs = 25000) {
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
      // 👇 Only parse as JSON for API endpoints, never for images
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        console.warn(`⏱️ Timeout ${timeoutMs / 1000}s on ${url} (attempt ${attempt}/${retries})`);
      } else {
        console.warn(`⚠️ Retry ${attempt}/${retries} for ${url}:`, err);
      }
      if (attempt === retries) throw err;
    }
    await new Promise(res => setTimeout(res, 1200 * attempt));
  }
  throw new Error(`❌ All ${retries} attempts failed for ${url}`);
}

// ------------------------------------------------------------
// Load the “About Me” blurb via macn-about-api
// ------------------------------------------------------------
async function loadAboutOrb() {
  aboutOrbContainer.textContent = "Generating An About Me Description...";
  statusMsg.textContent = "Connecting to API...";

  try {
    const spinner = document.querySelector(".loading-spinner");
    if (spinner) spinner.style.display = "inline-block";

    const res = await safeFetch(`${API_BASE}/generate-aboutOrb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: "Generate the latest About Me content for MacN_iT.",
      }),
    });

    if (res.ok && res.about) {
      aboutOrbContainer.innerHTML = `<p>${res.about.replace(/\n+/g, '</p><p>')}</p>`;
      statusMsg.textContent = "✅ Synced successfully!";
    } else if (res.error) {
      aboutOrbContainer.innerHTML =
        "⚠️ The AI service is currently unavailable. Please try again later.";
      statusMsg.textContent = "OpenAI client unavailable.";
      console.warn("API Error:", res.error);
    } else {
      aboutOrbContainer.innerHTML = "⚠️ Unexpected response from API.";
      statusMsg.textContent = "Response error.";
      console.warn("Unknown API response:", res);
    }
  } catch (error) {
    aboutOrbContainer.innerHTML =
      "❌ Could not reach the API server. Please check your connection.";
    statusMsg.textContent = "API unreachable.";
    console.error("Fetch error:", error);
  } finally {
    const spinner = document.querySelector(".loading-spinner");
    if (spinner) spinner.style.display = "none";
  }
}

// ------------------------------------------------------------
// Load carousel images (CORB-safe: direct <img> usage)
// ------------------------------------------------------------
async function loadAboutPhotos() {
  if (!carouselContainer) return;

  carouselContainer.textContent = "📸 Loading images...";

  try {
    const data = await safeFetch(`${API_BASE}/aboutMe_photos`);
    const photos = Array.isArray(data.photos) ? data.photos : [];

    if (!photos.length) {
      carouselContainer.textContent = "No photos available.";
      return;
    }

    // ✅ Build pure <img> tags — browser loads Drive links directly
    const html = photos
      .map((url, idx) => {
        const id = url.match(/d\/([^=]+)/)?.[1] || url.split("id=")[1];
        return `
          <div class="carousel-item" tabindex="0" aria-label="Photo ${idx + 1}">
            <img src="${API_BASE}/proxy_drive/${id}"
                alt="About photo ${idx + 1}"
                loading="lazy"
                crossorigin="anonymous"
                referrerpolicy="no-referrer" />
          </div>`;
      })
      .join("");


    // ✅ CSP-compliant safe assignment (Trusted Types)
    const policy = window.trustedTypes?.createPolicy("safeHTML", {
      createHTML: (input) => input,
    });
    const safeHTML = policy ? policy.createHTML(html) : html;
    carouselContainer.innerHTML = safeHTML;

    statusMsg.textContent = `🟢 Loaded ${photos.length} photo(s).`;
  } catch (err) {
    carouselContainer.textContent =
      "⚠️ Failed to load photos. Try refreshing later.";
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
  console.log("🚀 Warming up macn-about-api (non-blocking)...");
  // 🔹 Fire-and-forget Drive warm-up, so it doesn’t block other calls
  safeFetch(`${API_BASE}/warmup`, {}, 1, 30000).catch(console.warn);
  safeFetch(`${API_BASE}/warmup_drive`, {}, 1, 60000).catch(console.warn);

  // 🔹 Continue loading immediately
  loadAboutOrb();
  loadAboutPhotos();

  // Accessibility: focus trap for modal/popup (if used)
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