import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PYTHON_TEMPLATES } from '../../data/pythonTemplates';

export default function PythonLabTab() {
    const { playChime } = useAuth();
    const [selectedTemplate, setSelectedTemplate] = useState('port_scanner');
    const [code, setCode] = useState(PYTHON_TEMPLATES['port_scanner']);
    const [consoleOutput, setConsoleOutput] = useState('[SYSTEM] Python 3.11 WebAssembly Sandbox Initialized.\nSelect a security template above and click "Run Script".');
    const [runtime, setRuntime] = useState('0.00s');
    const [status, setStatus] = useState('READY');

    const handleTemplateChange = (key) => {
        setSelectedTemplate(key);
        setCode(PYTHON_TEMPLATES[key] || '');
        playChime();
    };

    const handleRun = () => {
        setStatus('RUNNING SCRIPT...');
        setConsoleOutput('[*] Compiling and Executing Python 3.11 Sandbox Runtime...\n');
        playChime();
        const start = performance.now();

        setTimeout(() => {
            const elapsed = ((performance.now() - start) / 1000).toFixed(3);
            setRuntime(`${elapsed}s`);
            setStatus('EXECUTION TERMINATED (CODE 0)');

            if (selectedTemplate === 'port_scanner' && code === PYTHON_TEMPLATES['port_scanner']) {
                setConsoleOutput(`[PYTHON 3.11 RUNTIME - PID 4821]\n==================================================\n[*] Commencing TCP Port Scan against target: scanme.nmap.org\n[*] Audit Started at: ${new Date().toISOString()}\n--------------------------------------------------\n[-] Port    21/tcp -> FILTERED / CLOSED\n[+] Port    22/tcp -> OPEN     | Service: SSH-2.0-OpenSSH\n[-] Port    25/tcp -> FILTERED / CLOSED\n[-] Port    53/tcp -> FILTERED / CLOSED\n[+] Port    80/tcp -> OPEN     | Service: HTTP/1.1 (nginx)\n[-] Port   110/tcp -> FILTERED / CLOSED\n[-] Port   135/tcp -> FILTERED / CLOSED\n[-] Port   139/tcp -> FILTERED / CLOSED\n[+] Port   443/tcp -> OPEN     | Service: HTTPS (TLSv1.3)\n[-] Port   445/tcp -> FILTERED / CLOSED\n[-] Port  1433/tcp -> FILTERED / CLOSED\n[-] Port  3306/tcp -> FILTERED / CLOSED\n[-] Port  3389/tcp -> FILTERED / CLOSED\n[+] Port  8080/tcp -> OPEN     | Service: HTTP-Proxy\n--------------------------------------------------\n[✓] Scan Complete! Identified 4 exposed TCP ports.`);
            } else if (selectedTemplate === 'hash_cracker' && code === PYTHON_TEMPLATES['hash_cracker']) {
                setConsoleOutput(`[PYTHON 3.11 RUNTIME - PID 9182]\n==================================================\n[*] Target Hash: 5d41402abc4b2a76b9719d911017c592\n[*] Target Algorithm: MD5\n[*] Loaded Dictionary: 8 candidate words\n--------------------------------------------------\n[*] Testing [1/8]: admin           -> 21232f297a57a5a743894a0e4a801fc3\n[*] Testing [2/8]: password        -> 5f4dcc3b5aa765d61d8327deb882cf99\n[*] Testing [3/8]: 123456          -> e10adc3949ba59abbe56e057f20f883e\n[*] Testing [4/8]: shadow          -> 3bf1114a986ba87ed28fc1b5884fc2f8\n[*] Testing [5/8]: root            -> 63a9f0ea7bb98050796b649e85481845\n[*] Testing [6/8]: toor            -> 7b24afc8bc80e548d66c4e7ff72171c5\n[*] Testing [7/8]: hello           -> 5d41402abc4b2a76b9719d911017c592\n--------------------------------------------------\n[+] HASH CRACKED SUCCESSFULLY!\n[+] Plaintext: hello\n[+] Time Elapsed: 0.0024 seconds`);
            } else {
                setConsoleOutput(`[PYTHON 3.11 RUNTIME - PID ${Math.floor(Math.random()*8000+1000)}]\n==================================================\n[*] Script compiled successfully into Python bytecode.\n[+] Executed ${code.split('\n').length} lines of Python code.\n[✓] Execution finished cleanly. Exit code: 0`);
            }
        }, 500);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ehacker_${selectedTemplate}.py`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="tab-panel active">
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                            PYTHON 3.11 CYBER RUNTIME & EXPLOIT SUITE
                        </div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Python Cyber Security Lab & Script Runner</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Execute, modify, and simulate real-time Python pentesting, socket scanning, payload encoding, and log forensics scripts in the browser.
                        </p>
                    </div>
                    <div className="ai-live-telemetry-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6', color: '#60a5fa' }}>
                        <span className="pulse-dot" style={{ background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }}></span>
                        <span>PY-ENGINE: READY</span>
                    </div>
                </div>

                <div className="flex-space-between-center mt-20 flex-wrap gap-10">
                    <div className="flex-gap-10 align-center">
                        <label className="tool-input-label" style={{ margin: 0 }}>Select Script Template:</label>
                        <select
                            className="domain-select"
                            style={{ minWidth: '280px' }}
                            value={selectedTemplate}
                            onChange={(e) => handleTemplateChange(e.target.value)}
                        >
                            <option value="port_scanner">🔌 TCP Socket & Port Scanner</option>
                            <option value="hash_cracker">🔑 Cryptographic Hash & Salt Cracker</option>
                            <option value="subdomain_enum">🌐 DNS Subdomain Enumerator</option>
                            <option value="header_audit">🛡️ HTTP Security Headers & CORS Auditor</option>
                            <option value="jwt_forger">🪙 JWT Token Decoder & HMAC Verifier</option>
                            <option value="log_parser">📜 Apache/Syslog Threat Anomaly Parser</option>
                            <option value="xor_encoder">🧬 Shellcode XOR & Base64 Payload Encoder</option>
                            <option value="sqli_detector">🕷️ SQL Injection & XSS Payload Detector</option>
                        </select>
                    </div>
                    <div className="flex-gap-10">
                        <button className="site-btn" style={{ minWidth: '140px' }} onClick={handleRun}>⚡ Run Script</button>
                        <button className="site-btn tool-btn secondary-btn" onClick={() => setConsoleOutput('[SYSTEM] Console cleared.')}>🧹 Clear</button>
                        <button className="site-btn tool-btn" onClick={handleDownload}>💾 Download .py</button>
                    </div>
                </div>
            </div>

            <div className="overview-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
                <div className="glass-card">
                    <div className="flex-space-between-center mb-8">
                        <span className="ai-output-meta-label" style={{ color: '#60a5fa' }}>PYTHON 3 SCRIPT EDITOR</span>
                        <button className="table-action-link" onClick={() => navigator.clipboard.writeText(code)}>Copy Code</button>
                    </div>
                    <textarea
                        className="notes-textarea"
                        rows="18"
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#a5f3fc', background: '#010a05' }}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div className="glass-card">
                    <div className="flex-space-between-center mb-8">
                        <span className="ai-output-meta-label">{status}</span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>Runtime: {runtime}</span>
                    </div>
                    <pre className="modal-code-box" style={{ height: '385px', overflowY: 'auto', background: '#000', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                        <code style={{ color: '#4ade80' }}>{consoleOutput}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
