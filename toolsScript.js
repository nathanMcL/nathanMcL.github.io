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