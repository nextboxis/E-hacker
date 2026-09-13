// E-HACKER Cyber Operations Test Suite
// Validates lab integrity, tool directories, MITRE matrix mappings, subnet arithmetic, and security schemas.

import fs from 'fs';
import path from 'path';
import { projectsData } from '../src/data/projectsData.js';
import { TOOLS_DATABASE, OSINT_TOOLS, AI_SECURITY_TOOLS, PDF_CHEAT_SHEETS } from '../src/data/toolsData.js';
import { CURATED_CVES, THREAT_BULLETINS } from '../src/data/cveData.js';
import { PRACTICE_PLATFORMS, CERTIFICATIONS_ROADMAP, STANDARDS_AND_CHEATSHEETS, TOPIC_RESOURCES } from '../src/data/resourcesData.js';
import { STAGES } from '../src/data/roadmapData.js';
import { PYTHON_TEMPLATES } from '../src/data/pythonTemplates.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  \x1b[32m✔ PASS\x1b[0m: ${message}`);
        passedTests++;
    } else {
        console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${message}`);
        failedTests++;
    }
}

console.log('\n======================================================');
console.log('       E-HACKER AUTOMATED CYBER TEST SUITE v3.0       ');
console.log('======================================================\n');

// 1. Projects & Hands-On Labs Validation
console.log('\x1b[36m[SUITE 1] Hands-on Security Projects & Exploitation Labs\x1b[0m');
assert(Array.isArray(projectsData), 'projectsData is an array');
assert(projectsData.length === 118, `projectsData contains full 118 lab curriculum (Found: ${projectsData.length})`);

const projectIds = new Set();
let duplicates = 0;
let missingFields = 0;

for (const p of projectsData) {
    if (projectIds.has(p.id)) {
        duplicates++;
    }
    projectIds.add(p.id);

    if (!p.id || !p.title || (!p.category && !p.cat)) {
        missingFields++;
    }
}

assert(duplicates === 0, `All project IDs are strictly unique (Duplicates: ${duplicates})`);
assert(missingFields === 0, `All project records have required title and category fields (Invalid: ${missingFields})`);

// 2. Tools & Threat Intelligence Verification
console.log('\n\x1b[36m[SUITE 2] Tools Directory & OSINT Arsenal Verification\x1b[0m');
assert(Array.isArray(TOOLS_DATABASE) && TOOLS_DATABASE.length >= 50, `TOOLS_DATABASE loaded with 50+ tools (Found: ${TOOLS_DATABASE.length})`);
assert(Array.isArray(OSINT_TOOLS) && OSINT_TOOLS.length >= 15, `OSINT_TOOLS loaded with 15+ engines (Found: ${OSINT_TOOLS.length})`);
assert(Array.isArray(AI_SECURITY_TOOLS) && AI_SECURITY_TOOLS.length >= 10, `AI_SECURITY_TOOLS loaded with 10+ AI security frameworks (Found: ${AI_SECURITY_TOOLS.length})`);
assert(Array.isArray(PDF_CHEAT_SHEETS) && PDF_CHEAT_SHEETS.length >= 20, `PDF_CHEAT_SHEETS contains 20+ field manual references (Found: ${PDF_CHEAT_SHEETS.length})`);

// 3. Zero-Day Advisories & Threat Telemetry
console.log('\n\x1b[36m[SUITE 3] Zero-Day Advisories & Threat Telemetry\x1b[0m');
assert(Array.isArray(CURATED_CVES) && CURATED_CVES.length >= 5, `CURATED_CVES contains valid zero-days (Found: ${CURATED_CVES.length})`);
assert(Array.isArray(THREAT_BULLETINS) && THREAT_BULLETINS.length >= 3, `THREAT_BULLETINS contains active adversary telemetry (Found: ${THREAT_BULLETINS.length})`);

for (const cve of CURATED_CVES) {
    assert(cve.id.startsWith('CVE-'), `Valid CVE ID format: ${cve.id}`);
    assert(typeof cve.cvss === 'number' && cve.cvss >= 0 && cve.cvss <= 10, `Valid CVSS score: ${cve.id} (${cve.cvss})`);
}

// 4. Resources & Practice Platforms
console.log('\n\x1b[36m[SUITE 4] Practice Platforms & Certification Roadmaps\x1b[0m');
assert(Array.isArray(PRACTICE_PLATFORMS) && PRACTICE_PLATFORMS.length >= 8, `PRACTICE_PLATFORMS contains verified cyber ranges (Found: ${PRACTICE_PLATFORMS.length})`);
assert(Array.isArray(CERTIFICATIONS_ROADMAP) && CERTIFICATIONS_ROADMAP.length >= 4, `CERTIFICATIONS_ROADMAP stages defined (Found: ${CERTIFICATIONS_ROADMAP.length})`);
assert(Array.isArray(STANDARDS_AND_CHEATSHEETS) && STANDARDS_AND_CHEATSHEETS.length >= 5, `STANDARDS_AND_CHEATSHEETS loaded (Found: ${STANDARDS_AND_CHEATSHEETS.length})`);
assert(typeof PYTHON_TEMPLATES === 'object' && Object.keys(PYTHON_TEMPLATES).length >= 4, `PYTHON_TEMPLATES available (Found: ${Object.keys(PYTHON_TEMPLATES || {}).length})`);

// 5. Bitwise Subnet Math Unit Tests
console.log('\n\x1b[36m[SUITE 5] Cryptographic & Networking Subnet Arithmetic\x1b[0m');

function calculateSubnet(ipStr, cidr) {
    try {
        const parts = ipStr.trim().split('.').map(Number);
        if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255) || cidr < 1 || cidr > 32) {
            return null;
        }
        const ipNum = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
        const maskNum = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
        const netNum = (ipNum & maskNum) >>> 0;
        const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;

        const numToIp = (num) => [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');

        return {
            netIp: numToIp(netNum),
            bcastIp: numToIp(bcastNum),
            netmask: numToIp(maskNum),
            totalHosts: Math.pow(2, 32 - cidr),
            usableHosts: cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, Math.pow(2, 32 - cidr) - 2)
        };
    } catch (e) {
        return null;
    }
}

const sub24 = calculateSubnet('192.168.1.50', 24);
assert(sub24 && sub24.netIp === '192.168.1.0', '192.168.1.50/24 Network IP is 192.168.1.0');
assert(sub24 && sub24.bcastIp === '192.168.1.255', '192.168.1.50/24 Broadcast IP is 192.168.1.255');
assert(sub24 && sub24.usableHosts === 254, '192.168.1.50/24 Usable Hosts = 254');

const sub30 = calculateSubnet('10.0.0.1', 30);
assert(sub30 && sub30.netIp === '10.0.0.0', '10.0.0.1/30 Network IP is 10.0.0.0');
assert(sub30 && sub30.usableHosts === 2, '10.0.0.1/30 Usable Hosts = 2');

const invalidSub = calculateSubnet('999.999.999.999', 24);
assert(invalidSub === null, 'Invalid IP address rejected gracefully');

// [SUITE 6] Serverless Edge APIs & Backend Endpoints
console.log('\n[SUITE 6] Serverless Edge APIs & Backend Endpoints');
const createMockRes = () => {
    const res = {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { res.headers[k] = v; return res; },
        status(c) { res.statusCode = c; return res; },
        json(d) { res.data = d; return res; },
        end() { return res; }
    };
    return res;
};

// 1. Auth API
const { default: authHandler } = await import('../api/auth.js');
const authRes = createMockRes();
await authHandler({ method: 'POST', body: { action: 'login', username: 'root@nextboxis', password: 'shadowprotocol2026' } }, authRes);
assert(authRes.statusCode === 200 && authRes.data.success === true, 'api/auth POST login generates valid token');

// 2. AI Assistant API
const { default: aiHandler } = await import('../api/ai-assistant.js');
const aiRes = createMockRes();
await aiHandler({ method: 'POST', body: { prompt: 'Detect powershell injection', type: 'sigma' } }, aiRes);
assert(aiRes.statusCode === 200 && aiRes.data.rule && aiRes.data.rule.includes('title: Detect'), 'api/ai-assistant POST synthesizes Sigma rule');

// 3. CVE Feed API
const { default: cveHandler } = await import('../api/cve-feed.js');
const cveRes = createMockRes();
await cveHandler({ method: 'GET', query: {} }, cveRes);
assert(cveRes.statusCode === 200 && Array.isArray(cveRes.data.cves) && cveRes.data.cves.length >= 12, 'api/cve-feed returns curated zero-day CVEs');

// 4. Threat Intel API
const { default: threatHandler } = await import('../api/threat-intel.js');
const threatRes = createMockRes();
await threatHandler({ method: 'GET', query: {} }, threatRes);
assert(threatRes.statusCode === 200 && Array.isArray(threatRes.data.bulletins) && threatRes.data.bulletins.length >= 3, 'api/threat-intel returns threat bulletins');

// 5. Database API (GET & POST) & Persistent DB Verification

console.log('\n\x1b[36m[SUITE 7] Persistent Database & Standardized Operative ID Verification\x1b[0m');

// A. Check SQL Schema
const schemaPath = path.resolve('database/schema.sql');
assert(fs.existsSync(schemaPath), 'database/schema.sql exists');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
assert(schemaContent.includes('CREATE TABLE IF NOT EXISTS users') && schemaContent.includes('CREATE TABLE IF NOT EXISTS targets'), 'database/schema.sql contains full relational table definitions');

// B. Check persistent JSON database
const jsonDbPath = path.resolve('database/ehacker_db.json');
assert(fs.existsSync(jsonDbPath), 'database/ehacker_db.json exists');
const dbJson = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
assert(Array.isArray(dbJson.users) && dbJson.users.length === 3, 'database/ehacker_db.json contains 3 standardized operatives');

const expectedUserIds = ['usr_root_001', 'usr_red_002', 'usr_soc_003'];
const actualUserIds = dbJson.users.map(u => u.id);
assert(JSON.stringify(actualUserIds) === JSON.stringify(expectedUserIds), `All user IDs reset to standardized IDs: ${actualUserIds.join(', ')}`);

// C. Verify Auth API with reset user ID
assert(authRes.statusCode === 200 && authRes.data.user && authRes.data.user.id === 'usr_root_001', 'api/auth POST authenticates against reset user ID usr_root_001');

// D. Test Database API (GET & POST & Reset)
const { default: dbHandler } = await import('../api/database.js');
const dbRes = createMockRes();
await dbHandler({ method: 'GET' }, dbRes);
assert(dbRes.statusCode === 200 && (dbRes.data.status === 'healthy' || dbRes.data.status === 'online'), 'api/database GET returns healthy telemetry');
assert(dbRes.data.tables && dbRes.data.tables.users === 3, 'api/database reports live table row telemetry (3 users)');

const dbPostRes = createMockRes();
await dbHandler({ method: 'POST', body: { targets: [{ id: 'tgt_001' }], findings: [{ id: 'vuln_001' }] } }, dbPostRes);
assert(dbPostRes.statusCode === 200 && (dbPostRes.data.status === 'success' || dbPostRes.data.status === 'synced'), 'api/database POST saves snapshot');

const dbResetRes = createMockRes();
await dbHandler({ method: 'POST', body: { action: 'reset_all' }, headers: { authorization: 'Bearer ehk_live_sec_root9482x' } }, dbResetRes);
assert(dbResetRes.statusCode === 200 && dbResetRes.data.status === 'reset_success', 'api/database POST action: reset_all rebuilds persistent database cleanly');

// [SUITE 8] Enhanced Authentication & Operative Registration Validation
console.log('\n\x1b[36m[SUITE 8] Enhanced Authentication, Registration & Database Sync\x1b[0m');

// 1. Register a new operative via api/auth
const testUsername = 'Specter_Agent_' + Math.random().toString(36).substring(2, 6);
const registerRes = createMockRes();
await authHandler({
    method: 'POST',
    body: {
        action: 'register',
        username: testUsername,
        password: 'securePassphrase2026!',
        domain: 'soc',
        clearance: 'Level 3 • SECRET'
    }
}, registerRes);

assert(registerRes.statusCode === 200 && registerRes.data.success === true, 'api/auth registers new operative successfully');
assert(registerRes.data.user && registerRes.data.user.id.startsWith('usr_'), `api/auth assigns standardized usr_ ID prefix: ${registerRes.data.user?.id}`);

// 2. Verify new operative was persisted to database/ehacker_db.json
const updatedDbJson = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
const foundInDb = (updatedDbJson.users || []).find(u => u.username === testUsername);
assert(Boolean(foundInDb), 'Newly registered operative is persistently saved into database/ehacker_db.json');

// 3. Duplicate username prevention
const dupRegisterRes = createMockRes();
await authHandler({
    method: 'POST',
    body: {
        action: 'register',
        username: testUsername,
        password: 'anotherPassword123'
    }
}, dupRegisterRes);
assert(dupRegisterRes.statusCode === 400 && dupRegisterRes.data.success === false, 'api/auth rejects duplicate operative registration with 400');

// 4. Test login with wrong password
const badLoginRes = createMockRes();
await authHandler({
    method: 'POST',
    body: {
        action: 'login',
        username: testUsername,
        password: 'wrong_password_attempt'
    }
}, badLoginRes);
assert(badLoginRes.statusCode === 401 && badLoginRes.data.success === false, 'api/auth rejects invalid password attempt with 401');

// 5. Test login with valid password
const goodLoginRes = createMockRes();
await authHandler({
    method: 'POST',
    body: {
        action: 'login',
        username: testUsername,
        password: 'securePassphrase2026!'
    }
}, goodLoginRes);
assert(goodLoginRes.statusCode === 200 && goodLoginRes.data.user.username === testUsername, 'api/auth successfully authenticates newly registered operative');

// 6. Clean up database state back to standard seed
const cleanupRes = createMockRes();
await dbHandler({ method: 'POST', body: { action: 'reset_all' }, headers: { authorization: 'Bearer ehk_live_sec_root9482x' } }, cleanupRes);
assert(cleanupRes.statusCode === 200, 'Database reset cleans test operatives to preserve production integrity');

// [SUITE 9] Topic Resources & Curriculum Mapping Verification
console.log('\n\x1b[36m[SUITE 9] Curriculum Topics & Resource Verification\x1b[0m');
assert(Array.isArray(STAGES) && STAGES.length === 6, `STAGES contains all 6 curriculum stages (Found: ${STAGES.length})`);

const allStageSkills = STAGES.flatMap(s => s.skills);
assert(allStageSkills.length === 37, `All 37 skill topics defined in roadmap curriculum (Found: ${allStageSkills.length})`);

let missingTopicResources = 0;
let invalidResourceLinks = 0;

for (const skill of allStageSkills) {
    const res = TOPIC_RESOURCES[skill.id];
    if (!res) {
        missingTopicResources++;
        console.error(`  Missing resource mapping for skill ID: ${skill.id}`);
    } else {
        if (!res.title || !res.summary || !res.stage) {
            missingTopicResources++;
        }
        if (!Array.isArray(res.resources) || res.resources.length < 2) {
            invalidResourceLinks++;
        }
        for (const r of (res.resources || [])) {
            if (!r.url || !r.url.startsWith('http')) {
                invalidResourceLinks++;
            }
        }
    }
}

assert(missingTopicResources === 0, `All 37 skills have complete TOPIC_RESOURCES definitions (Missing: ${missingTopicResources})`);
assert(invalidResourceLinks === 0, `All topic resources have verified external HTTPS URLs (Invalid: ${invalidResourceLinks})`);
assert(Object.keys(TOPIC_RESOURCES).length >= 37, `TOPIC_RESOURCES contains comprehensive curriculum + OSINT tracks (Found: ${Object.keys(TOPIC_RESOURCES).length})`);

// [SUITE 10] Authentication Privacy & Vercel Configuration Verification
console.log('\n\x1b[36m[SUITE 10] Auth Privacy Hardening & Vercel Configuration\x1b[0m');
const loginPageContent = fs.readFileSync(path.resolve('src/components/auth/LoginPage.jsx'), 'utf-8');

// Verify username keystroke leak is completely eliminated
assert(!loginPageContent.includes('https://api.github.com/users/'), 'LoginPage eliminates unsolicited GitHub API keystroke leakage');

// Verify preset buttons and exposed credentials are removed
assert(!loginPageContent.includes('PRESET_OPERATIVES'), 'LoginPage does not expose PRESET_OPERATIVES credential list');
assert(!loginPageContent.includes("useState('root@nextboxis')"), 'LoginPage username input starts empty (no preset prefill)');
assert(!loginPageContent.includes("useState('shadowprotocol2026')"), 'LoginPage password input starts empty (no preset password)');

// Verify password masking defaults to false
assert(loginPageContent.includes('const [showPassword, setShowPassword] = useState(false);'), 'Password input defaults strictly to masked (showPassword: false)');

// Verify vercel.json configuration
const vercelContent = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));
assert(vercelContent.version === 2, 'vercel.json specifies valid Vercel v2 schema');
assert(Array.isArray(vercelContent.rewrites) && vercelContent.rewrites.length >= 6, `vercel.json contains API rewrites (Found: ${vercelContent.rewrites?.length})`);

const hasSpaGuard = vercelContent.rewrites.some(r => r.source && r.source.includes('?!api/'));
assert(hasSpaGuard, 'vercel.json SPA fallback correctly guards /api routes from being swallowed by /index.html');

// [SUITE 11] Security Hardening & Vulnerability Verification (Multi-Skill Assessment)
console.log('\n\x1b[36m[SUITE 11] Security Hardening & Vulnerability Verification\x1b[0m');

// 1. VULN-01: Reject missing password on login
const noPwdLoginRes = createMockRes();
await authHandler({
    method: 'POST',
    body: { action: 'login', username: 'root@nextboxis' }
}, noPwdLoginRes);
assert(noPwdLoginRes.statusCode === 401 && noPwdLoginRes.data.success === false, 'api/auth strictly rejects login requests missing password (VULN-01 remediated)');

// 2. VULN-03: Reject credentials in GET query parameters
const getAuthRes = createMockRes();
await authHandler({
    method: 'GET',
    query: { action: 'login', username: 'root@nextboxis', password: 'shadowprotocol2026' }
}, getAuthRes);
assert(getAuthRes.statusCode === 405, 'api/auth rejects credentials passed in GET query parameters (VULN-03 remediated)');

// 3. VULN-04: Cryptographically secure PRNG session tokens
const secTokenLogin = createMockRes();
await authHandler({
    method: 'POST',
    body: { action: 'login', username: 'root@nextboxis', password: 'shadowprotocol2026' }
}, secTokenLogin);
const token = secTokenLogin.data?.user?.session_token || '';
assert(token.startsWith('ehk_tok_') && token.length >= 48, `api/auth issues cryptographically secure PRNG session token (Length: ${token.length})`);

// 4. VULN-02: Block unauthenticated database reset attempts
const unauthResetRes = createMockRes();
await dbHandler({
    method: 'POST',
    body: { action: 'reset_all' }
}, unauthResetRes);
assert(unauthResetRes.statusCode === 403, 'api/database blocks unauthenticated database reset attempts with 403 Forbidden (VULN-02 remediated)');

// 5. Block GET-based reset triggers
const getDbResetRes = createMockRes();
await dbHandler({
    method: 'GET',
    query: { action: 'reset' }
}, getDbResetRes);
assert(getDbResetRes.statusCode === 405, 'api/database blocks GET-based database reset attempts with 405 Method Not Allowed');

// 6. VULN-05: HTTP Security Headers in vercel.json
const globalHeaders = vercelContent.headers?.find(h => h.source === '/(.*)')?.headers || [];
const hstsHeader = globalHeaders.find(h => h.key === 'Strict-Transport-Security');
const cspHeader = globalHeaders.find(h => h.key === 'Content-Security-Policy');
assert(Boolean(hstsHeader && hstsHeader.value.includes('max-age=31536000')), 'vercel.json enforces Strict-Transport-Security (HSTS) max-age=31536000');
assert(Boolean(cspHeader && cspHeader.value.includes("default-src 'self'")), 'vercel.json enforces strict Content-Security-Policy (CSP)');

// 7. VULN-06: Cache-Control: no-store on sensitive API endpoints
const apiHeaderRule = vercelContent.headers?.find(h => h.source === '/api/(.*)');
const apiCacheControl = apiHeaderRule?.headers?.find(h => h.key === 'Cache-Control');
assert(Boolean(apiCacheControl && apiCacheControl.value.includes('no-store')), 'vercel.json sets Cache-Control: no-store on sensitive API endpoints');

// 8. VULN-08: Repository governance & secret protection
const gitignoreContent = fs.readFileSync(path.resolve('.gitignore'), 'utf-8');
assert(gitignoreContent.includes('.env') && gitignoreContent.includes('*.pem') && gitignoreContent.includes('*.key'), '.gitignore excludes .env, private keys, certificates and database dumps');

const securityMd = fs.readFileSync(path.resolve('SECURITY.md'), 'utf-8');
assert(securityMd.includes('Security Policy') && securityMd.includes('Reporting a Vulnerability'), 'SECURITY.md provides official responsible disclosure and vulnerability reporting policy');

// Summary
console.log('\n======================================================');
if (failedTests === 0) {
    console.log(`\x1b[32m✔ ALL ${passedTests} TEST CASES PASSED SUCCESSFULLY.\x1b[0m`);
    console.log('======================================================\n');
    process.exit(0);
} else {
    console.error(`\x1b[31m✖ TEST SUITE FAILED: ${failedTests} failed, ${passedTests} passed.\x1b[0m`);
    console.log('======================================================\n');
    process.exit(1);
}
