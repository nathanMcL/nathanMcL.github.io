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

Why does `Docker` *** Fascinate *** me? <br>
To explain why I find `Docker` so fascinating, I would have to write a Man-Fan explanation. I have a `Docker` container project that I have been working on. I stripped out a couple of features to make it "less-custom". While reading the book I am using for *my* `Docker` container project:<br>
`The Ultimate Docker Container Book` By: Gabrial N. Schenker. In it, the author mentions that you do not want a custom container because containers are meant to connect (in some larger way). If *my* container ((or if I made a `pod` (cluster?) of containers), I am not done with the book). If it is too custom, that would mean that other `pods` could not join mine, or I could not join their `pod`.<br>

I have implemented my custom `Docker` container. But!! There is a problem...<br>

**My** current `Settings/Configuration` **Stack Settings** are setup as a Python Stack. This means that I am using Azure's standard (purchased tier level) `Docker` container. So, even though I have successfully deployed my containerized API server - Azure will not "use it", even though it's there, it is blocked... <br>

What to do then??<br>
To use my `Custom Docker Container`, I have to set my *current* Azure API server as a `Container Instance`. I haven't sorted that out yet. Creating the code isn't always the hard part; it's getting it to function. I might have to do another back-end walk-through write-up on configuring the `Docker-API-Server`. <br>

Once I set up the `Docker-API-Server`, then those additional Python files I have to scan the server will properly conduct their scans at the set times. Be able to manually scan if needed. Then securely export to the cloud. From there, that data I collected can then be parsed into all sorts of visual metrics, SOC analysis, AI input / out-put Comparison... my imagination keeps going. I need these files to function properly. Once the routes, paths, and correct app service are all in place, I can finish the front-end about page and inspiration page. <br>

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

