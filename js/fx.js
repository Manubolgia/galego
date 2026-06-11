// Galego — FX Engine
// Springs, canvas particle physics (confetti / bursts), ripples, screen
// flashes and a View Transitions wrapper. Zero dependencies, all
// feature-detected, all silent under prefers-reduced-motion.

// ── Feature detection ──────────────────────────────────────────
export const FEATURES = {
  viewTransitions: typeof document !== 'undefined' && 'startViewTransition' in document,
  vibrate: typeof navigator !== 'undefined' && 'vibrate' in navigator,
  gyro: typeof DeviceOrientationEvent !== 'undefined',
};

let _rmQuery = null;
export function prefersReducedMotion() {
  try {
    if (!_rmQuery) _rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return _rmQuery.matches;
  } catch (_) { return false; }
}

// ── Spring physics ─────────────────────────────────────────────
// Damped harmonic oscillator integrated per-frame. damping ~12 gives a
// pleasant overshoot; ~20 is critically damped.
export function animateSpring({ from = 0, to = 1, stiffness = 140, damping = 13, mass = 1, onUpdate, onComplete }) {
  if (prefersReducedMotion()) {
    onUpdate && onUpdate(to);
    onComplete && onComplete();
    return () => {};
  }
  let x = from, v = 0, last = performance.now(), raf = 0, done = false;
  function step(now) {
    const dt = Math.min(0.064, (now - last) / 1000) || 0.016;
    last = now;
    const F = -stiffness * (x - to) - damping * v;
    v += (F / mass) * dt;
    x += v * dt;
    if (Math.abs(x - to) < 0.0015 * Math.max(1, Math.abs(to)) && Math.abs(v) < 0.01) {
      done = true;
      onUpdate && onUpdate(to);
      onComplete && onComplete();
      return;
    }
    onUpdate && onUpdate(x);
    raf = requestAnimationFrame(step);
  }
  raf = requestAnimationFrame(step);
  return () => { if (!done) cancelAnimationFrame(raf); };
}

// Spring-eased number count-up bound to an element's textContent.
export function springCount(el, target, { format = (v) => String(Math.round(v)), stiffness = 60, damping = 14 } = {}) {
  if (!el) return () => {};
  return animateSpring({
    from: 0, to: target, stiffness, damping,
    onUpdate: (v) => { el.textContent = format(Math.max(0, v)); },
  });
}

// ── Shared FX canvas (bursts + confetti) ───────────────────────
// One lazily-created full-viewport canvas; the rAF loop only runs while
// particles are alive, so idle cost is zero.
let _canvas = null, _ctx = null, _particles = [], _running = false, _dpr = 1;

function ensureCanvas() {
  if (_canvas) return;
  _canvas = document.createElement('canvas');
  _canvas.id = 'fx-canvas';
  _canvas.setAttribute('aria-hidden', 'true');
  _canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:250;';
  document.body.appendChild(_canvas);
  _ctx = _canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) _particles.length = 0; // drop FX when backgrounded
  });
}

function resizeCanvas() {
  if (!_canvas) return;
  _dpr = Math.min(2, window.devicePixelRatio || 1);
  _canvas.width = Math.floor(window.innerWidth * _dpr);
  _canvas.height = Math.floor(window.innerHeight * _dpr);
}

let _lastTick = 0;
function tick(now) {
  if (!_particles.length) {
    _running = false;
    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
    return;
  }
  const dt = Math.min(0.05, (now - _lastTick) / 1000) || 0.016;
  _lastTick = now;
  const W = _canvas.width, H = _canvas.height;
  _ctx.clearRect(0, 0, W, H);

  for (let i = _particles.length - 1; i >= 0; i--) {
    const p = _particles[i];
    p.life -= dt;
    // physics: gravity, quadratic-ish drag, rotation, flutter
    p.vy += p.gravity * dt;
    p.vx *= Math.pow(p.drag, dt * 60);
    p.vy *= Math.pow(p.dragY ?? p.drag, dt * 60);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.flutter) {
      p.phase += dt * p.flutterSpeed;
      p.x += Math.sin(p.phase) * p.flutter * dt * 60;
    }
    if (p.life <= 0 || p.y * 1 > H / _dpr + 40) { _particles.splice(i, 1); continue; }

    const alpha = p.fade ? Math.min(1, p.life / p.fade) : 1;
    _ctx.save();
    _ctx.globalAlpha = alpha;
    _ctx.translate(p.x * _dpr, p.y * _dpr);
    _ctx.rotate(p.rot);
    _ctx.fillStyle = p.color;
    if (p.shape === 'rect') {
      // simulate 3D tumble by squashing on a wobble phase
      const squash = p.flutter ? (0.35 + 0.65 * Math.abs(Math.cos(p.phase * 0.7))) : 1;
      _ctx.fillRect(-p.w / 2 * _dpr, -p.h / 2 * squash * _dpr, p.w * _dpr, p.h * squash * _dpr);
    } else {
      _ctx.beginPath();
      _ctx.arc(0, 0, p.r * _dpr, 0, Math.PI * 2);
      _ctx.fill();
    }
    _ctx.restore();
  }
  requestAnimationFrame(tick);
}

function startLoop() {
  if (_running) return;
  _running = true;
  _lastTick = performance.now();
  requestAnimationFrame(tick);
}

const AQUA_PALETTE = ['#4fc3d4', '#86d0e0', '#4fc28b', '#e0a548', '#c9ecf2', '#3a9ca8'];

// Radial particle burst at viewport coords (CSS px).
export function burst(x, y, { count = 18, colors = AQUA_PALETTE, speed = 320, spread = Math.PI * 2, angle = -Math.PI / 2, gravity = 760 } = {}) {
  if (prefersReducedMotion()) return;
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread;
    const s = speed * (0.35 + Math.random() * 0.85);
    _particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      gravity,
      drag: 0.965,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 10,
      shape: Math.random() < 0.55 ? 'circle' : 'rect',
      r: 2 + Math.random() * 3,
      w: 5 + Math.random() * 4, h: 4 + Math.random() * 4,
      color: colors[(Math.random() * colors.length) | 0],
      life: 0.55 + Math.random() * 0.55,
      fade: 0.3,
      flutter: 0, phase: 0, flutterSpeed: 0,
    });
  }
  startLoop();
}

// Full celebration: two corner cannons firing upward + a brief top rain.
export function confetti({ count = 110, colors = AQUA_PALETTE } = {}) {
  if (prefersReducedMotion()) return;
  ensureCanvas();
  const W = window.innerWidth, H = window.innerHeight;
  const cannon = (cx, cy, dir, n) => {
    for (let i = 0; i < n; i++) {
      const a = dir + (Math.random() - 0.5) * 0.9;
      const s = 620 + Math.random() * 520;
      _particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        gravity: 820,
        drag: 0.94, dragY: 0.985,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 14,
        shape: 'rect',
        w: 7 + Math.random() * 5, h: 10 + Math.random() * 6,
        r: 3,
        color: colors[(Math.random() * colors.length) | 0],
        life: 2.6 + Math.random() * 1.6,
        fade: 0.5,
        flutter: 1.2 + Math.random() * 1.6,
        flutterSpeed: 6 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
      });
    }
  };
  cannon(W * 0.06, H * 0.78, -Math.PI / 2 + 0.45, count * 0.4);
  cannon(W * 0.94, H * 0.78, -Math.PI / 2 - 0.45, count * 0.4);
  // gentle rain from the top, slightly delayed
  setTimeout(() => {
    for (let i = 0; i < count * 0.2; i++) {
      _particles.push({
        x: Math.random() * W, y: -14,
        vx: (Math.random() - 0.5) * 60,
        vy: 60 + Math.random() * 120,
        gravity: 500,
        drag: 0.99, dragY: 0.99,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 10,
        shape: 'rect',
        w: 7 + Math.random() * 5, h: 10 + Math.random() * 6,
        r: 3,
        color: colors[(Math.random() * colors.length) | 0],
        life: 3.4 + Math.random() * 1.2,
        fade: 0.5,
        flutter: 1.4 + Math.random() * 1.4,
        flutterSpeed: 5 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    startLoop();
  }, 260);
  startLoop();
}

// ── DOM micro-FX ───────────────────────────────────────────────

// Expanding wave ring emitted from an element's center.
export function ripple(el, { color = 'hsla(162, 50%, 50%, 0.35)' } = {}) {
  if (prefersReducedMotion() || !el) return;
  const r = el.getBoundingClientRect();
  const ring = document.createElement('div');
  ring.className = 'fx-ripple';
  ring.style.left = `${r.left + r.width / 2}px`;
  ring.style.top = `${r.top + r.height / 2}px`;
  ring.style.setProperty('--fx-ripple-color', color);
  document.body.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove());
  setTimeout(() => ring.remove(), 1200); // safety
}

// Brief full-screen tint flash (wrong answers).
export function flash(color = 'hsla(6, 62%, 52%, 0.16)') {
  if (prefersReducedMotion()) return;
  const f = document.createElement('div');
  f.className = 'fx-flash';
  f.style.background = color;
  document.body.appendChild(f);
  f.addEventListener('animationend', () => f.remove());
  setTimeout(() => f.remove(), 700);
}

// Jagged crack overlay drawn over an element (wrong answers).
export function crack(el) {
  if (prefersReducedMotion() || !el) return;
  const r = el.getBoundingClientRect();
  const wrap = document.createElement('div');
  wrap.className = 'fx-crack';
  wrap.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
  const w = r.width, h = r.height;
  // jagged lightning path from top edge to bottom edge through the middle
  let x = w * (0.35 + Math.random() * 0.3), y = 0;
  let d = `M ${x.toFixed(1)} 0`;
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    x += (Math.random() - 0.5) * w * 0.3;
    x = Math.max(w * 0.1, Math.min(w * 0.9, x));
    y = (h / steps) * i;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  wrap.innerHTML =
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
       <path d="${d}" pathLength="100"/>
     </svg>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('animationend', () => wrap.remove());
  setTimeout(() => wrap.remove(), 1000);
}

// FLIP helper — fly an element from a previous rect to its current spot.
export function flyFrom(el, fromRect, { duration = 420 } = {}) {
  if (prefersReducedMotion() || !el || !el.animate) return;
  const to = el.getBoundingClientRect();
  const dx = fromRect.left - to.left;
  const dy = fromRect.top - to.top;
  if (!dx && !dy) return;
  el.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(1.06)` },
      { transform: 'translate(0, 0) scale(1)' },
    ],
    { duration, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
  );
}

// ── View Transitions wrapper ───────────────────────────────────
// Wraps a DOM update in document.startViewTransition when available.
// `bloomFrom: {x, y}` reveals the new screen as a circle expanding from
// the tap point. Falls back to calling update() directly.
export async function screenTransition(update, { bloomFrom = null } = {}) {
  if (!FEATURES.viewTransitions || prefersReducedMotion()) {
    update();
    return;
  }
  const root = document.documentElement;
  if (bloomFrom) root.classList.add('vt-bloom');
  let vt;
  try {
    vt = document.startViewTransition(update);
  } catch (_) {
    root.classList.remove('vt-bloom');
    update();
    return;
  }
  if (bloomFrom) {
    vt.ready.then(() => {
      const { x, y } = bloomFrom;
      const r = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      try {
        root.animate(
          { clipPath: [`circle(26px at ${x}px ${y}px)`, `circle(${r * 1.05}px at ${x}px ${y}px)`] },
          {
            duration: 520,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      } catch (_) { /* pseudoElement animation unsupported — crossfade still runs */ }
    }).catch(() => {});
  }
  vt.finished.finally(() => root.classList.remove('vt-bloom'));
  return vt;
}
