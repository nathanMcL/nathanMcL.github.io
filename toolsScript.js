// toolsScript.js

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

    // Define a Trusted Types policy (only if supported)
    const policy = window.trustedTypes?.createPolicy("default", {
        createHTML: (input) => input
    });

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

    // Load local Sketchy readme.html in an iframe
    sketchyLink.addEventListener('click', function(e) {
        e.preventDefault();
        projectReadme.hidden = false;

        // ✅ Use Trusted Types policy if available
        const iframeHtml = `
            <iframe src="sketchy_github/readme.html"
                    title="Sketchy Readme"
                    width="100%" height="600"
                    style="border:none;"></iframe>
        `;

        if (policy) {
            projectReadme.innerHTML = policy.createHTML(iframeHtml);
        } else {
            projectReadme.innerHTML = iframeHtml; // fallback
        }
    });
});
