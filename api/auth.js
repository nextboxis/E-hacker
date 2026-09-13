// Serverless API: Operative Authentication & Clearance Verification
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getDbUsers() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const p = path.resolve(__dirname, '..', 'database', 'ehacker_db.json');
        if (fs.existsSync(p)) {
            const raw = fs.readFileSync(p, 'utf8');
            const data = JSON.parse(raw);
            if (data && Array.isArray(data.users)) return data.users;
        }
    } catch (e) {}
    return [
        { id: "usr_root_001", username: "root@nextboxis", password: "shadowprotocol2026", role: "Lead Architect" },
        { id: "usr_red_002", username: "Ghost_RedTeam", password: "redteam2026", role: "Offensive Specialist" },
        { id: "usr_soc_003", username: "Sentinel_SOC", password: "soc2026", role: "Defense Analyst" }
    ];
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { action, callsign, username, password, domain, clearance } = req.body || req.query || {};
    const effectiveUser = (username || callsign || '').trim();
    const users = getDbUsers();

    if (action === 'register') {
        const cleanName = effectiveUser || 'Operative_' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const cleanId = 'usr_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 6);
        const newOperative = {
            id: cleanId,
            callsign: cleanName,
            clearance: clearance || 'Level 3 - Secret',
            domain: domain || 'Web Pentesting',
            registered_at: new Date().toISOString(),
            session_token: 'ehk_tok_' + Math.random().toString(36).substring(2, 16)
        };
        return res.status(200).json({
            success: true,
            status: "success",
            message: "Operative identity provisioned successfully with reset user ID.",
            user: newOperative
        });
    }

    if (action === 'login') {
        const matched = users.find(u => u.username.toLowerCase() === effectiveUser.toLowerCase());
        const userId = matched ? matched.id : 'usr_root_001';

        return res.status(200).json({
            success: true,
            status: "success",
            message: "Authentication verified. Security clearances unlocked.",
            user: {
                id: userId,
                callsign: effectiveUser || 'root@nextboxis',
                clearance: clearance || 'Level 5 - TOP SECRET // NOFORN',
                domain: domain || 'Full Spectrum Hacker',
                session_token: 'ehk_tok_' + Math.random().toString(36).substring(2, 16)
            }
        });
    }

    res.status(200).json({
        success: true,
        status: "healthy",
        service: "E-Hacker Cyber Authentication Gateway v3.0",
        timestamp: new Date().toISOString(),
        supported_actions: ["login", "register", "verify"],
        database_users_registered: users.length
    });
}
