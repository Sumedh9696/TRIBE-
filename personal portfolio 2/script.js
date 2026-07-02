/* ================================================================
   SUMEDH PATHE — 3D Minecraft Portfolio World
   script.js  |  Three.js r128
   ================================================================ */
"use strict";

/* ────────────────────────────────────────────────────────────────
   0.  GLOBAL STATE
──────────────────────────────────────────────────────────────── */
let renderer, scene, camera;
let keys = {};
let mouseDX = 0, mouseDY = 0;
let isDragging = false, lastX = 0, lastY = 0;
let yaw = 0, pitch = 0;
let paused = false;
let nearBuilding = null;
let panelOpen = false;
let clock;

const CAM_SPEED   = 0.12;
const CAM_HEIGHT  = 2.2;
const GRAVITY     = 0.006;
const JUMP_V      = 0.14;
let velY = 0, onGround = true;

/* ── Third-person & minimap ── */
let isThirdPerson = false;
const TP_DIST   = 8;
const TP_HEIGHT = 4;
let playerGroup = null;
let mmCanvas, mmCtx;
let playerX = 0, playerZ = 8;  // world XZ (camera tracks this)

/* ────────────────────────────────────────────────────────────────
   1.  RESUME DATA (from Sumedh's actual resume)
──────────────────────────────────────────────────────────────── */
const SUMEDH = {
  name: "Sumedh Pathe",
  title: "Web Developer & AI Enthusiast",
  email: "sumedhpatthe2005@gmail.com",
  phone: "+91 87938 96929",
  location: "Buldana, Maharashtra",
  github: "github.com/Sumedh9696",
};

const BUILDINGS = [
  {
    id: "spawn",
    label: "🏠 Sumedh's Home",
    pos: { x: 0, z: 0 },
    color: 0x5b8a32,
    roofColor: 0x8b5e3c,
    height: 5,
    icon: "🏠",
    title: "Welcome — Sumedh Pathe",
    html: `
      <h3>👋 Hey there!</h3>
      <p>I'm <strong style="color:#f5c518">Sumedh Pathe</strong>, a B.E. Computer Science student
      at Anuradha College of Engineering & Technology (2027).</p>
      <p style="margin-top:.5rem">Specialising in full-stack web development and AI-integrated applications.
      Passionate about clean code, great user experiences, and continuous learning.</p>
      <p style="margin-top:.5rem">📍 Buldana, Maharashtra<br>
      ✉️ sumedhpatthe2005@gmail.com<br>
      🐙 github.com/Sumedh9696</p>
    `,
  },
  {
    id: "about",
    label: "📜 About Building",
    pos: { x: -22, z: -18 },
    color: 0x1a4b8c,
    roofColor: 0x4de6e6,
    height: 6,
    icon: "📜",
    title: "About Sumedh",
    html: `
      <h3>🎓 Education Quest</h3>
      <p><strong style="color:#f5c518">B.E. Computer Science Engineering</strong></p>
      <p>Anuradha College of Engineering & Technology</p>
      <p>July 2023 – May 2027 · Chikhli, Maharashtra</p>
      <h3>📚 Coursework</h3>
      <ul>
        <li>Data Structures & Algorithms</li>
        <li>Artificial Intelligence</li>
        <li>Web Development</li>
        <li>Operating Systems · DBMS · OOP</li>
        <li>Cyber Security</li>
      </ul>
      <h3>🌍 Languages</h3>
      <p>English (Fluent) · Hindi (Native) · Marathi (Native)</p>
    `,
  },
  {
    id: "skills",
    label: "⚔️ Skill Tower",
    pos: { x: 22, z: -18 },
    color: 0x7a1515,
    roofColor: 0xff3a3a,
    height: 10,
    icon: "⚔️",
    title: "Skill Tree",
    html: `
      <h3>🎨 Frontend Arsenal</h3>
      <p>
        <span class="tag">HTML5</span><span class="tag">CSS3</span>
        <span class="tag">JavaScript ES6+</span><span class="tag">React.js</span>
        <span class="tag">Tailwind CSS</span><span class="tag">Responsive Design</span>
      </p>
      <h3>⚙️ Backend Dungeon</h3>
      <p>
        <span class="tag">Node.js</span><span class="tag">Express.js</span>
        <span class="tag">REST API</span><span class="tag">Python</span>
        <span class="tag">MySQL</span><span class="tag">MongoDB</span>
        <span class="tag">Firebase</span>
      </p>
      <h3>🧠 Soft Skills</h3>
      <p>
        <span class="tag">Communication</span><span class="tag">Critical Thinking</span>
        <span class="tag">Collaboration</span><span class="tag">Adaptability</span>
      </p>
    `,
  },
  {
    id: "projects",
    label: "🏗️ Project City",
    pos: { x: -10, z: -36 },
    color: 0xa0622a,
    roofColor: 0xf5c518,
    height: 7,
    icon: "🍎",
    title: "Neutrichef — AI Nutrition Platform",
    html: `
      <h3>🍎 Neutrichef (Ongoing)</h3>
      <p>
        <span class="tag">React.js</span><span class="tag">Python</span>
        <span class="tag">REST APIs</span><span class="tag">Tailwind CSS</span>
      </p>
      <p style="margin-top:.5rem">AI-driven nutrition platform delivering personalised recipe recommendations and macro-level nutritional analysis tailored to individual health goals.</p>
      <ul style="margin-top:.5rem">
        <li>Scalable React.js component structure with mobile-first UI</li>
        <li>Connected third-party nutrition APIs for real-time dietary data</li>
        <li>Python backend for AI inference and user preference modelling</li>
      </ul>
    `,
  },
  {
    id: "projects2",
    label: "🔌 NutriGuide Tower",
    pos: { x: 10, z: -36 },
    color: 0x2d6a2d,
    roofColor: 0x6abf30,
    height: 8,
    icon: "🔌",
    title: "NutriGuide — Chrome Extension",
    html: `
      <h3>🔌 NutriGuide Browser Extension (2025)</h3>
      <p>
        <span class="tag">JavaScript</span><span class="tag">Chrome Extensions API</span>
        <span class="tag">REST API</span><span class="tag">CSS3</span>
      </p>
      <p style="margin-top:.5rem">Chrome browser extension providing instant nutritional information and healthy meal suggestions while browsing food or recipe websites.</p>
      <ul style="margin-top:.5rem">
        <li>Content scripts detect food-related page context</li>
        <li>AI-powered insights in a non-intrusive popup UI</li>
      </ul>
    `,
  },
  {
    id: "yonex",
    label: "🏸 Yonex Building",
    pos: { x: 0, z: -50 },
    color: 0x3a3a6e,
    roofColor: 0x4de6e6,
    height: 6,
    icon: "🏸",
    title: "Yonex Website Clone",
    html: `
      <h3>🏸 Yonex Website Clone (2025)</h3>
      <p>
        <span class="tag">HTML5</span><span class="tag">CSS3</span>
        <span class="tag">JavaScript</span><span class="tag">Responsive Design</span>
      </p>
      <p style="margin-top:.5rem">Pixel-accurate clone of the Yonex sports brand website, replicating product layout, navigation, and responsive grid system from scratch.</p>
      <ul style="margin-top:.5rem">
        <li>CSS precision & cross-browser compatibility</li>
        <li>Performance optimisation with semantic HTML</li>
        <li>Minimal asset footprint</li>
      </ul>
    `,
  },
  {
    id: "intern",
    label: "💼 Internship HQ",
    pos: { x: -28, z: 0 },
    color: 0x6e4e1a,
    roofColor: 0xf5c518,
    height: 9,
    icon: "💼",
    title: "3Skill.in — Web Dev Intern",
    html: `
      <h3>💼 Web Development Intern</h3>
      <p><strong style="color:#f5c518">3Skill.in · Remote · Ongoing</strong></p>
      <ul style="margin-top:.5rem">
        <li>Building & maintaining web applications using React.js and Tailwind CSS</li>
        <li>Collaborating on UI development and responsive design implementation</li>
        <li>REST API integration across frontend components</li>
        <li>Version control with Git and agile practices</li>
        <li>Hands-on real-world development workflow experience</li>
      </ul>
    `,
  },
  {
    id: "contact",
    label: "📬 Post Office",
    pos: { x: 28, z: 0 },
    color: 0x8b1a1a,
    roofColor: 0xff6060,
    height: 5,
    icon: "📬",
    title: "Contact Sumedh",
    html: `
      <h3>📬 Send a Message</h3>
      <p>I'm open to internships, collaborations, and full-time opportunities!</p>
      <p style="margin-top:.6rem">
        ✉️ <a href="mailto:sumedhpatthe2005@gmail.com" style="color:#4de6e6">sumedhpatthe2005@gmail.com</a><br>
        📞 +91 87938 96929<br>
        🐙 <a href="https://github.com/Sumedh9696" target="_blank" style="color:#4de6e6">github.com/Sumedh9696</a><br>
        📍 Buldana, Maharashtra
      </p>
      <h3 style="margin-top:.7rem">🏅 Certificate</h3>
      <p>HTML & CSS Workshop Certification (2024)</p>
      <h3 style="margin-top:.7rem">🎯 Interests</h3>
      <p>
        <span class="tag">Open Source</span><span class="tag">Hackathons</span>
        <span class="tag">UI/UX Design</span><span class="tag">AI Product Dev</span>
      </p>
    `,
  },
];

/* Map from zone id → camera position */
const TELEPORT_SPOTS = {
  spawn:    { x: 0,   y: CAM_HEIGHT, z: 8,   yaw: Math.PI },
  about:    { x: -22, y: CAM_HEIGHT, z: -10, yaw: Math.PI * 1.2 },
  skills:   { x: 22,  y: CAM_HEIGHT, z: -10, yaw: Math.PI * 0.8 },
  projects: { x: -10, y: CAM_HEIGHT, z: -28, yaw: Math.PI },
  intern:   { x: -20, y: CAM_HEIGHT, z: 8,   yaw: Math.PI * 0.5 },
  contact:  { x: 20,  y: CAM_HEIGHT, z: 8,   yaw: Math.PI * 1.5 },
};

/* ────────────────────────────────────────────────────────────────
   2.  LOADING SCREEN
──────────────────────────────────────────────────────────────── */
(function runLoader() {
  const bar = document.getElementById("ls-bar");
  const msg = document.getElementById("ls-msg");
  const msgs = [
    "Generating terrain…",
    "Placing grass blocks…",
    "Building portfolio city…",
    "Spawning entities…",
    "Lighting torches…",
    "Opening world…",
  ];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 20 + 6;
    if (pct > 100) pct = 100;
    bar.style.width = pct + "%";
    if (pct > (mi + 1) * 16 && mi < msgs.length - 1) msg.textContent = msgs[++mi];
    if (pct >= 100) {
      clearInterval(iv);
      msg.textContent = "✅ World ready!";
      setTimeout(() => {
        const ls = document.getElementById("loading-screen");
        ls.classList.add("out");
        setTimeout(() => ls.remove(), 800);
        initWorld();
      }, 600);
    }
  }, 150);
})();

/* ────────────────────────────────────────────────────────────────
   3.  THREE.JS WORLD INIT
──────────────────────────────────────────────────────────────── */
function initWorld() {
  const canvas = document.getElementById("world-canvas");
  clock = new THREE.Clock();

  /* ── RENDERER ── */
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x87ceeb, 1); // Minecraft sky blue

  /* ── SCENE ── */
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87ceeb, 40, 120);

  /* ── CAMERA ── */
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, CAM_HEIGHT, 8);

  /* ── LIGHTS ── */
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfffbe0, 1.1);
  sun.position.set(30, 60, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 200;
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  scene.add(sun);

  /* ── WORLD GEOMETRY ── */
  buildGround();
  buildBuildings();
  buildPark();
  buildStadium();
  buildForest();
  buildPathways();
  buildDecorations();
  buildSkybox();
  buildPlayerCharacter();  // ← player mesh
  initMinimap();           // ← minimap canvas

  /* ── EVENTS ── */
  window.addEventListener("resize", onResize);
  setupControls();

  /* ── START LOOP ── */
  animate();

  showToast("🌍 Welcome to Sumedh's World! Walk around to explore.");
}

/* ────────────────────────────────────────────────────────────────
   4.  VOXEL HELPER — draw a single block
──────────────────────────────────────────────────────────────── */
function makeBlock(w, h, d, color, rx = 0, ry = 0, rz = 0) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.rotation.set(rx, ry, rz);
  return mesh;
}

function placeBlock(color, x, y, z, w = 1, h = 1, d = 1) {
  const b = makeBlock(w, h, d, color);
  b.position.set(x, y, z);
  scene.add(b);
  return b;
}

/* ────────────────────────────────────────────────────────────────
   5.  GROUND — Grass + dirt border + stone paths
──────────────────────────────────────────────────────────────── */
function buildGround() {
  /* Main grass plane */
  const grassGeo = new THREE.PlaneGeometry(200, 200, 40, 40);
  const grassMat = new THREE.MeshLambertMaterial({ color: 0x5b8a32 });
  const grass = new THREE.Mesh(grassGeo, grassMat);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  scene.add(grass);

  /* Grid lines (pixel feel) */
  const gridHelper = new THREE.GridHelper(200, 100, 0x3a6020, 0x3a6020);
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
}

/* ────────────────────────────────────────────────────────────────
   6.  BUILD ALL BUILDINGS
──────────────────────────────────────────────────────────────── */
const buildingMeshes = []; // for proximity detection

function buildBuildings() {
  BUILDINGS.forEach(b => {
    const group = new THREE.Group();
    group.position.set(b.pos.x, 0, b.pos.z);
    group.userData = { buildingId: b.id };

    const W = 7, D = 7, H = b.height;

    /* Foundation — stone */
    const foundation = makeBlock(W + 1, 0.4, D + 1, 0x7a7a7a);
    foundation.position.set(0, 0.2, 0);
    group.add(foundation);

    /* Walls */
    const wallMat = new THREE.MeshLambertMaterial({ color: b.color });
    const wallGeo = new THREE.BoxGeometry(W, H, D);
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.set(0, H / 2 + 0.4, 0);
    walls.castShadow = true; walls.receiveShadow = true;
    group.add(walls);

    /* Dark edge detail lines (pixel aesthetic) */
    const edgeGeo = new THREE.EdgesGeometry(wallGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.copy(walls.position);
    group.add(edges);

    /* Window rows */
    for (let row = 1; row <= Math.floor(H / 2) - 1; row++) {
      for (let col = -1; col <= 1; col += 2) {
        const winGeo = new THREE.BoxGeometry(1.4, 1, 0.15);
        const winMat = new THREE.MeshLambertMaterial({
          color: Math.random() > 0.3 ? 0xffe08a : 0x4de6e6,
          emissive: Math.random() > 0.3 ? 0xffe08a : 0x4de6e6,
          emissiveIntensity: 0.4,
        });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(col * 2, row * 2 + 1, D / 2 + 0.08);
        group.add(win);
        // Back windows
        const winB = win.clone();
        winB.position.z = -(D / 2 + 0.08);
        group.add(winB);
      }
    }

    /* Door */
    const doorGeo = new THREE.BoxGeometry(1.6, 2.2, 0.15);
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1e });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 1.5, D / 2 + 0.08);
    group.add(door);

    /* Roof — pyramid style */
    const roofGeo = new THREE.ConeGeometry(W * 0.75, H * 0.4, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: b.roofColor });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.set(0, H + 0.4 + H * 0.2, 0);
    roof.castShadow = true;
    group.add(roof);

    /* Sign — floating label */
    buildSign(group, b.label, D / 2 + 0.5, H * 0.35 + 0.4);

    /* Torch lights */
    [-2.5, 2.5].forEach(ox => {
      const torch = buildTorch(ox, 0.4, D / 2 + 0.3);
      group.add(torch);
      const ptLight = new THREE.PointLight(0xff8822, 0.8, 8);
      ptLight.position.set(ox, 1.5, D / 2 + 0.3);
      group.add(ptLight);
    });

    scene.add(group);
    buildingMeshes.push({ group, data: b, worldPos: new THREE.Vector3(b.pos.x, 0, b.pos.z) });
  });
}

function buildSign(parent, text, zOffset, yPos) {
  /* Sign post */
  const post = makeBlock(0.15, 2, 0.15, 0x5c3a1e);
  post.position.set(0, yPos - 0.5, zOffset + 0.5);
  parent.add(post);

  /* Sign board */
  const board = makeBlock(5, 0.7, 0.15, 0x8b5e3c);
  board.position.set(0, yPos + 0.8, zOffset + 0.5);
  parent.add(board);

  /* Canvas texture with text */
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 40;
  const ctx2 = canvas.getContext("2d");
  ctx2.fillStyle = "#5c3a1e";
  ctx2.fillRect(0, 0, 256, 40);
  ctx2.fillStyle = "#f5c518";
  ctx2.font = "bold 13px 'Press Start 2P', monospace";
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";
  // Shorten label if needed
  let label = text.replace(/🏠|📜|⚔️|🏗️|🔌|🏸|💼|📬|🍎/g, "").trim();
  if (label.length > 16) label = label.slice(0, 14) + "…";
  ctx2.fillText(label, 128, 20);
  const tex = new THREE.CanvasTexture(canvas);
  const signFace = makeBlock(5, 0.7, 0.02, 0xffffff);
  signFace.material = new THREE.MeshBasicMaterial({ map: tex });
  signFace.position.set(0, yPos + 0.8, zOffset + 0.58);
  parent.add(signFace);
}

function buildTorch(x, y, z) {
  const g = new THREE.Group();
  const stick = makeBlock(0.12, 0.5, 0.12, 0x5c3a1e);
  stick.position.set(x, y + 0.25, z);
  g.add(stick);
  const fire = makeBlock(0.18, 0.18, 0.18, 0xff6600);
  fire.material.emissive = new THREE.Color(0xff4400);
  fire.material.emissiveIntensity = 1;
  fire.position.set(x, y + 0.54, z);
  g.add(fire);
  return g;
}

/* ────────────────────────────────────────────────────────────────
   7.  PARK (top-left area, matching city map)
──────────────────────────────────────────────────────────────── */
function buildPark() {
  const PX = -50, PZ = -20;

  /* Grass patch */
  const patch = makeBlock(30, 0.3, 30, 0x3d7a20);
  patch.position.set(PX, 0.15, PZ);
  scene.add(patch);

  /* Pond */
  const pondGeo = new THREE.CircleGeometry(5, 12);
  const pondMat = new THREE.MeshLambertMaterial({ color: 0x1a6ea8 });
  const pond = new THREE.Mesh(pondGeo, pondMat);
  pond.rotation.x = -Math.PI / 2;
  pond.position.set(PX, 0.32, PZ);
  scene.add(pond);

  /* Trees around park */
  const treeSpots = [
    [-8,-8],[-8,8],[8,-8],[8,8],[0,-12],[0,12],[-12,0],[12,0],
    [-6,0],[6,0],[0,-6],[0,6],
  ];
  treeSpots.forEach(([ox, oz]) => buildTree(PX + ox, PZ + oz));

  /* Bench */
  buildBench(PX + 6, PZ - 5);
  buildBench(PX - 6, PZ + 5);

  /* Park sign */
  const psign = makeBlock(5, 0.6, 0.15, 0x5c3a1e);
  psign.position.set(PX, 1.5, PZ + 16);
  scene.add(psign);
}

function buildTree(x, z) {
  /* Trunk */
  const trunk = makeBlock(0.6, 2.5, 0.6, 0x5c3a1e);
  trunk.position.set(x, 1.25, z);
  scene.add(trunk);
  /* Foliage — 3 stacked decreasing boxes */
  [[2.5, 1.2, 2.5],[2.0, 1.0, 2.0],[1.4, 1.0, 1.4]].forEach(([fw, fh, fd], i) => {
    const leaf = makeBlock(fw, fh, fd, i === 0 ? 0x2d6a2d : i === 1 ? 0x3d8a3d : 0x4daa4d);
    leaf.position.set(x, 2.5 + i * 0.9, z);
    scene.add(leaf);
  });
}

function buildBench(x, z) {
  const seat = makeBlock(2, 0.15, 0.6, 0x8b5e3c);
  seat.position.set(x, 0.6, z);
  scene.add(seat);
  [-0.7, 0.7].forEach(ox => {
    const leg = makeBlock(0.15, 0.6, 0.6, 0x5c3a1e);
    leg.position.set(x + ox, 0.3, z);
    scene.add(leg);
  });
}

/* ────────────────────────────────────────────────────────────────
   8.  STADIUM (top-center, matching city map)
──────────────────────────────────────────────────────────────── */
function buildStadium() {
  const SX = 0, SZ = -60;

  /* Stadium outer ring */
  const ringGeo = new THREE.TorusGeometry(16, 3.5, 8, 24);
  const ringMat = new THREE.MeshLambertMaterial({ color: 0x8b8b6e });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(SX, 2, SZ);
  ring.castShadow = true;
  scene.add(ring);

  /* Field */
  const fieldGeo = new THREE.CircleGeometry(12, 24);
  const fieldMat = new THREE.MeshLambertMaterial({ color: 0x2d8a2d });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.rotation.x = -Math.PI / 2;
  field.position.set(SX, 0.05, SZ);
  scene.add(field);

  /* Field markings */
  const lineGeo = new THREE.PlaneGeometry(0.3, 22);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const vline = new THREE.Mesh(lineGeo, lineMat);
  vline.rotation.x = -Math.PI / 2;
  vline.position.set(SX, 0.06, SZ);
  scene.add(vline);
  const hline = vline.clone();
  hline.rotation.z = Math.PI / 2;
  hline.position.set(SX, 0.06, SZ);
  scene.add(hline);

  /* Stadium label */
  const sl = makeBlock(10, 0.5, 0.2, 0x8b8b6e);
  sl.position.set(SX, 5.5, SZ - 20);
  scene.add(sl);
}

/* ────────────────────────────────────────────────────────────────
   9.  FOREST (left side)
──────────────────────────────────────────────────────────────── */
function buildForest() {
  for (let i = 0; i < 40; i++) {
    const x = -60 + Math.random() * 20 - 10;
    const z = 10 + Math.random() * 60 - 30;
    buildTree(x, z);
  }
  /* Dense left edge */
  for (let i = 0; i < 20; i++) {
    buildTree(-70 + Math.random() * 15, Math.random() * 100 - 50);
  }
}

/* ────────────────────────────────────────────────────────────────
   10. PATHWAYS (neon-lit roads matching city map)
──────────────────────────────────────────────────────────────── */
function buildPathways() {
  const paths = [
    /* Main horizontal road */
    { x: 0, z: 0, w: 80, d: 3 },
    /* Vertical spine */
    { x: 0, z: -30, w: 3, d: 60 },
    /* Side roads */
    { x: -25, z: -18, w: 3, d: 40 },
    { x: 25, z: -18, w: 3, d: 40 },
  ];

  paths.forEach(p => {
    const road = makeBlock(p.w, 0.1, p.d, 0x333333);
    road.position.set(p.x, 0.05, p.z);
    scene.add(road);
  });

  /* Street lamps along main road */
  for (let x = -30; x <= 30; x += 12) {
    buildStreetLamp(x, 1);
    buildStreetLamp(x, -1);
  }
}

function buildStreetLamp(x, zOff) {
  const z = zOff * 3;
  const post = makeBlock(0.15, 4, 0.15, 0x555555);
  post.position.set(x, 2, z);
  scene.add(post);
  const arm = makeBlock(1.5, 0.12, 0.12, 0x555555);
  arm.position.set(x + 0.75, 4, z);
  scene.add(arm);
  const light = makeBlock(0.4, 0.4, 0.4, 0xffe08a);
  light.material.emissive = new THREE.Color(0xffe08a);
  light.material.emissiveIntensity = 1;
  light.position.set(x + 1.5, 3.9, z);
  scene.add(light);
  const pl = new THREE.PointLight(0xffe08a, 0.5, 10);
  pl.position.set(x + 1.5, 3.8, z);
  scene.add(pl);
}

/* ────────────────────────────────────────────────────────────────
   11. DECORATIONS — floating portal, well, etc.
──────────────────────────────────────────────────────────────── */
function buildDecorations() {
  /* CITY GATE (right side, matching map) */
  buildCityGate(60, 0);

  /* Central spawn plaza */
  const plaza = makeBlock(14, 0.2, 14, 0x888888);
  plaza.position.set(0, 0.1, 0);
  scene.add(plaza);

  /* Well at center */
  buildWell(0, -5);

  /* Corner pillars on plaza */
  [[-5,-5],[5,-5],[-5,5],[5,5]].forEach(([ox,oz]) => {
    const pillar = makeBlock(0.6, 2.5, 0.6, 0xaaaaaa);
    pillar.position.set(ox, 1.25, oz);
    scene.add(pillar);
    const cap = makeBlock(1, 0.3, 1, 0x888888);
    cap.position.set(ox, 2.65, oz);
    scene.add(cap);
  });

  /* Floating name sign above spawn */
  buildHeroSign();
}

function buildCityGate(x, z) {
  /* Two pillars */
  [-4, 4].forEach(ox => {
    const pillar = makeBlock(2, 8, 2, 0xc8b880);
    pillar.position.set(x + ox, 4, z);
    scene.add(pillar);
  });
  /* Arch top */
  const arch = makeBlock(10, 2, 2, 0xb0a060);
  arch.position.set(x, 8, z);
  scene.add(arch);
  /* Gate sign */
  const gsign = makeBlock(8, 1, 0.2, 0x5c3a1e);
  gsign.position.set(x, 9.5, z);
  scene.add(gsign);
  /* Blue portal glow between pillars */
  const portalGeo = new THREE.PlaneGeometry(6, 7);
  const portalMat = new THREE.MeshBasicMaterial({
    color: 0x4444ff, opacity: 0.18, transparent: true, side: THREE.DoubleSide
  });
  const portal = new THREE.Mesh(portalGeo, portalMat);
  portal.position.set(x, 4, z);
  scene.add(portal);
}

function buildWell(x, z) {
  /* Base ring */
  const base = makeBlock(2.5, 0.5, 2.5, 0x888888);
  base.position.set(x, 0.25, z);
  scene.add(base);
  /* Water */
  const water = makeBlock(1.6, 0.2, 1.6, 0x1a6ea8);
  water.material.opacity = 0.8; water.material.transparent = true;
  water.position.set(x, 0.6, z);
  scene.add(water);
  /* Two posts */
  [-0.8, 0.8].forEach(ox => {
    const post = makeBlock(0.15, 1.5, 0.15, 0x5c3a1e);
    post.position.set(x + ox, 1.25, z);
    scene.add(post);
  });
  /* Roof beam */
  const beam = makeBlock(2.2, 0.2, 0.2, 0x5c3a1e);
  beam.position.set(x, 2.1, z);
  scene.add(beam);
}

function buildHeroSign() {
  /* Floating platform */
  const platform = makeBlock(18, 0.4, 4, 0x5c3a1e);
  platform.position.set(0, 10, -2);
  scene.add(platform);

  /* Golden accent bar */
  const bar = makeBlock(18, 0.25, 0.25, 0xf5c518);
  bar.material.emissive = new THREE.Color(0xf5c518);
  bar.material.emissiveIntensity = 0.5;
  bar.position.set(0, 10.45, -2);
  scene.add(bar);

  /* Name canvas */
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 128;
  const ctx2 = canvas.getContext("2d");
  ctx2.fillStyle = "#1a1a2e";
  ctx2.fillRect(0, 0, 512, 128);
  ctx2.fillStyle = "#f5c518";
  ctx2.font = "bold 36px 'Press Start 2P', monospace";
  ctx2.textAlign = "center";
  ctx2.textBaseline = "middle";
  ctx2.fillText("SUMEDH PATHE", 256, 44);
  ctx2.fillStyle = "#4de6e6";
  ctx2.font = "18px 'VT323', monospace";
  ctx2.fillText("Web Developer & AI Enthusiast  •  github.com/Sumedh9696", 256, 90);
  const tex = new THREE.CanvasTexture(canvas);
  const signMesh = makeBlock(18, 2.8, 0.1, 0xffffff);
  signMesh.material = new THREE.MeshBasicMaterial({ map: tex });
  signMesh.position.set(0, 9.4, -2);
  scene.add(signMesh);

  /* Support chains */
  [-7, 7].forEach(ox => {
    const chain = makeBlock(0.1, 3, 0.1, 0x888888);
    chain.position.set(ox, 8.5, -2);
    scene.add(chain);
  });
}

/* ────────────────────────────────────────────────────────────────
   12. SKYBOX — gradient sky + clouds + sun
──────────────────────────────────────────────────────────────── */
function buildSkybox() {
  /* Distant mountain silhouettes */
  [
    [-80, 0, -100, 20, 14],
    [-40, 0, -100, 16, 12],
    [0, 0, -100, 18, 10],
    [40, 0, -100, 14, 16],
    [80, 0, -100, 22, 13],
  ].forEach(([x, y, z, w, h]) => {
    const m = makeBlock(w, h, 4, 0x6a9a6a);
    m.position.set(x, h / 2, z);
    scene.add(m);
  });

  /* Clouds */
  for (let i = 0; i < 20; i++) {
    buildCloud(
      (Math.random() - 0.5) * 160,
      20 + Math.random() * 10,
      (Math.random() - 0.5) * 160
    );
  }

  /* Sun disc */
  const sunGeo = new THREE.CircleGeometry(5, 8);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfff8a0 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(30, 55, -90);
  sun.lookAt(0, 0, 0);
  scene.add(sun);
}

function buildCloud(x, y, z) {
  const sizes = [[4,1.5,2],[3,1.5,2],[2.5,1.2,2]];
  const offsets = [[0,0,0],[-3,0.3,0],[3,0.3,0]];
  sizes.forEach((s, i) => {
    const b = makeBlock(...s, 0xf0f0f0);
    b.material.opacity = 0.85; b.material.transparent = true;
    b.position.set(x + offsets[i][0], y + offsets[i][1], z + offsets[i][2]);
    b.castShadow = false;
    scene.add(b);
  });
}

/* ────────────────────────────────────────────────────────────────
   12b. PLAYER CHARACTER (Minecraft-style CSS-art in 3D blocks)
──────────────────────────────────────────────────────────────── */
function buildPlayerCharacter() {
  const g = new THREE.Group();
  g.name = "playerCharacter";

  // HEAD
  const head = makeBlock(0.7, 0.7, 0.7, 0xc79c6e);
  head.position.set(0, 1.55, 0);
  // Eyes (darker face detail)
  const eyeL = makeBlock(0.18, 0.15, 0.05, 0x3a2010);
  eyeL.position.set(-0.15, 1.62, 0.36);
  const eyeR = makeBlock(0.18, 0.15, 0.05, 0x3a2010);
  eyeR.position.set( 0.15, 1.62, 0.36);
  g.add(head, eyeL, eyeR);

  // HAIR / HELMET top
  const helmet = makeBlock(0.76, 0.2, 0.76, 0x4a3010);
  helmet.position.set(0, 1.97, 0);
  g.add(helmet);

  // TORSO (blue shirt)
  const torso = makeBlock(0.62, 0.72, 0.34, 0x3a6b9f);
  torso.position.set(0, 0.97, 0);
  // Belt
  const belt = makeBlock(0.62, 0.1, 0.36, 0x2a2a2a);
  belt.position.set(0, 0.62, 0);
  g.add(torso, belt);

  // ARMS
  const armL = makeBlock(0.25, 0.65, 0.28, 0xc79c6e);
  armL.position.set(-0.45, 0.97, 0);
  const armR = makeBlock(0.25, 0.65, 0.28, 0xc79c6e);
  armR.position.set( 0.45, 0.97, 0);
  g.add(armL, armR);

  // LEGS (dark blue pants)
  const legL = makeBlock(0.27, 0.7, 0.3, 0x2a2a7a);
  legL.position.set(-0.17, 0.35, 0);
  const legR = makeBlock(0.27, 0.7, 0.3, 0x2a2a7a);
  legR.position.set( 0.17, 0.35, 0);
  g.add(legL, legR);

  // FEET / boots
  const bootL = makeBlock(0.28, 0.18, 0.34, 0x3a2010);
  bootL.position.set(-0.17, 0.0, 0.02);
  const bootR = makeBlock(0.28, 0.18, 0.34, 0x3a2010);
  bootR.position.set( 0.17, 0.0, 0.02);
  g.add(bootL, bootR);

  // PICKAXE in right hand
  const pHandle = makeBlock(0.08, 0.7, 0.08, 0x5c3a1e);
  pHandle.position.set(0.72, 1.1, 0.15);
  pHandle.rotation.z = -0.4;
  const pHead = makeBlock(0.5, 0.12, 0.12, 0x888888);
  pHead.position.set(0.88, 1.44, 0.15);
  pHead.rotation.z = -0.4;
  g.add(pHandle, pHead);

  // NAME TAG floating above head
  const tagCanvas = document.createElement("canvas");
  tagCanvas.width = 256; tagCanvas.height = 40;
  const tc = tagCanvas.getContext("2d");
  tc.fillStyle = "rgba(0,0,0,0.7)";
  tc.fillRect(0, 0, 256, 40);
  tc.fillStyle = "#f5c518";
  tc.font = "bold 14px 'Press Start 2P', monospace";
  tc.textAlign = "center"; tc.textBaseline = "middle";
  tc.fillText("SUMEDH", 128, 20);
  const tagTex = new THREE.CanvasTexture(tagCanvas);
  const tagMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.28),
    new THREE.MeshBasicMaterial({ map: tagTex, transparent: true, depthTest: false })
  );
  tagMesh.position.set(0, 2.4, 0);
  tagMesh.name = "nameTag";
  g.add(tagMesh);

  g.position.set(playerX, 0, playerZ);
  scene.add(g);
  playerGroup = g;

  // Store arm/leg refs for walking animation
  playerGroup.userData.armL = armL;
  playerGroup.userData.armR = armR;
  playerGroup.userData.legL = legL;
  playerGroup.userData.legR = legR;
  playerGroup.userData.pHandle = pHandle;
  playerGroup.userData.pHead = pHead;

  return g;
}

/* ────────────────────────────────────────────────────────────────
   12c. MINIMAP
──────────────────────────────────────────────────────────────── */
function initMinimap() {
  mmCanvas = document.getElementById("minimap-canvas");
  mmCtx    = mmCanvas.getContext("2d");
}

// World extents for minimap projection
const MM_WORLD_MIN = -90;
const MM_WORLD_MAX =  90;
const MM_SIZE = 160;

function worldToMM(wx, wz) {
  const range = MM_WORLD_MAX - MM_WORLD_MIN;
  const px = ((wx - MM_WORLD_MIN) / range) * MM_SIZE;
  const py = ((wz - MM_WORLD_MIN) / range) * MM_SIZE;
  return { px, py };
}

function drawMinimap() {
  if (!mmCtx || !minimapVisible) return;
  // Update coords label
  const coordEl = document.getElementById("mm-coords");
  if (coordEl) coordEl.textContent = `X:${Math.round(playerX)}  Z:${Math.round(playerZ)}`;
  const ctx = mmCtx;
  const W = MM_SIZE, H = MM_SIZE;

  // Background — dark grass
  ctx.fillStyle = "#1a3010";
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= W; i += W / 8) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }

  // Paths (green strips)
  ctx.fillStyle = "#333333";
  // Horizontal main road
  const r1a = worldToMM(-40, -2);
  const r1b = worldToMM( 40,  2);
  ctx.fillRect(r1a.px, r1a.py, r1b.px - r1a.px, r1b.py - r1a.py);
  // Vertical spine
  const r2a = worldToMM(-2, -60);
  const r2b = worldToMM( 2,  30);
  ctx.fillRect(r2a.px, r2a.py, r2b.px - r2a.px, r2b.py - r2a.py);

  // Park zone
  ctx.fillStyle = "rgba(50,140,50,0.5)";
  const pa = worldToMM(-68, -38); const pb = worldToMM(-34, -2);
  ctx.fillRect(pa.px, pa.py, pb.px - pa.px, pb.py - pa.py);

  // Forest zone
  ctx.fillStyle = "rgba(20,80,20,0.5)";
  const fa = worldToMM(-85, -40); const fb = worldToMM(-55, 40);
  ctx.fillRect(fa.px, fa.py, fb.px - fa.px, fb.py - fa.py);

  // Stadium zone
  ctx.fillStyle = "rgba(40,100,40,0.4)";
  const sta = worldToMM(-18, -72); const stb = worldToMM(18, -46);
  ctx.fillRect(sta.px, sta.py, stb.px - sta.px, stb.py - sta.py);

  // Buildings as gold dots
  BUILDINGS.forEach(b => {
    const { px, py } = worldToMM(b.pos.x, b.pos.z);
    ctx.fillStyle = "#f5c518";
    ctx.fillRect(px - 3, py - 3, 6, 6);
    // tiny border
    ctx.strokeStyle = "#c9a010";
    ctx.lineWidth = 1;
    ctx.strokeRect(px - 3, py - 3, 6, 6);
  });

  // Player position + direction arrow
  const { px: ppx, py: ppy } = worldToMM(playerX, playerZ);

  // Direction arrow — rotated to match yaw
  // In minimap: world +X = right, world +Z = down. Yaw 0 faces -Z (up on map).
  const arrowAngle = yaw + Math.PI; // flip so forward = up on minimap

  ctx.save();
  ctx.translate(ppx, ppy);
  ctx.rotate(arrowAngle);

  // Glow
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 8;

  // Draw arrow shape
  ctx.fillStyle = "#ff2222";
  ctx.beginPath();
  ctx.moveTo(0, -8);       // tip (forward)
  ctx.lineTo(-4, 5);
  ctx.lineTo(0, 2);
  ctx.lineTo(4, 5);
  ctx.closePath();
  ctx.fill();

  // White outline
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 0;
  ctx.stroke();

  // Center dot
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Border
  ctx.strokeStyle = "#f5c518";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Compass
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillText("N", W / 2, 10);
  ctx.fillText("S", W / 2, H - 2);
  ctx.fillText("W", 7, H / 2 + 3);
  ctx.fillText("E", W - 4, H / 2 + 3);
}

/* ────────────────────────────────────────────────────────────────
   12d. TOGGLE CAMERA VIEW
──────────────────────────────────────────────────────────────── */
function toggleCameraView() {
  isThirdPerson = !isThirdPerson;
  document.getElementById("view-label").textContent = isThirdPerson ? "👁️ 1ST" : "👁️ 3RD";
  document.getElementById("crosshair").style.display = isThirdPerson ? "none" : "block";

  if (playerGroup) {
    // Show character mesh only in 3rd person
    playerGroup.visible = isThirdPerson;
    // Also show name tag
    const tag = playerGroup.getObjectByName("nameTag");
    if (tag) tag.visible = isThirdPerson;
  }

  showToast(isThirdPerson ? "🎮 Third-Person View" : "👁️ First-Person View");
}

/* ────────────────────────────────────────────────────────────────
   13. CONTROLS
──────────────────────────────────────────────────────────────── */
function setupControls() {
  const canvas = renderer.domElement;

  /* Keyboard */
  document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === "Escape") togglePause();
    if (e.key.toLowerCase() === "e" && !paused) {
      if (nearBuilding) openBuildingPanel(nearBuilding);
      else openResume();
    }
    if (e.key.toLowerCase() === "r") openResume();
    if (e.key.toLowerCase() === "v") toggleCameraView();
    if (e.key.toLowerCase() === "m") toggleMinimap();
  });
  document.addEventListener("keyup",   e => { keys[e.key.toLowerCase()] = false; });

  /* Mouse drag look */
  canvas.addEventListener("mousedown", e => {
    isDragging = true; lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener("mouseup",   () => { isDragging = false; });
  window.addEventListener("mousemove", e => {
    if (!isDragging || paused) return;
    mouseDX = (e.clientX - lastX) * 0.003;
    mouseDY = (e.clientY - lastY) * 0.003;
    lastX = e.clientX; lastY = e.clientY;
  });

  /* Touch look */
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
  canvas.addEventListener("touchmove", e => {
    if (paused) return;
    mouseDX = (e.touches[0].clientX - touchStartX) * 0.004;
    mouseDY = (e.touches[0].clientY - touchStartY) * 0.004;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  /* Hotbar slots — remove active on click and set new */
  document.querySelectorAll(".hb-slot").forEach(slot => {
    slot.addEventListener("click", () => {
      document.querySelectorAll(".hb-slot").forEach(s => s.classList.remove("active"));
      slot.classList.add("active");
    });
  });
}

/* ────────────────────────────────────────────────────────────────
   14. MAIN GAME LOOP
──────────────────────────────────────────────────────────────── */
const cloudMeshes = [];

function animate() {
  requestAnimationFrame(animate);
  if (paused) return;

  const dt = clock.getDelta();
  const t  = clock.getElapsedTime();

  /* ── Camera rotation from mouse ── */
  yaw   -= mouseDX;
  pitch -= mouseDY;
  pitch = Math.max(-0.5, Math.min(0.7, pitch));
  mouseDX = 0; mouseDY = 0;

  /* ── Movement vectors ── */
  const dir = new THREE.Vector3();
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right   = new THREE.Vector3( Math.cos(yaw), 0, -Math.sin(yaw));

  let moving = false;
  if (keys["w"] || keys["arrowup"])    { dir.add(forward); moving = true; }
  if (keys["s"] || keys["arrowdown"])  { dir.sub(forward); moving = true; }
  if (keys["a"] || keys["arrowleft"])  { dir.sub(right);   moving = true; }
  if (keys["d"] || keys["arrowright"]) { dir.add(right);   moving = true; }
  if (dir.length() > 0) dir.normalize().multiplyScalar(CAM_SPEED);

  /* ── Update player world position ── */
  playerX += dir.x;
  playerZ += dir.z;
  playerX = Math.max(-90, Math.min(90, playerX));
  playerZ = Math.max(-90, Math.min(90, playerZ));

  /* ── Gravity & jump ── */
  if (keys[" "] && onGround) { velY = JUMP_V; onGround = false; }
  velY -= GRAVITY;
  let playerY = (camera.position.y - CAM_HEIGHT) + velY;
  if (playerY <= 0) { playerY = 0; velY = 0; onGround = true; }

  /* ── Update player character mesh ── */
  if (playerGroup) {
    playerGroup.visible = isThirdPerson;
    playerGroup.position.set(playerX, playerY, playerZ);
    playerGroup.rotation.y = yaw + Math.PI; // face forward

    // Name tag always faces camera
    const tag = playerGroup.getObjectByName("nameTag");
    if (tag) {
      tag.visible = isThirdPerson;
      tag.rotation.y = -(yaw + Math.PI);
    }

    // Walking animation
    if (moving) {
      const swing = Math.sin(t * 8) * 0.4;
      if (playerGroup.userData.armL) playerGroup.userData.armL.rotation.x =  swing;
      if (playerGroup.userData.armR) playerGroup.userData.armR.rotation.x = -swing;
      if (playerGroup.userData.legL) playerGroup.userData.legL.rotation.x = -swing;
      if (playerGroup.userData.legR) playerGroup.userData.legR.rotation.x =  swing;
      // Slight bob
      playerGroup.position.y = playerY + Math.abs(Math.sin(t * 8)) * 0.05;
    } else {
      // Idle — return to rest
      if (playerGroup.userData.armL) playerGroup.userData.armL.rotation.x *= 0.85;
      if (playerGroup.userData.armR) playerGroup.userData.armR.rotation.x *= 0.85;
      if (playerGroup.userData.legL) playerGroup.userData.legL.rotation.x *= 0.85;
      if (playerGroup.userData.legR) playerGroup.userData.legR.rotation.x *= 0.85;
      // Idle pickaxe swing
      if (playerGroup.userData.pHandle) {
        playerGroup.userData.pHandle.rotation.z = -0.4 + Math.sin(t * 1.2) * 0.08;
      }
    }
  }

  /* ── Camera placement ── */
  if (isThirdPerson) {
    // Third-person: orbit behind + above the player
    const behindX = playerX + Math.sin(yaw) * TP_DIST;
    const behindZ = playerZ + Math.cos(yaw) * TP_DIST;
    const camY    = playerY + CAM_HEIGHT + TP_HEIGHT;

    camera.position.set(behindX, camY, behindZ);

    // Look at player's head
    const lookTarget = new THREE.Vector3(playerX, playerY + 1.6, playerZ);
    camera.lookAt(lookTarget);
  } else {
    // First-person: camera IS the player's eyes
    camera.position.set(playerX, playerY + CAM_HEIGHT, playerZ);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  }

  /* ── Proximity detection (uses playerX/Z) ── */
  checkProximity();

  /* ── Minimap ── */
  drawMinimap();

  /* ── HUD location ── */
  updateHUDLocation();

  renderer.render(scene, camera);
}

/* ────────────────────────────────────────────────────────────────
   15. PROXIMITY CHECK — show interact prompt near buildings
──────────────────────────────────────────────────────────────── */
function checkProximity() {
  const THRESHOLD = 9;
  let closest = null, closestDist = Infinity;
  const playerPos = new THREE.Vector3(playerX, 0, playerZ);

  buildingMeshes.forEach(bm => {
    const d = playerPos.distanceTo(bm.worldPos);
    if (d < THRESHOLD && d < closestDist) {
      closestDist = d;
      closest = bm.data;
    }
  });

  nearBuilding = closest;
  const prompt = document.getElementById("interact-prompt");
  if (closest && !panelOpen) {
    prompt.classList.remove("hidden");
    prompt.querySelector(".key").nextSibling.textContent = ` Explore ${closest.label}`;
  } else {
    prompt.classList.add("hidden");
  }
}

/* ────────────────────────────────────────────────────────────────
   16. HUD LOCATION
──────────────────────────────────────────────────────────────── */
function updateHUDLocation() {
  const x = Math.round(playerX);
  const z = Math.round(playerZ);
  let zone = "📍 Open World";

  if (Math.abs(x) < 10 && Math.abs(z) < 10)  zone = "🏠 Spawn Plaza";
  else if (x < -18 && Math.abs(z) < 12)       zone = "💼 Internship HQ";
  else if (x > 18 && Math.abs(z) < 12)        zone = "📬 Post Office";
  else if (x < -18 && z < -12)                zone = "📜 About Hall";
  else if (x > 18 && z < -12)                 zone = "⚔️ Skill Tower";
  else if (Math.abs(x) < 20 && z < -30)       zone = "🏗️ Project City";
  else if (x < -40)                           zone = "🌲 Forest Area";
  else if (z < -50)                           zone = "🏟️ Stadium";

  document.getElementById("hud-loc").textContent = zone;
}

/* ────────────────────────────────────────────────────────────────
   17. INFO PANEL
──────────────────────────────────────────────────────────────── */
function openBuildingPanel(bdata) {
  panelOpen = true;
  document.getElementById("ip-icon").textContent  = bdata.icon;
  document.getElementById("ip-title").textContent = bdata.title;
  document.getElementById("ip-body").innerHTML    = bdata.html;

  const btn = document.getElementById("ip-btn");
  btn.onclick = () => { closePanel(); openResume(); };

  document.getElementById("info-panel").classList.remove("hidden");
  document.getElementById("interact-prompt").classList.add("hidden");
}

function closePanel() {
  panelOpen = false;
  document.getElementById("info-panel").classList.add("hidden");
}

/* ────────────────────────────────────────────────────────────────
   18. RESUME MODAL
──────────────────────────────────────────────────────────────── */
function openResume() {
  document.getElementById("resume-modal").classList.remove("hidden");
}
function closeResume() {
  document.getElementById("resume-modal").classList.add("hidden");
}

/* ────────────────────────────────────────────────────────────────
   19. PAUSE MENU
──────────────────────────────────────────────────────────────── */
function togglePause() {
  paused = !paused;
  const pm = document.getElementById("pause-menu");
  if (paused) pm.classList.remove("hidden");
  else        pm.classList.add("hidden");
}
function resumeGame() {
  paused = false;
  document.getElementById("pause-menu").classList.add("hidden");
}

/* ────────────────────────────────────────────────────────────────
   20. TELEPORT
──────────────────────────────────────────────────────────────── */
function teleport(zone) {
  const spot = TELEPORT_SPOTS[zone];
  if (!spot) return;
  playerX = spot.x;
  playerZ = spot.z;
  camera.position.set(spot.x, spot.y, spot.z);
  yaw = spot.yaw || 0;
  pitch = 0;
  velY = 0;
  closePanel();
  resumeGame();
  showToast("🚀 Teleported to " + zone.charAt(0).toUpperCase() + zone.slice(1));

  /* Update hotbar active */
  document.querySelectorAll(".hb-slot").forEach(s => s.classList.remove("active"));
  const hbSlots = document.querySelectorAll(".hb-slot");
  const zoneIndex = ["spawn","about","skills","projects","intern","contact"].indexOf(zone);
  if (zoneIndex >= 0 && hbSlots[zoneIndex]) hbSlots[zoneIndex].classList.add("active");

  /* Auto-open building panel if near one */
  setTimeout(() => {
    const match = BUILDINGS.find(b => b.id === zone);
    if (match) openBuildingPanel(match);
  }, 500);
}

/* ────────────────────────────────────────────────────────────────
   20b. TOGGLE MINIMAP
──────────────────────────────────────────────────────────────── */
let minimapVisible = true;
function toggleMinimap() {
  minimapVisible = !minimapVisible;
  const wrap = document.getElementById("minimap-wrap");
  const showBtn = document.getElementById("map-show-btn");
  if (minimapVisible) {
    wrap.classList.remove("hidden");
    showBtn.classList.add("hidden");
  } else {
    wrap.classList.add("hidden");
    showBtn.classList.remove("hidden");
  }
}

/* ────────────────────────────────────────────────────────────────
   21. TOAST
──────────────────────────────────────────────────────────────── */
function showToast(msg, duration = 2800) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

/* ────────────────────────────────────────────────────────────────
   22. RESIZE
──────────────────────────────────────────────────────────────── */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* ────────────────────────────────────────────────────────────────
   23. KONAMI CODE EASTER EGG
──────────────────────────────────────────────────────────────── */
(function() {
  const code = ["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];
  let idx = 0;
  document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        showToast("🎮 CHEAT CODE! Night mode activated…", 3000);
        if (renderer) renderer.setClearColor(0x050810, 1);
        if (scene) scene.fog = new THREE.Fog(0x050810, 20, 80);
      }
    } else idx = 0;
  });
})();

/* ────────────────────────────────────────────────────────────────
   24. CONSOLE GREETING
──────────────────────────────────────────────────────────────── */
console.log(
  "%c⛏️  SUMEDH PATHE — 3D Portfolio World\n%csumedhpatthe2005@gmail.com\n%cgithub.com/Sumedh9696\n%cTry the Konami Code: ↑↑↓↓←→←→BA",
  "color:#f5c518;font-size:18px;font-weight:bold;",
  "color:#4de6e6;font-size:12px;",
  "color:#6abf30;font-size:12px;",
  "color:#888;font-size:11px;"
);
