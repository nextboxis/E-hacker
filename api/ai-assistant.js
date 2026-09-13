// Serverless API: AI Cybersecurity Rule & Script Synthesizer
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { prompt = '', type = 'sigma' } = req.body || req.query || {};
    const queryLower = prompt.toLowerCase();

    let output = '';
    let category = 'Rule Generation';

    if (type === 'sigma' || queryLower.includes('sigma') || queryLower.includes('detect')) {
        output = `title: Detect Suspicious Process Creation Spawning Command Shell
id: ${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}
status: experimental
description: Identifies suspicious parent-child process relationships commonly associated with web shell execution, malicious Office macros, or initial exploitation.
references:
    - https://attack.mitre.org/techniques/T1059/001/
author: E-Hacker AI Threat Synthesizer
date: ${new Date().toISOString().slice(0, 10)}
tags:
    - attack.execution
    - attack.t1059.001
    - attack.t1059.003
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith:
            - '\\w3wp.exe'
            - '\\httpd.exe'
            - '\\nginx.exe'
            - '\\winword.exe'
            - '\\excel.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
            - '\\pwsh.exe'
            - '\\whoami.exe'
    condition: selection
falsepositives:
    - Legitimate administrative scripts or legacy IIS web extensions
level: high`;
    } else if (type === 'splunk' || queryLower.includes('splunk') || queryLower.includes('spl')) {
        output = `index=windows sourcetype=XmlWinEventLog:Microsoft-Windows-Sysmon/Operational EventCode=1
| eval ParentProcess=lower(ParentImage), ChildProcess=lower(Image)
| where match(ParentProcess, "(w3wp|httpd|nginx|tomcat)\\.exe$") AND match(ChildProcess, "(cmd|powershell|whoami|net|certutil)\\.exe$")
| stats count earliest(_time) as first_seen latest(_time) as last_seen by host, User, ParentImage, CommandLine, Image
| eval first_seen=strftime(first_seen, "%Y-%m-%d %H:%M:%S"), last_seen=strftime(last_seen, "%Y-%m-%d %H:%M:%S")
| sort - count`;
    } else if (type === 'yara' || queryLower.includes('yara') || queryLower.includes('malware')) {
        output = `rule Threat_CobaltStrike_Beacon_Implant {
    meta:
        author = "E-Hacker AI Engine"
        description = "Detects Cobalt Strike Malleable C2 Beacon in-memory signatures"
        date = "${new Date().toISOString().slice(0, 10)}"
        reference = "MITRE ATT&CK T1071.001"
        threat_level = "CRITICAL"
    strings:
        $pipe1 = "\\\\.\\pipe\\msagent_" ascii wide
        $pipe2 = "\\\\.\\pipe\\status_" ascii wide
        $s1 = "%s as %s\\%s: %d" ascii
        $s2 = "ReflectiveLoader" ascii
        $malleable1 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" ascii
    condition:
        uint16(0) == 0x5A4D and (2 of ($pipe*) or all of ($s*) or ($s2 and $malleable1))
}`;
    } else if (type === 'snort' || queryLower.includes('snort')) {
        output = `alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (
    msg:"AI-DETECT: Suspicious Remote Command Execution In HTTP Request [${prompt || 'Threat Vector'}]";
    flow:to_server,established;
    content:"/bin/sh"; nocase; http_uri;
    content:"cmd.exe"; nocase; http_header;
    classtype:web-application-attack;
    sid:${Math.floor(Math.random() * 900000 + 100000)}; rev:1;
    metadata:created_at ${new Date().toISOString().slice(0, 10)};
)`;
    } else if (type === 'kql' || queryLower.includes('kql') || queryLower.includes('sentinel')) {
        output = `// Microsoft Sentinel KQL Detection Query
// Threat: ${prompt || 'Suspicious Process Lineage'}
DeviceProcessEvents
| where InitiatingProcessFileName in~ ("w3wp.exe", "httpd.exe", "nginx.exe", "tomcat8.exe")
| where FileName in~ ("cmd.exe", "powershell.exe", "whoami.exe", "net.exe", "certutil.exe", "pwsh.exe")
| project Timestamp, DeviceName, AccountName, InitiatingProcessFileName, InitiatingProcessCommandLine, FileName, ProcessCommandLine
| summarize EventCount = count(), FirstSeen = min(Timestamp), LastSeen = max(Timestamp) by DeviceName, AccountName, ProcessCommandLine
| where EventCount > 0
| order by EventCount desc`;
    } else {
        // Python Security Automation Script
        output = `#!/usr/bin/env python3
"""
E-Hacker Automated Threat Hunting Script
Target: ${prompt || 'Suspicious Network Connections & Process Anomalies'}
"""
import psutil
import socket
import datetime

print(f"[*] Commencing Host Threat Audit at {datetime.datetime.now()}")

suspicious_ports = [4444, 1337, 8888, 9001, 7070, 31337]

for conn in psutil.net_connections(kind='inet'):
    if conn.status == 'ESTABLISHED' and conn.raddr:
        remote_ip, remote_port = conn.raddr.ip, conn.raddr.port
        if remote_port in suspicious_ports:
            try:
                proc = psutil.Process(conn.pid)
                print(f"[!] ALERT: Suspicious C2 Connection on port {remote_port}!")
                print(f"    PID: {conn.pid} | Process: {proc.name()} | User: {proc.username()}")
                print(f"    Command Line: {' '.join(proc.cmdline())}")
                print(f"    Remote Endpoint: {remote_ip}:{remote_port}")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass

print("[*] Audit scan cycle complete.")`;
    }

    res.status(200).json({
        success: true,
        status: "success",
        type: type,
        prompt: prompt,
        timestamp: new Date().toISOString(),
        rule: output,
        result: output
    });
}
