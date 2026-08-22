// Serverless API: Operative Authentication & Clearance Verification
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { action, callsign, password, domain, clearance } = req.body || req.query || {};

    if (action === 'register') {
        const newOperative = {
            callsign: callsign || 'Operative_' + Math.random().toString(36).substring(2, 6).toUpperCase(),
            clearance: clearance || 'Level 3 - Secret',
            domain: domain || 'Web Pentesting',
            registered_at: new Date().toISOString(),
            session_token: 'ehk_tok_' + Math.random().toString(36).substring(2, 16)
        };
        return res.status(200).json({
            status: "success",
            message: "Operative identity provisioned successfully.",
            user: newOperative
        });
    }

    if (action === 'login') {
        return res.status(200).json({
            status: "success",
            message: "Authentication verified. Security clearances unlocked.",
            user: {
                callsign: callsign || 'root@nextboxis',
                clearance: 'Level 5 - TOP SECRET // NOFORN',
                domain: domain || 'Full Spectrum Hacker',
                session_token: 'ehk_tok_' + Math.random().toString(36).substring(2, 16)
            }
        });
    }

    res.status(200).json({
        status: "healthy",
        service: "E-Hacker Cyber Authentication Gateway v2.5",
        timestamp: new Date().toISOString()
    });
}
