import React, { useState } from 'react';
import {
    TOOLS_DATABASE,
    OSINT_TOOLS,
    AI_SECURITY_TOOLS,
    SCRIPTS_VAULT,
    PDF_CHEAT_SHEETS,
    CHANNELS_DATABASE
} from '../../data/toolsData';
import {
    PRACTICE_PLATFORMS,
    STANDARDS_AND_CHEATSHEETS,
    CERTIFICATIONS_ROADMAP,
    TOPIC_RESOURCES
} from '../../data/resourcesData';
import { useAuth } from '../../context/AuthContext';

export default function ToolsDirectoryTab() {
    const { playChime } = useAuth();
    const [subTab, setSubTab] = useState('tools'); // 'tools', 'osint', 'ai-tools', 'scripts', 'platforms', 'certs', 'pdfs'
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState('ALL');
    const [inspectedTool, setInspectedTool] = useState(null);
    const [inspectedPdf, setInspectedPdf] = useState(null);
    const [copiedScriptIndex, setCopiedScriptIndex] = useState(null);

    const filteredTools = TOOLS_DATABASE.filter(t => {
        const matchQ = t.name.toLowerCase().includes(search.toLowerCase()) || 
                       t.desc.toLowerCase().includes(search.toLowerCase()) ||
                       t.cat.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === 'ALL' || t.cat === selectedCat;
        return matchQ && matchCat;
    });

    const filteredOsint = OSINT_TOOLS.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.desc.toLowerCase().includes(search.toLowerCase()) ||
        (o.howItWorks || '').toLowerCase().includes(search.toLowerCase())
    );

    const filteredAiTools = AI_SECURITY_TOOLS.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.desc.toLowerCase().includes(search.toLowerCase()) ||
        (a.howItWorks || '').toLowerCase().includes(search.toLowerCase())
    );

    const filteredScripts = SCRIPTS_VAULT.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase()) ||
        s.lang.toLowerCase().includes(search.toLowerCase()) ||
        s.cat.toLowerCase().includes(search.toLowerCase())
    );

    const filteredPlatforms = PRACTICE_PLATFORMS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase())
    );

    const filteredCerts = CERTIFICATIONS_ROADMAP.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.provider.toLowerCase().includes(search.toLowerCase()) ||
        c.level.toLowerCase().includes(search.toLowerCase())
    );

    const filteredChannels = CHANNELS_DATABASE.filter(ch =>
        ch.name.toLowerCase().includes(search.toLowerCase()) ||
        ch.desc.toLowerCase().includes(search.toLowerCase()) ||
        ch.badge.toLowerCase().includes(search.toLowerCase())
    );

    const filteredStandards = STANDARDS_AND_CHEATSHEETS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.desc.toLowerCase().includes(search.toLowerCase()) ||
        s.cat.toLowerCase().includes(search.toLowerCase())
    );

    const filteredPdfs = PDF_CHEAT_SHEETS.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()) ||
        p.cat.toLowerCase().includes(search.toLowerCase())
    );

    const topicList = Object.entries(TOPIC_RESOURCES).map(([id, t]) => ({ id, ...t }));
    const filteredTopics = topicList.filter(tp =>
        tp.title.toLowerCase().includes(search.toLowerCase()) ||
        tp.summary.toLowerCase().includes(search.toLowerCase()) ||
        (tp.commandTip || '').toLowerCase().includes(search.toLowerCase()) ||
        (tp.stage || '').toLowerCase().includes(search.toLowerCase()) ||
        tp.track.toLowerCase().includes(search.toLowerCase())
    );

    const toolCategories = [
        'ALL',
        'Recon & Network',
        'Web Pentest',
        'Exploitation',
        'Active Directory',
        'Password & Crypto',
        'Digital Forensics',
        'SIEM & Blue Team',
        'Cloud & Containers',
        'Reverse Engineering'
    ];

    const handleCopyCode = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedScriptIndex(index);
        playChime();
        setTimeout(() => setCopiedScriptIndex(null), 2000);
    };

    return (
        <div className="tab-panel active">
            {/* Header Hub Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">CYBER WEAPONRY & OSINT INTELLIGENCE MATRIX</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Security Tools, OSINT Mechanics, AI Arsenal & Script Vault</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Exhaustive technical library with {TOOLS_DATABASE.length} verified tools, {OSINT_TOOLS.length} OSINT engines, {AI_SECURITY_TOOLS.length} AI-era weapons, {SCRIPTS_VAULT.length} copy-ready scripts, {PRACTICE_PLATFORMS.length} wargames, {CERTIFICATIONS_ROADMAP.length} certifications, and {CHANNELS_DATABASE.length} YouTube mentors.
                        </p>
                    </div>

                    {/* Sub-Navigation Chips */}
                    <div className="ai-nav-chips">
                        <button className={'ai-nav-btn ' + (subTab === 'tools' ? 'active' : '')} onClick={() => { setSubTab('tools'); playChime(); }}>
                            Security Tools ({TOOLS_DATABASE.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'osint' ? 'active' : '')} onClick={() => { setSubTab('osint'); playChime(); }}>
                            OSINT Mechanics ({OSINT_TOOLS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'ai-tools' ? 'active' : '')} onClick={() => { setSubTab('ai-tools'); playChime(); }}>
                            AI-Era Cyber ({AI_SECURITY_TOOLS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'scripts' ? 'active' : '')} onClick={() => { setSubTab('scripts'); playChime(); }}>
                            Script Vault ({SCRIPTS_VAULT.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'platforms' ? 'active' : '')} onClick={() => { setSubTab('platforms'); playChime(); }}>
                            Wargames ({PRACTICE_PLATFORMS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'topics' ? 'active' : '')} onClick={() => { setSubTab('topics'); playChime(); }}>
                            Topic Guides ({Object.keys(TOPIC_RESOURCES).length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'standards' ? 'active' : '')} onClick={() => { setSubTab('standards'); playChime(); }}>
                            Standards ({STANDARDS_AND_CHEATSHEETS.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'certs' ? 'active' : '')} onClick={() => { setSubTab('certs'); playChime(); }}>
                            Certifications ({CERTIFICATIONS_ROADMAP.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'channels' ? 'active' : '')} onClick={() => { setSubTab('channels'); playChime(); }}>
                            YouTube ({CHANNELS_DATABASE.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'pdfs' ? 'active' : '')} onClick={() => { setSubTab('pdfs'); playChime(); }}>
                            PDFs ({PDF_CHEAT_SHEETS.length})
                        </button>
                    </div>
                </div>

                {/* Search Bar & Category Filters */}
                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tools, OSINT engines, scripts, CVEs, or wargames..."
                        style={{ maxWidth: '380px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {subTab === 'tools' && (
                        <div className="flex-gap-10 flex-wrap">
                            {toolCategories.map(c => (
                                <button
                                    key={c}
                                    className={'filter-chip ' + (selectedCat === c ? 'active' : '')}
                                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                    onClick={() => setSelectedCat(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 1. Core Security Tools SubTab */}
            {subTab === 'tools' && (
                <div className="tools-directory-grid">
                    {filteredTools.map((t, i) => (
                        <div key={i} className="glass-card tool-dir-card">
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag">{t.cat}</span>
                                <span className="operative-clearance-tag">{t.icon || 'TOOL'}</span>
                            </div>
                            <h3 className="tool-dir-name">{t.name}</h3>
                            <p className="tool-dir-desc">{t.desc}</p>
                            
                            {t.howItWorks && (
                                <div className="tool-mechanics-preview mt-10">
                                    <span className="tool-mechanics-label">HOW IT WORKS UNDER THE HOOD:</span>
                                    <p className="tool-mechanics-text">{t.howItWorks.substring(0, 130)}...</p>
                                </div>
                            )}

                            {t.commands && (
                                <div className="tool-dir-cmd-box mt-10">
                                    <code>{t.commands}</code>
                                </div>
                            )}

                            <div className="tool-dir-links-row mt-15">
                                <button
                                    className="site-btn tool-btn"
                                    onClick={() => { setInspectedTool(t); playChime(); }}
                                >
                                    Deep Inspector
                                </button>
                                <a href={t.github} target="_blank" rel="noreferrer" className="table-action-link">GitHub</a>
                                <a href={t.youtube} target="_blank" rel="noreferrer" className="table-action-link">Tutorial</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. OSINT Tools & Mechanics SubTab */}
            {subTab === 'osint' && (
                <div className="tools-directory-grid">
                    {filteredOsint.map((o, i) => (
                        <div key={i} className="glass-card tool-dir-card" style={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>OSINT ENGINE</span>
                                <span className="operative-clearance-tag">{o.icon || 'RECON'}</span>
                            </div>
                            <h3 className="tool-dir-name">{o.name}</h3>
                            <p className="tool-dir-desc">{o.desc}</p>

                            <div className="tool-mechanics-box mt-12">
                                <div className="tool-mechanics-header">
                                    <span className="deauth-pulse-dot" style={{ background: '#06b6d4' }}></span>
                                    <span>UNDER-THE-HOOD PROTOCOL MECHANICS</span>
                                </div>
                                <p className="tool-mechanics-full">{o.howItWorks}</p>
                            </div>

                            {o.commands && (
                                <div className="tool-dir-cmd-box mt-12">
                                    <div className="flex-space-between-center mb-4">
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>EXECUTION SYNTAX:</span>
                                        <button
                                            className="table-action-link"
                                            onClick={() => handleCopyCode(o.commands, `osint-${i}`)}
                                        >
                                            {copiedScriptIndex === `osint-${i}` ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.78rem' }}>
                                        <code>{o.commands}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="tool-dir-links-row mt-15">
                                <a href={o.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Launch Portal</a>
                                <a href={o.github} target="_blank" rel="noreferrer" className="table-action-link">GitHub Source</a>
                                <a href={o.youtube} target="_blank" rel="noreferrer" className="table-action-link">Video Guide</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 3. AI-Era Cybersecurity Tools SubTab */}
            {subTab === 'ai-tools' && (
                <div className="tools-directory-grid">
                    {filteredAiTools.map((ai, i) => (
                        <div key={i} className="glass-card tool-dir-card" style={{ borderColor: 'rgba(124, 58, 237, 0.4)', background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(20, 21, 26, 0.8) 100%)' }}>
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd' }}>AI RED TEAMING / SIEM</span>
                                <span className="channel-badge" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa' }}>2025/26 ERA</span>
                            </div>
                            <h3 className="tool-dir-name">{ai.name}</h3>
                            <p className="tool-dir-desc">{ai.desc}</p>

                            <div className="tool-mechanics-box mt-12">
                                <div className="tool-mechanics-header">
                                    <span className="deauth-pulse-dot" style={{ background: '#a78bfa' }}></span>
                                    <span>AI SAFETY & ADVERSARIAL MECHANICS</span>
                                </div>
                                <p className="tool-mechanics-full">{ai.howItWorks}</p>
                            </div>

                            {ai.commands && (
                                <div className="tool-dir-cmd-box mt-12">
                                    <div className="flex-space-between-center mb-4">
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>CLI RUNNER:</span>
                                        <button
                                            className="table-action-link"
                                            onClick={() => handleCopyCode(ai.commands, `ai-${i}`)}
                                        >
                                            {copiedScriptIndex === `ai-${i}` ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.78rem' }}>
                                        <code>{ai.commands}</code>
                                    </pre>
                                </div>
                            )}

                            <div className="tool-dir-links-row mt-15">
                                <a href={ai.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Official Page</a>
                                <a href={ai.github} target="_blank" rel="noreferrer" className="table-action-link">GitHub Source</a>
                                <a href={ai.youtube} target="_blank" rel="noreferrer" className="table-action-link">Tutorial</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. Script & Automation Vault SubTab */}
            {subTab === 'scripts' && (
                <div className="overview-grid">
                    {filteredScripts.map((s, i) => (
                        <div key={i} className="glass-card" style={{ gridColumn: 'span 2' }}>
                            <div className="flex-space-between-center flex-wrap gap-10 mb-10">
                                <div>
                                    <span className="projects-badge-tag">{s.cat}</span>
                                    <h3 style={{ margin: '6px 0 2px' }}>{s.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Language: {s.lang}</span>
                                </div>
                                <button
                                    className="site-btn tool-btn"
                                    onClick={() => handleCopyCode(s.code, `script-${i}`)}
                                >
                                    {copiedScriptIndex === `script-${i}` ? 'Copied to Clipboard!' : 'Copy Script'}
                                </button>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>{s.desc}</p>
                            <div className="code-editor-wrapper" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: '#38bdf8' }}>
                                    <code>{s.code}</code>
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 5. Practice Wargames SubTab */}
            {subTab === 'platforms' && (
                <div className="tools-directory-grid">
                    {filteredPlatforms.map((p, i) => (
                        <div key={i} className="glass-card tool-dir-card">
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag">{p.cat}</span>
                                <span className="operative-clearance-tag">{p.badge || 'LAB'}</span>
                            </div>
                            <h3 className="tool-dir-name">{p.name}</h3>
                            <p className="tool-dir-desc">{p.desc}</p>
                            <div className="tool-dir-links-row mt-15">
                                <a href={p.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Access Wargame</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 6. Standards, Payloads & Cheatsheets SubTab */}
            {subTab === 'standards' && (
                <div className="tools-directory-grid">
                    {filteredStandards.map((s, i) => (
                        <div key={i} className="glass-card tool-dir-card">
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag">{s.cat}</span>
                                <span className="operative-clearance-tag">{s.badge}</span>
                            </div>
                            <h3 className="tool-dir-name">{s.name}</h3>
                            <p className="tool-dir-desc">{s.desc}</p>
                            <div className="tool-dir-links-row mt-15">
                                <a href={s.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Open Resource</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 7. Certifications Roadmap SubTab */}
            {subTab === 'certs' && (
                <div className="tools-directory-grid">
                    {filteredCerts.map((c, i) => (
                        <div key={i} className="glass-card tool-dir-card">
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag">{c.level}</span>
                                <span className="channel-badge">{c.provider}</span>
                            </div>
                            <h3 className="tool-dir-name">{c.name}</h3>
                            <p className="tool-dir-desc">{c.desc}</p>
                            <div className="tool-dir-links-row mt-15">
                                <a href={c.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Certification Guide</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 8. YouTube Security Mentors SubTab */}
            {subTab === 'channels' && (
                <div className="tools-directory-grid">
                    {filteredChannels.map((ch, i) => (
                        <div key={i} className="glass-card tool-dir-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>YOUTUBE MENTOR</span>
                                <span className="channel-badge">{ch.badge}</span>
                            </div>
                            <h3 className="tool-dir-name">{ch.name}</h3>
                            <p className="tool-dir-desc">{ch.desc}</p>
                            <div className="tool-dir-links-row mt-15">
                                <a href={ch.link} target="_blank" rel="noreferrer" className="site-btn tool-btn">Watch Channel</a>
                                <a href={ch.github} target="_blank" rel="noreferrer" className="table-action-link">GitHub / Site</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 9. PDF Field Manuals SubTab */}
            {subTab === 'pdfs' && (
                <div className="tools-directory-grid">
                    {filteredPdfs.map((pdf, i) => (
                        <div key={i} className="glass-card tool-dir-card" style={{ borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                            <div className="flex-space-between-center mb-8">
                                <span className="projects-badge-tag">{pdf.cat}</span>
                                <span className="operative-clearance-tag">{pdf.size}</span>
                            </div>
                            <h3 className="tool-dir-name">{pdf.name}</h3>
                            <p className="tool-dir-desc">{pdf.desc}</p>
                            <div className="tool-dir-links-row mt-15">
                                <button
                                    className="site-btn tool-btn"
                                    onClick={() => { setInspectedPdf(pdf); playChime(); }}
                                >
                                    View Field Manual
                                </button>
                                <a
                                    href={pdf.url || (pdf.file ? `/pdfs/${pdf.file}` : '#')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="table-action-link"
                                >
                                    Official Source
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 10. Topic Knowledge & Roadmap Curriculum Guides SubTab */}
            {subTab === 'topics' && (
                <div className="tools-directory-grid">
                    {filteredTopics.map((topic, i) => (
                        <div key={i} className="glass-card tool-dir-card" style={{ borderColor: 'rgba(56, 189, 248, 0.25)' }}>
                            <div className="flex-space-between-center mb-8">
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    <span className="channel-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                                        {topic.stage}
                                    </span>
                                    <span className="projects-badge-tag" style={{ textTransform: 'uppercase' }}>
                                        {topic.track}
                                    </span>
                                </div>
                                <span className="operative-clearance-tag" style={{ color: '#22c55e' }}>
                                    {topic.resources?.length || 0} LINKS
                                </span>
                            </div>
                            <h3 className="tool-dir-name">{topic.title}</h3>
                            <p className="tool-dir-desc">{topic.summary}</p>

                            {topic.commandTip && (
                                <div className="tool-dir-cmd-box mt-10">
                                    <div className="flex-space-between-center mb-4">
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>QUICK CLI SYNTAX:</span>
                                        <button
                                            className="table-action-link"
                                            onClick={() => handleCopyCode(topic.commandTip, `top_${i}`)}
                                        >
                                            {copiedScriptIndex === `top_${i}` ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <code>{topic.commandTip}</code>
                                </div>
                            )}

                            <div className="tool-dir-links-row mt-15 flex-wrap gap-6">
                                {topic.docs && (
                                    <a href={topic.docs} target="_blank" rel="noreferrer" className="site-btn tool-btn" style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                                        Documentation ↗
                                    </a>
                                )}
                                {topic.cheatsheet && (
                                    <a href={topic.cheatsheet} target="_blank" rel="noreferrer" className="site-btn tool-btn secondary-btn" style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                                        Cheatsheet ⚡
                                    </a>
                                )}
                                {topic.lab && (
                                    <a href={topic.lab} target="_blank" rel="noreferrer" className="table-action-link" style={{ padding: '5px 8px', fontSize: '0.78rem' }}>
                                        Practice Lab 🧪
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* In-Browser PDF Field Manual Reader Modal */}
            {inspectedPdf && (
                <div className="modal-overlay active" onClick={() => setInspectedPdf(null)}>
                    <div className="dialog-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <div className="flex-gap-8 align-center mb-4">
                                    <span className="projects-badge-tag">{inspectedPdf.cat}</span>
                                    <span className="operative-clearance-tag">{inspectedPdf.size}</span>
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{inspectedPdf.name}</h2>
                            </div>
                            <button className="modal-close-btn" onClick={() => setInspectedPdf(null)}>×</button>
                        </div>
                        <div className="modal-body mt-15">
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                                {inspectedPdf.desc}
                            </p>

                            {inspectedPdf.commands && (
                                <div className="mt-15">
                                    <div className="flex-space-between-center mb-6">
                                        <label className="tool-input-label" style={{ margin: 0 }}>CORE SYNTAX & COMMAND WORKFLOW:</label>
                                        <button
                                            className="table-action-link"
                                            onClick={() => handleCopyCode(inspectedPdf.commands, 'pdf_cmd')}
                                        >
                                            {copiedScriptIndex === 'pdf_cmd' ? 'Copied!' : 'Copy Syntax'}
                                        </button>
                                    </div>
                                    <div className="tool-dir-cmd-box" style={{ whiteSpace: 'pre-wrap' }}>
                                        <code>{inspectedPdf.commands}</code>
                                    </div>
                                </div>
                            )}

                            <div className="project-mitigation-box mt-15" style={{ fontSize: '0.82rem' }}>
                                <strong>Cyber Standard Note:</strong> This 2026 technical manual aligns with FIRST, MITRE ATT&CK, and NIST Cybersecurity Framework v2.0 guidelines.
                            </div>

                            <div className="flex-gap-10 mt-20 flex-wrap">
                                {inspectedPdf.file && (
                                    <a
                                        href={`/pdfs/${inspectedPdf.file}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="site-btn tool-btn"
                                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
                                    >
                                        📄 Open Bundled PDF ({inspectedPdf.file})
                                    </a>
                                )}
                                <a
                                    href={inspectedPdf.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-btn tool-btn secondary-btn"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    Online Reference ↗
                                </a>
                                <button
                                    className="site-btn tool-btn secondary-btn"
                                    onClick={() => setInspectedPdf(null)}
                                >
                                    Close Manual
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Deep Tool Inspector Modal */}
            {inspectedTool && (
                <div className="modal-overlay active" onClick={() => setInspectedTool(null)}>
                    <div className="dialog-modal-box" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="projects-badge-tag">{inspectedTool.cat}</span>
                                <h2 style={{ margin: '6px 0 0 0' }}>{inspectedTool.name}</h2>
                            </div>
                            <button className="modal-close-btn" onClick={() => setInspectedTool(null)}>✕</button>
                        </div>
                        <div className="modal-body mt-15">
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{inspectedTool.desc}</p>

                            {inspectedTool.howItWorks && (
                                <div className="tool-mechanics-box mt-15">
                                    <div className="tool-mechanics-header">
                                        <span className="deauth-pulse-dot"></span>
                                        <span>HOW IT WORKS UNDER THE HOOD:</span>
                                    </div>
                                    <p className="tool-mechanics-full">{inspectedTool.howItWorks}</p>
                                </div>
                            )}

                            {inspectedTool.commands && (
                                <div className="mt-15">
                                    <div className="flex-space-between-center mb-6">
                                        <label className="tool-input-label" style={{ margin: 0 }}>DEFAULT CLI SYNTAX:</label>
                                        <button
                                            className="table-action-link"
                                            onClick={() => handleCopyCode(inspectedTool.commands, 'tool_cmd')}
                                        >
                                            {copiedScriptIndex === 'tool_cmd' ? 'Copied!' : 'Copy Syntax'}
                                        </button>
                                    </div>
                                    <div className="tool-dir-cmd-box" style={{ whiteSpace: 'pre-wrap' }}>
                                        <code>{inspectedTool.commands}</code>
                                    </div>
                                </div>
                            )}

                            <div className="flex-gap-10 mt-20 flex-wrap">
                                <a
                                    href={inspectedTool.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-btn tool-btn"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    Official Website ↗
                                </a>
                                <a
                                    href={inspectedTool.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-btn tool-btn secondary-btn"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    GitHub Repo
                                </a>
                                <a
                                    href={inspectedTool.youtube}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-btn tool-btn secondary-btn"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    Video Tutorials
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
