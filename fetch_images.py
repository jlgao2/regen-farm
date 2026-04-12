#!/usr/bin/env python3
"""
fetch_images.py  —  Download category banner images for regen.farm

Uses Wikimedia Commons API (no API key required).
Saves to: assets/images/cat-{id}.jpg

Usage:
    python3 fetch_images.py
"""

import requests
import os
import sys
import json

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "images")

# Category ID → search query for Wikimedia Commons
CATEGORIES = {
    "soil-prep":    "soil garden tilling spade",
    "planting":     "seedling planting garden hands",
    "composting":   "compost heap organic matter",
    "cover-crops":  "cover crop field green wheat rye",
    "water":        "rain irrigation field agriculture water",
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


def fetch_category(cat_id, query):
    dest = os.path.join(OUTPUT_DIR, f"cat-{cat_id}.jpg")

    if os.path.exists(dest):
        size = os.path.getsize(dest)
        if size > 50_000:
            print(f"  [{cat_id}] already exists ({size // 1024} KB), skipping.")
            return True

    print(f"  [{cat_id}] Searching: '{query}' ...")
    titles = search_commons(query)

    if not titles:
        print(f"  [{cat_id}] No results found.")
        return False

    for title in titles:
        url = get_image_url(title)
        if not url:
            continue
        # Skip SVGs and tiny images
        if url.lower().endswith(".svg"):
            continue
        try:
            print(f"  [{cat_id}] Downloading: {title[:60]} …")
            download_image(url, dest)
            size = os.path.getsize(dest)
            if size < 30_000:
                os.remove(dest)
                print(f"  [{cat_id}] Too small ({size} bytes), trying next …")
                continue
            print(f"  [{cat_id}] Saved {size // 1024} KB → {dest}")
            return True
        except Exception as e:
            print(f"  [{cat_id}] Error downloading: {e}")
            continue

    print(f"  [{cat_id}] Could not download a usable image.")
    return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Fetching {len(CATEGORIES)} category images → {OUTPUT_DIR}\n")

    failed = []
    for cat_id, query in CATEGORIES.items():
        ok = fetch_category(cat_id, query)
        if not ok:
            failed.append(cat_id)

    print()
    if failed:
        print(f"Failed: {failed}")
        print("Try re-running, or manually place cat-{id}.jpg files in assets/images/")
        sys.exit(1)
    else:
        print("All images downloaded successfully.")
        print("Next: git add assets/images && git commit -m 'Add category images'")


if __name__ == "__main__":
    main()
