import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
    { id: 'cyberpunk', name: 'Cyberpunk Neon', primary: '#00f0ff', secondary: '#a855f7', tag: 'SOC AI', bg: '#050814' },
    { id: 'matrix', name: 'Matrix Terminal', primary: '#00ff66', secondary: '#22c55e', tag: 'OFFENSE', bg: '#020508' },
    { id: 'stealth', name: 'Deep Space Stealth', primary: '#38bdf8', secondary: '#3b82f6', tag: 'DEFENSE', bg: '#080d1a' },
    { id: 'crimson', name: 'Red Team Crimson', primary: '#ef4444', secondary: '#f97316', tag: 'EXPLOIT', bg: '#0c0406' },
    { id: 'tokyo', name: 'Tokyo Sunset', primary: '#f43f5e', secondary: '#f59e0b', tag: 'STEALTH', bg: '#0d0614' }
];

const DEFAULT_PROFILES = [
    {
        id: 'prof_root',
        callsign: 'root@nextboxis',
        clearance: 'Level 5 • TOP SECRET',
        domain: 'full',
        avatar: '01',
        githubAvatar: null,
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
        avatar: '02',
        githubAvatar: null,
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
        avatar: '03',
        githubAvatar: null,
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

const DEFAULT_ACCOUNTS = [
    {
        username: 'root@nextboxis',
        password: 'shadowprotocol2026',
        profileId: 'prof_root',
        createdAt: '2026-08-22'
    },
    {
        username: 'Ghost_RedTeam',
        password: 'redteam2026',
        profileId: 'prof_redteam',
        createdAt: '2026-08-22'
    },
    {
        username: 'Sentinel_SOC',
        password: 'soc2026',
        profileId: 'prof_soc',
        createdAt: '2026-08-22'
    }
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('ehacker-authenticated') === 'true';
    });

    const [userAccounts, setUserAccounts] = useState(() => {
        try {
            const saved = localStorage.getItem('ehacker-user-accounts');
            return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
        } catch (e) {
            return DEFAULT_ACCOUNTS;
        }
    });

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
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('ehacker-theme') || 'cyberpunk';
    });
    const [isLocked, setIsLocked] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const [activeProjectModal, setActiveProjectModal] = useState(null);

    const activeProfile = allProfiles.find(p => p.id === activeProfileId) || allProfiles[0];

    useEffect(() => {
        document.body.className = `theme-${theme}`;
        localStorage.setItem('ehacker-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('ehacker-user-accounts', JSON.stringify(userAccounts));
    }, [userAccounts]);

    useEffect(() => {
        localStorage.setItem('roadmap-multi-profiles', JSON.stringify(allProfiles));
        localStorage.setItem('roadmap-active-profile-id', activeProfileId);
    }, [allProfiles, activeProfileId]);

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        playChime();
    };

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

    const login = (profileId) => {
        if (profileId) {
            const found = allProfiles.find(p => p.id === profileId);
            if (found) {
                setActiveProfileId(profileId);
                setActiveDomain(found.domain || 'full');
            }
        }
        setIsAuthenticated(true);
        localStorage.setItem('ehacker-authenticated', 'true');
        playChime();
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('ehacker-authenticated');
        setIsLogoutModalOpen(false);
        setIsLocked(false);
        setActiveTab('overview');
    };

    // User credential authentication
    const loginUser = ({ username, password, autoAuth = true }) => {
        const cleanUser = (username || '').trim().toLowerCase();
        const found = userAccounts.find(u => u.username.toLowerCase() === cleanUser);

        if (!found) {
            return {
                success: false,
                notFound: true,
                error: `Operative '${username}' is not provisioned. Click 'Sign Up' to create your profile.`
            };
        }

        if (found.password !== password) {
            return {
                success: false,
                error: 'Invalid password / access cipher. Authentication rejected.'
            };
        }

        // Match or fallback profile
        const linkedProfile = allProfiles.find(p => p.id === found.profileId) || allProfiles.find(p => p.callsign.toLowerCase() === cleanUser);
        const resolvedProfileId = linkedProfile ? linkedProfile.id : found.profileId;
        if (linkedProfile) {
            setActiveProfileId(linkedProfile.id);
            setActiveDomain(linkedProfile.domain || 'full');
        }

        if (autoAuth) {
            setIsAuthenticated(true);
            localStorage.setItem('ehacker-authenticated', 'true');
            playChime();
        }
        return { success: true, profileId: resolvedProfileId };
    };

    // User registration with GitHub metadata integration
    const registerUser = async ({ username, password, domain, clearance, autoAuth = true }) => {
        const cleanUser = (username || '').trim();
        const existing = userAccounts.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());
        
        if (existing) {
            return {
                success: false,
                error: `Username '${cleanUser}' already exists. Please Sign In.`
            };
        }

        let githubData = null;
        try {
            // Attempt to query public GitHub profile
            const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (res.ok) {
                githubData = await res.json();
            }
        } catch (e) {
            // Network fallback
        }

        const newProfileId = 'prof_' + Math.random().toString(36).substring(2, 8);
        const newProf = {
            id: newProfileId,
            callsign: cleanUser,
            githubHandle: cleanUser,
            githubAvatar: githubData?.avatar_url || null,
            githubBio: githubData?.bio || null,
            githubRepos: githubData?.public_repos || 0,
            clearance: clearance || 'Level 2 • RESTRICTED',
            domain: domain || 'full',
            avatar: '01',
            bio: githubData?.bio || `Operative ${cleanUser} // Cyber Defense Division`,
            created_at: new Date().toISOString().slice(0, 10),
            apiKey: 'ehk_live_sec_' + Math.random().toString(36).substring(2, 12),
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {}
        };

        const newAccount = {
            username: cleanUser,
            password: password,
            profileId: newProfileId,
            createdAt: new Date().toISOString()
        };

        setUserAccounts(prev => [...prev, newAccount]);
        setAllProfiles(prev => [...prev, newProf]);
        setActiveProfileId(newProfileId);
        setActiveDomain(newProf.domain);

        if (autoAuth) {
            setIsAuthenticated(true);
            localStorage.setItem('ehacker-authenticated', 'true');
            playChime();
        }

        return {
            success: true,
            profileId: newProfileId,
            githubData
        };
    };

    // User password reset
    const resetUserPassword = ({ username, newPassword }) => {
        const cleanUser = (username || '').trim().toLowerCase();
        const foundIndex = userAccounts.findIndex(u => u.username.toLowerCase() === cleanUser);

        if (foundIndex === -1) {
            return {
                success: false,
                error: `Operative '${username}' not found in registry.`
            };
        }

        if (!newPassword || newPassword.length < 4) {
            return {
                success: false,
                error: 'New password must be at least 4 characters.'
            };
        }

        const updatedAccounts = [...userAccounts];
        updatedAccounts[foundIndex] = {
            ...updatedAccounts[foundIndex],
            password: newPassword,
            updatedAt: new Date().toISOString()
        };

        setUserAccounts(updatedAccounts);
        localStorage.setItem('ehacker-user-accounts', JSON.stringify(updatedAccounts));
        playChime();
        return { 
            success: true, 
            profileId: updatedAccounts[foundIndex].profileId 
        };
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
            avatar: profData.avatar || '01',
            githubAvatar: profData.githubAvatar || null,
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
        setIsAuthenticated(true);
        localStorage.setItem('ehacker-authenticated', 'true');
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

    const toggleProjectComplete = (projId, customXp) => {
        const current = activeProfile.completedProjects || [];
        const isDone = current.includes(projId);
        const updated = isDone ? current.filter(id => id !== projId) : [...current, projId];
        const awardedXp = typeof customXp === 'number' && customXp > 0 ? customXp : 50;
        const xpDelta = isDone ? -awardedXp : awardedXp;
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
            isAuthenticated,
            setIsAuthenticated,
            login,
            logout,
            loginUser,
            registerUser,
            resetUserPassword,
            userAccounts,
            activeProfile,
            allProfiles,
            activeProfileId,
            activeTab,
            setActiveTab,
            activeDomain,
            setActiveDomain,
            theme,
            setTheme,
            THEMES,
            isLocked,
            setIsLocked,
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
