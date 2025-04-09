// Using Fetch to render the markdown file from my GitHub repository
document.addEventListener("DOMContentLoaded", function () {
    fetch('https://raw.githubusercontent.com/nathanMcL/nathanMcL.github.io/main/ReadMe.md')
        .then(response => response.text())
        .then(markdown => {
            // Once the markdown is fetched, we convert it to HTML using marked.js
            document.getElementById('markdown-content').innerHTML = marked.parse(markdown);
        })
        .catch(err => {
            console.error('Error fetching markdown:', err);
            document.getElementById('markdown-content').innerHTML = 'Failed to load content.';
        });
});
