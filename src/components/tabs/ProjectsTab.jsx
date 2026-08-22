import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsData } from '../../data/projectsData';

export default function ProjectsTab() {
    const { activeProfile, setActiveProjectModal, toggleProjectComplete, playChime } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('ALL');
    const [selectedDiff, setSelectedDiff] = useState('ALL');

    const completed = activeProfile.completedProjects || [];

    const categories = ['ALL', 'Web Hacking', 'Network Security', 'Tool Development', 'Malware & Defense', 'OSINT & Forensics', 'Active Directory & Cloud'];
    const difficulties = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

    const filtered = projectsData.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === 'ALL' || p.cat === selectedCat;
        const matchDiff = selectedDiff === 'ALL' || p.diff === selectedDiff;
        return matchSearch && matchCat && matchDiff;
    });

    return (
        <div className="tab-panel active">
            {/* Hero Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">100 HANDS-ON CYBERSECURITY LABS</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Cybersecurity Project Hub</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>100 curated hands-on labs with verified execution commands, prerequisites, and defensive mitigations.</p>
                    </div>
                    <div className="topbar-gamification-hud" style={{ background: 'rgba(6, 182, 212, 0.1)', borderColor: '#06b6d4' }}>
                        <div className="topbar-level-badge" style={{ background: '#06b6d4', color: '#000' }}>{completed.length}</div>
                        <div className="topbar-hud-details">
                            <div className="topbar-rank-title" style={{ color: '#06b6d4' }}>Completed Labs</div>
                            <div className="topbar-xp-track">
                                <div className="topbar-xp-fill" style={{ width: `${completed.length}%`, background: '#06b6d4' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search 100 labs by keyword..."
                        style={{ maxWidth: '320px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex-gap-10 flex-wrap">
                        {categories.slice(0, 4).map(c => (
                            <button
                                key={c}
                                className={`filter-chip ${selectedCat === c ? 'active' : ''}`}
                                onClick={() => setSelectedCat(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="projects-dynamic-grid">
                {filtered.map(p => {
                    const isDone = completed.includes(p.id);
                    return (
                        <div key={p.id} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num">LAB #{p.id}</span>
                                    <span className={`project-diff-badge diff-${p.diff.toLowerCase()}`}>{p.diff}</span>
                                </div>
                                <h3 className="project-card-title">{p.title}</h3>
                                <p className="project-card-desc">{p.desc.length > 110 ? p.desc.substring(0, 110) + '...' : p.desc}</p>
                            </div>

                            <div className="project-card-footer">
                                <span className="project-xp-tag">+{p.xp} XP</span>
                                <div className="flex-gap-10 align-center">
                                    <button
                                        className="table-action-link"
                                        onClick={() => { setActiveProjectModal(p); playChime(); }}
                                    >
                                        View Lab →
                                    </button>
                                    <input
                                        type="checkbox"
                                        checked={isDone}
                                        onChange={() => toggleProjectComplete(p.id)}
                                        title="Toggle Lab Completion"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
