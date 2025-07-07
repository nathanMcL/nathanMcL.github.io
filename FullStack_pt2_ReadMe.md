# MacN_iT

My Digital Space (Continued)<br>

### (07/06/2025.1500) Drop-Down Readme toggles<br>

Created and testing a way to break up my thoughts so they don't become a giant wall of nonsense. 
Using elongated buttons, that represent the different readme files of the **Main** sections:<br>

- Full Stack Thoughts<br>
- Cyber Curiosity<br>
- Back-End<br>

The original *Full Stack Thoughts* `ReadMe.md` Blog Styles is the Main style.
When the additional button (btn2) is clicked, the *New* `FSpt2Styles` Readme Styles is rendered.
The original `Profile Image` will get swapped out with the `Profile Image` of the *New* `FSpt2Styles`.
This `ReadMe` and `Profile Image` swap happened below `Loading Thought and Notes heading`.<br>



### Inspired Me

Responsive design is sort of fun in the aspect of noticing how different devices or screen size affects the design.<br>

#### Removed Cyber Grid Network Packet Animation

1. Removed the Network Packet Animation (Needs more thought and work).<br>

For future me... Maybe have the network animation be in the absolute background of the page, but real subtle - like almost have it be the same color, but with the shadows and other CSS elements???<br>

```
/* Cyber-Grid Background */
@keyframes cyberGrid {
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%;}
}

.cyber-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(45deg, var(--first-color) 25%, var(--third-color) 50%, var(--fourth-color) 75%);
    background-size: 400% 400%;
    opacity: 0.15; /* Adjust the opacity as needed */
    z-index: -1;
    animation: cyberGrid 10s infinite linear;
    overflow: hidden;
    pointer-events: none;
}

/* Network Packet Animation */
.network-packet {
    position: absolute;
    top: -20px;
    color: rgba(0, 255, 170, 1); /* Cyber green */
    font-family: "Courier New", monospace;
    font-size: 14x;
    opacity: 1;
    pointer-events: none;
    animation: floatPackets 10s linear infinite;
    text-shadow: 0 0 5px rgba(0, 255, 170, 0.9), 0 0 10px rgba(0, 255, 170, 0.7);
}

@keyframes floatPacket {
    0% { transform: translateY(0px); opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
}
/* End Network Packet Animation */
```

JS:<br>

```
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
```

2. The `Main Container`: <br>

    - Have the background be based (user location) on the time🕜 of 🌞day🌚... I am thinking🧐 of a stop-motion background, or maybe simply create a South Park-inspired time of day background. Probably without a cityscape. A skyline of some birds, night-stars...<br>

3. The `Sub-Main Container`: <br>

    - `Sir_Robot` image <br>

        - 3a. Once a data-trait cloud, such as (Diversity) is clicked, `Sir_Robot` animation *stops*, `Sir_Robot`'s arm is raised (image is swapped), and the background pauses. <br>

        - 3b. Next, the pop-up is closed, the `Sir_Robot` image is swapped back with the original image, and the background starts/un-pauses. <br>

    - In the `Sub-Main Container`: Background: <br>

        -  3c. The Background: I want to create small time of day scene that has the Sir Robot's background environment changing as if the Robot is walking through it, I think updating/adding the `Sir_Robot` images to look like it is walking. (something simple) <br>

        - 3d. Figure out how to incorporate the `Sub-Main Container` time of day animated background with the light/dark time switch based on a user's location.?. I am not sure if my phrasing/terminology is sound. I don't want to know the user's location or time zone. So, how to swap the background animation to nighttime is user A is located in a location where it may be currently nighttime? <br>  
        - 3f. Figure out...list my thoughts...<br>

### Thoughts

1. Shared link to this ReadMe.<br>
2. Thinking of creating a `read only` window within the thoughts (blog) paragraph section.<br>
    - This way the if someone chooses to view the `ReadMe`(write-up notes), they *are not* redirected a different website. <br>
    - (04/09/2025) Started read only framework for the *paragraph* section <p></p>. <br>
    - Using `fetch` and `catch`: <br>
    - `Fetch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)<br>
    - `Catch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web
                /JavaScript/Reference/Statements/try...catch) <br>

    - Using `Marked.js` to format and display the `GitHub` located `Readme.md` file. <br>
    - `Marked.js`: **Noted Source** (https://marked.js.org/)

(04/09/2025.1400) *Test* Read Only GitHub ReadMe web-display.

(05/04/2025.1050) I was able to display the MacN_iT wire diagram on the `Thoughts` / `Blog.html` page. If I make any changes, I will have to upload a new .html. <br>

To get the draw.io HTML file to display in a read-only zoom and scrollable format. I had to update the `blog.html` file `meta` tag and `src`. <br>

### Tools

This page needs more thought. I like the idea of having different drop-down tool tabs. <br>

---

- (04/14/2025.1320)
At one point, I think creating some sort of `HUD` display that has multiple categorized digital tools (links/resources). <br>

---
   
### Contact

(04/13/2025.16:30)
I haven't gotten to this page yet. Not sure how I want to do this page. 
This page should have a modern design.<br>

### Projects Page

(04/14/2025.1320)<br>

I think creating a page that displays read-only, windowed read-me write-ups of other projects could be useful. <br>


