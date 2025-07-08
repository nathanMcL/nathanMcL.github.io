// Network Animation
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

// Currently this this is not working. I need to refine this idea at a later time. 
// The "Network data" is generating at the top of the page, above the header, and scrolling the page to the right.
// The idea is to have a left to right- top to bottom - in the background - have a Matrix-like "1001001100" animation but instead using hex-like "Network data" animation.
// I need to work on this on my local machine before uploading...


/*
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
*/

// Discord Live Stream Widget (07/08/2025.0700.NBM)
document.addEventListener("DOMContentLoaded", function () {
    const widget = document.getElementById("discord-live-widget");
    let isDragging = false;
    let offsetX, offsetY;

    // I want this widget to be independent, Not embedded into the main conntent. 
    // The user could drag the Discord Live Stream Widget where they want within the page.
    widget.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - widget.offsetLeft;
        offsetY = e.clientY - widget.offsetTop;
        widget.style.transition = "none"; // Disable the transition while dragging. Meaning the when the widget moves, it will breifly pause, maybe not pause...
    });

    // Mouse Click Hold to Drag the Widget
    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            widget.style.left = e.clientX - offsetX + "px";
            widget.style.top = e.clientY - offsetY + "px";
        }
    });

    // Mouse Click Release to Stop Dragging the Widget
    document.addEventListener("mouseup", function () {
        isDragging = false;
        widget.style.transition = "box-shadow 0.3s ease";
    });
});