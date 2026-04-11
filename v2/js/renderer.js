/* ── Renderer — builds DOM from data, no side effects ── */

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
  section.appendChild(renderBody(s));
  section.appendChild(renderQuote(s));
  return section;
}

// ── Hero ──────────────────────────────────────────────────────

function renderHero(s) {
  const hero = el('div', { class: 'season-hero' });

  // bg image
  hero.appendChild(el('div', { class: 'hero-image', 'aria-hidden': 'true' }));

  // eyebrow
  const eyebrow = el('div', { class: 'hero-eyebrow' });
  eyebrow.textContent = `${s.id.toUpperCase()} · AU/NZ`;
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

  // Categories
  const list = el('div', { class: 'categories-list' });
  s.categories.forEach((cat, i) => list.appendChild(renderCategory(cat, i)));
  body.appendChild(list);

  // Checklist
  body.appendChild(renderChecklist(s));

  return body;
}

function renderCategory(cat, index) {
  const block = el('div', { class: 'category-block reveal-up', style: `--d:${index * 80}` });

  const trigger = el('button', { class: 'category-trigger', 'aria-expanded': index === 0 ? 'true' : 'false' });

  const num = el('span', { class: 'cat-number' });
  num.textContent = String(index + 1).padStart(2, '0');

  const title = el('span', { class: 'cat-title' });
  title.textContent = cat.title;

  const priority = el('span', {
    class: `cat-priority priority-${cat.priority}`,
  });
  priority.textContent = cat.priority;

  const toggle = el('span', { class: 'cat-toggle', 'aria-hidden': 'true' });
  toggle.textContent = '+';

  trigger.append(num, title, priority, toggle);

  const bodyEl = el('div', { class: `category-body${index === 0 ? ' is-open' : ''}` });
  if (index === 0) {
    block.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  const taskList = el('div', { class: 'task-list' });
  cat.tasks.forEach((task, ti) => taskList.appendChild(renderTask(task, ti)));
  bodyEl.appendChild(taskList);

  trigger.addEventListener('click', () => {
    const isOpen = block.classList.toggle('is-open');
    bodyEl.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  block.append(trigger, bodyEl);
  return block;
}

function renderTask(task, index) {
  const row = el('div', { class: 'task-row' });

  const idx = el('span', { class: 'task-index' });
  idx.textContent = String(index + 1).padStart(2, '0');

  const content = el('div', { class: 'task-content' });

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
  desc.textContent = task.desc;

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

  row.append(idx, content);
  return row;
}

function renderChecklist(s) {
  const section = el('div', { class: 'checklist-section reveal-up', style: '--d:200' });

  const kicker = el('p', { class: 'section-kicker' });
  kicker.textContent = `${s.label} Checklist`;
  const heading = el('h3', { class: 'section-heading', style: 'font-size: clamp(1.4rem, 3vw, 2.2rem); margin-bottom: 1.5rem;' });
  heading.textContent = 'Essential Tasks';

  const grid = el('div', { class: 'checklist-grid' });
  s.checklist.forEach(text => {
    const item = el('div', { class: 'check-item', tabindex: '0', role: 'checkbox', 'aria-checked': 'false' });
    const box = el('div', { class: 'check-box', 'aria-hidden': 'true' });
    const label = el('span', { class: 'check-label' });
    label.textContent = text;
    item.append(box, label);

    const toggle = () => {
      const checked = item.classList.toggle('is-checked');
      item.setAttribute('aria-checked', String(checked));
    };
    item.addEventListener('click', toggle);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    grid.appendChild(item);
  });

  section.append(kicker, heading, grid);
  return section;
}

function renderQuote(s) {
  const section = el('div', { class: 'quote-section' });

  const text = el('blockquote', { class: 'quote-text reveal-up' });
  text.textContent = `"${s.quote.text}"`;

  const author = el('cite', { class: 'quote-author reveal-up', style: '--d:150' });
  author.textContent = `— ${s.quote.author}`;

  section.append(text, author);
  return section;
}

// ── Util ──────────────────────────────────────────────────────

function el(tag, attrs = {}) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
