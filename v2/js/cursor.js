/* ============================================================
   CURSOR — Custom cursor + text interaction effects
   ============================================================
   Effects:
   1. Custom magnetic cursor (dot + trailing ring)
   2. Magnetic letters — hero title chars drift toward cursor
   3. Hover shimmer — task card titles ripple character by character
   4. Proximity warmth — text near cursor gets a warm colour shift
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


// ── 2. Magnetic letters ───────────────────────────────────────
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
