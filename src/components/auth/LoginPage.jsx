import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { login, loginUser, registerUser, resetUserPassword, playChime } = useAuth();
    const [mode, setMode] = useState('signin'); // 'signin', 'signup', or 'forgot'
    const [username, setUsername] = useState('root@nextboxis');
    const [password, setPassword] = useState('shadowprotocol2026');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [domain, setDomain] = useState('full');
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [isBooting, setIsBooting] = useState(false);
    const [bootStep, setBootStep] = useState('');
    const [ghPreview, setGhPreview] = useState(null);

    // Live GitHub user lookup preview
    useEffect(() => {
        const clean = username.trim();
        if (!clean || clean.length < 2 || clean.includes('@')) {
            setGhPreview(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`https://api.github.com/users/${encodeURIComponent(clean)}`);
                if (res.ok) {
                    const data = await res.json();
                    setGhPreview({
                        avatar: data.avatar_url,
                        name: data.name || data.login,
                        bio: data.bio,
                        repos: data.public_repos
                    });
                } else {
                    setGhPreview(null);
                }
            } catch (e) {
                setGhPreview(null);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [username]);

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

        if (mode === 'signin') {
            const res = loginUser({ username, password, autoAuth: false });
            if (res.success) {
                startBootSequence(() => {
                    login(res.profileId);
                });
            } else {
                setAuthError(res.error || 'Authentication failed.');
                playChime();
            }
        } else if (mode === 'signup') {
            // Sign Up / Register
            if (!password || password.length < 4) {
                setAuthError('Password must be at least 4 characters.');
                return;
            }

            const res = await registerUser({
                username,
                password,
                domain,
                clearance: 'Level 2 • RESTRICTED',
                autoAuth: false
            });

            if (res.success) {
                startBootSequence(() => {
                    login(res.profileId);
                });
            } else {
                setAuthError(res.error || 'Registration failed.');
                playChime();
            }
        } else if (mode === 'forgot') {
            // Reset / Update Password
            if (!password || password.length < 4) {
                setAuthError('New password must be at least 4 characters.');
                return;
            }
            if (confirmPassword && password !== confirmPassword) {
                setAuthError('Passwords do not match. Please verify.');
                return;
            }

            const res = resetUserPassword({ username, newPassword: password });
            if (res.success) {
                setAuthSuccess('Passphrase updated successfully in registry! Launching workstation...');
                playChime();
                setTimeout(() => {
                    startBootSequence(() => {
                        login(res.profileId);
                    });
                }, 700);
            } else {
                setAuthError(res.error || 'Passphrase reset failed.');
                playChime();
            }
        }
    };

    return (
        <div className="split-login-wrapper">
            {/* Background Ambient Glow */}
            <div className="split-login-ambient">
                <div className="ambient-blob blob-left"></div>
                <div className="ambient-blob blob-right"></div>
            </div>

            {/* Split Authentication Card */}
            <div className="split-card-container">
                {/* Left Side: Form */}
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
                            <div className="flex-space-between-center align-center mb-10">
                                <h1 className="split-form-title" style={{ margin: 0 }}>
                                    {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset Passphrase'}
                                </h1>
                                {ghPreview && (
                                    <div className="github-user-preview-chip">
                                        <img src={ghPreview.avatar} alt="github" className="github-preview-avatar" />
                                        <span className="github-preview-name">{ghPreview.name}</span>
                                    </div>
                                )}
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '0 0 20px 0' }}>
                                {mode === 'signin' 
                                    ? 'Sign in with your GitHub username or operative callsign.' 
                                    : mode === 'signup'
                                    ? 'Create your custom operative account with your GitHub handle and password.'
                                    : 'Enter your operative callsign and choose a new passphrase.'}
                            </p>

                            {authError && (
                                <div className="auth-feedback-box error mb-15">
                                    {authError}
                                </div>
                            )}

                            {authSuccess && (
                                <div className="auth-feedback-box success mb-15">
                                    {authSuccess}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="split-auth-form">
                                {/* GitHub Username / Handle Input */}
                                <div className="pill-input-group">
                                    <div className="pill-input-icon">
                                        {/* GitHub / User vector icon */}
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="pill-input-field"
                                        placeholder="GitHub Username / Callsign"
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setAuthError(''); setAuthSuccess(''); }}
                                        required
                                    />
                                </div>

                                {/* Custom Password Input */}
                                <div className="pill-input-group">
                                    <div className="pill-input-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        className="pill-input-field"
                                        placeholder={mode === 'forgot' ? 'New Passphrase (min 4 chars)' : 'Password'}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setAuthError(''); setAuthSuccess(''); }}
                                        required
                                    />
                                </div>

                                {/* Confirm Password on Reset */}
                                {mode === 'forgot' && (
                                    <div className="pill-input-group">
                                        <div className="pill-input-icon">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            className="pill-input-field"
                                            placeholder="Confirm New Passphrase"
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setAuthError(''); setAuthSuccess(''); }}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Specialization track on Sign Up */}
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
                                            <option value="full">Full Spectrum Hacker</option>
                                            <option value="web">Web Pentesting</option>
                                            <option value="network">Network & Infrastructure</option>
                                            <option value="soc">SOC & Blue Team Defense</option>
                                            <option value="malware">Malware & Reverse Eng</option>
                                            <option value="osint">OSINT Specialist</option>
                                        </select>
                                    </div>
                                )}

                                {/* Forgot Password helper link */}
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
                                            Forgot Password?
                                        </a>
                                    </div>
                                )}

                                {/* Primary Purple Button */}
                                <button type="submit" className="purple-pill-btn">
                                    <span>
                                        {mode === 'signin' ? 'Log In' : mode === 'signup' ? 'Sign Up & Save Account' : 'Update Passphrase & Launch'}
                                    </span>
                                    <svg viewBox="0 0 24 24" className="purple-btn-icon">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </form>

                            {/* Mode Toggle Footer */}
                            <div className="split-toggle-footer">
                                {mode === 'signin' ? (
                                    <p>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            className="split-toggle-btn"
                                            onClick={() => { setMode('signup'); setAuthError(''); setAuthSuccess(''); playChime(); }}
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                ) : mode === 'signup' ? (
                                    <p>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            className="split-toggle-btn"
                                            onClick={() => { setMode('signin'); setAuthError(''); setAuthSuccess(''); playChime(); }}
                                        >
                                            Log In
                                        </button>
                                    </p>
                                ) : (
                                    <p>
                                        Remembered your passphrase?{' '}
                                        <button
                                            type="button"
                                            className="split-toggle-btn"
                                            onClick={() => { setMode('signin'); setAuthError(''); setAuthSuccess(''); playChime(); }}
                                        >
                                            Back to Log In
                                        </button>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Scenic Vector Illustration Panel */}
                <div className="split-art-panel">
                    <div className="split-art-inner">
                        <svg
                            viewBox="0 0 500 500"
                            className="scenic-illustration-svg"
                            preserveAspectRatio="xMidYMid slice"
                        >
                            <defs>
                                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#fca5a5" />
                                    <stop offset="35%" stopColor="#fb923c" />
                                    <stop offset="65%" stopColor="#c084fc" />
                                    <stop offset="100%" stopColor="#7e22ce" />
                                </linearGradient>

                                <linearGradient id="mountGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#6b21a8" />
                                    <stop offset="100%" stopColor="#3b0764" />
                                </linearGradient>

                                <linearGradient id="mountGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#7e22ce" />
                                    <stop offset="100%" stopColor="#4c1d95" />
                                </linearGradient>

                                <linearGradient id="terraceGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#c4b5fd" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>

                                <linearGradient id="terraceGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#a5b4fc" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>

                                <linearGradient id="terraceGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#93c5fd" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>

                                <linearGradient id="terraceGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#bfdbfe" />
                                    <stop offset="100%" stopColor="#3730a3" />
                                </linearGradient>

                                <linearGradient id="terraceGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#dbeafe" />
                                    <stop offset="100%" stopColor="#312e81" />
                                </linearGradient>

                                <linearGradient id="terraceBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#2e1065" />
                                    <stop offset="100%" stopColor="#1e1b4b" />
                                </linearGradient>
                            </defs>

                            <rect width="500" height="500" fill="url(#skyGrad)" />
                            <ellipse cx="400" cy="45" rx="55" ry="18" fill="#ffedd5" opacity="0.85" />
                            <ellipse cx="445" cy="40" rx="40" ry="16" fill="#ffffff" opacity="0.9" />
                            <ellipse cx="365" cy="50" rx="35" ry="14" fill="#fed7aa" opacity="0.8" />
                            <ellipse cx="40" cy="110" rx="25" ry="9" fill="#ffedd5" opacity="0.75" />

                            <path d="M220 180 Q320 60 480 120 L500 180 L500 300 L220 300 Z" fill="url(#mountGrad1)" />
                            <path d="M0 160 Q120 70 280 150 Q380 200 500 170 L500 320 L0 320 Z" fill="url(#mountGrad2)" />
                            <path d="M-20 200 Q70 220 130 260 Q80 320 -20 340 Z" fill="#2e1065" />

                            <path
                                d="M60 220 Q80 200 95 190 M80 200 Q100 185 110 175 M85 205 Q110 200 125 195 M90 215 Q115 220 130 225"
                                stroke="#1e1b4b"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />

                            <path d="M450 160 C400 165 370 185 390 200 C430 210 490 200 500 190 L500 160 Z" fill="url(#terraceGrad1)" />
                            <path d="M450 160 C400 165 370 185 390 200 C430 210 490 200 500 190" stroke="url(#terraceBorder)" strokeWidth="12" strokeLinecap="round" fill="none" />

                            <path d="M370 195 C310 200 270 225 295 245 C350 260 480 235 500 220 L500 190 C450 200 400 210 370 195 Z" fill="url(#terraceGrad2)" />
                            <path d="M370 195 C310 200 270 225 295 245 C350 260 480 235 500 220" stroke="url(#terraceBorder)" strokeWidth="14" strokeLinecap="round" fill="none" />

                            <path d="M280 240 C200 250 160 275 190 300 C270 320 450 285 500 270 L500 220 C420 250 330 255 280 240 Z" fill="url(#terraceGrad3)" />
                            <path d="M280 240 C200 250 160 275 190 300 C270 320 450 285 500 270" stroke="url(#terraceBorder)" strokeWidth="16" strokeLinecap="round" fill="none" />

                            <path d="M180 295 C80 305 40 340 70 370 C170 395 440 350 500 330 L500 270 C410 305 240 315 180 295 Z" fill="url(#terraceGrad4)" />
                            <path d="M180 295 C80 305 40 340 70 370 C170 395 440 350 500 330" stroke="url(#terraceBorder)" strokeWidth="20" strokeLinecap="round" fill="none" />

                            <path d="M60 365 C-20 375 -40 420 -10 460 C120 490 400 440 500 410 L500 330 C380 370 120 380 60 365 Z" fill="url(#terraceGrad5)" />
                            <path d="M60 365 C-20 375 -40 420 -10 460 C120 490 400 440 500 410" stroke="url(#terraceBorder)" strokeWidth="24" strokeLinecap="round" fill="none" />

                            <g stroke="#312e81" strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
                                <line x1="410" y1="180" x2="410" y2="187" />
                                <line x1="430" y1="182" x2="430" y2="189" />
                                <line x1="450" y1="178" x2="450" y2="185" />
                                <line x1="470" y1="180" x2="470" y2="187" />
                                <line x1="320" y1="220" x2="320" y2="230" />
                                <line x1="345" y1="224" x2="345" y2="234" />
                                <line x1="375" y1="220" x2="375" y2="230" />
                                <line x1="405" y1="225" x2="405" y2="235" />
                                <line x1="435" y1="220" x2="435" y2="230" />
                                <line x1="220" y1="265" x2="220" y2="278" />
                                <line x1="250" y1="270" x2="250" y2="283" />
                                <line x1="285" y1="268" x2="285" y2="281" />
                                <line x1="320" y1="275" x2="320" y2="288" />
                                <line x1="360" y1="270" x2="360" y2="283" />
                                <line x1="400" y1="272" x2="400" y2="285" />
                                <line x1="110" y1="330" x2="110" y2="345" />
                                <line x1="145" y1="335" x2="145" y2="350" />
                                <line x1="185" y1="340" x2="185" y2="355" />
                                <line x1="230" y1="342" x2="230" y2="357" />
                                <line x1="275" y1="338" x2="275" y2="353" />
                                <line x1="320" y1="340" x2="320" y2="355" />
                                <line x1="20" y1="410" x2="20" y2="430" />
                                <line x1="60" y1="415" x2="60" y2="435" />
                                <line x1="105" y1="425" x2="105" y2="445" />
                                <line x1="155" y1="430" x2="155" y2="450" />
                                <line x1="210" y1="428" x2="210" y2="448" />
                                <line x1="270" y1="420" x2="270" y2="440" />
                                <line x1="330" y1="415" x2="330" y2="435" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
