import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STAGES = [
    {
        num: 1,
        code: "STG-01",
        title: "Pre-Security & Core Fundamentals",
        desc: "Master Linux terminal navigation, core TCP/IP networking, DNS resolution, HTTP/S request-response lifecycle, and basic Python scripting.",
        color: "#38bdf8",
        cert: "CompTIA Security+ / Linux+",
        skills: [
            { id: "sec-fund", name: "Security Architecture & CIA Triad", xp: 25 },
            { id: "linux-cli", name: "Linux Bash CLI & File Permissions (chmod/chown)", xp: 25 },
            { id: "net-tcp", name: "TCP/IP 3-Way Handshake & OSI Model", xp: 25 },
            { id: "web-http", name: "HTTP/1.1 & HTTP/2 Request/Response Anatomy", xp: 25 },
            { id: "dns-recon", name: "DNS Record Types & Resolution Mechanics", xp: 25 },
            { id: "py-basics", name: "Python Scripting for Sockets & Automation", xp: 25 }
        ]
    },
    {
        num: 2,
        code: "STG-02",
        title: "Network Auditing & Traffic Forensics",
        desc: "Port scanning, service fingerprinting, protocol dissection, PCAP traffic analysis, and vulnerability exploitation.",
        color: "#22c55e",
        cert: "eJPT / CompTIA CySA+",
        skills: [
            { id: "nmap-audit", name: "Nmap SYN, UDP & NSE Script Scanning", xp: 25 },
            { id: "wireshark-audit", name: "Wireshark Display Filters & TCP Stream Reassembly", xp: 25 },
            { id: "metasploit-exploit", name: "Metasploit Multi-Handler & Staged Payloads", xp: 25 },
            { id: "mitm-arp", name: "ARP Spoofing & SSL Stripping MitM Attacks", xp: 25 },
            { id: "ssh-hydra", name: "Hydra Automated Service Credential Auditing", xp: 25 },
            { id: "snmp-enum", name: "SNMP Community String MIB Enumeration", xp: 25 }
        ]
    },
    {
        num: 3,
        code: "STG-03",
        title: "Web Application Penetration Testing",
        desc: "Systematic auditing of OWASP Top 10 vulnerabilities, intercepting proxies, business logic flaws, and API security.",
        color: "#eab308",
        cert: "PortSwigger BSCP / OSWE",
        skills: [
            { id: "sqli-mastery", name: "SQL Injection (UNION, Blind, Time-Based)", xp: 25 },
            { id: "xss-audit", name: "Cross-Site Scripting (Reflected, Stored, DOM)", xp: 25 },
            { id: "ssrf-cloud", name: "Server-Side Request Forgery & Cloud IMDS Theft", xp: 25 },
            { id: "idor-access", name: "Insecure Direct Object References (IDOR/BOLA)", xp: 25 },
            { id: "xxe-injection", name: "XML External Entity (XXE) File Exfiltration", xp: 25 },
            { id: "jwt-bypass", name: "JWT Signature Stripping & None Algorithm Abuse", xp: 25 },
            { id: "ssti-rce", name: "Server-Side Template Injection to Remote Code Exec", xp: 25 }
        ]
    },
    {
        num: 4,
        code: "STG-04",
        title: "Active Directory & Enterprise Exploitation",
        desc: "Kerberos ticket attacks, ACL abuse, LDAP enumeration, DCSync, pass-the-hash, and ADCS escalation.",
        color: "#f97316",
        cert: "PNPT / CRTP / OSCP",
        skills: [
            { id: "ad-kerberoast", name: "Kerberoasting SPN Service Account Hashes", xp: 25 },
            { id: "ad-dcsync", name: "DCSync Replication NTDS.dit Password Extraction", xp: 25 },
            { id: "ad-bloodhound", name: "BloodHound Neo4j Shortest Attack Path Graphing", xp: 25 },
            { id: "ad-asrep", name: "AS-REP Roasting No-Preauth User Accounts", xp: 25 },
            { id: "ad-adcs", name: "Active Directory Certificate Services (ESC1-ESC8)", xp: 25 },
            { id: "ad-pth", name: "Pass-the-Hash & Pass-the-Ticket Lateral Movement", xp: 25 },
            { id: "ad-responder", name: "LLMNR / NBT-NS Poisoning with Responder", xp: 25 }
        ]
    },
    {
        num: 5,
        code: "STG-05",
        title: "Threat Hunting & Blue Team Detection",
        desc: "SIEM log analysis, Sigma rule engineering, volatile memory forensics, YARA scanning, and incident triage.",
        color: "#a855f7",
        cert: "BTL1 / CCD / GCIH",
        skills: [
            { id: "siem-hunting", name: "Splunk & Elastic SIEM Event Correlation", xp: 25 },
            { id: "sigma-rules", name: "Sigma Generic Detection Rule Authoring", xp: 25 },
            { id: "yara-scans", name: "YARA Rule Memory & Binary Pattern Matching", xp: 25 },
            { id: "volatility-mem", name: "Volatility 3 Kernel Object & VAD Forensics", xp: 25 },
            { id: "zeek-hunting", name: "Zeek Network Threat & DNS Tunneling Analysis", xp: 25 },
            { id: "sysmon-audit", name: "Sysmon Process Creation & Parent-Child Lineage", xp: 25 }
        ]
    },
    {
        num: 6,
        code: "STG-06",
        title: "Exploit Dev, Reversing & AI Security",
        desc: "Ghidra decompilation, buffer overflow development, x86_64 assembly, and LLM adversarial red teaming.",
        color: "#ec4899",
        cert: "OSEP / OSED / CRTO",
        skills: [
            { id: "ghidra-re", name: "Ghidra Static Decompilation & P-Code Reversing", xp: 25 },
            { id: "bof-exploit", name: "Stack-Based Buffer Overflow & EIP Control", xp: 25 },
            { id: "shellcode-dev", name: "x86_64 Assembly Shellcode Development", xp: 25 },
            { id: "llm-redteam", name: "LLM Prompt Injection, Jailbreaking & PyRIT", xp: 25 },
            { id: "edr-evasion", name: "AMSI Bypass & Process Hollowing Techniques", xp: 25 }
        ]
    }
];

export default function RoadmapTab() {
    const { activeProfile, toggleSkill, playChime, setActiveTab } = useAuth();
    const checked = activeProfile.checkedSkills || [];
    const totalSkills = STAGES.reduce((acc, s) => acc + s.skills.length, 0);
    const masteredSkills = checked.length;
    const overallProgress = Math.round((masteredSkills / totalSkills) * 100);

    return (
        <div className="tab-panel active">
            {/* Header Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">CYBERSECURITY CURRICULUM & CAREER TREE</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>6-Stage Specialization & Skill Mastery Roadmap</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Comprehensive progression tree spanning pre-security fundamentals through advanced Active Directory exploitation, digital forensics, and AI-era red teaming.
                        </p>
                    </div>

                    {/* Overall Progress Stat Box */}
                    <div className="stat-box" style={{ minWidth: '180px', textAlign: 'center' }}>
                        <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{overallProgress}%</div>
                        <div className="stat-lbl">{masteredSkills} / {totalSkills} Skills Mastered</div>
                        <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${overallProgress}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '4px', transition: 'width 0.5s ease' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stages Grid */}
            <div className="roadmap-stages-grid">
                {STAGES.map(stage => {
                    const stageSkillIds = stage.skills.map(s => s.id);
                    const stageMastered = stageSkillIds.filter(id => checked.includes(id)).length;
                    const stagePct = Math.round((stageMastered / stage.skills.length) * 100);
                    const isStageComplete = stageMastered === stage.skills.length;

                    return (
                        <div
                            key={stage.num}
                            className="glass-card mb-20"
                            style={{
                                borderColor: isStageComplete ? 'rgba(34, 197, 94, 0.4)' : `${stage.color}33`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Top Stage Header */}
                            <div className="flex-space-between-center flex-wrap gap-10 mb-10">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="channel-badge" style={{ background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40` }}>
                                        {stage.code}
                                    </span>
                                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                        {stage.title}
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="projects-badge-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                        {stage.cert}
                                    </span>
                                    <span className="operative-clearance-tag" style={{ color: isStageComplete ? '#22c55e' : stage.color }}>
                                        {stageMastered}/{stage.skills.length} ({stagePct}%)
                                    </span>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '15px' }}>
                                {stage.desc}
                            </p>

                            {/* Stage Progress Bar */}
                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '5px', overflow: 'hidden', marginBottom: '15px' }}>
                                <div style={{ width: `${stagePct}%`, height: '100%', background: isStageComplete ? '#22c55e' : stage.color, borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                            </div>

                            {/* Skills Checklist */}
                            <div className="skills-checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                                {stage.skills.map(sk => {
                                    const isChecked = checked.includes(sk.id);
                                    return (
                                        <label
                                            key={sk.id}
                                            className="checkbox-container"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                background: isChecked ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255,255,255,0.02)',
                                                border: isChecked ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(255,255,255,0.04)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => { toggleSkill(sk.id); playChime(); }}
                                            />
                                            <span className="checkmark"></span>
                                            <div style={{ marginLeft: '8px', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', color: isChecked ? '#22c55e' : 'var(--text-primary)' }}>
                                                    {sk.name}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: isChecked ? '#22c55e' : 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                    +{sk.xp} XP
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
