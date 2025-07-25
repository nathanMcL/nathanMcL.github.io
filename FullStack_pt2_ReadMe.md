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

### (07/08/2025.1200) Discord Live Stream

Using my Discord channel, create a way for viewers to watch (**NO** sensitive information).
My idea is to provide a way for people to see what goes into this project.
I want to use my  `OBS Studio` software for YouTube V-blog. YouTube (From what I know so far). When `live streaming` does not allow me to share a selected screen section (my coding environment). While also not having a pip view `live streaming` me. So, I am trying to figure out how to share. lol. <br>

When a user clicks on the `🎥 Live on MacN_iT`, the user is directed to my **`Discord Channel`** where the person can view the `live stream`. <br>

As I write this, I thought that I should provide some sort of visual and audible notification if I have my `Discord` channel `live streaming`. <br>

Next, I have to set up the `Mic` stuff, which I am a total novice at. I usually just type everything out... So, there's `"talking"` and there is not `"rambling, tangents, side-tracks"`, or jumping down a `"rabbit holes"`.<br>


### (07/09/2025.0325) `🎥 Live on MacN_iT`

Created a `Discord Widget`. The `Widget` is a created link using my `Discord` server `chat` and `voice` `ID`(s).
I am trying to figure out a way to include a `media-live-streaming` option. The `live-streaming` event would include my selected coding environment (s) and a pip-style pop-up of the host. I can't embed a Discord `Live Stream` media player in my website. So, I think it would be beneficial to include some type of visual and audible notification to indicate that I am live. I am not sure how I feel about the `🎥 Live on MacN_iT`. I want the concept of sharing my `live-status`. I'm not sure how I want to visually display this. <br>
I could change the `🎥 Live on MacN_iT` button to be stationary, maybe within the header. The `🎥 Live on MacN_iT` button is movable. It's currently movable because I am not sure where I want to place this. I want to embed a media player that, when I choose to `go live`, my other social media channels automatically pick up my `live stream`. <br>
I am thinking... I can use my `OBS Studios` software to record the `live stream`, while simultaneously notifying via `🎥 Live on MacN_iT` stationary banner that starts to visually glow, and play an audible tone for AT users. I think... That I could link my `OBS Studio` feed to trigger the `Discord` `Share your screen` and it will display the `live-stream` as I want it to. I think this will work with YouTube also, I just have to figure it out.<br>

### 🦇(07/10/2025.0530) Holy🦇bat scripts... .bat(s)🦇

One... Two... Or more things...<br>

Using `.bat` scripts that will help facilitate a `live stream` event. Once I figure out how to get my `OBS` studio 🦇software configured. The `.bat` scripts: <br>
    
1. `Stream On`: Automates (with a click) the process of navigating directly to the `live stream channel`, but then I have to click `share my screen` and select. <br>

 2. `Stream 🦇 Off`: Is intended to stop the `live stream`. (Currently, I am trying to get the `Stream Off` button on my desktop to stop the stream. So far I can only get it to say that the stream has been paused, not stopped.) <br>

This is fun... To improve this, I am going to have to use my  `OBS` studios🦇. Alter the `.bat` scripts to be used with `OBS` studios `Start Streaming` or `Start Recording` options. <br>

***Side Note...*** `OBS` Studios software has a streaming option, so once I get that sorted. I will configure that with all (owned🦇) social streaming platforms. Ensure the feeds display my coding space nicely.<br>
Then once I have `my` coding environment(s) set up for sharing `non-sensitive code/data`, I can click the `Stream On` shortcut buttons I create with the `.bat` scripts🦇.<br>


### (07/13/2025.0613) Fun side Project Over Complicated

This would be a good time to mention. Not all ideas are viable. I mean I could expand on the `.bat` script to navigate to select the `Share Your Screen`, then select a predetermined screen/window source. 
There are a few issues with doing just that. <br>
     1. `Discord's` going to detect the automated script. I would have to further develop the `.bat` scripts and incorporate a Python script. While also `flagging` my account (Not what I want). <br>
     2. The `Live Stream Status` effects other elements within the header, making it overcomplicated <br>
     3. I am just messing around; this side project takes away from what I am planning to accomplish. <br>
     4. `OBS` Studios is all I need at the moment anyway, it can connect to all sorts of socials. <br>
     5. I'm Extra... Muuahhahaha! <br>

I removed the instances of the `Live Stream Notification`. <br>

What I learned was how to create more uses for automated scripting. For what I have planned, learning how to automate different types of software for various functions, for various client needs, I think is beneficial. <br>

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


