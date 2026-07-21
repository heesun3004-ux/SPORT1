const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const appCode = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');

function createApp(activeSnapshot = null) {
  const dom = new JSDOM(html, {
    url: 'http://localhost:3000/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const { window } = dom;
  window.Element.prototype.scrollIntoView = () => {};
  window.confirm = () => true;
  window.navigator.vibrate = () => true;
  window.navigator.wakeLock = {
    request: async () => ({ addEventListener() {}, release: async () => {} }),
  };
  window.navigator.serviceWorker = { register: async () => ({}) };
  window.SpeechSynthesisUtterance = class {
    constructor(text) { this.text = text; }
  };
  window.speechSynthesis = {
    cancel() {},
    speak() {},
    getVoices() { return []; },
  };
  window.AudioContext = class {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; }
    resume() { return Promise.resolve(); }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime() {} },
        connect(target) { return target; },
        start() {},
        stop() {},
      };
    }
    createGain() {
      return {
        gain: {
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
        connect(target) { return target; },
      };
    }
  };

  if (activeSnapshot) {
    window.localStorage.setItem('paceforge.active-session.v1', activeSnapshot);
  }

  window.eval(appCode);
  return dom;
}

function click(window, selector) {
  const element = window.document.querySelector(selector);
  assert.ok(element, `Missing element: ${selector}`);
  element.click();
  return element;
}

function setValue(window, selector, value) {
  const input = window.document.querySelector(selector);
  input.value = String(value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
}

function submit(window) {
  const form = window.document.querySelector('#sessionForm');
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

test('all six training modes are available and HYROX renders 16 ordered stages', () => {
  const dom = createApp();
  const { window } = dom;
  assert.equal(window.document.querySelectorAll('.mode-tab').length, 6);

  click(window, '[data-mode="hyrox"]');
  assert.equal(window.document.querySelector('#standardFields').hidden, true);
  assert.equal(window.document.querySelector('#hyroxFields').hidden, false);
  assert.equal(window.document.querySelectorAll('.route-row').length, 16);
  assert.match(window.document.querySelector('.route-row:nth-child(2)').textContent, /SKIERG/);
  assert.match(window.document.querySelector('.route-row:last-child').textContent, /WALL BALL/);
  assert.equal(window.document.querySelector('#transitionType').textContent, 'MANUAL');
  dom.window.close();
});

test('an interval session starts, completes manually, and writes local history', async () => {
  const dom = createApp();
  const { window } = dom;

  setValue(window, '#prepTime', 0);
  setValue(window, '#workTime', 5);
  setValue(window, '#restTime', 0);
  setValue(window, '#rounds', 1);
  setValue(window, '#sessionName', '테스트 인터벌');
  await submit(window);

  assert.equal(window.document.querySelector('#timerScreen').hidden, false);
  assert.match(window.document.querySelector('#timerMeta').textContent, /SET 1 \/ 1/);
  click(window, '#nextPhase');

  assert.equal(window.document.querySelector('#timerScreen').hidden, true);
  assert.equal(window.document.querySelector('#resultScreen').hidden, false);
  const history = JSON.parse(window.localStorage.getItem('paceforge.history.v1'));
  assert.equal(history.length, 1);
  assert.equal(history[0].name, '테스트 인터벌');
  assert.equal(history[0].mode, 'interval');
  dom.window.close();
});

test('For Time uses count-up display and a manual completion control', async () => {
  const dom = createApp();
  const { window } = dom;
  click(window, '[data-mode="fortime"]');
  setValue(window, '#prepTime', 0);
  setValue(window, '#workTime', 30);
  await submit(window);

  assert.equal(window.document.querySelector('#timerValue').textContent, '00:00');
  assert.equal(window.document.querySelector('#nextLabel').textContent, '운동 완료');
  assert.match(window.document.querySelector('#timerMeta').textContent, /TIME CAP/);
  click(window, '#nextPhase');
  assert.equal(window.document.querySelector('#resultScreen').hidden, false);
  dom.window.close();
});

test('HYROX division changes station loads and stores a split on completion', async () => {
  const dom = createApp();
  const { window } = dom;
  click(window, '[data-mode="hyrox"]');

  const division = window.document.querySelector('#division');
  division.value = 'menPro';
  division.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.match(window.document.querySelector('.route-row:nth-child(4)').textContent, /202 KG/);

  setValue(window, '#prepTime', 0);
  await submit(window);
  assert.match(window.document.querySelector('#timerLabel').textContent, /RUN 1/);
  click(window, '#nextPhase');
  assert.match(window.document.querySelector('#timerLabel').textContent, /SKIERG/);

  const snapshot = JSON.parse(window.localStorage.getItem('paceforge.active-session.v1'));
  assert.equal(snapshot.splits.length, 1);
  assert.equal(snapshot.splits[0].label, 'RUN 1');
  click(window, '#endSession');
  dom.window.close();
});

test('an interrupted session is detected and can be restored', async () => {
  const firstDom = createApp();
  setValue(firstDom.window, '#prepTime', 0);
  setValue(firstDom.window, '#workTime', 30);
  await submit(firstDom.window);
  const snapshot = firstDom.window.localStorage.getItem('paceforge.active-session.v1');
  assert.ok(snapshot);
  firstDom.window.close();

  const restoredDom = createApp(snapshot);
  const { window } = restoredDom;
  assert.equal(window.document.querySelector('#recoveryBanner').hidden, false);
  click(window, '#resumeRecovery');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.equal(window.document.querySelector('#timerScreen').hidden, false);
  assert.equal(window.document.querySelector('#recoveryBanner').hidden, true);
  click(window, '#endSession');
  restoredDom.window.close();
});

test('document structure has unique IDs and accessible interactive labels', () => {
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
  assert.equal(new Set(ids).size, ids.length);

  document.querySelectorAll('button').forEach((button) => {
    assert.ok(button.getAttribute('type'), `Button is missing type: ${button.textContent.trim()}`);
  });
  document.querySelectorAll('img').forEach((image) => {
    assert.ok(image.hasAttribute('alt'), `Image is missing alt: ${image.src}`);
  });
  document.querySelectorAll('input, select').forEach((control) => {
    const wrapped = control.closest('label');
    const labelled = control.id && document.querySelector(`label[for="${control.id}"]`);
    assert.ok(wrapped || labelled, `Control is missing a label: ${control.id}`);
  });
  dom.window.close();
});
