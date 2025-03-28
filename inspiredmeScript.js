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
        packet.style.animationDuration = "7s";

        body.appendChild(packet);

        setTimeout(() => {
            packet.remove();
        }, 7000);
    }

    setInterval(createPacket, 800); // Generate new packets
});

// Inspired Me Clouds
// Event Listener for the DOM
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("inspiration-container");
    const clouds = document.querySelectorAll(".inspiration-cloud");
    const popupContainer = document.getElementById("popup-container");

    // Next, we want to randomly place the clouds in the container without overlapping or going out of bounds. 
    // TODO: Console Error Message: Could not position cloud, skipping overlap check.
    // Don't get annoyed, you worked sorta hard... but the clouds are overlapping or slightly touching (again). 
    // The clouds have a slight margin, but that is in a rectangle shape... thinking...
    // Maybe, since they are clouds and oval in shape and mess around with the radius... 
    // Use a center-radius and compute the sum of the half-widths...
    function positionClouds() {
        let positions = [];
        const margin = 10; // Margin from the edge of the container

        clouds.forEach(cloud => {
            const w = cloud.clientWidth;
            const h = cloud.clientHeight;
            let x, y, overlap, attempts = 0;
            do {
                x = Math.random() * (container.clientWidth - w - margin*2) + margin;
                y = Math.random() * (container.clientHeight - h - margin*2) + margin;

                const box = { x, y, width: w, height: h };
                overlap = positions.some(pos => boxesOverlap(pos, box, margin));
                attempts++;
                    if (attempts > 200) {
                        console.warn("Could not position cloud, skipping overlap check.");
                        overlap = false;
                    }
            } while (overlap);

            cloud.style.left = `${x}px`;
            cloud.style.top = `${y}px`;

            positions.push({ x, y, width: w, height: h });
        });
    }

    // Helper function to check if the to boxes overlap.
    function boxesOverlap(a, b, margin) {
        return ! (
            a.x + a.width + margin < b.x ||
            b.x + b.width + margin < a.x ||
            a.y + a.height + margin < b.y ||
            b.y + b.height + margin < a.y
        );
    }

    positionClouds();

    // Cloud Hover Effect 
    // In this section I want to animate the clouds such that they move in a small oval pattern.
    function animateClouds() {
        clouds.forEach(cloud => {
            let angle = Math.random() * 360;
            let radiusX = 10 + Math.random() * 15;
            let radiusY = 5 + Math.random() * 10;
            let speed = 0.02 + Math.random() * 0.05;

            function moveCloud() {
                angle += speed;
                let offsetX = Math.cos(angle) * radiusX;
                let offsetY = Math.sin(angle) * radiusY;

                if (cloud && cloud.style) {
                    cloud.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                } else {
                    console.error("Cloud element is underfined or missing style property.");
                }

                requestAnimationFrame(moveCloud);
            }
            moveCloud();
        });
    }

    animateClouds();

    // For each cloud, we want to be able to click on it and display a popup message.
    // Popup Event Listener for the DOM
    clouds.forEach(cloud => {
        cloud.addEventListener("click", function (event) {
            const trait = cloud.dataset.trait.trim().replace(/\s+/g, "_");
            const popup = document.getElementById(`popup_${trait}`);

            if (popup) {
                // In this next line, we want to "Hide" or clear the previous popup
                document.querySelectorAll(".cloud-popup").forEach(p => p.classList.remove("active")); 
                
                popupContainer.classList.add("active");
                popup.classList.add("active");

                // Have the popup centered on the screen
                popup.style.top = "50%";
                popup.style.left = "50%";
                popup.style.transform = "translate(-50%, -50%)";
            } else {
                console.error(`Popup #popup_${trait} not found!`);
            }
        });
    });

    // Close Popup Button Event Listener for the DOM
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", function () {
            let popupId = this.dataset.popup;
            let popup = document.getElementById(popupId);

            if (popup) {
                popup.classList.remove("active");
                setTimeout(() => popupContainer.classList.remove("active"), 300);
            }
        });
    });

    // Clicking outside the popup should also close it...
    popupContainer.addEventListener("click", function (event) {
        if (event.target === popupContainer) {
            document.querySelectorAll(".cloud-popup").forEach(popup => {
                popup.classList.remove("active");
            });
            setTimeout(() => popupContainer.classList.remove("active"), 300);
        }
    });
});

// Sub-Main Section: Sir Robot Container: Image Swap Function
document.addEventListener("DOMContentLoaded", function () {
    const sirRobotImage = document.getElementById("sirRobot");
    let images = ["images/SirRobot_normal.png", "images/SirRobot_wave.png"];
    let index = 0;

    function swapRobotImage() {
        index = (index + 1) % images.length;
        sirRobotImage.style.opacity = 0; // Fade out the image
        setTimeout(() => {
            sirRobotImage.src = images[index];
            sirRobotImage.style.opacity = 1; // Fade in the new image. Let's hope this works! :|
        }, 150); // OG time: 1 second fade transition 
    }

    // Swap images every 10 seconds
    setInterval(swapRobotImage, 10000);
});