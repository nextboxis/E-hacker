import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LogoutModal() {
    const { isLogoutModalOpen, setIsLogoutModalOpen, activeProfile, logout, setActiveTab } = useAuth();

    if (!isLogoutModalOpen) return null;

    const handleReauth = () => {
        logout();
    };

    const handleSwitch = () => {
        setIsLogoutModalOpen(false);
        setActiveTab('profile');
    };

    const handleBurn = () => {
        if (confirm("CAUTION: This will zeroize all local session cache and reset to default factory state. Proceed?")) {
            localStorage.clear();
            logout();
            window.location.reload();
        }
    };

    return (
        <div className="modal-overlay logout-modal-overlay active" onClick={() => setIsLogoutModalOpen(false)}>
            <div className="logout-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="logout-header">
                    <div className="logout-warning-badge">
                        <span className="deauth-pulse-dot"></span>
                        <span>DEAUTHORIZATION PROTOCOL // MEMORY ZEROIZATION</span>
                    </div>
                    <button className="modal-close-btn" onClick={() => setIsLogoutModalOpen(false)}>×</button>
                </div>

                <div className="logout-body">
                    <div className="text-center mb-20">
                        <div className="logout-powerdown-icon"></div>
                        <h2 className="logout-title">SESSION TERMINATED</h2>
                        <p className="logout-subtitle">Operative {activeProfile.callsign} // Security Clearance Suspended</p>
                    </div>

                    {/* Memory Zeroization Box */}
                    <div className="deauth-terminal-card mb-20">
                        <div className="flex-space-between-center mb-8">
                            <span className="deauth-terminal-header">CRYPTOGRAPHIC MEMORY SANITIZATION:</span>
                            <span className="deauth-percent">100% PURGED</span>
                        </div>
                        <div className="deauth-progress-bar">
                            <div className="deauth-progress-fill"></div>
                        </div>
                        <div className="deauth-log-stream mt-10">
                            <div className="deauth-log-line"> [SYS] Revoking active JWT & REST session tokens...</div>
                            <div className="deauth-log-line"> [CRYPTO] Zeroizing memory buffers & ephemeral keys...</div>
                            <div className="deauth-log-line"> [CACHE] Flushing temporary forensic telemetry...</div>
                            <div className="deauth-log-line deauth-success-line"> [AUTH] Clearance channel decommissioned safely.</div>
                        </div>
                    </div>

                    {/* Debrief Card */}
                    <div className="session-debrief-card mb-20">
                        <h4 className="debrief-header">OPERATIVE MISSION DEBRIEF:</h4>
                        <div className="debrief-grid">
                            <div className="debrief-item">
                                <span className="debrief-lbl">ACTIVE CALLSIGN:</span>
                                <strong className="debrief-val">{activeProfile.callsign}</strong>
                            </div>
                            <div className="debrief-item">
                                <span className="debrief-lbl">XP SECURED:</span>
                                <strong className="debrief-val">+{activeProfile.xp || 0} XP</strong>
                            </div>
                            <div className="debrief-item">
                                <span className="debrief-lbl">LABS COMPLETED:</span>
                                <strong className="debrief-val">{(activeProfile.completedProjects || []).length} / 118 Labs</strong>
                            </div>
                            <div className="debrief-item">
                                <span className="debrief-lbl">LOCAL STORAGE:</span>
                                <strong className="debrief-val text-success">Encrypted & Safe</strong>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="logout-actions-grid">
                        <button className="site-btn" onClick={handleReauth}>Re-Authenticate Callsign</button>
                        <button className="site-btn tool-btn secondary-btn" onClick={handleSwitch}>Switch Profile</button>
                        <button className="site-btn tool-btn text-danger" onClick={handleBurn}>Emergency Clean Burn</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
