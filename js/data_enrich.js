/* ============================================================
   DATA ENRICHMENT — Microseasons + Category image metadata
   Sourced from:
     • Māori Maramataka (lunar-solar calendar, Aotearoa NZ)
     • Kulin Nation / Wurundjeri 7-season calendar (SE Australia)
     • Gunaikurnai & Palawa ecological markers (Vic, Tas)
     • Soil temperature thresholds (temperate AU/NZ)
     • Phenological markers: kangaroo grass, mānuka, pōhutukawa,
       silver wattle, Matariki (Pleiades), Rehua (Antares/Scorpius)
   ============================================================ */

/* ── MICROSEASONS (reference only — not exported here) ────────
   The full microseason framework (7 cross-season periods based on
   Noongar, Wurundjeri, Māori Maramataka, Dja Dja Wurrung and Kaurna
   calendars) lives in microseasons.js — imported directly by the
   renderer. The 6-per-season breakdown below is kept as a reference
   for the generate_guide.py pipeline.

   Seasons: Birak·Raumati, Iuk, Makuru·Paenga, Waring·Hōtoke,
            Djilba·Guling, Kambarang·Mahuru, Buath Gurru·Whiringa
   ──────────────────────────────────────────────────────────── */

// Reference only (not exported) — see microseasons.js for live data
const _MICROSEASON_REFERENCE = {

  autumn: [
    {
      name: 'Poutū-te-rangi',
      subtitle: 'Harvest Peak',
      dateRange: 'Mar 1–15',
      soilTemp: '15–20°C',
      keyIndicator: 'Kangaroo grass seed heads fully mature (brown/black awns); pōhutukawa still flowering on coastal headlands',
      farmingFocus: "Peak harvest; collect seed; assess summer's success; begin cover crop planning",
    },
    {
      name: 'Paenga-whāwhā',
      subtitle: 'Straw & Storage',
      dateRange: 'Mar 15–Apr 10',
      soilTemp: '12–18°C',
      keyIndicator: 'Taro and kūmara harvest peaks; highest rainfall begins; manna gum flowering ends',
      farmingFocus: 'Crop residue management; mulch beds; plant autumn brassicas; begin winter greens',
    },
    {
      name: 'Warinj',
      subtitle: 'Cooling Transition',
      dateRange: 'Apr 10–May 1',
      soilTemp: '10–15°C',
      keyIndicator: 'Cool misty mornings consistent; wombat activity increases; myna birds depart',
      farmingFocus: 'Last winter crop transplants; heavy mulching; livestock to shelter corridors',
    },
    {
      name: 'Haratua',
      subtitle: 'Storage Complete',
      dateRange: 'May 1–20',
      soilTemp: '8–12°C',
      keyIndicator: 'Kangaroo grass seed fully dispersed; heavy autumn rain; leaves turning colour',
      farmingFocus: 'Finalise crop storage; prepare compost; close off annual beds; repair cold frames',
    },
    {
      name: 'Late Warinj',
      subtitle: 'Deep Cooling',
      dateRange: 'May 20–Jun 10',
      soilTemp: '5–10°C',
      keyIndicator: 'First frosts possible in Victorian highlands and Tasmanian Midlands; morning temperatures near 0°C',
      farmingFocus: 'Protect tender perennials; cease new plantings; focus on soil protection',
    },
    {
      name: 'Pipiri',
      subtitle: 'Winter Approach',
      dateRange: 'Jun 10–Jul 1',
      soilTemp: '2–8°C',
      keyIndicator: 'Matariki (Pleiades) rises in pre-dawn northeast sky late June — Māori New Year; winter solstice ~June 21',
      farmingFocus: 'Winter solstice reflection; plan spring; minimal soil disturbance; protect dormant plants',
    },
  ],

  winter: [
    {
      name: 'Pipiri / Matariki',
      subtitle: 'Solstice & New Year',
      dateRange: 'Jun 15–Jul 10',
      soilTemp: '2–6°C',
      keyIndicator: 'Matariki heliacal rise marks Māori New Year; winter solstice; deepest cold; ~9.5 h daylight',
      farmingFocus: 'Matariki reflection period; no planting; planning and ordering; winter pruning in mild spells',
    },
    {
      name: 'Hōngongoi',
      subtitle: 'Deep Winter',
      dateRange: 'Jul 10–25',
      soilTemp: '3–7°C',
      keyIndicator: 'Coldest month across temperate AU/NZ; nightly frosts in most regions; heavy cloud; minimal daylight',
      farmingFocus: 'Dormancy protection; bare-root fruit tree planting; livestock shelter; plan spring grafting',
    },
    {
      name: 'Here-turi-kōkā',
      subtitle: 'Late Winter Turn',
      dateRange: 'Jul 25–Aug 15',
      soilTemp: '4–9°C',
      keyIndicator: 'Days gradually lengthening; afternoon warmth begins; bird calls shift; first wattle buds appear',
      farmingFocus: 'Begin season planning; prepare seed beds; prune late-winter fruit trees; assess winter damage',
    },
    {
      name: 'Wattle Flush',
      subtitle: 'Silver Wattle Flowers',
      dateRange: 'Aug 1–25',
      soilTemp: '5–12°C',
      keyIndicator: 'Silver wattle (Acacia dealbata) at peak flower — yellow clouds on hillsides; migratory birds returning',
      farmingFocus: 'Direct sow cool-season crops indoors; prepare cold frames; prune and shape for spring',
    },
    {
      name: 'Guling',
      subtitle: 'Orchid Emergence',
      dateRange: 'Aug 15–Sep 1',
      soilTemp: '8–15°C',
      keyIndicator: 'Orchids begin flowering; wattle at peak; last highland frosts; insects awakening; gardens stirring',
      farmingFocus: 'Main planting season begins; sow early outdoor cool crops; warm beds for spring transplants',
    },
    {
      name: 'Mahuru Threshold',
      subtitle: 'Spring Arrival',
      dateRange: 'Aug 25–Sep 15',
      soilTemp: '10–18°C',
      keyIndicator: 'Spring equinox approaches (~Sep 22); wattle fading; orchids flowering; bird nesting visible',
      farmingFocus: 'Intensive spring preparation; harden off transplants; sow final cool-season succession',
    },
  ],

  spring: [
    {
      name: 'Mahuru',
      subtitle: 'Spring Equinox',
      dateRange: 'Sep 10–Oct 1',
      soilTemp: '12–18°C',
      keyIndicator: 'Spring equinox ~Sep 22; tadpole activity (Poorneet marker); flax lilies begin flowering',
      farmingFocus: 'Major spring planting begins; transplant hardened-off seedlings; direct sow warm crops at 15°C+',
    },
    {
      name: 'Poorneet',
      subtitle: 'Tadpole Season',
      dateRange: 'Oct 1–20',
      soilTemp: '15–22°C',
      keyIndicator: 'Flax lilies flowering; murnong (yam daisies) ready; frogs active; kangaroo grass germinating',
      farmingFocus: 'Peak warm crop planting; direct sow corn, beans, cucumbers; transplant tomatoes, peppers',
    },
    {
      name: 'Poorneet Late',
      subtitle: 'Growth Acceleration',
      dateRange: 'Oct 20–Nov 1',
      soilTemp: '18–24°C',
      keyIndicator: 'Murnong harvest complete; bird fledging visible; insects abundant; 20–25°C daytime',
      farmingFocus: 'Last cool-season successions; intensive warm planting; mulching essential; pest monitoring begins',
    },
    {
      name: 'Buath Gurru',
      subtitle: 'Kangaroo Grass Peak',
      dateRange: 'Nov 1–15',
      soilTemp: '20–26°C',
      keyIndicator: 'Kangaroo grass flowering; mānuka begins in some regions; bee activity at peak; native pasture productive',
      farmingFocus: 'Monitor native pasture for seed set; finalise all spring plantings; support beneficial insects',
    },
    {
      name: 'Mānuka Flowers',
      subtitle: 'Late Spring',
      dateRange: 'Nov 15–Dec 1',
      soilTemp: '22–28°C',
      keyIndicator: 'Mānuka (Leptospermum scoparium) flowering begins; pōhutukawa first buds opening; 22–27°C',
      farmingFocus: 'Late planting window closing; drought planning; intensive mulching; monitor spider mites, aphids',
    },
    {
      name: 'Garrawang Early',
      subtitle: 'Summer Transition',
      dateRange: 'Nov 25–Dec 15',
      soilTemp: '25–30°C',
      keyIndicator: 'Kangaroo apple fruiting; pōhutukawa flowers opening; mānuka peak; 25–30°C; summer solstice ~Dec 21',
      farmingFocus: 'Summer solstice marking; intensive watering; heat shade for seedlings; harvest first summer crops',
    },
  ],

  summer: [
    {
      name: 'Garrawang / Kohi-tātea',
      subtitle: 'Solstice & Pōhutukawa',
      dateRange: 'Dec 15–Jan 10',
      soilTemp: '26–32°C',
      keyIndicator: 'Summer solstice ~Dec 21; pōhutukawa peak (mid-late Dec, NZ coastlines ablaze red); mānuka at peak; goannas active; Rehua (Antares) prominent in summer sky',
      farmingFocus: 'Peak harvest season; heat stress management; morning watering only; shade cloth for sensitive crops',
    },
    {
      name: 'Kohi-tātea',
      subtitle: 'Full Fruit Ripening',
      dateRange: 'Jan 10–Feb 1',
      soilTemp: '27–32°C',
      keyIndicator: 'All fruit crops at peak ripeness; pōhutukawa ending; temperatures highest; insect pressure at peak',
      farmingFocus: 'Harvest intensively; process and preserve at peak ripeness; water heavily; mulch maintenance',
    },
    {
      name: 'Hui-tanguru',
      subtitle: 'Rūhī Star Season',
      dateRange: 'Feb 1–20',
      soilTemp: '25–30°C',
      keyIndicator: `"Rūhī's foot rests on the earth" — summer star governs; subtle first cooling; early insects beginning dormancy`,
      farmingFocus: 'Continued harvest; begin autumn cover crop planning; order cool-season seed; prepare for transition',
    },
    {
      name: 'Late Hui-tanguru',
      subtitle: 'Autumn Foreshadow',
      dateRange: 'Feb 15–Mar 10',
      soilTemp: '22–28°C',
      keyIndicator: 'Subtle cooling (24–28°C); some tree leaves beginning autumn colour; bird behaviour shifting; kangaroo grass forming new seed heads',
      farmingFocus: 'Sow autumn brassicas; increase mulch; monitor for early autumn pests; water demand still high',
    },
    {
      name: 'Poutū-te-rangi Early',
      subtitle: 'Autumn Arrival',
      dateRange: 'Mar 1–20',
      soilTemp: '18–24°C',
      keyIndicator: 'Autumn equinox ~Mar 20–21 approaching; cooling noticeable (20–25°C); kangaroo grass seed heads forming; autumn rains increasing',
      farmingFocus: 'Begin major autumn harvest; collect kangaroo grass seeds; plant autumn/winter cover crops',
    },
    {
      name: 'Poutū-te-rangi',
      subtitle: 'Equinox Crossing',
      dateRange: 'Mar 20–Apr 1',
      soilTemp: '15–20°C',
      keyIndicator: 'Autumn equinox ~Mar 20–21; kangaroo grass seeds fully mature; cooling continues; days now shorter than nights',
      farmingFocus: 'Autumn equinox: assess the year; finalise harvest; collect and store seeds; plant cover crops',
    },
  ],
};

/* ── CATEGORY IMAGES ──────────────────────────────────────────
   20 entries: one per season × category combination.
   imageAlt: accessibility description of the natural scene.
   imageQuery: Unsplash/Pexels search string for sourcing the photo.
   Acts depicted: natural processes without people or prominent
   man-made objects — the regenerative practice itself made visible.
   ──────────────────────────────────────────────────────────── */

export const CATEGORY_IMAGES = {

  // ── AUTUMN ────────────────────────────────────────────────────

  'autumn-soil-prep': {
    imageAlt: 'Macro photograph of rich autumn soil revealing white mycelial fungal networks spreading through dark earth and decomposing leaves — the biological awakening of autumn',
    imageQuery: 'mycorrhizal+fungi+soil+network,autumn+leaf+decomposition+forest+floor',
  },
  'autumn-planting': {
    imageAlt: 'Young brassica seedlings and emerging allium shoots arranged in companion planting pattern, surrounded by dark autumn soil and a thin layer of compost mulch',
    imageQuery: 'young+brassica+seedlings+autumn,cabbage+kale+seedlings+garden+bed',
  },
  'autumn-composting': {
    imageAlt: 'Forest floor leaf litter showing white mycelial networks and dense decomposing organic matter — the ecological foundation of IMO collection in autumn',
    imageQuery: 'forest+floor+decomposing+leaves+fungi,mycorrhizal+network+forest+soil+macro',
  },
  'autumn-cover-crops': {
    imageAlt: 'Newly sown cover crop bed in autumn showing mixed seeds at emergence — cereal rye, legume and phacelia seedlings pushing through dark freshly-worked soil',
    imageQuery: 'cover+crop+seed+emergence+autumn,cereal+rye+seedling+broadcast+sowing',
  },
  'autumn-water': {
    imageAlt: 'Freshly ripped keyline contour channels across sloped ground showing parallel soil disturbance lines and exposed lighter subsoil — autumn water infrastructure',
    imageQuery: 'contour+earthworks+channels,swale+construction+erosion+control+landscape',
  },

  // ── WINTER ────────────────────────────────────────────────────

  'winter-soil-prep': {
    imageAlt: 'Close-up of black biochar particles scattered across frost-covered winter soil, showing the visible porosity and crystalline ice formations against dark earth',
    imageQuery: 'biochar+soil+amendment+frost,charcoal+particles+frozen+garden+soil',
  },
  'winter-planting': {
    imageAlt: 'Exposed root system of a bare-root fruit tree planted into dark moist winter soil, surrounded by emerging frost-touched brassica seedlings',
    imageQuery: 'bare+root+fruit+tree+planting+winter,dormant+tree+root+system+transplant',
  },
  'winter-composting': {
    imageAlt: 'Close-up of layered bokashi fermentation bucket showing kitchen scraps with inoculated bran and condensation droplets indicating active fermentation despite winter cold',
    imageQuery: 'bokashi+fermentation+layers+bucket,worm+farm+vermicompost+winter',
  },
  'winter-cover-crops': {
    imageAlt: 'Winter cover crop field — cereal rye plants coated in thick frost crystals, standing in still winter air, their stems protecting dark soil beneath',
    imageQuery: 'cereal+rye+winter+frost+field,cover+crop+frost+overwintering+dormant',
  },
  'winter-water': {
    imageAlt: 'Constructed swale filled with collected winter rainwater, calm surface reflecting grey sky, earthen berm visible and dormant vegetation at swale edges',
    imageQuery: 'swale+full+water+winter,water+harvesting+earthworks+contour+landscape',
  },

  // ── SPRING ────────────────────────────────────────────────────

  'spring-soil-prep': {
    imageAlt: 'Macro photograph of spring garden soil showing visible earthworms and white mycelial threads through rich dark earth — biological awakening as soil warms above 10°C',
    imageQuery: 'earthworm+soil+emergence+spring,fungal+mycelium+network+garden+soil+macro',
  },
  'spring-planting': {
    imageAlt: 'Diverse spring guild of newly emerging seedlings and early-growth perennial plants, pale green new foliage and dark prepared soil in a polyculture arrangement',
    imageQuery: 'spring+seedling+germination+diverse+guild,perennial+vegetables+new+growth+spring',
  },
  'spring-composting': {
    imageAlt: 'Hot compost windrow being turned in cool spring air, visible steam rising from the freshly-turned dark mass — the dramatic heat of thermophilic decomposition',
    imageQuery: 'compost+windrow+steam+thermophilic+heat,hot+composting+turning+steam+spring',
  },
  'spring-cover-crops': {
    imageAlt: 'Fields of phacelia in full blue-purple bloom during spring, and adjacent roller-crimped winter cover crop laid flat as protective mulch over dark soil',
    imageQuery: 'phacelia+flowers+blue+purple+field+bloom,roller+crimped+cover+crop+mulch+layer',
  },
  'spring-water': {
    imageAlt: 'Spring landscape showing keyline water harvesting channels with visible water pooling and infiltrating through dark soil, surrounded by establishing green vegetation',
    imageQuery: 'keyline+water+infiltration+spring+landscape,swale+system+water+flowing+contour',
  },

  // ── SUMMER ────────────────────────────────────────────────────

  'summer-soil-prep': {
    imageAlt: 'Side-by-side summer comparison: cracked light drought-stressed soil versus dark mulched beds protecting moist earth — the critical difference mulch makes under summer heat',
    imageQuery: 'mulch+soil+protection+summer+drought,dry+cracked+soil+vs+mulched+garden+bed',
  },
  'summer-planting': {
    imageAlt: 'Lush Three Sisters guild — tall corn supporting climbing beans and sprawling squash shading the soil at base — full summer abundance in a layered polyculture',
    imageQuery: 'three+sisters+planting+corn+bean+squash,companion+planting+polyculture+summer+vegetables',
  },
  'summer-composting': {
    imageAlt: 'Amber-coloured fish amino acid fermenting in a glass jar, and dark compost tea extract steeping in a container — biological nutrient brewing under summer warmth',
    imageQuery: 'fermented+plant+extract+jar+amber,compost+tea+brewing+container+dark+liquid',
  },
  'summer-cover-crops': {
    imageAlt: 'Summer buckwheat field in full flower — masses of small white blooms over dense green foliage — and a living mulch understory protecting soil beneath taller crops',
    imageQuery: 'buckwheat+flowers+field+white+bloom,summer+cover+crop+flowering+green',
  },
  'summer-water': {
    imageAlt: 'Water harvesting infrastructure at work in summer: dark mulched soil retaining moisture against adjacent cracked drying earth, demonstrating water management under heat stress',
    imageQuery: 'drought+stressed+soil+cracking+wilting,water+retention+mulch+summer+heat+management',
  },
};
