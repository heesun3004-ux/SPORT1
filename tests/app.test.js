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

test("HYROX disables hidden standard inputs so native form validation cannot block start", () => {
  assert.match(
    appCode,
    /standardFields\.querySelectorAll\('input'\).*input\.disabled = isHyrox/s,
  );
  assert.match(appCode, /division\.disabled = !isHyrox/);
});

test("arena transition buzzers are prominent and never overlap voice guidance", () => {
  for (const cue of ["warning", "rest", "round", "finish"]) {
    assert.match(appCode, new RegExp(`kind === '${cue}'`));
  }
  assert.match(appCode, /phase\.type === 'rest' \? 'rest'/);
  assert.match(appCode, /second === 10 && phase\.type === 'rest'/);
  assert.match(appCode, /function stadiumBlast/);
  assert.match(appCode, /duration = 1/);
  assert.match(appCode, /scheduleTone\(180 \* pitch/);
  assert.match(appCode, /return 1000/);
  assert.match(appCode, /gain\.gain\.setValueAtTime\(volume, releaseStart\)/);
  assert.match(appCode, /announceAfterCue\(phaseAnnouncement\(phase\), cueDuration\)/);
  assert.match(appCode, /cueDuration \+ 120/);
  assert.match(appCode, /utterance\.rate = 1\.26/);
  assert.match(markup, /경기장 신호음/);
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
