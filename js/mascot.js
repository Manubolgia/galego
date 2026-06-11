// Galego — Breo the Polbo 🐙
// The app mascot: a hand-built SVG octopus with a blink rig, eye
// tracking, waving tentacles and score-keyed moods. Pure SVG + CSS
// animation — no assets, fully offline. Styles live in css/fx.css.

let _uid = 0;

function svgMarkup(id) {
  // Each instance gets unique gradient ids so two mascots can coexist.
  const g = (n) => `breo-${n}-${id}`;
  return `
  <svg class="breo-svg" viewBox="0 0 200 190" aria-hidden="true">
    <defs>
      <radialGradient id="${g('body')}" cx="38%" cy="22%" r="85%">
        <stop offset="0%"  stop-color="hsl(188, 56%, 66%)"/>
        <stop offset="45%" stop-color="hsl(189, 54%, 47%)"/>
        <stop offset="100%" stop-color="hsl(192, 58%, 30%)"/>
      </radialGradient>
      <radialGradient id="${g('iris')}" cx="35%" cy="30%" r="80%">
        <stop offset="0%"  stop-color="hsl(189, 60%, 38%)"/>
        <stop offset="100%" stop-color="hsl(196, 64%, 16%)"/>
      </radialGradient>
      <linearGradient id="${g('tent')}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="hsl(190, 56%, 38%)"/>
        <stop offset="100%" stop-color="hsl(193, 58%, 27%)"/>
      </linearGradient>
    </defs>

    <ellipse class="breo-shadow" cx="100" cy="180" rx="52" ry="7"/>

    <g class="breo-rig">
      <!-- tentacles (back to front) -->
      <g class="breo-tents" stroke="url(#${g('tent')})" fill="none" stroke-linecap="round">
        <path class="breo-tent t1" d="M 48 124 C 40 150 28 158 15 151" stroke-width="13"/>
        <path class="breo-tent t6" d="M 152 122 C 161 146 174 153 187 145" stroke-width="13"/>
        <path class="breo-tent t2" d="M 69 132 C 65 158 53 169 39 165" stroke-width="14"/>
        <path class="breo-tent t5" d="M 131 131 C 137 156 150 167 164 162" stroke-width="14"/>
        <path class="breo-tent t3" d="M 91 137 C 91 163 83 175 68 177" stroke-width="15"/>
        <path class="breo-tent t4" d="M 111 137 C 113 163 123 175 138 176" stroke-width="15"/>
      </g>
      <!-- sucker dots on the front tentacles -->
      <g class="breo-suckers">
        <circle cx="84" cy="160" r="2.4"/>
        <circle cx="78" cy="170" r="2"/>
        <circle cx="119" cy="161" r="2.4"/>
        <circle cx="127" cy="170" r="2"/>
      </g>

      <!-- head / mantle -->
      <path class="breo-body" fill="url(#${g('body')})"
        d="M 30 114 C 30 52 60 22 100 22 C 140 22 170 52 170 114
           C 170 131 152 140 100 140 C 48 140 30 131 30 114 Z"/>
      <!-- glossy top light -->
      <ellipse class="breo-gloss" cx="72" cy="48" rx="28" ry="14" transform="rotate(-18 72 48)"/>
      <!-- freckles -->
      <g class="breo-freckles">
        <circle cx="89" cy="44" r="1.6"/>
        <circle cx="100" cy="40" r="1.6"/>
        <circle cx="111" cy="44" r="1.6"/>
      </g>

      <!-- face -->
      <g class="breo-face">
        <g class="breo-eye left">
          <circle class="breo-sclera" cx="72" cy="92" r="19"/>
          <circle class="breo-iris" fill="url(#${g('iris')})" cx="72" cy="92" r="11.5"/>
          <g class="breo-pupil-rig">
            <circle class="breo-pupil" cx="72" cy="92" r="6.2"/>
            <circle class="breo-shine big" cx="68.5" cy="88.5" r="3"/>
            <circle class="breo-shine" cx="75" cy="94.5" r="1.5"/>
          </g>
        </g>
        <g class="breo-eye right">
          <circle class="breo-sclera" cx="124" cy="92" r="19"/>
          <circle class="breo-iris" fill="url(#${g('iris')})" cx="124" cy="92" r="11.5"/>
          <g class="breo-pupil-rig">
            <circle class="breo-pupil" cx="124" cy="92" r="6.2"/>
            <circle class="breo-shine big" cx="120.5" cy="88.5" r="3"/>
            <circle class="breo-shine" cx="127" cy="94.5" r="1.5"/>
          </g>
        </g>

        <!-- sad brows (poor mood only) -->
        <g class="breo-brows">
          <path d="M 58 72 Q 70 68 80 74" />
          <path d="M 116 74 Q 126 68 138 72" />
        </g>

        <!-- cheeks -->
        <ellipse class="breo-cheek" cx="52" cy="108" rx="8.5" ry="5.5"/>
        <ellipse class="breo-cheek" cx="144" cy="108" rx="8.5" ry="5.5"/>

        <!-- mouths -->
        <path class="breo-mouth neutral" d="M 89 115 Q 98 122 107 115"/>
        <g class="breo-mouth happy">
          <path class="happy-open" d="M 84 111 Q 98 134 112 111 Z"/>
          <path class="happy-tongue" d="M 91 117 Q 98 126 105 117 Q 98 122 91 117 Z"/>
        </g>
        <path class="breo-mouth sad" d="M 88 122 Q 98 113 108 122"/>
      </g>

      <!-- celebration sparkles (great mood) -->
      <g class="breo-sparkles">
        <path class="sp s1" d="M 36 38 l 2.2 5 5 2.2 -5 2.2 -2.2 5 -2.2 -5 -5 -2.2 5 -2.2 Z"/>
        <path class="sp s2" d="M 166 30 l 2 4.4 4.4 2 -4.4 2 -2 4.4 -2 -4.4 -4.4 -2 4.4 -2 Z"/>
        <path class="sp s3" d="M 182 86 l 1.7 3.8 3.8 1.7 -3.8 1.7 -1.7 3.8 -1.7 -3.8 -3.8 -1.7 3.8 -1.7 Z"/>
      </g>

      <!-- teardrop (poor mood) -->
      <path class="breo-tear" d="M 141 110 q 4.5 7 0 10.5 q -4.5 -3.5 0 -10.5 Z"/>
    </g>
  </svg>`;
}

/**
 * Create a mascot instance.
 * @returns {{ el, setMood(mood), lookAt(dx,dy), enter(), destroy() }}
 *   mood: 'great' | 'neutral' | 'poor'
 */
export function createMascot({ size = 190, mini = false } = {}) {
  const el = document.createElement('div');
  el.className = `breo${mini ? ' breo-mini' : ''} mood-neutral`;
  el.style.width = `${size}px`;
  el.innerHTML = svgMarkup(++_uid);

  // Randomise blink phase so multiple mascots don't blink in sync.
  el.querySelectorAll('.breo-eye').forEach((eye) => {
    eye.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
  });

  function lookAt(dx, dy) {
    // clamp pupil travel
    const cl = (v) => Math.max(-4.5, Math.min(4.5, v));
    el.style.setProperty('--look-x', `${cl(dx)}px`);
    el.style.setProperty('--look-y', `${cl(dy)}px`);
  }

  // Idle life: occasional glances. Self-cleans when detached.
  const glance = setInterval(() => {
    if (!el.isConnected) { clearInterval(glance); return; }
    if (document.hidden) return;
    lookAt((Math.random() - 0.5) * 9, (Math.random() - 0.3) * 6);
  }, 2800 + Math.random() * 1800);

  return {
    el,
    lookAt,
    setMood(mood) {
      el.classList.remove('mood-great', 'mood-neutral', 'mood-poor');
      el.classList.add(`mood-${mood}`);
    },
    enter() {
      el.classList.remove('breo-enter');
      void el.offsetWidth;
      el.classList.add('breo-enter');
    },
    destroy() {
      clearInterval(glance);
      el.remove();
    },
  };
}
