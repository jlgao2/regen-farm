/* ============================================================
   DATA — All seasonal content for the regenerative farm guide
   ============================================================ */

export const SEASONS = [
  // ──────────────────────────────────────────────
  // SPRING
  // ──────────────────────────────────────────────
  {
    id: 'spring',
    label: 'Spring',
    tagline: 'Wake the Soil. Sow Intention.',
    months: 'March — May',
    heroGradient: 'hero-bg--spring',

    intro: 'After winter\'s rest, the land stirs again. These months are about listening — feeling the soil\'s readiness, coaxing life back without force. Every seed planted now is a conversation with the next six months.',

    categories: [
      {
        id: 'soil-prep',
        icon: 'shovel',
        title: 'Soil Preparation',
        priority: 'high',
        tasks: [
          {
            title: 'Soil Texture & Structure Test',
            timing: 'Early March',
            duration: '1–2 hours',
            description: 'Take a handful of moist soil and roll it between your palms into a ribbon. Soil that ribbons more than 2 inches is clay-dominant. Sandy soil crumbles immediately. Loam — the regenerative ideal — holds briefly then breaks. Do this across your whole site; soil varies more than you think.',
            tools: ['trowel', 'mason jar', 'notebook'],
            tip: 'Fill a jar 1/3 with soil and water, shake vigorously, let settle 24 hours. Sand sinks first, silt next, clay last. A balanced loam shows distinct layers of roughly equal depth.',
          },
          {
            title: 'Soil pH Testing & Amendment',
            timing: 'Early–Mid March',
            duration: '2–3 hours',
            description: 'Test pH across multiple beds and any new ground. Most vegetables thrive at 6.2–6.8. Brassicas prefer 6.5–7.0. Blueberries want 4.5–5.5. If below 6.0, work agricultural lime into the top 6 inches and water in. If above 7.2, apply elemental sulfur at 1 lb per 100 sq ft.',
            tools: ['pH meter or strips', 'lime', 'sulfur'],
            tip: 'Test after any significant rainfall. Dry soils give falsely high readings. Test at 4-inch depth, not just surface.',
          },
          {
            title: 'Aerate Compacted Pathways',
            timing: 'Mid March',
            duration: '2–4 hours',
            description: 'Winter foot traffic compacts pathways and bed edges. Use a broadfork to open channels 12 inches deep without inverting the soil layers. Do not rototill — this destroys fungal networks that took years to build. Work when soil is moist but not wet; squeezing a handful should barely hold its shape.',
            tools: ['broadfork', 'garden fork'],
            tip: 'The "crumble test": push your thumb into the soil. If it leaves a clean impression that holds, it\'s too wet to work. Wait another day.',
          },
          {
            title: 'Top-dress with Finished Compost',
            timing: 'Late March – Early April',
            duration: '3–5 hours',
            description: 'Apply 1–2 inches of finished compost across all beds. Do not dig it in — let earthworms and soil life incorporate it from below. Finished compost should smell earthy, not ammonia-sharp. If it still smells, it needs more time in the pile.',
            tools: ['wheelbarrow', 'garden rake', 'compost fork'],
            tip: 'Compost applied too early on bare soil will lose nitrogen to rain. Time it just before planting, or cover with a light layer of straw.',
          },
        ],
      },
      {
        id: 'planting',
        icon: 'seedling',
        title: 'Planting',
        priority: 'high',
        tasks: [
          {
            title: 'Start Seeds Indoors',
            timing: 'Early March',
            duration: '2–3 hours',
            description: 'Start tomatoes, peppers, celery, leeks, and celeriac 8–10 weeks before last frost. Use a heat mat for germination (65–75°F bottom heat). Sow 2–3 seeds per cell, thin to one after germination. Label every tray — memory fails with 30 varieties going.',
            tools: ['seed trays', 'heat mat', 'grow lights', 'labels'],
            tip: 'Tomatoes and peppers germinate at different temperatures. Peppers want 80–85°F; tomatoes are happy at 70–75°F. A heat mat with a thermostat pays for itself in germination rates.',
          },
          {
            title: 'Direct Sow Cold-Hardy Crops',
            timing: 'Mid March – April',
            duration: '2–3 hours',
            description: 'Peas, spinach, lettuce, arugula, kale, chard, radishes, and carrots tolerate frost. Direct sow as soon as soil is workable (above 40°F). Sow thickly — germination rates drop in cold soil — and thin once established. Radishes double as row markers for slow-germinating crops like carrots.',
            tools: ['seed dibber', 'row marker', 'fine rake'],
            tip: 'Sow spinach in 3-week successions through April for continuous harvest. Once temperatures hit 75°F, spinach bolts — succession plantings give you a longer window.',
          },
          {
            title: 'Divide and Transplant Perennials',
            timing: 'Early–Mid April',
            duration: '3–4 hours',
            description: 'Divide overgrown perennial herbs (chives, oregano, lemon balm, yarrow) and perennial vegetables (rhubarb, sorrel, comfrey). Dividing every 2–3 years rejuvenates plants and builds your stock. Plant comfrey as a dynamic accumulator on bed edges — its deep roots mine subsoil minerals.',
            tools: ['garden fork', 'sharp spade', 'buckets'],
            tip: 'Comfrey leaves are the regenerative farmer\'s best free fertilizer. Chop and drop them as mulch — they break down in 3–4 weeks, releasing nitrogen, potassium, and calcium directly to surrounding plants.',
          },
          {
            title: 'Inoculate Legume Seeds',
            timing: 'When planting peas and beans',
            duration: '30 min',
            description: 'Coat pea and bean seeds with Rhizobium inoculant before sowing. These bacteria fix atmospheric nitrogen onto root nodules, feeding the soil rather than depleting it. Dampen seeds slightly, add inoculant powder, toss to coat. Plant within 24 hours.',
            tools: ['inoculant powder', 'spray bottle'],
            tip: 'If you\'ve grown legumes in the same bed for several years, native Rhizobium populations may already exist. Check old pea roots for pink nodules — pink means active nitrogen fixation.',
          },
        ],
      },
      {
        id: 'composting',
        icon: 'compost',
        title: 'Composting',
        priority: 'medium',
        tasks: [
          {
            title: 'Turn and Assess Winter Pile',
            timing: 'Early March',
            duration: '1–2 hours',
            description: 'Your winter pile has been slow-composting under cold. Turn it to introduce oxygen and check progress. Good compost should be dark, crumbly, and smell like forest floor. If still chunky or smelly, it needs more time and turning. Move finished compost to a curing bay.',
            tools: ['compost fork', 'thermometer'],
            tip: 'A hot compost pile (130–160°F) kills weed seeds and pathogens. If your pile never heats, it\'s too dry, too small, or needs more nitrogen (greens). Add fresh grass clippings or kitchen scraps to reactivate.',
          },
          {
            title: 'Build New Spring Pile',
            timing: 'April – May',
            duration: 'Ongoing',
            description: 'Spring generates abundant green material: grass clippings, weeds, crop residue. Layer 2–3 parts brown (straw, wood chips, cardboard) to 1 part green. Keep moist as a wrung-out sponge. Cover to retain heat. Turn every 10–14 days for hot composting, or leave for slow cold composting.',
            tools: ['pitchfork', 'straw or wood chips'],
            tip: 'Add a few shovels of finished compost or garden soil to each new pile. You\'re seeding it with billions of microorganisms that accelerate breakdown.',
          },
        ],
      },
      {
        id: 'cover-crops',
        icon: 'wheat',
        title: 'Cover Crops',
        priority: 'medium',
        tasks: [
          {
            title: 'Terminate Winter Cover Crops',
            timing: 'Late March – April',
            duration: '2–3 hours',
            description: 'Crimp or cut winter rye, hairy vetch, or clover before they set seed. Use a roller-crimper if you have one, or a sharp scythe. Leave residue on the surface as mulch — it suppresses weeds and feeds soil biology as it breaks down. For no-till beds, crimping at full flower stage gives maximum biomass.',
            tools: ['roller-crimper', 'scythe', 'hand shears'],
            tip: 'Hairy vetch fixes 60–120 lbs of nitrogen per acre. Time termination at 50% flowering — maximum nitrogen content and before seed set. Wait too long and it becomes a weed.',
          },
          {
            title: 'Sow Spring Cover in Gaps',
            timing: 'After termination',
            duration: '1 hour',
            description: 'Any bed not planted for 3+ weeks benefits from a fast cover crop. Buckwheat (50 days to flower) suppresses weeds, attracts pollinators, and breaks down quickly. Phacelia establishes in 8 days and feeds beneficial insects. Both can be terminated by mowing before a main crop goes in.',
            tools: ['hand seeder', 'garden rake'],
          },
        ],
      },
      {
        id: 'water',
        icon: 'droplet',
        title: 'Water Management',
        priority: 'medium',
        tasks: [
          {
            title: 'Set Up Rainwater Collection',
            timing: 'Early March',
            duration: '2–3 hours',
            description: 'Connect downspouts to storage barrels or IBC tanks before spring rains begin. A 1,000 sq ft roof yields 600 gallons per inch of rainfall. Even one 55-gallon barrel extends your irrigation water significantly during dry spells. Add a first-flush diverter to keep debris and roof contaminants out.',
            tools: ['storage barrels', 'diverter kit', 'pipe fittings'],
            tip: 'Elevate barrels on cinder blocks to create gravity pressure for drip irrigation lines. Even 18 inches of elevation gives usable flow.',
          },
          {
            title: 'Install or Check Drip Irrigation',
            timing: 'April',
            duration: '3–6 hours',
            description: 'Drip irrigation delivers water at the root zone, reducing evaporation by 50% and fungal leaf disease. Lay emitter lines 12 inches apart for dense plantings. Check connectors and emitters from last season — mice and freezing damage both. Flush lines before use.',
            tools: ['drip tape', 'emitters', 'timer', 'pressure regulator'],
          },
        ],
      },
    ],

    checklist: [
      'Test soil pH across all beds and amend as needed',
      'Complete soil texture assessment — ribbon, jar shake tests',
      'Broadfork compacted pathways and bed edges',
      'Top-dress beds with 1–2" finished compost',
      'Start tomatoes, peppers, and leeks under lights',
      'Direct sow peas, spinach, and spring greens',
      'Inoculate pea and bean seeds with Rhizobium',
      'Turn winter compost pile, start new spring pile',
      'Terminate winter cover crops at peak flowering',
      'Set up or check rainwater collection system',
    ],

    quote: {
      text: 'The soil is the great connector of lives, the source and destination of all.',
      author: 'Wendell Berry',
    },
  },

  // ──────────────────────────────────────────────
  // SUMMER
  // ──────────────────────────────────────────────
  {
    id: 'summer',
    label: 'Summer',
    tagline: 'Tend the Abundance. Guard the Water.',
    months: 'June — August',
    heroGradient: 'hero-bg--summer',

    intro: 'Summer is the season of maintenance and harvest. The work shifts from starting to sustaining. Soil moisture, pest pressure, and succession planting determine whether your harvest is good or great. Observe daily. Act before problems become crises.',

    categories: [
      {
        id: 'soil-care',
        icon: 'shovel',
        title: 'Soil Care',
        priority: 'high',
        tasks: [
          {
            title: 'Deep Mulching All Beds',
            timing: 'Early June',
            duration: '3–5 hours',
            description: 'Apply 3–4 inches of straw, wood chip, or aged leaf mulch around all plantings. This is the single highest-return summer task: it retains moisture, suppresses weeds, moderates soil temperature, and feeds soil life as it decomposes. Keep mulch 2 inches away from plant stems to prevent rot.',
            tools: ['wheelbarrow', 'garden fork', 'straw bales'],
            tip: 'Soil under 4 inches of mulch stays 10–15°F cooler than unmulched soil in peak summer heat. Roots function better in cooler soil; photosynthesis stays higher; plants require less irrigation.',
          },
          {
            title: 'Mid-Season Compost Side-Dress',
            timing: 'Late June – July',
            duration: '1–2 hours',
            description: 'Heavy feeders — corn, squash, tomatoes, brassicas — benefit from a 1-inch compost side-dress or a compost tea drench at midseason. Apply at the drip line, not the stem. This replenishes nutrients leached by summer rains and supports the heavy fruiting period.',
            tools: ['compost', 'watering can for tea'],
            tip: 'Make compost tea: steep 1 cup of finished compost in 5 gallons of water for 24 hours with aeration. Apply within 4 hours of brewing. The aerobic bacteria in fresh tea are the beneficial component.',
          },
          {
            title: 'Weed Before They Seed',
            timing: 'Weekly',
            duration: '1–2 hours/week',
            description: 'The old farmer\'s rule: one year\'s seeding equals seven years\' weeding. Weed when weeds are small and haven\'t flowered. In hot dry weather, hoe shallowly on a sunny day — cut seedlings desiccate within hours. Never let a weed go to seed in or near the garden.',
            tools: ['collinear hoe', 'stirrup hoe', 'hand weeder'],
          },
        ],
      },
      {
        id: 'planting-summer',
        icon: 'seedling',
        title: 'Succession Planting',
        priority: 'high',
        tasks: [
          {
            title: 'Succession Sow Salad Crops',
            timing: 'Every 3 weeks through July',
            duration: '30 min per sowing',
            description: 'Lettuce, spinach, arugula, and radishes bolt in heat. Sow heat-tolerant varieties (Jericho lettuce, Tyee spinach) in partial shade or with shade cloth (30–40% reduction). Sow directly into gaps left by harvested spring crops. Stop successions 8 weeks before first frost.',
            tools: ['seeds', 'shade cloth', 'row cover'],
            tip: 'Pre-germinate lettuce seed in a damp paper towel in the refrigerator for 48 hours before sowing in hot weather. Lettuce seed is thermally inhibited above 80°F. Cold stratification breaks this block.',
          },
          {
            title: 'Transplant Fall Brassica Starts',
            timing: 'July – Early August',
            duration: '2–3 hours',
            description: 'Start broccoli, cabbage, kale, and Brussels sprouts indoors in July for fall harvest. Transplant 4–6 weeks later into well-composted beds. Broccoli transplanted in late July produces heads in October when quality is excellent and pest pressure from cabbage worm drops significantly.',
            tools: ['seed trays', 'transplanting trowel', 'row cover'],
          },
          {
            title: 'Plant Second-Crop Garlic Chives & Herbs',
            timing: 'June',
            duration: '1 hour',
            description: 'Basil, dill, cilantro, and summer savory grow quickly from seed. Sow basil successions every 4 weeks — it\'s a heavy user and the best batches go to pesto before leaves yellow. Cilantro bolts fast in heat; sow every 3 weeks and harvest early.',
            tools: ['herb seeds', 'pots or beds'],
          },
        ],
      },
      {
        id: 'composting-summer',
        icon: 'compost',
        title: 'Composting',
        priority: 'medium',
        tasks: [
          {
            title: 'Manage Pile Moisture in Heat',
            timing: 'Weekly',
            duration: '20 min',
            description: 'Summer heat dries compost piles rapidly. A dry pile stops decomposing. Check weekly by squeezing a handful — it should feel like a wrung-out sponge. Water with a hose if needed. Turn every 2 weeks. Hot-weather piles can reach 160°F and cycle through faster than winter — you may have finished compost by August.',
            tools: ['compost thermometer', 'hose'],
          },
          {
            title: 'Harvest Compost Worms',
            timing: 'If vermicomposting',
            duration: '1 hour',
            description: 'Worm bins overheat in summer above 85°F. Move them to shade or indoors. Harvest castings when the bin is 3/4 full of dark material. Spread castings directly on garden beds or use as seed-starting mix at 20% ratio. A teaspoon of worm castings per transplant hole is worth its weight.',
            tools: ['worm bin', 'screen for harvesting'],
          },
        ],
      },
      {
        id: 'cover-crops-summer',
        icon: 'wheat',
        title: 'Cover Crops',
        priority: 'low',
        tasks: [
          {
            title: 'Sow Buckwheat in Gaps',
            timing: 'Any time June–August',
            duration: '30 min',
            description: 'Buckwheat is the summer cover crop workhorse. It establishes in 5–7 days, flowers in 6 weeks, and terminates with a single mowing. Its flowers feed an extraordinary range of beneficial insects — hoverflies, parasitic wasps, bumblebees. Mow at 50% flower to prevent seed set. Lay residue flat as mulch.',
            tools: ['buckwheat seed', 'mower or scythe'],
            tip: 'Buckwheat is a phosphorus accumulator — it makes phosphorus available from soil that is chemically "locked." Terminate and incorporate in fall for a phosphorus release.',
          },
        ],
      },
      {
        id: 'water-summer',
        icon: 'droplet',
        title: 'Water Management',
        priority: 'high',
        tasks: [
          {
            title: 'Deep, Infrequent Irrigation',
            timing: 'Ongoing',
            duration: 'Ongoing',
            description: 'Water deeply 1–2 times per week rather than lightly every day. Deep watering encourages roots to grow down to where soil stays moist longer. Shallow daily watering trains roots upward, making plants drought-intolerant. Apply 1 inch of water per week total — track with a rain gauge or can placed in the garden.',
            tools: ['rain gauge', 'drip irrigation', 'timer'],
            tip: 'Water in early morning — soil absorbs better before heat, and foliage dries quickly, reducing fungal risk. Evening watering leaves foliage wet overnight. Midday watering in direct sun is not efficient, not harmful.',
          },
          {
            title: 'Check Mulch and Refresh',
            timing: 'Monthly',
            duration: '1 hour',
            description: 'Mulch breaks down through summer. By August, what started as 4 inches may be 1.5 inches. Refresh mulch to maintain the full depth. This is not wasted effort — the decomposed mulch has already become organic matter in your soil. You\'re building the soil profile with every layer.',
            tools: ['straw or wood chips', 'wheelbarrow'],
          },
          {
            title: 'Swale and Contour Maintenance',
            timing: 'After heavy rains',
            duration: '1–2 hours',
            description: 'Inspect water retention swales, berms, and any earthworks after heavy summer storms. Clear any breaches or blockages. Top up swale berms if erosion has occurred. A swale that holds 1 inch of rainwater per 100 sq ft significantly reduces irrigation need in subsequent dry periods.',
            tools: ['shovel', 'wheelbarrow', 'level'],
          },
        ],
      },
    ],

    checklist: [
      'Apply deep mulch (3–4") to all planted beds',
      'Set drip irrigation timer — water deeply twice weekly',
      'Side-dress heavy feeders with compost at midseason',
      'Start succession sowings of salad crops every 3 weeks',
      'Start fall brassica transplants indoors in July',
      'Sow buckwheat in any bare soil for 6+ weeks',
      'Weed weekly before anything sets seed',
      'Manage compost pile moisture — check weekly',
      'Inspect earthworks and swales after storms',
    ],

    quote: {
      text: 'To be interested in the changing seasons is a happier state of mind than to be hopelessly in love with spring.',
      author: 'George Santayana',
    },
  },

  // ──────────────────────────────────────────────
  // AUTUMN
  // ──────────────────────────────────────────────
  {
    id: 'autumn',
    label: 'Autumn',
    tagline: 'Give Back. Protect. Prepare.',
    months: 'September — November',
    heroGradient: 'hero-bg--autumn',

    intro: 'Autumn is the most important season for the regenerative farmer — the season of returning. What the soil gave through the year must be given back: organic matter, mineral, rest. Every hour spent on soil in autumn is worth three hours of spring work.',

    categories: [
      {
        id: 'soil-autumn',
        icon: 'shovel',
        title: 'Soil Building',
        priority: 'high',
        tasks: [
          {
            title: 'Heavy Compost & Amendment Application',
            timing: 'September – October',
            duration: '4–6 hours',
            description: 'This is the year\'s most important soil-building moment. Apply 2–4 inches of finished compost across all beds. Add any mineral amendments — rock dust, kelp meal, greensand — now rather than spring. Fall application gives amendments time to begin breaking down and integrating into the soil ecosystem before next season.',
            tools: ['compost', 'rock dust', 'kelp meal', 'garden rake'],
            tip: 'Rock dust (basalt, glacial) releases trace minerals extremely slowly — only over years. Applied in fall, the winter freeze-thaw cycle helps fracture particles, making minerals more bio-available by spring.',
          },
          {
            title: 'Chop and Drop Spent Crops',
            timing: 'As crops finish',
            duration: 'Ongoing',
            description: 'Resist the urge to remove spent plant matter. Chop stems and leaves at the base and lay them flat on the bed surface. Roots decay in place, leaving channels for water and air. Surface residue feeds soil biology and becomes next year\'s organic matter. Remove only diseased plant material.',
            tools: ['pruning shears', 'hand scythe'],
            tip: 'Tomato and squash residue can carry disease. Compost only if your pile gets genuinely hot (140°F+). Otherwise, bin separately or take to municipal compost. Pepper and basil residue is fine to chop and drop.',
          },
          {
            title: 'Sheet Mulch Expansion Areas',
            timing: 'October – November',
            duration: '4–8 hours',
            description: 'To create new beds without tilling: lay cardboard (remove tape and staples) directly on grass or weeds, overlapping edges by 6 inches. Top with 4–6 inches of wood chips or compost. By spring, worms will have worked the decomposed cardboard into the soil and the grass beneath will be dead. No digging, no disturbance.',
            tools: ['cardboard', 'wood chips', 'compost'],
            tip: 'Sheet mulch works best with a nitrogen sandwich: a thin layer of green material (grass clippings, manure) directly on the cardboard before the top mulch. This feeds the biology eating the cardboard from below.',
          },
        ],
      },
      {
        id: 'planting-autumn',
        icon: 'seedling',
        title: 'Planting & Harvest',
        priority: 'high',
        tasks: [
          {
            title: 'Plant Garlic',
            timing: 'October – November',
            duration: '2–3 hours',
            description: 'Garlic is the most rewarding fall planting. Break heads into individual cloves; plant 2 inches deep, 6 inches apart, pointy end up. Mulch immediately with 3–4 inches of straw to insulate over winter. Hardneck varieties (Rocambole, Porcelain, Rocambole) outperform softneck in cold climates and offer a bonus: scapes in June.',
            tools: ['dibber', 'straw mulch', 'garlic seed stock'],
            tip: 'Save your largest, healthiest cloves for replanting. Over three or four seasons of selecting the best, your garlic variety adapts to your specific soil and climate — a living seed stock.',
          },
          {
            title: 'Plant Spring Bulbs',
            timing: 'October',
            duration: '2–3 hours',
            description: 'Tulips, daffodils, alliums, and crocuses go in now for spring color and pollinator support. Intersperse alliums throughout vegetable beds — their scent confuses aphids and their flowers feed beneficial insects. Daffodils deter deer and rodents by containing lycorine, a bitter alkaloid.',
            tools: ['bulb planter', 'trowel', 'labels'],
          },
          {
            title: 'Harvest Root Vegetables Before Hard Frost',
            timing: 'October',
            duration: '3–4 hours',
            description: 'Carrots, parsnips, celeriac, and beets are best harvested before the ground freezes solid — though a light frost sweetens them. Store in damp sand in a cool cellar (32–40°F). Avoid plastic bags — roots need airflow. Properly stored carrots and beets keep 4–6 months.',
            tools: ['garden fork', 'storage crates', 'damp sand'],
            tip: 'Parsnips actually improve after frost — cold converts starch to sugar. Leave them in the ground until you want them, even into winter in mild climates. Mark row ends so you can find them under snow.',
          },
          {
            title: 'Extend Season with Row Covers',
            timing: 'September',
            duration: '1–2 hours',
            description: 'Row cover (reemay or spunbond fabric) adds 4–6°F of frost protection and extends the harvest season by 4–6 weeks. Set wire hoops 18 inches apart, drape fabric, anchor edges with soil or clips. Kale, chard, lettuce, arugula, and spinach all benefit. Remove during warm days to prevent overheating.',
            tools: ['row cover fabric', 'wire hoops', 'soil staples'],
          },
        ],
      },
      {
        id: 'composting-autumn',
        icon: 'compost',
        title: 'Composting',
        priority: 'medium',
        tasks: [
          {
            title: 'Build the Year\'s Largest Pile',
            timing: 'October – November',
            duration: '2–4 hours',
            description: 'Autumn generates enormous quantities of leaves, crop residue, and straw — ideal brown material. Build the biggest pile of the year now. Alternate thick layers of leaves with thin layers of kitchen scraps, grass clippings, or manure. Leaves alone won\'t compost — they need nitrogen. A large pile insulates itself and will still be hot in January.',
            tools: ['pitchfork', 'compost bins', 'leaf shredder'],
            tip: 'Run over leaves with a mower before piling. Shredded leaves have vastly more surface area and decompose 3–4x faster than whole leaves. Whole leaves mat and shed water.',
          },
          {
            title: 'Harvest Finished Summer Compost',
            timing: 'September',
            duration: '1–2 hours',
            description: 'Your summer pile should be finished or near-finished. Screen it through a 1/2-inch mesh screen — chunks that don\'t pass through go back into the new pile. Apply finished compost to beds or store covered to cure. Quality compost at this stage is dark brown, crumbly, and smells like clean earth.',
            tools: ['compost screen', 'wheelbarrow', 'pitchfork'],
          },
        ],
      },
      {
        id: 'cover-crops-autumn',
        icon: 'wheat',
        title: 'Cover Crops',
        priority: 'high',
        tasks: [
          {
            title: 'Sow Winter Cover Crop Mix',
            timing: 'Late August – October',
            duration: '1–3 hours',
            description: 'The most impactful cover crop decision of the year. Broadcast a winter mix of winter rye (soil holder), hairy vetch (nitrogen fixer), and crimson clover (pollinator magnet) at 4–6 oz per 100 sq ft. Rake shallowly, water in. This cover must be sown at least 4 weeks before hard frost to establish.',
            tools: ['broadcast seeder', 'garden rake'],
            tip: 'Sow at the upper end of seeding rate — better to have too much than too little. Winter rye can germinate in 34°F soil. It will establish even after the first light frosts.',
          },
          {
            title: 'Undersow Cover into Standing Crops',
            timing: 'Late Summer while crops still stand',
            duration: '1 hour',
            description: 'Undersow clover between rows of corn, squash, or other crops before harvest. As the main crop is harvested, the cover crop is already established below. This eliminates the bare-soil window between harvest and cover establishment — the most vulnerable period for erosion and nutrient loss.',
            tools: ['clover seed', 'broadcast seeder'],
          },
        ],
      },
      {
        id: 'water-autumn',
        icon: 'droplet',
        title: 'Water Management',
        priority: 'medium',
        tasks: [
          {
            title: 'Drain and Store Irrigation Lines',
            timing: 'Before first freeze',
            duration: '1–2 hours',
            description: 'Flush and drain all drip tape, poly pipe, and hoses before freezing temperatures. Water in lines expands when frozen and cracks fittings and emitters. Roll drip tape and store in a frost-free location. Blow out any buried lines with a compressor. Label fittings so spring setup is faster.',
            tools: ['air compressor', 'storage bags'],
          },
          {
            title: 'Fill Rainwater Storage for Spring',
            timing: 'During autumn rains',
            duration: 'Passive',
            description: 'Leave collection systems running through autumn rains to fill tanks to capacity before winter. Full tanks resist freezing better than empty ones (thermal mass). If freezing is severe, drain tanks to 25% full and insulate with straw bales — water inside won\'t fully freeze.',
            tools: ['tanks', 'straw bales for insulation'],
          },
        ],
      },
    ],

    checklist: [
      'Apply 2–4" of compost and mineral amendments to all beds',
      'Chop and drop all healthy spent crop residue',
      'Plant garlic — select largest cloves for replanting',
      'Sow winter cover crop mix before hard frost',
      'Sheet mulch any new bed areas with cardboard and wood chips',
      'Harvest root vegetables; store in damp sand',
      'Build large autumn compost pile from leaves and crop residue',
      'Drain and store irrigation lines before freezing',
      'Install row covers to extend greens harvest 4–6 weeks',
      'Plant spring bulbs — especially alliums for pest deterrence',
    ],

    quote: {
      text: 'Autumn is a second spring when every leaf is a flower.',
      author: 'Albert Camus',
    },
  },

  // ──────────────────────────────────────────────
  // WINTER
  // ──────────────────────────────────────────────
  {
    id: 'winter',
    label: 'Winter',
    tagline: 'Rest the Land. Feed the Mind.',
    months: 'December — February',
    heroGradient: 'hero-bg--winter',

    intro: 'Winter is not the absence of farming — it\'s the season of a different kind of tending. The soil is at work beneath the frost, exchanging minerals, hosting fungal networks, building structure. Your work now is to protect that process and prepare your mind for the year ahead.',

    categories: [
      {
        id: 'soil-winter',
        icon: 'shovel',
        title: 'Soil Protection',
        priority: 'high',
        tasks: [
          {
            title: 'Confirm Cover Crop Establishment',
            timing: 'December',
            duration: '30 min',
            description: 'Walk every bed. Beds with established cover crop are protected — living roots hold soil, rhizosphere biology stays active, erosion is prevented. Any bare beds should be mulched with 4–6 inches of straw immediately. Bare soil in winter is an emergency: it loses structure, erodes, and loses nitrogen through volatilization.',
            tools: ['straw bales', 'garden fork'],
            tip: 'Even a thin scattering of rye that didn\'t fully establish is better than bare soil. If you missed the window, put straw on now — it\'s not growing anything but it\'s protecting what\'s there.',
          },
          {
            title: 'Protect Perennial Roots from Freeze',
            timing: 'Before hard frost',
            duration: '1–2 hours',
            description: 'Young perennials — newly planted fruit trees, berry bushes, artichokes, perennial herbs — need root protection in their first winter. Mound 6–8 inches of wood chips or compost over the root zone. In severe climates, wrap young tree trunks with burlap to prevent sunscald. Remove winter protection in early spring once hard frost risk passes.',
            tools: ['wood chips', 'burlap', 'twine'],
          },
          {
            title: 'Apply Wood Chip Mulch on Pathways',
            timing: 'December',
            duration: '2–3 hours',
            description: 'Pathways are high-traffic zones that compact easily. A 4–6 inch layer of wood chips on pathways prevents compaction, absorbs foot traffic impact, and feeds the mycorrhizal fungi that colonize pathway edges and thread into adjacent beds. Ramial wood chips (from branch wood) are superior — they contain more bark and nutrient-dense sapwood.',
            tools: ['wood chips', 'wheelbarrow'],
            tip: 'Contact local tree services and utility companies — they often give wood chips free. Fresh chips are fine on pathways and compost piles; let them age 6+ months before direct contact with plant roots.',
          },
        ],
      },
      {
        id: 'planning',
        icon: 'seedling',
        title: 'Planning & Learning',
        priority: 'high',
        tasks: [
          {
            title: 'Draw Next Year\'s Crop Rotation Plan',
            timing: 'December – January',
            duration: '3–4 hours',
            description: 'Crop rotation prevents pest and disease buildup, manages soil nutrients, and breaks weed cycles. Core rules: don\'t follow brassicas with brassicas; nightshades (tomato, pepper, potato) stay out of the same bed for 3 years; legumes precede heavy feeders (corn, squash). Draw your beds on paper and rotate each family by at least one bed.',
            tools: ['graph paper', 'seed catalogs', 'garden journal'],
            tip: 'Four-year rotation as a minimum: Year 1 Legumes → Year 2 Brassicas → Year 3 Root Vegetables → Year 4 Nightshades/Cucurbits → back to Legumes. Write it down every year — memory is not reliable.',
          },
          {
            title: 'Order Seeds Early',
            timing: 'January – February',
            duration: '2–4 hours',
            description: 'The best varieties sell out by February. Order seeds for the full season now. Prioritize open-pollinated (OP) and heirloom varieties — these can be saved for replanting and adapt to your conditions over time. Hybrid (F1) seeds produce plants but will not breed true from saved seed.',
            tools: ['seed catalogs', 'order form', 'storage binder'],
            tip: 'Seed swaps and seed libraries are the regenerative farmer\'s secret weapon. Local seeds have adapted to local conditions. Your neighbor\'s 20-year bean variety will outperform any catalog variety in your specific microclimate.',
          },
          {
            title: 'Review and Update Garden Journal',
            timing: 'December',
            duration: '2 hours',
            description: 'Write up the year\'s observations while memory is fresh: what thrived, what failed, first and last frost dates, peak pest pressures, harvest quantities, what you wish you\'d planted more of. These notes become next year\'s competitive advantage. A five-year journal transforms planning from guessing to knowing.',
            tools: ['garden journal', 'photos from the season'],
          },
          {
            title: 'Sharpen and Oil All Tools',
            timing: 'December – January',
            duration: '2–3 hours',
            description: 'Clean all metal tools with a wire brush to remove rust. Sharpen hoe blades, spades, and pruning tools with a flat bastard file — a sharp hoe cuts weeds effortlessly; a dull one bruises and pushes them. Rub wooden handles with linseed oil. Store in a dry space with metal ends off the ground.',
            tools: ['wire brush', 'bastard file', 'linseed oil', 'whetstone'],
            tip: 'A hoe blade should be sharp enough to shave arm hair. Most gardeners never sharpen their hoes and work 3x harder than they need to. 10 minutes of sharpening saves hours of weeding effort.',
          },
        ],
      },
      {
        id: 'composting-winter',
        icon: 'compost',
        title: 'Composting',
        priority: 'medium',
        tasks: [
          {
            title: 'Insulate and Monitor Piles',
            timing: 'December',
            duration: '1 hour',
            description: 'Large autumn piles continue working through winter if insulated. Bank straw bales around the outside of the bin and cover the top with a tarp or thick layer of straw. Interior temperatures can stay above 100°F even in freezing weather. Turn once in January if you can access it — not critical, but beneficial.',
            tools: ['straw bales', 'heavy tarp'],
            tip: 'A pile that freezes solid is not dead — it resumes decomposition when it thaws in spring. Frozen piles have often broken down material that thaws as a more advanced compost than expected.',
          },
          {
            title: 'Continue Kitchen Scrap Composting',
            timing: 'Ongoing',
            duration: 'Ongoing',
            description: 'Never stop composting kitchen scraps. If the outdoor pile is frozen solid, keep a small indoor worm bin or a bokashi bucket for kitchen scraps through the coldest months. Bokashi fermentation preserves scraps in an anaerobic acidic state — the fermented material accelerates decomposition when added to soil or the outdoor pile in spring.',
            tools: ['worm bin or bokashi bucket', 'bokashi bran'],
          },
        ],
      },
      {
        id: 'infrastructure',
        icon: 'tool',
        title: 'Infrastructure',
        priority: 'medium',
        tasks: [
          {
            title: 'Repair and Build Beds and Trellises',
            timing: 'January – February',
            duration: '4–8 hours',
            description: 'Winter is ideal for construction while beds are empty and ground is accessible. Repair raised bed frames — check for rot, secure loose corners, add height if soil has compacted over years. Build new trellises for tomatoes, beans, cucumbers, and peas. Use rot-resistant wood (black locust, cedar, black walnut) or metal.',
            tools: ['lumber', 'drill', 'screws', 'level'],
          },
          {
            title: 'Plan and Dig Swales and Ponds',
            timing: 'January – February (in mild climates)',
            duration: '1–3 days',
            description: 'Water harvesting earthworks are best built or expanded in winter when soil is workable but vegetation is dormant. A level swale on contour catches runoff and infiltrates it into the soil profile. Even a 6-inch deep, 2-foot wide swale on a gentle slope can capture and infiltrate hundreds of gallons per rainfall event.',
            tools: ['A-frame level or laser level', 'marking flags', 'spade', 'wheelbarrow'],
            tip: 'Find contour lines by walking uphill while watching your A-frame level — mark where the bubble centers. Connect the marks. That is your contour line. Swales dug on this line will fill evenly and not run.',
          },
          {
            title: 'Plant Bare-Root Fruit Trees and Shrubs',
            timing: 'January – March (while dormant)',
            duration: '2–4 hours per tree',
            description: 'Bare-root planting is the most cost-effective and successful way to establish fruit trees. The tree is dormant, roots are undisturbed, and it establishes before its first growing season. Dig a wide, shallow hole — wider than deep. Set the graft union 2 inches above soil level. No amendments in the planting hole; use them as surface mulch only.',
            tools: ['spade', 'bare-root whips', 'compost for mulch', 'stakes'],
          },
        ],
      },
      {
        id: 'water-winter',
        icon: 'droplet',
        title: 'Water Management',
        priority: 'low',
        tasks: [
          {
            title: 'Observe and Map Water Flow',
            timing: 'During winter rains',
            duration: '30 min of observation',
            description: 'Walk your land during or after heavy winter rain. Where does water collect? Where does it run? Where does erosion occur? This observation directly informs your earthworks, swale placement, and mulching priorities for the next season. Take photos and notes. The land tells you where it needs water held and where it needs drainage.',
            tools: ['waterproof notebook', 'camera or phone'],
            tip: 'Look for the bright green patches — they reveal underground water movement, springs, or areas where runoff concentrates. These spots are often the most productive places in any landscape.',
          },
        ],
      },
    ],

    checklist: [
      'Confirm all beds have cover crop or 4" straw mulch',
      'Protect perennial root zones from freeze with wood chips',
      'Apply wood chip mulch to all pathways',
      'Draw crop rotation plan for next season',
      'Order seeds — prioritize open-pollinated varieties',
      'Write up the year\'s observations in your garden journal',
      'Sharpen and oil all tools; store off the ground',
      'Insulate outdoor compost piles with straw bales',
      'Repair raised beds and build new trellises',
      'Walk the land in rain to observe water flow patterns',
    ],

    quote: {
      text: 'The land is not a commodity to be consumed. It is a community to which we belong.',
      author: 'Aldo Leopold',
    },
  },
];
