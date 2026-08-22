import React, { useState } from 'react';
import { TOOLS_DATABASE, PDF_CHEAT_SHEETS, OSINT_TOOLS, CHANNELS_DATABASE } from '../../data/toolsData';
import { PRACTICE_PLATFORMS, STANDARDS_AND_CHEATSHEETS, CERTIFICATIONS_ROADMAP } from '../../data/resourcesData';
import { useAuth } from '../../context/AuthContext';

export default function ToolsDirectoryTab() {
    const { playChime } = useAuth();
    const [subTab, setSubTab] = useState('tools');
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('ALL');

    const filteredTools = TOOLS_DATABASE.filter(t => {
        const matchQ = t.name.toLowerCase().includes(search.toLowerCase()) || 
                       t.desc.toLowerCase().includes(search.toLowerCase()) ||
                       t.cat.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === 'ALL' || t.cat === selectedCat;
        return matchQ && matchCat;
    });

    const filteredPdfs = PDF_CHEAT_SHEETS.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase())
    );

    const filteredOsint = OSINT_TOOLS.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.desc.toLowerCase().includes(search.toLowerCase())
    );

    const filteredPlatforms = PRACTICE_PLATFORMS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase())
    );

    const filteredStandards = STANDARDS_AND_CHEATSHEETS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase()) ||
        s.cat.toLowerCase().includes(search.toLowerCase())
    );

    const toolCategories = ['ALL', 'Recon & Network', 'Web Pentest', 'Exploitation', 'Active Directory', 'Password & Crypto', 'Digital Forensics', 'SIEM & Blue Team'];

    return (
        <div className="tab-panel active">
            {/* Header Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(16, 185, 129, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">CYBER WEAPONRY & RESOURCE REPOSITORY</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Security Tools, GitHub Repos, Practice Portals & PDFs</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Comprehensive verified repository of pentest tools, GitHub sources, YouTube tutorials, practice wargames, standards, and 18 downloadable PDF field manuals.
                        </p>
                    </div>
                    <div className="ai-nav-chips">
                        <button className={'ai-nav-btn ' + (subTab === 'tools' ? 'active' : '')} onClick={() => { setSubTab('tools'); playChime(); }}>
                            🛠️ Security Tools ({TOOLS_DATABASE.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'platforms' ? 'active' : '')} onClick={() => { setSubTab('platforms'); playChime(); }}>
                            🎯 Practice Wargames ({PRACTICE_PLATFORMS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'standards' ? 'active' : '')} onClick={() => { setSubTab('standards'); playChime(); }}>
                            📜 Standards & Payloads ({STANDARDS_AND_CHEATSHEETS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'pdfs' ? 'active' : '')} onClick={() => { setSubTab('pdfs'); playChime(); }}>
                            📑 PDF Manuals ({PDF_CHEAT_SHEETS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'osint' ? 'active' : '')} onClick={() => { setSubTab('osint'); playChime(); }}>
                            🛰️ OSINT Suite ({OSINT_TOOLS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'channels' ? 'active' : '')} onClick={() => { setSubTab('channels'); playChime(); }}>
                            📺 YouTube Mentors ({CHANNELS_DATABASE.length})
                        </button>
                    </div>
                </div>

                {/* Search & Category Filter */}
                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tools, wargames, payloads, CVEs, or cheat sheets..."
                        style={{ maxWidth: '360px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {subTab === 'tools' && (
                        <div className="flex-gap-10 flex-wrap">
                            {toolCategories.slice(0, 5).map(c => (
                                <button
                                    key={c}
                                    className={'filter-chip ' + (selectedCat === c ? 'active' : '')}
                                    onClick={() => setSelectedCat(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* TAB 1: TOOLS DATABASE */}
            {subTab === 'tools' && (
                <div className="projects-dynamic-grid">
                    {filteredTools.map((t, idx) => (
                        <div key={idx} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num" style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                                    <span className="project-diff-badge diff-intermediate">{t.cat}</span>
                                </div>
                                <h3 className="project-card-title">{t.name}</h3>
                                <p className="project-card-desc">{t.desc}</p>
                                
                                {t.commands && (
                                    <div className="mb-15">
                                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.04em' }}>QUICK COMMAND:</span>
                                        <pre className="modal-code-box" style={{ padding: '8px 10px', fontSize: '0.78rem', margin: '4px 0 0 0' }}>
                                            <code>{t.commands}</code>
                                        </pre>
                                    </div>
                                )}
                            </div>

                            <div className="project-card-footer flex-wrap gap-8">
                                <div className="flex-gap-10 align-center flex-wrap">
                                    <a href={t.link} target="_blank" rel="noopener noreferrer" className="table-action-link" title="Visit Official Website">🌐 Portal</a>
                                    {t.github && (
                                        <a href={t.github} target="_blank" rel="noopener noreferrer" className="table-action-link" style={{ color: '#a855f7' }} title="View GitHub Repository">🐙 GitHub</a>
                                    )}
                                    {t.youtube && (
                                        <a href={t.youtube} target="_blank" rel="noopener noreferrer" className="table-action-link" style={{ color: '#f43f5e' }} title="Watch Video Tutorials on YouTube">▶ YouTube</a>
                                    )}
                                </div>
                                {t.pdf && (
                                    <a
                                        href={t.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="channel-badge"
                                        style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}
                                    >
                                        📄 Cheat Sheet
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 2: PRACTICE WARGAMES & LABS */}
            {subTab === 'platforms' && (
                <div className="projects-dynamic-grid">
                    {filteredPlatforms.map((p, idx) => (
                        <div key={idx} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num" style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                                    <span className="project-diff-badge diff-beginner">{p.badge}</span>
                                </div>
                                <h3 className="project-card-title">{p.name}</h3>
                                <span className="project-card-tag mb-8" style={{ display: 'inline-block' }}>{p.cat}</span>
                                <p className="project-card-desc">{p.desc}</p>
                            </div>
                            <div className="project-card-footer">
                                <a href={p.link} target="_blank" rel="noopener noreferrer" className="site-btn" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                                    🚀 Launch Lab Portal ↗
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 3: STANDARDS, PAYLOADS & FRAMEWORKS */}
            {subTab === 'standards' && (
                <div className="projects-dynamic-grid">
                    {filteredStandards.map((s, idx) => (
                        <div key={idx} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num" style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                                    <span className="project-diff-badge diff-advanced">{s.badge}</span>
                                </div>
                                <h3 className="project-card-title">{s.name}</h3>
                                <span className="project-card-tag mb-8" style={{ display: 'inline-block' }}>{s.cat}</span>
                                <p className="project-card-desc">{s.desc}</p>
                            </div>
                            <div className="project-card-footer">
                                <a href={s.link} target="_blank" rel="noopener noreferrer" className="table-action-link">
                                    Official Reference ↗
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 4: PDF FIELD MANUALS */}
            {subTab === 'pdfs' && (
                <div>
                    <div className="glass-card mb-20" style={{ background: 'rgba(6, 182, 212, 0.04)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
                        <div className="flex-space-between-center flex-wrap gap-10">
                            <div>
                                <h3 style={{ color: '#06b6d4' }}>📑 18 Curated Cybersecurity PDF Cheat Sheets</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                                    Offline field manuals with verified command line flags, protocol dissections, and memory forensics cheat sheets.
                                </p>
                            </div>
                            <span className="channel-badge" style={{ background: 'rgba(0, 255, 102, 0.15)', color: '#00ff66', borderColor: '#00ff66' }}>
                                ✓ 18/18 PDFs Ready
                            </span>
                        </div>
                    </div>

                    <div className="projects-dynamic-grid">
                        {filteredPdfs.map((p, idx) => (
                            <div key={idx} className="project-card" style={{ background: 'rgba(13, 20, 36, 0.75)' }}>
                                <div>
                                    <div className="project-card-header">
                                        <span className="project-card-num" style={{ color: '#f43f5e' }}>📄 PDF</span>
                                        <span className="channel-badge" style={{ fontSize: '0.72rem' }}>{p.size}</span>
                                    </div>
                                    <h3 className="project-card-title">{p.name}</h3>
                                    <span className="project-card-tag mb-8" style={{ display: 'inline-block' }}>{p.cat}</span>
                                    <p className="project-card-desc">{p.desc}</p>
                                </div>

                                <div className="project-card-footer">
                                    <a
                                        href={'/pdfs/' + p.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="site-btn tool-btn"
                                        style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                                    >
                                        👁️ View PDF
                                    </a>
                                    <a
                                        href={'/pdfs/' + p.file}
                                        download={p.file}
                                        className="site-btn"
                                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                                    >
                                        💾 Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 5: OSINT SUITE */}
            {subTab === 'osint' && (
                <div className="projects-dynamic-grid">
                    {filteredOsint.map((o, idx) => (
                        <div key={idx} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num" style={{ fontSize: '1.2rem' }}>{o.icon}</span>
                                    <span className="project-diff-badge diff-beginner">OSINT Recon</span>
                                </div>
                                <h3 className="project-card-title">{o.name}</h3>
                                <p className="project-card-desc">{o.desc}</p>
                            </div>

                            <div className="project-card-footer">
                                <div className="flex-gap-10 align-center flex-wrap">
                                    <a href={o.link} target="_blank" rel="noopener noreferrer" className="table-action-link">🌐 Portal</a>
                                    {o.github && (
                                        <a href={o.github} target="_blank" rel="noopener noreferrer" className="table-action-link" style={{ color: '#a855f7' }}>🐙 GitHub</a>
                                    )}
                                    {o.youtube && (
                                        <a href={o.youtube} target="_blank" rel="noopener noreferrer" className="table-action-link" style={{ color: '#f43f5e' }}>▶ YouTube</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 6: YOUTUBE CHANNELS */}
            {subTab === 'channels' && (
                <div className="projects-dynamic-grid">
                    {CHANNELS_DATABASE.map((ch, idx) => (
                        <div key={idx} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num" style={{ fontSize: '1.2rem' }}>{ch.icon}</span>
                                    <span className="project-diff-badge diff-advanced">{ch.badge}</span>
                                </div>
                                <h3 className="project-card-title">{ch.name}</h3>
                                <p className="project-card-desc">{ch.desc}</p>
                            </div>

                            <div className="project-card-footer">
                                <a
                                    href={ch.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="site-btn"
                                    style={{ background: '#e11d48', borderColor: '#f43f5e', color: '#fff', fontSize: '0.82rem', padding: '6px 12px' }}
                                >
                                    ▶ Subscribe on YouTube
                                </a>
                                {ch.github && (
                                    <a
                                        href={ch.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="table-action-link"
                                        style={{ color: '#a855f7' }}
                                    >
                                        🐙 GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
