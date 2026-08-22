import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TAB_TITLES = {
    overview: { title: "Overview Panel", subtitle: "E-hacker Cybersecurity specialization pathways" },
    roadmap: { title: "Timeline Roadmap", subtitle: "Interactive learning milestones. Check off skills as you learn!" },
    projects: { title: "Project Hub", subtitle: "100 curated hands-on cybersecurity projects with step-by-step implementation guides" },
    toolkit: { title: "Cyber Toolkit & Labs", subtitle: "Interactive client-side calculators, cryptographic encoders, and threat analyzers" },
    'ai-hub': { title: "AI Security Hub & Live Feeds", subtitle: "AI detection rule synthesis, payload deobfuscation, live CVE feeds & threat radar" },
    python: { title: "Python Cyber Lab", subtitle: "Interactive Python pentesting scripts, REPL sandbox, and exploit automation" },
    database: { title: "Target Database & Findings", subtitle: "Local-first engagement dossier, target scope tracker, CVSS findings log, and field notes" },
    tools: { title: "Tool Finder & Resources", subtitle: "Searchable database of essential tools, GitHub repos, YouTube guides, and 18 PDF field manuals" },
    quiz: { title: "Practice Quiz & Flashcards", subtitle: "Interactive cybersecurity practice exam and certification exam prep session" },
    profile: { title: "Operative Profile & Dossier", subtitle: "Multi-user profile manager, clearance status, and cyber achievements" },
    adhd: { title: "ADHD Focus Hub", subtitle: "Neurodivergent focus aids, gamified quests, and productivity boosters" },
    about: { title: "About Developer", subtitle: "Connect with the developer of the E-hacker Hub" }
};

export default function Header() {
    const {
        activeTab,
        setActiveTab,
        activeProfile,
        activeDomain,
        setActiveDomain,
        setIsSpotlightOpen,
        setIsTerminalModalOpen,
        setIsAuthModalOpen,
        setIsLogoutModalOpen,
        setIsLocked
    } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const meta = TAB_TITLES[activeTab] || TAB_TITLES.overview;

    const completedLabs = (activeProfile.completedProjects || []).length;
    const level = activeProfile.level || 1;
    const xp = activeProfile.xp || 0;
    const xpPercent = Math.min(100, Math.round(((xp % 100) / 100) * 100));

    return (
        <header className="dashboard-header">
            <div className="dashboard-title">
                <h1 id="panel-title">{meta.title}</h1>
                <p id="panel-subtitle">{meta.subtitle}</p>
            </div>

            <div className="header-action-group">
                <button
                    className="header-spotlight-btn"
                    onClick={() => setIsSpotlightOpen(true)}
                    title="Open Command Palette (Ctrl+K)"
                >
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <span className="spotlight-btn-text">Quick Search...</span>
                    <kbd className="spotlight-kbd">Ctrl K</kbd>
                </button>

                <div className="header-domain-wrapper">
                    <select
                        className="domain-select"
                        value={activeDomain}
                        onChange={(e) => setActiveDomain(e.target.value)}
                        title="Specialization Focus Track"
                    >
                        <option value="full">🌐 Full Spectrum</option>
                        <option value="web">🕷️ Web Pentest</option>
                        <option value="network">🔌 Infrastructure</option>
                        <option value="soc">🛡️ SOC Defense</option>
                        <option value="malware">🔬 Malware / RE</option>
                        <option value="osint">🔍 OSINT Recon</option>
                    </select>
                </div>

                <button
                    className="header-icon-btn"
                    onClick={() => setIsTerminalModalOpen(true)}
                    title="Launch Cyber Sandbox Terminal"
                >
                    <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-12-3l3.5-3.5L8 8l1.41-1.41L14.33 11.5l-4.92 4.91L8 15zm7 0h4v2h-4v-2z"/></svg>
                </button>

                <div className="topbar-gamification-hud" title={`Level ${level} - ${xp} XP`}>
                    <div className="topbar-level-badge">{level}</div>
                    <div className="topbar-hud-details">
                        <div className="topbar-rank-title">
                            {level >= 5 ? 'Cyber Overlord' : level >= 3 ? 'Elite Operative' : 'Script Kiddie'}
                        </div>
                        <div className="topbar-xp-track">
                            <div className="topbar-xp-fill" style={{ width: `${xpPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                <button
                    className="header-icon-btn text-danger"
                    onClick={() => setIsLogoutModalOpen(true)}
                    title="Deauthorize Session (Logout)"
                >
                    <svg viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                </button>

                <div className="header-operative-wrapper">
                    <button
                        className="operative-badge-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        title="Operative Identity & Clearance"
                    >
                        <div className="operative-avatar-circle">{activeProfile.avatar || '🥷'}</div>
                        <div className="operative-details">
                            <span className="operative-callsign">{activeProfile.callsign}</span>
                            <span className="operative-clearance-tag">{activeProfile.clearance}</span>
                        </div>
                        <svg viewBox="0 0 24 24" className="op-dropdown-icon"><path d="M7 10l5 5 5-5z"/></svg>
                    </button>

                    {isMenuOpen && (
                        <div className="operative-dropdown-menu active">
                            <div className="op-dropdown-header">
                                <strong>{activeProfile.callsign}</strong>
                                <span>Track: {(activeProfile.domain || 'full').toUpperCase()}</span>
                            </div>
                            <div className="op-dropdown-divider"></div>
                            <button
                                className="op-dropdown-item"
                                onClick={() => { setIsMenuOpen(false); setActiveTab('profile'); }}
                            >
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                Operative Profile & Dossier
                            </button>
                            <button
                                className="op-dropdown-item"
                                onClick={() => { setIsMenuOpen(false); setActiveTab('database'); }}
                            >
                                <svg viewBox="0 0 24 24"><path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2z"/></svg>
                                Target Intelligence Database
                            </button>
                            <button
                                className="op-dropdown-item"
                                onClick={() => { setIsMenuOpen(false); setIsAuthModalOpen(true); }}
                            >
                                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                Switch / Provision Callsign
                            </button>
                            <button
                                className="op-dropdown-item"
                                onClick={() => { setIsMenuOpen(false); setIsLocked(true); }}
                            >
                                <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                                Lock Workstation Terminal
                            </button>
                            <div className="op-dropdown-divider"></div>
                            <button
                                className="op-dropdown-item text-danger"
                                onClick={() => { setIsMenuOpen(false); setIsLogoutModalOpen(true); }}
                            >
                                <svg viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                                Deauthorize Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
