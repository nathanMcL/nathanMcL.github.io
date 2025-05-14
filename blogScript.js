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
        })
        .catch(err => {
            console.error('Error fetching markdown:', err);
            document.getElementById('markdown-content').textContent = 'Failed to load content.';
        });
});

