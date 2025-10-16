// =============================== 
// MacN About Page Script — patched to prefer PROD on GitHub Pages
// ===============================
(() => {
  "use strict";

  // ---------- Config ----------
  const PROD_API = "https://macn-about-api.azurewebsites.net";
  const LOCAL_API = "http://127.0.0.1:5000";
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes for content cache
  const BASE_TTL_MS  = 10 * 60 * 1000; // 10 minutes for API base decision

  // Where are we running the page?
  const origin = window.location.origin || "";
  const isLocalPage = /(^https?:\/\/(localhost|127\.0\.0\.1)|^file:)/i.test(origin);

  // Optional override: allow probing localhost from prod page via ?allowLocal=1
  const urlParams = new URLSearchParams(window.location.search);
  const allowLocalFromProd = urlParams.get("allowLocal") === "1";

  // Sticky base selection keys
  const BASE_KEY = "macn.api.base";
  const BASE_TS_KEY = "macn.api.base.ts";

  // ---------- Utilities ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function createShimmer() {
    const shimmer = document.createElement("div");
    shimmer.classList.add("img-shimmer");
    return shimmer;
  }

  function fadeIn(el) {
    if (!el) return;
    el.classList.add("fade-in");
    setTimeout(() => el.classList.remove("fade-in"), 1000);
  }

  function withTimeout(promise, ms, label = "request") {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    // The caller can pass in fetch options; we’ll attach signal there
    return {
      signal: controller.signal,
      run: promise.finally(() => clearTimeout(timer)),
      abort: () => { clearTimeout(timer); controller.abort(); }
    };
  }

  async function fetchJSON(url, options = {}, timeoutMs = 10000) {
    const { signal, run } = withTimeout(Promise.resolve().then(async () => {
      const res = await fetch(url, { ...options, signal, mode: "cors" });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} @ ${url} ${body ? `| body: ${body.slice(0,200)}` : ""}`);
      }
      // Some endpoints may return text/plain (defensive)
      const ctype = res.headers.get("content-type") || "";
      if (!ctype.includes("application/json")) {
        const txt = await res.text();
        try { return JSON.parse(txt); } catch { return { text: txt }; }
      }
      return res.json();
    }), timeoutMs, `fetch ${url}`);
    return run;
  }

  // ---------- Sticky API base selection ----------
  function readStickyBase() {
    try {
      const base = localStorage.getItem(BASE_KEY);
      const ts = Number(localStorage.getItem(BASE_TS_KEY) || "0");
      if (base && Date.now() - ts < BASE_TTL_MS) return base;
    } catch {}
    return null;
  }

  function writeStickyBase(base) {
    try {
      localStorage.setItem(BASE_KEY, base);
      localStorage.setItem(BASE_TS_KEY, Date.now().toString());
    } catch {}
  }

  async function healthOK(apiBase) {
    try {
      // Use GET so Azure returns CORS headers on actual route
      await fetchJSON(`${apiBase}/health`, {}, 3000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Decide which base to use:
   * - If the page is local → try LOCAL, then PROD.
   * - If the page is remote (GitHub Pages) → use PROD only,
   *   unless ?allowLocal=1 is present (then we try LOCAL, then PROD).
   * The result is cached for BASE_TTL_MS.
   */
  async function resolveApiBase() {
    const cached = readStickyBase();
    if (cached) return cached;

    if (isLocalPage) {
      const order = [LOCAL_API, PROD_API];
      for (const base of order) {
        if (await healthOK(base)) {
          console.info(`✅ API base selected: ${base}`);
          writeStickyBase(base);
          return base;
        }
      }
    } else {
      // Remote page: default to PROD only (no localhost probing)
      if (await healthOK(PROD_API)) {
        console.info(`✅ API base selected: ${PROD_API}`);
        writeStickyBase(PROD_API);
        return PROD_API;
      }
      if (allowLocalFromProd) {
        console.warn("⚠️ PROD unavailable; trying LOCAL due to ?allowLocal=1 …");
        if (await healthOK(LOCAL_API)) {
          console.info(`✅ API base selected (override): ${LOCAL_API}`);
          writeStickyBase(LOCAL_API);
          return LOCAL_API;
        }
      }
    }

    // If we get here, nothing is reachable
    console.error("❌ No API base reachable (health checks failed).");
    throw new Error("No API base reachable");
  }

  // Single entry to call the API with sticky base
  async function apiFetch(endpoint, options = {}, timeoutMs = 10000) {
    const base = await resolveApiBase();
    try {
      return await fetchJSON(`${base}${endpoint}`, options, timeoutMs);
    } catch (err) {
      // If it failed, we can optionally invalidate the sticky base on 5xx
      // but keep it sticky for transient network errors.
      const msg = String(err || "");
      const isLikelyServerDown = /HTTP 5\d\d|Failed to fetch|NetworkError|TypeError|abort/i.test(msg);
      if (isLikelyServerDown) {
        console.warn(`⚠️ API base ${base} failed. Will re-check on next call.`);
        // So the next call will re-run health probes
        try { localStorage.removeItem(BASE_KEY); localStorage.removeItem(BASE_TS_KEY); } catch {}
      }
      throw err;
    }
  }

  // ---------- About Me Generator ----------
  async function loadAboutMe() {
    const loader = document.getElementById("loader_me");
    const output = document.getElementById("about-ai-output");

    const CACHE_KEY = "about-orb-output";
    const CACHE_TIME_KEY = "about-orb-timestamp";
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cached && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
      output.textContent = cached;
      loader && loader.setAttribute("aria-hidden", "true");
      fadeIn(output);
      return;
    }

    loader && loader.removeAttribute("aria-hidden");
    output.textContent = "";

    try {
      const data = await apiFetch("/generate-aboutOrb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context:
            "Use a tone that blends confidence, fun, and curiosity. Mention my creative writing, tech projects, service background, and passion for equitable code and accessibility."
        })
      }, 12000);

      const aboutText = data?.about_text || data?.about || "No content available.";
      output.textContent = aboutText;
      fadeIn(output);
      localStorage.setItem(CACHE_KEY, aboutText);
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (err) {
      console.error("❌ Error fetching About Me:", err);
      output.textContent =
        "⚠️ Sorry—our API is currently unavailable. Please try again in a bit.";
    } finally {
      loader && loader.setAttribute("aria-hidden", "true");
    }
  }

  // ---------- Carousel Loader ----------
  async function fetchCarouselImages() {
    const carousel = document.getElementById("carousel-track");
    const loader = document.getElementById("loader_carousel");
    const CACHE_KEY = "about-carousel-images";
    const CACHE_TIME_KEY = "about-carousel-timestamp";

    if (!carousel) {
      console.warn("⚠️ Carousel container not found (#carousel-track missing).");
      return [];
    }

    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
      const images = JSON.parse(cached);
      renderCarouselImages(images);
      loader && loader.setAttribute("aria-hidden", "true");
      return images;
    }

    while (carousel.firstChild) carousel.removeChild(carousel.firstChild);
    loader && loader.removeAttribute("aria-hidden");
    for (let i = 0; i < 4; i++) carousel.appendChild(createShimmer());

    try {
      const images = await apiFetch("/aboutMe_photos", {}, 10000);
      if (Array.isArray(images)) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(images));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        renderCarouselImages(images);
        return images;
      }
      throw new Error("Invalid image response");
    } catch (err) {
      console.error("❌ Error fetching aboutMe photos:", err);
      carousel.replaceChildren(
        document.createTextNode("⚠️ Images unavailable right now.")
      );
      return [];
    } finally {
      loader && loader.setAttribute("aria-hidden", "true");
    }
  }

  function renderCarouselImages(images = []) {
    const carousel = document.getElementById("carousel-track");
    if (!carousel) return;
    if (!images.length) {
      carousel.replaceChildren(document.createTextNode("No images found."));
      return;
    }
    const imgs = images.map((imgData, i) => {
      const img = document.createElement("img");
      img.src = imgData.url;
      img.alt = imgData.name || `About image ${i + 1}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.classList.add("carousel-img");
      img.tabIndex = 0;
      img.addEventListener("load", () => img.classList.add("fade-in"));
      img.addEventListener("error", () => img.classList.add("error-img"));
      return img;
    });
    carousel.replaceChildren(...imgs);
    fadeIn(carousel);
    console.info(`✅ Carousel loaded ${imgs.length} image(s)`);
  }

  // ---------- Carousel Controls (unchanged) ----------
  function initCarouselControls() {
    const carousel = document.querySelector(".about-carousel");
    const btnPrev = document.querySelector(".carousel-btn.prev");
    const btnNext = document.querySelector(".carousel-btn.next");

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
      const wrapper = carousel.parentElement || document.body;
      wrapper.appendChild(liveRegion);
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

    const smoothScroll = (direction) => {
      if (!carousel) return;
      if (!images.length) refreshImagesList();
      if (!images.length) return;
      const scrollAmount = Math.max(200, Math.floor(carousel.clientWidth * 0.35));
      carousel.scrollBy({ left: direction === "next" ? scrollAmount : -scrollAmount, behavior: "smooth" });
      currentIndex = direction === "next" ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
      updateAriaStatus();
    };

    btnPrev.addEventListener("click", () => smoothScroll("prev"));
    btnNext.addEventListener("click", () => smoothScroll("next"));

    const togglePause = (explicitPaused) => {
      isPaused = typeof explicitPaused === "boolean" ? explicitPaused : !isPaused;
      if (btnPause) {
        btnPause.setAttribute("aria-pressed", String(isPaused));
        btnPause.innerText = isPaused ? "Resume" : "Pause";
        btnPause.setAttribute("aria-label", isPaused ? "Resume carousel" : "Pause carousel");
      }
      if (isPaused) stopAutoScroll(); else startAutoScroll();
    };

    btnPause.addEventListener("click", () => togglePause());

    document.addEventListener("keydown", (e) => {
      const active = document.activeElement;
      const inCarousel = active && typeof active.closest === "function" && active.closest(".about-carousel");
      if (inCarousel || active === document.body) {
        if (e.key === "ArrowLeft" || e.key === "Left") smoothScroll("prev");
        if (e.key === "ArrowRight" || e.key === "Right") smoothScroll("next");
        if (e.code === "Space") { e.preventDefault(); togglePause(); }
      }
    });

    const startAutoScroll = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      if (!images.length) refreshImagesList();
      if (!images.length) return;
      scrollInterval = setInterval(() => { if (!isPaused) smoothScroll("next"); }, 5000);
    };
    const stopAutoScroll = () => { if (scrollInterval) { clearInterval(scrollInterval); scrollInterval = null; } };

    carousel.addEventListener("mouseenter", () => { if (!isPaused) togglePause(true); });
    carousel.addEventListener("mouseleave", () => { if (btnPause && btnPause.getAttribute("aria-pressed") === "false") togglePause(false); });

    setTimeout(() => {
      refreshImagesList();
      if (images.length) {
        images.forEach((img) => { img.tabIndex = 0; });
        currentIndex = 0;
        updateAriaStatus();
        startAutoScroll();
      } else {
        console.info("ℹ️ No carousel images available at initialization.");
      }
    }, 300);

    console.info("🎠 Carousel controls + accessibility initialized.");
  }

  // ---------- DOM Ready ----------
  document.addEventListener("DOMContentLoaded", async () => {
    try { loadAboutMe(); } catch (e) { console.warn("loadAboutMe problem:", e); }
    try { await fetchCarouselImages(); } catch (e) { console.warn("fetchCarouselImages failed:", e); }
    try { if (typeof initCarouselControls === "function") initCarouselControls(); } catch (e) { console.error("initCarouselControls failed:", e); }
  });
})();
