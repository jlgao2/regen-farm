/* ============================================================
   AU DELTAS — Australia-specific task content
   Applied on top of data_base.js when region = 'au'

   Priority additions:
   1. Fire preparedness (summer + spring) — safety-critical, absent from base
   2. Lateritic P-sensitivity note in autumn soil prep
   ============================================================ */

export const AU_DELTAS = [

  // ── Summer — add Fire Preparedness as a new category ─────────
  {
    seasonId: 'summer',
    categories: [
      {
        id:       'fire-prep',
        icon:     'flame',
        title:    'Fire Preparedness',
        priority: 'high',
        tasks: [
          {
            title:    'Establish and Maintain Firebreaks Before Total Fire Ban Season',
            timing:   'Oct–Nov (complete by 1 Dec; CFA/RFS legal deadline varies by state and council)',
            duration: '1–2 days initial establishment; half-day annual maintenance',
            description: 'In temperate SE Australia, summer fire risk is a non-negotiable farm reality that precedes every other warm-season task in importance. By 1 November each year, rural properties in Victoria (CFA zones) and NSW (RFS) require maintained firebreaks to legal standard — typically a 3-metre-wide cleared zone around all structures, with ember-resilient zones extending 20–30 metres. On a regenerative farm, breaks need not be bare earth: maintain them as short-mown perennial pasture (wallaby grass or microlaena in cooler tablelands; couch or kikuyu in coastal zones) grazed short by sheep or geese through spring before stock removal ahead of fire season. Key tasks: (1) inspect all break widths against your local council fire overlay — maps available through your state CFA/RFS portal; (2) slash and remove accumulated biomass from last growing season; (3) clear debris from gutters, against downpipes, and under decks on all structures; (4) check and replace ember guards on subfloor and roof vents; (5) confirm all property access tracks can accommodate a wide tanker (5.5 m minimum clearance); (6) record GPS coordinates of all water sources — dam, tank, trough — and share with your local brigade. Under the rural stewardship lens: rotationally grazing perennial break pasture through spring achieves legal compliance through biological management, reducing fuel load without mechanical input. Remove stock before any extreme fire weather forecast (FDI above 50).',
            tools: [
              'Slasher or brushcutter for break vegetation',
              'Tape measure for legal width verification',
              'Ember guard mesh (stainless steel, 2mm aperture)',
              'CFA/RFS fire management overlay for your council area',
              'GPS-enabled phone or device for water source recording',
            ],
            tip: 'Register your property\'s water sources — dam capacity, tank location and volume — with your local CFA/RFS brigade in March, not November. Tanks and dams pre-registered on the brigade map have protected many neighbouring farms when the primary water supply was already compromised.',
          },
          {
            title:    'Review, Update and Rehearse Your Bushfire Survival Plan',
            timing:   'October (before Nov 1 Total Fire Ban commencement)',
            duration: '3–4 hours for plan review and household rehearsal; 30 min livestock protocol walk-through',
            description: 'Every property in a fire-prone AU zone must have a current Bushfire Survival Plan. The critical shift in regenerative farm planning is recognising that livestock complicate shelter-in-place scenarios that might otherwise be viable for dwellings alone. Establish clear trigger points for action: (1) "Leave Early" trigger — activate when Fire Danger Index exceeds 50 AND any fire is burning within 20 km of your property; (2) identify earliest-possible livestock trailer loading sequence and confirm trailer is hitched and ready from 1 November; (3) designate an offsite assembly point for animals with pre-arranged agreements from a neighbour or local agistment; (4) identify which stock you cannot evacuate and establish a clear written protocol for release to self-survival. Review the plan with all household members and anyone working on the property. File a digital copy with your nearest relative. The NSW Rural Fire Service and CFA both offer free farm property inspections — book one in September before the season begins.',
            tools: [
              'CFA My Bushfire Plan / NSW RFS Bushfire Survival Plan template',
              'Livestock trailer — confirm towball and lights are tested',
              'Written livestock release protocol (signed, dated, accessible)',
              'Emergency contact sheet laminated and posted in farm office and sheds',
            ],
            tip: 'The single most common fatal error in AU farm fires is delayed decision-making. Pre-commit: if your trigger point is reached, you leave. Writing the trigger condition down removes the decision under duress.',
          },
        ],
      },
    ],
  },

  // ── Spring — inject fire-season awareness into planting ───────
  {
    seasonId: 'spring',
    categories: [
      {
        id: 'planting',
        tasks: [
          {
            inject: { position: 'last' },
            title:    'Pre-Season Fire Risk Assessment and Fuel Load Audit',
            timing:   'September–October (before fire season window opens Nov–Dec)',
            duration: '2–3 hours for property walk-through and documentation',
            description: 'Before the main warm-season planting push, complete a fuel load audit across the whole property. Walk every paddock edge and treeline: identify and document accumulated dead vegetation, grass seed heads that haven\'t been grazed, accumulated leaf litter under shelter belts, and any equipment or materials left near structures. In practice: slash or graze down grass fuel loads in paddocks adjacent to buildings; ensure all hay and straw stored in sheds rather than against walls; check that all slashers and brushcutters are spark-arrester compliant (required in many AU fire districts). This spring walk also serves a positive regenerative purpose — mapping fuel load across seasons gives you a baseline for carbon estimation under the Australian Carbon Credit Unit (ACCU) methodology for rangeland and pasture projects.',
            tools: [
              'Fuel load audit checklist (download from your state CFA/RFS website)',
              'Smartphone camera for photo documentation',
              'Spark arrester wrench for brushcutter/slasher maintenance',
            ],
            tip: 'High spring grass growth following good autumn rains is both a regenerative success signal and a fire risk factor. Rotational grazing management that keeps grasses actively growing (not rank and senescent) is your best biological fuel load control.',
          },
        ],
      },
    ],
  },

  // ── Autumn — lateritic P-sensitivity note in soil prep ────────
  {
    seasonId: 'autumn',
    categories: [
      {
        id: 'soil-prep',
        tasks: [
          {
            inject: { position: 'last' },
            title:    'Phosphorus Management on Ancient Australian Soils',
            timing:   'March–April (before any autumn fertiliser applications)',
            duration: '1–2 hours: soil test review and input planning session',
            description: 'SE Australian soils are among the oldest on Earth — red-brown earths, yellow chromosols, and grey vertosols of the Western District, Riverina, and SE SA have been leaching for 60–100 million years. The result is that phosphorus (P) is simultaneously deficient in plant-available forms AND over-accumulated as insoluble iron- and aluminium-bound P in the soil profile from decades of superphosphate application. The critical number is Olsen P: above 30 ppm, soluble P actively suppresses mycorrhizal fungi colonisation. In temperate SE AU pasture systems, Olsen P above 20–25 ppm in the surface horizon is the practical threshold above which autumn AMF inoculation will be largely wasted. Before any autumn soil input decision, run a fresh Olsen P test (October or March at latest). If Olsen P > 20 ppm: skip P-containing inputs entirely this season; instead invest in biological P-solubilisation — apply trichoderma-based biostimulants, increase soil organic matter through compost, and allow the existing P reserve to be made plant-available by microbial activity rather than adding more. On the red duplex soils with heavy clay B-horizons at 200–300 mm, P applied below the clay interface is effectively lost — apply only into the surface A-horizon where biological activity is concentrated.',
            tools: [
              'Soil test kit or send-in sample (specify Olsen P, not Colwell P)',
              'Trichoderma-based biostimulant (e.g., Nutri-Tech Tricho-Shield)',
              'Mature compost — minimum 3 months thermophilic process',
            ],
            tip: 'The most common mistake on ancient AU soils is conflating "soil test shows low P" with "apply more phosphate fertiliser." Test for P-availability forms, not total P, and consider the biotic pathway first — fixing P chemistry through microbial activity is more durable than fertiliser inputs on these soil types.',
          },
        ],
      },
    ],
  },

];
