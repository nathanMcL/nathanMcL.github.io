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

// Marquee JScript
document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const marqueeElementsDisplayed = parseInt(getComputedStyle(root).getPropertyValue("--marquee-elements-displayed"), 10);
    const marqueeContent = document.querySelector("ul.marquee-content");

    const marqueeElements = marqueeContent.children.length;
    root.style.setProperty("--marquee-elements", marqueeElements);

    for (let i = 0; i < marqueeElementsDisplayed; i++) {
        marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
    }
});
// End of Marquee JScript

// Orbs: move around the page. The orbs should bounce off the edges of the window and off the header and footer.
window.onload = function () {
    let main = document.querySelector("main");
    if (!main) {
        console.error("Main section not found!");
        return;
    }

    let orbs = [
        { id: "orb_me", dx: 2, dy: 2 },
        { id: "orb_services", dx: -2, dy: 1.5 }
    ];

    function initializeOrbs() {
        orbs.forEach((orbObj, index) => {
            let orb = document.getElementById(orbObj.id);
            if (!orb) {
                console.error(`Orb with ID '${orbObj.id}' not found!`);
                return;
            }

            let mainRect = main.getBoundingClientRect();
            // Prevent overlapping by each orb in a random non-overlapping position
            let minDistance = 120; // Minimum distance between orbs
            let attempts = 0;
            let validPosition = false;

            while (!validPosition && attempts < 50) {
                let randomX = Math.random() * (mainRect.width - 100); // + mainRect.left
                let randomY = Math.random() * (mainRect.height - 100); // + mainRect.top

                validPosition = orbs.every((otherOrb, otherIndex) => {
                    if (otherIndex === index) return true; // Ignore self
                    let other = document.getElementById(otherOrb.id);
                    if (!other) return true;
                    let otherRect = document.getBoundingClientRect();
                    let dx = randomX - otherRect.left;
                    let dy = randomY - otherRect.top;
                    return Math.sqrt(dx * dx + dy * dy) > minDistance; // Distance between orbs
                });

                if (validPosition) {
                    orb.style.left = `${randomX}px`;
                    orb.style.top = `${randomY}px`;
                }

                attempts++;
            }
        });
    }

    function moveOrbs() {
        let mainRect = main.getBoundingClientRect();

        orbs.forEach((orbObj, index) => {
            let orb = document.getElementById(orbObj.id);
            if (!orb) return;

            let rect = orb.getBoundingClientRect();
            let newLeft = rect.left + orbObj.dx;
            let newTop = rect.top + orbObj.dy;

            // Bounce off the main section boundaries
            if (newLeft <= mainRect.left || newLeft + rect.width >= mainRect.right) {
                orbObj.dx *= -1;
            }
            if (newTop <= mainRect.top || newTop + rect.height >= mainRect.bottom) {
                orbObj.dy *= -1;
            }

            orb.style.left = `${newLeft}px`;
            orb.style.left = `${newTop}px`;

            // Collision detection between orbs
            orbs.forEach((otherOrb, otherIndex) => {
                if (index !== otherIndex) {
                    let other = document.getElementById(otherOrb.id);
                    if (!other) return;

                    let otherRect = other.getBoundingClientRect();
                    let dx = rect.left - otherRect.left;
                    let dy = rect.top - otherRect.top;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < rect.width) {
                        let tempDx = orbObj.dx;
                        let tempDy = orbObj.dy;
                        orbObj.dx = otherOrb.dx;
                        orbObj.dy = otherOrb.dy;
                        otherOrb.dx = tempDx;
                        otherOrb.dy = tempDy;
                    }
                }
            });
        });

        requestAnimationFrame(moveOrbs);
    }

    initializeOrbs();
    moveOrbs();

    // Click events for the Popups
    document.getElementById("orb_me").addEventListener("click", function () {
        document.getElementById("popup_me").style.display = "block";
    });

    document.getElementById("orb_services").addEventListener("click", function () {
        document.getElementById("popup_services").style.display = "block";
    });
};

// Close popups
function closePopup(id) {
    let popup = document.getElementById(id);
    if (popup) popup.style.display = "none";
}