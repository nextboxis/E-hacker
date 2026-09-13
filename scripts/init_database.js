// E-HACKER Database Management CLI & Initializer
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dbDir = path.join(rootDir, 'database');
const dbPath = path.join(dbDir, 'ehacker_db.json');
const schemaPath = path.join(dbDir, 'schema.sql');

export const INITIAL_SEEDS = {
    version: "3.0.0",
    database_name: "ehacker_sec_db",
    created_at: new Date().toISOString(),
    last_synced: new Date().toISOString(),
    users: [
        {
            id: "usr_root_001",
            username: "root@nextboxis",
            password: "shadowprotocol2026",
            role: "Lead Architect",
            status: "active",
            created_at: new Date().toISOString()
        },
        {
            id: "usr_red_002",
            username: "Ghost_RedTeam",
            password: "redteam2026",
            role: "Offensive Specialist",
            status: "active",
            created_at: new Date().toISOString()
        },
        {
            id: "usr_soc_003",
            username: "Sentinel_SOC",
            password: "soc2026",
            role: "Defense Analyst",
            status: "active",
            created_at: new Date().toISOString()
        }
    ],
    profiles: [
        {
            id: "usr_root_001",
            user_id: "usr_root_001",
            callsign: "root@nextboxis",
            clearance: "Level 5 • TOP SECRET",
            domain: "full",
            avatar: "01",
            githubAvatar: null,
            bio: "Knowledge is free. We are anonymous. Security is an illusion.",
            apiKey: "ehk_live_sec_root9482x",
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {},
            created_at: new Date().toISOString().slice(0, 10)
        },
        {
            id: "usr_red_002",
            user_id: "usr_red_002",
            callsign: "Ghost_RedTeam",
            clearance: "Level 4 • SECRET",
            domain: "web",
            avatar: "02",
            githubAvatar: null,
            bio: "Offensive Security Specialist & External Penetration Tester",
            apiKey: "ehk_live_sec_ghost2819y",
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {},
            created_at: new Date().toISOString().slice(0, 10)
        },
        {
            id: "usr_soc_003",
            user_id: "usr_soc_003",
            callsign: "Sentinel_SOC",
            clearance: "Level 4 • SECRET",
            domain: "soc",
            avatar: "03",
            githubAvatar: null,
            bio: "Blue Team Threat Hunter & SIEM Detection Engineer",
            apiKey: "ehk_live_sec_soc8392z",
            xp: 0,
            level: 1,
            completedProjects: [],
            checkedSkills: [],
            notes: {},
            created_at: new Date().toISOString().slice(0, 10)
        }
    ],
    targets: [
        {
            id: "tgt_001",
            host: "10.10.11.241",
            name: "Internal Domain Controller (DC01.CORP.LOCAL)",
            scope: "In-Scope",
            ports: "53, 88, 135, 389, 445, 636, 3268",
            os: "Windows Server 2022",
            notes: "Vulnerable to Kerberoasting on svc_backup account. SMB signing is disabled.",
            severity: "CRITICAL",
            status: "Active Audit",
            created_at: new Date().toISOString()
        },
        {
            id: "tgt_002",
            host: "https://api-staging.target.internal",
            name: "Staging API Gateway (Node.js/Express)",
            scope: "In-Scope",
            ports: "80, 443, 8443",
            os: "Ubuntu Linux 22.04 LTS",
            notes: "JWT none algorithm bypass confirmed on /auth/v1/refresh. CORS origin reflected.",
            severity: "HIGH",
            status: "Exploited",
            created_at: new Date().toISOString()
        },
        {
            id: "tgt_003",
            host: "192.168.1.1",
            name: "Edge Gateway Firewall (pfSense)",
            scope: "Out-of-Scope",
            ports: "22, 443",
            os: "FreeBSD / pfSense",
            notes: "Production infrastructure - Do NOT disrupt or flood.",
            severity: "INFO",
            status: "Passive Recon Only",
            created_at: new Date().toISOString()
        }
    ],
    findings: [
        {
            id: "vuln_001",
            title: "Kerberoasting Service Account Ticket Extraction",
            target: "DC01.CORP.LOCAL (10.10.11.241)",
            severity: "CRITICAL",
            cvss: 9.1,
            status: "Open",
            poc: "GetUserSPNs.py corp.local/jdoe:Password123 -request -dc-ip 10.10.11.241",
            remediation: "Enforce AES-256 Kerberos encryption and set complex 25+ character passwords on all SPN accounts.",
            created_at: new Date().toISOString()
        },
        {
            id: "vuln_002",
            title: "Authentication Bypass via Insecure JWT Header",
            target: "api-staging.target.internal",
            severity: "HIGH",
            cvss: 8.4,
            status: "Triaged",
            poc: "{\\n  \"alg\": \"none\",\\n  \"typ\": \"JWT\"\\n}.{\"sub\":\"admin\",\"role\":\"root\"}.",
            remediation: "Reject unsigned tokens with algorithm 'none' and enforce strict HMAC-SHA256 signature verification.",
            created_at: new Date().toISOString()
        }
    ],
    field_notes: `# Operative Engagement Field Notes\n- **Target Network**: 10.10.11.0/24\n- **Primary Objective**: Active Directory Domain Dominance & Sensitive Data Identification\n- **Key Pivots**:\n  1. Compromised initial access via web portal SQLi.\n  2. Dumped NTLM hashes from memory.\n  3. Escalated to Domain Admin using DCSync abuse.`,
    audit_logs: [
        {
            id: "log_init_001",
            user_id: "usr_root_001",
            action: "DATABASE_INITIALIZED",
            details: {
                message: "All user IDs reset to clean standardized format. Database created and seeded.",
                users_count: 3,
                targets_count: 3,
                findings_count: 2
            },
            timestamp: new Date().toISOString()
        }
    ]
};

export function initDatabase({ force = false } = {}) {
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath) || force) {
        fs.writeFileSync(dbPath, JSON.stringify(INITIAL_SEEDS, null, 2), 'utf8');
        console.log(`[+] Database created successfully at: ${dbPath}`);
        console.log(`[+] Reset ${INITIAL_SEEDS.users.length} user IDs:`);
        INITIAL_SEEDS.users.forEach(u => {
            console.log(`    - ID: ${u.id.padEnd(14)} Callsign: ${u.username.padEnd(20)} Role: ${u.role}`);
        });
        console.log(`[+] Seeded ${INITIAL_SEEDS.targets.length} targets & ${INITIAL_SEEDS.findings.length} findings.`);
        return INITIAL_SEEDS;
    } else {
        console.log(`[*] Database already exists at: ${dbPath}. Use --reset to reinitialize.`);
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        return data;
    }
}

// Auto-run if executed directly from CLI
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
    const isReset = process.argv.includes('--reset') || process.argv.includes('-r');
    initDatabase({ force: isReset });
}
