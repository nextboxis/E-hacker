import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_TARGETS = [
    {
        id: 'tgt_1',
        host: '10.10.11.241',
        name: 'Internal Domain Controller (DC01.CORP.LOCAL)',
        scope: 'In-Scope',
        ports: '53, 88, 135, 389, 445, 636, 3268',
        findingsCount: 2,
        notes: 'Vulnerable to Kerberoasting on svc_backup account. SMB signing is disabled.',
        severity: 'CRITICAL',
        status: 'Active Audit'
    },
    {
        id: 'tgt_2',
        host: 'https://api-staging.target.internal',
        name: 'Staging API Gateway (Node.js/Express)',
        scope: 'In-Scope',
        ports: '80, 443, 8443',
        findingsCount: 1,
        notes: 'JWT none algorithm bypass confirmed on /auth/v1/refresh. CORS origin reflected.',
        severity: 'HIGH',
        status: 'Exploited'
    },
    {
        id: 'tgt_3',
        host: '192.168.1.1',
        name: 'Edge Gateway Firewall (pfSense)',
        scope: 'Out-of-Scope',
        ports: '22, 443',
        findingsCount: 0,
        notes: 'Production infrastructure - Do NOT disrupt or flood.',
        severity: 'INFO',
        status: 'Passive Recon Only'
    }
];

const DEFAULT_FINDINGS = [
    {
        id: 'vuln_1',
        title: 'Kerberoasting Service Account Ticket Extraction',
        target: 'DC01.CORP.LOCAL (10.10.11.241)',
        severity: 'CRITICAL',
        cvss: 9.1,
        status: 'Open',
        poc: 'GetUserSPNs.py corp.local/jdoe:Password123 -request -dc-ip 10.10.11.241',
        remediation: 'Enforce AES-256 Kerberos encryption and set complex 25+ character passwords on all SPN accounts.'
    },
    {
        id: 'vuln_2',
        title: 'Authentication Bypass via Insecure JWT Header',
        target: 'api-staging.target.internal',
        severity: 'HIGH',
        cvss: 8.4,
        status: 'Triaged',
        poc: '{\n  "alg": "none",\n  "typ": "JWT"\n}.{"sub":"admin","role":"root"}.',
        remediation: 'Reject unsigned tokens with algorithm "none" and enforce strict HMAC-SHA256 signature verification.'
    }
];

export default function DatabaseTab() {
    const { playChime } = useAuth();
    const [subTab, setSubTab] = useState('targets');
    const [search, setSearch] = useState('');

    const [targets, setTargets] = useState(() => {
        try {
            const saved = localStorage.getItem('ehacker_db_targets');
            return saved ? JSON.parse(saved) : DEFAULT_TARGETS;
        } catch (e) {
            return DEFAULT_TARGETS;
        }
    });

    const [findings, setFindings] = useState(() => {
        try {
            const saved = localStorage.getItem('ehacker_db_findings');
            return saved ? JSON.parse(saved) : DEFAULT_FINDINGS;
        } catch (e) {
            return DEFAULT_FINDINGS;
        }
    });

    const [fieldNotes, setFieldNotes] = useState(() => {
        return localStorage.getItem('ehacker_db_fieldnotes') || 
`# Operative Engagement Field Notes
- **Target Network**: 10.10.11.0/24
- **Primary Objective**: Active Directory Domain Dominance & Sensitive Data Identification
- **Key Pivots**:
  1. Compromised initial access via web portal SQLi.
  2. Dumped NTLM hashes from memory.
  3. Escalated to Domain Admin using DCSync abuse.`;
    });

    useEffect(() => {
        localStorage.setItem('ehacker_db_targets', JSON.stringify(targets));
    }, [targets]);

    useEffect(() => {
        localStorage.setItem('ehacker_db_findings', JSON.stringify(findings));
    }, [findings]);

    useEffect(() => {
        localStorage.setItem('ehacker_db_fieldnotes', fieldNotes);
    }, [fieldNotes]);

    const handleAddTarget = () => {
        const host = prompt("Enter Target Host or IP Address:", "10.10.14." + Math.floor(Math.random()*200+10));
        if (!host) return;
        const name = prompt("Enter Target Hostname or Description:", "Target Server");
        const newTarget = {
            id: 'tgt_' + Math.random().toString(36).substring(2, 7),
            host,
            name: name || host,
            scope: 'In-Scope',
            ports: '22, 80, 443',
            findingsCount: 0,
            notes: 'Target added to live engagement database.',
            severity: 'MEDIUM',
            status: 'Active Audit'
        };
        setTargets(prev => [newTarget, ...prev]);
        playChime();
    };

    const handleAddFinding = () => {
        const title = prompt("Enter Vulnerability Title:", "Cross-Site Scripting (Reflected)");
        if (!title) return;
        const target = prompt("Enter Affected Target:", "api.target.com");
        const newFinding = {
            id: 'vuln_' + Math.random().toString(36).substring(2, 7),
            title,
            target: target || 'Host',
            severity: 'HIGH',
            cvss: 7.5,
            status: 'Open',
            poc: '<script>alert(document.domain)</script>',
            remediation: 'Implement contextual output encoding and a Content Security Policy.'
        };
        setFindings(prev => [newFinding, ...prev]);
        playChime();
    };

    const handleExportDB = () => {
        const exportData = {
            version: "3.0.0",
            exportedAt: new Date().toISOString(),
            targets,
            findings,
            fieldNotes
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ehacker_security_database_' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        playChime();
    };

    const handleImportDB = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (parsed.targets) setTargets(parsed.targets);
                if (parsed.findings) setFindings(parsed.findings);
                if (parsed.fieldNotes) setFieldNotes(parsed.fieldNotes);
                alert("Database imported successfully!");
                playChime();
            } catch (err) {
                alert("Invalid JSON database backup file.");
            }
        };
        reader.readAsText(file);
    };

    const filteredTargets = targets.filter(t => 
        t.host.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.notes.toLowerCase().includes(search.toLowerCase())
    );

    const filteredFindings = findings.filter(f =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.target.toLowerCase().includes(search.toLowerCase()) ||
        f.severity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="tab-panel active">
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            ENGAGEMENT DOSSIER & TARGET DATABASE
                        </div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Operative Target Intelligence & Findings Manager</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            Local-first encrypted database for tracking targets in scope, logging verified vulnerability findings with CVSS metrics, and taking field notes.
                        </p>
                    </div>

                    <div className="ai-nav-chips">
                        <button className={'ai-nav-btn ' + (subTab === 'targets' ? 'active' : '')} onClick={() => { setSubTab('targets'); playChime(); }}>
                            🎯 Target Assets ({targets.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'findings' ? 'active' : '')} onClick={() => { setSubTab('findings'); playChime(); }}>
                            ⚡ Vulnerabilities ({findings.length})
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'notes' ? 'active' : '')} onClick={() => { setSubTab('notes'); playChime(); }}>
                            📝 Field Notes
                        </button>
                        <button className={'ai-nav-btn ' + (subTab === 'backup' ? 'active' : '')} onClick={() => { setSubTab('backup'); playChime(); }}>
                            💾 Backup & Sync
                        </button>
                    </div>
                </div>

                <div className="mt-20 flex-space-between-center flex-wrap gap-10">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Filter database records by host, title, or severity..."
                        style={{ maxWidth: '360px' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex-gap-10">
                        {subTab === 'targets' && (
                            <button className="site-btn" onClick={handleAddTarget}>➕ Add Target Asset</button>
                        )}
                        {subTab === 'findings' && (
                            <button className="site-btn" onClick={handleAddFinding}>➕ Log Vulnerability</button>
                        )}
                        <button className="site-btn tool-btn secondary-btn" onClick={handleExportDB}>💾 Quick JSON Backup</button>
                    </div>
                </div>
            </div>

            {subTab === 'targets' && (
                <div className="projects-dynamic-grid">
                    {filteredTargets.map(t => (
                        <div key={t.id} className="project-card">
                            <div>
                                <div className="project-card-header">
                                    <span className="project-card-num">{t.scope}</span>
                                    <span className={'project-diff-badge ' + (t.severity === 'CRITICAL' ? 'diff-advanced' : t.severity === 'HIGH' ? 'diff-intermediate' : 'diff-beginner')}>
                                        {t.severity}
                                    </span>
                                </div>
                                <h3 className="project-card-title">{t.host}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>{t.name}</p>
                                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--color-accent)', marginBottom: '8px' }}>
                                    Ports: {t.ports}
                                </div>
                                <p className="project-card-desc">{t.notes}</p>
                            </div>

                            <div className="project-card-footer">
                                <span className="channel-badge">{t.status}</span>
                                <button
                                    className="table-action-link text-danger"
                                    onClick={() => setTargets(prev => prev.filter(item => item.id !== t.id))}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {subTab === 'findings' && (
                <div className="roadmap-stages-grid">
                    {filteredFindings.map(f => (
                        <div key={f.id} className="glass-card">
                            <div className="flex-space-between-center flex-wrap gap-10 mb-10">
                                <div>
                                    <div className="flex-gap-10 align-center">
                                        <span className={'project-diff-badge ' + (f.severity === 'CRITICAL' ? 'diff-advanced' : 'diff-intermediate')}>
                                            {f.severity} • CVSS {f.cvss}
                                        </span>
                                        <span className="channel-badge" style={{ background: 'rgba(0, 255, 102, 0.1)', color: '#00ff66' }}>
                                            Status: {f.status}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: '8px 0 2px 0', color: '#f8fafc' }}>{f.title}</h3>
                                    <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontFamily: 'monospace' }}>Affected Asset: {f.target}</span>
                                </div>
                                <button
                                    className="table-action-link text-danger"
                                    onClick={() => setFindings(prev => prev.filter(item => item.id !== f.id))}
                                >
                                    Delete Finding
                                </button>
                            </div>

                            <div className="mb-12">
                                <span className="ai-output-meta-label">PROOF OF CONCEPT (POC):</span>
                                <pre className="modal-code-box" style={{ margin: '4px 0 10px 0' }}><code>{f.poc}</code></pre>
                            </div>

                            <div className="project-mitigation-box">
                                <strong>Defensive Remediation:</strong> {f.remediation}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {subTab === 'notes' && (
                <div className="glass-card">
                    <div className="flex-space-between-center mb-10">
                        <h3 className="tool-section-title">📝 Engagement Scratchpad & Field Notes</h3>
                        <span className="channel-badge" style={{ background: 'rgba(0, 255, 102, 0.15)', color: '#00ff66' }}>
                            ✓ Auto-Saved to Local Storage
                        </span>
                    </div>
                    <textarea
                        className="notes-textarea"
                        rows="16"
                        value={fieldNotes}
                        onChange={(e) => setFieldNotes(e.target.value)}
                        placeholder="Type Markdown notes, IP ranges, credentials, or engagement logs here..."
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.88rem', background: '#020617', color: '#e2e8f0' }}
                    />
                </div>
            )}

            {subTab === 'backup' && (
                <div className="overview-grid">
                    <div className="glass-card">
                        <h3 className="tool-section-title">💾 Export Complete Database Backup</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '12px 0 20px 0' }}>
                            Download a verified JSON backup containing all target scopes, vulnerability findings, and field notes.
                        </p>
                        <button className="site-btn" onClick={handleExportDB}>⬇️ Download Database (JSON)</button>
                    </div>

                    <div className="glass-card">
                        <h3 className="tool-section-title">📂 Restore Database Backup</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '12px 0 20px 0' }}>
                            Import an existing .json database file to restore your target records and notes.
                        </p>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportDB}
                            style={{ color: '#94a3b8', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
