/* ============================================================
   CraftFolio — Minecraft Portfolio JavaScript
   ============================================================ */

"use strict";

/* ============================================================
   1. DATA
   ============================================================ */
const DATA = {
  typedStrings: [
    "WEBSITES",
    "WEB APPS",
    "EXPERIENCES",
    "DIGITAL WORLDS",
    "WITH CODE ⛏️",
  ],

  inventory: [
    { icon: "💻", label: "Code", tip: "10,000+ lines written" },
    { icon: "🎨", label: "Design", tip: "UI/UX enthusiast" },
    { icon: "🗄️", label: "DB", tip: "MySQL, MongoDB" },
    { icon: "☁️", label: "Cloud", tip: "AWS, Vercel, Firebase" },
    { icon: "⚡", label: "Speed", tip: "Performance optimizer" },
    { icon: "🔒", label: "Security", tip: "Auth & encryption" },
    { icon: "📱", label: "Mobile", tip: "React Native basics" },
    { icon: "🤖", label: "AI/ML", tip: "Python, TensorFlow" },
    { icon: "🧩", label: "APIs", tip: "REST & GraphQL" },
    { icon: "🔧", label: "DevOps", tip: "CI/CD pipelines" },
    { icon: "📊", label: "Data", tip: "Charts & dashboards" },
    { icon: "🎮", label: "Games", tip: "Unity & Minecraft mods" },
  ],

  skills: {
    frontend: [
      { icon: "⚛️", name: "React.js", pct: 90 },
      { icon: "📐", name: "HTML / CSS", pct: 95 },
      { icon: "🟨", name: "JavaScript", pct: 88 },
      { icon: "🔷", name: "TypeScript", pct: 78 },
      { icon: "🎨", name: "Tailwind CSS", pct: 85 },
      { icon: "🔴", name: "Next.js", pct: 80 },
    ],
    backend: [
      { icon: "🟩", name: "Node.js", pct: 83 },
      { icon: "🐍", name: "Python", pct: 75 },
      { icon: "🐘", name: "PHP / Laravel", pct: 70 },
      { icon: "🗄️", name: "MongoDB", pct: 80 },
      { icon: "🐬", name: "MySQL", pct: 78 },
      { icon: "🔥", name: "Firebase", pct: 82 },
    ],
    tools: [
      { icon: "🐙", name: "Git / GitHub", pct: 92 },
      { icon: "🐳", name: "Docker", pct: 68 },
      { icon: "⚡", name: "VS Code", pct: 97 },
      { icon: "🖼️", name: "Figma", pct: 73 },
      { icon: "☁️", name: "AWS", pct: 65 },
      { icon: "🔄", name: "CI / CD", pct: 70 },
    ],
  },

  projects: [
    {
      id: "p1",
      tag: "🏙️ P1 — Web App",
      title: "EcoTrack Dashboard",
      desc: "A real-time environmental monitoring dashboard with live sensor data, interactive charts, and alert systems.",
      tech: ["React", "Node.js", "MongoDB", "Chart.js"],
      github: "#",
      live: "#",
      details: "EcoTrack is a full-stack environmental monitoring solution that tracks air quality, temperature, and humidity across multiple locations in real time. Built with React for the frontend, Node.js for the backend API, and MongoDB for data storage. Features include customizable alert thresholds, historical data export, and a responsive mobile-first design.",
      emoji: "🌿",
    },
    {
      id: "p2",
      tag: "🏗️ P2 — Full Stack",
      title: "CraftCommerce",
      desc: "A Minecraft-themed e-commerce platform with a pixel art UI, cart system, and secure payments.",
      tech: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
      github: "#",
      live: "#",
      details: "CraftCommerce reimagines online shopping with a Minecraft-inspired pixel art interface. Customers can browse a blocky storefront, manage their inventory-style cart, and checkout securely with Stripe. The admin panel features order management, product analytics, and an inventory system that mirrors Minecraft's crafting mechanics.",
      emoji: "🛒",
    },
    {
      id: "p3",
      tag: "🤖 P3 — AI Tool",
      title: "QuestGPT",
      desc: "An AI-powered quest generator that creates Minecraft-style adventures from a simple text prompt.",
      tech: ["Python", "OpenAI API", "FastAPI", "React"],
      github: "#",
      live: "#",
      details: "QuestGPT uses GPT-4 to generate fully fleshed-out Minecraft-style quests complete with objectives, storylines, NPCs, and rewards. Users enter a theme, and the AI builds a complete quest tree with branching paths. The FastAPI backend handles AI orchestration while the React frontend provides a map-style visualization of the quest flow.",
      emoji: "📜",
    },
    {
      id: "p4",
      tag: "📱 P4 — Mobile",
      title: "BlockNotes",
      desc: "A note-taking app with a block-based editor, pixel theme, and offline-first architecture.",
      tech: ["React Native", "SQLite", "Expo", "Redux"],
      github: "#",
      live: "#",
      details: "BlockNotes brings a Minecraft building metaphor to note-taking. Every note is a 'block' that can be stacked, linked, and categorized. Built with React Native and Expo for cross-platform delivery, SQLite for offline-first local storage, and Redux for state management. Supports rich text, code blocks, image embeds, and block linking.",
      emoji: "📝",
    },
    {
      id: "p5",
      tag: "📊 P5 — Dashboard",
      title: "PixelMetrics",
      desc: "An analytics dashboard with Minecraft pixel-art charts and real-time data visualization.",
      tech: ["Vue.js", "D3.js", "WebSocket", "Express"],
      github: "#",
      live: "#",
      details: "PixelMetrics turns boring KPIs into an entertaining pixel-art dashboard. Every chart is rendered with a Minecraft block aesthetic using D3.js custom renderers. Real-time updates flow in via WebSocket. Built for SaaS founders who want beautiful, glanceable metrics without sacrificing data density.",
      emoji: "📈",
    },
    {
      id: "p6",
      tag: "🔒 P6 — Security",
      title: "VaultAuth",
      desc: "A zero-knowledge authentication library for Node.js with 2FA, passkeys, and audit logs.",
      tech: ["Node.js", "TypeScript", "Redis", "PostgreSQL"],
      github: "#",
      live: "#",
      details: "VaultAuth is an open-source, production-ready authentication system inspired by Minecraft's vault mechanic. It supports email/password, Google OAuth, passkeys (WebAuthn), and TOTP 2FA. Zero-knowledge proofs ensure passwords never leave the client in plaintext. Published on npm with 1k+ weekly downloads.",
      emoji: "🔐",
    },
    {
      id: "p7",
      tag: "🌐 P7 — API",
      title: "CraftAPI Hub",
      desc: "A developer-first API gateway with rate limiting, request logging, and pixel-art documentation.",
      tech: ["Go", "Redis", "Docker", "Swagger"],
      github: "#",
      live: "#",
      details: "CraftAPI Hub is a lightweight API gateway written in Go that provides rate limiting, request/response logging, key rotation, and auto-generated Swagger docs. Deploy it with a single Docker command. The admin UI uses a Minecraft-themed design system and features a real-time request feed visualized as falling blocks.",
      emoji: "🌐",
    },
    {
      id: "p8",
      tag: "🎮 P8 — Game",
      title: "CraftRPG Web",
      desc: "A browser-based Minecraft-inspired RPG with procedural world generation and multiplayer.",
      tech: ["Three.js", "WebSocket", "Node.js", "MongoDB"],
      github: "#",
      live: "#",
      details: "CraftRPG Web is a browser-based multiplayer RPG built on Three.js with procedurally generated voxel worlds. Players can explore, build, fight mobs, and trade with other players in real time via WebSocket. The world is persistent and stored in MongoDB. Supports up to 50 concurrent players per server instance.",
      emoji: "🎮",
    },
    {
      id: "p9",
      tag: "🛠️ P9 — DevTool",
      title: "PixelCI",
      desc: "A fun CI/CD pipeline visualizer that turns your build logs into a Minecraft progress display.",
      tech: ["React", "GitHub Actions", "Node.js", "Redis"],
      github: "#",
      live: "#",
      details: "PixelCI connects to your GitHub Actions workflows and displays build progress as a Minecraft loading bar with animated characters. Failed tests show as red blocks; passing ones light up green. Integrates with Slack to send pixel-art notifications. A fun way to make CI/CD monitoring feel less painful.",
      emoji: "⚙️",
    },
  ],

  timeline: [
    {
      year: "2025",
      title: "Senior Frontend Developer",
      company: "🚀 TechCorp Inc.",
      desc: "Leading a team of 4 developers, architecting micro-frontend systems, and driving a 40% performance improvement across flagship products.",
    },
    {
      year: "2023",
      title: "Full Stack Developer",
      company: "💡 StartupXYZ",
      desc: "Built and shipped 3 SaaS products from scratch. Scaled backend from 0 to 50k monthly active users in 8 months.",
    },
    {
      year: "2022",
      title: "Frontend Developer",
      company: "🏢 AgencyABC",
      desc: "Delivered pixel-perfect UI for 15+ client projects. Introduced React and reduced average page load time by 60%.",
    },
    {
      year: "2021",
      title: "Junior Developer",
      company: "🌱 FreelanceWorld",
      desc: "Completed 30+ freelance projects on Upwork, specializing in WordPress, React, and custom landing pages.",
    },
    {
      year: "2019",
      title: "Computer Science Degree",
      company: "🎓 University of Technology",
      desc: "Graduated with honours in Computer Science. Final year project: Minecraft server analytics platform using ML.",
    },
  ],
};

/* ============================================================
   2. UTILITIES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(msg, duration = 2500) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

/* ============================================================
   3. LOADING SCREEN
   ============================================================ */
(function initLoading() {
  const bar = $("#loading-bar");
  const txt = $("#loading-text");
  const screen = $("#loading-screen");

  const messages = [
    "Loading world...",
    "Generating terrain...",
    "Spawning entities...",
    "Building portfolio city...",
    "Placing blocks...",
    "Almost ready!",
  ];

  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 100) progress = 100;
    bar.style.width = progress + "%";

    if (progress > (msgIdx + 1) * 16 && msgIdx < messages.length - 1) {
      msgIdx++;
      txt.textContent = messages[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      txt.textContent = "✅ World loaded!";
      setTimeout(() => {
        screen.classList.add("fade-out");
        setTimeout(() => screen.remove(), 700);
      }, 500);
    }
  }, 160);
})();

/* ============================================================
   4. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = $("#mc-cursor");
  const trail = $("#cursor-trail");
  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
  document.addEventListener("mouseup", () => cursor.classList.remove("clicking"));

  // Lagging trail
  (function animateTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + "px";
    trail.style.top = ty + "px";
    requestAnimationFrame(animateTrail);
  })();
})();

/* ============================================================
   5. PARTICLE CANVAS (floating dirt/grass blocks)
   ============================================================ */
(function initParticles() {
  const canvas = $("#particle-canvas");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0;

  const COLORS = ["#5b8a32","#8b5e3c","#7a7a7a","#f5c518","#4de6e6","#3a6b9f"];
  const particles = [];
  const COUNT = 28;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: H + 30,
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 0.6 + 0.2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.12 + 0.04,
    };
  }

  for (let i = 0; i < COUNT; i++) {
    const p = createParticle();
    p.y = Math.random() * H;
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      p.y -= p.speed;
      p.rot += p.rotSpeed;

      if (p.y < -30) {
        Object.assign(p, createParticle());
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ============================================================
   6. NAVBAR
   ============================================================ */
(function initNavbar() {
  const nav = $("#navbar");
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
    updateActiveLink();
  });

  toggle.addEventListener("click", () => links.classList.toggle("open"));

  // Close on link click (mobile)
  $$(".nav-link").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );

  function updateActiveLink() {
    const sections = $$("section[id]");
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    $$(".nav-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.section === current);
    });
  }
})();

/* ============================================================
   7. HERO TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = $("#typed-text");
  const strings = DATA.typedStrings;
  let si = 0, ci = 0, deleting = false;

  function tick() {
    const full = strings[si];
    if (deleting) {
      ci--;
      el.textContent = full.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        si = (si + 1) % strings.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 60);
    } else {
      ci++;
      el.textContent = full.slice(0, ci);
      if (ci === full.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 100);
    }
  }

  setTimeout(tick, 1200);
})();

/* ============================================================
   8. INVENTORY
   ============================================================ */
(function initInventory() {
  const grid = $("#inventory-grid");
  if (!grid) return;

  DATA.inventory.forEach((item) => {
    const slot = document.createElement("div");
    slot.className = "inv-slot";
    slot.innerHTML = `
      <span>${item.icon}</span>
      <span class="slot-label">${item.label}</span>
      <span class="slot-tip">${item.tip}</span>
    `;
    slot.addEventListener("click", () => showToast(`${item.icon} ${item.tip}`));
    grid.appendChild(slot);
  });
})();

/* ============================================================
   9. SKILL TREE
   ============================================================ */
(function initSkills() {
  const tree = $("#skill-tree");
  const tabs = $$(".skill-tab");
  let activeCat = "frontend";

  function renderSkills(cat) {
    tree.innerHTML = "";
    DATA.skills[cat].forEach((sk, i) => {
      const card = document.createElement("div");
      card.className = "skill-card reveal";
      card.innerHTML = `
        <div class="skill-icon">${sk.icon}</div>
        <div class="skill-name">${sk.name}</div>
        <div class="skill-bar-wrap">
          <div class="skill-bar-fill" style="width:0%" data-pct="${sk.pct}">
            <span class="skill-pct">${sk.pct}%</span>
          </div>
        </div>
      `;
      card.style.transitionDelay = `${i * 0.07}s`;
      tree.appendChild(card);
    });

    // Trigger reveal + animate bars
    requestAnimationFrame(() => {
      $$(".skill-card").forEach((c) => c.classList.add("visible"));
      setTimeout(() => {
        $$(".skill-bar-fill").forEach((b) => {
          b.style.width = b.dataset.pct + "%";
        });
      }, 100);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeCat = tab.dataset.cat;
      renderSkills(activeCat);
    });
  });

  renderSkills(activeCat);
})();

/* ============================================================
   10. PROJECT CARDS
   ============================================================ */
(function initProjects() {
  const container = $("#project-cards");
  if (!container) return;

  DATA.projects.forEach((proj, i) => {
    const card = document.createElement("div");
    card.className = "proj-card reveal";
    card.style.transitionDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="proj-card-tag">${proj.tag}</div>
      <div class="proj-card-title">${proj.emoji} ${proj.title}</div>
      <div class="proj-card-desc">${proj.desc}</div>
      <div class="proj-tech-tags">
        ${proj.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => openModal(proj));
    container.appendChild(card);
  });
})();

/* ============================================================
   11. MODAL
   ============================================================ */
function openModal(proj) {
  const overlay = $("#modal-overlay");
  const content = $("#modal-content");
  content.innerHTML = `
    <h2>${proj.emoji} ${proj.title}</h2>
    <p style="color: var(--mc-diamond); font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.8rem;">${proj.tag}</p>
    <p>${proj.details}</p>
    <div class="proj-tech-tags" style="margin-bottom: 1.2rem;">
      ${proj.tech.map((t) => `<span class="tech-tag">${t}</span>`).join("")}
    </div>
    <div class="modal-links">
      <a href="${proj.github}" class="mc-btn secondary" target="_blank">🐙 GitHub</a>
      <a href="${proj.live}" class="mc-btn primary" target="_blank">🌐 Live Demo</a>
    </div>
  `;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

(function initModal() {
  const overlay = $("#modal-overlay");
  const closeBtn = $("#modal-close");

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();

function closeModal() {
  $("#modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ============================================================
   12. CITY MAP — PROJECT BLOCKS + WASD PLAYER
   ============================================================ */
(function initCityMap() {
  const blocks = $$(".proj-block");
  const player = $("#map-player");
  const cityMap = $("#city-map");
  if (!player || !cityMap) return;

  // Highlight project block and scroll to card
  blocks.forEach((block) => {
    block.addEventListener("click", () => {
      const id = block.dataset.proj;
      blocks.forEach((b) => b.classList.remove("active"));
      block.classList.add("active");

      // Move player to block position
      const bRect = block.getBoundingClientRect();
      const mRect = cityMap.getBoundingClientRect();
      const relX = bRect.left - mRect.left + bRect.width / 2;
      const relY = bRect.top - mRect.top + bRect.height / 2;
      player.style.left = relX - 12 + "px";
      player.style.top = relY - 32 + "px";

      // Scroll to the matching project card
      const projData = DATA.projects.find((p) => p.id === id);
      if (projData) {
        showToast(`📦 ${projData.title}`);
        // Highlight card
        const allCards = $$(".proj-card");
        allCards.forEach((c, i) => {
          if (DATA.projects[i].id === id) {
            c.style.borderColor = "var(--mc-gold)";
            c.style.boxShadow = "0 0 20px rgba(245,197,24,0.4)";
            c.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
              c.style.borderColor = "";
              c.style.boxShadow = "";
            }, 2000);
          }
        });
      }
    });
  });

  // WASD keyboard movement
  const SPEED = 28;
  let px = parseInt(player.style.left) || 140;
  let py = parseInt(player.style.top) || 90;
  const keys = {};

  document.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
  document.addEventListener("keyup",   (e) => { keys[e.key.toLowerCase()] = false; });

  (function movePlayer() {
    const mapW = cityMap.offsetWidth;
    const mapH = cityMap.offsetHeight;
    let moved = false;

    if (keys["w"] || keys["arrowup"])    { py -= SPEED * 0.08; moved = true; }
    if (keys["s"] || keys["arrowdown"])  { py += SPEED * 0.08; moved = true; }
    if (keys["a"] || keys["arrowleft"])  { px -= SPEED * 0.08; moved = true; }
    if (keys["d"] || keys["arrowright"]) { px += SPEED * 0.08; moved = true; }

    px = Math.max(5, Math.min(mapW - 30, px));
    py = Math.max(5, Math.min(mapH - 40, py));

    if (moved) {
      player.style.left = px + "px";
      player.style.top = py + "px";
    }
    requestAnimationFrame(movePlayer);
  })();

  // City zone hover tips
  $$(".city-zone").forEach((zone) => {
    zone.addEventListener("click", () => {
      const tips = {
        park: "🌳 Park — My creative thinking space",
        stadium: "🏟️ Stadium — Where I showcase achievements",
        forest: "🌲 Forest — Research & learning zone",
        gate: "🚪 City Gate — Public presence & socials",
      };
      showToast(tips[zone.dataset.zone] || "Exploring...");
    });
  });
})();

/* ============================================================
   13. TIMELINE
   ============================================================ */
(function initTimeline() {
  const container = $("#timeline");
  if (!container) return;

  DATA.timeline.forEach((item) => {
    const el = document.createElement("div");
    el.className = "timeline-item";
    el.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-year">${item.year}</div>
      <div class="tl-title">${item.title}</div>
      <div class="tl-company">${item.company}</div>
      <div class="tl-desc">${item.desc}</div>
    `;
    container.appendChild(el);
  });
})();

/* ============================================================
   14. CONTACT FORM
   ============================================================ */
(function initForm() {
  const form = $("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = $("#fname");
    const email   = $("#femail");
    const message = $("#fmessage");
    let valid = true;

    // Validate
    const validate = (field, errId, test, msg) => {
      const errEl = $("#" + errId);
      if (!test(field.value)) {
        errEl.textContent = msg;
        field.style.borderColor = "var(--mc-redstone)";
        valid = false;
      } else {
        errEl.textContent = "";
        field.style.borderColor = "";
      }
    };

    validate(name,    "fname-err",  (v) => v.trim().length > 1, "⚠️ Name required");
    validate(email,   "femail-err", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "⚠️ Valid email required");
    validate(message, "fmsg-err",   (v) => v.trim().length > 9, "⚠️ Message too short");

    if (!valid) return;

    const btn = $("#send-btn");
    btn.textContent = "📨 Sending...";
    btn.disabled = true;

    // Simulate send
    setTimeout(() => {
      form.reset();
      btn.textContent = "📨 Send Message";
      btn.disabled = false;
      $("#form-success").classList.add("show");
      showToast("✅ Message delivered!");
      setTimeout(() => $("#form-success").classList.remove("show"), 5000);
    }, 1600);
  });
})();

/* ============================================================
   15. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Animate skill bars if inside skill section
          const bars = entry.target.querySelectorAll(".skill-bar-fill");
          bars.forEach((b) => {
            b.style.width = b.dataset.pct + "%";
          });
        }
      });
    },
    { threshold: 0.12 }
  );

  // Add reveal class to section children
  $$(".section > *:not(.section-header), .about-card, .proj-card, .skill-card, .timeline-item").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

  $$(".reveal").forEach((el) => observer.observe(el));
})();

/* ============================================================
   16. BACK TO TOP
   ============================================================ */
(function initBackTop() {
  const btn = $("#back-top");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();

/* ============================================================
   17. FLOATING DECO BLOCKS (background atmosphere)
   ============================================================ */
(function initDecoBlocks() {
  const EMOJIS = ["⬛","🟩","🟫","🟨","🟦","🔷"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("div");
    el.className = "deco-block";
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = (Math.random() * 30 + 20) + "s";
    el.style.animationDelay = -(Math.random() * 30) + "s";
    el.style.fontSize = (Math.random() * 14 + 8) + "px";
    document.body.appendChild(el);
  }
})();

/* ============================================================
   18. SOUND ON BUTTON CLICK (Web Audio API — pixelated beep)
   ============================================================ */
(function initSounds() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  let ctx = null;

  function playBeep(freq = 880, dur = 0.08) {
    if (!ctx) ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".mc-btn, .proj-block, .inv-slot, .nav-link");
    if (btn) playBeep(btn.classList.contains("primary") ? 1046 : 880);
  });
})();

/* ============================================================
   19. SECTION ENTRANCE ANIMATIONS (scroll-based)
   ============================================================ */
(function initSectionReveal() {
  const sectionHeaders = $$(".section-header");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.2 }
  );

  sectionHeaders.forEach((header) => {
    header.style.opacity = "0";
    header.style.transform = "translateY(20px)";
    header.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    obs.observe(header);
  });
})();

/* ============================================================
   20. PARALLAX ON HERO
   ============================================================ */
(function initParallax() {
  const hero = $("#hero");
  const char = $("#hero-char");
  if (!hero || !char) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      char.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });
})();

/* ============================================================
   21. EASTER EGG — Konami Code
   ============================================================ */
(function initKonami() {
  const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        // Rainbow flash
        document.body.style.transition = "background 0.3s";
        const colors = ["#ff0000","#ff8800","#ffff00","#00ff00","#0000ff","#8800ff"];
        let ci = 0;
        const flash = setInterval(() => {
          document.body.style.background = colors[ci % colors.length];
          ci++;
          if (ci > colors.length * 2) {
            clearInterval(flash);
            document.body.style.background = "";
          }
        }, 120);
        showToast("🎮 CHEAT CODE ACTIVATED! You found the secret!", 3500);
      }
    } else {
      idx = 0;
    }
  });
})();

/* ============================================================
   22. CONSOLE GREETING
   ============================================================ */
console.log(`
%c⛏️  CraftFolio — Minecraft Portfolio
%cBuilt with HTML, CSS & JavaScript
%cTry the Konami Code: ↑↑↓↓←→←→BA
`,
  "color:#f5c518; font-size:18px; font-weight:bold;",
  "color:#6abf30; font-size:12px;",
  "color:#4de6e6; font-size:11px;"
);
