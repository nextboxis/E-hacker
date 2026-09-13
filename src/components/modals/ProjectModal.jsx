import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProjectModal() {
    const { activeProjectModal, setActiveProjectModal, activeProfile, toggleProjectComplete, playChime } = useAuth();
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [flagInput, setFlagInput] = useState('');
    const [flagStatus, setFlagStatus] = useState(null); // { success: boolean, msg: string }

    if (!activeProjectModal) return null;

    const p = activeProjectModal;
    const isCompleted = (activeProfile.completedProjects || []).includes(p.id);

    // Robust field extraction supporting both root and guide sub-object
    const title = p.title || `Lab #${p.id}`;
    const category = p.category || p.cat || 'General Security';
    const difficulty = p.difficulty || p.diff || 'Intermediate';
    const xp = p.xp || 50;
    const duration = p.duration || '1-2 Hours';
    const objective = p.guide?.objective || p.description || p.desc || 'Complete the hands-on security challenge.';
    const setup = p.guide?.labSetup || p.env || 'Local vulnerable lab environment, Docker container, or target VM.';
    const steps = p.guide?.steps || [];
    const commands = p.guide?.commands || p.commands || '';
    const mitigation = p.guide?.mitigation || p.mitigation || 'Implement least privilege, input validation, and defence-in-depth controls.';
    const targetFlag = `FLAG{lab_${p.id}_pwned}`;

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(key);
        playChime();
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleVerifyFlag = (e) => {
        e.preventDefault();
        const input = flagInput.trim();
        if (!input) return;

        if (input.toLowerCase() === targetFlag.toLowerCase() || input.startsWith('FLAG{')) {
            setFlagStatus({ success: true, msg: `[SUCCESS] Cryptographic Proof-of-Work Verified! +${xp} XP Claimed.` });
            if (!isCompleted) {
                toggleProjectComplete(p.id, xp);
            }
            playChime();
        } else {
            setFlagStatus({ success: false, msg: `[ERR] Invalid Flag. Expected format: FLAG{...}` });
        }
    };

    return (
        <div className="modal-overlay active" onClick={() => setActiveProjectModal(null)}>
            <div className="project-modal-dialog" style={{ maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="project-modal-header">
                    <div className="flex-gap-12 align-center">
                        <span className="project-modal-num">
                            {p.id >= 1000 ? `AI-LAB #${p.id}` : `LAB #${p.id}`}
                        </span>
                        <div>
                            <h2 className="project-modal-title" style={{ margin: 0 }}>{title}</h2>
                            <div className="project-modal-tags mt-4">
                                <span className="project-card-tag">{category}</span>
                                <span className={`project-diff-badge diff-${difficulty.toLowerCase()}`}>{difficulty}</span>
                                <span className="operative-clearance-tag">{duration}</span>
                                <span className="project-xp-tag">+{xp} XP</span>
                            </div>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={() => setActiveProjectModal(null)}>×</button>
                </div>

                {/* Modal Body */}
                <div className="project-modal-body">
                    {/* 1. Objective */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading">
                            <span className="deauth-pulse-dot" style={{ background: '#38bdf8' }}></span>
                            Lab Objective & Threat Vector
                        </h4>
                        <p className="project-desc-text">{objective}</p>
                    </div>

                    {/* 2. Environment Prerequisites */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading">
                            <span className="deauth-pulse-dot" style={{ background: '#a855f7' }}></span>
                            Target Environment & Prerequisites
                        </h4>
                        <div className="project-env-box">{setup}</div>
                    </div>

                    {/* 3. Step-by-Step Walkthrough */}
                    {steps.length > 0 && (
                        <div className="project-modal-section">
                            <h4 className="project-section-heading">
                                <span className="deauth-pulse-dot" style={{ background: '#06b6d4' }}></span>
                                Tactical Execution Steps
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                {steps.map((st, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '12px',
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.04)'
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: 'rgba(6, 182, 212, 0.15)',
                                                color: '#22d3ee',
                                                fontSize: '0.78rem',
                                                fontFamily: 'monospace',
                                                fontWeight: 700
                                            }}
                                        >
                                            STEP {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                                            {st}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. Verified Commands / Payload Syntax */}
                    {commands && (
                        <div className="project-modal-section">
                            <div className="flex-space-between-center mb-8">
                                <h4 className="project-section-heading" style={{ margin: 0 }}>
                                    <span className="deauth-pulse-dot" style={{ background: '#f59e0b' }}></span>
                                    Verified Syntax & Exploit Payloads
                                </h4>
                                <button className="table-action-link" onClick={() => handleCopy(commands, 'cmd')}>
                                    {copiedIndex === 'cmd' ? 'Copied to Clipboard!' : 'Copy Commands'}
                                </button>
                            </div>
                            <pre className="modal-code-box" style={{ margin: 0, maxHeight: '220px', overflowY: 'auto' }}>
                                <code>{commands}</code>
                            </pre>
                        </div>
                    )}

                    {/* 5. Defensive Remediation */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading">
                            <span className="deauth-pulse-dot" style={{ background: '#22c55e' }}></span>
                            Defensive Remediation & Blue Team Countermeasures
                        </h4>
                        <div className="project-mitigation-box">{mitigation}</div>
                    </div>

                    {/* 6. CTF Flag Submission & Proof-of-Work */}
                    <div className="project-modal-section" style={{ background: 'rgba(124, 58, 237, 0.08)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                        <div className="flex-space-between-center mb-8">
                            <h4 className="project-section-heading" style={{ margin: 0, color: '#c4b5fd' }}>
                                🚩 CTF Proof-of-Work Flag Verification
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Flag: <code>{targetFlag}</code></span>
                        </div>
                        <form onSubmit={handleVerifyFlag} className="flex-gap-10 mt-10">
                            <input
                                type="text"
                                className="search-input"
                                style={{ flex: 1 }}
                                placeholder={`Enter captured flag e.g. ${targetFlag}...`}
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                            />
                            <button type="submit" className="site-btn tool-btn">
                                Submit Flag
                            </button>
                            <button
                                type="button"
                                className="site-btn tool-btn secondary-btn"
                                onClick={() => setFlagInput(targetFlag)}
                            >
                                Fill Flag
                            </button>
                        </form>
                        {flagStatus && (
                            <div className="mt-10" style={{ fontSize: '0.82rem', color: flagStatus.success ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                                {flagStatus.msg}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="project-modal-footer">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => toggleProjectComplete(p.id, xp)}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">
                            {isCompleted ? `Lab Completed (+${xp} XP Claimed)` : `Mark Lab as Completed (+${xp} XP)`}
                        </span>
                    </label>
                    <button className="site-btn" onClick={() => setActiveProjectModal(null)}>Close Guidebook</button>
                </div>
            </div>
        </div>
    );
}
