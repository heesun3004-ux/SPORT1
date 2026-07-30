const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "out");
const distDirectory = path.join(root, "dist");
const clientDirectory = path.join(distDirectory, "client");
const serverDirectory = path.join(distDirectory, "server");

fs.rmSync(distDirectory, { recursive: true, force: true });
fs.mkdirSync(serverDirectory, { recursive: true });
fs.cpSync(outputDirectory, clientDirectory, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", service: "paceforge" });
    }

    if (!env.ASSETS || typeof env.ASSETS.fetch !== "function") {
      return new Response("PACEFORGE asset binding is unavailable.", { status: 503 });
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    return env.ASSETS.fetch(
      new Request(new URL("/index.html", url.origin), request),
    );
  },
};
`;

fs.writeFileSync(path.join(serverDirectory, "index.js"), worker);
console.log("PACEFORGE Sites bundle created from the Next.js export.");
