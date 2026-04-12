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
  spring: 'assets/audio/vivaldi-spring.mp3',
  summer: 'assets/audio/vivaldi-summer.mp3',
  autumn: 'assets/audio/vivaldi-autumn.mp3',
  winter: 'assets/audio/vivaldi-winter.mp3',
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
  const player = buildPlayer();

  audio = new Audio();
  audio.loop    = true;
  audio.volume  = 0.5;
  audio.muted   = true;    // start muted — only muted autoplay is allowed cross-browser
  audio.preload = 'auto';

  // Start with current season
  const initial = document.body.dataset.season || 'autumn';
  currentSeason = initial;
  loadTrack(initial);

  // Keep UI in sync with actual audio state
  audio.addEventListener('pause',  syncPlayPauseUI);
  audio.addEventListener('play',   syncPlayPauseUI);
  audio.addEventListener('ended',  syncPlayPauseUI);
  audio.addEventListener('error', () => {
    console.warn('[audio] load error', audio.error?.message, audio.src);
  });

  // ── Autoplay muted as soon as the track is ready ──────────────
  audio.addEventListener('canplay', () => {
    if (audio.paused) {
      audio.play().catch(() => {});   // muted play almost always succeeds
    }
  }, { once: true });

  // ── Unmute on first user interaction ─────────────────────────
  // After any interaction, silently unmute — audio is already playing
  const unmuteOnInteraction = () => {
    if (audio.muted) {
      audio.muted = false;
      userPlayed  = true;
      syncMuteUI();
      syncPlayPauseUI();
      player.classList.remove('needs-unmute');
    }
  };
  ['click', 'keydown', 'scroll', 'touchstart', 'pointerdown'].forEach(ev =>
    window.addEventListener(ev, unmuteOnInteraction, { once: true, passive: true })
  );

  // ── Play / pause button ───────────────────────────────────────
  let playPending = false;
  document.getElementById('audio-play').addEventListener('click', () => {
    if (playPending) return;

    // If still muted from autoplay, unmute and let it play
    if (audio.muted) {
      unmuteOnInteraction();
      return;
    }

    if (audio.paused) {
      playPending = true;
      userPlayed  = true;
      audio.play()
        .then(() => { playPending = false; syncPlayPauseUI(); })
        .catch(err => {
          playPending = false;
          console.warn('[audio] play() rejected:', err.name, err.message);
          syncPlayPauseUI();
        });
    } else {
      audio.pause();
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

  // Switch track when season changes
  document.body.addEventListener('seasonchange', e => {
    const id = e.detail?.id;
    if (id && id !== currentSeason) {
      currentSeason = id;
      loadTrack(id);
    }
  });

  // Show player — with a subtle pulse to signal muted autoplay is active
  setTimeout(() => {
    player.classList.add('is-visible');
    if (audio.muted) player.classList.add('needs-unmute');
  }, 1400);
}
