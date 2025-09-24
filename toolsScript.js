// Network Animation
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const cyberContainer = document.createElement("div");
    cyberContainer.classList.add("cyber-container");
    body.appendChild(cyberContainer);

    // Function to create fake network packets
    function createPacket() {
        const packet = document.createElement("div");
        packet.classList.add("network-packet");
        packet.innerText = Math.random().toString(16).substring(2, 8); // Fake hex data

        packet.style.left = Math.random() * window.innerWidth + "px";
        packet.style.animationDuration = Math.random() * 5 + 3 + "s";

        body.appendChild(packet);

        setTimeout(() => {
            packet.remove();
        }, 8000);
    }

    setInterval(createPacket, 800); // Generate new packets
});

// Tools toggle
document.addEventListener("DOMContentLoaded", function() {
    const toolsButton = document.getElementById('toolsToggle');
    const toolsCategories = document.getElementById('toolsCategories');
    const toggleText = document.getElementById('toggleText');
    const toggleTriangle = document.getElementById('toggleTriangle');

    toolsButton.addEventListener('click', function() {
        // Toggle the visibility of the tools categories
        toolsCategories.classList.toggle('hidden');

        // Toggle text between 'open' and 'close'
        if (toggleText.textContent === "open") {
            toggleText.textContent = "close";
            toggleText.style.color = 'var(--triangle-button-close)'; // Change the text color text to orange
        } else {
            toggleText.textContent = "open";
            toggleText.style.color = 'var(--triangle-button-open)'; // Change the text color back to green
        }

        // Rotate triangle and change its color
        toggleTriangle.classList.toggle('rotate-triangle');
        toggleTriangle.style.color = toggleText.style.color; // Change the triangle color to match the text color
    });
});
// End of Tools toggle


// Render the Project Builds toggle & README
document.addEventListener("DOMContentLoaded", function() {
    const projectButton = document.getElementById('ProjectToggle');
    const projectCategories = document.getElementById('projectCategories');
    const projectToggleText = document.getElementById('projectToggleText');
    const projectReadme = document.getElementById('projectReadme');
    const sketchyLink = document.getElementById('sketchyLink');

    projectButton.addEventListener('click', async function() {
        projectCategories.classList.toggle('hidden');

        // Toggle text open/close
        if (projectToggleText.textContent === "open") {
            projectToggleText.textContent = "close";
            projectToggleText.style.color = 'var(--triangle-button-close)';
        } else {
            projectToggleText.textContent = "open";
            projectToggleText.style.color = 'var(--triangle-button-open)';
        }
    });

    // Load README.md only when Sketchy logo is clicked
    sketchyLink.addEventListener('click', async function(e) {
        e.preventDefault();

        projectReadme.hidden = false;
        projectReadme.innerHTML = "<p>Loading Sketchy README...</p>";

        try {
            // Fetch raw Markdown from GitHub
            const res = await fetch("https://raw.githubusercontent.com/nathanMcL/AI-0-.-0-/main/Sketchy/README.md");
            const md = await res.text();

            // Parse markdown -> HTML
            const rawHtml = marked.parse(md);

            // Sanitize the HTML for security
            const cleanHtml = DOMPurify.sanitize(rawHtml, {RETURN_TRUSTED_TYPE: true});

            projectReadme.innerHTML = cleanHtml; // Safe TrustedHTML assignment
        } catch (err) {
            projectReadme.innerHTML = "<p>❌ Failed to load Sketchy README.md.</p>";
            console.error("Error fetching Sketchy README.md:", err);
        }
    });
});
