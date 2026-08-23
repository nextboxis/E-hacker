import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsData } from '../../data/projectsData';

export default function ProjectsTab() {
    const { activeProfile, setActiveProjectModal, toggleProjectComplete, playChime } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('ALL');
    const [selectedDiff, setSelectedDiff] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const completed = activeProfile.completedProjects || [];

    const categories = [
        'ALL',
        'AI-Era Security (2025/26)',
        'Web Hacking',
        'Network Security',
        'Tool Development',
        'Malware & Defense',
        'OSINT & Forensics',
        'Active Directory & Cloud'
    ];
    const difficulties = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

    const getCategoryDisplay = (cat) => {
        switch (cat) {
            case 'ai-security': return 'AI-Era Security (2025/26)';
            case 'web-hacking': return 'Web Hacking';
            case 'network-security': return 'Network Security';
            case 'tool-development': return 'Tool Development';
            case 'malware-defense': return 'Malware & Defense';
            case 'osint-forensics':
            case 'forensics': return 'OSINT & Forensics';
            case 'ad-cloud': return 'Active Directory & Cloud';
            case 'reverse-engineering': return 'Reverse Engineering';
            default: return cat;
        }
    };

    const filtered = useMemo(() => {
        return projectsData.filter(p => {
            const isDone = completed.includes(p.id);
            const pTitle = p.title || '';
            const pDesc = p.description || p.desc || '';
            const pCat = getCategoryDisplay(p.category || p.cat || '');
            const pDiff = (p.difficulty || p.diff || 'Intermediate').toUpperCase();

            const matchSearch = pTitle.toLowerCase().includes(search.toLowerCase()) || 
                                pDesc.toLowerCase().includes(search.toLowerCase()) ||
                                String(p.id).includes(search) ||
                                (p.guide?.commands || '').toLowerCase().includes(search.toLowerCase());
            
            const matchCat = selectedCat === 'ALL' || pCat === selectedCat;
            const matchDiff = selectedDiff === 'ALL' || pDiff === selectedDiff.toUpperCase();
            const matchStatus = statusFilter === 'ALL' || 
                                (statusFilter === 'COMPLETED' && isDone) ||
                                (statusFilter === 'INCOMPLETE' && !isDone);
            return matchSearch && matchCat && matchDiff && matchStatus;
        });
    }, [search, selectedCat, selectedDiff, statusFilter, completed]);

    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginatedProjects = filtered.slice((page - 1) * pageSize, page * pageSize);

    const completionRate = Math.round((completed.length / projectsData.length) * 100);
    const earnedXp = completed.length * 50;

    return (
        <div className="tab-panel active">
            {/* Mission Stats Hero */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">{projectsData.length} HANDS-ON CYBERSECURITY LABS & AI BLUEPRINTS</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Security Project & Exploitation Hub</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Industry-standard attack vectors, exploitation syntax, AI defense engineering, and hands-on guidebooks mapped across {projectsData.length} real-world scenarios.
                        </p>
                    </div>

                    <div className="stat-card-group" style={{ margin: 0 }}>
                        <div className="stat-box" style={{ minWidth: '110px', padding: '10px 16px' }}>
                            <div className="stat-value" style={{ fontSize: '1.4rem', color: '#06b6d4' }}>{completed.length} / {projectsData.length}</div>
                            <div className="stat-lbl">Labs Done ({completionRate}%)</div>
                        </div>
                        <div className="stat-box" style={{ minWidth: '100px', padding: '10px 16px' }}>
                            <div className="stat-value" style={{ fontSize: '1.4rem', color: '#fbbf24' }}>+{earnedXp}</div>
                            <div className="stat-lbl">Earned Lab XP</div>
                        </div>
                    </div>
                </div>

                {/* Search & Multi-Filters */}
                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <div className="flex-gap-10 align-center flex-wrap" style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Filter by keyword, CVE, tool, or Lab #..."
                            style={{ maxWidth: '320px' }}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />

                        {/* Status Filter */}
                        <div className="flex-gap-10">
                            {['ALL', 'INCOMPLETE', 'COMPLETED'].map(st => (
                                <button
                                    key={st}
                                    className={'filter-chip ' + (statusFilter === st ? 'active' : '')}
                                    onClick={() => { setStatusFilter(st); setPage(1); }}
                                >
                                    {st === 'ALL' ? 'All Status' : st === 'INCOMPLETE' ? 'Pending' : 'Completed'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Dropdown */}
                    <div className="flex-gap-10 align-center">
                        <label className="tool-input-label" style={{ margin: 0 }}>Difficulty:</label>
                        <select
                            className="domain-select"
                            value={selectedDiff}
                            onChange={(e) => { setSelectedDiff(e.target.value); setPage(1); }}
                        >
                            {difficulties.map(d => (
                                <option key={d} value={d}>{d === 'ALL' ? 'All Difficulties' : d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex-gap-10 flex-wrap mt-15">
                    {categories.map(c => (
                        <button
                            key={c}
                            className={'filter-chip ' + (selectedCat === c ? 'active' : '')}
                            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                            onClick={() => { setSelectedCat(c); setPage(1); }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Counter & Pagination Controls */}
            <div className="flex-space-between-center mb-15 flex-wrap gap-10">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} Labs
                </span>
                
                {totalPages > 1 && (
                    <div className="flex-gap-10 align-center">
                        <button
                            className="site-btn tool-btn"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                            disabled={page === 1}
                            onClick={() => { setPage(p => Math.max(1, p - 1)); playChime(); }}
                        >
                            Previous
                        </button>
                        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#06b6d4' }}>
                            Page {page} / {totalPages}
                        </span>
                        <button
                            className="site-btn tool-btn"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                            disabled={page === totalPages}
                            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); playChime(); }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Projects Grid */}
            <div className="projects-dynamic-grid">
                {paginatedProjects.map(p => {
                    const isDone = completed.includes(p.id);
                    const pTitle = p.title || '';
                    const pDesc = p.description || p.desc || '';
                    const pCat = getCategoryDisplay(p.category || p.cat || '');
                    const pDiff = p.difficulty || p.diff || 'Intermediate';
                    const isAiProject = p.category === 'ai-security' || p.id >= 1000;

                    return (
                        <div
                            key={p.id}
                            className={'project-card ' + (isDone ? 'lab-completed-card ' : '') + (isAiProject ? 'ai-project-card' : '')}
                            style={{ cursor: 'pointer' }}
                            onClick={() => { setActiveProjectModal(p); playChime(); }}
                        >
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num">
                                        {isAiProject ? `AI-LAB #${p.id}` : `LAB #${p.id}`}
                                    </span>
                                    <span className={'project-diff-badge diff-' + pDiff.toLowerCase()}>{pDiff}</span>
                                </div>
                                <h3 className="project-card-title">{pTitle}</h3>
                                <div className="flex-gap-6 flex-wrap mb-8">
                                    <span className="project-card-tag" style={{ display: 'inline-block' }}>{pCat}</span>
                                    {isAiProject && (
                                        <span className="channel-badge" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.4)' }}>
                                            2025/26 AI Era
                                        </span>
                                    )}
                                </div>
                                <p className="project-card-desc">{pDesc.length > 120 ? pDesc.substring(0, 120) + '...' : pDesc}</p>
                            </div>

                            <div className="project-card-footer" onClick={(e) => e.stopPropagation()}>
                                <span className="project-xp-tag">+{p.xp || 50} XP</span>
                                <div className="flex-gap-10 align-center">
                                    <button
                                        className="table-action-link"
                                        onClick={() => { setActiveProjectModal(p); playChime(); }}
                                    >
                                        Inspect Guidebook
                                    </button>
                                    <label className="checkbox-container" title="Mark as Completed" style={{ margin: 0 }}>
                                        <input
                                            type="checkbox"
                                            checked={isDone}
                                            onChange={() => toggleProjectComplete(p.id)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Pagination */}
            {totalPages > 1 && (
                <div className="flex-space-between-center mt-25 flex-wrap gap-10">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Total Labs in Current Filter: {filtered.length}
                    </span>
                    <div className="flex-gap-10 align-center">
                        <button
                            className="site-btn tool-btn"
                            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                            disabled={page === 1}
                            onClick={() => { setPage(p => Math.max(1, p - 1)); playChime(); }}
                        >
                            Previous Page
                        </button>
                        <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#06b6d4' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="site-btn tool-btn"
                            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                            disabled={page === totalPages}
                            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); playChime(); }}
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
