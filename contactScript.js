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

// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const profileCard = document.getElementById('profile-card');
    const popoutContainer = document.getElementById('popout-container');
    const closePopout = document.getElementById('close-popout');

    // Function to show the popout
    const showPopout = () => {
        popoutContainer.classList.remove('hidden');
    };

    // Function to hide the popout
    const hidePopout = () => {
        popoutContainer.classList.add('hidden');
    };

    // Event listener to show popout when profile card is clicked
    profileCard.addEventListener('click', showPopout);

    // Event listener to hide popout when close button is clicked
    closePopout.addEventListener('click', hidePopout);

    // Event listener to hide popout when clicking outside the popout content
    popoutContainer.addEventListener('click', (event) => {
        if (event.target === popoutContainer) {
            hidePopout();
        }
    });

    // Close popout with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popoutContainer.classList.contains('hidden')) {
            hidePopout();
        }
    });
});