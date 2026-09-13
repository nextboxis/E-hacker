import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CURATED_CVES } from '../../data/cveData';

export default function TerminalModal() {
    const { isTerminalModalOpen, setIsTerminalModalOpen, activeProfile, setActiveTab, theme, setTheme } = useAuth();
    const [history, setHistory] = useState([
        { type: 'system', text: 'E-HACKER Cyber Sandbox Terminal v3.0 (React Core)' },
        { type: 'system', text: 'Type "help" for a list of available cybersecurity commands.' }
    ]);
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    if (!isTerminalModalOpen) return null;

    const handleCommand = async (e) => {
        if (e.key !== 'Enter') return;
        const rawCmd = input.trim();
        if (!rawCmd) return;

        const newHist = [...history, { type: 'cmd', text: `root@nextboxis:~# ${rawCmd}` }];

        const parts = rawCmd.split(' ');
        const mainCmd = parts[0].toLowerCase();
        const arg = parts.slice(1).join(' ');

        switch (mainCmd) {
            case 'help':
                newHist.push({
                    type: 'output',
                    text: 'Available commands: whoami, status, nmap, sqlmap, hashid, cve [query], analyze [payload], mitre [id], labs [open], db, theme [name], python, tools, xp, clear, exit'
                });
                break;
            case 'whoami':
                newHist.push({
                    type: 'output',
                    text: `Operative: ${activeProfile.callsign} | Clearance: ${activeProfile.clearance} | Domain: ${activeProfile.domain}`
                });
                break;
            case 'status':
                newHist.push({
                    type: 'output',
                    text: `[OPERATIVE STATUS] Callsign: ${activeProfile.callsign} | Level: ${activeProfile.level || 1} (${activeProfile.xp || 0} XP) | Clearance: ${activeProfile.clearance} | Theme: ${theme.toUpperCase()} | Labs Curriculum: 118 Active Labs`
                });
                break;
            case 'nmap':
                newHist.push({
                    type: 'output',
                    text: 'Starting Nmap 7.94 scan on localhost: 22/tcp OPEN (ssh), 80/tcp OPEN (http), 443/tcp OPEN (https), 8080/tcp OPEN (http-proxy).'
                });
                break;
            case 'sqlmap':
                newHist.push({
                    type: 'output',
                    text: 'sqlmap identified target is vulnerable: boolean-based blind, error-based, UNION query (5 columns). Backend DBMS: PostgreSQL 16.'
                });
                break;
            case 'hashid':
                newHist.push({
                    type: 'output',
                    text: '5d41402abc4b2a76b9719d911017c592 -> MD5 (Hashcat: -m 0, John: raw-md5, Crypt: $1$)'
                });
                break;
            case 'cve': {
                if (arg) {
                    const matches = CURATED_CVES.filter(c =>
                        c.id.toLowerCase().includes(arg.toLowerCase()) ||
                        c.title.toLowerCase().includes(arg.toLowerCase()) ||
                        c.vendor.toLowerCase().includes(arg.toLowerCase())
                    );
                    if (matches.length === 0) {
                        newHist.push({ type: 'output', text: `No CVE advisories found matching "${arg}".` });
                    } else {
                        matches.slice(0, 3).forEach(c => {
                            newHist.push({
                                type: 'output',
                                text: `[${c.id}] CVSS ${c.cvss} (${c.severity}) - ${c.title} [Vendor: ${c.vendor}]`
                            });
                        });
                    }
                } else {
                    newHist.push({ type: 'output', text: '--- TOP ACTIVE 2026 ZERO-DAY CVE ADVISORIES ---' });
                    CURATED_CVES.slice(0, 3).forEach(c => {
                        newHist.push({
                            type: 'output',
                            text: `[${c.id}] CVSS ${c.cvss} (${c.severity}) - ${c.title}`
                        });
                    });
                    newHist.push({ type: 'output', text: 'Use "cve <vendor|year>" to filter specific advisories.' });
                }
                break;
            }
            case 'analyze': {
                if (!arg) {
                    newHist.push({ type: 'output', text: 'Usage: analyze <payload_string> (e.g. analyze \' OR 1=1 --)' });
                } else {
                    const lower = arg.toLowerCase();
                    const detected = [];
                    let score = 0;
                    if (/('|--|union|select|sleep|pg_sleep|insert|drop)/i.test(lower)) {
                        score += 45;
                        detected.push('SQL Injection Pattern');
                    }
                    if (/(<script|onerror|onload|javascript:|eval\(|<img|<svg)/i.test(lower)) {
                        score += 45;
                        detected.push('Cross-Site Scripting (XSS)');
                    }
                    if (/(;|&&|\|\||`|\$\(|\/etc\/passwd|whoami|powershell)/i.test(lower)) {
                        score += 50;
                        detected.push('Command Injection / RCE Syntax');
                    }
                    if (/(169\.254\.169\.254|metadata\.google|localhost|127\.0\.0\.1)/i.test(lower)) {
                        score += 40;
                        detected.push('SSRF / Cloud Metadata');
                    }
                    const finalScore = Math.min(100, score);
                    const risk = finalScore >= 70 ? 'CRITICAL' : finalScore >= 40 ? 'HIGH' : finalScore > 0 ? 'MEDIUM' : 'LOW';
                    newHist.push({
                        type: 'output',
                        text: `[THREAT ANALYSIS] Risk: ${risk} (${finalScore}/100) | Detected: ${detected.length > 0 ? detected.join(', ') : 'No obvious malicious heuristics'}`
                    });
                }
                break;
            }
            case 'mitre': {
                const techniques = {
                    't1059': 'T1059 - Command and Scripting Interpreter (PowerShell, Bash, Python)',
                    't1190': 'T1190 - Exploit Public-Facing Application (Web Gateway RCE)',
                    't1003': 'T1003 - OS Credential Dumping (LSASS memory, SAM hashes, NTDS.dit)',
                    't1566': 'T1566 - Phishing (Spearphishing Link / Malicious Attachment)',
                    't1486': 'T1486 - Data Encrypted for Impact (Ransomware encryption routine)',
                    't1078': 'T1078 - Valid Accounts (Compromised credentials, token replay)',
                    't1195': 'T1195 - Supply Chain Compromise (Trojanized dependencies, build pipelines)',
                    't1047': 'T1047 - Windows Management Instrumentation (WMI execution and lateral movement)'
                };
                const tid = arg.toLowerCase().replace('.', '');
                if (tid && techniques[tid]) {
                    newHist.push({ type: 'output', text: `[MITRE ATT&CK] ${techniques[tid]}` });
                } else {
                    newHist.push({ type: 'output', text: 'Known techniques: T1059, T1190, T1003, T1566, T1486, T1078, T1195, T1047. Usage: mitre T1059' });
                }
                break;
            }
            case 'labs':
            case 'projects': {
                if (arg === 'open') {
                    setActiveTab('projects');
                    setIsTerminalModalOpen(false);
                    return;
                }
                newHist.push({
                    type: 'output',
                    text: '118 Production Security Labs loaded across 8 specialized domains (Network, Web, Exploitation, AD, Forensics, SIEM, Cloud, Tool Dev). Type "labs open" to launch Labs.'
                });
                break;
            }
            case 'db': {
                let tCount = 3, fCount = 2;
                try {
                    const savedT = localStorage.getItem('ehacker_db_targets');
                    if (savedT) tCount = JSON.parse(savedT).length;
                    const savedF = localStorage.getItem('ehacker_db_findings');
                    if (savedF) fCount = JSON.parse(savedF).length;
                } catch (e) {}
                newHist.push({
                    type: 'output',
                    text: `[DATABASE TELEMETRY] Targets registered: ${tCount} | Vulnerability findings: ${fCount} | Cloud Sync: Ready`
                });
                break;
            }
            case 'theme': {
                const validThemes = ['cyberpunk', 'matrix', 'stealth', 'crimson', 'tokyo'];
                if (arg && validThemes.includes(arg.toLowerCase())) {
                    setTheme(arg.toLowerCase());
                    newHist.push({ type: 'output', text: `Theme successfully switched to: ${arg.toUpperCase()}` });
                } else {
                    newHist.push({
                        type: 'output',
                        text: `Active Theme: ${theme.toUpperCase()}. Available: ${validThemes.join(', ')}. Usage: theme matrix`
                    });
                }
                break;
            }
            case 'python':
            case 'tools':
                setActiveTab('toolkit');
                setIsTerminalModalOpen(false);
                break;
            case 'xp':
                newHist.push({ type: 'output', text: `Total Experience: ${activeProfile.xp || 0} XP | Level: ${activeProfile.level || 1}` });
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'exit':
                setIsTerminalModalOpen(false);
                return;
            default:
                newHist.push({ type: 'error', text: `Command not recognized: ${rawCmd}. Type "help" for cyber command list.` });
        }

        setHistory(newHist);
        setInput('');
    };

    return (
        <div className="terminal-overlay active" onClick={() => setIsTerminalModalOpen(false)}>
            <div className="terminal-window" onClick={(e) => e.stopPropagation()}>
                <div className="terminal-topbar">
                    <div className="terminal-traffic-lights">
                        <span className="traffic-dot close-dot" onClick={() => setIsTerminalModalOpen(false)}></span>
                        <span className="traffic-dot min-dot"></span>
                        <span className="traffic-dot max-dot"></span>
                    </div>
                    <span className="terminal-title">root@nextboxis:~ (E-HACKER CLI SANDBOX)</span>
                    <button className="terminal-close-x" onClick={() => setIsTerminalModalOpen(false)}>×</button>
                </div>

                <div className="terminal-screen">
                    {history.map((h, i) => (
                        <div key={i} className={`terminal-line terminal-${h.type}`}>
                            {h.text}
                        </div>
                    ))}
                    <div className="terminal-input-row">
                        <span className="terminal-prompt">root@nextboxis:~#</span>
                        <input
                            type="text"
                            className="terminal-input"
                            autoFocus
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleCommand}
                        />
                    </div>
                    <div ref={endRef}></div>
                </div>
            </div>
        </div>
    );
}
