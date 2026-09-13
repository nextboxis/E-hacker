# E-HACKER // Modern React 18 Cybersecurity Command Center

[![Platform](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%205-38bdf8?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE-Enterprise%20Matrix%20v14-a855f7?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![AI Security Suite](https://img.shields.io/badge/AI%20Agents-Red%20Teaming%20%26%20Defense-22c55e?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![118 Labs](https://img.shields.io/badge/Hands--on%20Labs-118%20Projects-f97316?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnextboxis%2FE-hacker)

**E-HACKER** is a full-scale, privacy-first **React 18 + Vite** cybersecurity operations workstation, adversary emulation platform, and technical training laboratory. Built with zero-telemetry client-side architecture, MITRE ATT&CK coverage tracking, autonomous AI agent security frameworks, SIEM log hunting, BloodHound Active Directory graphs, and serverless Vercel Postgres synchronization.

---

## Key Modules & Capabilities

### 1. MITRE ATT&CK Command Center & Technique Inspector (`tab-mitre`)
- **10 Core Adversary Tactics**: Complete coverage across Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, C2, and Exfiltration.
- **5-Card Deep Intelligence Dossier**:
  1. *Adversary TTPs & Threat Actor Attribution*: Mapped to APT28, APT29, Lazarus Group, FIN7, Sandworm, Volt Typhoon, and landmark CVEs.
  2. *Blue Team Telemetry*: Sysmon Event IDs (1, 8, 10, 13, 19, 4624), Zeek log schemas, and Linux Auditd syscalls.
  3. *Tactical Mitigations*: Actionable hardening guidelines (FIDO2 MFA, DMARC `p=reject`, Credential Guard, AppLocker/WDAC).
  4. *Production Sigma Rules*: Formatted YAML detection rules with 1-click clipboard copy.
  5. *Mapped Attack Weapons*: Direct linkage to offensive tools and execution syntaxes.
- **Live Posture Tracker & ATT&CK Navigator Exporter**:
  - Live coverage percentage calculation across `[UNMONITORED]`, `[DETECTED]`, and `[MITIGATED]` states.
  - 1-Click **ATT&CK Navigator Layer (v4.5 JSON)** export ready for direct import into the official MITRE Navigator.

---

### 2. Autonomous AI Agent Security & Threat Radar (`tab-ai-hub`)
- **Autonomous AI Security Frameworks**: Curated tools covering `CyberSecEval (Meta)`, `Inspect AI (UK AISI)`, `LangGraph Red Team`, `CrewAI Autonomous SOC`, `Rebuff AI`, `Aider / SWE-agent`, `PromptFoo`, `Garak`, `PyRIT`, `NeMo Guardrails`, and `Guardrails AI`.
- **Live Cyber Threat Intelligence (CTI) Stream**: Real-time telemetry feed tracking zero-day advisories, CISA KEV entries, and ransomware cartel campaigns.
- **LLM Prompt Injection Defense Playground**: Real-time evaluation sandbox testing prompt injections, jailbreaks, and system prompt extractions against defensive guardrails.
- **Global Threat Vector Radar**: Interactive visual attack surface visualizer.

---

### 3. SOC Threat Hunter & SIEM Investigation Lab (`tab-soc-hunter`)
- **Interactive Telemetry Log Inspector**: Ingest and analyze real Sysmon, Zeek, Linux Auditd, and Windows Security event logs.
- **Query Translation Engine**: Synthesize and test detection queries across Microsoft Sentinel KQL, Splunk SPL, and Sigma YAML.
- **Kill Chain Triage**: Step-by-step incident root-cause analysis and containment workflows.

---

### 4. Target Database & Vercel Postgres Sync Engine (`tab-database`)
- **Active Directory BloodHound Identity Graph**: Interactive SVG graph analyzing AD ACL abuse paths (GenericAll, WriteDacl, Kerberoasting) to Tier-0 Domain Admins.
- **Network Blast Radius Simulator**: Interactive host graph tracking lateral compromise avenues and compromised subnet percentages.
- **Vercel Postgres & Cloud Sync Hub**:
  - Serverless connection testing with latency and TLS 1.3 verification.
  - Live SQL Console & 1-Click Postgres DDL Schema Generator (`CREATE TABLE targets (...)`).
  - Encrypted DB snapshot export, hydration, and production seed restore.

---

### 5. Interactive Cyber Toolkit & Encoders (`tab-toolkit`)
- **Cloud IAM Policy Validator**: Real-time JSON scanner detecting Wildcard Admin (`*`), dangerous `iam:PassRole` compute privilege escalations, and public anonymous S3 exposures.
- **DNS & Subdomain Recon Engine**: Subdomain simulator detecting dangling CNAME takeovers and SPF/DMARC email spoofing vulnerabilities.
- **Diffie-Hellman Key Exchange Sandbox**: Real-time discrete logarithm math visualizer ($g^a \pmod p$).
- **Bitwise IPv4 Subnet Calculator**: Network IP, broadcast IP, wildcard mask, and usable host count calculator.
- **Cryptographic Hash Generator & Cracker**: Web Crypto API-backed SHA-1, SHA-256, SHA-512, MD5 generator and dictionary lookup engine.
- **Multi-Payload Encoder**: Base64, Hex, URL, Binary, and ROT13 transformation engine.

---

### 6. Tools Directory & 2026 PDF Field Manuals (`tab-tools`)
- **64+ Curated Tools**: Granular categorization across Web Pentest, Network Recon, Active Directory, Reverse Engineering, and Forensics.
- **20 Verified OSINT Engines**: Maltego, ExifTool, Holehe, PhoneInfoga, Social-Analyzer, WhatsMyName, FOFA Pro, Hunter.io, IntelX, DNSDumpster, Crt.sh, and Waybackurls.
- **10 Production Scripts**: Scapy ARP Spoofer, Kerberoast SPN Extractor, JWT Algorithm None Forger, DNS Brute-Forcer, Linux SUID Privesc Hunter, and Sentinel KQL queries.
- **31 Technical PDF Field Manuals**: In-browser reader for OWASP Top 10 (2025/2026), CISA Zero Trust v2.0, ADCS ESC1-ESC16, Cloud Red Teaming, and Volatility 3 DFIR.

---

### 7. Hands-on Project Hub (`tab-projects`)
- **118 Curated Security Projects**: Comprehensive guided labs spanning Web Hacking, Network Security, Tool Dev, Malware Analysis, and Cloud Defense.
- **Progress Tracking**: Real-time lab completion status, earned XP progression, and achievement badges.

---

### 8. Authentication & Operative Dossier (`tab-profile`)
- **GitHub Username + Custom Password Auth**: Local-First authenticated access with encrypted local storage persistence.
- **Multi-Profile Manager**: Switch between independent operative identities with isolated progress and clearances.
- **Encrypted `.EHK` Dossier Portability**: Export and import complete workstation states.
- **Embedded Architecture & Ethics**: Full developer dossier (Giridharan K), system architecture specs, and responsible disclosure mandate.

---

## Technical Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.3, Vite 5.4 |
| **Styling & Theme** | Modern Glassmorphism, CSS Variables, Responsive Grid |
| **Cryptography** | Browser Web Crypto API (SubtleCrypto SHA-256/512), Discrete Logarithm Math |
| **Data & Persistence** | Local-First `localStorage`, Vercel Postgres / Neon SQL Schema Sync |
| **State Management** | React Context (`AuthContext`), Custom Hooks (`useIdleTimer`) |
| **Testing & CI** | Automated Cyber Unit Test Suite (`test_cyber_suite.mjs`) |

---

## Quick Start (Development & Production)

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Database Initialization & ID Reset
```bash
# Initialize persistent security database
npm run db:init

# Reset all operative user IDs (usr_root_001, etc.) and rebuild schema
npm run db:reset
```

### 4. Automated Cyber Test Suite
```bash
npm test
```

### 5. Production Build
```bash
npm run build
npm run preview
```

### 6. Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnextboxis%2FE-hacker)

---

## Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Spotlight Command Palette |
| `Esc` | Dismiss any active modal or inspector dialog |
| `Enter` | Submit query / Execute terminal command |

---

## Responsible Disclosure & Ethics

The tools, proof-of-concept scripts, and techniques documented within **E-HACKER** are strictly for **authorized educational research, defensive hardening, and authorized penetration testing engagements**. Unauthorized probing or exploitation of computing systems is illegal under national and international cybercrime legislation. Always obtain explicit written authorization before conducting security assessments.

---

## Author & Connect

Developed by **Giridharan K**
- **GitHub**: [@nextboxis](https://github.com/nextboxis)
- **LinkedIn**: [giridharan-k1315](https://linkedin.com/in/giridharan-k1315)
- **Portfolio**: [giridharank.netlify.app](https://giridharank.netlify.app)
- **YouTube**: [@jryhex](https://youtube.com/@jryhex)
