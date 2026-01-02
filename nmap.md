# Nmap: Live Host Discovery

## Nmap

What is `Nmap` or `Zenmap`? From a simple google search you can see the following: 

`Nmap` is used through the terminal/command line.  
`Zenmap` is a `Graphical User Interface` (GUI) that provides the user with a visual interface to interact with.    

- `Host Discovery`: Identifies which devices (hosts, servers, routers, switches) are online and reachable on a network.
- `Port Scanning`: Determines the state of ports on a target device (open, closed, or filtered by a firewall), which helps identify potential entry points for attackers.
- `Service` and `Version` Detection: Probes open ports to identify the application and specific software version of the service running on them. This helps in detecting outdated or vulnerable software.
- `Operating System` (OS) Detection: Analyzes network responses using TCP/IP stack fingerprinting to determine the OS (e.g., Linux, Windows, macOS) and hardware characteristics of the remote host.
- `Vulnerability` Detection: The Nmap Scripting Engine (NSE) allows users to run scripts to automate various tasks, including checking for specific known vulnerabilities, misconfigurations, and backdoors.
- `Network Inventory` and `Monitoring`: Network administrators use Nmap for routine tasks like asset management, monitoring server uptime, and ensuring security compliance.
Usage
- `Nmap` is primarily a `command-line interface` (CLI) tool available for **Linux**, **Windows**, and **macOS**. A graphical user interface (GUI) version called `Zenmap` is also available to help beginners visualize and interact with scan results.

`Nmap` is a powerful tool used by security professionals and ethical hackers for defensive purposes, ***BUT*** it can also be used by *malicious actors* for `reconnaissance`. `Unauthorized scanning` of networks may be **illegal**, so it should ***only*** be used on `your own network` or with **explicit permission** from the network owner (In writing).  

## First Build a Docker Sandbox

I could just do the **TryHackMe** learning mod and take notes, but I would rather build an environment to also test scanning tools and Network capturing methods - in order to show how the tools are used ethically.  

***Only Use On Authorized Networks***  
***Always Seek Improvements***

## My Sandbox

What is a ***"sandbox"***, or more like why am I using that word to describe what this `Docker` container is for. This `Docker` container or `sandbox` is meant to provide a secure "off network" environment that I can create fake targets - such as a cellphone, Web-Site, or Server.  
The reason I am building this type of environment is, while I am using:  

```Nmap Live Host Discovery
Learn how to use Nmap to discover live hosts using ARP scan, ICMP scan, and TCP/UDP ping scan.
```  

TryHackMe learning modular:  
`https://tryhackme.com/room/nmap01`  

Is because **network discovery** is a basic skill that you could test out on `your own private/home wifi network`.  
***Note***  
Some commands may be too "noisey" and not recommended to test on `your own network`.  

*But!*  
This is *why* I want to build this type of `Docker sandbox`, By building this `sandbox` I can create a relatively safe environment to test software tools without getting in troublez...  

### Lab and Folder Layout

#### Lab Architecture

- `Scanner` container: To run `Nmap` commands.  
- `mac-a-tron` (`Docker container`): Can be used to simulate a targeted device or system.  
  - Additional *"false targets"*:  
    - `web-server`, `servers` etc...  
- `Sniffer` (`Docker container`): This container will allow us to run `tcpdump` to capture network traffic to `.pcap`.  
  - `.pcap`: `P` + `cap`: Packet Capture with `Wireshark` from my host device or `WSL` terminal.

#### Folder Layout

```Nmap/
    Dev-Diary: nmap.md
    Nmap-Sandbox/
        docker-compose.yml
    targets/
        mac-a-tron/     # Fake Phone Device
            Dockerfile
            start.sh
    captures/           # PCAP files will appear here
```

## Step 1: `docker-compose.yml`

***Let's Create***

In the `Nmap-Sandbox` folder create a file named:

`docker-compose.yml`  

The `.yml` file "YAML" (YAML Ain't Markup Language)/(Yet Another Markup Language) is a human-readable text format for storing data, commonly used for configuration files and data exchange, featuring simple syntax with indentation for structure, making it easy for people and programs to read and write structured information like key-value pairs and lists. *That's what it stands for*🤷🏻‍♂️.  

- In this `.yml` file we are defining the `service networks`. The `service networks` section defines the overall network addresses and sub-nets (See if that statement is true. I think my terminology is correct, but could be wrong).  

- In the `Targets Section`: we want to create possible devices or simulate a systems network:
    - `mac-a-tron` **false**: cellphone network. (Docker Container)  
    - `web1` **false**: website named: `web1`- (Docker Container)  
    - `ssh1` **false shell**: This is to represent a **Lab-only SSH target**.  
    - `sniffer` **Tools Container**: This section contains the `Packet Capturing` network.  

### Service Networks (12/21/2025.1230)

`services:`  

- The `services` section is where we define every container that exists in the lab — scanners, targets, and tools — and how they behave on the network.  

    - `scanner:` The `scanner` *container* contains the:  
        - `image:` Specify the `image` you want the container to start from. This can be from multiple different sources: `repository`/`tag`, a `digest`, or a *local* `image ID`.  
        `instrumentisto/nmap:latest` This means we want a minimal container built specifically to run `Nmap` and the required dependencies, without unnecessary services and background processes.
        - `container_name`: ("Simply") name *what* the container is for. Consider this lab: Example: `nmap_scanner`.  
        - `command: ["sleep", "infinity"]` In the `command: ["brackets"]` are: `"sleep"`, `"infinity"`. This keeps the container running without executing a scan automatically. The scanner waits in an idle state until commands are run manually.  
        - `networks:` `networks` to join, entries under the top-level networks key. This can be a list of network names or a mapping of network names to network configuration. In this section we can define the parameters such as:  
            - The `labnet:`  
                - `ipv4_address:` This `ipv4` `address` is a static IPv4 address for the `scanner` service to be used on this network.  
        - `security_opt:`  This is the labeling scheme. Each container will have its 
            - `- no-new-privileges:true`  own security scheme. Depending on the type of
        - `cap_drop: ["ALL"]` need, can determine if *raw sockets* are needed.  
        - `read_only: true` The `read_only` is set to `true` because we do not want anything modifying its own filesystem. Also, the tool does not need to write to a file.
        - `tmpfs:` This creates a temporary, in-memory filesystem.  
            - `- /tmp` This allows the container to use `/tmp` for short-lived runtimes.
            Any data written here exists only while the container is running and is erased when the container stops. This supports tools that expect a writable *temporary* directory without allowing permanent disk writes.  
        - `pids_limit: 256` The `pids_limit` limits the number of processes the container is allowed to create. It prevents runaway processes from spawning and keeps one container from exhausting system process resources.  
        - `mem_limit: 512m` In this section, the `memory` `limit` caps the maximum memory each container can use (per each own container scheme).  


***Example***  

```
scanner:
    image: instrumentisto/nmap:latest
    container_name: nmap_scanner
    command: ["sleep", "infinity"]
    networks:
      labnet:
        ipv4_address: 172.30.40.10
    security_opt:
      - no-new-privileges:true
    cap_drop: ["ALL"]
    environment.
    read_only: true
    tmpfs:
      - /tmp
    pids_limit: 256
    mem_limit: 512m
```

**Acceptable IP Addresses**  

```
172.30.30.10	Private RFC1918
10.10.10.10	 	Private RFC1918
```

**Note**  
Each `Tool` and simulated network device: `cellphone`, `website-http`, `website-https`, each has a similar structure of instructions as the `Scanner tool`.  
  


### Simulated Devices

These are simulated devices that can be scanned, and are connected to the same network.  

  - A cellphone named: `mac-a-tron`  
  - A web site named: `lab_web1`  
  - A lab only ssh target named: `lab_ssh1`  

### Cellphone target: Mac-A-Tron (mimics a mobile device - sortof)

In the simulated devices section each device has it's own build type but shares network parmeters. `Cellphone`, `HTTP`, `HTTPS`...  

- Each device can be harden further as needed.  

#### `Mac-a-tron`: Simulated Cellular Device

  - `build`: desginates the directory path.  
  - `container_name`: For each device there is a name for the container.  
  - `hostname`: Similar to whatever name you might call your device.
  - `networks`, `security_opt`, and `cap_drop` are the same as the `toolbox`.  

```
mac-a-tron:
    build: ./targets/mac-a-tron
    container_name: mac-a-tron
    hostname: Mac-A-tron
    networks:
      labnet:
        ipv4_address: 10.10.10.10
    security_opt:
      - no-new-privileges:true
    cap_drop: ["ALL"]
    pids_limit: 128
    mem_limit: 256m
```

### Website/server: lab_web1: http + https

The `Website/server` sections we add the `image:` parameter to http only. 
the `HTTPS` uses `build:` 

#### HTTP

`HTTP` uses the `nginx` image because, the `Nginx Image` comes ready to run as-is for basic `HTTP` on port 80.  
For the `HTTP` lab we do not need any custom files to simulate hosting.  

```
  web-http:
    image: nginx:alpine
    container_name: lab_web_http
    ...
    ...
    ...
    read_only: true
    tmpfs:
      - /var/cache/nginx
      - /var/run
      - /tmp
    pids_limit: 128
    mem_limit: 256m
```

#### HTTPS

`HTTPS` requires custom files.

  - `build`: The container in the `./targets` directory with this name: `web-https`.  
  - `container_name`: The names can always be changed depending on the simulated device target.  

`HTTPS` *needs*:  

  - `TLS` certificate and a private key (It is self-signing for the lab).  
  - A `Nginx` configuration that enables `listen 443 ssl;`.  
  - The `build:` option lets us create custom images that contain:
    - the `self-signed` cert.  
    - the `HTTPS` `Nginx` Configuration.  
    - A basic test webpage.  

  - `networks`, `security_opt`, and `cap_drop` are the same as the `toolbox`.  
  - `read_only: true` is set to true.  
  - `tmpfs`: Creates a termporary writable space in memory (RAM).  
    - The container filesystem is locked down, but `Nginx` may still have to write data...  
      - `/var/cache/nginx`: This path is for `cache` and temporary files.  
      - `/var/run`: This is where the runtime files go. This allows for clean start ups each time...  
      - `/tmp`: This section is for temporary processessing, and stability stuff.  
  - `pids_limit: 128`: This is set to `128` to prevent too many processes.  
  - `mem_limit: 256m`: The `mem_limit` (memory_limit) is set to `256m` so the target can't consume too much of the hosts RAM.  


```
web-https:  
  build: ./targets/web-https  
  container_name: lab_web_https  
  ...  
  ...  
  ...  
  read_only: true  
  tmpfs:  
    - /var/cache/nginx  
    - /var/run  
    - /tmp  
  pids_limit: 128  
  mem_limit: 256m  
```










**Noted Sources**  

- `The Ultimate Docker Container Book` - By: Dr. Gabriel Shenker.  
- `The Ultimate Linux Shell Scripting Guide` - By: Donald Tevault.  






