const state = {
  format: "odi",
  compareFormat: "odi",
  country: "ALL",
  title: "ALL",
  role: "ALL",
  search: "",
  trophyTab: "ALL"
};

function updatePlayersView() {
  const filtered = PLAYERS.filter(p => {
    const matchCountry = state.country === "ALL" || p.country === state.country;
    const matchRole = state.role === "ALL" || p.role === state.role;
    const matchTitle = state.title === "ALL" || p.iccTitles.some(t => t.trophy === state.title);
    const q = state.search.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.nickname.toLowerCase().includes(q) ||
      p.jersey.includes(q);
    return matchCountry && matchRole && matchTitle && matchSearch;
  });

  UI.renderPlayers(filtered, state.format);
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
  const p1 = PLAYERS.find(p => p.id === id1) || PLAYERS[0];
  const p2 = PLAYERS.find(p => p.id === id2) || PLAYERS[1];
  UI.renderComparison(p1, p2, state.compareFormat);
}

document.addEventListener("DOMContentLoaded", () => {
  // Initial Render
  UI.populateCompareSelects(PLAYERS);
  updatePlayersView();
  updateTrophiesView();
  updateCompareView();

  // Top View Navigation
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.view;
      document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
      document.getElementById(`view-${target}`).classList.add("active");
    });
  });

  // Format Switchers (Roster)
  document.querySelectorAll(".fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.format = btn.dataset.format;
      updatePlayersView();
    });
  });

  // Format Switchers (Compare)
  document.querySelectorAll(".cmp-fmt-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cmp-fmt-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.compareFormat = btn.dataset.format;
      updateCompareView();
    });
  });

  // Roster Filters
  document.getElementById("country-filter").addEventListener("change", e => {
    state.country = e.target.value;
    updatePlayersView();
  });

  document.getElementById("title-filter").addEventListener("change", e => {
    state.title = e.target.value;
    updatePlayersView();
  });

  document.getElementById("role-filter").addEventListener("change", e => {
    state.role = e.target.value;
    updatePlayersView();
  });

  document.getElementById("search-input").addEventListener("input", e => {
    state.search = e.target.value.trim();
    updatePlayersView();
  });

  // ICC Roll of Honor Tabs
  document.querySelectorAll(".trophy-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".trophy-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.trophyTab = tab.dataset.trophy;
      updateTrophiesView();
    });
  });

  // Head-to-Head Dropdowns
  document.getElementById("compare-p1").addEventListener("change", updateCompareView);
  document.getElementById("compare-p2").addEventListener("change", updateCompareView);

  // Player Card Click -> Dossier Modal
  document.getElementById("players-grid").addEventListener("click", e => {
    const card = e.target.closest(".player-card");
    if (!card) return;
    const player = PLAYERS.find(p => p.id === card.dataset.id);
    if (player) UI.openDossier(player);
  });

  // Modal Close Controls
  document.getElementById("close-modal").addEventListener("click", UI.closeDossier);
  document.getElementById("dossier-modal").addEventListener("click", e => {
    if (e.target.id === "dossier-modal") UI.closeDossier();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") UI.closeDossier();
  });
});