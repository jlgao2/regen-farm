#!/usr/bin/env python3
"""
fetch_images.py  —  Download season × category images for regen.farm

Uses Wikimedia Commons API (no API key required, all images freely licensed).
Saves 20 images as:  assets/images/cat-{season}-{category}.jpg

Images show the regenerative ACT happening in each season — natural processes
without people or prominent man-made objects. Different scenes per season.

Usage:
    python3 fetch_images.py              # download all missing images
    python3 fetch_images.py --force      # re-download everything
    python3 fetch_images.py autumn       # download only autumn images
"""

import requests
import os
import sys
import json

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "images")

# ── Season × category → Wikimedia Commons search queries ─────────────────────
# Queries tuned for natural-process photography without people.
# Keys: "{season}-{cat-id}" matching the renderer's cat-{season}-{cat-id}.jpg

IMAGES = {
    # ── AUTUMN ──────────────────────────────────────────────────────────────
    "autumn-soil-prep":    "mycelium hyphae soil fungal",
    "autumn-planting":     "vegetable garden autumn planting",
    "autumn-composting":   "humus soil organic matter dark",
    "autumn-cover-crops":  "cover crop winter soil protection",
    "autumn-water":        "agricultural water management dam",

    # ── WINTER ──────────────────────────────────────────────────────────────
    "winter-soil-prep":    "biochar carbon soil amendment",
    "winter-planting":     "apple tree planting dormant winter",
    "winter-composting":   "compost kitchen organic matter",
    "winter-cover-crops":  "rye frost winter crop field",
    "winter-water":        "farm dam irrigation pond",

    # ── SPRING ──────────────────────────────────────────────────────────────
    "spring-soil-prep":    "earthworm soil profile",
    "spring-planting":     "seedling transplant spring vegetable",
    "spring-composting":   "organic compost pile garden",
    "spring-cover-crops":  "clover field green cover crop spring",
    "spring-water":        "irrigation channel water field spring",

    # ── SUMMER ──────────────────────────────────────────────────────────────
    "summer-soil-prep":    "straw mulch garden soil moisture",
    "summer-planting":     "corn bean squash companion",
    "summer-composting":   "liquid fertilizer fermentation organic",
    "summer-cover-crops":  "buckwheat flower white field",
    "summer-water":        "dry soil drought agriculture",
}

# Image dimensions to request
WIDTH = 1400

HEADERS = {
    "User-Agent": "regen.farm/1.0 (https://github.com/jlgao2/regen-farm; educational)"
}


def search_commons(query, limit=20):
    """Search Wikimedia Commons for images matching query."""
    params = {
        "action":     "query",
        "list":       "search",
        "srsearch":   f"{query} filetype:jpg",
        "srnamespace": 6,   # File namespace
        "srlimit":    limit,
        "format":     "json",
    }
    r = requests.get(
        "https://commons.wikimedia.org/w/api.php",
        params=params,
        headers=HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    hits = r.json().get("query", {}).get("search", [])
    return [h["title"] for h in hits]


def get_image_url(file_title):
    """Get direct image URL for a Commons file title."""
    params = {
        "action":  "query",
        "titles":  file_title,
        "prop":    "imageinfo",
        "iiprop":  "url",
        "iiurlwidth": WIDTH,
        "format":  "json",
    }
    r = requests.get(
        "https://commons.wikimedia.org/w/api.php",
        params=params,
        headers=HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for page in pages.values():
        info = page.get("imageinfo", [])
        if info:
            return info[0].get("thumburl") or info[0].get("url")
    return None


def download_image(url, dest_path):
    """Download image from url to dest_path."""
    r = requests.get(url, headers=HEADERS, timeout=30, stream=True)
    r.raise_for_status()
    with open(dest_path, "wb") as f:
        for chunk in r.iter_content(chunk_size=65536):
            f.write(chunk)


def fetch_image(key, query, force=False):
    """Download one season-category image from Wikimedia Commons."""
    dest = os.path.join(OUTPUT_DIR, f"cat-{key}.jpg")

    if os.path.exists(dest) and not force:
        size = os.path.getsize(dest)
        if size > 50_000:
            print(f"  [{key}] already exists ({size // 1024} KB), skipping.")
            return True

    print(f"  [{key}] Searching: '{query}' ...")
    titles = search_commons(query)

    if not titles:
        print(f"  [{key}] No results found — try a different query.")
        return False

    for title in titles:
        url = get_image_url(title)
        if not url:
            continue
        if url.lower().endswith(".svg"):
            continue
        try:
            print(f"  [{key}] Downloading: {title[:60]} …")
            download_image(url, dest)
            size = os.path.getsize(dest)
            if size < 30_000:
                os.remove(dest)
                print(f"  [{key}] Too small ({size} bytes), trying next …")
                continue
            print(f"  [{key}] Saved {size // 1024} KB → {dest}")
            return True
        except Exception as e:
            print(f"  [{key}] Error: {e}")
            continue

    print(f"  [{key}] Could not download a usable image.")
    return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    force = "--force" in sys.argv
    season_filter = next((a for a in sys.argv[1:] if not a.startswith("--")), None)

    targets = {k: v for k, v in IMAGES.items()
               if season_filter is None or k.startswith(season_filter)}

    print(f"Fetching {len(targets)} season × category images → {OUTPUT_DIR}")
    if season_filter:
        print(f"Filter: {season_filter} only")
    print()

    failed = []
    for key, query in targets.items():
        ok = fetch_image(key, query, force=force)
        if not ok:
            failed.append(key)

    print()
    if failed:
        print(f"Failed ({len(failed)}): {failed}")
        print("\nFor each failed image, search manually on:")
        print("  https://commons.wikimedia.org/wiki/Special:Search")
        print("and save to assets/images/cat-{season}-{category}.jpg")
        sys.exit(1)
    else:
        print(f"All {len(targets)} images downloaded — no bare ground on the site.")


if __name__ == "__main__":
    main()
