// Galego — App Router & Screen Manager
import { COURSE, getUnit } from './data/course.js';
import { init as initAudio } from './audio.js';
import {
  isLessonRecommended, isLessonCompleted, getLessonScore,
  getUnitProgress, saveLessonScore, clearCurrentLesson,
  isUnitRecommended, markLessonDone, resetLesson,
  isFirebaseConfigured, getSyncCode, createSyncCode,
  setSyncCode, setupFirebase, syncNow, getFirebaseUrl,
  onSyncStatus, initSync,
} from './state.js';
import {
  startLesson, getProgress, submitAnswer, advance,
  showAnswerFeedback
} from './exercises.js';

// ── Screen management ──────────────────────────────────────────
const SCREENS = ['home','unit','lesson'];

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

  if (screenId === 'home') {
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

  if (screenId === 'home') renderHome();
  if (screenId === 'unit' && params.unitId) renderUnit(params.unitId);
  if (screenId === 'lesson' && params.lessonId) initLesson(params.unitId, params.lessonId);

}

// ── Home screen ────────────────────────────────────────────────
function renderHome() {
  const list = document.getElementById('units-list');
  list.innerHTML = '';

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
  if (navigator.vibrate) navigator.vibrate(30);

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

  const firebaseInput = document.getElementById('settings-firebase-url');
  const syncCodeDisplay = document.getElementById('settings-sync-code');
  const syncStatus = document.getElementById('settings-sync-status');
  const syncCodeInput = document.getElementById('settings-sync-code-input');

  firebaseInput.value = getFirebaseUrl();

  const code = getSyncCode();
  if (code) {
    syncCodeDisplay.textContent = code;
    syncCodeInput.value = code;
  } else {
    syncCodeDisplay.textContent = 'Not set';
    syncCodeInput.value = '';
  }

  syncStatus.textContent = isFirebaseConfigured() && code ? 'Configured' : 'Not configured';
  syncStatus.className = `settings-sync-status ${isFirebaseConfigured() && code ? 'active' : ''}`;
}

function hideSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (panel) panel.classList.add('hidden');
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

  // Generate new sync code
  document.getElementById('settings-generate-code').addEventListener('click', () => {
    const code = createSyncCode();
    document.getElementById('settings-sync-code').textContent = code;
    document.getElementById('settings-sync-code-input').value = code;
    updateSyncStatusUI();
  });

  // Use existing code
  document.getElementById('settings-use-code').addEventListener('click', () => {
    const input = document.getElementById('settings-sync-code-input');
    const code = input.value.trim();
    if (code.length < 3) {
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 1500);
      return;
    }
    setSyncCode(code);
    document.getElementById('settings-sync-code').textContent = code;
    updateSyncStatusUI();
    // Pull from cloud with new code
    if (isFirebaseConfigured()) {
      syncNow().then(() => {
        navigate('home'); // refresh UI with synced data
      });
    }
  });

  // Copy sync code
  document.getElementById('settings-copy-code').addEventListener('click', () => {
    const code = getSyncCode();
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('settings-copy-code');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
      }).catch(() => {
        // Fallback
        const input = document.getElementById('settings-sync-code-input');
        input.select();
        document.execCommand('copy');
      });
    }
  });

  // Save Firebase URL
  document.getElementById('settings-save-firebase').addEventListener('click', () => {
    const input = document.getElementById('settings-firebase-url');
    const url = input.value.trim();
    if (url) {
      setupFirebase(url);
      updateSyncStatusUI();
      // If we have a code, sync now
      if (getSyncCode()) {
        syncNow().then(() => {
          navigate('home');
        });
      }
    }
  });

  // Sync now button
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

  // Listen for sync status changes
  onSyncStatus((status, message) => {
    const indicator = document.getElementById('sync-indicator');
    if (indicator) {
      indicator.className = `sync-indicator ${status}`;
      indicator.textContent = status === 'synced' ? '☁️' : status === 'syncing' ? '⟳' : '⚠';
      indicator.title = message;
    }
    const settingsStatus = document.getElementById('settings-sync-status');
    if (settingsStatus && !document.getElementById('settings-panel').classList.contains('hidden')) {
      settingsStatus.textContent = message;
      settingsStatus.className = `settings-sync-status ${status}`;
    }
  });
}

function updateSyncStatusUI() {
  const syncStatus = document.getElementById('settings-sync-status');
  const configured = isFirebaseConfigured() && getSyncCode();
  syncStatus.textContent = configured ? 'Configured' : 'Not configured';
  syncStatus.className = `settings-sync-status ${configured ? 'active' : ''}`;

  // Show/hide sync indicator in home header
  const indicator = document.getElementById('sync-indicator');
  if (indicator) {
    indicator.classList.toggle('hidden', !configured);
  }
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
    showFeedback(null, result.correctAnswer, true);
    const btn = document.getElementById('lesson-action-btn');
    btn.textContent = 'Try Again';
    btn.disabled = false;
    _lessonMode = 'showing_feedback';
    return;
  }

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
  await initAudio();

  document.getElementById('exit-confirm-btn').onclick = () => {
    document.getElementById('exit-modal').classList.add('hidden');
    if (_currentUnitId) navigate('unit', { unitId: _currentUnitId, unit: getUnit(_currentUnitId) });
    else navigate('home');
  };
  document.getElementById('exit-cancel-btn').onclick = () => {
    document.getElementById('exit-modal').classList.add('hidden');
  };

  setupSettingsListeners();

  // Initialize sync
  await initSync();

  navigate('home');
}
