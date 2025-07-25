# MacN_iT

## My Digital Space

What is the website's purpose? <br>

1. Start with the framework. <br>
2. See what functions/elements/instructions I can reuse per page. <br>
3. Experiment with something in a different way. <br>
3. Responsive Design. <br>
4. Error Handling. <br>
5. Accessibility. <br>

### (05/13/2025.1030) Updating CSP 

While learning about Accessibility Software, I am learning about how AT users interact with the software (How I currently understand). Seeing how an AT user's software interprets the presented images and textual content is helpful, it has shown me what is unclear from the perspective of how an AT user might receive content. <br>
I have to go through and provide a better description of the images in their HTML. <br> 

Example:<br>

`<title>MacN the Full Stack... Home</title>`<br>
On each page within the MacN the Full Stack `HTML` file, there is a `title`. The `title` is read by the screen reader. Each *page* within the website should have some description that clearly states what it is, in this case, each page has the matching name of the intended purpose of the page...<br>
This also goes for images. For instance, the `little robot` logo image and the `@MacN_iT` color changing text might require better description within the `HTML` `id`'s and or `role`'s.<br>

But what in the hockey sticks does that have to do with the `CSP`?<br>
Well, because I want to add to or allow a resource to be used or viewed (to me), you want to provide a secure viewing experience. To me, that is why you want to mitigate the possible security exploits. 
I created another Readme file regarding CSP security Hardening. I think this is helpful to know why and what it is, and the importance of improving the site security. <br>

***Note*** My `MacN_iT` little website is not a professional production website. That said, I think it is important to always seek improvements. <br>

### Index

- This site is not supposed to be glamorous or modern. <br>
- I started learning about the 508 accessibility standards (Certification).<br>
On the index page. I haven't tested it with ANDI yet.<br> 
I want to be done with the framework for all the web pages first. The 508 standards will require me to reconfigure this entire website in a way that redesigns (I'm not sure how to phrase this concept) the visual look and behavior of how the website pages currently function. <br>

This is fine because I made my website crazy and fun for a reason. Once I implement the 508 accessibility standards, I think visually explaining the standards will help reinforce my learning of these standards. <br>  

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

The `Mind Map` is just a wireframe diagram, a visual representation of the functions associated with each webpage. <br>
The important thing to me is that it helps me understand the individual functions or processes that are happening on the webpage. <br>

Funky on my `Mind Map`:
I just had an idea...<br>
I think using the same method of displaying the `Readme.md` (write-up notes).<br>
After scrolling down past the *thoughts* (Blog) *write-up notes*, I could create a simple screen scrollable & zoom (+/-), read only...<br>
Display of the `Mind Map`.
```
    - Scrollable, Zoom (+/-), Read only
    - Responsive design sizes
    - Accessibility 
    (I'm not sure how this will work yet. There are lines and shapes leading to and from entities.)
```
---

#### Index: Accessibility (04/13/2025.1000)

On the Index page. I am thinking of how to implement a *voice-over* in such a way to "show" (terminology) how a visually impaired user might interact with a web page (without having the non-visually impaired user download software).<br> 
I have used AI-voice scripts, which would be a fun challenge to implement. <br>
For "display" purposes, I think I will just obscure my voice. Ahh! That's team too much. lol) and read the Index page *text* Elements:<br>

Example: <br>

```
Home
About
Inspirations
Thoughts
Tools
Contact
```

And all the main content `Welcome` verbiage... I will have to do this in a way that represents how the `Accessibility Tools` `(AT)` speak the textual content.<br>

- However! I could, or I am thinking the way to do this would be to save the audio file from the `AT`(Honestly, not sure how to approach this).<br>
    - Create an audio-associated radial button that functions with the *tab* key. To *tab* through the different elements on the page.<br>
    - I think this is helpful to understand how people might have to receive content.<br>

### (05/05/2025.1200) Accessibility `ANDI`.

Testing ANDI on the `index` welcome page. <br>

Received this message: <br>
```
This page has a Content Security Policy that blocks scripts like ANDI. For help, visit the ANDI Help FAQ page.
```
<br>

...Real quick, what is `ANDI`...

```
Accessible Name & Description Inspector (ANDI) tool, a web accessibility inspection tool, which performs single-page testing to automatically detect accessibility issues.
```

(05/06/2025.1415) Accessibility `ANDI`.
Note...<br>
I am working through `Content Structures`, still learning.
`ANDI` is a developer's type of tool used to inspect web pages. <br>
I do not want to change my `CSP` (Content Security Policy) because that would open this website for possible `blob` attacks.
`ANDI` would be used within a *Not Live* environment on a company's mirrored production website. <br>

Accessibility Technology users might be using other software such as: <br>

- Screen readers (NVDA, JAWS, Voiceover)

- Switch controls

- Zoom text

- Native browser assistive tech

So, still learning. <br>

### But wait! What is a `Blob` attack?
A `Blob` attack is a JavaScript-based exploit that uses `Blob` URLs. When there is a *weak* `CSP` (Content Security Policy), it can bypass security restrictions. <br>

I don't think explaining why it's dangerous and how it could happen is necessary here. <br>

You can improve the CSP with these additions:<br> 
- object-src 'none';
- script-src 'self';
- base-uri 'none';

### (05/07/2025.0625) `Skip to main content`

The `Skip to main content`, I cannot tell if it is focusing on the main content... When I have tested *test* web pages, the `Skip to main content` has moved the focus to the `<main></main>` content, and visually moved the screen to focus on the page's main content. <br> 
The issue I *"think"* I have is:<br>
When the page is in full screen, I am unable to tell if the `Skip to main content` option works because the page has no additional scrollable content. <br>
- When I shrunk the screen size, I was able to verify that when the `Skip to main content` is selected, it jumps to the `<main></main>` content, which is good. <br>
- I want to find out if there is some subtle visual identifier that could be used to very quickly visually identify that the main content *"Now in Focus"*. <br>

...TODO: Find professional websites that have `accessibility` features. See if the sites have a `Skip to main content` option, and test it. How does their site focus on the `main content`? <br>
I understand there might not be a standard visual focus identifier, because to me, an identifier could be some sort of visually noticeable focusable change. <br>
I'm not sure, so it could be a little star that appears and glows to where the main content starts for 10 seconds, then disappears. This isn't that serious, but I noticed it and want to better understand. <br>

### (05/13/2025.1030) `NVDA` Screen Reader

I downloaded and set up the `NVDA` software. The Software is intended to assist technology users without sight or other needs. I probably used the software for about ten minutes. 
I used it on my MacN_iT site (`https://nathanmcl.github.io/index.html`).<br>
I quickly realized that my site was still missing the necessary code to `enable` `AT` users' software to read my front-facing text or even describe the little robot image and title. <br>
Much to do!!!<br>

### About (me/the team/your brand)

(04/13/2025)

This `About` *Me* page, currently does not *"tell"* `About Me`. <br>
That said, I do plan to, some type of way write-up a self-BIO for the `Me` orb. <br>
Anything else can always be changed...<br>

---

This page displays a delayed for 5 seconds `Marquee` carousel (loop). The Marque Shows: Frameworks, Programming Languages, Software Related logos. <br>
The `marquee` does not have all the things I am familiar with, just - probably most used...<br> 

#### The `Main Section` *Orbs*

In a way, one of my first Java programs was a ball that bounced around the edges of the webpage window/container. <br>
I wanted to implement this, creating a container that has four orbs bouncing off each other and the walls/edges of the container. <br>
To improve this page, I should improve the error handling. <br>
    - I noticed after the orbs have been bouncing around the `Main Section` for some time that *bugs* or *unexpected behavior* happen. <br>
        - 1. going off screen<br>
        - 2. On my phone, the orbs are too fast. <br>
                - Should orbs be slowed down for smaller screens? <br>
                - Is that CSS or JS to adjust the speed for phones? <br>

### (05/20/2025.1400) About `Slide Button`

I like the orbs... They're just so much fun to be distracted by. <br>
I have been thinking that the orbs should have a chill mode. <br>
The `Slide Button` will stop the orbs from bouncing and place them in a 2-by-2 grid. <br>
If, for whatever reason, I decided to add more orbs. The succession of orbs would scale in comparison to the space within the orb section (In theory) <br>  

### Update to `aboutScript.js`

Hopefully, improved the error handling or orb parameters for keeping them from going off screen. <br>

### (05/27/2025.0800) About: Orb: `Me` 

***YadaYadaYada…BoomBoom…Poppn’…***<br>

-   A short and possibly concise biography.  For *luls*… 😝<br>

### Orb: `Me`: MacN API Server?

What’s up with the `Me` orb?<br>
Something about content from a server not loading...<br>
For this `About` page. I want to keep it fun and experimental. So, I came up with an idea to implement an AI model coupled with a custom `message=[…]` that I am hoping will generate content closely aligned with information about myself that I hard-coded:<br>

***Message***: The `message = []` consists of these parameters: an assigned `role`, `system` instructions, and `content` to refer to.<br>

***Role***: The `role` could be thought of as `what` type of personality or perspective would you like the AI to adopt? <br>

o   Friendly tone? <br>
o   Reflective? <br>
o   Confident but informal? <br>

You are not just asking the AI to return information – you’re asking it to *”act”* a certain way when it communicates. <br>
You could base this on your sense of humor, tone, and voice, or even how you want people to feel when they read this *“self-description” *. <br>

***System***: In the `system` section you are *establishing* the *settings*. <br>
The `system context` could include:<br> 
o   What is it supposed to talk about? <br>
o   What it is not supposed to do (like avoid generic corporate jargon).<br>
The `system` settings are like briefing a creative writer before they draft your intro blurb. <br> 

***Content***:  In the `content` section, you are supplying the AI with the *key* information it can draw from:<br> 
o   This could be based on your data. <br>
o    Experiences<br>
o   Achievements<br>
o   Informal vs Formal style<br>
The `content` is a source that the AI can draw from to generate the final `output` using the mindset and rules that were defined. <br>

```
messages = [
            {
                "role": "system",
                "content": (…) …}
            ]
``` 

### MacN API Server

What’s this *server* business about the `about page`? <br>
Think of your social media profile or LinkedIn profile. I’m sure somewhere, we all have a short biography of ourselves. For instance, I like my `LinkedIn` BIO, I feel like I took the time to consider the personal information I shared. <br>
But…<br>

What if you could have a structurally formatted biography that `you`, ahhh! I mean `me`, wait... `I`? Could add `bullet-points` or `particularly worded content` to this structurally formatted biography, over time. As this BIO `”content”(…)` gets aligned to represent `”Me”`, an `API Server` can securely host and serve the AI model that will generate the “hopefully” aligned desired output for the `Me` `Orb` biography. <br>
I set the generated BIO to about a 200-word length.  <br>
The `Me` `Orb`  BIO as of right now, is set to generate a different BIO after each time the `Me` `Orb` is closed. I think that might need to be changed once I sort all this out.<br>
For `scaling` I think I will have to review the `OpenAi`: `https://platform.openai.com/docs/models` information further, as a cost could be included. <br>

#### Standard Operating Procedure (SOP)

I compiled notes and created an SOP for setting up this `API Server`. I will figure out how I intend to share this. <br>
The `Back-End`…<br> 

### (05/30/2025.1400) About: Orb: `Me`: Fetch/Catch/Set 

***Oh My!***<br>
I can't even begin to coherently express the challenges of connecting back-end to front-end.<br>
I mean, besides typos, naming things differently... I lost track at how many days I have been trying to sort this out... <br> 
I have been getting more famiure with the `Azure` platform.<br>

### (06/03/2025.0600) About: Orb: `Me`: API Server: Docker: 

***Team To Much*** struck again! With their *excessive* wanting to ***do the most***. I did it to myself! I thought, hey, let's just set up a server to host an AI model to generate personalized biographies for the about page on my personal website. Why, though?<br>
There are so many "things", challenges - lol, challenges don't get it, I don't quit...

- Server automation setup
- deployment fails
- schema mistakes
- Too many requests
- Docker

### Docker! Docker! Docker!

Docker ***fascinates*** me!

### (06/13/2025.0450) About: Orb: `Me`: API Server: Model `Pay Wall`

- I have a clean deployment process from local to the cloud.<br>
- The deployment *can be* successfully deployed.<br>

When I click on the front-end (hosted on GitHub) `Orb: Me:` that action `fetches` the response from the "cloud" (Azure) that uses an OpenAI API key. The OpenAI key is verified, then the cloud-hosted server can generate an output regarding the `message=[...]` information. Lastly, the `message=[...]` should be presented on the front-end after I click `Orb: Me:`.<br>

***The problem...***<br>

#### Scaling Pay Walls

I said it! I told myself - I bet I will be blocked by a pay wall. I expected this, I guess. <br>
This is understandable, in regards to OpenAI's model pricing. I could use the GPT 3.5-turbo, but that won't generate the desired output as the GPT 4o could.<br>

There are some issues...<br>

#### GPT 4o 

GPT 4o (model: gpt-4o-2024-08-06) is good. I think the model has a good interpretation of `message` context. I am excited to see if I can get the output to be related to my experiences in a way that, if someone were to inquire, reads as if I were just asked. Even though the response is *AI*. If the `message=[...]` context gets more aligned to generate what I could consider authentic to my experiences, ***then*** if someone "clicks" on the `Me` `Orb`, the generated output (in theory) could be an acceptable response. <br> 
Next, how can I get the `About` `Me` output to generate a different response depending ***”if”***:<br>
-    The link was shared on a social media account, job board URL…

So, then what's up with the `Pay Wall`?<br>

looking at:<br>

-`gpt-4o-2024-08-06`
on<br>
-`https://platform.openai.com/docs/models`

```
Intelligence    High Speed  Price   Input   Output
⚪⚪⚪ ⚡⚡⚡ $2.5 • $10  💬, 🖼️ 💬
    Medium  Input • Output  Text, Image Text
```

GPT-4o (“o” for “omni”) is our versatile, high-intelligence flagship model. It accepts both text and image inputs, 
and produces text outputs (including Structured Outputs). It is the best model for most tasks, and 
is our most capable model outside of our o-series models.<br>

- 128,000 context window
- 16,384 max output tokens
- Sep 30, 2023 knowledge cutoff

Pricing:<br>
Pricing is based on the number of tokens used. For tool-specific models, like search and computer use, there's a fee per tool call. See details in the .<br>
Text tokens Per 1M tokens∙ Batch API price:<br>
```
Input | Cached input | Output
$2.50 |   $1.25      | $10.00
```

Rate Limits:<br>

Rate limits ensure fair and reliable access to the API by placing specific caps on requests or tokens used within a given time period. Your usage tier determines how high these limits are set and automatically increases as you send more requests and spend more on the API.
```
Tier    RPM TPM Batch queue limit
Free    Not supported
Tier 1  500 30,000  90,000
Tier 2  5,000   450,000 1,350,000
Tier 3  5,000   800,000 50,000,000
Tier 4  10,000  2,000,000   200,000,000
Tier 5  10,000  30,000,000  5,000,000,000
```

#### Scaling the Wall

Here is my breakdown.<br>
Using current gpt-4o pricing (06/13/2025):

```
Type    Cost (per 1K tokens)
Input   $0.0025
Output  $0.0100

Each /generate-aboutOrb call uses:

~200 input tokens (prompt)

~150 output tokens (response)

~350 total tokens
```

That means 1 API call = ~$0.0012<br>

With $1.00, you could run ~800 calls.<br>

What does `scaling` mean? 🤔<br>
I get it, but in software, it is an interesting topic. There are people out there who determine how to "scale" software products that are intended to reach millions of real users' fingertips. These engineers figure out the scale or size of operations for that software to be sustainably used (how I think of it).<br>
It's very interesting to me... <br>

So...<br>

What I have started:<br>

- Configure the OpenAI Dashboard account settings further. (When I set up a GPT 3.5-turbo, I didn't have to do extra steps.)
- Implement a Python script named: `tokenTracker.py`.

`tokenTracker.py`:
    - The tracker is using the current `openai.com/docs/models/gpt-4o` page data as a baseline for a maximum number of tokens that can be used before the OpenAI account is charged a service fee. The tracker does not scrape OpenAI. The Tracker "runs" alongside the server to track the usage.<br>

What I am thinking (once I sort this out) is like, let's say, per month, you have ~800 calls before being charged.
Out of one month, let's say: 200 times within the first 5 days the `Me Orb` was clicked, there are 600 tokens left for the month.<br>
But, then in the next 10 days, 500 tokens are used, leaving 100 tokens for about 11 days (out of a 31/30 month). 
This can get logged and be notified to the account manager via the `tokenTracker` script.<br>
I am thinking about how I can "throttle" the output to say if the token count gets close to the maximum desired tokens threshold, which could be at a 700 token limit, that the "throttle" only generates 2 biographies per day. It would have to cache two or more temporarily generated responses, then possibly rotate them randomly per click.

-   This would have to happen for 10 days before the month resets. 
-   Ensure the temporary generated BIOs are slightly different in some way…<br>

My OpenAI project account is briz-oke! lol!!! Need ta make my AI holla for sum dollas 💸💸💸...<br>

### (06/16/25.1645) We live? Not live... We live? Not live...

Why the *tease*?<br>
I'm not a *tease*...<br>
It's a ***Rabbit Hole***.<br>
I have poked my head out to say... And then....<br>

 And then... I decided to change out the `4o` to the `4o-mini`. The mini should still be able to do the job just as well for this project as the `4o` could.<br> 

And then... I had to change the `Cost Input` of the `TokenTracker` class.<br>
```
# Cost per 1K tokens for input and output
COST_INPUT_PER_1K = 0.0011
COST_OUTPUT_PER_1K = 0.0044
```

And then... I thought, how does it know what the budget is?<br>
I created a starting budget:<br>
`BUDGET_LIMIT = 5.00  # In dollars`<br>

`tokenTracker.py` expected JSON output:
```
{
  "total_requests": 3,
  "input_tokens": 600,
  "output_tokens": 450,
  "estimated_cost": {
    "input": 0.0007,
    "output": 0.002,
    "total": 0.0027
  }
}
```

#### Response Hardening

Once the `Me` `Orb` is clicked, the backend calls the model from where the server data is stored. Verifies security data, fetches the API request (or user prompt) from another location. Sends the API request to its final location...<br>
How can I ensure this process hasn't had anything injected into the client side of the request?<br>
By using a `Hook`.<br>
The `hook` is a reference to the `@app.after_request` ***Flask*** `hook` that runs after every request but before the response is sent back to the client.<br>

This `after_request` section is meant to inject security headers into every response. So, the idea is to provide layered security by injecting security headers into the responses throughout the process.<br> 

```
@app.after_request
def security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'no-referrer'
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    return response
```

Fingers Crossed:<br>

- No iframe hijacking<br>

- No MIME-type spoofing<br>

- No referer leaks <br>

- No off-site resources allowed<br>

Once the OpenAI project account's `budget` gets established. And then, `allow` which models are allowed. And then, the `rate limits` should be set (or left at default).<br>


### (06/20/2025.1345) First Server Generation 🎉🎉🎉

I want to write something funny or fun, but I am mentally tired. I completed setting up the server. I "setup" a separate cloud service for the `server log dumps`. I created additional bash scripts. One to automate updates for the `requirements` (libraries). The other bash script creates a clean server file zip. The bash script removes possible local environmental dependencies and nearly anything else that does not need to be deployed to Azure's cloud environment. Once the bash script has packaged the files, the deployment will start automatically. <br>

I have Python scripts that run on the server to track the AI model's budget (It does not fetch the budget data from within the OpenAI account. It's hardcoded).
The other Python script I implemented was a `Server Log Dump`, which gets triggered from the `startup.sh` script weekly. That data gets sent to a Google Drive intended to house the `Server Log Dump` files.<br>

Next, I had to do a lot in Azure to sort out how to get **"My files"** and Azure's platform to correctly communicate with the AI model service.<br>

`Curl Command` test output 1: <br>
{
  "about_text": "Hey there! I’m a U.S. Army veteran who traded in my combat boots for coding boots—though I still sometimes march to the beat of my own drum (or maybe a quirky MIDI file). With a Bachelor’s in Computer Science and an AAS in Mechatronics, I’ve learned to solve technical problems like a pro, all while sprinkling a bit of imaginative flair. My military days taught me how to lead and think on my feet, which comes in handy when I’m debugging code or whipping up some backyard farm-to-table magic. Whether I’m crafting text adventure games or brainstorming ways to make software more accessible, my goal is to keep it fun, engaging, and just a little bit loopy. Welcome to my corner of the tech universe!"
} <br>

`Curl Command` test output 2: <br>
{
  "about_text": "Hey there! I’m a proud U.S. Army veteran—think of me as the soldier who traded in camouflage for code and a marching band for a keyboard! With a B.S. in Computer Science and an AAS in Mechatronics, I’ve found a way to blend the discipline of military logistics with the wild creativity of tech. Whether I’m debugging a line of code or whipping up a backyard farm project, I approach everything like I’m building a mission plan—only with fewer push-ups and more puns. I love crafting imaginative coding projects like text adventure games, where the only thing more unpredictable than a plot twist is my cooking! Welcome to my world of tech, humor, and a sprinkle of loopy curiosity!"
} <br>

Screenshot: <br>
(06/22/2025.0400) <br>

![Me Orb Output](https://nathanmcl.github.io/images/MeOrbOutput.png)
<br>



