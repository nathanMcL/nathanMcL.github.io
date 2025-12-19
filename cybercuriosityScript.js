// Using Fetch to render the markdown file from my GitHub repository
// Once the markdown is fetched, we parse it to HTML using marked.js
// Because the need to harden the digital content it is also important update the code to meet the updated CSP.
// Referring to the Policy for the CSP.
// Purify the DOM by sanitizing the markdown content.

document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.getElementById("toggle-be1"); // Cyber Thoughts
  const btn2 = document.getElementById("toggle-be2"); // Sandbox Notes
  const section1 = document.getElementById("markdown-be1");
  const section2 = document.getElementById("markdown-be2");

  if (!btn1 || !btn2 || !section1 || !section2) {
    console.warn("CyberCuriosity page: missing buttons or markdown containers.", {
      btn1: !!btn1,
      btn2: !!btn2,
      section1: !!section1,
      section2: !!section2,
    });
    return;
  }

  function loadMarkdown(url, container) {
    fetch(url)
      .then((response) => response.text())
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

  function addCybercuriosityStylesheet() {
    if (!document.getElementById("cybercuriosityStyles-style")) {
      const link = document.createElement("link");
      link.id = "cybercuriosityStyles-style";
      link.rel = "stylesheet";
      link.href = "cybercuriosityStyles.css";
      document.head.appendChild(link);
    }
  }

  function removeCybercuriosityStylesheet() {
    // ✅ FIX: remove the correct stylesheet id
    const link = document.getElementById("cybercuriosityStyles-style");
    if (link) link.remove();
  }

  /* ----------------------------
     Initial State (Tab 1 active)
     ---------------------------- */

  loadMarkdown(
    "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/CSP_Readme.md",
    section1
  );

  section1.hidden = false;
  section2.hidden = true;

  /* ----------------------------
     Tab Switch Helpers
     ---------------------------- */

  function showCyberThoughts() {
    section1.hidden = false;
    section2.hidden = true;

    // Sandbox-only CSS should be OFF for tab 1
    removeCybercuriosityStylesheet();

    section1.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showSandboxNotes() {
    section1.hidden = true;
    section2.hidden = false;

    // Load once
    if (!section2.hasChildNodes()) {
      loadMarkdown(
        "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/nmap.md",
        section2
      );
    }

    // Sandbox-only CSS ON for tab 2
    addCybercuriosityStylesheet();

    section2.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ----------------------------
     Event Listeners
     ---------------------------- */

  btn1.addEventListener("click", (e) => {
    e.preventDefault();
    showCyberThoughts();
  });

  btn2.addEventListener("click", (e) => {
    e.preventDefault();
    showSandboxNotes();
  });
});
