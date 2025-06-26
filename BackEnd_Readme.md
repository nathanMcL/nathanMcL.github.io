# (06/24/2025) The Back End...

## Beneath the Stack

So, before I describe what I had to do to simply get the backend's end-point to "communicate" with the frontend's "user-API-click". I believe there are better ways to do this, and I'm sure there are. I have started thinking of how I could improve this "server" deployment process, additional automated scripts so that I can do more with less.<br> 

I am trying to keep this as static as possible, until I get done adding to other pages...<br>
I don't need a database for the project (currently)...<br>

***These are my notes that describe what I had to do inorder to generate one API call.***
***My notes are not intended as a walk-through on server automation and configuration.***

## Deployment SOP: Chapter Outline

- Environment Setup<br>
- Server Testing<br>
- API Fetch: Token Tracking<br>
- Dependency Scanning<br>
- Log Dumps<br>
- Automated startup tasks<br>
- Azure Configuration<br>
- Frontend Integration<br>
- API Hardening<br>
- Sanitized Rendering <br>

### Step 1 Project Initialization and Environment Setup

Organization is key! Set up your development environments:<br>

    - Desktop folders/Cloud/Hardrive, etc.
    - VS Code- WSL/Ubuntu
    - Server Language Version is the same as Step 7: Azure Configuration. 

Install nessessay packages (For local only. Step 7: Azure uses `requirements.txt`)<br>
Prepare your `.env` file for secure API key handling during local testing.<br>
For the `production` website the `.env` file is described in Step 7: Azure Configuration for secure API key handling.<br>

Organized Representation of the Project Directory:<br>

```
MacN_Project/
├── client/                # GitHub Pages Frontend
│   └── index.html, about.html, JS, CSS, etc.
├── server/                # Flask API Project
│   ├── app.py             # Main API Server
│   ├── tokenTracker.py    # Token usage logging
│   ├── requirements_scan.py
│   ├── serverLog_Dump.py
|   |__ additional scripts # Private Scripts
│   ├── startup.sh         # Launch script
│   ├── requirements.txt   # Dependency list for Azure
│   ├── .env               # (local only) API keys
└── README.md              # Project overview
```
***Use local folders, external drives, or secure cloud sync tools*** <br>

#### Step 1.2 Configure Your Dev Environment

- VS Code:<br>
    - Extensions: Python, Docker, Remote - WSL <br>

- WSL (Ubuntu 22.04) with Python 3.12+ ***Note in Step 7, Azure you must set the server "Stack settings" in Configuration Settings***<br>

- PowerShell and Git for deployment scripts<br>

***Note: Use the same Python version locally and in Step 7 (Azure App Service Python stack) to avoid runtime errors.***<br>

#### Step 1.3 Install Dependencies

Used Commands:<br>
`sudo apt update && sudo apt upgrade`<br>

Install Local Dependencies.<vr>
Inside the `/server/` directory (where app.py is):
`pip install flask openai flask-cors flask-limiter gunicorn python-dotenv safety google-api-python-client google-auth-httplib2 google-auth-oauthlib`<br>

***Azure uses `requirements.txt` to handle the dependencies.***<br>

`chmod +x`<br>

#### Step 1.4 Securely Store Environment Variables for Local Use:

Create a `.env` file in the `/server/` folder to avoid hardcoding sensitive keys:<br>

The Local `.env` file can hold sensitve data:<br>

```
OPENAI_API_KEY=your-local-key-here
MAX_TOKENS=500
TOKEN_COST_CAP=4.00
GDRIVE_FOLDER_ID=your-folder-id
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

- Keep `.env` in `.gitignore` and never deploy it to production.<br>
- Production Environment Varibles are injected securely into Azure Step 7.<br>

#### Step 1.5 Test Locally

Start the sever:<br>
`python3 app.py`<br>

#### Step 1.6 Prep for Weekly Automation Scripts (Going Forward)

Ensure Automated process are functioning as intended.<br>

### Step 2 Local Flask API Creation

Create and test the *local* `Flask API` (app.py) that integrates the AI model API securely.<br>
Using environment variables:<br>
    - Flask Limiter
    - CORS
    - Custom Routes
<br>

#### 2.1 Start with a Modular API Architecture

Use `app.py` to define the API server with logical seperation of concerns:<br>

```
server/
├── app.py               # Main API logic
├── tokenTracker.py      # Token usage and cost tracking
├── requirements_scan.py # Dependency safety scan
├── serverLog_Dump.py    # Secure log upload handler
├── .env                 # Local only; never deployed
```

#### Step 2.2 Secure Key Access Using Environmental Variables

(Locally) Use `python-dotenv` to access the `.env` in `app.py` safely:<br>

```
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```

***Note: As of 06/2025 OpenAI `api_key` format is: api_key = os.getenv("OPENAI_API_KEY")***<br>
***Note: OpenAI might depreciate the `api_key` format if they make updates to their code base.***<br>

The purpose of the `.env` file is to keep private keys or certificates out of main code and version control.<br>

#### Step 2.3 Implement Core Middleware and Security

```
| Feature         |  Implementation               |  Purpose
| CORS	          |  Flask-CORS	                  |  Allows requests from GitHub
| Rate Limiting   |  Flask-Limiter                |  Limit requests per user/IP(Per second)
| Error Handling  |  Flask’s @app.errorhandler()  |	 Return meaningful error codes
```

<br>

```
from flask_limiter import Limiter
from flask_cors import CORS
```
<br>

#### Step 4: Define Custom Routes

Ensure the route names make since.<br>

- `/generate-aboutOrb`: Handles POST requestsfor AI-generated content.<br>
- `/stats`: Return usage statistics for debugging / display.<br>
- `OPTIONS` *route handlers* for `preflight support`.<br>


#### 2.5 Integrate `tokenTracker.py` for usage Monitoring

(Curretly) Log each OpenAI interaction with:<br>

- Input/Output tokens.<br>
- Eastimated cost (tracked)<br>
- Safety cap check (defined in: the OpenAI project budget limit and logged with the server)<br>

***Note: If the budget cap is exceeded, return a `402 Payment Required` and halt requests to prevent overuse.***<br>

#### Step 2.6 Local API Testing

Use the `about.html` orb buttons or use `Postman/cURL`:<br>

Example:<br>
```
curl -X POST http://localhost:5000/generate-aboutOrb \
  -H "Content-Type: application/json" \
  -d '{"context": "Tell me something about coding."}'
```

#### Step 2.7 Validate Startup with `gunicorn`

Azure uses `gunicorn` to establish the production server connection. (?Double check this statement?)<br>

### Step 3: Token Tracking and Budget Enforcement

Monitor the usage and project wallet with built-in token logging and cost control.<br>

Token Tracker logs `input/output` token usage.<br>
If the *cost* exceeds a defined threshold. <br>

#### Step 3.1 Purpose of `tokenTracker.py`

The `tokenTracker` script tracks:
    - Prompt and Completion token counts.<br>
    - Estimated cost per request.<br>
    - Cululative running cost accross all sessions.<br>

This supports both debugging and budget-aware throttling in real-time.<br>

#### Step 3.2 Setting a Cost Cap

Define a budget limit to avoid runaway costs:<br>

Example: <br>
`TOKEN_COST_CAP=5.00`<br>

Once the cap is exceeded, the server:
    - Logs a warning internally<br>
    - Returns a `402 Payment Required` error.<br>
    - Stops responding to AI generation requests.<br>

#### Step 3.3 Usage Stats via `/stats` Route

A secure `/stats` endpoint exposes live values like:
    - Total requests.<br>
    - Average input/output tokens.<br>
    - Running estimated cost<br>

Moving Forward, I can use this route to build a usage dashboard, track trends, or spot anomalies.<br>

#### Step 3.4 Visual Logging Options

Moving Forward I could extend this idea by:
    - Writing to CSV or JSON logs for analysis.<br>
    - Piping stats into `serverLog_Dump` for offsite archiving.<br>
    - Graphing usage patterns in a future UI

### Step 4: Weekly CVE and Dependency Scanning

Automate vulnerability scans on your server’s Python packages to maintain a hardened back end.<br>

#### Step 4.1 Using `requirements_scan.py`

Use `requirements_scan.py` to automate weekly dependency and CVE scans using `safety.`
The script logs results to `check_dependencies.sh`.<br>

`requirements_scan.py` performs: 
    - Weekly scan of the `requirements` using the `saftey` package.<br>
    - Comparison against known CVEs and insecure versions.<br>
    - Human-readable log output.<br>

Within the `Kudalite` terminal run it manually:<br>
`python3 requirements_scan.py`<br>

or:<br> 
`bash check_dependencies.sh`

#### Step 4.2 Safety Check via `safety`

The `safety` tool cross-references installed packages with known CVEs:

Install:<br>

```
pip install safety
safety check -r requirements.txt

```
<br>

Output includes:<br>
    - Package name and version<br>
    - CVE ID and summary<br>
    - Suggested fixed version<br>

Keep `requirements.txt` clean and regularly reviewed even if you don’t frequently update packages.<br>

***Note: if a version of the requirements has changed, possibly all concerning code that related to the requirement dependency may have to be updated also.***<br>

#### Step 4.3 Automate Weekly Executions

Pair `requirements_scan.py` with a cron-style task in `statup.sh` or it can be done through Azure:<br>
    - Runs weekly at a prefered time.<br>
    - Logs are saved and exported.<br>
    - Errors are caught and can be uploaded via `serverLog_Dump.py`<br>

***Security hygiene is easier when automated***<br>


### Step 5: Log-Upload-Automation to Google Drive

Securley archive runtime and vulerability logs offsite using an isolated Google Drive folder and service account authentication.
To "Implement"the private Google Drive folder to securely upload logs the private Google Drive folder, there are a few minor steps, noting major. I would have to type out those steps: 
    1. Enable the Google Drive API in Google Cloud.<br>

    2. Create a service account and download credentials.json.

#### Step 5.1 Purpose of `serverLog_Dump.py`

This Python script:
    - Authenticates with the Google Drive using a credentials service account key.<br>
    - Locate and zips log files from the local `/logs/` directory.<br>
    - Uploads the zipped file to a private Drive folder using a folder ID

***Note: The purpose is to reduce the chance of log loss and centralizes backup for review audits.***<br>

#### Step 5.2 Setup Steps

1. Create a secure, hidden logs/ directory:<br>

```
mkdir -p server/logs
```

2. Place the `service account credentials` in `credentials.json` (DO NOT PUSH to GitHub).<br>

3. Set the folder ID in the `.env` local file.<br>
4. Update `.gitignore`<br>
5. Update Azure vault to hold the Google Service Account credentials.<br>

Example:<br>
```
GDRIVE_FOLDER_ID=your_folder_id_here
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

#### Step 5.3 Test `serverLog_Dump.py`

Run it manually:<br>
`python serverLog_Dump.py`<br>

***Note: Script is configured to run weekly log pushes to the Drive.***

#### 5.4 Security Measures

This section is like a "Vault Courier" - files are zipped, tagged and delievered securely offsite.
    - credentials.json is restricted to upload-only access.<br>
    - .env controls credentials and is excluded from deployment.<br>
    - Folder sharing is disabled — private only.<br>


### Step 6: Startup Scheduling for Automated Checks

Automate post-launch tasks with `startup.sh`, reducing the manual maintenance and boosting system reliability.<br>

- Integrate `startup.sh` to launch the API server using `Gunicorn`.
- Run background cron-like tasks to scan/do something/ upload logs.

#### Step 6.1 The Role of `startup/sh`

This script performs sevral critical tasks during server startup:<br>
    - Launches the Flask API using `gunicorn`.<br>
    - Runs `requirements_scan.py` and logs results.<br>
    - Triggers `serverLog_Dump.py` at set cron-like task.<br>

#### Step 6.2 Schedule Weekly Tasks in Script

Example of `startup.sh` logic (simplified for SOP)<br>
```
#!/bin/bash
echo "Launching MacN API Server..."
python requirements_scan.py >> logs/dependency_report.txt

# Check day for weekly log dump
if [ "$(date +%u)" -eq 7 ]; then
  python serverLog_Dump.py
fi

gunicorn -w 2 -b 0.0.0.0:8000 app:app
```

This ensures the `log scanning` and `uploading` occur weekly, with minimal resource overhead.<br>

#### Step 6.3 Script Deployment Notes

`startup.sh` has to be marked executable:<br>
`chmod +x startup.sh`<br>

***Note: Moving forward: This could get implemented to a intergrated systemd or GitHub Actions CI/CD.***<br>


### Step 7: Azure Configuration and Hosting

Deploy and host the `Flask API` in `Azure` using `App Service` and `deploy_api.sh`.<br>

- Set up App Services instance to host the API.
- Ensure: 
        correct binding
        timeouts
        environment variables

The `deploy_api.sh` script packages and pushes to the server.<br>

#### Step 7.1 Create the Azure App Service

***These steps are not in particular detail***<br>

Once the `macn-api` is created. Navigating in-and-out the `Settings/Environment variables/Configuration`
Make Sure the Azure Configuration includes:
    - Startup command: `bash statup.sh`<br>
    - Linux-based container<br>
    - Always On: Enabled
    - App Settings (.env): Set manually under Azure -> Setting -> Configuration<br>

#### Step 7.2 Configure the Environment Variables

In the Azure Portal > App Service > Configuration define these variables:<br>

Example:<br>
```
OPENAI_API_KEY         = sk-xxxx
TOKEN_COST_CAP         = 10.00
GDRIVE_FOLDER_ID       = (private folder ID)
GOOGLE_APPLICATION_CREDENTIALS = credentials.json
```
These values replicate `.env` securely in production.<br>

***Note: Azure encrypts these values and injects them into the runtime environment on boot.***<br>

#### 7.3 Use `deploy_api.sh` for Fast Updates

This script:
    - Zips all nessessary server files (excluding `.env`, and other local enviroment file types).<br>
    - Authenticates with Azure.<br>
    - Pushes the archive to the Azure App Service for deployment

#### Step 7.4 Confirm Configuration

After deployment, check:
    - Open Log Stream to check on the deployment process.<br>
        - Logs show Flask + Gunicorn started.<br>
        - CORS is active.<br>
        - `/generate-aboutOrb` and `/stats` respond.<br>
        - Budget cap works.<br>





### Step 8: GitHub Pages Frontend Integration

Deploy and Host the static frontend GitHub pages(about.html, blog.html, index.html, etc).
Secure the comunication with the API using `Content-Security-Policy` headers and `connect-src` scoped to the Azure server.<br>

***Note: Originally I discovered a GitHub post shared on Linkedin regarding how to build a website using `GitHub pages`. I can not find the GitHub Post that was shared on Linkedin. I thought I saved post in my comments section in linkedin. Currently unable to give credit to the GitHub walk-through.***

#### Step 8.1 Setup Git Hub Pages

Using a public GitHub repository (the name of your `github.io` account) to host the static: `HTML, CSS, JS, Image` assets.
this is an example of the front-end client-side:<br>
```
client/
├── index.html
├── about.html
├── blog.html
├── cybercuriosity.html
├── tools.html
├── /images/
├── /scripts/
├── /styles/
```

Enabling `Pages` in the repo settings -> select `main branch / root` -> your site becomes available at:<br>
`https://website_name.github.io`<br>

#### Step 8.2 Configure `about.html` to Connect to the API

The `about.html` orb triggers API calls via JavaScript.<br>


#### Step 8.3 Use a Secure `Content-Security-Policy`

In each HTML file (index.html, about.html, blog.html, etc), define a strict CSP:

Example CSP:

```
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self';
    img-src 'self' data:;
    font-src 'self';
    connect-src 'self' https://API_server.azurewebsites.net;
    object-src 'none';
    base-uri 'none';
    require-trusted-types-for 'script';">
```

This ensures only "your" trusted Azure API can be contacted - preventing injection attacks or rouge API calls.<br>



### Step 9 Secure API Communication

Strengthen the API against abuse and unauthorized access through proper policy enforcement and request handling.<br>

- Implement CSP
- Rate Limiting

The `/generate-aboutOrb` route uses `POST + OPTIONS` handling with CORS response headers.<br>

#### Step 9.1 CSP "Digital Moat Around the Keep"

Applied in all `HTML` files, the `CSP` acts as a perimeter guard:
    - `connect-src`: Only Azure API allowed.<br>
    - `script-src`: Block inlineJS unless trusted types are defined.<br>
    - `object-src 'none'`: Blocks plu-ins and embeds.<br>

#### Step 9.2 CORS and OPTIONS Preflight checks

Use `flask_cors.CORS` to define trusted origin(s):

Example:<br>
```
CORS(app, origins=["https://Website_name.github.io"], supports_credentials=True)
```
Then in the `OPTIONS` request.<br> 
Example:<br>
```
@app.route("/Do_the_thing-On_the_aboutOrb_Me", methods=["OPTIONS"])
def handle_options():
    return build_cors_preflight_response()
```
This ensures the browsers pass `CORS` checks before POSTing.<br>

#### 9.3 Rate Limiting with Flask-Limiter

To prevent API spam you can use `limiter` like this example:<br>
```
# Imports up top
from flask_limiter import Limiter

# Initialize Flask Limiter
limiter = Limiter(app, key_func=get_remote_address, default_limits=["5/second"])

```

- Per-IP limit: configurable<br>
- Helps throttle bots, misbehaving scripts, and overuse.<br>

***Note: Enter the Flask Limiter directly below the CORS statement block.***<br>

#### Step 9.4 HTTP Response Headers

In the Flask `app.py`, we can secure the back-end request with:<br>
Example:<br>
```
@app.after_request
def apply_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response
```

***Note: These headers reduce the exposure to clickjacking, content spoofing, and MITM attacks.***<br>




### Step 10 Markdown Rendering with Security Controls

Safely fetch, parse, and display external markdown content with zero trust toward third-party sources.<br>
Use the following within `blogScript.js` and `cybercuriosityScript.js`:<br>

- `marked.js`
- `DOMpurify`

When the `markdown readme files` are fetched, you want to *load* and *sanitize* markdown files from GitHub, following security best practices.<br>

#### Step 10.1 Fetch the Markdown files from GitHub

In `blogScript.js` and `cybercuriosityScript.js`, load the `.md` files:<br>
Example:<br>
```
fetch('https://raw.githubusercontent.com/GitHub_Account_Name/GitHub_Account_Name.github.io/main/ReadMe.md')
```

#### Step 10.2 Parse Markdown with marked.js

Convert `.md` content to raw HTML:<br>
Example:<br>
`const rawHtml = marked.parse(markdownText);`<br>



#### Step 10.3 Sanitize HTML with `DOMPurify`

Prevent cross-site scripting by cleaning the HTML before injecting into the DOM:<br>
Example:<br>
```
const cleanHtml = DOMPurify.sanitize(rawHtml, { RETURN_TRUSTED_TYPE: true });
document.getElementById("markdown-content").innerHTML = cleanHtml;
```
<br>

    - RETURN_TRUSTED_TYPE satisfies Trusted Types CSP.<br>
    - Ensures that only whitelisted HTML tags are rendered.<br>
    - Blocks malicious `<script>`, `onerror`, and other injectables.<br>


#### Step 10.4 Accessibility and Fallback

When loading fails, display a safe fallback.<br>
Example:<br>
```
.catch(err => {
  document.getElementById("markdown-content").textContent = "Failed to load content.";
})
```

### MacN_iT GitHub Pages CSP Reference Table

***Layout made need to be tweeked for small screens***

```
| **Directive**        | **Example**   | **Plain Language Description** | **Why It Matters for MacN_iT**  |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `default-src 'self'`   | Limits all content to come from your own domain (`self`)  | Disallows loading scripts, styles, images, etc., from external sources unless explicitly allowed  | Ensures only your GitHub Pages content is trusted unless exceptions are made |
| `script-src 'self'`    | Only allow JS scripts from your domain | Blocks all external scripts (CDN-hosted JavaScript) unless explicitly allowed | Prevents attackers from injecting harmful external scripts | 
`style-src 'self'`       | Only allow CSS from your own files | Blocks third-party CSS unless allowed (no loading untrusted fonts or themes) | Keeps your design secure and under your control | 
| `img-src 'self' data:` | Allow images from your domain or inline/base64 (`data:`) formats  | You can use local images or inline `data:image/png;base64,...` format   | Lets you display logos and avatars without exposing to 3rd-party image links |
| `font-src 'self'`      | Fonts can only be loaded from your own domain | Prevents font hijacking or loading remote fonts that track users | Ensures fast, safe, and private font rendering |
| `object-src 'none'`    | Disables all `<object>`, `<embed>`, `<applet>` tags | Prevents loading potentially insecure plug-ins or Flash objects | Protects from legacy exploits via object/embed content |
| `base-uri 'none'`      | Disables the `<base>` tag to prevent base URL manipulation | Stops attackers from changing where relative URLs resolve | Prevents redirect-based hijacking in injected content |
| `connect-src 'self' https://APP_API.azurewebsites.net` | Only allow fetch/XHR/WebSocket to GitHub Pages and your Azure API | Stops your JavaScript from sending or receiving data from unknown/untrusted servers | Secures the API interaction with your own backend only |
| `require-trusted-types-for 'script'` | Enforces Trusted Types for `script` assignments | Blocks XSS by requiring all dynamic scripts be explicitly marked safe (sanitized with DOMPurify) | Ensures your markdown rendering is clean and script-safe |
```

