import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ToolkitTab() {
    const { playChime } = useAuth();
    const [tool, setTool] = useState('hash');

    // Hash Gen state
    const [hashInput, setHashInput] = useState('admin');
    const [hashes, setHashes] = useState({});

    // Encoder state
    const [encInput, setEncInput] = useState('alert("XSS")');
    const [encMode, setEncMode] = useState('base64');
    const [encOutput, setEncOutput] = useState(btoa('alert("XSS")'));

    // Subnet state
    const [ipInput, setIpInput] = useState('192.168.1.100');
    const [cidrInput, setCidrInput] = useState(24);

    const computeHashes = async (text) => {
        setHashInput(text);
        if (!text) { setHashes({}); return; }
        const enc = new TextEncoder().encode(text);
        const [h1, h256, h512] = await Promise.all([
            crypto.subtle.digest('SHA-1', enc),
            crypto.subtle.digest('SHA-256', enc),
            crypto.subtle.digest('SHA-512', enc)
        ]);
        const toHex = b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
        setHashes({
            sha1: toHex(h1),
            sha256: toHex(h256),
            sha512: toHex(h512)
        });
    };

    const handleEncode = (text, mode) => {
        setEncInput(text);
        try {
            if (mode === 'base64') setEncOutput(btoa(text));
            else if (mode === 'hex') setEncOutput(Array.from(new TextEncoder().encode(text)).map(b => '\\x' + b.toString(16).padStart(2, '0')).join(''));
            else if (mode === 'url') setEncOutput(encodeURIComponent(text));
            else setEncOutput(text);
        } catch (e) {
            setEncOutput('Encoding error');
        }
    };

    return (
        <div className="tab-panel active">
            <div className="glass-card mb-25">
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">INTERACTIVE MINI-LABS</div>
                        <h2>Cybersecurity Toolkit & Calculators</h2>
                        <p>Zero-dependency client-side cryptographic hashing, multi-format encoders, subnet calculators, and vulnerability analyzers.</p>
                    </div>
                    <div className="ai-nav-chips">
                        <button className={`ai-nav-btn ${tool === 'hash' ? 'active' : ''}`} onClick={() => setTool('hash')}>🔑 Multi-Hash Generator</button>
                        <button className={`ai-nav-btn ${tool === 'encoder' ? 'active' : ''}`} onClick={() => setTool('encoder')}>🔄 Security Encoder</button>
                        <button className={`ai-nav-btn ${tool === 'subnet' ? 'active' : ''}`} onClick={() => setTool('subnet')}>🌐 Subnet & CIDR Calc</button>
                    </div>
                </div>
            </div>

            {tool === 'hash' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">🔑 Live Multi-Hash Generator & Identifier</h3>
                    <div className="tool-input-group mt-15 mb-15">
                        <label className="tool-input-label">Plaintext Input:</label>
                        <input
                            type="text"
                            className="search-input"
                            value={hashInput}
                            onChange={(e) => computeHashes(e.target.value)}
                        />
                    </div>

                    <div className="ai-code-output-card">
                        <div className="deauth-log-stream">
                            <div><strong>SHA-1:</strong> <code>{hashes.sha1 || 'Loading...'}</code></div>
                            <div className="mt-8"><strong>SHA-256:</strong> <code>{hashes.sha256 || 'Loading...'}</code></div>
                            <div className="mt-8"><strong>SHA-512:</strong> <code>{hashes.sha512 || 'Loading...'}</code></div>
                        </div>
                    </div>
                </div>
            )}

            {tool === 'encoder' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">🔄 Multi-Format Security Encoder / Decoder</h3>
                    <div className="flex-gap-10 mt-15 mb-15">
                        {['base64', 'hex', 'url'].map(m => (
                            <button key={m} className={`filter-chip ${encMode === m ? 'active' : ''}`} onClick={() => { setEncMode(m); handleEncode(encInput, m); }}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="notes-textarea mb-15"
                        rows="3"
                        value={encInput}
                        onChange={(e) => handleEncode(e.target.value, encMode)}
                    />
                    <div className="ai-code-output-card">
                        <div className="flex-space-between-center mb-8">
                            <span className="ai-output-meta-label">ENCODED RESULT:</span>
                            <button className="table-action-link" onClick={() => navigator.clipboard.writeText(encOutput)}>Copy</button>
                        </div>
                        <pre className="modal-code-box"><code>{encOutput}</code></pre>
                    </div>
                </div>
            )}

            {tool === 'subnet' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">🌐 IPv4 Subnet & CIDR Range Calculator</h3>
                    <div className="overview-grid mt-15 mb-15">
                        <div>
                            <label className="tool-input-label">IP Address:</label>
                            <input type="text" className="search-input" value={ipInput} onChange={(e) => setIpInput(e.target.value)} />
                        </div>
                        <div>
                            <label className="tool-input-label">CIDR Prefix (/{cidrInput}):</label>
                            <input type="number" min="1" max="32" className="search-input" value={cidrInput} onChange={(e) => setCidrInput(Number(e.target.value))} />
                        </div>
                    </div>
                    <div className="ai-deobf-results-grid">
                        <div className="deobf-stat-card">
                            <span className="subnet-stat-label">Network IP:</span>
                            <strong className="subnet-stat-val">{ipInput.split('.').slice(0,3).join('.')}.0/{cidrInput}</strong>
                        </div>
                        <div className="deobf-stat-card">
                            <span className="subnet-stat-label">Usable Hosts:</span>
                            <strong className="subnet-stat-val">{Math.max(0, Math.pow(2, 32 - cidrInput) - 2)} Hosts</strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
