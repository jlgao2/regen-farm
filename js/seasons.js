/* ── Season switching ── */

import { animateHeroIn, initHeroDiverge, initBigWordParallax, typeIntro } from './kinetic.js';

let active = 'autumn';

export function activateSeason(id, opts = {}) {
  const { instant = false } = opts;
  if (id === active && !instant) return;
  const prev = active;
  active = id;

  // body attribute
  document.body.setAttribute('data-season', id);

  // Sections
  document.querySelectorAll('.season-section').forEach(s => {
    s.classList.remove('is-active');
  });
  const next = document.getElementById(`season-${id}`);
  if (next) next.classList.add('is-active');

  // Nav
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.season === id);
  });

  // URL
  history.replaceState(null, '', `#${id}`);

  // Scroll to top
  if (!instant) window.scrollTo({ top: 0, behavior: 'smooth' });

  // Animations
  if (!instant) {
    animateHeroIn(id);
    setTimeout(() => { initHeroDiverge(id); initBigWordParallax(id); }, 200);
    typeIntro(id, false);
  } else {
    animateHeroIn(id, true);   // snap chars visible immediately
    typeIntro(id, true);
    initHeroDiverge(id);
    initBigWordParallax(id);
  }

  // Dispatch for other modules (e.g. observer)
  document.body.dispatchEvent(new CustomEvent('seasonchange', { detail: { id, prev } }));
}

export function getActive() { return active; }
