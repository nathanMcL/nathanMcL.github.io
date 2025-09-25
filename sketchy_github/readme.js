// readmeScript.js
document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const readmeContainer = document.getElementById("markdown-readme");

  // Decide which source to use (GitHub raw vs local)
  function getReadmeSource() {
    const isGithubPages = window.location.hostname.includes("github.io");
    if (isGithubPages) {
      // Adjust to your repo’s raw link
      return "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/Readme.md";
    } else {
      // Local relative path
      return "Readme.md";
    }
  }

  function loadMarkdown(url, container) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((md) => {
        // Convert markdown → HTML
        const rawHtml = marked.parse(md);
        // Sanitize for security
        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
        container.innerHTML = cleanHtml;
      })
      .catch((err) => {
        console.error("Error fetching markdown:", err);
        container.textContent = "⚠️ Failed to load README content.";
      });
  }

  // Load Readme into container
  const readmeUrl = getReadmeSource();
  if (readmeContainer) {
    loadMarkdown(readmeUrl, readmeContainer);
  }
});
