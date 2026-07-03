/* ============================================================
   SUMEDH PATHE — PORTFOLIO JAVASCRIPT
   Features: 3D particle canvas · custom cursor · tilt cards
             scroll reveal · skill bars · tab switcher · navbar
   ============================================================ */

'use strict';

/* ─── 1. CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  if (!cursor || !cursorTrail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth-follow trail
  (function loop() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    cursorTrail.style.left = tx + 'px';
    cursorTrail.style.top  = ty + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ─── 2. 3D PARTICLE CANVAS ──────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  const COLORS = ['#7c3aed', '#a855f7', '#06b6d4', '#818cf8'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.z  = Math.random() * 0.8 + 0.2;      // depth 0.2 – 1.0
      this.r  = (Math.random() * 1.8 + .6) * this.z;
      this.vx = (Math.random() - .5) * .35 * this.z;
      this.vy = -(Math.random() * .55 + .1) * this.z;
      this.alpha = (Math.random() * .5 + .2) * this.z;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      // Connection data
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.vy -= 0.0003;                         // slight upward acceleration
      this.y += this.vy;
      this.pulse += 0.018;
      this.alpha = (0.25 + 0.15 * Math.sin(this.pulse)) * this.z;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100 * 0.6;
          this.x += dx / dist * force;
          this.y += dy / dist * force;
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur  = 12 * this.z;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 130);
    particles = Array.from({ length: count }, () => new Particle());
  }
  spawnParticles();

  function drawConnections() {
    const THRESH = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < THRESH) {
          ctx.save();
          ctx.globalAlpha = (1 - d / THRESH) * 0.18;
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth   = .6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── 3. NAVBAR SCROLL SHRINK ────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ─── 4. SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ─── 5. SKILL BARS ANIMATION ────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct  = e.target.dataset.pct || '0';
        const fill = e.target.querySelector('.bar-fill');
        if (fill) fill.style.width = pct + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => io.observe(b));
})();

/* ─── 6. SKILLS TAB SWITCHER ──────────────────────────────────── */
(function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.skills-panel');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === 'tab-' + target) p.classList.add('active');
      });

      // Trigger bar animations for backend tab on first open
      document.querySelectorAll('.skills-panel.active .skill-bar').forEach(bar => {
        const pct  = bar.dataset.pct || '0';
        const fill = bar.querySelector('.bar-fill');
        if (fill && fill.style.width === '') {
          setTimeout(() => { fill.style.width = pct + '%'; }, 50);
        }
      });
    });
  });
})();

/* ─── 7. 3D TILT EFFECT ──────────────────────────────────────── */
(function initTilt() {
  const tiltEls = document.querySelectorAll('[data-tilt]');
  if (!tiltEls.length) return;

  const MAX_TILT = 12;   // degrees

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rotX =  dy * -MAX_TILT;
      const rotY =  dx *  MAX_TILT;
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
  });
})();

/* ─── 8. HERO CARD MOUSE PARALLAX ────────────────────────────── */
(function initHeroParallax() {
  const card = document.getElementById('heroCard');
  if (!card) return;

  const MAX = 18;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    // Only drive the parallax when NOT flipped
    if (!card.matches(':hover')) {
      const inner = card.querySelector('.card-inner');
      if (inner) inner.style.transform = `rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg)`;
    }
  });

  card.addEventListener('mouseenter', () => {
    const inner = card.querySelector('.card-inner');
    if (inner) inner.style.transition = 'transform .75s cubic-bezier(.4,0,.2,1)';
  });
  card.addEventListener('mouseleave', () => {
    const inner = card.querySelector('.card-inner');
    if (inner) {
      inner.style.transition = 'transform .75s cubic-bezier(.4,0,.2,1)';
      inner.style.transform  = 'rotateY(0) rotateX(0)';
    }
  });
})();

/* ─── 9. ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active-nav'));
        const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (match) match.classList.add('active-nav');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
})();

/* ─── 10. GLITCH TEXT EFFECT ON HERO NAME ────────────────────── */
(function initGlitch() {
  const nameLines = document.querySelectorAll('.name-line');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  nameLines.forEach(line => {
    const original = line.textContent;

    line.addEventListener('mouseenter', () => {
      let iter = 0;
      const total = original.length * 3;
      const interval = setInterval(() => {
        line.textContent = original
          .split('')
          .map((ch, i) => {
            if (i < iter / 3) return original[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        iter++;
        if (iter >= total) {
          clearInterval(interval);
          line.textContent = original;
        }
      }, 30);
    });
  });
})();

/* ─── 11. SMOOTH SECTION ENTRANCE SEQUENCING ─────────────────── */
(function initSectionEntrance() {
  // Stagger child cards inside sections
  const grids = document.querySelectorAll('.about-cards, .projects-grid, .soft-grid, .contact-links');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Array.from(e.target.children).forEach((child, i) => {
          child.style.transitionDelay = (i * 0.09) + 's';
          child.classList.add('visible');
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  grids.forEach(g => io.observe(g));
})();

/* ─── 12. TYPING EFFECT ON HERO SUB ──────────────────────────── */
(function initTyping() {
  // Already rendered; add a blinking caret after page load
  const sub = document.querySelector('.hero-sub');
  if (!sub) return;
  const caret = document.createElement('span');
  caret.textContent = '|';
  caret.style.cssText = `
    margin-left: 2px;
    color: var(--accent2);
    animation: blinkCaret .9s step-end infinite;
  `;
  sub.appendChild(caret);

  // Inject keyframe once
  const style = document.createElement('style');
  style.textContent = '@keyframes blinkCaret { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);

  // Remove caret after 4s
  setTimeout(() => caret.remove(), 4000);
})();

/* ─── 14. HERO TERMINAL TYPING ANIMATION ─────────────────── */
(function initTerminal() {
  const cmdEl    = document.getElementById('termCmd');
  const outputEl = document.getElementById('termOutput');
  if (!cmdEl || !outputEl) return;

  const sequences = [
    {
      cmd: 'whoami',
      lines: [
        { text: 'Sumedh Patthe', cls: 'cyan' },
        { text: 'Full-Stack Dev & AI Enthusiast', cls: 'muted' },
        { text: 'B.E. CSE @ ACET · 2027', cls: 'muted' },
      ]
    },
    {
      cmd: 'ls skills/',
      lines: [
        { text: 'react.js  node.js  python', cls: '' },
        { text: 'tailwind  mongodb  firebase', cls: '' },
        { text: 'rest-api  git  chrome-ext', cls: 'muted' },
      ]
    },
    {
      cmd: 'cat projects.json',
      lines: [
        { text: '{ "Neutrichef": "AI Nutrition" }', cls: 'cyan' },
        { text: '{ "NutriGuide": "Browser Ext" }', cls: 'cyan' },
        { text: '{ "Yonex Clone": "Web Clone" }', cls: 'cyan' },
      ]
    },
    {
      cmd: 'ping 3skill.in',
      lines: [
        { text: 'Connected · Internship active ✓', cls: '' },
        { text: 'Status: Building & Learning 🚀', cls: 'muted' },
      ]
    },
  ];

  let seqIdx = 0;

  async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function typeText(el, text, speed = 55) {
    el.textContent = '';
    for (const ch of text) {
      el.textContent += ch;
      await sleep(speed);
    }
  }

  async function runSequence() {
    const seq = sequences[seqIdx % sequences.length];
    seqIdx++;

    // Type command
    await typeText(cmdEl, seq.cmd, 60);
    await sleep(400);

    // Show output lines
    outputEl.innerHTML = '';
    for (const line of seq.lines) {
      await sleep(180);
      const div = document.createElement('div');
      div.className = 't-out-line' + (line.cls ? ' ' + line.cls : '');
      div.textContent = '> ' + line.text;
      outputEl.appendChild(div);
    }

    await sleep(2600);

    // Erase command
    while (cmdEl.textContent.length > 0) {
      cmdEl.textContent = cmdEl.textContent.slice(0, -1);
      await sleep(28);
    }
    outputEl.innerHTML = '';
    await sleep(350);
    runSequence();
  }

  // Start after a short delay
  setTimeout(runSequence, 900);
})();

/* ─── 15. EASTER EGG: KONAMI CODE ───────────────────────────── */
(function initKonami() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        // Rain emoji particles 🎉
        for (let i = 0; i < 40; i++) {
          const el = document.createElement('div');
          el.textContent = ['🎉','✨','🚀','💜','🤖'][Math.floor(Math.random()*5)];
          el.style.cssText = `
            position:fixed;
            left:${Math.random()*100}vw;
            top:-40px;
            font-size:${1.5+Math.random()*1.5}rem;
            z-index:9999;
            pointer-events:none;
            animation:konamiRain ${1.5+Math.random()*2}s ease forwards;
          `;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 4000);
        }
        const style = document.createElement('style');
        style.textContent = `@keyframes konamiRain {
          from { transform:translateY(0) rotate(0deg); opacity:1; }
          to   { transform:translateY(110vh) rotate(720deg); opacity:0; }
        }`;
        document.head.appendChild(style);
      }
    } else { pos = 0; }
  });
})();
