// Using Fetch to render the markdown file from my GitHub repository
document.addEventListener("DOMContentLoaded", function () {
    fetch('https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md')
        .then(response => response.text())
        .then(markdown => {
            // Once the markdown is fetched, we parse it to HTML using marked.js
            // Because the need to harden the digital content it is also important update the code to meet the updated CSP.
            // Refering to the Policy for the CSP.
            // Purify the DOM by sanitizing the markdown content.
            const rawHtml = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml, {RETURN_TRUSTED_TYPE: true}); // TrustedHTML
            const container = document.getElementById('markdown-content');
            container.innerHTML = cleanHtml; // safe assignment under Trusted Types

            // Full Stack Thoughts drop down functionality
            const btn1 = document.getElementById("toggle-fs1");
            const btn2 = document.getElementById("toggle-fs2");
            const section1 = document.getElementById("markdown-fs1");
            const section2 = document.getElementById("markdown-fs2");

            // Full Stack Thoughts: Tab Toggle: Profile Image Swap
            const profileImage = document.querySelector(".post_image img");

            // Function to load markdown content and clean it
            function loadMarkdown(url, container) {
                fetch(url)
                    .then(res => res.text())
                    .then(md => {
                        const rawHtml = marked.parse(md);
                        const cleanHtml = DOMPurify.sanitize(rawHtml, {RETURN_TRUSTED_TYPE: true}); // TrustedHTML
                        container.innerHTML = cleanHtml; // safe assignment under Trusted Types 
                    })
                    .catch(err => {
                        console.error('Error fetching markdown:', err);
                        document.getElementById('markdown-content').textContent = 'Failed to load content.';
                    });        
            }

            // Button One: Full Stack Part One Toggle
            btn1.addEventListener("click", () => {
                section1.hidden = !section1.hidden;
                section2.hidden = true; // Hide the second section when the first is toggled
                removeFSpt2Stylesheet();
                document.body.classList.remove("fspt2-mode");

                // Update the profile image when the first section is toggled
                updateProfileImage("/images/SoftwareEngineer_WhtAM_male.png", "White American Male Engineer");

                if (!section1.hasChildNodes()) {
                    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md", section1);
                }
            });

            // Button Two: Full Stack Part Two Toggle
            btn2.addEventListener("click", () => {
                section2.hidden = !section2.hidden;
                section1.hidden = true; // Hide the first section when the second is toggled
                document.body.classList.toggle("fspt2-mode", !section2.hidden);
                if (!section2.hasChildNodes()) {
                    loadMarkdown("https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md", section2);
                }

                if (!section2.hidden) {
                    addFSpt2Stylesheet();
                    updateProfileImage("/images/SoftwareEngineer_AFAM_Female.png", "African American Female Engineer");
                } else {
                    removeFSpt2Stylesheet();
                    updateProfileImage("/images/SoftwareEngineer_WhtAM_male.png", "White American Male Engineer");
                }
            });
            // Error handling if FSpt2Styles fails to load when swapped
            link.onerror = () => {
            console.error("⚠️ FSpt2Styles.css failed to load. Check path or CSP.");
            };

            // Function to update Profile picture if the second tab is toggled
            function updateProfileImage(src, alt) {
                if (!profileImage) {
                    console.error(" ⚠️ Profile image element not found.");
                    return;
                }

                profileImage.onerror = function () {
                    console.error("❌ Failed to load profile image:", src);
                    this.src = "/images/LittleRobotBackgroundErase.png"; // Fallback image
                    this.alt = "Fallback profile image";
                };

                profileImage.src = src;
                profileImage.alt = alt;
            }
        });
});