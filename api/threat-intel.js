// Serverless API: Threat Intelligence & Advisory Telemetry
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const threatBulletins = [
        {
            threat_actor: "Volt Typhoon (BRONZE SILHOUETTE)",
            target_sector: "Critical Infrastructure / Energy / Water",
            primary_technique: "Living-off-the-Land (LOLBins), Router SOHO Proxies",
            mitre_id: "G0135",
            alert_level: "HIGH",
            advisory: "Adversaries maintain stealth persistence using native Windows utilities (wmic, ntdsutil, netsh) avoiding malware binary detection.",
            indicators: ["TCP/8080 C2 proxying", "Port forwarding via netsh interface portproxy", "NTDS.dit volume snapshot staging"]
        },
        {
            threat_actor: "Scattered Spider (UNC3944)",
            target_sector: "Identity Providers, Telecom, Cloud SaaS",
            primary_technique: "SIM Swapping, Helpdesk Social Engineering, MFA Fatigue",
            mitre_id: "G1015",
            alert_level: "CRITICAL",
            advisory: "Specializes in voice phishing helpdesk agents to reset Okta / Azure AD credentials, followed by Okta FastPass phishing and cloud persistence.",
            indicators: ["Anomalous Okta device registrations", "Helpdesk credential reset velocity", "AWS role chaining via SSO"]
        },
        {
            threat_actor: "LockBit 3.0 (Black) Ransomware",
            target_sector: "Healthcare, Manufacturing, Government",
            primary_technique: "StealBit Exfiltration, Cobalt Strike, PsExec Distribution",
            mitre_id: "G0096",
            alert_level: "CRITICAL",
            advisory: "Double extortion ransomware abusing abused valid credentials to deploy encryptors through Group Policy Objects (GPO).",
            indicators: ["vssadmin delete shadows /all /quiet", "GPO script deployment of locker.exe", "Exfiltration to Mega.nz and Wasabi cloud"]
        }
    ];

    res.status(200).json({
        success: true,
        status: "success",
        timestamp: new Date().toISOString(),
        threat_count: threatBulletins.length,
        bulletins: threatBulletins,
        threats: threatBulletins
    });
}
