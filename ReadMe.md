# MacN_iT

## My Digital Space

What is the website's purpose?<br>

1. Start with the framework.<br>
2. See what functions/elements/instructions I can reuse per page.<br>
3. Experiment with something in a different way. <br>
3. Responsive Design.<br>
4. Error Handling.<br>
5. Accessibility. <br>

### (05/13/2025.1030) Updating CSP 

While learning about Accessibility Software, I am learning about how AT users interact with the software (How I currently understand). Seeing how an AT user's software interprets the presented images and textual content is helpful, it has shown me what is unclear from the perspective of how an AT user might receive content. <br>
I have to go through and provide a better description of the images in their HTML.<br> 

Example:<br>

`<title>MacN the Full Stack... Home</title>`<br>
On each page within the MacN the Full Stack `HTML` file, there is a `title`. The `title` is read by the screen reader. Each *page* within the website should have some description that clearly states what it is, in this case, each page has the matching name of the intended purpose of the page...<br>
This also goes for images. For instance, the `little robot` logo image and the `@MacN_iT` color changing text might require better description within the `HTML` `id`'s and or `role`'s.<br>

But what in the hockey sticks does that have to do with the `CSP`?<br>
Well, because I want to add to or allow a resource to be used or viewed (to me), you want to provide a secure viewing experience. To me, that is why you want to mitigate the possible security exploits. 
I created another Readme file regarding CSP security Hardening. I think this is helpful to know why and what it is, and the importance of improving the site security.<br>

***Note*** My `MacN_iT` little website is not a professional production website. That said, I think it is important to always seek improvements.<br>


### Index

- This site is not supposed to be glamorous or modern. <br>
- I started learning about the 508 accessibility standards (Certification).<br>
On the index page. I haven't tested it with ANDI yet.<br> 
I want to be done with the framework for all the web pages first. The 508 standards will require me to reconfigure this entire website in a way that redesigns (I'm not sure how to phrase this concept) the visual look and behavior of how the website pages currently function.<br>

This is totally fine because I made my website crazy and fun for a reason. Once I implement the 508 accessibility standards, I think visually explaining the standards will help reinforce my learning of these standards.<br>  

---
(04/13/2025.1000)

Thinking of ways to display my mind map...<br>

---
(04/15/2025.1230)<br>

The way I use the `Mind Map` is to visualize the block of functions, for instance:<br>
```    
    - Moving: Map functions that have moving elements. 
    
    - Interacting: Map functions that have interacting elements.
    
    - Linking: Map *out-going* links (links navigating away from the website)
```

The `Mind Map` is just a wireframe diagram, a visual representation of the functions associated with each webpage.<br>
The important thing to me is that it helps me understand the individual functions or processes that are happening on the webpage.<br>

Funky on my `Mind Map`:
I just had an idea...<br>
I think using the same method of displaying the `Readme.md` (write-up notes).<br>
After scrolling down past the *thoughts* (Blog) *write-up notes*, I could create a simple screen scrollable & zoom(+/-), read only...<br>
Display of the `Mind Map`.
```
    - Scrollable, Zoom(+/-), Read only
    - Responsive design sizes
    - Accessibility 
    (I'm not sure how this will work yet. There are lines and shapes leading to and from entities.)
```
---

#### Index: Accessibility (04/13/2025.1000)

On the Index page. I am thinking of how to implement a *voice-over* in such a way to "show" (terminology) how a visually impaired user might interact with a web page (without having the non-visually impaired user donwload software).<br> 
I have used AI-voice scripts, that would be a fun challenge to implement.<br>
For "display" purposes I think I will just obscure my voice. Ahh! thats team too much. lol) and read the Index page *text* Elements:<br>

Example: <br>

```
Home
About
Inspirations
Thoughts
Tools
Contact
```

And all the main content `Welcome` verbiage... I will have to do this in a way that represents how the `Accessibility Tools` `(AT)` actully speak the textual content.<br>

- However! I could or I am thinking the way to do this would be to save the audio file from the `AT`(Honestly not sure how to approach this).<br>
    - Create an audio associated radial button that functions with the *tab* key. To *tab* through the different elements on the page.<br>
    - I think this is helpful to to understand how people might have to receive content.<br>

### (05/05/2025.1200) Accessibility `ANDI`.

Testing ANDI on the `index` welcome page.<br>

Received this message: <br>
```
This page has a Content Security Policy that blocks scripts like ANDI. For help, visit the ANDI Help FAQ page.
```
<br>


...Real quick what is `ANDI`...

```
Accessible Name & Description Inspector (ANDI) tool, a web accessibility inspection tool, which performs single page testing to automatically detect accessibility issues.
```

(05/06/2025.1415) Accessibility `ANDI`.
Note...<br>
I am working through `Content Structures`, still learning.
`ANDI` is a developer's type of tool used to inspect web pages.<br>
I do not want to change my `CSP` (Content Security Policy) because that would open up this website for possible `blob` attacks.
`ANDI` would be used within a *Not Live* environment on a company's mirrored production website. <br>

Accessibility Technology users might be using other software such as: <br>

- Screen readers (NVDA, JAWS, VoiceOver)

- Switch controls

- Zoom text

- Native browser assistive tech

So, still learning.<br>

### But Wait! What is a `Blob` attack?
A `Blob` attack is a JavaScript-based exploit that uses `Blob` URLs. When there is a *weak* `CSP` (Content Security Policy), it can bypass security restrictions.<br>

I don't think explaining why it's dangerous and how it could happen is necessary here.<br>

You can improve the CSP with these additions:<br> 
- object-src 'none';
- script-src 'self';
- base-uri 'none';

### (05/07/2025.0625) `Skip to main content`

The `Skip to main content`, I cannot tell if it is focusing on the main content... When I have tested *test* web pages, the `Skip to main content` has moved the focus to the `<main></main>` content, and visually moved the screen to focus on the page's main content. <br> 
The issue I *"think"* I have is:<br>
When the page is in full screen, I am unable to tell if the `Skip to main content` option works because the page has no additional scrollable content.<br>
- When I shrunk the screen size, I was able to verify that when the `Skip to main content` is selected, it jumps to the `<main></main>` content, which is good. <br>
- I want to find out if there is some subtle visual identifier that could be used to very quickly visually identify that the main content *"Now in Focus"*.<br>

...TODO: Find professional websites that have `accessibility` features. See if the sites have a `Skip to main content` option, and test it. How does their site focus on the `main content`?<br>
I understand there might not be a standard visual focus identifier, because to me, an identifier could be some sort of visually noticeable focusable change.<br>
I'm not sure, so it could be a little star that appears and glows to where the main content starts for 10 seconds, then disappears. This isn't that serious, but I noticed it and want to better understand.<br>

### (05/13/2025.1030) `NVDA` Screen Reader

I downloaded and set up the `NVDA` software. The Software is intended to assist technology users without sight or other needs. I probably used the software for about ten minutes. 
I used it on my MacN_iT site ( `https://nathanmcl.github.io/index.html` ).<br>
I quickly realized that my site was still missing the necessary code to `enable` `AT` users' software to read my front-facing text or even describe the little robot image and title.<br>
Much to do!!!<br>


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

### (05/20/2025.1400) About `Slide Button`

I like the orbs... They're just so much fun to be distracted by.<br>
I've been thinking that the orbs should have a chill mode.<br>
The `Slide Button` will stop the orbs from bouncing and place them in a 2-by-2 grid.<br>
If, for whatever reason, I decided to add more orbs. The succession of orbs would scale in comparison to the space within the orb section (In theory)<br>  

### Update to `aboutScript.js`

Hopefully improved the error handling or orb parameters for keeping them from going off screen.<br>

## (05/27/2025.0800) About: Orb: `Me` 

***YadaYadaYada…BoomBoom…Poppn’…***<br>

-	A short and possibly concise biography.  For *luls*… 😝<br>

### Orb: `Me`: MacN API Server

What’s up with the `Me` orb?<br>
For this `About` page. I want to keep it fun and experimental. So, I came up with an idea to implement an AI model coupled with a custom `message=[…]` that I am hoping will generate content closely aligned with information about myself that I hard-coded:<br>

-	 ***Role***: The `role` could be thought of as `what` type of personality or perspective would you like the AI to adopt?<br>
o	Friendly tone?
o	Reflective?
o	Confident but informal
You are not just asking the AI to return information – you’re asking it to *”act”* a certain way when it communicates.<br>
You could base this on your sense of humor, tone, and voice, or even how you want people to feel when they read this *“self-description”*.<br>

-	***System***: In the `system` section you are *establishing* the *settings*.
The `system context` could include: 
o	What it’s supposed to talk about. 
o	What it’s not supposed to do (like avoid generic corporate jargon)
The `system` settings are like briefing a creative writer before they draft your intro blurb.<br> 

-	***Content***:  In the `content` section, you are supplying the AI with the *key* information it can draw from: 
o	This could be based on your personal data.
o	 Experiences
o	Achievements
o	Informal vs Formal style
The `content` is a source that the AI can draw from to generate the final `output` using the mindset and rules that were defined.<br>

```
messages = [
            {
                "role": "system",
                "content": (…) …}
            ]
```



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
        - 3f. Figure out...list my thoughts...<br>

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

- (05/04/2025.1050) I was able to display the MacN_iT wire diagram on the `Thoughts` / `Blog.html` page. If I make any changes I will have to upload a new .html.<br>

To get the draw.io html file to display in a read only zoom and scrollable format. I had to update the `blog.html` file `meta` tag and `src`.<br>

### Tools

- This page needs more thought. I like the idea of having different drop down tool tabs.<br>
---
- (04/14/2025.1320)
At one point I think creating some sort of `HUD` display that has multiple catergorized digital tools (links/resources).<br>


---
   

### Contact

(04/13/2025.16:30)
I haven't gotten to this page yet. Not sure how I want to do this page.<br>

### Projects Page

(04/14/2025.1320)

I think creating a page that displays read only windowed read me write-ups of other projects could be useful.<br>



