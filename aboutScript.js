// ===============================
// MacN About Page Script
// ===============================

// ---------- Marquee ----------
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const marqueeElementsDisplayed = parseInt(
    getComputedStyle(root).getPropertyValue("--marquee-elements-displayed"),
    10
  );
  const marqueeContent = document.querySelector("ul.marquee-content");

  if (marqueeContent) {
    const marqueeElements = marqueeContent.children.length;
    root.style.setProperty("--marquee-elements", marqueeElements);

    for (let i = 0; i < marqueeElementsDisplayed; i++) {
      marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
    }
  }
});

// ---------- Orbs ----------
let animationId;
let isGridView = false;
let main, footer;

// NEW: Overlay element reference
let overlay;

const orbs = [
  { id: "orb_me", dx: 2, dy: 2 },
  { id: "orb_services", dx: -2, dy: 1.5 },
  { id: "orb_things", dx: 3, dy: 2.5 },
  { id: "orb_smile", dx: -3, dy: 1.75 }
];

document.addEventListener("DOMContentLoaded", () => {
  main = document.querySelector("main");
  footer = document.querySelector("footer");
  overlay = document.createElement("div");          // NEW
  overlay.className = "popup-overlay";              // NEW
  overlay.setAttribute("aria-hidden", "true");      // NEW
  document.body.appendChild(overlay);               // NEW

  const toggle = document.getElementById("orbToggleSlide");

  if (!main) {
    console.error("❌ Main section not found.");
    return;
  }

  initializeOrbs();
  animationId = requestAnimationFrame(moveOrbs);

  // Toggle grid mode
  toggle?.addEventListener("change", function () {
    isGridView = this.checked;
    if (isGridView) {
      cancelAnimationFrame(animationId);
      applyGridLayout();
    } else {
      location.reload();
    }
  });

  // Orb → Popup open
  orbs.forEach(({ id }) => {
    const orb = document.getElementById(id);
    const key = id.split("_")[1];
    orb?.addEventListener("click", () => {
      openPopup(`popup_${key}`);
    });
  });

  // Close buttons
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      closePopup(btn.dataset.popup);
    });
  });

  // Close on background click
  document.querySelectorAll(".orb-popup").forEach((popup) => {
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopup(popup.id);
    });
  });

  // Close on overlay click (NEW)
  overlay.addEventListener("click", () => {
    document.querySelectorAll(".orb-popup.active").forEach((popup) => {
      closePopup(popup.id);
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".orb-popup.active").forEach((popup) => {
        closePopup(popup.id);
      });
    }
  });
});

// ---------- Popup Handling ----------
function openPopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.add("active");

  // NEW: Show overlay
  overlay.classList.add("active");

  // Focus trap
  const focusable = popup.querySelectorAll("button, [href], input, select, textarea");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first?.focus();

  popup.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.remove("active");

  // NEW: Hide overlay if no other popup open
  const stillOpen = document.querySelectorAll(".orb-popup.active").length > 0;
  if (!stillOpen) overlay.classList.remove("active");
}

// ---------- Orb Movement ----------
function initializeOrbs() {
  const mainRect = main.getBoundingClientRect();

  orbs.forEach((orbObj, index) => {
    const orb = document.getElementById(orbObj.id);
    if (!orb) return;

    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 50) {
      const x = Math.random() * (mainRect.width - 100);
      const y = Math.random() * (mainRect.height - 100);
      placed = orbs.every((other, i) => {
        if (i === index) return true;
        const otherOrb = document.getElementById(other.id);
        if (!otherOrb) return true;
        const dx = x - otherOrb.offsetLeft;
        const dy = y - otherOrb.offsetTop;
        return Math.sqrt(dx * dx + dy * dy) > 120;
      });
      if (placed) {
        orb.style.left = `${x}px`;
        orb.style.top = `${y}px`;
      }
      attempts++;
    }
  });
}

function moveOrbs() {
  orbs.forEach((orbObj, index) => {
    const orb = document.getElementById(orbObj.id);
    if (!orb) return;

    let newLeft = orb.offsetLeft + orbObj.dx;
    let newTop = orb.offsetTop + orbObj.dy;

    if (newLeft <= 0 || newLeft + orb.clientWidth >= main.clientWidth) {
      orbObj.dx *= -1;
      newLeft = Math.max(0, Math.min(main.clientWidth - orb.clientWidth, newLeft));
    }
    if (newTop <= 0 || newTop + orb.clientHeight >= main.clientHeight) {
      orbObj.dy *= -1;
      newTop = Math.max(0, Math.min(main.clientHeight - orb.clientHeight, newTop));
    }

    orb.style.left = `${newLeft}px`;
    orb.style.top = `${newTop}px`;

    // Orb collision detection
    orbs.forEach((otherOrb, otherIndex) => {
      if (index !== otherIndex) {
        const other = document.getElementById(otherOrb.id);
        if (!other) return;
        const dx = orb.offsetLeft - other.offsetLeft;
        const dy = orb.offsetTop - other.offsetTop;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < orb.clientWidth) {
          [orbObj.dx, otherOrb.dx] = [otherOrb.dx, orbObj.dx];
          [orbObj.dy, otherOrb.dy] = [otherOrb.dy, orbObj.dy];
        }
      }
    });
  });

  animationId = requestAnimationFrame(moveOrbs);
}

// ---------- Grid Layout ----------
function applyGridLayout() {
  const orbElements = document.querySelectorAll(".bouncing-orb");
  const totalOrbs = orbElements.length;
  const columns = Math.ceil(Math.sqrt(totalOrbs));
  const rows = Math.ceil(totalOrbs / columns);
  const spacingX = main.clientWidth / columns;
  const spacingY = main.clientHeight / rows;

  orbElements.forEach((orb, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    orb.style.transition = "all 0.4s ease";
    orb.style.left = `${spacingX * col + spacingX / 2 - orb.clientWidth / 2}px`;
    orb.style.top = `${spacingY * row + spacingY / 2 - orb.clientHeight / 2}px`;
    orb.classList.add("grid-effect");
  });
}

// ---------- Popup Handling ----------
function openPopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.add("active");

  // Focus trap
  const focusable = popup.querySelectorAll("button, [href], input, select, textarea");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first?.focus();

  popup.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (!popup) return;
  popup.classList.remove("active");
}

// ---------- API Integration ----------
const API_BASE =
  window.location.hostname === "nathanmcl.github.io"
    ? "https://macn-about-api.azurewebsites.net"
    : "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", () => {
  const orbMe = document.getElementById("orb_me");
  if (!orbMe) return;

  orbMe.addEventListener("click", async () => {
    const popup = document.getElementById("popup_me");
    const loader = document.getElementById("loader_me");
    const output = document.getElementById("about-orb-output");

    if (!popup) return;

    loader.style.display = "block";
    output.textContent = "";

    // ===== TTL Cache Setup =====
    const CACHE_KEY = "about-orb-output";
    const CACHE_TIME_KEY = "about-orb-timestamp";
    const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL (Timer if someone hammers at the API)

    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cached && cachedTime && Date.now() - Number(cachedTime) < CACHE_TTL_MS) {
      // Serve from cache if fresh
      output.textContent = cached;
      loader.style.display = "none";
      return;
    }

    // ===== Fresh Request =====
    try {
      const res = await fetch(`${API_BASE}/generate-aboutOrb`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context:
            "Use a tone that blends confidence, fun, and curiosity. Mention my creative writing, tech projects, military background, and passion for equitable code and accessibility."
        })
      });

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      const aboutText = data.about_text || "Could not load About Me.";

      output.textContent = aboutText;

      // Cache with timestamp
      localStorage.setItem(CACHE_KEY, aboutText);
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (err) {
      output.textContent = "Error loading About Me.";
      console.error("❌ Fetch error:", err);
    } finally {
      loader.style.display = "none";
    }
  });
});

