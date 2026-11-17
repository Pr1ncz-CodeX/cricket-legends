const UI = {
  applyNationalTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-glow", `${theme.primary}66`);
  },

  renderPlayers(players, format) {
    const grid = document.getElementById("players-grid");
    if (!players.length) {
      grid.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No international players match your active filter criteria.</p>`;
      return;
    }

    grid.innerHTML = players.map(p => {
      const fStats = p.stats[format];
      const isBowler = p.role === "Bowler";
      const mainMetricLabel = isBowler ? "Wickets" : "Runs";
      const mainMetricVal = isBowler ? fStats.wickets : fStats.runs.toLocaleString();

      const trophiesHTML = p.iccTitles.length
        ? p.iccTitles.map(t => `<span class="trophy-pill">🏆 ${t.trophy} ${t.year}</span>`).join("")
        : `<span class="trophy-pill icon-only">★ International Legend</span>`;

      return `
        <article class="player-card" data-id="${p.id}" style="--card-primary:${p.theme.primary}; --card-accent:${p.theme.secondary};">
          <div class="jersey-watermark">#${p.jersey}</div>
          <div class="card-top">
            <span class="nation-pill">${p.countryName.toUpperCase()}</span>
            <span class="era-tag">${p.role}</span>
          </div>
          <h3>${p.name}</h3>
          <p class="player-nickname">"${p.nickname}"</p>
          <div class="trophy-strip">${trophiesHTML}</div>
          <div class="stat-row">
            <div class="stat-box">
              <span>Matches</span>
              <strong>${fStats.matches}</strong>
            </div>
            <div class="stat-box">
              <span>${mainMetricLabel}</span>
              <strong>${mainMetricVal}</strong>
            </div>
            <div class="stat-box">
              <span>Average</span>
              <strong>${fStats.avg || "-"}</strong>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  renderTrophies(tournaments) {
    const grid = document.getElementById("trophies-grid");
    grid.innerHTML = tournaments.map(t => `
      <div class="tournament-card">
        <div class="tournament-header">
          <span class="tournament-year">${t.year}</span>
          <span class="tournament-type">${t.type}</span>
        </div>
        <div class="champion-line">🏆 ${t.champion}</div>
        <div class="tournament-meta">Runners-up: ${t.runnerUp} • Final: ${t.venue}</div>
      </div>
    `).join("");
  },

  openDossier(player) {
    this.applyNationalTheme(player.theme);
    const modal = document.getElementById("dossier-modal");
    const content = document.getElementById("dossier-content");

    const trophiesHTML = player.iccTitles.length
      ? player.iccTitles.map(t => `<span class="trophy-pill">🏆 ${t.trophy} (${t.year})</span>`).join("")
      : `<span class="trophy-pill icon-only">All-Time International Icon</span>`;

    const formats = ["test", "odi", "t20i"].map(fmt => {
      const s = player.stats[fmt];
      return `
        <div class="dossier-format-card">
          <h4>${fmt.toUpperCase()} CAREER</h4>
          <p><span>Matches</span><strong>${s.matches}</strong></p>
          <p><span>Runs</span><strong>${s.runs.toLocaleString()}</strong></p>
          <p><span>Wickets</span><strong>${s.wickets}</strong></p>
          <p><span>Average</span><strong>${s.avg || "-"}</strong></p>
          <p><span>Strike Rate</span><strong>${s.sr || "-"}</strong></p>
          <p><span>Highlight</span><strong>${s.milestones}</strong></p>
        </div>
      `;
    }).join("");

    content.innerHTML = `
      <div class="card-top">
        <span class="nation-pill" style="background:${player.theme.primary}">${player.countryName.toUpperCase()}</span>
        <span class="era-tag">${player.era} • Jersey #${player.jersey}</span>
      </div>
      <h2 id="dossier-name" style="font-family:var(--font-display); font-size:2rem;">${player.name}</h2>
      <p class="player-nickname" style="color:${player.theme.secondary}; font-size:1rem;">"${player.nickname}" • ${player.role}</p>
      <div class="trophy-strip" style="margin-top:0.75rem;">${trophiesHTML}</div>
      <div class="dossier-grid">${formats}</div>
      <div class="signature-box">
        <strong style="display:block; font-size:0.78rem; letter-spacing:0.08em; color:var(--gold-trophy); margin-bottom:0.25rem;">SIGNATURE INTERNATIONAL MOMENT</strong>
        <span style="font-size:0.92rem;">${player.signatureMoment}</span>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  },

  closeDossier() {
    const modal = document.getElementById("dossier-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  },

  populateCompareSelects(players) {
    const s1 = document.getElementById("compare-p1");
    const s2 = document.getElementById("compare-p2");
    const options = players.map(p => `<option value="${p.id}">${p.name} (${p.country})</option>`).join("");
    s1.innerHTML = options;
    s2.innerHTML = options;
    s1.value = "kohli";
    s2.value = "tendulkar";
  },

  renderComparison(p1, p2, format) {
    const arena = document.getElementById("compare-arena");
    const s1 = p1.stats[format];
    const s2 = p2.stats[format];

    const metrics = [
      { label: "ICC Major Titles", v1: p1.iccTitles.length, v2: p2.iccTitles.length },
      { label: `${format.toUpperCase()} Matches`, v1: s1.matches, v2: s2.matches },
      { label: `${format.toUpperCase()} Runs`, v1: s1.runs, v2: s2.runs },
      { label: `${format.toUpperCase()} Wickets`, v1: s1.wickets, v2: s2.wickets },
      { label: `${format.toUpperCase()} Average`, v1: s1.avg, v2: s2.avg },
      { label: `${format.toUpperCase()} Strike Rate`, v1: s1.sr, v2: s2.sr }
    ];

    const rowsHTML = metrics.map(m => {
      const total = (m.v1 + m.v2) || 1;
      const pct1 = Math.round((m.v1 / total) * 100);
      const pct2 = 100 - pct1;
      return `
        <div class="cmp-metric">
          <div class="cmp-labels">
            <strong>${m.v1.toLocaleString()}</strong>
            <span style="color:var(--text-secondary); font-size:0.8rem; text-transform:uppercase;">${m.label}</span>
            <strong>${m.v2.toLocaleString()}</strong>
          </div>
          <div class="cmp-bar-track">
            <div class="cmp-bar-p1" style="width:${pct1}%"></div>
            <div class="cmp-bar-p2" style="width:${pct2}%"></div>
          </div>
        </div>
      `;
    }).join("");

    arena.innerHTML = `
      <div class="cmp-header">
        <div>
          <span class="nation-pill" style="background:${p1.theme.primary}">${p1.countryName}</span>
          <h3 style="font-family:var(--font-display); font-size:1.4rem; margin-top:0.35rem;">${p1.name}</h3>
        </div>
        <div style="font-family:var(--font-display); color:var(--theme-secondary); font-weight:700;">${format.toUpperCase()}</div>
        <div>
          <span class="nation-pill" style="background:${p2.theme.primary}">${p2.countryName}</span>
          <h3 style="font-family:var(--font-display); font-size:1.4rem; margin-top:0.35rem;">${p2.name}</h3>
        </div>
      </div>
      ${rowsHTML}
    `;
  }
};