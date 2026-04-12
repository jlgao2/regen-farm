/* ── Main ── */

import { SEASONS } from './data.js';
import { CATEGORY_IMAGES } from './data_enrich.js';
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
  initSeedTrail,
  initMagneticLetters,
  initHoverShimmer,
  initProximityWarmth,
} from './cursor.js';
import { initAudio } from './audio.js';
import { initPlanner, setPlannerSeason } from './planner.js';

// ── Merge season-specific image metadata into each category ───
// CATEGORY_IMAGES keys are "{seasonId}-{catId}" → { imageAlt, imageQuery }
// microseasons.js is imported directly by renderer.js
const ENRICHED_SEASONS = SEASONS.map(s => ({
  ...s,
  categories: s.categories.map(cat => ({
    ...cat,
    ...(CATEGORY_IMAGES[`${s.id}-${cat.id}`] || {}),
  })),
}));

// ── Grain overlay ─────────────────────────────────────────────
const grain = document.createElement('div');
grain.className = 'grain-overlay';
grain.setAttribute('aria-hidden', 'true');
document.body.appendChild(grain);

// ── Render ────────────────────────────────────────────────────
const root = document.getElementById('seasons-root');
root.appendChild(renderAllSeasons(ENRICHED_SEASONS));

// ── Determine initial season ──────────────────────────────────
const validIds = SEASONS.map(s => s.id);
const hashId = location.hash.replace('#', '').toLowerCase();
const initial = validIds.includes(hashId) ? hashId : 'autumn';

// ── Boot sequence ─────────────────────────────────────────────
animateLoader(() => {
  activateSeason(initial, { instant: true });

  loadTyped(() => {
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
  wireRegionSelector();

  if (!('ontouchstart' in window)) {
    document.body.classList.add('custom-cursor');
    initCursor();
    initSeedTrail();
    initMagneticLetters();
    initProximityWarmth();
  }
  initHoverShimmer();
  initAudio();
  initPlanner();
  setPlannerSeason(initial);
});

// ── Planner season sync ───────────────────────────────────────
document.body.addEventListener('seasonchange', e => {
  setPlannerSeason(e.detail?.id || 'autumn');
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

function wireRegionSelector() {
  const btn  = document.getElementById('nav-region-btn');
  const drop = document.getElementById('nav-region-drop');
  if (!btn || !drop) return;

  const open  = () => { btn.setAttribute('aria-expanded', 'true');  drop.hidden = false; };
  const close = () => { btn.setAttribute('aria-expanded', 'false'); drop.hidden = true; };

  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  // Close on outside click
  document.addEventListener('click', () => close());

  // Prevent clicks inside the dropdown from closing it
  drop.addEventListener('click', e => e.stopPropagation());

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      close();
      btn.focus();
    }
  });
}
