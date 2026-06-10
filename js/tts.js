// eSpeak-ng WASM TTS — Galician native voice
// Falls back gracefully; never throws.

import ESpeakNG from '../vendor/espeak/espeak-ng.js';

// Resolve vendor assets relative to THIS module's URL so it works regardless of
// the deployment base path (e.g. GitHub Pages project subpath /galego/).
// tts.js lives at <base>/js/tts.js → WASM is at <base>/vendor/espeak/<file>.
const LOCATE = (filename) => new URL(`../vendor/espeak/${filename}`, import.meta.url).href;

let _audioCtx = null;
let _broken = false; // latched true after the first WASM failure

// Playback queue: {text, resolve, reject} processed one at a time
const _queue = [];
let _playing = false;
let _currentSource = null; // AudioBufferSourceNode, kept for cancel()

function _getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

// Each call to ESpeakNG() instantiates the WASM, runs main(), and exits —
// the intended usage pattern per the espeak-ng npm package.
async function _synthesise(text) {
  let stderr = '';
  const espeak = await ESpeakNG({
    arguments: ['-v', 'gl', '-w', '/out.wav', '--', text],
    locateFile: LOCATE,
    print: (line) => console.log('[espeak]', line),
    printErr: (line) => { stderr += line + '\n'; console.warn('[espeak:err]', line); },
  });
  let wav;
  try {
    wav = espeak.FS.readFile('/out.wav');
  } catch (e) {
    throw new Error('eSpeak produced no output. stderr:\n' + stderr);
  }
  if (!wav || wav.byteLength <= 44) {
    // 44 bytes = WAV header only, no audio samples
    throw new Error('eSpeak output empty (' + (wav ? wav.byteLength : 0) + ' bytes). stderr:\n' + stderr);
  }
  console.log('[espeak] synthesised', wav.byteLength, 'bytes for:', text);
  return wav;
}

async function _decodeAndPlay(wavBytes) {
  const ctx = _getAudioCtx();
  if (ctx.state === 'suspended') await ctx.resume();

  const audioBuffer = await ctx.decodeAudioData(
    wavBytes.buffer.slice(wavBytes.byteOffset, wavBytes.byteOffset + wavBytes.byteLength)
  );

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  _currentSource = source;

  await new Promise((res) => {
    source.onended = res;
    source.start(0);
  });
}

async function _playNext() {
  if (_playing || _queue.length === 0) return;
  const { text, resolve, reject } = _queue.shift();
  _playing = true;

  try {
    const wavBytes = await _synthesise(text);
    await _decodeAndPlay(wavBytes);
    resolve();
  } catch (e) {
    console.error('[espeak] synthesis failed:', e);
    // Only latch as permanently broken if the WASM module itself can't load.
    // Per-utterance failures (bad voice arg, empty output) should not disable
    // eSpeak for the rest of the session.
    if (/locateFile|wasm|instantiate|fetch|import/i.test(String(e && e.message))) {
      _broken = true;
    }
    reject(e);
  } finally {
    _currentSource = null;
    _playing = false;
    if (_broken) {
      while (_queue.length) _queue.shift().reject(new Error('eSpeak unavailable'));
    } else {
      _playNext();
    }
  }
}

// Resolves when audio finishes; rejects on any error so the caller can fall back.
export function speak(text) {
  if (!text) return Promise.resolve();
  if (_broken) return Promise.reject(new Error('eSpeak unavailable'));
  return new Promise((resolve, reject) => {
    _queue.push({ text, resolve, reject });
    _playNext();
  });
}

export function cancel() {
  while (_queue.length) _queue.shift().reject(new Error('cancelled'));
  if (_currentSource) {
    try { _currentSource.stop(); } catch (_) {}
    _currentSource = null;
  }
  _playing = false;
}
