/* ============================================================
   CURSOR — Custom cursor + text interaction effects
   ============================================================
   Effects:
   1. Custom magnetic cursor (dot + trailing ring)
   2. Seed trail — cursor drops seeds that sprout into seedlings
   3. Magnetic letters — hero title chars drift toward cursor
   4. Hover shimmer — task card titles ripple character by character
   5. Proximity warmth — text near cursor gets a warm colour shift
   ============================================================ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 1. Custom cursor ──────────────────────────────────────────

export function initCursor() {
  if (reduced || 'ontouchstart' in window) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -200, my = -200;   // mouse
  let rx = -200, ry = -200;   // ring (lagging)
  let scale = 1;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });

  // Enlarge ring over interactive elements
  document.addEventListener('mouseover', e => {
    const t = e.target;
    if (t.matches('button, a, .task-card, .checklist-item, .nav-btn, summary')) {
      scale = 2.2;
      ring.classList.add('cursor-ring--hover');
    }
  });
  document.addEventListener('mouseout', e => {
    const t = e.target;
    if (t.matches('button, a, .task-card, .checklist-item, .nav-btn, summary')) {
      scale = 1;
      ring.classList.remove('cursor-ring--hover');
    }
  });

  // Animate ring with spring lag
  let rafId;
  const ease = 0.10;
  function tick() {
    rx += (mx - rx) * ease;
    ry += (my - ry) * ease;
    ring.style.transform =
      `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${scale})`;
    rafId = requestAnimationFrame(tick);
  }
  tick();

  return () => cancelAnimationFrame(rafId);
}


// ── 2. Seed trail ─────────────────────────────────────────────
// As the cursor moves, seeds drop from it. Each seed sinks,
// then sends up a tiny seedling that unfurls and fades.

const SEED_SHAPES = ['❧', '⁕', '✿', '᙮', '·'];   // decorative seeds/dots

// SVG seedling stages drawn inline so no asset needed
function seedlingPath(stage) {
  // Returns an SVG string for stages 0–3
  const svgs = [
    // stage 0: just a dot seed
    `<circle cx="8" cy="14" r="2.5" fill="currentColor" opacity="0.9"/>`,
    // stage 1: tiny shoot, one leaf
    `<line x1="8" y1="14" x2="8" y2="8" stroke="currentColor" stroke-width="1.2"/>
     <path d="M8 10 Q11 7 13 9 Q10 11 8 10Z" fill="currentColor"/>`,
    // stage 2: taller, two leaves
    `<line x1="8" y1="15" x2="8" y2="5" stroke="currentColor" stroke-width="1.2"/>
     <path d="M8 11 Q12 7 14 10 Q10 12 8 11Z" fill="currentColor"/>
     <path d="M8 8 Q4 4 2 7 Q6 9 8 8Z" fill="currentColor"/>`,
    // stage 3: full seedling, three leaves + seed husk
    `<line x1="8" y1="15" x2="8" y2="4" stroke="currentColor" stroke-width="1.3"/>
     <path d="M8 12 Q13 8 15 11 Q11 14 8 12Z" fill="currentColor"/>
     <path d="M8 9 Q3 5 1 8 Q5 11 8 9Z" fill="currentColor"/>
     <path d="M8 6 Q11 2 13 5 Q10 7 8 6Z" fill="currentColor"/>
     <ellipse cx="8" cy="15.5" rx="2" ry="1.2" fill="currentColor" opacity="0.5"/>`,
  ];
  return svgs[stage] || svgs[0];
}

export function initSeedTrail() {
  if (reduced || 'ontouchstart' in window) return;

  const container = document.createElement('div');
  container.className = 'seed-trail-container';
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);

  let lastX = -999, lastY = -999;
  let lastSeedTime = 0;
  const MIN_DIST  = 40;   // px between seeds
  const MIN_DELAY = 120;  // ms between seeds

  function spawnSeed(x, y) {
    const seed = document.createElement('div');
    seed.className = 'seed-particle';

    // Random small offset so they don't stack
    const ox = (Math.random() - 0.5) * 16;
    seed.style.left = `${x + ox}px`;
    seed.style.top  = `${y}px`;

    // Inline SVG seedling — starts at stage 0
    seed.innerHTML = `<svg class="seedling-svg" viewBox="0 0 16 16" width="16" height="16"
      xmlns="http://www.w3.org/2000/svg">${seedlingPath(0)}</svg>`;

    container.appendChild(seed);

    // Animate through growth stages
    let stage = 0;
    const svg = seed.querySelector('.seedling-svg');

    // Sink slightly first (seed settling), then grow up
    seed.style.setProperty('--seed-x', `${ox}px`);
    seed.classList.add('seed-sinking');

    const stageTimings = [180, 380, 580];   // ms to next stage
    stageTimings.forEach((t, i) => {
      setTimeout(() => {
        stage = i + 1;
        svg.innerHTML = seedlingPath(stage);
        seed.classList.remove('seed-sinking');
        seed.classList.add('seed-growing');
      }, t);
    });

    // Fade out and remove
    setTimeout(() => {
      seed.classList.add('seed-fading');
      setTimeout(() => seed.remove(), 800);
    }, 1600);
  }

  window.addEventListener('mousemove', e => {
    const now = Date.now();
    const dx  = e.clientX - lastX;
    const dy  = e.clientY - lastY;
    const dist = Math.hypot(dx, dy);

    if (dist > MIN_DIST && now - lastSeedTime > MIN_DELAY) {
      spawnSeed(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
      lastSeedTime = now;
    }
  }, { passive: true });
}


// ── 3. Magnetic letters ───────────────────────────────────────
// Hero title .split-char elements softly drift toward the cursor
// when it is within RADIUS px. They spring back on mouse leave.

export function initMagneticLetters() {
  if (reduced || 'ontouchstart' in window) return;

  const RADIUS   = 120;   // px — attraction radius
  const STRENGTH = 0.28;  // how far letters drift (fraction of distance)

  let mx = 0, my = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function applyMagnetism() {
    document.querySelectorAll('.hero-title-wrap .split-char').forEach(char => {
      const r = char.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS) {
        const pull = (1 - dist / RADIUS) * STRENGTH;
        char.style.setProperty('--mag-x', `${dx * pull}px`);
        char.style.setProperty('--mag-y', `${dy * pull}px`);
        char.classList.add('is-magnetic');
      } else {
        char.classList.remove('is-magnetic');
        char.style.removeProperty('--mag-x');
        char.style.removeProperty('--mag-y');
      }
    });

    requestAnimationFrame(applyMagnetism);
  }

  applyMagnetism();
}


// ── 3. Hover shimmer on task card titles ──────────────────────
// On mouseenter, each character lights up in sequence like a wave.
// Works by splitting .task-title text into <span>s on first hover.

export function initHoverShimmer() {
  if (reduced) return;

  // Re-run whenever seasons switch (new cards rendered)
  function attachShimmer() {
    document.querySelectorAll('.task-title:not([data-shimmer])').forEach(el => {
      el.dataset.shimmer = '1';

      el.addEventListener('mouseenter', () => {
        // Split on first hover
        if (!el.querySelector('.shimmer-char')) {
          const text = el.textContent;
          el.textContent = '';
          text.split('').forEach((ch, i) => {
            const s = document.createElement('span');
            s.className = 'shimmer-char';
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            s.style.setProperty('--si', i);
            el.appendChild(s);
          });
        }
        el.classList.add('shimmer-active');
      });

      el.addEventListener('mouseleave', () => {
        el.classList.remove('shimmer-active');
      });
    });
  }

  attachShimmer();

  // Re-attach after season switches
  document.body.addEventListener('seasonchange', () => {
    setTimeout(attachShimmer, 200);
  });
}


// ── 4. Proximity warmth ───────────────────────────────────────
// Paragraphs and descriptions glow subtly warm when the cursor
// is nearby — a gentle "reading lamp" effect.

export function initProximityWarmth() {
  if (reduced || 'ontouchstart' in window) return;

  const RADIUS = 200;
  let mx = 0, my = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  function tick() {
    document.querySelectorAll('.task-description, .hero-intro-block p, .quote-text').forEach(el => {
      const r = el.getBoundingClientRect();
      // Centre of element
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      const proximity = Math.max(0, 1 - dist / RADIUS);

      // Warm shift: nudge toward a straw/golden hue
      el.style.setProperty('--warmth', proximity.toFixed(3));
    });

    requestAnimationFrame(tick);
  }

  tick();
}
