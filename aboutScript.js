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
// Globals
let animationId; // For canceling the animation frame
let isGridView = false; // Grid View: The orbs are contained in a grid layout
let main;
let footer; // Footer boundary
let orbs = [
        { id: "orb_me", dx: 2, dy: 2 },
        { id: "orb_services", dx: -2, dy: 1.5 },
        { id: "orb_things", dx: 3, dy: 2.5 },
        { id: "orb_smile", dx: -3, dy: 1.75 }
    ];

document.addEventListener("DOMContentLoaded", function () {
    main = document.querySelector("main");
    footer = document.querySelector("footer");
    const toggle = document.getElementById("orbToggleSlide");

    if (!main) {
        console.error("Main or Footer section not found!");
        return;
    }

    initializeOrbs();
    animationId = requestAnimationFrame(moveOrbs);

    toggle?.addEventListener("change", function () {
        isGridView = this.checked;
        if (isGridView) {
            cancelAnimationFrame(animationId); // Stop the orb animation
            applyGridLayout(); // Apply grid layout
        } else {
            location.reload(); // Reset the layout manually
        }
    });

    // Click events for all the Popups
    orbs.forEach(({ id }) => {
        const orb = document.getElementById(id);
        const key = id.split("_")[1]; // Extract the key from the ID
        orb?.addEventListener("click", () => {
            const popup = document.getElementById(`popup_${key}`);
            if (popup) {
                popup.style.display = "block";
            } else {
                console.error(`Popup with ID '${popupId}' not found!`);
            }
        });
    });
    

    // Close button for all the popups
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", function () {
            const popupId = this.dataset.popup;
            const popup = document.getElementById(popupId);
            if (popup) {
                popup.style.display = "none";
            } else {
                console.error(`Popup with ID '${popupId}' not found!`);
            }
        });
    });

    function initializeOrbs() {
        const mainRect = main.getBoundingClientRect();

        orbs.forEach((orbObj, index) => {
            const orb = document.getElementById(orbObj.id);
            if (!orb) {
                console.error(`Orb with ID '${orbObj.id}' not found!`);
                return;
            }

            let validPosition = false, attempts = 0;
            while (!validPosition && attempts < 50) {
                const x = Math.random() * (mainRect.width - 100);
                const y = Math.random() * (mainRect.height - 100);
                validPosition = orbs.every((other, i) => {
                    if (i === index) return true;
                    const otherOrb = document.getElementById(other.id);
                    if (!otherOrb) return true;
                    const dx = x - otherOrb.offsetLeft;
                    const dy = y - otherOrb.offsetTop;
                    return Math.sqrt(dx * dx + dy * dy) > 120;
                });

                if (validPosition) {
                    orb.style.left = `${x}px`;
                    orb.style.top = `${y}px`;
                }
                attempts++;
            }
        });
    }

    // Move the orbs around the page
    function moveOrbs() {
        const mainRect = main.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();

        orbs.forEach((orbObj, index) => {
            const orb = document.getElementById(orbObj.id);
            if (!orb) return;

            let newLeft = orb.offsetLeft + orbObj.dx;
            let newTop = orb.offsetTop + orbObj.dy;

            // Bounce off the bottom of <main>, ensuring it does not fall into **before** the footer
            if (newLeft <= 0 || newLeft + orb.clientWidth >= main.clientWidth) {
                orbObj.dx *= -1;
                newLeft = Math.max(0, Math.min(main.clientWidth - orb.clientWidth, newLeft));
            }

            // Ensure the orb does not enter the footer
            if (newTop <= 0 || newTop + orb.clientHeight >= main.clientHeight) {
                orbObj.dy *= -1;
                newTop = Math.max(0, Math.min(main.clientHeight - orb.clientHeight, newTop));
            }

            orb.style.left = `${newLeft}px`;
            orb.style.top = `${newTop}px`;

            // Collision detection between orbs
            orbs.forEach((otherOrb, otherIndex) => {
                if (index !== otherIndex) {
                    const other = document.getElementById(otherOrb.id);
                    if (!other) return;

                    const dx = orb.offsetLeft - other.offsetLeft;
                    const dy = orb.offsetTop - other.offsetTop;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < orb.clientWidth) {
                        [orbObj.dx, otherOrb.dx] = [otherOrb.dx, orbObj.dx];
                        [otherOrb.dy, otherOrb.dy] = [otherOrb.dy, orbObj.dy];
                    }
                }
            });
        });

        animationId = requestAnimationFrame(moveOrbs);
    }
});

// Toggle: on/off the orbs.
// This function applies the grid layout to the orbs.
function applyGridLayout() {
    const orbElements = document.querySelectorAll(".bouncing-orb");
    const totalOrbs = orbElements.length;
    const columns = Math.ceil(Math.sqrt(totalOrbs));
    const rows = Math.ceil(totalOrbs / columns);
    const spacingX = main.clientWidth / columns;
    const spacingY = main.clientHeight / rows;

    orbElements.forEach((orb, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);

        orb.style.transition = "all 0.4s ease";
        orb.style.left = `${spacingX * col + spacingX / 2 - orb.clientWidth / 2}px`;
        orb.style.top = `${spacingY * row + spacingY / 2 - orb.clientHeight / 2}px`;
        orb.style.width = "100px";
        orb.style.height = "100px";
        orb.style.fontSize = "1.6rem";
        orb.style.boxShadow = "0 0 30px 10px rgba(0, 255, 255, 0.7), 0 0 60px 20px rgba(255, 255, 0, 0.4)";
        orb.classList.add("grid-effect");

        startGridAnimation(orb, i);
    });
}

function startGridAnimation(orb, index) {
    let angle = Math.random() * 360;
    let radiusX = 6 + Math.random() * 4;
    let radiusY = 6 + Math.random() * 4;
    let speed = 0.02 + Math.random() * 0.03;

    const pattern = index % 2 === 0 ? "diamond" : "triangle";
    const baseLeft = parseFloat(orb.style.left);
    const baseTop = parseFloat(orb.style.top);

    function animate() {
        angle += speed;
        let offsetX, offsetY;

        if (pattern === "diamond") {
            offsetX = Math.cos(angle) * radiusX;
            offsetY = Math.sin(angle) * radiusY;
        } else {
            offsetX = (Math.sin(angle) + Math.sin(2 * angle)) * radiusX / 2;
            offsetY = (Math.cos(angle) - Math.cos(2 * angle)) * radiusY / 2;
        }

        orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        requestAnimationFrame(animate);
    }

    animate();
}
// End of Orbs Script

// Orb Me: AI generated Content: API Fetch
document.getElementById("orb_me").addEventListener("click", async function () {
    const popup = document.getElementById("popup_me");
    const loader = document.getElementById("loader_me");
    const output = document.getElementById("about-orb-output");

    popup.style.display = "block";
    loader.style.display = "block";
    output.textContent = ""; // Clear previous content

    const cached = localStorage.getItem("about-orb-output");
    if (cached) {
        output.textContent = cached;
        loader.style.display = "none";
        return;
    }

    try {
        const response = await fetch("https://macn-about-api-djgzf3csevd3ewer.northeurope-01.azurewebsites.net/generate-aboutOrb", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context: "Use a tone that blends confidence with curiosity. Mention my creative tech projects, military background, and passion for equitable code. Intended for the MacN_iT About page." }) 
        });

        if (!response.ok) throw new Error("Fetch failed with status: " + response.status);

        const data = await response.json();
        const aboutText = data.about_text || "Sorry, I couldn't load my About Me content at the moment.";

        output.textContent = aboutText;
        console.log("✅ API returned:", aboutText);
        localStorage.setItem("about-orb-output", aboutText);

    } catch (err) {
        output.textContent = "There was an error contacting the server. Please try again later.";
        console.error("❌ Fetch error:", err);
    } finally {
        loader.style.display = "none";
    }
});