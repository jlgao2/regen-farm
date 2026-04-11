/* ── Kinetic — all animation logic ── */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Loader ────────────────────────────────────────────────────

export function animateLoader(onDone) {
  const loader = document.getElementById('loader');
  if (!loader) { onDone(); return; }

  // Split loader chars
  loader.querySelectorAll('.loader-word').forEach(word => {
    const text = word.textContent;
    word.textContent = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      word.appendChild(span);
    });
  });

  if (reduced) {
    setTimeout(() => { loader.classList.add('done'); onDone(); }, 400);
    return;
  }

  waitForGSAP(() => {
    const chars = loader.querySelectorAll('.char');
    const tl = gsap.timeline({
      onComplete() {
        setTimeout(() => {
          loader.classList.add('done');
          setTimeout(onDone, 650);
        }, 300);
      }
    });

    tl.to(chars, {
      y: '0%',
      duration: 0.7,
      stagger: 0.05,
      ease: 'power4.out',
    })
    .to(chars, {
      y: '-110%',
      duration: 0.5,
      stagger: 0.04,
      ease: 'power3.in',
      delay: 0.5,
    });
  });
}

// ── Hero title scatter-in ─────────────────────────────────────

export function animateHeroIn(seasonId) {
  const section = document.getElementById(`season-${seasonId}`);
  if (!section) return;

  const titleWrap = section.querySelector('.hero-title-wrap');
  if (!titleWrap) return;

  if (reduced) {
    titleWrap.classList.add('chars-in');
    return;
  }

  waitForGSAP(() => {
    const chars = section.querySelectorAll('.hero-title-wrap .split-char');

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

    // Tagline
    const taglineInner = section.querySelector('.line-reveal-inner');
    if (taglineInner) {
      gsap.fromTo(taglineInner,
        { y: '105%' },
        { y: '0%', duration: 0.9, ease: 'power3.out', delay: 0.6 }
      );
    }

    // Months
    const months = section.querySelector('.hero-months');
    if (months) {
      gsap.fromTo(months,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
      );
    }

    // Intro block
    const introBlock = section.querySelector('.hero-intro-block');
    if (introBlock) {
      gsap.fromTo(introBlock,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.0 }
      );
    }
  });
}

// ── Hero scroll diverge (left half / right half split) ────────

export function initHeroDiverge(seasonId) {
  if (reduced) return;

  waitForGSAP(() => {
    const section = document.getElementById(`season-${seasonId}`);
    if (!section) return;

    const left = section.querySelector('.hero-title-left');
    const right = section.querySelector('.hero-title-right');
    const hero = section.querySelector('.season-hero');
    if (!left || !right || !hero) return;

    gsap.to(left, {
      x: '-8vw',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    gsap.to(right, {
      x: '8vw',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

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

export function initBigWordParallax() {
  if (reduced) return;

  waitForGSAP(() => {
    document.querySelectorAll('.big-word').forEach(word => {
      gsap.fromTo(word,
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
    });
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
