const UI = {
  applyNationalTheme(countryCode) {
    const theme = NATION_THEMES[countryCode] || NATION_THEMES.IND;
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-glow", `${theme.primary}66`);
  },

  renderAlphabetBar(activeLetter) {
    const bar = document.getElementById("alphabet-bar");
    const letters = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
    bar.innerHTML = letters.map(l => `
      <button class="alpha-btn ${activeLetter === l ? "active" : ""}" data-letter="${l}">${l}</button>
    `).join("");
  },

  renderPlayers(visiblePlayers, totalFiltered, format) {
    const grid = document.getElementById("players-grid");
    const countEl = document.getElementById("roster-count");
    const loadBtn = document.getElementById("load-more-btn");

    countEl.textContent = `Showing ${visiblePlayers.length} of ${totalFiltered} international cricketers`;
    loadBtn.style.display = visiblePlayers.length < totalFiltered ? "inline-block" : "none";
    if (visiblePlayers.length < totalFiltered) {
      loadBtn.textContent = `Load More (${totalFiltered - visiblePlayers.length} remaining)`;
    }

    if (!visiblePlayers.length) {
      grid.innerHTML = `<p style="color: var(--text-secondary); grid-column: 1/-1;">No international players match your active filters.</p>`;
      return;
    }

    grid.innerHTML = visiblePlayers.map(p => {
      const theme = NATION_THEMES[p.country] || NATION_THEMES.IND;
      const fStats = p.stats[format];
      const isBowler = p.role === "Bowler";
      const mainMetricLabel = isBowler ? "Wickets" : "Runs";
      const mainMetricVal = isBowler ? fStats.wickets : fStats.runs.toLocaleString();

      const trophiesHTML = p.iccTitles.length
        ? p.iccTitles.map(t => `<span class="trophy-pill">🏆 ${t.trophy} ${t.year}</span>`).join("")
        : `<span class="trophy-pill icon-only">★ International Icon</span>`;

      const hofHTML = p.hallOfFame ? `<span class="hof-badge">HOF ${p.hallOfFame}</span>` : "";

      return `
        <article class="player-card" data-id="${p.id}" style="--card-primary:${theme.primary}; --card-accent:${theme.secondary};">
          <div class="jersey-watermark">#${p.jersey}</div>
          <div class="card-top">
            <span class="nation-pill">${theme.name.toUpperCase()}</span>
            <span class="era-tag">${p.role}</span>
            ${hofHTML}
          </div>
          <h3>${p.name}</h3>
          <p class="player-nickname">"${p.nickname}"</p>
          <div class="trophy-strip">${trophiesHTML}</div>
          <div class="stat-row">
            <div class="stat-box"><span>Matches</span><strong>${fStats.matches}</strong></div>
            <div class="stat-box"><span>${mainMetricLabel}</span><strong>${mainMetricVal}</strong></div>
            <div class="stat-box"><span>Average</span><strong>${fStats.avg || "-"}</strong></div>
          </div>
        </article>
      `;
    }).join("");
  },

  renderDreamXI(players, selectedIds) {
    const slotsContainer = document.getElementById("dream-slots");
    const telemetryContainer = document.getElementById("dream-telemetry");

    slotsContainer.innerHTML = Array.from({ length: 11 }, (_, idx) => {
      const currentId = selectedIds[idx] || "";
      const options = [`<option value="">-- Select Player #${idx + 1} --</option>`]
        .concat(players.map(p => `<option value="${p.id}" ${p.id === currentId ? "selected" : ""}>${p.name} (${p.country} • ${p.role})</option>`))
        .join("");

      return `
        <div class="xi-slot">
          <span class="slot-num">#${idx + 1}</span>
          <select class="slot-select" data-slot="${idx}">${options}</select>
        </div>
      `;
    }).join("");

    const chosen = selectedIds.map(id => players.find(p => p.id === id)).filter(Boolean);
    const totalTrophies = chosen.reduce((sum, p) => sum + p.iccTitles.length, 0);
    const totalRuns = chosen.reduce((sum, p) => sum + p.stats.test.runs + p.stats.odi.runs + p.stats.t20i.runs, 0);
    const totalWickets = chosen.reduce((sum, p) => sum + p.stats.test.wickets + p.stats.odi.wickets + p.stats.t20i.wickets, 0);
    const wkCount = chosen.filter(p => p.role === "Wicketkeeper").length;
    const bowlCount = chosen.filter(p => p.role === "Bowler" || p.role === "All-Rounder").length;

    let balanceMsg = "✅ Balanced International XI ready to export.";
    if (chosen.length < 11) balanceMsg = `Select ${11 - chosen.length} more player(s) to complete your XI.`;
    else if (wkCount === 0) balanceMsg = "⚠️ Warning: Your XI has no Wicketkeeper selected.";
    else if (bowlCount < 5) balanceMsg = "⚠️ Warning: Fewer than 5 bowling options in your XI.";

    telemetryContainer.innerHTML = `
      <h3 style="font-family:var(--font-display); margin-bottom:0.8rem;">SQUAD TELEMETRY</h3>
      <div class="telemetry-stat"><span>Players Selected</span><strong>${chosen.length} / 11</strong></div>
      <div class="telemetry-stat"><span>Combined ICC Trophies</span><strong style="color:var(--gold-trophy);">🏆 ${totalTrophies}</strong></div>
      <div class="telemetry-stat"><span>Combined Int'l Runs</span><strong>${totalRuns.toLocaleString()}</strong></div>
      <div class="telemetry-stat"><span>Combined Int'l Wickets</span><strong>${totalWickets.toLocaleString()}</strong></div>
      <div class="telemetry-stat"><span>Wicketkeepers</span><strong>${wkCount}</strong></div>
      <div class="telemetry-stat"><span>Bowling Options</span><strong>${bowlCount}</strong></div>
      <div class="balance-badge">${balanceMsg}</div>
    `;
  },

  renderLeaderboards(players, format) {
    const grid = document.getElementById("leaderboards-grid");
    const byTitles = [...players].sort((a, b) => b.iccTitles.length - a.iccTitles.length).slice(0, 10);
    const byRuns = [...players].sort((a, b) => b.stats[format].runs - a.stats[format].runs).slice(0, 10);
    const byWickets = [...players].sort((a, b) => b.stats[format].wickets - a.stats[format].wickets).slice(0, 10);
    const byAvg = [...players].filter(p => p.stats[format].matches >= 15 && p.role !== "Bowler")
      .sort((a, b) => b.stats[format].avg - a.stats[format].avg).slice(0, 10);

    const buildCard = (title, list, valFn) => `
      <div class="lb-card">
        <h3>${title}</h3>
        ${list.map((p, i) => `
          <div class="lb-row">
            <span><strong class="lb-rank">${i + 1}.</strong> ${p.name} <small style="color:var(--text-secondary);">(${p.country})</small></span>
            <strong style="font-family:var(--font-display);">${valFn(p)}</strong>
          </div>
        `).join("")}
      </div>
    `;

    grid.innerHTML = [
      buildCard("🏆 Most ICC Major Titles", byTitles, p => `${p.iccTitles.length} Titles`),
      buildCard(`🏏 Most ${format.toUpperCase()} Runs`, byRuns, p => p.stats[format].runs.toLocaleString()),
      buildCard(`🎯 Most ${format.toUpperCase()} Wickets`, byWickets, p => p.stats[format].wickets.toLocaleString()),
      buildCard(`📈 Highest ${format.toUpperCase()} Bat Avg`, byAvg, p => p.stats[format].avg)
    ].join("");
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
    this.applyNationalTheme(player.country);
    const theme = NATION_THEMES[player.country] || NATION_THEMES.IND;
    const modal = document.getElementById("dossier-modal");
    const content = document.getElementById("dossier-content");

    const trophiesHTML = player.iccTitles.length
      ? player.iccTitles.map(t => `<span class="trophy-pill">🏆 ${t.trophy} (${t.year})</span>`).join("")
      : `<span class="trophy-pill icon-only">All-Time International Icon</span>`;

    const hofHTML = player.hallOfFame ? `<span class="hof-badge">ICC Hall of Fame (${player.hallOfFame})</span>` : "";

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
        <span class="nation-pill" style="background:${theme.primary}">${theme.name.toUpperCase()}</span>
        <span class="era-tag">${player.decade} • Jersey #${player.jersey}</span>
        ${hofHTML}
      </div>
      <h2 id="dossier-name" style="font-family:var(--font-display); font-size:2rem;">${player.name}</h2>
      <p class="player-nickname" style="color:${theme.secondary}; font-size:1rem;">"${player.nickname}" • ${player.role}</p>
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
    if (players.length > 1) {
      s1.value = players[0].id;
      s2.value = players[1].id;
    }
  },

  renderComparison(p1, p2, format) {
    const arena = document.getElementById("compare-arena");
    const t1 = NATION_THEMES[p1.country] || NATION_THEMES.IND;
    const t2 = NATION_THEMES[p2.country] || NATION_THEMES.IND;
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
          <span class="nation-pill" style="background:${t1.primary}">${t1.name}</span>
          <h3 style="font-family:var(--font-display); font-size:1.4rem; margin-top:0.35rem;">${p1.name}</h3>
        </div>
        <div style="font-family:var(--font-display); color:var(--theme-secondary); font-weight:700;">${format.toUpperCase()}</div>
        <div>
          <span class="nation-pill" style="background:${t2.primary}">${t2.name}</span>
          <h3 style="font-family:var(--font-display); font-size:1.4rem; margin-top:0.35rem;">${p2.name}</h3>
        </div>
      </div>
      ${rowsHTML}
    `;
  }
};