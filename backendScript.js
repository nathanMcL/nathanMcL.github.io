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

    // Load Part 1 on page load
    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_Readme.md", section1);
    section1.hidden = false;

    // Toggle Part 2
    btn2.addEventListener("click", () => {
        section2.hidden = !section2.hidden;
        if (!section2.hidden && !section2.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/BackEnd_ReadMe_troubleshooting.md", section2);
        }
        if (!section2.hidden) {
            addBackendStylesheet();
        } else {
            removeBackendStylesheet();
        }
    });

    // Toggle for Part 1
    btn1.addEventListener("click", () => {
        section1.hidden = !section1.hidden;
    });
});
