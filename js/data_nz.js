/* ============================================================
   NZ DELTAS — Aotearoa New Zealand-specific task content
   Applied on top of data_base.js when region = 'nz'

   Priority additions:
   1. Kūmara cultivation in spring — foundational NZ crop, absent from base
   2. Whitebait/inanga run as planting timing marker
   3. NZ volcanic and alluvial soil P advice — diverges from AU laterite logic
   ============================================================ */

export const NZ_DELTAS = [

  // ── Spring — kūmara and whitebait at start of planting ───────
  {
    seasonId: 'spring',
    categories: [
      {
        id: 'planting',
        tasks: [
          {
            inject: { position: 'first' },
            title:    'Establish Kūmara Sprouting Beds and Transplant Slips to Warm Ground',
            timing:   'Aug–Sep (sprouting bed preparation); Oct–Nov (transplant when soil at 100mm exceeds 16°C)',
            duration: '3–4 hours initial bed preparation; 30 min per 10m row at transplant',
            description: 'Kūmara (Ipomoea batatas) is the foundational warm-season crop of Aotearoa NZ regenerative systems — a direct link to the Pacific agricultural traditions that shaped the original cultivation of these islands. Begin in August: prepare a heated sprouting bed using a shallow timber frame (300mm deep minimum) filled with a 50/50 mix of sifted compost and coarse sand. Warm the bed to 22–24°C using a seedling heat mat under the frame, or by enclosing in a low polytunnel over dark-painted water containers that absorb solar heat through the day. Place whole seed kūmara horizontally in the bed, lightly covered with 20mm of sandy mix. Sprouting slips emerge in 4–6 weeks at consistent warmth. Slips are ready to separate when 15–20 cm long with 2–3 leaf nodes. Transplant date is governed by soil temperature at 100mm depth: do not transplant until soil reaches 16°C minimum — typically mid-October in Northland and the Waikato, late October to early November on the Canterbury Plains and Nelson. Prepare raised mounded beds with excellent drainage; kūmara will not tolerate waterlogged roots. On North Island volcanic loams and alluvials — the primary kūmara-growing country — minimal additional nutrition is needed beyond a base layer of mature compost worked in at bed preparation. High nitrogen input will drive lush foliage at the expense of tuber development. On heavier Canterbury soils, raise beds higher (300mm crown) and incorporate pea straw for drainage and organic matter. Harvest in March–April before first frost when foliage begins to yellow.',
            tools: [
              'Kūmara seed tubers — heritage varieties: Owairaka Red, Toka Toka Gold, Northern Delight, Urenika (purple, for market gardens)',
              'Seedling heat mat (maintains 22–24°C) or low polytunnel with thermal mass',
              'Soil thermometer (100 mm probe)',
              'Coarse sandy compost mix for sprouting bed',
              'Raised bed material (timber, earth, or compost mounds)',
            ],
            tip: 'Whitebait season (inanga run, Sep–Oct) in NZ rivers coincides with kūmara slip preparation. When the inanga are running, the water has warmed and the season has genuinely turned — traditional Māori growing calendars used this ecological signal as confirmation that soil temperatures were rising toward the kūmara transplant window.',
          },
          {
            inject: { after: 'kūmara sprouting' },
            title:    'Monitor the Inanga (Whitebait) Run as a Spring Planting Indicator',
            timing:   'September–October (inanga run peaks Sep in most NZ river systems)',
            duration: 'Observation — 30 min per week at your nearest river or stream mouth',
            description: 'The inanga (Galaxias maculatus) whitebait run is one of the most reliable ecological spring indicators in Aotearoa. Inanga migrate from their marine juvenile phase back into freshwater systems in September–October, timing their run to river temperature, day length, and flow events — the same environmental signals that indicate the soil is warm enough and biologically active enough for warm-season planting. Observing the run at a nearby river or stream is a form of phenological calendar-keeping that connects the farm to its wider catchment: if the whitebait are running and concentrating at the river mouth, soil temperatures at lowland sites are likely crossing 12–14°C — the threshold for active seed germination of beans, corn, and basil, and the confirmation that kūmara slips can begin their hardening-off process before transplant. Beyond timing: healthy whitebait populations in your catchment indicate good water quality and healthy riparian ecosystems upstream — a direct ecological indicator of the state of land management in your valley. If whitebait numbers are declining year-on-year at your observation point, consider what is entering your waterways from the farm and what riparian restoration is needed.',
            tools: [
              'Field notebook for annual run observation records (date of first sighting, estimated abundance)',
              'Water thermometer for stream temperature at point of observation',
            ],
            tip: 'Under the Maramataka (Māori lunar calendar), the inanga run is timed against specific moon phases. Record the lunar phase when you first observe the run each year — over several seasons, a pattern emerges that can refine your planting calendar beyond what calendar dates alone provide.',
          },
        ],
      },
    ],
  },

  // ── Autumn — volcanic P advice in soil prep ───────────────────
  {
    seasonId: 'autumn',
    categories: [
      {
        id: 'soil-prep',
        tasks: [
          {
            inject: { position: 'last' },
            title:    'Phosphorus Management on NZ Volcanic and Alluvial Soils',
            timing:   'March–April (before autumn soil input decisions)',
            duration: '1–2 hours: soil test review and fertiliser planning session',
            description: 'New Zealand soils — particularly the Waikato andisols, Bay of Plenty volcanic pumice soils, Taranaki ash soils, and Canterbury alluvials — are categorically different from SE Australian soils in their phosphorus dynamics. NZ volcanic soils have high P-fixation capacity (allophane and ferrihydrite minerals bind soluble P rapidly), meaning applied P disappears quickly into unavailable forms. The result is that NZ soils regularly have genuine P deficiency requiring regular input to sustain productivity — the opposite situation to many over-fertilised Australian red-brown earths. Target Olsen P levels for NZ soils: 20–30 ppm for pastoral farming; 30–50 ppm for intensive horticulture on most soil types. Below these thresholds, P inputs are agronomically justified and will not suppress mycorrhizal fungi the way they do on phosphorus-saturated Australian soils. However: P-fixing capacity means that soluble superphosphate applied in late autumn is largely wasted — apply P in forms that remain plant-available longer (reactive rock phosphate, struvite/organic P) or use biological P-solubilisation through compost and mycorrhizal networks. On Canterbury silt loams (non-volcanic, lower P-fixation), P dynamics are closer to AU practice and Olsen P above 30 ppm genuinely does start to suppress AMF — apply the same caution in these soils.',
            tools: [
              'Soil test (specify Olsen P; also request P retention if testing an andisol for the first time)',
              'Reactive rock phosphate (for slower-release P on P-fixing soils)',
              'Quality compost — biological P mobilisation through organic matter is more efficient than soluble inputs on volcanic soils',
            ],
            tip: 'If your Olsen P is above 30 ppm on a NZ alluvial soil, that is an unusual reading and suggests either recent heavy applications or a non-P-fixing parent material. Have the P-retention value measured alongside Olsen P — the two numbers together tell the real story of your soil\'s P dynamics.',
          },
        ],
      },
    ],
  },

  // ── Winter — add maramataka lunar planning note ───────────────
  {
    seasonId: 'winter',
    categories: [
      {
        id: 'planting',
        tasks: [
          {
            inject: { position: 'first' },
            title:    'Maramataka Planning: Align the Season\'s Work to the Lunar Calendar',
            timing:   'June–July (Matariki period — Māori New Year; ideal planning window)',
            duration: '2–3 hours initial calendar mapping; ongoing observation through the season',
            description: 'The Maramataka is the Māori lunar-environmental calendar — a sophisticated system of ecological observation that coordinates planting, harvesting, fishing, and land management with lunar phases, star positions, wind patterns, and seasonal animal behaviours. During the winter Matariki (Pleiades rise, late June) period, the traditional Māori new year is an ideal time to lay out the growing season on the maramataka framework before the first spring plantings. The core principle: the lunar cycle (approximately 29.5 days) is divided into phases associated with different agricultural activities. Broadly: nights of the full moon (Rākaunui/Rākaumatohi) and first quarter phases are considered favourable for planting crops that bear fruit above ground; nights around the new moon (Whiro/Tirea) are associated with root crop cultivation and rest; the descending moon phases in the second half of the cycle favour underground crops, harvesting, and soil work. These principles align with biodynamic planting calendar observations and have been validated anecdotally by generations of Māori and Pacific growers. Begin by obtaining a current maramataka chart from Matariki-focused organisations (Te Wānanga o Aotearoa publishes annual versions; regional iwi often produce localised versions calibrated to their rohe). Map your anticipated kūmara sprouting, transplanting, and main summer sowing dates against the maramataka. Over several seasons, track germination rates and crop vigour against the lunar phase at sowing — the patterns that emerge will refine your calendar more accurately than any universal rule.',
            tools: [
              'Current maramataka calendar (Te Wānanga o Aotearoa annual version, or regional iwi publication)',
              'Field notebook for phenological and lunar phase observations',
              'Matariki star visibility (clear winter nights, northeast sky before dawn)',
            ],
            tip: 'Matariki clarity forecasts the growing season ahead: in traditional reading, a bright clear Pleiades cluster at heliacal rise signals warmth and abundance; a hazy or dim appearance predicts cold and hardship for the season. Record your observation each year — the correlation with actual season outcomes is a form of long-run ecological data collection.',
          },
        ],
      },
    ],
  },

];
