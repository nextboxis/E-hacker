# Serverless API: Python Cybersecurity Analyzer & Threat Engine
from http.server import BaseHTTPRequestHandler
import json
import re
import hashlib

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            req_json = json.loads(post_data.decode('utf-8'))
        except Exception:
            req_json = {}

        action = req_json.get('action', 'analyze')
        target = req_json.get('target', '')
        results = {
            "status": "success",
            "runtime": "Python 3.11 Serverless Engine",
            "action": action,
            "target": target,
            "analysis": {
                "md5": hashlib.md5(target.encode("utf-8")).hexdigest(),
                "sha256": hashlib.sha256(target.encode("utf-8")).hexdigest(),
                "length": len(target),
                "is_sql_injection": bool(re.search(r"(?i)(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP)\b|['"]\s*OR\s*['"]?1)", target)),
                "is_xss": bool(re.search(r"(?i)(<script|javascript:|onerror=|onload=)", target)),
                "is_command_injection": bool(re.search(r"(;|&&|\|\||`|\$\()", target))
            }
        }
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(results, indent=2).encode('utf-8'))

    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        response = {
            "status": "healthy",
            "service": "E-HACKER Python Cybersecurity Serverless Gateway",
            "version": "Python 3.11"
        }
        self.wfile.write(json.dumps(response, indent=2).encode('utf-8'))