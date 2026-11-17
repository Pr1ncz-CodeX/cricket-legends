const StadiumAudio = {
  enabled: true,
  ctx: null,

  ensureCtx() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },

  playBatTok() {
    if (!this.enabled) return;
    this.ensureCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.065);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  },

  playTrophyChime() {
    if (!this.enabled) return;
    this.ensureCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [587.33, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.11, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }
};

const StadiumFX = {
  canvas: null,
  ctx: null,
  particles: [],
  arcs: [],
  ripples: [],
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  primaryColor: "#1d4ed8",
  secondaryColor: "#f59e0b",

  init() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "stadium-fx-canvas";
    Object.assign(this.canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "-1",
      pointerEvents: "none"
    });
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener("click", e => {
      this.spawnTrajectoryArc(e.clientX, e.clientY);
      this.ripples.push({ x: e.clientX, y: e.clientY, r: 4, alpha: 0.55 });
    });

    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 2.1 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.42 - 0.1,
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    this.animate();
    this.initScrollRevealAndCounters();
    this.initWagonWheelSandbox();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  setColors(primary, secondary) {
    this.primaryColor = primary;
    this.secondaryColor = secondary;
  },

  spawnTrajectoryArc(targetX, targetY) {
    const startX = Math.random() > 0.5 ? 0 : this.canvas.width;
    const startY = this.canvas.height * (0.25 + Math.random() * 0.55);
    const cpX = (startX + targetX) / 2;
    const cpY = Math.min(startY, targetY) - (130 + Math.random() * 140);

    this.arcs.push({
      startX, startY, cpX, cpY, targetX, targetY,
      t: 0,
      speed: 0.025,
      color: Math.random() > 0.4 ? this.secondaryColor : "#38bdf8"
    });
  },

  animate() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cursor-reactive floodlight spotlight
    const grad = ctx.createRadialGradient(this.mouse.x, this.mouse.y, 10, this.mouse.x, this.mouse.y, 360);
    grad.addColorStop(0, `${this.primaryColor}2d`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Floating floodlight motes
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) p.y = canvas.height;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248, 250, 252, ${p.alpha})`;
      ctx.fill();
    });

    // Click shockwave ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rp = this.ripples[i];
      rp.r += 3.2;
      rp.alpha -= 0.018;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = this.secondaryColor;
      ctx.globalAlpha = Math.max(0, rp.alpha);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (rp.alpha <= 0) this.ripples.splice(i, 1);
    }

    // Animated cricket ball seam arcs
    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const a = this.arcs[i];
      a.t += a.speed;
      const t = Math.min(1, a.t);
      const x = (1 - t) * (1 - t) * a.startX + 2 * (1 - t) * t * a.cpX + t * t * a.targetX;
      const y = (1 - t) * (1 - t) * a.startY + 2 * (1 - t) * t * a.cpY + t * t * a.targetY;

      ctx.beginPath();
      ctx.moveTo(a.startX, a.startY);
      ctx.quadraticCurveTo(a.cpX, a.cpY, x, y);
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1 - t * 0.72;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.globalAlpha = 1;

      if (a.t >= 1) this.arcs.splice(i, 1);
    }

    requestAnimationFrame(() => this.animate());
  },

  initScrollRevealAndCounters() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");

        const counter = entry.target.querySelector(".count-up");
        if (counter && !counter.dataset.counted) {
          counter.dataset.counted = "true";
          this.animateCounter(counter);
        }
      });
    }, { threshold: 0.14 });

    document.querySelectorAll(".chronicle-section, .banner-metric, .mini-card, .fmt-col").forEach(el => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });
  },

  animateCounter(el) {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const duration = 1100;
    const startTime = performance.now();

    const step = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = `${val}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  initWagonWheelSandbox() {
    const container = document.getElementById("wagon-wheel-sandbox");
    if (!container) return;

    const shots = {
      cover: {
        name: "Classical Cover Drive",
        speed: "138 km/h off bat",
        zone: "Extra Cover Boundary (4 Runs)",
        desc: "Leaning into a full delivery outside off-stump, piercing the gap between cover and point with high elbow control.",
        path: "M 180 112 Q 125 92 44 66",
        end: [44, 66]
      },
      helicopter: {
        name: "Signature Helicopter Shot",
        speed: "152 km/h off bat",
        zone: "Deep Mid-Wicket Stand (6 Runs)",
        desc: "Bottom-hand wrist whip converting a 145 km/h blockhole yorker into a towering maximum over mid-wicket.",
        path: "M 180 112 Q 258 122 328 180",
        end: [328, 180]
      },
      pull: {
        name: "Front-Foot Pull Shot",
        speed: "146 km/h off bat",
        zone: "Deep Square Leg (6 Runs)",
        desc: "Swiveling early on a chest-high bouncer and dispatching it flat over the square-leg boundary.",
        path: "M 180 112 Q 268 94 338 112",
        end: [338, 112]
      },
      scoop: {
        name: "360° Dilscoop / Reverse Ramp",
        speed: "134 km/h off bat",
        zone: "Fine Leg Roof (6 Runs)",
        desc: "Using the bowler's 148 km/h pace to ramp the ball directly over the wicketkeeper's helmet into the upper tier.",
        path: "M 180 112 Q 192 55 215 20",
        end: [215, 20]
      },
      yorker: {
        name: "In-Swinging Toe-Crushing Yorker",
        speed: "149.4 km/h release",
        zone: "Base of Leg Stump (Bowled!)",
        desc: "Late reverse swing curving sharply inward at 149 km/h to dip underneath the batter's downward bat swing.",
        path: "M 180 156 Q 165 132 178 104",
        end: [178, 104]
      },
      googly: {
        name: "Deceptive Wrist-Spin Googly",
        speed: "86 km/h • 2,450 RPM",
        zone: "Pitches Outside Off, Hits Middle (LBW)",
        desc: "Released out of the back of the hand to turn sharply back into the right-hander after drifting away in flight.",
        path: "M 180 156 Q 192 132 179 105",
        end: [179, 105]
      }
    };

    const renderShot = (key, playSound = false) => {
      const s = shots[key];
      document.getElementById("ww-shot-title").textContent = s.name;
      document.getElementById("ww-shot-meta").textContent = `${s.speed} • ${s.zone}`;
      document.getElementById("ww-shot-desc").textContent = s.desc;

      const trail = document.getElementById("ww-ball-trail");
      const dot = document.getElementById("ww-impact-dot");
      trail.setAttribute("d", s.path);
      dot.setAttribute("cx", s.end[0]);
      dot.setAttribute("cy", s.end[1]);

      trail.style.animation = "none";
      void trail.offsetWidth;
      trail.style.animation = "drawShot 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards";

      if (playSound) {
        StadiumAudio.playBatTok();
        this.spawnTrajectoryArc(window.innerWidth * 0.65, window.innerHeight * 0.45);
      }
    };

    container.querySelectorAll(".ww-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".ww-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderShot(btn.dataset.shot, true);
      });
    });

    renderShot("cover", false);
  }
};