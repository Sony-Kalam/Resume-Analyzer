import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

function n8nProxyPlugin(): Plugin {
  return {
    name: 'n8n-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/n8n/submit', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const targetUrl = data.url || 'https://sony-kalam.app.n8n.cloud/form/04ee9b4a-38a3-4345-8668-b67e089790e6';
            const payload = data.payload || {};

            const startTime = Date.now();
            let response: Response;
            try {
              response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'SonyKalamAutomationHub/1.0',
                  ...(data.headers || {}),
                },
                body: JSON.stringify(payload),
              });
            } catch (fetchErr: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: false,
                  status: 0,
                  statusText: 'Network Error',
                  latencyMs: Date.now() - startTime,
                  error: fetchErr.message || 'Failed to reach n8n server',
                })
              );
              return;
            }

            const latencyMs = Date.now() - startTime;
            const text = await response.text();
            let parsedJson: any = null;
            try {
              parsedJson = JSON.parse(text);
            } catch {
              parsedJson = null;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                latencyMs,
                responseBody: parsedJson || text,
                isN8nInactive: response.status === 404,
              })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error: err.message || 'Failed to proxy request to n8n',
              })
            );
          }
        });
      });

      server.middlewares.use('/api/n8n/health', async (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = body ? JSON.parse(body) : {};
            const targetUrl = data.url || 'https://sony-kalam.app.n8n.cloud/form/04ee9b4a-38a3-4345-8668-b67e089790e6';

            const startTime = Date.now();
            let response: Response;
            try {
              response = await fetch(targetUrl, {
                method: 'GET',
                headers: {
                  'User-Agent': 'SonyKalamAutomationHub/1.0',
                },
              });
            } catch (err: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  ok: false,
                  status: 0,
                  latencyMs: Date.now() - startTime,
                  error: err.message || 'Connection unreachable',
                  workflowActive: false,
                })
              );
              return;
            }

            const latencyMs = Date.now() - startTime;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: response.status < 400,
                status: response.status,
                statusText: response.statusText,
                latencyMs,
                workflowActive: response.status !== 404,
              })
            );
          } catch (err: any) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                error: err.message || 'Health check error',
                workflowActive: false,
              })
            );
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), n8nProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
