// Galego — App Router & Screen Manager
import { COURSE, getUnit } from './data/course.js';
import {
  isLessonRecommended, isLessonCompleted, getLessonScore,
  getUnitProgress, saveLessonScore, clearCurrentLesson,
  isUnitRecommended, markLessonDone, resetLesson,
  onSyncStatus, initSync,
  login, logout, isLoggedIn, getUsername, syncNow,
  exportProgress, importProgress,
} from './state.js';
import {
  startLesson, getProgress, submitAnswer, advance,
  showAnswerFeedback
} from './exercises.js';
import { haptics, installGlobalHaptics } from './haptics.js';
import {
  screenTransition, animateSpring, prefersReducedMotion,
  burst, confetti, ripple, flash, crack,
} from './fx.js';
import { renderPathHome, teardownPathHome } from './path.js';
import { createMascot } from './mascot.js';

// ── Screen management ──────────────────────────────────────────
const SCREENS = ['login','home','unit','lesson','results'];

// Track sync status globally
let _lastSyncStatus = 'idle';
let _lastSyncMessage = '';

// Screen-to-screen navigation, wrapped in a View Transition when the
// browser supports it (shared-element morphs + tap-point bloom).
// params.tapPoint {x,y} → color blooms from the tap.
// params.morphUnitId → on home, the unit node morphs back from the hero.
export function navigate(screenId, params = {}) {
  const run = () => applyNavigate(screenId, params);
  const vtPromise = screenTransition(run, { bloomFrom: params.tapPoint || null });
  // After a morph, no path node may keep the shared-element name —
  // duplicates would break the next transition.
  Promise.resolve(vtPromise).then((vt) => {
    const clear = () => document.querySelectorAll('.path-node').forEach(
      (n) => { n.style.viewTransitionName = ''; }
    );
    if (vt && vt.finished) vt.finished.finally(clear);
    else clear();
  }).catch(() => {});
}

function applyNavigate(screenId, params = {}) {
  if (screenId !== 'home') teardownPathHome();

  SCREENS.forEach(id => {
    const el = document.getElementById(`screen-${id}`);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(`screen-${screenId}`);
  if (target) target.classList.remove('hidden');

  const topBar = document.getElementById('top-bar');
  const backBtn = document.getElementById('back-btn');
  const topTitle = document.getElementById('top-bar-title');

  if (screenId === 'home' || screenId === 'login') {
    topBar.classList.add('hidden');
  } else {
    topBar.classList.remove('hidden');
    if (screenId === 'unit' && params.unitId) {
      topTitle.textContent = (params.unit && params.unit.title) || getUnit(params.unitId)?.title || '';
      backBtn.onclick = () => navigate('home', { morphUnitId: params.unitId });
      backBtn.style.visibility = 'visible';
    } else if (screenId === 'lesson' || screenId === 'results') {
      topTitle.textContent = '';
      backBtn.style.visibility = 'hidden';
    }
  }

  // Close any open popovers
  hideContextMenu();
  hideSettingsPanel();

  if (screenId === 'login') renderLogin();
  if (screenId === 'home') renderHome(params);
  if (screenId === 'unit' && params.unitId) renderUnit(params.unitId);
  if (screenId === 'lesson' && params.lessonId) initLesson(params.unitId, params.lessonId);
  if (screenId === 'results') renderResults(params);
}

// ── Login screen ───────────────────────────────────────────────
function renderLogin() {
  // Clear form on render
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');

  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';
  if (errorEl) {
    errorEl.classList.add('hidden');
    errorEl.textContent = '';
  }
}

function setupLoginListeners() {
  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorEl = document.getElementById('login-error');

  async function doLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorEl.textContent = 'Please fill in both fields';
      errorEl.classList.remove('hidden');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in…';
    errorEl.classList.add('hidden');

    const result = await login(username, password);

    if (result.ok) {
      navigate('home');
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.remove('hidden');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Log In';
    }
  }

  loginBtn.addEventListener('click', doLogin);

  // Enter key to submit
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
  usernameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') passwordInput.focus();
  });
}

// ── Home screen — the Camiño ───────────────────────────────────
function renderHome(params = {}) {
  updateSyncIndicator();

  const screen = document.getElementById('screen-home');
  const totalLessons = COURSE.reduce((n, u) => n + u.lessons.length, 0);
  const totalEl = document.getElementById('stat-lessons-total');
  if (totalEl) totalEl.textContent = `/${totalLessons}`;

  renderPathHome(screen, {
    course: COURSE,
    getUnitProgress,
    isUnitRecommended: (id) => isUnitRecommended(id, COURSE),
    morphUnitId: params.morphUnitId || null,
    onUnitTap(unit, nodeEl, e) {
      haptics.medium();
      const tapPoint = (e && typeof e.clientX === 'number')
        ? { x: e.clientX, y: e.clientY } : null;
      const go = () => {
        // this node becomes the shared element that morphs into the unit hero
        document.querySelectorAll('.path-node').forEach((n) => { n.style.viewTransitionName = ''; });
        nodeEl.style.viewTransitionName = 'unit-hero';
        navigate('unit', { unitId: unit.id, unit, tapPoint });
      };
      if (!isUnitRecommended(unit.id, COURSE)) showSkipWarning(go);
      else go();
    },
  });
}

// ── Unit screen ────────────────────────────────────────────────
function renderUnit(unitId) {
  const unit = getUnit(unitId);
  if (!unit) return;

  document.getElementById('unit-hero-emoji').textContent = unit.icon;
  document.getElementById('unit-hero-title').textContent = unit.title;
  document.getElementById('unit-hero-subtitle').textContent = `${unit.subtitle} · ${unit.level}`;

  // Grammar tips
  const tipsContainer = document.getElementById('grammar-tips-container');
  tipsContainer.innerHTML = '';
  unit.grammarTips.forEach((tip, ti) => {
    const card = document.createElement('div');
    card.className = 'grammar-card enter';
    card.style.animationDelay = `${200 + ti * 90}ms`;
    card.innerHTML = `
      <div class="grammar-card-header">
        <div class="grammar-card-title">${tip.title}</div>
        <svg class="grammar-card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div class="grammar-card-body">
        <p>${tip.body}</p>
        ${(tip.examples||[]).map(ex => `
          <div class="grammar-example">
            <div class="grammar-example-gl">${ex.gl}</div>
            <div class="grammar-example-en">${ex.en}</div>
          </div>`).join('')}
      </div>`;
    card.querySelector('.grammar-card-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
    tipsContainer.appendChild(card);
  });

  // Lesson dots
  const dotsContainer = document.getElementById('lesson-dots');
  dotsContainer.innerHTML = '';
  unit.lessons.forEach((lessonId, i) => {
    const recommended = isLessonRecommended(unitId, lessonId, COURSE);
    const completed = isLessonCompleted(unitId, lessonId);
    const score = getLessonScore(unitId, lessonId);

    const wrapper = document.createElement('div');
    wrapper.className = 'lesson-dot-wrapper enter';
    wrapper.style.animationDelay = `${60 + i * 55}ms`;

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Lesson ${i + 1}`);

    if (completed && score) {
      if (score.manual) {
        // Manually completed — distinct style
        dot.className = 'lesson-dot completed manual';
        dot.textContent = '✓';
      } else {
        const cls = score.score >= 90 ? 'score-high' : score.score >= 70 ? 'score-mid' : 'score-low';
        dot.className = `lesson-dot completed ${cls}`;
        dot.textContent = score.score + '%';
      }
    } else if (!recommended) {
      // Not recommended but still accessible
      dot.className = 'lesson-dot available not-recommended';
      dot.textContent = i + 1;
    } else {
      dot.className = 'lesson-dot available';
      dot.textContent = i + 1;
    }

    // All lessons are clickable
    dot.addEventListener('click', () => {
      if (!recommended && !completed) {
        showSkipWarning(() => navigate('lesson', { unitId, lessonId }));
      } else {
        navigate('lesson', { unitId, lessonId });
      }
    });

    // Long-press for context menu (mark-as-done / reset)
    let longPressTimer = null;
    let longPressTriggered = false;

    const startLongPress = (e) => {
      longPressTriggered = false;
      longPressTimer = setTimeout(() => {
        longPressTriggered = true;
        e.preventDefault();
        showContextMenu(dot, unitId, lessonId, completed);
      }, 700);
    };

    const cancelLongPress = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const endLongPress = (e) => {
      cancelLongPress();
      if (longPressTriggered) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    dot.addEventListener('touchstart', startLongPress, { passive: false });
    dot.addEventListener('touchend', endLongPress);
    dot.addEventListener('touchmove', cancelLongPress);
    dot.addEventListener('touchcancel', cancelLongPress);

    // Desktop: right-click for context menu
    dot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(dot, unitId, lessonId, completed);
    });

    const label = document.createElement('div');
    label.className = 'lesson-dot-label';
    label.textContent = `L${i + 1}`;

    wrapper.appendChild(dot);
    wrapper.appendChild(label);
    dotsContainer.appendChild(wrapper);
  });

  // Start button — first available (not completed) lesson, or first lesson
  const firstNotDone = unit.lessons.find(lid => !isLessonCompleted(unitId, lid));
  const targetLesson = firstNotDone || unit.lessons[0];
  const startBtn = document.getElementById('unit-start-btn');
  startBtn.disabled = false;
  startBtn.textContent = firstNotDone ? 'Start Lesson' : 'Practice Again';
  startBtn.onclick = () => navigate('lesson', { unitId, lessonId: targetLesson });
}

// ── Lesson results screen ──────────────────────────────────────
const RESULT_TIERS = {
  great:   { messages: ['Brillante!', 'Espectacular!', 'Que crack!'] },
  neutral: { messages: ['Boa! Segue así.', 'Vas ben.', 'Bo traballo!'] },
  poor:    { messages: ['Non pasa nada — téntao de novo!', 'A práctica fai o mestre.', 'Sigue intentándoo!'] },
};

function tierForScore(score) {
  if (score >= 80) return 'great';
  if (score >= 50) return 'neutral';
  return 'poor';
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function starsForScore(score) {
  return score >= 85 ? 3 : score >= 65 ? 2 : score >= 40 ? 1 : 0;
}

const STAR_PATH = 'M12 1.8l3 6.4 6.8.9-5 4.8 1.3 6.7L12 17.3 5.9 20.6l1.3-6.7-5-4.8 6.8-.9z';

let _resultsBreo = null;
let _resultsTimers = [];

function renderResults({ unitId, score = 0, correct = 0, total = 0 }) {
  const tier = tierForScore(score);
  _resultsTimers.forEach(clearTimeout);
  _resultsTimers = [];

  // ── Stars: staggered pop, score-keyed ────────────────────────
  const earned = starsForScore(score);
  const starsWrap = document.getElementById('results-stars');
  starsWrap.querySelectorAll('.results-star').forEach((s) => s.remove());
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('div');
    star.className = `results-star s${i + 1}${i < earned ? ' earned' : ''}`;
    star.innerHTML = `<svg viewBox="0 0 24 24"><path class="star-shape" d="${STAR_PATH}"/></svg>`;
    starsWrap.appendChild(star);
    _resultsTimers.push(setTimeout(() => {
      star.classList.add('pop');
      if (i < earned) haptics.medium();
    }, 550 + i * 240));
  }

  // ── Ring colour by tier ──────────────────────────────────────
  const ringEl = document.getElementById('results-ring-fill');
  ringEl.classList.remove('tier-great', 'tier-neutral', 'tier-poor');
  ringEl.classList.add(`tier-${tier}`);

  // Message + stats
  document.getElementById('results-message').textContent = pick(RESULT_TIERS[tier].messages);
  document.getElementById('results-stats').textContent = `${correct} / ${total} correct`;

  // ── Breo's score-keyed entrance ──────────────────────────────
  if (_resultsBreo) { _resultsBreo.destroy(); _resultsBreo = null; }
  const breoMount = document.getElementById('results-breo');
  _resultsBreo = createMascot({ size: 180 });
  _resultsBreo.setMood(tier);
  _resultsBreo.lookAt(-4, -2); // glance toward the score ring
  breoMount.appendChild(_resultsBreo.el);
  _resultsBreo.enter();
  // tap Breo → a happy little burst (he's friendly)
  breoMount.style.pointerEvents = 'auto';
  breoMount.onclick = (e) => {
    haptics.success();
    burst(e.clientX, e.clientY, { count: 14, speed: 260 });
    _resultsBreo.enter();
  };

  // Tier-specific haptic
  haptics[tier === 'great' ? 'celebrate' : tier === 'neutral' ? 'medium' : 'error']();

  // Continue button → back to unit
  document.getElementById('results-continue-btn').onclick =
    () => navigate('unit', { unitId, unit: getUnit(unitId) });

  // Celebration FX
  if (tier === 'great') {
    _resultsTimers.push(setTimeout(() => confetti({ count: 130 }), 350));
  } else if (tier === 'neutral') {
    _resultsTimers.push(setTimeout(() => {
      const r = document.querySelector('.results-ring-wrap').getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, { count: 16, speed: 240 });
    }, 750));
  }

  animateScore(score);
}

const RING_CIRCUMFERENCE = 126.92; // 2π·20.2

function animateScore(score) {
  const percentEl = document.getElementById('results-percent');
  const ringEl = document.getElementById('results-ring-fill');
  const setRing = (v) =>
    ringEl.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - Math.max(0, Math.min(100, v)) / 100));

  setRing(0);
  percentEl.textContent = '0%';

  // Spring with slight overshoot — the ring swings a touch past the
  // score, then settles. The number clamps so it never reads >100.
  animateSpring({
    from: 0, to: score, stiffness: 48, damping: 10.5,
    onUpdate(v) {
      percentEl.textContent = `${Math.round(Math.max(0, Math.min(score, v)))}%`;
      setRing(v);
    },
    onComplete() {
      percentEl.textContent = `${score}%`;
      percentEl.classList.remove('pop');
      void percentEl.offsetWidth;
      percentEl.classList.add('pop');
    },
  });
}

// ── Context menu (long-press on lesson dots) ───────────────────
function showContextMenu(dotEl, unitId, lessonId, isCompleted) {
  hideContextMenu();

  const menu = document.getElementById('lesson-context-menu');
  const markBtn = document.getElementById('ctx-mark-done');
  const resetBtn = document.getElementById('ctx-reset');

  if (isCompleted) {
    markBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
  } else {
    markBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
  }

  // Position menu near the dot
  const rect = dotEl.getBoundingClientRect();
  menu.style.top = `${rect.bottom + 8}px`;
  menu.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 80, window.innerWidth - 168))}px`;
  menu.classList.remove('hidden');

  // Haptic feedback on mobile
  haptics.medium();

  markBtn.onclick = () => {
    markLessonDone(unitId, lessonId);
    hideContextMenu();
    renderUnit(unitId);
  };

  resetBtn.onclick = () => {
    resetLesson(unitId, lessonId);
    hideContextMenu();
    renderUnit(unitId);
  };

  // Close on outside click (delayed to prevent immediate trigger)
  setTimeout(() => {
    document.addEventListener('click', _closeContextOnOutside);
    document.addEventListener('touchstart', _closeContextOnOutside);
  }, 100);
}

function _closeContextOnOutside(e) {
  const menu = document.getElementById('lesson-context-menu');
  if (menu && !menu.contains(e.target)) {
    hideContextMenu();
  }
}

function hideContextMenu() {
  const menu = document.getElementById('lesson-context-menu');
  if (menu) menu.classList.add('hidden');
  document.removeEventListener('click', _closeContextOnOutside);
  document.removeEventListener('touchstart', _closeContextOnOutside);
}

// ── Skip-ahead warning ─────────────────────────────────────────
function showSkipWarning(onConfirm) {
  const modal = document.getElementById('skip-modal');
  modal.classList.remove('hidden');

  document.getElementById('skip-confirm-btn').onclick = () => {
    modal.classList.add('hidden');
    onConfirm();
  };
  document.getElementById('skip-cancel-btn').onclick = () => {
    modal.classList.add('hidden');
  };
}

// ── Settings panel ─────────────────────────────────────────────
function showSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  panel.classList.remove('hidden');

  // Show username
  const usernameEl = document.getElementById('settings-username');
  usernameEl.textContent = getUsername() || '—';

  // Show sync status
  const syncStatus = document.getElementById('settings-sync-status');
  if (_lastSyncStatus === 'synced') {
    syncStatus.textContent = _lastSyncMessage || 'Synced ✓';
    syncStatus.className = 'settings-sync-status synced';
  } else if (_lastSyncStatus === 'error') {
    syncStatus.textContent = _lastSyncMessage || 'Sync error';
    syncStatus.className = 'settings-sync-status error';
  } else {
    syncStatus.textContent = 'Connected';
    syncStatus.className = 'settings-sync-status active';
  }

  // Reset transfer UI state
  document.getElementById('transfer-export-result').classList.add('hidden');
  document.getElementById('transfer-import-form').classList.add('hidden');
  document.getElementById('transfer-status').classList.add('hidden');
}

function hideSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (panel) panel.classList.add('hidden');
}

function updateSyncIndicator() {
  const indicator = document.getElementById('sync-indicator');
  if (!indicator) return;

  if (_lastSyncStatus === 'synced') {
    indicator.textContent = '☁️';
    indicator.className = 'sync-indicator synced';
    indicator.title = 'Synced ✓';
  } else if (_lastSyncStatus === 'syncing') {
    indicator.textContent = '⟳';
    indicator.className = 'sync-indicator syncing';
    indicator.title = 'Syncing…';
  } else if (_lastSyncStatus === 'error') {
    indicator.textContent = '⚠';
    indicator.className = 'sync-indicator error';
    indicator.title = _lastSyncMessage || 'Sync error';
  } else {
    indicator.textContent = '☁️';
    indicator.className = 'sync-indicator';
    indicator.title = 'Cloud sync';
  }
}

function setupSettingsListeners() {
  // Gear button
  document.getElementById('settings-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = document.getElementById('settings-panel');
    if (panel.classList.contains('hidden')) {
      showSettingsPanel();
    } else {
      hideSettingsPanel();
    }
  });

  // Close button
  document.getElementById('settings-close-btn').addEventListener('click', () => {
    hideSettingsPanel();
  });

  // ── Sync now ────────────────────────────────────────────────
  document.getElementById('settings-sync-now').addEventListener('click', async () => {
    const btn = document.getElementById('settings-sync-now');
    btn.disabled = true;
    btn.textContent = 'Syncing…';
    try {
      await syncNow();
      navigate('home');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sync Now';
    }
  });

  // ── Logout ──────────────────────────────────────────────────
  document.getElementById('settings-logout-btn').addEventListener('click', () => {
    logout();
    hideSettingsPanel();
    navigate('login');
  });

  // ── Transfer toggle ─────────────────────────────────────────
  document.getElementById('transfer-toggle').addEventListener('click', () => {
    const content = document.getElementById('transfer-content');
    const chevron = document.getElementById('transfer-toggle').querySelector('.settings-chevron');
    const isHidden = content.classList.contains('hidden');

    content.classList.toggle('hidden');
    chevron.style.transform = isHidden ? 'rotate(180deg)' : '';
  });

  // ── Transfer listeners ──────────────────────────────────────

  // Export
  document.getElementById('transfer-export-btn').addEventListener('click', () => {
    const code = exportProgress();
    if (code) {
      document.getElementById('transfer-export-text').value = code;
      document.getElementById('transfer-export-result').classList.remove('hidden');
      document.getElementById('transfer-import-form').classList.add('hidden');
      document.getElementById('transfer-status').classList.add('hidden');
    }
  });

  // Copy transfer code
  document.getElementById('transfer-copy-btn').addEventListener('click', () => {
    const text = document.getElementById('transfer-export-text').value;
    const btn = document.getElementById('transfer-copy-btn');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy to Clipboard';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback: select the textarea
        document.getElementById('transfer-export-text').select();
        document.execCommand('copy');
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
      });
    } else {
      document.getElementById('transfer-export-text').select();
      document.execCommand('copy');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 2000);
    }
  });

  // Show import form
  document.getElementById('transfer-import-btn').addEventListener('click', () => {
    document.getElementById('transfer-import-form').classList.remove('hidden');
    document.getElementById('transfer-export-result').classList.add('hidden');
    document.getElementById('transfer-status').classList.add('hidden');
    document.getElementById('transfer-import-text').value = '';
    document.getElementById('transfer-import-text').focus();
  });

  // Do import
  document.getElementById('transfer-do-import-btn').addEventListener('click', () => {
    const text = document.getElementById('transfer-import-text').value;
    const statusEl = document.getElementById('transfer-status');

    const result = importProgress(text);
    statusEl.classList.remove('hidden');

    if (result.ok) {
      statusEl.textContent = `✓ ${result.message}`;
      statusEl.className = 'transfer-status success';
      document.getElementById('transfer-import-form').classList.add('hidden');
      // Refresh the home screen
      setTimeout(() => navigate('home'), 500);
    } else {
      statusEl.textContent = `✗ ${result.message}`;
      statusEl.className = 'transfer-status error';
    }
  });

  // Listen for sync status changes
  onSyncStatus((status, message) => {
    _lastSyncStatus = status;
    _lastSyncMessage = message;
    updateSyncIndicator();

    // Update settings panel status if visible
    const settingsStatus = document.getElementById('settings-sync-status');
    if (settingsStatus && !document.getElementById('settings-panel').classList.contains('hidden')) {
      settingsStatus.textContent = message;
      settingsStatus.className = `settings-sync-status ${status}`;
    }
  });
}

// ── Lesson screen ──────────────────────────────────────────────
// State machine: 'answering' | 'showing_feedback'
let _lessonMode = 'answering';
let _currentUnitId = null;
let _currentLessonId = null;

function initLesson(unitId, lessonId) {
  _currentUnitId = unitId;
  _currentLessonId = lessonId;
  _lessonMode = 'answering';

  const ex = startLesson(lessonId, (result) => {
    haptics.complete();
    saveLessonScore(unitId, lessonId, result.score);
    clearCurrentLesson();
    navigate('results', {
      unitId,
      score: result.score,
      correct: result.correct,
      total: result.total,
    });
  });

  if (!ex) {
    navigate('unit', { unitId, unit: getUnit(unitId) });
    return;
  }

  updateProgressBar(true);
  hideFeedback();

  const btn = document.getElementById('lesson-action-btn');
  btn.textContent = 'Check';
  btn.disabled = true;
  btn.className = 'btn btn-primary';
  btn.onclick = onLessonAction;

  document.getElementById('exit-lesson-btn').onclick = showExitModal;
}

function onLessonAction() {
  if (_lessonMode === 'answering') {
    doCheck();
  } else {
    doContinue();
  }
}

function doCheck() {
  const answer = window._currentAnswer;
  const isMatchingDone = answer === '__matching_done__';
  const result = submitAnswer(isMatchingDone ? true : answer);
  if (!result) return;

  if (result.nearMiss) {
    // Almost correct — show hint, let user retry same exercise
    haptics.nearMiss();
    showFeedback(null, result.correctAnswer, true);
    const btn = document.getElementById('lesson-action-btn');
    btn.textContent = 'Try Again';
    btn.disabled = false;
    _lessonMode = 'showing_feedback';
    return;
  }

  haptics[result.correct ? 'success' : 'error']();
  showAnswerFeedback(result.correct, result.exercise);
  showFeedback(result.correct, result.correctAnswer);

  _lessonMode = 'showing_feedback';
  const btn = document.getElementById('lesson-action-btn');
  btn.textContent = 'Continue';
  btn.disabled = false;

  if (result.correct) {
    // tiles burst, a green wave ripples out from the button
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-correct');
    const r = btn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, {
      count: 24, speed: 380,
      colors: ['#4fc28b', '#7ddbb0', '#4fc3d4', '#c9ecf2', '#e0a548'],
    });
    ripple(btn, { color: 'hsla(162, 50%, 52%, 0.45)' });
  } else {
    // red flash, shake, a crack through the answer
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-incorrect');
    flash();
    const container = document.getElementById('exercise-container');
    const wrapper = container.querySelector('.exercise-wrapper');
    if (wrapper) {
      wrapper.classList.remove('wrong-shake');
      void wrapper.offsetWidth;
      wrapper.classList.add('wrong-shake');
    }
    const target =
      container.querySelector('.mc-option.selected') ||
      container.querySelector('.translate-textarea') ||
      container.querySelector('.fill-blank-input') ||
      container.querySelector('.word-bank-sentence') ||
      wrapper;
    crack(target);
  }
}

function doContinue() {
  const wasNearMiss = document.getElementById('feedback-inline').classList.contains('near-miss');
  hideFeedback();
  _lessonMode = 'answering';

  const btn = document.getElementById('lesson-action-btn');
  btn.classList.remove('btn-correct', 'btn-incorrect');
  btn.classList.add('btn-primary');

  if (wasNearMiss) {
    // Re-render same exercise for retry
    renderExercise();
    btn.textContent = 'Check';
    btn.disabled = true;
    return;
  }

  const hasMore = advance();
  if (hasMore) {
    updateProgressBar();
    btn.textContent = 'Check';
    btn.disabled = true;
  }
}

let _progressSpringCancel = null;
let _progressPct = 0;

function updateProgressBar(reset = false) {
  const { index, total } = getProgress();
  const pct = total > 0 ? (index / total) * 100 : 0;
  const fill = document.getElementById('lesson-progress-fill');

  if (_progressSpringCancel) _progressSpringCancel();
  if (reset || pct === 0 || prefersReducedMotion()) {
    fill.classList.remove('surging');
    fill.style.width = pct + '%';
    _progressPct = pct;
    return;
  }

  // spring surge with overshoot — the bar lunges past, then settles
  fill.classList.add('surging');
  _progressSpringCancel = animateSpring({
    from: _progressPct, to: pct, stiffness: 160, damping: 11,
    onUpdate(v) { fill.style.width = Math.max(0, Math.min(100, v)) + '%'; },
    onComplete() { fill.classList.remove('surging'); },
  });
  _progressPct = pct;
}

function showFeedback(correct, correctAnswer, nearMiss = false) {
  const fb = document.getElementById('feedback-inline');
  fb.classList.remove('hidden', 'correct', 'incorrect', 'near-miss');

  if (nearMiss) {
    fb.classList.add('near-miss');
    document.getElementById('feedback-label').textContent = '⚠ Almost!';
    document.getElementById('feedback-answer').textContent = `Correct spelling: ${correctAnswer}`;
  } else {
    fb.classList.add(correct ? 'correct' : 'incorrect');
    document.getElementById('feedback-label').textContent = correct ? '✓ Correct!' : '✗ Incorrect';
    document.getElementById('feedback-answer').textContent = correct ? '' : `Correct answer: ${correctAnswer}`;
  }
}

function hideFeedback() {
  const fb = document.getElementById('feedback-inline');
  fb.classList.add('hidden');
  fb.classList.remove('correct', 'incorrect', 'near-miss');
}

function showExitModal() {
  document.getElementById('exit-modal').classList.remove('hidden');
}

// Need to import renderExercise for retry logic
import { renderExercise } from './exercises.js';

// ── Init ───────────────────────────────────────────────────────
export async function init() {
  installGlobalHaptics();

  document.getElementById('exit-confirm-btn').onclick = () => {
    document.getElementById('exit-modal').classList.add('hidden');
    if (_currentUnitId) navigate('unit', { unitId: _currentUnitId, unit: getUnit(_currentUnitId) });
    else navigate('home');
  };
  document.getElementById('exit-cancel-btn').onclick = () => {
    document.getElementById('exit-modal').classList.add('hidden');
  };

  setupLoginListeners();
  setupSettingsListeners();

  // Re-lay-out the path when the viewport changes (rotation, resize)
  let _resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeTimer);
    _resizeTimer = setTimeout(() => {
      const home = document.getElementById('screen-home');
      if (home && !home.classList.contains('hidden')) renderHome();
    }, 250);
  });

  // Check if already logged in
  if (isLoggedIn()) {
    // Initialize sync (pull from cloud)
    await initSync();
    navigate('home');
  } else {
    navigate('login');
  }
}
