document.addEventListener("DOMContentLoaded", function () {
  const btn1 = document.getElementById("toggle-be1");
  const btn2 = document.getElementById("toggle-be2");

  const section1 = document.getElementById("markdown-be1");
  const section2 = document.getElementById("markdown-be2");

  if (!btn1 || !btn2 || !section1 || !section2) {
    console.warn("Backend page: missing buttons or markdown containers.", {
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
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
          RETURN_TRUSTED_TYPE: true,
        });
        container.innerHTML = cleanHtml;
      })
      .catch((err) => {
        console.error("Error fetching markdown:", err);
        container.textContent = "Failed to load content.";
      });
  }

  function addBackendStylesheet() {
    if (!document.getElementById("backendStyles-style")) {
      const link = document.createElement("link");
      link.id = "backendStyles-style";
      link.rel = "stylesheet";
      link.href = "backendStyles.css";
      document.head.appendChild(link);
    }
  }

  function removeBackendStylesheet() {
    const link = document.getElementById("backendStyles-style");
    if (link) link.remove();
  }

  /* ----------------------------
     Initial State (Tab 1 active)
     ---------------------------- */

  loadMarkdown(
    "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_Readme.md",
    section1
  );

  section1.hidden = false;
  section2.hidden = true;

  /* ----------------------------
     Tab Switch Helpers
     ---------------------------- */

  function showPart1() {
    section1.hidden = false;
    section2.hidden = true;

    removeBackendStylesheet();
    section1.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showPart2() {
    section1.hidden = true;
    section2.hidden = false;

    if (!section2.hasChildNodes()) {
      loadMarkdown(
        "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_ReadMe_troubleshooting.md",
        section2
      );
    }

    addBackendStylesheet();
    section2.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ----------------------------
     Event Listeners
     ---------------------------- */

  btn1.addEventListener("click", (e) => {
    e.preventDefault();
    showPart1();
  });

  btn2.addEventListener("click", (e) => {
    e.preventDefault();
    showPart2();
  });
});
