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

test("three-second countdown tones use the audio clock at exact one-second intervals", () => {
  assert.match(appCode, /\[3000, 2000, 1000\]\.forEach/);
  assert.match(appCode, /delayMs = remainingMs - thresholdMs/);
  assert.match(appCode, /scheduleTone\(1080, delayMs \/ 1000, 0\.11, 0\.11, 'square'\)/);
  assert.match(appCode, /function cancelCountdownTones/);
  assert.match(appCode, /schedulePhaseCountdown\(\);/);
  assert.doesNotMatch(appCode, /\[3, 2, 1\]\.includes\(second\)/);
});

test("metadata and health route are provided by Next.js", () => {
  assert.match(layout, /export const metadata/);
  assert.match(layout, /export const viewport/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/sport1-six\.vercel\.app"\)/);
  assert.match(layout, /url: "\/og\.png"/);
  const sitesBuild = fs.readFileSync(
    path.join(root, "scripts/build-sites.js"),
    "utf8",
  );
  assert.match(sitesBuild, /url\.pathname === "\/health"/);
});

test("mobile layout is divided into accessible top-level categories", () => {
  for (const category of ["home", "modes", "program", "timer", "features", "history"]) {
    assert.match(markup, new RegExp(`data-mobile-category="${category}"`));
    assert.match(markup, new RegExp(`data-mobile-panel="${category}"`));
  }
  assert.match(appCode, /function setMobileView/);
  assert.match(appCode, /window\.matchMedia\('\(max-width: 980px\)'\)/);
  const styles = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
  assert.match(styles, /\.mobile-category-nav/);
  assert.match(styles, /body\[data-mobile-view="timer"\]/);
  assert.match(
    markup,
    /data-mobile-category="home"[\s\S]*data-mobile-category="program"[\s\S]*data-mobile-category="modes"/,
  );
  assert.match(markup, /href="#program" data-mobile-category="program"/);
  assert.match(appCode, /HASH_TO_VIEW/);
  assert.match(appCode, /history\.pushState\(null, '', hash\)/);
  assert.match(appCode, /window\.addEventListener\('popstate'/);
});

test("custom programs can be composed, saved, and run through the timer engine", () => {
  assert.match(markup, /id="customProgramForm"/);
  assert.match(markup, /id="customBlockList"/);
  assert.match(markup, /id="addCustomBlock"/);
  assert.match(appCode, /paceforge\.custom-program\.v1/);
  assert.match(appCode, /function buildCustomProgramSession/);
  assert.match(appCode, /function calculateCustomTotal/);
  assert.match(appCode, /customSet: set/);
  assert.match(appCode, /nextExercise:/);
  assert.match(appCode, /startCustomProgram\(readCustomProgram\(\)\)/);
  assert.match(appCode, /activeSession\.mode === 'custom'/);
  assert.match(appCode, /nextView === 'program'.*initializeCustomProgram\(\)/s);
});

test("the service worker refreshes the custom navigation release", () => {
  const worker = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");
  assert.match(worker, /paceforge-v3/);
  assert.doesNotMatch(worker, /\/index\.html/);
  assert.doesNotMatch(worker, /\/styles\.css/);
  assert.match(page, /app\.js\?v=20260731-custom-nav/);
});

test("section copy is concise, functional, and readable on mobile", () => {
  for (const copy of [
    "시간은 맡기고",
    "원하는 운동을",
    "내 운동 순서를",
    "시간만 정하면",
    "화면을 보지 않아도",
    "완료한 운동을",
  ]) {
    assert.match(markup, new RegExp(copy));
  }
  assert.doesNotMatch(markup, /오늘의 고통을/);
  const styles = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");
  assert.match(styles, /\.section h2 \{ font-size: 38px/);
  assert.match(styles, /\.hero-lead \{ font-size: 14px; line-height: 1\.65/);
});
