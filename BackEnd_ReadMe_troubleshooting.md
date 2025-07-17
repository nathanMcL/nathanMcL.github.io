# (07/13/2025) Backend troubleshooting

Writing code can be empowering, addictive, exciting to get to test out what you created...
This might not be the best part of developing - But! Troubleshooting is essential.
I think that troubleshooting is the most challenging portion of developing software. Sometimes the error message is vague, and there are multiple errors, so you might have to resolve one just to find out what the bigger error might be.<br>

In a bad way, I like troubleshooting when ***MY DANG BACKEND SCRIPT ISN'T LOGGING***. It's almost like taking a physical fitness test, but for my brain and patients. You train mentally and physically. Once you take that fitness test, you can assess your training effectiveness. Similarly to how I think about troubleshooting, the more `types of errors` I see. The better I get. The annoying thing, typos. <br>

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

```
python3 requirements_scan.py
```
<br>

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




