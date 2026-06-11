// Galego — Exercise Engine
import { getLessonExercises } from './data/exercises.js';
import { flyFrom, burst } from './fx.js';

// TTS stub — wire up a real speak(text) implementation here when ready.
// See js/audio.js for the Web Speech API skeleton (or swap in a WASM engine).
// eslint-disable-next-line no-unused-vars
function speak(_text, _onStart, _onEnd) { if (_onEnd) _onEnd(); }

let _state = null; // { exercises, index, correct, wrong[], answers }
let _onComplete = null;

// ── Contraction expansion table ────────────────────────────────
const CONTRACTIONS = [
  [/\bi'm\b/g, 'i am'],
  [/\byou're\b/g, 'you are'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\bit's\b/g, 'it is'],
  [/\bwe're\b/g, 'we are'],
  [/\bthey're\b/g, 'they are'],
  [/\bdon't\b/g, 'do not'],
  [/\bdoesn't\b/g, 'does not'],
  [/\bdidn't\b/g, 'did not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bwon't\b/g, 'will not'],
  [/\bisn't\b/g, 'is not'],
  [/\baren't\b/g, 'are not'],
  [/\bwasn't\b/g, 'was not'],
  [/\bweren't\b/g, 'were not'],
  [/\blet's\b/g, 'let us'],
  [/\bthat's\b/g, 'that is'],
  [/\bthere's\b/g, 'there is'],
  [/\bwhat's\b/g, 'what is'],
  [/\bwho's\b/g, 'who is'],
  [/\bhaven't\b/g, 'have not'],
  [/\bhasn't\b/g, 'has not'],
  [/\bwouldn't\b/g, 'would not'],
  [/\bcouldn't\b/g, 'could not'],
  [/\bshouldn't\b/g, 'should not'],
  [/\bi've\b/g, 'i have'],
  [/\byou've\b/g, 'you have'],
  [/\bwe've\b/g, 'we have'],
  [/\bthey've\b/g, 'they have'],
  [/\bi'll\b/g, 'i will'],
  [/\byou'll\b/g, 'you will'],
  [/\bhe'll\b/g, 'he will'],
  [/\bshe'll\b/g, 'she will'],
  [/\bit'll\b/g, 'it will'],
  [/\bwe'll\b/g, 'we will'],
  [/\bthey'll\b/g, 'they will'],
  [/\bi'd\b/g, 'i would'],
  [/\byou'd\b/g, 'you would'],
  [/\bhe'd\b/g, 'he would'],
  [/\bshe'd\b/g, 'she would'],
  [/\bwe'd\b/g, 'we would'],
  [/\bthey'd\b/g, 'they would'],
];

// ── Normalise answers ──────────────────────────────────────────
function normalise(str) {
  let s = str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip accents
    .toLowerCase().trim()
    .replace(/[`\u2018\u2019\u2019]/g, "'")              // normalise apostrophes
    .replace(/\s+/g, ' ')
    .replace(/[¿¡]/g, '')
    .replace(/[.!?,;:]/g, '');

  // Expand contractions so "you're" and "you are" compare equal
  for (const [pattern, replacement] of CONTRACTIONS) {
    s = s.replace(pattern, replacement);
  }

  return s;
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
  return div;
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
      grid.querySelectorAll('.mc-option').forEach(b => b.classList.remove('selected'));
      selected = opt;
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
  // The English sentence to translate lives in ex.sentence; ex.prompt is just a label.
  const promptDiv = document.createElement('div');
  promptDiv.className = 'exercise-header';
  promptDiv.innerHTML = `<div class="exercise-type-label">Build the Sentence</div>
    <div class="exercise-prompt">${ex.sentence || ex.prompt}</div>`;
  wrap.appendChild(promptDiv);
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

  const chosen = []; // sentTiles in order

  function syncAnswer() {
    window._currentAnswer = chosen.map(t => t.dataset.word);
    enableCheck(chosen.length > 0);
  }

  function removeSentTile(sentTile) {
    const fromRect = sentTile.getBoundingClientRect();
    const idx = chosen.indexOf(sentTile);
    if (idx > -1) chosen.splice(idx, 1);
    sentTile.remove();
    sentTile._poolTile.classList.remove('used');
    // FLIP: the pool tile flies back from where the sentence tile was
    flyFrom(sentTile._poolTile, fromRect);
    if (sentenceBox.querySelectorAll('.word-tile').length === 0) {
      sentenceBox.appendChild(placeholder);
    }
    syncAnswer();
  }

  function makeSentTile(word, poolTile) {
    const sentTile = document.createElement('button');
    sentTile.className = 'word-tile in-sentence';
    sentTile.textContent = word;
    sentTile.dataset.word = word;
    sentTile._poolTile = poolTile;

    // ── tap to remove ──────────────────────────────────────────
    sentTile.addEventListener('click', () => {
      if (sentTile._dragged) return; // swallow click after a drag
      removeSentTile(sentTile);
    });

    // ── drag to reorder (pointer events, works mouse + touch) ──
    sentTile.addEventListener('pointerdown', e => {
      if (e.button !== undefined && e.button !== 0) return;
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      let dragging = false;
      let ghost = null;
      sentTile._dragged = false;

      const DRAG_THRESHOLD = 6; // px before we commit to drag

      function startDrag() {
        dragging = true;
        sentTile._dragged = true;
        sentTile.setPointerCapture(e.pointerId);
        sentTile.classList.add('dragging');

        ghost = document.createElement('div');
        ghost.className = 'word-tile drag-ghost';
        ghost.textContent = word;
        const r = sentTile.getBoundingClientRect();
        ghost.style.cssText = `width:${r.width}px;height:${r.height}px;top:${r.top + window.scrollY}px;left:${r.left}px;`;
        document.body.appendChild(ghost);
      }

      function onMove(ev) {
        if (!dragging) {
          if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > DRAG_THRESHOLD) startDrag();
          return;
        }
        const r = sentTile.getBoundingClientRect();
        ghost.style.top  = (ev.clientY - r.height / 2 + window.scrollY) + 'px';
        ghost.style.left = (ev.clientX - r.width  / 2) + 'px';

        // find tile under cursor (ignore ghost + dragged tile)
        ghost.style.pointerEvents = 'none';
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        ghost.style.pointerEvents = '';

        const target = under && under.closest('.word-tile.in-sentence');
        sentenceBox.querySelectorAll('.word-tile.in-sentence').forEach(t => t.classList.remove('drag-over'));
        if (target && target !== sentTile) target.classList.add('drag-over');
      }

      function onUp(ev) {
        sentTile.removeEventListener('pointermove', onMove);
        sentTile.removeEventListener('pointerup', onUp);
        sentTile.removeEventListener('pointercancel', onUp);

        if (!dragging) return;
        dragging = false;
        sentTile.classList.remove('dragging');
        if (ghost) { ghost.remove(); ghost = null; }
        sentenceBox.querySelectorAll('.drag-over').forEach(t => t.classList.remove('drag-over'));

        ghost && ghost.remove();
        ghost = null;

        // find drop target
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        const target = under && under.closest('.word-tile.in-sentence');
        if (target && target !== sentTile) {
          // swap in chosen array
          const aIdx = chosen.indexOf(sentTile);
          const bIdx = chosen.indexOf(target);
          if (aIdx > -1 && bIdx > -1) {
            [chosen[aIdx], chosen[bIdx]] = [chosen[bIdx], chosen[aIdx]];
            // swap in DOM
            const aNext = sentTile.nextSibling;
            const bNext = target.nextSibling;
            if (aNext === target) {
              sentenceBox.insertBefore(target, sentTile);
            } else if (bNext === sentTile) {
              sentenceBox.insertBefore(sentTile, target);
            } else {
              sentenceBox.insertBefore(target, aNext);
              sentenceBox.insertBefore(sentTile, bNext);
            }
            syncAnswer();
          }
        }

        // reset _dragged flag after the click event fires
        setTimeout(() => { sentTile._dragged = false; }, 0);
      }

      sentTile.addEventListener('pointermove', onMove);
      sentTile.addEventListener('pointerup', onUp);
      sentTile.addEventListener('pointercancel', onUp);
    });

    return sentTile;
  }

  const shuffled = shuffle(ex.wordBank);
  shuffled.forEach(word => {
    const tile = document.createElement('button');
    tile.className = 'word-tile';
    tile.textContent = word;
    tile.dataset.word = word;
    tile.addEventListener('click', () => {
      if (tile.classList.contains('used')) return;
      const fromRect = tile.getBoundingClientRect();
      tile.classList.add('used');
      const sentTile = makeSentTile(word, tile);
      // each placed tile settles at its own slight tilt — real weight
      sentTile.style.setProperty('--tile-tilt', `${(Math.random() * 4 - 2).toFixed(1)}deg`);
      placeholder.remove();
      chosen.push(sentTile);
      sentenceBox.appendChild(sentTile);
      // FLIP: spring-fly from the pool slot into the sentence
      flyFrom(sentTile, fromRect);
      syncAnswer();
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

  // selection state: track which side + value is selected
  let selectedSide = null; // 'left' or 'right'
  let selectedValue = null;
  let matched = 0;
  const total = pairs.length;

  function clearSelection() {
    grid.querySelectorAll('.matching-item:not(.matched)').forEach(b => b.classList.remove('selected'));
    selectedSide = null;
    selectedValue = null;
  }

  function tryMatch(leftVal, rightVal) {
    const pair = pairs.find(p => p.gl === leftVal);
    if (pair && pair.en === rightVal) {
      matched++;
      grid.querySelectorAll('.matching-item').forEach(b => {
        if (b.dataset.value === leftVal || b.dataset.value === rightVal) {
          b.classList.remove('selected', 'wrong');
          b.classList.add('matched');
          // tiny celebratory pop at each matched tile
          const r = b.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, { count: 7, speed: 170 });
        }
      });
      clearSelection();
      if (matched === total) {
        window._currentAnswer = '__matching_done__';
        enableCheck(true);
      }
    } else {
      const leftBtn = grid.querySelector(`.matching-item.galician[data-value="${CSS.escape(leftVal)}"]`);
      const rightBtn = grid.querySelector(`.matching-item:not(.galician)[data-value="${CSS.escape(rightVal)}"]`);
      if (leftBtn) leftBtn.classList.add('wrong');
      if (rightBtn) rightBtn.classList.add('wrong');
      setTimeout(() => {
        if (leftBtn) leftBtn.classList.remove('wrong', 'selected');
        if (rightBtn) rightBtn.classList.remove('wrong', 'selected');
        clearSelection();
      }, 700);
    }
  }

  function makeItem(text, isLeft) {
    const btn = document.createElement('button');
    btn.className = 'matching-item' + (isLeft ? ' galician' : '');
    btn.textContent = text;
    btn.dataset.value = text;
    btn.addEventListener('click', () => {
      if (btn.classList.contains('matched')) return;

      const thisSide = isLeft ? 'left' : 'right';

      if (selectedSide === null) {
        // nothing selected yet — select this item
        selectedSide = thisSide;
        selectedValue = text;
        btn.classList.add('selected');
      } else if (selectedSide === thisSide) {
        // same side clicked — switch selection
        clearSelection();
        selectedSide = thisSide;
        selectedValue = text;
        btn.classList.add('selected');
      } else {
        // opposite side clicked — attempt match
        const leftVal  = isLeft ? text : selectedValue;
        const rightVal = isLeft ? selectedValue : text;
        tryMatch(leftVal, rightVal);
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

// Listening — rendered as a translation exercise until TTS is available.
// When a real speak() is wired in, restore the speaker UI here.
function renderListening(ex, wrap) {
  const translateEx = {
    ...ex,
    type: 'translate_type',
    prompt: ex.sentence ? 'Translate to Galician:' : ex.prompt,
    sourceText: ex.sentence || ex.audio,
  };
  renderTranslate(translateEx, wrap);
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
