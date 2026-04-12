/* ── Data loader — merges base seasons with region-specific deltas ── */

import { SEASONS as BASE } from './data_base.js';
import { AU_DELTAS }       from './data_au.js';
import { NZ_DELTAS }       from './data_nz.js';

export function buildSeasons(region) {
  if (region === 'au')  return applyDeltas(BASE, AU_DELTAS);
  if (region === 'nz')  return applyDeltas(BASE, NZ_DELTAS);
  return BASE;  // 'au-nz' combined — base content unchanged
}

// ── Merge engine ──────────────────────────────────────────────

function applyDeltas(base, deltas) {
  // Deep-clone base so we never mutate the imported constant
  const seasons = base.map(s => ({
    ...s,
    categories: s.categories.map(c => ({
      ...c,
      tasks: [...c.tasks],
    })),
  }));

  for (const delta of deltas) {
    const season = seasons.find(s => s.id === delta.seasonId);
    if (!season) continue;

    for (const catDelta of (delta.categories || [])) {
      const existing = season.categories.find(c => c.id === catDelta.id);

      if (!existing) {
        // Completely new category — append to season
        season.categories.push({ ...catDelta });
        continue;
      }

      // Existing category — merge tasks
      for (const td of (catDelta.tasks || [])) {
        if (td.replaces) {
          // Replace the first task whose title contains the keyword
          const idx = existing.tasks.findIndex(t =>
            t.title.toLowerCase().includes(td.replaces.toLowerCase())
          );
          const task = omit(td, 'replaces');
          if (idx !== -1) existing.tasks[idx] = task;
          else existing.tasks.push(task);

        } else if (td.inject) {
          const { after, before, position } = td.inject;
          const task = omit(td, 'inject');

          if (position === 'first') {
            existing.tasks.unshift(task);
          } else if (after) {
            const idx = existing.tasks.findIndex(t =>
              t.title.toLowerCase().includes(after.toLowerCase())
            );
            existing.tasks.splice(idx !== -1 ? idx + 1 : existing.tasks.length, 0, task);
          } else if (before) {
            const idx = existing.tasks.findIndex(t =>
              t.title.toLowerCase().includes(before.toLowerCase())
            );
            existing.tasks.splice(idx !== -1 ? idx : 0, 0, task);
          } else {
            existing.tasks.push(task); // position: 'last' or unspecified
          }
        } else {
          // No merge marker — append
          existing.tasks.push(td);
        }
      }
    }
  }

  return seasons;
}

function omit(obj, ...keys) {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result;
}
