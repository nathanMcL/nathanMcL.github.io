// =============================== 
// MacN About Page Script — patched to prefer PROD on GitHub Pages
// ===============================

(() => {
  "use strict";

  // ---------- Config ----------
  const LOCAL_API = "http://127.0.0.1:5000";
  const PROD_API  = "https://macn-about-api.azurewebsites.net";
  const CACHE_TTL_MS = 5 * 60 * 1000;

  const pageOrigin  = window.location.origin || "";
  const isLocalPage = pageOrigin.includes("127.0.0.1") || pageOrigin.includes("localhost");
  const preferProd  = !isLocalPage;

  // Will be set by health probing
  let ACTIVE_BASE = null;

  // ---------- Utilities ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function fadeIn(el) {
    if (!el) return;
    el.classList.add("fade-in");
    setTimeout(() => el.classList.remove("fade-in"), 800);
  }

  function createShimmer() {
    const d = document.createElement("div");
    d.classList.add("img-shimmer");
    return d;
  }

  // ---------- Low-level fetch with timeout ----------
  async function tryFetchRaw(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { mode: "cors", ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(t);
    }
  }

  async function tryFetchJSON(base, endpoint, options = {}, timeoutMs = 10000) {
    const url = `${base}${endpoint}`;
    const res = await tryFetchRaw(url, options, timeoutMs);
    if (!res.ok) {
      let body = "";
      try { body = await res.text(); } catch {}
      const err = new Error(`HTTP ${res.status} ${url}${body ? ` | body: ${body.slice(0,180)}` : ""}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  // ---------- Health probe + base selection ----------
  async function pickBase() {
    const order = preferProd ? [PROD_API, LOCAL_API] : [LOCAL_API, PROD_API];

    for (const base of order) {
      try {
        const r = await tryFetchRaw(`${base}/health`, {}, 4000);
        if (r.ok) {
          ACTIVE_BASE = base;
          console.info(`✅ Using API base: ${ACTIVE_BASE}`);
          return ACTIVE_BASE;
        }
        console.warn(`⚠️ /health not OK at ${base}: ${r.status}`);
      } catch (e) {
        console.warn(`⚠️ /health failed at ${base}: ${String(e)}`);
      }
    }
    ACTIVE_BASE = null;
    console.error("❌ No healthy API base available.");
    return null;
  }

  // smartFetch uses chosen base first, then the other as fallback
  async function smartFetch(endpoint, options = {}, timeoutMs = 10000) {
    const first = ACTIVE_BASE || (await pickBase());
    const order = first
      ? [first, (first === PROD_API ? LOCAL_API : PROD_API)]
      : (preferProd ? [PROD_API, LOCAL_API] : [LOCAL_API, PROD_API]);

    let lastErr = null;
    for (const base of order) {
      try {
        const data = await tryFetchJSON(base, endpoint, options, timeoutMs);
        console.info(`✅ Loaded ${endpoint} from ${base}`);
        return data;
      } catch (e) {
        lastErr = e;
        console.warn(`⚠️ ${base}${endpoint} failed: ${e.message || e}`);
        // If CORS/network/timeout → continue to next base
        // If 404, and this is aboutMe_photos, stop early (endpoint not present)
        if (endpoint === "/aboutMe_photos" && (e.status === 404 || e.status === 405)) break;
      }
    }
    throw lastErr || new Error("All endpoints failed");
  }

  // ---------- About Me ----------
  async function loadAboutMe() {
    const loader = document.getElementById("loader_me");
    const output = document.getElementById("about-ai-output");
    const CACHE_KEY = "about-orb-output";
    const CACHE_TIME_KEY = "about-orb-timestamp";

    const cached = localStorage.getItem(CACHE_KEY);
    const ts = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);
    if (cached && Date.now() - ts < CACHE_TTL_MS) {
      output.textContent = cached;
      loader?.setAttribute("aria-hidden", "true");
      fadeIn(output);
      return;
    }

    loader?.removeAttribute("aria-hidden");
    output.textContent = "";

    try {
      const data = await smartFetch("/generate-aboutOrb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context:
            "Use a tone that blends confidence, fun, and curiosity. Mention my creative writing, tech projects, service background, and passion for equitable code and accessibility."
        })
      }, 12000); // a bit longer for model calls

      const aboutText = data?.about_text || data?.about || "No content available.";
      output.textContent = aboutText;
      fadeIn(output);
      localStorage.setItem(CACHE_KEY, aboutText);
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch (err) {
      console.error("❌ Error fetching About Me:", err);
      output.textContent = "⚠️ Error loading About Me content.";
    } finally {
      loader?.setAttribute("aria-hidden", "true");
    }
  }

  // ---------- Carousel ----------
  function renderCarouselImages(images = []) {
    const track = document.getElementById("carousel-track");
    if (!track) return;
    if (!images.length) {
      track.replaceChildren(document.createTextNode("No images found."));
      return;
    }
    const nodes = images.map((d, i) => {
      const img = document.createElement("img");
      img.src = d.url;
      img.alt = d.name || `About image ${i + 1}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.classList.add("carousel-img");
      img.tabIndex = 0;
      img.addEventListener("load", () => img.classList.add("fade-in"));
      img.addEventListener("error", () => img.classList.add("error-img"));
      return img;
    });
    track.replaceChildren(...nodes);
    fadeIn(track);
    console.info(`✅ Carousel loaded ${nodes.length} image(s)`);
  }

  async function fetchCarouselImages() {
    const track = document.getElementById("carousel-track");
    const loader = document.getElementById("loader_carousel");
    if (!track) return [];

    const CACHE_KEY = "about-carousel-images";
    const CACHE_TIME_KEY = "about-carousel-timestamp";
    const cached = localStorage.getItem(CACHE_KEY);
    const ts = Number(localStorage.getItem(CACHE_TIME_KEY) || 0);

    if (cached && Date.now() - ts < CACHE_TTL_MS) {
      const images = JSON.parse(cached);
      renderCarouselImages(images);
      loader?.setAttribute("aria-hidden", "true");
      return images;
    }

    // skeletons
    track.replaceChildren();
    loader?.removeAttribute("aria-hidden");
    for (let i = 0; i < 4; i++) track.appendChild(createShimmer());

    try {
      const images = await smartFetch("/aboutMe_photos", {}, 6000);
      if (!Array.isArray(images)) throw new Error("Invalid image response");
      localStorage.setItem(CACHE_KEY, JSON.stringify(images));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      renderCarouselImages(images);
      return images;
    } catch (err) {
      console.error("❌ Error fetching aboutMe photos:", err);
      // If endpoint is missing or the API is down, fail softly:
      track.replaceChildren(document.createTextNode("Images are unavailable right now."));
      return [];
    } finally {
      loader?.setAttribute("aria-hidden", "true");
    }
  }

  // ---------- Carousel controls (unchanged from your improved version) ----------
  function initCarouselControls() {
    const carousel = document.querySelector(".about-carousel");
    const btnPrev  = document.querySelector(".carousel-btn.prev");
    const btnNext  = document.querySelector(".carousel-btn.next");
    if (!carousel || !btnPrev || !btnNext) {
      console.warn("⚠️ Carousel navigation buttons not found.");
      return;
    }

    let isPaused = false;
    let scrollInterval = null;
    let currentIndex = 0;
    let images = [];

    let liveRegion = document.getElementById("carousel-status");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "carousel-status";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.classList.add("sr-only");
      (carousel.parentElement || document.body).appendChild(liveRegion);
    }

    let btnPause = document.querySelector(".carousel-btn.pause");
    if (!btnPause) {
      btnPause = document.createElement("button");
      btnPause.className = "carousel-btn pause";
      btnPause.setAttribute("aria-pressed", "false");
      btnPause.setAttribute("aria-label", "Pause carousel");
      btnPause.type = "button";
      btnPause.innerText = "Pause";
      const ctrl = document.querySelector(".carousel-controls");
      if (ctrl) ctrl.insertBefore(btnPause, btnNext);
      else carousel.parentElement.appendChild(btnPause);
    }

    const refreshImagesList = () => { images = Array.from(carousel.querySelectorAll("img.carousel-img")); };

    const updateAriaStatus = () => {
      if (!images.length) refreshImagesList();
      if (images.length) {
        const img = images[currentIndex];
        if (img) {
          images.forEach((el) => el.classList.remove("focused-img"));
          img.classList.add("focused-img");
          try { img.focus({ preventScroll: true }); } catch {}
          liveRegion.textContent = `Now viewing image ${currentIndex + 1} of ${images.length}`;
        }
      }
    };

    const smoothScroll = (dir) => {
      if (!images.length) refreshImagesList();
      if (!images.length) return;
      const amt = Math.max(200, Math.floor(carousel.clientWidth * 0.35));
      carousel.scrollBy({ left: dir === "next" ? amt : -amt, behavior: "smooth" });
      currentIndex = dir === "next" ? (currentIndex + 1) % images.length
                                    : (currentIndex - 1 + images.length) % images.length;
      updateAriaStatus();
    };

    btnPrev.addEventListener("click", () => smoothScroll("prev"));
    btnNext.addEventListener("click", () => smoothScroll("next"));

    const startAuto = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      refreshImagesList();
      if (!images.length) return;
      scrollInterval = setInterval(() => { if (!isPaused) smoothScroll("next"); }, 5000);
    };
    const stopAuto = () => { if (scrollInterval) { clearInterval(scrollInterval); scrollInterval = null; } };

    const togglePause = (explicit) => {
      isPaused = typeof explicit === "boolean" ? explicit : !isPaused;
      btnPause.setAttribute("aria-pressed", String(isPaused));
      btnPause.innerText = isPaused ? "Resume" : "Pause";
      btnPause.setAttribute("aria-label", isPaused ? "Resume carousel" : "Pause carousel");
      if (isPaused) stopAuto(); else startAuto();
    };

    btnPause.addEventListener("click", () => togglePause());
    document.addEventListener("keydown", (e) => {
      const active = document.activeElement;
      const inCarousel = active && typeof active.closest === "function" && active.closest(".about-carousel");
      if (inCarousel || active === document.body) {
        if (e.key === "ArrowLeft"  || e.key === "Left")  smoothScroll("prev");
        if (e.key === "ArrowRight" || e.key === "Right") smoothScroll("next");
        if (e.code === "Space") { e.preventDefault(); togglePause(); }
      }
    });
    carousel.addEventListener("mouseenter", () => { if (!isPaused) togglePause(true);  });
    carousel.addEventListener("mouseleave", () => { if (btnPause.getAttribute("aria-pressed") === "false") togglePause(false); });

    setTimeout(() => {
      refreshImagesList();
      if (images.length) {
        images.forEach((img) => { img.tabIndex = 0; });
        currentIndex = 0;
        updateAriaStatus();
        startAuto();
      } else {
        console.info("ℹ️ No carousel images available at initialization.");
      }
    }, 300);

    console.info("🎠 Carousel controls + accessibility initialized.");
  }

  // ---------- DOM Ready ----------
  document.addEventListener("DOMContentLoaded", async () => {
    // Pick base up front so first calls don’t time out
    await pickBase();
    try { loadAboutMe(); } catch (e) { console.warn("loadAboutMe problem:", e); }
    try { await fetchCarouselImages(); } catch (e) { console.warn("fetchCarouselImages failed:", e); }
    try { if (typeof initCarouselControls === "function") initCarouselControls(); } catch (e) { console.error("initCarouselControls failed:", e); }
  });
})();

