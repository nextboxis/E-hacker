import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LockScreenModal() {
    const { isLocked, setIsLocked, activeProfile, playChime } = useAuth();
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    const [pass, setPass] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
            setDate(now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isLocked) return null;

    const handleUnlock = () => {
        setIsLocked(false);
        setPass('');
        playChime();
    };

    return (
        <div className="modal-overlay lock-screen-overlay active">
            <div className="lock-screen-dialog">
                <div className="lock-icon-glow"></div>
                <h2 className="lock-title">WORKSTATION LOCKED</h2>
                <div className="lock-time-display">{time}</div>
                <div className="lock-date-display">{date}</div>

                <div className="lock-user-card mt-20">
                    <div className="operative-avatar-circle" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 700 }}>
                        {activeProfile.avatar || '01'}
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
                        onChange={(e) => setPass(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
                    />
                    <button className="site-btn" style={{ minWidth: '120px' }} onClick={handleUnlock}>Unlock</button>
                </div>

                <button
                    className="table-action-link mt-15"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={handleUnlock}
                >
                    Touch Biometric Bypass
                </button>
            </div>
        </div>
    );
}
