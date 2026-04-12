/* ============================================================
   MICROSEASONS — Indigenous + phenological seasonal framework
   for temperate SE Australia & Aotearoa New Zealand

   Sources:
   - Noongar six-season calendar (Nyoongar, SW WA)
   - Wurundjeri seven-season calendar (Kulin Nation, Victoria)
   - Māori maramataka (lunar-seasonal calendar)
   - Dja Dja Wurrung seasonal indicators (Central Victoria)
   - Kaurna calendar (Adelaide Plains)
   ============================================================ */

export const MICROSEASONS = [
  {
    id: 'birak-raumati',
    name: 'Birak · Raumati',
    subtitle: 'First-summer heat',
    start: { month: 12, day: 1 },
    end:   { month: 2,  day: 14 },
    standardSeasons: ['summer'],
    heritage: [
      { term: 'Birak', nation: 'Noongar', meaning: 'first summer — season of the young' },
      { term: 'Raumati', nation: 'Māori', meaning: 'summer — governed by Rehua, star of abundance' },
    ],
    indicators: [
      'Soil temp 10 cm exceeds 20 °C',
      'Cicadas call in warm spells',
      'Pohutukawa in red coastal bloom (NZ)',
      'Zamia palms flower white (WA)',
      'Hot easterlies; nor\'westers (NZ)',
      'Young animals now independent',
    ],
    tohu: 'Rehua (Antares) dominates the evening sky — Māori star of summer abundance',
    farming: 'Peak irrigation and mulching. Harvest warm-season crops at full maturity. No new plantings — focus on water retention, shade cloth, and firebreak maintenance. Kūmara at full development (NZ).',
    accent: '#c8722a',
  },
  {
    id: 'iuk',
    name: 'Iuk',
    subtitle: 'The eel season — summer breaks',
    start: { month: 2,  day: 15 },
    end:   { month: 4,  day: 14 },
    standardSeasons: ['summer', 'autumn'],
    heritage: [
      { term: 'Iuk', nation: 'Wurundjeri', meaning: 'eel season — summer\'s equinox cooling begins' },
      { term: 'Poutū-te-rangi', nation: 'Māori', meaning: 'the crops are now harvested' },
    ],
    indicators: [
      'First consistent dew returns to mornings',
      'Days and nights equalise (equinox ~Mar 20)',
      'Eels migrate downstream (AU and NZ rivers)',
      'Kahikatea berries ripen (NZ)',
      'Manna Gum flowers attract possums and honeyeaters',
      'Red Flowering Gum blooms rust-red (WA, Djeran signal)',
      'Soil temp falling through 18 °C',
    ],
    tohu: 'Eels (Iuk/Tuna) migrate downstream — the river\'s great pulse marks summer\'s end',
    farming: 'Last harvest of warm-season crops. Plant garlic, autumn brassicas, and overwintering greens. Sow green manures. Begin compost builds. Observe water systems before autumn rains. Ferment KNF inputs while temperatures remain warm.',
    accent: '#b86c24',
  },
  {
    id: 'makuru-paenga',
    name: 'Makuru · Paenga',
    subtitle: 'The breaking rains — harvest completed',
    start: { month: 4,  day: 15 },
    end:   { month: 6,  day: 14 },
    standardSeasons: ['autumn'],
    heritage: [
      { term: 'Makuru', nation: 'Noongar', meaning: 'the wet and fertile season' },
      { term: 'Paenga-whāwhā', nation: 'Māori', meaning: 'all straw stacked at the plantation borders' },
    ],
    indicators: [
      'Autumn break rainfall >25 mm wets soil to sowing depth',
      'Soil temp drops below 15 °C — warm-season growth stalls',
      'Fungi and mushrooms emerge in visible flushes',
      'Scarlet Banksia in bloom (SW WA)',
      'Black Swans congregate on wetlands to nest',
      'Matariki stars approaching the dawn horizon (NZ)',
      'First frosts in elevated sites (Vic highlands, Canterbury)',
    ],
    tohu: 'Mushrooms emerging from soil — the fungal kingdom awakens as bacteria give way to fungi',
    farming: 'Plant winter crops immediately after the autumn break. Establish winter pasture and cover crops. Apply compost and lime to resting beds. Sow broad beans, peas, and winter brassicas into warming-wet soil. Celebrate harvest completion.',
    accent: '#a86030',
  },
  {
    id: 'waring-hotoke',
    name: 'Waring · Hōtoke',
    subtitle: 'Deep winter — the wombat cold',
    start: { month: 6,  day: 15 },
    end:   { month: 8,  day: 7  },
    standardSeasons: ['winter'],
    heritage: [
      { term: 'Waring', nation: 'Wurundjeri', meaning: 'wombat season — long cold and rain; the storytelling time' },
      { term: 'Hōtoke', nation: 'Māori', meaning: 'winter — Matariki rises and the new year is read in the stars' },
    ],
    indicators: [
      'Matariki / Puanga rise at dawn (~late June) — Māori New Year',
      'Soil temp at 10 cm below 10 °C',
      'Heavy frosts on tablelands (Vic, Canterbury Plains, NZ inland)',
      'Deciduous trees fully bare',
      'Silver Wattle budding toward end of period',
      'Wombats active and visible foraging at dusk',
      'Koalas beginning to bellow at night (transitional signal)',
    ],
    tohu: 'Matariki rises at dawn — clarity of the stars forecasts the season ahead: bright = abundant, hazy = cold',
    farming: 'Rest the soil. No direct field sowing. Maintain overwintering crops under protection. Build compost heaps for spring. Repair tools and infrastructure. Cold-stratify tree seeds. Read the sky — Matariki forecast for the season ahead.',
    accent: '#6a9cc0',
  },
  {
    id: 'djilba-guling',
    name: 'Djilba · Guling',
    subtitle: 'The orchid-wattle awakening',
    start: { month: 8,  day: 8  },
    end:   { month: 9,  day: 21 },
    standardSeasons: ['winter', 'spring'],
    heritage: [
      { term: 'Djilba', nation: 'Noongar', meaning: 'conception season — pink wildflowers, the transitional warming' },
      { term: 'Guling', nation: 'Wurundjeri', meaning: 'orchid season — wattles burst gold, native bees return' },
    ],
    indicators: [
      'Silver and Golden Wattle in full flower (SE Aus, Aug–Sep)',
      'Native orchids blooming across both countries',
      'Kōwhai opening yellow flowers (NZ, Aug–Sep)',
      'Pīpīwharauroa (Shining Cuckoo) heard in NZ — 4-note whistle',
      'Native bees re-emerging from winter',
      'Soil temp at 10 cm crossing 8–10 °C',
      'Migratory shearwaters arriving (WA coast)',
      'Still frost risk — monitor night temperatures',
    ],
    tohu: 'Kōwhai in flower (NZ) and Wattle in gold (AU) — the land\'s announcement that soil is ready to receive seed',
    farming: 'Start seeds under cover: tomatoes, peppers, cucurbits in trays. Transplant brassicas into ground on warm days. Top-dress pastures. Plant bare-root fruit trees and shelter-belt stock into moist soil. Prune and shape woody perennials.',
    accent: '#5aaa72',
  },
  {
    id: 'kambarang-mahuru',
    name: 'Kambarang · Mahuru',
    subtitle: 'The blossoming earth',
    start: { month: 9,  day: 22 },
    end:   { month: 11, day: 7  },
    standardSeasons: ['spring'],
    heritage: [
      { term: 'Kambarang', nation: 'Noongar', meaning: 'season of birth and flowers — the yellow season' },
      { term: 'Mahuru', nation: 'Māori', meaning: 'the earth warms; herbage returns; Tāne-mahuta breathes life into Papatūānuku' },
    ],
    indicators: [
      'Equinox (Sep 22–23) — days now longer than nights',
      'Kangaroo Paw, Banksia, and native orchids peak (WA)',
      'Magpies swooping (territorial nesting, SE Aus)',
      'Kōwhai seed pods forming (NZ)',
      'Whitebait (Inanga) run peaks in NZ rivers',
      'Soil temp consistently above 10 °C in lowland sites',
      'Last frost dates passing (most coastal/lowland sites clear by Oct)',
      'Yellow Box and Red Ironbark honey-flow begins (SE Aus)',
    ],
    tohu: 'Pīpīwharauroa (Shining Cuckoo) in full song — the Pacific migrant announces active planting season',
    farming: 'Transplant warm-season seedlings into ground after last frost risk. Direct-sow beans, corn, and summer crops. Kūmara into sprouting beds (NZ). Active pasture rotation begins. Inoculate legumes with rhizobial inoculant. Intensive weed management — spring flush is rapid.',
    accent: '#5aaa72',
  },
  {
    id: 'buath-gurru-whiringa',
    name: 'Buath Gurru · Whiringa',
    subtitle: 'Grass-flower summer threshold',
    start: { month: 11, day: 8  },
    end:   { month: 11, day: 30 },
    standardSeasons: ['spring', 'summer'],
    heritage: [
      { term: 'Buath Gurru', nation: 'Wurundjeri', meaning: 'grass-flowering season — seed harvest; grass parrots active' },
      { term: 'Whiringa-ā-rangi', nation: 'Māori', meaning: 'summer has come; the sky is summer; Rehua climbs' },
    ],
    indicators: [
      'Native grasses flower and set seed in paddocks',
      'Grass parrots and gang-gangs active in canopy',
      'Soil temp at 10 cm exceeds 18 °C consistently',
      'Rehua (Antares) climbing the evening sky (NZ)',
      'Christmas Tree (Nuytsia floribunda) in orange-yellow bloom (WA)',
      'Thunder-storm season beginning (SA, Vic)',
      'Pohutukawa beginning to redden coastally (NZ)',
      'High fire risk begins in SE Aus',
    ],
    tohu: 'Grass seed in the wind and Pohutukawa colouring — the tipping point into full summer; act before the heat locks in',
    farming: 'Transplant last warm-season crops. Direct-sow fast-maturing summer varieties. Establish water systems and shade structures before peak heat arrives. Slash and roll green manures. Maximise soil cover — no bare ground enters summer. Begin regular deep irrigation.',
    accent: '#d4833a',
  },
];

// ── Current microseasonal period ──────────────────────────────

export function getCurrentMicroseason() {
  const now   = new Date();
  const month = now.getMonth() + 1;  // 1–12
  const day   = now.getDate();

  for (const ms of MICROSEASONS) {
    if (isInPeriod(month, day, ms.start, ms.end)) return ms;
  }
  // Wrap-around: Dec 15–Nov 30 gap → default to birak-raumati
  return MICROSEASONS[0];
}

function isInPeriod(month, day, start, end) {
  const d    = month * 100 + day;
  const s    = start.month * 100 + start.day;
  const e    = end.month   * 100 + end.day;

  // Handle year wrap (Dec start → Feb end)
  if (s > e) return d >= s || d <= e;
  return d >= s && d <= e;
}
