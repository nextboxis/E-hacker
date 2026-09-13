import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TOOLS_DATABASE, OSINT_TOOLS, AI_SECURITY_TOOLS, CHANNELS_DATABASE } from '../../data/toolsData';
import { PRACTICE_PLATFORMS, CERTIFICATIONS_ROADMAP, STANDARDS_AND_CHEATSHEETS } from '../../data/resourcesData';
import { CURATED_CVES, THREAT_BULLETINS } from '../../data/cveData';

const RANKS = [
    { name: 'Novice', threshold: 0, color: '#64748b' },
    { name: 'Script Kiddie', threshold: 100, color: '#06b6d4' },
    { name: 'Hacker', threshold: 300, color: '#22c55e' },
    { name: 'Operator', threshold: 600, color: '#eab308' },
    { name: 'Red Team Lead', threshold: 1000, color: '#f97316' },
    { name: 'Cyber Architect', threshold: 2000, color: '#a855f7' },
    { name: 'Shadow Admin', threshold: 5000, color: '#ef4444' }
];

function getRank(xp) {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.threshold) rank = r;
    }
    return rank;
}

function getNextRank(xp) {
    for (const r of RANKS) {
        if (xp < r.threshold) return r;
    }
    return null;
}

export default function OverviewTab() {
    const { activeProfile, setActiveTab, playChime, theme, setTheme, THEMES } = useAuth();
    const completedLabs = (activeProfile.completedProjects || []).length;
    const checkedSkills = (activeProfile.checkedSkills || []).length;
    const xp = activeProfile.xp || 0;
    const rank = getRank(xp);
    const nextRank = getNextRank(xp);
    const progressPct = nextRank ? Math.min(100, ((xp - rank.threshold) / (nextRank.threshold - rank.threshold)) * 100) : 100;

    const quickModules = [
        { label: 'Project Hub', key: 'projects', desc: `${completedLabs} of 118 hands-on labs completed`, color: 'var(--color-accent)' },
        { label: 'Tools Directory', key: 'tools', desc: `${TOOLS_DATABASE.length} tools, ${OSINT_TOOLS.length} OSINT, ${AI_SECURITY_TOOLS.length} AI weapons`, color: 'var(--color-secondary)' },
        { label: 'AI Security Hub', key: 'ai-hub', desc: 'Sigma, YARA, Snort, KQL rule generator & LLM firewall', color: '#a855f7' },
        { label: 'SOC Threat Hunter', key: 'soc-hunter', desc: 'Live SIEM incident telemetry, Sysmon & Wireshark PCAP dissector', color: '#06b6d4' },
        { label: 'Learning Roadmap', key: 'roadmap', desc: `${checkedSkills} skills mastered across 6 stages`, color: '#eab308' },
        { label: 'Practice Quiz', key: 'quiz', desc: 'Certification drill engine with XP rewards', color: '#ef4444' }
    ];

    return (
        <div className="tab-panel active">
            <div className="overview-grid">
                {/* Workstation Visual Theme Switcher Card */}
                <div className="glass-card" style={{ gridColumn: 'span 2', background: 'rgba(0,0,0,0.4)', borderColor: 'var(--border-card)' }}>
                    <div className="flex-space-between-center flex-wrap gap-10 mb-12">
                        <div>
                            <span className="projects-badge-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-accent)' }}>COMMAND PALETTE // THEME ENGINE</span>
                            <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.05rem' }}>Workstation Visual Atmosphere</h3>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            ACTIVE PALETTE: <strong style={{ color: 'var(--color-accent)' }}>{(THEMES.find(t => t.id === theme)?.name || 'CYBERPUNK').toUpperCase()}</strong>
                        </span>
                    </div>

                    <div className="theme-switcher-container">
                        {THEMES.map(t => (
                            <button
                                key={t.id}
                                className={`theme-pill-btn ${theme === t.id ? 'active' : ''}`}
                                onClick={() => setTheme(t.id)}
                            >
                                <span
                                    className="theme-color-preview-dot"
                                    style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                                ></span>
                                <span>{t.name}</span>
                                <span className="theme-tag-mini">{t.tag}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Operative Dossier Welcome Card */}
                <div className="glass-card welcome-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.4) 100%)', borderColor: 'var(--border-card)' }}>
                    <div className="projects-badge-tag" style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--color-accent)' }}>OPERATIVE COMMAND BRIEFING</div>
                    <h2 style={{ margin: '6px 0 4px 0' }}>Welcome back, Operative {activeProfile.callsign}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '680px' }}>
                        This interactive command workstation is your launchpad to master the cybersecurity ecosystem. Progress through structured roadmap stages, complete hands-on labs, generate AI detection rules, and run security operations.
                    </p>
                    
                    {/* Operative Rank & XP Progress */}
                    <div style={{ margin: '18px 0 12px', maxWidth: '480px' }}>
                        <div className="flex-space-between-center mb-4">
                            <div>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>RANK: </span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: rank.color, fontSize: '0.9rem' }}>{rank.name.toUpperCase()}</span>
                            </div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {xp} XP {nextRank ? `/ ${nextRank.threshold} XP` : '(MAX)'}
                            </span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ width: `${progressPct}%`, height: '100%', background: `linear-gradient(90deg, ${rank.color}, ${nextRank ? nextRank.color : rank.color})`, borderRadius: '6px', transition: 'width 0.6s ease' }}></div>
                        </div>
                        {nextRank && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                                {nextRank.threshold - xp} XP to reach {nextRank.name}
                            </p>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="stat-card-group">
                        <div className="stat-box">
                            <div className="stat-value">{completedLabs}</div>
                            <div className="stat-lbl">Labs Done</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{checkedSkills}</div>
                            <div className="stat-lbl">Skills Mastered</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{xp}</div>
                            <div className="stat-lbl">Earned XP</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{TOOLS_DATABASE.length + OSINT_TOOLS.length + AI_SECURITY_TOOLS.length}</div>
                            <div className="stat-lbl">Total Tools</div>
                        </div>
                    </div>
                </div>

                {/* Quick Launch Grid */}
                {quickModules.map((mod, i) => (
                    <div
                        key={i}
                        className="glass-card"
                        style={{ cursor: 'pointer', borderColor: `${mod.color}33`, transition: 'border-color 0.3s ease, transform 0.2s ease' }}
                        onClick={() => { setActiveTab(mod.key); playChime(); }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${mod.color}88`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${mod.color}33`; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <div className="flex-space-between-center mb-8">
                            <span className="projects-badge-tag" style={{ background: `${mod.color}20`, color: mod.color }}>{mod.label.toUpperCase()}</span>
                        </div>
                        <h3 style={{ margin: '4px 0 6px', fontSize: '1.05rem' }}>{mod.label}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>{mod.desc}</p>
                    </div>
                ))}

                {/* Platform Statistics Card */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="tool-section-title">Platform Resource Matrix</h3>
                    <div className="stat-card-group" style={{ marginTop: '12px' }}>
                        <div className="stat-box">
                            <div className="stat-value">{PRACTICE_PLATFORMS.length}</div>
                            <div className="stat-lbl">Wargames</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{CERTIFICATIONS_ROADMAP.length}</div>
                            <div className="stat-lbl">Certifications</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{STANDARDS_AND_CHEATSHEETS.length}</div>
                            <div className="stat-lbl">Standards</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{CHANNELS_DATABASE.length}</div>
                            <div className="stat-lbl">YouTube Mentors</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{CURATED_CVES.length}</div>
                            <div className="stat-lbl">Critical CVEs</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{THREAT_BULLETINS.length}</div>
                            <div className="stat-lbl">Threat Actors</div>
                        </div>
                    </div>
                </div>

                {/* Live Threat Bulletin Ticker */}
                <div className="glass-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, rgba(20, 21, 26, 0.9) 100%)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <div className="flex-space-between-center mb-10">
                        <h3 className="tool-section-title" style={{ margin: 0 }}>
                            <span className="deauth-pulse-dot" style={{ display: 'inline-block', marginRight: '8px' }}></span>
                            Active Threat Intelligence Feed
                        </h3>
                        <button className="site-btn tool-btn" style={{ fontSize: '0.78rem' }} onClick={() => { setActiveTab('ai-hub'); playChime(); }}>
                            Full CVE Database
                        </button>
                    </div>
                    <div className="ir-steps-list" style={{ listStyle: 'none', padding: 0 }}>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {CURATED_CVES.slice(0, 4).map((cve, i) => (
                                <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: cve.severity === 'CRITICAL' ? '#ef4444' : '#eab308', marginRight: '10px', fontSize: '0.82rem' }}>{cve.id}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{cve.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span className="projects-badge-tag" style={{ background: cve.severity === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)', color: cve.severity === 'CRITICAL' ? '#fca5a5' : '#fde047', fontSize: '0.7rem' }}>
                                            CVSS {cve.cvss}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
