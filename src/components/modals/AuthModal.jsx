import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
    const { isAuthModalOpen, setIsAuthModalOpen, switchProfile, createProfile, playChime } = useAuth();
    const [tab, setTab] = useState('signin');
    const [callsign, setCallsign] = useState('root@nextboxis');
    const [passphrase, setPassphrase] = useState('shadowprotocol2026');
    const [domain, setDomain] = useState('full');
    const [clearance, setClearance] = useState('Level 5 • TOP SECRET');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleBiometric = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            switchProfile('prof_root');
            setIsAuthModalOpen(false);
            playChime();
        }, 1200);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        switchProfile('prof_root');
        setIsAuthModalOpen(false);
        playChime();
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        createProfile({ callsign, domain, clearance, avatar: selectedAvatar });
        setIsAuthModalOpen(false);
        playChime();
    };

    return (
        <div className="modal-overlay active" onClick={() => setIsAuthModalOpen(false)}>
            <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="auth-header">
                    <div className="auth-brand">
                        <div className="auth-logo-glitch"></div>
                        <div>
                            <h3>OPERATIVE ACCESS PORTAL</h3>
                            <span className="auth-subtitle">E-HACKER DEFENSE NETWORK // CLEARANCE VERIFIER</span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={() => setIsAuthModalOpen(false)}>×</button>
                </div>

                <div className="auth-body">
                    {/* Mode Toggle */}
                    <div className="auth-mode-chips mb-20">
                        <button className={`filter-chip ${tab === 'signin' ? 'active' : ''}`} onClick={() => setTab('signin')}>
                             Operative Sign In
                        </button>
                        <button className={`filter-chip ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>
                             Provision New Identity
                        </button>
                    </div>

                    {/* Quick Demo Roles */}
                    <div className="auth-demo-roles-bar mb-20">
                        <span className="demo-role-label">QUICK SIMULATION ROLES:</span>
                        <div className="demo-chips-group">
                            <button className="demo-role-chip" onClick={() => { switchProfile('prof_root'); setIsAuthModalOpen(false); }}>root@nextboxis</button>
                            <button className="demo-role-chip" onClick={() => { switchProfile('prof_redteam'); setIsAuthModalOpen(false); }}>Red Team Lead</button>
                            <button className="demo-role-chip" onClick={() => { switchProfile('prof_soc'); setIsAuthModalOpen(false); }}>SOC Analyst</button>
                        </div>
                    </div>

                    {tab === 'signin' ? (
                        <form onSubmit={handleSignIn}>
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Operative Callsign / Identity Handle:</label>
                                <input type="text" className="search-input" value={callsign} onChange={(e) => setCallsign(e.target.value)} required />
                            </div>
                            <div className="tool-input-group mb-20">
                                <label className="tool-input-label">Passphrase / Access Token:</label>
                                <input type="password" className="search-input" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} required />
                            </div>
                            <div className="auth-action-buttons">
                                <button type="submit" className="site-btn auth-submit-btn">Authorize Operative</button>
                                <button type="button" className={`biometric-btn ${isScanning ? 'scanning' : ''}`} onClick={handleBiometric}>
                                    <span className="bio-icon"></span>
                                    <span className="bio-text">Biometric Touch ID</span>
                                    <div className="bio-scanline"></div>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp}>
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Choose Callsign / Handle:</label>
                                <input type="text" className="search-input" placeholder="e.g. CyberViper_0x" value={callsign} onChange={(e) => setCallsign(e.target.value)} required />
                            </div>
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Primary Specialization Track:</label>
                                <select className="domain-select" style={{ width: '100%' }} value={domain} onChange={(e) => setDomain(e.target.value)}>
                                    <option value="full"> Full Spectrum Hacker</option>
                                    <option value="web">️ Web Pentesting</option>
                                    <option value="network"> Network & Infrastructure</option>
                                    <option value="soc">️ SOC & Blue Team Defense</option>
                                    <option value="malware"> Malware & Reverse Eng</option>
                                    <option value="osint"> OSINT Specialist</option>
                                </select>
                            </div>
                            <div className="tool-input-group mb-15">
                                <label className="tool-input-label">Security Clearance Level:</label>
                                <select className="domain-select" style={{ width: '100%' }} value={clearance} onChange={(e) => setClearance(e.target.value)}>
                                    <option value="Level 1 • UNCLASSIFIED">Level 1 • UNCLASSIFIED</option>
                                    <option value="Level 2 • RESTRICTED">Level 2 • RESTRICTED</option>
                                    <option value="Level 3 • CONFIDENTIAL">Level 3 • CONFIDENTIAL</option>
                                    <option value="Level 4 • SECRET">Level 4 • SECRET</option>
                                    <option value="Level 5 • TOP SECRET">Level 5 • TOP SECRET // NOFORN</option>
                                </select>
                            </div>
                            <div className="tool-input-group mb-20">
                                <label className="tool-input-label">Choose Operative Avatar:</label>
                                <div className="avatar-select-grid">
                                    {['', '️', '️', '', '', ''].map(av => (
                                        <span key={av} className={`avatar-opt ${selectedAvatar === av ? 'active' : ''}`} onClick={() => setSelectedAvatar(av)}>{av}</span>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="site-btn auth-submit-btn">Provision Operative Identity</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
