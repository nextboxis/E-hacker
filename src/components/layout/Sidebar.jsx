import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview Panel', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { id: 'roadmap', label: 'Timeline Roadmap', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { id: 'projects', label: 'Project Hub', badge: '118 Labs', badgeClass: 'proj-badge', icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z' },
    { id: 'mitre', label: 'MITRE ATT&CK', badge: 'Tactics', badgeStyle: { background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)' }, icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
    { id: 'toolkit', label: 'Cyber Toolkit', badge: 'Live', badgeClass: 'pulse-badge', icon: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.4 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.1z' },
    { id: 'ai-hub', label: 'AI Security Hub', badge: 'AI Live', badgeClass: 'ai-badge', icon: 'M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a3 3 0 0 1 3 3v2h1.28c.34-.6.98-1 1.72-1a2 2 0 1 1 0 4c-.74 0-1.38-.4-1.72-1H18v2a3 3 0 0 1-3 3h-2v1.28c.6.34 1 .98 1 1.72a2 2 0 1 1-4 0c0-.74.4-1.38 1-1.72V19H9a3 3 0 0 1-3-3v-2H4.72c-.34.6-.98 1-1.72 1a2 2 0 1 1 0-4c.74 0 1.38.4 1.72 1H6v-2a3 3 0 0 1 3-3h2V5.72C10.4 5.38 10 4.74 10 4a2 2 0 0 1 2-2z' },
    { id: 'soc-hunter', label: 'SOC Threat Hunter', badge: 'SIEM Lab', badgeStyle: { background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', border: '1px solid rgba(6, 182, 212, 0.4)' }, icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
    { id: 'database', label: 'Target Database', badge: 'Live DB', badgeStyle: { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }, icon: 'M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 5.2c-.78.47-1.99.8-3.37 1.01-1.38.21-2.9.29-4.63.29s-3.25-.08-4.63-.29C3.99 11 2.78 10.67 2 10.2V12c0 .5 2.13 2 6 2s6-1.5 6-2v-1.8zm0 5c-.78.47-1.99.8-3.37 1.01-1.38.21-2.9.29-4.63.29s-3.25-.08-4.63-.29C3.99 16 2.78 15.67 2 15.2V17c0 .5 2.13 2 6 2s6-1.5 6-2v-1.8z' },
    { id: 'tools', label: 'Tool Finder', icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' },
    { id: 'quiz', label: 'Practice Quiz & Cards', badge: 'Exam Prep', badgeClass: 'quiz-badge', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
    { id: 'profile', label: 'Operative Profile', badge: 'Active', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' }
];

export default function Sidebar() {
    const { activeTab, setActiveTab, playChime } = useAuth();

    return (
        <aside className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <div className="brand-logo">
                    <svg viewBox="0 0 24 24" className="cyber-brand-icon">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span className="brand-title">E-HACKER</span>
                </div>
            </div>

            <nav className="sidebar-nav" id="sidebar-nav">
                {NAV_ITEMS.map(item => (
                    <a
                        key={item.id}
                        className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(item.id); playChime(); }}
                    >
                        <svg viewBox="0 0 24 24"><path d={item.icon}/></svg>
                        <span>{item.label}</span>
                        {item.badge && (
                            <span
                                className={`nav-badge ${item.badgeClass || ''}`}
                                style={item.badgeStyle}
                            >
                                {item.badge}
                            </span>
                        )}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
