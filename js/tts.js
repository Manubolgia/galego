// eSpeak-ng WASM TTS — Galician native voice
// Falls back gracefully; never throws.

import ESpeakNG from '../vendor/espeak/espeak-ng.js';

const LOCATE = (filename) => `../vendor/espeak/${filename}`;

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
  const espeak = await ESpeakNG({
    arguments: ['-v', 'gl', '-w', '/out.wav', '--', text],
    locateFile: LOCATE,
    print: () => {},
    printErr: () => {},
  });
  return espeak.FS.readFile('/out.wav');
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
    _broken = true;
    reject(e);
  } finally {
    _currentSource = null;
    _playing = false;
    // Drain remaining queue with errors if WASM proved broken
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
