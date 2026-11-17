const FX = {
  voiceEnabled: false,
  typeTimer: null,

  speakBroadcast(message, shouldSpeakVoice = false) {
    const ticker = document.getElementById("hud-ticker");
    if (!ticker) return;

    clearInterval(this.typeTimer);
    ticker.textContent = "";
    let idx = 0;

    this.typeTimer = setInterval(() => {
      ticker.textContent += message.charAt(idx);
      idx++;
      if (idx >= message.length) clearInterval(this.typeTimer);
    }, 16);

    if (shouldSpeakVoice && this.voiceEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(message);
      utter.rate = 1.04;
      utter.pitch = 0.96;
      window.speechSynthesis.speak(utter);
    }
  },

  bindMagneticCards() {
    const grid = document.getElementById("players-grid");
    if (!grid) return;

    grid.addEventListener("mousemove", e => {
      const card = e.target.closest(".player-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 12;
      const rotateX = (0.5 - (y / rect.height)) * 12;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    grid.addEventListener("mouseout", e => {
      const card = e.target.closest(".player-card");
      if (card) card.style.transform = "";
    });
  },

  buildRadarSVG(player) {
    const totalRuns = player.stats.test.runs + player.stats.odi.runs + player.stats.t20i.runs;
    const totalWkts = player.stats.test.wickets + player.stats.odi.wickets + player.stats.t20i.wickets;
    const totalMatches = player.stats.test.matches + player.stats.odi.matches + player.stats.t20i.matches;

    const metrics = [
      { label: "Impact", val: Math.min(100, Math.round((totalRuns / 250) + (totalWkts / 8))) },
      { label: "ICC Gold", val: Math.min(100, 35 + player.iccTitles.length * 16) },
      { label: "Consistency", val: Math.min(100, Math.round(Math.max(player.stats.odi.avg, player.stats.test.avg) * 1.65)) },
      { label: "Longevity", val: Math.min(100, Math.round((totalMatches / 550) * 100)) },
      { label: "Clutch", val: player.hallOfFame ? 96 : Math.min(95, 65 + player.iccTitles.length * 8) }
    ];

    const cx = 110, cy = 110, r = 68;
    const points = metrics.map((m, i) => {
      const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
      const dist = (m.val / 100) * r;
      return `${(cx + dist * Math.cos(angle)).toFixed(1)},${(cy + dist * Math.sin(angle)).toFixed(1)}`;
    }).join(" ");

    const labels = metrics.map((m, i) => {
      const angle = (Math.PI * 2 * i) / metrics.length - Math.PI / 2;
      const lx = cx + (r + 24) * Math.cos(angle);
      const ly = cy + (r + 16) * Math.sin(angle);
      return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="#94a3b8" font-size="10" font-family="Chakra Petch, sans-serif" text-anchor="middle">${m.label}</text>`;
    }).join("");

    return `
      <div class="radar-wrap">
        <svg width="230" height="215" viewBox="0 0 220 220" aria-label="Player Attribute Radar">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" />
          <circle cx="${cx}" cy="${cy}" r="${r * 0.66}" fill="none" stroke="rgba(255,255,255,0.06)" />
          <circle cx="${cx}" cy="${cy}" r="${r * 0.33}" fill="none" stroke="rgba(255,255,255,0.06)" />
          <polygon class="radar-polygon" points="${points}" />
          ${labels}
        </svg>
      </div>
    `;
  },

  buildStadiumPitchSVG(chosenPlayers) {
    // Tactical coordinates on an SVG cricket oval for 11 slots
    const coords = [
      { x: 135, y: 125 }, { x: 185, y: 125 }, // Openers at pitch crease
      { x: 95,  y: 95  }, { x: 225, y: 95  }, // Top order
      { x: 75,  y: 155 }, { x: 160, y: 188 }, // Middle order & Wicketkeeper behind stumps
      { x: 245, y: 155 }, { x: 110, y: 215 }, // All-rounders
      { x: 210, y: 215 }, { x: 160, y: 42  }, // Bowlers
      { x: 160, y: 238 }
    ];

    const nodes = coords.map((pt, idx) => {
      const p = chosenPlayers[idx];
      const theme = p ? (NATION_THEMES[p.country] || NATION_THEMES.IND) : { primary: "#334155", secondary: "#64748b" };
      const label = p ? p.name.split(" ").pop().slice(0, 9) : `#${idx + 1}`;
      return `
        <g transform="translate(${pt.x}, ${pt.y})">
          <circle r="11" fill="${theme.primary}" stroke="${theme.secondary}" stroke-width="2" />
          <text y="3" fill="#fff" font-size="7.5" font-family="Chakra Petch, sans-serif" font-weight="700" text-anchor="middle">${idx + 1}</text>
          <text y="21" fill="#e2e8f0" font-size="8" font-family="Inter, sans-serif" font-weight="600" text-anchor="middle">${label}</text>
        </g>
      `;
    }).join("");

    return `
      <div class="pitch-map-wrap">
        <svg width="100%" height="235" viewBox="0 0 320 265" aria-label="Interactive Stadium Pitch Formation">
          <ellipse cx="160" cy="132" rx="145" ry="118" fill="rgba(21, 128, 61, 0.16)" stroke="rgba(74, 222, 128, 0.35)" stroke-width="2" />
          <ellipse cx="160" cy="132" rx="88" ry="70" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="4 4" />
          <rect x="148" y="102" width="24" height="60" rx="3" fill="rgba(251, 191, 36, 0.22)" stroke="rgba(251, 191, 36, 0.55)" />
          ${nodes}
        </svg>
      </div>
    `;
  }
};