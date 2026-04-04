/* ============================================================
   MAIN — Orchestration entry point
   ============================================================ */

import { SEASONS } from './data.js';
import { renderAllSeasons } from './renderer.js';
import { activateSeason } from './seasons.js';
import { initAnimations, initWheelLabels } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Render all season sections into the DOM ──
  const container = document.getElementById('seasons-container');
  if (container) {
    container.appendChild(renderAllSeasons(SEASONS));
  }

  // ── 2. Determine initial season from URL hash ──
  const validIds = SEASONS.map(s => s.id);
  const hashId = window.location.hash.replace('#', '').toLowerCase();
  const initialSeason = validIds.includes(hashId) ? hashId : 'spring';

  // ── 3. Activate initial season (no animation) ──
  activateSeason(initialSeason, { skipAnimation: true });

  // ── 4. Wire nav pill click handlers ──
  document.querySelectorAll('.season-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      activateSeason(pill.dataset.season);
    });
  });

  // ── 5. Wire custom event from season wheel ──
  document.body.addEventListener('switchseason', e => {
    if (e.detail?.id) activateSeason(e.detail.id);
  });

  // ── 6. Handle browser back/forward hash changes ──
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '').toLowerCase();
    if (validIds.includes(id)) activateSeason(id);
  });

  // ── 7. Init animations ──
  initAnimations();
  initWheelLabels();

  // ── 8. Dismiss loading overlay ──
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    setTimeout(() => {
      overlay.classList.add('is-hidden');
      // Remove from DOM after transition
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    }, 800);
  }

  // ── 9. Header scroll shadow ──
  const header = document.getElementById('site-header');
  if (header) {
    const shadow = '0 2px 20px rgba(0,0,0,0.10)';
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? shadow : '';
    }, { passive: true });
  }
});
