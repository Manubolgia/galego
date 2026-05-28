// =====================================================
// GALEGO — State Manager
// localStorage persistence for progress and mid-lesson state
// Firebase Realtime Database sync via REST API
// Clipboard-based transfer for zero-config sync
// =====================================================

const STATE_KEY = 'galego_state_v2';
const SYNC_CODE_KEY = 'galego_sync_code';
const FIREBASE_URL_KEY = 'galego_firebase_url';

const DEFAULT_STATE = {
  lessonScores: {},         // "unit-1/lesson-1": { score, completedAt, attempts }
  currentLesson: null,      // { unitId, lessonId, questionIndex, answers }
};

let _state = null;
let _syncDebounceTimer = null;
let _firebaseUrl = null;
let _syncCode = null;
let _syncListeners = [];  // callbacks for sync status updates

// ── Firebase config ──────────────────────────────────────────
function _getFirebaseUrl() {
  if (_firebaseUrl) return _firebaseUrl;
  _firebaseUrl = localStorage.getItem(FIREBASE_URL_KEY) || null;
  return _firebaseUrl;
}

function _getSyncCode() {
  if (_syncCode) return _syncCode;
  _syncCode = localStorage.getItem(SYNC_CODE_KEY) || null;
  return _syncCode;
}

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

// ── Generate a human-readable sync code ──────────────────────
function _generateSyncCode() {
  const words = [
    'mar', 'sol', 'lua', 'vento', 'chuvia', 'monte', 'rio',
    'peixe', 'gato', 'can', 'flor', 'bosque', 'pedra', 'estrela',
    'nube', 'area', 'onda', 'lume', 'ferro', 'ouro', 'prata',
    'terra', 'ceo', 'neve', 'luz', 'mel', 'sal', 'pan'
  ];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 100);
  return `galego-${w1}-${w2}-${num}`;
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
    _debouncedCloudSync();
  } catch (e) {
    console.warn('Galego: Failed to save state', e);
  }
}

function _ensureLoaded() {
  if (!_state) _load();
}

// ── Firebase REST sync ───────────────────────────────────────
function _debouncedCloudSync() {
  if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
  _syncDebounceTimer = setTimeout(() => _pushToCloud(), 2000);
}

async function _pushToCloud() {
  const url = _getFirebaseUrl();
  const code = _getSyncCode();
  if (!url || !code) return;

  try {
    _notifySyncStatus('syncing', 'Syncing…');
    const payload = {
      lessonScores: _state.lessonScores,
      lastSyncAt: new Date().toISOString(),
      version: 2,
    };
    const endpoint = `${url}/progress/${code}.json`;
    console.log('Galego: Pushing to', endpoint);
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      mode: 'cors',
    });
    if (res.ok) {
      console.log('Galego: Push successful');
      _notifySyncStatus('synced', 'Synced ✓');
    } else {
      const text = await res.text().catch(() => '');
      console.warn('Galego: Push failed', res.status, text);
      if (res.status === 401) {
        _notifySyncStatus('error', 'Permission denied — check Firebase rules');
      } else if (res.status === 404) {
        _notifySyncStatus('error', 'Database not found — check URL');
      } else {
        _notifySyncStatus('error', `Sync failed (${res.status})`);
      }
    }
  } catch (e) {
    console.warn('Galego: Cloud sync failed', e.message || e);
    _notifySyncStatus('error', `Offline — ${e.message || 'network error'}`);
  }
}

async function _pullFromCloud() {
  const url = _getFirebaseUrl();
  const code = _getSyncCode();
  if (!url || !code) return;

  try {
    _notifySyncStatus('syncing', 'Loading…');
    const endpoint = `${url}/progress/${code}.json`;
    console.log('Galego: Pulling from', endpoint);
    const res = await fetch(endpoint, {
      cache: 'no-store',
      mode: 'cors',
    });

    if (!res.ok) {
      // 404 means no data at this path — that's normal for new sync codes
      if (res.status === 404) {
        console.log('Galego: No cloud data yet (404), pushing local data');
        await _pushToCloud();
        return;
      }
      if (res.status === 401) {
        _notifySyncStatus('error', 'Permission denied — check Firebase rules');
        return;
      }
      const text = await res.text().catch(() => '');
      console.warn('Galego: Pull failed', res.status, text);
      _notifySyncStatus('error', `Sync failed (${res.status})`);
      return;
    }

    const data = await res.json();
    console.log('Galego: Pull response:', data);

    if (data && data.lessonScores) {
      _mergeScores(data.lessonScores);
      _save(); // save merged result locally (won't re-push because we clear timer)
      if (_syncDebounceTimer) clearTimeout(_syncDebounceTimer);
      _notifySyncStatus('synced', 'Synced ✓');
    } else {
      // null or empty — No cloud data yet, push local data up
      console.log('Galego: Cloud data is empty/null, pushing local data');
      await _pushToCloud();
    }
  } catch (e) {
    console.warn('Galego: Cloud pull failed', e.message || e);
    _notifySyncStatus('error', `Offline — ${e.message || 'network error'}`);
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

// ── PUBLIC: Firebase setup ───────────────────────────────────
export function setupFirebase(firebaseUrl) {
  _firebaseUrl = firebaseUrl.replace(/\/$/, '');
  localStorage.setItem(FIREBASE_URL_KEY, _firebaseUrl);
}

export function isFirebaseConfigured() {
  return !!_getFirebaseUrl();
}

export function getSyncCode() {
  return _getSyncCode();
}

export function createSyncCode() {
  const code = _generateSyncCode();
  _syncCode = code;
  localStorage.setItem(SYNC_CODE_KEY, code);
  return code;
}

export function setSyncCode(code) {
  _syncCode = code.trim().toLowerCase();
  localStorage.setItem(SYNC_CODE_KEY, _syncCode);
}

export async function syncNow() {
  _ensureLoaded();
  await _pullFromCloud();
}

export function getFirebaseUrl() {
  return _getFirebaseUrl() || '';
}

// ── Test Firebase connection ─────────────────────────────────
export async function testFirebaseConnection() {
  const url = _getFirebaseUrl();
  if (!url) {
    return { ok: false, message: 'No Firebase URL configured' };
  }

  // Validate URL format
  if (!url.startsWith('https://')) {
    return { ok: false, message: 'URL must start with https://' };
  }
  if (!url.includes('firebaseio.com') && !url.includes('firebasedatabase.app')) {
    return { ok: false, message: 'URL doesn\'t look like a Firebase Realtime Database URL' };
  }

  const steps = [];

  // Step 1: Test basic connectivity
  try {
    steps.push('Testing connectivity…');
    const testEndpoint = `${url}/.json?shallow=true`;
    console.log('Galego: Testing connection to', testEndpoint);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(testEndpoint, {
      cache: 'no-store',
      mode: 'cors',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 401) {
      steps.push('⚠ Root access denied (401) — this is normal if rules restrict root');
    } else if (res.ok) {
      steps.push('✓ Database reachable');
    } else {
      steps.push(`✗ Got HTTP ${res.status}`);
      return { ok: false, message: steps.join('\n'), status: res.status };
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      steps.push('✗ Connection timed out (8s)');
    } else {
      steps.push(`✗ Network error: ${e.message}`);
    }
    return { ok: false, message: steps.join('\n') };
  }

  // Step 2: Test write to a test path
  try {
    steps.push('Testing write access…');
    const testPath = `${url}/progress/_connection_test.json`;
    const res = await fetch(testPath, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true, at: new Date().toISOString() }),
      cache: 'no-store',
      mode: 'cors',
    });

    if (res.ok) {
      steps.push('✓ Write access works');
    } else if (res.status === 401) {
      steps.push('✗ Write denied (401) — update Firebase security rules');
      steps.push('  Rules should allow read/write under /progress/');
      return { ok: false, message: steps.join('\n') };
    } else {
      steps.push(`✗ Write failed (${res.status})`);
      return { ok: false, message: steps.join('\n') };
    }
  } catch (e) {
    steps.push(`✗ Write error: ${e.message}`);
    return { ok: false, message: steps.join('\n') };
  }

  // Step 3: Test read
  try {
    steps.push('Testing read access…');
    const testPath = `${url}/progress/_connection_test.json`;
    const res = await fetch(testPath, {
      cache: 'no-store',
      mode: 'cors',
    });
    if (res.ok) {
      steps.push('✓ Read access works');
    } else {
      steps.push(`✗ Read failed (${res.status})`);
      return { ok: false, message: steps.join('\n') };
    }
  } catch (e) {
    steps.push(`✗ Read error: ${e.message}`);
    return { ok: false, message: steps.join('\n') };
  }

  steps.push('✓ All tests passed — Firebase is ready!');
  return { ok: true, message: steps.join('\n') };
}

// ── Clipboard-based progress transfer ────────────────────────
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
  if (_getFirebaseUrl() && _getSyncCode()) {
    await _pullFromCloud();
  }
}
