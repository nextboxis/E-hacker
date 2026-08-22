import React from 'react';

export default function AdhdFocusTab() {
    return (
        <div className="tab-panel active">
            <div className="glass-card mb-25">
                <h2> ADHD Focus Hub & Ambient Soundscape</h2>
                <p>Neurodivergent focus aids, task paralysis busters, dopamine side quests, and ambient audio synthesizers.</p>
            </div>

            <div className="overview-grid">
                <div className="glass-card">
                    <h3 className="tool-section-title"> Dopamine Side Quest Generator</h3>
                    <div className="ai-code-output-card mt-15">
                        <p style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Active Quest: "Run Nmap against scanme.nmap.org and inspect open ports in the Python Lab"</p>
                        <span className="project-xp-tag mt-8" style={{ display: 'inline-block' }}>Reward: +50 XP</span>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="tool-section-title">️ Task Paralysis Buster</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>
                        Overwhelmed by a massive pentest topic? Choose one lab from the Project Hub, open the command block, and copy the first syntax line.
                    </p>
                </div>
            </div>
        </div>
    );
}
