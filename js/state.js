// =====================================================
// GALEGO — State Manager
// localStorage persistence for progress and mid-lesson state
// =====================================================

const STATE_KEY = 'galego_state_v1';

const DEFAULT_STATE = {
  lessonScores: {},         // "unit-1/lesson-1": { score, completedAt, attempts }
  currentLesson: null,      // { unitId, lessonId, questionIndex, answers }
};

let _state = null;

function _load() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      _state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } else {
      _state = { ...DEFAULT_STATE };
    }
  } catch (e) {
    console.warn('Galego: Failed to load state, using defaults', e);
    _state = { ...DEFAULT_STATE };
  }
}

function _save() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(_state));
  } catch (e) {
    console.warn('Galego: Failed to save state', e);
  }
}

function _ensureLoaded() {
  if (!_state) _load();
}

// === PUBLIC API ===

export function getProgress() {
  _ensureLoaded();
  return { ..._state };
}

export function saveLessonScore(unitId, lessonId, score) {
  _ensureLoaded();
  const key = `${unitId}/${lessonId}`;
  const existing = _state.lessonScores[key];

  // Keep best score, but always update completedAt
  _state.lessonScores[key] = {
    score: existing ? Math.max(existing.score, score) : score,
    bestScore: existing ? Math.max(existing.score, score) : score,
    lastScore: score,
    completedAt: new Date().toISOString(),
    attempts: existing ? (existing.attempts || 1) + 1 : 1,
  };

  _save();
}

export function getLessonScore(unitId, lessonId) {
  _ensureLoaded();
  const key = `${unitId}/${lessonId}`;
  return _state.lessonScores[key] || null;
}

export function isLessonCompleted(unitId, lessonId) {
  _ensureLoaded();
  const key = `${unitId}/${lessonId}`;
  return !!_state.lessonScores[key];
}

/**
 * Returns true if a lesson is unlocked.
 * Rules:
 *  - Unit 1, Lesson 1 is always unlocked.
 *  - Lesson N+1 unlocks when lesson N is completed.
 *  - First lesson of a new unit unlocks when all lessons in the previous unit are done.
 */
export function isLessonUnlocked(unitId, lessonId, course) {
  _ensureLoaded();

  const unitIndex = course.findIndex(u => u.id === unitId);
  const unit = course[unitIndex];
  if (!unit) return false;

  const lessonIndex = unit.lessons.indexOf(lessonId);
  if (lessonIndex === -1) return false;

  // First lesson of first unit — always unlocked
  if (unitIndex === 0 && lessonIndex === 0) return true;

  // First lesson of a non-first unit — check all lessons of previous unit
  if (lessonIndex === 0) {
    const prevUnit = course[unitIndex - 1];
    const allPrevDone = prevUnit.lessons.every(lid =>
      isLessonCompleted(prevUnit.id, lid)
    );
    return allPrevDone;
  }

  // Non-first lesson — check previous lesson in same unit
  const prevLessonId = unit.lessons[lessonIndex - 1];
  return isLessonCompleted(unitId, prevLessonId);
}

export function getUnitProgress(unitId, course) {
  _ensureLoaded();
  const unit = course.find(u => u.id === unitId);
  if (!unit) return { completed: 0, total: 0, percentage: 0, averageScore: 0 };

  const total = unit.lessons.length;
  let completed = 0;
  let totalScore = 0;

  unit.lessons.forEach(lessonId => {
    const score = getLessonScore(unitId, lessonId);
    if (score) {
      completed++;
      totalScore += score.score;
    }
  });

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    averageScore: completed > 0 ? Math.round(totalScore / completed) : 0,
  };
}

export function saveCurrentLesson(lessonState) {
  _ensureLoaded();
  _state.currentLesson = lessonState;
  _save();
}

export function getCurrentLesson() {
  _ensureLoaded();
  return _state.currentLesson;
}

export function clearCurrentLesson() {
  _ensureLoaded();
  _state.currentLesson = null;
  _save();
}

export function resetProgress() {
  _state = { ...DEFAULT_STATE };
  _save();
}
