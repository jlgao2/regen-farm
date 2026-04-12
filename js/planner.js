/* ── Planner — task selection, seasonal timeline, and markdown export ── */

// ── Season config ─────────────────────────────────────────────

const SEASON_CONFIG = {
  autumn: { months: [3,4,5],  labels: ['Mar','Apr','May'], name: 'Autumn' },
  winter: { months: [6,7,8],  labels: ['Jun','Jul','Aug'], name: 'Winter' },
  spring: { months: [9,10,11],labels: ['Sep','Oct','Nov'], name: 'Spring' },
  summer: { months: [12,1,2], labels: ['Dec','Jan','Feb'], name: 'Summer' },
};

const MONTH_MAP = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12,
  jan:1, feb:2, mar:3, apr:4, jun:6, jul:7, aug:8,
  sep:9, sept:9, oct:10, nov:11, dec:12,
};

const SEASON_ORDER = ['autumn','winter','spring','summer'];

// ── State ─────────────────────────────────────────────────────

const selectedTasks = new Map(); // taskId → { task, cat, seasonId }
let currentSeasonId = 'autumn';
let panelEl = null;

// ── Timeline positioning ──────────────────────────────────────

function parsePosition(timingStr, seasonId) {
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg || !timingStr) return 0.5;

  const lower = timingStr.toLowerCase();

  // Find a month name in the string
  let month = null;
  for (const [name, num] of Object.entries(MONTH_MAP)) {
    // Use word boundary check to avoid 'mar' matching 'march', etc.
    const re = new RegExp(`\\b${name}\\b`);
    if (re.test(lower)) { month = num; break; }
  }

  if (month === null) return 0.5;

  // Find index of this month in season's month array
  const monthIdx = cfg.months.indexOf(month);
  if (monthIdx === -1) return 0.5;

  // Intra-month offset from early/mid/late qualifiers
  let offset = 0.5;
  if (/\bearly\b/.test(lower))       offset = 0.15;
  else if (/\bmid(?:dle)?\b/.test(lower)) offset = 0.5;
  else if (/\blate\b/.test(lower))   offset = 0.85;

  return Math.max(0, Math.min(1, (monthIdx + offset) / 3));
}

// ── Public API ────────────────────────────────────────────────

export function setPlannerSeason(seasonId) {
  currentSeasonId = seasonId;
  if (panelEl) renderTimeline();
}

export function initPlanner() {
  // Build panel DOM
  panelEl = document.createElement('div');
  panelEl.className = 'planner-panel';
  panelEl.id = 'planner-panel';
  panelEl.setAttribute('role', 'complementary');
  panelEl.setAttribute('aria-label', 'Task planner');
  panelEl.innerHTML = `
    <div class="planner-bar">
      <button class="planner-toggle" id="planner-toggle" aria-expanded="false" aria-controls="planner-body">
        <svg class="planner-chevron-icon" viewBox="0 0 16 16" fill="none"
             stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <polyline points="3,10 8,5 13,10"/>
        </svg>
        <span class="planner-bar-label">
          <span class="planner-count" id="planner-count">0 tasks</span>
          <span class="planner-bar-sub">planned this season</span>
        </span>
      </button>
      <div class="planner-actions">
        <button class="planner-btn planner-btn--ghost" id="planner-clear">Clear</button>
        <button class="planner-btn planner-btn--accent" id="planner-export">Export ↓</button>
      </div>
    </div>
    <div class="planner-body" id="planner-body" hidden>
      <div class="planner-timeline" id="planner-timeline"></div>
    </div>
  `;
  document.body.appendChild(panelEl);

  document.getElementById('planner-toggle').addEventListener('click', togglePanel);
  document.getElementById('planner-clear').addEventListener('click', clearAll);
  document.getElementById('planner-export').addEventListener('click', exportMarkdown);

  // Listen for task-toggle events dispatched by renderer
  document.addEventListener('plantask', onPlanTask);

  updatePanel();
}

// ── Event handling ────────────────────────────────────────────

function onPlanTask(e) {
  const { taskId, task, cat, seasonId } = e.detail;

  if (selectedTasks.has(taskId)) {
    selectedTasks.delete(taskId);
  } else {
    selectedTasks.set(taskId, { task, cat, seasonId });
  }

  // Update checkbox appearance
  const row = document.querySelector(`[data-task-id="${taskId}"]`);
  if (row) {
    const isSelected = selectedTasks.has(taskId);
    row.querySelector('.planner-check')?.classList.toggle('is-checked', isSelected);
    row.classList.toggle('is-planned', isSelected);
  }

  updatePanel();
}

// ── Panel control ─────────────────────────────────────────────

function togglePanel() {
  const btn = document.getElementById('planner-toggle');
  const body = document.getElementById('planner-body');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  const willOpen = !isOpen;

  btn.setAttribute('aria-expanded', String(willOpen));
  body.hidden = !willOpen;
  panelEl.classList.toggle('is-open', willOpen);

  if (willOpen) renderTimeline();
}

function clearAll() {
  selectedTasks.forEach((_, id) => {
    const row = document.querySelector(`[data-task-id="${id}"]`);
    if (row) {
      row.querySelector('.planner-check')?.classList.remove('is-checked');
      row.classList.remove('is-planned');
    }
  });
  selectedTasks.clear();
  // Close panel
  const btn = document.getElementById('planner-toggle');
  const body = document.getElementById('planner-body');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (body) body.hidden = true;
  panelEl.classList.remove('is-open');
  updatePanel();
}

function updatePanel() {
  if (!panelEl) return;

  const count = selectedTasks.size;
  const countEl = document.getElementById('planner-count');
  if (countEl) countEl.textContent = `${count} task${count !== 1 ? 's' : ''}`;

  panelEl.classList.toggle('has-tasks', count > 0);

  // Re-render if panel is open
  const body = document.getElementById('planner-body');
  if (body && !body.hidden) renderTimeline();
}

// ── Timeline rendering ────────────────────────────────────────

function renderTimeline() {
  const container = document.getElementById('planner-timeline');
  if (!container) return;
  container.innerHTML = '';

  const cfg = SEASON_CONFIG[currentSeasonId];
  if (!cfg) return;

  // Tasks in current season
  const seasonTasks = [...selectedTasks.entries()]
    .filter(([, v]) => v.seasonId === currentSeasonId)
    .map(([id, v]) => ({ id, ...v }));

  // Other season count
  const otherCount = selectedTasks.size - seasonTasks.length;

  // ── Month header ──────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'tl-header';
  cfg.labels.forEach(lbl => {
    const m = document.createElement('span');
    m.className = 'tl-month';
    m.textContent = lbl;
    header.appendChild(m);
  });
  container.appendChild(header);

  // ── Bar + dots ────────────────────────────────────────────────
  const barWrap = document.createElement('div');
  barWrap.className = 'tl-bar-wrap';

  const bar = document.createElement('div');
  bar.className = 'tl-bar';

  // Month dividers at 33.33% and 66.66%
  ['33.33%', '66.66%'].forEach(left => {
    const tick = document.createElement('div');
    tick.className = 'tl-tick';
    tick.style.left = left;
    bar.appendChild(tick);
  });

  // Place dots
  const catColors = ['soil-prep','planting','composting','cover-crops','water'];
  seasonTasks.forEach(({ id, task, cat }) => {
    const pos = parsePosition(task.timing, currentSeasonId);
    const colorIdx = catColors.indexOf(cat.id);

    const dot = document.createElement('button');
    dot.className = 'tl-dot';
    dot.style.left = `${pos * 100}%`;
    dot.dataset.catIdx = colorIdx >= 0 ? colorIdx : 0;
    dot.setAttribute('aria-label', `${task.title} — click to scroll to task`);
    dot.title = `${cat.title}: ${task.title}\n${task.timing || ''}`;

    const tooltip = document.createElement('span');
    tooltip.className = 'tl-tooltip';
    tooltip.textContent = task.title;
    dot.appendChild(tooltip);

    dot.addEventListener('click', () => {
      // Close panel and scroll to task
      const taskEl = document.querySelector(`[data-task-id="${id}"]`);
      if (!taskEl) return;
      const btn = document.getElementById('planner-toggle');
      const body = document.getElementById('planner-body');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (body) body.hidden = true;
      panelEl?.classList.remove('is-open');
      setTimeout(() => taskEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
    });

    bar.appendChild(dot);
  });

  barWrap.appendChild(bar);
  container.appendChild(barWrap);

  // ── Legend (compact task list) ────────────────────────────────
  if (seasonTasks.length > 0) {
    const legend = document.createElement('div');
    legend.className = 'tl-legend';

    seasonTasks
      .sort((a, b) => parsePosition(a.task.timing, currentSeasonId) - parsePosition(b.task.timing, currentSeasonId))
      .forEach(({ task, cat }) => {
        const row = document.createElement('div');
        row.className = 'tl-legend-row';
        row.innerHTML = `
          <span class="tl-legend-cat">${cat.title}</span>
          <span class="tl-legend-name">${task.title}</span>
          <span class="tl-legend-timing">${task.timing || ''}</span>
        `;
        legend.appendChild(row);
      });

    container.appendChild(legend);
  } else {
    const empty = document.createElement('p');
    empty.className = 'tl-empty';
    empty.textContent = 'No tasks planned for this season. Check tasks above to add them.';
    container.appendChild(empty);
  }

  // ── Cross-season note ─────────────────────────────────────────
  if (otherCount > 0) {
    const note = document.createElement('p');
    note.className = 'tl-note';
    note.textContent = `+ ${otherCount} task${otherCount !== 1 ? 's' : ''} planned in other seasons (included in export)`;
    container.appendChild(note);
  }
}

// ── Markdown export ───────────────────────────────────────────

function exportMarkdown() {
  if (selectedTasks.size === 0) return;

  const lines = [];
  const today = new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });

  lines.push('# Farm Task Plan\n');
  lines.push(`**Generated:** ${today}  `);
  lines.push(`**Tasks planned:** ${selectedTasks.size}\n`);
  lines.push('---\n');

  SEASON_ORDER.forEach(sid => {
    const cfg = SEASON_CONFIG[sid];
    const tasks = [...selectedTasks.values()].filter(v => v.seasonId === sid);
    if (tasks.length === 0) return;

    lines.push(`\n## ${cfg.name} — ${cfg.labels[0]}–${cfg.labels[2]}\n`);

    // ASCII timeline
    const timelineStr = buildAsciiTimeline(sid, tasks);
    lines.push('```');
    lines.push(timelineStr);
    lines.push('```\n');

    // Task details sorted by timeline position
    const sorted = [...tasks].sort((a, b) =>
      parsePosition(a.task.timing, sid) - parsePosition(b.task.timing, sid)
    );

    sorted.forEach(({ task, cat }) => {
      lines.push(`### ${task.title}`);
      if (cat?.title) lines.push(`**Category:** ${cat.title}  `);
      if (task.timing)    lines.push(`**Timing:** ${task.timing}  `);
      if (task.duration)  lines.push(`**Duration:** ${task.duration}  `);
      lines.push('');
      if (task.description) lines.push(`${task.description}\n`);
      if (task.tools?.length) lines.push(`**Tools:** ${task.tools.join(', ')}\n`);
      if (task.tip) lines.push(`> **Field note:** ${task.tip}\n`);
    });
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown; charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'farm-plan.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── ASCII timeline builder ────────────────────────────────────

function buildAsciiTimeline(seasonId, taskValues) {
  const cfg = SEASON_CONFIG[seasonId];
  const W = 49;  // total chars, 3 spans of ~16 each

  // Build the bar array
  const bar = Array(W).fill('─');
  bar[0] = '├';
  bar[W - 1] = '┤';
  const m1 = Math.round((W - 1) / 3);
  const m2 = Math.round((W - 1) * 2 / 3);
  bar[m1] = '┼';
  bar[m2] = '┼';

  // Sort by position
  const sorted = taskValues
    .map((v, i) => ({ ...v, origIdx: i }))
    .sort((a, b) => parsePosition(a.task.timing, seasonId) - parsePosition(b.task.timing, seasonId));

  const usedCols = new Set([0, m1, m2, W - 1]);
  const placements = [];

  sorted.forEach((v, i) => {
    const sym = circledDigit(i + 1);
    let col = Math.round(parsePosition(v.task.timing, seasonId) * (W - 1));
    // Nudge right to avoid structural markers
    while (usedCols.has(col) && col < W - 1) col++;
    usedCols.add(col);
    bar[col] = sym;
    placements.push({ sym, task: v.task, cat: v.cat, col });
  });

  // Month header — pad each to its column width
  const header = cfg.labels[0].padEnd(m1)
    + cfg.labels[1].padEnd(m2 - m1)
    + cfg.labels[2];

  const barLine = bar.join('');

  const legend = placements
    .sort((a, b) => a.col - b.col)
    .map(p => {
      const timing = p.task.timing ? `  [${p.task.timing}]` : '';
      return `  ${p.sym} ${p.task.title}${timing}`;
    })
    .join('\n');

  return `${header}\n${barLine}\n\n${legend}`;
}

function circledDigit(n) {
  if (n >= 1 && n <= 20) return String.fromCharCode(0x2460 + n - 1); // ①–⑳
  return `(${n})`;
}
