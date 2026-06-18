import * as THREE from 'three';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';

const PAGES = window.BOOK_PAGES;
const COVER_SVG = window.COVER_ILLUSTRATION;

const RAINBOW = ['#e0453f', '#e88a2b', '#d8a418', '#3f9e4d', '#2f8fd0', '#5a5fd6', '#a945c4'];
const CREAM = '#fbf2da';
const COVER_RED = '#8c2f2f';
const COVER_RED_DARK = '#6e2222';
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
const readBtn = document.getElementById('read-btn');
const indicator = document.getElementById('page-indicator');
const dot = document.getElementById('read-dot');

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
  grad.addColorStop(0, COVER_RED_DARK);
  grad.addColorStop(0.5, COVER_RED);
  grad.addColorStop(1, COVER_RED_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 768);
  ctx.save();
  ctx.translate(64, 384);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = GOLD;
  ctx.font = '700 56px "Baloo 2", "Comic Sans MS", cursive';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText("Charlotte's Web", 0, 0);
  ctx.restore();
  return new THREE.CanvasTexture(c);
}

const sideMat = new THREE.MeshStandardMaterial({ map: makePageEdgeTexture(), roughness: 0.95 });
const spineMat = new THREE.MeshStandardMaterial({ map: makeSpineTexture(), roughness: 0.7 });
const backMat = new THREE.MeshStandardMaterial({ color: COVER_RED_DARK, roughness: 0.8 });

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

async function drawPageCanvas(canvasEl, page, { withText, highlightIndex = -1, centered = false, flip180 = false } = {}) {
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

  const border = W * 0.014;
  ctx.strokeStyle = 'rgba(140,47,47,0.35)';
  ctx.lineWidth = border;
  ctx.strokeRect(border, border, W - border * 2, H - border * 2);

  const margin = W * 0.09;
  const illoH = withText ? H * 0.48 : H * 0.8;
  const img = await loadSvgImage(page.illustration);
  if (img) {
    const ar = 600 / 420;
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
        if (isActive) {
          ctx.fillStyle = '#ffe17a';
          ctx.fillRect(x - 6, y - fontSize * 1.05, w.width + 12, fontSize * 1.3);
        }
        ctx.fillStyle = isActive ? '#5a3d00' : RAINBOW[wordCounter % RAINBOW.length];
        ctx.font = font;
        ctx.fillText(w.word, x, y);
        wordRects.push({ x, y: y - fontSize * 1.05, w: w.width, h: fontSize * 1.3 });
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

function createPageSlot(flip180 = false) {
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
    async setPage(pageLike, withText, highlightIndex = -1) {
      const centered = pageLike.kind === 'cover' || pageLike.kind === 'title' || pageLike.kind === 'end';
      this.wordRects = await drawPageCanvas(cv, pageLike, { withText, highlightIndex, centered, flip180 });
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
const coverSlot = createPageSlot();

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
  await rightSlot.setPage(page, true, idx);
  const rect = rightSlot.wordRects[idx];
  if (rect) placeDotOnRightPage(rect);
}

function toggleRead() {
  if (!opened) return;
  if (speaking) {
    stopReading();
    rightSlot.setPage(PAGES[current + 1] ?? PAGES[current], true, -1);
    return;
  }
  if (!('speechSynthesis' in window)) return;
  const page = PAGES[current + 1] ?? PAGES[current];
  setReadingState(true);
  const utter = new SpeechSynthesisUtterance(page.text);
  utter.rate = 0.85;
  utter.pitch = 1.05;
  const starts = computeWordStarts(page.text);
  utter.onboundary = (e) => {
    if (e.name && e.name !== 'word') return;
    highlightWord(wordIndexForChar(starts, e.charIndex));
  };
  utter.onend = () => {
    setReadingState(false);
    dot.classList.remove('shown');
    rightSlot.setPage(page, true, -1);
  };
  utter.onerror = () => {
    setReadingState(false);
    dot.classList.remove('shown');
  };
  window.speechSynthesis.speak(utter);
}

// ---------------- open / flip ----------------
async function openBook() {
  if (opened) return;
  opened = true;
  openBtn.classList.add('hidden');
  dragHint.classList.add('hidden');

  await tween(1100, (t) => {
    flapPivot.rotation.z = -Math.PI * t;
    flapPivot.position.y = THREE.MathUtils.lerp(BOOK_T - COVER_T, COVER_T, t);
    closedBook.position.x = THREE.MathUtils.lerp(0, BOOK_W / 2, t);
  });

  controlsEl.classList.add('visible');
  updateIndicator();
}

async function flip(direction) {
  if (flipping || !opened) return;
  if (direction === 1 && current + 2 >= PAGES.length) return;
  if (direction === -1 && current <= 0) return;
  flipping = true;
  stopReading();

  const pivot = new THREE.Object3D();
  bookRoot.add(pivot);

  const frontSlot = createPageSlot();
  const backSlot = createPageSlot(true);

  let boardLocalX, yStart, yEnd, endRot;
  if (direction === 1) {
    boardLocalX = BOOK_W / 2;
    yStart = RIGHT_SURFACE_Y;
    yEnd = LEFT_SURFACE_Y + COVER_T;
    endRot = -Math.PI;
    await Promise.all([
      frontSlot.setPage(PAGES[current + 1], true),
      backSlot.setPage(PAGES[current + 2] ?? PAGES[current + 1], false),
    ]);
  } else {
    boardLocalX = -BOOK_W / 2;
    yStart = LEFT_SURFACE_Y;
    yEnd = RIGHT_SURFACE_Y + COVER_T;
    endRot = Math.PI;
    await Promise.all([
      frontSlot.setPage(PAGES[current], false),
      backSlot.setPage(PAGES[current - 1] ?? PAGES[current], true),
    ]);
  }

  const board = new THREE.Mesh(
    new THREE.BoxGeometry(BOOK_W, COVER_T, BOOK_D),
    [sideMat, spineMat, frontSlot.material, backSlot.material, sideMat, sideMat],
  );
  board.position.set(boardLocalX, COVER_T / 2, 0);
  board.castShadow = true;
  pivot.position.set(0, yStart, 0);
  pivot.add(board);

  await tween(900, (t) => {
    pivot.rotation.z = endRot * t;
    pivot.position.y = THREE.MathUtils.lerp(yStart, yEnd, t);
  });

  current = direction === 1 ? current + 2 : current - 2;
  if (current < 0) current = 0;

  await Promise.all([
    rightSlot.setPage(PAGES[current + 1] ?? PAGES[current], true),
    leftSlot.setPage(PAGES[current], false),
  ]);

  bookRoot.remove(pivot);
  board.geometry.dispose();
  frontSlot.dispose();
  backSlot.dispose();
  updateIndicator();
  flipping = false;
}

// ---------------- wiring ----------------
openBtn.addEventListener('click', openBook);
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

function animate() {
  requestAnimationFrame(animate);
  orbit.update();
  renderer.render(scene, camera);
}
animate();

// ---------------- initial textures ----------------
(async () => {
  await Promise.all([
    coverSlot.setPage({ illustration: COVER_SVG, text: '' }, false),
    leftSlot.setPage(PAGES[0], false),
    rightSlot.setPage(PAGES[1], true),
  ]);
})();
