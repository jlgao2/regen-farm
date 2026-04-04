/* ============================================================
   RENDERER — Pure DOM construction from data
   ============================================================ */

/**
 * Build and return the full DOM for all seasons.
 * Called once by main.js; output inserted into #seasons-container.
 */
export function renderAllSeasons(seasons) {
  const fragment = document.createDocumentFragment();
  seasons.forEach(season => {
    fragment.appendChild(renderSeasonSection(season));
  });
  return fragment;
}

function renderSeasonSection(season) {
  const section = el('section', {
    class: `season-section${season.id === 'spring' ? ' is-active' : ''}`,
    id: `season-${season.id}`,
    'data-season': season.id,
    role: 'region',
    'aria-label': `${season.label} — ${season.months}`,
  });

  section.appendChild(renderHero(season));
  section.appendChild(renderSeasonBody(season));
  return section;
}

// ── Hero ──────────────────────────────────────────────────────

function renderHero(season) {
  const hero = el('div', { class: 'season-hero' });

  // Background
  const bg = el('div', {
    class: `hero-bg ${season.heroGradient}`,
    'aria-hidden': 'true',
  });

  const texture = el('div', { class: 'hero-texture', 'aria-hidden': 'true' });
  const overlay = el('div', { class: 'hero-overlay', 'aria-hidden': 'true' });

  // Content
  const content = el('div', { class: 'hero-content' });

  const months = el('span', { class: 'hero-months' });
  months.textContent = season.months;

  const title = el('h1', { class: 'hero-title' });
  title.textContent = season.label;

  const tagline = el('p', { class: 'hero-tagline' });
  tagline.textContent = season.tagline;

  const introWrap = el('div', { class: 'hero-intro-wrap' });
  const introEl = el('span', {
    class: 'hero-intro',
    id: `hero-intro-${season.id}`,
    'data-intro-text': season.intro,
  });
  introWrap.appendChild(introEl);

  content.append(months, title, tagline, introWrap);

  // Scroll hint
  const scrollHint = el('div', { class: 'hero-scroll-hint', 'aria-hidden': 'true' });
  scrollHint.innerHTML = `
    <span>Scroll</span>
    <svg class="scroll-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>`;

  hero.append(bg, texture, overlay, content, scrollHint);
  return hero;
}

// ── Season Body ───────────────────────────────────────────────

function renderSeasonBody(season) {
  const body = el('div', { class: 'season-body' });

  body.appendChild(renderTimeline(season));
  body.appendChild(renderCategoriesMain(season));
  body.appendChild(renderSidebar(season));
  body.appendChild(renderQuote(season));

  return body;
}

// ── Timeline ─────────────────────────────────────────────────

function renderTimeline(season) {
  const strip = el('div', { class: 'timeline-strip animate-on-scroll' });

  const header = el('div', { class: 'timeline-header' });
  const title = el('span', { class: 'timeline-title' });
  title.textContent = 'Task Timeline';
  header.appendChild(title);

  const track = el('div', { class: 'timeline-track' });
  const line = el('div', { class: 'timeline-line' });
  const items = el('div', { class: 'timeline-items' });

  // Collect all tasks with timing info
  const allTasks = [];
  season.categories.forEach(cat => {
    cat.tasks.forEach(task => {
      if (task.timing) {
        allTasks.push({ title: task.title, timing: task.timing, category: cat.id });
      }
    });
  });

  // Spread them evenly across the timeline (10% to 90%)
  allTasks.forEach((task, i) => {
    const pct = allTasks.length === 1
      ? 50
      : 10 + (i / (allTasks.length - 1)) * 80;

    const item = el('div', {
      class: 'timeline-item animate-on-scroll',
      'data-title': task.title,
      style: `left: ${pct}%; --anim-delay: ${i * 60 + 100}`,
    });

    const dot = el('div', { class: 'timeline-dot' });
    const label = el('div', { class: 'timeline-label' });
    label.textContent = task.timing;

    item.append(dot, label);
    items.appendChild(item);
  });

  track.append(line, items);
  strip.append(header, track);
  return strip;
}

// ── Categories Main ───────────────────────────────────────────

function renderCategoriesMain(season) {
  const main = el('div', { class: 'categories-main' });

  const heading = el('div', { class: 'section-heading animate-on-scroll' });
  const label = el('p', { class: 'section-label' });
  label.textContent = season.months;
  const title = el('h2', { class: 'section-title' });
  title.textContent = `${season.label} Practices`;
  heading.append(label, title);

  const grid = el('div', { class: 'categories-grid' });

  season.categories.forEach((cat, i) => {
    const card = renderCategoryCard(cat, i);
    grid.appendChild(card);
  });

  main.append(heading, grid);
  return main;
}

function renderCategoryCard(cat, index) {
  const details = el('details', {
    class: 'category-card animate-on-scroll',
    style: `--anim-delay: ${index * 80}`,
  });

  if (index === 0) details.setAttribute('open', '');

  const summary = el('summary', { class: 'card-header' });

  // Icon
  const iconWrap = el('div', { class: 'card-icon', 'aria-hidden': 'true' });
  iconWrap.innerHTML = `<svg><use href="#icon-${cat.icon}"/></svg>`;

  // Meta
  const meta = el('div', { class: 'card-meta' });
  const cardTitle = el('h3', { class: 'card-title' });
  cardTitle.textContent = cat.title;
  const count = el('p', { class: 'card-task-count' });
  count.textContent = `${cat.tasks.length} task${cat.tasks.length !== 1 ? 's' : ''}`;
  meta.append(cardTitle, count);

  // Right: badge + chevron
  const right = el('div', { class: 'card-right' });
  const badge = el('span', { class: `badge badge--${cat.priority}` });
  badge.textContent = cat.priority;
  const chevron = el('div', { class: 'card-chevron', 'aria-hidden': 'true' });
  chevron.innerHTML = `<svg><use href="#icon-chevron-down"/></svg>`;
  right.append(badge, chevron);

  summary.append(iconWrap, meta, right);

  // Body
  const body = el('div', { class: 'card-body' });
  const taskList = el('div', { class: 'task-list' });

  cat.tasks.forEach(task => {
    taskList.appendChild(renderTaskItem(task));
  });

  body.appendChild(taskList);
  details.append(summary, body);
  return details;
}

function renderTaskItem(task) {
  const item = el('div', { class: 'task-item' });

  // Header row
  const header = el('div', { class: 'task-header' });
  const title = el('h4', { class: 'task-title' });
  title.textContent = task.title;

  const pills = el('div', { class: 'task-pills' });
  if (task.timing) {
    const tPill = el('span', { class: 'task-pill' });
    tPill.textContent = task.timing;
    pills.appendChild(tPill);
  }
  if (task.duration) {
    const dPill = el('span', { class: 'task-pill' });
    dPill.textContent = task.duration;
    pills.appendChild(dPill);
  }

  header.append(title, pills);

  // Description
  const desc = el('p', { class: 'task-description' });
  desc.textContent = task.description;

  item.append(header, desc);

  // Tools
  if (task.tools && task.tools.length) {
    const toolsWrap = el('div', { class: 'task-tools' });
    task.tools.forEach(tool => {
      const tag = el('span', { class: 'tool-tag' });
      tag.innerHTML = `<svg width="11" height="11"><use href="#icon-tool"/></svg>${tool}`;
      toolsWrap.appendChild(tag);
    });
    item.appendChild(toolsWrap);
  }

  // Tip
  if (task.tip) {
    const tip = el('div', { class: 'task-tip' });
    tip.innerHTML = `<strong>Pro Tip</strong>${task.tip}`;
    item.appendChild(tip);
  }

  return item;
}

// ── Sidebar / Checklist ───────────────────────────────────────

function renderSidebar(season) {
  const sidebar = el('aside', {
    class: 'season-sidebar animate-on-scroll',
    style: '--anim-delay: 200',
  });

  const card = el('div', { class: 'checklist-card' });
  const title = el('h3', { class: 'checklist-title' });
  title.textContent = `${season.label} Checklist`;

  const items = el('ul', { class: 'checklist-items', role: 'list' });

  season.checklist.forEach((text, i) => {
    const li = el('li', {
      class: 'checklist-item',
      role: 'listitem',
      tabindex: '0',
    });

    const box = el('div', { class: 'checklist-box', 'aria-hidden': 'true' });
    box.innerHTML = `<svg><use href="#icon-check"/></svg>`;

    const label = el('span', { class: 'checklist-text' });
    label.textContent = text;

    li.append(box, label);

    // Toggle checked state
    const toggle = () => li.classList.toggle('is-checked');
    li.addEventListener('click', toggle);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    items.appendChild(li);
  });

  card.append(title, items);
  sidebar.appendChild(card);
  return sidebar;
}

// ── Quote Block ───────────────────────────────────────────────

function renderQuote(season) {
  const block = el('blockquote', {
    class: 'quote-block animate-on-scroll',
    cite: 'seasonal-quote',
  });

  const mark = el('span', { class: 'quote-mark', 'aria-hidden': 'true' });
  mark.textContent = '\u201C';

  const text = el('p', { class: 'quote-text' });
  text.textContent = season.quote.text;

  const author = el('footer', { class: 'quote-author' });
  author.textContent = season.quote.author;

  block.append(mark, text, author);
  return block;
}

// ── Utility ───────────────────────────────────────────────────

function el(tag, attrs = {}) {
  const element = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    element.setAttribute(key, val);
  });
  return element;
}
