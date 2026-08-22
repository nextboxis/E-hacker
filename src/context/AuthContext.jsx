import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_PROFILES = [
    {
        id: 'prof_root',
        callsign: 'root@nextboxis',
        clearance: 'Level 5 • TOP SECRET',
        domain: 'full',
        avatar: '🥷',
        bio: 'Knowledge is free. We are anonymous. Security is an illusion.',
        created_at: '2026-08-22',
        apiKey: 'ehk_live_sec_root9482x',
        xp: 350,
        level: 3,
        completedProjects: [1, 2, 3],
        checkedSkills: ['sec-fund', 'linux-cli'],
        notes: {}
    },
    {
        id: 'prof_redteam',
        callsign: 'Ghost_RedTeam',
        clearance: 'Level 4 • SECRET',
        domain: 'web',
        avatar: '🕷️',
        bio: 'Offensive Security Specialist & External Penetration Tester',
        created_at: '2026-08-22',
        apiKey: 'ehk_live_sec_ghost2819y',
        xp: 150,
        level: 2,
        completedProjects: [1, 2],
        checkedSkills: ['sec-fund'],
        notes: {}
    },
    {
        id: 'prof_soc',
        callsign: 'Sentinel_SOC',
        clearance: 'Level 4 • SECRET',
        domain: 'soc',
        avatar: '🛡️',
        bio: 'Blue Team Threat Hunter & SIEM Detection Engineer',
        created_at: '2026-08-22',
        apiKey: 'ehk_live_sec_soc8392z',
        xp: 220,
        level: 2,
        completedProjects: [3, 4],
        checkedSkills: ['wireshark-audit'],
        notes: {}
    }
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [allProfiles, setAllProfiles] = useState(() => {
        try {
            const saved = localStorage.getItem('roadmap-multi-profiles');
            return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
        } catch (e) {
            return DEFAULT_PROFILES;
        }
    });

    const [activeProfileId, setActiveProfileId] = useState(() => {
        return localStorage.getItem('roadmap-active-profile-id') || 'prof_root';
    });

    const [activeTab, setActiveTab] = useState('overview');
    const [activeDomain, setActiveDomain] = useState('full');
    const [isLocked, setIsLocked] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [activeProjectModal, setActiveProjectModal] = useState(null);

    const activeProfile = allProfiles.find(p => p.id === activeProfileId) || allProfiles[0];

    useEffect(() => {
        localStorage.setItem('roadmap-multi-profiles', JSON.stringify(allProfiles));
        localStorage.setItem('roadmap-active-profile-id', activeProfileId);
    }, [allProfiles, activeProfileId]);

    const playChime = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {}
    };

    const switchProfile = (id) => {
        const found = allProfiles.find(p => p.id === id);
        if (found) {
            setActiveProfileId(id);
            setActiveDomain(found.domain || 'full');
            playChime();
        }
    };

    const createProfile = (profData) => {
        const newProf = {
            id: 'prof_' + Math.random().toString(36).substring(2, 8),
            callsign: profData.callsign || 'Operative',
            clearance: profData.clearance || 'Level 1 • UNCLASSIFIED',
            domain: profData.domain || 'full',
            avatar: profData.avatar || '🥷',
            bio: profData.bio || 'Security Operative',
            created_at: new Date().toISOString().slice(0, 10),
            apiKey: 'ehk_live_sec_' + Math.random().toString(36).substring(2, 12),
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {}
        };
        setAllProfiles(prev => [...prev, newProf]);
        setActiveProfileId(newProf.id);
        setActiveDomain(newProf.domain);
        playChime();
    };

    const updateActiveProfile = (updates) => {
        setAllProfiles(prev => prev.map(p => {
            if (p.id === activeProfileId) {
                return { ...p, ...updates };
            }
            return p;
        }));
        playChime();
    };

    const deleteProfile = (id) => {
        if (allProfiles.length <= 1) return;
        setAllProfiles(prev => prev.filter(p => p.id !== id));
        if (activeProfileId === id) {
            const next = allProfiles.find(p => p.id !== id);
            if (next) setActiveProfileId(next.id);
        }
    };

    const addXp = (amount) => {
        updateActiveProfile({
            xp: (activeProfile.xp || 0) + amount,
            level: Math.floor(((activeProfile.xp || 0) + amount) / 100) + 1
        });
    };

    const toggleProjectComplete = (projId) => {
        const current = activeProfile.completedProjects || [];
        const isDone = current.includes(projId);
        const updated = isDone ? current.filter(id => id !== projId) : [...current, projId];
        const xpDelta = isDone ? -50 : 50;
        updateActiveProfile({
            completedProjects: updated,
            xp: Math.max(0, (activeProfile.xp || 0) + xpDelta),
            level: Math.max(1, Math.floor(((activeProfile.xp || 0) + xpDelta) / 100) + 1)
        });
        playChime();
    };

    const toggleSkill = (skillId) => {
        const current = activeProfile.checkedSkills || [];
        const isDone = current.includes(skillId);
        const updated = isDone ? current.filter(id => id !== skillId) : [...current, skillId];
        const xpDelta = isDone ? -25 : 25;
        updateActiveProfile({
            checkedSkills: updated,
            xp: Math.max(0, (activeProfile.xp || 0) + xpDelta)
        });
        playChime();
    };

    // Keyboard Shortcuts (Ctrl+K, Esc)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSpotlightOpen(prev => !prev);
            } else if (e.key === 'Escape') {
                setIsSpotlightOpen(false);
                setIsAuthModalOpen(false);
                setIsLogoutModalOpen(false);
                setIsTerminalModalOpen(false);
                setActiveProjectModal(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <AuthContext.Provider value={{
            activeProfile,
            allProfiles,
            activeProfileId,
            activeTab,
            setActiveTab,
            activeDomain,
            setActiveDomain,
            isLocked,
            setIsLocked,
            isAuthModalOpen,
            setIsAuthModalOpen,
            isLogoutModalOpen,
            setIsLogoutModalOpen,
            isTerminalModalOpen,
            setIsTerminalModalOpen,
            isSpotlightOpen,
            setIsSpotlightOpen,
            activeProjectModal,
            setActiveProjectModal,
            switchProfile,
            createProfile,
            updateActiveProfile,
            deleteProfile,
            addXp,
            toggleProjectComplete,
            toggleSkill,
            playChime
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
