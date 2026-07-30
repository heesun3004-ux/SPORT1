const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const page = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8");
const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");
const markup = fs.readFileSync(path.join(root, "app/paceforge-markup.ts"), "utf8");
const appCode = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

test("project uses the Next.js App Router", () => {
  assert.match(packageJson.scripts.dev, /^next dev$/);
  assert.ok(packageJson.dependencies.next);
  assert.match(page, /export default function Home/);
  assert.match(layout, /export default function RootLayout/);
});

test("all six workout modes and the interactive engine are preserved", () => {
  for (const mode of ["interval", "amrap", "emom", "tabata", "fortime", "hyrox"]) {
    assert.match(markup, new RegExp(`data-mode="${mode}"`));
    assert.match(appCode, new RegExp(`${mode}:`));
  }
  assert.match(appCode, /paceforge\.active-session\.v1/);
  assert.match(appCode, /paceforge\.history\.v1/);
  assert.match(appCode, /HYROX_STATIONS/);
});

test("metadata and health route are provided by Next.js", () => {
  assert.match(layout, /export const metadata/);
  assert.match(layout, /export const viewport/);
  const sitesBuild = fs.readFileSync(
    path.join(root, "scripts/build-sites.js"),
    "utf8",
  );
  assert.match(sitesBuild, /url\.pathname === "\/health"/);
});
