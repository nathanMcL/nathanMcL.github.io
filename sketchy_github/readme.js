// readme.js
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("markdown-readme");
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Trusted Types policy
    const policy = window.trustedTypes?.createPolicy("default", {
        createHTML: (input) => input
    });

    // Helper: fetch, parse, sanitize, render
    async function loadMarkdown() {
        try {
            // Corrected case-sensitive filename
            const res = await fetch(
                "https://raw.githubusercontent.com/nathanMcL/AI-0-.-0-/main/sketchy_github/Readme.md"
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const md = await res.text();

            const rawHtml = marked.parse(md);
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                RETURN_TRUSTED_TYPE: true,
                ALLOWED_ATTR: [] // strip inline styles to satisfy CSP
            });

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
