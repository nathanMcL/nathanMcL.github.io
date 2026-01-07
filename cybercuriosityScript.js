// Using Fetch to render the markdown file from my GitHub repository
// Once the markdown is fetched, we parse it to HTML using marked.js
// Then sanitize with DOMPurify (Trusted Types enabled) to harden against injection.

document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.getElementById("toggle-be1"); // Cyber Thoughts
  const btn2 = document.getElementById("toggle-be2"); // Sandbox Notes
  const section1 = document.getElementById("markdown-be1");
  const section2 = document.getElementById("markdown-be2");

  if (!btn1 || !btn2 || !section1 || !section2) {
    console.warn("CyberCuriosity: Missing buttons or markdown sections.");
    return;
  }

  const URL_CYBER =
    "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/CSP_Readme.md";
  const URL_SANDBOX =
    "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/nmap.md";

  // Track whether we've loaded each markdown file yet
  let cyberLoaded = false;
  let sandboxLoaded = false;

  function loadMarkdown(url, container) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} while fetching ${url}`);
        }
        return response.text();
      })
      .then((md) => {
        const rawHtml = marked.parse(md);

        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });

        container.innerHTML = cleanHtml;
      })
      .catch((err) => {
        console.error("Error fetching markdown:", err);
        container.textContent = "Failed to load content.";
      });
  }

  /**
   * Sync ARIA + visual state + body mode.
   * Uses ONE class: .is-active (so CSS can be simple and consistent).
   */
  function setToggleState(activeButton) {
    const isSandbox = activeButton === btn2;

    // ARIA pressed state (true for active, false for inactive)
    btn1.setAttribute("aria-pressed", String(activeButton === btn1));
    btn2.setAttribute("aria-pressed", String(activeButton === btn2));

    // Visual active class
    btn1.classList.toggle("is-active", activeButton === btn1);
    btn2.classList.toggle("is-active", activeButton === btn2);

    // Page mode
    document.body.classList.toggle("sandbox-mode", isSandbox);
  }

  function showSection1({ scroll = true } = {}) {
    section1.hidden = false;
    section2.hidden = true;

    setToggleState(btn1);

    // Load Cyber Thoughts if not loaded yet
    if (!cyberLoaded) {
      cyberLoaded = true;
      loadMarkdown(URL_CYBER, section1);
    }

    if (scroll) {
      section1.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function showSection2({ scroll = true } = {}) {
    section1.hidden = true;
    section2.hidden = false;

    setToggleState(btn2);

    // Load Sandbox Notes if not loaded yet
    if (!sandboxLoaded) {
      sandboxLoaded = true;
      loadMarkdown(URL_SANDBOX, section2);
    }

    if (scroll) {
      section2.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /**
   * Initialize state based on DOM:
   * - If section2 is visible, Sandbox is active
   * - Otherwise Cyber is active
   *
   */
  function initFromDOM() {
    const sandboxVisible = section2.hidden === false;
    if (sandboxVisible) {
      showSection2({ scroll: false });
    } else {
      showSection1({ scroll: false });
    }
  }

  btn1.addEventListener("click", (e) => {
    e.preventDefault();
    showSection1();
  });

  btn2.addEventListener("click", (e) => {
    e.preventDefault();
    showSection2();
  });

  // ---- Boot ----
  // Default to Cyber.
  initFromDOM();
});
