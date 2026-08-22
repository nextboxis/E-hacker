export const TOOLS_DATABASE = [
    {
        name: "Nmap",
        cat: "Recon & Network",
        desc: "Network exploration tool, host discovery, OS fingerprinting, and vulnerability scanning engine.",
        link: "https://nmap.org",
        github: "https://github.com/nmap/nmap",
        youtube: "https://www.youtube.com/results?search_query=nmap+tutorial+cybersecurity",
        pdf: "/pdfs/nmap.pdf",
        icon: "🌐",
        commands: "nmap -sS -sV -sC -p- -T4 <target-ip>"
    },
    {
        name: "Wireshark",
        cat: "Network & Traffic",
        desc: "World's foremost network protocol analyzer for deep packet inspection and PCAP forensics.",
        link: "https://www.wireshark.org",
        github: "https://github.com/wireshark/wireshark",
        youtube: "https://www.youtube.com/results?search_query=wireshark+packet+analysis+tutorial",
        pdf: "/pdfs/wireshark.pdf",
        icon: "🦈",
        commands: "tshark -r capture.pcap -Y 'http.request.method==POST' -T fields -e http.user_agent"
    },
    {
        name: "Burp Suite",
        cat: "Web Pentest",
        desc: "Industry standard web vulnerability scanner, intercepting proxy, repeater, and intruder suite.",
        link: "https://portswigger.net/burp",
        github: "https://github.com/PortSwigger",
        youtube: "https://www.youtube.com/results?search_query=burp+suite+tutorial+web+penetration+testing",
        pdf: "/pdfs/burp_suite.pdf",
        icon: "🕷️",
        commands: "Proxy -> Intercept -> Action -> Send to Repeater (Ctrl+R)"
    },
    {
        name: "Metasploit Framework",
        cat: "Exploitation",
        desc: "World's most utilized penetration testing and exploit execution platform.",
        link: "https://www.metasploit.com",
        github: "https://github.com/rapid7/metasploit-framework",
        youtube: "https://www.youtube.com/results?search_query=metasploit+framework+tutorial+beginner",
        pdf: "/pdfs/metasploit_framework.pdf",
        icon: "💣",
        commands: "msfconsole -q; use exploit/multi/handler; set payload windows/x64/meterpreter/reverse_tcp"
    },
    {
        name: "Ghidra",
        cat: "Reverse Engineering",
        desc: "NSA-developed software reverse engineering (SRE) suite with multi-architecture decompiler.",
        link: "https://ghidra-sre.org",
        github: "https://github.com/NationalSecurityAgency/ghidra",
        youtube: "https://www.youtube.com/results?search_query=ghidra+reverse+engineering+tutorial",
        pdf: "/pdfs/ghidra_reverse_eng.pdf",
        icon: "🔬",
        commands: "ghidraRun -> New Project -> Import Binary -> Auto Analyze"
    },
    {
        name: "John the Ripper",
        cat: "Password & Crypto",
        desc: "High-speed multi-algorithm password hash cracker for UNIX, Windows, and archives.",
        link: "https://www.openwall.com/john",
        github: "https://github.com/openwall/john",
        youtube: "https://www.youtube.com/results?search_query=john+the+ripper+password+cracking+tutorial",
        pdf: "/pdfs/john_the_ripper.pdf",
        icon: "🔑",
        commands: "john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt --format=NT"
    },
    {
        name: "Hashcat",
        cat: "Password & Crypto",
        desc: "World's fastest and most advanced GPU-based password recovery utility supporting rule sets.",
        link: "https://hashcat.net/hashcat",
        github: "https://github.com/hashcat/hashcat",
        youtube: "https://www.youtube.com/results?search_query=hashcat+tutorial+gpu+cracking",
        pdf: "/pdfs/john_the_ripper.pdf",
        icon: "⚡",
        commands: "hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt -r rules/best64.rule"
    },
    {
        name: "Sqlmap",
        cat: "Web Pentest",
        desc: "Automatic SQL injection, database fingerprinting, and data exfiltration tool.",
        link: "https://sqlmap.org",
        github: "https://github.com/sqlmapproject/sqlmap",
        youtube: "https://www.youtube.com/results?search_query=sqlmap+database+penetration+testing+tutorial",
        pdf: "/pdfs/sqlmap.pdf",
        icon: "💉",
        commands: "sqlmap -u 'http://target/item.php?id=1' --dbs --batch --random-agent"
    },
    {
        name: "Mimikatz",
        cat: "Active Directory",
        desc: "Post-exploitation tool capable of extracting plaintext passwords, hashes, PINs, and Kerberos tickets.",
        link: "https://github.com/gentilkiwi/mimikatz",
        github: "https://github.com/gentilkiwi/mimikatz",
        youtube: "https://www.youtube.com/results?search_query=mimikatz+active+directory+credential+dumping",
        pdf: "/pdfs/mimikatz.pdf",
        icon: "👑",
        commands: "privilege::debug -> sekurlsa::logonpasswords -> lsadump::sam"
    },
    {
        name: "Impacket",
        cat: "Active Directory",
        desc: "Collection of Python classes for working with network protocols (WMI, SMB, Kerberos, LDAP).",
        link: "https://github.com/fortra/impacket",
        github: "https://github.com/fortra/impacket",
        youtube: "https://www.youtube.com/results?search_query=impacket+active+directory+attacks+tutorial",
        pdf: "/pdfs/kali_linux.pdf",
        icon: "🏢",
        commands: "impacket-GetUserSPNs domain.local/user:password -request -dc-ip 10.10.10.1"
    },
    {
        name: "BloodHound",
        cat: "Active Directory",
        desc: "Six Degrees of Domain Admin - Graph theory Active Directory relationship reconnaissance.",
        link: "https://github.com/SpecterOps/BloodHound",
        github: "https://github.com/SpecterOps/BloodHound",
        youtube: "https://www.youtube.com/results?search_query=bloodhound+active+directory+attack+paths",
        pdf: "/pdfs/kali_linux.pdf",
        icon: "🐕",
        commands: "bloodhound-python -u 'user' -p 'pass' -d domain.local -ns 10.10.10.1 -c All"
    },
    {
        name: "Volatility 3",
        cat: "Digital Forensics",
        desc: "Memory forensics analysis framework for incident response and malware artifact extraction.",
        link: "https://www.volatilityfoundation.org",
        github: "https://github.com/volatilityfoundation/volatility3",
        youtube: "https://www.youtube.com/results?search_query=volatility+3+memory+forensics+tutorial",
        pdf: "/pdfs/volatility.pdf",
        icon: "🧠",
        commands: "python3 vol.py -f memory.dmp windows.pslist; python3 vol.py -f memory.dmp windows.malfind"
    },
    {
        name: "Tcpdump",
        cat: "Network & Traffic",
        desc: "Powerful command-line packet analyzer and packet capture engine.",
        link: "https://www.tcpdump.org",
        github: "https://github.com/the-tcpdump-group/tcpdump",
        youtube: "https://www.youtube.com/results?search_query=tcpdump+command+line+packet+capture+tutorial",
        pdf: "/pdfs/tcpdump.pdf",
        icon: "📡",
        commands: "tcpdump -i eth0 -nn -s0 -w output.pcap 'port 80 or port 443'"
    },
    {
        name: "OpenSSL",
        cat: "Cryptography",
        desc: "Robust, commercial-grade cryptographic toolkit and TLS implementation library.",
        link: "https://www.openssl.org",
        github: "https://github.com/openssl/openssl",
        youtube: "https://www.youtube.com/results?search_query=openssl+certificates+and+encryption+tutorial",
        pdf: "/pdfs/openssl.pdf",
        icon: "🔐",
        commands: "openssl s_client -connect target.com:443 -tls1_3"
    },
    {
        name: "Sigma",
        cat: "SIEM & Blue Team",
        desc: "Generic and open signature format for SIEM detection engineering and threat hunting.",
        link: "https://github.com/SigmaHQ/sigma",
        github: "https://github.com/SigmaHQ/sigma",
        youtube: "https://www.youtube.com/results?search_query=sigma+rules+detection+engineering+tutorial",
        pdf: "/pdfs/linux_ubuntu.pdf",
        icon: "🛡️",
        commands: "sigmac -t splunk -c tools/config/generic/sysmon.yml rules/windows/process_creation/rule.yml"
    }
];

export const PDF_CHEAT_SHEETS = [
    { name: "Nmap Port Scanning Field Guide", file: "nmap.pdf", size: "1.19 MB", cat: "Recon & Scanning", desc: "Flag breakdown, NSE script execution, and stealth evasion syntax." },
    { name: "Wireshark Packet Analysis Manual", file: "wireshark.pdf", size: "377 KB", cat: "Network & PCAP", desc: "Display filters, protocol dissection, and suspicious stream forensics." },
    { name: "Burp Suite Web Pentest Sheet", file: "burp_suite.pdf", size: "288 KB", cat: "Web Pentest", desc: "Proxy setup, Repeater hotkeys, Intruder payload positions, and match rules." },
    { name: "Metasploit Framework Guide", file: "metasploit_framework.pdf", size: "42 KB", cat: "Exploitation", desc: "Meterpreter commands, multi-handler setups, and privilege escalation." },
    { name: "Ghidra Reverse Engineering SRE", file: "ghidra_reverse_eng.pdf", size: "194 KB", cat: "Reverse Eng", desc: "Decompiler views, function renaming, memory map, and script development." },
    { name: "Mimikatz LSASS & Kerberos Guide", file: "mimikatz.pdf", size: "849 KB", cat: "Active Directory", desc: "Pass-the-Hash, Golden Ticket creation, and SAM database dumping." },
    { name: "John the Ripper Hash Cracking", file: "john_the_ripper.pdf", size: "482 KB", cat: "Password & Crypto", desc: "Hash formats, rule syntax, single crack mode, and custom masks." },
    { name: "Sqlmap Automated Injection", file: "sqlmap.pdf", size: "33 KB", cat: "Web Pentest", desc: "Database enumeration, tamper scripts, OS shell takeover flags." },
    { name: "Volatility Memory Forensics", file: "volatility.pdf", size: "619 KB", cat: "Forensics & IR", desc: "Process listing, injected code detection, and registry extraction." },
    { name: "Tcpdump Packet Capture Guide", file: "tcpdump.pdf", size: "2.87 MB", cat: "Network & PCAP", desc: "Capture filters, raw hex inspection, and ring buffer recording." },
    { name: "OpenSSL Cryptography Manual", file: "openssl.pdf", size: "250 KB", cat: "Cryptography", desc: "Certificate generation, cipher benchmarking, and CSR inspection." },
    { name: "Bash Shell Scripting for Hackers", file: "bash_shell.pdf", size: "20 KB", cat: "Scripting & Linux", desc: "Looping, regex parsing, socket pipes, and automation scripting." },
    { name: "Kali Linux Tool Catalog", file: "kali_linux.pdf", size: "12.24 MB", cat: "OS & Tools", desc: "Complete reference of pre-installed security testing frameworks." },
    { name: "Linux Ubuntu Admin & Hardening", file: "linux_ubuntu.pdf", size: "77 KB", cat: "Linux & SysAdmin", desc: "Permissions, iptables, systemd management, and log review." },
    { name: "Python for Cybersecurity", file: "python.pdf", size: "1.04 MB", cat: "Python & Dev", desc: "Sockets, requests, scapy, pwntools, and binary packing basics." },
    { name: "Git Version Control Guide", file: "git.pdf", size: "405 KB", cat: "DevOps & CLI", desc: "Branching, merge conflict resolution, and commit hygiene." },
    { name: "GitHub Collaboration Workflow", file: "github.pdf", size: "405 KB", cat: "DevOps & Cloud", desc: "PR workflows, release tags, Actions CI/CD pipelines, and secrets." },
    { name: "VirtualBox Lab Isolation Setup", file: "virtualbox.pdf", size: "10.03 MB", cat: "Virtualization", desc: "Host-only networking, snapshots, nested virtualization, and NAT." }
];

export const OSINT_TOOLS = [
    {
        name: "Shodan",
        desc: "Search engine for Internet-connected devices, open ports, and industrial control systems.",
        link: "https://www.shodan.io",
        github: "https://github.com/achillean/shodan-python",
        youtube: "https://www.youtube.com/results?search_query=shodan+osint+reconnaissance+tutorial",
        icon: "🛰️"
    },
    {
        name: "Censys",
        desc: "Search engine enabling security teams to discover internet attack surfaces and TLS certs.",
        link: "https://search.censys.io",
        github: "https://github.com/censys/censys-python",
        youtube: "https://www.youtube.com/results?search_query=censys+osint+attack+surface+tutorial",
        icon: "🔍"
    },
    {
        name: "SpiderFoot",
        desc: "Automated OSINT reconnaissance tool that integrates over 100 open data sources.",
        link: "https://github.com/smicallef/spiderfoot",
        github: "https://github.com/smicallef/spiderfoot",
        youtube: "https://www.youtube.com/results?search_query=spiderfoot+osint+automation+tutorial",
        icon: "🕷️"
    },
    {
        name: "theHarvester",
        desc: "E-mail, subdomain, virtual host, and employee name gathering reconnaissance tool.",
        link: "https://github.com/laramies/theHarvester",
        github: "https://github.com/laramies/theHarvester",
        youtube: "https://www.youtube.com/results?search_query=theharvester+subdomain+enumeration+tutorial",
        icon: "🌾"
    },
    {
        name: "Maltego",
        desc: "Interactive data mining tool for link analysis and graph intelligence visualization.",
        link: "https://www.maltego.com",
        github: "https://github.com/paterva",
        youtube: "https://www.youtube.com/results?search_query=maltego+graph+link+analysis+tutorial",
        icon: "🕸️"
    },
    {
        name: "OSINT Framework",
        desc: "Interactive directory collection of free OSINT investigation resources.",
        link: "https://osintframework.com",
        github: "https://github.com/lockfale/OSINT-Framework",
        youtube: "https://www.youtube.com/results?search_query=osint+framework+investigation+guide",
        icon: "🧭"
    }
];

export const CHANNELS_DATABASE = [
    {
        name: "John Hammond",
        desc: "CTF walkthroughs, malware analysis, practical reverse engineering, and real-world breach breakdowns.",
        link: "https://youtube.com/@_JohnHammond",
        github: "https://github.com/JohnHammond",
        icon: "📺",
        badge: "CTF & Malware"
    },
    {
        name: "IppSec",
        desc: "In-depth Hack The Box retired machine walkthroughs and offensive security methodologies.",
        link: "https://youtube.com/@ippsec",
        github: "https://github.com/IppSec",
        icon: "📺",
        badge: "HTB & Pentest"
    },
    {
        name: "NetworkChuck",
        desc: "Engaging tutorials on networking, Linux command line, Python scripting, and cloud security.",
        link: "https://youtube.com/@NetworkChuck",
        github: "https://github.com/networkchuck",
        icon: "📺",
        badge: "Networking & Cloud"
    },
    {
        name: "David Bombal",
        desc: "Networking protocols, Python automation, ethical hacking, and hardware hacking masterclasses.",
        link: "https://youtube.com/@DavidBombal",
        github: "https://github.com/davidbombal",
        icon: "📺",
        badge: "Hardware & Python"
    },
    {
        name: "TCM Security",
        desc: "Practical Ethical Hacking (PNPT), OSINT, Active Directory penetration testing, and career roadmaps.",
        link: "https://youtube.com/@TCMSecurityAcademy",
        github: "https://github.com/hmaverickadams",
        icon: "📺",
        badge: "Active Directory & PNPT"
    }
];
