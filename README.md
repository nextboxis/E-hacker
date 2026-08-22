# E-HACKER | Ultimate Cybersecurity & Ethical Hacking Workstation

[![Platform](https://img.shields.io/badge/Platform-Vercel%20%7C%20Web%20Client-00ff66?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnextboxis%2FE-hacker)
[![AI Security Suite](https://img.shields.io/badge/AI%20Suite-Detection%20%26%20Deobf-8b5cf6?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![Labs](https://img.shields.io/badge/Hands--on%20Labs-100%20Projects-06b6d4?style=flat-square)](https://github.com/nextboxis/E-hacker)
[![Real-Time Telemetry](https://img.shields.io/badge/Real--time-CVE%20%26%20Threat%20Radar-ef4444?style=flat-square)](https://github.com/nextboxis/E-hacker)

**E-HACKER** is an all-in-one educational platform, interactive hands-on laboratory, and daily cybersecurity workstation. Built with modern glassmorphism aesthetics, serverless Vercel cloud APIs, an AI Security Suite, and client-side reactive database persistence, it guides learners from computer fundamentals to advanced enterprise penetration testing, red teaming, and reverse engineering.

---

## 🌟 Key Features & Capabilities

### 1. 🤖 AI Security Suite & Real-Time Threat Telemetry
- **Detection Rule & Script Synthesizer**: Generate Sigma rules (YAML), Splunk SPL correlation searches, YARA malware rules, Suricata IDS signatures, and Python/Bash security automation scripts from natural language prompts.
- **Payload Deobfuscator & Reverse Analyzer**: Deconstruct and decode obfuscated PowerShell (Base64 UTF-16LE, AMSI bypasses), JavaScript hex packing, and nested string concatenation.
- **AI Incident Response Playbook Builder**: NIST SP 800-61 aligned containment, eradication, and recovery timelines for Ransomware, Business Email Compromise (BEC), Web Shell Injection, and Active Directory exploitation.
- **⚡ Live Real-Time CVE & Zero-Day Threat Feed**: Live vulnerability streaming with CVSS base scores, CWE classifications, CISA KEV tags, and verified mitigation advisories.
- **📡 Global Threat Radar Visualizer**: Animated HTML5 canvas radar displaying simulated real-time honeypot attack vectors, port sweeps, and threat telemetry.

### 2. 🧪 Project Hub (100 Hands-on Cybersecurity Labs)
- **100 Curated Real-World Projects** across Web Hacking, Network Security, Custom Tool Development, Malware Analysis & Defense, OSINT & Forensics, and Active Directory & Cloud.
- Filter by domain category, difficulty tier (Beginner, Intermediate, Advanced), and completion status.
- Interactive modal with learning objectives, environment setup, verified execution commands with one-click copy, remediation countermeasures, and completion checkboxes.
- Gamified XP rewards for every completed lab.

### 3. 🛠️ Cyber Toolkit & Offline Mini-Labs
Zero-dependency, client-side cybersecurity utilities:
- **🔑 Multi-Hash Generator & Format Identifier**: Live checksum computation (MD5, SHA-1, SHA-256, SHA-512) and algorithm identifier with Hashcat (`-m`) and John the Ripper cracking modes.
- **🔄 Multi-Format Security Encoder / Decoder**: Base64 (UTF-8 safe), Hex/Byte arrays, URL encoding, HTML entities, 8-bit Binary, and Caesar/ROT cipher with dynamic shift slider.
- **🌐 IPv4 Subnet & CIDR Range Calculator**: Network IP, broadcast address, netmask, wildcard mask, usable host ranges, and RFC 1918 classification with binary breakdown.
- **⚖️ CVSS v3.1 Vulnerability Calculator**: Interactive metric selector (AV, AC, PR, UI, S, C, I, A) generating standard vector strings and exact severity scores.
- **🔍 Security Regex & Log Pattern Tester**: Test signatures against Apache/Nginx logs, auth logs, or payloads with live syntax highlighting and preset security patterns.
- **⚔️ Cyber Kill Chain & MITRE ATT&CK Explorer**: 7-stage attack lifecycle visualizer with mapped tactics, tools, CLI syntax, and defensive SIEM detection rules.

### 4. 🗺️ 6-Stage Timeline Roadmap
- Structured progression covering **Pre-Security Fundamentals**, **Network Control & Protocol Audit**, **Penetration Testing & Web Hacking**, **Active Directory & Internal Exploitation**, **Advanced Web & Evasion Tactics**, and **Exploit Development & Security Research**.
- 38 Core Competencies with interactive milestone checklists and dynamic progress tracking.

### 5. ⌨️ Global Spotlight / Command Palette (`Ctrl+K` / `Cmd+K`)
- Instant fuzzy search across all 100 projects, 38 competencies, 36 pentest tools, 6 toolkit calculators, 20 channels, and 19 PDF cheat sheets with keyboard arrow navigation.

### 6. 💻 Interactive Cyber CLI Terminal Simulator
- Retro CRT hacker terminal with built-in commands (`help`, `nmap`, `sqlmap`, `whoami`, `cat`, `hashid`, `matrix`, `quiz`, `xp`, `theme`, `clear`, `banner`).
- Real-time animated Matrix digital rain canvas toggle.

### 7. 📝 Certification Exam Prep & Interactive Flashcards
- Practice quiz engine covering Web Attacks, Reconnaissance, Cryptography, and Active Directory with instant answer feedback and score calculation.
- **Interactive 3D Flashcard Mode** with mastery tracking and spaced repetition.

### 8. 🧠 ADHD Focus Hub & Ambient Soundboard
- Focus state selector (Hyperfocused, Distracted, Zombie) with personalized action recommendations.
- **Dopamine Side Quest Generator** (+50 XP) and **Break-It-Down Task Paralysis Buster**.
- **Flag-by-Flag Command Explainer** for deconstructing complex pentesting commands.
- **Lo-Fi Web Audio Synthesized Soundboard**: Layer ambient Rain, Synth Pads, Lo-fi Beats, Brown Noise, and Forest audio.
- 5 Accessibility themes: *Hacker Dark*, *Calm Blue*, *Dyslexia-Friendly*, *High Contrast*, and *ADHD Light*.

### 9. 💾 Cloud-Ready Vercel Architecture & Reactive Database
- **IndexedDB Live Database (`EHackerLiveDB`)** with reactive pub/sub event bus and full-text indexing.
- **Serverless API Endpoints**:
  - `/api/cve-feed`: Real-time CVE & vulnerability stream
  - `/api/threat-intel`: Threat actor bulletins and IOC telemetry
  - `/api/ai-assistant`: AI-powered rule generation endpoint
  - `/api/database`: Cloud database state sync

---

## 🚀 Instant Deployment (Vercel & Local)

### Option 1: 1-Click Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnextboxis%2FE-hacker)

### Option 2: Run Locally (Zero Build Step)
1. Clone the repository:
   ```bash
   git clone https://github.com/nextboxis/E-hacker.git
   cd E-hacker
   ```
2. Open `index.html` directly in any modern browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` or `Cmd + K` | Open Spotlight Command Palette |
| `Esc` | Close any active modal or search palette |
| `↑` / `↓` | Navigate Spotlight search results |
| `Enter` | Select search result / Submit terminal command |
| `Space` (in Flashcards) | Flip active flashcard |

---

## 📁 Project Structure

```
.
├── index.html            # Main Single Page Application markup & panels
├── styles.css            # Glassmorphism UI, theme engines & radar styles
├── script.js             # 100 projects data, AI engines, toolkit & Web Audio
├── vercel.json           # Vercel serverless routing & security headers
├── api/                  # Vercel Serverless Functions
│   ├── cve-feed.js       # Live CVE & Zero-Day feed API
│   ├── threat-intel.js   # Threat intelligence bulletin API
│   ├── ai-assistant.js   # AI rule synthesizer API
│   └── database.js       # State backup & sync API
├── favicon.png           # Platform branding
├── README.md             # Comprehensive documentation
└── pdfs/                 # 19 curated security cheat sheets & guidebooks
```

---

## 🛡️ Legal & Ethical Disclaimer

This dashboard and its associated guides are intended strictly for educational purposes, defensive hardening, and authorized security assessments. Unauthorized access, probing, or exploitation of computing systems is illegal under cybersecurity laws worldwide (including the Computer Fraud and Abuse Act). Always practice inside authorized environments (e.g. Hack The Box, TryHackMe, or local lab VMs) and use your knowledge to defend and protect.

---

## 👤 Author & Connect

Developed by **Giridharan K**
- **GitHub**: [@nextboxis](https://github.com/nextboxis)
- **LinkedIn**: [giridharan-k1315](https://linkedin.com/in/giridharan-k1315)
- **Portfolio**: [giridharank.netlify.app](https://giridharank.netlify.app)
- **YouTube**: [@jryhex](https://youtube.com/@jryhex)
- **Instagram**: [@encrypted_peace](https://www.instagram.com/encrypted_peace)
