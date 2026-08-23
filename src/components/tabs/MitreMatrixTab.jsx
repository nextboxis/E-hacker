import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

const MITRE_TACTICS = [
    {
        id: 'TA0001',
        name: 'Initial Access',
        color: '#38bdf8',
        desc: 'Techniques used to gain an initial foothold within an enterprise network.',
        techniques: [
            {
                id: 'T1566',
                name: 'Phishing (Spearphishing Attachment/Link)',
                desc: 'Adversaries send targeted emails containing weaponized attachments (ISO, LNK, Macro Office documents) or credential-harvesting links to gain initial access.',
                detection: 'Email gateway scanning, SPF/DKIM/DMARC alignment checks, Sysmon Event ID 1 (child process spawned from outlook.exe/word.exe).',
                mitigation: 'Enforce hardware FIDO2 MFA, block inbound macro-enabled Office attachments, implement DMARC with p=reject, and deploy automated email detonation sandboxes.',
                tools: ['Gophish', 'Evilginx3', 'King-Phisher'],
                apts: ['APT28 (Fancy Bear)', 'APT29 (Cozy Bear)', 'Lazarus Group', 'FIN7'],
                severity: 'CRITICAL',
                cves: ['CVE-2023-23397', 'CVE-2023-38831'],
                labs: [1001, 24],
                sigmaRule: `title: Suspicious Child Process Spawned by Outlook / Office
id: e14c5384-9840-410a-8bf8-2b814674dc8a
status: production
description: Detects suspicious process creation where parent is Outlook or Microsoft Office
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith:
            - '\\outlook.exe'
            - '\\winword.exe'
            - '\\excel.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
            - '\\mshta.exe'
            - '\\wscript.exe'
            - '\\cscript.exe'
    condition: selection
falsepositives:
    - Custom enterprise automation scripts
level: high`
            },
            {
                id: 'T1190',
                name: 'Exploit Public-Facing Application',
                desc: 'Exploiting vulnerabilities in internet-facing servers (SQLi, RCE, SSRF, insecure deserialization) to execute arbitrary code.',
                detection: 'WAF alert logs, web server access logs with anomalous URL parameters, unexpected child processes spawned from w3wp.exe or httpd/nginx.',
                mitigation: 'Deploy automated patch management, enforce WAF virtual patching, isolate DMZ servers in non-routable VLANs, and perform regular DAST/SAST code reviews.',
                tools: ['Sqlmap', 'Burp Suite', 'Metasploit', 'Nuclei'],
                apts: ['Volt Typhoon', 'Sandworm', 'HAFNIUM', 'FIN11'],
                severity: 'CRITICAL',
                cves: ['CVE-2024-3400', 'CVE-2023-34362', 'CVE-2021-44228'],
                labs: [1, 2, 3, 4],
                sigmaRule: `title: Web Server Spawning Command Shell
id: 53a29080-60b6-455b-b996-52c676d54cf8
status: production
description: Detects command shells spawned by web server processes indicating successful exploitation
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith:
            - '\\w3wp.exe'
            - '\\httpd.exe'
            - '\\nginx.exe'
            - '\\tomcat8.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
            - '\\bash.exe'
    condition: selection
level: critical`
            },
            {
                id: 'T1078',
                name: 'Valid Accounts',
                desc: 'Obtaining and abusing legitimate credentials to authenticate across services without generating traditional malware intrusion alarms.',
                detection: 'Impossible travel sign-in alerts, anomalous off-hours logins, password spray spikes, and non-compliant device sign-in logs.',
                mitigation: 'Enforce phishing-resistant MFA (FIDO2/WebAuthn), implement Conditional Access policies, disable legacy authentication protocols, and audit dormant accounts.',
                tools: ['Hydra', 'NetExec', 'Sherlock', 'ROADtools'],
                apts: ['Lapsus$', 'Midnight Blizzard', 'Scattered Spider'],
                severity: 'HIGH',
                cves: ['N/A (Credential Abuse)'],
                labs: [14, 25],
                sigmaRule: `title: Anomalous High-Frequency Failed Logins (Password Spray)
id: f98a7641-0b5c-48c9-8d76-e174b8893112
status: production
description: Detects multiple failed authentication attempts across different usernames from a single source IP
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4625
        SubStatus: '0xc000006a'
    timeframe: 5m
    condition: selection | count(TargetUserName) by IpAddress > 10
level: medium`
            },
            {
                id: 'T1133',
                name: 'External Remote Services',
                desc: 'Connecting to exposed remote access portals such as VPN, RDP, SSH, or Citrix to gain network perimeter ingress.',
                detection: 'VPN authentication logs, RDP connection source IPs (Event ID 4624 type 10), and anomalous geolocation sign-ins.',
                mitigation: 'Place remote access gateways behind Zero Trust Network Access (ZTNA), mandate MFA for all connections, and restrict RDP/SSH ports from the public internet.',
                tools: ['Nmap', 'RustScan', 'Hydra', 'NetExec'],
                apts: ['BlackCat / ALPHV', 'LockBit 3.0', 'DarkSide'],
                severity: 'HIGH',
                cves: ['CVE-2023-46805', 'CVE-2024-21887'],
                labs: [10, 18],
                sigmaRule: `title: Direct RDP Inbound Session from Public IP
id: c38914ba-0782-411a-8c54-9a435882103f
status: production
description: Detects direct interactive RDP logon from non-RFC1918 public IP addresses
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4624
        LogonType: 10
    filter_internal:
        IpAddress|startswith:
            - '10.'
            - '172.16.'
            - '192.168.'
    condition: selection and not filter_internal
level: high`
            }
        ]
    },
    {
        id: 'TA0002',
        name: 'Execution',
        color: '#22c55e',
        desc: 'Techniques that result in adversary-controlled code running on a local or remote system.',
        techniques: [
            {
                id: 'T1059',
                name: 'Command & Scripting Interpreter (PowerShell, Bash, Python)',
                desc: 'Adversaries abuse built-in command-line interpreters to execute commands, download second-stage payloads, and execute in-memory scripts.',
                detection: 'PowerShell Script Block Logging (Event ID 4104), process creation command-line arguments (encoded command flags, download strings).',
                mitigation: 'Enforce PowerShell Constrained Language Mode (CLM), configure AppLocker/WDAC application control, and enable AMSI telemetry.',
                tools: ['Evil-WinRM', 'Metasploit', 'PowerView', 'Scapy'],
                apts: ['APT29', 'Wizard Spider', 'FIN7'],
                severity: 'CRITICAL',
                cves: ['CVE-2022-30190 (Follina)'],
                labs: [5, 12, 1002],
                sigmaRule: `title: Suspicious Encoded PowerShell Execution
id: b8d4a974-9812-4211-9a7c-87d7b1a03982
status: production
description: Detects execution of PowerShell with base64 encoded command arguments
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\powershell.exe'
        CommandLine|contains:
            - ' -e '
            - ' -enc '
            - ' -EncodedCommand '
            - ' -noprofile -w hidden'
    condition: selection
level: high`
            },
            {
                id: 'T1204',
                name: 'User Execution (Malicious File / Link)',
                desc: 'Relying on target users to open an attachment, run an executable, or approve an MFA push fatigue prompt.',
                detection: 'EDR file execution telemetry, Office applications spawning script engines, and browser download execution trees.',
                mitigation: 'Implement phishing awareness training, disable automatic link launching, and configure number-matching MFA to mitigate push fatigue.',
                tools: ['Metasploit', 'BeEF', 'Gophish'],
                apts: ['Lazarus Group', 'Scattered Spider', 'Emotet'],
                severity: 'MEDIUM',
                cves: ['CVE-2021-40444'],
                labs: [24, 26],
                sigmaRule: `title: Suspicious File Execution from Temp Directory
id: 84a7199c-3091-4cf1-8a4b-97216ab5033c
status: production
description: Detects execution of binaries directly out of user temp or download directories
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|contains:
            - '\\AppData\\Local\\Temp\\'
            - '\\Downloads\\'
        Image|endswith:
            - '.exe'
            - '.vbs'
            - '.hta'
    condition: selection
level: medium`
            },
            {
                id: 'T1047',
                name: 'Windows Management Instrumentation (WMI)',
                desc: 'Executing malicious code or spawning processes remotely on internal endpoints via WMI commands.',
                detection: 'Sysmon Event ID 19/20/21 (WmiEvent), Microsoft-Windows-WMI-Activity/Operational Event ID 5861.',
                mitigation: 'Restrict remote WMI access via host firewalls, monitor WMI persistence subscriptions, and audit RPC port 135.',
                tools: ['NetExec', 'Impacket', 'WmiExec'],
                apts: ['APT29', 'Sandworm', 'Turla'],
                severity: 'HIGH',
                cves: ['N/A (Protocol Abuse)'],
                labs: [15, 30],
                sigmaRule: `title: WMI Remote Process Creation via Win32_Process
id: 489c716e-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects WMI spawning processes remotely across the network
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith: '\\WmiPrvSE.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
    condition: selection
level: high`
            }
        ]
    },
    {
        id: 'TA0003',
        name: 'Persistence',
        color: '#eab308',
        desc: 'Techniques used to maintain access across restarts, changed credentials, and interrupts.',
        techniques: [
            {
                id: 'T1547',
                name: 'Boot or Logon Autostart Execution (Registry Run Keys)',
                desc: 'Adding startup keys in HKCU/HKLM CurrentVersion\\Run to execute payloads automatically upon user logon.',
                detection: 'Sysmon Event ID 13 (Registry value set in Run/RunOnce keys), Autoruns baseline audits.',
                mitigation: 'Restrict user permissions to write to HKLM keys, deploy EDR real-time registry tampering protection, and audit startup folder permissions.',
                tools: ['LinPEAS / WinPEAS', 'Chainsaw', 'Autoruns'],
                apts: ['APT28', 'Cobalt Group', 'Turla'],
                severity: 'HIGH',
                cves: ['N/A (Registry AutoStart)'],
                labs: [22, 28],
                sigmaRule: `title: Persistence via Registry Run Key Addition
id: 17b96041-3940-410a-8bf8-2b814674dc8a
status: production
description: Detects creation or modification of registry Run keys for startup persistence
logsource:
    category: registry_set
    product: windows
detection:
    selection:
        TargetObject|contains:
            - '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\'
            - '\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce\\'
    condition: selection
level: high`
            },
            {
                id: 'T1053',
                name: 'Scheduled Task / Cron Job',
                desc: 'Creating scheduled tasks in Windows or cron jobs in Linux to trigger recurring execution of malicious payloads.',
                detection: 'Windows Event ID 4698 (Scheduled task created), crontab file integrity monitoring (auditd /etc/cron*).',
                mitigation: 'Audit scheduled task creation via Group Policy, restrict schtasks.exe execution permissions, and monitor unusual parent processes creating tasks.',
                tools: ['LinPEAS / WinPEAS', 'Sysinternals'],
                apts: ['MuddyWater', 'APT41', 'Gamaredon'],
                severity: 'HIGH',
                cves: ['N/A (OS Feature Abuse)'],
                labs: [21, 29],
                sigmaRule: `title: Scheduled Task Creation via Command Line
id: a8194b61-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects scheduled task creation with suspicious parameters via schtasks.exe
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\schtasks.exe'
        CommandLine|contains:
            - '/create'
            - '/sc minute'
            - '/ru SYSTEM'
    condition: selection
level: medium`
            },
            {
                id: 'T1505.003',
                name: 'Web Shell',
                desc: 'Dropping PHP, ASPX, or JSP backdoor scripts onto web application server directories for persistent remote shell execution.',
                detection: 'Web directory file integrity monitoring (FIM), web server process (w3wp.exe/httpd) spawning cmd.exe/bash.',
                mitigation: 'Mount upload directories as non-executable (noexec), enforce file extension allowlists, and deploy runtime application self-protection (RASP).',
                tools: ['Commix', 'Metasploit', 'Burp Suite'],
                apts: ['HAFNIUM', 'Gallium', 'Lazarus Group'],
                severity: 'CRITICAL',
                cves: ['CVE-2021-26855 (ProxyLogon)', 'CVE-2023-34362 (MOVEit)'],
                labs: [8, 1003],
                sigmaRule: `title: Web Shell File Creation in Web Root
id: 61849a64-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects creation of script files (php, aspx, jsp) in web server document roots
logsource:
    category: file_event
    product: windows
detection:
    selection:
        TargetFilename|contains:
            - '\\inetpub\\wwwroot\\'
            - '/var/www/html/'
        TargetFilename|endswith:
            - '.aspx'
            - '.php'
            - '.jsp'
    condition: selection
level: high`
            }
        ]
    },
    {
        id: 'TA0004',
        name: 'Privilege Escalation',
        color: '#f97316',
        desc: 'Techniques used to gain higher-level permissions on a system (root, SYSTEM, Domain Admin).',
        techniques: [
            {
                id: 'T1068',
                name: 'Exploitation for Privilege Escalation',
                desc: 'Exploiting OS kernel vulnerabilities, unquoted service paths, or vulnerable drivers (BYOVD) to elevate permissions to SYSTEM/root.',
                detection: 'Unusual driver loads, memory access violations, known exploit signatures in process command lines.',
                mitigation: 'Enable Driver Blocklist / HVCI in Windows, ensure routine kernel security patching, and restrict unquoted service paths.',
                tools: ['Metasploit', 'Searchsploit', 'LinPEAS / WinPEAS'],
                apts: ['APT28', 'Sandworm', 'LockBit'],
                severity: 'CRITICAL',
                cves: ['CVE-2021-36934 (HiveNightmare)', 'CVE-2021-1675 (PrintNightmare)'],
                labs: [11, 23],
                sigmaRule: `title: Suspicious Print Spooler Driver Modification (PrintNightmare)
id: 98124b61-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects exploitation of Print Spooler privilege escalation vulnerabilities
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith: '\\spoolsv.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
    condition: selection
level: critical`
            },
            {
                id: 'T1548',
                name: 'Abuse Elevation Control (SetUID / Sudo)',
                desc: 'Abusing SUID root binaries, misconfigured sudoers rules (NOPASSWD), or Windows UAC bypass techniques.',
                detection: 'Auditd execve syscall telemetry for GTFOBins commands, Windows Event ID 4688 for high-integrity token process creation.',
                mitigation: 'Audit SUID binaries regularly, eliminate NOPASSWD wildcards in /etc/sudoers, and set Windows UAC to "Always Notify".',
                tools: ['LinPEAS / WinPEAS', 'GTFOBins'],
                apts: ['Kimsuky', 'MuddyWater'],
                severity: 'HIGH',
                cves: ['CVE-2021-3156 (Baron Samedit)'],
                labs: [19, 20],
                sigmaRule: `title: Suspicious Sudo Execution of Shell or Script Interpreter
id: 394017a4-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects sudo execution of GTFOBins binaries capable of shell breakout
logsource:
    product: linux
    service: auth
detection:
    selection:
        CommandLine|contains:
            - 'sudo find '
            - 'sudo vim '
            - 'sudo python -c'
            - 'sudo bash'
    condition: selection
level: medium`
            },
            {
                id: 'T1484',
                name: 'Domain Policy Modification (GPO Abuse)',
                desc: 'Modifying Group Policy Objects in Active Directory to push administrator rights or malicious scheduled tasks across all domain machines.',
                detection: 'Event ID 5136 (Directory service object modified for GPO container), BloodHound WriteGplink edges.',
                mitigation: 'Implement Tiered Administration, restrict Write/Edit permissions on GPO objects to Tier-0 Domain Admins only, and monitor SYSVOL file integrity.',
                tools: ['BloodHound', 'PowerView', 'SharpGPOAbuse'],
                apts: ['APT29', 'FIN6'],
                severity: 'CRITICAL',
                cves: ['N/A (AD ACL Misconfiguration)'],
                labs: [32, 35],
                sigmaRule: `title: Active Directory Group Policy Object Modification
id: 54109b82-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects modifications to GPO containers in Active Directory
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 5136
        ObjectClass: 'groupPolicyContainer'
    condition: selection
level: high`
            }
        ]
    },
    {
        id: 'TA0005',
        name: 'Defense Evasion',
        color: '#ec4899',
        desc: 'Techniques used to avoid detection throughout their compromise.',
        techniques: [
            {
                id: 'T1027',
                name: 'Obfuscated Files or Information',
                desc: 'Encoding, packing, XOR encryption, or Base64 concealing of payload binaries and scripts to bypass static signatures.',
                detection: 'Entropy analysis of PE file sections, AMSI scanning of deobfuscated memory buffers, string decoders.',
                mitigation: 'Enable AMSI telemetry across all script hosts, deploy sandboxes that inspect memory before execution, and enforce binary code signing.',
                tools: ['CyberChef', 'Ghidra', 'DIE'],
                apts: ['Turla', 'Lazarus Group', 'APT41'],
                severity: 'MEDIUM',
                cves: ['N/A (Evasion Technique)'],
                labs: [16, 27],
                sigmaRule: `title: Suspicious AMSI Bypass Attempt in PowerShell
id: 7490184b-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects memory patching and AMSI initialization tampering strings in PowerShell
logsource:
    product: windows
    service: powershell
detection:
    selection:
        EventID: 4104
        ScriptBlockText|contains:
            - 'amsiInitFailed'
            - 'AmsiUtils'
            - '[Ref].Assembly.GetType'
    condition: selection
level: critical`
            },
            {
                id: 'T1070',
                name: 'Indicator Removal on Host (Log Clearing)',
                desc: 'Deleting or clearing Windows Event Logs (wevtutil cl) or Linux history files to destroy forensic evidence.',
                detection: 'Windows Event ID 1102 (The audit log was cleared), Event ID 104 (System log cleared), bash_history truncation.',
                mitigation: 'Forward all security event logs in real-time to an immutable SIEM/cloud log sink, restrict log-clearing privileges.',
                tools: ['Chainsaw', 'Hayabusa'],
                apts: ['Sandworm', 'Volt Typhoon', 'APT38'],
                severity: 'CRITICAL',
                cves: ['N/A (Anti-Forensics)'],
                labs: [31, 34],
                sigmaRule: `title: Windows Security Event Log Cleared
id: 11020084-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects clearing of the Windows Security or System event log
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID:
            - 1102
            - 104
    condition: selection
level: critical`
            },
            {
                id: 'T1055',
                name: 'Process Injection (Hollowing, DLL Injection)',
                desc: 'Injecting malicious shellcode into legitimate processes (svchost.exe, explorer.exe, spoolsv.exe) to evade endpoint process monitors.',
                detection: 'Sysmon Event ID 8 (CreateRemoteThread), Volatility 3 malfind memory scanning, cross-process memory write alerts.',
                mitigation: 'Enable Arbitrary Code Guard (ACG), deploy kernel-level EDR sensor hooks, and block untrusted DLL loading.',
                tools: ['Volatility 3', 'Frida', 'Process Hacker'],
                apts: ['APT29', 'Wizard Spider', 'FIN7'],
                severity: 'CRITICAL',
                cves: ['N/A (Process Injection)'],
                labs: [33, 1004],
                sigmaRule: `title: CreateRemoteThread into System Process
id: 8840194a-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects thread creation into critical system processes like svchost or explorer
logsource:
    category: create_remote_thread
    product: windows
detection:
    selection:
        TargetImage|endswith:
            - '\\svchost.exe'
            - '\\explorer.exe'
            - '\\spoolsv.exe'
    condition: selection
level: high`
            }
        ]
    },
    {
        id: 'TA0006',
        name: 'Credential Access',
        color: '#a855f7',
        desc: 'Techniques for stealing credentials such as passwords, hashes, and Kerberos tickets.',
        techniques: [
            {
                id: 'T1003',
                name: 'OS Credential Dumping (LSASS, SAM, NTDS.dit)',
                desc: 'Extracting plaintext credentials and NTLM hashes from memory (LSASS process) or Active Directory databases (NTDS.dit).',
                detection: 'Sysmon Event ID 10 (ProcessAccess on lsass.exe with PROCESS_VM_READ permissions), DCSync directory replication alerts.',
                mitigation: 'Enable LSA Protection (RunAsPPL), enable Credential Guard (VBS), restrict Debug Privilege (SeDebugPrivilege), and monitor DRS replication calls.',
                tools: ['Mimikatz', 'Impacket', 'NetExec', 'LaZagne'],
                apts: ['APT28', 'Lazarus Group', 'Sandworm', 'FIN6'],
                severity: 'CRITICAL',
                cves: ['CVE-2020-1472 (Zerologon)'],
                labs: [14, 1005],
                sigmaRule: `title: LSASS Memory Read Access by Untrusted Process
id: 994017a4-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects suspicious process opening handles to lsass.exe with read permissions
logsource:
    category: process_access
    product: windows
detection:
    selection:
        TargetImage|endswith: '\\lsass.exe'
        GrantedAccess:
            - '0x1010'
            - '0x1038'
            - '0x1fffff'
    filter_legit:
        SourceImage|endswith:
            - '\\MsMpEng.exe'
            - '\\csrss.exe'
    condition: selection and not filter_legit
level: critical`
            },
            {
                id: 'T1558',
                name: 'Steal or Forge Kerberos Tickets (Kerberoasting, AS-REP)',
                desc: 'Requesting Kerberos Service Principal Name (SPN) tickets to crack service account passwords offline.',
                detection: 'Windows Event ID 4769 with RC4 encryption (TicketEncryptionType: 0x17), anomalous high-frequency ticket requests.',
                mitigation: 'Enforce AES-256 Kerberos encryption, use 25+ character complex passwords or Group Managed Service Accounts (gMSA).',
                tools: ['Rubeus', 'Impacket', 'Hashcat'],
                apts: ['APT29', 'Wizard Spider', 'FIN7'],
                severity: 'CRITICAL',
                cves: ['N/A (Kerberos Design Exploitation)'],
                labs: [13, 36],
                sigmaRule: `title: Kerberoasting Request with RC4 Encryption
id: 47690184-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects Kerberos TGS requests using weak RC4 encryption (Event 4769)
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4769
        TicketEncryptionType: '0x17'
    filter_machine:
        ServiceName|endswith: '$'
    condition: selection and not filter_machine
level: high`
            },
            {
                id: 'T1557',
                name: 'Adversary-in-the-Middle (LLMNR / NBT-NS Poisoning)',
                desc: 'Poisoning local broadcast name resolution to capture NTLMv2 challenge-response hashes from unsuspecting network hosts.',
                detection: 'Excessive LLMNR (UDP 5355) / NetBIOS (UDP 137) traffic spikes, canary honeypot machine alert triggers.',
                mitigation: 'Disable LLMNR via Group Policy, disable NetBIOS over TCP/IP on network adapters, and enforce SMB Signing across the domain.',
                tools: ['Responder', 'Bettercap', 'Scapy'],
                apts: ['FIN7', 'BlackBasta'],
                severity: 'HIGH',
                cves: ['N/A (Name Resolution Poisoning)'],
                labs: [17, 37],
                sigmaRule: `title: LLMNR / NetBIOS Name Resolution Poisoning Activity
id: 5570184b-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects sudden broadcast name queries from tools like Responder
logsource:
    category: network_traffic
    product: zeek
detection:
    selection:
        dst_port:
            - 5355
            - 137
    condition: selection
level: medium`
            }
        ]
    },
    {
        id: 'TA0007',
        name: 'Discovery',
        color: '#06b6d4',
        desc: 'Techniques used to gain knowledge about the system and internal network environment.',
        techniques: [
            {
                id: 'T1046',
                name: 'Network Service Discovery',
                desc: 'Scanning network ports, IP subnets, and listening services to locate high-value target servers.',
                detection: 'Port scan alerts on Suricata/Snort/Zeek, rapid sequential TCP SYN connections across multiple port numbers.',
                mitigation: 'Implement network segmentation (VLANs/microsegmentation), deploy decoy honeypots (OpenCanary), and block internal port scanning.',
                tools: ['Nmap', 'RustScan', 'Masscan'],
                apts: ['Volt Typhoon', 'Lazarus Group'],
                severity: 'MEDIUM',
                cves: ['N/A (Reconnaissance)'],
                labs: [10, 18],
                sigmaRule: `title: Rapid Internal Port Scan Detected
id: 10460012-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects multiple connection attempts to different ports from a single internal IP
logsource:
    category: firewall
detection:
    selection:
        action: 'blocked'
    timeframe: 1m
    condition: selection | count(dst_port) by src_ip > 30
level: medium`
            },
            {
                id: 'T1087',
                name: 'Account Discovery (Domain / Local)',
                desc: 'Enumerating domain user accounts, security groups, and administrative entitlements via LDAP or SAM queries.',
                detection: 'High volume LDAP query filters (samAccountType=805306368), net.exe user calls.',
                mitigation: 'Restrict LDAP read permissions where feasible, deploy Active Directory honeytokens to catch unauthorized recon.',
                tools: ['BloodHound', 'PowerView', 'NetExec'],
                apts: ['APT29', 'Sandworm', 'LockBit'],
                severity: 'HIGH',
                cves: ['N/A (Directory Reconnaissance)'],
                labs: [15, 38],
                sigmaRule: `title: High Volume Active Directory LDAP Enumeration
id: 10870014-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects extensive LDAP queries for all domain user objects
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 1644
    condition: selection
level: medium`
            },
            {
                id: 'T1082',
                name: 'System Information Discovery',
                desc: 'Querying operating system version, patch level, and architecture to identify target vulnerabilities.',
                detection: 'Execution of systeminfo.exe, uname -a, hostname, or wmic qfe calls.',
                mitigation: 'Monitor execution of reconnaissance LOLBins and correlate with other post-exploitation indicators.',
                tools: ['LinPEAS / WinPEAS', 'Sysinternals'],
                apts: ['APT41', 'Gamaredon'],
                severity: 'LOW',
                cves: ['N/A (System Recon)'],
                labs: [19, 20],
                sigmaRule: `title: Reconnaissance via Systeminfo or Hostname
id: 10820016-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects execution of system information gathering binaries
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith:
            - '\\systeminfo.exe'
            - '\\hostname.exe'
    condition: selection
level: low`
            }
        ]
    },
    {
        id: 'TA0008',
        name: 'Lateral Movement',
        color: '#10b981',
        desc: 'Techniques used to extend access to other remote systems on the network.',
        techniques: [
            {
                id: 'T1021',
                name: 'Remote Services (SMB, WinRM, SSH, RDP)',
                desc: 'Logging into remote network systems using valid credentials, pass-the-hash tokens, or stolen SSH keys.',
                detection: 'Event ID 4624 Logon Type 3 (Network Logon) followed immediately by service creation (Event ID 7045), SMB session anomalies.',
                mitigation: 'Implement Privileged Access Workstations (PAWs), restrict lateral SMB/WinRM between workstations, and enforce LAPS for unique local passwords.',
                tools: ['Evil-WinRM', 'NetExec', 'Impacket', 'PsExec'],
                apts: ['Sandworm', 'Volt Typhoon', 'FIN6'],
                severity: 'CRITICAL',
                cves: ['N/A (Protocol Abuse)'],
                labs: [15, 30],
                sigmaRule: `title: PsExec Remote Service Installation on Host
id: 70450018-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects remote service creation commonly associated with lateral movement tools
logsource:
    product: windows
    service: system
detection:
    selection:
        EventID: 7045
        ServiceName|contains:
            - 'PSEXESVC'
            - 'PAExec'
    condition: selection
level: high`
            },
            {
                id: 'T1550',
                name: 'Use Alternate Authentication Material (Pass-the-Hash / Pass-the-Ticket)',
                desc: 'Authenticating across network services without the plaintext password by replaying captured NTLM hashes or forged Kerberos tickets.',
                detection: 'NTLM authentication from non-domain joined endpoints, Event ID 4624 with NTLM package when Kerberos is expected.',
                mitigation: 'Enforce Kerberos-only authentication (disable NTLM), enable Protected Users security group in Active Directory, and deploy Microsoft Defender for Identity.',
                tools: ['Mimikatz', 'Impacket', 'Rubeus'],
                apts: ['APT28', 'Wizard Spider', 'DarkSide'],
                severity: 'CRITICAL',
                cves: ['N/A (Pass-the-Hash / Ticket)'],
                labs: [14, 36],
                sigmaRule: `title: Pass the Hash NTLM Authentication from Non-Domain Host
id: 15500020-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects NTLM authentication anomalies characteristic of PtH
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4624
        LogonProcessName: 'NtLmSsp'
        AuthenticationPackageName: 'NTLM'
        WorkstationName: ''
    condition: selection
level: high`
            }
        ]
    },
    {
        id: 'TA0009',
        name: 'Command & Control',
        color: '#6366f1',
        desc: 'Techniques used to communicate with systems under attacker control.',
        techniques: [
            {
                id: 'T1071',
                name: 'Application Layer Protocol (HTTP, HTTPS, DNS C2)',
                desc: 'Encapsulating C2 communication inside standard web traffic or DNS queries to bypass network perimeter inspection.',
                detection: 'Zeek conn.log beaconing frequency analysis, high entropy DNS subdomains, JA3/JA4 TLS fingerprint anomalies.',
                mitigation: 'Implement SSL/TLS decryption and inspection, deploy DNS sinkholing with high-entropy DGA detection, and enforce forward web proxies.',
                tools: ['Zeek', 'Wireshark', 'Metasploit', 'Sliver'],
                apts: ['APT29', 'Cobalt Strike', 'Lazarus Group'],
                severity: 'CRITICAL',
                cves: ['N/A (Covert C2 Channel)'],
                labs: [1006, 39],
                sigmaRule: `title: Periodic HTTP Beaconing to External IP
id: 10710022-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects outbound HTTP requests with low jitter and fixed frequency intervals
logsource:
    category: proxy
detection:
    selection:
        c-uri|endswith: '/news.php'
    condition: selection
level: high`
            },
            {
                id: 'T1572',
                name: 'Protocol Tunneling (SOCKS, Chisel, SSH)',
                desc: 'Tunneling arbitrary network protocols through existing authorized connections to bypass firewall boundary restrictions.',
                detection: 'Long-lived outbound TCP sessions, anomalous non-standard protocols encapsulated inside HTTP/SSH ports.',
                mitigation: 'Deploy Next-Gen Firewalls with Deep Packet Inspection (App-ID), restrict outbound egress ports, and monitor SSH tunneling.',
                tools: ['Chisel', 'Ligolo-ng', 'Plink'],
                apts: ['Volt Typhoon', 'Lapsus$'],
                severity: 'HIGH',
                cves: ['N/A (Egress Tunneling)'],
                labs: [40],
                sigmaRule: `title: Chisel Reverse SOCKS Proxy Execution
id: 15720024-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects command-line execution of Chisel tunneling client
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        CommandLine|contains:
            - 'chisel client'
            - 'chisel.exe client'
            - 'R:socks'
    condition: selection
level: critical`
            }
        ]
    },
    {
        id: 'TA0010',
        name: 'Exfiltration',
        color: '#ef4444',
        desc: 'Techniques used to steal and transfer sensitive data out of the target network.',
        techniques: [
            {
                id: 'T1048',
                name: 'Exfiltration Over Alternative Protocol (DNS, ICMP)',
                desc: 'Exfiltrating Base64/hex-encoded stolen secrets inside DNS query subdomains or ICMP echo request data fields.',
                detection: 'Zeek dns.log query length anomalies (>50 characters per subdomain label), high volume ICMP payload inspections.',
                mitigation: 'Enforce local recursive DNS servers only (block direct UDP 53 to the internet), block outbound ICMP echo requests at the firewall.',
                tools: ['Scapy', 'Wireshark', 'Zeek'],
                apts: ['OilRig', 'APT34'],
                severity: 'HIGH',
                cves: ['N/A (Covert Exfiltration)'],
                labs: [39, 41],
                sigmaRule: `title: High Entropy DNS Exfiltration Queries
id: 10480026-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects unusually long DNS subdomains indicative of tunneling or exfiltration
logsource:
    category: dns
detection:
    selection:
        query_length|gt: 60
    condition: selection
level: high`
            },
            {
                id: 'T1567',
                name: 'Exfiltration Over Web Service (Cloud Storage)',
                desc: 'Uploading compressed and encrypted stolen archives to public cloud storage providers (AWS S3, Google Drive, Mega.nz).',
                detection: 'DLP egress upload volume alerts, massive HTTP POST payloads to cloud storage domains.',
                mitigation: 'Implement Cloud Access Security Broker (CASB) policies to block unapproved cloud storage uploads, and monitor endpoint archive creation.',
                tools: ['Trivy', 'Pacu', 'Rclone'],
                apts: ['Lapsus$', 'LockBit', 'Clop'],
                severity: 'CRITICAL',
                cves: ['N/A (Data Extortion)'],
                labs: [1005, 42],
                sigmaRule: `title: Rclone Execution for Cloud Data Exfiltration
id: 15670028-2940-410a-8bf8-2b814674dc8a
status: production
description: Detects command-line execution of Rclone syncing local directories to cloud buckets
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\\rclone.exe'
        CommandLine|contains:
            - 'copy'
            - 'sync'
            - 'mega:'
            - 's3:'
    condition: selection
level: critical`
            }
        ]
    }
];

export default function MitreMatrixTab() {
    const { playChime, setActiveTab, setActiveProjectModal } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedTactic, setSelectedTactic] = useState('ALL');
    const [selectedTech, setSelectedTech] = useState(null);
    const [isNavigatorModalOpen, setIsNavigatorModalOpen] = useState(false);
    const [copiedNavJson, setCopiedNavJson] = useState(false);
    const [copiedSigma, setCopiedSigma] = useState(false);

    // Initial coverage state
    const [coverage, setCoverage] = useState(() => {
        try {
            const saved = localStorage.getItem('ehacker_mitre_coverage');
            return saved ? JSON.parse(saved) : {
                'T1566': 'detected',
                'T1190': 'mitigated',
                'T1059': 'detected',
                'T1003': 'mitigated',
                'T1558': 'detected'
            };
        } catch (e) {
            return {};
        }
    });

    const toggleCoverage = (techId, e) => {
        if (e) e.stopPropagation();
        playChime();
        setCoverage(prev => {
            const current = prev[techId] || 'unmonitored';
            const next = current === 'unmonitored' ? 'detected' : current === 'detected' ? 'mitigated' : 'unmonitored';
            const updated = { ...prev, [techId]: next };
            try {
                localStorage.setItem('ehacker_mitre_coverage', JSON.stringify(updated));
            } catch (err) {}
            return updated;
        });
    };

    const setTechCoverage = (techId, newStatus) => {
        playChime();
        setCoverage(prev => {
            const updated = { ...prev, [techId]: newStatus };
            try {
                localStorage.setItem('ehacker_mitre_coverage', JSON.stringify(updated));
            } catch (err) {}
            return updated;
        });
    };

    const handleCopySigma = (sigmaText) => {
        if (!sigmaText) return;
        navigator.clipboard.writeText(sigmaText);
        setCopiedSigma(true);
        playChime();
        setTimeout(() => setCopiedSigma(false), 3000);
    };

    const allTechniques = useMemo(() => {
        return MITRE_TACTICS.flatMap(t => t.techniques);
    }, []);

    const stats = useMemo(() => {
        const total = allTechniques.length;
        const detected = allTechniques.filter(t => coverage[t.id] === 'detected').length;
        const mitigated = allTechniques.filter(t => coverage[t.id] === 'mitigated').length;
        const unmonitored = total - detected - mitigated;
        const coveragePct = Math.round(((detected + mitigated) / total) * 100);
        return { total, detected, mitigated, unmonitored, coveragePct };
    }, [allTechniques, coverage]);

    const navigatorLayerJson = useMemo(() => {
        return JSON.stringify({
            name: "Enterprise Threat Defense Layer 2026",
            versions: { attack: "14", navigator: "4.5", layer: "4.5" },
            domain: "enterprise-attack",
            description: "Coverage mapping exported from E-Hacker Cyber Defense Hub",
            techniques: allTechniques.map(t => ({
                techniqueID: t.id,
                score: coverage[t.id] === 'mitigated' ? 100 : coverage[t.id] === 'detected' ? 50 : 0,
                color: coverage[t.id] === 'mitigated' ? '#22c55e' : coverage[t.id] === 'detected' ? '#eab308' : '#334155',
                comment: `Status: ${(coverage[t.id] || 'unmonitored').toUpperCase()}`
            })),
            gradient: { colors: ["#334155", "#eab308", "#22c55e"], minValue: 0, maxValue: 100 }
        }, null, 2);
    }, [allTechniques, coverage]);

    const handleCopyNavigatorJson = () => {
        navigator.clipboard.writeText(navigatorLayerJson);
        setCopiedNavJson(true);
        playChime();
        setTimeout(() => setCopiedNavJson(false), 2000);
    };

    const filteredTactics = useMemo(() => {
        return MITRE_TACTICS.filter(tac => {
            if (selectedTactic !== 'ALL' && tac.id !== selectedTactic) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                tac.name.toLowerCase().includes(q) ||
                tac.desc.toLowerCase().includes(q) ||
                tac.techniques.some(t =>
                    t.name.toLowerCase().includes(q) ||
                    t.id.toLowerCase().includes(q) ||
                    t.desc.toLowerCase().includes(q) ||
                    t.tools.some(tool => tool.toLowerCase().includes(q))
                )
            );
        }).map(tac => {
            if (!search) return tac;
            const q = search.toLowerCase();
            return {
                ...tac,
                techniques: tac.techniques.filter(t =>
                    t.name.toLowerCase().includes(q) ||
                    t.id.toLowerCase().includes(q) ||
                    t.desc.toLowerCase().includes(q) ||
                    t.tools.some(tool => tool.toLowerCase().includes(q))
                )
            };
        });
    }, [search, selectedTactic]);

    return (
        <div className="tab-panel active">
            {/* Header Hub Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                            ENTERPRISE THREAT INTELLIGENCE MATRIX
                        </div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>MITRE ATT&CK Matrix & Technique Visualizer</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Interactive adversary tactic navigator with live SOC defense coverage tracking and ATT&CK Navigator JSON exporter.
                        </p>
                    </div>

                    <div className="flex-gap-10 align-center flex-wrap">
                        <button
                            className="site-btn tool-btn"
                            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}
                            onClick={() => { setIsNavigatorModalOpen(true); playChime(); }}
                        >
                            Export ATT&CK Navigator Layer
                        </button>
                    </div>
                </div>

                {/* SOC Coverage Metrics Bar */}
                <div className="glass-card mt-15 mb-15" style={{ margin: 0, padding: '12px 16px', background: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className="flex-space-between-center flex-wrap gap-10 mb-8">
                        <div className="flex-gap-15 align-center">
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                                ENTERPRISE DETECTION COVERAGE: <span style={{ color: '#22c55e' }}>{stats.coveragePct}%</span>
                            </span>
                            <span className="projects-badge-tag" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                                {stats.mitigated} Mitigated
                            </span>
                            <span className="projects-badge-tag" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047' }}>
                                {stats.detected} Detected
                            </span>
                            <span className="projects-badge-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                                {stats.unmonitored} Gaps
                            </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Click technique badge to cycle status
                        </span>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${(stats.mitigated / stats.total) * 100}%`, background: '#22c55e' }} />
                        <div style={{ width: `${(stats.detected / stats.total) * 100}%`, background: '#eab308' }} />
                    </div>
                </div>

                <div className="ai-nav-chips mt-15">
                    <button className={`ai-nav-btn ${selectedTactic === 'ALL' ? 'active' : ''}`} onClick={() => { setSelectedTactic('ALL'); playChime(); }}>
                        All Tactics ({MITRE_TACTICS.length})
                    </button>
                    {MITRE_TACTICS.map(tac => (
                        <button
                            key={tac.id}
                            className={`ai-nav-btn ${selectedTactic === tac.id ? 'active' : ''}`}
                            style={{ borderColor: selectedTactic === tac.id ? tac.color : 'var(--border-card)' }}
                            onClick={() => { setSelectedTactic(tac.id); playChime(); }}
                        >
                            {tac.name}
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div className="mt-15 flex-space-between-center flex-wrap gap-10">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search MITRE technique ID (T1059), attack name, tool, or detection..."
                        style={{ maxWidth: '420px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        Showing {filteredTactics.reduce((acc, t) => acc + t.techniques.length, 0)} Techniques
                    </span>
                </div>
            </div>

            {/* Matrix Tactics Grid */}
            <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredTactics.map(tac => (
                    <div
                        key={tac.id}
                        className="glass-card"
                        style={{
                            borderColor: `${tac.color}33`,
                            background: `linear-gradient(135deg, ${tac.color}08 0%, rgba(13, 20, 36, 0.7) 100%)`,
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Tactic Header */}
                        <div className="flex-space-between-center mb-10 pb-8" style={{ borderBottom: `1px solid ${tac.color}22` }}>
                            <div>
                                <span className="channel-badge" style={{ background: `${tac.color}20`, color: tac.color, fontSize: '0.72rem' }}>
                                    {tac.id}
                                </span>
                                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.05rem', color: '#f8fafc' }}>{tac.name}</h3>
                            </div>
                            <span className="operative-clearance-tag">{tac.techniques.length} Techniques</span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                            {tac.desc}
                        </p>

                        {/* Techniques list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                            {tac.techniques.map(tech => {
                                const status = coverage[tech.id] || 'unmonitored';
                                const statusColor = status === 'mitigated' ? '#22c55e' : status === 'detected' ? '#eab308' : '#64748b';
                                return (
                                    <div
                                        key={tech.id}
                                        className="glass-card"
                                        style={{
                                            margin: 0,
                                            padding: '12px 14px',
                                            background: 'rgba(0, 0, 0, 0.35)',
                                            border: `1px solid ${status === 'unmonitored' ? 'rgba(255, 255, 255, 0.05)' : statusColor}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => { setSelectedTech(tech); playChime(); }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = tac.color; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = status === 'unmonitored' ? 'rgba(255, 255, 255, 0.05)' : statusColor; }}
                                    >
                                        <div className="flex-space-between-center mb-6">
                                            <div className="flex-gap-6 align-center">
                                                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: tac.color }}>
                                                    {tech.id}
                                                </span>
                                                {tech.severity && (
                                                    <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', background: tech.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : tech.severity === 'HIGH' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(56, 189, 248, 0.2)', color: tech.severity === 'CRITICAL' ? '#f87171' : tech.severity === 'HIGH' ? '#fb923c' : '#38bdf8' }}>
                                                        {tech.severity}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-gap-6 align-center">
                                                <button
                                                    className="projects-badge-tag"
                                                    style={{
                                                        fontSize: '0.65rem',
                                                        padding: '2px 6px',
                                                        background: `${statusColor}20`,
                                                        color: statusColor,
                                                        cursor: 'pointer',
                                                        border: `1px solid ${statusColor}40`
                                                    }}
                                                    onClick={(e) => toggleCoverage(tech.id, e)}
                                                >
                                                    {status.toUpperCase()}
                                                </button>
                                            </div>
                                        </div>
                                        <h4 style={{ margin: '2px 0 4px', fontSize: '0.88rem', color: '#f1f5f9' }}>{tech.name}</h4>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                            {tech.desc.length > 85 ? tech.desc.substring(0, 85) + '...' : tech.desc}
                                        </p>
                                        <div className="flex-gap-4 flex-wrap">
                                            {tech.tools.slice(0, 3).map((t, idx) => (
                                                <span key={idx} style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                                                    {t}
                                                </span>
                                            ))}
                                            {tech.tools.length > 3 && (
                                                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>+{tech.tools.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* ATT&CK Navigator Layer JSON Exporter Modal */}
            {isNavigatorModalOpen && (
                <div className="modal-overlay active" onClick={() => setIsNavigatorModalOpen(false)}>
                    <div className="dialog-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="projects-badge-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                                    ATT&CK NAVIGATOR COMPLIANT LAYER (v4.5)
                                </span>
                                <h2 style={{ margin: '6px 0 0 0', fontSize: '1.25rem' }}>Enterprise Defense Posture Layer JSON</h2>
                            </div>
                            <button className="modal-close-btn" onClick={() => setIsNavigatorModalOpen(false)}>×</button>
                        </div>
                        <div className="modal-body mt-15">
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                Upload this JSON layer directly to <a href="https://mitre-attack.github.io/attack-navigator/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>MITRE ATT&CK Navigator</a> to visualize your enterprise defense matrix.
                            </p>

                            <div className="ai-code-output-card mt-12">
                                <div className="flex-space-between-center mb-8">
                                    <span className="ai-output-meta-label">JSON LAYER OUTPUT:</span>
                                    <button className="table-action-link" onClick={handleCopyNavigatorJson}>
                                        {copiedNavJson ? 'Copied to Clipboard!' : 'Copy JSON Layer'}
                                    </button>
                                </div>
                                <pre className="modal-code-box" style={{ margin: 0, maxHeight: '240px' }}>
                                    <code>{navigatorLayerJson}</code>
                                </pre>
                            </div>

                            <div className="flex-gap-10 mt-20">
                                <button className="site-btn" onClick={handleCopyNavigatorJson}>
                                    {copiedNavJson ? 'Copied!' : 'Copy Layer JSON'}
                                </button>
                                <button className="site-btn tool-btn secondary-btn" onClick={() => setIsNavigatorModalOpen(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Technique Deep Inspector Modal */}
            {selectedTech && (() => {
                const currentStatus = coverage[selectedTech.id] || 'unmonitored';
                const sevColor = selectedTech.severity === 'CRITICAL' ? '#ef4444' : selectedTech.severity === 'HIGH' ? '#f97316' : '#38bdf8';

                return (
                    <div className="modal-overlay active" onClick={() => setSelectedTech(null)}>
                        <div className="dialog-modal-box" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="modal-header pb-12" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div style={{ flex: 1 }}>
                                    <div className="flex-gap-8 align-center flex-wrap mb-6">
                                        <span className="projects-badge-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '0.72rem' }}>
                                            MITRE ATT&CK // {selectedTech.id}
                                        </span>
                                        {selectedTech.severity && (
                                            <span className="projects-badge-tag" style={{ background: `${sevColor}20`, color: sevColor, fontSize: '0.72rem', border: `1px solid ${sevColor}40` }}>
                                                {selectedTech.severity} SEVERITY
                                            </span>
                                        )}
                                    </div>
                                    <h2 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                                        {selectedTech.name}
                                    </h2>
                                </div>
                                <button className="modal-close-btn" style={{ fontSize: '1.2rem', padding: '4px 10px' }} onClick={() => setSelectedTech(null)}>
                                    ✕
                                </button>
                            </div>

                            {/* In-Modal Defense Coverage Switcher */}
                            <div className="glass-card mt-12 mb-15" style={{ padding: '10px 14px', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ENTERPRISE POSTURE:</span>
                                <div className="flex-gap-6">
                                    {[
                                        { id: 'unmonitored', label: 'UNMONITORED', color: '#64748b' },
                                        { id: 'detected', label: 'DETECTED', color: '#eab308' },
                                        { id: 'mitigated', label: 'MITIGATED', color: '#22c55e' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            className="projects-badge-tag"
                                            style={{
                                                fontSize: '0.72rem',
                                                padding: '4px 10px',
                                                cursor: 'pointer',
                                                background: currentStatus === opt.id ? `${opt.color}30` : 'transparent',
                                                color: currentStatus === opt.id ? opt.color : '#94a3b8',
                                                border: `1px solid ${currentStatus === opt.id ? opt.color : 'rgba(255, 255, 255, 0.1)'}`
                                            }}
                                            onClick={() => setTechCoverage(selectedTech.id, opt.id)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Body Cards */}
                            <div className="modal-body flex-column gap-14" style={{ padding: 0 }}>
                                {/* 1. Adversary TTP & Real-World APT Attribution */}
                                <div className="project-modal-section">
                                    <h4 className="project-section-heading" style={{ color: '#38bdf8' }}>
                                        1. Adversary TTP & Real-World Threat Actors
                                    </h4>
                                    <p className="project-desc-text mb-10" style={{ lineHeight: 1.5, fontSize: '0.88rem' }}>
                                        {selectedTech.desc}
                                    </p>

                                    {selectedTech.apts && selectedTech.apts.length > 0 && (
                                        <div className="mt-8">
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                                                DOCUMENTED THREAT ACTORS (APTs):
                                            </span>
                                            <div className="flex-gap-6 flex-wrap">
                                                {selectedTech.apts.map((apt, i) => (
                                                    <span key={i} className="channel-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '0.72rem', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                                                        {apt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedTech.cves && selectedTech.cves.length > 0 && selectedTech.cves[0] !== 'N/A' && (
                                        <div className="mt-8">
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                                                RELATED EXPLOIT VULNERABILITIES (CVEs):
                                            </span>
                                            <div className="flex-gap-6 flex-wrap">
                                                {selectedTech.cves.map((cve, i) => (
                                                    <span key={i} className="channel-badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047', fontSize: '0.72rem' }}>
                                                        {cve}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Blue Team Telemetry & Detection */}
                                <div className="project-modal-section">
                                    <h4 className="project-section-heading" style={{ color: '#eab308' }}>
                                        2. Blue Team Telemetry & Data Sources
                                    </h4>
                                    <div className="project-mitigation-box" style={{ fontSize: '0.85rem', lineHeight: 1.5, background: 'rgba(234, 179, 8, 0.06)', borderColor: 'rgba(234, 179, 8, 0.3)', color: '#fef08a' }}>
                                        {selectedTech.detection}
                                    </div>
                                </div>

                                {/* 3. Tactical Mitigation & Hardening */}
                                {selectedTech.mitigation && (
                                    <div className="project-modal-section">
                                        <h4 className="project-section-heading" style={{ color: '#22c55e' }}>
                                            3. Tactical Mitigation & Hardening Checklist
                                        </h4>
                                        <div className="project-mitigation-box" style={{ fontSize: '0.85rem', lineHeight: 1.5, background: 'rgba(34, 197, 94, 0.06)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#bbf7d0' }}>
                                            {selectedTech.mitigation}
                                        </div>
                                    </div>
                                )}

                                {/* 4. Sigma Detection Rule (YAML) */}
                                {selectedTech.sigmaRule && (
                                    <div className="project-modal-section">
                                        <div className="flex-space-between-center mb-6">
                                            <h4 className="project-section-heading" style={{ color: '#a855f7', margin: 0 }}>
                                                4. Sigma Detection Rule (Production YAML)
                                            </h4>
                                            <button
                                                className="table-action-link"
                                                style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '4px' }}
                                                onClick={() => handleCopySigma(selectedTech.sigmaRule)}
                                            >
                                                {copiedSigma ? 'Copied YAML!' : 'Copy Sigma Rule'}
                                            </button>
                                        </div>
                                        <pre className="modal-code-box" style={{ margin: 0, maxHeight: '200px', fontSize: '0.78rem', background: '#020617', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                                            <code>{selectedTech.sigmaRule}</code>
                                        </pre>
                                    </div>
                                )}

                                {/* 5. Associated Weaponry & Attack Tools */}
                                <div className="project-modal-section">
                                    <h4 className="project-section-heading" style={{ color: '#06b6d4' }}>
                                        5. Associated Weaponry & Attack Tools
                                    </h4>
                                    <div className="flex-gap-8 flex-wrap mt-6">
                                        {selectedTech.tools.map((t, i) => (
                                            <span key={i} className="channel-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', fontSize: '0.75rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="flex-space-between-center flex-wrap gap-10 mt-20 pt-15" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <a
                                    href={`https://attack.mitre.org/techniques/${selectedTech.id.replace('.', '/')}/`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-btn tool-btn secondary-btn"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                                >
                                    Official MITRE Docs ↗
                                </a>
                                <div className="flex-gap-10">
                                    <button className="site-btn tool-btn secondary-btn" onClick={() => { setSelectedTech(null); setActiveTab('ai-hub'); }}>
                                        AI Threat Hunter
                                    </button>
                                    <button className="site-btn tool-btn" onClick={() => { setSelectedTech(null); setActiveTab('projects'); }}>
                                        Launch Related Labs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
