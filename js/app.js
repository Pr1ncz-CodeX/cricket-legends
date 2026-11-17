let ALL_PLAYERS = [];
const PAGE_SIZE = 24;

const state = {
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
  if (p1 && p2) UI.renderComparison(p1, p2, state.compareFormat);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/players.json");
    ALL_PLAYERS = await res.json();
  } catch (err) {
    document.getElementById("roster-count").textContent = "Failed to load data/players.json. Run via local server or Vercel.";
    return;
  }

  UI.renderAlphabetBar(state.letter);
  UI.populateCompareSelects(ALL_PLAYERS);
  updatePlayersView(true);
  UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
  UI.renderLeaderboards(ALL_PLAYERS, state.lbFormat);
  updateTrophiesView();
  updateCompareView();

  // Navigation
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
      document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
    });
  });

  // Format Switchers
  document.querySelectorAll(".fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.format = btn.dataset.format;
      updatePlayersView(false);
    });
  });

  document.querySelectorAll(".lb-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lb-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.lbFormat = btn.dataset.format;
      UI.renderLeaderboards(ALL_PLAYERS, state.lbFormat);
    });
  });

  document.querySelectorAll(".cmp-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cmp-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.compareFormat = btn.dataset.format;
      updateCompareView();
    });
  });

  // Filters & Sorting
  ["country-filter", "title-filter", "decade-filter", "role-filter", "sort-select"].forEach(id => {
    document.getElementById(id).addEventListener("change", e => {
      const key = id.replace("-filter", "").replace("-select", "");
      state[key] = e.target.value;
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
  });

  // Pagination Load More
  document.getElementById("load-more-btn").addEventListener("click", () => {
    state.visibleLimit += PAGE_SIZE;
    updatePlayersView(false);
  });

  // Dream XI Events
  document.getElementById("dream-slots").addEventListener("change", e => {
    const sel = e.target.closest(".slot-select");
    if (!sel) return;
    state.dreamXI[Number(sel.dataset.slot)] = sel.value;
    UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
  });

  document.getElementById("clear-xi-btn").addEventListener("click", () => {
    state.dreamXI = Array(11).fill("");
    UI.renderDreamXI(ALL_PLAYERS, state.dreamXI);
  });

  document.getElementById("copy-xi-btn").addEventListener("click", () => {
    const lines = state.dreamXI.map((id, i) => {
      const p = ALL_PLAYERS.find(pl => pl.id === id);
      return `${i + 1}. ${p ? `${p.name} (${p.country})` : "Empty"}`;
    });
    navigator.clipboard.writeText(`MY ALL-TIME INTERNATIONAL XI:\n${lines.join("\n")}`);
    alert("Dream XI Team Sheet copied to clipboard!");
  });

  // Trophies & Compare
  document.querySelectorAll(".trophy-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".trophy-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.trophyTab = tab.dataset.trophy;
      updateTrophiesView();
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