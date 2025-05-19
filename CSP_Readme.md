# Security Headers

(05/13/2025.1400)
This is working collection of CSP content that describes `what`, `how`, `why` the `Content-Security-Policy` has these prevention scripts.<br>
There are many other types of exploits.<br>
The `Content-Security-Policy` is intended to disable or prevent `Malicious` injectable content.<br>

***Note*** This is not a how to guide.<br>

## Content-Security-Policy

    ```
    <meta http-equiv="Content-Security-Policy" 
    content=
    ```

CSP Example:<br>

```
<meta http-equiv="Content-Security-Policy" 
    content= 
        "script-src 'self'; 
        object-src 'none'; 
        base-uri 'none'; 
        worker-src 'none'; 
        connect-src 'self';>
```

## Blob-based Exploits

Technical term: Blob URL-based script injection <br> 

`Blob` misuse + `URL.createObjectURL()` abuse.<br>

Slang: *"Blob bomb"*, *"Blob bypass"* ***Kadoosh***<br>

How it’s initiated: Malicious JS uses `Blob` `URL`s to bypass `CSP` by generating in-browser script objects.<br>

Effects: Can reintroduce inline script injection or download data from external sources.<br>

Sneaky little party crasher wrapped a payload in a `blob—bypasses` `CSP` who livestreams your world. `Inline script injection` = `unexpected` code doing shady stuff inside your site. `External sources` = `code` *phoning* home to servers you didn’t invite.<br>

### Prevention:<br>

Block this with `script-src 'self'`.<br>

To Prevent `blob`: and *data:* for scripts: `script-src 'self';` is not enough, ensure you add:<br>

```
script-src 'self'; 
base-uri 'none'; 
object-src 'none'; 
worker-src 'none'; 
frame-src 'none';
```

## Reflected XSS

Technical term: Reflected Cross-Site Scripting <br>

Slang: "smash", "echo XSS" <br>

How initiated: Malicious links *trick* your page into `rendering` injected script, often from search bars or query parameters.

Effects: Script execution in the context of a website site. Phishing, session theft.<br>

Some *Malicious* code gets entered into a URL and the site echoes it right back—baddaboom, the payload executes like it’s welcomed.<br>

### Prevention: Disable inline scripts:<br>

```
script-src 'self'; 
style-src 'self'; 
object-src 'none';
```

### Remove unsafe-inline

Use `<meta name="referrer" content="no-referrer">` or set strict `Referrer-Policy`.<br>

## DOM-based XSS

Technical term: DOM XSS (Client-side XSS)<br>

Slang: "DOM pop", "Deep XSS"<br>

How initiated: *Malicious* input (Example: URL hash, query string) is read via JS and injected into the page `DOM`.<br>

- URL Hash, Query String:
  1. These are the "ends" of a web address - the stuff after the `?` or `#`.<br>
  Example: `https://myblog.com/page.html` `<-- After This-->` `?message=<script>boom</script>` <-- this section.<br>

Effects: Similar to above; attacker owns the DOM temporarily.<br>

Your JS grabs some *Malicious* user input, doesn’t validate it, then injects the `Malicious user input` into the page, and things get squirrely. Suddenly, the browser is running wild.<br>

### Prevention: 

Avoid using `innerHTML`, `document.write`, or `unvalidated location.hash/location.search`.<br>

Sanitize all dynamic DOM insertions.<br>

Use `Trusted Types`:<br>

`Content-Security-Policy`: `require-trusted-types-for 'script';`<br>


## JSONP or Open Redirect

Technical term: JSONP hijacking, Open Redirect <br>

Slang: "Jplosion", "redwhack" <br>

How initiated: Attacker uses `jsonp?callback=` or abuses redirect parameters like `?next=`.<br>

Effects: Data exfiltration, phishing redirects - Bad business.<br>

- `Data Exfiltration` = A term for ***YOINKS***. *Your* info becomes *their* info, without *your* approval...<br>
  ***YOINKS!!*** We're being robbed.<br>
- `Bad business` = Code that leaks, sneaks, or peaks where it shouldn’t. Just like a vendor having a yard sale behind behind the gas station. It ain’t a good look, but hey! I got a good deal on the golf clubs...<br>

`JSONP`: A friendly-looking data callback turns into a full data exfiltration heist. The backdoor was built into the front door.<br>
`Open Redirect`: You click a "login" link and suddenly you’re halfway across the dark web before your coffee cools😱.<br>

### Prevention:

Never include `?redirect=` or `?next=` parameters unvalidated.<br>

Disable use of `jsonp` or `dynamic script loading` via external domains.<br>

`CSP` should prevent `script-src` from loading anything from external sources:<br>

```
script-src 'self'; connect-src 'self';
```

## Clickjacking

Technical term: UI Redress Attack <br>

Slang: "Iframe trap", "ghost click"<br>

How initiated: Your site is embedded in a hidden iframe; user clicks invisible buttons.<br>

Effects: Phishing, tricked actions.<br>

A malicious invisible `iframe` *overlaid* on the real site. You think you’re liking a kitten post, but you’re wiring someone crypto.<br>

### Prevention:

```
<meta http-equiv="X-Frame-Options" content="DENY">
```

Or in the `CSP`:<br>

`frame-ancestors 'none';`<br>

## Browser Plugin Abuse or External Resource Injection
 
Technical term: Extension injection / third-party JS compromise<br>

Slang: "Ex-smash", "3P ghost(Third Party)", "Ghost Script"<br>

How initiated: `Malicious` browser extensions or `Malicious` `CDN`s (like an old jQuery from a CDN).<br>

Effects: Credential theft, full DOM control.<br>

A “trusted” script that *ghosts* your site with malicious updates when no one's looking.<br>

### Prevention:

Ensure `script-src` does not allow `unsafe-eval`, `unsafe-inline`, or `third-party CDNs` unless `subresource integrity (integrity="")` is used.<br>

You’re sorta safe if you keep all scripts local and avoid extensions like... I mean. <br>

If you only use code you wrote or sources yourself (and not from a *random* online sources), it’s like locking your own door instead of giving your key to strangers.<br>
The CSP below keeps it tight:
```
script-src 'self'; 
style-src 'self'; 
object-src 'none';
```

Example of a Hardened CSP Header:

```
<meta http-equiv="Content-Security-Policy"
    content=
    "default-src 'self'; 
    script-src 'self'; 
    style-src 'self'; 
    img-src 'self' data:; 
    font-src 'self'; 
    object-src 'none'; 
    base-uri 'none'; 
    connect-src 'self'; 
    frame-ancestors 'none'; 
    require-trusted-types-for 'script';">
```

## Additional Enhancements:

`Subresource Integrity (SRI)` if you ever include external scripts/styles.<br>

`Service Worker restrictions`: Don't register service workers unless absolutely necessary.<br>

`Strict-MIME` checking with:<br>

```
<meta http-equiv="X-Content-Type-Options" content="nosniff">
```

### Notable Signs of Exploits:

Unusual DOM behavior (popups, redirects).<br>

JavaScript console logs you didn’t write.<br>

Strange network requests in DevTools → "Network" tab.<br>

Cookies or storage modifications.<br>

Unexpected outbound fetch() or XMLHttpRequest.<br>


#### CSP Hardening: Terminology

```
    Term:                                      Definition:
- Payload	    In web security, a payload is the part of an attack (like JavaScript or SQLcode) 
                that gets delivered and executed. Think of it as the “package” that causes harm once inserted into the site.

- Scripts       Code written in languages like JavaScript that runs on a web page, often controlling interaction, behavior, or data fetches.	

- Render / Rendering        The process where the browser displays HTML, CSS, and JavaScript to form the visual web page that users interact with.

- Script Injection      A form of attack where malicious scripts are inserted into otherwise benign websites. 
                        If successful, the browser runs the attacker's script as if it were legitimate.

- DOM (Document Object Model)       A structured representation of HTML elements as objects. 
                                    It allows scripts to manipulate content, structure, and styles dynamically.

- JSON (JavaScript Object Notation)     A lightweight data format used to exchange information between client and server in web applications. 
                                        Easy to read and write for both humans and machines.

- Open Redirect     A vulnerability that lets attackers redirect users to malicious sites by tricking a website into redirecting
                    using a manipulated URL parameter (Example ?next=http://allthebadsite.com).

- Iframe (Inline Frame)     An HTML element used to embed another website within a page. Often used for videos, documents, or external tools, 
                            but can be abused for clickjacking or phishing.

- Overlaid (on the real site)       Refers to malicious elements (Example: invisible iframes or fake buttons) 
                                    that are placed on top of the real webpage, tricking users into clicking on them. 

- Old jQuery        Legacy versions of the jQuery library (especially < 3.5) have known security flaws, like allowing cross-site scripting if used improperly.

- CDN (Content Delivery Network)		A globally distributed network of servers that deliver web content (like scripts, fonts, or media)
                                        to users from the closest location. While convenient, CDNs can be attack vectors if scripts are not verified.

- Credential Theft      	Stealing usernames, passwords, or tokens through phishing, malicious scripts, or man-in-the-middle attacks.

- Full DOM Control      	When a malicious script gains access to modify and read the entire structure of a web page, 
                            it allows actions like reading cookies, changing form actions, or injecting further malware.

- Subresource Integrity (SRI)       A security feature that allows browsers to verify that files (like JS/CSS from CDNs) 
                                    haven’t been tampered with by checking a cryptographic hash of the file.

- MIME (Multipurpose Internet Mail Extensions)      A standard that tells the browser how to interpret file types. Incorrect MIME types 
                                                    can cause a browser to "sniff" and misinterpret files, potentially leading to security flaws. 
                                                    Headers like X-Content-Type-Options: nosniff prevent this.

- child-src         Allows the developer to control nested browsing contexts and worker execution contexts.

- connect-src       Provides control over fetch requests, XHR, eventsource, beacon and websockets connections.

- font-src      Specifies which URLs to load fonts from.

- img-src       Specifies the URLs that images can be loaded from.

- manifest-src      Specifies the URLs that application manifests may be loaded from.

- media-src         Specifies the URLs from which video, audio and text track resources can be loaded from.

- prefetch-src      Specifies the URLs from which resources can be prefetched from.

- object-src      Specifies the URLs from which plugins can be loaded from.

- script-src        Specifies the locations from which a script can be executed from. It is a fallback directive for other script-like directives.

- script-src-elem       Controls the location from which execution of script requests and blocks can occur.

- script-src-attr       Controls the execution of event handlers.

- style-src         Controls from where styles get applied to a document. 
                    This includes <link> elements, @import rules, and requests originating from a Link HTTP response header field.

- style-src-elem        Controls styles except for inline attributes.

- style-src-attr        Controls styles attributes.

- default-src       Is a fallback directive for the other fetch directives. Directives that are specified have no inheritance, 
                    yet directives that are not specified will fall back to the value of default-src.

```


#### Noted Sources

- CSP https://web.dev/articles/csp
- Google Web Fundamentals – CSP Mozilla CSP Guide https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- OWASP Content Security Policy Cheat Sheet https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
*The OWASP Cheat Sheet is very helpfull*
