# Lab Simulated Devices (01/08/2026)


- `Web-http`  
- `Web-https`  
- `SSH`  

***Let's Create!***  

## Web-http

The `Web-http` container is intended to represent a very basic `HTTP` server. The frontend index page is currently (01/13/2026) and intentionally configured to be an `HTTP` only website. The `Web-https` container is configured to behave like a basic `HTTPS` Website. I can add search bars and or other features to a different version of `Web-https`, that allows other things to be tested...  

On the network it:  
    - Listens on TCP port 80  
    - Responds to any hostname  
    - Serves static content  
    - Logs all requests in a clean, analyzable format  
    - Exposes a known /health endpoint  

### NGINX Configuration

With the `HTTP` container, we want to:  
- Have `events {}`: empty on purpose to keep the configuration minimal and behave how a `HTTP` server might.  
- The `http {}` protocol defines everything related to the `HTTP` behavior:  
    - logging  
    - headers  
    - servers
    - locations
- `log_format` defines what the `HTTP` server will log.  
- `access_log` can help in determining the `3-www`s:  
    - `When` the `(CD)` was requested to view the `HTTP` website.  
    - `Who` made the request.  
    - `What` resource(s) were requested.  
- `error_log` will show:  
    - config issues  
    - request issues  
    - runtime issues  
- The `/health` check is an endpoint that when probed should always return:  
    - HTTP `200`  
    - In plain text `ok`  
    This Simulates a device *ping* at the `Application` layer (7)  
- This will make the `Web-http` container easy to detect in logs and with `PCAP`s.  


### HTTP Index.html

Currently (01/13/2026), the `index.html` page **does not** have any `Content Security Policy` instructions. It "simply" serves the index.html file over an less secure connection.  

## Web-https

Similar with the basic `Web-http` container with it behaving *like* an `HTTP` server, the `Web-https` container requires a different configuration, or maybe a higher standard of logging and protocol standards that are required to create the `HTTPS` server. What excites me about this idea is I can create another `Web-https` container to clone a version of my server used with `Azure`...  


### The Docker File

The differences between *these* `HTTP` and `HTTPS` are:  
- Now we have to generate `TLS certs` in the image:
    
    ```
    --- HTTPS ---     ||  --- HTTP ---
    
    - nginx:alpine        - nginx:alpine
    - apk add openssl     - Does not
    - cert directory      - Does not
    - openssl req         - Does not 
    - listen 443 ssl;     - listen 80; 
    ```
        
  - 1. Both use the `alpine` image (could use another...).  
  - 2. Next the `cert directory` gets created:  
      - `mkdir` `-p` `/etc/nginx/certs`...  
  - 3. HTTPS uses `openssl req...O=MacN-Lab/OU=Training/...`, this will generate the required certification key. 
  - 4. We `COPY` these configurations when it goes into its runtime state (?)...  
  - 5. Lastly, we `Expose` the server port on `443`.  

These two `containers` do share:  
    - logging:  
        - `access_log` / `error_log`
        - `server_name _;` log all  
        - `location /` serving the static `index.html`, `CSS` files.  
        - `location = /health` returning `"OK\n"`.  

#### Front-End Web-https container 

(01/14/2026) After the containers are all spun-up and the servers are live the `front-end` can be viewed. For this `Web-https` container I want to create a base-line for a *secured* front-facing web-app. I incorperated my other used `CSP` instructions. An actual static webpage can be viewed via terminal link. From this base line I can then create addtional variations if needed.

The Lab `HTTPS` `CSP` baseline goals:  
    - Allow only same-origin resources  
    - No inline scripts (none used)  
    - No inline styles  
    - No external fonts/CDNs  
    - Block object/embed  
    - restrict form actions  
    - No sniff  
    - No referrer  

***Noted Sorces***  

- Computer Networking || A Top-Down Approach 8th Edition  
    By: James Kurose and Keith Ross  
- OSI model: `https://en.wikipedia.org/wiki/OSI_model`  



