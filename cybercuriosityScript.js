// Using Fetch to render the markdown file from my GitHub repository

// Once the markdown is fetched, we parse it to HTML using marked.js
// Because the need to harden the digital content it is also important update the code to meet the updated CSP.
// Refering to the Policy for the CSP.
// Purify the DOM by sanitizing the markdown content.

document.addEventListener("DOMContentLoaded", function () {
    const btn1 = document.getElementById("toggle-be1");
    const btn2 = document.getElementById("toggle-be2");
    const section1 = document.getElementById("markdown-be1");
    const section2 = document.getElementById("markdown-be2");

    function loadMarkdown(url, container) {
        fetch(url)
            .then(response => response.text())
            .then(md => {
                const rawHtml = marked.parse(md);
                const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
                container.innerHTML = cleanHtml;
            })
            .catch(err => {
                console.error("Error fetching markdown:", err);
                container.textContent = "Failed to load content.";
            });
    }

    function addcybercuriosityStylesheet() {
        if (!document.getElementById("cybercuriosityStyles-style")) {
            const link = document.createElement("link");
            link.id = "cybercuriosityStyles-style";
            link.rel = "stylesheet";
            link.href = "cybercuriosityStyles.css";
            document.head.appendChild(link);
        }
    }

    function removecybercuriosityStylesheet() {
        const link = document.getElementById("backendStyles-style");
        if (link) link.remove();
    }

    // Load Part 1 on page load
    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/CSP_Readme.md", section1);
    section1.hidden = false;

    // Sandbox Notes Button Event Listener
    btn2.addEventListener("click", () => {
        section2.hidden = !section2.hidden;
        if (!section2.hidden && !section2.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/nmap.md", section2);
        }
        if (!section1.hidden) {
            addcybercuriosityStylesheet();
        } else {
            removecybercuriosityStylesheet();
        }
    });

});


