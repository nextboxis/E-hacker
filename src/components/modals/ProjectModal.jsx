import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProjectModal() {
    const { activeProjectModal, setActiveProjectModal, activeProfile, toggleProjectComplete, playChime } = useAuth();

    if (!activeProjectModal) return null;

    const p = activeProjectModal;
    const isCompleted = (activeProfile.completedProjects || []).includes(p.id);

    const handleCopy = () => {
        navigator.clipboard.writeText(p.commands || '');
        playChime();
        alert('Lab execution command block copied to clipboard!');
    };

    return (
        <div className="modal-overlay active" onClick={() => setActiveProjectModal(null)}>
            <div className="project-modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="project-modal-header">
                    <div className="flex-gap-10 align-center">
                        <span className="project-modal-num">LAB #{p.id}</span>
                        <div>
                            <h2 className="project-modal-title">{p.title}</h2>
                            <div className="project-modal-tags">
                                <span className="project-card-tag">{p.cat}</span>
                                <span className={`project-diff-badge diff-${p.diff.toLowerCase()}`}>{p.diff}</span>
                                <span className="project-xp-tag">+{p.xp} XP</span>
                            </div>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={() => setActiveProjectModal(null)}>×</button>
                </div>

                <div className="project-modal-body">
                    {/* Objectives */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading"> Lab Objective & Threat Vector</h4>
                        <p className="project-desc-text">{p.desc}</p>
                    </div>

                    {/* Environment Setup */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading">️ Environment Prerequisites & Target Setup</h4>
                        <div className="project-env-box">{p.env}</div>
                    </div>

                    {/* Verified Commands */}
                    <div className="project-modal-section">
                        <div className="flex-space-between-center mb-8">
                            <h4 className="project-section-heading"> Verified Execution Syntax & Proof-of-Concept</h4>
                            <button className="table-action-link" onClick={handleCopy}>Copy Syntax</button>
                        </div>
                        <pre className="modal-code-box"><code>{p.commands}</code></pre>
                    </div>

                    {/* Mitigation */}
                    <div className="project-modal-section">
                        <h4 className="project-section-heading">️ Defensive Remediation & Blue Team Countermeasures</h4>
                        <div className="project-mitigation-box">{p.mitigation}</div>
                    </div>
                </div>

                <div className="project-modal-footer">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => toggleProjectComplete(p.id)}
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">
                            {isCompleted ? 'Lab Completed (+50 XP Claimed)' : 'Mark Lab as Completed (+50 XP)'}
                        </span>
                    </label>
                    <button className="site-btn" onClick={() => setActiveProjectModal(null)}>Close Lab</button>
                </div>
            </div>
        </div>
    );
}
