import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function OverviewTab() {
    const { activeProfile, setActiveTab, playChime } = useAuth();
    const completedLabs = (activeProfile.completedProjects || []).length;
    const checkedSkills = (activeProfile.checkedSkills || []).length;

    return (
        <div className="tab-panel active">
            <div className="overview-grid">
                <div className="glass-card welcome-card">
                    <h2>Welcome, Operative {activeProfile.callsign}</h2>
                    <p>This interactive command workstation is your launchpad to master the cybersecurity ecosystem. Progress through structured roadmap stages, complete 100 verified hands-on labs, generate AI detection rules, and run Python security scripts.</p>
                    
                    <div className="stat-card-group">
                        <div className="stat-box">
                            <div className="stat-value">6</div>
                            <div className="stat-lbl">Roadmap Stages</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">100</div>
                            <div className="stat-lbl">Hands-on Labs</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{completedLabs}</div>
                            <div className="stat-lbl">Completed Labs</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{activeProfile.xp || 0}</div>
                            <div className="stat-lbl">Earned XP</div>
                        </div>
                    </div>

                    <div className="mt-20 flex-gap-10">
                        <button className="site-btn" onClick={() => { setActiveTab('projects'); playChime(); }}>🚀 Explore 100 Labs</button>
                        <button className="site-btn tool-btn secondary-btn" onClick={() => { setActiveTab('python'); playChime(); }}>🐍 Python Cyber Lab</button>
                        <button className="site-btn tool-btn" onClick={() => { setActiveTab('toolkit'); playChime(); }}>🛠️ Cyber Toolkit</button>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="tool-section-title">⚡ Quick Access Modules</h3>
                    <div className="ir-steps-list mt-15">
                        <li><strong>Project Hub:</strong> 100 real-world vulnerability exploitation & defense labs.</li>
                        <li><strong>AI Security Hub:</strong> Synthesize Sigma rules, YARA signatures, and deobfuscate payloads.</li>
                        <li><strong>Python Cyber Lab:</strong> In-browser socket scanners, hash crackers, and log parsers.</li>
                        <li><strong>Threat Radar:</strong> Live simulated global attack telemetry and live CVE feeds.</li>
                    </div>
                </div>
            </div>
        </div>
    );
}
