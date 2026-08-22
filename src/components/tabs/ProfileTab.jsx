import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileTab() {
    const {
        activeProfile,
        allProfiles,
        switchProfile,
        createProfile,
        updateActiveProfile,
        deleteProfile,
        setIsLocked,
        setIsLogoutModalOpen,
        playChime
    } = useAuth();

    const [profTab, setProfTab] = useState('dossier');
    const [editCallsign, setEditCallsign] = useState(activeProfile.callsign);
    const [editBio, setEditBio] = useState(activeProfile.bio || '');
    const [editClearance, setEditClearance] = useState(activeProfile.clearance);
    const [editDomain, setEditDomain] = useState(activeProfile.domain);
    const [editAvatar, setEditAvatar] = useState(activeProfile.avatar);

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

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(activeProfile, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ehacker_dossier_${activeProfile.callsign}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="tab-panel active">
            {/* Hero Dossier Card */}
            <div className="glass-card operative-dossier-hero mb-25">
                <div className="dossier-watermark">TOP SECRET // NOFORN</div>
                <div className="dossier-hero-layout">
                    <div className="dossier-avatar-col">
                        <div className="dossier-avatar-box">{activeProfile.avatar || ''}</div>
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
                                <button className="site-btn tool-btn" onClick={() => setProfTab('profiles')}> Switch Profile</button>
                                <button className="site-btn tool-btn secondary-btn" onClick={() => setProfTab('edit')}>️ Edit Details</button>
                                <button className="site-btn tool-btn" onClick={() => setIsLocked(true)}> Lock</button>
                                <button className="site-btn tool-btn text-danger" onClick={() => setIsLogoutModalOpen(true)}> Deauthorize</button>
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
                    <button className={`profile-nav-btn ${profTab === 'dossier' ? 'active' : ''}`} onClick={() => setProfTab('dossier')}> Operative Dossier</button>
                    <button className={`profile-nav-btn ${profTab === 'profiles' ? 'active' : ''}`} onClick={() => setProfTab('profiles')}> Multi-Profile Manager</button>
                    <button className={`profile-nav-btn ${profTab === 'edit' ? 'active' : ''}`} onClick={() => setProfTab('edit')}>️ Edit Identity</button>
                </div>
            </div>

            {profTab === 'dossier' && (
                <div className="overview-grid">
                    <div className="glass-card">
                        <h3 className="tool-section-title"> Competency & Skill Progress</h3>
                        <div className="mt-15">
                            <div className="flex-space-between-center mb-8">
                                <span className="subnet-stat-label">100 Labs Completion:</span>
                                <strong className="subnet-stat-val">{completedLabs} / 100 Labs ({completedLabs}%)</strong>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${completedLabs}%`, background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="tool-section-title"> Operative Mission Record</h3>
                        <div className="ir-steps-list mt-10">
                            <li><strong>Status:</strong> Active & Authorized</li>
                            <li><strong>Storage Engine:</strong> Encrypted Local-First IndexedDB Engine</li>
                            <li><strong>Vercel Edge Gateway:</strong> Connected & Verified</li>
                        </div>
                        <div className="mt-20">
                            <button className="site-btn" onClick={handleExport}> Export Full Profile Dossier (JSON)</button>
                        </div>
                    </div>
                </div>
            )}

            {profTab === 'profiles' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-15 flex-wrap gap-10">
                        <h3 className="tool-section-title"> Multi-Operative Profile Manager</h3>
                        <button
                            className="site-btn"
                            onClick={() => {
                                const name = prompt("Enter Callsign for new Operative Profile:", "Operative_" + Math.random().toString(36).substring(2, 6).toUpperCase());
                                if (name) createProfile({ callsign: name });
                            }}
                        >
                             Provision New Profile
                        </button>
                    </div>

                    <div className="profiles-grid">
                        {allProfiles.map(p => {
                            const isActive = p.id === activeProfile.id;
                            return (
                                <div key={p.id} className={`profile-card ${isActive ? 'active-profile' : ''}`}>
                                    <div>
                                        <div className="profile-card-header">
                                            <div className="profile-card-avatar">{p.avatar}</div>
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
                    <h3 className="tool-section-title">️ Edit Operative Identity & Credentials</h3>
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
                            <label className="tool-input-label">Choose Avatar:</label>
                            <div className="avatar-select-grid">
                                {['', '️', '️', '', '', '', '', ''].map(av => (
                                    <span key={av} className={`avatar-opt ${editAvatar === av ? 'active' : ''}`} onClick={() => setEditAvatar(av)}>{av}</span>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="site-btn">Save Operative Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
}
