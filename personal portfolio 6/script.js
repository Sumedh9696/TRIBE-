/* ================================================================
   SUMEDH'S WORLD — script.js
   Low-poly 3D island, drag-to-rotate, click objects to explore
   Pure Canvas 2D — zero dependencies
   ================================================================ */
"use strict";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COLOUR PALETTE (Joshua's World inspired)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var C = {
  sky1:"#b8d4f0", sky2:"#d8f0ff",
  ocean:"#6a8ad8", oceanD:"#5070c0",
  island:"#7080c8", islandD:"#5868a8", islandDark:"#4858a0",
  hill:"#6878c0", hillD:"#5060a8",
  ground:"#8090d0",
  treeD:"#3848a0", treeM:"#4858b0", treeL:"#5870c8",
  orange:"#e87040", orangeL:"#f09060", orangeD:"#c05020",
  pink:"#e090a0", pinkD:"#c06880",
  white:"#f0f4ff",
  dark:"#2a3450",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION DATA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var SECTIONS = [
  {
    id:"intro", angle:0, label:"Intro",
    story:"Hi! I'm Sumedh Pathe —\nWeb Developer & AI Enthusiast.",
    objKey:"house",
    icon:"🏠", title:"Welcome — Sumedh Pathe",
    body: `<p>I'm a passionate <b>Full-Stack Web Developer</b> and <b>AI Enthusiast</b> crafting responsive, modern web applications.</p>
<h3>📌 Quick Info</h3>
<ul>
  <li>📍 Buldana, Maharashtra, India</li>
  <li>🎓 B.E. Computer Science Engineering (2027)</li>
  <li>🏫 Anuradha College of Engineering & Technology</li>
  <li>📞 +91 87938 96929</li>
  <li>✉️ <a href="mailto:sumedhpatthe2005@gmail.com">sumedhpatthe2005@gmail.com</a></li>
  <li>🐙 <a href="https://github.com/Sumedh9696" target="_blank">github.com/Sumedh9696</a></li>
</ul>
<h3>🌍 Languages</h3>
<p><span class="tag">English — Fluent</span> <span class="tag">Hindi — Native</span> <span class="tag">Marathi — Native</span></p>`,
    foot:`<a href="https://github.com/Sumedh9696" target="_blank" class="card-btn primary">🐙 GitHub</a><a href="mailto:sumedhpatthe2005@gmail.com" class="card-btn secondary">✉️ Email</a>`
  },
  {
    id:"about", angle:60, label:"About",
    story:"My journey in Computer Science\nstarted at Anuradha College in 2023.",
    objKey:"cabin",
    icon:"📜", title:"About — Education & Background",
    body:`<div class="tl"><div class="tl-dot"></div><div><div class="tl-yr">JULY 2023 — MAY 2027</div><div class="tl-role">B.E. Computer Science Engineering</div><div class="tl-org">Anuradha College of Engineering & Technology</div><div class="tl-desc">Chikhli, Maharashtra · Relevant coursework: Data Structures & Algorithms, Artificial Intelligence, Web Development, Operating Systems, DBMS, OOP, Cyber Security</div></div></div>
<h3>🧠 Professional Summary</h3>
<p>Motivated CSE student specialising in full-stack web development and AI-integrated applications. Experienced in building responsive, performant interfaces using modern JavaScript frameworks and integrating AI models into real products.</p>
<h3>🎯 Interests</h3>
<p><span class="tag">Open Source</span><span class="tag">Hackathons</span><span class="tag">UI/UX Design</span><span class="tag">AI Product Development</span></p>`,
    foot:`<button class="card-btn secondary" onclick="goTo(2);closeCard()">Next: Skills →</button>`
  },
  {
    id:"skills", angle:120, label:"Skills",
    story:"I wield HTML, CSS, React, Node.js\nand Python as my tools of craft.",
    objKey:"tower",
    icon:"⚔️", title:"Skills — Tech Stack",
    body:(function(){
      var fe=[["HTML5",95],["CSS3",92],["JavaScript ES6+",88],["React.js",82],["Tailwind CSS",85]];
      var be=[["Node.js",78],["Express.js",76],["REST API",82],["Python",72],["MongoDB",76],["Firebase",73]];
      function bars(arr){ return arr.map(function(s){ return '<div class="skill-row"><span class="sk-name">'+s[0]+'</span><div class="sk-bg"><div class="sk-fill" style="width:'+s[1]+'%"></div></div><span class="sk-pct">'+s[1]+'%</span></div>'; }).join(''); }
      return '<h3>🎨 Frontend</h3>'+bars(fe)+'<h3>⚙️ Backend</h3>'+bars(be)+'<h3>📜 Certificate</h3><p><span class="tag">HTML & CSS Workshop — 2024</span></p>';
    })(),
    foot:`<button class="card-btn secondary" onclick="goTo(3);closeCard()">Next: Experience →</button>`
  },
  {
    id:"experience", angle:180, label:"Experience",
    story:"Currently interning at 3Skill.in,\nbuilding real-world web applications.",
    objKey:"van",
    icon:"💼", title:"Experience — Internship",
    body:`<div class="tl"><div class="tl-dot"></div><div><div class="tl-yr">ONGOING · REMOTE</div><div class="tl-role">Web Development Intern</div><div class="tl-org">3Skill.in</div><div class="tl-desc"><ul style="margin-top:.3rem"><li>Building & maintaining web applications using React.js and Tailwind CSS</li><li>UI development, responsive design, REST API integration</li><li>Git version control and agile development workflows</li><li>Hands-on real-world development experience</li></ul></div></div></div>
<h3>🛠️ Tech at Work</h3>
<p><span class="tag">React.js</span><span class="tag">Tailwind CSS</span><span class="tag">REST APIs</span><span class="tag">Git</span><span class="tag">Agile</span></p>`,
    foot:`<a href="https://github.com/Sumedh9696" target="_blank" class="card-btn primary">🐙 GitHub</a><button class="card-btn secondary" onclick="goTo(4);closeCard()">Next: Projects →</button>`
  },
  {
    id:"projects", angle:240, label:"Projects",
    story:"I've built AI nutrition apps,\nChrome extensions, and brand clones.",
    objKey:"workshop",
    icon:"🏗️", title:"Projects — Portfolio Hub",
    body:`<div class="proj"><div class="proj-title">🍎 Neutrichef — AI Nutrition Platform</div><div class="proj-stack"><span class="tag">React.js</span><span class="tag">Python</span><span class="tag">REST APIs</span><span class="tag">Tailwind CSS</span></div><div style="margin:.3rem 0"><span style="font-size:.8rem;color:#e87040;border:1px solid #e87040;border-radius:3px;padding:1px 7px">🔄 Ongoing</span></div><div class="proj-desc">AI-driven nutrition platform with personalised recipe recommendations and macro-level nutritional analysis. Scalable React.js component structure with Python AI backend.</div><div class="proj-links"><span class="proj-private">🔒 Private Repo</span><span style="font-size:.78rem;color:#888;padding:2px 6px">GitHub status: Private</span></div></div>
<div class="proj"><div class="proj-title">🔌 NutriGuide — Chrome Extension</div><div class="proj-stack"><span class="tag">JavaScript</span><span class="tag">Chrome Extensions API</span><span class="tag">REST API</span></div><div style="margin:.3rem 0"><span style="font-size:.8rem;color:#3a8a3a;border:1px solid #3a8a3a;border-radius:3px;padding:1px 7px">✅ Completed 2025</span></div><div class="proj-desc">Chrome extension providing instant nutritional information and healthy meal suggestions while browsing food websites.</div><div class="proj-links"><a href="https://github.com/Sumedh9696" target="_blank" class="proj-link">🐙 GitHub</a></div></div>
<div class="proj"><div class="proj-title">🏸 Yonex Website Clone</div><div class="proj-stack"><span class="tag">HTML5</span><span class="tag">CSS3</span><span class="tag">JavaScript</span><span class="tag">Responsive</span></div><div style="margin:.3rem 0"><span style="font-size:.8rem;color:#3a8a3a;border:1px solid #3a8a3a;border-radius:3px;padding:1px 7px">✅ Completed 2025</span></div><div class="proj-desc">Pixel-accurate clone of the Yonex sports brand website with CSS precision, cross-browser compatibility, and performance optimisation.</div><div class="proj-links"><a href="https://github.com/Sumedh9696" target="_blank" class="proj-link">🐙 GitHub</a></div></div>`,
    foot:`<a href="https://github.com/Sumedh9696" target="_blank" class="card-btn primary">🐙 All Projects on GitHub</a>`
  },
  {
    id:"contact", angle:300, label:"Contact",
    story:"Let's build something amazing together.\nI'm open to opportunities!",
    objKey:"flag",
    icon:"📬", title:"Contact — Let's Connect",
    body:`<p>I'm open to <b>internships, freelance projects, collaborations,</b> and <b>full-time opportunities.</b></p>
<h3>📧 Email</h3><p><a href="mailto:sumedhpatthe2005@gmail.com">sumedhpatthe2005@gmail.com</a></p>
<h3>📞 Phone</h3><p>+91 87938 96929</p>
<h3>📍 Location</h3><p>Buldana, Maharashtra, India</p>
<h3>🐙 GitHub</h3><p><a href="https://github.com/Sumedh9696" target="_blank">github.com/Sumedh9696</a></p>
<h3>🎯 Looking For</h3>
<p><span class="tag">Web Dev Roles</span><span class="tag">AI/ML Projects</span><span class="tag">Open Source</span><span class="tag">Freelance</span><span class="tag">Internships</span></p>`,
    foot:`<a href="mailto:sumedhpatthe2005@gmail.com" class="card-btn primary">✉️ Send Email</a><a href="https://github.com/Sumedh9696" target="_blank" class="card-btn secondary">🐙 GitHub</a>`
  }
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var canvas, ctx, W, H;
var rotY = 0;           /* horizontal rotation angle (degrees) */
var targetRotY = 0;     /* smooth target */
var isDark = false;
var isDragging = false;
var lastX = 0, lastY = 0;
var velX = 0;           /* inertia velocity */
var currentSection = 0;
var cardOpen = false;
var dragged = false;    /* has user ever dragged */
var t = 0;             /* animation time */
var particles = [];    /* floating sparkle dots */

/* Object hit-test rects (screen space, updated each frame) */
var hitAreas = {};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INIT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function init(){
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  initParticles();
  setupEvents();
  requestAnimationFrame(loop);
}

function resize(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PARTICLES (floating white dots like reference)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initParticles(){
  particles = [];
  for(var i=0;i<55;i++){
    particles.push({
      angle: Math.random()*360,  /* position angle on island */
      radius: 0.15 + Math.random()*0.55, /* 0=center 1=edge */
      bobY: Math.random()*Math.PI*2,
      bobSpeed: 0.4 + Math.random()*0.8,
      size: 2 + Math.random()*3,
      alpha: 0.4 + Math.random()*0.6
    });
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3D PROJECTION
   We model the island as a flat disc viewed from
   slightly above (isometric tilt ~55°).
   rotY controls rotation around vertical axis.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
var TILT = 0.42;   /* vertical squish factor (cos of elevation angle) */
var SCALE = 0.38;  /* island radius as fraction of min(W,H) */

/* Project a point on the island disc to screen coords.
   angle = degrees, r = 0..1 (radius fraction)
   elevFrac = 0..1 (height above ground, 1 = hilltop) */
function project(angleDeg, r, elevFrac){
  var R   = Math.min(W,H) * SCALE;
  var rad = (angleDeg + rotY) * Math.PI / 180;
  var worldX = Math.cos(rad) * r * R;
  var worldZ = Math.sin(rad) * r * R;
  var sx = W/2 + worldX;
  var sy = H * 0.58 + worldZ * TILT - elevFrac * R * 0.55;
  return {x:sx, y:sy, depth: worldZ};
}

/* Project a 3D cartesian point (x,y,z) where y=up */
function proj3(x,y,z){
  var R = Math.min(W,H)*SCALE;
  var rad = rotY*Math.PI/180;
  var rx = x*Math.cos(rad) - z*Math.sin(rad);
  var rz = x*Math.sin(rad) + z*Math.cos(rad);
  var sx = W/2 + rx*R;
  var sy = H*0.58 + rz*R*TILT - y*R*0.6;
  return {x:sx, y:sy, depth:rz};
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DRAWING HELPERS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function poly(pts, fill, stroke, lw){
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();}
}

function ellipseFlat(cx,cy,rx,ry,fill){
  ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
  ctx.fillStyle=fill; ctx.fill();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DRAW OCEAN + SKY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function drawSky(){
  var g = ctx.createLinearGradient(0,0,0,H);
  if(isDark){
    g.addColorStop(0,"#050c1a"); g.addColorStop(0.5,"#0a1428"); g.addColorStop(1,"#0d1830");
  } else {
    g.addColorStop(0,"#b0ccee"); g.addColorStop(0.45,"#c8e0f8"); g.addColorStop(1,"#d8eeff");
  }
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  /* Stars in dark mode */
  if(isDark){
    ctx.fillStyle="rgba(255,255,255,0.7)";
    for(var i=0;i<120;i++){
      var sx=(Math.sin(i*137.5)*0.5+0.5)*W;
      var sy=(Math.cos(i*97.3)*0.5+0.5)*H*0.6;
      var sr=Math.sin(t*0.8+i)*0.3+0.8;
      ctx.globalAlpha=sr*0.6;
      ctx.beginPath(); ctx.arc(sx,sy,0.8+Math.sin(i)*0.4,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
  }
}

function drawOcean(){
  var R=Math.min(W,H)*SCALE;
  /* Ocean ellipse */
  var oy=H*0.58;
  var oceanColor = isDark ? "#2a3870" : "#7090d8";
  var oceanColorD= isDark ? "#1a2860" : "#5878c0";
  ellipseFlat(W/2, oy, R*1.55, R*1.55*TILT, oceanColorD);
  /* Concentric rings (depth layers like reference) */
  for(var i=0;i<4;i++){
    var rf = 1.42 - i*0.12;
    ellipseFlat(W/2, oy + i*2, R*rf, R*rf*TILT, i%2===0?oceanColor:oceanColorD);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DRAW ISLAND — layered terrain (low-poly hill)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function drawIsland(){
  var R=Math.min(W,H)*SCALE;
  var oy=H*0.58;
  var ic  = isDark ? "#3a4888" : C.island;
  var icD = isDark ? "#2a3878" : C.islandD;
  var ic2 = isDark ? "#4a5898" : C.ground;

  /* Base island disc */
  ellipseFlat(W/2, oy, R*1.1, R*1.1*TILT, icD);
  ellipseFlat(W/2, oy-4, R*1.05, R*1.05*TILT, ic);

  /* Mid terrain ring */
  ellipseFlat(W/2, oy-8, R*0.82, R*0.82*TILT, ic2);

  /* Hill — built from layered ellipses */
  var hc  = isDark ? "#5060a8" : C.hill;
  var hcD = isDark ? "#3848a0" : C.hillD;
  for(var layer=0;layer<8;layer++){
    var frac = layer/8;
    var lr = 0.7*(1-frac*0.65);
    var lh = frac*R*0.45;
    var lc = layer%2===0 ? hc : hcD;
    ellipseFlat(W/2, oy - 8 - lh, R*lr, R*lr*TILT*(1-frac*0.2), lc);
  }
  /* Hilltop */
  ellipseFlat(W/2, oy-8-R*0.46, R*0.12, R*0.12*TILT*0.6,
    isDark?"#6878b8":C.treeL);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LOW-POLY PINE TREE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function drawTree(angleDeg, r, sizeF){
  var p = project(angleDeg, r, 0);
  var R = Math.min(W,H)*SCALE;
  var h = R*0.18*sizeF;
  var w = h*0.6;
  var tc  = isDark ? "#2838a0" : C.treeD;
  var tcM = isDark ? "#3848b0" : C.treeM;
  var tcL = isDark ? "#4858c0" : C.treeL;

  /* 3 stacked triangles */
  [[0,h,0.55],[0,h*0.66,0.42],[0,h*0.33,0.3]].forEach(function(layer,i){
    var lw=w*(1-i*0.18), lh=h*(0.52-i*0.12);
    var by=p.y-layer[0];
    poly([
      {x:p.x,       y:by-lh},
      {x:p.x-lw/2,  y:by},
      {x:p.x+lw/2,  y:by}
    ], i===0?tc:i===1?tcM:tcL);
  });

  /* trunk */
  ctx.fillStyle=isDark?"#1a2460":"#2a3460";
  ctx.fillRect(p.x-w*0.08, p.y-h*0.05, w*0.16, h*0.12);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BUILDINGS / OBJECTS — one per section
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* HOUSE (Intro) */
function drawHouse(angleDeg, r, label){
  var p=project(angleDeg,r,0.08);
  var R=Math.min(W,H)*SCALE, s=R*0.09;
  var hit=hitAreas;

  /* Shadow */
  ctx.globalAlpha=0.18;
  ellipseFlat(p.x,p.y+s*0.1,s*0.8,s*0.25,isDark?"#000":"#4050a0");
  ctx.globalAlpha=1;

  /* Walls */
  var wc=isDark?"#d8a880":C.orange;
  poly([{x:p.x-s,y:p.y},{x:p.x+s,y:p.y},{x:p.x+s,y:p.y-s*1.4},{x:p.x-s,y:p.y-s*1.4}],wc);
  /* Side shading */
  poly([{x:p.x+s,y:p.y},{x:p.x+s*1.35,y:p.y-s*0.3},{x:p.x+s*1.35,y:p.y-s*1.7},{x:p.x+s,y:p.y-s*1.4}],
    isDark?"#b87050":C.orangeD);
  /* Roof */
  var rc=isDark?"#5060a0":C.treeM;
  poly([{x:p.x-s*1.15,y:p.y-s*1.4},{x:p.x+s*1.15,y:p.y-s*1.4},{x:p.x+s*0.65,y:p.y-s*2.2},{x:p.x-s*0.65,y:p.y-s*2.2}],rc);
  /* Roof side */
  poly([{x:p.x+s*1.15,y:p.y-s*1.4},{x:p.x+s*1.5,y:p.y-s*1.7},{x:p.x+s,y:p.y-s*2.5},{x:p.x+s*0.65,y:p.y-s*2.2}],
    isDark?"#3848a0":C.treeD);
  /* Door */
  ctx.fillStyle=isDark?"#6a4020":"#5a3010";
  ctx.fillRect(p.x-s*0.22,p.y-s*0.9,s*0.44,s*0.9);
  /* Windows */
  ctx.fillStyle=isDark?"rgba(200,220,255,0.5)":"rgba(255,240,180,0.8)";
  ctx.fillRect(p.x-s*0.7,p.y-s*1.05,s*0.32,s*0.3);
  ctx.fillRect(p.x+s*0.38,p.y-s*1.05,s*0.32,s*0.3);
  /* Chimney */
  ctx.fillStyle=isDark?"#b07050":C.orangeD;
  ctx.fillRect(p.x+s*0.3,p.y-s*2.45,s*0.22,s*0.5);
  /* Smoke */
  if(!isDark){
    ctx.globalAlpha=0.3;
    for(var i=0;i<3;i++){
      ctx.beginPath(); ctx.arc(p.x+s*0.41+Math.sin(t+i)*s*0.08, p.y-s*2.5-i*s*0.18, s*0.06+i*s*0.02,0,Math.PI*2);
      ctx.fillStyle="#ddd"; ctx.fill();
    }
    ctx.globalAlpha=1;
  }

  hit.house={x:p.x,y:p.y-s,r:s*1.1};
  drawLabel(p.x, p.y+s*0.3, label);
}

/* CABIN (About) */
function drawCabin(angleDeg, r, label){
  var p=project(angleDeg,r,0.04);
  var R=Math.min(W,H)*SCALE, s=R*0.075;
  /* Walls */
  var wc=isDark?"#8a6040":"#b87848";
  poly([{x:p.x-s,y:p.y},{x:p.x+s,y:p.y},{x:p.x+s,y:p.y-s*1.2},{x:p.x-s,y:p.y-s*1.2}],wc);
  /* Logs texture */
  ctx.strokeStyle=isDark?"#6a4020":"#8a5828"; ctx.lineWidth=1.5;
  for(var i=1;i<4;i++){
    ctx.beginPath(); ctx.moveTo(p.x-s,p.y-s*i*0.3); ctx.lineTo(p.x+s,p.y-s*i*0.3); ctx.stroke();
  }
  /* Roof */
  poly([{x:p.x-s*1.15,y:p.y-s*1.2},{x:p.x+s*1.15,y:p.y-s*1.2},{x:p.x,y:p.y-s*2.1}],
    isDark?"#2838a0":C.treeD);
  /* Door & window */
  ctx.fillStyle=isDark?"#3a2010":"#4a2808";
  ctx.fillRect(p.x-s*0.18,p.y-s*0.75,s*0.36,s*0.75);
  ctx.fillStyle="rgba(200,230,255,0.6)";
  ctx.fillRect(p.x+s*0.3,p.y-s*0.9,s*0.28,s*0.24);

  hitAreas.cabin={x:p.x,y:p.y-s*0.9,r:s};
  drawLabel(p.x, p.y+s*0.2, label);
}

/* TOWER (Skills) */
function drawTower(angleDeg, r, label){
  var p=project(angleDeg,r,0.12);
  var R=Math.min(W,H)*SCALE, s=R*0.065;
  var tc=isDark?"#6878c8":C.treeM;
  var tcD=isDark?"#4858b0":C.treeD;

  /* Base */
  poly([{x:p.x-s*0.7,y:p.y},{x:p.x+s*0.7,y:p.y},{x:p.x+s*0.7,y:p.y-s*2.5},{x:p.x-s*0.7,y:p.y-s*2.5}],tc);
  /* Battlements */
  for(var i=-1;i<=1;i+=1){
    ctx.fillStyle=i%2===0?tc:tcD;
    ctx.fillRect(p.x+i*s*0.4-s*0.2, p.y-s*2.5, s*0.35, s*0.4);
  }
  /* Window slits */
  ctx.fillStyle="rgba(100,130,220,0.4)";
  ctx.fillRect(p.x-s*0.12,p.y-s*1.8,s*0.24,s*0.5);
  ctx.fillRect(p.x-s*0.12,p.y-s*1.1,s*0.24,s*0.4);
  /* Flag on top */
  ctx.fillStyle=C.orange;
  ctx.beginPath(); ctx.moveTo(p.x,p.y-s*3); ctx.lineTo(p.x+s*0.4,p.y-s*2.75); ctx.lineTo(p.x,p.y-s*2.5); ctx.fill();
  /* Flagpole */
  ctx.strokeStyle=isDark?"#888":"#555"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(p.x,p.y-s*2.5); ctx.lineTo(p.x,p.y-s*3.2); ctx.stroke();

  hitAreas.tower={x:p.x,y:p.y-s*1.4,r:s*0.9};
  drawLabel(p.x, p.y+s*0.2, label);
}

/* VAN (Experience) — like Joshua's World orange van */
function drawVan(angleDeg, r, label){
  var p=project(angleDeg,r,0.06);
  var R=Math.min(W,H)*SCALE, s=R*0.085;
  var vc=isDark?"#e06030":C.orange, vd=isDark?"#b04010":C.orangeD;

  /* Body */
  poly([{x:p.x-s*1.1,y:p.y-s*0.1},{x:p.x+s*1.1,y:p.y-s*0.1},{x:p.x+s*1.1,y:p.y-s*1.1},{x:p.x+s*0.7,y:p.y-s*1.55},{x:p.x-s*0.5,y:p.y-s*1.55},{x:p.x-s*1.1,y:p.y-s*0.9}],vc);
  /* Side */
  poly([{x:p.x+s*1.1,y:p.y-s*0.1},{x:p.x+s*1.45,y:p.y-s*0.3},{x:p.x+s*1.45,y:p.y-s*1.2},{x:p.x+s*1.1,y:p.y-s*1.1}],vd);
  /* Roof rack */
  ctx.fillStyle=isDark?"#8a4020":C.orangeD;
  ctx.fillRect(p.x-s*0.3,p.y-s*1.65,s*1.0,s*0.16);
  /* Roof cargo */
  ctx.fillStyle=isDark?"#6a3010":"#8a4015";
  ctx.fillRect(p.x-s*0.25,p.y-s*1.8,s*0.9,s*0.18);
  /* Windows */
  ctx.fillStyle="rgba(180,220,255,0.55)";
  ctx.fillRect(p.x-s*0.4,p.y-s*1.38,s*0.5,s*0.32);
  ctx.fillRect(p.x+s*0.2,p.y-s*1.38,s*0.38,s*0.32);
  /* Wheels */
  ctx.fillStyle=isDark?"#1a2030":"#222";
  ctx.beginPath(); ctx.arc(p.x-s*0.65,p.y,s*0.2,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(p.x+s*0.65,p.y,s*0.2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=isDark?"#3a4050":"#888";
  ctx.beginPath(); ctx.arc(p.x-s*0.65,p.y,s*0.1,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(p.x+s*0.65,p.y,s*0.1,0,Math.PI*2); ctx.fill();
  /* Ladder on side */
  ctx.strokeStyle=isDark?"#888":"#666"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(p.x+s*1.1,p.y-s*0.2); ctx.lineTo(p.x+s*1.3,p.y-s*1.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x+s*1.2,p.y-s*0.2); ctx.lineTo(p.x+s*1.4,p.y-s*1.1); ctx.stroke();
  for(var rng=1;rng<4;rng++){
    ctx.beginPath(); ctx.moveTo(p.x+s*1.1+rng*s*0.07,p.y-s*rng*0.28); ctx.lineTo(p.x+s*1.25+rng*s*0.04,p.y-s*rng*0.28); ctx.stroke();
  }

  hitAreas.van={x:p.x,y:p.y-s*0.8,r:s*1.1};
  drawLabel(p.x, p.y+s*0.35, label);
}

/* WORKSHOP (Projects) */
function drawWorkshop(angleDeg, r, label){
  var p=project(angleDeg,r,0.05);
  var R=Math.min(W,H)*SCALE, s=R*0.09;
  var wc=isDark?"#5060a8":C.islandD, wd=isDark?"#3848a0":C.islandDark;

  /* Main building */
  poly([{x:p.x-s*1.2,y:p.y},{x:p.x+s*0.6,y:p.y},{x:p.x+s*0.6,y:p.y-s*1.3},{x:p.x-s*1.2,y:p.y-s*1.3}],
    isDark?"#c06030":C.orange);
  /* Roof */
  poly([{x:p.x-s*1.35,y:p.y-s*1.3},{x:p.x+s*0.75,y:p.y-s*1.3},{x:p.x+s*0.75,y:p.y-s*1.55},{x:p.x-s*1.35,y:p.y-s*1.55}],wc);
  /* Side scaffold */
  ctx.strokeStyle=isDark?"#666":"#888"; ctx.lineWidth=1.5;
  for(var sc=0;sc<3;sc++){
    ctx.beginPath(); ctx.moveTo(p.x+s*0.6,p.y-s*sc*0.45); ctx.lineTo(p.x+s*1.1,p.y-s*sc*0.45-s*0.1); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(p.x+s*0.65,p.y); ctx.lineTo(p.x+s*0.65,p.y-s*1.5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x+s*1.1,p.y-s*0.1); ctx.lineTo(p.x+s*1.1,p.y-s*1.5); ctx.stroke();
  /* Windows */
  ctx.fillStyle="rgba(200,230,255,0.55)";
  for(var w2=0;w2<3;w2++) ctx.fillRect(p.x-s*(0.9-w2*0.55),p.y-s*0.9,s*0.3,s*0.35);
  /* Gear icon */
  ctx.fillStyle=isDark?"#6878c0":C.treeM;
  ctx.font=(s*0.55)+"px serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText("⚙", p.x-s*0.3, p.y-s*0.45);

  hitAreas.workshop={x:p.x,y:p.y-s*0.9,r:s*1.1};
  drawLabel(p.x, p.y+s*0.2, label);
}

/* FLAG / MAILBOX (Contact) */
function drawFlag(angleDeg, r, label){
  var p=project(angleDeg,r,0.04);
  var R=Math.min(W,H)*SCALE, s=R*0.07;

  /* Post */
  ctx.strokeStyle=isDark?"#8090c0":"#6878a0"; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x,p.y-s*2.8); ctx.stroke();
  /* Flag */
  ctx.fillStyle=C.orange;
  poly([{x:p.x,y:p.y-s*2.8},{x:p.x+s*0.9,y:p.y-s*2.5},{x:p.x,y:p.y-s*2.2}],C.orange);
  /* @ symbol on flag */
  ctx.fillStyle="#fff"; ctx.font=(s*0.38)+"px sans-serif"; ctx.textAlign="left"; ctx.textBaseline="middle";
  ctx.fillText("@", p.x+s*0.15, p.y-s*2.5);
  /* Mailbox */
  var mb=isDark?"#4858b0":C.treeM;
  poly([{x:p.x-s*0.5,y:p.y-s*0.7},{x:p.x+s*0.5,y:p.y-s*0.7},{x:p.x+s*0.5,y:p.y-s*0.2},{x:p.x-s*0.5,y:p.y-s*0.2}],mb);
  /* Arch top */
  ctx.beginPath(); ctx.arc(p.x,p.y-s*0.7,s*0.5,Math.PI,0); ctx.fillStyle=mb; ctx.fill();
  /* Slit */
  ctx.fillStyle=isDark?"#2a3070":"#1a2040";
  ctx.fillRect(p.x-s*0.3, p.y-s*0.6, s*0.6, s*0.1);

  hitAreas.flag={x:p.x,y:p.y-s*1.2,r:s*0.9};
  drawLabel(p.x, p.y+s*0.3, label);
}

/* LABEL below objects */
function drawLabel(x,y,text){
  if(!text) return;
  ctx.font="bold "+(Math.min(W,H)*0.013)+"px 'Segoe UI',sans-serif";
  ctx.textAlign="center"; ctx.textBaseline="top";
  ctx.fillStyle=isDark?"rgba(180,200,240,0.85)":"rgba(50,60,100,0.85)";
  ctx.fillText(text, x, y+4);
}

/* CYCLIST character (animated, walks around path) */
function drawCyclist(){
  /* Cycles around the island base */
  var cycleAngle = (rotY*0.5 + t*18) % 360;
  var p=project(cycleAngle, 0.75, 0.0);
  var R=Math.min(W,H)*SCALE, s=R*0.045;

  /* Bike wheels */
  ctx.strokeStyle=isDark?"#888":"#444"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(p.x-s*0.45,p.y,s*0.26,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(p.x+s*0.45,p.y,s*0.26,0,Math.PI*2); ctx.stroke();
  /* Frame */
  ctx.strokeStyle=isDark?"#c06030":C.orange; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(p.x-s*0.45,p.y); ctx.lineTo(p.x,p.y-s*0.55);
  ctx.lineTo(p.x+s*0.45,p.y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x,p.y-s*0.55); ctx.lineTo(p.x+s*0.05,p.y); ctx.stroke();
  /* Rider body */
  ctx.fillStyle=isDark?"#e07040":C.orange;
  ctx.beginPath(); ctx.arc(p.x-s*0.05,p.y-s*0.85,s*0.22,0,Math.PI*2); ctx.fill();
  ctx.fillRect(p.x-s*0.2,p.y-s*0.65,s*0.4,s*0.35);
  /* Helmet */
  ctx.fillStyle=isDark?"#c05020":C.orangeD;
  ctx.beginPath(); ctx.arc(p.x-s*0.05,p.y-s*0.95,s*0.18,0,Math.PI*2); ctx.fill();
}

/* SPARKLE PARTICLES */
function drawParticles(){
  var R=Math.min(W,H)*SCALE;
  particles.forEach(function(p){
    var pp=project(p.angle, p.radius, 0.02);
    var bob=Math.sin(t*p.bobSpeed+p.bobY)*3;
    ctx.globalAlpha=p.alpha*(0.6+0.4*Math.sin(t*2+p.bobY));
    ctx.fillStyle=isDark?"rgba(180,210,255,0.9)":"rgba(255,255,255,0.95)";
    ctx.beginPath(); ctx.arc(pp.x, pp.y+bob, p.size*0.5, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  });
}

/* SMALL FIGURES walking around */
function drawFigures(){
  var figs=[{a:20,r:0.55},{a:145,r:0.65},{a:280,r:0.5}];
  figs.forEach(function(f,i){
    var angle=f.a + t*6*(i%2===0?1:-1);
    var p=project(angle, f.r, 0.0);
    var R=Math.min(W,H)*SCALE, s=R*0.022;
    /* Body */
    ctx.fillStyle=isDark?"#e07040":C.orange;
    ctx.fillRect(p.x-s*0.3, p.y-s*1.3, s*0.6, s*0.8);
    /* Head */
    ctx.beginPath(); ctx.arc(p.x,p.y-s*1.5,s*0.32,0,Math.PI*2);
    ctx.fillStyle=isDark?"#d8a880":"#e8c090"; ctx.fill();
    /* Legs walk */
    var legSwing=Math.sin(t*8+i)*s*0.4;
    ctx.fillStyle=isDark?"#2838a0":C.treeD;
    ctx.fillRect(p.x-s*0.25+legSwing*0.3, p.y-s*0.5, s*0.22, s*0.6);
    ctx.fillRect(p.x+s*0.03-legSwing*0.3, p.y-s*0.5, s*0.22, s*0.6);
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN DRAW
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function draw(){
  ctx.clearRect(0,0,W,H);
  hitAreas = {};

  drawSky();
  drawOcean();
  drawIsland();

  /* Place trees around the island */
  var treeData=[
    [10,0.55,1.1],[35,0.7,0.8],[65,0.5,1.2],[90,0.75,0.9],[120,0.48,1.3],
    [150,0.7,0.7],[175,0.52,1.0],[210,0.65,1.1],[240,0.55,0.9],[265,0.72,0.8],
    [295,0.5,1.2],[320,0.68,1.0],[345,0.6,0.85],
    [45,0.4,0.75],[135,0.38,0.9],[225,0.42,0.8],[315,0.36,1.0],
  ];

  /* Sort all draw calls by depth (painter's algorithm) */
  var drawCalls=[];

  treeData.forEach(function(td){
    var p=project(td[0],td[1],0);
    drawCalls.push({depth:p.depth, fn: (function(a,r,sf){ return function(){ drawTree(a,r,sf); }; })(td[0],td[1],td[2])});
  });

  /* Buildings at fixed angles matching section rotations */
  var objDefs=[
    {key:"house",    a:0,   r:0.38, fn:drawHouse,    label:"Intro"},
    {key:"cabin",    a:60,  r:0.45, fn:drawCabin,    label:"About"},
    {key:"tower",    a:120, r:0.35, fn:drawTower,    label:"Skills"},
    {key:"van",      a:180, r:0.48, fn:drawVan,      label:"Experience"},
    {key:"workshop", a:240, r:0.40, fn:drawWorkshop, label:"Projects"},
    {key:"flag",     a:300, r:0.42, fn:drawFlag,     label:"Contact"},
  ];

  objDefs.forEach(function(obj){
    var p=project(obj.a,obj.r,0.08);
    drawCalls.push({depth:p.depth, fn:(function(od){ return function(){ od.fn(od.a,od.r,od.label); }; })(obj)});
  });

  /* Sort by depth (furthest first) */
  drawCalls.sort(function(a,b){ return b.depth-a.depth; });
  drawCalls.forEach(function(dc){ dc.fn(); });

  drawParticles();
  drawFigures();
  drawCyclist();
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMATION LOOP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function loop(ts){
  requestAnimationFrame(loop);
  t = ts * 0.001;

  /* Smooth rotation */
  if(!isDragging){
    velX *= 0.92; /* inertia */
    rotY += velX;
  }
  /* Keep rotY in 0-360 */
  rotY = ((rotY % 360) + 360) % 360;

  /* Auto-detect which section we're facing */
  updateCurrentSection();

  draw();
}

function updateCurrentSection(){
  /* Find which section angle is closest to front (rotY ≈ section.angle) */
  var best=0, bestDiff=999;
  SECTIONS.forEach(function(sec,i){
    var diff = Math.abs(((sec.angle-rotY)%360+360)%360);
    if(diff>180) diff=360-diff;
    if(diff<bestDiff){ bestDiff=diff; best=i; }
  });
  if(best!==currentSection){
    currentSection=best;
    updateDotsAndStory();
  }
}

function updateDotsAndStory(){
  document.querySelectorAll(".dot").forEach(function(d,i){ d.classList.toggle("active",i===currentSection); });
  var stEl=document.getElementById("story-text");
  var sec=SECTIONS[currentSection];
  stEl.textContent=sec.story;
  stEl.classList.add("visible");
  clearTimeout(updateDotsAndStory._timer);
  updateDotsAndStory._timer=setTimeout(function(){ stEl.classList.remove("visible"); },3500);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EVENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function setupEvents(){
  /* Mouse drag */
  document.addEventListener("mousedown",function(e){
    if(cardOpen||e.target.closest("#card,#menu,#brand,#menu-btn,#section-dots,#dark-btn,#drag-hint")) return;
    isDragging=true; lastX=e.clientX;
    document.body.classList.add("grabbing");
  });
  document.addEventListener("mousemove",function(e){
    if(!isDragging) return;
    var dx=e.clientX-lastX;
    velX = dx*0.4;
    rotY+=dx*0.35;
    lastX=e.clientX;
    if(Math.abs(dx)>3 && !dragged){
      dragged=true;
      document.getElementById("drag-hint").classList.add("gone");
    }
  });
  document.addEventListener("mouseup",function(e){
    isDragging=false;
    document.body.classList.remove("grabbing");
  });

  /* Touch drag */
  var touchStartX=0;
  document.addEventListener("touchstart",function(e){
    if(cardOpen) return;
    touchStartX=e.touches[0].clientX;
    isDragging=true;
  },{passive:true});
  document.addEventListener("touchmove",function(e){
    if(!isDragging||cardOpen) return;
    var dx=e.touches[0].clientX-touchStartX;
    velX=dx*0.3; rotY+=dx*0.3;
    touchStartX=e.touches[0].clientX;
    if(Math.abs(dx)>5&&!dragged){ dragged=true; document.getElementById("drag-hint").classList.add("gone"); }
  },{passive:true});
  document.addEventListener("touchend",function(){ isDragging=false; });

  /* Click on objects */
  document.getElementById("c").style.pointerEvents="none"; /* canvas doesn't capture clicks */
  document.addEventListener("click",function(e){
    if(cardOpen||e.target.closest("#card,#menu,#menu-btn,#section-dots,#dark-btn")) return;
    var cx=e.clientX, cy=e.clientY;
    /* Check hit areas */
    for(var key in hitAreas){
      var ha=hitAreas[key];
      var dx=cx-ha.x, dy=cy-ha.y;
      if(dx*dx+dy*dy<ha.r*ha.r){
        /* Find matching section */
        var match=null;
        SECTIONS.forEach(function(s){ if(s.objKey===key) match=s; });
        if(match){ openCard(match); return; }
      }
    }
  });

  /* Scroll to rotate */
  document.addEventListener("wheel",function(e){
    if(cardOpen) return;
    rotY+=e.deltaY*0.15;
    velX=0;
    if(!dragged){ dragged=true; document.getElementById("drag-hint").classList.add("gone"); }
  },{passive:true});

  /* Keyboard */
  document.addEventListener("keydown",function(e){
    if(e.key==="ArrowLeft"){ velX=-4; }
    if(e.key==="ArrowRight"){ velX=4; }
    if(e.key==="Escape"){ closeCard(); toggleMenu(true); }
    var n=parseInt(e.key); if(n>=1&&n<=6) goTo(n-1);
  });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CARD / POPUP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function openCard(sec){
  document.getElementById("card-icon").textContent=sec.icon;
  document.getElementById("card-title").textContent=sec.title;
  document.getElementById("card-body").innerHTML=sec.body;
  document.getElementById("card-foot").innerHTML=sec.foot||"";
  document.getElementById("card").classList.remove("hidden");
  cardOpen=true;
}
function closeCard(){
  document.getElementById("card").classList.add("hidden");
  cardOpen=false;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAVIGATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function goTo(idx){
  if(idx<0||idx>=SECTIONS.length) return;
  var targetAngle=SECTIONS[idx].angle;
  /* Smoothly rotate to that angle */
  var diff=((targetAngle-rotY)%360+360)%360;
  if(diff>180) diff-=360;
  velX=diff*0.06;
  currentSection=idx;
  updateDotsAndStory();
  /* Auto-open card after rotation settles */
  clearTimeout(goTo._t);
  goTo._t=setTimeout(function(){ openCard(SECTIONS[idx]); },600);
  if(!dragged){ dragged=true; document.getElementById("drag-hint").classList.add("gone"); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MENU
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function toggleMenu(forceClose){
  var m=document.getElementById("menu");
  if(forceClose||!m.classList.contains("hidden")){ m.classList.add("hidden"); }
  else { m.classList.remove("hidden"); }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DARK MODE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function toggleDark(){
  isDark=!isDark;
  document.body.classList.toggle("dark",isDark);
  document.getElementById("dark-btn").textContent=isDark?"☀":"☾";
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LOADING
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function(){
  var fill=document.getElementById("ld-fill");
  var msg=document.getElementById("ld-msg");
  var msgs=["Building your world…","Placing trees…","Painting the island…","Animating characters…","Opening the gate…"];
  var pct=0,mi=0;
  var iv=setInterval(function(){
    pct+=Math.random()*22+8; if(pct>100) pct=100;
    fill.style.width=pct+"%";
    if(pct>(mi+1)*18&&mi<msgs.length-1) msg.textContent=msgs[++mi];
    if(pct>=100){
      clearInterval(iv);
      msg.textContent="✅ World ready!";
      setTimeout(function(){
        var ld=document.getElementById("loading");
        ld.style.opacity="0";
        setTimeout(function(){ ld.style.display="none"; init(); },800);
      },400);
    }
  },110);
})();

console.log(
  "%c🌍 SUMEDH'S WORLD%c\n%cDrag to rotate · Click objects to explore · Press 1-6 for sections",
  "color:#3a5ae0;font-size:18px;font-weight:900;",
  "","color:#6a8ab0;font-size:12px;"
);
