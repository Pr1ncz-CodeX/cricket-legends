let ALL_PLAYERS = [];
const PAGE_SIZE = 24;

const state = {
  activePage: "chronicle",
  format: "odi",
  compareFormat: "odi",
  lbFormat: "odi",
  country: "ALL",
  title: "ALL",
  decade: "ALL",
  role: "ALL",
  letter: "ALL",
  sort: "titles",
  search: "",
  visibleLimit: PAGE_SIZE,
  trophyTab: "ALL",
  dreamXI: ["rohit", "tendulkar", "kohli", "ponting", "kallis", "dhoni", "hardik", "warne", "cummins", "bumrah", "mcgrath"]
};

function switchMainPage(targetPage) {
  state.activePage = targetPage;
  document.querySelectorAll(".page-switch-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === targetPage);
  });
  document.querySelectorAll(".page-container").forEach(page => {
    page.classList.toggle("active", page.id === `page-${targetPage}`);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (window.StadiumAudio) StadiumAudio.playBatTok();

  if (targetPage === "chronicle") {
    FX.speakBroadcast("Page 1: The Global Chronicle of International Cricket — Origins, Laws, Formats, and World Championships.");
  } else {
    FX.speakBroadcast(`Page 2: ICC Legends & Players Archive (${ALL_PLAYERS.length} icons loaded). Click any player for holographic telemetry.`);
  }
}

function getFilteredAndSortedPlayers() {
  const filtered = ALL_PLAYERS.filter(p => {
    const matchCountry = state.country === "ALL" || p.country === state.country;
    const matchRole = state.role === "ALL" || p.role === state.role;
    const matchDecade = state.decade === "ALL" || p.decade === state.decade;
    const matchLetter = state.letter === "ALL" || p.name.toUpperCase().startsWith(state.letter);
    const matchTitle = state.title === "ALL"
      ? true
      : state.title === "HOF"
        ? Boolean(p.hallOfFame)
        : p.iccTitles.some(t => t.trophy === state.title);

    const q = state.search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.nickname.toLowerCase().includes(q) ||
      p.jersey.includes(q);

    return matchCountry && matchRole && matchDecade && matchLetter && matchTitle && matchSearch;
  });

  const fmt = state.format;
  return filtered.sort((a, b) => {
    if (state.sort === "titles") return b.iccTitles.length - a.iccTitles.length;
    if (state.sort === "runs") return b.stats[fmt].runs - a.stats[fmt].runs;
    if (state.sort === "wickets") return b.stats[fmt].wickets - a.stats[fmt].wickets;
    if (state.sort === "avg") return b.stats[fmt].avg - a.stats[fmt].avg;
    return a.name.localeCompare(b.name);
  });
}

function updatePlayersView(resetLimit = false) {
  if (resetLimit) state.visibleLimit = PAGE_SIZE;
  const sorted = getFilteredAndSortedPlayers();
  UI.renderPlayers(sorted.slice(0, state.visibleLimit), sorted.length, state.format);
}

function updateTrophiesView() {
  const filtered = state.trophyTab === "ALL"
    ? ICC_TOURNAMENTS
    : ICC_TOURNAMENTS.filter(t => t.type === state.trophyTab);
  UI.renderTrophies(filtered);
}

function updateCompareView() {
  const id1 = document.getElementById("compare-p1").value;
  const id2 = document.getElementById("compare-p2").value;
  const p1 = ALL_PLAYERS.find(p => p.id === id1) || ALL_PLAYERS[0];
  const p2 = ALL_PLAYERS.find(p => p.id === id2) || ALL_PLAYERS[1];
  if (p1 && p2) {
    UI.renderComparison(p1, p2, state.compareFormat);
    FX.speakBroadcast(`Comparing ${p1.name} (${p1.iccTitles.length} ICC Titles) vs ${p2.name} (${p2.iccTitles.length} ICC Titles) in ${state.compareFormat.toUpperCase()} cricket.`);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Start 60 FPS Floodlight Canvas, Scroll Counters & Wagon Wheel Sandbox immediately
  if (window.StadiumFX) StadiumFX.init();

  try {
    const res = await fetch("data/players.json");
    ALL_PLAYERS = await res.json();
  } catch (err) {
    document.getElementById("roster-count").textContent = "Failed to load data/players.json. Run via VS Code Live Server or Vercel.";
    return;
  }

  UI.renderAlphabetBar(state.letter);
  UI.populateCompareSelects(ALL_PLAYERS);
  updatePlayersView(true);
  UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
  UI.renderLeaderboards(ALL_PLAYERS, state.lbFormat);
  updateTrophiesView();
  updateCompareView();

  // Initialize Morphological 3D Cards & Broadcast Welcome
  FX.bindMagneticCards();
  FX.speakBroadcast("Welcome to the Cricket Chronicle. Explore the history and science of the game, or launch the Players & Legends Archive.");

  // Page 1 <-> Page 2 Switchers
  document.querySelectorAll(".page-switch-btn").forEach(btn => {
    btn.addEventListener("click", () => switchMainPage(btn.dataset.page));
  });
  document.querySelectorAll(".go-to-archive-btn").forEach(btn => {
    btn.addEventListener("click", () => switchMainPage("archive"));
  });
  document.querySelectorAll(".back-to-chronicle-btn").forEach(btn => {
    btn.addEventListener("click", () => switchMainPage("chronicle"));
  });
  document.getElementById("brand-home").addEventListener("click", () => switchMainPage("chronicle"));

  // Stadium Web Audio FX Toggle
  const sfxBtn = document.getElementById("sfx-toggle");
  if (sfxBtn && window.StadiumAudio) {
    sfxBtn.addEventListener("click", e => {
      StadiumAudio.enabled = !StadiumAudio.enabled;
      e.target.classList.toggle("active", StadiumAudio.enabled);
      e.target.textContent = StadiumAudio.enabled ? "🏏 Stadium FX: ON" : "🔇 Stadium FX: OFF";
      if (StadiumAudio.enabled) StadiumAudio.playTrophyChime();
    });
  }

  // Voice Commentary Toggle
  document.getElementById("voice-toggle").addEventListener("click", e => {
    FX.voiceEnabled = !FX.voiceEnabled;
    e.target.classList.toggle("active", FX.voiceEnabled);
    e.target.textContent = FX.voiceEnabled ? "🔊 Voice: ON" : "🔇 Voice: OFF";
    if (FX.voiceEnabled) {
      FX.speakBroadcast("Broadcast announcer voice activated.", true);
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  });

  // Page 2 Sub-Navigation
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
      document.getElementById(`view-${view}`).classList.add("active");

      if (window.StadiumAudio) StadiumAudio.playBatTok();

      const viewMessages = {
        players: "Browsing International Legends Roster. Click any player to open their holographic dossier.",
        dreamxi: "Stadium Tactical Map online. Assemble your All-Time International Playing XI.",
        leaderboards: "Viewing All-Time ICC Milestone Leaderboards.",
        trophies: "Exploring the ICC Major Tournament Roll of Honor through 2026.",
        compare: "Head-to-Head Arena active. Compare silverware and format averages side-by-side."
      };
      FX.speakBroadcast(viewMessages[view] || "View updated.");
    });
  });

  // Format Switchers
  document.querySelectorAll(".fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.format = btn.dataset.format;
      updatePlayersView(false);
      if (window.StadiumAudio) StadiumAudio.playBatTok();
      FX.speakBroadcast(`Telemetry switched to ${state.format.toUpperCase()} international statistics.`);
    });
  });

  document.querySelectorAll(".lb-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lb-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.lbFormat = btn.dataset.format;
      UI.renderLeaderboards(ALL_PLAYERS, state.lbFormat);
      if (window.StadiumAudio) StadiumAudio.playBatTok();
    });
  });

  document.querySelectorAll(".cmp-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cmp-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.compareFormat = btn.dataset.format;
      updateCompareView();
      if (window.StadiumAudio) StadiumAudio.playBatTok();
    });
  });

  // Filters & Sorting
  ["country-filter", "title-filter", "decade-filter", "role-filter", "sort-select"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      const key = id.replace("-filter", "").replace("-select", "");
      state[key] = e.target.value;
      if (key === "country" && state.country !== "ALL") UI.applyNationalTheme(state.country);
      if (key === "title" && state.title !== "ALL" && window.StadiumAudio) StadiumAudio.playTrophyChime();
      updatePlayersView(true);
    });
  });

  document.getElementById("search-input").addEventListener("input", e => {
    state.search = e.target.value.trim();
    updatePlayersView(true);
  });

  // A-Z Jump Bar
  document.getElementById("alphabet-bar").addEventListener("click", e => {
    const btn = e.target.closest(".alpha-btn");
    if (!btn) return;
    state.letter = btn.dataset.letter;
    UI.renderAlphabetBar(state.letter);
    updatePlayersView(true);
    if (window.StadiumAudio) StadiumAudio.playBatTok();
  });

  // Pagination Load More
  document.getElementById("load-more-btn").addEventListener("click", () => {
    state.visibleLimit += PAGE_SIZE;
    updatePlayersView(false);
    if (window.StadiumAudio) StadiumAudio.playBatTok();
  });

  // Dream XI Events
  document.getElementById("dream-slots").addEventListener("change", e => {
    const sel = e.target.closest(".slot-select");
    if (!sel) return;
    state.dreamXI[Number(sel.dataset.slot)] = sel.value;
    UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
    const picked = ALL_PLAYERS.find(p => p.id === sel.value);
    if (picked) {
      UI.applyNationalTheme(picked.country);
      if (window.StadiumAudio) StadiumAudio.playBatTok();
      FX.speakBroadcast(`${picked.name} drafted into slot #${Number(sel.dataset.slot) + 1} of your Dream XI.`, true);
    }
  });

  document.getElementById("clear-xi-btn").addEventListener("click", () => {
    state.dreamXI = Array(11).fill("");
    UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
    FX.speakBroadcast("Dream XI squad cleared. Ready for new selections.");
  });

  document.getElementById("copy-xi-btn").addEventListener("click", () => {
    const lines = state.dreamXI.map((id, i) => {
      const p = ALL_PLAYERS.find(pl => pl.id === id);
      return `${i + 1}. ${p ? `${p.name} (${p.country})` : "Empty"}`;
    });
    navigator.clipboard.writeText(`MY ALL-TIME INTERNATIONAL XI:\n${lines.join("\n")}`);
    if (window.StadiumAudio) StadiumAudio.playTrophyChime();
    FX.speakBroadcast("All-Time International Dream XI copied to clipboard!", true);
  });

  // Trophies & Compare
  document.querySelectorAll(".trophy-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".trophy-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.trophyTab = tab.dataset.trophy;
      updateTrophiesView();
      if (window.StadiumAudio) StadiumAudio.playTrophyChime();
    });
  });

  document.getElementById("compare-p1").addEventListener("change", updateCompareView);
  document.getElementById("compare-p2").addEventListener("change", updateCompareView);

  // Dossier Modal
  document.getElementById("players-grid").addEventListener("click", e => {
    const card = e.target.closest(".player-card");
    if (!card) return;
    const player = ALL_PLAYERS.find(p => p.id === card.dataset.id);
    if (player) UI.openDossier(player);
  });

  document.getElementById("close-modal").addEventListener("click", UI.closeDossier);
  document.getElementById("dossier-modal").addEventListener("click", e => {
    if (e.target.id === "dossier-modal") UI.closeDossier();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") UI.closeDossier();
  });
});