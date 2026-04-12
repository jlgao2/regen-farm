#!/usr/bin/env python3
"""
Multi-agent guide generator for the Regen Farm seasonal guide.

Architecture:
  Orchestrator  →  Researcher (per season)  →  Formatter (per season)
                                             →  assembles data.js

Usage:
  pip install anthropic
  ANTHROPIC_API_KEY=your-key python generate_guide.py

Edit REGION and HEMISPHERE below to target any location.
"""

import anthropic
import json
import re
import sys

# ─── Configuration ────────────────────────────────────────────────────────────

REGION = "temperate Australia and New Zealand"  # Change to your target region
HEMISPHERE = "southern"                         # "northern" or "southern"
OUTPUT_FILE = "v2/js/data_generated.js"         # Written relative to this script

# ─── Season definitions ───────────────────────────────────────────────────────

NORTHERN_SEASONS = [
    {"id": "spring", "label": "Spring", "months": "March — May",   "heroGradient": "hero-bg--spring"},
    {"id": "summer", "label": "Summer", "months": "June — August", "heroGradient": "hero-bg--summer"},
    {"id": "autumn", "label": "Autumn", "months": "Sept — Nov",    "heroGradient": "hero-bg--autumn"},
    {"id": "winter", "label": "Winter", "months": "Dec — Feb",     "heroGradient": "hero-bg--winter"},
]

SOUTHERN_SEASONS = [
    {"id": "autumn", "label": "Autumn", "months": "March — May",   "heroGradient": "hero-bg--autumn"},
    {"id": "winter", "label": "Winter", "months": "June — August", "heroGradient": "hero-bg--winter"},
    {"id": "spring", "label": "Spring", "months": "Sept — Nov",    "heroGradient": "hero-bg--spring"},
    {"id": "summer", "label": "Summer", "months": "Dec — Feb",     "heroGradient": "hero-bg--summer"},
]

SEASONS = NORTHERN_SEASONS if HEMISPHERE == "northern" else SOUTHERN_SEASONS

CATEGORIES = [
    {"id": "soil-prep",     "icon": "shovel",   "title": "Soil Preparation"},
    {"id": "planting",      "icon": "seedling", "title": "Planting"},
    {"id": "composting",    "icon": "compost",  "title": "Composting"},
    {"id": "cover-crops",   "icon": "wheat",    "title": "Cover Crops"},
    {"id": "water",         "icon": "droplet",  "title": "Water Management"},
]

# ─── Microseason calendar context (for researcher prompt) ─────────────────────
# Seven cross-seasonal periods drawn from Noongar, Wurundjeri, Māori Maramataka,
# Dja Dja Wurrung and Kaurna calendars. Provided to the researcher so generated
# tasks are grounded in appropriate microseasonal timing.

MICROSEASON_CONTEXT = """
The year is divided into seven ecological microseasons observed across temperate
SE Australia and Aotearoa New Zealand. When specifying timing, use these alongside
calendar months to reflect indigenous and ecological precision:

  1. Birak · Raumati (Dec 1 – Feb 14) — first-summer heat; Pohutukawa in bloom; Rehua/Antares governs
  2. Iuk (Feb 15 – Apr 14) — eel migration; autumn equinox; soil temp falling through 18°C
  3. Makuru · Paenga-whāwhā (Apr 15 – Jun 14) — breaking rains; mushroom flush; Matariki approaching
  4. Waring · Hōtoke (Jun 15 – Aug 7) — wombat cold; Matariki rises at dawn; deep fungal season
  5. Djilba · Guling (Aug 8 – Sep 21) — silver wattle in gold; orchids; kōwhai flowers; soil 8–10°C
  6. Kambarang · Mahuru (Sep 22 – Nov 7) — blossoming earth; equinox; last frosts pass; whitebait run
  7. Buath Gurru · Whiringa (Nov 8 – Nov 30) — kangaroo grass flowers; Rehua climbing; Pohutukawa reddens

Key phenological anchors for timing:
  - Matariki (Pleiades) heliacal rise: late June (~Jun 22–30) — Māori New Year; start of planning season
  - Silver wattle (Acacia dealbata) flowers: July–September (peak Aug–Sep) — spring approach signal
  - Mānuka (Leptospermum scoparium) flowers: October–January — mycorrhizal host at peak activity
  - Kangaroo grass (Themeda triandra) seeds: December–April — native pasture health indicator
  - Pōhutukawa (Metrosideros excelsa) flowers: mid-late December — peak summer in NZ
  - Rehua (Antares/Scorpius): prominent in summer night sky — Māori star of abundance and energy
"""

# ─── Claude client ────────────────────────────────────────────────────────────

client = anthropic.Anthropic()


# ─── Agent 1: Researcher ──────────────────────────────────────────────────────

def research_season(season: dict, region: str) -> str:
    """
    Researcher agent: generates detailed, region-specific farming tasks
    for one season. Returns raw research as structured text.
    """
    label = season["label"]
    months = season["months"]

    print(f"  [Researcher] Generating {label} tasks for {region}...")

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=4096,
        system=f"""You are a cutting-edge regenerative agriculture advisor specialising in {region}.
You are deeply familiar with temperate Australian and New Zealand conditions: red-brown earths,
basalt soils, volcanic loams of the Waikato and Canterbury Plains, the high country, and coastal zones.
You draw on the latest research in soil microbiology, mycorrhizal inoculation, biochar application,
Korean Natural Farming (KNF), agroforestry, Keyline design, biological soil amendments, and
indigenous land management practices. Your advice is evidence-based, specific, and pushes beyond
conventional organic farming into genuinely regenerative systems thinking.""",
        messages=[{
            "role": "user",
            "content": f"""Generate cutting-edge regenerative farming tasks for {label} ({months}) in temperate {region}.

Prioritise practices that are:
- Based on the latest soil science (mycorrhizal networks, glomalin, soil food web)
- Drawn from Korean Natural Farming (KNF), Elaine Ingham's work, or Charles Massy's "Call of the Reed Warbler"
- Specific to temperate AU/NZ conditions (Otago, Canterbury, Hawke's Bay, Victoria, Tasmania, SE SA)
- Naming actual local cultivars, native plants (e.g. kānuka, mānuka, puha), and regional suppliers where relevant
- Incorporating indigenous land stewardship knowledge where appropriate

The ecological calendar for this region:
{MICROSEASON_CONTEXT}

When giving timing for tasks, reference both calendar dates AND the relevant microseasonal
period name where appropriate (e.g. "Early Makuru / mid-April").

For EACH of these five categories, provide 2–4 specific tasks:
1. Soil Preparation (include biostimulants, fungal inoculants, EM1, biochar where seasonal)
2. Planting (AU/NZ-appropriate cultivars, heirloom varieties, companion planting guilds)
3. Composting (including bokashi, worm farming, vermicast teas, KNF ferments)
4. Cover Crops (native species mixes, nitrogen fixers suited to AU/NZ, green manures)
5. Water Management (Keyline, swales, grey-water reuse, rain-fed strategies)

For each task include:
- Task title (specific and action-oriented)
- Timing (specific month or window within {months}, with AU/NZ context)
- Duration (realistic time estimate)
- Description (3–5 sentences, highly specific to temperate AU/NZ conditions)
- Tools needed (list)
- Pro tip (one cutting-edge, expert insight citing a technique, researcher, or practice)

Also provide:
- A poetic one-line seasonal tagline (evocative of southern land and light, not generic)
- A 2–3 sentence seasonal intro (grounded in AU/NZ landscape and ecology)
- 6–8 checklist items (concise action phrases)
- A short pull quote about this season's relationship to the land (could reference Māori or Aboriginal seasonal knowledge)

Name specific soil types, frost dates, rainfall patterns, and conditions for temperate AU/NZ zones."""
        }]
    )

    # Extract text from response (thinking blocks come first, skip them)
    text_blocks = [block.text for block in response.content if block.type == "text"]
    if not text_blocks:
        types = [block.type for block in response.content]
        raise RuntimeError(f"Researcher got no text block. Block types: {types}")
    return text_blocks[0]


# ─── Agent 2: Formatter ───────────────────────────────────────────────────────

def format_season_data(season: dict, research: str) -> dict:
    """
    Formatter agent: converts raw research into the exact data.js structure.
    Returns a Python dict matching the SEASONS array schema.
    """
    label = season["label"]
    print(f"  [Formatter] Structuring {label} data...")

    schema_example = json.dumps({
        "id": season["id"],
        "label": season["label"],
        "tagline": "Example tagline here",
        "months": season["months"],
        "heroGradient": season["heroGradient"],
        "intro": "Seasonal intro paragraph here.",
        "categories": [
            {
                "id": "soil-prep",
                "icon": "shovel",
                "title": "Soil Preparation",
                "priority": "high",
                "imageAlt": "One descriptive sentence of a natural scene (no people, minimal man-made objects) that shows the soil preparation ACT happening this season — e.g. macro view of mycelial threads in autumn soil.",
                "imageQuery": "3-5 Unsplash search keywords for the above scene",
                "tasks": [
                    {
                        "title": "Task Title",
                        "timing": "Early March / Makuru",
                        "duration": "2–3 hours",
                        "description": "Full task description here.",
                        "tools": ["tool1", "tool2"],
                        "tip": "Optional pro tip here."
                    }
                ]
            }
        ],
        "checklist": ["Checklist item one", "Checklist item two"],
        "quote": "A short pull quote about this season."
    }, indent=2)

    category_ids = json.dumps([
        {"id": c["id"], "icon": c["icon"], "title": c["title"]}
        for c in CATEGORIES
    ], indent=2)

    with client.messages.stream(
        model="claude-opus-4-6",
        max_tokens=16000,
        system="""You are a precise data formatter. Your only job is to convert research notes
into a valid JSON object matching a given schema exactly. Output ONLY valid JSON — no markdown
fences, no explanation, no trailing text.

CRITICAL JSON escaping rules:
- Apostrophes/single quotes inside strings do NOT need escaping — write them as-is (e.g. "it's", "farmer's")
- Double quotes inside strings MUST be escaped as \\"
- Backslashes MUST be escaped as \\\\
- Newlines inside strings MUST be \\n
- Never leave a string unterminated
- Em dashes (—) and unicode characters are fine as-is""",
        messages=[{
            "role": "user",
            "content": f"""Convert this research into a JSON object matching the schema below exactly.

RESEARCH:
{research}

REQUIRED SCHEMA (follow this structure precisely):
{schema_example}

CATEGORY IDs AND ICONS to use (match these exactly):
{category_ids}

Rules:
- Use ALL FIVE categories. If research is sparse for one, invent 2 plausible tasks.
- "priority" must be "high", "medium", or "low" — set soil-prep and planting to "high", rest to "medium"
- Keep "id", "months", and "heroGradient" exactly as given in the schema example
- For "imageAlt": write a single descriptive sentence of a NATURAL SCENE (no people, no prominent man-made objects) that visually represents the category's act happening in this specific season. Focus on natural processes: root systems, fungi, decomposition, water flow, plant growth. Different for each season.
- For "imageQuery": provide 3–5 Unsplash/Pexels search keywords as a comma-separated string matching the imageAlt scene.
- Output ONLY the JSON object, nothing else"""
        }]
    ) as stream:
        raw = stream.get_final_text().strip()

    # Strip any accidental markdown fences
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(
            f"Formatter output invalid JSON for {label}: {e.msg}", e.doc, e.pos
        ) from e


# ─── Orchestrator ─────────────────────────────────────────────────────────────

def generate_guide(region: str) -> list[dict]:
    """
    Orchestrator: drives the researcher → formatter pipeline for all seasons.
    Returns the complete SEASONS array as a list of dicts.
    """
    seasons_data = []

    for i, season in enumerate(SEASONS, 1):
        print(f"\n{'═' * 50}")
        print(f"Season {i}/{len(SEASONS)}: {season['label']} ({season['months']})")
        print(f"{'═' * 50}")

        research = research_season(season, region)
        season_obj = format_season_data(season, research)
        seasons_data.append(season_obj)
        print(f"  ✓ {season['label']} complete ({len(season_obj.get('categories', []))} categories)")

    return seasons_data


# ─── JS serialiser ────────────────────────────────────────────────────────────

def dict_to_js(obj, indent=0) -> str:
    """Serialize a Python object to JavaScript object literal syntax."""
    pad = "  " * indent
    inner = "  " * (indent + 1)

    if isinstance(obj, dict):
        if not obj:
            return "{}"
        lines = []
        for k, v in obj.items():
            lines.append(f"{inner}{k}: {dict_to_js(v, indent + 1)},")
        return "{\n" + "\n".join(lines) + "\n" + pad + "}"

    if isinstance(obj, list):
        if not obj:
            return "[]"
        lines = [f"{inner}{dict_to_js(item, indent + 1)}," for item in obj]
        return "[\n" + "\n".join(lines) + "\n" + pad + "]"

    if isinstance(obj, str):
        escaped = obj.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
        return f"'{escaped}'"

    if isinstance(obj, bool):
        return "true" if obj else "false"

    return str(obj)


def write_data_js(seasons_data: list[dict], output_path: str, region: str):
    header = f"""/* ============================================================
   DATA — Regenerative farm guide generated for: {region}
   Generated by generate_guide.py (multi-agent pipeline)
   ============================================================ */

export const SEASONS = """

    seasons_js = dict_to_js(seasons_data)
    content = header + seasons_js + ";\n"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\n✓ Written to {output_path}")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"Regen Farm Guide Generator")
    print(f"Region:     {REGION}")
    print(f"Hemisphere: {HEMISPHERE}")
    print(f"Output:     {OUTPUT_FILE}")
    print(f"Seasons:    {', '.join(s['label'] for s in SEASONS)}\n")

    try:
        seasons_data = generate_guide(REGION)
    except anthropic.APIError as e:
        print(f"\nAPI error: {e}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"\nFormatter produced invalid JSON: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"\n{'═' * 50}")
    print("Assembling output...")
    write_data_js(seasons_data, OUTPUT_FILE, REGION)

    print(f"\nDone! To use in your site:")
    print(f"  1. Review {OUTPUT_FILE}")
    print(f"  2. Rename it to js/data.js (or update the import in js/main.js)")


if __name__ == "__main__":
    main()
