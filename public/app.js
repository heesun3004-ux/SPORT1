(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const STORAGE_KEYS = {
    active: 'paceforge.active-session.v1',
    history: 'paceforge.history.v1',
    custom: 'paceforge.custom-program.v1',
  };

  const MODE_CONFIG = {
    interval: { number: '01', title: 'CUSTOM INTERVAL', defaults: [10, 60, 30, 5], workLabel: '운동 시간', roundLabel: '세트 수' },
    amrap: { number: '02', title: 'AMRAP', defaults: [10, 720, 0, 1], workLabel: '제한 시간', roundLabel: '라운드' },
    emom: { number: '03', title: 'EMOM', defaults: [10, 60, 0, 12], workLabel: '인터벌 길이', roundLabel: '총 인터벌' },
    tabata: { number: '04', title: 'TABATA', defaults: [10, 20, 10, 8], workLabel: '운동 시간', roundLabel: '세트 수' },
    fortime: { number: '05', title: 'FOR TIME', defaults: [10, 1200, 0, 1], workLabel: '타임캡', roundLabel: '세트 수' },
    hyrox: { number: '06', title: 'HYROX FULL RACE', defaults: [10, 0, 0, 1], workLabel: '', roundLabel: '' },
  };

  const CUSTOM_EXERCISE_VOICE_CUES = {
    '버피': 'exercise-burpee',
    '에어 스쿼트': 'exercise-air-squat',
    '스쿼트': 'exercise-squat',
    '푸시업': 'exercise-push-up',
    '푸시 업': 'exercise-push-up',
    '런지': 'exercise-lunge',
    '플랭크': 'exercise-plank',
    '마운틴 클라이머': 'exercise-mountain-climber',
    '점핑 잭': 'exercise-jumping-jack',
    '점핑잭': 'exercise-jumping-jack',
    '케틀벨 스윙': 'exercise-kettlebell-swing',
    '데드리프트': 'exercise-deadlift',
    '스내치': 'exercise-snatch',
    '클린': 'exercise-clean',
    '쓰러스터': 'exercise-thruster',
    '로잉': 'exercise-row',
    '러닝': 'exercise-run',
  };

  const VOICE_ASSET_KEYS = new Set([
    'prep', 'set', 'interval', 'tabata', 'custom', 'emom', 'fortime', 'amrap', 'warning',
    'paused', 'resume', 'timecap', 'complete', 'output-test',
    ...Array.from({ length: 16 }, (_, index) => `hyrox-${String(index + 1).padStart(2, '0')}`),
    ...Array.from({ length: 300 }, (_, index) => `rest-${String(index + 1).padStart(3, '0')}`),
    ...Object.values(CUSTOM_EXERCISE_VOICE_CUES),
  ]);
  const VOICE_ASSETS = Object.fromEntries(
    [...VOICE_ASSET_KEYS].map((key) => [key, `/audio/voice/${key}.wav`]),
  );

  const HYROX_STATIONS = [
    { name: 'RUN 1', target: '1 KM' },
    { name: 'SKIERG', target: '1,000 M' },
    { name: 'RUN 2', target: '1 KM' },
    { name: 'SLED PUSH', target: '50 M', load: { women: '102 KG', womenPro: '152 KG', men: '152 KG', menPro: '202 KG' } },
    { name: 'RUN 3', target: '1 KM' },
    { name: 'SLED PULL', target: '50 M', load: { women: '78 KG', womenPro: '103 KG', men: '103 KG', menPro: '153 KG' } },
    { name: 'RUN 4', target: '1 KM' },
    { name: 'BURPEE BROAD JUMP', target: '80 M' },
    { name: 'RUN 5', target: '1 KM' },
    { name: 'ROW', target: '1,000 M' },
    { name: 'RUN 6', target: '1 KM' },
    { name: 'FARMERS CARRY', target: '200 M', load: { women: '2×16 KG', womenPro: '2×24 KG', men: '2×24 KG', menPro: '2×32 KG' } },
    { name: 'RUN 7', target: '1 KM' },
    { name: 'SANDBAG LUNGE', target: '100 M', load: { women: '10 KG', womenPro: '20 KG', men: '20 KG', menPro: '30 KG' } },
    { name: 'RUN 8', target: '1 KM' },
    { name: 'WALL BALL', target: '100 REPS', load: { women: '4 KG', womenPro: '6 KG', men: '6 KG', menPro: '9 KG' } },
  ];

  const refs = {
    form: $('#sessionForm'),
    tabs: $$('.mode-tab'),
    standardFields: $('#standardFields'),
    hyroxFields: $('#hyroxFields'),
    prep: $('#prepTime'),
    work: $('#workTime'),
    rest: $('#restTime'),
    rounds: $('#rounds'),
    workField: $('#workField'),
    restField: $('#restField'),
    roundField: $('#roundField'),
    division: $('#division'),
    route: $('#hyroxRoute'),
    name: $('#sessionName'),
    sound: $('#soundEnabled'),
    voice: $('#voiceEnabled'),
    vibration: $('#vibrationEnabled'),
    testAudioOutput: $('#testAudioOutput'),
    selectAudioOutput: $('#selectAudioOutput'),
    audioOutputStatus: $('#audioOutputStatus'),
    modeNumber: $('#modeNumber'),
    modeTitle: $('#modeTitle'),
    previewMode: $('#previewMode'),
    previewClock: $('#previewClock'),
    previewLabel: $('#previewLabel'),
    previewNext: $('#previewNext'),
    previewProgress: $('#previewProgress'),
    totalTime: $('#totalTime'),
    transitionType: $('#transitionType'),
    timerScreen: $('#timerScreen'),
    timerMain: $('#timerMain'),
    liveSessionName: $('#liveSessionName'),
    timerState: $('#timerState'),
    timerValue: $('#timerValue'),
    timerLabel: $('#timerLabel'),
    timerMeta: $('#timerMeta'),
    timerBar: $('#timerBarFill'),
    timerNext: $('#timerNext'),
    pause: $('#pauseTimer'),
    pauseIcon: $('#pauseIcon'),
    pauseLabel: $('#pauseLabel'),
    next: $('#nextPhase'),
    nextLabel: $('#nextLabel'),
    previous: $('#previousPhase'),
    end: $('#endSession'),
    fullscreen: $('#toggleFullscreen'),
    resultScreen: $('#resultScreen'),
    resultTime: $('#resultTime'),
    splitList: $('#splitList'),
    closeResult: $('#closeResult'),
    repeatSession: $('#repeatSession'),
    historyList: $('#historyList'),
    clearHistory: $('#clearHistory'),
    recoveryBanner: $('#recoveryBanner'),
    recoveryInfo: $('#recoveryInfo'),
    resumeRecovery: $('#resumeRecovery'),
    discardRecovery: $('#discardRecovery'),
    toast: $('#toast'),
    customForm: $('#customProgramForm'),
    customName: $('#customProgramName'),
    customPrep: $('#customPrepTime'),
    customList: $('#customBlockList'),
    customSummary: $('#customProgramSummary'),
    addCustomBlock: $('#addCustomBlock'),
  };

  let selectedMode = 'interval';
  let activeSession = null;
  let lastSessionConfig = null;
  let ticker = null;
  let audioContext = null;
  let wakeLock = null;
  let lastCueSecond = null;
  let countdownOscillators = new Set();
  let voiceCueTimer = null;
  let voiceRequestId = 0;
  const currentVoiceSources = new Set();
  let selectedOutputDevice = null;
  const voiceBuffers = new Map();
  const voiceBufferPromises = new Map();
  let toastTimer = null;
  let recoveryCandidate = null;

  const MOBILE_VIEWS = new Set(['home', 'program', 'modes', 'timer', 'features', 'history']);
  const HASH_TO_VIEW = {
    '#top': 'home',
    '#program': 'program',
    '#modes': 'modes',
    '#studio': 'timer',
    '#features': 'features',
    '#history': 'history',
  };

  function setMobileView(view, shouldScroll = true) {
    const nextView = MOBILE_VIEWS.has(view) ? view : 'home';
    document.body.dataset.mobileView = nextView;
    $$('[data-mobile-category]').forEach((button) => {
      const active = button.dataset.mobileCategory === nextView;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    if (nextView === 'program' && refs.customList && !refs.customList.children.length) initializeCustomProgram();
    if (nextView === 'program' && refs.customList?.children.length) updateCustomProgram();
    if (shouldScroll && window.matchMedia('(max-width: 980px)').matches) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function clampNumber(input, fallback, min, max) {
    const value = Number(input);
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, value));
  }

  function formatTime(milliseconds, showHours = false) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (showHours || hours > 0) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function formatElapsed(milliseconds) {
    return formatTime(Math.floor(Math.max(0, milliseconds) / 1000) * 1000);
  }

  function announceToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => refs.toast.classList.remove('show'), 2400);
  }

  function getStationTarget(station, division) {
    return station.load ? `${station.target} · ${station.load[division]}` : station.target;
  }

  function renderHyroxRoute() {
    const division = refs.division.value;
    refs.route.innerHTML = HYROX_STATIONS.map((station, index) => `
      <div class="route-row">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${station.name}</strong>
        <b>${getStationTarget(station, division)}</b>
      </div>`).join('');
  }

  function setMode(mode, shouldScroll = false) {
    selectedMode = mode;
    const config = MODE_CONFIG[mode];
    const [prep, work, rest, rounds] = config.defaults;

    refs.tabs.forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    refs.modeNumber.textContent = config.number;
    refs.modeTitle.textContent = config.title;
    refs.prep.value = prep;
    refs.work.value = work;
    refs.rest.value = rest;
    refs.rounds.value = rounds;
    refs.name.value = config.title;
    refs.workField.querySelector(':scope > span').textContent = config.workLabel;
    refs.roundField.querySelector(':scope > span').textContent = config.roundLabel;

    const isHyrox = mode === 'hyrox';
    refs.standardFields.hidden = isHyrox;
    refs.hyroxFields.hidden = !isHyrox;
    refs.standardFields.querySelectorAll('input').forEach((input) => {
      input.disabled = isHyrox;
    });
    refs.division.disabled = !isHyrox;
    refs.restField.hidden = ['amrap', 'emom', 'fortime'].includes(mode);
    refs.roundField.hidden = ['amrap', 'fortime'].includes(mode);
    refs.workField.hidden = isHyrox;

    if (isHyrox) renderHyroxRoute();
    updatePreview();

    if (shouldScroll) {
      setMobileView('timer');
      $('#studio').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function readSettings() {
    return {
      mode: selectedMode,
      prep: clampNumber(refs.prep.value, 10, 0, 300),
      work: clampNumber(refs.work.value, 60, 5, 7200),
      rest: clampNumber(refs.rest.value, 0, 0, 300),
      rounds: clampNumber(refs.rounds.value, 1, 1, 100),
      division: refs.division.value,
      name: refs.name.value.trim() || MODE_CONFIG[selectedMode].title,
      cues: {
        sound: refs.sound.checked,
        voice: refs.voice.checked,
        vibration: refs.vibration.checked,
      },
    };
  }

  function customBlockMarkup(block = {}) {
    const name = escapeHtml(block.name || '새 운동');
    const work = clampNumber(block.work, 40, 5, 7200);
    const rest = clampNumber(block.rest, 20, 0, 300);
    const sets = clampNumber(block.sets, 3, 1, 100);
    return `<div class="custom-block">
      <label class="custom-field"><span>운동 이름</span><input class="custom-exercise-name" type="text" maxlength="40" value="${name}" autocomplete="off" required></label>
      <label class="custom-field"><span>운동 시간</span><div><input class="custom-work" type="number" min="5" max="7200" value="${work}" inputmode="numeric" required><b>초</b></div></label>
      <label class="custom-field"><span>휴식 시간</span><div><input class="custom-rest" type="number" min="0" max="300" value="${rest}" inputmode="numeric" required><b>초</b></div></label>
      <label class="custom-field"><span>세트 수</span><div><input class="custom-sets" type="number" min="1" max="100" value="${sets}" inputmode="numeric" required><b>SET</b></div></label>
      <button class="remove-custom-block" type="button" aria-label="운동 삭제">×</button>
    </div>`;
  }

  function addCustomProgramBlock(block = {}) {
    if ($$('.custom-block', refs.customList).length >= 12) {
      announceToast('운동은 최대 12개까지 추가할 수 있습니다.');
      return;
    }
    refs.customList.insertAdjacentHTML('beforeend', customBlockMarkup(block));
    updateCustomProgram();
  }

  function readCustomProgram() {
    const blocks = $$('.custom-block', refs.customList).map((row, index) => ({
      name: $('.custom-exercise-name', row).value.trim() || `운동 ${index + 1}`,
      work: clampNumber($('.custom-work', row).value, 40, 5, 7200),
      rest: clampNumber($('.custom-rest', row).value, 20, 0, 300),
      sets: clampNumber($('.custom-sets', row).value, 3, 1, 100),
    }));
    return {
      mode: 'custom',
      name: refs.customName.value.trim() || '나의 프로그램',
      prep: clampNumber(refs.customPrep.value, 10, 0, 300),
      blocks,
      cues: {
        sound: refs.sound.checked,
        voice: refs.voice.checked,
        vibration: refs.vibration.checked,
      },
    };
  }

  function calculateCustomTotal(settings) {
    const totalSets = settings.blocks.reduce((total, block) => total + block.sets, 0);
    let completedSets = 0;
    let seconds = settings.prep;
    settings.blocks.forEach((block) => {
      for (let set = 1; set <= block.sets; set += 1) {
        completedSets += 1;
        seconds += block.work;
        if (completedSets < totalSets) seconds += block.rest;
      }
    });
    return { totalSets, durationMs: seconds * 1000 };
  }

  function saveCustomDraft(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.custom, JSON.stringify({
        name: settings.name,
        prep: settings.prep,
        blocks: settings.blocks,
      }));
    } catch (_) { /* storage may be blocked */ }
  }

  function updateCustomProgram() {
    const settings = readCustomProgram();
    const totals = calculateCustomTotal(settings);
    refs.customSummary.textContent = `운동 ${settings.blocks.length}개 · ${totals.totalSets}세트 · ${formatTime(totals.durationMs)}`;
    saveCustomDraft(settings);
  }

  function initializeCustomProgram() {
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(STORAGE_KEYS.custom) || 'null'); } catch (_) { /* use defaults */ }
    const blocks = Array.isArray(draft?.blocks) && draft.blocks.length
      ? draft.blocks.slice(0, 12)
      : [
        { name: '버피', work: 40, rest: 20, sets: 3 },
        { name: '에어 스쿼트', work: 45, rest: 15, sets: 3 },
      ];
    refs.customName.value = typeof draft?.name === 'string' ? draft.name.slice(0, 40) : '나의 프로그램';
    refs.customPrep.value = clampNumber(draft?.prep, 10, 0, 300);
    refs.customList.innerHTML = '';
    blocks.forEach((block) => refs.customList.insertAdjacentHTML('beforeend', customBlockMarkup(block)));
    updateCustomProgram();
  }

  function calculateTotal(settings) {
    if (settings.mode === 'hyrox' || settings.mode === 'fortime') return null;
    if (settings.mode === 'amrap') return (settings.prep + settings.work) * 1000;
    if (settings.mode === 'emom') return (settings.prep + settings.work * settings.rounds) * 1000;
    return (settings.prep + (settings.work * settings.rounds) + (settings.rest * Math.max(0, settings.rounds - 1))) * 1000;
  }

  function updatePreview() {
    const settings = readSettings();
    const isManual = ['hyrox', 'fortime'].includes(settings.mode);
    refs.previewMode.textContent = settings.mode.toUpperCase();
    refs.transitionType.textContent = isManual ? 'MANUAL' : 'AUTO';
    refs.previewProgress.style.width = settings.mode === 'hyrox' ? '6.25%' : '66%';

    if (settings.mode === 'hyrox') {
      refs.previewClock.textContent = '00:00';
      refs.previewLabel.textContent = 'RUN 1 / 16 STAGES';
      refs.previewNext.textContent = 'SKIERG · 1,000 M';
      refs.totalTime.textContent = 'SPLIT';
      return;
    }

    if (settings.mode === 'fortime') {
      refs.previewClock.textContent = '00:00';
      refs.previewLabel.textContent = `FOR TIME / CAP ${formatTime(settings.work * 1000)}`;
      refs.previewNext.textContent = 'MANUAL FINISH';
      refs.totalTime.textContent = formatTime(settings.work * 1000);
      return;
    }

    refs.previewClock.textContent = formatTime(settings.work * 1000);
    if (settings.mode === 'amrap') {
      refs.previewLabel.textContent = 'AS MANY ROUNDS AS POSSIBLE';
      refs.previewNext.textContent = 'SESSION COMPLETE';
    } else if (settings.mode === 'emom') {
      refs.previewLabel.textContent = `MINUTE 1 OF ${settings.rounds}`;
      refs.previewNext.textContent = 'NEXT MINUTE';
    } else {
      refs.previewLabel.textContent = `WORK / SET 1 OF ${settings.rounds}`;
      refs.previewNext.textContent = settings.rest ? `REST · ${formatTime(settings.rest * 1000)}` : 'NEXT SET';
    }
    refs.totalTime.textContent = formatTime(calculateTotal(settings));
  }

  function buildSession(settings) {
    const phases = [];
    if (settings.prep > 0) phases.push({ type: 'prep', label: 'GET READY', durationMs: settings.prep * 1000, round: 0 });

    if (settings.mode === 'interval' || settings.mode === 'tabata') {
      for (let round = 1; round <= settings.rounds; round += 1) {
        phases.push({ type: 'work', label: 'WORK', durationMs: settings.work * 1000, round });
        if (round < settings.rounds && settings.rest > 0) phases.push({ type: 'rest', label: 'REST', durationMs: settings.rest * 1000, round });
      }
    }

    if (settings.mode === 'amrap') {
      phases.push({ type: 'work', label: 'AMRAP', durationMs: settings.work * 1000, round: 1 });
    }

    if (settings.mode === 'emom') {
      for (let round = 1; round <= settings.rounds; round += 1) {
        phases.push({ type: 'work', label: `MINUTE ${round}`, durationMs: settings.work * 1000, round });
      }
    }

    if (settings.mode === 'fortime') {
      phases.push({ type: 'manual', label: 'FOR TIME', countUp: true, capMs: settings.work * 1000, round: 1 });
    }

    if (settings.mode === 'hyrox') {
      HYROX_STATIONS.forEach((station, index) => {
        phases.push({
          type: 'manual',
          label: station.name,
          target: getStationTarget(station, settings.division),
          countUp: true,
          round: index + 1,
        });
      });
    }

    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...settings,
      phases,
      phaseIndex: 0,
      status: 'running',
      startedAtEpoch: Date.now(),
      totalPausedMs: 0,
      pausedAtEpoch: null,
      splits: [],
    };
  }

  function buildCustomProgramSession(settings) {
    const phases = [];
    const totalSets = settings.blocks.reduce((total, block) => total + block.sets, 0);
    let round = 0;
    if (settings.prep > 0) phases.push({ type: 'prep', label: 'GET READY', durationMs: settings.prep * 1000, round: 0 });

    settings.blocks.forEach((block, blockIndex) => {
      for (let set = 1; set <= block.sets; set += 1) {
        round += 1;
        phases.push({
          type: 'work',
          label: block.name,
          durationMs: block.work * 1000,
          round,
          customSet: set,
          customSets: block.sets,
        });
        if (round < totalSets && block.rest > 0) {
          const nextBlock = set < block.sets ? block : settings.blocks[blockIndex + 1];
          phases.push({
            type: 'rest',
            label: 'REST',
            durationMs: block.rest * 1000,
            round,
            nextExercise: nextBlock?.name || '',
          });
        }
      }
    });

    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...settings,
      rounds: totalSets,
      phases,
      phaseIndex: 0,
      status: 'running',
      startedAtEpoch: Date.now(),
      totalPausedMs: 0,
      pausedAtEpoch: null,
      splits: [],
    };
  }

  async function unlockAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioContext = new AudioContextClass();
    }
    if (audioContext?.state === 'suspended') await audioContext.resume();
  }

  function updateAudioOutputStatus(message) {
    if (refs.audioOutputStatus) refs.audioOutputStatus.textContent = message;
  }

  async function loadVoiceBuffer(cue) {
    if (!audioContext || !VOICE_ASSETS[cue]) return null;
    if (voiceBuffers.has(cue)) return voiceBuffers.get(cue);
    if (voiceBufferPromises.has(cue)) return voiceBufferPromises.get(cue);

    const promise = fetch(VOICE_ASSETS[cue], { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(`Voice asset unavailable: ${cue}`);
        return response.arrayBuffer();
      })
      .then((data) => audioContext.decodeAudioData(data))
      .then((buffer) => {
        voiceBuffers.set(cue, buffer);
        voiceBufferPromises.delete(cue);
        return buffer;
      })
      .catch(() => {
        voiceBufferPromises.delete(cue);
        return null;
      });

    voiceBufferPromises.set(cue, promise);
    return promise;
  }

  function cancelVoicePlayback() {
    voiceRequestId += 1;
    currentVoiceSources.forEach((source) => {
      try { source.stop(); } catch (_) { /* already stopped */ }
    });
    currentVoiceSources.clear();
  }

  async function speak(cues, enabled = activeSession?.cues.voice) {
    const cueList = (Array.isArray(cues) ? cues : [cues]).filter((cue) => VOICE_ASSETS[cue]);
    if (!enabled || !audioContext || !cueList.length) return;
    const requestId = ++voiceRequestId;
    const buffers = (await Promise.all(cueList.map(loadVoiceBuffer))).filter(Boolean);
    if (!buffers.length || requestId !== voiceRequestId) return;

    currentVoiceSources.forEach((source) => {
      try { source.stop(); } catch (_) { /* already stopped */ }
    });
    currentVoiceSources.clear();

    const gain = audioContext.createGain();
    gain.gain.value = 1;
    gain.connect(audioContext.destination);

    let startAt = audioContext.currentTime;
    buffers.forEach((buffer, index) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      currentVoiceSources.add(source);
      source.addEventListener('ended', () => currentVoiceSources.delete(source), { once: true });
      source.start(startAt);
      startAt += Math.max(0.04, buffer.duration - (index < buffers.length - 1 ? 0.045 : 0));
    });
  }

  function customExerciseVoiceCue(label) {
    const normalized = String(label || '').trim().replace(/\s+/g, ' ');
    return CUSTOM_EXERCISE_VOICE_CUES[normalized] || 'custom';
  }

  function phaseVoiceCue(phase, session = activeSession) {
    if (phase.type === 'prep') return ['prep'];
    if (phase.type === 'rest') {
      const restSeconds = Math.max(1, Math.min(300, Math.round(phase.durationMs / 1000)));
      return [`rest-${String(restSeconds).padStart(3, '0')}`];
    }
    if (session.mode === 'custom') return [customExerciseVoiceCue(phase.label)];
    if (session.mode === 'interval') return ['interval'];
    if (session.mode === 'tabata') return ['tabata'];
    if (session.mode === 'emom') return ['emom'];
    if (session.mode === 'hyrox') return [`hyrox-${String(phase.round).padStart(2, '0')}`];
    if (session.mode === 'fortime') return ['fortime'];
    if (session.mode === 'amrap') return ['amrap'];
    return ['set'];
  }

  async function prepareSessionVoice(session) {
    if (!session?.cues.voice || !audioContext) return;
    const phaseCueLists = session.phases.map((phase) => phaseVoiceCue(phase, session));
    const firstCues = phaseCueLists[0] || [];
    await Promise.all(firstCues.map(loadVoiceBuffer));
    const remainingCues = [...new Set(phaseCueLists.slice(1).flat())];
    remainingCues.forEach((cue) => { loadVoiceBuffer(cue); });
  }

  async function testAudioOutput() {
    try {
      await unlockAudio();
      scheduleTone(880, 0, 0.14, 0.1, 'sine');
      scheduleTone(1175, 0.18, 0.14, 0.1, 'sine');
      setTimeout(() => { speak('output-test', true); }, 480);
      updateAudioOutputStatus(selectedOutputDevice
        ? `${selectedOutputDevice.label || '선택한 스피커'}로 테스트 소리를 재생했습니다.`
        : '현재 휴대폰의 미디어 출력으로 테스트 소리를 재생했습니다.');
    } catch (_) {
      updateAudioOutputStatus('소리를 시작하지 못했습니다. 다시 눌러 주세요.');
    }
  }

  async function selectAudioOutput() {
    try {
      await unlockAudio();
      const device = await navigator.mediaDevices.selectAudioOutput();
      await audioContext.setSinkId(device.deviceId);
      selectedOutputDevice = device;
      updateAudioOutputStatus(`${device.label || '선택한 스피커'}로 음성과 신호음을 재생합니다.`);
      await testAudioOutput();
    } catch (error) {
      if (error?.name !== 'NotAllowedError') {
        updateAudioOutputStatus('출력 장치를 바꾸지 못했습니다. 휴대폰 Bluetooth 설정을 확인해 주세요.');
      }
    }
  }

  function scheduleTone(frequency, offset, duration, volume, type = 'sine') {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + offset;
    const attackEnd = start + 0.012;
    const releaseStart = start + Math.max(0.03, duration - Math.min(0.12, duration * 0.25));
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, attackEnd);
    gain.gain.setValueAtTime(volume, releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
    return oscillator;
  }

  function cancelCountdownTones() {
    countdownOscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch (_) { /* already stopped */ }
    });
    countdownOscillators.clear();
  }

  function schedulePhaseCountdown() {
    cancelCountdownTones();
    const phase = currentPhase();
    if (!activeSession?.cues.sound || !audioContext || !phase?.durationMs || activeSession.status !== 'running') return;

    const remainingMs = currentPhaseRemaining();
    [3000, 2000, 1000].forEach((thresholdMs) => {
      const delayMs = remainingMs - thresholdMs;
      if (delayMs < 0) return;
      const oscillator = scheduleTone(1080, delayMs / 1000, 0.11, 0.11, 'square');
      countdownOscillators.add(oscillator);
      oscillator.addEventListener('ended', () => countdownOscillators.delete(oscillator), { once: true });
    });
  }

  function stadiumBlast(offset = 0, duration = 1, pitch = 1) {
    scheduleTone(180 * pitch, offset, duration, 0.14, 'sine');
    scheduleTone(360 * pitch, offset, duration, 0.2, 'sawtooth');
    scheduleTone(720 * pitch, offset, duration, 0.12, 'square');
    scheduleTone(1080 * pitch, offset, duration, 0.04, 'triangle');
  }

  function beep(kind = 'tick') {
    if (!activeSession?.cues.sound || !audioContext) return 0;
    if (kind === 'tick') {
      scheduleTone(1080, 0, 0.11, 0.11, 'square');
      return 110;
    } else if (kind === 'warning') {
      [0, 0.18, 0.36].forEach((offset) => scheduleTone(1320, offset, 0.13, 0.12, 'square'));
      return 490;
    } else if (kind === 'rest') {
      stadiumBlast(0, 1, 0.86);
      return 1000;
    } else if (kind === 'round') {
      stadiumBlast(0, 1, 1);
      return 1000;
    } else if (kind === 'finish') {
      stadiumBlast(0, 1, 0.94);
      stadiumBlast(1.18, 1, 1.08);
      return 2180;
    } else {
      stadiumBlast(0, 1, 1);
      return 1000;
    }
  }

  function announceAfterCue(cue, cueDuration = 0) {
    clearTimeout(voiceCueTimer);
    const voiceEnabled = Boolean(activeSession?.cues.voice);
    voiceCueTimer = setTimeout(() => {
      speak(cue, voiceEnabled);
      voiceCueTimer = null;
    }, cueDuration + 120);
  }

  function vibrate(pattern) {
    if (activeSession?.cues.vibration && navigator.vibrate) navigator.vibrate(pattern);
  }

  async function requestWakeLock() {
    if (!('wakeLock' in navigator) || wakeLock) return;
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (_) {
      wakeLock = null;
    }
  }

  async function releaseWakeLock() {
    if (!wakeLock) return;
    try { await wakeLock.release(); } catch (_) { /* no-op */ }
    wakeLock = null;
  }

  function currentPhase() {
    return activeSession?.phases[activeSession.phaseIndex] || null;
  }

  function currentPhaseElapsed(now = performance.now()) {
    if (!activeSession) return 0;
    if (activeSession.status === 'paused') return activeSession.pausedElapsedMs || 0;
    return Math.max(0, now - activeSession.phaseStartPerf);
  }

  function currentPhaseRemaining(now = performance.now()) {
    const phase = currentPhase();
    if (!phase?.durationMs) return null;
    if (activeSession.status === 'paused') return activeSession.pausedRemainingMs;
    return Math.max(0, activeSession.phaseEndPerf - now);
  }

  function startPhase(index, restore = null) {
    if (!activeSession) return;
    if (index >= activeSession.phases.length) {
      completeSession();
      return;
    }

    activeSession.phaseIndex = index;
    activeSession.status = restore?.status || 'running';
    const phase = currentPhase();
    const nowPerf = performance.now();
    const nowEpoch = Date.now();
    const restoredElapsed = restore?.elapsedMs || 0;

    activeSession.phaseStartPerf = nowPerf - restoredElapsed;
    activeSession.phaseStartEpoch = nowEpoch - restoredElapsed;
    activeSession.pausedElapsedMs = restoredElapsed;
    activeSession.pausedRemainingMs = phase.durationMs ? (restore?.remainingMs ?? phase.durationMs) : null;
    activeSession.phaseEndPerf = phase.durationMs ? nowPerf + activeSession.pausedRemainingMs : null;
    activeSession.phaseEndEpoch = phase.durationMs ? nowEpoch + activeSession.pausedRemainingMs : null;
    lastCueSecond = null;

    if (activeSession.status === 'running') {
      clearTimeout(voiceCueTimer);
      cancelVoicePlayback();
      const cueDuration = beep(phase.type === 'rest' ? 'rest' : phase.type === 'prep' ? 'start' : 'round');
      schedulePhaseCountdown();
      vibrate([80]);
      announceAfterCue(phaseVoiceCue(phase), cueDuration);
    }

    renderTimer();
    persistActiveSession();
  }

  function recordSplit(phase) {
    if (!phase || phase.type === 'prep' || activeSession.mode !== 'hyrox') return;
    const elapsed = currentPhaseElapsed();
    const existingIndex = activeSession.splits.findIndex((split) => split.phaseIndex === activeSession.phaseIndex);
    const split = { phaseIndex: activeSession.phaseIndex, label: phase.label, target: phase.target, elapsedMs: elapsed };
    if (existingIndex >= 0) activeSession.splits[existingIndex] = split;
    else activeSession.splits.push(split);
  }

  function advancePhase() {
    const phase = currentPhase();
    if (!phase) return;
    recordSplit(phase);
    startPhase(activeSession.phaseIndex + 1);
  }

  function advanceWithOverrun(overrunMs = 0) {
    if (!activeSession) return;
    let nextIndex = activeSession.phaseIndex + 1;
    let remainingOverrun = Math.max(0, overrunMs);

    while (nextIndex < activeSession.phases.length) {
      const nextPhase = activeSession.phases[nextIndex];
      if (!nextPhase.durationMs || remainingOverrun < nextPhase.durationMs) break;
      remainingOverrun -= nextPhase.durationMs;
      nextIndex += 1;
    }

    if (nextIndex >= activeSession.phases.length) {
      completeSession();
      return;
    }

    const nextPhase = activeSession.phases[nextIndex];
    if (nextPhase.durationMs) {
      startPhase(nextIndex, {
        status: 'running',
        remainingMs: Math.max(0, nextPhase.durationMs - remainingOverrun),
        elapsedMs: remainingOverrun,
      });
    } else {
      startPhase(nextIndex, { status: 'running', elapsedMs: remainingOverrun });
    }
  }

  function previousPhase() {
    if (!activeSession || activeSession.phaseIndex <= 0) return;
    activeSession.splits = activeSession.splits.filter((split) => split.phaseIndex < activeSession.phaseIndex - 1);
    startPhase(activeSession.phaseIndex - 1);
  }

  function totalSessionElapsed() {
    if (!activeSession) return 0;
    const end = activeSession.status === 'paused' ? activeSession.pausedAtEpoch : Date.now();
    return Math.max(0, end - activeSession.startedAtEpoch - activeSession.totalPausedMs);
  }

  function nextPhaseDescription() {
    if (!activeSession) return '—';
    const next = activeSession.phases[activeSession.phaseIndex + 1];
    if (!next) return 'SESSION COMPLETE';
    if (activeSession.mode === 'custom' && next.type === 'rest' && next.nextExercise) {
      return `휴식 ${formatTime(next.durationMs)} · 다음 ${next.nextExercise}`;
    }
    const suffix = next.durationMs ? formatTime(next.durationMs) : next.target || 'MANUAL';
    return `${next.label} · ${suffix}`;
  }

  function renderTimer(now = performance.now()) {
    if (!activeSession) return;
    const phase = currentPhase();
    if (!phase) return;
    const remaining = currentPhaseRemaining(now);
    const elapsed = currentPhaseElapsed(now);
    const state = activeSession.status === 'paused' ? 'paused' : phase.type;

    refs.timerScreen.dataset.state = state;
    refs.liveSessionName.textContent = activeSession.name;
    refs.timerState.lastChild.textContent = activeSession.status === 'paused' ? ' PAUSED' : ` ${phase.type === 'manual' ? 'IN PROGRESS' : phase.label}`;
    refs.timerValue.textContent = phase.countUp ? formatElapsed(elapsed) : formatTime(remaining);
    refs.timerLabel.textContent = phase.type === 'prep' ? '준비하세요' : phase.label;
    refs.timerNext.textContent = nextPhaseDescription();

    if (activeSession.mode === 'hyrox' && phase.type !== 'prep') {
      refs.timerMeta.textContent = `${phase.target} · STAGE ${phase.round} / 16`;
    } else if (activeSession.mode === 'custom' && phase.type === 'work') {
      refs.timerMeta.textContent = `${phase.customSet} / ${phase.customSets} SET · 전체 ${phase.round} / ${activeSession.rounds}`;
    } else if (activeSession.mode === 'custom' && phase.type === 'rest') {
      refs.timerMeta.textContent = phase.nextExercise ? `다음 운동 · ${phase.nextExercise}` : '다음 운동 준비';
    } else if (activeSession.mode === 'amrap') {
      refs.timerMeta.textContent = 'AS MANY ROUNDS AS POSSIBLE';
    } else if (activeSession.mode === 'fortime') {
      refs.timerMeta.textContent = `TIME CAP ${formatTime(phase.capMs)}`;
    } else if (phase.type === 'prep') {
      refs.timerMeta.textContent = `SESSION · ${activeSession.name}`;
    } else {
      refs.timerMeta.textContent = `SET ${phase.round} / ${activeSession.rounds}`;
    }

    let progress = 0;
    if (phase.durationMs) progress = 1 - (remaining / phase.durationMs);
    else if (phase.capMs) progress = Math.min(1, elapsed / phase.capMs);
    else progress = ((elapsed / 1000) % 20) / 20;
    refs.timerBar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;

    refs.pauseIcon.textContent = activeSession.status === 'paused' ? '▶' : 'Ⅱ';
    refs.pauseLabel.textContent = activeSession.status === 'paused' ? '계속' : '일시정지';
    refs.nextLabel.textContent = phase.type === 'manual' ? (activeSession.mode === 'fortime' ? '운동 완료' : '구간 완료') : '건너뛰기';
    refs.previous.disabled = activeSession.phaseIndex === 0;
  }

  function cueCountdown(remaining) {
    const phase = currentPhase();
    if (!phase?.durationMs || activeSession.status !== 'running') return;
    const second = Math.ceil(remaining / 1000);
    if (second === lastCueSecond) return;
    lastCueSecond = second;
    if (second === 10 && phase.type === 'rest') {
      const cueDuration = beep('warning');
      vibrate([45, 70, 45, 70, 45]);
      announceAfterCue('warning', cueDuration);
    }
  }

  function tick() {
    if (!activeSession || activeSession.status !== 'running') return;
    const phase = currentPhase();
    const now = performance.now();
    const remaining = currentPhaseRemaining(now);
    const elapsed = currentPhaseElapsed(now);

    if (phase.durationMs) {
      cueCountdown(remaining);
      if (remaining <= 0) {
        advanceWithOverrun(Math.max(0, now - activeSession.phaseEndPerf));
        return;
      }
    }

    if (phase.capMs && elapsed >= phase.capMs) {
      speak('timecap');
      completeSession();
      return;
    }

    renderTimer(now);
  }

  function startTicker() {
    clearInterval(ticker);
    ticker = setInterval(tick, 100);
  }

  function togglePause() {
    if (!activeSession) return;
    const phase = currentPhase();
    if (activeSession.status === 'running') {
      cancelCountdownTones();
      clearTimeout(voiceCueTimer);
      voiceCueTimer = null;
      activeSession.pausedRemainingMs = phase.durationMs ? currentPhaseRemaining() : null;
      activeSession.pausedElapsedMs = currentPhaseElapsed();
      activeSession.pausedAtEpoch = Date.now();
      activeSession.status = 'paused';
      cancelVoicePlayback();
      speak('paused');
      releaseWakeLock();
    } else {
      const nowPerf = performance.now();
      activeSession.totalPausedMs += Date.now() - activeSession.pausedAtEpoch;
      activeSession.pausedAtEpoch = null;
      activeSession.status = 'running';
      activeSession.phaseStartPerf = nowPerf - activeSession.pausedElapsedMs;
      activeSession.phaseStartEpoch = Date.now() - activeSession.pausedElapsedMs;
      if (phase.durationMs) {
        activeSession.phaseEndPerf = nowPerf + activeSession.pausedRemainingMs;
        activeSession.phaseEndEpoch = Date.now() + activeSession.pausedRemainingMs;
      }
      beep('start');
      schedulePhaseCountdown();
      speak('resume');
      requestWakeLock();
    }
    renderTimer();
    persistActiveSession();
  }

  function sessionSnapshot() {
    if (!activeSession) return null;
    return {
      ...activeSession,
      savedAtEpoch: Date.now(),
      snapshotRemainingMs: currentPhaseRemaining(),
      snapshotElapsedMs: currentPhaseElapsed(),
      phaseStartPerf: undefined,
      phaseEndPerf: undefined,
    };
  }

  function persistActiveSession() {
    const snapshot = sessionSnapshot();
    if (!snapshot) return;
    try { localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(snapshot)); } catch (_) { /* storage may be blocked */ }
  }

  function clearPersistedSession() {
    try { localStorage.removeItem(STORAGE_KEYS.active); } catch (_) { /* no-op */ }
  }

  function openTimerScreen() {
    refs.timerScreen.hidden = false;
    document.body.style.overflow = 'hidden';
    requestWakeLock();
    startTicker();
  }

  function closeTimerScreen() {
    refs.timerScreen.hidden = true;
    document.body.style.overflow = '';
    clearInterval(ticker);
    ticker = null;
    cancelCountdownTones();
    cancelVoicePlayback();
    releaseWakeLock();
  }

  async function startSessionFromSettings(settings) {
    await unlockAudio();
    activeSession = buildSession(settings);
    await prepareSessionVoice(activeSession);
    lastSessionConfig = { kind: 'standard', settings };
    openTimerScreen();
    startPhase(0);
  }

  async function startCustomProgram(settings) {
    if (!settings.blocks.length) {
      announceToast('운동을 하나 이상 추가해 주세요.');
      return;
    }
    await unlockAudio();
    saveCustomDraft(settings);
    activeSession = buildCustomProgramSession(settings);
    await prepareSessionVoice(activeSession);
    lastSessionConfig = { kind: 'custom', settings };
    openTimerScreen();
    startPhase(0);
  }

  function readHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || '[]'); } catch (_) { return []; }
  }

  function saveHistory(entry) {
    const history = [entry, ...readHistory()].slice(0, 12);
    try { localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history)); } catch (_) { /* no-op */ }
    renderHistory();
  }

  function renderHistory() {
    const history = readHistory();
    if (!history.length) {
      refs.historyList.innerHTML = '<p class="empty-history">아직 완료한 세션이 없습니다. 첫 세션을 시작해 보세요.</p>';
      refs.clearHistory.hidden = true;
      return;
    }
    refs.clearHistory.hidden = false;
    refs.historyList.innerHTML = history.map((entry) => {
      const date = new Date(entry.completedAt);
      return `<article class="history-row">
        <time datetime="${date.toISOString()}">${new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(date)}</time>
        <strong>${escapeHtml(entry.name)}</strong>
        <small>${entry.mode.toUpperCase()} · ${entry.splitsCount ? `${entry.splitsCount} SPLITS` : 'COMPLETE'}</small>
        <b>${formatElapsed(entry.elapsedMs)}</b>
      </article>`;
    }).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function completeSession() {
    if (!activeSession) return;
    const elapsedMs = totalSessionElapsed();
    const cueDuration = beep('finish');
    vibrate([100, 80, 100, 80, 180]);

    const result = {
      id: activeSession.id,
      name: activeSession.name,
      mode: activeSession.mode,
      elapsedMs,
      completedAt: Date.now(),
      splitsCount: activeSession.splits.length,
    };
    saveHistory(result);
    clearPersistedSession();
    closeTimerScreen();
    announceAfterCue('complete', cueDuration);

    refs.resultTime.textContent = formatElapsed(elapsedMs);
    refs.splitList.innerHTML = activeSession.splits.length
      ? activeSession.splits.map((split) => `<div class="split-row"><span>${escapeHtml(split.label)} · ${escapeHtml(split.target)}</span><strong>${formatElapsed(split.elapsedMs)}</strong></div>`).join('')
      : '<div class="split-row"><span>SESSION</span><strong>COMPLETE</strong></div>';
    refs.resultScreen.hidden = false;
    document.body.style.overflow = 'hidden';
    activeSession = null;
  }

  function abortSession() {
    if (!activeSession) return;
    if (!window.confirm('현재 세션을 종료할까요? 진행 기록은 저장되지 않습니다.')) return;
    clearTimeout(voiceCueTimer);
    voiceCueTimer = null;
    clearPersistedSession();
    closeTimerScreen();
    activeSession = null;
    announceToast('세션이 종료되었습니다.');
  }

  function checkRecovery() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.active) || 'null');
      if (!stored?.phases?.length) return;
      recoveryCandidate = stored;
      refs.recoveryInfo.textContent = `${stored.name} · ${stored.status === 'paused' ? '일시정지됨' : '진행 중이던 세션'}`;
      refs.recoveryBanner.hidden = false;
    } catch (_) {
      clearPersistedSession();
    }
  }

  async function restoreSession() {
    if (!recoveryCandidate) return;
    await unlockAudio();
    activeSession = recoveryCandidate;
    await prepareSessionVoice(activeSession);
    lastSessionConfig = activeSession.mode === 'custom'
      ? {
        kind: 'custom',
        settings: {
          mode: 'custom',
          prep: activeSession.prep,
          name: activeSession.name,
          blocks: activeSession.blocks,
          cues: activeSession.cues,
        },
      }
      : {
        kind: 'standard',
        settings: {
          mode: activeSession.mode,
          prep: activeSession.prep,
          work: activeSession.work,
          rest: activeSession.rest,
          rounds: activeSession.rounds,
          division: activeSession.division,
          name: activeSession.name,
          cues: activeSession.cues,
        },
      };

    const timeAway = Math.max(0, Date.now() - (activeSession.savedAtEpoch || Date.now()));
    const wasPaused = activeSession.status === 'paused';
    let remainingMs = activeSession.snapshotRemainingMs;
    let elapsedMs = activeSession.snapshotElapsedMs || 0;
    let overrunMs = 0;
    if (!wasPaused) {
      if (remainingMs != null) {
        const adjustedRemaining = remainingMs - timeAway;
        overrunMs = Math.max(0, -adjustedRemaining);
        remainingMs = Math.max(0, adjustedRemaining);
      }
      else elapsedMs += timeAway;
    }

    refs.recoveryBanner.hidden = true;
    openTimerScreen();
    if (remainingMs === 0 && currentPhase()?.durationMs) {
      advanceWithOverrun(overrunMs);
    } else {
      startPhase(activeSession.phaseIndex, { status: wasPaused ? 'paused' : 'running', remainingMs, elapsedMs });
      if (wasPaused) releaseWakeLock();
    }
  }

  function registerEvents() {
    $$('[data-mobile-category]').forEach((link) => link.addEventListener('click', (event) => {
      event.preventDefault();
      const view = link.dataset.mobileCategory;
      const hash = link.getAttribute('href');
      if (hash && location.hash !== hash) history.pushState(null, '', hash);
      setMobileView(view);
    }));
    $$('a[href="#top"]:not([data-mobile-category])').forEach((link) => link.addEventListener('click', () => setMobileView('home')));
    $$('a[href="#modes"]:not([data-mobile-category])').forEach((link) => link.addEventListener('click', () => setMobileView('modes')));
    $$('a[href="#program"]:not([data-mobile-category])').forEach((link) => link.addEventListener('click', () => setMobileView('program')));
    $$('a[href="#studio"]:not([data-mobile-category])').forEach((link) => link.addEventListener('click', () => setMobileView('timer')));
    $$('a[href="#history"]:not([data-mobile-category])').forEach((link) => link.addEventListener('click', () => setMobileView('history')));
    refs.tabs.forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.mode)));
    $$('[data-quick-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.quickMode, true)));
    [refs.prep, refs.work, refs.rest, refs.rounds, refs.name].forEach((input) => input.addEventListener('input', updatePreview));
    refs.division.addEventListener('change', () => { renderHyroxRoute(); updatePreview(); });

    refs.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await startSessionFromSettings(readSettings());
    });

    refs.addCustomBlock.addEventListener('click', () => addCustomProgramBlock());
    refs.customList.addEventListener('click', (event) => {
      const removeButton = event.target.closest('.remove-custom-block');
      if (!removeButton) return;
      if ($$('.custom-block', refs.customList).length === 1) {
        announceToast('운동은 하나 이상 필요합니다.');
        return;
      }
      removeButton.closest('.custom-block').remove();
      updateCustomProgram();
    });
    refs.customForm.addEventListener('input', updateCustomProgram);
    refs.customForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await startCustomProgram(readCustomProgram());
    });

    refs.testAudioOutput.addEventListener('click', testAudioOutput);
    refs.selectAudioOutput.addEventListener('click', selectAudioOutput);

    refs.pause.addEventListener('click', togglePause);
    refs.next.addEventListener('click', advancePhase);
    refs.previous.addEventListener('click', previousPhase);
    refs.end.addEventListener('click', abortSession);
    refs.fullscreen.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) await refs.timerScreen.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) { announceToast('이 브라우저에서는 전체화면을 사용할 수 없습니다.'); }
    });

    refs.closeResult.addEventListener('click', () => {
      refs.resultScreen.hidden = true;
      document.body.style.overflow = '';
      setMobileView('history', false);
      $('#history').scrollIntoView({ behavior: 'smooth' });
    });

    refs.repeatSession.addEventListener('click', async () => {
      refs.resultScreen.hidden = true;
      document.body.style.overflow = '';
      if (!lastSessionConfig) return;
      if (lastSessionConfig.kind === 'custom') await startCustomProgram(lastSessionConfig.settings);
      else await startSessionFromSettings(lastSessionConfig.settings);
    });

    refs.clearHistory.addEventListener('click', () => {
      if (!window.confirm('완료한 세션 기록을 모두 지울까요?')) return;
      localStorage.removeItem(STORAGE_KEYS.history);
      renderHistory();
    });

    refs.resumeRecovery.addEventListener('click', restoreSession);
    refs.discardRecovery.addEventListener('click', () => {
      clearPersistedSession();
      recoveryCandidate = null;
      refs.recoveryBanner.hidden = true;
    });

    document.addEventListener('keydown', (event) => {
      if (!activeSession || refs.timerScreen.hidden) return;
      if (event.code === 'Space') { event.preventDefault(); togglePause(); }
      if (event.code === 'ArrowRight') { event.preventDefault(); advancePhase(); }
      if (event.code === 'ArrowLeft') { event.preventDefault(); previousPhase(); }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && activeSession?.status === 'running') {
        requestWakeLock();
        tick();
      }
      persistActiveSession();
    });

    window.addEventListener('beforeunload', persistActiveSession);
    window.addEventListener('popstate', () => setMobileView(HASH_TO_VIEW[location.hash] || 'home', false));
  }

  function initialize() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const supportsOutputSelection = Boolean(
      navigator.mediaDevices?.selectAudioOutput
      && AudioContextClass?.prototype?.setSinkId,
    );
    refs.selectAudioOutput.hidden = !supportsOutputSelection;
    if (supportsOutputSelection) {
      updateAudioOutputStatus('Bluetooth 스피커를 직접 선택하거나 현재 미디어 출력으로 테스트할 수 있습니다.');
    }
    setMode('interval');
    initializeCustomProgram();
    setMobileView(HASH_TO_VIEW[location.hash] || 'home', false);
    renderHistory();
    registerEvents();
    checkRecovery();
    setInterval(() => {
      if (activeSession) persistActiveSession();
    }, 1000);

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
    }
  }

  initialize();
})();
