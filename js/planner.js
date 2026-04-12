/* ── Planner v2 — inline Gantt + full-year timeline + supplies ── */

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
  'fire-prep':   { short:'FIRE',    color:'#c85a28' },
};

const MONTH_MAP = {
  january:1, february:2, march:3, april:4, may:5, june:6,
  july:7, august:8, september:9, october:10, november:11, december:12,
  jan:1, feb:2, mar:3, apr:4, jun:6, jul:7, aug:8,
  sep:9, sept:9, oct:10, nov:11, dec:12,
};

const SEASON_ORDER     = ['autumn','winter','spring','summer'];
const CAT_ORDER        = ['soil-prep','planting','composting','cover-crops','water','fire-prep'];
const YEAR_MONTH_ORDER = [3,4,5,6,7,8,9,10,11,12,1,2]; // Mar → Feb (SH year)

// ── State ─────────────────────────────────────────────────────

const selectedTasks   = new Map(); // taskId → { task, cat, seasonId }
const completedTasks  = new Set(); // taskIds ticked off in checklist
const checkedSupplies = new Set(); // supply item keys marked as obtained
const inlineContainers = new Map();
let panelEl        = null;
let masterGanttWrap = null;
let masterSectionEl = null;

// ── Init ──────────────────────────────────────────────────────

export function initPlanner() {
  document.querySelectorAll('[data-planner-season]').forEach(el => {
    inlineContainers.set(el.dataset.plannerSeason, el);
    renderGantt(el.dataset.plannerSeason, el);
  });

  // Master plan section (full-year view)
  masterSectionEl = document.createElement('div');
  masterSectionEl.className = 'master-plan';
  masterSectionEl.id = 'master-plan';

  const masterInner = document.createElement('div');
  masterInner.className = 'master-plan-body';
  masterSectionEl.appendChild(masterInner);

  const masterKicker = document.createElement('p');
  masterKicker.className = 'section-kicker';
  masterKicker.textContent = 'Master Plan';

  const masterHeading = document.createElement('h2');
  masterHeading.className = 'section-heading';
  masterHeading.textContent = 'Full Year Timeline';

  const masterSub = document.createElement('p');
  masterSub.className = 'planner-sub';
  masterSub.textContent = 'All planned tasks across the full growing year — sorted Mar → Feb.';

  masterGanttWrap = document.createElement('div');
  masterGanttWrap.className = 'planner-gantt-wrap';

  masterInner.append(masterKicker, masterHeading, masterSub, masterGanttWrap);

  const root = document.getElementById('seasons-root');
  if (root) root.appendChild(masterSectionEl);

  // Floating bottom bar
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
        <span class="planner-bar-sub">planned · season ↑</span>
      </button>
      <div class="planner-actions">
        <button class="planner-btn planner-btn--ghost" id="planner-fullyear">Full year ↑</button>
        <button class="planner-btn planner-btn--ghost" id="planner-clear">Clear</button>
        <button class="planner-btn planner-btn--accent" id="planner-export">Export ↓</button>
      </div>
    </div>
  `;
  document.body.appendChild(panelEl);

  document.getElementById('planner-jump').addEventListener('click', scrollToActivePlan);
  document.getElementById('planner-fullyear').addEventListener('click', scrollToMasterPlan);
  document.getElementById('planner-clear').addEventListener('click', clearAll);
  document.getElementById('planner-export').addEventListener('click', exportMarkdown);
  document.addEventListener('plantask', onPlanTask);
  updatePanel();

  new MutationObserver(_syncAudioBottom)
    .observe(panelEl, { attributes: true, attributeFilter: ['class'] });
}

export function setPlannerSeason() {}

// ── Task events ───────────────────────────────────────────────

function onPlanTask(e) {
  const { taskId, task, cat, seasonId } = e.detail;

  if (selectedTasks.has(taskId)) {
    selectedTasks.delete(taskId);
    completedTasks.delete(taskId);
  } else {
    selectedTasks.set(taskId, { task, cat, seasonId });
  }

  const isSelected = selectedTasks.has(taskId);
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
  refreshAll();
}

function scrollToActivePlan() {
  const activeSeason = SEASON_ORDER.find(sid =>
    [...selectedTasks.values()].some(v => v.seasonId === sid)
  ) || document.body.dataset.season || 'autumn';
  inlineContainers.get(activeSeason)
    ?.closest('.season-planner')
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollToMasterPlan() {
  masterSectionEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  completedTasks.clear();
  checkedSupplies.clear();
  updatePanel();
  refreshAll();
}

function _syncAudioBottom() {
  requestAnimationFrame(() => {
    const audio = document.querySelector('.audio-player');
    if (!audio) return;
    audio.style.bottom = panelEl?.classList.contains('has-tasks') ? 'calc(48px + 1.5rem)' : '';
  });
}

function updatePanel() {
  if (!panelEl) return;
  const count = selectedTasks.size;
  const countEl = document.getElementById('planner-count');
  if (countEl) countEl.textContent = `${count} task${count !== 1 ? 's' : ''}`;
  panelEl.classList.toggle('has-tasks', count > 0);
  if (masterSectionEl) masterSectionEl.classList.toggle('has-tasks', count > 0);
  _syncAudioBottom();
}

// ── Render ────────────────────────────────────────────────────

function refreshAll() {
  inlineContainers.forEach((el, sid) => renderGantt(sid, el));
  if (masterGanttWrap) renderYearGantt(masterGanttWrap);
}

// Per-season 3-month gantt
function renderGantt(seasonId, container) {
  container.innerHTML = '';
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg) return;

  const tasks = [...selectedTasks.entries()]
    .filter(([_, v]) => v.seasonId === seasonId)
    .map(([id, v]) => ({ id, ...v }));

  if (tasks.length === 0) {
    container.appendChild(emptyState('Check tasks above to map them to this timeline'));
    return;
  }

  const gantt = buildGanttShell(`${cfg.name} task timeline`);

  // Header
  const { header, monthsRow } = buildGanttHeader();
  cfg.labels.forEach((_, i) => {
    const band = document.createElement('div');
    band.className = `gantt-band${i % 2 === 1 ? ' gantt-band--alt' : ''}`;
    monthsRow.appendChild(band);
  });
  const monthLabels = document.createElement('div');
  monthLabels.className = 'gantt-month-labels';
  cfg.labels.forEach(lbl => {
    const m = document.createElement('span');
    m.textContent = lbl;
    monthLabels.appendChild(m);
  });
  monthsRow.appendChild(monthLabels);
  gantt.appendChild(header);

  // Rows
  const todayPos = getTodayPosition(seasonId);
  let firstRow = true;
  CAT_ORDER.forEach((catId, rowIdx) => {
    const catTasks = tasks.filter(t => t.cat.id === catId);
    if (!catTasks.length) return;
    const meta = CAT_META[catId] || { short: catId.slice(0,6).toUpperCase(), color: 'var(--accent)' };
    const row = buildGanttRow(meta, rowIdx);
    const track = buildTrack([33.33, 66.66]);

    if (todayPos !== null && firstRow) {
      track.appendChild(todayLine(todayPos));
      firstRow = false;
    } else { firstRow = false; }

    catTasks.forEach(({ id, task, cat }, ti) =>
      track.appendChild(buildDot(id, task, cat, parsePosition(task.timing, seasonId), ti))
    );
    row.appendChild(track);
    gantt.appendChild(row);
  });

  if (todayPos !== null) gantt.appendChild(todayBadge(todayPos, '5rem'));
  container.appendChild(gantt);
  container.appendChild(buildChecklist(seasonId, tasks));
  container.appendChild(buildSupplies(tasks));
}

// Full-year 12-month gantt
function renderYearGantt(container) {
  container.innerHTML = '';
  const allTasks = [...selectedTasks.entries()].map(([id, v]) => ({ id, ...v }));

  if (allTasks.length === 0) {
    container.appendChild(emptyState('Add tasks from any season above to see your full year plan here'));
    return;
  }

  const gantt = buildGanttShell('Full year task timeline');
  gantt.classList.add('gantt--year');

  // Header — 4 season bands + 12 month labels
  const { header, monthsRow } = buildGanttHeader();
  SEASON_ORDER.forEach(sid => {
    const band = document.createElement('div');
    band.className = `gantt-band gantt-season-band gantt-season-band--${sid}`;
    monthsRow.appendChild(band);
  });
  const monthLabels = document.createElement('div');
  monthLabels.className = 'gantt-month-labels gantt-month-labels--12';
  ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'].forEach(lbl => {
    const m = document.createElement('span');
    m.textContent = lbl;
    monthLabels.appendChild(m);
  });
  monthsRow.appendChild(monthLabels);
  gantt.appendChild(header);

  // Category rows
  const todayPos = getTodayPositionYearly();
  let firstRow = true;
  CAT_ORDER.forEach((catId, rowIdx) => {
    const catTasks = allTasks.filter(t => t.cat.id === catId);
    if (!catTasks.length) return;
    const meta = CAT_META[catId] || { short: catId.slice(0,6).toUpperCase(), color: 'var(--accent)' };
    const row = buildGanttRow(meta, rowIdx);

    // 11 ticks, bold at season boundaries
    const tickPcts = Array.from({ length: 11 }, (_, i) => (i + 1) / 12 * 100);
    const track = buildTrack(tickPcts, pct => pct % 25 < 0.5);

    if (todayPos !== null && firstRow) {
      track.appendChild(todayLine(todayPos));
      firstRow = false;
    } else { firstRow = false; }

    catTasks.forEach(({ id, task, cat, seasonId }, ti) =>
      track.appendChild(buildDot(id, task, cat, parsePositionYearly(task.timing, seasonId), ti, seasonId))
    );
    row.appendChild(track);
    gantt.appendChild(row);
  });

  // Season label bar
  const seasonBar = document.createElement('div');
  seasonBar.className = 'gantt-season-labels';
  SEASON_ORDER.forEach(sid => {
    const lbl = document.createElement('span');
    lbl.className = `gantt-season-label gantt-season-label--${sid}`;
    lbl.textContent = SEASON_CONFIG[sid].name;
    seasonBar.appendChild(lbl);
  });
  gantt.appendChild(seasonBar);

  if (todayPos !== null) gantt.appendChild(todayBadge(todayPos, '5.5rem'));
  container.appendChild(gantt);
  container.appendChild(buildChecklist(null, allTasks));   // null = all-seasons mode
  container.appendChild(buildSupplies(allTasks));
}

// ── DOM helpers ───────────────────────────────────────────────

function emptyState(msg) {
  const d = document.createElement('div');
  d.className = 'gantt-empty';
  d.innerHTML = `
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
    <span>${msg}</span>`;
  return d;
}

function buildGanttShell(ariaLabel) {
  const g = document.createElement('div');
  g.className = 'gantt';
  g.setAttribute('role', 'img');
  g.setAttribute('aria-label', ariaLabel);
  return g;
}

function buildGanttHeader() {
  const header = document.createElement('div');
  header.className = 'gantt-header';
  const labelSpace = document.createElement('div');
  labelSpace.className = 'gantt-label-col';
  header.appendChild(labelSpace);
  const monthsRow = document.createElement('div');
  monthsRow.className = 'gantt-months';
  header.appendChild(monthsRow);
  return { header, monthsRow };
}

function buildGanttRow(meta, rowIdx) {
  const row = document.createElement('div');
  row.className = 'gantt-row';
  row.style.setProperty('--cat-clr', meta.color);
  row.style.setProperty('--row-idx', rowIdx);
  const label = document.createElement('div');
  label.className = 'gantt-label';
  const dot = document.createElement('span');
  dot.className = 'gantt-label-dot';
  label.append(dot, document.createTextNode(meta.short));
  row.appendChild(label);
  return row;
}

// tickPcts: array of percentages; boldFn: optional fn(pct) → bool for stronger tick
function buildTrack(tickPcts, boldFn) {
  const track = document.createElement('div');
  track.className = 'gantt-track';
  tickPcts.forEach(pct => {
    const tick = document.createElement('div');
    tick.className = `gantt-tick${boldFn && boldFn(pct) ? ' gantt-tick--season' : ''}`;
    tick.style.left = `${pct}%`;
    track.appendChild(tick);
  });
  return track;
}

function todayLine(pos) {
  const d = document.createElement('div');
  d.className = 'gantt-today';
  d.style.left = `${pos * 100}%`;
  return d;
}

function todayBadge(pos, labelOffset) {
  const wrap = document.createElement('div');
  wrap.className = 'gantt-today-wrap';
  const pct = Math.round(pos * 100);
  wrap.style.left = `calc(${labelOffset} + ${pct}% * (100% - ${labelOffset}) / 100%)`;
  const badge = document.createElement('span');
  badge.className = 'gantt-today-badge';
  badge.textContent = 'TODAY';
  wrap.appendChild(badge);
  return wrap;
}

function buildDot(id, task, cat, pos, animIdx, seasonId = null) {
  const dot = document.createElement('button');
  dot.className = `gantt-dot${completedTasks.has(id) ? ' is-done' : ''}`;
  dot.style.left = `${pos * 100}%`;
  dot.style.setProperty('--dot-delay', `${animIdx * 60}ms`);
  dot.setAttribute('aria-label', task.title);

  const core = document.createElement('span');
  core.className = 'gantt-dot-core';
  dot.appendChild(core);

  const lbl = document.createElement('span');
  lbl.className = 'gantt-dot-label';
  const descSnip = (task.description || task.desc || '').slice(0, 100);
  lbl.innerHTML = [
    `<strong>${task.title}</strong>`,
    task.timing  ? `<span class="gantt-dot-timing">${task.timing}</span>` : '',
    seasonId     ? `<span class="gantt-dot-season">${SEASON_CONFIG[seasonId]?.name || ''}</span>` : '',
    descSnip     ? `<span class="gantt-dot-desc">${descSnip}${(task.description||task.desc||'').length > 100 ? '…' : ''}</span>` : '',
  ].filter(Boolean).join('');
  dot.appendChild(lbl);

  dot.addEventListener('click', () => {
    document.querySelector(`[data-task-id="${id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  return dot;
}

// ── Checklist ─────────────────────────────────────────────────

function buildChecklist(seasonId, tasks) {
  const isAll = seasonId === null;
  const section = document.createElement('div');
  section.className = 'plan-checklist';

  const hdr = document.createElement('p');
  hdr.className = 'plan-checklist-header';
  hdr.textContent = isAll ? 'Full year plan' : 'Your plan';
  section.appendChild(hdr);

  const sorted = isAll
    ? [...tasks].sort((a, b) =>
        parsePositionYearly(a.task.timing, a.seasonId) -
        parsePositionYearly(b.task.timing, b.seasonId))
    : [...tasks].sort((a, b) =>
        parsePosition(a.task.timing, seasonId) -
        parsePosition(b.task.timing, seasonId));

  const list = document.createElement('ul');
  list.className = 'plan-checklist-list';

  sorted.forEach(({ id, task, cat, seasonId: sid }) => {
    const isDone = completedTasks.has(id);
    const item = document.createElement('li');
    item.className = `plan-cl-item${isDone ? ' is-done' : ''}`;

    const btn = document.createElement('button');
    btn.className = `plan-cl-check${isDone ? ' is-checked' : ''}`;
    btn.type = 'button';
    btn.setAttribute('aria-label', isDone ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`);
    btn.addEventListener('click', () => {
      completedTasks[completedTasks.has(id) ? 'delete' : 'add'](id);
      refreshAll();
    });

    const meta = document.createElement('div');
    meta.className = 'plan-cl-meta';
    const title = document.createElement('span');
    title.className = 'plan-cl-title';
    title.textContent = task.title;

    const chips = document.createElement('div');
    chips.className = 'plan-cl-chips';

    if (isAll && sid) {
      const sc = document.createElement('span');
      sc.className = `plan-cl-chip plan-cl-chip--season plan-cl-chip--${sid}`;
      sc.textContent = SEASON_CONFIG[sid]?.name || sid;
      chips.appendChild(sc);
    }
    if (cat?.title) {
      const cc = document.createElement('span');
      cc.className = 'plan-cl-chip';
      cc.textContent = cat.title;
      chips.appendChild(cc);
    }
    if (task.timing) {
      const tc = document.createElement('span');
      tc.className = 'plan-cl-chip plan-cl-chip--timing';
      tc.textContent = task.timing;
      chips.appendChild(tc);
    }

    meta.append(title, chips);
    item.append(btn, meta);
    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}

// ── Supplies ──────────────────────────────────────────────────

function buildSupplies(tasks) {
  const seen = new Map(); // lowercase → display string
  tasks.forEach(({ task }) =>
    (task.tools || []).forEach(tool => {
      const key = tool.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, tool.trim());
    })
  );
  if (!seen.size) return document.createDocumentFragment();

  const items = [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  const section = document.createElement('div');
  section.className = 'plan-supplies plan-checklist';

  const hdr = document.createElement('p');
  hdr.className = 'plan-checklist-header';
  hdr.textContent = `Supplies needed · ${items.length} item${items.length !== 1 ? 's' : ''}`;
  section.appendChild(hdr);

  const list = document.createElement('ul');
  list.className = 'plan-checklist-list';

  items.forEach(([key, item]) => {
    const isHave = checkedSupplies.has(key);
    const li = document.createElement('li');
    li.className = `plan-cl-item${isHave ? ' is-done' : ''}`;

    const btn = document.createElement('button');
    btn.className = `plan-cl-check${isHave ? ' is-checked' : ''}`;
    btn.type = 'button';
    btn.setAttribute('aria-label', `${item} — ${isHave ? 'mark as needed' : 'mark as obtained'}`);
    btn.addEventListener('click', () => {
      checkedSupplies[checkedSupplies.has(key) ? 'delete' : 'add'](key);
      refreshAll();
    });

    const meta = document.createElement('div');
    meta.className = 'plan-cl-meta';
    const titleEl = document.createElement('span');
    titleEl.className = 'plan-cl-title plan-supply-title';
    titleEl.textContent = item;
    meta.appendChild(titleEl);
    li.append(btn, meta);
    list.appendChild(li);
  });

  section.appendChild(list);
  return section;
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

function parsePositionYearly(timingStr, seasonId) {
  const lower = (timingStr || '').toLowerCase();
  let month = null;
  for (const [name, num] of Object.entries(MONTH_MAP)) {
    if (new RegExp(`\\b${name}\\b`).test(lower)) { month = num; break; }
  }
  if (month === null) month = SEASON_CONFIG[seasonId]?.months[0] ?? 3;
  const yearIdx = YEAR_MONTH_ORDER.indexOf(month);
  if (yearIdx === -1) return 0;
  let offset = 0.5;
  if (/\bearly\b/.test(lower))            offset = 0.15;
  else if (/\bmid(?:dle)?\b/.test(lower)) offset = 0.5;
  else if (/\blate\b/.test(lower))        offset = 0.85;
  return Math.max(0, Math.min(1, (yearIdx + offset) / 12));
}

function getTodayPosition(seasonId) {
  const cfg = SEASON_CONFIG[seasonId];
  if (!cfg) return null;
  const today = new Date();
  const monthIdx = cfg.months.indexOf(today.getMonth() + 1);
  if (monthIdx === -1) return null;
  return Math.max(0, Math.min(1, (monthIdx + (today.getDate() - 1) / 31) / 3));
}

function getTodayPositionYearly() {
  const today = new Date();
  const yearIdx = YEAR_MONTH_ORDER.indexOf(today.getMonth() + 1);
  if (yearIdx === -1) return null;
  return Math.max(0, Math.min(1, (yearIdx + (today.getDate() - 1) / 31) / 12));
}

// ── Export ────────────────────────────────────────────────────

function exportMarkdown() {
  if (!selectedTasks.size) return;
  const lines = [];
  const today = new Date().toLocaleDateString('en-AU', { year:'numeric', month:'long', day:'numeric' });
  lines.push('# Farm Task Plan\n');
  lines.push(`**Generated:** ${today}  `);
  lines.push(`**Tasks planned:** ${selectedTasks.size}\n`);
  lines.push('---');

  SEASON_ORDER.forEach(sid => {
    const cfg = SEASON_CONFIG[sid];
    const tasks = [...selectedTasks.values()].filter(v => v.seasonId === sid);
    if (!tasks.length) return;
    lines.push(`\n## ${cfg.name} — ${cfg.labels[0]}–${cfg.labels[2]}\n`);
    lines.push('```');
    lines.push(buildAsciiTimeline(sid, tasks));
    lines.push('```\n');
    [...tasks]
      .sort((a, b) => parsePosition(a.task.timing, sid) - parsePosition(b.task.timing, sid))
      .forEach(({ task, cat }) => {
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

  // Supplies section in export
  const allSupplies = new Map();
  selectedTasks.forEach(({ task }) =>
    (task.tools || []).forEach(tool => {
      const key = tool.trim().toLowerCase();
      if (!allSupplies.has(key)) allSupplies.set(key, tool.trim());
    })
  );
  if (allSupplies.size) {
    lines.push('\n---\n\n## Supplies Needed\n');
    [...allSupplies.values()].sort().forEach(item => lines.push(`- [ ] ${item}`));
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown; charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'farm-plan.md';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function buildAsciiTimeline(seasonId, taskValues) {
  const cfg = SEASON_CONFIG[seasonId];
  const W = 49;
  const bar = Array(W).fill('─');
  bar[0] = '├'; bar[W-1] = '┤';
  const m1 = Math.round((W-1)/3), m2 = Math.round((W-1)*2/3);
  bar[m1] = '┼'; bar[m2] = '┼';
  const sorted = [...taskValues].sort((a,b) =>
    parsePosition(a.task.timing, seasonId) - parsePosition(b.task.timing, seasonId));
  const usedCols = new Set([0, m1, m2, W-1]);
  const placements = [];
  sorted.forEach((v, i) => {
    const sym = circledDigit(i+1);
    let col = Math.round(parsePosition(v.task.timing, seasonId) * (W-1));
    while (usedCols.has(col) && col < W-1) col++;
    usedCols.add(col); bar[col] = sym;
    placements.push({ sym, task: v.task, col });
  });
  const hdr = cfg.labels[0].padEnd(m1) + cfg.labels[1].padEnd(m2-m1) + cfg.labels[2];
  const legend = placements.sort((a,b) => a.col-b.col)
    .map(p => `  ${p.sym} ${p.task.title}${p.task.timing ? '  ['+p.task.timing+']' : ''}`)
    .join('\n');
  return `${hdr}\n${bar.join('')}\n\n${legend}`;
}

function circledDigit(n) {
  return n >= 1 && n <= 20 ? String.fromCharCode(0x2460 + n - 1) : `(${n})`;
}
