// Network Animation
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const cyberContainer = document.createElement("div");
    cyberContainer.classList.add("cyber-container");
    body.appendChild(cyberContainer);

    // Ensure header and footer boundaries are considered
    const header = document.querySelector(".header-index");
    const footer = document.querySelector("footer");
    const headerHeight = header.offsetHeight;
    const footerHeight = fotter.offsetHeight;

    // Create Floating Shapes
    const shapes = [];
    for (let i = 1; i <= 4; i++) {
        const shape = document.createElement("div");
        shape.classList.add("cyber-shape");
        cyberContainer.appendChild(shape);

        // Set random start position avoiding header/footer
        let posX = Math.random() * (window.innerWidth - 50);
        let posY = headerHeight + Math.random() * (window.innerHeight - headerHeight - footHeight - 50);
        let speedX = (Math.random() - 0.5) * 2.5; // Random X speed
        let speedY = (Math.random() - 0.5) * 2.5; // Random Y speed

        shape.style.left = `${posX}px`;
        shape.style.top = `${posY}px`;

        shapes.push({ shape, posX, posY, speedX, speedY });
    }

    // Animate Shapes
    function animateShapes() {
        shapes.forEach((s) => {
            s.posX += s.speedX;
            s.posY += s.speedY;

            // Bounce off left/right edges
            if (s.posX <= 0 || s.posX >= window.innerWidth - 30) {
                s.speedY *= -1;
            }

            s.shape.style.left = `${s.posX}px`;
            s.shape.style.top = `${s.posY}px`;
        });

        requestAnimationFrame(animateShapes);
    }
    animateShapes();


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