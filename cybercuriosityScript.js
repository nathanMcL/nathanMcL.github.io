// Using Fetch to render the markdown file from my GitHub repository
// Once the markdown is fetched, we parse it to HTML using marked.js
// Then sanitize with DOMPurify (Trusted Types enabled) to harden against injection.

// (01/08/2026.~0900) I have to create chapters or sections for the sandbox notes...
// I am wanting to add addtional buttons but small and round to represent the sub-sections of the sandbox notes.
// I think: When you click on sandbox notes, the smaller buttons appear below the main two buttons (Cyber Thoughts and Sandbox Notes)
// Then you can click on whichever sub-section you want to view.

document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.getElementById("toggle-be1"); // Cyber Thoughts
  const btn2 = document.getElementById("toggle-be2"); // Sandbox Notes
  const section1 = document.getElementById("markdown-be1");
  const section2 = document.getElementById("markdown-be2");

  // Sandbox mini-navigational elements
  const sandboxSubnav = document.getElementById("sandbox-subnav");
  const sandboxStatus = document.getElementById("sandbox-subnav-status");

  const sbSerivces = document.getElementById("sb-services");
  const sbNetwork = document.getElementById("sb-network");
  const sbPcap = document.getElementById("sb-pcap");

  const networkSubnav = this.document.getElementById("sandbox-network-subnav");
  const sbNetworkCD = document.getElementById("sb-network-cd");
  const sbNetworkWeb = document.getElementById("sb-network-web");

  if (!btn1 || !btn2 || !section1 || !section2) {
    console.warn("CyberCuriosity: Missing buttons or markdown sections.");
    return;
  }

  const URLS = {

    cyber: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/CSP_Readme.md",
  
    // Sanbox Top level
    sandboxHome: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/nmap.md",
    services: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/Services.md",
    pcap: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/PacketCapture.md",

    // Network sub-sections
    networkCD: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/MacATron.md",
    networkWeb: "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/WebHttpHttps.md",
  };

  // Track whether we've loaded each markdown file yet
  const loaded = new Set();

  function loadMarkdown(url, container) {
    if (!url || !container) return Promise.resolve();

    // Avoid re-fetching if already loaded once (still allows user to switch views instantly)
    if (loaded.has(url)) return Promise.resolve();

    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${url}`);
        return response.text();
      })
      .then((md) => {
        const rawHtml = marked.parse(md);
        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
        container.innerHTML = cleanHtml;
        loaded.add(url);
      })
      .catch((err) => {
        console.error("Error fetching markdown:", err);
        container.textContent = "Failed to load content.";
      });
  }


  /**
   * Sync ARIA + visual state + body mode.
   * Use class: .is-active (so CSS can be consistent).
   */
  function setToggleState(activeButton) {
    const isSandbox = activeButton === btn2;

    btn1.setAttribute("aria-pressed", String(activeButton === btn1));
    btn2.setAttribute("aria-pressed", String(activeButton === btn2));

    btn1.classList.toggle("is-active", activeButton === btn1);
    btn2.classList.toggle("is-active", activeButton === btn2);

    document.body.classList.toggle("sandbox-mode", isSandbox);

    // Show/hide sandbox subnav when Sandbox mode is active
    if (sandboxSubnav) sandboxSubnav.hidden = !isSandbox;

    // When leaving sandbox mode, collapse network subnav + clear mini active states
    if (!isSandbox) {
      collapseNetworkSubnav();
      setMiniActive(null);
    }
  }

  function showSection1({ scroll = true } = {}) {
    section1.hidden = false;
    section2.hidden = true;

    setToggleState(btn1);

    // Load Cyber Thoughts (once)
    loadMarkdown(URLS.cyber, section1);

    if (scroll) section1.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showSection2({ scroll = true } = {}) {
    section1.hidden = true;
    section2.hidden = false;

    setToggleState(btn2);

    // Default sandbox content (once)
    loadMarkdown(URLS.sandboxHome, section2);

    if (scroll) section2.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Sandbox mini-nav behaviors

  function announce(msg) {
    if (sandboxStatus) sandboxStatus.textContent = msg;
  }

  // Set Mini Active
  function setMiniActive(activeE1) {
    const minis = [sbSerivces, sbNetwork, sbPcap, sbNetworkCD, sbNetworkWeb].filter(Boolean);
    minis.forEach((b) => {
      const isActive = b === activeE1;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });
  }

  // Collapse Network Subnav
  function collapseNetworkSubnav() {
    if (networkSubnav) networkSubnav.hidden = true;
    if (sbNetwork) sbNetwork.setAttribute("aria-pressed", "false");
  }

  // Toggle the Network Subnav
  function toggleNetworkSubnav() {
    if (!networkSubnav) return;
    const nextHidden = !networkSubnav.hidden;
    networkSubnav.hidden = nextHidden;

    // Note: sbNetwork is a "toggle" for showing the nested buttons, not the content itself
    if (sbNetwork) sbNetwork.setAttribute("aria-pressed", String(!nextHidden));

    announce(!nextHidden ? "Network sub-sections expanded." : "Network sub-sections collapsed.");
  }

  async function renderSandboxSubsection(url, label, activeBtn) {
    if (!section2 || section2.hidden) return; // Only load if Sandbox is active
    setMiniActive(activeBtn);
    await loadMarkdown(url, section2);
    announce(`Loaded: ${label}`);
    section2.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Wire mini-buttons if there is a sub-section. Cyber Thoughts currently has none.
  // SandBox Notes currently has three sub-sucetions. 

  // sbServices event listener
  if (sbSerivces) {
    sbSerivces.addEventListener("click", (e) => {
      e.preventDefault();
      collapseNetworkSubnav();
      renderSandboxSubsection(URLS.services, "Services", sbSerivces);
    });
  }

  // sbPcap event listener
  if (sbPcap) {
    sbPcap.addEventListener("click", (e) => {
      e.preventDefault();
      collapseNetworkSubnav();
      renderSandboxSubsection(URLS.pcap, "Packet Capture", sbPcap);
    })
  }

  // sbNetworks event listener
  if (sbNetwork) {
    sbNetwork.addEventListener("click", (e) => {
      e.preventDefault();
      // Toggle (expand/collapse) the nested row under Network
      toggleNetworkSubnav();
      // Highlight the N button when expanded
      if (networkSubnav && !networkSubnav.hidden) setMiniActive(sbNetwork);
      else setMiniActive(null);
    });
  }

  // sbNetworkCD event listener
  if (sbNetworkCD) {
    sbNetworkCD.addEventListener("click", (e) => {
      e.preventDefault();
      renderSandboxSubsection(URLS.sbNetworkCD, "Network: Cellular Device", sbNetworkCD);
    });
  }

  // sbNetworkWeb event listener
  if (sbNetworkWeb) {
    sbNetworkWeb.addEventListener("click", (e) => {
      e.preventDefault();
      renderSandboxSubsection(URLS.networkWeb, "Network: Web HTTP/HTTPS", sbNetworkWeb);
    });
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
