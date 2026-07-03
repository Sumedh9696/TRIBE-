/* ================================================================
   SUMEDH PATHE — 3D Minecraft Portfolio · script.js
   Three.js r128 · Clean rebuild
   ================================================================ */
"use strict";

/* ── GLOBALS ── */
var renderer, scene, camera, clock;
var keys = {}, mouseDX = 0, mouseDY = 0;
var isDragging = false, lastMouseX = 0, lastMouseY = 0;
var yaw = 0, pitch = 0;
var paused = false;
var nearBuilding = null, panelOpen = false;
var velY = 0, onGround = true;
var playerX = 0, playerZ = 8;
var playerGroup = null;
var isThirdPerson = true;
var TP_DIST = 8, TP_HEIGHT = 4;
var CAM_SPEED = 0.12, CAM_HEIGHT = 2.2;
var GRAVITY = 0.006, JUMP_V = 0.14;
var buildingMeshes = [];
var mmCanvas, mmCtx;
var minimapVisible = true;
var MM_SIZE = 180, MM_MIN = -90, MM_MAX = 90;

/* ── BUILDING DATA ── */
var BUILDINGS = [
  {
    id:"spawn", label:"Sumedh's Home", icon:"🏠", title:"Welcome — Sumedh Pathe",
    pos:{x:0,z:0}, color:0x5b8a32, roofColor:0x8b5e3c, height:5,
    html:"<h3>👋 Hey there!</h3><p>I'm <b style='color:#f5c518'>Sumedh Pathe</b>, a B.E. CS student at Anuradha College of Engineering (2027).</p><p style='margin-top:.5rem'>Specialising in full-stack web dev and AI-integrated apps.</p><p style='margin-top:.5rem'>📍 Buldana, Maharashtra<br>✉️ sumedhpatthe2005@gmail.com<br>🐙 github.com/Sumedh9696</p>"
  },
  {
    id:"about", label:"About Hall", icon:"📜", title:"About Sumedh",
    pos:{x:-22,z:-18}, color:0x1a4b8c, roofColor:0x4de6e6, height:6,
    html:"<h3>🎓 Education</h3><p><b style='color:#f5c518'>B.E. Computer Science Engineering</b></p><p>Anuradha College of Engineering &amp; Technology</p><p>July 2023 – May 2027 · Chikhli, Maharashtra</p><h3>📚 Coursework</h3><ul><li>Data Structures &amp; Algorithms</li><li>Artificial Intelligence</li><li>Web Development</li><li>OS · DBMS · OOP · Cyber Security</li></ul><h3>🌍 Languages</h3><p>English (Fluent) · Hindi (Native) · Marathi (Native)</p>"
  },
  {
    id:"skills", label:"Skill Tower", icon:"⚔️", title:"Skill Tree",
    pos:{x:22,z:-18}, color:0x7a1515, roofColor:0xff3a3a, height:10,
    html:"<h3>🎨 Frontend</h3><p><span class='tag'>HTML5</span><span class='tag'>CSS3</span><span class='tag'>JavaScript ES6+</span><span class='tag'>React.js</span><span class='tag'>Tailwind CSS</span></p><h3>⚙️ Backend</h3><p><span class='tag'>Node.js</span><span class='tag'>Express.js</span><span class='tag'>REST API</span><span class='tag'>Python</span><span class='tag'>MySQL</span><span class='tag'>MongoDB</span><span class='tag'>Firebase</span></p><h3>🧠 Soft Skills</h3><p><span class='tag'>Communication</span><span class='tag'>Critical Thinking</span><span class='tag'>Collaboration</span></p>"
  },
  {
    id:"projects", label:"Neutrichef Tower", icon:"🍎", title:"Neutrichef — AI Nutrition",
    pos:{x:-10,z:-36}, color:0xa0622a, roofColor:0xf5c518, height:7,
    html:"<h3>🍎 Neutrichef (Ongoing)</h3><p><span class='tag'>React.js</span><span class='tag'>Python</span><span class='tag'>REST APIs</span><span class='tag'>Tailwind CSS</span></p><p style='margin-top:.5rem'>AI-driven nutrition platform with personalised recipe recommendations and macro-level nutritional analysis.</p><ul style='margin-top:.4rem'><li>Scalable React.js component structure, mobile-first UI</li><li>Third-party nutrition APIs for real-time dietary data</li><li>Python backend for AI inference and user modelling</li></ul>"
  },
  {
    id:"projects2", label:"NutriGuide Ext", icon:"🔌", title:"NutriGuide — Chrome Extension",
    pos:{x:10,z:-36}, color:0x2d6a2d, roofColor:0x6abf30, height:8,
    html:"<h3>🔌 NutriGuide (2025)</h3><p><span class='tag'>JavaScript</span><span class='tag'>Chrome Extensions API</span><span class='tag'>REST API</span><span class='tag'>CSS3</span></p><p style='margin-top:.5rem'>Chrome browser extension providing instant nutritional info while browsing food websites.</p><ul style='margin-top:.4rem'><li>Content scripts detect food-related page context</li><li>AI-powered insights in a non-intrusive popup UI</li></ul>"
  },
  {
    id:"yonex", label:"Yonex Clone", icon:"🏸", title:"Yonex Website Clone",
    pos:{x:0,z:-50}, color:0x3a3a6e, roofColor:0x4de6e6, height:6,
    html:"<h3>🏸 Yonex Clone (2025)</h3><p><span class='tag'>HTML5</span><span class='tag'>CSS3</span><span class='tag'>JavaScript</span><span class='tag'>Responsive Design</span></p><p style='margin-top:.5rem'>Pixel-accurate clone of the Yonex sports brand website — product layout, navigation, responsive grid.</p><ul style='margin-top:.4rem'><li>CSS precision &amp; cross-browser compatibility</li><li>Performance optimisation with semantic HTML</li></ul>"
  },
  {
    id:"intern", label:"Internship HQ", icon:"💼", title:"3Skill.in — Web Dev Intern",
    pos:{x:-28,z:0}, color:0x6e4e1a, roofColor:0xf5c518, height:9,
    html:"<h3>💼 Web Development Intern</h3><p><b style='color:#f5c518'>3Skill.in · Remote · Ongoing</b></p><ul style='margin-top:.5rem'><li>Building &amp; maintaining web apps with React.js and Tailwind CSS</li><li>UI development, responsive design, REST API integration</li><li>Version control with Git and agile practices</li></ul>"
  },
  {
    id:"contact", label:"Post Office", icon:"📬", title:"Contact Sumedh",
    pos:{x:28,z:0}, color:0x8b1a1a, roofColor:0xff6060, height:5,
    html:"<h3>📬 Get in Touch</h3><p>Open to internships, collaborations, and opportunities!</p><p style='margin-top:.6rem'>✉️ <a href='mailto:sumedhpatthe2005@gmail.com' style='color:#4de6e6'>sumedhpatthe2005@gmail.com</a><br>📞 +91 87938 96929<br>🐙 <a href='https://github.com/Sumedh9696' target='_blank' style='color:#4de6e6'>github.com/Sumedh9696</a></p><h3 style='margin-top:.7rem'>🏅 Certificate</h3><p>HTML &amp; CSS Workshop (2024)</p><h3 style='margin-top:.7rem'>🎯 Interests</h3><p><span class='tag'>Open Source</span><span class='tag'>Hackathons</span><span class='tag'>UI/UX</span><span class='tag'>AI Products</span></p>"
  }
];

var TELEPORT_SPOTS = {
  spawn:    {x:0,   z:8,   yaw:Math.PI},
  about:    {x:-22, z:-10, yaw:Math.PI*1.2},
  skills:   {x:22,  z:-10, yaw:Math.PI*0.8},
  projects: {x:-10, z:-28, yaw:Math.PI},
  intern:   {x:-20, z:8,   yaw:Math.PI*0.5},
  contact:  {x:20,  z:8,   yaw:Math.PI*1.5}
};

/* ================================================================
   LOADING SCREEN
   ================================================================ */
(function() {
  var bar = document.getElementById("ls-bar");
  var msg = document.getElementById("ls-msg");
  var msgs = ["Generating terrain…","Placing grass blocks…","Building portfolio city…","Spawning entities…","Lighting torches…","Opening world…"];
  var pct = 0, mi = 0;
  var iv = setInterval(function() {
    pct += Math.random() * 18 + 5;
    if (pct > 100) pct = 100;
    bar.style.width = pct + "%";
    if (pct > (mi+1)*16 && mi < msgs.length-1) msg.textContent = msgs[++mi];
    if (pct >= 100) {
      clearInterval(iv);
      msg.textContent = "✅ World ready!";
      setTimeout(function() {
        var ls = document.getElementById("loading-screen");
        ls.classList.add("out");
        setTimeout(function() { ls.remove(); initWorld(); }, 700);
      }, 500);
    }
  }, 140);
})();

/* ================================================================
   INIT WORLD
   ================================================================ */
function initWorld() {
  var canvas = document.getElementById("world-canvas");
  clock = new THREE.Clock();

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x87ceeb, 1);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87ceeb, 40, 120);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 300);
  camera.position.set(0, CAM_HEIGHT + TP_HEIGHT, 8 + TP_DIST);

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  scene.add(new THREE.HemisphereLight(0x87ceeb, 0x5b8a32, 0.45));
  var sun = new THREE.DirectionalLight(0xfffbe0, 1.0);
  sun.position.set(30, 60, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.width = sun.shadow.mapSize.height = 1024;
  sun.shadow.camera.left = sun.shadow.camera.bottom = -80;
  sun.shadow.camera.right = sun.shadow.camera.top = 80;
  sun.shadow.camera.far = 200;
  scene.add(sun);

  buildGround(); buildBuildings(); buildPark(); buildStadium();
  buildForest(); buildPathways(); buildDecorations(); buildSkybox();
  buildPlayerCharacter();

  mmCanvas = document.getElementById("minimap-canvas");
  if (mmCanvas) mmCtx = mmCanvas.getContext("2d");

  setupControls();
  window.addEventListener("resize", onResize);
  animate();
  showToast("🌍 Welcome to Sumedh's World! Use WASD to walk.");
}

/* ================================================================
   BLOCK HELPERS
   ================================================================ */
function makeBlock(w, h, d, color) {
  var m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color: color })
  );
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function solidBlock(w, h, d, color) {
  var m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshPhongMaterial({ color: color, shininess: 0, flatShading: true })
  );
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

/* ================================================================
   GROUND
   ================================================================ */
function buildGround() {
  var g = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshLambertMaterial({ color: 0x5b8a32 })
  );
  g.rotation.x = -Math.PI/2; g.receiveShadow = true;
  scene.add(g);
  var grid = new THREE.GridHelper(200, 100, 0x3a6020, 0x3a6020);
  grid.material.opacity = 0.1; grid.material.transparent = true;
  scene.add(grid);
}

/* ================================================================
   BUILDINGS
   ================================================================ */
function buildBuildings() {
  BUILDINGS.forEach(function(b) {
    var grp = new THREE.Group();
    grp.position.set(b.pos.x, 0, b.pos.z);
    var W=7, D=7, H=b.height;

    var found = makeBlock(W+1, 0.4, D+1, 0x7a7a7a);
    found.position.set(0, 0.2, 0); grp.add(found);

    var walls = makeBlock(W, H, D, b.color);
    walls.position.set(0, H/2+0.4, 0); grp.add(walls);

    var edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.22, transparent: true });
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(walls.geometry), edgeMat);
    edges.position.copy(walls.position); grp.add(edges);

    for (var row=1; row<=Math.floor(H/2)-1; row++) {
      [-1,1].forEach(function(col) {
        var wc = Math.random()>0.3 ? 0xffe08a : 0x4de6e6;
        var win = new THREE.Mesh(
          new THREE.BoxGeometry(1.4, 1, 0.15),
          new THREE.MeshLambertMaterial({ color: wc, emissive: wc, emissiveIntensity: 0.35 })
        );
        win.position.set(col*2, row*2+1, D/2+0.08); grp.add(win);
        var winB = win.clone(); winB.position.z = -(D/2+0.08); grp.add(winB);
      });
    }

    var door = makeBlock(1.6, 2.2, 0.15, 0x5c3a1e);
    door.position.set(0, 1.5, D/2+0.08); grp.add(door);

    var roof = new THREE.Mesh(
      new THREE.ConeGeometry(W*0.75, H*0.4, 4),
      new THREE.MeshLambertMaterial({ color: b.roofColor })
    );
    roof.rotation.y = Math.PI/4;
    roof.position.set(0, H+0.4+H*0.2, 0);
    roof.castShadow = true; grp.add(roof);

    buildSign(grp, b.label, D/2+0.5, H*0.35+0.4);

    [-2.5, 2.5].forEach(function(ox) {
      var stick = makeBlock(0.12, 0.5, 0.12, 0x5c3a1e);
      stick.position.set(ox, 0.65, D/2+0.3); grp.add(stick);
      var fire = new THREE.Mesh(
        new THREE.BoxGeometry(0.18,0.18,0.18),
        new THREE.MeshLambertMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 1 })
      );
      fire.position.set(ox, 0.94, D/2+0.3); grp.add(fire);
      var pl = new THREE.PointLight(0xff8822, 0.7, 8);
      pl.position.set(ox, 1.4, D/2+0.3); grp.add(pl);
    });

    scene.add(grp);
    buildingMeshes.push({ data: b, worldPos: new THREE.Vector3(b.pos.x, 0, b.pos.z) });
  });
}

function buildSign(parent, text, zOff, yPos) {
  var post = makeBlock(0.15, 2, 0.15, 0x5c3a1e);
  post.position.set(0, yPos-0.5, zOff+0.5); parent.add(post);
  var board = makeBlock(5, 0.7, 0.15, 0x8b5e3c);
  board.position.set(0, yPos+0.8, zOff+0.5); parent.add(board);

  var c = document.createElement("canvas");
  c.width = 256; c.height = 40;
  var cx = c.getContext("2d");
  cx.fillStyle = "#5c3a1e"; cx.fillRect(0,0,256,40);
  cx.fillStyle = "#f5c518"; cx.font = "bold 11px monospace";
  cx.textAlign = "center"; cx.textBaseline = "middle";
  var lbl = text.length > 18 ? text.slice(0,16)+"…" : text;
  cx.fillText(lbl, 128, 20);
  var face = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.7, 0.02),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })
  );
  face.position.set(0, yPos+0.8, zOff+0.58); parent.add(face);
}

/* ================================================================
   PARK
   ================================================================ */
function buildPark() {
  var PX=-50, PZ=-20;
  var patch = makeBlock(30, 0.3, 30, 0x3d7a20);
  patch.position.set(PX, 0.15, PZ); scene.add(patch);
  var pond = new THREE.Mesh(new THREE.CircleGeometry(5,12), new THREE.MeshLambertMaterial({ color: 0x1a6ea8 }));
  pond.rotation.x = -Math.PI/2; pond.position.set(PX, 0.32, PZ); scene.add(pond);
  [[-8,-8],[-8,8],[8,-8],[8,8],[0,-12],[0,12],[-12,0],[12,0]].forEach(function(p) { buildTree(PX+p[0], PZ+p[1]); });
}

function buildTree(x, z) {
  var trunk = makeBlock(0.6, 2.5, 0.6, 0x5c3a1e);
  trunk.position.set(x, 1.25, z); scene.add(trunk);
  [[2.5,1.2,2.5,0x2d6a2d],[2.0,1.0,2.0,0x3d8a3d],[1.4,1.0,1.4,0x4daa4d]].forEach(function(p, i) {
    var leaf = makeBlock(p[0], p[1], p[2], p[3]);
    leaf.position.set(x, 2.5+i*0.9, z); scene.add(leaf);
  });
}

/* ================================================================
   STADIUM
   ================================================================ */
function buildStadium() {
  var ring = new THREE.Mesh(new THREE.TorusGeometry(16, 3.5, 8, 24), new THREE.MeshLambertMaterial({ color: 0x8b8b6e }));
  ring.rotation.x = Math.PI/2; ring.position.set(0, 2, -60); ring.castShadow = true; scene.add(ring);
  var field = new THREE.Mesh(new THREE.CircleGeometry(12, 24), new THREE.MeshLambertMaterial({ color: 0x2d8a2d }));
  field.rotation.x = -Math.PI/2; field.position.set(0, 0.05, -60); scene.add(field);
}

/* ================================================================
   FOREST
   ================================================================ */
function buildForest() {
  for (var i=0; i<45; i++) buildTree(-65+Math.random()*25, Math.random()*80-40);
}

/* ================================================================
   PATHWAYS + LAMPS
   ================================================================ */
function buildPathways() {
  [{x:0,z:0,w:80,d:3},{x:0,z:-30,w:3,d:60},{x:-25,z:-18,w:3,d:40},{x:25,z:-18,w:3,d:40}].forEach(function(p) {
    var road = makeBlock(p.w, 0.1, p.d, 0x333333);
    road.position.set(p.x, 0.05, p.z); scene.add(road);
  });
  for (var x=-30; x<=30; x+=12) { buildLamp(x, 3); buildLamp(x, -3); }
}

function buildLamp(x, z) {
  var post = makeBlock(0.15, 4, 0.15, 0x555555); post.position.set(x, 2, z); scene.add(post);
  var arm = makeBlock(1.5, 0.12, 0.12, 0x555555); arm.position.set(x+0.75, 4, z); scene.add(arm);
  var bulb = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.4,0.4),
    new THREE.MeshLambertMaterial({ color: 0xffe08a, emissive: 0xffe08a, emissiveIntensity: 1 }));
  bulb.position.set(x+1.5, 3.9, z); scene.add(bulb);
  var pl = new THREE.PointLight(0xffe08a, 0.5, 10); pl.position.set(x+1.5, 3.8, z); scene.add(pl);
}

/* ================================================================
   DECORATIONS
   ================================================================ */
function buildDecorations() {
  /* Plaza */
  var plaza = makeBlock(14, 0.2, 14, 0x888888); plaza.position.set(0, 0.1, 0); scene.add(plaza);
  /* Corner pillars */
  [[-5,-5],[5,-5],[-5,5],[5,5]].forEach(function(p) {
    var pil = makeBlock(0.6, 2.5, 0.6, 0xaaaaaa); pil.position.set(p[0], 1.25, p[1]); scene.add(pil);
  });
  /* Well */
  buildWell(0, -5);
  /* City gate */
  buildCityGate(62, 0);
  /* Hero sign */
  buildHeroSign();
}

function buildWell(x, z) {
  var base = makeBlock(2.5, 0.5, 2.5, 0x888888); base.position.set(x, 0.25, z); scene.add(base);
  var water = makeBlock(1.6, 0.2, 1.6, 0x1a6ea8); water.material.opacity=0.8; water.material.transparent=true; water.position.set(x, 0.6, z); scene.add(water);
  [-0.8,0.8].forEach(function(ox) { var post=makeBlock(0.15,1.5,0.15,0x5c3a1e); post.position.set(x+ox,1.25,z); scene.add(post); });
  var beam = makeBlock(2.2, 0.2, 0.2, 0x5c3a1e); beam.position.set(x, 2.1, z); scene.add(beam);
}

function buildCityGate(x, z) {
  [-4,4].forEach(function(ox) { var p=makeBlock(2,8,2,0xc8b880); p.position.set(x+ox,4,z); scene.add(p); });
  var arch=makeBlock(10,2,2,0xb0a060); arch.position.set(x,8,z); scene.add(arch);
  var portal = new THREE.Mesh(new THREE.PlaneGeometry(6,7),
    new THREE.MeshBasicMaterial({ color:0x4444ff, opacity:0.18, transparent:true, side:THREE.DoubleSide }));
  portal.position.set(x,4,z); scene.add(portal);
}

function buildHeroSign() {
  var plat = makeBlock(18, 0.4, 4, 0x5c3a1e); plat.position.set(0, 10, -2); scene.add(plat);
  var c = document.createElement("canvas"); c.width=512; c.height=128;
  var cx = c.getContext("2d");
  cx.fillStyle="#1a1a2e"; cx.fillRect(0,0,512,128);
  cx.fillStyle="#f5c518"; cx.font="bold 34px monospace"; cx.textAlign="center"; cx.textBaseline="middle";
  cx.fillText("SUMEDH PATHE", 256, 44);
  cx.fillStyle="#4de6e6"; cx.font="18px monospace";
  cx.fillText("Web Developer & AI Enthusiast  •  github.com/Sumedh9696", 256, 90);
  var sign = new THREE.Mesh(new THREE.BoxGeometry(18,2.8,0.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }));
  sign.position.set(0, 9.4, -2); scene.add(sign);
  [-7,7].forEach(function(ox) { var ch=makeBlock(0.1,3,0.1,0x888888); ch.position.set(ox,8.5,-2); scene.add(ch); });
}

/* ================================================================
   SKYBOX — clouds + mountains + sun
   ================================================================ */
function buildSkybox() {
  [[-80,14,20],[-40,12,16],[0,10,18],[40,16,14],[80,13,22]].forEach(function(p) {
    var m=makeBlock(p[2],p[1],4,0x6a9a6a); m.position.set(p[0],p[1]/2,-100); scene.add(m);
  });
  for (var i=0; i<18; i++) buildCloud((Math.random()-0.5)*160, 20+Math.random()*10, (Math.random()-0.5)*160);
  var sun=new THREE.Mesh(new THREE.CircleGeometry(5,8), new THREE.MeshBasicMaterial({ color:0xfff8a0 }));
  sun.position.set(30,55,-90); sun.lookAt(0,0,0); scene.add(sun);
}

function buildCloud(x, y, z) {
  [[4,1.5,2,0],[3,1.5,2,-3],[2.5,1.2,2,3]].forEach(function(p) {
    var b=makeBlock(p[0],p[1],p[2],0xeeeeee); b.material.transparent=true; b.material.opacity=0.85;
    b.position.set(x+p[3],y,z); scene.add(b);
  });
}

/* ================================================================
   PLAYER CHARACTER — solid MeshPhong blocks
   ================================================================ */
function buildPlayerCharacter() {
  var g = new THREE.Group();
  g.name = "playerCharacter";
  var S = 1.4;

  /* HEAD */
  var head = solidBlock(0.9*S, 0.9*S, 0.9*S, 0xc79c6e); head.position.set(0, 2.05*S, 0); g.add(head);
  /* Eyes */
  var eyeL = solidBlock(0.22*S, 0.18*S, 0.08*S, 0x2a1508); eyeL.position.set(-0.18*S, 2.12*S, 0.47*S); g.add(eyeL);
  var eyeR = solidBlock(0.22*S, 0.18*S, 0.08*S, 0x2a1508); eyeR.position.set( 0.18*S, 2.12*S, 0.47*S); g.add(eyeR);
  /* Mouth */
  var mouth = solidBlock(0.3*S, 0.1*S, 0.06*S, 0x8b4513); mouth.position.set(0, 1.88*S, 0.47*S); g.add(mouth);
  /* Hair */
  var hair = solidBlock(0.96*S, 0.28*S, 0.96*S, 0x3a2008); hair.position.set(0, 2.6*S, 0); g.add(hair);
  /* TORSO */
  var torso = solidBlock(0.85*S, 0.9*S, 0.45*S, 0x2a5f9e); torso.position.set(0, 1.28*S, 0); g.add(torso);
  var belt  = solidBlock(0.86*S, 0.14*S, 0.47*S, 0x1a1a1a); belt.position.set(0, 0.84*S, 0); g.add(belt);
  /* ARMS */
  var armL = solidBlock(0.32*S, 0.82*S, 0.36*S, 0xc79c6e); armL.position.set(-0.62*S, 1.28*S, 0); g.add(armL);
  var armR = solidBlock(0.32*S, 0.82*S, 0.36*S, 0xc79c6e); armR.position.set( 0.62*S, 1.28*S, 0); g.add(armR);
  /* LEGS */
  var legL = solidBlock(0.36*S, 0.82*S, 0.38*S, 0x1e1e6e); legL.position.set(-0.22*S, 0.41*S, 0); g.add(legL);
  var legR = solidBlock(0.36*S, 0.82*S, 0.38*S, 0x1e1e6e); legR.position.set( 0.22*S, 0.41*S, 0); g.add(legR);
  /* BOOTS */
  var bL = solidBlock(0.37*S, 0.22*S, 0.44*S, 0x3a2010); bL.position.set(-0.22*S, 0, 0.03*S); g.add(bL);
  var bR = solidBlock(0.37*S, 0.22*S, 0.44*S, 0x3a2010); bR.position.set( 0.22*S, 0, 0.03*S); g.add(bR);
  /* PICKAXE */
  var pH = solidBlock(0.1*S, 0.9*S, 0.1*S, 0x5c3a1e); pH.position.set(0.95*S, 1.4*S, 0.18*S); pH.rotation.z=-0.5; g.add(pH);
  var pHd= solidBlock(0.6*S, 0.15*S,0.15*S, 0x999999); pHd.position.set(1.15*S,1.82*S,0.18*S); pHd.rotation.z=-0.5; g.add(pHd);
  /* NAME TAG */
  var tc=document.createElement("canvas"); tc.width=256; tc.height=48;
  var tx=tc.getContext("2d");
  tx.fillStyle="rgba(0,0,0,0.78)"; tx.fillRect(0,0,256,48);
  tx.fillStyle="#f5c518"; tx.font="bold 16px monospace"; tx.textAlign="center"; tx.textBaseline="middle";
  tx.fillText("SUMEDH", 128, 24);
  var tag=new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.5),
    new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(tc), transparent:true, depthTest:false, side:THREE.DoubleSide })
  );
  tag.position.set(0, 3.3*S, 0); tag.name="nameTag"; g.add(tag);

  g.position.set(playerX, 0, playerZ);
  g.visible = true; /* 3rd person is default */
  scene.add(g);
  playerGroup = g;
  g.userData.armL=armL; g.userData.armR=armR; g.userData.legL=legL; g.userData.legR=legR;
}

/* ================================================================
   CONTROLS
   ================================================================ */
function setupControls() {
  document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape") { e.preventDefault(); togglePause(); }
    if (e.key.toLowerCase() === "e" && !paused) nearBuilding ? openBuildingPanel(nearBuilding) : openResume();
    if (e.key.toLowerCase() === "r") openResume();
    if (e.key.toLowerCase() === "v") toggleCameraView();
    if (e.key.toLowerCase() === "m") toggleMinimap();
    if (e.key === " ") e.preventDefault();
  });
  document.addEventListener("keyup", function(e) { keys[e.key.toLowerCase()] = false; });

  var cv = renderer.domElement;
  cv.addEventListener("mousedown",  function(e) { isDragging=true; lastMouseX=e.clientX; lastMouseY=e.clientY; });
  window.addEventListener("mouseup", function() { isDragging=false; });
  window.addEventListener("mousemove", function(e) {
    if (!isDragging || paused) return;
    mouseDX += (e.clientX - lastMouseX) * 0.003;
    mouseDY += (e.clientY - lastMouseY) * 0.003;
    lastMouseX=e.clientX; lastMouseY=e.clientY;
  });

  var tx0=0, ty0=0;
  cv.addEventListener("touchstart",  function(e) { tx0=e.touches[0].clientX; ty0=e.touches[0].clientY; });
  cv.addEventListener("touchmove",   function(e) {
    if (paused) return;
    mouseDX += (e.touches[0].clientX-tx0)*0.004;
    mouseDY += (e.touches[0].clientY-ty0)*0.004;
    tx0=e.touches[0].clientX; ty0=e.touches[0].clientY;
  });
}

/* ================================================================
   ANIMATE LOOP
   ================================================================ */
function animate() {
  requestAnimationFrame(animate);
  if (paused) return;
  var t = clock.getElapsedTime();

  /* Rotation */
  yaw   -= mouseDX; pitch -= mouseDY;
  pitch  = Math.max(-0.55, Math.min(0.65, pitch));
  mouseDX = 0; mouseDY = 0;

  /* Movement */
  var fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  var rgt = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));
  var dir = new THREE.Vector3(), moving = false;
  if (keys["w"]||keys["arrowup"])    { dir.add(fwd); moving=true; }
  if (keys["s"]||keys["arrowdown"])  { dir.sub(fwd); moving=true; }
  if (keys["a"]||keys["arrowleft"])  { dir.sub(rgt); moving=true; }
  if (keys["d"]||keys["arrowright"]) { dir.add(rgt); moving=true; }
  if (dir.length()>0) dir.normalize().multiplyScalar(CAM_SPEED);
  playerX += dir.x; playerZ += dir.z;
  playerX = Math.max(-88, Math.min(88, playerX));
  playerZ = Math.max(-88, Math.min(88, playerZ));

  /* Gravity */
  if ((keys[" "]||keys["space"]) && onGround) { velY=JUMP_V; onGround=false; }
  velY -= GRAVITY;
  var pY = velY;
  if (pY <= 0) { pY=0; velY=0; onGround=true; }

  /* Player mesh */
  if (playerGroup) {
    playerGroup.visible = isThirdPerson;
    playerGroup.position.set(playerX, pY, playerZ);
    playerGroup.rotation.y = yaw + Math.PI;
    var tag = playerGroup.getObjectByName("nameTag");
    if (tag) tag.rotation.y = -(yaw + Math.PI);
    if (moving) {
      var sw = Math.sin(t*9)*0.45;
      if (playerGroup.userData.armL) playerGroup.userData.armL.rotation.x =  sw;
      if (playerGroup.userData.armR) playerGroup.userData.armR.rotation.x = -sw;
      if (playerGroup.userData.legL) playerGroup.userData.legL.rotation.x = -sw;
      if (playerGroup.userData.legR) playerGroup.userData.legR.rotation.x =  sw;
      playerGroup.position.y = pY + Math.abs(Math.sin(t*9))*0.06;
    } else {
      if (playerGroup.userData.armL) playerGroup.userData.armL.rotation.x *= 0.85;
      if (playerGroup.userData.armR) playerGroup.userData.armR.rotation.x *= 0.85;
      if (playerGroup.userData.legL) playerGroup.userData.legL.rotation.x *= 0.85;
      if (playerGroup.userData.legR) playerGroup.userData.legR.rotation.x *= 0.85;
    }
  }

  /* Camera */
  if (isThirdPerson) {
    var bx = playerX + Math.sin(yaw)*TP_DIST;
    var bz = playerZ + Math.cos(yaw)*TP_DIST;
    camera.position.set(bx, pY+CAM_HEIGHT+TP_HEIGHT, bz);
    camera.lookAt(new THREE.Vector3(playerX, pY+1.5, playerZ));
  } else {
    camera.position.set(playerX, pY+CAM_HEIGHT, playerZ);
    camera.rotation.order="YXZ"; camera.rotation.y=yaw; camera.rotation.x=pitch;
  }

  checkProximity();
  drawMinimap();
  updateHUDLoc();
  renderer.render(scene, camera);
}

/* ================================================================
   MINIMAP DRAW
   ================================================================ */
function worldToMM(wx, wz) {
  var range = MM_MAX - MM_MIN;
  return { px: ((wx-MM_MIN)/range)*MM_SIZE, py: ((wz-MM_MIN)/range)*MM_SIZE };
}

function fillZoneRect(ctx, wx1, wz1, wx2, wz2) {
  var a=worldToMM(wx1,wz1), b=worldToMM(wx2,wz2);
  ctx.fillRect(a.px, a.py, b.px-a.px, b.py-a.py);
}

function drawMinimap() {
  if (!mmCtx || !minimapVisible) return;
  var el=document.getElementById("mm-coords");
  if (el) el.textContent = "X:"+Math.round(playerX)+"  Z:"+Math.round(playerZ);

  var ctx=mmCtx, W=MM_SIZE, H=MM_SIZE;

  /* Background */
  ctx.fillStyle="#0e1f0a"; ctx.fillRect(0,0,W,H);

  /* Grid */
  ctx.strokeStyle="rgba(255,255,255,0.05)"; ctx.lineWidth=1;
  for (var gi=0; gi<=W; gi+=W/8) {
    ctx.beginPath(); ctx.moveTo(gi,0); ctx.lineTo(gi,H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,gi); ctx.lineTo(W,gi); ctx.stroke();
  }

  /* Zones */
  ctx.fillStyle="rgba(50,160,50,0.32)";   fillZoneRect(ctx,-68,-38,-34,-2);  /* park */
  ctx.fillStyle="rgba(15,70,15,0.5)";     fillZoneRect(ctx,-85,-40,-55,40);  /* forest */
  ctx.fillStyle="rgba(40,110,40,0.3)";    fillZoneRect(ctx,-20,-75,20,-48);  /* stadium */

  /* Roads */
  ctx.fillStyle="#484848";
  fillZoneRect(ctx,-42,-2,42,2);      /* horizontal */
  fillZoneRect(ctx,-2,-62,2,30);      /* vertical */
  fillZoneRect(ctx,-28,-28,-22,4);    /* left branch */
  fillZoneRect(ctx,22,-28,28,4);      /* right branch */

  /* Buildings — colored rectangles */
  BUILDINGS.forEach(function(b) {
    var pt=worldToMM(b.pos.x, b.pos.z), bw=14, bh=14;
    var r=(b.color>>16)&0xff, gv=(b.color>>8)&0xff, bv=b.color&0xff;
    ctx.fillStyle="rgb("+r+","+gv+","+bv+")";
    ctx.fillRect(pt.px-bw/2, pt.py-bh/2, bw, bh);
    var rr=(b.roofColor>>16)&0xff, rg=(b.roofColor>>8)&0xff, rb=b.roofColor&0xff;
    ctx.fillStyle="rgb("+rr+","+rg+","+rb+")";
    ctx.fillRect(pt.px-bw/2, pt.py-bh/2, bw, 4);
    ctx.strokeStyle="#f5c518"; ctx.lineWidth=1.5;
    ctx.strokeRect(pt.px-bw/2, pt.py-bh/2, bw, bh);
    ctx.font="10px serif"; ctx.textAlign="center"; ctx.textBaseline="top";
    ctx.fillStyle="#fff"; ctx.fillText(b.icon, pt.px, pt.py+bh/2+1);
  });

  /* RED DIRECTION ARROW
     yaw=0 → player faces -Z → UP on minimap (canvas rotation=0 points up)
     The arrow TIP is the NARROW head = forward direction = where player looks */
  var pp=worldToMM(playerX, playerZ);
  ctx.save();
  ctx.translate(pp.px, pp.py);
  ctx.rotate(yaw);  /* yaw directly maps: 0=north, π/2=east, π=south, 3π/2=west */
  ctx.shadowColor="#ff0000"; ctx.shadowBlur=12;
  ctx.fillStyle="#ff2222";
  ctx.beginPath();
  ctx.moveTo( 0,-13);   /* NARROW TIP = forward (player is looking this way) */
  ctx.lineTo(-6,  6);   /* back-left */
  ctx.lineTo(-2,  3);   /* inner notch left */
  ctx.lineTo( 0,  8);   /* tail center */
  ctx.lineTo( 2,  3);   /* inner notch right */
  ctx.lineTo( 6,  6);   /* back-right */
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur=0; ctx.strokeStyle="#ffffff"; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle="#ffffff";
  ctx.beginPath(); ctx.arc(0,0,2.5,0,Math.PI*2); ctx.fill();
  ctx.restore();

  /* Outer gold border */
  ctx.strokeStyle="#f5c518"; ctx.lineWidth=2.5;
  ctx.strokeRect(1,1,W-2,H-2);

  /* Compass */
  ctx.shadowBlur=0; ctx.font="bold 9px monospace"; ctx.fillStyle="#ffffff";
  ctx.textAlign="center"; ctx.textBaseline="top";    ctx.fillText("N",W/2,2);
  ctx.textBaseline="bottom"; ctx.fillText("S",W/2,H-1);
  ctx.textAlign="left";  ctx.textBaseline="middle"; ctx.fillText("W",3,H/2);
  ctx.textAlign="right";                             ctx.fillText("E",W-1,H/2);
}

/* ================================================================
   PROXIMITY CHECK
   ================================================================ */
function checkProximity() {
  var THRESH=9, closest=null, closestD=Infinity;
  var pp=new THREE.Vector3(playerX,0,playerZ);
  buildingMeshes.forEach(function(bm) {
    var d=pp.distanceTo(bm.worldPos);
    if (d<THRESH && d<closestD) { closestD=d; closest=bm.data; }
  });
  nearBuilding=closest;
  var prompt=document.getElementById("interact-prompt");
  if (!prompt) return;
  if (closest && !panelOpen) prompt.classList.remove("hidden");
  else prompt.classList.add("hidden");
}

/* ================================================================
   HUD LOCATION
   ================================================================ */
function updateHUDLoc() {
  var x=Math.round(playerX), z=Math.round(playerZ), zone="📍 Open World";
  if (Math.abs(x)<10 && Math.abs(z)<10)  zone="🏠 Spawn Plaza";
  else if (x<-18 && Math.abs(z)<12)      zone="💼 Internship HQ";
  else if (x>18  && Math.abs(z)<12)      zone="📬 Post Office";
  else if (x<-18 && z<-12)              zone="📜 About Hall";
  else if (x>18  && z<-12)              zone="⚔️ Skill Tower";
  else if (Math.abs(x)<20 && z<-30)     zone="🏗️ Project City";
  else if (x<-40)                       zone="🌲 Forest";
  else if (z<-50)                       zone="🏟️ Stadium";
  var el=document.getElementById("hud-loc"); if (el) el.textContent=zone;
}

/* ================================================================
   PANELS & MODALS
   ================================================================ */
function openBuildingPanel(bdata) {
  panelOpen=true;
  document.getElementById("ip-icon").textContent  = bdata.icon;
  document.getElementById("ip-title").textContent = bdata.title;
  document.getElementById("ip-body").innerHTML    = bdata.html;
  var btn=document.getElementById("ip-btn");
  if (btn) btn.onclick=function() { closePanel(); openResume(); };
  document.getElementById("info-panel").classList.remove("hidden");
  document.getElementById("interact-prompt").classList.add("hidden");
}
function closePanel() {
  panelOpen=false;
  document.getElementById("info-panel").classList.add("hidden");
}
function openResume()  { document.getElementById("resume-modal").classList.remove("hidden"); }
function closeResume() { document.getElementById("resume-modal").classList.add("hidden"); }
function togglePause() {
  paused=!paused;
  var pm=document.getElementById("pause-menu");
  if (pm) paused ? pm.classList.remove("hidden") : pm.classList.add("hidden");
}
function resumeGame() {
  paused=false;
  var pm=document.getElementById("pause-menu"); if (pm) pm.classList.add("hidden");
}

/* ================================================================
   TELEPORT
   ================================================================ */
function teleport(zone) {
  var spot=TELEPORT_SPOTS[zone]; if (!spot) return;
  playerX=spot.x; playerZ=spot.z;
  yaw=spot.yaw||0; pitch=0; velY=0; onGround=true;
  closePanel(); resumeGame();
  showToast("🚀 Teleported to "+zone.charAt(0).toUpperCase()+zone.slice(1));
  document.querySelectorAll(".hb-slot").forEach(function(s){ s.classList.remove("active"); });
  var idx=["spawn","about","skills","projects","intern","contact"].indexOf(zone);
  var slots=document.querySelectorAll(".hb-slot"); if (idx>=0&&slots[idx]) slots[idx].classList.add("active");
  setTimeout(function() {
    var match=BUILDINGS.find(function(b){ return b.id===zone; });
    if (match) openBuildingPanel(match);
  }, 600);
}

/* ================================================================
   VIEW + MINIMAP TOGGLES
   ================================================================ */
function toggleCameraView() {
  isThirdPerson=!isThirdPerson;
  document.getElementById("view-label").textContent    = isThirdPerson ? "👁️ 3RD" : "👁️ 1ST";
  document.getElementById("crosshair").style.display   = isThirdPerson ? "none" : "block";
  if (playerGroup) playerGroup.visible = isThirdPerson;
  showToast(isThirdPerson ? "🎮 Third-Person View" : "👁️ First-Person View");
}

function toggleMinimap() {
  minimapVisible=!minimapVisible;
  var wrap=document.getElementById("minimap-wrap");
  var btn=document.getElementById("map-btn");
  if (minimapVisible) { wrap.classList.remove("hidden"); btn.classList.add("hidden"); }
  else                { wrap.classList.add("hidden");    btn.classList.remove("hidden"); }
}

/* ================================================================
   TOAST + RESIZE
   ================================================================ */
function showToast(msg, dur) {
  dur=dur||2800; var t=document.getElementById("toast"); if (!t) return;
  t.textContent=msg; t.classList.add("show");
  setTimeout(function(){ t.classList.remove("show"); }, dur);
}
function onResize() {
  if (!camera||!renderer) return;
  camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ================================================================
   KONAMI EASTER EGG
   ================================================================ */
(function(){
  var code=["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"], idx=0;
  document.addEventListener("keydown",function(e){
    if(e.key.toLowerCase()===code[idx]){ if(++idx===code.length){ idx=0; showToast("🎮 CHEAT CODE! Night mode!",3000); if(renderer) renderer.setClearColor(0x050810,1); if(scene) scene.fog=new THREE.Fog(0x050810,20,80); } } else idx=0;
  });
})();

console.log("%c⛏️ SUMEDH PATHE — 3D Portfolio World\n%csumedhpatthe2005@gmail.com · github.com/Sumedh9696","color:#f5c518;font-size:16px;font-weight:bold;","color:#4de6e6;font-size:12px;");
