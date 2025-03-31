# MacN_iT

## My Digital Space

What is the website's purpose?<br>

1. Start with the framework.<br>
2. See what functions/elements/instructions I can reuse per page.<br>
3. Experiment with something in a different. <br>
3. Responsive Design.<br>
4. Error Handling.<br>
5. Accessibility. <br>



### Index

- This site is not supposed to be glamorous or modern. <br>
- I started the 508 accessibility standards on the index page. I haven't tested it with ANDI yet, and I want to be done with the framework for the entire website first. The 508 standards will require me to make this entire website reconfigure in such a way that will re-design the visual look and behavior of how the website pages currently function.<br>

This is totally fine because I made my website crazy and fun for a reason. Once I implement 508 accessibility standards, I think visually explaining the standards will help reinforce my learning of these standards.<br>  

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

    - So! this is why I prefer *Python* to *HTML/CSS/JS*, is that with Python you simply use Python... Instead of HTML and JavaScript (but very arguable on factors). I know a little more about the different Python libraries than I do about using *HTML/CSS/JS*. <br>
        
        - 3a. In the Sub-Main: "sir_robot_container" I want to create small time of day scene that has the Sir Robot's background environment changing as if the Robot is walking through it. (something simple)<br>

        - 3b. Once a data-trait cloud such as (Diversity) is clicked, `Sir_Robot` animation *stops*, `Sir_Robot`'s arm is raised (image is swapped), and the background pauses. <br>

        - 3c. Lastly, the pop-up is closed, the `Sir_Robot` image is swapped back with the original image, and the background starts/un-pauses.<br>

 