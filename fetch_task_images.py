#!/usr/bin/env python3
"""
fetch_task_images.py — Download per-task images for regen.farm

Uses specific verified Wikimedia Commons filenames from research.
Saves to: assets/images/task-{season}-{cat}-{index}.jpg

Images: close-up natural processes, no people, no prominent machinery.
Each task has a unique scene matched to the specific act being performed.

Usage:
    python3 fetch_task_images.py              # download all missing
    python3 fetch_task_images.py --force      # re-download everything
    python3 fetch_task_images.py autumn       # one season only
"""

import requests, os, sys, urllib.parse, json, time

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "images")
WIDTH = 900

HEADERS = {
    "User-Agent": "regen.farm/1.0 (https://github.com/jlgao2/regen-farm; educational)"
}

# ── Verified Wikimedia Commons filenames, one per task ────────────────────────
# Key: "{season}-{cat-id}-{task-index}"   (0-based index within category)
# Value: exact Commons filename (without "File:" prefix)

TASK_IMAGES = {
    # ── AUTUMN ──────────────────────────────────────────────────────────────
    # soil-prep
    "autumn-soil-prep-0": "Mycelium_in_forest_floor.jpg",
    "autumn-soil-prep-1": "Crushed_biochar.jpg",
    "autumn-soil-prep-2": "Champignons_dans_le_compost.jpg",
    "autumn-soil-prep-3": "Krümelgefüge.JPG",
    # planting
    "autumn-planting-0":  "Clover_root_nodules.jpg",
    "autumn-planting-1":  "Alder_(Alnus_glutinosa)_root_nodules,_Chapeltoun,_North_Ayrshire.jpg",
    # composting
    "autumn-composting-0": "Saprotrophic_fungi_as_decomposers.jpg",
    "autumn-composting-1": "Bokashi_bucket_inside_white_fuzz.jpg",
    # cover-crops
    "autumn-cover-crops-0": "A_cover_crop_of_Tillage_Radish_in_early_November.jpg",
    "autumn-cover-crops-1": "Nitrogen_fixing_nodules_in_clover_roots.jpg",
    # water
    "autumn-water-0": "Corn_in_Residue_with_Healthy_Soil_(9314025147).jpg",
    "autumn-water-1": "Agroforestry_contour_planting.jpg",

    # ── WINTER ──────────────────────────────────────────────────────────────
    # soil-prep
    "winter-soil-prep-0": "Biochar.jpg",
    "winter-soil-prep-1": "Mycelium_ramifying_over_stick_under_beech_leaves._Garth_1971_(22843228098).jpg",
    "winter-soil-prep-2": "Lactobacillus_development_in_bokashi_juice.jpg",
    "winter-soil-prep-3": "Moder_humus.jpg",
    # planting
    "winter-planting-0":  "Mycelium_of_arbuscular_mycorrhizal_fungi_with_false_color.png",
    "winter-planting-1":  "Bean_germination.jpg",
    "winter-planting-2":  "190914_wortelknolletjes_op_els_Frankia_alni.jpg",
    # composting
    "winter-composting-0": "Drying_bokashi_bran.jpg",
    "winter-composting-1": "Armillaria_spp_Mycelia_Mats.jpg",
    # cover-crops
    "winter-cover-crops-0": "2004_0518_Vetch&Oats_planted_after_maize_matured.jpg",
    "winter-cover-crops-1": "Hairy_vetch_cover_crop.jpg",
    # water
    "winter-water-0": "Agroforestry_contour_planting.jpg",
    "winter-water-1": "Great_Soil_Structure_in_Stehly_Crop_Field_in_Eastern,_SD_(21480483232).jpg",

    # ── SPRING ──────────────────────────────────────────────────────────────
    # soil-prep
    "spring-soil-prep-0": "Mycelium_growth,_Chapeltoun,_North_Ayrshire.jpg",
    "spring-soil-prep-1": "Crushed_biochar.jpg",
    "spring-soil-prep-2": "Mycelium_of_arbuscular_mycorrhizal_fungi_with_false_color.png",
    "spring-soil-prep-3": "Lactobacillus_development_in_bokashi_juice.jpg",
    # planting
    "spring-planting-0":  "Fabaceae_root_nodules_with_Bradyrhizobium_(02).jpg",
    "spring-planting-1":  "Bean_germination.jpg",
    # composting
    "spring-composting-0": "Champignons_dans_le_compost.jpg",
    "spring-composting-1": "Lactobacillus_development_in_bokashi_juice.jpg",
    # cover-crops
    "spring-cover-crops-0": "Awesome_cover_crops_started_in_eastern_South_Dakota_(14941202317).jpg",
    "spring-cover-crops-1": "Stooling_rye_straw_as_cover_after_planting_maize.jpg",
    # water
    "spring-water-0": "Great_Soil_Structure_in_Stehly_Crop_Field_in_Eastern,_SD_(21480483232).jpg",
    "spring-water-1": "Agroforestry_contour_planting.jpg",

    # ── SUMMER ──────────────────────────────────────────────────────────────
    # soil-prep
    "summer-soil-prep-0": "Biochar_Application.jpg",
    "summer-soil-prep-1": "Macro_Shot_Of_Raindrops_On_A_Leaf_At_RHS_Wisley_Surrey_UK.jpg",
    "summer-soil-prep-2": "Symbiotic_nitrogen_fixing_bacteria_inside_legume_root_nodule_cells.tif",
    # planting
    "summer-planting-0":  "Three_Sisters_Garden.jpg",
    "summer-planting-1":  "Robinia_pseudoacacia_root_nodules.JPG",
    "summer-planting-2":  "KarottenZwiebeln_266.JPG",
    # composting
    "summer-composting-0": "Saprotrophic_fungi_as_decomposers.jpg",
    "summer-composting-1": "Homebrew_Wine_fermenting_After_6_Days.jpg",
    # cover-crops
    "summer-cover-crops-0": "Sunn_Hemp_Cover_Crop.jpg",
    "summer-cover-crops-1": "Hairy_vetch_cover_crop.jpg",
    # water
    "summer-water-0": "Agroforestry_contour_planting.jpg",
    "summer-water-1": "Wood_Chip_Mulch_Texture_DTXR-WD-CP-1.jpg",
}


def get_image_url(filename):
    """Resolve a Commons filename to a thumbnail URL via the API."""
    title = f"File:{filename}"
    params = {
        "action":    "query",
        "titles":    title,
        "prop":      "imageinfo",
        "iiprop":    "url",
        "iiurlwidth": WIDTH,
        "format":    "json",
    }
    r = requests.get(
        "https://commons.wikimedia.org/w/api.php",
        params=params, headers=HEADERS, timeout=15,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        info = page.get("imageinfo", [])
        if info:
            return info[0].get("thumburl") or info[0].get("url")
    return None


def download(url, dest):
    r = requests.get(url, headers=HEADERS, timeout=30, stream=True)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(65536):
            f.write(chunk)


def fetch(key, filename, force=False):
    # Output always as .jpg regardless of source extension
    dest = os.path.join(OUTPUT_DIR, f"task-{key}.jpg")
    if os.path.exists(dest) and not force:
        size = os.path.getsize(dest)
        if size > 20_000:
            print(f"  [{key}] exists ({size // 1024} KB), skipping.")
            return True

    url = get_image_url(filename)
    if not url:
        print(f"  [{key}] Could not resolve URL for: {filename}")
        return False

    print(f"  [{key}] {filename[:55]} ...")
    try:
        download(url, dest)
        size = os.path.getsize(dest)
        if size < 10_000:
            os.remove(dest)
            print(f"  [{key}] Too small ({size}B), skipping.")
            return False
        print(f"  [{key}] {size // 1024} KB saved.")
        time.sleep(1.5)
        return True
    except Exception as e:
        print(f"  [{key}] Error: {e}")
        time.sleep(4)
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    force = "--force" in sys.argv
    season_filter = next((a for a in sys.argv[1:] if not a.startswith("--")), None)

    targets = {k: v for k, v in TASK_IMAGES.items()
               if season_filter is None or k.startswith(season_filter)}

    print(f"Fetching {len(targets)} task images → {OUTPUT_DIR}\n")

    failed = []
    for key, filename in targets.items():
        if not fetch(key, filename, force=force):
            failed.append(key)

    print()
    if failed:
        print(f"Failed ({len(failed)}): {failed}")
        sys.exit(1)
    else:
        print(f"All {len(targets)} task images downloaded.")


if __name__ == "__main__":
    main()
