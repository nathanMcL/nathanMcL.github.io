// toolsScript.js

// Define a Trusted Types Policy once
const policy = trustedType?.createPolicy("default", {
    createHTML: (input) => input 
});

// Sanitize and render the initial HTML content safely
container.innerHTML = policy.createHTML(cleanHtml);

// Tools toggle
document.addEventListener("DOMContentLoaded", function() {
    const toolsButton = document.getElementById('toolsToggle');
    const toolsCategories = document.getElementById('toolsCategories');
    const toggleText = document.getElementById('toggleText');
    const toggleTriangle = document.getElementById('toggleTriangle');

    toolsButton.addEventListener('click', function() {
        toolsCategories.classList.toggle('hidden');

        if (toggleText.textContent === "open") {
            toggleText.textContent = "close";
            toggleText.style.color = 'var(--triangle-button-close)';
        } else {
            toggleText.textContent = "open";
            toggleText.style.color = 'var(--triangle-button-open)';
        }

        toggleTriangle?.classList.toggle('rotate-triangle');
        if (toggleTriangle) {
            toggleTriangle.style.color = toggleText.style.color;
        }
    });
});
// End of Tools toggle


// Project Builds toggle & README render
document.addEventListener("DOMContentLoaded", function() {
    const projectButton = document.getElementById('ProjectToggle');
    const projectCategories = document.getElementById('projectCategories');
    const projectToggleText = document.getElementById('projectToggleText');
    const projectReadme = document.getElementById('projectReadme');
    const sketchyLink = document.getElementById('sketchyLink');

    // Toggle Project Builds section
    projectButton.addEventListener('click', function() {
        projectCategories.classList.toggle('hidden');

        if (projectToggleText.textContent === "open") {
            projectToggleText.textContent = "close";
            projectToggleText.style.color = 'var(--triangle-button-close)';
        } else {
            projectToggleText.textContent = "open";
            projectToggleText.style.color = 'var(--triangle-button-open)';
        }
    });

    // Helper function to load markdown, sanitize, and render
    async function loadMarkdown(url, container) {
        try {
            const res = await fetch(url);
            const md = await res.text();

            const rawHtml = marked.parse(md);
            const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });

            // ✅ Safe TrustedHTML assignment
            container.innerHTML = cleanHtml;
        } catch (err) {
            console.error("Error fetching markdown:", err);
            container.innerHTML = "<p>❌ Failed to load content.</p>";
        }
    }

    // Load Sketchy README.md when logo is clicked
    sketchyLink.addEventListener('click', async function(e) {
        e.preventDefault();
        projectReadme.hidden = false;
        projectReadme.innerHTML = "<p>Loading Sketchy README...</p>";

        await loadMarkdown(
            "https://raw.githubusercontent.com/nathanMcL/AI-0-.-0-/main/Sketchy/README.md",
            projectReadme
        );
    });
});
