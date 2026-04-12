/* ── Planner v2 — inline Gantt timeline + unified season plan ── */

// ── Config ────────────────────────────────────────────────────

const SEASON_CONFIG = {
  autumn: { months:[3,4,5],  labels:['Mar','Apr','May'], name:'Autumn' },
  winter: { months:[6,7,8],  labels:['Jun','Jul','Aug'], name:'Winter' },
  spring: { months:[9,10,11],labels:['Sep','Oct','Nov'], name:'Spring' },
  summer: { months:[12,1,2], labels:['Dec','Jan','Feb'], name:'Summer' },
};

const CAT_META = {
  'soil-prep':   { short:'SOIL',    color:'#c0844a' },
  'planting':    { short:'PLANT',   color:'#5aaa72' },
  'composting':  { short:'COMPOST', color:'#c8a84a' },
  'cover-crops': { short:'CROPS',   color:'#8ab878' },
  'water':       { short:'WATER',   color:'#5a96c8' },
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
const inlineContainers = new Map(); // seasonId → HTMLElement
let panelEl = null;

// ── Init ──────────────────────────────────────────────────────

export function initPlanner() {
  // Register all inline gantt containers that renderer placed in the DOM
  document.querySelectorAll('[data-planner-season]').forEach(el => {
    inlineContainers.set(el.dataset.plannerSeason, el);
    renderGantt(el.dataset.plannerSeason, el);
  });

  // Build minimal floating bottom bar (count + export only; gantt lives inline)
  panelEl = document.createElement('div');
  panelEl.className = 'planner-panel';
  panelEl.id = 'planner-panel';
  panelEl.innerHTML = `
    <div class="planner-bar">
      <button class="planner-bar-link" id="planner-jump" aria-label="Jump to season timeline">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
          <rect x="2" y="3" width="12" height="2" rx="0.5"/>
          <rect x="2" y="7" width="8"  height="2" rx="0.5"/>
          <rect x="2" y="11" width="10" height="2" rx="0.5"/>
        </svg>
        <span class="planner-count" id="planner-count">0 tasks</span>
        <span class="planner-bar-sub">planned · view timeline ↑</span>
      </button>
      <div class="planner-actions">
        <button class="planner-btn planner-btn--ghost" id="planner-clear">Clear</button>
        <button class="planner-btn planner-btn--accent" id="planner-export">Export ↓</button>
      </div>
    </div>
  `;
  document.body.appendChild(panelEl);

  document.getElementById('planner-jump').addEventListener('click', scrollToActivePlan);
  document.getElementById('planner-clear').addEventListener('click', clearAll);
  document.getElementById('planner-export').addEventListener('click', exportMarkdown);
  document.addEventListener('plantask', onPlanTask);
  updatePanel();
}

// Keep for API compat with main.js seasonchange listener
export function setPlannerSeason() {}

// ── Task events ───────────────────────────────────────────────

function onPlanTask(e) {
  const { taskId, task, cat, seasonId } = e.detail;

  if (selectedTasks.has(taskId)) {
    selectedTasks.delete(taskId);
  } else {
    selectedTasks.set(taskId, { task, cat, seasonId });
  }

  const isSelected = selectedTasks.has(taskId);

  // Sync the plan pill UI in the accordion
  const row = document.querySelector(`[data-task-id="${taskId}"]`);
  if (row) {
    const pill = row.querySelector('.plan-pill');
    if (pill) {
      pill.classList.toggle('is-checked', isSelected);
      const icon = pill.querySelector('.plan-pill-icon');
      const text = pill.querySelector('.plan-pill-text');
      if (icon) icon.textContent = isSelected ? '✓' : '+';
      if (text) text.textContent = isSelected ? 'Planned' : 'Plan';
    }
    row.classList.toggle('is-planned', isSelected);
  }

  updatePanel();
  refreshAllGantts();
}

function scrollToActivePlan() {
  // Find the first season that has selected tasks and scroll to its inline gantt
  const activeSeason = SEASON_ORDER.find(sid =>
    [...selectedTasks.values()].some(v => v.seasonId === sid)
  ) || document.body.dataset.season || 'autumn';

  const container = inlineContainers.get(activeSeason);
  container?.closest('.season-planner')
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearAll() {
  selectedTasks.forEach((_, id) => {
    const row = document.querySelector(`[data-task-id="${id}"]`);
    if (row) {
      const pill = row.querySelector('.plan-pill');
      if (pill) {
        pill.classList.remove('is-checked');
        const icon = pill.querySelector('.plan-pill-icon');
        const text = pill.querySelector('.plan-pill-text');
        if (icon) icon.textContent = '+';
        if (text) text.textContent = 'Plan';
      }
      row.classList.remove('is-planned');
    }
  });
  selectedTasks.clear();
  updatePanel();
  refreshAllGantts();
}

function updatePanel() {
  if (!panelEl) return;
  const count = selectedTasks.size;
  const countEl = document.getElementById('planner-count');
  if (countEl) countEl.textContent = `${count} task${count !== 1 ? 's' : ''}`;
  panelEl.classList.toggle('has-tasks', count > 0);
  // Push audio player above the planner bar when it's visible
  const audio = document.querySelector('.audio-player');
  if (audio) audio.style.bottom = count > 0 ? 'calc(48px + 1.5rem)' : '';
}

// ── Gantt ─────────────────────────────────────────────────────

function refreshAllGantts() {
  inlineContainers.forEach((el, sid) => renderGantt(sid, el));
}

function renderGantt(seasonId, container) {
  container.innerHTML = '';
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg) return;

  const tasks = [...selectedTasks.values()].filter(v => v.seasonId === seasonId);

  if (tasks.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'gantt-empty';
    empty.innerHTML = `
      <span class="gantt-empty-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="16" cy="16" r="13"/>
          <line x1="16" y1="10" x2="16" y2="17"/>
          <line x1="8" y1="16" x2="24" y2="16" stroke-dasharray="2 2"/>
          <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="22" cy="16" r="1.5" fill="currentColor"/>
        </svg>
      </span>
      <span>Check tasks above to map them to this timeline</span>
    `;
    container.appendChild(empty);
    return;
  }

  const gantt = document.createElement('div');
  gantt.className = 'gantt';
  gantt.setAttribute('role', 'img');
  gantt.setAttribute('aria-label', `${cfg.name} task timeline`);

  // ── Month header ──────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'gantt-header';

  const labelSpace = document.createElement('div');
  labelSpace.className = 'gantt-label-col';
  header.appendChild(labelSpace);

  const monthsRow = document.createElement('div');
  monthsRow.className = 'gantt-months';

  // Background month bands
  cfg.labels.forEach((lbl, i) => {
    const band = document.createElement('div');
    band.className = `gantt-band${i % 2 === 1 ? ' gantt-band--alt' : ''}`;
    monthsRow.appendChild(band);
  });

  // Month labels overlay
  const monthLabels = document.createElement('div');
  monthLabels.className = 'gantt-month-labels';
  cfg.labels.forEach(lbl => {
    const m = document.createElement('span');
    m.textContent = lbl;
    monthLabels.appendChild(m);
  });
  monthsRow.appendChild(monthLabels);
  header.appendChild(monthsRow);
  gantt.appendChild(header);

  // ── Category rows ─────────────────────────────────────────────
  const catOrder = ['soil-prep','planting','composting','cover-crops','water'];
  const todayPos = getTodayPosition(seasonId);

  catOrder.forEach((catId, rowIdx) => {
    const catTasks = tasks.filter(v => v.cat.id === catId);
    if (catTasks.length === 0) return;

    const meta = CAT_META[catId] || { short: catId.slice(0,6).toUpperCase(), color: 'var(--accent)' };

    const row = document.createElement('div');
    row.className = 'gantt-row';
    row.style.setProperty('--cat-clr', meta.color);
    row.style.setProperty('--row-idx', rowIdx);

    // Label
    const label = document.createElement('div');
    label.className = 'gantt-label';
    const dot = document.createElement('span');
    dot.className = 'gantt-label-dot';
    label.appendChild(dot);
    label.appendChild(document.createTextNode(meta.short));
    row.appendChild(label);

    // Track
    const track = document.createElement('div');
    track.className = 'gantt-track';

    // Month dividers
    [33.33, 66.66].forEach(pct => {
      const tick = document.createElement('div');
      tick.className = 'gantt-tick';
      tick.style.left = `${pct}%`;
      track.appendChild(tick);
    });

    // Today line (only on the first row that renders, avoids duplication)
    if (todayPos !== null && rowIdx === catOrder.findIndex(c => tasks.some(t => t.cat.id === c))) {
      const today = document.createElement('div');
      today.className = 'gantt-today';
      today.style.left = `${todayPos * 100}%`;
      track.appendChild(today);
    }

    // Task dots with staggered animation
    catTasks.forEach(({ task, cat }, ti) => {
      const pos = parsePosition(task.timing, seasonId);
      const taskRowId = findTaskId(task, cat, seasonId);

      const dot = document.createElement('button');
      dot.className = 'gantt-dot';
      dot.style.left = `${pos * 100}%`;
      dot.style.setProperty('--dot-delay', `${ti * 60}ms`);
      dot.setAttribute('aria-label', task.title);

      const dotCore = document.createElement('span');
      dotCore.className = 'gantt-dot-core';
      dot.appendChild(dotCore);

      const dotLabel = document.createElement('span');
      dotLabel.className = 'gantt-dot-label';
      dotLabel.innerHTML = `<strong>${task.title}</strong><br>${task.timing || ''}`;
      dot.appendChild(dotLabel);

      dot.addEventListener('click', () => {
        const el = taskRowId ? document.querySelector(`[data-task-id="${taskRowId}"]`) : null;
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      track.appendChild(dot);
    });

    row.appendChild(track);
    gantt.appendChild(row);
  });

  // ── Today legend ──────────────────────────────────────────────
  if (todayPos !== null) {
    const todayLegend = document.createElement('div');
    todayLegend.className = 'gantt-today-legend';
    todayLegend.style.left = `calc(5rem + ${todayPos * 100}% * (100% - 5rem) / 100%)`;

    const todayWrap = document.createElement('div');
    todayWrap.className = 'gantt-today-wrap';
    const pct = Math.round(todayPos * 100);
    todayWrap.style.left = `calc(5rem + ${pct}% * (100% - 5rem) / 100%)`;

    const todayBadge = document.createElement('span');
    todayBadge.className = 'gantt-today-badge';
    todayBadge.textContent = 'TODAY';
    todayWrap.appendChild(todayBadge);
    gantt.appendChild(todayWrap);
  }

  container.appendChild(gantt);
}

function findTaskId(task, cat, seasonId) {
  for (const [id, v] of selectedTasks.entries()) {
    if (v.seasonId === seasonId && v.cat.id === cat.id &&
        v.task.title === task.title) {
      return id;
    }
  }
  return null;
}

// ── Position maths ────────────────────────────────────────────

function parsePosition(timingStr, seasonId) {
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg || !timingStr) return 0.5;
  const lower = timingStr.toLowerCase();

  let month = null;
  for (const [name, num] of Object.entries(MONTH_MAP)) {
    if (new RegExp(`\\b${name}\\b`).test(lower)) { month = num; break; }
  }
  if (month === null) return 0.5;

  const monthIdx = cfg.months.indexOf(month);
  if (monthIdx === -1) return 0.5;

  let offset = 0.5;
  if (/\bearly\b/.test(lower))            offset = 0.15;
  else if (/\bmid(?:dle)?\b/.test(lower)) offset = 0.5;
  else if (/\blate\b/.test(lower))        offset = 0.85;

  return Math.max(0, Math.min(1, (monthIdx + offset) / 3));
}

function getTodayPosition(seasonId) {
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg) return null;
  const today = new Date();
  const month = today.getMonth() + 1;
  const day   = today.getDate();
  const monthIdx = cfg.months.indexOf(month);
  if (monthIdx === -1) return null;
  return Math.max(0, Math.min(1, (monthIdx + (day - 1) / 31) / 3));
}

// ── Markdown export ───────────────────────────────────────────

function exportMarkdown() {
  if (selectedTasks.size === 0) return;

  const lines = [];
  const today = new Date().toLocaleDateString('en-AU', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  lines.push('# Farm Task Plan\n');
  lines.push(`**Generated:** ${today}  `);
  lines.push(`**Tasks planned:** ${selectedTasks.size}\n`);
  lines.push('---');

  SEASON_ORDER.forEach(sid => {
    const cfg = SEASON_CONFIG[sid];
    const tasks = [...selectedTasks.values()].filter(v => v.seasonId === sid);
    if (tasks.length === 0) return;

    lines.push(`\n## ${cfg.name} — ${cfg.labels[0]}–${cfg.labels[2]}\n`);
    lines.push('```');
    lines.push(buildAsciiTimeline(sid, tasks));
    lines.push('```\n');

    const sorted = [...tasks].sort((a, b) =>
      parsePosition(a.task.timing, sid) - parsePosition(b.task.timing, sid)
    );

    sorted.forEach(({ task, cat }) => {
      lines.push(`### ${task.title}`);
      if (cat?.title)        lines.push(`**Category:** ${cat.title}  `);
      if (task.timing)       lines.push(`**Timing:** ${task.timing}  `);
      if (task.duration)     lines.push(`**Duration:** ${task.duration}  `);
      lines.push('');
      const desc = task.description || task.desc;
      if (desc)              lines.push(`${desc}\n`);
      if (task.tools?.length) lines.push(`**Tools:** ${task.tools.join(', ')}\n`);
      if (task.tip)          lines.push(`> **Field note:** ${task.tip}\n`);
    });
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown; charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'farm-plan.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildAsciiTimeline(seasonId, taskValues) {
  const cfg = SEASON_CONFIG[seasonId];
  const W = 49;
  const bar = Array(W).fill('─');
  bar[0] = '├'; bar[W - 1] = '┤';
  const m1 = Math.round((W - 1) / 3);
  const m2 = Math.round((W - 1) * 2 / 3);
  bar[m1] = '┼'; bar[m2] = '┼';

  const sorted = [...taskValues]
    .sort((a, b) => parsePosition(a.task.timing, seasonId) - parsePosition(b.task.timing, seasonId));

  const usedCols = new Set([0, m1, m2, W - 1]);
  const placements = [];

  sorted.forEach((v, i) => {
    const sym = circledDigit(i + 1);
    let col = Math.round(parsePosition(v.task.timing, seasonId) * (W - 1));
    while (usedCols.has(col) && col < W - 1) col++;
    usedCols.add(col);
    bar[col] = sym;
    placements.push({ sym, task: v.task, col });
  });

  const hdr = cfg.labels[0].padEnd(m1) + cfg.labels[1].padEnd(m2 - m1) + cfg.labels[2];
  const legend = placements
    .sort((a, b) => a.col - b.col)
    .map(p => `  ${p.sym} ${p.task.title}${p.task.timing ? '  [' + p.task.timing + ']' : ''}`)
    .join('\n');

  return `${hdr}\n${bar.join('')}\n\n${legend}`;
}

function circledDigit(n) {
  return n >= 1 && n <= 20 ? String.fromCharCode(0x2460 + n - 1) : `(${n})`;
}
