import React from 'react';
import { TOOLS_DATABASE, OSINT_TOOLS, CHANNELS_DATABASE } from '../../data/toolsData';

export default function ToolsDirectoryTab() {
    return (
        <div className="tab-panel active">
            <div className="glass-card mb-25">
                <h2>🛠️ Curated Cybersecurity Tools & Frameworks</h2>
                <p>Essential penetration testing, traffic analysis, password recovery, and OSINT frameworks.</p>
            </div>

            <div className="projects-dynamic-grid">
                {TOOLS_DATABASE.map((t, idx) => (
                    <div key={idx} className="project-card">
                        <div>
                            <div className="project-card-header">
                                <span className="project-card-num">{t.icon}</span>
                                <span className="project-diff-badge diff-intermediate">{t.cat}</span>
                            </div>
                            <h3 className="project-card-title">{t.name}</h3>
                            <p className="project-card-desc">{t.desc}</p>
                        </div>
                        <div className="project-card-footer">
                            <a href={t.link} target="_blank" rel="noopener noreferrer" className="table-action-link">Official Portal ↗</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
