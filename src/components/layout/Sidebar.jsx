import React from 'react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview Panel', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { id: 'roadmap', label: 'Timeline Roadmap', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { id: 'projects', label: 'Project Hub', badge: '100 Labs', badgeClass: 'proj-badge', icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z' },
    { id: 'toolkit', label: 'Cyber Toolkit', badge: 'Live', badgeClass: 'pulse-badge', icon: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.4 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.1z' },
    { id: 'ai-hub', label: 'AI Security Hub', badge: 'AI Live', badgeClass: 'ai-badge', icon: 'M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.72V7h2a3 3 0 0 1 3 3v2h1.28c.34-.6.98-1 1.72-1a2 2 0 1 1 0 4c-.74 0-1.38-.4-1.72-1H18v2a3 3 0 0 1-3 3h-2v1.28c.6.34 1 .98 1 1.72a2 2 0 1 1-4 0c0-.74.4-1.38 1-1.72V19H9a3 3 0 0 1-3-3v-2H4.72c-.34.6-.98 1-1.72 1a2 2 0 1 1 0-4c.74 0 1.38.4 1.72 1H6v-2a3 3 0 0 1 3-3h2V5.72C10.4 5.38 10 4.74 10 4a2 2 0 0 1 2-2z' },
    { id: 'python', label: 'Python Cyber Lab', badge: 'Py 3.11', badgeStyle: { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }, icon: 'M14.25 2.25c-.4 0-.8.35-.8.75v3.5c0 .4.4.75.8.75h3.5c.4 0 .75-.35.75-.75V3c0-.4-.35-.75-.75-.75h-3.5zm-4.5 0c-.4 0-.75.35-.75.75V3c0 .4.35.75.75.75h3.5c.4 0 .75-.35.75-.75V3c0-.4-.35-.75-.75-.75h-3.5zM21 9.75c0-.4-.35-.75-.75-.75H3.75c-.4 0-.75.35-.75.75v10.5c0 .4.35.75.75.75h16.5c.4 0 .75-.35.75-.75V9.75zM12 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6z' },
    { id: 'tools', label: 'Tool Finder', icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' },
    { id: 'quiz', label: 'Practice Quiz & Cards', badge: 'Exam Prep', badgeClass: 'quiz-badge', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
    { id: 'profile', label: 'Operative Profile', badge: 'Active', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
    { id: 'adhd', label: 'ADHD Focus Hub', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
    { id: 'about', label: 'About Developer', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z' }
];

export default function Sidebar() {
    const { activeTab, setActiveTab, setIsLogoutModalOpen, playChime } = useAuth();

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

                {/* Persistent Sidebar Deauthorize Button */}
                <div className="sidebar-footer-action" style={{ padding: '15px 12px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                        className="site-btn tool-btn text-danger"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}>
                            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Deauthorize Session
                    </button>
                </div>
            </nav>
        </aside>
    );
}
