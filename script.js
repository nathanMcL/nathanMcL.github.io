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

        // Fake packet data format (mimiking hex network traffic)
        const hexData = "0x" + Math.random().toString(16).substring(2, 10).toUpperCase() + " " +
                        Math.random().toString(16).substring(2, 10).toUpperCase() + " " +
                        Math.random().toString(16).substring(2, 8).toUpperCase(); 

        packet.innerText = hexData;

        // Ensure packets go from the top down in a verticle streams (like a waterfall of Matrixness)
        packet.style.left = `${Math.floor(Math.random() * window.innerWidth / 50) * 50}px`; // Column-like effect
        packet.style.animationDuration = `${Math.random() * 6 + 4}s`; // Original value(faster): 5 + 3 + "s"
        packet.style.fontSize = `${20 + Math.random() * 10}px`; // Between 20px and 30px

        body.appendChild(packet);

        setTimeout(() => {
            packet.remove();
        }, 10000);
    }

    setInterval(createPacket, 500); // Generate new packets every 500ms
});
