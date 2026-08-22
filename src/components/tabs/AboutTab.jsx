import React from 'react';

export default function AboutTab() {
    return (
        <div className="tab-panel active">
            <div className="glass-card text-center mb-25">
                <div className="dossier-avatar-box" style={{ margin: '0 auto 15px auto', width: '100px', height: '100px', fontSize: '3.5rem' }}>🥷</div>
                <h2>Developed by Giridharan K</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Cybersecurity Architect, Exploit Researcher & Full-Stack Engineer</p>

                <div className="mt-20 flex-gap-10 justify-center flex-wrap" style={{ justifyContent: 'center' }}>
                    <a href="https://github.com/nextboxis" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn">GitHub: @nextboxis</a>
                    <a href="https://linkedin.com/in/giridharan-k1315" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn">LinkedIn</a>
                    <a href="https://giridharank.netlify.app" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn">Portfolio</a>
                    <a href="https://youtube.com/@jryhex" target="_blank" rel="noopener noreferrer" className="site-btn tool-btn">YouTube: @jryhex</a>
                </div>
            </div>
        </div>
    );
}
