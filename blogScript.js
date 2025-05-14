// Using Fetch to render the markdown file from my GitHub repository
document.addEventListener("DOMContentLoaded", function () {
    fetch('https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md')
        .then(response => response.text())
        .then(markdown => {
            // Once the markdown is fetched, we parse it to HTML using marked.js.
            // Because the need to improve security of the digital content it is also important update the code to meet the updated CSP.
            // Refering to the Policy for the CSP.
            // Purify the DOM by sanitizing the markdown content.
            const policy = DOMPurify.sanitize(marked.parse(markdown)); 
            document.getElementById('markdown-content').innerHTML = policy;
        })
        .catch(err => {
            console.error('Error fetching markdown:', err);
            document.getElementById('markdown-content').innerHTML = 'Failed to load content.';
        });
});

