import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LockScreenModal() {
    const { isLocked, setIsLocked, activeProfile, userAccounts, playChime } = useAuth();
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
            setDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isLocked) return null;

    const handleUnlock = (isBiometric = false) => {
        if (isBiometric) {
            setIsLocked(false);
            setPass('');
            setError('');
            playChime();
            return;
        }

        const trimmed = pass.trim();
        if (!trimmed) {
            setError('Please enter your passphrase or use biometric bypass.');
            playChime();
            return;
        }

        // Match against userAccounts
        const matched = (userAccounts || []).some(
            acc => acc.profileId === activeProfile.id && acc.password === trimmed
        ) || (userAccounts || []).some(
            acc => acc.password === trimmed
        );

        if (matched) {
            setIsLocked(false);
            setPass('');
            setError('');
            playChime();
        } else {
            setError('Invalid cryptographic passphrase. Access denied.');
            playChime();
        }
    };

    return (
        <div className="modal-overlay lock-screen-overlay active">
            <div className="lock-screen-dialog">
                <div className="lock-icon-glow"></div>
                <h2 className="lock-title">WORKSTATION LOCKED</h2>
                <div className="lock-time-display">{time}</div>
                <div className="lock-date-display">{date}</div>

                <div className="lock-user-card mt-20">
                    <div className="operative-avatar-circle" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 700, overflow: 'hidden' }}>
                        {activeProfile.githubAvatar ? (
                            <img src={activeProfile.githubAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            activeProfile.avatar || '01'
                        )}
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{activeProfile.callsign}</h4>
                        <span style={{ color: 'var(--color-accent)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                            {activeProfile.clearance}
                        </span>
                    </div>
                </div>

                <div className="lock-input-group mt-20">
                    <input
                        type="password"
                        className="search-input"
                        placeholder="Enter passphrase to unlock..."
                        value={pass}
                        onChange={(e) => { setPass(e.target.value); setError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(false); }}
                    />
                    <button className="site-btn" style={{ minWidth: '120px' }} onClick={() => handleUnlock(false)}>Unlock</button>
                </div>

                {error && (
                    <div style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '8px', fontFamily: 'monospace' }}>
                        {error}
                    </div>
                )}

                <button
                    className="table-action-link mt-15"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleUnlock(true)}
                >
                    Touch Biometric Bypass
                </button>
            </div>
        </div>
    );
}
