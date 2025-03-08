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

// Inspired Me Clouds
// Event Listener for the DOM
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("inspiration-container");
    const clouds = document.querySelectorAll(".inspiration-cloud");

    // Next, we want to randomly place the clouds in the container without overlapping or going out of bounds.
    function positionClouds() {
        let positions = [];

        clouds.forEach(cloud => {
            let x, y, overlap;

            do {
                x = Math.random() * (container.clientWidth - cloud.clientWidth);
                y = Math.random() * (container.clientHeight - cloud.clientHeight);

                overlap = positions.some(pos => {
                    let dx = pos.x - x;
                    let dy = pos.y - y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    return distance < 100; // Distance between clouds (can be adjusted)
                });
            } while (overlap);

            positions.push({ x, y });

            cloud.style.left = `${x}px`;
            cloud.style.top = `${y}px`;
        });
    }

    positionClouds();

    // In this section I want to animate the clouds such that they move in a small oval pattern.
    function animateClouds() {
        clouds.forEach(cloud => {
            let angle = Math.random() * 360;
            let radiusX = 10 + Math.random() * 15;
            let radiusY = 5 + Math.random() * 0.05;

            function moveCloud() {
                angle += Speed;
                let offsetX = Math.cos(angle) * radiusX;
                let offsetY = Math.sin(angle) * radiusY;
                cloud.stlye.transform = `translate(${offsetX}px, ${offsetY}px)`;

                requestAnimationFrame(moveCloud);
            }
            moveCloud();
        });
    }

    animateClouds();
})