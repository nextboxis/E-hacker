import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

const ALL_QUESTIONS = [
    // === Network & Protocol Security ===
    {
        q: "Which Nmap scan flag initiates a TCP SYN Stealth Scan without completing the 3-way handshake?",
        opts: ["-sT", "-sS", "-sU", "-sA"],
        ans: 1,
        exp: "-sS performs a SYN stealth scan by sending a SYN packet and awaiting SYN-ACK without completing the handshake, making it harder to detect in logs.",
        cat: "Network & Protocol"
    },
    {
        q: "Which protocol operates on UDP port 53 and is commonly abused for data exfiltration tunneling?",
        opts: ["HTTP", "SMTP", "DNS", "FTP"],
        ans: 2,
        exp: "DNS (port 53) can be abused for data exfiltration by encoding data in subdomain queries (e.g., data.evil.com), which often passes through firewalls unmonitored.",
        cat: "Network & Protocol"
    },
    {
        q: "What is the primary purpose of ARP Spoofing in a network attack?",
        opts: ["Crack WPA2 passwords", "Redirect traffic through the attacker's machine (MitM)", "Enumerate open ports", "Bypass firewall rules"],
        ans: 1,
        exp: "ARP Spoofing sends falsified ARP messages to link the attacker's MAC address with the IP of a legitimate host, enabling man-in-the-middle interception of traffic.",
        cat: "Network & Protocol"
    },
    {
        q: "Which Wireshark display filter shows only HTTP POST requests?",
        opts: ["tcp.port == 80", "http.request.method == POST", "ip.proto == http", "http.post"],
        ans: 1,
        exp: "The display filter 'http.request.method == POST' isolates HTTP POST requests for analysis of form submissions, API calls, and credential transmission.",
        cat: "Network & Protocol"
    },
    {
        q: "What does LLMNR stand for, and why is it a security risk?",
        opts: ["Local Link Multicast Name Resolution - can be poisoned to capture NTLMv2 hashes", "Lightweight LDAP Management Network Relay - exposes LDAP credentials", "Link Layer Multicast Name Registry - allows DNS cache poisoning", "Local LAN Management Name Resolver - enables ARP spoofing"],
        ans: 0,
        exp: "LLMNR (Local Link Multicast Name Resolution) falls back to broadcast queries when DNS fails. Tools like Responder poison these responses to capture NTLMv2 authentication hashes.",
        cat: "Network & Protocol"
    },
    {
        q: "Which Zeek log file records DNS queries and responses for threat hunting?",
        opts: ["conn.log", "http.log", "dns.log", "ssl.log"],
        ans: 2,
        exp: "Zeek's dns.log records every DNS query including query type, response codes, and answers, making it essential for detecting DNS tunneling and DGA domains.",
        cat: "Network & Protocol"
    },

    // === Web Application Pentesting ===
    {
        q: "Which HTTP response header prevents a page from being rendered inside an iframe to defend against clickjacking?",
        opts: ["Content-Security-Policy", "X-Frame-Options", "Strict-Transport-Security", "X-Content-Type-Options"],
        ans: 1,
        exp: "X-Frame-Options: DENY (or SAMEORIGIN) instructs the browser to refuse rendering the page inside any iframe, preventing clickjacking attacks.",
        cat: "Web Pentesting"
    },
    {
        q: "What type of SQL injection uses time delays (e.g., SLEEP(5)) to infer data when no output is visible?",
        opts: ["Error-based SQLi", "UNION-based SQLi", "Time-based Blind SQLi", "Out-of-band SQLi"],
        ans: 2,
        exp: "Time-based blind SQLi injects conditional SLEEP() functions. If the response is delayed, the condition was true, allowing binary search extraction of data.",
        cat: "Web Pentesting"
    },
    {
        q: "What is Server-Side Request Forgery (SSRF) primarily used to attack?",
        opts: ["Client-side JavaScript execution", "Internal services and cloud metadata endpoints", "Browser cookie theft", "DNS zone transfers"],
        ans: 1,
        exp: "SSRF forces the server to make requests to internal resources (e.g., http://169.254.169.254 for cloud metadata), bypassing firewall and network segmentation.",
        cat: "Web Pentesting"
    },
    {
        q: "Which OWASP Top 10 (2021) category covers vulnerabilities like hardcoded credentials and default passwords?",
        opts: ["A01: Broken Access Control", "A02: Cryptographic Failures", "A05: Security Misconfiguration", "A07: Identification and Authentication Failures"],
        ans: 3,
        exp: "A07: Identification and Authentication Failures covers weak passwords, credential stuffing, missing MFA, and session management flaws.",
        cat: "Web Pentesting"
    },
    {
        q: "What is the purpose of the 'Intruder' tool in Burp Suite?",
        opts: ["Intercept and modify HTTP requests in real-time", "Automate customized attack payloads against parameters", "Scan for XSS vulnerabilities automatically", "Decode Base64 and URL-encoded values"],
        ans: 1,
        exp: "Burp Intruder automates sending parameterized payloads (wordlists, fuzzing strings) to specific insertion points in HTTP requests for brute-forcing and vulnerability discovery.",
        cat: "Web Pentesting"
    },
    {
        q: "Which payload tests for Server-Side Template Injection (SSTI) in Jinja2?",
        opts: ["<script>alert(1)</script>", "{{7*7}}", "' OR 1=1 --", "${7*7}"],
        ans: 1,
        exp: "{{7*7}} is a Jinja2 template expression. If the server returns '49', the input is being processed by the template engine, confirming SSTI vulnerability.",
        cat: "Web Pentesting"
    },

    // === Active Directory & Enterprise ===
    {
        q: "In Active Directory, what attack targets service account tickets to crack NTLM hashes offline?",
        opts: ["Pass-the-Hash", "Kerberoasting", "DCSync", "AS-REP Roasting"],
        ans: 1,
        exp: "Kerberoasting requests TGS service tickets for SPNs and attempts offline dictionary cracking on the RC4/AES encrypted hash without triggering account lockout.",
        cat: "Active Directory"
    },
    {
        q: "What Mimikatz command extracts plaintext credentials from LSASS process memory?",
        opts: ["kerberos::list", "sekurlsa::logonpasswords", "lsadump::sam", "token::elevate"],
        ans: 1,
        exp: "sekurlsa::logonpasswords dumps all cached credentials from the LSASS process including NTLM hashes, Kerberos tickets, and WDigest plaintext passwords.",
        cat: "Active Directory"
    },
    {
        q: "What is the primary purpose of BloodHound in Active Directory assessments?",
        opts: ["Crack Kerberos tickets", "Visualize attack paths to Domain Admin using graph theory", "Dump NTDS.dit database", "Enumerate DNS records"],
        ans: 1,
        exp: "BloodHound maps AD relationships (ACLs, group memberships, sessions) into a Neo4j graph database and uses Dijkstra's algorithm to find shortest paths to Domain Admin.",
        cat: "Active Directory"
    },
    {
        q: "Which Windows event log ID records a Kerberos TGS ticket request (useful for detecting Kerberoasting)?",
        opts: ["4624", "4625", "4769", "4688"],
        ans: 2,
        exp: "Event ID 4769 logs Kerberos Service Ticket Operations. A spike in 4769 events with RC4 encryption (0x17) from a single source may indicate Kerberoasting.",
        cat: "Active Directory"
    },
    {
        q: "What is DCSync and which Impacket tool performs it?",
        opts: ["Dumping SAM database - impacket-reg", "Replicating AD credentials via DRSR protocol - impacket-secretsdump", "Extracting GPP passwords - impacket-Get-GPPPassword", "Brute-forcing SMB - impacket-smbclient"],
        ans: 1,
        exp: "DCSync abuses Directory Replication Service (MS-DRSR) to request password hashes from domain controllers. impacket-secretsdump performs this with --just-dc-ntlm flag.",
        cat: "Active Directory"
    },
    {
        q: "What does AS-REP Roasting exploit?",
        opts: ["Weak service account passwords", "Accounts with 'Do not require Kerberos pre-authentication' enabled", "Unconstrained delegation", "Group Policy Preferences"],
        ans: 1,
        exp: "AS-REP Roasting targets accounts with Kerberos pre-authentication disabled, allowing attackers to request AS-REP messages that contain crackable encrypted material.",
        cat: "Active Directory"
    },

    // === Digital Forensics & Malware ===
    {
        q: "Which Volatility 3 plugin lists all running processes with their parent-child hierarchy?",
        opts: ["windows.pslist", "windows.pstree", "windows.malfind", "windows.dlllist"],
        ans: 1,
        exp: "windows.pstree displays the process tree showing parent-child relationships, which helps identify suspicious process lineages like explorer.exe spawning cmd.exe.",
        cat: "Forensics & Malware"
    },
    {
        q: "What is a YARA rule primarily used for?",
        opts: ["Network traffic analysis", "Pattern-matching to identify and classify malware samples", "SQL injection detection", "Brute-force password cracking"],
        ans: 1,
        exp: "YARA rules define text/binary patterns (strings, hex sequences, regex) to identify and classify malware families across files, memory dumps, and network streams.",
        cat: "Forensics & Malware"
    },
    {
        q: "Which Windows artifact records program execution history including run count and timestamps?",
        opts: ["Registry Hives", "Prefetch Files (.pf)", "Event Logs (.evtx)", "Shellbags"],
        ans: 1,
        exp: "Windows Prefetch files (C:\\Windows\\Prefetch\\*.pf) record the executable name, run count, last execution timestamps, and files/volumes accessed during execution.",
        cat: "Forensics & Malware"
    },
    {
        q: "What is process hollowing in malware analysis?",
        opts: ["Injecting shellcode into a running process's memory", "Creating a legitimate process in suspended state and replacing its memory with malicious code", "Hooking API calls to intercept data", "Using COM objects for persistence"],
        ans: 1,
        exp: "Process hollowing creates a legitimate process (e.g., svchost.exe) in a suspended state, unmaps its legitimate code, writes malicious code into its address space, then resumes execution.",
        cat: "Forensics & Malware"
    },

    // === Cloud Security ===
    {
        q: "What AWS metadata endpoint can an SSRF vulnerability access to steal IAM role credentials?",
        opts: ["http://localhost:8080/credentials", "http://169.254.169.254/latest/meta-data/iam/security-credentials/", "http://10.0.0.1/aws/iam/keys", "http://metadata.google.internal/computeMetadata/v1/"],
        ans: 1,
        exp: "AWS Instance Metadata Service (IMDS) at 169.254.169.254 exposes temporary IAM credentials. SSRF to this endpoint can steal access keys for the instance's IAM role.",
        cat: "Cloud Security"
    },
    {
        q: "What AWS service provides continuous monitoring and threat detection using ML and anomaly detection?",
        opts: ["AWS Inspector", "AWS GuardDuty", "AWS Config", "AWS Macie"],
        ans: 1,
        exp: "AWS GuardDuty analyzes CloudTrail, VPC Flow Logs, and DNS logs using machine learning to detect cryptocurrency mining, credential compromise, and unauthorized access.",
        cat: "Cloud Security"
    },
    {
        q: "In Azure AD / Entra ID, what is an 'Illicit Consent Grant' attack?",
        opts: ["Brute-forcing user passwords via Azure Portal", "Tricking a user into granting OAuth permissions to a malicious app", "Exploiting a SQL injection in Azure SQL", "Modifying Conditional Access policies"],
        ans: 1,
        exp: "An illicit consent grant tricks users into authorizing a malicious OAuth application that requests broad permissions (Mail.Read, Files.ReadWrite) to access organizational data.",
        cat: "Cloud Security"
    },

    // === General Security Concepts ===
    {
        q: "What CVSS v3.1 Attack Vector (AV) metric represents an attack requiring physical access to target hardware?",
        opts: ["Network (N)", "Adjacent (A)", "Local (L)", "Physical (P)"],
        ans: 3,
        exp: "Physical (AV:P) denotes vulnerabilities that require physical device interaction, e.g. malicious USB implants, cold boot attacks, or hardware keylogger installation.",
        cat: "General Concepts"
    },
    {
        q: "What does the MITRE ATT&CK technique T1059 represent?",
        opts: ["Credential Dumping", "Command and Scripting Interpreter", "Data Exfiltration", "Lateral Movement via SMB"],
        ans: 1,
        exp: "T1059 covers adversaries using command-line interfaces and scripting interpreters (PowerShell, Bash, Python, cmd.exe) to execute commands on victim systems.",
        cat: "General Concepts"
    },
    {
        q: "What is the difference between a vulnerability scan and a penetration test?",
        opts: ["They are identical in scope and methodology", "Vuln scan identifies weaknesses; pentest actively exploits them to prove impact", "Pentest is automated; vuln scan is manual", "Vuln scan requires physical access; pentest is remote"],
        ans: 1,
        exp: "Vulnerability scanning identifies and reports potential weaknesses. Penetration testing goes further by actively exploiting vulnerabilities to demonstrate real-world business impact.",
        cat: "General Concepts"
    },
    {
        q: "Which NIST framework function focuses on detecting security events in real-time?",
        opts: ["Identify", "Protect", "Detect", "Recover"],
        ans: 2,
        exp: "The NIST CSF 'Detect' function defines activities to identify cybersecurity events, including continuous monitoring, anomaly detection, and security event analysis.",
        cat: "General Concepts"
    },
    {
        q: "What does the principle of least privilege require?",
        opts: ["All users share the same admin account", "Users receive only the minimum access needed for their role", "Privileged accounts should have no password expiration", "Root access should be available to all developers"],
        ans: 1,
        exp: "Least privilege mandates that users, processes, and systems receive only the minimum permissions necessary to perform their function, reducing the blast radius of compromise.",
        cat: "General Concepts"
    }
];

const CATEGORIES = ['ALL', 'Network & Protocol', 'Web Pentesting', 'Active Directory', 'Forensics & Malware', 'Cloud Security', 'General Concepts'];
const MODES = [
    { key: 'quick', label: 'Quick Blitz (5)', count: 5 },
    { key: 'standard', label: 'Standard Exam (15)', count: 15 },
    { key: 'full', label: 'Full Assessment (All)', count: null }
];

export default function QuizTab() {
    const { addXp, playChime } = useAuth();
    const [selectedCat, setSelectedCat] = useState('ALL');
    const [selectedMode, setSelectedMode] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const filteredQuestions = useMemo(() => {
        let pool = selectedCat === 'ALL' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.cat === selectedCat);
        // Shuffle
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const modeObj = MODES.find(m => m.key === selectedMode);
        if (modeObj && modeObj.count) return shuffled.slice(0, modeObj.count);
        return shuffled;
    }, [selectedCat, selectedMode]);

    const q = filteredQuestions[currentIdx];

    const handleSelect = (idx) => {
        if (selectedOpt !== null) return;
        setSelectedOpt(idx);
        if (idx === q.ans) {
            setScore(prev => prev + 1);
            addXp(25);
            playChime();
        }
    };

    const handleNext = () => {
        if (currentIdx + 1 < filteredQuestions.length) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOpt(null);
        } else {
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setShowResults(false);
        setCurrentIdx(0);
        setSelectedOpt(null);
        setScore(0);
        setSelectedMode(null);
    };

    // Exam Mode Selection Screen
    if (!selectedMode) {
        return (
            <div className="tab-panel active">
                <div className="glass-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <div className="projects-badge-tag">CERTIFICATION DRILL ENGINE</div>
                    <h2 style={{ margin: '8px 0' }}>Cybersecurity Knowledge Assessment</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                        {ALL_QUESTIONS.length} questions across {CATEGORIES.length - 1} domains. Select a category and exam mode to begin.
                    </p>

                    <div className="mt-20">
                        <label className="tool-input-label">CATEGORY FILTER:</label>
                        <div className="flex-gap-10 flex-wrap mt-8">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c}
                                    className={'filter-chip ' + (selectedCat === c ? 'active' : '')}
                                    onClick={() => setSelectedCat(c)}
                                >
                                    {c} {c !== 'ALL' ? `(${ALL_QUESTIONS.filter(q => q.cat === c).length})` : `(${ALL_QUESTIONS.length})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20">
                        <label className="tool-input-label">EXAM MODE:</label>
                        <div className="flex-gap-10 flex-wrap mt-8">
                            {MODES.map(m => (
                                <button
                                    key={m.key}
                                    className="site-btn tool-btn"
                                    style={{ padding: '10px 20px' }}
                                    onClick={() => setSelectedMode(m.key)}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tab-panel active">
            <div className="glass-card" style={{ maxWidth: '720px', margin: '0 auto' }}>
                <h3 className="tool-section-title">Certification Practice Exam - Concept Drills</h3>
                {!showResults && q ? (
                    <div className="mt-20">
                        <div className="flex-space-between-center mb-10 flex-wrap gap-10">
                            <span className="channel-badge">Question {currentIdx + 1} of {filteredQuestions.length}</span>
                            <span className="projects-badge-tag" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd' }}>{q.cat}</span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '12px 0', lineHeight: 1.5 }}>{q.q}</h4>

                        <div className="quiz-options-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {q.opts.map((opt, idx) => {
                                let btnStyle = {};
                                let indicator = '';
                                if (selectedOpt !== null) {
                                    if (idx === q.ans) {
                                        btnStyle = { borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
                                        indicator = ' [CORRECT]';
                                    } else if (selectedOpt === idx) {
                                        btnStyle = { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
                                        indicator = ' [WRONG]';
                                    }
                                }
                                return (
                                    <button
                                        key={idx}
                                        className="site-btn tool-btn"
                                        style={{ textAlign: 'left', padding: '12px 18px', width: '100%', ...btnStyle }}
                                        onClick={() => handleSelect(idx)}
                                    >
                                        <span style={{ fontFamily: 'monospace', marginRight: '10px', opacity: 0.5 }}>{String.fromCharCode(65 + idx)}.</span>
                                        {opt}{indicator}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedOpt !== null && (
                            <div className="ai-code-output-card mt-20">
                                <p style={{ color: 'var(--color-accent)', fontSize: '0.88rem' }}><strong>Explanation:</strong> {q.exp}</p>
                                <button className="site-btn mt-10" onClick={handleNext}>
                                    {currentIdx + 1 < filteredQuestions.length ? 'Next Question' : 'View Results'}
                                </button>
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '6px', transition: 'width 0.3s ease' }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mt-20">
                        <h2>Exam Drill Complete!</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-accent)' }}>
                            You scored {score} / {filteredQuestions.length} (+{score * 25} XP Claimed)
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Accuracy: {filteredQuestions.length > 0 ? Math.round((score / filteredQuestions.length) * 100) : 0}%
                        </p>
                        <button className="site-btn mt-15" onClick={handleRestart}>
                            Retake Exam
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
