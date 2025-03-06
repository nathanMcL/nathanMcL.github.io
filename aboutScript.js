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
    let footer = document.querySelector("footer"); // Footer boundary

    if (!main) {
        console.error("Main section not found!");
        return;
    }

    let orbs = [
        { id: "orb_me", dx: 2, dy: 2 },
        { id: "orb_services", dx: -2, dy: 1.5 }
    ];

    initializeOrbs();
    moveOrbs();

    // Click events for the Popups
    document.getElementById("orb_me").addEventListener("click", function () {
        let popup = document.getElementById("popup_me");
        if (popup) {
            popup.style.display = "block";
        } else {
            console.error("Popup #popup_me not found!");
        }
    });

    document.getElementById("orb_services").addEventListener("click", function () {
        let popup = document.getElementById("popup_services");
        if (popup) {
            popup.style.display = "block";
        } else {
            console.error("Popup #popup_services not found!");
        }
    });

    document.getElementById("orb_things").addEventListener("click", function () {
        let popup = document.getElementById("popup_things");
        if (popup) {
            popup.style.display = "block";
        } else {
            console.error("Popup #popup_things not found!");
        }
    });

    // Close button for the popups
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", function () {
            let popupId = this.dataset.popup;
            let popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = "none";
            } else {
                console.error(`Popup with ID '${popupId}' not found!`);
            }
        });
    });

    function initializeOrbs() {
        let mainRect = main.getBoundingClientRect();

        orbs.forEach((orbObj, index) => {
            let orb = document.getElementById(orbObj.id);
            if (!orb) {
                console.error(`Orb with ID '${orbObj.id}' not found!`);
                return;
            }

            let minDistance = 120; // Minimum distance between orbs
            let attempts = 0;
            let validPosition = false;

            while (!validPosition && attempts < 50) {
                let randomX = Math.random() * (mainRect.width - 100);
                let randomY = Math.random() * (mainRect.height - 100);

                validPosition = orbs.every((otherOrb, otherIndex) => {
                    if (otherIndex === index) return true;
                    let other = document.getElementById(otherOrb.id);
                    if (!other) return true;
                    let otherX = other.offsetLeft;
                    let otherY = other.offsetTop;
                    let dx = randomX - otherX;
                    let dy = randomY - otherY;
                    return Math.sqrt(dx * dx + dy * dy) > minDistance;
                });

                if (validPosition) {
                    orb.style.left = randomX + "px";
                    orb.style.top = randomY + "px";
                }

                attempts++;
            }
        });
    }

    function moveOrbs() {
        let mainRect = main.getBoundingClientRect();
        let footerRect = footer.getBoundingClientRect(); // Ensure we reference this

        orbs.forEach((orbObj, index) => {
            let orb = document.getElementById(orbObj.id);
            if (!orb) return;

            let newLeft = orb.offsetLeft + orbObj.dx;
            let newTop = orb.offsetTop + orbObj.dy;

            // Bounce off the left/right boundaries
            if (newLeft <= 0 || newLeft + orb.clientWidth >= main.clientWidth) {
                orbObj.dx *= -1;
            }

            // Bounce off the top of <main>
            if (newTop <= 0) {
                orbObj.dy *= -1;
            }

            // Bounce off the bottom of <main>, ensuring it does not fall into **before** the footer
            if (newTop + orb.clientHeight >= main.clientHeight) {
                orbObj.dy *= -1;
                newTop = main.clientHeight - orb.clientHeight; // Keep it above the footer
            }

            // Ensure the orb does not enter the footer
            if (newTop + orb.clientHeight >= footerRect.top) {
                orbObj.dy *= -1;
                newTop = footerRect.top - orb.clientHeight;
            }

            orb.style.left = newLeft + "px";
            orb.style.top = newTop + "px";

            // Collision detection between orbs
            orbs.forEach((otherOrb, otherIndex) => {
                if (index !== otherIndex) {
                    let other = document.getElementById(otherOrb.id);
                    if (!other) return;

                    let dx = orb.offsetLeft - other.offsetLeft;
                    let dy = orb.offsetTop - other.offsetTop;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < orb.clientWidth) {
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
};

// Close popups
function closePopup(id) {
    let popup = document.getElementById(id);
    if (popup) {
        popup.style.display = "none";
    } else {
        console.error(`Popup with ID '${id}' not found!`);
    }
}