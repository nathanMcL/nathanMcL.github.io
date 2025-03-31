// Inspired Me Clouds
// Event Listener for the DOM
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("inspiration-container");
    const clouds = document.querySelectorAll(".inspiration-cloud");
    const popupContainer = document.getElementById("popup-container");

    // Next, we want to randomly place the clouds in the container without overlapping or going out of bounds.
    function positionClouds() {
        let positions = [];
        const margin = 20; // Margin from the edge of the container

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

// Sub-Main Section: Sir Robot Container / SubPopup Clouds 
document.addEventListener("DOMContentLoaded", function () {

    const sirRobotImage = document.getElementById("sirRobot");
    const robotImages = ["images/SirRobot_normal.png", "images/SirRobot_wave.png"];
    const popupCloudsContainer = document.getElementById("popup-clouds-container");
    const popupClouds = document.querySelectorAll(".subpopup-cloud");
    const popupContainer = document.getElementById("popup-container");

    // Function to swap the robot image
    function swapRobotImage(index) {
        sirRobotImage.style.opacity = 0;
        setTimeout(() => {
            sirRobotImage.src = robotImages[index];
            sirRobotImage.style.opacity = 1;
        }, 150);
    }

    // Have all the subpopup clouds hidden initially
    function hideSubpopups() {
        popupClouds.forEach(cloud => {
            cloud.classList.remove("visible");
            cloud.style.transform = "none";
        });
        popupCloudsContainer.style.display = "none";
    }

    hideSubpopups();

    // Decided the S-curve pattern was too much. Instead place the cloud_one to cloud_four at each corner of the popped up data-trait.
    function showClouds(activePopup) {
        const rect = activePopup.getBoundingClientRect();
        const positions = [
            { top: rect.top - 60, left: rect.left - 60 }, // Top Left corner: cloud_one
            { top: rect.top - 60, left: rect.right + 10 }, // Top Right corner: cloud_two
            { top: rect.bottom + 10, left: rect.left - 60 }, // Bottom Left corner: cloud_three
            { top: rect.bottom + 10, left: rect.right - 10 }, // Bottom Right corner: cloud_four
        ];

        popupCloudsContainer.style.display = "block";

        popupClouds.forEach((cloud, index) => {
            cloud.style.top = `${positions[index].top}px`;
            cloud.style.left = `${positions[index].left}px`;
            setTimeout(() => cloud.classList.add("visible"), 200 * (index + 1)); 
        });

        animatePopupClouds();
    }

    // Reusing the animateClouds() logic for the sub-popup clouds
    function animatePopupClouds() {
        popupClouds.forEach(cloud => {
            let angle = Math.random() * 360;
            let radiusX = 5 + Math.random() * 10;
            let radiusY = 3 + Math.random() * 8;
            let speed = 0.015 + Math.random() * 0.035;

            function moveCloud() {
                angle += speed;
                let offsetX = Math.cos(angle) * radiusX;
                let offsetY = Math.sin(angle) * radiusY;

                cloud.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                requestAnimationFrame(moveCloud);
            }
            moveCloud();
        });
    } 

    // Main Event Listener to trigger the clouds and popups    
    document.querySelectorAll(".inspiration-cloud").forEach((cloud) => {
        cloud.addEventListener("click", function () {
            const trait = cloud.dataset.trait.trim().replace(/\s+/g, "_");
            const popup = document.getElementById(`popup_${trait}`);

            if (popup) {
                // if user clicks a cloud the clouds pop-up in the ordered S-curve pattern
                document.querySelectorAll(".cloud-popup").forEach(p => p.classList.remove("active"));
                popupContainer.classList.add("active");
                popup.classList.add("active");

                // Swap the Sir Robot image to wave upon clicking any popup
                swapRobotImage(1);

                // Display the S-cirved clouds 
                // ***Side note, naming convention is important. Relized "hideSubpopups" is confusing when attempting to show the clouds. 
                hideSubpopups(); // Hide the subpopups first
                showClouds(popup); // Show clouds 
            } else {
                console.error(`Popup #popup_${trait} not found!`);
            }
        });
    });

    // Close button and clicking outside the popup closes it and resets the image/clouds
    // For Close Buttons
    document.querySelectorAll(".close-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const popupId = this.dataset.popup;
            const popup = document.getElementById(popupId);

            if (popup) {
                popup.classList.remove("active");
                popupContainer.classList.remove("active");
                swapRobotImage(0);
                hideSubpopups();
            }
        });
    });

    // For Popup Container (background click to close)
    popupContainer.addEventListener("click", function (event) {
        if (event.target === this) {
            document.querySelectorAll(".cloud-popup").forEach(popup => popup.classList.remove("active"));
            popupContainer.classList.remove("active");
            swapRobotImage(0);
            hideSubpopups();
        }
    });
});