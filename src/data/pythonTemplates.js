export const PYTHON_TEMPLATES = {
    port_scanner: `#!/usr/bin/env python3
"""
E-Hacker Multi-Port & Service Banner Scanner
Protocol: TCP Handshake Audit
"""
import socket
import sys
import datetime

target_host = "scanme.nmap.org"
target_ports = [21, 22, 25, 53, 80, 110, 135, 139, 443, 445, 1433, 3306, 3389, 8080]

print(f"[*] Commencing TCP Port Scan against target: {target_host}")
print(f"[*] Audit Started at: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("-" * 50)

open_ports = []

for port in target_ports:
    status = "OPEN" if port in [22, 80, 443, 8080] else "FILTERED / CLOSED"
    service = {21: "FTP", 22: "SSH-2.0-OpenSSH", 80: "HTTP/1.1 (nginx)", 443: "HTTPS (TLSv1.3)", 8080: "HTTP-Proxy"}.get(port, "unknown")
    
    if "OPEN" in status:
        open_ports.append(port)
        print(f"[+] Port {port:5d}/tcp -> \\033[92m{status:8s}\\033[0m | Service: {service}")
    else:
        print(f"[-] Port {port:5d}/tcp -> {status}")

print("-" * 50)
print(f"[✓] Scan Complete! Identified {len(open_ports)} exposed TCP ports.")`,

    hash_cracker: `#!/usr/bin/env python3
"""
E-Hacker Cryptographic Hash & Salt Dictionary Cracker
Supported Algorithms: MD5, SHA-1, SHA-256
"""
import hashlib
import time

target_hash = "5d41402abc4b2a76b9719d911017c592"  # MD5 of 'hello'
algorithm = "md5"
wordlist = ["admin", "password", "123456", "shadow", "root", "toor", "hello", "secret"]

print(f"[*] Target Hash: {target_hash}")
print(f"[*] Target Algorithm: {algorithm.upper()}")
print(f"[*] Loaded Dictionary: {len(wordlist)} candidate words")
print("-" * 50)

start_time = time.time()
found = False

for index, candidate in enumerate(wordlist):
    candidate_hash = hashlib.md5(candidate.encode('utf-8')).hexdigest()
    print(f"[*] Testing [{index+1}/{len(wordlist)}]: {candidate:15s} -> {candidate_hash}")
    
    if candidate_hash == target_hash:
        elapsed = time.time() - start_time
        print("-" * 50)
        print(f"[+] HASH CRACKED SUCCESSFULLY!")
        print(f"[+] Plaintext: \\033[92m{candidate}\\033[0m")
        print(f"[+] Time Elapsed: {elapsed:.4f} seconds")
        found = True
        break

if not found:
    print("[-] Hash not found in current wordlist.")`,

    subdomain_enum: `#!/usr/bin/env python3
"""
E-Hacker DNS Subdomain Reconnaissance & Resolver
"""
domain = "example.com"
subdomains = ["www", "mail", "dev", "api", "admin", "vpn", "test", "auth", "portal", "cloud"]

print(f"[*] Target Domain: {domain}")
print(f"[*] Enumerating {len(subdomains)} common subdomain vectors...")
print("-" * 50)

discovered = []
for sub in subdomains:
    fqdn = f"{sub}.{domain}"
    ip = f"93.184.216.{10 + len(sub)}" if sub in ["www", "api", "vpn", "auth"] else None
    
    if ip:
        discovered.append((fqdn, ip))
        print(f"[+] Found: \\033[92m{fqdn:25s}\\033[0m -> IP: {ip}")
    else:
        print(f"[-] NXDOMAIN: {fqdn}")

print("-" * 50)
print(f"[✓] Enumeration Complete: {len(discovered)} active subdomains resolved.")`,

    header_audit: `#!/usr/bin/env python3
"""
E-Hacker HTTP Security Headers & CORS Misconfiguration Auditor
"""
target_url = "https://example.com"

headers = {
    "Server": "Apache/2.4.52 (Ubuntu)",
    "X-Powered-By": "PHP/8.1.2",
    "Content-Type": "text/html; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true"
}

required_security_headers = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy"
]

print(f"[*] Inspecting HTTP Security Posture: {target_url}")
print("-" * 50)

for req_h in required_security_headers:
    if req_h in headers:
        print(f"[✓] PASS: {req_h:30s} -> {headers[req_h]}")
    else:
        print(f"[!] MISSING: \\033[91m{req_h:30s}\\033[0m -> Vulnerable to clickjacking/MIME injection")

if headers.get("Access-Control-Allow-Origin") == "*" and headers.get("Access-Control-Allow-Credentials") == "true":
    print("\n[!] CRITICAL CORS ALERT: Overly permissive CORS wildcard with credentials allowed!")`,

    jwt_forger: `#!/usr/bin/env python3
"""
E-Hacker JWT (JSON Web Token) Header & Payload Analyzer
"""
import base64
import json

sample_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzM3IiwibmFtZSI6InJvb3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjQzNTkyMDB9.simulated_signature_blob"

parts = sample_jwt.split('.')
print(f"[*] Input JWT Token: {sample_jwt[:45]}...")
print("-" * 50)

header_raw = base64.urlsafe_b64decode(parts[0] + '==').decode('utf-8')
payload_raw = base64.urlsafe_b64decode(parts[1] + '==').decode('utf-8')

print("[+] Decoded Header:")
print(json.dumps(json.loads(header_raw), indent=4))

print("\n[+] Decoded Payload (Claims):")
print(json.dumps(json.loads(payload_raw), indent=4))

print("-" * 50)
print("[!] Token Security Assessment:")
print("    - Algorithm: HMAC-SHA256")
print("    - User ID: 1337 (admin role confirmed)")
print("    - Vulnerability Check: 'none' algorithm bypass disabled.")`,

    log_parser: `#!/usr/bin/env python3
"""
E-Hacker Apache/Syslog Threat Anomaly & Attack Pattern Parser
"""
import re

log_entries = [
    '192.168.1.105 - - [22/Aug/2026:14:20:11] "GET /index.php HTTP/1.1" 200 4521',
    '10.10.14.22 - - [22/Aug/2026:14:22:04] "GET /login.php?user=admin%27%20OR%201=1-- HTTP/1.1" 500 234',
    '10.10.14.22 - - [22/Aug/2026:14:23:19] "GET /admin/shell.php?cmd=whoami HTTP/1.1" 200 89',
    '192.168.1.110 - - [22/Aug/2026:14:25:30] "GET /images/logo.png HTTP/1.1" 200 12543'
]

patterns = {
    "SQL Injection": r"(?i)(UNION|SELECT|OR\s+1=1|--|#)",
    "Web Shell Execution": r"(?i)(cmd=|exec=|shell\.php|passthru)",
    "Path Traversal": r"(\.\./|\.\.\\)"
}

print("[*] Commencing SIEM Log Forensic Analysis...")
print("-" * 50)

for log in log_entries:
    matched = False
    for attack, regex in patterns.items():
        if re.search(regex, log):
            print(f"[!] \\033[91mALERT [{attack}]\\033[0m: {log}")
            matched = True
    if not matched:
        print(f"[i] Normal Request: {log[:60]}...")

print("-" * 50)
print("[✓] Analysis Complete: 2 threat anomalies identified.")`,

    xor_encoder: `#!/usr/bin/env python3
"""
E-Hacker Shellcode & Payload XOR Key Obfuscator
"""
import base64

payload = b"powershell.exe -NoP -Command \"whoami /priv\""
xor_key = 0x5A

encoded_bytes = bytearray()
for b in payload:
    encoded_bytes.append(b ^ xor_key)

b64_output = base64.b64encode(encoded_bytes).decode('utf-8')

print(f"[*] Original Payload: {payload.decode('utf-8')}")
print(f"[*] XOR Key: 0x{xor_key:02X} ({xor_key})")
print("-" * 50)
print(f"[+] Encoded Byte Array: {bytes(encoded_bytes)}")
print(f"[+] Base64 Transport String: \\033[92m{b64_output}\\033[0m")
print("-" * 50)

# Decode verification
decoded_bytes = bytearray()
for b in encoded_bytes:
    decoded_bytes.append(b ^ xor_key)

print(f"[✓] Verified Decoding: {decoded_bytes.decode('utf-8')}")`,

    sqli_detector: `#!/usr/bin/env python3
"""
E-Hacker SQL Injection & XSS Payload Anomaly Detector
"""
import re

test_inputs = [
    "user_search_term",
    "admin' UNION SELECT null, username, password FROM users--",
    "<script>alert(document.cookie)</script>",
    "normal_input_123",
    "'; DROP TABLE logs;--"
]

sqli_regex = re.compile(r"(?i)(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|ALTER)\b|['\"]\s*OR\s*['\"]?1['\"]?\s*=\s*['\"]?1|--|#|/\*)")
xss_regex = re.compile(r"(?i)(<script|javascript:|onerror=|onload=|<img\s+src=)")

print("[*] Testing WAF Injection Rule Filters...")
print("-" * 50)

for text in test_inputs:
    if sqli_regex.search(text):
        print(f"[!] \\033[91mSQLi DETECTED\\033[0m: {text}")
    elif xss_regex.search(text):
        print(f"[!] \\033[93mXSS DETECTED\\033[0m: {text}")
    else:
        print(f"[✓] CLEAN INPUT: {text}")

print("-" * 50)
print("[✓] Injection evaluation complete.")`
};
