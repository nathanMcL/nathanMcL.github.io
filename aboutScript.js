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
