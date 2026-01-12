# Lab Simulated Cellular Devices (CD) (01/07/2026)

The purpose of this container is represent an optional cellphone that connects to the network, **not an acutal phone**. I can create a signal to communicate with another container to represent the device communicating with the HTTP or HTTPS test website. This is the basic idea before improvements.  


***Let's Create!***  

## Mac-A-Tron

(01/12/2026.1400) 
Currently the device behavior is that it connects to the network. Then it will access the `http` website for a period of time. After done viewing the `http` website the device accesses the `https` website for a period of time, disconnects and then loops. Those are my user simulated actions.  
Multiple devices could be created to simulate other optional devices connecting to the network.  


### The Docker File

Starting with the `base image` `FROM` I am using `alpine`. There are other types of images available, from online articles it is said that `alpine` has *less of* a `visable surface`. I have used `alpine` in other projects, so there is slight familularity.   
- `FROM alpine:` followed by the version you are want (choose the one that has been maintained (01/12/2026 version:3.20)).  
- Next we `RUN` the install and initial system setup.  
    - We want to install minimal tools for the `CD` container:
        - `busybox`provides `httpd`and other utilites.  
        - `openssh-server` allows the container to accept another `SSH` connection.  
        - `cURL` is used so the container can generate `outbound` `HTTP/HTTPS` traffic.  
        - `ca-certificates` is used so `TLS` connections can *validate* certificates as needed.  
    - This next section I want to start with a *default* `harden` `sshd` for the lab device.  
        - No root login  
        - Allow password auth (To be able to `SSH` into the lab)
        - No `X11 forwarding`: `X11 forwarding` should be disabled for this lab. *Simply* disabling `X11` avoids pointless complexity the lab does not need.  
        - This adds constraints:  
            - Fewer authorization attempts (Max 3)  
            - Disables `port forwarding`/`tunneling` features (`AllowTcpForwading no`, `PermitTunnel no`)
    - `COPY start.sh /start.sh` plus `chmod +x`
        - *Copies* - during runtime, the `start.sh` file. This starts the services and runs the traffic simulation loop.  


### The Start File

As the container starts and the `start.sh` file are copied into a runtime state. The `start.sh` file uses:  
    - 1. Strict shell `set eu`:
        - `-e`: Stop on errors  
        - `-u`: Error if an unset variable is used   
    - Creating the Signal to the `http/https` labs.  
        - `HTTP_TARGET` default to `http://lab_web_http`  
        - `HTTPS_TARGET` default to `https://lab_web_https`  
    - Windows of Communication section determines how `*Chatty*` the device is  
        - `REQUEST_INTERVAL_SEC` controls how ofter a request to communicate is sent.  
            - (As of: 01/12/2026) The `Window`'s loop while active:  
                - Talk to HTTP for a set time  
                - Be Quiet for a set time  
                - Talk to HTTPS for a set time  
                - Be Quier for set time  
                - ...Then repeat...  
    - Phone Portal Server Simulation" (PPSS): To create an `Optional` `Cellular Device` (CD) connecting to the network then to communicate with the `HTTP`/`HTTPS`.  
    The (PPSS) section creates `outbound` `TCP` connections from the cellular device...  
        - To port `80` for the `HTTP` session  
        - To port `443` for the `HTTPS` session  
  


***Noted Surces***  

- Alpine Images: `https://hub.docker.com/_/alpine`  
-  


