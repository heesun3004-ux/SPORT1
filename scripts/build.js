const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const clientDir = path.join(distDir, 'client');
const serverDir = path.join(distDir, 'server');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(clientDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.cpSync(publicDir, clientDir, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'paceforge' });
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('PACEFORGE asset binding is unavailable.', { status: 503 });
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const fallbackUrl = new URL('/index.html', url.origin);
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  }
};
`;

fs.writeFileSync(path.join(serverDir, 'index.js'), worker);
console.log('PACEFORGE deployment bundle created.');
