# (07/13/2025) Backend troubleshooting

Writing code can be empowering, addictive, exciting to get to test out what you created...
This might not be the best part of developing - But! Troubleshooting is essential.
I think that troubleshooting is the most challenging portion of developing software. Sometimes the error message is vague, and there are multiple errors, so you might have to resolve one just to find out what the bigger error might be.<br>

In a bad way, I like troubleshooting...  ***MY DANG BACKEND SCRIPT ISN'T LOGGING***. It's almost like taking a physical fitness test, but for my brain and patients. You train mentally and physically. Once you take that fitness test, you can assess your training effectiveness. Similarly to how I think about troubleshooting, the more `types of errors` I see. The better I get. The annoying thing, typos. <br>

## (07/15/2025.1350) There will be errors!

Three files that did not ***proc***, no ***crit***, all ***fizzle***. That's where I get to come in and figure out why the backend files are not getting `triggered` as scheduled.<br>

### (07/17/2025.So_Early~0730) A cat's meow

A cat's meow @ 0310 😴.
In the yard @ 0315 🥱.
Meows' and pawing on glass... On a second-floor window ledge 😣.
Jumping to the first floor roof, back to the widow ledge pawing, meowing 😣😣 ~0318...
Me climbing out of the window... softly calling the kitty... walking across the roof 😕...
Kitty running through the yard 😫 ~0326... <br>

<br>

(~0430)<br>
I have been resolving my issues with my `Deployment (deploy_api.sh)`. My initial `Deployment` was and has been successful, in regards to the server file and the necessary files unzipped and functioning. 
The files, however, were being stored in a Temporary type of directory. This prevented **all** my server supporting files to not being stored in the correct root directory. Then there is Azure's `Service Plan` tier. I had to create an additional `" .deployment "` file that needed to change a setting that is offered in a higher tier than mine. So, I created a file that changed the setting. Now all **" My "** Server files have unzipped to the correct directory. I should be able to test the additional Python scripts.<br>

### `requirements_scan.py`

This `requirements_scan` Python file is fun.<br>
Using Python to `generate` and `prepare` a `Bash` script named:<br>
`check_dependencies.sh`<br>
The `check_dependencies` scans the deployed Python environment for:<br>

- Outdated packages. <br>  
- Know Common Vulnerabilites and Exposures (Using the `saftey` tool).<br>

The `requirements_scan.py` *Python* script should then produce a human-readable log.<br>

#### Shell Scripting

First define the `Shell Script` (script_content).<br>
The `script_content` Logs:<br>

- Current Timestamp: <br>
`TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")`<br>

- Lists *all* outdated Python packages: <br>

```
echo "Outdated packages:" | tee -a $LOGFILE
pip list --outdated 2>&1 | tee -a $LOGFILE
```

- Checks for `CVE` vulnerabilities in the requirements.txt file, using the `saftey` tool.<br>

#### Handling Missing Tools

If `saftey` is not installed, it will auto-install it with `pip install saftey`.<br>

#### Write to a Log File

I am working on logging all results outputted to `/app/dependency_check.log` and exported to the same private `Google Drive` as `serverLog_Dump.py` but different directory name.<br>

#### Writes and Enables the Script

Then the `Python script`  saves the content.<br>

### How it Connects to the Server

Within the `startup.sh` file (the same one that is used to start the server from deployment, but with add-ons) script is code that *triggers* the initial `requirements_scan.py` to:<br>

- "Set up" the `check_dependencies.sh`. <br>
- Run a *first-time* dependency scan. <br>
- Log any issue to `/home/LogFiles/log_uploads.log`. <br>

...Next...<br>

### Schedule Weekly Checks

Within `startup.sh` there is a loop that runs in the background that automatically executes: <br>

- The dependency scan (`bash ./check_dependencies.sh`). <br>
- Upload the logs to my Google Dive using `serverLog_Dump.py`. <br>


```
python3 requirements_scan.py
```

### (07/17/2025 2030) Make it Be So!!!

Command: `./check_dependencies.sh` <br> 
Output: <br>
```
./check_dependencies.sh: line 7: /app/dependency_check.log: No such file or directory
./check_dependencies.sh: line 8: /app/dependency_check.log: No such file or directory
./check_dependencies.sh: line 9: /app/dependency_check.log: No such file or directory
tee: /app/dependency_check.log: No such file or directory
🔍 Outdated Python packages:
tee: /app/dependency_check.log: No such file or directory
./check_dependencies.sh: line 12: pip: command not found
tee: /app/dependency_check.log: No such file or directory
🛡️ CVE Scan using safety:
tee: /app/dependency_check.log: No such file or directory
⚠️ Safety not installed. Installing now...
tee: /app/dependency_check.log: No such file or directory
./check_dependencies.sh: line 17: pip: command not found
tee: /app/dependency_check.log: No such file or directory
./check_dependencies.sh: line 20: safety: command not found
tee: /app/dependency_check.log: No such file or directory
✅ Dependency check completed.

```

#### `./check_dependencies`

The above `./check_dependencies` bash script, that got generated from the initial `requirements_scan` Python file, has problems.<br>

1. The `/app/dependency_check.log: No such file or directory` means that the directory `/app/` **does not exist** in my Kudu container at the time the `./check_dependencies` bash script runs. <br>

2. `pip: command not found`. Kudalite's *Bash shell* does not have access to `pip`? <br>
    - I am now in the correct virtual environment. <br>

    - I have to implement my custom `Docker Container`.<br>


### (07/18/2025.0400) Whale Riding...
🐳 Docker! Docker! Docker! 🐳 <br>

🐳 Docker Infrastructure <br>
`Dockerfile`🐋<br>
Testing a `Multi-stage` build with python:3.12-alpine3.22. <br>

- ✅ Secure pip + safety + logging + healthcheck <br>
- ✅ Drops to non-root user <br>
- ✅ Compatible with Azure B1 (Basic) App Service Plan <br>
- ✅ Expandable for future tooling <br>

updated 🐋 `.gitignore`<br>

#### (07/21/2025.0530) 🫡To Move Forward, To Grow...

Why does `Docker` ***Fascinate*** me? <br>
To explain why I find `Docker` so fascinating, I would have to write a Man-Fan explanation. I have a `Docker` container project that I have been working on. I stripped out a couple of features to make it "less-custom". While reading the book I am using for *my* `Docker` container project:<br>
`The Ultimate Docker Container Book` By: Gabrial N. Schenker. In it, the author mentions that you do not want such a custom container that it cannot connect to different platforms... Containers are meant to connect (in a larger way). If *my* container ((or if I made a `pod` (a cluster) of containers)). If it is too custom, that would mean that other `pods` could not join mine, or I could not join their `pod`.<br>

I have implemented my custom `Docker` container. But!! There is a problem...<br>

**My** current `Settings/Configuration` **Stack Settings** are setup as a Python Stack. This means that I am using Azure's standard (purchased tier level) `Docker` container. So, even though I have successfully deployed my containerized API server - Azure will not "use it", even though it's there, it is blocked, **"my"** `Docker` container... <br>

What to do then??<br>
To use my `Custom Docker Container`, I have to set my *current* Azure API server as a `Container Instance`. I haven't sorted that out yet. Creating the code isn't always the hard part; it's getting it to function. <br>

Once I set up the `Docker-API-Server`, then those additional Python files I have to scan the server will properly conduct their scans at the set times. Be able to manually scan if needed. Then securely export to the cloud. From there, that data I collected can then be parsed into all sorts of visual metrics, analysis, AI input / out-put Comparison... it keeps going. I need these files to function properly. Once the routes, paths, and correct app service are all in place, I can work on the front-end. <br>

### (07/23/2025.0420) I Docked my Docker

I did it!!! <br>
I implemented my customish `Docker` container. I ***NOW*** should be able to properly test the additional supporting server files:
```
requirements_scan.py,
token_tracker.py,
serverLog_Dump.py
```
Always Seek Improvements!
✌🏼✈️😘🗽🚢😎🏝️✌🏼🗽✈️😊

#### Saftey Scan (08082025.0730) Back on Land...

```
+==============================================================================+

                               /$$$$$$            /$$
                              /$$__  $$          | $$
           /$$$$$$$  /$$$$$$ | $$  \__//$$$$$$  /$$$$$$   /$$   /$$
          /$$_____/ |____  $$| $$$$   /$$__  $$|_  $$_/  | $$  | $$
         |  $$$$$$   /$$$$$$$| $$_/  | $$$$$$$$  | $$    | $$  | $$
          \____  $$ /$$__  $$| $$    | $$_____/  | $$ /$$| $$  | $$
          /$$$$$$$/|  $$$$$$$| $$    |  $$$$$$$  |  $$$$/|  $$$$$$$
         |_______/  \_______/|__/     \_______/   \___/   \____  $$
                                                          /$$  | $$
                                                         |  $$$$$$/
  by safetycli.com                                        \______/

+==============================================================================+

 REPORT

  Safety v3.6.0 is scanning for Vulnerabilities...
  Scanning dependencies in your files:

  -> requirements.txt

  Using open-source vulnerability database
  Found and scanned 12 packages
  Timestamp 2025-08-08 14:15:24
  0 vulnerabilities reported
  0 vulnerabilities ignored
+==============================================================================+

 No known security vulnerabilities reported.

+==============================================================================+
```

But! getting it to scan after the `startup`, via weekly programmed date/time or manually is tricky.<br>
Once the startup has finished, it drops to a non-root user. However, if I manually scan or run the weekly scan, the command isn't executed because of the non-root privileges. I think "my" `manual` command and the `weekly` command execution must have the privilege raised for those command executions???<br> 




### `serverLog_Dump.py`

```
python3 serverLog_Dump.py
```
<br>

### `tokenTracker.py`

```
python3 tokenTracker.py
```
<br>


### Noted Sources:

- `The Ultimate Docker Container Book` By: Gabrial N. Schenker.
- `PowerShell Automation and Scripting for Cybersecurity` By: Miriam C. Wiesner



# Azure Troubleshooting (08/18/2025.1430)

This section contains Azure-based troubleshooting problems and solutions. <br> 

## Azure | macn-about-api

Current Azure assets:

    -   Docker Container
        - macn-about-api Server

<br>   

### Azure Notification | macn-about-api | Health check

***TLDR:***  I think Azure wants me to upgrade my account to `Standard` and/or `Premium`... *$$$* I don't need to upgrade. atm...<br> 

Notification:<br>
"Your site has a single instance, which will not be removed if it becomes unhealthy. However, after one hour of continuous unhealthy pings, the instance will be replaced. You can still set up Azure Monitor Alerts based on the health status."

```
Health Check
0.00% (Healthy 0 / Degraded 1)
```
<br>

What does that mean?<br>

Since the `macn-about-api` is only using a **single-instance** setup, if the app has a failure, Azure recycles the functioning app so it can still be used for a short time.<br>

### Azure Health check | Troubleshooting

Health Check feature
    -  Checks to see if the Health Check feature is enabled for the web app.
<br>

`Health Check feature`: <br>
Currently is configured for this web app; however, its App Service Plan is running on only one instance. Please consider adding more instances to minimize potential downtime.<br>
    - Description:  
        The Health Check feature automatically removes a faulty instance from rotation, thus improving availability.

    - This feature will ping the specified health check path on all instances of your webapp every minute. If an instance does not respond or responds with a failure within the default 10 minutes (WEBSITE_HEALTHCHECK_MAXPINGFAILURES defines the number of pings), the instance is deemed unhealthy, and our service will stop routing requests to it.

    - It is highly recommended for production apps to utilize this feature and minimize any potential downtime caused due to a faulty instance.

Note: <br>
- The number of pings and how long an unhealthy instance remains in the load balancer are configurable. <br>
- It is important that the endpoint you configure for the health check to probe must implement logic to check the health of any dependencies that the application relies on. Failing to do so will cause the health check to report healthy even when the application fails due to a dependency failure and have an impact on SLA. <br>

Current Health Check endpoint:<br>
`/health` <br>

### Azure's Solution

"Health Check feature is currently configured for this web app; however, its App Service Plan is running on only one instance. Please consider adding more instances to minimize potential downtime."<br>

What does that mean? <br>

Currently, this website only has `One` `instance` of itself. Since the site is public, and I am also testing it, it is likely that this *single* `instance` could indeed become `"Unhealthy"`.<br>
Azure's solution is that I have additional instances. Which, in a production environment, could allow that website to maintain its availability. <br>
My solution was to `Scale out` (App Service plan). In the app's current `B1` service plan, the app is offered up to `3` instances of itself. I set it to `2`.<br> 

### Health check | Scaled * 2

Health check configuration changes will restart your app. To minimize impact on production apps, we recommend setting it up on a staging slot and swapping it into production.<br>

Adding additional `Slots` costs mula...<br>
But... Now I have 2 `Unhealthy Instances`...<br>
I am using a `B1` account, and I do not want to upgrade... So, I have to figure out another way to understand the cause of the `unhealthy` instance. <br>

### macn-about-api | Diagnostic Tools | Auto-Heal

- 1. Enable the custom `Auto-Heal` rules. 

- 2. Define the Conditions
    - Request Duration | Request Count | Status Codes
I chose `Status Codes` to start with. "You can configure a rule to mitigate the issue or collect diagnostic data to identify the root cause of the problem. You can configure rules on more than one HTTP Status code condition." <br>

- a. Set for a `Range` of status codes:
    - `500 to 530`

- b. Number of Requests:
    - `10`

- c. Time Interval:
    - `60` (seconds)

- d. Request Path:
    - Leave Blank (Applies to all requests)

- 3. Action:
    - Recycle process 

- 4. Optional Time override:
     - 600 (10min)


#### Note Sources

Health Check
- https://learn.microsoft.com/en-us/azure/app-service/monitor-instances-health-check



