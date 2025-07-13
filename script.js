// Live Stream Notification Orb (07/08/2025.0700.NBM)
document.addEventListener("DOMContentLoaded", function () {
    const orb = document.getElementById("stream-orb");
    const announcement = document.getElementById("stream-announcement");

    async function checkLiveStatus() {
        try {
            const res = await fetch("https://macn-api.azurewebsites.net/youtube_status.json");
            const data = await res.json();
            
            // Update the orb and announcement based on live status
            if (data.live) {
                orb.classList.add("live");
                announcement.textContent = "Stream is LIVE! on YouTube.";
            } else {
                orb.classList.remove("live");
                announcement.textContent = "Stream is currently offline.";
            }
        } catch (e) {
            console.error("Failed to check stream status:", e);
        }
    }
    // Initial check
    checkLiveStatus();
    setInterval(checkLiveStatus, 15000); // Every 15 seconds
});