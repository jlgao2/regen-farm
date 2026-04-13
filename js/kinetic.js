/* ── Kinetic — all animation logic ── */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Loader ────────────────────────────────────────────────────

export function animateLoader(onDone) {
  const loader = document.getElementById('loader');
  if (!loader) { onDone(); return; }

  if (reduced) {
    setTimeout(() => { loader.classList.add('done'); onDone(); }, 400);
    return;
  }

  waitForGSAP(() => {
    const seed   = loader.querySelector('.sprout-seed');
    const stem   = loader.querySelector('.sprout-stem');
    const leafL  = loader.querySelector('.sprout-leaf--l');
    const leafR  = loader.querySelector('.sprout-leaf--r');
    const leafC  = loader.querySelector('.sprout-leaf--c');
    const label  = loader.querySelector('.loader-label');

    const tl = gsap.timeline({
      onComplete() {
        setTimeout(() => {
          loader.classList.add('done');
          setTimeout(onDone, 700);
        }, 100);
      }
    });

    // 1. Seed emerges
    tl.to(seed, {
      scale: 1,
      duration: 0.35,
      ease: 'back.out(2.5)',
    })
    // 2. Stem grows upward (strokeDashoffset 50 → 0)
    .to(stem, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power2.inOut',
    }, '+=0.05')
    // 3. Leaves unfurl — slightly staggered
    .to(leafL, {
      scale: 1, opacity: 1,
      duration: 0.45, ease: 'back.out(1.8)',
    }, '-=0.25')
    .to(leafR, {
      scale: 1, opacity: 1,
      duration: 0.4, ease: 'back.out(1.8)',
    }, '-=0.3')
    .to(leafC, {
      scale: 1, opacity: 1,
      duration: 0.35, ease: 'back.out(1.8)',
    }, '-=0.2')
    // 4. Label fades in
    .to(label, {
      opacity: 1, y: 0,
      duration: 0.55, ease: 'power2.out',
    }, '-=0.1')
    // 5. Hold briefly
    .to({}, { duration: 0.6 })
    // 6. Sprout rises and fades out
    .to([seed, stem, leafL, leafR, leafC], {
      opacity: 0, y: -18,
      duration: 0.4, ease: 'power2.in',
      stagger: 0.03,
    })
    .to(label, {
      opacity: 0, y: -10,
      duration: 0.35, ease: 'power2.in',
    }, '-=0.25');
  });
}

// ── Hero title scatter-in ─────────────────────────────────────

export function animateHeroIn(seasonId, instant = false) {
  const section = document.getElementById(`season-${seasonId}`);
  if (!section) return;

  const titleWrap = section.querySelector('.hero-title-wrap');
  if (!titleWrap) return;

  if (reduced) {
    titleWrap.classList.add('chars-in');
    return;
  }

  waitForGSAP(() => {
    const chars     = section.querySelectorAll('.hero-title-wrap .split-char');
    const taglineInner = section.querySelector('.line-reveal-inner');
    const months    = section.querySelector('.hero-months');
    const introBlock = section.querySelector('.hero-intro-block');

    // Instant mode: snap everything visible with no animation
    if (instant) {
      gsap.set(chars, { y: '0%', opacity: 1 });
      if (taglineInner) gsap.set(taglineInner, { y: '0%' });
      if (months)       gsap.set(months,       { opacity: 1, y: 0 });
      if (introBlock)   gsap.set(introBlock,   { opacity: 1, y: 0 });
      return;
    }

    // Clear any x-offset left by the scroll-diverge before re-entering
    gsap.set(chars, { clearProps: 'x,transform' });

    gsap.fromTo(chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1,
        stagger: 0.04,
        ease: 'power4.out',
        delay: 0.1,
      }
    );

    if (taglineInner) {
      gsap.fromTo(taglineInner,
        { y: '105%' },
        { y: '0%', duration: 0.9, ease: 'power3.out', delay: 0.6 }
      );
    }

    if (months) {
      gsap.fromTo(months,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
      );
    }

    if (introBlock) {
      gsap.fromTo(introBlock,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.0 }
      );
    }
  });
}

// ── Hero scroll diverge (left half / right half split) ────────
// Track active ScrollTriggers per season to avoid stacking duplicates
const _divergeTriggers = {};

export function initHeroDiverge(seasonId) {
  if (reduced) return;

  waitForGSAP(() => {
    // Kill any existing triggers for this season before creating new ones
    if (_divergeTriggers[seasonId]) {
      _divergeTriggers[seasonId].forEach(t => t?.kill?.());
      delete _divergeTriggers[seasonId];
    }

    const section = document.getElementById(`season-${seasonId}`);
    if (!section) return;

    const left = section.querySelector('.hero-title-left');
    const right = section.querySelector('.hero-title-right');
    const hero = section.querySelector('.season-hero');
    if (!left || !right || !hero) return;

    // Reset x position before attaching new scrub
    gsap.set([left, right], { x: 0 });

    const tLeft = gsap.to(left, {
      x: '-8vw',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    const tRight = gsap.to(right, {
      x: '8vw',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    _divergeTriggers[seasonId] = [
      tLeft.scrollTrigger,
      tRight.scrollTrigger,
    ];

    // Hero image parallax
    const heroImg = section.querySelector('.hero-image');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 20,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  });
}

// ── Big word parallax ─────────────────────────────────────────
// Scoped per-season so only the active season's triggers are live.
const _bigWordTriggers = {};

export function initBigWordParallax(seasonId) {
  if (reduced) return;

  waitForGSAP(() => {
    // Kill any existing triggers for this season before recreating
    if (_bigWordTriggers[seasonId]) {
      _bigWordTriggers[seasonId].forEach(t => t?.kill?.());
      delete _bigWordTriggers[seasonId];
    }

    const section = document.getElementById(`season-${seasonId}`);
    if (!section) return;

    const triggers = [];
    section.querySelectorAll('.big-word').forEach(word => {
      const t = gsap.fromTo(word,
        { x: '-4vw' },
        {
          x: '4vw',
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });
    _bigWordTriggers[seasonId] = triggers;
  });
}

// ── Quote reveal — staggered word cascade ─────────────────────

export function initQuoteReveals() {
  const sections = document.querySelectorAll('.quote-section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('words-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(s => observer.observe(s));

  // Re-attach after season changes
  document.body.addEventListener('seasonchange', () => {
    setTimeout(() => {
      document.querySelectorAll('.quote-section:not(.words-in)').forEach(s => {
        observer.observe(s);
      });
    }, 150);
  });
}

// ── IntersectionObserver for .reveal-up elements ──────────────

export function initRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  const observe = (sectionId) => {
    const section = document.getElementById(`season-${sectionId}`);
    if (!section) return;
    section.querySelectorAll('.reveal-up, .line-reveal').forEach(el => {
      el.classList.remove('in-view');
      observer.observe(el);
    });
  };

  ['autumn', 'winter', 'spring', 'summer'].forEach(observe);

  // Re-observe on season switch
  document.body.addEventListener('seasonchange', e => {
    if (e.detail?.id) setTimeout(() => observe(e.detail.id), 100);
  });
}

// ── Typed intro text ──────────────────────────────────────────

let typedInstance = null;

export function typeIntro(seasonId, instant = false) {
  const el = document.getElementById(`intro-${seasonId}`);
  if (!el) return;

  if (typedInstance) { typedInstance.destroy(); typedInstance = null; }
  el.textContent = '';

  if (instant || reduced || typeof Typed === 'undefined') {
    el.textContent = el.dataset.text || '';
    return;
  }

  setTimeout(() => {
    typedInstance = new Typed(`#intro-${seasonId}`, {
      strings: [el.dataset.text || ''],
      typeSpeed: 18,
      showCursor: true,
      cursorChar: '_',
      onComplete() {
        setTimeout(() => {
          const cursor = document.querySelector('.typed-cursor');
          if (cursor) { cursor.style.opacity = '0'; cursor.style.transition = 'opacity 1s'; }
        }, 1200);
      },
    });
  }, 900);
}

// ── Typed.js lazy load ────────────────────────────────────────

export function loadTyped(cb) {
  if (typeof Typed !== 'undefined') { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.1.0/typed.umd.js';
  s.onload = cb;
  document.head.appendChild(s);
}

// ── GSAP wait ─────────────────────────────────────────────────

function waitForGSAP(cb) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    cb();
    return;
  }
  let n = 0;
  const t = setInterval(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      clearInterval(t);
      gsap.registerPlugin(ScrollTrigger);
      cb();
    } else if (++n > 50) clearInterval(t);
  }, 80);
}
