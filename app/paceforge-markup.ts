export const paceforgeMarkup = String.raw`
  <a class="skip-link" href="#studio">운동 설정으로 바로가기</a>

  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="PACEFORGE 홈">
      <span class="brand-mark">PF</span>
      <span>PACEFORGE</span>
    </a>
    <nav class="nav-links" aria-label="주요 메뉴">
      <a href="#modes">모드</a>
      <a href="#studio">타이머</a>
      <a href="#history">기록</a>
    </nav>
    <a class="nav-cta" href="#studio">타이머 시작 <span aria-hidden="true">↗</span></a>
  </header>

  <nav class="mobile-category-nav" aria-label="모바일 주요 카테고리">
    <button type="button" data-mobile-category="home" aria-selected="true">홈</button>
    <button type="button" data-mobile-category="modes" aria-selected="false">모드</button>
    <button type="button" data-mobile-category="timer" aria-selected="false">타이머</button>
    <button type="button" data-mobile-category="features" aria-selected="false">기능</button>
    <button type="button" data-mobile-category="history" aria-selected="false">기록</button>
  </nav>

  <main>
    <section class="hero" aria-labelledby="hero-title" data-mobile-panel="home">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> CROSSFIT · HYROX TIMER</p>
        <h1 id="hero-title">시간은 맡기고<br><em>운동에 집중하세요.</em></h1>
        <p class="hero-lead">운동·휴식·세트 전환을 신호음과 한국어 음성으로 알려드립니다.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#studio">타이머 설정하기 <span aria-hidden="true">→</span></a>
          <button class="button button-ghost" type="button" data-quick-mode="hyrox">HYROX 시작하기</button>
        </div>
        <div class="hero-metrics" aria-label="주요 기능">
          <div><strong>06</strong><span>타이머 모드</span></div>
          <div><strong>16</strong><span>HYROX 구간</span></div>
          <div><strong>KR</strong><span>한국어 음성</span></div>
        </div>
      </div>

      <div class="hero-visual" aria-label="슬레드 푸시와 러닝을 수행하는 선수들">
        <img src="/assets/paceforge-hero.jpg" alt="어두운 실내 경기장에서 슬레드 푸시와 러닝을 수행하는 두 선수" width="1672" height="941">
        <div class="live-card" aria-hidden="true">
          <span class="live-dot"></span>
          <div><small>NEXT SIGNAL</small><strong>00:10</strong></div>
          <b>WORK</b>
        </div>
        <p class="visual-caption">READY FOR<br>THE NEXT ROUND.</p>
      </div>
    </section>

    <section class="signal-strip" aria-label="타이머 진행 예시" data-mobile-panel="home">
      <span>01</span><strong>WORK · 01:00</strong><i></i>
      <span>02</span><strong>REST · 00:30</strong><i></i>
      <span>03</span><strong>“2세트 시작”</strong><i></i>
      <span>04</span><strong>REPEAT</strong>
    </section>

    <section class="section modes-section" id="modes" aria-labelledby="modes-title" data-mobile-panel="modes">
      <div class="section-heading">
        <div>
          <p class="eyebrow"><span></span> 운동 모드</p>
          <h2 id="modes-title">원하는 운동을<br>바로 시작하세요.</h2>
        </div>
        <p>인터벌부터 HYROX까지 운동 방식에 맞는 타이머를 선택하세요.</p>
      </div>

      <div class="mode-grid">
        <article class="mode-card mode-card-featured">
          <div class="mode-card-top"><span>01</span><span class="mode-tag">QUICK START</span></div>
          <h3>INTERVAL</h3>
          <p>운동 시간, 휴식 시간, 세트 수를 직접 설정합니다.</p>
          <button type="button" data-quick-mode="interval">인터벌 설정 <span>→</span></button>
        </article>
        <article class="mode-card">
          <div class="mode-card-top"><span>02</span><span class="mode-tag">CROSSFIT</span></div>
          <h3>WOD CLOCK</h3>
          <p>AMRAP, EMOM, 타바타, 포타임을 선택해 시작합니다.</p>
          <button type="button" data-quick-mode="amrap">WOD 타이머 선택 <span>→</span></button>
        </article>
        <article class="mode-card mode-card-orange">
          <div class="mode-card-top"><span>03</span><span class="mode-tag">FITNESS RACE</span></div>
          <h3>HYROX 8</h3>
          <p>러닝과 8개 스테이션의 구간 기록을 차례로 저장합니다.</p>
          <button type="button" data-quick-mode="hyrox">HYROX 불러오기 <span>→</span></button>
        </article>
      </div>
    </section>

    <section class="section studio-section" id="studio" aria-labelledby="studio-title" data-mobile-panel="timer">
      <div class="studio-heading">
        <div>
          <p class="eyebrow eyebrow-dark"><span></span> 타이머 설정</p>
          <h2 id="studio-title">시간만 정하면<br>바로 시작됩니다.</h2>
        </div>
        <p class="studio-status"><span></span> 소리 안내 준비됨</p>
      </div>

      <div class="studio-shell">
        <div class="mode-tabs" role="tablist" aria-label="운동 모드 선택">
          <button class="mode-tab active" type="button" role="tab" aria-selected="true" data-mode="interval">INTERVAL</button>
          <button class="mode-tab" type="button" role="tab" aria-selected="false" data-mode="amrap">AMRAP</button>
          <button class="mode-tab" type="button" role="tab" aria-selected="false" data-mode="emom">EMOM</button>
          <button class="mode-tab" type="button" role="tab" aria-selected="false" data-mode="tabata">TABATA</button>
          <button class="mode-tab" type="button" role="tab" aria-selected="false" data-mode="fortime">FOR TIME</button>
          <button class="mode-tab" type="button" role="tab" aria-selected="false" data-mode="hyrox">HYROX</button>
        </div>

        <div class="builder-grid">
          <form class="session-form" id="sessionForm">
            <div class="form-intro">
              <span id="modeNumber">01</span>
              <div><small>선택한 모드</small><h3 id="modeTitle">CUSTOM INTERVAL</h3></div>
            </div>

            <div id="standardFields" class="field-grid">
              <label class="field"><span>준비 시간</span><div><input id="prepTime" type="number" min="0" max="300" value="10" inputmode="numeric"><b>초</b></div></label>
              <label class="field" id="workField"><span>운동 시간</span><div><input id="workTime" type="number" min="5" max="7200" value="60" inputmode="numeric"><b>초</b></div></label>
              <label class="field" id="restField"><span>휴식 시간</span><div><input id="restTime" type="number" min="0" max="3600" value="30" inputmode="numeric"><b>초</b></div></label>
              <label class="field" id="roundField"><span>세트 수</span><div><input id="rounds" type="number" min="1" max="100" value="5" inputmode="numeric"><b>SET</b></div></label>
            </div>

            <div id="hyroxFields" class="hyrox-fields" hidden>
              <label class="field field-wide"><span>경기 디비전</span><div><select id="division"><option value="women">WOMEN OPEN</option><option value="womenPro">WOMEN PRO</option><option value="men">MEN OPEN</option><option value="menPro">MEN PRO</option></select></div></label>
              <div class="hyrox-route" id="hyroxRoute" aria-label="HYROX 경기 순서"></div>
            </div>

            <label class="session-name"><span>세션 이름</span><input id="sessionName" type="text" maxlength="40" value="ENGINE BUILDER" autocomplete="off"></label>

            <div class="cue-options">
              <label><input id="soundEnabled" type="checkbox" checked><span class="toggle"></span><b>경기장 신호음</b></label>
              <label><input id="voiceEnabled" type="checkbox" checked><span class="toggle"></span><b>한국어 음성</b></label>
              <label><input id="vibrationEnabled" type="checkbox"><span class="toggle"></span><b>진동</b></label>
            </div>

            <button class="start-session" id="startSession" type="submit">
              <span>운동 시작</span><b aria-hidden="true">→</b>
            </button>
            <p class="form-note">시작하면 소리 안내가 켜집니다. 스페이스바로 일시정지할 수 있습니다.</p>
          </form>

          <aside class="session-preview" aria-label="세션 미리보기">
            <div class="preview-top"><span>미리보기</span><b id="previewMode">INTERVAL</b></div>
            <div class="preview-clock" id="previewClock">01:00</div>
            <p id="previewLabel">WORK / SET 1 OF 5</p>
            <div class="preview-progress"><span id="previewProgress"></span></div>
            <div class="preview-next"><small>다음</small><strong id="previewNext">REST · 00:30</strong></div>
            <div class="preview-specs">
              <div><span>총 시간</span><strong id="totalTime">07:00</strong></div>
              <div><span>전환 방식</span><strong id="transitionType">AUTO</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section reliability-section" aria-labelledby="reliability-title" data-mobile-panel="features">
      <div class="reliability-copy">
        <p class="eyebrow"><span></span> 자동 안내 기능</p>
        <h2 id="reliability-title">화면을 보지 않아도<br>흐름을 놓치지 않아요.</h2>
        <p>구간이 바뀔 때 필요한 내용을 소리와 화면으로 알려드립니다.</p>
      </div>
      <div class="feature-list">
        <article><span>01</span><div><h3>정확한 시간</h3><p>앱을 잠시 벗어나도 남은 시간을 자동으로 맞춥니다.</p></div></article>
        <article><span>02</span><div><h3>한국어 음성 안내</h3><p>운동 시작, 휴식, 세트 전환을 소리와 음성으로 알려드립니다.</p></div></article>
        <article><span>03</span><div><h3>중단 후 이어하기</h3><p>새로고침해도 진행 중인 세션을 이어갈 수 있습니다.</p></div></article>
        <article><span>04</span><div><h3>화면 꺼짐 방지</h3><p>지원되는 기기에서는 운동 중 화면을 계속 켜둡니다.</p></div></article>
      </div>
    </section>

    <section class="section history-section" id="history" aria-labelledby="history-title" data-mobile-panel="history">
      <div class="history-heading"><div><p class="eyebrow eyebrow-dark"><span></span> 운동 기록</p><h2 id="history-title">완료한 운동을<br>한눈에 확인하세요.</h2></div><button id="clearHistory" class="text-button" type="button">기록 지우기</button></div>
      <div class="history-list" id="historyList"></div>
    </section>
  </main>

  <footer class="site-footer" data-mobile-panel="home">
    <a class="brand" href="#top"><span class="brand-mark">PF</span><span>PACEFORGE</span></a>
    <p>시간은 맡기고<br>운동에 집중하세요.</p>
    <small>본 서비스는 CrossFit, LLC 또는 HYROX World GmbH와 공식 제휴된 서비스가 아닙니다. 공식 경기 전에는 최신 규정을 확인하세요.</small>
  </footer>

  <div class="recovery-banner" id="recoveryBanner" hidden role="status">
    <div><strong>중단된 세션이 있습니다.</strong><span id="recoveryInfo">이어서 진행할 수 있습니다.</span></div>
    <button id="discardRecovery" type="button">삭제</button>
    <button id="resumeRecovery" type="button">이어서 시작</button>
  </div>

  <section class="timer-screen" id="timerScreen" hidden aria-modal="true" role="dialog" aria-label="라이브 운동 타이머">
    <header class="timer-header">
      <div class="brand"><span class="brand-mark">PF</span><span>PACEFORGE</span></div>
      <div class="timer-session-name" id="liveSessionName">ENGINE BUILDER</div>
      <button class="icon-button" id="toggleFullscreen" type="button" aria-label="전체 화면 전환">⛶</button>
    </header>

    <main class="timer-main" id="timerMain">
      <p class="timer-state" id="timerState"><span></span> GET READY</p>
      <div class="timer-value" id="timerValue" aria-live="off">00:10</div>
      <h2 class="timer-label" id="timerLabel">준비하세요</h2>
      <p class="timer-meta" id="timerMeta">SET 1 / 5</p>
      <div class="timer-bar"><span id="timerBarFill"></span></div>
      <div class="timer-next"><small>NEXT UP</small><strong id="timerNext">WORK · 01:00</strong></div>
    </main>

    <footer class="timer-controls">
      <button id="previousPhase" type="button"><span aria-hidden="true">↶</span><b>이전</b></button>
      <button class="pause-button" id="pauseTimer" type="button"><span id="pauseIcon" aria-hidden="true">Ⅱ</span><b id="pauseLabel">일시정지</b></button>
      <button id="nextPhase" type="button"><span aria-hidden="true">→</span><b id="nextLabel">다음</b></button>
      <button id="endSession" type="button"><span aria-hidden="true">×</span><b>종료</b></button>
    </footer>
  </section>

  <section class="result-screen" id="resultScreen" hidden aria-modal="true" role="dialog" aria-labelledby="resultTitle">
    <div class="result-panel">
      <p class="eyebrow eyebrow-dark"><span></span> SESSION COMPLETE</p>
      <h2 id="resultTitle">오늘의 전환을<br>완주했습니다.</h2>
      <div class="result-time"><small>TOTAL TIME</small><strong id="resultTime">00:00</strong></div>
      <div class="split-list" id="splitList"></div>
      <div class="result-actions"><button id="closeResult" class="button button-dark" type="button">홈으로</button><button id="repeatSession" class="button button-outline-dark" type="button">같은 세션 반복</button></div>
    </div>
  </section>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;
