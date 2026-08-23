export const PRACTICE_PLATFORMS = [
    {
        name: "PortSwigger Web Security Academy",
        cat: "Web Application Security",
        desc: "Free, interactive web security training from the creators of Burp Suite. Covers SQLi, XSS, CSRF, SSRF, OAuth, and business logic flaws with 250+ labs.",
        link: "https://portswigger.net/web-security",
        badge: "Free - Best for Web"
    },
    {
        name: "Hack The Box (HTB)",
        cat: "Offensive Security & CTF",
        desc: "Premier cyber training platform with 500+ retired and active VMs, Pro Labs, Fortresses, and Tracks covering AD, Web, RE, and Crypto.",
        link: "https://www.hackthebox.com",
        badge: "Hands-on VMs"
    },
    {
        name: "TryHackMe (THM)",
        cat: "Beginner to Intermediate CTF",
        desc: "Gamified, browser-based hands-on rooms covering cybersecurity fundamentals, network exploitation, SOC defense, and guided attack paths.",
        link: "https://tryhackme.com",
        badge: "Guided Learning"
    },
    {
        name: "OverTheWire Wargames",
        cat: "Linux & Binary Exploitation",
        desc: "Legendary SSH wargames: Bandit (Linux basics), Natas (Web), Leviathan, Narnia (Binary), Behemoth, Krypton (Crypto).",
        link: "https://overthewire.org/wargames",
        badge: "Free SSH Wargame"
    },
    {
        name: "CyberDefenders",
        cat: "Blue Team & SOC Forensics",
        desc: "Hands-on defense training with realistic PCAP forensics, memory dumps, SIEM investigation challenges, and malware analysis labs.",
        link: "https://cyberdefenders.org",
        badge: "Blue Team Labs"
    },
    {
        name: "PicoCTF",
        cat: "Cyber Competitions & CTF",
        desc: "Carnegie Mellon University's free educational CTF with progressive challenges in cryptography, reverse engineering, web, forensics, and pwn.",
        link: "https://picoctf.org",
        badge: "Free CTF"
    },
    {
        name: "HackTheBox Academy",
        cat: "Structured Learning Paths",
        desc: "Structured module-based training with Tier 0-2 learning paths covering Penetration Testing, SOC, Bug Bounty, and DevSecOps.",
        link: "https://academy.hackthebox.com",
        badge: "Modules & Paths"
    },
    {
        name: "VulnHub",
        cat: "Offline VM Practice",
        desc: "Downloadable intentionally vulnerable VMs for local exploitation practice. Great for OSCP preparation with 700+ machines.",
        link: "https://www.vulnhub.com",
        badge: "Offline VMs"
    },
    {
        name: "Immersive Labs",
        cat: "Enterprise Cyber Range",
        desc: "Cloud-hosted cyber range with real-world attack scenarios, SOC investigations, threat hunting, and crisis simulation exercises.",
        link: "https://www.immersivelabs.com",
        badge: "Enterprise"
    },
    {
        name: "PentesterLab",
        cat: "Web Exploitation & Code Review",
        desc: "Progressive hands-on exercises teaching web vulnerabilities from basic XSS to advanced deserialization, JWT, and OAuth attacks.",
        link: "https://pentesterlab.com",
        badge: "Web Pentest"
    },
    {
        name: "RingZer0 CTF",
        cat: "Multi-Category CTF",
        desc: "500+ challenges across cryptography, JavaScript deobfuscation, binary exploitation, SQL injection, and steganography.",
        link: "https://ringzer0ctf.com",
        badge: "500+ Challenges"
    },
    {
        name: "Damn Vulnerable Web Application (DVWA)",
        cat: "Local Web Lab",
        desc: "PHP/MySQL web app that is intentionally vulnerable. Four security levels (Low, Medium, High, Impossible) for progressive learning.",
        link: "https://github.com/digininja/DVWA",
        badge: "Self-hosted Lab"
    },
    {
        name: "OWASP Juice Shop",
        cat: "Modern Web Security Lab",
        desc: "Intentionally insecure modern web application (Node.js/Angular) with 100+ hacking challenges aligned to OWASP Top 10.",
        link: "https://owasp.org/www-project-juice-shop",
        badge: "OWASP Official"
    },
    {
        name: "Exploit Education (Phoenix)",
        cat: "Binary Exploitation",
        desc: "Linux binary exploitation training covering stack overflows, format strings, heap exploitation, and networking challenges.",
        link: "https://exploit.education",
        badge: "Binary / Pwn"
    },
    {
        name: "LetsDefend",
        cat: "SOC Analyst Training",
        desc: "Simulated SOC environment with realistic alerts, SIEM dashboards, malware analysis, and incident response playbooks.",
        link: "https://letsdefend.io",
        badge: "SOC Simulator"
    },
    {
        name: "Blue Team Labs Online (BTLO)",
        cat: "Blue Team Defense",
        desc: "Defensive cybersecurity challenges covering log analysis, disk forensics, reverse engineering, and network analysis.",
        link: "https://blueteamlabs.online",
        badge: "Blue Team"
    }
];

export const STANDARDS_AND_CHEATSHEETS = [
    {
        name: "MITRE ATT&CK Matrix",
        cat: "Adversary Tactics & Techniques",
        desc: "Globally accessible knowledge base of adversary tactics and techniques based on real-world threat observations. 14 tactics, 200+ techniques.",
        link: "https://attack.mitre.org",
        badge: "Industry Standard"
    },
    {
        name: "PayloadsAllTheThings",
        cat: "Exploitation & Payloads",
        desc: "Massive curated payload reference for SQL injection, XSS, SSRF, XXE, command injection, deserialization, and directory traversal.",
        link: "https://github.com/swisskyrepo/PayloadsAllTheThings",
        badge: "GitHub 60k+ Stars"
    },
    {
        name: "GTFOBins",
        cat: "Linux Privilege Escalation",
        desc: "Curated list of Unix binaries that can bypass local security restrictions for file read, SUID escalation, and reverse shells.",
        link: "https://gtfobins.github.io",
        badge: "PrivEsc Essential"
    },
    {
        name: "LOLBAS Project",
        cat: "Windows Living Off The Land",
        desc: "Living Off The Land Binaries, Scripts, and Libraries for Windows defense evasion, code execution, and credential theft.",
        link: "https://lolbas-project.github.io",
        badge: "Windows LOLBins"
    },
    {
        name: "OWASP Cheat Sheet Series",
        cat: "Defensive Coding & Architecture",
        desc: "High-value secure development guidelines covering authentication, session management, input validation, and cryptographic storage.",
        link: "https://cheatsheetseries.owasp.org",
        badge: "OWASP Official"
    },
    {
        name: "CyberChef (GCHQ)",
        cat: "Data Encoding & Crypto",
        desc: "The Cyber Swiss Army Knife - web app for encryption, encoding, compression, hashing, and data analysis by UK GCHQ.",
        link: "https://gchq.github.io/CyberChef",
        badge: "GCHQ Tool"
    },
    {
        name: "Exploit Database (Exploit-DB)",
        cat: "CVE & Public Exploit Archive",
        desc: "OffSec-maintained archive of public exploits, shellcode, and vulnerable software. Searchable by CVE, platform, and type.",
        link: "https://www.exploit-db.com",
        badge: "OffSec Archive"
    },
    {
        name: "CISA KEV Catalog",
        cat: "Threat Intelligence",
        desc: "Cybersecurity & Infrastructure Security Agency catalog of Known Exploited Vulnerabilities actively targeted in the wild.",
        link: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
        badge: "CISA Official"
    },
    {
        name: "HackTricks",
        cat: "Comprehensive Pentest Wiki",
        desc: "Massive pentesting methodology wiki covering Linux/Windows privesc, Active Directory, web attacks, cloud, mobile, and reversing.",
        link: "https://book.hacktricks.wiki",
        badge: "Must-Read Wiki"
    },
    {
        name: "HackTricks Cloud",
        cat: "Cloud Security & CI/CD",
        desc: "Cloud-focused pentesting reference for AWS, Azure, GCP IAM exploitation, Kubernetes attacks, and CI/CD pipeline hijacking.",
        link: "https://cloud.hacktricks.wiki",
        badge: "Cloud Attacks"
    },
    {
        name: "SecLists",
        cat: "Wordlists & Fuzzing Payloads",
        desc: "The security tester's companion - curated collection of fuzzing payloads, usernames, passwords, URLs, web shells, and directory lists.",
        link: "https://github.com/danielmiessler/SecLists",
        badge: "60k+ Stars"
    },
    {
        name: "WADComs",
        cat: "Active Directory Cheat Sheet",
        desc: "Interactive cheat sheet for Windows/Active Directory attack commands organized by tool (Impacket, Rubeus, Mimikatz, CrackMapExec).",
        link: "https://wadcoms.github.io",
        badge: "AD Commands"
    },
    {
        name: "NIST Cybersecurity Framework (CSF)",
        cat: "Governance & Risk Framework",
        desc: "US National Institute of Standards framework for managing cybersecurity risk. Core functions: Identify, Protect, Detect, Respond, Recover.",
        link: "https://www.nist.gov/cyberframework",
        badge: "NIST Official"
    },
    {
        name: "RevShells",
        cat: "Reverse Shell Generator",
        desc: "Online reverse shell payload generator supporting Bash, Python, PHP, PowerShell, Perl, Ruby, Netcat, and encoded variants.",
        link: "https://www.revshells.com",
        badge: "Shell Generator"
    },
    {
        name: "VirusTotal",
        cat: "Malware & IOC Analysis",
        desc: "Free service that analyzes files, URLs, IPs, and domains for malware and automatically shares them with the security community.",
        link: "https://www.virustotal.com",
        badge: "Google Subsidiary"
    }
];

export const CERTIFICATIONS_ROADMAP = [
    {
        name: "CompTIA Security+ (SY0-701)",
        provider: "CompTIA",
        level: "Foundational",
        desc: "Globally recognized baseline certification covering core security principles, threat analysis, risk management, and cryptography.",
        link: "https://www.comptia.org/certifications/security"
    },
    {
        name: "eJPT (eLearnSecurity Junior Penetration Tester)",
        provider: "INE Security",
        level: "Entry Offensive",
        desc: "100% practical hands-on exam evaluating dynamic reconnaissance, host assessment, and web exploitation skills.",
        link: "https://security.ine.com/certifications/ejpt-certification"
    },
    {
        name: "PNPT (Practical Network Penetration Tester)",
        provider: "TCM Security",
        level: "Intermediate Offensive",
        desc: "Realistic 5-day penetration testing exam simulating full internal/external assessment, OSINT, AD exploitation, and executive debrief.",
        link: "https://certifications.tcm-sec.com/pnpt"
    },
    {
        name: "OSCP (OffSec Certified Professional)",
        provider: "OffSec",
        level: "Advanced Offensive",
        desc: "The gold standard practical penetration testing certification requiring a 24-hour hands-on exam with 10 machines.",
        link: "https://www.offsec.com/courses/pen-200"
    },
    {
        name: "OSWE (OffSec Web Expert)",
        provider: "OffSec",
        level: "Expert Web",
        desc: "Advanced white-box web application security certification covering source code review, deserialization, and custom exploit development.",
        link: "https://www.offsec.com/courses/web-300"
    },
    {
        name: "OSEP (OffSec Experienced Penetration Tester)",
        provider: "OffSec",
        level: "Expert Offensive",
        desc: "Advanced evasion and red team certification covering antivirus bypass, AMSI evasion, lateral movement, and process injection.",
        link: "https://www.offsec.com/courses/pen-300"
    },
    {
        name: "CRTP (Certified Red Team Professional)",
        provider: "Altered Security",
        level: "Intermediate AD",
        desc: "Hands-on Active Directory attack certification covering Kerberoasting, delegation abuse, ADCS, and forest trust attacks.",
        link: "https://www.alteredsecurity.com/adlab"
    },
    {
        name: "CRTO (Certified Red Team Operator)",
        provider: "Zero-Point Security",
        level: "Intermediate Red Team",
        desc: "Hands-on red team certification using Cobalt Strike and Havoc C2 frameworks in a realistic multi-domain enterprise lab.",
        link: "https://training.zeropointsecurity.co.uk/courses/red-team-ops"
    },
    {
        name: "BTL1 (Blue Team Level 1)",
        provider: "Security Blue Team",
        level: "Entry Blue Team",
        desc: "Practical blue team certification covering phishing analysis, digital forensics, SIEM log analysis, and threat intelligence.",
        link: "https://www.securityblue.team/certifications/blue-team-level-1"
    },
    {
        name: "CCD (Certified CyberDefender)",
        provider: "CyberDefenders",
        level: "Intermediate Blue Team",
        desc: "Hands-on blue team certification with real-world incident analysis covering network forensics, endpoint forensics, and malware analysis.",
        link: "https://cyberdefenders.org/blue-team-training/courses/certified-cyberdefender"
    },
    {
        name: "Google Cybersecurity Certificate",
        provider: "Google (Coursera)",
        level: "Foundational (Free)",
        desc: "Free professional certificate covering security foundations, network security, Linux, SQL, Python, incident detection, and response.",
        link: "https://www.coursera.org/google-certificates/cybersecurity-certificate"
    },
    {
        name: "SC-200 (Microsoft Security Operations Analyst)",
        provider: "Microsoft",
        level: "Intermediate SOC",
        desc: "Microsoft certification for SOC analysts covering Microsoft Sentinel, Defender XDR, KQL queries, and threat hunting.",
        link: "https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst"
    },
    {
        name: "GPEN (GIAC Penetration Tester)",
        provider: "SANS / GIAC",
        level: "Advanced Offensive",
        desc: "SANS-backed certification covering comprehensive penetration testing methodology, password attacks, and exploitation techniques.",
        link: "https://www.giac.org/certifications/penetration-tester-gpen"
    },
    {
        name: "GCIH (GIAC Certified Incident Handler)",
        provider: "SANS / GIAC",
        level: "Advanced Blue Team",
        desc: "Incident handling and response certification covering attack detection, containment, eradication, and recovery procedures.",
        link: "https://www.giac.org/certifications/certified-incident-handler-gcih"
    }
];
