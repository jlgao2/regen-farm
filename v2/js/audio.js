/* ============================================================
   AUDIO — Vivaldi Four Seasons, season-synced
   ============================================================
   Drop these files in /assets/audio/:
     vivaldi-spring.mp3
     vivaldi-summer.mp3
     vivaldi-autumn.mp3
     vivaldi-winter.mp3

   Free public-domain recordings: https://musopen.org/music/2213
   (search "Four Seasons Vivaldi" — download the mp3 for each movement)
   ============================================================ */

const TRACKS = {
  spring: '../assets/audio/vivaldi-spring.mp3',
  summer: '../assets/audio/vivaldi-summer.mp3',
  autumn: '../assets/audio/vivaldi-autumn.mp3',
  winter: '../assets/audio/vivaldi-winter.mp3',
};

let audio        = null;
let currentSeason = null;
let userPlayed   = false;   // respect browser autoplay policy

// ── Build player UI ───────────────────────────────────────────

function buildPlayer() {
  const player = document.createElement('div');
  player.className  = 'audio-player';
  player.id         = 'audio-player';
  player.innerHTML  = `
    <button class="audio-btn" id="audio-play" aria-label="Play">
      <svg class="icon-play"  viewBox="0 0 16 16" fill="currentColor"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg>
      <svg class="icon-pause" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12" rx="1"/><rect x="9.5" y="2" width="3.5" height="12" rx="1"/></svg>
    </button>
    <div class="audio-info">
      <span class="audio-title">Vivaldi — Four Seasons</span>
      <span class="audio-movement" id="audio-movement"></span>
    </div>
    <input class="audio-volume" id="audio-volume" type="range" min="0" max="1" step="0.01" value="0.5" aria-label="Volume"/>
    <button class="audio-btn audio-btn--mute" id="audio-mute" aria-label="Mute">
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path class="icon-vol" d="M2 5.5h2.5l4-3.5v12l-4-3.5H2V5.5zM10.5 5.5q1.5 1 1.5 2.5t-1.5 2.5"/>
        <path class="icon-muted" d="M2 5.5h2.5l4-3.5v12l-4-3.5H2V5.5zM10.5 6l3 4M13.5 6l-3 4" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>
    </button>
  `;

  document.body.appendChild(player);
  return player;
}

// ── Season labels ─────────────────────────────────────────────

const MOVEMENT_LABELS = {
  spring: 'Op. 8 No. 1 — Spring',
  summer: 'Op. 8 No. 2 — Summer',
  autumn: 'Op. 8 No. 3 — Autumn',
  winter: 'Op. 8 No. 4 — Winter',
};

// ── Core audio logic ──────────────────────────────────────────

function loadTrack(seasonId) {
  if (!audio) return;
  const src = TRACKS[seasonId];
  if (!src) return;

  const wasPlaying = !audio.paused;
  audio.src        = src;
  audio.load();

  document.getElementById('audio-movement').textContent =
    MOVEMENT_LABELS[seasonId] || '';

  if (wasPlaying && userPlayed) {
    audio.play().catch(() => {});
  }
}

function syncPlayPauseUI() {
  const btn = document.getElementById('audio-play');
  if (!btn) return;
  const paused = !audio || audio.paused;
  btn.classList.toggle('is-playing', !paused);
  document.getElementById('audio-player')?.classList.toggle('is-playing', !paused);
}

function syncMuteUI() {
  const btn = document.getElementById('audio-mute');
  if (!btn || !audio) return;
  btn.classList.toggle('is-muted', audio.muted);
}

// ── Public init ───────────────────────────────────────────────

export function initAudio() {
  // Don't init on touch/mobile (autoplay restrictions make it awkward)
  const player = buildPlayer();

  audio = new Audio();
  audio.loop   = true;
  audio.volume = 0.5;

  // Start with current season
  const initial = document.body.dataset.season || 'autumn';
  loadTrack(initial);
  currentSeason = initial;

  // Play / pause
  document.getElementById('audio-play').addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        userPlayed = true;
        syncPlayPauseUI();
      }).catch(() => {});
    } else {
      audio.pause();
      syncPlayPauseUI();
    }
  });

  // Volume slider
  document.getElementById('audio-volume').addEventListener('input', e => {
    audio.volume = parseFloat(e.target.value);
    if (audio.muted && audio.volume > 0) {
      audio.muted = false;
      syncMuteUI();
    }
  });

  // Mute toggle
  document.getElementById('audio-mute').addEventListener('click', () => {
    audio.muted = !audio.muted;
    syncMuteUI();
  });

  audio.addEventListener('pause', syncPlayPauseUI);
  audio.addEventListener('play',  syncPlayPauseUI);

  // Switch track when season changes
  document.body.addEventListener('seasonchange', e => {
    const id = e.detail?.id;
    if (id && id !== currentSeason) {
      currentSeason = id;
      loadTrack(id);
    }
  });

  // Autoplay on first user interaction (browsers require it)
  const startOnInteraction = () => {
    audio.play().then(() => {
      userPlayed = true;
      syncPlayPauseUI();
    }).catch(() => {});
    ['click', 'keydown', 'scroll', 'touchstart'].forEach(ev =>
      window.removeEventListener(ev, startOnInteraction)
    );
  };
  ['click', 'keydown', 'scroll', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, startOnInteraction, { once: true, passive: true })
  );

  // Fade in player after a short delay
  setTimeout(() => player.classList.add('is-visible'), 1200);
}
