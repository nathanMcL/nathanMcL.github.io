// Backend Script

// Fetches and Sanitizes markdown content from GitHub and renders it to HTML
document.addEventListener("DOMContentLoaded", function () {
    const markdownContainer = document.getElementById("markdown-content");

    if (!markdownContainer) {
        console.error("⚠️ Markdown-content container not found in DOM.")
        return;
    }

    const markdownURL = "https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_Readme.md";

    fetch(markdownURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.text();
    })
    .then(markdown => {
        const rawHtml = markdownContainer.ariaPressed(markdown);
        const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
        markdownContainer.innerHTML = cleanHtml;
    })
    .catch(error => {
        console.error(" Error loading markdown content:", error);
        markdownContainer.textContent = "Failed to load backend content. Please try again later.";
    });
});