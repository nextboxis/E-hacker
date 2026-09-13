import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

function getPasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: 'NONE', color: '#6b7280', percent: 0 };
    let score = 0;
    if (pwd.length >= 4) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) {
        return { score: 1, label: 'WEAK', color: '#ef4444', percent: 25 };
    } else if (score === 2 || score === 3) {
        return { score: 2, label: 'MEDIUM', color: '#f59e0b', percent: 55 };
    } else if (score === 4) {
        return { score: 3, label: 'STRONG', color: '#10b981', percent: 80 };
    } else {
        return { score: 4, label: 'MILITARY GRADE', color: '#38bdf8', percent: 100 };
    }
}

export default function LoginPage() {
    const { login, loginUser, registerUser, resetUserPassword, playChime } = useAuth();
    const [mode, setMode] = useState('signin'); // 'signin', 'signup', or 'forgot'
    
    // Clean, empty default inputs (no hardcoded presets or exposed IDs)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [domain, setDomain] = useState('full');
    
    // Password visibility defaults strictly to false (masked)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [isBooting, setIsBooting] = useState(false);
    const [bootStep, setBootStep] = useState('');

    // Dynamic date and real-time live clock (no hardcoded dates)
    const [liveTime, setLiveTime] = useState(() => new Date().toTimeString().slice(0, 8));
    const [todayIso, setTodayIso] = useState(() => new Date().toISOString().slice(0, 10));

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setLiveTime(now.toTimeString().slice(0, 8));
            setTodayIso(now.toISOString().slice(0, 10));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const pwdStrength = getPasswordStrength(password);

    const hudLogEntries = [
        { time: liveTime, tag: 'SYS_AUTH', msg: 'Kernel integrity verified. TLS 1.3 active.' },
        { time: liveTime, tag: 'CRYPTO', msg: 'Post-Quantum Lattice KEM initialized.' },
        { time: liveTime, tag: 'NET_SURV', msg: 'Perimeter scanning: 0 intrusive probes detected.' },
        { time: liveTime, tag: 'DB_STORE', msg: 'Persistent database mounted & secured.' },
        { time: liveTime, tag: 'DEFENSE', msg: 'EDR telemetry feed synchronized across 118 labs.' }
    ];

    const startBootSequence = (onComplete) => {
        setIsBooting(true);
        playChime();
        setBootStep('CONNECTING TO CIPHER VAULT...');

        setTimeout(() => {
            setBootStep('VALIDATING SECURITY CREDENTIALS...');
            playChime();
        }, 350);

        setTimeout(() => {
            setBootStep('SYNCHRONIZING OPERATIVE DOSSIER...');
            playChime();
        }, 700);

        setTimeout(() => {
            setBootStep('BOOTING WORKSTATION...');
            if (onComplete) onComplete();
        }, 1100);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthSuccess('');

        const cleanUser = username.trim();
        if (!cleanUser) {
            setAuthError('Please enter a valid operative callsign or username.');
            return;
        }

        if (mode === 'signin') {
            const res = loginUser({ username: cleanUser, password, autoAuth: false });
            if (res.success) {
                startBootSequence(() => {
                    login(res.profileId);
                });
            } else {
                setAuthError(res.error || 'Authentication failed. Please verify credentials.');
                playChime();
            }
        } else if (mode === 'signup') {
            // Sign Up / Register
            if (!password || password.length < 4) {
                setAuthError('Passphrase must be at least 4 characters.');
                return;
            }

            if (password !== confirmPassword) {
                setAuthError('Passphrase confirmation does not match. Please verify.');
                return;
            }

            const res = await registerUser({
                username: cleanUser,
                password,
                domain,
                clearance: 'Level 2 • RESTRICTED',
                autoAuth: false
            });

            if (res.success) {
                setAuthSuccess('Operative account provisioned and synchronized to database!');
                playChime();
                setTimeout(() => {
                    startBootSequence(() => {
                        login(res.profileId);
                    });
                }, 750);
            } else {
                setAuthError(res.error || 'Registration failed. Callsign may already be taken.');
                playChime();
            }
        } else if (mode === 'forgot') {
            // Reset / Update Password
            if (!password || password.length < 4) {
                setAuthError('New passphrase must be at least 4 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setAuthError('Passphrases do not match. Please verify.');
                return;
            }

            const res = resetUserPassword({ username: cleanUser, newPassword: password });
            if (res.success) {
                setAuthSuccess('Passphrase updated successfully in registry! Launching workstation...');
                playChime();
                setTimeout(() => {
                    startBootSequence(() => {
                        login(res.profileId);
                    });
                }, 750);
            } else {
                setAuthError(res.error || 'Passphrase reset failed. Callsign not found.');
                playChime();
            }
        }
    };

    return (
        <div className="split-login-wrapper">
            {/* Ambient Background Glows */}
            <div className="split-login-ambient">
                <div className="ambient-blob blob-left"></div>
                <div className="ambient-blob blob-right"></div>
            </div>

            {/* Main Cyber Authentication Container */}
            <div className="split-card-container cyber-auth-card">
                {/* Left Side: Form Panel */}
                <div className="split-form-panel">
                    {isBooting ? (
                        <div className="split-boot-loader">
                            <div className="split-boot-spinner"></div>
                            <h3 className="split-boot-title">AUTHORIZING OPERATIVE</h3>
                            <p className="split-boot-status">{bootStep}</p>
                            <div className="split-boot-progress">
                                <div className="split-boot-progress-fill"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="split-form-content">
                            {/* Header Security Status Pill with Live Date */}
                            <div className="auth-system-badge mb-15">
                                <span className="auth-status-dot"></span>
                                <span className="auth-status-text">
                                    AUTH_DAEMON v3.2.0 • TLS 1.3 • {todayIso}
                                </span>
                            </div>

                            {/* Mode Segmented Tab Switcher */}
                            <div className="auth-mode-tabs mb-20">
                                <button
                                    type="button"
                                    className={`auth-mode-tab ${mode === 'signin' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('signin');
                                        setAuthError('');
                                        setAuthSuccess('');
                                        playChime();
                                    }}
                                >
                                    ⚡ Sign In
                                </button>
                                <button
                                    type="button"
                                    className={`auth-mode-tab ${mode === 'signup' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('signup');
                                        setConfirmPassword('');
                                        setAuthError('');
                                        setAuthSuccess('');
                                        playChime();
                                    }}
                                >
                                    🛡️ Register Operative
                                </button>
                            </div>

                            <div className="flex-space-between-center align-center mb-8">
                                <h1 className="split-form-title" style={{ margin: 0, fontSize: '1.85rem' }}>
                                    {mode === 'signin' ? 'Operative Sign In' : mode === 'signup' ? 'Provision Identity' : 'Reset Passphrase'}
                                </h1>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '0 0 16px 0' }}>
                                {mode === 'signin' 
                                    ? 'Authenticate credentials to unlock terminal clearance and active cyber labs.' 
                                    : mode === 'signup'
                                    ? 'Create an operative dossier with your secure callsign.'
                                    : 'Verify callsign and provision a replacement encryption passphrase.'}
                            </p>

                            {/* Error & Success Feedback Banners */}
                            {authError && (
                                <div className="auth-feedback-box error mb-15">
                                    <span className="auth-feedback-icon">⚠️</span>
                                    <span>{authError}</span>
                                </div>
                            )}

                            {authSuccess && (
                                <div className="auth-feedback-box success mb-15">
                                    <span className="auth-feedback-icon">✔</span>
                                    <span>{authSuccess}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="split-auth-form">
                                {/* Callsign / Username Input */}
                                <div className="pill-input-group">
                                    <div className="pill-input-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="pill-input-field"
                                        placeholder="Operative Callsign / Username"
                                        value={username}
                                        onChange={(e) => { 
                                            setUsername(e.target.value); 
                                            setAuthError(''); 
                                            setAuthSuccess(''); 
                                        }}
                                        autoComplete="username"
                                        required
                                    />
                                </div>

                                {/* Specialization Track (Sign Up mode only) */}
                                {mode === 'signup' && (
                                    <div className="pill-input-group">
                                        <div className="pill-input-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                            </svg>
                                        </div>
                                        <select
                                            className="pill-input-field pill-select-field"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                        >
                                            <option value="full">Full Spectrum Hacker (All Labs)</option>
                                            <option value="web">Web Application Pentesting</option>
                                            <option value="network">Network & Infrastructure Exploitation</option>
                                            <option value="soc">SOC & Blue Team Defense</option>
                                            <option value="malware">Malware Analysis & Reverse Engineering</option>
                                            <option value="osint">OSINT & Recon Specialist</option>
                                        </select>
                                    </div>
                                )}

                                {/* Password Input with Show/Hide Toggle (Default: Masked) */}
                                <div className="pill-input-group">
                                    <div className="pill-input-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="pill-input-field"
                                        placeholder={mode === 'forgot' ? 'New Passphrase (min 4 chars)' : 'Secret Passphrase'}
                                        value={password}
                                        onChange={(e) => { 
                                            setPassword(e.target.value); 
                                            setAuthError(''); 
                                            setAuthSuccess(''); 
                                        }}
                                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>

                                {/* Password Strength Meter in Sign Up / Reset mode */}
                                {(mode === 'signup' || mode === 'forgot') && password && (
                                    <div className="pwd-strength-container mb-12">
                                        <div className="flex-space-between-center mb-4">
                                            <span className="pwd-strength-label">SECURITY ENTROPY:</span>
                                            <span className="pwd-strength-val" style={{ color: pwdStrength.color }}>
                                                {pwdStrength.label}
                                            </span>
                                        </div>
                                        <div className="pwd-strength-track">
                                            <div
                                                className="pwd-strength-fill"
                                                style={{
                                                    width: `${pwdStrength.percent}%`,
                                                    backgroundColor: pwdStrength.color
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Confirm Password Field (Sign Up & Reset mode) */}
                                {(mode === 'signup' || mode === 'forgot') && (
                                    <div className="pill-input-group">
                                        <div className="pill-input-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                                            </svg>
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="pill-input-field"
                                            placeholder="Confirm Passphrase"
                                            value={confirmPassword}
                                            onChange={(e) => { 
                                                setConfirmPassword(e.target.value); 
                                                setAuthError(''); 
                                                setAuthSuccess(''); 
                                            }}
                                            autoComplete="new-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            title={showConfirmPassword ? 'Hide passphrase' : 'Show passphrase'}
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                )}

                                {/* Password Match Feedback Badge */}
                                {(mode === 'signup' || mode === 'forgot') && confirmPassword && (
                                    <div className="pwd-match-pill mb-12">
                                        {password === confirmPassword ? (
                                            <span style={{ color: '#4ade80' }}>✔ Passphrases match</span>
                                        ) : (
                                            <span style={{ color: '#f87171' }}>✖ Passphrases do not match</span>
                                        )}
                                    </div>
                                )}

                                {/* Forgot Password Link */}
                                {mode === 'signin' && (
                                    <div className="split-forgot-row">
                                        <a
                                            href="#forgot"
                                            className="split-forgot-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMode('forgot');
                                                setPassword('');
                                                setConfirmPassword('');
                                                setAuthError('');
                                                setAuthSuccess('');
                                                playChime();
                                            }}
                                        >
                                            Forgot Passphrase?
                                        </a>
                                    </div>
                                )}

                                {/* Primary Submit Button */}
                                <button type="submit" className="purple-pill-btn mt-6">
                                    <span>
                                        {mode === 'signin' ? 'Authenticate & Enter' : mode === 'signup' ? 'Provision Operative & Sync' : 'Update Passphrase & Launch'}
                                    </span>
                                    <svg viewBox="0 0 24 24" className="purple-btn-icon">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </form>

                            {/* Mode Toggle Footer Link */}
                            <div className="split-toggle-footer">
                                {mode === 'signin' ? (
                                    <p>
                                        Need a new operative profile?{' '}
                                        <button
                                            type="button"
                                            className="split-toggle-btn"
                                            onClick={() => { setMode('signup'); setConfirmPassword(''); setAuthError(''); setAuthSuccess(''); playChime(); }}
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Already have provisioned credentials?{' '}
                                        <button
                                            type="button"
                                            className="split-toggle-btn"
                                            onClick={() => { setMode('signin'); setAuthError(''); setAuthSuccess(''); playChime(); }}
                                        >
                                            Log In
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Cyber Tactical Command HUD */}
                <div className="split-art-panel cyber-tactical-hud">
                    <div className="hud-overlay-grid"></div>

                    {/* Top HUD Telemetry Bar with Real Live Date & Clock */}
                    <div className="hud-top-telemetry">
                        <div className="hud-brand-tag">
                            <span className="hud-brand-glow">E-HACKER</span>
                            <span className="hud-brand-sub">TACTICAL C2 // {todayIso} {liveTime} UTC</span>
                        </div>
                        <div className="hud-defcon-badge">
                            DEFCON 1 // ARMED
                        </div>
                    </div>

                    {/* Central Radar & Shield Scanner Vector */}
                    <div className="hud-central-display">
                        <div className="hud-radar-circle">
                            <div className="hud-radar-sweep-arm"></div>
                            <div className="hud-radar-ring ring-1"></div>
                            <div className="hud-radar-ring ring-2"></div>
                            <div className="hud-radar-ring ring-3"></div>
                            <div className="hud-radar-crosshair crosshair-h"></div>
                            <div className="hud-radar-crosshair crosshair-v"></div>

                            {/* Defensive Shield Hexagon */}
                            <svg viewBox="0 0 160 160" className="hud-hex-shield-svg">
                                <polygon
                                    points="80,10 145,45 145,115 80,150 15,115 15,45"
                                    fill="rgba(124, 58, 237, 0.1)"
                                    stroke="#8b5cf6"
                                    strokeWidth="2"
                                />
                                <polygon
                                    points="80,25 130,55 130,105 80,135 30,105 30,55"
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="1.5"
                                    strokeDasharray="4,4"
                                />
                                <circle cx="80" cy="80" r="18" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                                <circle cx="80" cy="80" r="6" fill="#38bdf8" />
                            </svg>

                            {/* Blip Indicators */}
                            <span className="hud-blip blip-1"></span>
                            <span className="hud-blip blip-2"></span>
                            <span className="hud-blip blip-3"></span>
                        </div>

                        <div className="hud-status-text-row mt-12">
                            <span className="hud-status-pill pill-cyan">ENCRYPTED LATTICE</span>
                            <span className="hud-status-pill pill-purple">ZERO-TRUST ACTIVE</span>
                        </div>
                    </div>

                    {/* Live Scrolling Terminal Telemetry Logs with Dynamic Time */}
                    <div className="hud-terminal-feed">
                        <div className="hud-terminal-header">
                            <span className="hud-terminal-dot"></span>
                            <span className="hud-terminal-title">LIVE C2 TELEMETRY STREAM</span>
                        </div>
                        <div className="hud-terminal-logs">
                            {hudLogEntries.map((log, i) => (
                                <div key={i} className="hud-log-line">
                                    <span className="hud-log-time">[{log.time}]</span>
                                    <span className="hud-log-tag">{log.tag}:</span>
                                    <span className="hud-log-msg">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom HUD Metrics Footer */}
                    <div className="hud-metrics-footer">
                        <div className="hud-metric-box">
                            <span className="hud-metric-label">THREAT STATUS</span>
                            <span className="hud-metric-val" style={{ color: '#f87171' }}>ELEVATED</span>
                        </div>
                        <div className="hud-metric-box">
                            <span className="hud-metric-label">ARSENAL</span>
                            <span className="hud-metric-val" style={{ color: '#38bdf8' }}>64 ENGINES</span>
                        </div>
                        <div className="hud-metric-box">
                            <span className="hud-metric-label">LAB MODULES</span>
                            <span className="hud-metric-val" style={{ color: '#4ade80' }}>118 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
