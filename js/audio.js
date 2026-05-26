// =====================================================
// GALEGO — Audio / TTS Wrapper
// Web Speech API with iOS Safari handling
// =====================================================

let _synth = null;
let _isPlaying = false;
let _preferredVoice = null;

function _getSynth() {
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis || null;
}

function _findBestVoice(synth) {
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  // Priority order: Galician > Portuguese (closest phonetically) > Spanish
  const priority = ['gl', 'pt-PT', 'pt-BR', 'pt', 'es-ES', 'es'];

  for (const lang of priority) {
    const voice = voices.find(v =>
      v.lang.toLowerCase().startsWith(lang.toLowerCase())
    );
    if (voice) return voice;
  }

  return voices[0]; // fallback to any available
}

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isPlaying() {
  return _isPlaying;
}

async function _loadVoices() {
  const synth = _getSynth();
  if (!synth) return;

  // iOS Safari loads voices asynchronously
  return new Promise((resolve) => {
    let voices = synth.getVoices();
    if (voices.length > 0) {
      _preferredVoice = _findBestVoice(synth);
      resolve();
      return;
    }

    const handler = () => {
      voices = synth.getVoices();
      if (voices.length > 0) {
        _preferredVoice = _findBestVoice(synth);
        synth.removeEventListener('voiceschanged', handler);
        resolve();
      }
    };
    synth.addEventListener('voiceschanged', handler);

    // Timeout fallback — 2s
    setTimeout(resolve, 2000);
  });
}

export async function init() {
  if (!isSupported()) return;
  _synth = _getSynth();
  await _loadVoices();
}

/**
 * Speak text using TTS.
 * @param {string} text - Text to speak
 * @param {Function} [onStart] - Called when speech starts
 * @param {Function} [onEnd] - Called when speech ends
 */
export function speak(text, onStart, onEnd) {
  if (!isSupported()) {
    if (onEnd) onEnd();
    return;
  }

  const synth = _getSynth();
  if (!synth) return;

  // Cancel any ongoing speech
  synth.cancel();
  _isPlaying = false;

  const utterance = new SpeechSynthesisUtterance(text);

  // Language: try Galician, fall back to Portuguese
  utterance.lang = _preferredVoice?.lang || 'pt-PT';

  if (_preferredVoice) {
    utterance.voice = _preferredVoice;
  }

  // Tuned for language learning (slower, clear)
  utterance.rate = 0.82;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  utterance.onstart = () => {
    _isPlaying = true;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    _isPlaying = false;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    _isPlaying = false;
    if (onEnd) onEnd();
    // 'interrupted' errors are expected when cancelling
    if (e.error !== 'interrupted') {
      console.warn('TTS error:', e.error);
    }
  };

  synth.speak(utterance);
}

export function stop() {
  const synth = _getSynth();
  if (synth) {
    synth.cancel();
    _isPlaying = false;
  }
}

export function getVoiceInfo() {
  if (!_preferredVoice) return null;
  return {
    name: _preferredVoice.name,
    lang: _preferredVoice.lang,
  };
}
