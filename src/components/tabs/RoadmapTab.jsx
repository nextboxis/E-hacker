import React from 'react';
import { useAuth } from '../../context/AuthContext';

const STAGES = [
    { num: 1, title: "Stage 1: Pre-Security & Fundamentals", desc: "Linux CLI, Networking Protocols (TCP/IP, DNS, HTTP/S), Computer Architecture", skills: ["sec-fund", "linux-cli", "net-tcp", "web-http"] },
    { num: 2, title: "Stage 2: Network Audit & Penetration Testing", desc: "Nmap port scanning, Wireshark packet capture, Metasploit exploitation", skills: ["nmap-audit", "wireshark-audit", "metasploit-exploit"] },
    { num: 3, title: "Stage 3: Web Application Exploitation", desc: "OWASP Top 10, SQL Injection, XSS, CSRF, SSRF, IDOR, Broken Authentication", skills: ["sqli-mastery", "xss-audit", "ssrf-cloud", "idor-access"] },
    { num: 4, title: "Stage 4: Active Directory & Enterprise Infrastructure", desc: "Kerberoasting, DCSync, Pass-the-Hash, BloodHound graph analysis, Group Policy", skills: ["ad-kerberoast", "ad-dcsync", "ad-bloodhound"] },
    { num: 5, title: "Stage 5: Advanced Evasion & Defense (Blue Team)", desc: "SIEM log analysis, Sigma detection rules, memory forensics, YARA threat hunting", skills: ["siem-hunting", "sigma-rules", "yara-scans"] },
    { num: 6, title: "Stage 6: Exploit Development & Reverse Engineering", desc: "Ghidra decompilation, buffer overflow, x86_64 assembly, fuzzing", skills: ["ghidra-re", "bof-exploit", "shellcode-dev"] }
];

export default function RoadmapTab() {
    const { activeProfile, toggleSkill } = useAuth();
    const checked = activeProfile.checkedSkills || [];

    return (
        <div className="tab-panel active">
            <div className="glass-card mb-20">
                <h2>️ 6-Stage Cybersecurity Specialization Roadmap</h2>
                <p>Track your progression from computer fundamentals to advanced enterprise red teaming and exploit development. Check off skills as you master them.</p>
            </div>

            <div className="roadmap-stages-grid">
                {STAGES.map(stage => (
                    <div key={stage.num} className="glass-card mb-20">
                        <div className="flex-space-between-center mb-10">
                            <h3 style={{ color: 'var(--color-accent)' }}>{stage.title}</h3>
                            <span className="channel-badge">Stage #{stage.num}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{stage.desc}</p>

                        <div className="skills-checklist">
                            {stage.skills.map(sk => {
                                const isChecked = checked.includes(sk);
                                return (
                                    <label key={sk} className="checkbox-container" style={{ display: 'block', marginBottom: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSkill(sk)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="checkbox-text" style={{ textTransform: 'capitalize' }}>
                                            {sk.replace(/-/g, ' ')} (+25 XP)
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
