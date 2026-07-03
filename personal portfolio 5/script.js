/* ================================================================
   SUMEDH PATHE — Minecraft Portfolio World
   script.js | Pure Canvas 2D — Zero external dependencies
   Fixed guided path through 6 portfolio sections
   ================================================================ */
"use strict";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. FIXED PATH WAYPOINTS
   Each waypoint = one section stop.
   Player walks W→forward along this path.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var PATH = [
  { id:"intro",      x:8,   y:62,  label:"🏠 Intro",       icon:"🏠" },
  { id:"about",      x:8,   y:46,  label:"📜 About",        icon:"📜" },
  { id:"skills",     x:8,   y:30,  label:"⚔️ Skills",       icon:"⚔️" },
  { id:"experience", x:8,   y:14,  label:"💼 Experience",   icon:"💼" },
  { id:"projects",   x:8,   y:-2,  label:"🏗️ Projects",     icon:"🏗️" },
  { id:"contact",    x:8,   y:-18, label:"📬 Contact",      icon:"📬" }
];

/* Each step's popup content */
var SECTIONS = {

  intro: {
    icon:"🏠", title:"Welcome — Sumedh Pathe",
    body: function(){
      return `
<h2>👋 Hello, World!</h2>
<p>I'm <b style="color:#f5c518;font-family:'Press Start 2P',monospace;font-size:.5rem">SUMEDH PATHE</b></p>
<p>Web Developer &amp; AI Enthusiast · B.E. Computer Science Engineering (2027)</p>
<p style="margin-top:.5rem">I craft responsive, performant web apps and integrate AI into real products. Passionate about clean code and great user experiences.</p>
<h3>📌 Quick Info</h3>
<ul>
  <li>📍 Buldana, Maharashtra, India</li>
  <li>🎓 Anuradha College of Engineering &amp; Technology</li>
  <li>📅 Graduating: May 2027</li>
  <li>📞 +91 87938 96929</li>
  <li>✉️ <a href="mailto:sumedhpatthe2005@gmail.com">sumedhpatthe2005@gmail.com</a></li>
  <li>🐙 <a href="https://github.com/Sumedh9696" target="_blank">github.com/Sumedh9696</a></li>
</ul>
<h3>🌍 Languages</h3>
<p><span class="tag">English — Fluent</span> <span class="tag">Hindi — Native</span> <span class="tag">Marathi — Native</span></p>
<p style="margin-top:.8rem;color:#888;font-family:'VT323',monospace;font-size:1rem">Press <b style="color:#f5c518">Q</b> to close and walk forward to the next section →</p>`;
    },
    foot: `<a href="https://github.com/Sumedh9696" target="_blank"><button class="mc-btn green auto">🐙 GitHub Profile</button></a>
           <a href="mailto:sumedhpatthe2005@gmail.com"><button class="mc-btn gray auto">✉️ Send Email</button></a>`
  },

  about: {
    icon:"📜", title:"About — Education & Background",
    body: function(){
      return `
<h2>🎓 Education Quest</h2>
<div class="tl-item">
  <div class="tl-dot"></div>
  <div class="tl-content">
    <div class="tl-year">JULY 2023 — MAY 2027</div>
    <div class="tl-role">B.E. Computer Science Engineering</div>
    <div class="tl-org">Anuradha College of Engineering &amp; Technology · Chikhli, Maharashtra</div>
    <div class="tl-desc">Relevant Coursework: Data Structures &amp; Algorithms · Artificial Intelligence · Web Development · Operating Systems · DBMS · Object-Oriented Programming · Cyber Security</div>
  </div>
</div>
<h2>🧠 Professional Summary</h2>
<p>Motivated B.E. Computer Science Engineering student (2027) specialising in full-stack web development and AI-integrated applications. Experienced in building responsive, performant interfaces using modern JavaScript frameworks and integrating AI models into real products. Passionate about clean code, great user experiences, and continuous learning.</p>
<h2>🎯 Interests &amp; Activities</h2>
<p><span class="tag">Open Source Contribution</span><span class="tag">Hackathons</span><span class="tag">UI/UX Design</span><span class="tag">AI Product Development</span></p>
<h2>🗣️ Languages</h2>
<p><span class="tag">English — Fluent</span><span class="tag">Hindi — Native</span><span class="tag">Marathi — Native</span></p>`;
    },
    foot: `<button class="mc-btn gray auto" onclick="closePopup()"><span class="k">Q</span> Next: Skills →</button>`
  },

  skills: {
    icon:"⚔️", title:"Skills — Tech Stack & Abilities",
    body: function(){
      var fe = [["HTML5",95],["CSS3",92],["JavaScript ES6+",88],["React.js",82],["Tailwind CSS",85],["Responsive Design",90]];
      var be = [["Node.js",78],["Express.js",76],["REST API Design",82],["Python",72],["MySQL",74],["MongoDB",76],["Firebase",73]];
      var soft = ["Communication","Critical Thinking","Collaboration","Time Management","Adaptability"];
      function bars(arr){
        return arr.map(function(s){
          return '<div class="skill-row"><span class="skill-name">'+s[0]+'</span><div class="skill-bar-bg"><div class="skill-bar-fill" style="width:'+s[1]+'%"></div></div><span class="skill-pct">'+s[1]+'%</span></div>';
        }).join('');
      }
      return `
<h2>🎨 Frontend Arsenal</h2>
${bars(fe)}
<h2>⚙️ Backend Dungeon</h2>
${bars(be)}
<h2>🧠 Soft Skills</h2>
<p>${soft.map(function(s){return '<span class="tag">'+s+'</span>';}).join('')}</p>
<h2>📜 Certificate</h2>
<p><span class="tag tag-blue">HTML &amp; CSS Workshop Certification — 2024</span></p>`;
    },
    foot: `<button class="mc-btn gray auto" onclick="closePopup()"><span class="k">Q</span> Next: Experience →</button>`
  },

  experience: {
    icon:"💼", title:"Experience — Internship & Work",
    body: function(){
      return `
<h2>💼 Work Experience</h2>
<div class="tl-item">
  <div class="tl-dot"></div>
  <div class="tl-content">
    <div class="tl-year">ONGOING · REMOTE</div>
    <div class="tl-role">Web Development Intern</div>
    <div class="tl-org">3Skill.in</div>
    <div class="tl-desc">
      <ul style="margin-top:.3rem">
        <li>Contributing to building and maintaining web applications using modern frontend technologies including React.js and Tailwind CSS</li>
        <li>Collaborating with the team on UI development, responsive design implementation, and REST API integration</li>
        <li>Gaining hands-on experience in real-world development workflows, version control with Git, and agile practices</li>
      </ul>
    </div>
  </div>
</div>
<h2>🛠️ Tech Used at Internship</h2>
<p><span class="tag">React.js</span><span class="tag">Tailwind CSS</span><span class="tag">REST APIs</span><span class="tag">Git</span><span class="tag">Agile</span></p>
<h2>📈 Growth Areas</h2>
<p>Real-world development workflows · Team collaboration · Code reviews · Responsive UI implementation · API integration at production scale</p>`;
    },
    foot: `<a href="https://github.com/Sumedh9696" target="_blank"><button class="mc-btn gray auto">🐙 GitHub</button></a>
           <button class="mc-btn gray auto" onclick="closePopup()"><span class="k">Q</span> Next: Projects →</button>`
  },

  projects: {
    icon:"🏗️", title:"Projects — Portfolio Hub",
    body: function(){
      return `
<h2>🏗️ All Projects</h2>

<div class="proj-card">
  <div class="proj-card-title">🍎 Neutrichef — AI Nutrition Platform</div>
  <div class="proj-card-stack"><span class="tag">React.js</span><span class="tag">Python</span><span class="tag">REST APIs</span><span class="tag">Tailwind CSS</span></div>
  <div style="margin-bottom:.4rem"><span class="proj-status">🔄 Ongoing</span></div>
  <div class="proj-card-desc">AI-driven nutrition platform delivering personalised recipe recommendations and macro-level nutritional analysis tailored to individual health goals. Architected a scalable React.js component structure with a fully responsive mobile-first UI; connected third-party nutrition APIs for real-time dietary data retrieval. Built a Python backend to handle AI inference, user preference modelling, session management, and secure API communication.</div>
  <div class="proj-card-links">
    <span class="proj-link private">🔒 Private Repository</span>
    <span class="proj-status" style="font-size:.82rem">⚠️ GitHub status: Private — not publicly visible</span>
  </div>
</div>

<div class="proj-card">
  <div class="proj-card-title">🔌 NutriGuide — Browser Extension</div>
  <div class="proj-card-stack"><span class="tag">JavaScript</span><span class="tag">Chrome Extensions API</span><span class="tag">REST API</span><span class="tag">CSS3</span></div>
  <div style="margin-bottom:.4rem"><span class="proj-status" style="color:#6abf30;border-color:#6abf30">✅ Completed 2025</span></div>
  <div class="proj-card-desc">Developed a Chrome browser extension providing instant nutritional information and healthy meal suggestions while browsing food or recipe websites. Implemented content scripts to detect food-related page context and surface AI-powered insights in a non-intrusive popup UI.</div>
  <div class="proj-card-links">
    <a href="https://github.com/Sumedh9696" target="_blank" class="proj-link">🐙 View on GitHub</a>
  </div>
</div>

<div class="proj-card">
  <div class="proj-card-title">🏸 Yonex Website Clone</div>
  <div class="proj-card-stack"><span class="tag">HTML5</span><span class="tag">CSS3</span><span class="tag">JavaScript</span><span class="tag">Responsive Design</span></div>
  <div style="margin-bottom:.4rem"><span class="proj-status" style="color:#6abf30;border-color:#6abf30">✅ Completed 2025</span></div>
  <div class="proj-card-desc">Built a pixel-accurate clone of the Yonex sports brand website, replicating product layout, navigation, and responsive grid system from scratch. Focused on CSS precision, cross-browser compatibility, and performance optimisation with semantic HTML and minimal asset footprint.</div>
  <div class="proj-card-links">
    <a href="https://github.com/Sumedh9696" target="_blank" class="proj-link">🐙 View on GitHub</a>
  </div>
</div>`;
    },
    foot: `<a href="https://github.com/Sumedh9696" target="_blank"><button class="mc-btn green auto">🐙 All Projects on GitHub</button></a>
           <button class="mc-btn gray auto" onclick="closePopup()"><span class="k">Q</span> Next: Contact →</button>`
  },

  contact: {
    icon:"📬", title:"Contact — Let's Connect!",
    body: function(){
      return `
<h2>📬 Get In Touch</h2>
<p>I'm open to internships, freelance projects, collaborations, and full-time opportunities. Don't hesitate to reach out!</p>
<h3>📧 Email</h3>
<p><a href="mailto:sumedhpatthe2005@gmail.com" style="font-size:1.1rem">sumedhpatthe2005@gmail.com</a></p>
<h3>📞 Phone</h3>
<p>+91 87938 96929</p>
<h3>📍 Location</h3>
<p>Buldana, Maharashtra, India</p>
<h3>🔗 Social &amp; Portfolio Links</h3>
<p>
  <a href="https://github.com/Sumedh9696" target="_blank" style="font-size:1.1rem">🐙 github.com/Sumedh9696</a>
</p>
<h2>🏅 Certificates</h2>
<p><span class="tag tag-blue">HTML &amp; CSS Workshop Certification — 2024</span></p>
<h2>🎯 What I'm Looking For</h2>
<p><span class="tag">Web Development Roles</span><span class="tag">AI/ML Projects</span><span class="tag">Open Source</span><span class="tag">Freelance Work</span><span class="tag">Internships</span></p>
<p style="margin-top:1rem;color:#888;font-size:1rem">🎉 You've completed the full portfolio tour!</p>`;
    },
    foot: `<a href="mailto:sumedhpatthe2005@gmail.com"><button class="mc-btn green auto">✉️ Send Email</button></a>
           <a href="https://github.com/Sumedh9696" target="_blank"><button class="mc-btn gray auto">🐙 GitHub</button></a>
           <button class="mc-btn gray auto" onclick="goToStep(0)">🔄 Restart Tour</button>`
  }
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. WORLD LAYOUT — buildings & decorations
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* World units: x = left/right, y = depth (forward/back) */
/* Building definitions — one per section stop */
var BUILDINGS = [
  { x:8,  y:62,  w:10, h:10, color:"#5b8a32", roof:"#8b5e3c", label:"INTRO",      id:"intro",      icon:"🏠" },
  { x:8,  y:46,  w:10, h:10, color:"#1a4b8c", roof:"#4de6e6", label:"ABOUT",      id:"about",      icon:"📜" },
  { x:8,  y:30,  w:10, h:10, color:"#7a1515", roof:"#ff3a3a", label:"SKILLS",     id:"skills",     icon:"⚔️" },
  { x:8,  y:14,  w:10, h:10, color:"#6e4e1a", roof:"#f5c518", label:"EXPERIENCE", id:"experience", icon:"💼" },
  { x:8,  y:-2,  w:12, h:12, color:"#a0622a", roof:"#f5c518", label:"PROJECTS",   id:"projects",   icon:"🏗️" },
  { x:8,  y:-18, w:10, h:10, color:"#8b1a1a", roof:"#ff6060", label:"CONTACT",    id:"contact",    icon:"📬" }
];

/* Path waypoints the player walks through */
var WAYPOINTS = PATH.map(function(p){ return {x: p.x, y: p.y}; });

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. PLAYER STATE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var player = {
  wx: 8,    /* world X */
  wy: 70,   /* world Y (depth) */
  angle: Math.PI,   /* facing direction in radians; π = facing up (toward -Y) */
  walkT: 0,         /* animation timer */
  moving: false
};

var currentStep   = 0;
var popupOpen     = false;
var paused        = false;
var isThirdPerson = true;
var mapVisible    = true;
var doneSections  = {};  /* tracks which sections have been visited */

var keys = {};
var WALK_SPEED  = 0.18;
var TURN_SPEED  = 0.045;
var NEAR_DIST   = 6;     /* trigger interaction prompt */
var AUTO_DIST   = 4;     /* auto-show prompt */

/* Camera / view */
var camX = 8, camY = 85; /* world position camera looks from */
var ZOOM = 7;             /* pixels per world unit */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. CANVAS SETUP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var canvas, ctx, W, H;
var mmCanvas, mmCtx;
var animFrame;

function initCanvas(){
  canvas = document.getElementById("world");
  ctx    = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);

  mmCanvas = document.getElementById("minimap");
  mmCtx    = mmCanvas ? mmCanvas.getContext("2d") : null;
}

function resize(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5. ISOMETRIC / TOP-DOWN PROJECTION
   We use a top-down perspective with slight
   isometric tilt for the "3D Minecraft feel"
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Convert world coords → screen coords */
function toScreen(wx, wy){
  /* Camera follows player */
  var cx = player.wx;
  var cy = player.wy + (isThirdPerson ? 12 : 0);
  /* Isometric tilt factor: squish Y by 0.55 */
  var TILT = 0.55;
  var sx = W/2 + (wx - cx) * ZOOM;
  var sy = H/2 + (wy - cy) * ZOOM * TILT;
  return {sx:sx, sy:sy};
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   6. DRAW WORLD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function drawWorld(t){
  ctx.clearRect(0,0,W,H);

  /* Sky gradient */
  var sky = ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,"#4a90d9");
  sky.addColorStop(0.6,"#87ceeb");
  sky.addColorStop(1,"#b8e0f0");
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H);

  /* Horizon line */
  var horiz = toScreen(player.wx, player.wy - 30);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, horiz.sy, W, 2);

  /* Ground — tiled grass blocks */
  drawGround(t);

  /* Path road */
  drawPath();

  /* Decorations */
  drawDecorations(t);

  /* Buildings (back to front) */
  var sorted = BUILDINGS.slice().sort(function(a,b){ return b.y - a.y; });
  sorted.forEach(function(b){ drawBuilding(b, t); });

  /* Player character */
  if(isThirdPerson){ drawPlayer(t); }

  /* Crosshair (first person) */
  if(!isThirdPerson){
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W/2-10,H/2); ctx.lineTo(W/2+10,H/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2,H/2-10); ctx.lineTo(W/2,H/2+10); ctx.stroke();
  }

  /* Proximity prompt on-canvas */
  drawProximityIndicator();
}

/* ── GROUND TILES ── */
function drawGround(t){
  var TILE = ZOOM * 2;
  var tileCountX = Math.ceil(W / TILE) + 4;
  var tileCountY = Math.ceil(H / (TILE*0.55)) + 4;
  var cx = player.wx, cy = player.wy + (isThirdPerson ? 12 : 0);

  var startWX = cx - (W/2)/ZOOM - 4;
  var startWY = cy - (H/2)/(ZOOM*0.55) - 4;

  for(var gy = 0; gy < tileCountY; gy++){
    for(var gx = 0; gx < tileCountX; gx++){
      var wx = startWX + gx*2;
      var wy = startWY + gy*2;
      var s = toScreen(wx, wy);
      var s2 = toScreen(wx+2, wy+2);
      var tw = s2.sx - s.sx, th = s2.sy - s.sy;

      /* Alternate grass colours for checkerboard */
      var checker = (Math.floor(wx/2) + Math.floor(wy/2)) % 2;
      ctx.fillStyle = checker ? "#5b8a32" : "#4e7a2a";
      ctx.fillRect(s.sx, s.sy, tw, th);

      /* Grid lines */
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(s.sx, s.sy, tw, th);
    }
  }
}

/* ── ROAD / PATH ── */
function drawPath(){
  ctx.save();
  for(var i=0; i<WAYPOINTS.length-1; i++){
    var a = WAYPOINTS[i], b = WAYPOINTS[i+1];
    /* Road body */
    drawRoadSegment(a.x, a.y, b.x, b.y, 2.5, "#555");
    /* Dashed centre line */
    drawRoadSegment(a.x, a.y, b.x, b.y, 0.3, "#f5c518");
  }
  /* Extend path before start and beyond end */
  var first = WAYPOINTS[0], last = WAYPOINTS[WAYPOINTS.length-1];
  drawRoadSegment(first.x, first.y, first.x, first.y+10, 2.5, "#555");
  drawRoadSegment(last.x, last.y, last.x, last.y-10, 2.5, "#555");
  ctx.restore();
}

function drawRoadSegment(wx1,wy1,wx2,wy2,halfW,color){
  /* Compute screen points with perpendicular width */
  var dx = wx2-wx1, dy = wy2-wy1;
  var len = Math.sqrt(dx*dx+dy*dy)||1;
  var nx=-dy/len*halfW, ny=dx/len*halfW;
  var p = [
    toScreen(wx1+nx, wy1+ny*0.55),
    toScreen(wx2+nx, wy2+ny*0.55),
    toScreen(wx2-nx, wy2-ny*0.55),
    toScreen(wx1-nx, wy1-ny*0.55)
  ];
  ctx.beginPath();
  ctx.moveTo(p[0].sx, p[0].sy);
  for(var i=1;i<4;i++) ctx.lineTo(p[i].sx, p[i].sy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/* ── DECORATIONS ── */
function drawDecorations(t){
  /* Trees along the path sides */
  var treePositions = [
    {x:-4,y:62},{x:20,y:62},{x:-4,y:46},{x:20,y:46},
    {x:-4,y:30},{x:20,y:30},{x:-4,y:14},{x:20,y:14},
    {x:-4,y:-2},{x:20,y:-2},{x:-4,y:-18},{x:20,y:-18},
    {x:-6,y:54},{x:22,y:54},{x:-6,y:38},{x:22,y:38},
    {x:-6,y:22},{x:22,y:22},{x:-6,y:6},{x:22,y:6}
  ];
  treePositions.forEach(function(p){ drawTree(p.x, p.y); });

  /* Street lamps */
  var lampY = [58,50,42,34,26,18,10,2,-6,-14];
  lampY.forEach(function(ly){
    drawLamp(-1.5, ly);
    drawLamp(17.5, ly);
  });

  /* Section arrows on path */
  for(var i=0;i<WAYPOINTS.length-1;i++){
    var mid = {x:(WAYPOINTS[i].x+WAYPOINTS[i+1].x)/2, y:(WAYPOINTS[i].y+WAYPOINTS[i+1].y)/2};
    var sc = toScreen(mid.x, mid.y);
    var pulse = 0.7 + 0.3*Math.sin(t*3 + i);
    ctx.fillStyle = "rgba(245,197,24,"+pulse+")";
    ctx.font = "bold "+(ZOOM*1.4)+"px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("▲", sc.sx, sc.sy);
  }
}

function drawTree(wx, wy){
  /* Trunk */
  var s = toScreen(wx, wy);
  var tw = ZOOM*0.5, trunkH = ZOOM*1.2;
  ctx.fillStyle = "#5c3a1e";
  ctx.fillRect(s.sx - tw/2, s.sy - trunkH, tw, trunkH);

  /* Foliage layers */
  [[ZOOM*2.2, ZOOM*1.4, "#2d6a2d"],
   [ZOOM*1.8, ZOOM*1.1, "#3d8a3d"],
   [ZOOM*1.2, ZOOM*0.8, "#4daa4d"]].forEach(function(f,i){
    ctx.fillStyle = f[2];
    ctx.beginPath();
    var fx = s.sx, fy = s.sy - trunkH - i*f[1]*0.6;
    ctx.moveTo(fx, fy - f[1]);
    ctx.lineTo(fx - f[0]/2, fy);
    ctx.lineTo(fx + f[0]/2, fy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
}

function drawLamp(wx, wy){
  var s = toScreen(wx, wy);
  var ph = ZOOM*2.5;
  /* Post */
  ctx.fillStyle = "#555";
  ctx.fillRect(s.sx-2, s.sy-ph, 4, ph);
  /* Arm */
  ctx.fillRect(s.sx, s.sy-ph, ZOOM*0.6, 3);
  /* Bulb glow */
  ctx.fillStyle = "#ffe08a";
  ctx.shadowColor = "#ffe08a";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(s.sx+ZOOM*0.6, s.sy-ph+3, 4, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* ── BUILDING DRAW ── */
function drawBuilding(b, t){
  var WALL_H = ZOOM * 2.8 * (b.h/10);
  var bw = b.w * ZOOM * 0.5;

  var sc = toScreen(b.x, b.y);
  var isActive = (BUILDINGS[currentStep] && BUILDINGS[currentStep].id === b.id);

  /* Shadow */
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(sc.sx, sc.sy + ZOOM*0.3, bw*0.9, bw*0.28, 0, 0, Math.PI*2);
  ctx.fill();

  /* Front face (bottom) */
  ctx.fillStyle = b.color;
  ctx.fillRect(sc.sx - bw, sc.sy - WALL_H, bw*2, WALL_H);

  /* Top face */
  var topPts = [
    {sx: sc.sx - bw,          sy: sc.sy - WALL_H},
    {sx: sc.sx + bw,          sy: sc.sy - WALL_H},
    {sx: sc.sx + bw*0.6,      sy: sc.sy - WALL_H - bw*0.35},
    {sx: sc.sx - bw*0.6,      sy: sc.sy - WALL_H - bw*0.35}
  ];
  ctx.fillStyle = shadeColor(b.color, 30);
  ctx.beginPath();
  ctx.moveTo(topPts[0].sx, topPts[0].sy);
  topPts.forEach(function(p){ ctx.lineTo(p.sx, p.sy); });
  ctx.closePath(); ctx.fill();

  /* Windows */
  for(var row=0; row<2; row++){
    for(var col=-1; col<=1; col+=2){
      var wy = sc.sy - WALL_H * (0.35 + row*0.38);
      var wx = sc.sx + col * bw*0.38;
      var ww = bw*0.22, wh = ZOOM*0.45;
      ctx.fillStyle = Math.random()>0.3 ? "#ffe08a" : "#4de6e6";
      /* Use consistent colours based on position */
      ctx.fillStyle = ((row+col) % 2 === 0) ? "#ffe08a" : "#4de6e6";
      ctx.fillStyle = "rgba(255,224,138,0.85)";
      ctx.shadowColor = "#ffe08a"; ctx.shadowBlur = 6;
      ctx.fillRect(wx-ww/2, wy-wh/2, ww, wh);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#3a2010"; ctx.lineWidth = 1.5;
      ctx.strokeRect(wx-ww/2, wy-wh/2, ww, wh);
    }
  }

  /* Door */
  ctx.fillStyle = "#3a2010";
  ctx.fillRect(sc.sx - bw*0.14, sc.sy - WALL_H*0.55, bw*0.28, WALL_H*0.55);
  /* Door knob */
  ctx.fillStyle = "#f5c518";
  ctx.beginPath(); ctx.arc(sc.sx + bw*0.08, sc.sy - WALL_H*0.28, 2.5, 0, Math.PI*2); ctx.fill();

  /* Roof */
  ctx.fillStyle = b.roof;
  ctx.shadowColor = b.roof; ctx.shadowBlur = isActive ? 12 : 0;
  ctx.beginPath();
  ctx.moveTo(sc.sx - bw*0.72, sc.sy - WALL_H);
  ctx.lineTo(sc.sx + bw*0.72, sc.sy - WALL_H);
  ctx.lineTo(sc.sx,            sc.sy - WALL_H - bw*0.9);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;

  /* Roof ridge */
  ctx.strokeStyle = shadeColor(b.roof, 40);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sc.sx - bw*0.72, sc.sy - WALL_H);
  ctx.lineTo(sc.sx,            sc.sy - WALL_H - bw*0.9);
  ctx.lineTo(sc.sx + bw*0.72, sc.sy - WALL_H);
  ctx.stroke();

  /* Edge outline */
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = isActive ? 2.5 : 1;
  ctx.strokeRect(sc.sx - bw, sc.sy - WALL_H, bw*2, WALL_H);

  /* Active glow border */
  if(isActive){
    ctx.strokeStyle = "#f5c518";
    ctx.lineWidth = 3;
    var glow = 0.6 + 0.4*Math.sin(t*4);
    ctx.strokeStyle = "rgba(245,197,24,"+glow+")";
    ctx.strokeRect(sc.sx - bw - 3, sc.sy - WALL_H - 3, bw*2+6, WALL_H+3);
  }

  /* Torches */
  [-0.65, 0.65].forEach(function(ox){
    var tx = sc.sx + ox*bw, ty = sc.sy - WALL_H*0.6;
    ctx.fillStyle = "#5c3a1e";
    ctx.fillRect(tx-2, ty-12, 4, 12);
    ctx.fillStyle = "#ff6600"; ctx.shadowColor="#ff6600"; ctx.shadowBlur=8;
    ctx.fillRect(tx-3, ty-17, 6, 5);
    ctx.shadowBlur=0;
  });

  /* Sign */
  drawSign(sc.sx, sc.sy - WALL_H*1.1, bw, b.icon+" "+b.label);

  /* Interact indicator above building when near */
  var dist = worldDist(player.wx, player.wy, b.x, b.y);
  if(dist < NEAR_DIST){
    var pulse = 0.7 + 0.3*Math.sin(t*5);
    ctx.fillStyle = "rgba(245,197,24,"+pulse+")";
    ctx.font = "bold "+(ZOOM*0.85)+"px 'Press Start 2P',monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.shadowColor="#f5c518"; ctx.shadowBlur=10;
    ctx.fillText("[E] ENTER", sc.sx, sc.sy - WALL_H - bw*0.9 - 8);
    ctx.shadowBlur=0;
  }
}

function drawSign(x, y, bw, text){
  var sw = bw*1.6, sh = ZOOM*0.6;
  /* Post */
  ctx.fillStyle = "#5c3a1e";
  ctx.fillRect(x-2, y-sh-ZOOM*0.5, 4, ZOOM*0.5);
  /* Board */
  ctx.fillStyle = "#8b5e3c";
  ctx.fillRect(x-sw/2, y-sh, sw, sh);
  ctx.strokeStyle = "#5c3a1e"; ctx.lineWidth=1.5;
  ctx.strokeRect(x-sw/2, y-sh, sw, sh);
  /* Text */
  ctx.fillStyle = "#f5c518";
  ctx.font = "bold "+Math.max(8, ZOOM*0.35)+"px 'Press Start 2P',monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  /* Truncate */
  var maxW = sw - 8;
  var label = text.length > 16 ? text.slice(0,14)+"…" : text;
  ctx.fillText(label, x, y-sh/2);
}

/* ── PLAYER CHARACTER ── */
function drawPlayer(t){
  var s = toScreen(player.wx, player.wy);
  var ph = ZOOM*2.2; /* player height */
  var pw = ZOOM*0.75;
  var bob = player.moving ? Math.sin(player.walkT*0.3)*ZOOM*0.15 : 0;

  var px = s.sx, py = s.sy - bob;

  /* Shadow */
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px, py, pw*0.8, pw*0.25, 0, 0, Math.PI*2);
  ctx.fill();

  /* LEGS */
  var legSwing = player.moving ? Math.sin(player.walkT*0.3)*8 : 0;
  ctx.fillStyle = "#1e1e6e";
  ctx.fillRect(px - pw*0.35, py - ph*0.42, pw*0.28, ph*0.38);
  ctx.fillRect(px + pw*0.07, py - ph*0.42, pw*0.28, ph*0.38);

  /* BOOTS */
  ctx.fillStyle = "#3a2010";
  ctx.fillRect(px - pw*0.37, py - ph*0.06, pw*0.3, ph*0.06);
  ctx.fillRect(px + pw*0.07, py - ph*0.06, pw*0.3, ph*0.06);

  /* TORSO */
  ctx.fillStyle = "#2a5f9e";
  ctx.fillRect(px - pw*0.4, py - ph*0.78, pw*0.8, ph*0.38);

  /* Belt */
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(px - pw*0.4, py - ph*0.42, pw*0.8, ph*0.05);

  /* ARMS */
  var armSwingL = player.moving ? Math.sin(player.walkT*0.3+Math.PI)*6 : 0;
  var armSwingR = player.moving ? Math.sin(player.walkT*0.3)*6 : 0;
  ctx.fillStyle = "#c79c6e";
  ctx.fillRect(px - pw*0.7, py - ph*0.76, pw*0.24, ph*0.34);
  ctx.fillRect(px + pw*0.46, py - ph*0.76, pw*0.24, ph*0.34);

  /* HEAD */
  ctx.fillStyle = "#c79c6e";
  var hSize = pw*0.7;
  ctx.fillRect(px - hSize/2, py - ph, hSize, hSize);

  /* HAIR */
  ctx.fillStyle = "#3a2008";
  ctx.fillRect(px - hSize/2, py - ph, hSize, hSize*0.3);

  /* EYES */
  ctx.fillStyle = "#2a1508";
  ctx.fillRect(px - hSize*0.28, py - ph + hSize*0.42, hSize*0.16, hSize*0.18);
  ctx.fillRect(px + hSize*0.12, py - ph + hSize*0.42, hSize*0.16, hSize*0.18);

  /* NAME TAG */
  var nameW = 80, nameH = 18;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(px - nameW/2, py - ph - nameH - 6, nameW, nameH);
  ctx.fillStyle = "#f5c518";
  ctx.font = "bold 9px 'Press Start 2P',monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("SUMEDH", px, py - ph - nameH/2 - 6);

  /* Direction indicator (small arrow in front of player) */
  var arrowX = px + Math.sin(player.angle)*ZOOM*1.2;
  var arrowY = py - ph*0.5 + Math.cos(player.angle)*ZOOM*0.65;
  ctx.fillStyle = "rgba(245,197,24,0.6)";
  ctx.beginPath(); ctx.arc(arrowX, arrowY, 3, 0, Math.PI*2); ctx.fill();
}

/* ── PROXIMITY INDICATOR ── */
function drawProximityIndicator(){
  var nearest = getNearestBuilding();
  if(!nearest) return;
  var dist = worldDist(player.wx, player.wy, nearest.x, nearest.y);
  if(dist >= NEAR_DIST) return;
  var el = document.getElementById("prompt");
  if(el) el.classList.remove("hidden");
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7. MINIMAP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var MM = 180;
/* World Y range: -25 to 75 → 100 units */
var MM_WX_MIN = -8, MM_WX_MAX = 28;
var MM_WY_MIN = -25, MM_WY_MAX = 75;

function worldToMM(wx, wy){
  var px = ((wx - MM_WX_MIN) / (MM_WX_MAX - MM_WX_MIN)) * MM;
  var py = ((wy - MM_WY_MIN) / (MM_WY_MAX - MM_WY_MIN)) * MM;
  /* Minimap Y: world high Y = top of map, flip */
  py = MM - py;
  return {px: px, py: py};
}

function drawMinimap(){
  if(!mmCtx || !mapVisible) return;
  var c = mmCtx;
  c.clearRect(0,0,MM,MM);

  /* Background */
  c.fillStyle = "#0e1f0a";
  c.fillRect(0,0,MM,MM);

  /* Grid */
  c.strokeStyle = "rgba(255,255,255,0.05)"; c.lineWidth=1;
  for(var g=0;g<MM;g+=MM/8){ c.beginPath();c.moveTo(g,0);c.lineTo(g,MM);c.stroke();c.beginPath();c.moveTo(0,g);c.lineTo(MM,g);c.stroke(); }

  /* Path road */
  c.strokeStyle = "#555"; c.lineWidth = 4;
  c.beginPath();
  WAYPOINTS.forEach(function(p,i){
    var m = worldToMM(p.x, p.y);
    i===0 ? c.moveTo(m.px, m.py) : c.lineTo(m.px, m.py);
  });
  c.stroke();

  /* Centre dashes */
  c.strokeStyle = "#f5c518"; c.lineWidth = 1; c.setLineDash([3,5]);
  c.beginPath();
  WAYPOINTS.forEach(function(p,i){
    var m = worldToMM(p.x, p.y);
    i===0 ? c.moveTo(m.px, m.py) : c.lineTo(m.px, m.py);
  });
  c.stroke(); c.setLineDash([]);

  /* Trees (dots) */
  c.fillStyle = "rgba(50,120,50,0.5)";
  [[-4,62],[20,62],[-4,46],[20,46],[-4,30],[20,30],[-4,14],[20,14],[-4,-2],[20,-2]].forEach(function(p){
    var m = worldToMM(p[0],p[1]);
    c.beginPath(); c.arc(m.px,m.py,3,0,Math.PI*2); c.fill();
  });

  /* Buildings */
  BUILDINGS.forEach(function(b, i){
    var m = worldToMM(b.x, b.y);
    var bw = 10, bh = 10;
    var r=(b.color.match(/#(..)(..)(..)/))||["","5b","8a","32"];
    c.fillStyle = b.color || "#5b8a32";
    c.fillRect(m.px-bw/2, m.py-bh/2, bw, bh);
    c.fillStyle = b.roof || "#8b5e3c";
    c.fillRect(m.px-bw/2, m.py-bh/2, bw, 3);
    c.strokeStyle = (i===currentStep) ? "#f5c518" : "#888";
    c.lineWidth = (i===currentStep) ? 2 : 1;
    c.strokeRect(m.px-bw/2, m.py-bh/2, bw, bh);
    /* Icon */
    c.font="9px serif"; c.textAlign="center"; c.fillStyle="#fff";
    c.fillText(b.icon, m.px, m.py+bh/2+10);
  });

  /* Section numbers on path */
  WAYPOINTS.forEach(function(p,i){
    var m = worldToMM(p.x, p.y);
    c.fillStyle = doneSections[PATH[i].id] ? "#5b8a32" : (i===currentStep ? "#f5c518" : "#666");
    c.font = "bold 8px monospace"; c.textAlign="center"; c.textBaseline="middle";
    c.fillText(i+1, m.px-10, m.py);
  });

  /* PLAYER — red direction arrow */
  var pm = worldToMM(player.wx, player.wy);
  c.save();
  c.translate(pm.px, pm.py);
  /* In minimap: world +Y = up (we flipped it).
     player.angle: 0=facing +X (right), π=facing -Y (up in world = down in mm).
     Arrow tip = forward direction. Minimap Y is flipped from world Y.
     So arrow angle in canvas = -player.angle + π (because Y is flipped) */
  var mmAngle = -(player.angle) + Math.PI;
  c.rotate(mmAngle);
  c.shadowColor="#ff0000"; c.shadowBlur=10;
  c.fillStyle="#ff2222";
  c.beginPath();
  c.moveTo(0,-11);   /* TIP — points where player looks */
  c.lineTo(-5,5); c.lineTo(-2,2); c.lineTo(0,7); c.lineTo(2,2); c.lineTo(5,5);
  c.closePath(); c.fill();
  c.shadowBlur=0; c.strokeStyle="#fff"; c.lineWidth=1.5; c.stroke();
  c.fillStyle="#fff"; c.beginPath(); c.arc(0,0,2.5,0,Math.PI*2); c.fill();
  c.restore();

  /* Border */
  c.strokeStyle="#f5c518"; c.lineWidth=2.5; c.strokeRect(1,1,MM-2,MM-2);

  /* Compass */
  c.font="bold 9px monospace"; c.fillStyle="#fff";
  c.textAlign="center"; c.textBaseline="top";    c.fillText("N",MM/2,2);
  c.textBaseline="bottom"; c.fillText("S",MM/2,MM-1);
  c.textAlign="left"; c.textBaseline="middle";   c.fillText("W",3,MM/2);
  c.textAlign="right";                            c.fillText("E",MM-1,MM/2);

  /* Update coords */
  var coord = document.getElementById("mm-coords");
  if(coord) coord.textContent = "Section "+(currentStep+1)+" / "+PATH.length;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   8. GAME LOOP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var lastT = 0;
function loop(ts){
  animFrame = requestAnimationFrame(loop);
  var t = ts / 1000;
  var dt = Math.min(t - lastT, 0.05);
  lastT = t;
  if(!paused && !popupOpen) updatePlayer(dt, t);
  drawWorld(t);
  drawMinimap();
  updatePathNav();
  updateHUD();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   9. PLAYER UPDATE — FIXED PATH MOVEMENT
   W/↑ = move toward next waypoint
   S/↓ = move toward prev waypoint
   A/D = rotate view
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function updatePlayer(dt, t){
  player.moving = false;

  /* Turn with A/D */
  if(keys["a"] || keys["arrowleft"])  { player.angle -= TURN_SPEED; }
  if(keys["d"] || keys["arrowright"]) { player.angle += TURN_SPEED; }

  /* Move forward (W) toward next waypoint */
  if(keys["w"] || keys["arrowup"]){
    moveTowardWaypoint(currentStep, dt, 1);
  }
  /* Move backward (S) toward previous waypoint */
  if(keys["s"] || keys["arrowdown"]){
    if(currentStep > 0) moveTowardWaypoint(currentStep-1, dt, -1);
  }

  /* Walk animation */
  if(player.moving) player.walkT += dt * 60;

  /* Check proximity for interact prompt */
  var nearest = getNearestBuilding();
  var prompt  = document.getElementById("prompt");
  if(prompt){
    var dist = nearest ? worldDist(player.wx, player.wy, nearest.x, nearest.y) : 999;
    dist < NEAR_DIST ? prompt.classList.remove("hidden") : prompt.classList.add("hidden");
  }
}

function moveTowardWaypoint(targetIdx, dt, dir){
  if(targetIdx < 0 || targetIdx >= WAYPOINTS.length) return;
  var target = WAYPOINTS[targetIdx];
  var dx = target.x - player.wx;
  var dy = target.y - player.wy;
  var dist = Math.sqrt(dx*dx + dy*dy);

  if(dist < 0.3){
    /* Arrived at this waypoint */
    player.wx = target.x; player.wy = target.y;
    if(dir === 1 && targetIdx === currentStep){
      /* Reached current target — advance step */
      if(currentStep < WAYPOINTS.length-1){
        currentStep++;
        showToast("📍 Approaching "+PATH[currentStep].label+" — Press E to enter");
      }
    }
    return;
  }

  var speed = WALK_SPEED * (dist < 2 ? dist/2 : 1);
  player.wx += (dx/dist)*speed*dt*60;
  player.wy += (dy/dist)*speed*dt*60;
  player.moving = true;

  /* Face movement direction */
  player.angle = Math.atan2(dx, dy);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   10. INTERACTION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function interact(){
  if(popupOpen){ closePopup(); return; }
  var nearest = getNearestBuilding();
  if(!nearest) return;
  var dist = worldDist(player.wx, player.wy, nearest.x, nearest.y);
  if(dist < NEAR_DIST){
    showSection(nearest.id);
  } else {
    showToast("Walk closer to a building first!");
  }
}

function getNearestBuilding(){
  var best=null, bestD=Infinity;
  BUILDINGS.forEach(function(b){
    var d=worldDist(player.wx,player.wy,b.x,b.y);
    if(d<bestD){ bestD=d; best=b; }
  });
  return best;
}

function showSection(id){
  var sec = SECTIONS[id];
  if(!sec) return;
  doneSections[id] = true;
  document.getElementById("pop-icon").textContent  = sec.icon;
  document.getElementById("pop-title").textContent = sec.title;
  document.getElementById("pop-body").innerHTML    = sec.body();
  document.getElementById("pop-foot").innerHTML    =
    (sec.foot || "") +
    '<button class="mc-btn gray auto" onclick="closePopup()" style="margin-top:.4rem"><span class="k">Q</span> Close &amp; Continue</button>';
  document.getElementById("popup").classList.remove("hidden");
  popupOpen = true;

  /* Update step index to match this section */
  PATH.forEach(function(p,i){ if(p.id===id) currentStep=i; });
}

function closePopup(){
  document.getElementById("popup").classList.add("hidden");
  popupOpen = false;
  /* Advance to next waypoint automatically */
  var nextStep = currentStep + 1;
  if(nextStep < PATH.length){
    showToast("➡️ Walk forward (W) to "+PATH[nextStep].label);
  } else {
    showToast("🎉 Portfolio complete! Press Q to restart or explore freely.");
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   11. TELEPORT / GOTO
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function goToStep(idx){
  if(idx < 0 || idx >= PATH.length) return;
  currentStep = idx;
  var wp = WAYPOINTS[idx];
  player.wx = wp.x;
  player.wy = wp.y + 8; /* stand in front of building */
  player.angle = Math.PI; /* face toward building (up = -Y) */
  closePopup();
  resumeGame();
  updateHotbar(idx);
  showToast("🚀 Teleported to "+PATH[idx].label);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   12. HUD UPDATES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function updateHUD(){
  var sec = document.getElementById("hud-section");
  if(sec) sec.textContent = PATH[currentStep] ? PATH[currentStep].icon+" "+PATH[currentStep].label.replace(/^../, "") : "Open World";
  var hint = document.getElementById("hud-hint");
  if(hint){
    var nearest = getNearestBuilding();
    var dist = nearest ? worldDist(player.wx,player.wy,nearest.x,nearest.y) : 999;
    if(dist < NEAR_DIST) hint.innerHTML = 'Press <span class="k">E</span> to enter';
    else hint.innerHTML = 'Press <span class="k">W</span> to walk forward';
  }
}

function updatePathNav(){
  var container = document.getElementById("path-steps");
  if(!container) return;
  container.innerHTML = PATH.map(function(p,i){
    var cls = "path-step";
    if(doneSections[p.id]) cls += " done";
    if(i===currentStep)    cls += " active";
    return '<div class="'+cls+'" onclick="goToStep('+i+')">'
      +'<span class="ps-dot"></span> '+p.label+'</div>';
  }).join('');
}

function updateHotbar(activeIdx){
  document.querySelectorAll(".hb").forEach(function(el,i){
    el.classList.toggle("active", i===activeIdx);
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   13. CONTROLS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function setupControls(){
  document.addEventListener("keydown", function(e){
    var k = e.key.toLowerCase();
    keys[k] = true;
    if(e.key==="Escape"){ e.preventDefault(); togglePause(); }
    if(k==="e"){ e.preventDefault(); interact(); }
    if(k==="q"){ e.preventDefault(); closePopup(); }
    if(k==="v"){ e.preventDefault(); toggleView(); }
    if(k==="m"){ e.preventDefault(); toggleMap(); }
    if(k===" "){ e.preventDefault(); }
    /* Number keys for quick nav */
    var n = parseInt(k); if(n>=1&&n<=6) goToStep(n-1);
  });
  document.addEventListener("keyup", function(e){ keys[e.key.toLowerCase()]=false; });

  /* Hotbar clicks */
  document.querySelectorAll(".hb").forEach(function(el,i){
    el.addEventListener("click", function(){ goToStep(i); });
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   14. TOGGLE HELPERS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function toggleView(){
  isThirdPerson = !isThirdPerson;
  document.getElementById("view-lbl").textContent = isThirdPerson ? "👁 3RD" : "👁 1ST";
  showToast(isThirdPerson ? "🎮 Third-Person View" : "👁 First-Person View");
}

function toggleMap(){
  mapVisible = !mapVisible;
  document.getElementById("mm-wrap").classList.toggle("hidden", !mapVisible);
  document.getElementById("mm-btn").classList.toggle("hidden", mapVisible);
}

function togglePause(){
  paused = !paused;
  document.getElementById("pause").classList.toggle("hidden", !paused);
}

function resumeGame(){
  paused = false;
  document.getElementById("pause").classList.add("hidden");
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   15. UTILITIES
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function worldDist(x1,y1,x2,y2){ var dx=x2-x1,dy=y2-y1; return Math.sqrt(dx*dx+dy*dy); }

function shadeColor(hex, amt){
  /* Lighten a CSS hex color by amt (0-255) */
  var c = parseInt(hex.replace('#',''), 16);
  var r = Math.min(255, ((c>>16)&0xff)+amt);
  var g = Math.min(255, ((c>>8) &0xff)+amt);
  var b = Math.min(255, ((c)    &0xff)+amt);
  return '#'+[r,g,b].map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('');
}

var toastTimer;
function showToast(msg, dur){
  dur = dur||2800;
  var el = document.getElementById("toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ el.classList.remove("show"); }, dur);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   16. LOADING → INIT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function startLoading(){
  var bar = document.getElementById("ld-bar");
  var msg = document.getElementById("ld-msg");
  var msgs = ["Generating terrain…","Placing grass blocks…","Building portfolio city…","Lighting torches…","Opening world gate…","Ready!"];
  var pct=0, mi=0;
  var iv = setInterval(function(){
    pct += Math.random()*20+6;
    if(pct>100) pct=100;
    bar.style.width = pct+"%";
    if(pct>(mi+1)*16 && mi<msgs.length-1) msg.textContent = msgs[++mi];
    if(pct>=100){
      clearInterval(iv);
      msg.textContent="✅ World ready!";
      setTimeout(function(){
        var ls = document.getElementById("loading");
        ls.style.opacity="0";
        ls.style.transition="opacity .7s";
        setTimeout(function(){
          ls.style.display="none";
          initGame();
        },750);
      },500);
    }
  },130);
})();

function initGame(){
  initCanvas();
  setupControls();

  /* Place player at spawn (in front of first building) */
  player.wx = WAYPOINTS[0].x;
  player.wy = WAYPOINTS[0].y + 8;
  player.angle = Math.PI; /* face toward first building */

  /* Build path nav */
  updatePathNav();

  /* Start loop */
  requestAnimationFrame(loop);

  /* Open intro section automatically after short delay */
  setTimeout(function(){
    showSection("intro");
    showToast("🌍 Welcome! Press E to explore each section.");
  }, 800);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   17. KONAMI EASTER EGG
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function(){
  var code=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"],idx=0;
  document.addEventListener("keydown",function(e){
    if(e.key.toLowerCase()===code[idx]){
      if(++idx===code.length){
        idx=0;
        showToast("🎮 CHEAT CODE! Night mode activated…",3000);
        canvas.style.filter="invert(1) hue-rotate(180deg)";
        setTimeout(function(){ canvas.style.filter=""; },5000);
      }
    } else idx=0;
  });
})();

console.log(
  "%c⛏️ SUMEDH PATHE — Minecraft Portfolio%c\nsumedhpatthe2005@gmail.com | github.com/Sumedh9696%c\nHint: Try number keys 1-6 to jump to sections!",
  "color:#f5c518;font-size:16px;font-weight:bold;",
  "color:#4de6e6;font-size:12px;",
  "color:#888;font-size:11px;"
);
