/* ============================================================
   ANIMATIONS — GSAP ScrollTrigger + IntersectionObserver
   ============================================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialize all scroll-based animations.
 * Called once after DOM is fully rendered.
 */
export function initAnimations() {
  initIntersectionObserver();
  if (!prefersReduced) {
    waitForGSAP(initGSAP);
  }
  initSeasonWheel();
}

// ── IntersectionObserver (CSS-driven stagger) ─────────────────

function initIntersectionObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Don't unobserve — allows re-triggering when switching seasons
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Observe all animate-on-scroll elements in the active section
  function observeSection(sectionId) {
    const section = document.getElementById(`season-${sectionId}`);
    if (!section) return;
    section.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.remove('is-visible');
      observer.observe(el);
    });
  }

  // Observe all sections initially
  ['spring', 'summer', 'autumn', 'winter'].forEach(observeSection);

  // Re-observe when season changes
  document.body.addEventListener('seasonchange', e => {
    const id = e.detail?.id;
    if (id) {
      setTimeout(() => observeSection(id), 100);
    }
  });
}

// ── GSAP ScrollTrigger ────────────────────────────────────────

function waitForGSAP(callback) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    callback();
    return;
  }
  // Poll until loaded
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(interval);
      callback();
    } else if (attempts > 40) {
      clearInterval(interval);
    }
  }, 100);
}

function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  initHeroParallax();
  initQuoteAnimations();
  initTimelineSync();
}

function initHeroParallax() {
  document.querySelectorAll('.season-section').forEach(section => {
    const heroBg = section.querySelector('.hero-bg');
    if (!heroBg) return;

    gsap.to(heroBg, {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: section.querySelector('.season-hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

function initQuoteAnimations() {
  document.querySelectorAll('.quote-block').forEach(block => {
    if (prefersReduced) return;

    gsap.fromTo(block,
      { opacity: 0, scale: 0.96, y: 24 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}

function initTimelineSync() {
  // Highlight timeline dots as corresponding sections scroll into view
  document.querySelectorAll('.season-section').forEach(section => {
    const dots = Array.from(section.querySelectorAll('.timeline-item'));
    if (!dots.length) return;

    const taskItems = Array.from(section.querySelectorAll('.task-item'));
    if (!taskItems.length) return;

    taskItems.forEach((taskItem, i) => {
      if (!dots[i]) return;

      ScrollTrigger.create({
        trigger: taskItem,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          dots.forEach(d => d.classList.remove('is-highlighted'));
          dots[i].classList.add('is-highlighted');
        },
        onEnterBack: () => {
          dots.forEach(d => d.classList.remove('is-highlighted'));
          dots[i].classList.add('is-highlighted');
        },
      });
    });
  });
}

// ── Season Wheel SVG ──────────────────────────────────────────

export function initSeasonWheel() {
  const wheelArcs = document.getElementById('wheel-arcs');
  if (!wheelArcs) return;

  const cx = 100, cy = 100, r = 60;
  const seasons = [
    { id: 'spring', startAngle: -90, endAngle: 0 },
    { id: 'summer', startAngle: 0,   endAngle: 90 },
    { id: 'autumn', startAngle: 90,  endAngle: 180 },
    { id: 'winter', startAngle: 180, endAngle: 270 },
  ];

  seasons.forEach(({ id, startAngle, endAngle }) => {
    const path = describeArc(cx, cy, r, startAngle, endAngle);
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    arc.setAttribute('d', path);
    arc.setAttribute('class', `wheel-arc wheel-arc--${id}${id === 'spring' ? ' is-active' : ''}`);
    arc.setAttribute('data-season', id);
    arc.setAttribute('stroke-width', '18');
    arc.setAttribute('fill', 'none');
    arc.setAttribute('stroke-linecap', 'butt');
    arc.setAttribute('tabindex', '0');
    arc.setAttribute('role', 'button');
    arc.setAttribute('aria-label', `Switch to ${id}`);

    arc.addEventListener('click', () => switchSeason(id));
    arc.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); switchSeason(id); }
    });

    wheelArcs.appendChild(arc);
  });
}

function switchSeason(id) {
  // Dispatch to main.js via a custom event
  document.body.dispatchEvent(new CustomEvent('switchseason', { detail: { id } }));
}

// Wheel label clicks
export function initWheelLabels() {
  document.querySelectorAll('.wheel-label').forEach(label => {
    label.addEventListener('click', () => {
      switchSeason(label.dataset.season);
    });
  });
}

// ── SVG Arc Math ──────────────────────────────────────────────

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  // Inset slightly from each arc end to create gaps
  const gap = 8;
  const start = polarToCartesian(cx, cy, r, startAngle + gap);
  const end   = polarToCartesian(cx, cy, r, endAngle - gap);
  const largeArc = endAngle - startAngle > 180 ? '1' : '0';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
