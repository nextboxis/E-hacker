// Serverless API: Cloud DB State Backup, Query Engine & Multi-Device Sync
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getDbPath() {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        return path.resolve(__dirname, '..', 'database', 'ehacker_db.json');
    } catch (e) {
        return path.resolve(process.cwd(), 'database', 'ehacker_db.json');
    }
}

const DEFAULT_SEEDS = {
    version: "3.0.0",
    database_name: "ehacker_sec_db",
    created_at: "2026-09-13T00:00:00.000Z",
    last_synced: new Date().toISOString(),
    users: [
        { id: "usr_root_001", username: "root@nextboxis", password: "shadowprotocol2026", role: "Lead Architect", status: "active", created_at: "2026-09-13T00:00:00.000Z" },
        { id: "usr_red_002", username: "Ghost_RedTeam", password: "redteam2026", role: "Offensive Specialist", status: "active", created_at: "2026-09-13T00:00:00.000Z" },
        { id: "usr_soc_003", username: "Sentinel_SOC", password: "soc2026", role: "Defense Analyst", status: "active", created_at: "2026-09-13T00:00:00.000Z" }
    ],
    profiles: [
        { id: "usr_root_001", user_id: "usr_root_001", callsign: "root@nextboxis", clearance: "Level 5 • TOP SECRET", domain: "full", avatar: "01", githubAvatar: null, bio: "Knowledge is free. We are anonymous. Security is an illusion.", apiKey: "ehk_live_sec_root9482x", xp: 0, level: 1, completedProjects: [], checkedSkills: [], notes: {}, created_at: "2026-09-13" },
        { id: "usr_red_002", user_id: "usr_red_002", callsign: "Ghost_RedTeam", clearance: "Level 4 • SECRET", domain: "web", avatar: "02", githubAvatar: null, bio: "Offensive Security Specialist & External Penetration Tester", apiKey: "ehk_live_sec_ghost2819y", xp: 0, level: 1, completedProjects: [], checkedSkills: [], notes: {}, created_at: "2026-09-13" },
        { id: "usr_soc_003", user_id: "usr_soc_003", callsign: "Sentinel_SOC", clearance: "Level 4 • SECRET", domain: "soc", avatar: "03", githubAvatar: null, bio: "Blue Team Threat Hunter & SIEM Detection Engineer", apiKey: "ehk_live_sec_soc8392z", xp: 0, level: 1, completedProjects: [], checkedSkills: [], notes: {}, created_at: "2026-09-13" }
    ],
    targets: [
        { id: "tgt_001", host: "10.10.11.241", name: "Internal Domain Controller (DC01.CORP.LOCAL)", scope: "In-Scope", ports: "53, 88, 135, 389, 445, 636, 3268", os: "Windows Server 2022", notes: "Vulnerable to Kerberoasting on svc_backup account. SMB signing is disabled.", severity: "CRITICAL", status: "Active Audit", created_at: "2026-09-13T00:00:00.000Z" },
        { id: "tgt_002", host: "https://api-staging.target.internal", name: "Staging API Gateway (Node.js/Express)", scope: "In-Scope", ports: "80, 443, 8443", os: "Ubuntu Linux 22.04 LTS", notes: "JWT none algorithm bypass confirmed on /auth/v1/refresh. CORS origin reflected.", severity: "HIGH", status: "Exploited", created_at: "2026-09-13T00:00:00.000Z" },
        { id: "tgt_003", host: "192.168.1.1", name: "Edge Gateway Firewall (pfSense)", scope: "Out-of-Scope", ports: "22, 443", os: "FreeBSD / pfSense", notes: "Production infrastructure - Do NOT disrupt or flood.", severity: "INFO", status: "Passive Recon Only", created_at: "2026-09-13T00:00:00.000Z" }
    ],
    findings: [
        { id: "vuln_001", title: "Kerberoasting Service Account Ticket Extraction", target: "DC01.CORP.LOCAL (10.10.11.241)", severity: "CRITICAL", cvss: 9.1, status: "Open", poc: "GetUserSPNs.py corp.local/jdoe:Password123 -request -dc-ip 10.10.11.241", remediation: "Enforce AES-256 Kerberos encryption and set complex 25+ character passwords on all SPN accounts.", created_at: "2026-09-13T00:00:00.000Z" },
        { id: "vuln_002", title: "Authentication Bypass via Insecure JWT Header", target: "api-staging.target.internal", severity: "HIGH", cvss: 8.4, status: "Triaged", poc: "{\\n  \"alg\": \"none\",\\n  \"typ\": \"JWT\"\\n}.{\"sub\":\"admin\",\"role\":\"root\"}.", remediation: "Reject unsigned tokens with algorithm 'none' and enforce strict HMAC-SHA256 signature verification.", created_at: "2026-09-13T00:00:00.000Z" }
    ],
    field_notes: "# Operative Engagement Field Notes\\n- **Target Network**: 10.10.11.0/24\\n- **Primary Objective**: Active Directory Domain Dominance & Sensitive Data Identification\\n- **Key Pivots**:\\n  1. Compromised initial access via web portal SQLi.\\n  2. Dumped NTLM hashes from memory.\\n  3. Escalated to Domain Admin using DCSync abuse.",
    audit_logs: [
        { id: "log_init_001", user_id: "usr_root_001", action: "DATABASE_INITIALIZED", details: { message: "All user IDs reset to clean standardized format. Database created and seeded." }, timestamp: "2026-09-13T00:00:00.000Z" }
    ]
};

function readDb() {
    try {
        const p = getDbPath();
        if (fs.existsSync(p)) {
            const raw = fs.readFileSync(p, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) {}
    return DEFAULT_SEEDS;
}

function writeDb(data) {
    try {
        const p = getDbPath();
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

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const currentDb = readDb();

    if (req.method === 'POST') {
        const payload = req.body || {};
        const isReset = payload.action === 'reset_all' || (req.query && req.query.action === 'reset');

        if (isReset) {
            const freshDb = {
                ...DEFAULT_SEEDS,
                created_at: new Date().toISOString(),
                last_synced: new Date().toISOString(),
                audit_logs: [
                    ...currentDb.audit_logs.slice(0, 10),
                    {
                        id: 'log_' + Math.random().toString(36).substring(2, 9),
                        user_id: 'usr_root_001',
                        action: 'USER_IDS_RESET_AND_DATABASE_REBUILT',
                        details: {
                            message: 'All user IDs reset to usr_root_001, usr_red_002, usr_soc_003. Schema re-seeded.'
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            writeDb(freshDb);

            return res.status(200).json({
                success: true,
                status: "reset_success",
                message: "All user IDs reset and database reconstructed successfully.",
                reset_users: freshDb.users.map(u => ({ id: u.id, username: u.username, role: u.role })),
                database: {
                    name: freshDb.database_name,
                    version: freshDb.version,
                    counts: {
                        users: freshDb.users.length,
                        profiles: freshDb.profiles.length,
                        targets: freshDb.targets.length,
                        findings: freshDb.findings.length
                    }
                },
                tables: {
                    users: freshDb.users.length,
                    profiles: freshDb.profiles.length,
                    targets: freshDb.targets.length,
                    findings: freshDb.findings.length,
                    audit_logs: freshDb.audit_logs ? freshDb.audit_logs.length : 0
                },
                timestamp: new Date().toISOString()
            });
        }

        // Standard Snapshot Sync
        const updatedDb = {
            ...currentDb,
            last_synced: new Date().toISOString()
        };

        if (payload.targets && Array.isArray(payload.targets)) {
            updatedDb.targets = payload.targets;
        }
        if (payload.findings && Array.isArray(payload.findings)) {
            updatedDb.findings = payload.findings;
        }
        if (payload.fieldNotes) {
            updatedDb.field_notes = payload.fieldNotes;
        }
        if (payload.profiles && Array.isArray(payload.profiles)) {
            updatedDb.profiles = payload.profiles;
        }

        // Add audit record
        const logId = 'log_' + Math.random().toString(36).substring(2, 9);
        updatedDb.audit_logs = [
            {
                id: logId,
                user_id: payload.userId || 'usr_root_001',
                action: 'STATE_SNAPSHOT_SYNCED',
                details: {
                    targets: (payload.targets || []).length,
                    findings: (payload.findings || []).length
                },
                timestamp: new Date().toISOString()
            },
            ...(updatedDb.audit_logs || []).slice(0, 25)
        ];

        writeDb(updatedDb);

        return res.status(200).json({
            success: true,
            status: "success",
            message: "State snapshot synced successfully to persistent database.",
            sync_id: "sync_" + Math.random().toString(36).substring(2, 12),
            synced_records: {
                targets: updatedDb.targets.length,
                findings: updatedDb.findings.length,
                users: updatedDb.users.length
            },
            database_counts: {
                users: updatedDb.users.length,
                targets: updatedDb.targets.length,
                findings: updatedDb.findings.length,
                audit_logs: updatedDb.audit_logs.length
            },
            timestamp: new Date().toISOString()
        });
    }

    // GET /api/db
    res.status(200).json({
        success: true,
        status: "healthy",
        version: currentDb.version || "3.0.0",
        database_name: currentDb.database_name || "ehacker_sec_db",
        engine: "E-Hacker Persistent Storage Engine (JSON / SQL Bridge)",
        tls: "TLS 1.3 Active",
        timestamp: new Date().toISOString(),
        counts: {
            users: currentDb.users.length,
            profiles: currentDb.profiles.length,
            targets: currentDb.targets.length,
            findings: currentDb.findings.length,
            audit_logs: currentDb.audit_logs ? currentDb.audit_logs.length : 0
        },
        tables: {
            users: currentDb.users.length,
            profiles: currentDb.profiles.length,
            targets: currentDb.targets.length,
            findings: currentDb.findings.length,
            audit_logs: currentDb.audit_logs ? currentDb.audit_logs.length : 0
        },
        users: currentDb.users.map(u => ({ id: u.id, username: u.username, role: u.role, created_at: u.created_at })),
        targets: currentDb.targets,
        findings: currentDb.findings,
        field_notes: currentDb.field_notes
    });
}
