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
    const footerHeight = footer.offsetHeight;

    // Create Floating Shapes
    const shapes = [];
    for (let i = 1; i <= 4; i++) {
        const shape = document.createElement("div");
        shape.classList.add("cyber-shape");
        cyberContainer.appendChild(shape);

        // Set random start position avoiding header/footer
        let posX = Math.random() * (window.innerWidth - 50);
        let posY = headerHeight + Math.random() * (window.innerHeight - headerHeight - footerHeight - 50);
        let speedX = (Math.random() - 0.5) * 1.5; // Random X speed
        let speedY = (Math.random() - 0.5) * 1.25; // Random Y speed

        shape.style.left = `${posX}px`;
        shape.style.top = `${posY}px`;

        shapes.push({ shape, posX, posY, speedX, speedY });
    }

    // Animate Shapes
    function animateShapes() {
        shapes.forEach((s) => {
            s.posX += s.speedX;
            s.posY += s.speedY;

            // Get window and shape sizes
            let windowWidth = window.innerWidth;
            let windowHeight = window.innerHeight;
            let shapeSize = 39; // Shape size: 30px x 30px

            // Prevent shape from moving outside the edges
            if (s.posX <= 0) {
                s.posX = 0;
                s.speedX *= -1;
            }

            if (s.posX >= windowWidth - shapeSize) {
                s.posX = windowWidth - shapeSize;
                s.speedX *= -1;
            }

            // Prevent shape from moving outside the header/footer
            if (s.posY <= headerHeight) {
                s.posY = headerHeight;
                s.speedY *= -1;
            }

            if (s.posY >= windowHeight - footerHeight - shapeSize) {
                s.posY = windowHeight - footerHeight - shapeSize;
                s.speedY *= -1;
            }

            s.shape.style.left = `${s.posX}px`;
            s.shape.style.top = `${s.posY}px`;
        });

        requestAnimationFrame(animateShapes);
    }
    animateShapes(); // Start the animation

    // Attempt to prevent shapes from going off screen and resizing the window.
    window.addEventListener("resize", () => {
        shapes.forEach((s) => {
            let maxX = window.innerWidth - 30; // Prevent overflow
            let maxY = window.innerHeight - footerHeight - 30;

            if (s.posX > maxX) s.posX = maxX;
            if (s.posY > maxY) s.posY = maxY;
        });
    });

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