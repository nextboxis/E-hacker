import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost:3000');
        const pathname = urlObj.pathname;
        const query = Object.fromEntries(urlObj.searchParams.entries());
        req.query = query;

        if (req.method === 'POST' || req.method === 'PUT') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const bodyStr = Buffer.concat(buffers).toString();
          try {
            req.body = bodyStr ? JSON.parse(bodyStr) : {};
          } catch {
            req.body = {};
          }
        }

        res.status = function(code) {
          res.statusCode = code;
          return {
            json: (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(data, null, 2));
            },
            end: () => res.end()
          };
        };

        try {
          if (pathname === '/api/auth') {
            const { default: handler } = await import('./api/auth.js');
            return handler(req, res);
          }
          if (pathname === '/api/ai' || pathname === '/api/ai-assistant') {
            const { default: handler } = await import('./api/ai-assistant.js');
            return handler(req, res);
          }
          if (pathname === '/api/cve' || pathname === '/api/cve-feed') {
            const { default: handler } = await import('./api/cve-feed.js');
            return handler(req, res);
          }
          if (pathname === '/api/threats' || pathname === '/api/threat-intel') {
            const { default: handler } = await import('./api/threat-intel.js');
            return handler(req, res);
          }
          if (pathname === '/api/db' || pathname === '/api/database') {
            const { default: handler } = await import('./api/database.js');
            return handler(req, res);
          }
          if (pathname === '/api/analyze') {
            const rawTarget = (req.body?.target || req.query?.target || '');
            const target = String(rawTarget).slice(0, 5000);
            const results = {
              status: "success",
              runtime: "Node.js / Python 3.11 Emulated Security Gateway",
              action: req.body?.action || req.query?.action || 'analyze',
              target: target,
              analysis: {
                md5: crypto.createHash('md5').update(target).digest('hex'),
                sha256: crypto.createHash('sha256').update(target).digest('hex'),
                length: target.length,
                is_sql_injection: Boolean(/(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP)\b|['"]\s*OR\s*['"]?1)/i.test(target)),
                is_xss: Boolean(/(<script|javascript:|onerror=|onload=)/i.test(target)),
                is_command_injection: Boolean(/(;|&&|\|\||`|\$\()/i.test(target))
              }
            };
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            return res.status(200).json(results);
          }
          next();
        } catch (err) {
          console.error('[API Dev Server Error]:', err);
          res.status(500).json({ status: 'error', message: err.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
