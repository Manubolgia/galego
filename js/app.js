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

// ── Screen management ──────────────────────────────────────────
const SCREENS = ['login','home','unit','lesson'];

// Track sync status globally
let _lastSyncStatus = 'idle';
let _lastSyncMessage = '';

export function navigate(screenId, params = {}) {
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
    if (screenId === 'unit' && params.unit) {
      topTitle.textContent = params.unit.title;
      backBtn.onclick = () => navigate('home');
      backBtn.style.visibility = 'visible';
    } else if (screenId === 'lesson') {
      topTitle.textContent = '';
      backBtn.style.visibility = 'hidden';
    }
  }

  // Close any open popovers
  hideContextMenu();
  hideSettingsPanel();

  if (screenId === 'login') renderLogin();
  if (screenId === 'home') renderHome();
  if (screenId === 'unit' && params.unitId) renderUnit(params.unitId);
  if (screenId === 'lesson' && params.lessonId) initLesson(params.unitId, params.lessonId);

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

// ── Home screen ────────────────────────────────────────────────
function renderHome() {
  const list = document.getElementById('units-list');
  list.innerHTML = '';

  // Update sync indicator
  updateSyncIndicator();

  COURSE.forEach((unit, i) => {
    const prog = getUnitProgress(unit.id, COURSE);
    const recommended = isUnitRecommended(unit.id, COURSE);

    const card = document.createElement('div');
    card.className = `unit-card${!recommended ? ' not-recommended' : ''}`;
    card.style.animationDelay = `${i * 60}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', unit.title);

    const pct = prog.percentage;
    const circumference = 126.9;
    const offset = circumference - (circumference * pct / 100);

    card.innerHTML = `
      <div class="unit-card-emoji">${unit.icon}</div>
      <div class="unit-card-info">
        <div class="unit-card-label">Unit ${i + 1} · <span class="unit-level-badge">${unit.level}</span></div>
        <div class="unit-card-title">${unit.title}</div>
        <div class="unit-card-subtitle">${unit.subtitle}</div>
      </div>
      <div class="unit-card-progress">
        <div class="progress-ring">
          <svg viewBox="0 0 44 44">
            <circle class="progress-ring-track" cx="22" cy="22" r="20.2"/>
            <circle class="progress-ring-fill${pct===100?' complete':''}" cx="22" cy="22" r="20.2"
              style="stroke-dashoffset:${offset}"/>
          </svg>
          <div class="progress-ring-text">${pct===100?'✓':pct>0?pct+'%':prog.completed+'/'+prog.total}</div>
        </div>
      </div>`;

    // All units are always clickable — skip-ahead warning for non-recommended units
    card.addEventListener('click', () => {
      if (!recommended) {
        showSkipWarning(() => navigate('unit', { unitId: unit.id, unit }));
      } else {
        navigate('unit', { unitId: unit.id, unit });
      }
    });
    list.appendChild(card);
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
  unit.grammarTips.forEach(tip => {
    const card = document.createElement('div');
    card.className = 'grammar-card';
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
    wrapper.className = 'lesson-dot-wrapper';

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
    navigate('unit', { unitId, unit: getUnit(unitId) });
  });

  if (!ex) {
    navigate('unit', { unitId, unit: getUnit(unitId) });
    return;
  }

  updateProgressBar();
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
}

function doContinue() {
  const wasNearMiss = document.getElementById('feedback-inline').classList.contains('near-miss');
  hideFeedback();
  _lessonMode = 'answering';

  if (wasNearMiss) {
    // Re-render same exercise for retry
    renderExercise();
    const btn = document.getElementById('lesson-action-btn');
    btn.textContent = 'Check';
    btn.disabled = true;
    return;
  }

  const hasMore = advance();
  if (hasMore) {
    updateProgressBar();
    const btn = document.getElementById('lesson-action-btn');
    btn.textContent = 'Check';
    btn.disabled = true;
  }
}

function updateProgressBar() {
  const { index, total } = getProgress();
  const pct = total > 0 ? (index / total) * 100 : 0;
  document.getElementById('lesson-progress-fill').style.width = pct + '%';
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

  // Check if already logged in
  if (isLoggedIn()) {
    // Initialize sync (pull from cloud)
    await initSync();
    navigate('home');
  } else {
    navigate('login');
  }
}
