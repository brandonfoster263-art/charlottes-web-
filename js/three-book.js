import * as THREE from 'three';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';

const PAGES = window.BOOK_PAGES;
const COVER_PHOTO_URL = 'assets/illustrations/cover-photo.jpg';

const RAINBOW = ['#e0453f', '#e88a2b', '#d8a418', '#3f9e4d', '#2f8fd0', '#5a5fd6', '#a945c4'];
const CREAM = '#fbf2da';
const COVER_GREEN = '#8b9678';
const COVER_GREEN_DARK = '#5e6b52';
const COVER_INK = '#3f4a3a';
const GOLD = '#d8b35c';

const BOOK_W = 3.4;
const BOOK_D = 4.6;
const BOOK_T = 0.5;
const COVER_T = 0.1;
const RIGHT_SURFACE_Y = BOOK_T - COVER_T;
const LEFT_SURFACE_Y = COVER_T;

const TEX_W = 768;
const TEX_H = 1040;

let current = 0;
let flipping = false;
let opened = false;
let speaking = false;

// ---------------- DOM ----------------
const canvas = document.getElementById('book-canvas');
const stage = document.getElementById('table-scene');
const openBtn = document.getElementById('open-btn');
const dragHint = document.getElementById('drag-hint');
const controlsEl = document.getElementById('controls');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.getElementById('close-btn');
const readBtn = document.getElementById('read-btn');
const indicator = document.getElementById('page-indicator');
const dot = document.getElementById('read-dot');
const glossaryHint = document.getElementById('glossary-hint');
const wordPopup = document.getElementById('word-popup');
const wordPopupClose = document.getElementById('word-popup-close');
const wordPopupIcon = document.getElementById('word-popup-icon');
const wordPopupWord = document.getElementById('word-popup-word');
const wordPopupDef = document.getElementById('word-popup-def');
const wandHint = document.getElementById('wand-hint');
const wandCastBtn = document.getElementById('wand-cast-btn');
const wandDownBtn = document.getElementById('wand-down-btn');
const wandDpad = document.getElementById('wand-dpad');

// ---------------- renderer / scene / camera ----------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#3a2415');
scene.fog = new THREE.Fog('#3a2415', 14, 26);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 6.4, 7.4);

const orbit = new OrbitControls(camera, canvas);
orbit.target.set(0, 0.3, 0);
orbit.enableDamping = true;
orbit.dampingFactor = 0.08;
orbit.minDistance = 3.5;
orbit.maxDistance = 13;
orbit.minPolarAngle = THREE.MathUtils.degToRad(15);
orbit.maxPolarAngle = THREE.MathUtils.degToRad(82);
orbit.update();

// ---------------- lighting ----------------
scene.add(new THREE.AmbientLight('#fff3df', 0.55));
const sun = new THREE.DirectionalLight('#fff6e0', 1.15);
sun.position.set(4.5, 8, 3.5);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 30;
sun.shadow.camera.left = -8;
sun.shadow.camera.right = 8;
sun.shadow.camera.top = 8;
sun.shadow.camera.bottom = -8;
scene.add(sun);
const fillLight = new THREE.DirectionalLight('#cfe6ff', 0.35);
fillLight.position.set(-5, 4, -4);
scene.add(fillLight);

// ---------------- table ----------------
function makeWoodTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#7a4e2a';
  ctx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 18) {
    const shade = 18 + Math.random() * 28;
    ctx.fillStyle = `rgba(${74 + shade},${46 + shade * 0.5},${24 + shade * 0.3},${0.35 + Math.random() * 0.25})`;
    ctx.fillRect(x, 0, 9 + Math.random() * 6, 512);
  }
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = `rgba(40,22,10,${0.05 + Math.random() * 0.12})`;
    ctx.lineWidth = 1 + Math.random();
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) {
      ctx.lineTo(x, y + (Math.random() - 0.5) * 10);
    }
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const table = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ map: makeWoodTexture(), roughness: 0.85, metalness: 0.05 }),
);
table.rotation.x = -Math.PI / 2;
table.receiveShadow = true;
scene.add(table);

// Swap in the real reclaimed-wood photo once it loads; the procedural
// texture above stays as the instant placeholder until then.
new THREE.TextureLoader().load('assets/textures/table-wood.jpg', (tex) => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  table.material.map = tex;
  table.material.needsUpdate = true;
});

// ---------------- magic wand ----------------
function makeStarShape(outerR, innerR, points) {
  const shape = new THREE.Shape();
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = i * step - Math.PI / 2;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

const wandGroup = new THREE.Group();
const wandRestPosition = new THREE.Vector3(-2.3, 0.95, 1.4);
const wandRestRotation = new THREE.Euler(0.3, 0.5, 0.15);
wandGroup.position.copy(wandRestPosition);
wandGroup.rotation.copy(wandRestRotation);
scene.add(wandGroup);

const wandHandle = new THREE.Mesh(
  new THREE.CylinderGeometry(0.035, 0.05, 1.3, 14),
  new THREE.MeshStandardMaterial({ color: '#5c3a22', roughness: 0.6, metalness: 0.1 }),
);
wandHandle.position.y = 0.65;
wandHandle.castShadow = true;
wandGroup.add(wandHandle);

const starGeo = new THREE.ExtrudeGeometry(makeStarShape(0.2, 0.08, 5), {
  depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2,
});
starGeo.center();
const wandStar = new THREE.Mesh(
  starGeo,
  new THREE.MeshStandardMaterial({ color: '#ffe17a', emissive: '#ffb800', emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.4 }),
);
wandStar.position.set(0, 1.35, 0);
wandStar.castShadow = true;
wandGroup.add(wandStar);

[0.18, 1.0].forEach((y) => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.058, 0.012, 8, 16),
    new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.6, roughness: 0.3 }),
  );
  ring.position.y = y;
  ring.rotation.x = Math.PI / 2;
  wandGroup.add(ring);
});

const wandTipMarker = new THREE.Object3D();
wandTipMarker.position.set(0, 1.42, 0);
wandGroup.add(wandTipMarker);

const wandGlow = new THREE.PointLight('#ffe17a', 0.35, 1.6);
wandGlow.position.copy(wandTipMarker.position);
wandGroup.add(wandGlow);

function makeSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,230,150,0.9)');
  grad.addColorStop(1, 'rgba(255,230,150,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const sparkleTexture = makeSparkleTexture();
const activeBursts = [];

function spawnSparkleBurst(origin) {
  const count = 46;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocities = [];
  for (let i = 0; i < count; i++) {
    positions[i * 3] = origin.x;
    positions[i * 3 + 1] = origin.y;
    positions[i * 3 + 2] = origin.z;
    const color = new THREE.Color(RAINBOW[i % RAINBOW.length]);
    colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const speed = 0.8 + Math.random() * 1.6;
    velocities.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta) * speed,
      Math.abs(Math.cos(phi)) * speed + 0.6,
      Math.sin(phi) * Math.sin(theta) * speed,
    ));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.16,
    map: sparkleTexture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  activeBursts.push({ points, velocities, age: 0, duration: 1.1 });
  wandGlow.intensity = 2.2;
}

function updateSparkleBursts(dt) {
  for (let i = activeBursts.length - 1; i >= 0; i--) {
    const burst = activeBursts[i];
    burst.age += dt;
    const t = burst.age / burst.duration;
    if (t >= 1) {
      scene.remove(burst.points);
      burst.points.geometry.dispose();
      burst.points.material.dispose();
      activeBursts.splice(i, 1);
      continue;
    }
    const posAttr = burst.points.geometry.attributes.position;
    for (let p = 0; p < burst.velocities.length; p++) {
      const v = burst.velocities[p];
      v.y -= dt * 1.4;
      posAttr.array[p * 3] += v.x * dt;
      posAttr.array[p * 3 + 1] += v.y * dt;
      posAttr.array[p * 3 + 2] += v.z * dt;
    }
    posAttr.needsUpdate = true;
    burst.points.material.opacity = 1 - t;
  }
  if (wandGlow.intensity > 0.35) {
    wandGlow.intensity = THREE.MathUtils.lerp(wandGlow.intensity, 0.35, 0.05);
  }
}

// ---------------- shared side / spine textures ----------------
function makePageEdgeTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 256;
  const ctx = c.getContext('2d');
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = (y / 3) % 2 === 0 ? '#fbf2da' : '#efe0b8';
    ctx.fillRect(0, y, 32, 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  return tex;
}

function makeSpineTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 768;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, COVER_GREEN_DARK);
  grad.addColorStop(0.5, COVER_GREEN);
  grad.addColorStop(1, COVER_GREEN_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 768);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(Math.random() * 128, Math.random() * 768, 1.3, 1.3);
  }
  ctx.save();
  ctx.translate(64, 330);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = COVER_INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "italic 700 50px Georgia, 'Times New Roman', serif";
  ctx.fillText("Charlotte's Web", 0, 0);
  ctx.font = "700 26px Georgia, 'Times New Roman', serif";
  ctx.fillText('E. B. WHITE', 0, 56);
  ctx.restore();
  ctx.strokeStyle = COVER_INK;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(64, 690, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(64, 672); ctx.lineTo(64, 708);
  ctx.moveTo(48, 690); ctx.lineTo(80, 690);
  ctx.stroke();
  return new THREE.CanvasTexture(c);
}

const sideMat = new THREE.MeshStandardMaterial({ map: makePageEdgeTexture(), roughness: 0.95 });
const spineMat = new THREE.MeshStandardMaterial({ map: makeSpineTexture(), roughness: 0.7 });
const backMat = new THREE.MeshStandardMaterial({ color: COVER_GREEN_DARK, roughness: 0.8 });

// ---------------- SVG rasterization ----------------
const svgImageCache = new Map();
function loadSvgImage(svgString) {
  if (svgImageCache.has(svgString)) return svgImageCache.get(svgString);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  });
  svgImageCache.set(svgString, promise);
  return promise;
}

const rasterImageCache = new Map();
function loadRasterImage(url) {
  if (rasterImageCache.has(url)) return rasterImageCache.get(url);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
  rasterImageCache.set(url, promise);
  return promise;
}

// ---------------- word wrap + page canvas rendering ----------------
function wrapWords(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(/\s+/).filter(Boolean);
  const spaceWidth = ctx.measureText(' ').width;
  const lines = [];
  let line = [];
  let lineWidth = 0;
  words.forEach((word) => {
    const w = ctx.measureText(word).width;
    const extra = line.length ? spaceWidth : 0;
    if (line.length && lineWidth + extra + w > maxWidth) {
      lines.push(line);
      line = [];
      lineWidth = 0;
    }
    line.push({ word, width: w });
    lineWidth += (line.length > 1 ? spaceWidth : 0) + w;
  });
  if (line.length) lines.push(line);
  return { lines, spaceWidth };
}

async function drawPageCanvas(canvasEl, page, { withText, highlightIndex = -1, centered = false, flip180 = false, spineEdge = null } = {}) {
  const ctx = canvasEl.getContext('2d');
  const W = canvasEl.width, H = canvasEl.height;
  ctx.save();
  if (flip180) {
    ctx.translate(W, H);
    ctx.rotate(Math.PI);
  }
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);

  // Soft shadow + faint warm tint down the binding edge so the open book reads
  // like real bound pages curving into the spine.
  if (spineEdge) {
    const gw = W * 0.17;
    const onLeft = spineEdge === 'left';
    const grad = onLeft
      ? ctx.createLinearGradient(0, 0, gw, 0)
      : ctx.createLinearGradient(W, 0, W - gw, 0);
    grad.addColorStop(0, 'rgba(60,40,20,0.30)');
    grad.addColorStop(0.45, 'rgba(90,65,35,0.10)');
    grad.addColorStop(1, 'rgba(90,65,35,0)');
    ctx.fillStyle = grad;
    if (onLeft) ctx.fillRect(0, 0, gw, H);
    else ctx.fillRect(W - gw, 0, gw, H);
  }

  const border = W * 0.014;
  ctx.strokeStyle = 'rgba(140,47,47,0.35)';
  ctx.lineWidth = border;
  ctx.strokeRect(border, border, W - border * 2, H - border * 2);

  const margin = W * 0.09;
  const illoH = withText ? H * 0.48 : H * 0.8;
  const img = page.photo ? await loadRasterImage(page.photo) : await loadSvgImage(page.illustration);
  if (img) {
    const ar = page.photo ? img.naturalWidth / img.naturalHeight : 600 / 420;
    const areaW = W - margin * 2;
    const areaH = illoH - margin;
    let dw = areaW, dh = dw / ar;
    if (dh > areaH) { dh = areaH; dw = dh * ar; }
    const dx = (W - dw) / 2;
    const dy = margin * 0.6 + (areaH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  const wordRects = [];
  if (withText) {
    const fontSize = centered ? Math.round(W * 0.082) : Math.round(W * 0.058);
    const font = `700 ${fontSize}px 'Baloo 2','Comic Sans MS',cursive`;
    const maxWidth = W - margin * 2;
    const { lines, spaceWidth } = wrapWords(ctx, page.text, maxWidth, font);
    const lineHeight = fontSize * 1.5;
    const totalH = lines.length * lineHeight;
    let y = illoH + fontSize * 1.2;
    if (centered) y = illoH + Math.max(0, (H - illoH - totalH) / 2) + fontSize;
    ctx.textBaseline = 'alphabetic';
    let wordCounter = 0;
    lines.forEach((line) => {
      const lineWidth = line.reduce((s, w, i) => s + w.width + (i > 0 ? spaceWidth : 0), 0);
      let x = centered ? (W - lineWidth) / 2 : margin;
      line.forEach((w) => {
        const isActive = wordCounter === highlightIndex;
        const glossaryMatch = window.WordGlossary && window.WordGlossary.lookup(w.word);
        if (glossaryMatch) {
          ctx.save();
          ctx.fillStyle = 'rgba(135,206,250,0.28)';
          ctx.fillRect(x - 4, y - fontSize * 0.92, w.width + 8, fontSize * 1.05);
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#2f8fd0';
          ctx.lineWidth = Math.max(2, fontSize * 0.05);
          ctx.beginPath();
          ctx.moveTo(x, y + fontSize * 0.14);
          ctx.lineTo(x + w.width, y + fontSize * 0.14);
          ctx.stroke();
          ctx.restore();
        }
        if (isActive) {
          ctx.fillStyle = '#ffe17a';
          ctx.fillRect(x - 6, y - fontSize * 1.05, w.width + 12, fontSize * 1.3);
        }
        ctx.fillStyle = isActive ? '#5a3d00' : RAINBOW[wordCounter % RAINBOW.length];
        ctx.font = font;
        ctx.fillText(w.word, x, y);
        wordRects.push({ x, y: y - fontSize * 1.05, w: w.width, h: fontSize * 1.3, glossary: glossaryMatch || null });
        x += w.width + spaceWidth;
        wordCounter++;
      });
      y += lineHeight;
    });

    if (page.sub) {
      ctx.font = `600 ${Math.round(fontSize * 0.46)}px 'Quicksand','Comic Sans MS',sans-serif`;
      ctx.fillStyle = '#7a6a45';
      ctx.textAlign = 'center';
      ctx.fillText(page.sub, W / 2, y + fontSize * 0.5);
      ctx.textAlign = 'left';
    }
  }

  ctx.restore();
  return wordRects;
}

// Vintage cloth-bound look for the front cover: sage cloth backdrop, a serif
// title block, the web/spider/pig artwork, and the author/illustrator credit.
async function drawCoverCanvas(canvasEl, page) {
  const ctx = canvasEl.getContext('2d');
  const W = canvasEl.width, H = canvasEl.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = COVER_GREEN;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.4, 1.4);
  }
  const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.64);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(35,40,30,0.3)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = COVER_INK;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `italic 700 ${Math.round(W * 0.135)}px Georgia, 'Times New Roman', serif`;
  ctx.fillText("Charlotte's", W / 2, H * 0.145);
  ctx.fillText('Web', W / 2, H * 0.145 + W * 0.145);

  const img = await loadRasterImage(COVER_PHOTO_URL);
  if (img) {
    const ar = img.naturalWidth / img.naturalHeight;
    const boxX = W * 0.08, boxY = H * 0.30, boxW = W * 0.84, boxH = H * 0.535;
    let dw = boxW, dh = dw / ar;
    if (dh > boxH) { dh = boxH; dw = dh * ar; }
    const dx = boxX + (boxW - dw) / 2;
    const dy = boxY + (boxH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  ctx.font = `700 ${Math.round(W * 0.05)}px Georgia, 'Times New Roman', serif`;
  ctx.fillText('E. B. WHITE', W / 2, H * 0.865);
  ctx.font = `italic 400 ${Math.round(W * 0.034)}px Georgia, 'Times New Roman', serif`;
  ctx.fillText('Illustrated by', W / 2, H * 0.898);
  ctx.font = `700 ${Math.round(W * 0.042)}px Georgia, 'Times New Roman', serif`;
  ctx.fillText('GARTH WILLIAMS', W / 2, H * 0.935);
  return [];
}

function createPageSlot(flip180 = false, isCover = false) {
  const cv = document.createElement('canvas');
  cv.width = TEX_W;
  cv.height = TEX_H;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
  return {
    canvas: cv,
    texture: tex,
    material,
    wordRects: [],
    async setPage(pageLike, withText, highlightIndex = -1, spineEdge = null) {
      const centered = pageLike.kind === 'cover' || pageLike.kind === 'title' || pageLike.kind === 'end';
      this.wordRects = isCover
        ? await drawCoverCanvas(cv, pageLike)
        : await drawPageCanvas(cv, pageLike, { withText, highlightIndex, centered, flip180, spineEdge });
      this.texture.needsUpdate = true;
    },
    dispose() {
      this.texture.dispose();
      this.material.dispose();
    },
  };
}

// ---------------- book geometry ----------------
const bookRoot = new THREE.Group();
scene.add(bookRoot);

const closedBook = new THREE.Group();
bookRoot.add(closedBook);

const rightSlot = createPageSlot();
const leftSlot = createPageSlot(true);
const coverSlot = createPageSlot(false, true);

const bulk = new THREE.Mesh(
  new THREE.BoxGeometry(BOOK_W, BOOK_T - COVER_T, BOOK_D),
  [sideMat, spineMat, rightSlot.material, backMat, sideMat, sideMat],
);
bulk.position.set(0, (BOOK_T - COVER_T) / 2, 0);
bulk.castShadow = true;
bulk.receiveShadow = true;
closedBook.add(bulk);

const flapPivot = new THREE.Object3D();
flapPivot.position.set(-BOOK_W / 2, BOOK_T - COVER_T, 0);
closedBook.add(flapPivot);

const flap = new THREE.Mesh(
  new THREE.BoxGeometry(BOOK_W, COVER_T, BOOK_D),
  [sideMat, spineMat, coverSlot.material, leftSlot.material, sideMat, sideMat],
);
flap.position.set(BOOK_W / 2, COVER_T / 2, 0);
flap.castShadow = true;
flap.receiveShadow = true;
flapPivot.add(flap);

// ---------------- open-book extras: left page block + spine binding ----------
// When the book is open we want it to read like a real bound book: a matching
// stack of pages under the LEFT page (so it isn't a thin cover sliver), and a
// cloth binding running down the gutter. Both stay hidden while closed.
const STACK_T = BOOK_T - 2 * COVER_T;        // left page block thickness
const PAGE_TOP_Y = BOOK_T - COVER_T;          // shared reading-surface height

const leftStack = new THREE.Mesh(
  new THREE.BoxGeometry(BOOK_W, STACK_T, BOOK_D),
  [sideMat, sideMat, backMat, sideMat, sideMat, sideMat],
);
leftStack.position.set(-BOOK_W / 2, STACK_T / 2, 0);
leftStack.castShadow = true;
leftStack.receiveShadow = true;
leftStack.visible = false;
bookRoot.add(leftStack);

// Cloth binding: a thin sage-green seam down the gutter, flush with the pages,
// plus a soft rounded ridge so the spine is clearly visible from above.
const spineGroup = new THREE.Group();
spineGroup.visible = false;
bookRoot.add(spineGroup);

const spineSeam = new THREE.Mesh(
  new THREE.BoxGeometry(0.14, PAGE_TOP_Y + 0.02, BOOK_D),
  new THREE.MeshStandardMaterial({ color: COVER_GREEN, roughness: 0.75 }),
);
spineSeam.position.set(0, (PAGE_TOP_Y + 0.02) / 2, 0);
spineGroup.add(spineSeam);

const spineRidge = new THREE.Mesh(
  new THREE.CylinderGeometry(0.07, 0.07, BOOK_D, 18, 1),
  new THREE.MeshStandardMaterial({ color: COVER_GREEN_DARK, roughness: 0.7 }),
);
spineRidge.rotation.x = Math.PI / 2;
spineRidge.position.set(0, PAGE_TOP_Y - 0.005, 0);
spineGroup.add(spineRidge);

// ---------------- curling page (realistic flip) ----------------
// A turning page is a segmented sheet hinged at the spine (world x = 0). Each
// frame we bend it along an arc so the far edge curls up and over like real
// paper, instead of swinging as one rigid board.
const FLIP_SEGS = 30;
function makeFlipGeometry() {
  const geo = new THREE.PlaneGeometry(BOOK_W, BOOK_D, FLIP_SEGS, 1);
  geo.rotateX(-Math.PI / 2);     // lay flat: width along X, depth along Z
  geo.translate(BOOK_W / 2, 0, 0); // hinge at x = 0, sheet reaches to x = BOOK_W
  return geo;
}
function buildCurlData(geo) {
  const pos = geo.attributes.position;
  const ds = BOOK_W / FLIP_SEGS;
  const sIndex = new Int16Array(pos.count);
  for (let j = 0; j < pos.count; j++) sIndex[j] = Math.round(pos.getX(j) / ds);
  return { sIndex, ds };
}
// progress: 0 = flat on the right, 1 = flat on the left. dir +1 sweeps the
// page from right→left; dir -1 mirrors it. curlMax controls how much the sheet
// billows at the midpoint.
function applyCurl(geo, data, progress, dir, baseY, curlMax = 1.15) {
  const segs = FLIP_SEGS;
  const A = Math.PI * progress * dir;
  const B = curlMax * Math.sin(Math.PI * progress) * dir;
  const X = new Float32Array(segs + 1);
  const Y = new Float32Array(segs + 1);
  for (let i = 1; i <= segs; i++) {
    const u = (i - 0.5) / segs;
    const th = A + B * u;
    X[i] = X[i - 1] + Math.cos(th) * data.ds;
    Y[i] = Y[i - 1] + Math.sin(th) * data.ds;
  }
  const pos = geo.attributes.position;
  for (let j = 0; j < pos.count; j++) {
    const i = data.sIndex[j];
    pos.setX(j, X[i]);
    pos.setY(j, baseY + Y[i]);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

// ---------------- tweening helper ----------------
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function tween(duration, onUpdate) {
  return new Promise((resolve) => {
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      onUpdate(easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

// ---------------- UI state ----------------
function updateIndicator() {
  indicator.textContent = `${current + 1}-${Math.min(current + 2, PAGES.length)} / ${PAGES.length}`;
  prevBtn.disabled = current <= 0;
  nextBtn.disabled = current + 2 >= PAGES.length;
}

function setReadingState(isReading) {
  speaking = isReading;
  readBtn.classList.toggle('reading', isReading);
  readBtn.textContent = isReading ? '⏹ Stop' : '🔊 Read to me';
}

function stopReading() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (speaking) setReadingState(false);
  dot.classList.remove('shown');
}

// Pick the warmest, most human-sounding voice the browser offers instead of
// the default robotic one. Modern browsers ship neural "Natural"/"Online"
// voices (Microsoft Aria/Jenny/Libby, Google, Apple Samantha/Eddy) — we rank
// those first and fall back gracefully to any English voice.
let chosenVoice = null;
let voiceResolved = false;
function pickStoryVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = en.length ? en : voices;
  const prefer = [
    /natural/i, /neural/i, /online/i,
    /aria/i, /jenny/i, /libby/i, /sonia/i, /michelle/i,
    /samantha/i, /allison/i, /ava/i, /serena/i, /eddy/i, /grandma/i,
    /google\s*(us|uk)?\s*english/i, /google/i,
  ];
  for (const rx of prefer) {
    const hit = pool.find((v) => rx.test(v.name));
    if (hit) return hit;
  }
  // Avoid the obviously synthetic eSpeak fallbacks if anything else exists.
  const nonRobotic = pool.find((v) => !/espeak|robot|microsoft david|microsoft mark/i.test(v.name));
  return nonRobotic || pool[0];
}
function ensureVoice() {
  if (voiceResolved) return;
  chosenVoice = pickStoryVoice();
  if (chosenVoice) voiceResolved = true;
}
if ('speechSynthesis' in window) {
  ensureVoice();
  window.speechSynthesis.onvoiceschanged = () => { voiceResolved = false; ensureVoice(); };
}

// ---------------- read-along word -> world projection ----------------
function computeWordStarts(text) {
  const starts = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) starts.push(m.index);
  return starts;
}
function wordIndexForChar(starts, charIndex) {
  for (let k = starts.length - 1; k >= 0; k--) {
    if (charIndex >= starts[k]) return k;
  }
  return 0;
}

function projectDotToWorld(worldX, worldY, worldZ) {
  const v = new THREE.Vector3(worldX, worldY, worldZ);
  v.project(camera);
  const rect = canvas.getBoundingClientRect();
  const x = rect.left + (v.x * 0.5 + 0.5) * rect.width;
  const y = rect.top + (-v.y * 0.5 + 0.5) * rect.height;
  dot.style.left = `${x - 13}px`;
  dot.style.top = `${y - 30}px`;
  dot.classList.add('shown');
  dot.classList.remove('hop');
  void dot.offsetWidth;
  dot.classList.add('hop');
}

function placeDotOnRightPage(rect) {
  const fracX = (rect.x + rect.w / 2) / TEX_W;
  const fracZ = (rect.y + rect.h / 2) / TEX_H;
  const worldX = closedBook.position.x + (fracX - 0.5) * BOOK_W;
  const worldZ = (fracZ - 0.5) * BOOK_D;
  const worldY = RIGHT_SURFACE_Y + 0.05;
  projectDotToWorld(worldX, worldY, worldZ);
}

async function highlightWord(idx) {
  const page = PAGES[current + 1] ?? PAGES[current];
  await rightSlot.setPage(page, true, idx, 'left');
  const rect = rightSlot.wordRects[idx];
  if (rect) placeDotOnRightPage(rect);
}

function toggleRead() {
  if (!opened) return;
  if (speaking) {
    stopReading();
    rightSlot.setPage(PAGES[current + 1] ?? PAGES[current], true, -1, 'left');
    return;
  }
  if (!('speechSynthesis' in window)) return;
  const page = PAGES[current + 1] ?? PAGES[current];
  setReadingState(true);
  ensureVoice();
  const utter = new SpeechSynthesisUtterance(page.text);
  if (chosenVoice) utter.voice = chosenVoice;
  // Gentle, story-time cadence: a touch slow, natural pitch, soft volume.
  utter.rate = 0.9;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  const starts = computeWordStarts(page.text);
  utter.onboundary = (e) => {
    if (e.name && e.name !== 'word') return;
    highlightWord(wordIndexForChar(starts, e.charIndex));
  };
  utter.onend = () => {
    setReadingState(false);
    dot.classList.remove('shown');
    rightSlot.setPage(page, true, -1, 'left');
  };
  utter.onerror = () => {
    setReadingState(false);
    dot.classList.remove('shown');
  };
  window.speechSynthesis.speak(utter);
}

// ---------------- glossary popup ----------------
function showGlossaryPopup(entry) {
  stopReading();
  wordPopupIcon.innerHTML = entry.icon;
  wordPopupWord.textContent = entry.key;
  wordPopupDef.textContent = entry.definition;
  wordPopup.classList.remove('hidden');
  wordPopup.classList.add('shown');
}
function hideGlossaryPopup() {
  wordPopup.classList.remove('shown');
}
wordPopupClose.addEventListener('click', hideGlossaryPopup);
wordPopup.addEventListener('click', (e) => { if (e.target === wordPopup) hideGlossaryPopup(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideGlossaryPopup(); });

const glossaryRaycaster = new THREE.Raycaster();
const glossaryPointerNDC = new THREE.Vector2();
const rightPagePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -RIGHT_SURFACE_Y);
const glossaryPlaneHit = new THREE.Vector3();
let pointerDownPos = null;

function findGlossaryEntryAt(clientX, clientY) {
  if (!opened || flipping) return null;
  const rect = canvas.getBoundingClientRect();
  glossaryPointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  glossaryPointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  glossaryRaycaster.setFromCamera(glossaryPointerNDC, camera);
  if (!glossaryRaycaster.ray.intersectPlane(rightPagePlane, glossaryPlaneHit)) return null;
  const fracX = (glossaryPlaneHit.x - closedBook.position.x) / BOOK_W + 0.5;
  const fracZ = glossaryPlaneHit.z / BOOK_D + 0.5;
  if (fracX < 0 || fracX > 1 || fracZ < 0 || fracZ > 1) return null;
  const px = fracX * TEX_W;
  const py = fracZ * TEX_H;
  for (const wr of rightSlot.wordRects) {
    if (wr.glossary && px >= wr.x && px <= wr.x + wr.w && py >= wr.y && py <= wr.y + wr.h) {
      return wr.glossary;
    }
  }
  return null;
}

// ---------------- magic wand interaction ----------------
// Designed to be effortless: tap anywhere near the wand to pick it up, then
// just drag anywhere on the screen to move it (it follows your finger). Big
// on-screen buttons cast sparkles and put it back down.
const WAND_HOLD_Y = 1.05;
const WAND_BASE_SCALE = 1.35;     // a little bigger so it's easy to see & grab
const WAND_PICK_RADIUS = 90;       // px – generous tap target around the wand
wandGroup.scale.setScalar(WAND_BASE_SCALE);
let wandHeld = false;
let isPointerDown = false;
let wandDragging = false;
let wandTime = 0;
const wandTargetPos = wandRestPosition.clone();
const wandFollowPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -WAND_HOLD_Y);
const wandMoveRaycaster = new THREE.Raycaster();
const wandNDC = new THREE.Vector2();
const wandPlaneHit = new THREE.Vector3();
const _wandWorld = new THREE.Vector3();

// Screen-space distance from a point to the wand's star. Taps within
// WAND_PICK_RADIUS count as hits, so you never have to aim precisely.
function wandScreenDistance(clientX, clientY) {
  wandStar.getWorldPosition(_wandWorld);
  _wandWorld.project(camera);
  const rect = canvas.getBoundingClientRect();
  const sx = rect.left + (_wandWorld.x * 0.5 + 0.5) * rect.width;
  const sy = rect.top + (-_wandWorld.y * 0.5 + 0.5) * rect.height;
  return Math.hypot(clientX - sx, clientY - sy);
}
function isWandTapped(clientX, clientY) {
  return wandScreenDistance(clientX, clientY) <= WAND_PICK_RADIUS;
}

function updateWandTarget(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  wandNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  wandNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  wandMoveRaycaster.setFromCamera(wandNDC, camera);
  if (wandMoveRaycaster.ray.intersectPlane(wandFollowPlane, wandPlaneHit)) {
    wandTargetPos.set(wandPlaneHit.x, WAND_HOLD_Y, wandPlaneHit.z);
  }
}

function pickUpWand() {
  if (wandHeld) return;
  wandHeld = true;
  wandCastBtn.classList.add('visible');
  wandDownBtn.classList.add('visible');
  wandDpad.classList.add('visible');
  wandHint.classList.add('hidden');
  tween(240, (t) => {
    wandGroup.scale.setScalar(WAND_BASE_SCALE * (1 + Math.sin(Math.PI * t) * 0.22));
  });
}

function putDownWand() {
  if (!wandHeld) return;
  wandHeld = false;
  wandDragging = false;
  orbit.enabled = true;
  wandCastBtn.classList.remove('visible');
  wandDownBtn.classList.remove('visible');
  wandDpad.classList.remove('visible');
  wandMoveDir.x = 0;
  wandMoveDir.z = 0;
  // Glide gently back to its resting perch beside the book.
  const from = wandTargetPos.clone();
  tween(500, (t) => {
    wandTargetPos.lerpVectors(from, wandRestPosition, t);
  });
}

// Directional pad lets people nudge the held wand with simple taps/holds
// instead of having to drag it across the canvas.
const WAND_PAD_SPEED = 2.6;
const WAND_BOUNDS = { minX: -5.5, maxX: 5.5, minZ: -3.5, maxZ: 6.5 };
const wandMoveDir = { x: 0, z: 0 };
const WAND_PAD_VECTORS = {
  up: { x: 0, z: -1 },
  down: { x: 0, z: 1 },
  left: { x: -1, z: 0 },
  right: { x: 1, z: 0 },
};

wandDpad.querySelectorAll('.dpad-btn').forEach((btn) => {
  const vec = WAND_PAD_VECTORS[btn.dataset.dir];
  const start = (e) => {
    e.preventDefault();
    btn.setPointerCapture(e.pointerId);
    wandMoveDir.x = vec.x;
    wandMoveDir.z = vec.z;
  };
  const stop = () => {
    wandMoveDir.x = 0;
    wandMoveDir.z = 0;
  };
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', stop);
  btn.addEventListener('pointerleave', stop);
  btn.addEventListener('pointercancel', stop);
});

wandCastBtn.addEventListener('click', () => {
  if (!wandHeld) return;
  const tip = new THREE.Vector3();
  wandTipMarker.getWorldPosition(tip);
  spawnSparkleBurst(tip);
});

wandDownBtn.addEventListener('click', putDownWand);

// Interaction model:
//   • Not holding the wand → drag spins the book; a tap near the wand picks it
//     up; a tap on a glowing word opens its meaning.
//   • Holding the wand → drag/tap anywhere moves the wand to your finger; the
//     book stays put. Use the on-screen buttons to cast or put it down.
canvas.addEventListener('pointermove', (e) => {
  if (isPointerDown && wandDragging) updateWandTarget(e.clientX, e.clientY);
});

canvas.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  isPointerDown = true;
  if (wandHeld) {
    // The wand immediately follows wherever you press/drag.
    wandDragging = true;
    orbit.enabled = false;
    updateWandTarget(e.clientX, e.clientY);
  }
});

canvas.addEventListener('pointerup', (e) => {
  isPointerDown = false;
  if (wandDragging) {
    wandDragging = false;
    orbit.enabled = true;
  }
  if (!pointerDownPos) return;
  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  pointerDownPos = null;
  if (dist > 8) return;            // a drag, not a tap
  if (wandHeld) return;            // tapping never drops it – use the button
  if (isWandTapped(e.clientX, e.clientY)) {
    pickUpWand();
    return;
  }
  const entry = findGlossaryEntryAt(e.clientX, e.clientY);
  if (entry) showGlossaryPopup(entry);
});

// ---------------- open / flip ----------------
async function openBook() {
  if (opened) return;
  opened = true;
  openBtn.classList.add('hidden');
  dragHint.classList.add('hidden');
  leftStack.visible = true;
  spineGroup.visible = true;

  // The cover swings open and lands flat on the left page block (its pivot
  // stays at reading height so the left page ends up level with the right).
  await tween(1100, (t) => {
    flapPivot.rotation.z = Math.PI * t;
    flapPivot.position.y = PAGE_TOP_Y + Math.sin(Math.PI * t) * 0.55;
    closedBook.position.x = THREE.MathUtils.lerp(0, BOOK_W / 2, t);
  });

  controlsEl.classList.add('visible');
  glossaryHint.classList.add('visible');
  setTimeout(() => glossaryHint.classList.remove('visible'), 7000);
  updateIndicator();
}

async function closeBook() {
  if (!opened || flipping) return;
  opened = false;
  stopReading();
  hideGlossaryPopup();
  controlsEl.classList.remove('visible');
  glossaryHint.classList.remove('visible');

  await tween(1100, (t) => {
    flapPivot.rotation.z = Math.PI * (1 - t);
    flapPivot.position.y = PAGE_TOP_Y + Math.sin(Math.PI * t) * 0.55;
    closedBook.position.x = THREE.MathUtils.lerp(BOOK_W / 2, 0, t);
  });

  leftStack.visible = false;
  spineGroup.visible = false;

  if (current !== 0) {
    current = 0;
    await Promise.all([
      leftSlot.setPage(PAGES[0], false, -1, 'right'),
      rightSlot.setPage(PAGES[1], true, -1, 'left'),
    ]);
  }

  openBtn.classList.remove('hidden');
  dragHint.classList.remove('hidden');
}

async function flip(direction) {
  if (flipping || !opened) return;
  if (direction === 1 && current + 2 >= PAGES.length) return;
  if (direction === -1 && current <= 0) return;
  flipping = true;
  stopReading();

  // frontSlot = the face you see as the page lifts; backSlot = the face
  // revealed underneath as it settles on the far side.
  const frontSlot = createPageSlot();
  const backSlot = createPageSlot(true);
  backSlot.material.side = THREE.BackSide;

  if (direction === 1) {
    await Promise.all([
      frontSlot.setPage(PAGES[current + 1], true, -1, 'left'),
      backSlot.setPage(PAGES[current + 2] ?? PAGES[current + 1], false, -1, 'right'),
    ]);
  } else {
    await Promise.all([
      frontSlot.setPage(PAGES[current], false, -1, 'right'),
      backSlot.setPage(PAGES[current - 1] ?? PAGES[current], true, -1, 'left'),
    ]);
  }

  const geo = makeFlipGeometry();
  const curlData = buildCurlData(geo);
  const frontMesh = new THREE.Mesh(geo, frontSlot.material);
  const backMesh = new THREE.Mesh(geo, backSlot.material);
  frontMesh.castShadow = true;
  const flipGroup = new THREE.Group();
  flipGroup.add(frontMesh, backMesh);
  bookRoot.add(flipGroup);

  // The sheet hovers a hair above the resting pages (which keep showing the
  // matching content) so it lifts away and settles without z-fighting.
  const FLIP_LIFT = 0.014;
  applyCurl(geo, curlData, 0, direction, PAGE_TOP_Y + FLIP_LIFT);

  await tween(1300, (t) => {
    applyCurl(geo, curlData, t, direction, PAGE_TOP_Y + FLIP_LIFT);
  });

  current = direction === 1 ? current + 2 : current - 2;
  if (current < 0) current = 0;

  await Promise.all([
    rightSlot.setPage(PAGES[current + 1] ?? PAGES[current], true, -1, 'left'),
    leftSlot.setPage(PAGES[current], false, -1, 'right'),
  ]);

  bookRoot.remove(flipGroup);
  geo.dispose();
  frontSlot.dispose();
  backSlot.dispose();
  updateIndicator();
  flipping = false;
}

// ---------------- wiring ----------------
openBtn.addEventListener('click', openBook);
closeBtn.addEventListener('click', closeBook);
nextBtn.addEventListener('click', () => flip(1));
prevBtn.addEventListener('click', () => flip(-1));
readBtn.addEventListener('click', toggleRead);

// ---------------- resize / render loop ----------------
function onResize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
onResize();

let lastFrameTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  orbit.update();
  wandTime += dt;
  if (wandHeld && (wandMoveDir.x || wandMoveDir.z)) {
    wandTargetPos.x = THREE.MathUtils.clamp(wandTargetPos.x + wandMoveDir.x * WAND_PAD_SPEED * dt, WAND_BOUNDS.minX, WAND_BOUNDS.maxX);
    wandTargetPos.z = THREE.MathUtils.clamp(wandTargetPos.z + wandMoveDir.z * WAND_PAD_SPEED * dt, WAND_BOUNDS.minZ, WAND_BOUNDS.maxZ);
  }
  const bob = Math.sin(wandTime * 1.6) * 0.05;
  wandGroup.position.set(wandTargetPos.x, wandTargetPos.y + bob, wandTargetPos.z);
  if (wandHeld) {
    wandGroup.rotation.set(0.12, wandGroup.rotation.y, -0.08);
  } else {
    wandGroup.rotation.set(
      wandRestRotation.x,
      wandRestRotation.y + Math.sin(wandTime * 0.6) * 0.18,
      wandRestRotation.z,
    );
  }
  updateSparkleBursts(dt);
  renderer.render(scene, camera);
}
animate();

// ---------------- initial textures ----------------
(async () => {
  await Promise.all([
    coverSlot.setPage({ text: '' }, false),
    leftSlot.setPage(PAGES[0], false, -1, 'right'),
    rightSlot.setPage(PAGES[1], true, -1, 'left'),
  ]);
})();
