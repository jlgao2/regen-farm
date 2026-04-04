/* ============================================================
   SEASONS — Season switching, theme application, Typed.js
   ============================================================ */

import { SEASONS } from './data.js';

let typedInstance = null;
let activeSeasonId = 'spring';

/**
 * Activate a season by id.
 * Handles: section visibility, theme, nav pills, typed.js, URL hash.
 */
export function activateSeason(id, options = {}) {
  const { skipAnimation = false } = options;

  if (id === activeSeasonId && !skipAnimation) return;

  const season = SEASONS.find(s => s.id === id);
  if (!season) return;

  const prevId = activeSeasonId;
  activeSeasonId = id;

  // ── Update body class and data attribute ──
  document.body.classList.remove(`season--${prevId}`);
  document.body.classList.add(`season--${id}`);
  document.body.setAttribute('data-active-season', id);

  // ── Update meta theme-color ──
  const themeColors = {
    spring: '#4a7c59',
    summer: '#2d6a4f',
    autumn: '#a0522d',
    winter: '#3d5a80',
  };
  const metaTheme = document.getElementById('theme-color-meta');
  if (metaTheme) metaTheme.setAttribute('content', themeColors[id] || '#4a7c59');

  // ── Switch section visibility ──
  const allSections = document.querySelectorAll('.season-section');
  const nextSection = document.getElementById(`season-${id}`);

  if (skipAnimation) {
    allSections.forEach(s => s.classList.remove('is-active', 'is-entering'));
    if (nextSection) nextSection.classList.add('is-active');
  } else {
    // Fade out current
    const currentSection = document.querySelector('.season-section.is-active');
    if (currentSection && currentSection !== nextSection) {
      currentSection.style.opacity = '0';
      currentSection.style.transform = 'translateY(20px)';
      currentSection.style.transition = 'opacity 300ms ease, transform 300ms ease';

      setTimeout(() => {
        currentSection.classList.remove('is-active');
        currentSection.style.opacity = '';
        currentSection.style.transform = '';
        currentSection.style.transition = '';

        // Fade in next
        if (nextSection) {
          nextSection.classList.add('is-active', 'is-entering');
          nextSection.style.opacity = '0';
          nextSection.style.transform = 'translateY(20px)';

          requestAnimationFrame(() => {
            nextSection.style.transition = 'opacity 400ms ease, transform 400ms ease';
            nextSection.style.opacity = '1';
            nextSection.style.transform = 'translateY(0)';

            setTimeout(() => {
              nextSection.classList.remove('is-entering');
              nextSection.style.opacity = '';
              nextSection.style.transform = '';
              nextSection.style.transition = '';
            }, 420);
          });
        }
      }, 320);
    } else if (nextSection) {
      nextSection.classList.add('is-active');
    }
  }

  // ── Update nav pills ──
  document.querySelectorAll('.season-pill').forEach(pill => {
    const isActive = pill.dataset.season === id;
    pill.classList.toggle('is-active', isActive);
    pill.setAttribute('aria-current', isActive ? 'true' : 'false');
  });

  // ── Update season wheel ──
  document.querySelectorAll('.wheel-arc').forEach(arc => {
    arc.classList.toggle('is-active', arc.dataset.season === id);
  });
  document.querySelectorAll('.wheel-label').forEach(label => {
    label.style.fontWeight = label.dataset.season === id ? '700' : '';
    label.style.color = label.dataset.season === id ? 'var(--color-primary)' : '';
  });

  // ── Update URL hash without scroll ──
  history.replaceState(null, '', `#${id}`);

  // ── Start typewriter ──
  startTypewriter(id, skipAnimation);

  // ── Scroll to top of page if user clicked nav ──
  if (!skipAnimation) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Re-trigger scroll animations for new section ──
  if (!skipAnimation) {
    setTimeout(() => triggerVisibleAnimations(), 450);
  }
}

/**
 * Start or restart the Typed.js typewriter for the active season.
 */
function startTypewriter(seasonId, instant = false) {
  const season = SEASONS.find(s => s.id === seasonId);
  if (!season) return;

  const target = document.getElementById(`hero-intro-${seasonId}`);
  if (!target) return;

  // Destroy previous instance
  if (typedInstance) {
    typedInstance.destroy();
    typedInstance = null;
  }

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (instant || prefersReduced) {
    target.textContent = season.intro;
    return;
  }

  // Clear target before re-typing
  target.textContent = '';

  // Small delay to let section transition complete
  setTimeout(() => {
    if (typeof Typed === 'undefined') {
      target.textContent = season.intro;
      return;
    }
    typedInstance = new Typed(`#hero-intro-${seasonId}`, {
      strings: [season.intro],
      typeSpeed: 22,
      showCursor: true,
      cursorChar: '|',
      onComplete(self) {
        // Fade out cursor after typing completes
        setTimeout(() => {
          const cursor = document.querySelector('.typed-cursor');
          if (cursor) {
            cursor.style.opacity = '0';
            cursor.style.transition = 'opacity 1s ease';
          }
        }, 1500);
      },
    });
  }, instant ? 0 : 600);
}

/**
 * Trigger animate-on-scroll for elements in the active section
 * that are currently visible in the viewport.
 */
function triggerVisibleAnimations() {
  const activeSection = document.querySelector('.season-section.is-active');
  if (!activeSection) return;

  const elements = activeSection.querySelectorAll('.animate-on-scroll:not(.is-visible)');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('is-visible');
    }
  });
}

export function getActiveSeasonId() {
  return activeSeasonId;
}

export { startTypewriter };
