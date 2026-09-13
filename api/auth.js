// Serverless API: Operative Authentication & Clearance Verification (Hardened)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

function getDbFilePath() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, '..', 'database', 'ehacker_db.json');
    } catch (e) {
        return path.resolve(process.cwd(), 'database', 'ehacker_db.json');
    }
}

function readDatabase() {
    try {
        const p = getDbFilePath();
        if (fs.existsSync(p)) {
            const raw = fs.readFileSync(p, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return null;
}

function writeDatabase(data) {
    try {
        const p = getDbFilePath();
        const dir = path.dirname(p);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        return false;
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Reject transmission of sensitive credentials via GET query parameters (OWASP A02 & API2)
    if (req.method === 'GET' && (req.query?.password || req.query?.action === 'login' || req.query?.action === 'register')) {
        return res.status(405).json({
            success: false,
            status: "error",
            error: "Authentication credentials must NOT be transmitted via GET query parameters. Use POST with a secure JSON body."
        });
    }

    const { action, callsign, username, password, domain, clearance, role } = req.body || {};
    const effectiveUser = (username || callsign || '').trim();
    const db = readDatabase() || {
        users: [
            { id: "usr_root_001", username: "root@nextboxis", password: "shadowprotocol2026", role: "Lead Architect" },
            { id: "usr_red_002", username: "Ghost_RedTeam", password: "redteam2026", role: "Offensive Specialist" },
            { id: "usr_soc_003", username: "Sentinel_SOC", password: "soc2026", role: "Defense Analyst" }
        ],
        profiles: [],
        audit_logs: []
    };

    if (action === 'register') {
        if (!effectiveUser) {
            return res.status(400).json({
                success: false,
                status: "error",
                error: "Callsign / Username is required for registration."
            });
        }

        if (!password || typeof password !== 'string' || password.length < 4) {
            return res.status(400).json({
                success: false,
                status: "error",
                error: "Passphrase must be at least 4 characters long."
            });
        }

        const existing = (db.users || []).find(u => u.username.toLowerCase() === effectiveUser.toLowerCase());
        if (existing) {
            return res.status(400).json({
                success: false,
                status: "error",
                error: `Operative '${effectiveUser}' already exists in cyber registry.`
            });
        }

        const randSuffix = crypto.randomBytes(4).toString('hex');
        const cleanId = 'usr_' + effectiveUser.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16) + '_' + randSuffix;
        const newUser = {
            id: cleanId,
            username: effectiveUser,
            password: password,
            role: role || 'Operative',
            status: 'active',
            created_at: new Date().toISOString()
        };

        const newProfile = {
            id: cleanId,
            user_id: cleanId,
            callsign: effectiveUser,
            clearance: clearance || 'Level 2 • RESTRICTED',
            domain: domain || 'full',
            avatar: '01',
            githubAvatar: null,
            bio: `Operative ${effectiveUser} // Cyber Defense Division`,
            apiKey: 'ehk_live_sec_' + crypto.randomBytes(12).toString('hex'),
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {},
            created_at: new Date().toISOString().slice(0, 10)
        };

        db.users = [...(db.users || []), newUser];
        db.profiles = [...(db.profiles || []), newProfile];
        if (Array.isArray(db.audit_logs)) {
            db.audit_logs.unshift({
                id: 'log_' + crypto.randomBytes(6).toString('hex'),
                user_id: cleanId,
                action: 'OPERATIVE_REGISTERED',
                details: { username: effectiveUser, domain: domain || 'full' },
                timestamp: new Date().toISOString()
            });
        }

        writeDatabase(db);

        // Generate cryptographically secure session token
        const secureSessionToken = 'ehk_tok_' + crypto.randomBytes(24).toString('hex');

        return res.status(200).json({
            success: true,
            status: "success",
            message: "Operative identity provisioned and persisted in database successfully.",
            user: {
                id: cleanId,
                username: effectiveUser,
                callsign: effectiveUser,
                clearance: newProfile.clearance,
                domain: newProfile.domain,
                role: newUser.role,
                session_token: secureSessionToken
            }
        });
    }

    if (action === 'login') {
        if (!effectiveUser) {
            return res.status(400).json({
                success: false,
                status: "error",
                error: "Operative username or callsign is required."
            });
        }

        // Strict password check: reject empty or missing passwords
        if (!password || typeof password !== 'string' || password.length === 0) {
            return res.status(401).json({
                success: false,
                status: "error",
                error: "Password / access cipher is strictly required. Authentication rejected."
            });
        }

        const matched = (db.users || []).find(u => u.username.toLowerCase() === effectiveUser.toLowerCase());
        if (!matched) {
            return res.status(401).json({
                success: false,
                status: "error",
                error: `Operative '${effectiveUser}' not found in registry.`
            });
        }

        if (matched.password !== password) {
            return res.status(401).json({
                success: false,
                status: "error",
                error: "Invalid password / access cipher. Authentication rejected."
            });
        }

        const userId = matched.id;
        const matchedProfile = (db.profiles || []).find(p => p.id === userId || p.user_id === userId);
        const secureSessionToken = 'ehk_tok_' + crypto.randomBytes(24).toString('hex');

        return res.status(200).json({
            success: true,
            status: "success",
            message: "Authentication verified. Security clearances unlocked.",
            user: {
                id: userId,
                username: matched.username,
                callsign: matchedProfile ? matchedProfile.callsign : matched.username,
                clearance: matchedProfile ? matchedProfile.clearance : (clearance || 'Level 5 • TOP SECRET'),
                domain: matchedProfile ? matchedProfile.domain : (domain || 'full'),
                role: matched.role || 'Operative',
                session_token: secureSessionToken
            }
        });
    }

    res.status(200).json({
        success: true,
        status: "healthy",
        service: "E-Hacker Cyber Authentication Gateway v3.0 (Hardened)",
        timestamp: new Date().toISOString(),
        supported_actions: ["login", "register"],
        database_users_registered: (db.users || []).length
    });
}
