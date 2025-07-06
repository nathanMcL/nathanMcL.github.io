// blogScript.js
// Using Fetch to render the markdown file from my GitHub repository

document.addEventListener("DOMContentLoaded", function () {
    const profileImage = document.querySelector(".post_image img");
    const btn1 = document.getElementById("toggle-fs1");
    const btn2 = document.getElementById("toggle-fs2");
    const section1 = document.getElementById("markdown-fs1");
    const section2 = document.getElementById("markdown-fs2");

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
    function addFSpt2Stylesheet() {
        if (!document.getElementById("fspt2-style")) {
            try {
                const link = document.createElement("link");
                link.id = "fspt2-style";
                link.rel = "stylesheet";
                link.href = "FSpt2Styles.css";
                link.onload = () => console.log("✅ FSpt2Styles.css loaded successfully.");
                link.onerror = () => {
                    console.error("⚠️ FSpt2Styles.css failed to load. Check path or CSP.");
                };
                document.head.appendChild(link);
            } catch (error) {
                console.error("❌ Error loading FSpt2Styles.css:", error);
            }
        }
    }

    function removeFSpt2Stylesheet() {
        const link = document.getElementById("fspt2-style");
        if (link) {
            link.remove();
            console.log("🧼 FSpt2Styles.css removed.");
        }
    }

    // --- Profile Image Swapper ---
    function updateProfileImage(src, alt) {
        if (!profileImage) {
            console.error("⚠️ Profile image element not found.");
            return;
        }

        profileImage.onerror = function () {
            console.error("❌ Failed to load profile image:", src);
            this.src = "/images/LittleRobotBackgroundErase.png";
            this.alt = "Fallback profile image";
        };

        profileImage.src = src;
        profileImage.alt = alt;
    }

    // --- Button 1: Full Stack Part 1 ---
    btn1.addEventListener("click", () => {
        section1.hidden = !section1.hidden;
        section2.hidden = true;
        removeFSpt2Stylesheet();
        document.body.classList.remove("fspt2-mode");
        updateProfileImage("/images/SoftwareEngineer_WhtAM_male.png", "White American Male Engineer");

        if (!section1.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md", section1);
        }
    });

    // --- Button 2: Full Stack Part 2 ---
    btn2.addEventListener("click", () => {
        section2.hidden = !section2.hidden;
        section1.hidden = true;
        document.body.classList.toggle("fspt2-mode", !section2.hidden);

        if (!section2.hasChildNodes()) {
            loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/FullStack_pt2_ReadMe.md", section2);
        }

        if (!section2.hidden) {
            addFSpt2Stylesheet();
            updateProfileImage("/images/SoftwareEngineer_AFAM_Female.png", "African American Female Engineer");
        } else {
            removeFSpt2Stylesheet();
            updateProfileImage("/images/SoftwareEngineer_WhtAM_male.png", "White American Male Engineer");
        }
    });

    // --- Load Part 1 by default on page load ---
    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md", section1);
});
