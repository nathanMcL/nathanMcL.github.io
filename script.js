// Network Animation
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const cyberContainer = document.createElement("div");
    cyberContainer.classList.add("cyber-container");
    body.appendChild(cyberContainer);

    // Create Floating Shapes
    for (let i = 1; i <= 4; i++) {
        const shape = document.createElement("div");
        shape.classList.add("cyber-shape", `shape{i}`);
        cyberContainer.appendChild(shape);

        // Random movement direction when clicked
        shape.addEventListener("click", function () {
            shape.style.transform = `translate(${Math.random() * 100 - 50}vm, ${Math.random() * 100 - 50}vh)`;
        });
    }

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