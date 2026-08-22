import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CURATED_CVES } from '../../data/cveData';

export default function AiHubTab() {
    const { playChime } = useAuth();
    const [subTab, setSubTab] = useState('rules');
    const [rulePrompt, setRulePrompt] = useState('Detect web server process spawning command shell');
    const [ruleFormat, setRuleFormat] = useState('sigma');
    const [synthesizedRule, setSynthesizedRule] = useState('');
    const [cveSearch, setCveSearch] = useState('');
    const [radarLogs, setRadarLogs] = useState([]);
    const canvasRef = useRef(null);

    const generateRule = (p, fmt) => {
        if (fmt === 'sigma') {
            setSynthesizedRule(`title: Detect ${p || 'Suspicious Threat Activity'}
id: ${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}
status: production
description: Autonomous detection rule synthesized for identifying ${p || 'threat telemetry'}.
author: E-Hacker AI Threat Synthesizer
date: ${new Date().toISOString().slice(0, 10)}
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        ParentImage|endswith:
            - '\\w3wp.exe'
            - '\\httpd.exe'
            - '\\nginx.exe'
        Image|endswith:
            - '\\cmd.exe'
            - '\\powershell.exe'
            - '\\whoami.exe'
    condition: selection
level: high`);
        } else if (fmt === 'splunk') {
            setSynthesizedRule(`index=windows sourcetype="WinEventLog:Sysmon" EventCode=1
| eval Parent=lower(ParentImage), Child=lower(Image)
| where match(Parent, "(w3wp|httpd|nginx)\\.exe$") AND match(Child, "(cmd|powershell|whoami)\\.exe$")
| stats count earliest(_time) as first_seen latest(_time) as last_seen by host, User, CommandLine`);
        } else if (fmt === 'yara') {
            setSynthesizedRule(`rule Threat_CobaltStrike_Beacon {
    meta:
        author = "E-Hacker AI Engine"
        threat_level = "CRITICAL"
    strings:
        $pipe = "\\\\.\\pipe\\msagent_" ascii wide
        $payload = { 48 89 5C 24 ?? 48 89 6C 24 ?? 48 89 74 24 }
    condition:
        uint16(0) == 0x5A4D and ($pipe or $payload)
}`);
        }
    };

    useEffect(() => {
        generateRule(rulePrompt, ruleFormat);
    }, [rulePrompt, ruleFormat]);

    // Radar Canvas
    useEffect(() => {
        if (subTab !== 'radar') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let angle = 0;
        let animId;
        const blips = [];

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const radius = Math.min(cx, cy) - 15;

            // Rings
            ctx.strokeStyle = 'rgba(0, 255, 102, 0.2)';
            for (let r = 1; r <= 3; r++) {
                ctx.beginPath();
                ctx.arc(cx, cy, (radius / 3) * r, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Sweep
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.fillStyle = 'rgba(0, 255, 102, 0.15)';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, 0, Math.PI / 4);
            ctx.fill();
            ctx.restore();

            angle += 0.03;

            // Spawn blip
            if (Math.random() < 0.03 && blips.length < 5) {
                const dist = Math.random() * (radius - 20) + 10;
                const a = Math.random() * Math.PI * 2;
                blips.push({ x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist, alpha: 1.0 });
                setRadarLogs(prev => [
                    `[${new Date().toLocaleTimeString()}] Threat Sweep detected on port :${[22, 80, 443, 445, 3389][Math.floor(Math.random()*5)]}`,
                    ...prev.slice(0, 6)
                ]);
            }

            for (let i = blips.length - 1; i >= 0; i--) {
                const b = blips[i];
                ctx.fillStyle = `rgba(239, 68, 68, ${b.alpha})`;
                ctx.beginPath();
                ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
                ctx.fill();
                b.alpha -= 0.008;
                if (b.alpha <= 0) blips.splice(i, 1);
            }

            animId = requestAnimationFrame(draw);
        };

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        draw();

        return () => cancelAnimationFrame(animId);
    }, [subTab]);

    const filteredCves = CURATED_CVES.filter(c => 
        c.id.toLowerCase().includes(cveSearch.toLowerCase()) || 
        c.title.toLowerCase().includes(cveSearch.toLowerCase()) ||
        c.vendor.toLowerCase().includes(cveSearch.toLowerCase())
    );

    return (
        <div className="tab-panel active">
            <div className="ai-hero-card glass-card mb-25">
                <div className="ai-hero-header">
                    <div>
                        <div className="projects-badge-tag">AI INTELLIGENCE & REAL-TIME TELEMETRY</div>
                        <h2>AI Cyber Security Suite & Live Threat Radar</h2>
                        <p>Generate detection rules, deobfuscate payloads, build incident response playbooks, and monitor live global CVE zero-day feeds with simulated attack radar.</p>
                    </div>
                    <div className="ai-live-telemetry-badge">
                        <span className="pulse-dot"></span>
                        <span>LIVE ENGINE ONLINE</span>
                    </div>
                </div>

                <div className="ai-nav-chips">
                    <button className={`ai-nav-btn ${subTab === 'rules' ? 'active' : ''}`} onClick={() => setSubTab('rules')}> AI Rule Synthesizer</button>
                    <button className={`ai-nav-btn ${subTab === 'cve' ? 'active' : ''}`} onClick={() => setSubTab('cve')}> Real-time CVE Feed</button>
                    <button className={`ai-nav-btn ${subTab === 'radar' ? 'active' : ''}`} onClick={() => setSubTab('radar')}> Global Threat Radar</button>
                </div>
            </div>

            {subTab === 'rules' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-15 flex-wrap gap-10">
                        <h3 className="tool-section-title"> AI Detection Rule & Script Synthesizer</h3>
                        <div className="ai-format-chips">
                            {['sigma', 'splunk', 'yara'].map(f => (
                                <button
                                    key={f}
                                    className={`filter-chip ${ruleFormat === f ? 'active' : ''}`}
                                    onClick={() => setRuleFormat(f)}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-15">
                        <label className="tool-input-label">Describe Attack Behavior or Security Requirement:</label>
                        <div className="flex-gap-10">
                            <input
                                type="text"
                                className="search-input"
                                value={rulePrompt}
                                onChange={(e) => setRulePrompt(e.target.value)}
                            />
                            <button className="site-btn" style={{ minWidth: '140px' }} onClick={() => generateRule(rulePrompt, ruleFormat)}>
                                 Synthesize
                            </button>
                        </div>
                    </div>

                    <div className="ai-code-output-card">
                        <div className="flex-space-between-center mb-8">
                            <span className="ai-output-meta-label">{ruleFormat.toUpperCase()} DETECTION ARTIFACT</span>
                            <button className="table-action-link" onClick={() => navigator.clipboard.writeText(synthesizedRule)}>Copy Synthesized Code</button>
                        </div>
                        <pre className="modal-code-box"><code>{synthesizedRule}</code></pre>
                    </div>
                </div>
            )}

            {subTab === 'cve' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-15 flex-wrap gap-15">
                        <h3 className="tool-section-title"> Live Real-Time CVE & Threat Stream</h3>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search CVEs by ID or Vendor..."
                            style={{ width: '260px' }}
                            value={cveSearch}
                            onChange={(e) => setCveSearch(e.target.value)}
                        />
                    </div>

                    <div className="cve-feed-grid">
                        {filteredCves.map(c => (
                            <div key={c.id} className="cve-card">
                                <div className="cve-card-header">
                                    <span className="cve-id-badge">{c.id}</span>
                                    <span className="channel-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#ef4444' }}>
                                        {c.severity} (CVSS {c.cvss})
                                    </span>
                                </div>
                                <h4 className="cve-title">{c.title}</h4>
                                <p className="cve-desc">{c.summary}</p>
                                <div className="cve-footer">
                                    <span style={{ color: 'var(--text-muted)' }}>Vendor: {c.vendor}</span>
                                    <span style={{ color: 'var(--color-accent)' }}>{c.mitigation}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {subTab === 'radar' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-15">
                        <h3 className="tool-section-title"> Global Cyber Attack Telemetry Radar</h3>
                        <div className="radar-status-badge">
                            <span className="pulse-dot"></span>
                            <span>SCAN FREQUENCY: 12.8 GHz</span>
                        </div>
                    </div>

                    <div className="radar-container">
                        <canvas ref={canvasRef} className="threat-radar-canvas" style={{ width: '100%', height: '340px' }}></canvas>
                        <div className="radar-live-log-box">
                            <div className="radar-log-header">LIVE ATTACK EVENT STREAM</div>
                            <div className="radar-log-stream">
                                {radarLogs.map((log, i) => (
                                    <div key={i} className="radar-log-entry">{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
