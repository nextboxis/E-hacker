// E-HACKER 6-Stage Specialization & Skill Mastery Roadmap Curriculum

export const STAGES = [
    {
        num: 1,
        code: "STG-01",
        title: "Pre-Security & Core Fundamentals",
        desc: "Master Linux terminal navigation, core TCP/IP networking, DNS resolution, HTTP/S request-response lifecycle, and basic Python scripting.",
        color: "#38bdf8",
        cert: "CompTIA Security+ / Linux+",
        track: "full",
        skills: [
            { id: "sec-fund", name: "Security Architecture & CIA Triad", xp: 25, track: "full" },
            { id: "linux-cli", name: "Linux Bash CLI & File Permissions (chmod/chown)", xp: 25, track: "network" },
            { id: "net-tcp", name: "TCP/IP 3-Way Handshake & OSI Model", xp: 25, track: "network" },
            { id: "web-http", name: "HTTP/1.1 & HTTP/2 Request/Response Anatomy", xp: 25, track: "web" },
            { id: "dns-recon", name: "DNS Record Types & Resolution Mechanics", xp: 25, track: "osint" },
            { id: "py-basics", name: "Python Scripting for Sockets & Automation", xp: 25, track: "network" }
        ]
    },
    {
        num: 2,
        code: "STG-02",
        title: "Network Auditing & Traffic Forensics",
        desc: "Port scanning, service fingerprinting, protocol dissection, PCAP traffic analysis, and vulnerability exploitation.",
        color: "#22c55e",
        cert: "eJPT / CompTIA CySA+",
        track: "network",
        skills: [
            { id: "nmap-audit", name: "Nmap SYN, UDP & NSE Script Scanning", xp: 25, track: "network" },
            { id: "wireshark-audit", name: "Wireshark Display Filters & TCP Stream Reassembly", xp: 25, track: "soc" },
            { id: "metasploit-exploit", name: "Metasploit Multi-Handler & Staged Payloads", xp: 25, track: "network" },
            { id: "mitm-arp", name: "ARP Spoofing & SSL Stripping MitM Attacks", xp: 25, track: "network" },
            { id: "ssh-hydra", name: "Hydra Automated Service Credential Auditing", xp: 25, track: "network" },
            { id: "snmp-enum", name: "SNMP Community String MIB Enumeration", xp: 25, track: "network" }
        ]
    },
    {
        num: 3,
        code: "STG-03",
        title: "Web Application Penetration Testing",
        desc: "Systematic auditing of OWASP Top 10 vulnerabilities, intercepting proxies, business logic flaws, and API security.",
        color: "#eab308",
        cert: "PortSwigger BSCP / OSWE",
        track: "web",
        skills: [
            { id: "sqli-mastery", name: "SQL Injection (UNION, Blind, Time-Based)", xp: 25, track: "web" },
            { id: "xss-audit", name: "Cross-Site Scripting (Reflected, Stored, DOM)", xp: 25, track: "web" },
            { id: "ssrf-cloud", name: "Server-Side Request Forgery & Cloud IMDS Theft", xp: 25, track: "web" },
            { id: "idor-access", name: "Insecure Direct Object References (IDOR/BOLA)", xp: 25, track: "web" },
            { id: "xxe-injection", name: "XML External Entity (XXE) File Exfiltration", xp: 25, track: "web" },
            { id: "jwt-bypass", name: "JWT Signature Stripping & None Algorithm Abuse", xp: 25, track: "web" },
            { id: "ssti-rce", name: "Server-Side Template Injection to Remote Code Exec", xp: 25, track: "web" }
        ]
    },
    {
        num: 4,
        code: "STG-04",
        title: "Active Directory & Enterprise Exploitation",
        desc: "Kerberos ticket attacks, ACL abuse, LDAP enumeration, DCSync, pass-the-hash, and ADCS escalation.",
        color: "#f97316",
        cert: "PNPT / CRTP / OSCP",
        track: "network",
        skills: [
            { id: "ad-kerberoast", name: "Kerberoasting SPN Service Account Hashes", xp: 25, track: "network" },
            { id: "ad-dcsync", name: "DCSync Replication NTDS.dit Password Extraction", xp: 25, track: "network" },
            { id: "ad-bloodhound", name: "BloodHound Neo4j Shortest Attack Path Graphing", xp: 25, track: "network" },
            { id: "ad-asrep", name: "AS-REP Roasting No-Preauth User Accounts", xp: 25, track: "network" },
            { id: "ad-adcs", name: "Active Directory Certificate Services (ESC1-ESC8)", xp: 25, track: "network" },
            { id: "ad-pth", name: "Pass-the-Hash & Pass-the-Ticket Lateral Movement", xp: 25, track: "network" },
            { id: "ad-responder", name: "LLMNR / NBT-NS Poisoning with Responder", xp: 25, track: "network" }
        ]
    },
    {
        num: 5,
        code: "STG-05",
        title: "Threat Hunting & Blue Team Detection",
        desc: "SIEM log analysis, Sigma rule engineering, volatile memory forensics, YARA scanning, and incident triage.",
        color: "#a855f7",
        cert: "BTL1 / CCD / GCIH",
        track: "soc",
        skills: [
            { id: "siem-hunting", name: "Splunk & Elastic SIEM Event Correlation", xp: 25, track: "soc" },
            { id: "sigma-rules", name: "Sigma Generic Detection Rule Authoring", xp: 25, track: "soc" },
            { id: "yara-scans", name: "YARA Rule Memory & Binary Pattern Matching", xp: 25, track: "malware" },
            { id: "volatility-mem", name: "Volatility 3 Kernel Object & VAD Forensics", xp: 25, track: "soc" },
            { id: "zeek-hunting", name: "Zeek Network Threat & DNS Tunneling Analysis", xp: 25, track: "soc" },
            { id: "sysmon-audit", name: "Sysmon Process Creation & Parent-Child Lineage", xp: 25, track: "soc" }
        ]
    },
    {
        num: 6,
        code: "STG-06",
        title: "Exploit Dev, Reversing & AI Security",
        desc: "Ghidra decompilation, buffer overflow development, x86_64 assembly, and LLM adversarial red teaming.",
        color: "#ec4899",
        cert: "OSEP / OSED / CRTO",
        track: "malware",
        skills: [
            { id: "ghidra-re", name: "Ghidra Static Decompilation & P-Code Reversing", xp: 25, track: "malware" },
            { id: "bof-exploit", name: "Stack-Based Buffer Overflow & EIP Control", xp: 25, track: "malware" },
            { id: "shellcode-dev", name: "x86_64 Assembly Shellcode Development", xp: 25, track: "malware" },
            { id: "llm-redteam", name: "LLM Prompt Injection, Jailbreaking & PyRIT", xp: 25, track: "full" },
            { id: "edr-evasion", name: "AMSI Bypass & Process Hollowing Techniques", xp: 25, track: "network" }
        ]
    }
];
