/* =====================================================
   GALEGO — Haptics
   Thin wrapper over the Vibration API with named,
   tasteful patterns. No-ops gracefully where unsupported
   (iOS Safari has no Vibration API — we degrade silently).
   ===================================================== */

const supported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

// User can opt out; respect the reduced-motion preference too.
let enabled = true;
try {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    enabled = false;
  }
} catch (_) {}

const PATTERNS = {
  light:    8,         // taps, typing, small selections
  medium:   16,        // primary button press, check
  select:   [0, 10],   // choosing an option / tile
  success:  [0, 14, 40, 22],   // correct answer — quick double
  error:    [0, 30, 60, 30],   // wrong answer — heavier double
  nearMiss: [0, 12, 30, 12],   // almost — gentle nudge
  complete: [0, 18, 50, 18, 50, 28], // lesson finished — celebratory
};

function fire(name) {
  if (!supported || !enabled) return;
  const p = PATTERNS[name];
  if (p == null) return;
  try { navigator.vibrate(p); } catch (_) {}
}

export const haptics = {
  light:    () => fire('light'),
  medium:   () => fire('medium'),
  select:   () => fire('select'),
  success:  () => fire('success'),
  error:    () => fire('error'),
  nearMiss: () => fire('nearMiss'),
  complete: () => fire('complete'),
  setEnabled(v) { enabled = !!v; },
  get isSupported() { return supported; },
};

/* Global press feedback via event delegation — every interactive
   surface gets a light tick on pointer-down without per-handler wiring.
   Uses pointerdown so it fires the instant a finger touches (pre-click). */
export function installGlobalHaptics() {
  if (!supported) return;
  const SELECTOR = [
    '.btn', '.mc-option', '.word-tile', '.matching-item',
    '.unit-card', '.lesson-dot', '.audio-btn', '.listening-speaker-btn',
    '.top-bar-btn', '.settings-btn', '.context-menu-item', '.grammar-card-header',
  ].join(',');

  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest && e.target.closest(SELECTOR);
    if (!el) return;
    if (el.disabled || el.classList.contains('locked')) return;
    // Primary CTAs get a slightly meatier tick than incidental controls.
    if (el.classList.contains('btn-primary')) haptics.medium();
    else haptics.light();
  }, { passive: true });
}
