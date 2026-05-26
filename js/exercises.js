// Galego — Exercise Engine
import { getLessonExercises } from './data/exercises.js';
import { speak, isSupported as audioSupported } from './audio.js';

let _state = null; // { exercises, index, correct, wrong[], answers }
let _onComplete = null;

// ── Normalise answers ──────────────────────────────────────────
function normalise(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip accents
    .toLowerCase().trim()
    .replace(/[`\u2018\u2019\u2019]/g, "'")              // normalise apostrophes
    .replace(/\s+/g, ' ')
    .replace(/[¿¡]/g, '')
    .replace(/[.!?,;:]/g, '');
}

function isMatch(input, correct, accepted = []) {
  const n = normalise(input);
  const all = [correct, ...accepted].map(normalise);
  return all.includes(n);
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 1) return 2; // fast exit
  let prev = Array.from({length: n + 1}, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const curr = [i];
    for (let j = 1; j <= n; j++)
      curr[j] = a[i-1] === b[j-1] ? prev[j-1] : 1 + Math.min(prev[j], curr[j-1], prev[j-1]);
    prev = curr;
  }
  return prev[n];
}

function isNearMiss(input, correct, accepted = []) {
  const nIn = normalise(input);
  const targets = [correct, ...accepted].map(normalise);
  return nIn.length > 0 && targets.some(t => levenshtein(nIn, t) === 1);
}

// ── Shuffle ────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Start a lesson ─────────────────────────────────────────────
export function startLesson(lessonId, onComplete) {
  const raw = getLessonExercises(lessonId);
  if (!raw.length) { console.warn('No exercises for', lessonId); return; }

  // Preserve difficulty curve: mc first, then others
  const mc = raw.filter(e => e.type === 'multiple_choice');
  const rest = shuffle(raw.filter(e => e.type !== 'multiple_choice'));
  const exercises = [...mc.slice(0, 2), ...shuffle([...mc.slice(2), ...rest])];

  _state = { exercises, index: 0, correct: 0, wrong: [], matchState: null };
  _onComplete = onComplete;
  return renderExercise();
}

export function getProgress() {
  if (!_state) return { index: 0, total: 0 };
  return { index: _state.index, total: _state.exercises.length };
}

// ── Render current exercise ────────────────────────────────────
export function renderExercise() {
  if (!_state) return null;
  const ex = _state.exercises[_state.index];
  if (!ex) return null;

  const container = document.getElementById('exercise-container');
  container.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'exercise-wrapper';

  switch (ex.type) {
    case 'multiple_choice': renderMC(ex, wrap); break;
    case 'translate_type':  renderTranslate(ex, wrap); break;
    case 'word_bank':       renderWordBank(ex, wrap); break;
    case 'fill_blank':      renderFillBlank(ex, wrap); break;
    case 'matching':        renderMatching(ex, wrap); break;
    case 'listening':       renderListening(ex, wrap); break;
    default: renderMC(ex, wrap);
  }

  container.appendChild(wrap);
  if (ex.audio && ex.type !== 'listening') {
    setTimeout(() => speak(ex.audio), 400);
  }
  return ex;
}

// ── Grade + advance ────────────────────────────────────────────
export function submitAnswer(userAnswer) {
  if (!_state) return null;
  const ex = _state.exercises[_state.index];
  const correct = checkAnswer(ex, userAnswer);

  if (correct) {
    _state.correct++;
    return { correct: true, nearMiss: false, correctAnswer: getCorrectDisplay(ex), exercise: ex };
  }

  // Near-miss: 1 letter off on typed exercises → retry, not a mistake
  const typedTypes = ['translate_type', 'fill_blank', 'listening'];
  if (typedTypes.includes(ex.type) && typeof userAnswer === 'string') {
    if (isNearMiss(userAnswer, ex.correctAnswer, ex.acceptedAnswers || [])) {
      return { correct: false, nearMiss: true, correctAnswer: getCorrectDisplay(ex), exercise: ex };
    }
  }

  _state.wrong.push({ exercise: ex, userAnswer });
  return { correct: false, nearMiss: false, correctAnswer: getCorrectDisplay(ex), exercise: ex };
}

export function advance() {
  if (!_state) return false;
  _state.index++;
  if (_state.index >= _state.exercises.length) {
    const score = Math.round((_state.correct / _state.exercises.length) * 100);
    const result = { score, wrong: _state.wrong, total: _state.exercises.length, correct: _state.correct };
    _state = null;
    if (_onComplete) _onComplete(result);
    return false;
  }
  renderExercise();
  return true;
}

// ── Answer checking ────────────────────────────────────────────
function checkAnswer(ex, answer) {
  switch (ex.type) {
    case 'multiple_choice':
      return answer === ex.correctAnswer;
    case 'translate_type':
    case 'fill_blank':
    case 'listening':
      return isMatch(answer, ex.correctAnswer, ex.acceptedAnswers);
    case 'word_bank':
      if (!Array.isArray(answer)) return false;
      return answer.join(' ') === ex.correctAnswer.join(' ');
    case 'matching':
      return answer === true; // matching self-grades
    default:
      return false;
  }
}

function getCorrectDisplay(ex) {
  switch (ex.type) {
    case 'word_bank': return ex.correctAnswer.join(' ');
    case 'matching': return ex.pairs.map(p => `${p.gl} = ${p.en}`).join(', ');
    default: return ex.correctAnswer;
  }
}

// ── Render helpers ─────────────────────────────────────────────
function header(ex, label) {
  const div = document.createElement('div');
  div.className = 'exercise-header';
  div.innerHTML = `<div class="exercise-type-label">${label}</div>
    <div class="exercise-prompt">${ex.prompt}</div>`;
  if (ex.audio) {
    const row = document.createElement('div');
    row.className = 'exercise-audio-row';
    row.appendChild(audioBtn(ex.audio));
    div.appendChild(row);
  }
  return div;
}

function audioBtn(text) {
  const btn = document.createElement('button');
  btn.className = 'audio-btn';
  btn.setAttribute('aria-label', 'Play audio');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  btn.addEventListener('click', () => {
    btn.classList.add('playing');
    speak(text, null, () => btn.classList.remove('playing'));
  });
  return btn;
}

function enableCheck(enabled) {
  const btn = document.getElementById('lesson-action-btn');
  if (btn) btn.disabled = !enabled;
}

// Multiple Choice
function renderMC(ex, wrap) {
  wrap.appendChild(header(ex, 'Multiple Choice'));
  if (ex.sentence) {
    const s = document.createElement('div');
    s.className = 'exercise-sentence';
    s.textContent = ex.sentence;
    wrap.appendChild(s);
  }
  const grid = document.createElement('div');
  grid.className = 'mc-options' + (ex.options.some(o => o.length > 20) ? ' single-col' : '');
  let selected = null;

  ex.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'mc-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (selected !== null) return;
      selected = opt;
      grid.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      enableCheck(true);
      window._currentAnswer = opt;
    });
    grid.appendChild(btn);
  });

  wrap.appendChild(grid);
  enableCheck(false);
  window._currentAnswer = null;
}

// Translation input
function renderTranslate(ex, wrap) {
  wrap.appendChild(header(ex, 'Translate'));
  if (ex.sentence) {
    const s = document.createElement('div');
    s.className = 'exercise-sentence';
    s.textContent = ex.sentence;
    wrap.appendChild(s);
  }
  const area = document.createElement('div');
  area.className = 'translate-input-area';
  const ta = document.createElement('textarea');
  ta.className = 'translate-textarea';
  ta.placeholder = 'Type your answer…';
  ta.rows = 3;
  ta.addEventListener('input', () => {
    enableCheck(ta.value.trim().length > 0);
    window._currentAnswer = ta.value.trim();
  });
  area.appendChild(ta);
  wrap.appendChild(area);
  enableCheck(false);
  window._currentAnswer = '';
  setTimeout(() => ta.focus(), 300);
}

// Word bank
function renderWordBank(ex, wrap) {
  wrap.appendChild(header(ex, 'Build the Sentence'));
  const sentenceBox = document.createElement('div');
  sentenceBox.className = 'word-bank-sentence';
  const placeholder = document.createElement('span');
  placeholder.className = 'word-bank-placeholder';
  placeholder.textContent = 'Tap words to build the sentence';
  sentenceBox.appendChild(placeholder);

  const divider = document.createElement('div');
  divider.className = 'word-bank-divider';

  const pool = document.createElement('div');
  pool.className = 'word-bank-pool';

  const chosen = []; // words in sentence

  const shuffled = shuffle(ex.wordBank);
  shuffled.forEach(word => {
    const tile = document.createElement('button');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.dataset.word = word;
    tile.addEventListener('click', () => {
      if (tile.classList.contains('used')) return;
      chosen.push(word);
      tile.classList.add('used');

      const sentTile = document.createElement('button');
      sentTile.className = 'word-tile in-sentence';
      sentTile.textContent = word;
      sentTile.addEventListener('click', () => {
        // remove from sentence
        const idx = chosen.indexOf(word);
        if (idx > -1) chosen.splice(idx, 1);
        sentTile.remove();
        tile.classList.remove('used');
        if (sentenceBox.querySelectorAll('.word-tile').length === 0) {
          sentenceBox.appendChild(placeholder);
        }
        enableCheck(chosen.length > 0);
        window._currentAnswer = [...chosen];
      });

      placeholder.remove();
      sentenceBox.appendChild(sentTile);
      enableCheck(chosen.length > 0);
      window._currentAnswer = [...chosen];
    });
    pool.appendChild(tile);
  });

  wrap.appendChild(sentenceBox);
  wrap.appendChild(divider);
  wrap.appendChild(pool);
  enableCheck(false);
  window._currentAnswer = [];
}

// Fill in the blank
function renderFillBlank(ex, wrap) {
  wrap.appendChild(header(ex, 'Fill in the Blank'));
  const parts = ex.sentence.split('___');
  const line = document.createElement('div');
  line.className = 'fill-blank-sentence';

  if (parts[0]) {
    const t = document.createElement('span');
    t.textContent = parts[0];
    line.appendChild(t);
  }
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'fill-blank-input';
  inp.placeholder = '___';
  inp.addEventListener('input', () => {
    enableCheck(inp.value.trim().length > 0);
    window._currentAnswer = inp.value.trim();
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inp.value.trim()) {
      document.getElementById('lesson-action-btn').click();
    }
  });
  line.appendChild(inp);

  if (parts[1]) {
    const t = document.createElement('span');
    t.textContent = parts[1];
    line.appendChild(t);
  }
  wrap.appendChild(line);

  if (ex.hint) {
    const hint = document.createElement('div');
    hint.className = 'exercise-hint';
    hint.textContent = `Hint: ${ex.hint}`;
    wrap.appendChild(hint);
  }

  enableCheck(false);
  window._currentAnswer = '';
  setTimeout(() => inp.focus(), 300);
}

// Matching
function renderMatching(ex, wrap) {
  wrap.appendChild(header(ex, 'Match the Pairs'));

  const grid = document.createElement('div');
  grid.className = 'matching-grid';
  const leftCol = document.createElement('div');
  leftCol.className = 'matching-column';
  const rightCol = document.createElement('div');
  rightCol.className = 'matching-column';

  const pairs = shuffle(ex.pairs);
  const leftItems = pairs.map(p => p.gl);
  const rightItems = shuffle(pairs.map(p => p.en));

  let selectedLeft = null;
  let matched = 0;
  const total = pairs.length;

  function makeItem(text, isLeft) {
    const btn = document.createElement('button');
    btn.className = 'matching-item' + (isLeft ? ' galician' : '');
    btn.textContent = text;
    btn.dataset.value = text;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched')) return;

      if (isLeft) {
        document.querySelectorAll('.matching-item').forEach(b => {
          if (!b.classList.contains('matched')) b.classList.remove('selected');
        });
        selectedLeft = text;
        btn.classList.add('selected');
      } else {
        if (!selectedLeft) return;
        // check match
        const pair = pairs.find(p => p.gl === selectedLeft);
        if (pair && pair.en === text) {
          // correct
          matched++;
          document.querySelectorAll('.matching-item').forEach(b => {
            if (b.dataset.value === selectedLeft || b.dataset.value === text) {
              b.classList.remove('selected', 'wrong');
              b.classList.add('matched');
            }
          });
          selectedLeft = null;
          if (matched === total) {
            window._currentAnswer = '__matching_done__';
            enableCheck(true);
          }
        } else {
          // wrong flash
          btn.classList.add('wrong');
          const leftBtn = document.querySelector(`.matching-item.galician[data-value="${selectedLeft}"]`);
          if (leftBtn) leftBtn.classList.add('wrong');
          setTimeout(() => {
            btn.classList.remove('wrong', 'selected');
            if (leftBtn) leftBtn.classList.remove('wrong', 'selected');
            selectedLeft = null;
          }, 700);
        }
      }
    });
    return btn;
  }

  leftItems.forEach(t => leftCol.appendChild(makeItem(t, true)));
  rightItems.forEach(t => rightCol.appendChild(makeItem(t, false)));
  grid.appendChild(leftCol);
  grid.appendChild(rightCol);
  wrap.appendChild(grid);

  enableCheck(false);
  window._currentAnswer = null;
}

// Listening
function renderListening(ex, wrap) {
  const hdr = document.createElement('div');
  hdr.className = 'exercise-header';
  hdr.innerHTML = `<div class="exercise-type-label">Listening</div>
    <div class="exercise-prompt">${ex.prompt}</div>`;
  wrap.appendChild(hdr);

  const section = document.createElement('div');
  section.className = 'listening-exercise';

  const bigBtn = document.createElement('button');
  bigBtn.className = 'listening-speaker-btn';
  bigBtn.setAttribute('aria-label', 'Play audio');
  bigBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
  bigBtn.addEventListener('click', () => {
    bigBtn.classList.add('playing');
    speak(ex.audio, null, () => bigBtn.classList.remove('playing'));
  });

  const hint = document.createElement('div');
  hint.className = 'listening-hint';
  hint.textContent = 'Tap the speaker, then type what you hear';

  const inputArea = document.createElement('div');
  inputArea.className = 'listening-input-area translate-input-area';
  const ta = document.createElement('textarea');
  ta.className = 'translate-textarea';
  ta.placeholder = 'Type what you hear…';
  ta.rows = 2;
  ta.addEventListener('input', () => {
    enableCheck(ta.value.trim().length > 0);
    window._currentAnswer = ta.value.trim();
  });
  inputArea.appendChild(ta);

  section.appendChild(bigBtn);
  section.appendChild(hint);
  section.appendChild(inputArea);
  wrap.appendChild(section);

  enableCheck(false);
  window._currentAnswer = '';
  // Auto-play on load
  setTimeout(() => {
    bigBtn.classList.add('playing');
    speak(ex.audio, null, () => bigBtn.classList.remove('playing'));
  }, 500);
}

// ── Mark answer correct/incorrect visually ─────────────────────
export function showAnswerFeedback(isCorrect, exercise) {
  const container = document.getElementById('exercise-container');
  const ex = exercise || (_state ? _state.exercises[_state.index] : null);
  if (!ex) return;

  if (ex.type === 'multiple_choice') {
    container.querySelectorAll('.mc-option').forEach(btn => {
      if (btn.textContent === ex.correctAnswer) btn.classList.add('correct');
      else if (btn.classList.contains('selected') && !isCorrect) btn.classList.add('incorrect');
      btn.disabled = true;
    });
  }

  if (ex.type === 'translate_type' || ex.type === 'listening') {
    const ta = container.querySelector('.translate-textarea');
    if (ta) { ta.classList.add(isCorrect ? 'correct' : 'incorrect'); ta.disabled = true; }
  }

  if (ex.type === 'fill_blank') {
    const inp = container.querySelector('.fill-blank-input');
    if (inp) { inp.classList.add(isCorrect ? 'correct' : 'incorrect'); inp.disabled = true; }
  }
}
