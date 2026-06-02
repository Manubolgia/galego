// =====================================================
// GALEGO — State Manager
// localStorage persistence for progress and mid-lesson state
// Cloud sync via Cloudflare Worker (login-based)
// Clipboard-based transfer as backup
// =====================================================

const STATE_KEY = 'galego_state_v2';
const SESSION_KEY = 'galego_session';

// ── IMPORTANT: Set this to your deployed Worker URL ──
const SYNC_API_URL = 'https://galego-sync.manuobelleiro00.workers.dev';

const DEFAULT_STATE = {
  lessonScores: {},         // "unit-1/lesson-1": { score, completedAt, attempts }
  currentLesson: null,      // { unitId, lessonId, questionIndex, answers }
};

let _state = null;
let _syncDebounceTimer = null;
let _session = null;   // { username, passwordHash }
let _syncListeners = [];

// ── Sync status notifications ────────────────────────────────
function _notifySyncStatus(status, message) {
  _syncListeners.forEach(fn => fn(status, message));
}

export function onSyncStatus(callback) {
  _syncListeners.push(callback);
  return () => {
    _syncListeners = _syncListeners.filter(fn => fn !== callback);
  };
}

// ── SHA-256 hashing ──────────────────────────────────────────
async function _hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Session management ───────────────────────────────────────
function _loadSession() {
  if (_session) return _session;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      _session = JSON.parse(raw);
      return _session;
    }
  } catch (e) {
    console.warn('Galego: Failed to load session', e);
  }
  return null;
}

function _saveSession(username, passwordHash) {
  _session = { username, passwordHash };
  localStorage.setItem(SESSION_KEY, JSON.stringify(_session));
}

function _clearSession() {
  _session = null;
  localStorage.removeItem(SESSION_KEY);
}

// ── Local storage ────────────────────────────────────────────
function _load() {
  try {
    // Try v2 first, fall back to v1 for migration
    let raw = localStorage.getItem(STATE_KEY);
    if (!raw) {
      raw = localStorage.getItem('galego_state_v1');
    }
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
    _debouncedCloudSave();
  } catch (e) {
    console.warn('Galego: Failed to save state', e);
  }
}

function _ensureLoaded() {
  if (!_state) _load();
}

// ── Cloud sync (Worker API) ──────────────────────────────────
function _debouncedCloudSave() {
  if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
  _syncDebounceTimer = setTimeout(() => _pushToCloud(), 2000);
}

async function _pushToCloud() {
  const session = _loadSession();
  if (!session) return;

  try {
    _notifySyncStatus('syncing', 'Saving…');
    const res = await fetch(`${SYNC_API_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.username,
        passwordHash: session.passwordHash,
        data: {
          lessonScores: _state.lessonScores,
          lastSyncAt: new Date().toISOString(),
        },
      }),
    });

    if (res.ok) {
      _notifySyncStatus('synced', 'Saved ✓');
    } else if (res.status === 401) {
      _notifySyncStatus('error', 'Session expired');
    } else {
      _notifySyncStatus('error', `Save failed (${res.status})`);
    }
  } catch (e) {
    console.warn('Galego: Cloud save failed', e.message || e);
    _notifySyncStatus('error', 'Offline — saved locally');
  }
}

async function _pullFromCloud() {
  const session = _loadSession();
  if (!session) return;

  try {
    _notifySyncStatus('syncing', 'Loading…');
    const res = await fetch(`${SYNC_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.username,
        passwordHash: session.passwordHash,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        _notifySyncStatus('error', 'Session expired');
        return;
      }
      _notifySyncStatus('error', `Sync failed (${res.status})`);
      return;
    }

    const { progress } = await res.json();

    if (progress && progress.lessonScores) {
      _mergeScores(progress.lessonScores);
      // Save merged result locally without re-pushing
      localStorage.setItem(STATE_KEY, JSON.stringify(_state));
      if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
      _notifySyncStatus('synced', 'Synced ✓');
    } else {
      // No cloud data yet — push local data up
      await _pushToCloud();
    }
  } catch (e) {
    console.warn('Galego: Cloud pull failed', e.message || e);
    _notifySyncStatus('error', 'Offline — using local data');
  }
}

function _mergeScores(cloudScores) {
  _ensureLoaded();
  for (const key of Object.keys(cloudScores)) {
    const cloud = cloudScores[key];
    const local = _state.lessonScores[key];

    if (!local) {
      // Cloud has data we don't — take it
      _state.lessonScores[key] = cloud;
    } else {
      // Merge: keep best score, latest timestamp, highest attempts
      _state.lessonScores[key] = {
        score: Math.max(local.score || 0, cloud.score || 0),
        bestScore: Math.max(local.bestScore || local.score || 0, cloud.bestScore || cloud.score || 0),
        lastScore: (new Date(local.completedAt || 0) > new Date(cloud.completedAt || 0))
          ? (local.lastScore ?? local.score) : (cloud.lastScore ?? cloud.score),
        completedAt: (new Date(local.completedAt || 0) > new Date(cloud.completedAt || 0))
          ? local.completedAt : cloud.completedAt,
        attempts: Math.max(local.attempts || 1, cloud.attempts || 1),
        manual: local.manual && cloud.manual,
      };
      // Clean up manual flag if false
      if (!_state.lessonScores[key].manual) delete _state.lessonScores[key].manual;
    }
  }
}

// ── PUBLIC: Login / Logout / Auth ────────────────────────────

/**
 * Log in with username and password.
 * On first login for a username, the account is auto-created.
 * Returns { ok, error?, progress? }
 */
export async function login(username, password) {
  if (!username || !password) {
    return { ok: false, error: 'Please enter username and password' };
  }

  const cleanUsername = username.trim().toLowerCase();
  const passwordHash = await _hashPassword(password);

  try {
    const res = await fetch(`${SYNC_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: cleanUsername, passwordHash }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        return { ok: false, error: 'Wrong password' };
      }
      return { ok: false, error: data.error || 'Login failed' };
    }

    // Save session
    _saveSession(cleanUsername, passwordHash);

    // Start from a clean slate, then load cloud progress
    _state = { ...DEFAULT_STATE };
    if (data.progress && data.progress.lessonScores) {
      _mergeScores(data.progress.lessonScores);
    }

    // Push merged data back to cloud
    _save();

    return { ok: true };
  } catch (e) {
    console.warn('Galego: Login failed', e);
    return { ok: false, error: 'Network error — check your connection' };
  }
}

export function logout() {
  _clearSession();
  _notifySyncStatus('idle', '');
}

export function isLoggedIn() {
  return !!_loadSession();
}

export function getUsername() {
  const session = _loadSession();
  return session ? session.username : null;
}

export async function syncNow() {
  _ensureLoaded();
  await _pullFromCloud();
}

// ── Clipboard-based progress transfer (backup) ──────────────
export function exportProgress() {
  _ensureLoaded();
  const data = {
    v: 2,
    s: _state.lessonScores,
    t: new Date().toISOString(),
  };
  try {
    const json = JSON.stringify(data);
    // Use base64 encoding for a compact, pasteable string
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return `GALEGO:${encoded}`;
  } catch (e) {
    console.warn('Galego: Export failed', e);
    return null;
  }
}

export function importProgress(encoded) {
  if (!encoded || typeof encoded !== 'string') {
    return { ok: false, message: 'No data provided' };
  }

  // Strip prefix
  let base64 = encoded.trim();
  if (base64.startsWith('GALEGO:')) {
    base64 = base64.slice(7);
  }

  try {
    const json = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(json);

    if (!data || !data.s) {
      return { ok: false, message: 'Invalid data format' };
    }

    _ensureLoaded();

    const importedCount = Object.keys(data.s).length;
    const beforeCount = Object.keys(_state.lessonScores).length;

    // Merge imported scores with local
    _mergeScores(data.s);
    _save();

    const afterCount = Object.keys(_state.lessonScores).length;
    const newLessons = afterCount - beforeCount;
    const exportTime = data.t ? new Date(data.t).toLocaleString() : 'unknown';

    return {
      ok: true,
      message: `Imported ${importedCount} lessons (${newLessons} new). Exported at ${exportTime}`,
    };
  } catch (e) {
    console.warn('Galego: Import failed', e);
    return { ok: false, message: 'Invalid transfer code — make sure you copied the full text' };
  }
}

// === PROGRESS API ===

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
 * Returns true if a lesson is "recommended" (prerequisites completed).
 * This is informational — all lessons are accessible.
 * Rules:
 *  - Unit 1, Lesson 1 is always recommended.
 *  - Lesson N+1 is recommended when lesson N is completed.
 *  - First lesson of a new unit is recommended when all lessons in the previous unit are done.
 */
export function isLessonRecommended(unitId, lessonId, course) {
  _ensureLoaded();

  const unitIndex = course.findIndex(u => u.id === unitId);
  const unit = course[unitIndex];
  if (!unit) return false;

  const lessonIndex = unit.lessons.indexOf(lessonId);
  if (lessonIndex === -1) return false;

  // First lesson of first unit — always recommended
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

/**
 * Returns true if a unit is "recommended" (previous unit fully completed).
 */
export function isUnitRecommended(unitId, course) {
  const unitIndex = course.findIndex(u => u.id === unitId);
  if (unitIndex === 0) return true;
  const prevUnit = course[unitIndex - 1];
  return prevUnit.lessons.every(lid => isLessonCompleted(prevUnit.id, lid));
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

// ── Mark as done / Reset ─────────────────────────────────────
export function markLessonDone(unitId, lessonId) {
  _ensureLoaded();
  const key = `${unitId}/${lessonId}`;
  _state.lessonScores[key] = {
    score: 0,
    bestScore: 0,
    lastScore: 0,
    completedAt: new Date().toISOString(),
    attempts: 0,
    manual: true,
  };
  _save();
}

export function resetLesson(unitId, lessonId) {
  _ensureLoaded();
  const key = `${unitId}/${lessonId}`;
  delete _state.lessonScores[key];
  _save();
}

export function resetProgress() {
  _state = { ...DEFAULT_STATE };
  _save();
}

// ── Init sync on load ────────────────────────────────────────
export async function initSync() {
  _ensureLoaded();
  if (isLoggedIn()) {
    await _pullFromCloud();
  }
}
