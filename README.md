# Regen Farm — Seasonal Land Care Guide

A beautiful, season-by-season regenerative farming guide with animated text, parallax backgrounds, and smooth season transitions. Built with vanilla HTML, CSS, and JavaScript — no build tools or dependencies required.

---

## Running Locally

### Mac

1. **Open Terminal** — press `Cmd + Space`, type `Terminal`, hit Enter.

2. **Navigate to the project folder:**
   ```bash
   cd ~/path/to/regen_farm
   ```
   Replace `~/path/to/regen_farm` with wherever you saved the folder. If you cloned it from GitHub:
   ```bash
   git clone https://github.com/jlgao2/regen-farm.git
   cd regen-farm
   ```

3. **Start a local server** using Python (pre-installed on all Macs):
   ```bash
   python3 -m http.server 8080
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:8080
   ```

5. **To stop the server**, press `Ctrl + C` in Terminal.

---

### Windows

#### Option A — Python (recommended)

1. **Check if Python is installed** — open Command Prompt (`Win + R`, type `cmd`, hit Enter) and run:
   ```
   python --version
   ```
   If not installed, download it from [python.org](https://www.python.org/downloads/) and check "Add Python to PATH" during install.

2. **Navigate to the project folder:**
   ```
   cd C:\path\to\regen_farm
   ```
   Or if you cloned from GitHub:
   ```
   git clone https://github.com/jlgao2/regen-farm.git
   cd regen-farm
   ```

3. **Start a local server:**
   ```
   python -m http.server 8080
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:8080
   ```

5. **To stop the server**, press `Ctrl + C`.

#### Option B — VS Code Live Server (no Python needed)

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension (search in Extensions sidebar)
3. Open the `regen_farm` folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. The site opens automatically in your browser

---

## Why a local server?

The site uses JavaScript ES Modules (`import`/`export`). Browsers block these when opening files directly from disk (`file://`), but they work fine over any HTTP server. The Python server above is the simplest way — it's one command and uses nothing you don't already have.

---

## Adding or Editing Content

All content lives in one file: **`js/data.js`**

Each season is an object with:
- `tagline` — the hero subtitle
- `intro` — the typewriter text on the hero
- `categories` — list of task groups (soil prep, planting, water, etc.)
  - Each category has `tasks` with `title`, `description`, `timing`, `duration`, `tools`, and an optional `tip`
- `checklist` — the sidebar checklist items
- `quote` — the pull-quote at the bottom of each season

To add a task, find the right season and category in `data.js` and add an object to the `tasks` array. No other files need to change.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Core | Vanilla HTML / CSS / JavaScript (ES Modules) |
| Scroll animations | [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/) (CDN) |
| Typewriter effect | [Typed.js](https://mattboldt.com/demos/typed-js/) (CDN) |
| Fonts | Google Fonts — Playfair Display + Inter |
| Hosting | Any static host (Netlify, GitHub Pages, Vercel) |

No `npm`, no build step, no `node_modules`.

---

## Deploying Online

**Netlify Drop** (fastest — no account needed):
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the project folder onto the page
3. Get a live URL instantly

**GitHub Pages:**
1. Push this repo to GitHub
2. Go to repo Settings → Pages → Source: `main` branch, `/ (root)`
3. Live at `https://YOUR_USERNAME.github.io/regen-farm`
