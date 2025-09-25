// readme.js

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("markdown-readme");
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Define a Trusted Types policy (if supported)
    const policy = window.trustedTypes?.createPolicy("default", {
        createHTML: (input) => input
    });

    // Helper: fetch, parse, sanitize, and render README.md
    async function loadMarkdown() {
        try {
            const res = await fetch(
                "https://raw.githubusercontent.com/nathanMcL/AI-0-.-0-/main/sketchy_github/Readme.md"
            );
            const md = await res.text();

            const rawHtml = marked.parse(md);
            const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });

            // ✅ Use Trusted Types policy if available
            if (policy) {
                container.innerHTML = policy.createHTML(cleanHtml);
            } else {
                container.innerHTML = cleanHtml; // fallback
            }
        } catch (err) {
            console.error("Error fetching markdown:", err);
            container.innerHTML = "<p>❌ Failed to load README content.</p>";
        }
    }

    loadMarkdown();
});
