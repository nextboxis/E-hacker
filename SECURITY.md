# Security Policy & Vulnerability Disclosure

E-HACKER takes security and user privacy seriously. We appreciate the cybersecurity community's efforts in identifying and responsibly reporting security weaknesses.

## Supported Versions

Only the latest major version and active development releases receive active security updates and vulnerability patches.

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 3.0.x   | :white_check_mark: | Current Active Release |
| < 3.0   | :x:                | Deprecated |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do not open a public GitHub issue**. Instead, follow responsible disclosure procedures:

1. **Email Advisory**: Send details of the finding to `security@nextboxis.com` or create a private GitHub Security Advisory at `https://github.com/nextboxis/E-hacker/security/advisories/new`.
2. **Details to Include**:
   - Vulnerability class (e.g., OWASP API Top 10, Auth Bypass, IDOR, Injection, XSS)
   - Step-by-step reproduction steps or proof-of-concept description
   - Affected files, endpoints, or components
   - Impact assessment and potential severity rating (CVSS v3.1 / v4.0)
   - Proposed mitigation or defensive fix (if known)
3. **Response SLAs**:
   - **Initial Acknowledgement**: Within 24 hours
   - **Triage & Validation**: Within 48 hours
   - **Patch Release & Security Advisory**: Target within 7 calendar days

---

## Defensive Security Architecture & Standards

The E-HACKER application adheres to:
- **NIST Cybersecurity Framework (CSF)**: PR.DS-10 (Data Protection), PR.PS-01 (Defensive Architecture)
- **OWASP Top 10 & OWASP API Security Top 10 (2023)**
- **Transport Security**: Mandatory TLS 1.3, Strict HSTS (`max-age=31536000; includeSubDomains; preload`)
- **Browser Protection**: Strict Content Security Policy (CSP), Anti-MIME sniffing (`nosniff`), Frame Protection (`SAMEORIGIN`)
- **Session Protection**: Cryptographically secure PRNG session tokens (`crypto.randomBytes(24)`), No-store Cache-Control on sensitive API gateways.
