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
            const rawHtml = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
            markdownContainer.innerHTML = cleanHtml;
        })
        .catch(error => {
            console.error("❌ Error loading markdown content:", error);
            markdownContainer.textContent = "Failed to load backend content. Please try again later.";
        });
});

// This Event Listener handles the toggling the Back-End Part 1 and Part 2 sections
document.addEventListener("DOMContentLoaded", function () {
    const btn1 = document.getElementById("toggle-be1");
    const btn2 = document.getElementById("toggle-be2");
    const section1 = document.getElementById("markdown-be1");
    const section2 = document.getElementById("markdown-be2");

    // Once the markdown is fetched, we parse it to HTML using marked.js
    // Because the need to harden the digital content it is also important to update the code to meet the updated CSP.
    // Referring to the Policy for the CSP.
    // Purify the DOM by sanitizing the markdown content.

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

    // --- Dynamic CSS Loading ---
    function addBackendStylesheet() {
        if (!document.getElementById("backendStyles-style")) {
            try {
                const link = document.createElement("link");
                link.id = "backendStyles-style";
                link.rel = "stylesheet";
                link.href = "backendStyles.css";
                link.onload = () => console.log("✅ backendStyles.css loaded successfully.");
                link.onerror = () => {
                    console.error("⚠️ backendStyles.css failed to load. Check path or CSP.");
                };
                document.head.appendChild(link);
            } catch (error) {
                console.error("❌ Error loading backendStyles.css:", error);
            }
        }
    }

    function removeBackendStylesheet() {
        const link = document.getElementById("backendStyles-style");
        if (link) {
            link.remove();
            console.log("🧼 backendStyles.css removed.");
        }
    }
    // --- Button 1: Back-End Part 1 ---
    btn1.addEventListener("click", () => {
        section1.hidden = !section1.hidden;
        section2.hidden = true;
        removeBackendStylesheet();
        document.body.classList.remove("be1-mode");

        if (!section1.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_Readme.md", section1);
        }
    });

    // --- Button 2: Back-End Part 2 ---
    btn2.addEventListener("click", () => {
        section2.hidden = !section2.hidden;
        section1.hidden = true;
        document.body.classList.toggle("be2-mode", !section2.hidden);

        if (!section2.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_ReadMe_troubleshooting.md", section2);
        }

        if (!section2.hidden) {
            addBackendStylesheet();
            updateProfileImage("/images/SoftwareEngineer_AFAM_Female.png", "African American Female Engineer");
        } else {
            removeBackendStylesheet();
            updateProfileImage("/images/SoftwareEngineer_WhtAM_male.png", "White American Male Engineer");
        }
    });

    // --- Load Back-End Part 1 by default on page load ---
    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_Readme.md", section1);
});