/* ── Regions — AU / NZ state management ── */

export const REGIONS = {
  'au-nz': {
    id:    'au-nz',
    label: 'AU + NZ',
    sub:   'Combined — Temperate SE Australia & Aotearoa',
  },
  'au': {
    id:    'au',
    label: 'Australia',
    sub:   'Temperate SE — fire-aware content',
  },
  'nz': {
    id:    'nz',
    label: 'Aotearoa NZ',
    sub:   'Kūmara, maramataka & volcanic soils',
  },
};

const KEY = 'regen-region';

export function getRegion() {
  const stored = localStorage.getItem(KEY);
  return REGIONS[stored] ? stored : 'au-nz';
}

export function setRegion(id) {
  if (!REGIONS[id]) return;
  localStorage.setItem(KEY, id);
  location.reload();
}

export function initRegion() {
  const id = getRegion();
  document.body.setAttribute('data-region', id);
  return id;
}
