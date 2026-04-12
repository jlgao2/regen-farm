/* ── Renderer — builds DOM from data, no side effects ── */

import { MICROSEASONS, getCurrentMicroseason } from './microseasons.js';

export function renderAllSeasons(seasons) {
  const frag = document.createDocumentFragment();
  seasons.forEach(s => frag.appendChild(renderSeason(s)));
  return frag;
}

function renderSeason(s) {
  const section = el('section', {
    class: `season-section${s.id === 'autumn' ? ' is-active' : ''}`,
    id: `season-${s.id}`,
    'data-season': s.id,
  });
  section.appendChild(renderHero(s));
  section.appendChild(renderMarqueeDivider(s));
  section.appendChild(renderMicroseasons(s.id));
  section.appendChild(renderBody(s));
  section.appendChild(renderQuote(s));
  return section;
}

// ── Hero ──────────────────────────────────────────────────────

function renderHero(s) {
  const hero = el('div', { class: 'season-hero' });

  // bg image
  hero.appendChild(el('div', { class: 'hero-image', 'aria-hidden': 'true' }));

  // eyebrow — shows months, not the season name (big title already has that)
  const eyebrow = el('div', { class: 'hero-eyebrow' });
  eyebrow.textContent = s.months;
  hero.appendChild(eyebrow);

  // title — split into two halves for scroll diverge effect
  const titleWrap = el('div', { class: 'hero-title-wrap' });
  const label = s.label.toUpperCase();
  const mid = Math.ceil(label.length / 2);

  // Each char gets a span for the scatter-in animation
  const title = el('div', { class: 'hero-title', 'aria-label': s.label });
  const leftSpan = el('span', { class: 'hero-title-left', 'aria-hidden': 'true' });
  const rightSpan = el('span', { class: 'hero-title-right', 'aria-hidden': 'true' });

  label.slice(0, mid).split('').forEach((ch, i) => {
    const span = el('span', { class: 'split-char', style: `--i:${i}` });
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    leftSpan.appendChild(span);
  });
  label.slice(mid).split('').forEach((ch, i) => {
    const span = el('span', { class: 'split-char', style: `--i:${i + mid}` });
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    rightSpan.appendChild(span);
  });

  title.append(leftSpan, rightSpan);
  titleWrap.appendChild(title);
  hero.appendChild(titleWrap);

  // meta bar
  const meta = el('div', { class: 'hero-meta' });

  const taglineWrap = el('div', { class: 'line-reveal' });
  const taglineInner = el('div', { class: 'line-reveal-inner' });
  const tagline = el('p', { class: 'hero-tagline' });
  tagline.textContent = s.tagline;
  taglineInner.appendChild(tagline);
  taglineWrap.appendChild(taglineInner);

  const months = el('span', { class: 'hero-months' });
  months.textContent = s.months;

  meta.append(taglineWrap, months);
  hero.appendChild(meta);

  // intro typed
  const introBlock = el('div', { class: 'hero-intro-block' });
  const intro = el('p', {
    class: 'hero-intro',
    id: `intro-${s.id}`,
    'data-text': s.intro,
  });
  introBlock.appendChild(intro);
  hero.appendChild(introBlock);

  return hero;
}

// ── Marquee Divider ───────────────────────────────────────────

function renderMarqueeDivider(s) {
  const div = el('div', { class: 'marquee-divider' });
  const items = ['SOIL', 'WATER', 'SEED', 'COMPOST', 'REST', 'OBSERVE', 'TEND', 'RETURN'];
  const doubled = [...items, ...items];

  const track = el('div', { class: 'marquee-track' });
  doubled.forEach(word => {
    const span = el('span');
    span.textContent = word;
    const dot = el('span', { class: 'marquee-dot' });
    dot.textContent = '·';
    track.append(span, dot);
  });

  div.appendChild(track);
  return div;
}

// ── Microseasons ──────────────────────────────────────────────

function renderMicroseasons(seasonId) {
  const current = getCurrentMicroseason();
  const relevant = MICROSEASONS.filter(ms => ms.standardSeasons.includes(seasonId));

  const section = el('div', { class: 'microseason-section reveal-up', style: '--d:60' });

  // Section header
  const header = el('div', { class: 'microseason-header' });
  const kicker = el('p', { class: 'section-kicker' });
  kicker.textContent = 'Indigenous Calendar';
  const heading = el('h2', { class: 'microseason-heading' });
  heading.textContent = 'Reading the Microseasons';
  const sub = el('p', { class: 'microseason-sub' });
  sub.textContent = 'Seven periods drawn from Noongar, Wurundjeri, Dja Dja Wurrung, Kaurna and Māori seasonal knowledge — temperate SE Australia and Aotearoa New Zealand.';
  header.append(kicker, heading, sub);
  section.appendChild(header);

  // Cards for each relevant microseasonal period
  const grid = el('div', { class: 'microseason-grid' });
  relevant.forEach(ms => {
    const isCurrent = ms.id === current.id;
    const card = el('div', {
      class: `microseason-card${isCurrent ? ' is-current' : ''}`,
    });

    // Date range
    const dateStr = formatDateRange(ms.start, ms.end);
    const dateBadge = el('span', { class: 'ms-date' });
    dateBadge.textContent = dateStr;
    card.appendChild(dateBadge);

    if (isCurrent) {
      const nowPill = el('span', { class: 'ms-now-pill' });
      nowPill.textContent = 'NOW';
      card.appendChild(nowPill);
    }

    // Name
    const name = el('h3', { class: 'ms-name' });
    name.textContent = ms.name;
    card.appendChild(name);

    const subtitle = el('p', { class: 'ms-subtitle' });
    subtitle.textContent = ms.subtitle;
    card.appendChild(subtitle);

    // Heritage sources
    const heritage = el('div', { class: 'ms-heritage' });
    ms.heritage.forEach(h => {
      const tag = el('span', { class: 'ms-heritage-tag' });
      tag.innerHTML = `<em>${h.term}</em> — ${h.nation}`;
      heritage.appendChild(tag);
    });
    card.appendChild(heritage);

    // Indicators (collapsible)
    const indicators = el('ul', { class: 'ms-indicators' });
    ms.indicators.slice(0, 4).forEach(ind => {
      const li = el('li');
      li.textContent = ind;
      indicators.appendChild(li);
    });
    card.appendChild(indicators);

    // Tohu
    const tohu = el('p', { class: 'ms-tohu' });
    tohu.textContent = ms.tohu;
    card.appendChild(tohu);

    // Farming note
    const farming = el('p', { class: 'ms-farming' });
    farming.textContent = ms.farming;
    card.appendChild(farming);

    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function formatDateRange(start, end) {
  return `${MONTH_SHORT[start.month - 1]} ${start.day} — ${MONTH_SHORT[end.month - 1]} ${end.day}`;
}

// ── Body ──────────────────────────────────────────────────────

function renderBody(s) {
  const body = el('div', { class: 'season-body' });

  // Heading
  const kicker = el('p', { class: 'section-kicker reveal-up' });
  kicker.textContent = s.months;
  const heading = el('h2', { class: 'section-heading reveal-up', style: '--d:100' });
  heading.textContent = `${s.label} Practices`;
  body.append(kicker, heading);

  // Big decorative word
  const bigWrap = el('div', { class: 'big-word-wrap' });
  const big = el('div', { class: 'big-word', 'aria-hidden': 'true' });
  big.textContent = s.label.toUpperCase();
  bigWrap.appendChild(big);
  body.appendChild(bigWrap);

  // Categories — pass seasonId so images are season-specific
  const list = el('div', { class: 'categories-list' });
  s.categories.forEach((cat, i) => list.appendChild(renderCategory(cat, i, s.id)));
  body.appendChild(list);

  // Season Planner (replaces static checklist — feeds into inline Gantt + floating bar)
  body.appendChild(renderSeasonPlanner(s));

  return body;
}

function renderCategory(cat, index, seasonId) {
  const block = el('div', { class: 'category-block reveal-up', style: `--d:${index * 80}` });

  const trigger = el('button', { class: 'category-trigger', 'aria-expanded': index === 0 ? 'true' : 'false' });

  const num = el('span', { class: 'cat-number' });
  num.textContent = String(index + 1).padStart(2, '0');

  const title = el('span', { class: 'cat-title' });
  title.textContent = cat.title;

  const toggle = el('span', { class: 'cat-toggle', 'aria-hidden': 'true' });
  toggle.textContent = '+';

  trigger.append(num, title, toggle);

  const bodyEl = el('div', { class: `category-body${index === 0 ? ' is-open' : ''}` });
  if (index === 0) {
    block.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  // Inner wrapper required for grid-row accordion animation (no max-height hack)
  const bodyInner = el('div', { class: 'category-body-inner' });

  // ── Category banner image (season-specific) ───────────────────
  const imgWrap = el('div', { class: 'category-img-wrap' });
  if (cat.imageAlt) imgWrap.setAttribute('aria-label', cat.imageAlt);
  else imgWrap.setAttribute('aria-hidden', 'true');
  const img = el('img', {
    class: 'category-img',
    alt: cat.imageAlt || '',
    loading: 'lazy',
    decoding: 'async',
    'data-src': `assets/images/cat-${seasonId}-${cat.id}.jpg`,
  });
  imgWrap.appendChild(img);

  const imgLabel = el('span', { class: 'category-img-label' });
  imgLabel.textContent = cat.title;
  imgWrap.appendChild(imgLabel);
  bodyInner.appendChild(imgWrap);

  // ── Task list ─────────────────────────────────────────────────
  const taskList = el('div', { class: 'task-list' });
  cat.tasks.forEach((task, ti) => taskList.appendChild(renderTask(task, ti, seasonId, cat)));
  bodyInner.appendChild(taskList);

  bodyEl.appendChild(bodyInner);

  trigger.addEventListener('click', () => {
    const isOpen = block.classList.toggle('is-open');
    bodyEl.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) loadCategoryImg(img);
  });

  if (index === 0) loadCategoryImg(img);

  block.append(trigger, bodyEl);
  return block;
}

function loadCategoryImg(img) {
  if (img.dataset.loaded) return;
  img.dataset.loaded = '1';
  img.onload = () => img.classList.add('is-loaded');
  img.onerror = () => img.remove();   // gracefully drop missing image
  img.src = img.dataset.src;
}

function renderTask(task, index, seasonId, cat) {
  const taskId = `${seasonId}-${cat?.id || 'task'}-${index}`;
  const row = el('div', { class: 'task-row', 'data-task-id': taskId });

  // ── Plan pill button ──────────────────────────────────────────
  const planPill = el('button', {
    class: 'plan-pill',
    'aria-label': `Add "${task.title}" to plan`,
    type: 'button',
  });
  planPill.innerHTML = '<span class="plan-pill-icon">+</span><span class="plan-pill-text">Plan</span>';
  planPill.addEventListener('click', e => {
    e.stopPropagation();
    const isNowChecked = planPill.classList.toggle('is-checked');
    planPill.querySelector('.plan-pill-icon').textContent = isNowChecked ? '✓' : '+';
    planPill.querySelector('.plan-pill-text').textContent = isNowChecked ? 'Planned' : 'Plan';
    row.classList.toggle('is-planned', isNowChecked);
    row.dispatchEvent(new CustomEvent('plantask', {
      bubbles: true,
      detail: {
        taskId,
        task,
        cat: { id: cat?.id || '', title: cat?.title || '' },
        seasonId,
      },
    }));
  });

  const idx = el('span', { class: 'task-index' });
  idx.textContent = String(index + 1).padStart(2, '0');

  const content = el('div', { class: 'task-content' });

  // ── Per-task image strip ──────────────────────────────────────
  if (seasonId && cat?.id) {
    const taskImgWrap = el('div', { class: 'task-img-wrap', 'aria-hidden': 'true' });
    const taskImg = el('img', {
      class: 'task-img',
      alt: '',
      loading: 'lazy',
      decoding: 'async',
    });
    taskImg.onload  = () => taskImg.classList.add('is-loaded');
    taskImg.onerror = () => taskImgWrap.remove();
    taskImgWrap.appendChild(taskImg);
    content.appendChild(taskImgWrap);
    // Defer src to after element is in DOM
    requestAnimationFrame(() => {
      taskImg.src = `assets/images/task-${seasonId}-${cat.id}-${index}.jpg`;
    });
  }

  const title = el('h3', { class: 'task-title' });
  title.textContent = task.title;

  const chips = el('div', { class: 'task-chips' });
  if (task.timing) {
    const c = el('span', { class: 'chip chip--timing' });
    c.textContent = task.timing;
    chips.appendChild(c);
  }
  if (task.duration) {
    const c = el('span', { class: 'chip' });
    c.textContent = task.duration;
    chips.appendChild(c);
  }

  const desc = el('p', { class: 'task-desc' });
  desc.textContent = task.description || task.desc || '';

  content.append(title, chips, desc);

  if (task.tools?.length) {
    const tools = el('div', { class: 'task-tools' });
    task.tools.forEach(t => {
      const chip = el('span', { class: 'tool-chip' });
      chip.textContent = t;
      tools.appendChild(chip);
    });
    content.appendChild(tools);
  }

  if (task.tip) {
    const tip = el('div', { class: 'task-tip' });
    const tipLabel = el('span', { class: 'task-tip-label' });
    tipLabel.textContent = 'Field note';
    tip.append(tipLabel, document.createTextNode(task.tip));
    content.appendChild(tip);
  }

  content.appendChild(planPill);
  row.append(idx, content);
  return row;
}

function renderSeasonPlanner(s) {
  const section = el('div', { class: 'season-planner reveal-up', style: '--d:200' });

  // ── Section header ────────────────────────────────────────────
  const kicker = el('p', { class: 'section-kicker' });
  kicker.textContent = `${s.label} Plan`;

  const heading = el('h2', { class: 'section-heading planner-heading' });
  heading.textContent = 'Season Timeline';

  const sub = el('p', { class: 'planner-sub' });
  sub.textContent = 'Check a task above — it appears here on the timeline.';

  section.append(kicker, heading, sub);

  // ── Gantt container — filled by planner.js after init ─────────
  // planner.js scans for [data-planner-season] and renders the Gantt
  const ganttWrap = el('div', {
    class: 'planner-gantt-wrap',
    'data-planner-season': s.id,
  });
  section.appendChild(ganttWrap);

  return section;
}

function renderQuote(s) {
  // quote may be a plain string or {text, author} object
  const quoteText = typeof s.quote === 'string' ? s.quote : (s.quote?.text || '');
  const quoteAuthor = typeof s.quote === 'object' ? s.quote?.author : null;

  const section = el('div', { class: 'quote-section' });

  // Opening glyph
  const glyph = el('div', { class: 'quote-glyph', 'aria-hidden': 'true' });
  glyph.textContent = '"';
  section.appendChild(glyph);

  // Blockquote — words split for staggered reveal
  const bq = el('blockquote', { class: 'quote-text' });
  const words = quoteText.split(' ');
  words.forEach((word, i) => {
    const wrapper = el('span', { class: 'quote-word-wrap' });
    const span = el('span', {
      class: 'quote-word',
      style: `--wi:${i}`,
    });
    span.textContent = word;
    wrapper.appendChild(span);
    // Space between words (not after last)
    if (i < words.length - 1) {
      wrapper.appendChild(document.createTextNode('\u00A0'));
    }
    bq.appendChild(wrapper);
  });
  section.appendChild(bq);

  // Rule
  const rule = el('div', { class: 'quote-rule' });
  section.appendChild(rule);

  // Attribution
  if (quoteAuthor) {
    const cite = el('cite', { class: 'quote-author' });
    cite.textContent = `— ${quoteAuthor}`;
    section.appendChild(cite);
  } else {
    const tradition = el('p', { class: 'quote-tradition' });
    tradition.textContent = 'Te Ao Māori · Southern Hemisphere';
    section.appendChild(tradition);
  }

  return section;
}

// ── Util ──────────────────────────────────────────────────────

function el(tag, attrs = {}) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
