// Using Fetch to render markdown from GitHub (raw).
// Parse via marked.js, sanitize via DOMPurify with Trusted Types enabled.
// Behaviors:
// - toggle-be2 (Sandbox Notes) shows sandbox subnav + renders into #markdown-sandbox
// - sandbox sub-buttons hidden unless Sandbox is active
// - Network button reveals child buttons (CD/Web) only when selected
// - Leaving Sandbox hides sandbox UI + collapses children + clears pressed states

document.addEventListener("DOMContentLoaded", () => {
  // Main Toggle Buttons
  const btnCyber = document.getElementById("toggle-be1");
  const btnSandbox = document.getElementById("toggle-be2");

  // Markdown sections
  const cyberContainer = document.getElementById("markdown-be1");
  const sandboxContainer = document.getElementById("markdown-sandbox"); // NEW stable target

  // Sandbox UI Containers
  const sandboxSubnav = document.getElementById("sandbox-subnav");
  const networkChildren = document.getElementById("sandbox-network-children");

  // Sandbox Buttons
  const servicesBtn = document.getElementById("sandbox-services-btn");
  const networkBtn = document.getElementById("sandbox-network-btn");
  const pcapBtn = document.getElementById("sandbox-pcap-btn");

  // Network Child Buttons
  const cdBtn = document.getElementById("sandbox-network-cd-btn");
  const webBtn = document.getElementById("sandbox-network-web-btn");

  // Live Region
  const sandboxStatus = document.getElementById("sandbox-subnav-status");

  // Guardrails
  if (!btnCyber || !btnSandbox || !cyberContainer || !sandboxContainer) {
    console.warn("CyberCuriosity: Missing required main elements.");
    return;
  }

  // URLs to Fetch
  const URLS = {
    cyber: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/CSP_Readme.md",

    sandboxHome: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/nmap.md",
    services: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/Services.md",
    pcap: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/PacketCapture.md",

    networkCD: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/MacATron.md",
    networkWeb: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/WebHttpHttps.md",
  };

  // Cache: store sanitized HTML so switching buttons doesn't require refetch
  const cache = new Map();

  function announce(msg) {
    if (sandboxStatus) sandboxStatus.textContent = msg;
  }

  async function loadMarkdown(url, container) {
    if (!url || !container) return;

    // Serve from cache if available
    if (cache.has(url)) {
      container.innerHTML = cache.get(url);
      return;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
      const md = await res.text();

      const rawHtml = marked.parse(md);
      const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });

      container.innerHTML = cleanHtml;
      cache.set(url, cleanHtml);
    } catch (err) {
      console.error("Error fetching markdown:", err);
      container.textContent = "Failed to load content.";
    }
  }

  // State helpers

  function clearPressedStates() {
    const allBtns = [servicesBtn, networkBtn, pcapBtn, cdBtn, webBtn].filter(Boolean);
    allBtns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
  }

  function setActiveButton(activeBtn, group) {
    group.filter(Boolean).forEach((b) => {
      const isActive = b === activeBtn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });
  }

  function collapseNetworkChildren() {
    if (networkChildren) networkChildren.hidden = true;
    // Don't force networkBtn, inactive here; it may remain selected when children are open.
  }

  // Mode switching

  async function showCyberMode({ scroll = true } = {}) {
    // Toggle ARIA
    btnCyber.setAttribute("aria-pressed", "true");
    btnSandbox.setAttribute("aria-pressed", "false");
    btnCyber.classList.add("is-active");
    btnSandbox.classList.remove("is-active");

    // Show/hide containers
    cyberContainer.hidden = false;
    sandboxContainer.hidden = true;

    // Hide sandbox UI
    if (sandboxSubnav) sandboxSubnav.hidden = true;
    if (networkChildren) networkChildren.hidden = true;

    // Clear sandbox states
    clearPressedStates();
    announce("");

    // Load cyber content
    await loadMarkdown(URLS.cyber, cyberContainer);

    if (scroll) cyberContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function showSandboxMode({ scroll = true } = {}) {
    // Toggle ARIA
    btnCyber.setAttribute("aria-pressed", "false");
    btnSandbox.setAttribute("aria-pressed", "true");
    btnCyber.classList.remove("is-active");
    btnSandbox.classList.add("is-active");

    // show #sandbox-subnav
    // hide #markdown-be1
    // show #markdown-sandbox
    if (sandboxSubnav) sandboxSubnav.hidden = false;
    cyberContainer.hidden = true;
    sandboxContainer.hidden = false;

    // Default: collapse network children + clear pressed
    if (networkChildren) networkChildren.hidden = true;
    clearPressedStates();

    // Load sandbox home by default
    await loadMarkdown(URLS.sandboxHome, sandboxContainer);
    announce("Loaded: Sandbox Notes");

    if (scroll) sandboxContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Sandbox button actions

  servicesBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (sandboxContainer.hidden) return;

    // selecting Services collapses Network children
    collapseNetworkChildren();

    setActiveButton(servicesBtn, [servicesBtn, networkBtn, pcapBtn]);
    setActiveButton(null, [cdBtn, webBtn]);

    await loadMarkdown(URLS.services, sandboxContainer);
    announce("Loaded: Services");
    sandboxContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  networkBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (sandboxContainer.hidden) return;

    // Toggle children visibility
    if (!networkChildren) return;
    const willShow = networkChildren.hidden;
    networkChildren.hidden = !willShow;

    // Network is the active parent selection
    setActiveButton(networkBtn, [servicesBtn, networkBtn, pcapBtn]);

    // When opening, don't force a render to unhide children
    // Clear child selection when toggling open
    if (willShow) setActiveButton(null, [cdBtn, webBtn]);

    announce(willShow ? "Network sub-sections expanded." : "Network sub-sections collapsed.");
  });

  cdBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (sandboxContainer.hidden) return;

    // Parent stays active, child becomes active
    setActiveButton(networkBtn, [servicesBtn, networkBtn, pcapBtn]);
    setActiveButton(cdBtn, [cdBtn, webBtn]);

    await loadMarkdown(URLS.networkCD, sandboxContainer);
    announce("Loaded: Network — Cellular Device");
    sandboxContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  webBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (sandboxContainer.hidden) return;

    setActiveButton(networkBtn, [servicesBtn, networkBtn, pcapBtn]);
    setActiveButton(webBtn, [cdBtn, webBtn]);

    await loadMarkdown(URLS.networkWeb, sandboxContainer);
    announce("Loaded: Network — Web HTTP/HTTPS");
    sandboxContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  pcapBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (sandboxContainer.hidden) return;

    // selecting PC collapses Network children
    collapseNetworkChildren();

    setActiveButton(pcapBtn, [servicesBtn, networkBtn, pcapBtn]);
    setActiveButton(null, [cdBtn, webBtn]);

    await loadMarkdown(URLS.pcap, sandboxContainer);
    announce("Loaded: Packet Capture");
    sandboxContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Main toggle wiring

  btnCyber.addEventListener("click", (e) => {
    e.preventDefault();
    showCyberMode();
  });

  btnSandbox.addEventListener("click", (e) => {
    e.preventDefault();
    showSandboxMode();
  });

  // Boot
  // Default to Cyber mode on load
  showCyberMode({ scroll: false });
});
