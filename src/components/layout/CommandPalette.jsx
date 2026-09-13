import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsData } from '../../data/projectsData';
import { TOOLS_DATABASE } from '../../data/toolsData';

export default function CommandPalette() {
    const { isSpotlightOpen, setIsSpotlightOpen, setActiveTab, setActiveProjectModal, playChime } = useAuth();
    const [query, setQuery] = useState('');

    if (!isSpotlightOpen) return null;

    const filteredProjects = projectsData.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.cat.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const filteredTools = TOOLS_DATABASE.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.cat.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);

    return (
        <div className="spotlight-overlay" onClick={() => setIsSpotlightOpen(false)}>
            <div className="spotlight-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="spotlight-search-header">
                    <svg viewBox="0 0 24 24" className="spotlight-icon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z"/></svg>
                    <input
                        type="text"
                        className="spotlight-input"
                        placeholder="Search 118 labs, toolkit utilities, tools, CVEs, or commands..."
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="spotlight-close-kbd" onClick={() => setIsSpotlightOpen(false)}>ESC</kbd>
                </div>

                <div className="spotlight-results-container">
                    <div className="spotlight-group-label">CYBERSECURITY LABS & PROJECTS</div>
                    {filteredProjects.map(p => (
                        <div
                            key={p.id}
                            className="spotlight-item"
                            onClick={() => {
                                setIsSpotlightOpen(false);
                                setActiveProjectModal(p);
                                playChime();
                            }}
                        >
                            <span className="spotlight-item-badge">LAB #{p.id}</span>
                            <div className="spotlight-item-info">
                                <span className="spotlight-item-title">{p.title}</span>
                                <span className="spotlight-item-desc">{p.cat} • {p.diff} • +{p.xp} XP</span>
                            </div>
                        </div>
                    ))}

                    <div className="spotlight-group-label mt-10">PENTEST TOOLS</div>
                    {filteredTools.map((t, idx) => (
                        <div
                            key={idx}
                            className="spotlight-item"
                            onClick={() => {
                                setIsSpotlightOpen(false);
                                setActiveTab('tools');
                                playChime();
                            }}
                        >
                            <span className="spotlight-item-badge">{t.cat || 'TOOL'}</span>
                            <div className="spotlight-item-info">
                                <span className="spotlight-item-title">{t.name}</span>
                                <span className="spotlight-item-desc">{t.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
