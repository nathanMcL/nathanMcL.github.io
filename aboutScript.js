// =============================== 
// MacN About Page Script (Patched 10/2025)
// ===============================

(() => {
  "use strict";

  // ---------- Config ----------
  const LOCAL_API = "http://127.0.0.1:5000";
  const PROD_API = "https://macn-about-api.azurewebsites.net";
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

  // ---------- Utilities ----------
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

  // Debounce helper (kept for possible future UI events)
  function debounce(fn, delay = 400) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ---------- API Helpers ----------
  async function tryFetch(apiBase, endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s safeguard
    try {
      const res = await fetch(`${apiBase}${endpoint}`, {
        ...options,
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} @ ${apiBase}${endpoint}`);
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * smartFetch: Try local first, fall back to PROD if anything goes wrong.
   * This is intentionally broad because I prefer serving content from PROD
   * rather than letting the client show errors when local is flaky.
   */
  async function smartFetch(endpoint, options = {}) {
    try {
      const local = await tryFetch(LOCAL_API, endpoint, options);
      console.info(`✅ Loaded from LOCAL API: ${endpoint}`);
      return local;
    } catch (errLocal) {
      console.warn(`⚠️ Local API failed (${String(errLocal)}). Attempting PROD...`);
      try {
        const prod = await tryFetch(PROD_API, endpoint, options);
        console.info(`✅ Loaded from AZURE API: ${endpoint}`);
        return prod;
      } catch (errProd) {
        console.error(`❌ Both Local and Azure failed for ${endpoint}`, errProd);
        // Throw the prod error (more relevant to surface to caller)
        throw errProd;
      }
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

    // Use cached version if still valid
    if (cached && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
      output.textContent = cached;
      loader && loader.setAttribute("aria-hidden", "true");
      fadeIn(output);
      return;
    }

    loader && loader.removeAttribute("aria-hidden");
    output.textContent = "";

    try {
      const data = await smartFetch("/generate-aboutOrb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context:
            "Use a tone that blends confidence, fun, and curiosity. Mention my creative writing, tech projects, service background, and passion for equitable code and accessibility."
        })
      });

      const aboutText = data?.about_text || data?.about || "No content available.";
      output.textContent = aboutText;
      fadeIn(output);

      // Cache success
      localStorage.setItem(CACHE_KEY, aboutText);
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (err) {
      console.error("❌ Error fetching About Me:", err);
      output.textContent = "⚠️ Error loading About Me content.";
    } finally {
      loader && loader.setAttribute("aria-hidden", "true");
    }
  }

  // ---------- Carousel Loader (CSP + Accessibility Safe) ----------
  async function fetchCarouselImages() {
    const carousel = document.getElementById("carousel-track");
    const loader = document.getElementById("loader_carousel");
    const CACHE_KEY = "about-carousel-images";
    const CACHE_TIME_KEY = "about-carousel-timestamp";

    if (!carousel) {
      console.warn("⚠️ Carousel container not found (#carousel-track missing).");
      return [];
    }

    // Check cached images first
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    if (cached && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
      const images = JSON.parse(cached);
      renderCarouselImages(images);
      loader && loader.setAttribute("aria-hidden", "true");
      return images;
    }

    // Show shimmer placeholders
    while (carousel.firstChild) carousel.removeChild(carousel.firstChild);
    loader && loader.removeAttribute("aria-hidden");
    for (let i = 0; i < 4; i++) carousel.appendChild(createShimmer());

    try {
      const images = await smartFetch("/aboutMe_photos");
      if (Array.isArray(images)) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(images));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        renderCarouselImages(images);
        return images;
      } else {
        throw new Error("Invalid image response");
      }
    } catch (err) {
      console.error("❌ Error fetching aboutMe photos:", err);
      carousel.replaceChildren(document.createTextNode("⚠️ Error loading images."));
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
    // Make sure the container is a single row scroll area (CSS controls layout)
    carousel.replaceChildren(...imgs);
    fadeIn(carousel);

    console.info(`✅ Carousel loaded ${imgs.length} image(s)`);
  }

  // ---------- Carousel Navigation (Left/Right + Keyboard + Pause + Accessibility) ----------
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

    // Add ARIA live region (screen-reader only)
    let liveRegion = document.getElementById("carousel-status");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "carousel-status";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.classList.add("sr-only");
      // append to the carousel wrapper (safe place)
      const wrapper = carousel.parentElement || document.body;
      wrapper.appendChild(liveRegion);
    }

    // Create Pause/Resume button (accessible) if not present
    let btnPause = document.querySelector(".carousel-btn.pause");
    if (!btnPause) {
      btnPause = document.createElement("button");
      btnPause.className = "carousel-btn pause";
      btnPause.setAttribute("aria-pressed", "false");
      btnPause.setAttribute("aria-label", "Pause carousel");
      btnPause.type = "button";
      btnPause.innerText = "Pause";
      const ctrl = document.querySelector(".carousel-controls");
      if (ctrl) {
        ctrl.insertBefore(btnPause, btnNext);
      } else {
        carousel.parentElement.appendChild(btnPause);
      }
    }

    // Helper: build images list if empty
    const refreshImagesList = () => {
      images = Array.from(carousel.querySelectorAll("img.carousel-img"));
    };

    // Helper: update ARIA feedback & focus
    const updateAriaStatus = () => {
      if (!images.length) refreshImagesList();
      if (images.length) {
        const img = images[currentIndex];
        if (img) {
          images.forEach((el) => el.classList.remove("focused-img"));
          img.classList.add("focused-img");
          try { img.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
          liveRegion.textContent = `Now viewing image ${currentIndex + 1} of ${images.length}`;
        }
      }
    };

    // Smooth scroll helper
    const smoothScroll = (direction) => {
      if (!carousel) return;
      if (!images.length) refreshImagesList();
      if (!images.length) return;
      const scrollAmount = Math.max(200, Math.floor(carousel.clientWidth * 0.35)); // responsive px
      carousel.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });

      // Update focus index
      if (direction === "next") {
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      updateAriaStatus();
    };

    // Button click handlers
    btnPrev.addEventListener("click", () => smoothScroll("prev"));
    btnNext.addEventListener("click", () => smoothScroll("next"));

    // Pause/Resume click handler (keeps aria-pressed accurate)
    const togglePause = (explicitPaused) => {
      isPaused = typeof explicitPaused === "boolean" ? explicitPaused : !isPaused;
      if (btnPause) {
        btnPause.setAttribute("aria-pressed", String(isPaused));
        btnPause.innerText = isPaused ? "Resume" : "Pause";
        btnPause.setAttribute("aria-label", isPaused ? "Resume carousel" : "Pause carousel");
      }
      if (isPaused) stopAutoScroll();
      else startAutoScroll();
    };

    btnPause.addEventListener("click", () => togglePause());

    // Keyboard navigation (← → arrows, Space to pause)
    document.addEventListener("keydown", (e) => {
      const active = document.activeElement;
      const inCarousel = active && typeof active.closest === "function" && active.closest(".about-carousel");
      if (inCarousel || active === document.body) {
        if (e.key === "ArrowLeft" || e.key === "Left") smoothScroll("prev");
        if (e.key === "ArrowRight" || e.key === "Right") smoothScroll("next");
        if (e.code === "Space") {
          e.preventDefault();
          togglePause();
          console.log(isPaused ? "⏸️ Carousel paused" : "▶️ Carousel resumed");
        }
      }
    });

    // Auto-scroll + Pause on hover
    const startAutoScroll = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      // only start when images exist
      if (!images.length) refreshImagesList();
      if (!images.length) return;
      scrollInterval = setInterval(() => {
        if (!isPaused) smoothScroll("next");
      }, 5000);
    };
    const stopAutoScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    };

    carousel.addEventListener("mouseenter", () => {
      // pause on hover but do not override an explicit user pause
      if (!isPaused) {
        togglePause(true);
      }
    });
    carousel.addEventListener("mouseleave", () => {
      // only resume if the user didn't explicitly pause (aria-pressed === "false")
      if (btnPause && btnPause.getAttribute("aria-pressed") === "false") {
        togglePause(false);
      }
    });

    // Initialize images after a short delay to allow render
    setTimeout(() => {
      refreshImagesList();
      if (images.length) {
        images.forEach((img) => { img.tabIndex = 0; });
        currentIndex = 0;
        updateAriaStatus();
        startAutoScroll();
      } else {
        // No images found — still safe to call startAutoScroll (it will not start)
        console.info("ℹ️ No carousel images available at initialization.");
      }
    }, 300);

    console.info("🎠 Carousel controls + accessibility initialized.");
  }

  // ---------- DOM Ready ----------
  document.addEventListener("DOMContentLoaded", async () => {
    // Fire-and-forget the about me loader (not critical for carousel init)
    try {
      loadAboutMe();
    } catch (e) {
      console.warn("⚠️ loadAboutMe problem:", e);
    }

    // Ensure carousel images are fetched before initializing controls
    try {
      await fetchCarouselImages();
    } catch (e) {
      console.warn("⚠️ fetchCarouselImages failed:", e);
    }

    // Initialize controls after images loaded (or after error)
    try {
      initCarouselControls();
    } catch (e) {
      console.error("❌ initCarouselControls failed:", e);
    }
  });
})();
