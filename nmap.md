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

In the `Nmap-Sandbox` folder create this file named:

`docker-compose.yml`  

The `.yml` file "YAML" (YAML Ain't Markup Language)/(Yet Another Markup Language) is a human-readable text format for storing data, commonly used for configuration files and data exchange, featuring simple syntax with indentation for structure, making it easy for people and programs to read and write structured information like key-value pairs and lists. *that's what it stands for*.  

- In this `.yml` file we are defining the `services` networks. The `services` networks section defines the overall network address and sub-nets (See if that statement is true. I think my terminology is correct, but could be wrong).  

- In the `Targets Section`: we want to create possible devices or simulate a systems network:
    - `mac-a-tron` **false**: cellphone network. (Docker Container)  
    - `web1` **false**: website named: `web1`- (Docker Container)  
    - `ssh1` **false shell**: This is to represent a **Lab-only SSH target**.  
    - `sniffer` **Tools Container**: This section contains the `Packet Capturing` network.  

