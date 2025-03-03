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
document.addEventListener("DOMContentLoaded", function () {
    let orbs = [
        { id: "orb_me", dx: 2, dy: 2 },
        { id: "orb_service", dx: -2, dy: 1.5 }
    ];

    function moveOrbs() {
        orbs.forEach(orbObj => {
            let orb = document.getElementById(orbObj.id);
            let rect = orb.getBoundingClientRect();
            let parent = document.body;

            // Move orb
            orb.style.left = (rect.left + orbObj.dx) + "px";
            orb.style.top = (rect.top + orbObj.dy) + "px";

            // Bounce off the walls
            if (rect.left <= 0 || rect.right >= parent.clentWidth) {
                orbObj.dx *= -1;
            }
            if (rect.top <= 0 || rect.bottom >= parent.clientHeight) {
                orbObj.dy *= -1;
            }
        });

        requestAnimationFrame(moveOrbs);
    }

    moveOrbs();

    // Click events for the Popups
    document.getElementById("orb_me").addEventListener("click", function () {
        document.getElementById("popup_me").style.display = "block";
    });

    document.getElementById("orb_service").addEventListener("click", function () {
        document.getElementById("popup_service").style.display = "block";
    });
});

// Close popups
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}
