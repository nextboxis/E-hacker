// E-HACKER Cyber Operations Test Suite
// Validates lab integrity, tool directories, MITRE matrix mappings, subnet arithmetic, and security schemas.

import { projectsData } from '../src/data/projectsData.js';
import { TOOLS_DATABASE, OSINT_TOOLS, AI_SECURITY_TOOLS, PDF_CHEAT_SHEETS } from '../src/data/toolsData.js';
import { CURATED_CVES, THREAT_BULLETINS } from '../src/data/cveData.js';
import { PRACTICE_PLATFORMS, CERTIFICATIONS_ROADMAP, STANDARDS_AND_CHEATSHEETS } from '../src/data/resourcesData.js';
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
import fs from 'fs';
import path from 'path';

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
await dbHandler({ method: 'POST', body: { action: 'reset_all' } }, dbResetRes);
assert(dbResetRes.statusCode === 200 && dbResetRes.data.status === 'reset_success', 'api/database POST action: reset_all rebuilds persistent database cleanly');

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
