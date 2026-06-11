// Galego — The Camiño
// Home screen scene: a snaking river path through all units, with
// layered parallax (stars, orbs, rising particles), gyroscope tilt,
// scroll choreography and an ambient mood that warms as you learn.
// All vanilla, all feature-detected, cleans up after itself.

import { prefersReducedMotion, animateSpring, springCount } from './fx.js';
import { createMascot } from './mascot.js';

const NODE_SPACING = 168;
const TOP_PAD = 56;
const BOTTOM_PAD = 200;
const BANNER_GAP = 96;

// ── Mood: deep ocean night (0%) → Galician noon (100%) ─────────
const MOOD_NIGHT = {
  top:  [203, 42, 10], mid: [200, 30, 7], deep: [205, 38, 4],
  glow: [189, 60, 30, 0.16], accent: [189, 54, 43],
};
const MOOD_NOON = {
  top:  [193, 52, 19], mid: [194, 40, 12], deep: [201, 34, 8],
  glow: [40, 72, 52, 0.20], accent: [172, 56, 46],
};

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpHsl(a, b, t, alpha = false) {
  const h = lerp(a[0], b[0], t).toFixed(1);
  const s = lerp(a[1], b[1], t).toFixed(1);
  const l = lerp(a[2], b[2], t).toFixed(1);
  if (alpha) return `hsla(${h}, ${s}%, ${l}%, ${lerp(a[3], b[3], t).toFixed(3)})`;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function applyMood(el, pct) {
  const t = Math.max(0, Math.min(1, pct / 100));
  el.style.setProperty('--mood-top', lerpHsl(MOOD_NIGHT.top, MOOD_NOON.top, t));
  el.style.setProperty('--mood-mid', lerpHsl(MOOD_NIGHT.mid, MOOD_NOON.mid, t));
  el.style.setProperty('--mood-deep', lerpHsl(MOOD_NIGHT.deep, MOOD_NOON.deep, t));
  el.style.setProperty('--mood-glow', lerpHsl(MOOD_NIGHT.glow, MOOD_NOON.glow, t, true));
  el.style.setProperty('--mood-accent', lerpHsl(MOOD_NIGHT.accent, MOOD_NOON.accent, t));
}

// ── Scene state (singleton — one home screen at a time) ────────
let _cleanup = null;
let _gyro = { x: 0, y: 0, sx: 0, sy: 0, attached: false, asked: false };

function attachGyro() {
  if (_gyro.attached || prefersReducedMotion()) return;
  if (typeof DeviceOrientationEvent === 'undefined') return;
  const listen = () => {
    if (_gyro.attached) return;
    _gyro.attached = true;
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: left/right tilt, beta: front/back. Normalise to roughly -1..1
      _gyro.x = Math.max(-1, Math.min(1, e.gamma / 28));
      _gyro.y = Math.max(-1, Math.min(1, (e.beta - 42) / 28));
    }, { passive: true });
  };
  // iOS 13+ requires a user-gesture permission request
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    if (_gyro.asked) return;
    _gyro.asked = true;
    DeviceOrientationEvent.requestPermission()
      .then((res) => { if (res === 'granted') listen(); })
      .catch(() => {});
  } else {
    listen();
  }
}

// ── Star field generation (box-shadow batching — zero per-frame cost)
function makeStars(el, count, w, h, size, baseAlpha) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(Math.random() * w);
    const y = Math.round(Math.random() * h);
    const a = (baseAlpha * (0.4 + Math.random() * 0.6)).toFixed(2);
    shadows.push(`${x}px ${y}px 0 hsla(190, 60%, ${78 + Math.random() * 18 | 0}%, ${a})`);
  }
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.boxShadow = shadows.join(',');
}

/**
 * Render the path scene into the home screen.
 * opts: { course, getUnitProgress, isUnitRecommended, onUnitTap(unit, nodeEl, event), morphUnitId }
 * Returns a cleanup function.
 */
export function renderPathHome(screenEl, opts) {
  if (_cleanup) { _cleanup(); _cleanup = null; }

  const { course, getUnitProgress, isUnitRecommended, onUnitTap, morphUnitId = null } = opts;
  const reduced = prefersReducedMotion();

  const scene = screenEl.querySelector('#path-scene');
  const svg = screenEl.querySelector('#path-svg');
  const nodesLayer = screenEl.querySelector('#path-nodes');
  const sky = screenEl.querySelector('.home-sky');
  nodesLayer.innerHTML = '';

  // ── Progress + mood ──────────────────────────────────────────
  let lessonsDone = 0, lessonsTotal = 0;
  const unitProg = course.map((u) => {
    const p = getUnitProgress(u.id, course);
    lessonsDone += p.completed;
    lessonsTotal += p.total;
    return p;
  });
  const totalPct = lessonsTotal ? Math.round((lessonsDone / lessonsTotal) * 100) : 0;
  applyMood(screenEl, totalPct);

  // current = first unit that isn't fully complete
  let currentIdx = course.findIndex((_, i) => unitProg[i].percentage < 100);
  if (currentIdx === -1) currentIdx = course.length - 1;

  // ── Stats count-up ───────────────────────────────────────────
  const pctEl = screenEl.querySelector('#stat-pct');
  const lessonsEl = screenEl.querySelector('#stat-lessons');
  if (pctEl) springCount(pctEl, totalPct, { format: (v) => `${Math.min(totalPct, Math.round(v))}` });
  if (lessonsEl) springCount(lessonsEl, lessonsDone, { format: (v) => `${Math.min(lessonsDone, Math.round(v))}` });

  // ── Layout: snake geometry ───────────────────────────────────
  const w = scene.clientWidth || Math.min(600, window.innerWidth);
  const cx = w / 2;
  const amp = Math.min(w * 0.27, 118);

  const points = [];
  const banners = [];
  let y = TOP_PAD;
  let prevLevel = null;
  course.forEach((unit, i) => {
    if (unit.level !== prevLevel) {
      banners.push({ y: y + 14, level: unit.level });
      y += BANNER_GAP;
      prevLevel = unit.level;
    }
    const x = cx + amp * Math.sin(i * 1.9 + 0.6);
    points.push({ x, y, unit, i });
    y += NODE_SPACING;
  });
  const totalH = y - NODE_SPACING + BOTTOM_PAD;

  scene.style.height = `${totalH}px`;
  svg.setAttribute('viewBox', `0 0 ${w} ${totalH}`);
  svg.setAttribute('width', w);
  svg.setAttribute('height', totalH);

  // smooth vertical-tangent bezier through the nodes
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1], p1 = points[i];
    const k = (p1.y - p0.y) * 0.55;
    d += ` C ${p0.x.toFixed(1)} ${(p0.y + k).toFixed(1)}, ${p1.x.toFixed(1)} ${(p1.y - k).toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  svg.innerHTML = `
    <defs>
      <linearGradient id="path-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="hsl(189, 60%, 52%)"/>
        <stop offset="100%" stop-color="hsl(168, 52%, 46%)"/>
      </linearGradient>
    </defs>
    <path class="path-track" d="${d}"/>
    <path class="path-flow" d="${d}"/>
    <path class="path-ink" d="${d}" stroke="url(#path-grad)"/>`;

  const inkPath = svg.querySelector('.path-ink');
  const pathLen = inkPath.getTotalLength();
  inkPath.style.strokeDasharray = `${pathLen}`;
  inkPath.style.strokeDashoffset = `${pathLen}`;

  // length along the path at the current node (sampled)
  const samples = 320;
  let progressLen = pathLen;
  {
    const target = points[currentIdx];
    let best = Infinity;
    for (let s = 0; s <= samples; s++) {
      const L = (pathLen * s) / samples;
      const pt = inkPath.getPointAtLength(L);
      const dist = Math.hypot(pt.x - target.x, pt.y - target.y);
      if (dist < best) { best = dist; progressLen = L; }
    }
  }

  // ── Level banners ────────────────────────────────────────────
  const LEVEL_NAMES = { A1: 'First Steps', A2: 'Finding Your Voice', B1: 'Confident Speaker' };
  banners.forEach((b) => {
    const div = document.createElement('div');
    div.className = 'path-banner';
    div.style.top = `${b.y}px`;
    div.innerHTML = `<span class="pb-level">${b.level}</span><span class="pb-name">${LEVEL_NAMES[b.level] || ''}</span>`;
    nodesLayer.appendChild(div);
  });

  // ── Nodes ────────────────────────────────────────────────────
  const RING_C = 2 * Math.PI * 36; // r=36 in an 80×80 viewBox
  const nodeEls = [];
  let heroMascot = null;

  points.forEach(({ x, y: ny, unit, i }) => {
    const prog = unitProg[i];
    const pct = prog.percentage;
    const state = pct === 100 ? 'done' : i === currentIdx ? 'current' : pct > 0 ? 'started' : 'future';

    const node = document.createElement('button');
    node.className = `path-node st-${state}${reduced ? ' in-view' : ''}`;
    node.style.left = `${x}px`;
    node.style.top = `${ny}px`;
    node.style.setProperty('--node-delay', `${(i % 4) * 70}ms`);
    node.setAttribute('aria-label', `Unit ${i + 1}: ${unit.title} — ${pct}% complete`);
    node.dataset.unitId = unit.id;

    const ringOffset = RING_C * (1 - pct / 100);
    node.innerHTML = `
      <svg class="node-ring" viewBox="0 0 80 80" aria-hidden="true">
        <circle class="nr-track" cx="40" cy="40" r="36"/>
        <circle class="nr-fill" cx="40" cy="40" r="36" transform="rotate(-90 40 40)"
          style="stroke-dasharray:${RING_C.toFixed(1)};stroke-dashoffset:${ringOffset.toFixed(1)}"/>
      </svg>
      <span class="node-orb"><span class="node-emoji">${unit.icon}</span></span>
      ${state === 'done' ? '<span class="node-check">✓</span>' : ''}`;

    if (morphUnitId === unit.id) node.style.viewTransitionName = 'unit-hero';

    // Label, alternating sides
    const side = x > cx ? 'left' : 'right';
    const label = document.createElement('div');
    label.className = `path-label side-${side} st-${state}${reduced ? ' in-view' : ''}`;
    label.style.top = `${ny}px`;
    if (side === 'left') label.style.right = `${w - x + 56}px`;
    else label.style.left = `${x + 56}px`;
    label.innerHTML = `
      <div class="pl-eyebrow">Unit ${i + 1} · ${unit.level}</div>
      <div class="pl-title">${unit.title}</div>
      <div class="pl-sub">${pct === 100 ? 'Completed' : pct > 0 ? `${prog.completed}/${prog.total} lessons` : unit.subtitle}</div>`;

    const tap = (e) => onUnitTap(unit, node, e);
    node.addEventListener('click', tap);
    label.addEventListener('click', tap);

    nodesLayer.appendChild(node);
    nodesLayer.appendChild(label);
    nodeEls.push({ node, label, y: ny });

    // "You are here" — Breo sits above the current node
    if (state === 'current') {
      const here = document.createElement('div');
      here.className = 'here-marker';
      here.style.left = `${x}px`;
      here.style.top = `${ny}px`;
      here.innerHTML = '<div class="here-pulse"></div><div class="here-pulse p2"></div>';
      heroMascot = createMascot({ size: 74, mini: true });
      heroMascot.el.classList.add('here-breo');
      here.appendChild(heroMascot.el);
      nodesLayer.appendChild(here);
    }
  });

  // ── Sky: stars + orbs + rising particles ─────────────────────
  const vh = window.innerHeight;
  makeStars(sky.querySelector('.stars-far'), 90, w, vh * 1.6, 1.6, 0.55);
  makeStars(sky.querySelector('.stars-near'), 38, w, vh * 1.7, 2.4, 0.8);

  // Rising particle canvas — soft motes drifting up
  const canvas = sky.querySelector('.home-particles');
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(vh * dpr);
  let motes = [];
  if (!reduced) {
    motes = Array.from({ length: 16 }, () => ({
      x: Math.random() * w,
      y: Math.random() * vh,
      r: 1 + Math.random() * 2.4,
      s: 9 + Math.random() * 16,         // rise speed px/s
      drift: (Math.random() - 0.5) * 8,
      a: 0.05 + Math.random() * 0.16,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  // ── Animation loop: parallax + motes ─────────────────────────
  let alive = true;
  let scrollTop = screenEl.scrollTop;
  let lastT = performance.now();

  const starsFar = sky.querySelector('.stars-far');
  const starsNear = sky.querySelector('.stars-near');
  const orbs = sky.querySelector('.orbs');

  const onScroll = () => { scrollTop = screenEl.scrollTop; };
  screenEl.addEventListener('scroll', onScroll, { passive: true });

  const onFirstTouch = () => attachGyro();
  screenEl.addEventListener('pointerdown', onFirstTouch, { once: true, passive: true });

  function frame(now) {
    if (!alive) return;
    const dt = Math.min(0.05, (now - lastT) / 1000) || 0.016;
    lastT = now;

    if (!reduced) {
      // smooth the gyro signal
      _gyro.sx += (_gyro.x - _gyro.sx) * 0.06;
      _gyro.sy += (_gyro.y - _gyro.sy) * 0.06;
      const gx = _gyro.sx, gy = _gyro.sy;

      starsFar.style.transform = `translate3d(${(gx * 6).toFixed(1)}px, ${(-scrollTop * 0.06 + gy * 4).toFixed(1)}px, 0)`;
      starsNear.style.transform = `translate3d(${(gx * 12).toFixed(1)}px, ${(-scrollTop * 0.13 + gy * 8).toFixed(1)}px, 0)`;
      orbs.style.transform = `translate3d(${(gx * 22).toFixed(1)}px, ${(-scrollTop * 0.24 + gy * 14).toFixed(1)}px, 0)`;

      // ink draws itself as the viewport sweeps down, capped at progress
      const reveal = Math.max(0, Math.min(scrollTop + vh * 0.82 - TOP_PAD, progressLen));
      inkPath.style.strokeDashoffset = `${Math.max(0, pathLen - reveal).toFixed(1)}`;

      // scrolled-past nodes gracefully shrink/dim
      for (const n of nodeEls) {
        const sy = n.y - scrollTop;
        const past = sy < 110;
        n.node.classList.toggle('past', past);
        n.label.classList.toggle('past', past);
      }

      // motes
      if (!document.hidden && motes.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const m of motes) {
          m.y -= m.s * dt;
          m.phase += dt * 0.8;
          const mx = m.x + Math.sin(m.phase) * m.drift + gx * 30;
          if (m.y < -6) { m.y = vh + 6; m.x = Math.random() * w; }
          ctx.globalAlpha = m.a;
          ctx.fillStyle = 'hsl(185, 70%, 80%)';
          ctx.beginPath();
          ctx.arc(mx * dpr, m.y * dpr, m.r * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
    requestAnimationFrame(frame);
  }

  if (!reduced) {
    requestAnimationFrame(frame);
  } else {
    // static: draw the full progress ink immediately
    inkPath.style.transition = 'none';
    inkPath.style.strokeDashoffset = `${pathLen - progressLen}`;
  }

  // ── Scroll-in choreography ───────────────────────────────────
  let io = null;
  if (!reduced && 'IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in-view');
          io.unobserve(en.target);
        }
      });
    }, { root: screenEl, rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    nodesLayer.querySelectorAll('.path-node, .path-label, .path-banner').forEach((el) => io.observe(el));
  } else {
    nodesLayer.querySelectorAll('.path-node, .path-label, .path-banner').forEach((el) => el.classList.add('in-view'));
  }

  // ── Start centred on the current node ────────────────────────
  const targetScroll = Math.max(0, points[currentIdx].y - vh * 0.48);
  screenEl.scrollTop = targetScroll;
  scrollTop = targetScroll;

  _cleanup = () => {
    alive = false;
    screenEl.removeEventListener('scroll', onScroll);
    screenEl.removeEventListener('pointerdown', onFirstTouch);
    if (io) io.disconnect();
    if (heroMascot) heroMascot.destroy();
  };
  return _cleanup;
}

export function teardownPathHome() {
  if (_cleanup) { _cleanup(); _cleanup = null; }
}
