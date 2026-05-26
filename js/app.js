// Galego — App Router & Screen Manager
import { COURSE, getUnit } from './data/course.js';
import { init as initAudio } from './audio.js';
import {
  isLessonUnlocked, isLessonCompleted, getLessonScore,
  getUnitProgress, saveLessonScore, clearCurrentLesson
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
    const prevProg = i > 0 ? getUnitProgress(COURSE[i-1].id, COURSE) : null;
    const isLocked = i > 0 && prevProg && prevProg.percentage < 100;

    const card = document.createElement('div');
    card.className = `unit-card${isLocked ? ' locked' : ''}`;
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
        ${isLocked ? `
          <div class="unit-card-lock">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>` : `
          <div class="progress-ring">
            <svg viewBox="0 0 44 44">
              <circle class="progress-ring-track" cx="22" cy="22" r="20.2"/>
              <circle class="progress-ring-fill${pct===100?' complete':''}" cx="22" cy="22" r="20.2"
                style="stroke-dashoffset:${offset}"/>
            </svg>
            <div class="progress-ring-text">${pct===100?'✓':pct>0?pct+'%':prog.completed+'/'+prog.total}</div>
          </div>`}
      </div>`;

    if (!isLocked) {
      card.addEventListener('click', () => navigate('unit', { unitId: unit.id, unit }));
    }
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
    const unlocked = isLessonUnlocked(unitId, lessonId, COURSE);
    const completed = isLessonCompleted(unitId, lessonId);
    const score = getLessonScore(unitId, lessonId);

    const wrapper = document.createElement('div');
    wrapper.className = 'lesson-dot-wrapper';

    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Lesson ${i + 1}`);

    if (!unlocked) {
      dot.className = 'lesson-dot locked';
      dot.innerHTML = `<svg class="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
    } else if (completed && score) {
      const cls = score.score >= 90 ? 'score-high' : score.score >= 70 ? 'score-mid' : 'score-low';
      dot.className = `lesson-dot completed ${cls}`;
      dot.textContent = score.score + '%';
      dot.addEventListener('click', () => navigate('lesson', { unitId, lessonId }));
    } else {
      dot.className = 'lesson-dot available';
      dot.textContent = i + 1;
      dot.addEventListener('click', () => navigate('lesson', { unitId, lessonId }));
    }

    const label = document.createElement('div');
    label.className = 'lesson-dot-label';
    label.textContent = `L${i + 1}`;

    wrapper.appendChild(dot);
    wrapper.appendChild(label);
    dotsContainer.appendChild(wrapper);
  });

  // Start button — first available lesson
  const firstAvail = unit.lessons.find(lid => isLessonUnlocked(unitId, lid, COURSE));
  const startBtn = document.getElementById('unit-start-btn');
  if (firstAvail) {
    startBtn.disabled = false;
    startBtn.textContent = isLessonCompleted(unitId, firstAvail) ? 'Practice Again' : 'Start Lesson';
    startBtn.onclick = () => navigate('lesson', { unitId, lessonId: firstAvail });
  } else {
    startBtn.disabled = true;
    startBtn.textContent = 'Locked';
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

  navigate('home');
}
