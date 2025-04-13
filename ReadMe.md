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

(04/13/2025.1000)

Thinking of ways to display my mind map...<br>

#### Index: Accessibility (04/13/2025.1000)

On the Index page. I am thinking of how to implement a *voice-over* in such a way to "show" (terminology) how a visually impaired user might interact with a web page (without having the non-visually impaired user donwload software).<br> 
I have used AI-voice scripts, that would be a fun challenge to implement.<br>
For "display" purposes I think I will just obsure my voice (Ahh! thats team too much. lol) and read the Index page *text* Elements:<br>

Example: <br>

```
Home
About
Inspirations
Thoughts
Tools
Contact
```

And all the main content `Welcome` verbage... I will have to do this in a way that represents how the `Accessibility Tools` `(AT)` actully speak the textual content.<br>

- However! I could just record/save the audio file from the `AT`.<br>
    - Create an audio associated radial button that functions with the *tab* key. To *tab* through the different elements on the page.<br>
    - I think this is helpful to to understand how people might have to receive content.<br>
  

### About (me/the team/your brand)

(04/13/2025)

This `About` *Me* page, currently does not *"tell"* `About Me`. <br>
That said, I do plan to, some type of way write-up a self-BIO for the `Me` orb. <br>
Anything else can always be changed...<br>

---

This page displays a delayed for 5 seconds `Marquee` carousel (loop). The Marque Shows: Frameworks, Programming Languages, Software Related logos. <br>
The `marquee` does not have all the things I am familure with, just - probably most used...<br> 

#### The `Main Section` *Orbs*

In a way, one of my of first Java programs was a ball that bounced around the edges of the webpage window/container. <br>
I wanted to implement this, creating a container that has four orbs bouncing off each other and the walls/edges of the container.<br>
To improve this page I should improve the error handling.<br>
    - I noticed after the orbs have been bouncing around the `Main Section` for sometime that *bugs* or *unexpected behavior* happens.<br>
        - 1. going off screen<br>
        - 2. On my phone the orbs are too fast. <br>
                - Should orbs be slowed down for smaller screens? <br>
                - Is that CSS, or JS to adjust the speed for phones? <br>


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

        - 3a. Once a data-trait cloud such as (Diversity) is clicked, `Sir_Robot` animation *stops*, `Sir_Robot`'s arm is raised (image is swapped), and the background pauses. <br>

        - 3b. Next, the pop-up is closed, the `Sir_Robot` image is swapped back with the original image, and the background starts/un-pauses.<br>

    - In the `Sub-Main Container`: Background: <br>

        -  3c. The Background: I want to create small time of day scene that has the Sir Robot's background environment changing as if the Robot is walking through it, I think updating/adding the `Sir_Robot` images to look like it is walking. (something simple)<br>

        - 3d. Figure out how to incorperate the `Sub-Main Container` time of day animated background with the light/dark time switch based off a users location.?. I am not sure if my phrasing/terminology is sound. I don't want to know the users location or time zone. So, how to swap the background animation to nighttime is user-a is located in a location where it maybe currently nighttime? <br>  
        - 3f. Figure out...

### Thoughts

- Shared link to this ReadMe.<br>
- Thinking of creating a `read only` window within the thoughts (blog) paragrapha section.<br>
        - This way the if someone chooses to view the `ReadMe`(write-up notes), they *are not* redirected a different website.<br>
        - (04/09/2025) Started read only framework for the *paragraph* section <p></p>. <br>
        - Using `fetch` and `catch`: <br>
            - `Fetch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)<br>
            - `Catch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)<br>

        - Using `Marked.js` to format and display the `GitHub` located `Readme.md` file.<br>
        - `Marked.js`: **Noted Source** (https://marked.js.org/)

- (04/09/2025.1400) *Test* Read Only GitHub ReadMe web-display.

### Tools

- This page needs more thought. I like the idea of having different drop down tool tabs.   

### Contact

 
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

(04/13/2025.1000)

Thinking of ways to display my mind map...<br>

#### Index: Accessibility (04/13/2025.1000)

On the Index page. I am thinking of how to implement a *voice-over* in such a way to "show" (terminology) how a visually impaired user might interact with a web page (without having the non-visually impaired user donwload software).<br> 
I have used AI-voice scripts, that would be a fun challenge to implement.<br>
For "display" purposes I think I will just obsure my voice (Ahh! thats team too much. lol) and read the Index page *text* Elements:<br>

Example: <br>

```
Home
About
Inspirations
Thoughts
Tools
Contact
```

And all the main content `Welcome` verbage... I will have to do this in a way that represents how the `Accessibility Tools` `(AT)` actully speak the textual content.<br>

- However! I could just record/save the audio file from the `AT`.<br>
    - Create an audio associated radial button that functions with the *tab* key. To *tab* through the different elements on the page.<br>
    - I think this is helpful to to understand how people might have to receive content.<br>
  

### About (me/the team/your brand)

(04/13/2025)

This `About` *Me* page, currently does not *"tell"* `About Me`. <br>
That said, I do plan to, some type of way write-up a self-BIO for the `Me` orb. <br>
Anything else can always be changed...<br>

---

This page displays a delayed for 5 seconds `Marquee` carousel (loop). The Marque Shows: Frameworks, Programming Languages, Software Related logos. <br>
The `marquee` does not have all the things I am familure with, just - probably most used...<br> 

#### The `Main Section` *Orbs*

In a way, one of my of first Java programs was a ball that bounced around the edges of the webpage window/container. <br>
I wanted to implement this, creating a container that has four orbs bouncing off each other and the walls/edges of the container.<br>
To improve this page I should improve the error handling.<br>
    - I noticed after the orbs have been bouncing around the `Main Section` for sometime that *bugs* or *unexpected behavior* happens.<br>
        - 1. going off screen<br>
        - 2. On my phone the orbs are too fast. <br>
                - Should orbs be slowed down for smaller screens? <br>
                - Is that CSS, or JS to adjust the speed for phones? <br>


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

        - 3a. Once a data-trait cloud such as (Diversity) is clicked, `Sir_Robot` animation *stops*, `Sir_Robot`'s arm is raised (image is swapped), and the background pauses. <br>

        - 3b. Next, the pop-up is closed, the `Sir_Robot` image is swapped back with the original image, and the background starts/un-pauses.<br>

    - In the `Sub-Main Container`: Background: <br>

        -  3c. The Background: I want to create small time of day scene that has the Sir Robot's background environment changing as if the Robot is walking through it, I think updating/adding the `Sir_Robot` images to look like it is walking. (something simple)<br>

        - 3d. Figure out how to incorperate the `Sub-Main Container` time of day animated background with the light/dark time switch based off a users location.?. I am not sure if my phrasing/terminology is sound. I don't want to know the users location or time zone. So, how to swap the background animation to nighttime is user-a is located in a location where it maybe currently nighttime? <br>  
        - 3f. Figure out...

### Thoughts

- Shared link to this ReadMe.<br>
- Thinking of creating a `read only` window within the thoughts (blog) paragrapha section.<br>
        - This way the if someone chooses to view the `ReadMe`(write-up notes), they *are not* redirected a different website.<br>
        - (04/09/2025) Started read only framework for the *paragraph* section <p></p>. <br>
        - Using `fetch` and `catch`: <br>
            - `Fetch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)<br>
            - `Catch`: **Noted Source** (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)<br>

        - Using `Marked.js` to format and display the `GitHub` located `Readme.md` file.<br>
        - `Marked.js`: **Noted Source** (https://marked.js.org/)

- (04/09/2025.1400) *Test* Read Only GitHub ReadMe web-display.

### Tools

- This page needs more thought. I like the idea of having different drop down tool tabs.   

### Contact

 
