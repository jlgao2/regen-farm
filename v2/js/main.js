/* ── Main ── */

import { SEASONS } from './data.js';
import { renderAllSeasons } from './renderer.js';
import { activateSeason } from './seasons.js';
import {
  animateLoader,
  initRevealObserver,
  initBigWordParallax,
  initQuoteReveals,
  loadTyped,
} from './kinetic.js';

import {
  initCursor,
  initMagneticLetters,
  initHoverShimmer,
  initProximityWarmth,
} from './cursor.js';

// ── Grain overlay ─────────────────────────────────────────────
const grain = document.createElement('div');
grain.className = 'grain-overlay';
grain.setAttribute('aria-hidden', 'true');
document.body.appendChild(grain);

// ── Render ────────────────────────────────────────────────────
const root = document.getElementById('seasons-root');
root.appendChild(renderAllSeasons(SEASONS));

// ── Determine initial season ──────────────────────────────────
const validIds = SEASONS.map(s => s.id);
const hashId = location.hash.replace('#', '').toLowerCase();
const initial = validIds.includes(hashId) ? hashId : 'autumn';

// ── Boot sequence ─────────────────────────────────────────────
animateLoader(() => {
  activateSeason(initial, { instant: true });

  loadTyped(() => {
    // re-run typed now that library is loaded
    const el = document.getElementById(`intro-${initial}`);
    if (el && !el.textContent.trim()) {
      import('./kinetic.js').then(m => m.typeIntro(initial, false));
    }
  });

  initRevealObserver();
  initBigWordParallax();
  initQuoteReveals();
  wireNav();
  wireHash();
  wireHeader();

  // Cursor & text interaction effects
  if (!('ontouchstart' in window)) {
    document.body.classList.add('custom-cursor');
    initCursor();
    initMagneticLetters();
    initProximityWarmth();
  }
  initHoverShimmer(); // shimmer works on touch too (tap)
});

// ── Nav wiring ────────────────────────────────────────────────
function wireNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => activateSeason(btn.dataset.season));
  });
}

function wireHash() {
  window.addEventListener('hashchange', () => {
    const id = location.hash.replace('#', '').toLowerCase();
    if (validIds.includes(id)) activateSeason(id);
  });
}

function wireHeader() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(240,237,230,0.14)'
      : 'rgba(240,237,230,0.1)';
  }, { passive: true });
}
