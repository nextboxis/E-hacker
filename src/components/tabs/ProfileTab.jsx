import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { exportDossier, importDossier } from '../../utils/dossierBackup';

export default function ProfileTab() {
    const {
        activeProfile,
        allProfiles,
        switchProfile,
        createProfile,
        updateActiveProfile,
        deleteProfile,
        logout,
        playChime
    } = useAuth();

    const [profTab, setProfTab] = useState('dossier');
    const [editCallsign, setEditCallsign] = useState(activeProfile.callsign);
    const [editBio, setEditBio] = useState(activeProfile.bio || '');
    const [editClearance, setEditClearance] = useState(activeProfile.clearance);
    const [editDomain, setEditDomain] = useState(activeProfile.domain);
    const [editAvatar, setEditAvatar] = useState(activeProfile.avatar || '01');
    const [backupStatus, setBackupStatus] = useState('');
    const fileInputRef = useRef(null);

    const completedLabs = (activeProfile.completedProjects || []).length;

    const handleSave = (e) => {
        e.preventDefault();
        updateActiveProfile({
            callsign: editCallsign,
            bio: editBio,
            clearance: editClearance,
            domain: editDomain,
            avatar: editAvatar
        });
        alert('Operative dossier updated successfully!');
    };

    const handleExportBackup = () => {
        exportDossier(allProfiles, activeProfile);
        playChime();
        setBackupStatus('[OK] Encrypted .EHK backup exported successfully.');
        setTimeout(() => setBackupStatus(''), 4000);
    };

    const handleImportFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        importDossier(
            file,
            (data) => {
                playChime();
                setBackupStatus('[OK] Backup verified & imported! Reloading session state...');
                setTimeout(() => window.location.reload(), 1200);
            },
            (errMsg) => {
                setBackupStatus(`[ERR] Error: ${errMsg}`);
            }
        );
    };

    return (
        <div className="tab-panel active">
            {/* Hero Dossier Card */}
            <div className="glass-card operative-dossier-hero mb-25">
                <div className="dossier-watermark">TOP SECRET // NOFORN</div>
                <div className="dossier-hero-layout">
                    <div className="dossier-avatar-col">
                        <div className="dossier-avatar-box" style={{ fontFamily: 'monospace', fontWeight: 700, overflow: 'hidden' }}>
                            {activeProfile.githubAvatar ? (
                                <img src={activeProfile.githubAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                activeProfile.avatar || '01'
                            )}
                        </div>
                        <div className="dossier-level-pill">LEVEL {activeProfile.level || 1}</div>
                    </div>

                    <div className="dossier-info-col">
                        <div className="flex-space-between-center flex-wrap gap-10">
                            <div>
                                <div className="projects-badge-tag">{(activeProfile.domain || 'full').toUpperCase()} TRACK</div>
                                <h2 className="dossier-callsign">{activeProfile.callsign}</h2>
                                <p className="dossier-motto">"{activeProfile.bio || 'Knowledge is free. Security is an illusion.'}"</p>
                            </div>
                            <div className="dossier-actions-group">
                                <button className="site-btn tool-btn" onClick={() => setProfTab('profiles')}>Switch Profile</button>
                                <button className="site-btn tool-btn secondary-btn" onClick={() => setProfTab('edit')}>Edit Details</button>
                                <button className="site-btn tool-btn text-danger" onClick={logout}>Sign Out</button>
                            </div>
                        </div>

                        <div className="dossier-metrics-grid mt-15">
                            <div className="dossier-metric-item">
                                <span className="dossier-metric-label">SECURITY CLEARANCE:</span>
                                <strong className="dossier-metric-val">{activeProfile.clearance}</strong>
                            </div>
                            <div className="dossier-metric-item">
                                <span className="dossier-metric-label">OPERATIVE ID:</span>
                                <strong className="dossier-metric-val">OP-{activeProfile.id.substring(5).toUpperCase()}-X</strong>
                            </div>
                            <div className="dossier-metric-item">
                                <span className="dossier-metric-label">COMPLETED LABS:</span>
                                <strong className="dossier-metric-val">{completedLabs} / 100 Labs</strong>
                            </div>
                            <div className="dossier-metric-item">
                                <span className="dossier-metric-label">TOTAL XP:</span>
                                <strong className="dossier-metric-val">{activeProfile.xp || 0} XP</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ai-nav-chips mt-20">
                    <button className={`profile-nav-btn ${profTab === 'dossier' ? 'active' : ''}`} onClick={() => { setProfTab('dossier'); playChime(); }}>Operative Dossier</button>
                    <button className={`profile-nav-btn ${profTab === 'profiles' ? 'active' : ''}`} onClick={() => { setProfTab('profiles'); playChime(); }}>Multi-Profile Manager</button>
                    <button className={`profile-nav-btn ${profTab === 'edit' ? 'active' : ''}`} onClick={() => { setProfTab('edit'); playChime(); }}>Edit Identity</button>
                    <button className={`profile-nav-btn ${profTab === 'backup' ? 'active' : ''}`} onClick={() => { setProfTab('backup'); playChime(); }}>Encrypted Backup & Portability</button>
                    <button className={`profile-nav-btn ${profTab === 'about' ? 'active' : ''}`} onClick={() => { setProfTab('about'); playChime(); }}>About & Architecture</button>
                </div>
            </div>

            {profTab === 'dossier' && (
                <div className="overview-grid">
                    <div className="glass-card">
                        <h3 className="tool-section-title">Cyber Operational Readiness</h3>
                        <div className="dossier-readiness-box mt-15">
                            <div className="flex-space-between-center mb-8">
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>MISSION PROGRESSION:</span>
                                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--color-accent)' }}>{completedLabs}%</span>
                            </div>
                            <div className="deauth-progress-bar">
                                <div className="deauth-progress-fill" style={{ width: `${completedLabs}%` }}></div>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                                Progress is tracked client-side with zero telemetry leakage. Complete roadmap modules and hands-on projects to unlock higher clearance ranks.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="tool-section-title">Cryptographic Identity Token</h3>
                        <div className="dossier-apikey-box mt-15">
                            <label className="tool-input-label">ASSIGNED API CREDENTIAL:</label>
                            <div className="dossier-apikey-display">
                                <code>{activeProfile.apiKey || 'ehk_live_sec_root9482x'}</code>
                                <button className="site-btn tool-btn" onClick={() => { navigator.clipboard.writeText(activeProfile.apiKey || ''); alert('API Key copied to clipboard!'); }}>Copy</button>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontFamily: 'monospace', display: 'block', marginTop: '6px' }}>
                                Valid for Target Database API queries & Sandbox terminal executions.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {profTab === 'profiles' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-20">
                        <h3 className="tool-section-title">Multi-Operative Profiles</h3>
                        <button className="site-btn" onClick={() => {
                            const newCallsign = prompt("Enter new operative callsign / GitHub handle:");
                            if (newCallsign) createProfile({ callsign: newCallsign });
                        }}>+ Provision New Callsign</button>
                    </div>

                    <div className="profiles-grid">
                        {allProfiles.map(p => {
                            const isActive = p.id === activeProfile.id;
                            return (
                                <div key={p.id} className={`profile-card ${isActive ? 'active-profile' : ''}`}>
                                    <div>
                                        <div className="profile-card-header">
                                            <div className="profile-card-avatar" style={{ fontFamily: 'monospace', fontWeight: 700, overflow: 'hidden' }}>
                                                {p.githubAvatar ? (
                                                    <img src={p.githubAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    p.avatar || '01'
                                                )}
                                            </div>
                                            <div>
                                                <div className="profile-card-title">{p.callsign}</div>
                                                <span className="operative-clearance-tag">{p.clearance}</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{p.bio || 'Security Operative'}</p>
                                        <div style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--color-accent)' }}>
                                            XP: {p.xp || 0} | Level: {p.level || 1} | Labs: {(p.completedProjects || []).length}/100
                                        </div>
                                    </div>
                                    <div className="profile-card-footer">
                                        {isActive ? (
                                            <span className="channel-badge" style={{ background: 'rgba(0, 255, 102, 0.2)', color: 'var(--color-accent)' }}>ACTIVE PROFILE</span>
                                        ) : (
                                            <button className="table-action-link" onClick={() => switchProfile(p.id)}>Activate</button>
                                        )}
                                        {allProfiles.length > 1 && !isActive && (
                                            <button className="table-action-link text-danger" onClick={() => deleteProfile(p.id)}>Delete</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {profTab === 'edit' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Edit Operative Identity & Credentials</h3>
                    <form onSubmit={handleSave} className="mt-15">
                        <div className="overview-grid">
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Operative Callsign / Handle:</label>
                                <input type="text" className="search-input" value={editCallsign} onChange={(e) => setEditCallsign(e.target.value)} required />
                            </div>
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Security Clearance Level:</label>
                                <select className="domain-select" style={{ width: '100%' }} value={editClearance} onChange={(e) => setEditClearance(e.target.value)}>
                                    <option value="Level 1 • UNCLASSIFIED">Level 1 • UNCLASSIFIED</option>
                                    <option value="Level 2 • RESTRICTED">Level 2 • RESTRICTED</option>
                                    <option value="Level 3 • CONFIDENTIAL">Level 3 • CONFIDENTIAL</option>
                                    <option value="Level 4 • SECRET">Level 4 • SECRET</option>
                                    <option value="Level 5 • TOP SECRET">Level 5 • TOP SECRET // NOFORN</option>
                                </select>
                            </div>
                        </div>

                        <div className="tool-input-group mb-15">
                            <label className="tool-input-label">Operative Motto / Bio:</label>
                            <input type="text" className="search-input" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
                        </div>

                        <div className="tool-input-group mb-20">
                            <label className="tool-input-label">Choose Avatar Identifier:</label>
                            <div className="avatar-select-grid">
                                {['01', '02', '03', '04', '05', '06', '07', '08'].map(av => (
                                    <span
                                        key={av}
                                        className={`avatar-opt ${editAvatar === av ? 'active' : ''}`}
                                        onClick={() => setEditAvatar(av)}
                                        style={{ fontFamily: 'monospace', fontWeight: 600 }}
                                    >
                                        {av}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="site-btn">Save Operative Changes</button>
                    </form>
                </div>
            )}

            {profTab === 'backup' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Local-First Dossier Backup & Migration</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                        Export your complete operative career dossier, completed hands-on labs, earned XP, custom profiles, and field notes into a local-first encrypted <code>.ehk.json</code> archive.
                    </p>

                    <div className="overview-grid mt-20">
                        <div className="dossier-backup-card">
                            <h4>Export Active Workstation Dossier</h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '8px 0 16px' }}>
                                Generates a portable backup package containing all {allProfiles.length} operative identities and lab progression.
                            </p>
                            <button className="site-btn" onClick={handleExportBackup}>
                                Download .EHK Backup
                            </button>
                        </div>

                        <div className="dossier-backup-card">
                            <h4>Restore Dossier Archive</h4>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '8px 0 16px' }}>
                                Import an existing <code>.ehk.json</code> backup to restore your level, clearance, and completed projects.
                            </p>
                            <input
                                type="file"
                                accept=".json,.ehk"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleImportFile}
                            />
                            <button
                                className="site-btn tool-btn secondary-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose Backup File to Restore
                            </button>
                        </div>
                    </div>

                    {backupStatus && (
                        <div className={`auth-feedback-box mt-20 ${backupStatus.startsWith('[OK]') ? 'success' : 'error'}`}>
                            {backupStatus}
                        </div>
                    )}
                </div>
            )}

            {/* Subtab: About & Architecture */}
            {profTab === 'about' && (
                <div>
                    {/* Developer Dossier Card */}
                    <div className="glass-card text-center mb-25" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', borderColor: 'rgba(124, 58, 237, 0.3)' }}>
                        <div style={{ margin: '0 auto 15px auto', width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.6rem', color: '#fff', boxShadow: '0 0 25px rgba(124, 58, 237, 0.4)' }}>
                            GK
                        </div>
                        <div className="projects-badge-tag" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#c4b5fd' }}>PLATFORM ARCHITECT & RESEARCHER</div>
                        <h2 style={{ margin: '8px 0 4px 0' }}>Giridharan K</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 16px auto', fontSize: '0.9rem' }}>
                            Cybersecurity Architect, Exploit Researcher & Full-Stack Systems Engineer dedicated to building next-generation offensive and defensive cyber training platforms.
                        </p>

                        <div className="flex-gap-10 justify-center flex-wrap" style={{ justifyContent: 'center' }}>
                            <a href="https://github.com/nextboxis" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn">GitHub: @nextboxis</a>
                            <a href="https://linkedin.com/in/giridharan-k1315" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn secondary-btn">LinkedIn Profile</a>
                            <a href="https://giridharank.netlify.app" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn secondary-btn">Personal Portfolio</a>
                            <a href="https://youtube.com/@jryhex" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn secondary-btn">YouTube: @jryhex</a>
                        </div>
                    </div>

                    {/* Platform Architecture & Tech Stack */}
                    <div className="overview-grid mb-25">
                        <div className="glass-card">
                            <h3 className="tool-section-title">Core Architecture & Tech Stack</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>
                                Built with privacy-first architecture. All cryptographic calculations, rule generations, and notes persist purely within your browser sandbox.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { name: "React 18 + Vite", desc: "Ultra-fast frontend build engine & reactive state architecture" },
                                    { name: "Web Crypto API", desc: "Native browser-level cryptographic hashing (SHA-1/256/512)" },
                                    { name: "Local-First Storage", desc: "Zero-telemetry localStorage persistence for targets & notes" },
                                    { name: "Web Audio API", desc: "Synthesizer engine for ambient cyber soundscapes & cues" },
                                    { name: "GitHub REST API", desc: "Dynamic operative avatar & profile synchronization" }
                                ].map((t, idx) => (
                                    <div key={idx} style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                        <strong style={{ color: '#38bdf8', fontSize: '0.88rem' }}>{t.name}</strong>
                                        <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3 className="tool-section-title">Responsible Disclosure & Ethics Statement</h3>
                            <div className="project-mitigation-box" style={{ marginBottom: '15px', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                <strong style={{ color: '#ef4444' }}>AUTHORIZATION MANDATE:</strong>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                                    The techniques, proof-of-concept scripts, tools, and methodologies documented within the E-Hacker Command Workstation are strictly for authorized educational research, defensive hardening, and authorized penetration testing engagements.
                                </p>
                            </div>

                            <h4 style={{ margin: '15px 0 8px 0', fontSize: '0.95rem' }}>Platform Specs</h4>
                            <div className="stat-card-group" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <div className="stat-box">
                                    <div className="stat-lbl">Version</div>
                                    <div className="stat-value" style={{ fontSize: '1.1rem', color: '#a855f7' }}>v3.2.0</div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-lbl">Engine</div>
                                    <div className="stat-value" style={{ fontSize: '1.1rem', color: '#22c55e' }}>Obsidian Core</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
