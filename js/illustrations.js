/* Original hand-coded vector illustrations (no external art/assets). */

function svgWrap(inner, viewBox = '0 0 600 420') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function defsBlock() {
  return `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#aee3f6"/>
      <stop offset="100%" stop-color="#eaf7e0"/>
    </linearGradient>
    <linearGradient id="skyEvening" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f7c977"/>
      <stop offset="100%" stop-color="#fef0d6"/>
    </linearGradient>
    <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#283b66"/>
      <stop offset="100%" stop-color="#5b6e9c"/>
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff6d0"/>
      <stop offset="100%" stop-color="#ffd966"/>
    </radialGradient>
    <linearGradient id="barnRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b04a3a"/>
      <stop offset="100%" stop-color="#8c2f2f"/>
    </linearGradient>
    <linearGradient id="pigPink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffd9d0"/>
      <stop offset="100%" stop-color="#f7a8a0"/>
    </linearGradient>
  </defs>`;
}

function sky(kind = 'day') {
  const fill = kind === 'evening' ? 'url(#skyEvening)' : kind === 'night' ? 'url(#skyNight)' : 'url(#sky)';
  return `<rect x="0" y="0" width="600" height="320" fill="${fill}"/>`;
}

function sun(x = 500, y = 70, r = 38) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#sun)"/>`;
}

function moonStars() {
  let stars = '';
  const pos = [[60,40],[140,80],[220,30],[340,60],[420,25],[500,90],[80,120],[260,110]];
  pos.forEach(([x,y]) => { stars += `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" opacity="0.9"/>`; });
  return `<circle cx="500" cy="60" r="34" fill="#f4f1e0"/><circle cx="512" cy="52" r="30" fill="#283b66"/>${stars}`;
}

function grassHill() {
  return `
  <path d="M0,260 Q150,210 300,255 T600,250 L600,420 L0,420 Z" fill="#8fbf5a"/>
  <path d="M0,300 Q150,270 300,300 T600,290 L600,420 L0,420 Z" fill="#6fa23f"/>`;
}

function fenceRow(y = 300) {
  let posts = '';
  for (let x = 20; x < 580; x += 70) {
    posts += `<rect x="${x}" y="${y - 38}" width="10" height="46" rx="2" fill="#a9743f"/>`;
  }
  return `${posts}<rect x="10" y="${y - 24}" width="560" height="8" rx="3" fill="#a9743f"/><rect x="10" y="${y - 8}" width="560" height="8" rx="3" fill="#946338"/>`;
}

function barn(x = 60, y = 150, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <rect x="0" y="60" width="220" height="120" fill="url(#barnRed)"/>
    <polygon points="0,60 110,-10 220,60" fill="#7a2424"/>
    <rect x="90" y="20" width="40" height="40" fill="#5e1c1c"/>
    <polygon points="90,20 110,4 130,20" fill="#5e1c1c"/>
    <rect x="80" y="110" width="60" height="70" fill="#5e1c1c" rx="4"/>
    <rect x="20" y="90" width="34" height="34" fill="#fbe9b8" stroke="#5e1c1c" stroke-width="4"/>
    <rect x="166" y="90" width="34" height="34" fill="#fbe9b8" stroke="#5e1c1c" stroke-width="4"/>
    <rect x="-6" y="178" width="232" height="10" fill="#4a2f1c"/>
  </g>`;
}

function farmhouse(x = 380, y = 190, scale = 0.8) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <rect x="0" y="40" width="140" height="80" fill="#f3e3c4"/>
    <polygon points="0,40 70,-10 140,40" fill="#7a4e2a"/>
    <rect x="55" y="70" width="30" height="50" fill="#8c5a30"/>
    <rect x="14" y="60" width="22" height="22" fill="#aee3f6" stroke="#7a4e2a" stroke-width="3"/>
    <rect x="104" y="60" width="22" height="22" fill="#aee3f6" stroke="#7a4e2a" stroke-width="3"/>
    <rect x="60" y="-2" width="20" height="26" fill="#5e3a1c"/>
  </g>`;
}

// ----- Characters -----

function pigWilbur(x = 300, y = 260, scale = 1, mood = 'happy') {
  const mouth = mood === 'sad'
    ? `<path d="M-10,18 Q0,10 10,18" stroke="#7a3b3b" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M-10,14 Q0,24 10,14" stroke="#7a3b3b" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="20" rx="58" ry="42" fill="url(#pigPink)"/>
    <ellipse cx="-46" cy="10" rx="16" ry="20" fill="#f7a8a0"/>
    <ellipse cx="44" cy="10" rx="16" ry="20" fill="#f7a8a0"/>
    <circle cx="0" cy="-18" r="34" fill="url(#pigPink)"/>
    <ellipse cx="-22" cy="-46" rx="10" ry="14" fill="#f7a8a0" transform="rotate(-20 -22 -46)"/>
    <ellipse cx="22" cy="-46" rx="10" ry="14" fill="#f7a8a0" transform="rotate(20 22 -46)"/>
    <ellipse cx="0" cy="-6" rx="16" ry="11" fill="#f08a82"/>
    <circle cx="-6" cy="-6" r="2.6" fill="#7a3b3b"/>
    <circle cx="6" cy="-6" r="2.6" fill="#7a3b3b"/>
    <circle cx="-13" cy="-26" r="3.4" fill="#3a2c1a"/>
    <circle cx="13" cy="-26" r="3.4" fill="#3a2c1a"/>
    ${mouth}
    <path d="M52,30 q14,-4 10,14" stroke="#f08a82" stroke-width="6" fill="none" stroke-linecap="round"/>
  </g>`;
}

function spiderCharlotte(x = 300, y = 200, scale = 1) {
  const legs = [];
  for (let i = 0; i < 4; i++) {
    const ang = -55 + i * 30;
    legs.push(`<line x1="0" y1="0" x2="0" y2="34" transform="translate(0,0) rotate(${ang})" stroke="#5b5b66" stroke-width="3" stroke-linecap="round"/>`);
    legs.push(`<line x1="0" y1="0" x2="0" y2="34" transform="translate(0,0) rotate(${180 - ang})" stroke="#5b5b66" stroke-width="3" stroke-linecap="round"/>`);
  }
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <g>${legs.join('')}</g>
    <ellipse cx="0" cy="6" rx="15" ry="12" fill="#5b5b66"/>
    <circle cx="0" cy="-12" r="9" fill="#46464f"/>
    <circle cx="-3.5" cy="-13" r="1.6" fill="#fff"/>
    <circle cx="3.5" cy="-13" r="1.6" fill="#fff"/>
  </g>`;
}

function girlFern(x = 120, y = 250, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <path d="M-26,70 L26,70 L18,8 Q0,-2 -18,8 Z" fill="#f2c84b"/>
    <circle cx="0" cy="-18" r="22" fill="#ffe0c2"/>
    <path d="M-22,-22 Q0,-46 22,-22 Q22,-34 0,-38 Q-22,-34 -22,-22Z" fill="#7a4a2a"/>
    <circle cx="-8" cy="-18" r="2.4" fill="#3a2c1a"/>
    <circle cx="8" cy="-18" r="2.4" fill="#3a2c1a"/>
    <path d="M-6,-8 Q0,-4 6,-8" stroke="#a85d4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="-10" y="70" width="8" height="24" fill="#ffe0c2"/>
    <rect x="2" y="70" width="8" height="24" fill="#ffe0c2"/>
  </g>`;
}

function farmerZuckerman(x = 460, y = 250, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <rect x="-24" y="0" width="48" height="70" rx="10" fill="#5c7a9c"/>
    <circle cx="0" cy="-26" r="22" fill="#ffe0c2"/>
    <path d="M-24,-30 Q0,-52 24,-30 L24,-40 Q0,-56 -24,-40 Z" fill="#8c8c8c"/>
    <rect x="-26" y="-44" width="52" height="10" rx="4" fill="#8c8c8c"/>
    <circle cx="-7" cy="-26" r="2.2" fill="#3a2c1a"/>
    <circle cx="7" cy="-26" r="2.2" fill="#3a2c1a"/>
  </g>`;
}

function goose(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="10" rx="22" ry="16" fill="#f4f4ec"/>
    <circle cx="14" cy="-10" r="11" fill="#f4f4ec"/>
    <polygon points="22,-10 34,-7 22,-4" fill="#f2a93b"/>
    <circle cx="16" cy="-13" r="1.6" fill="#3a2c1a"/>
  </g>`;
}

function sheep(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="6" rx="26" ry="18" fill="#f6f6f0"/>
    <circle cx="-10" cy="-6" r="8" fill="#f6f6f0"/>
    <circle cx="2" cy="-10" r="8" fill="#f6f6f0"/>
    <circle cx="14" cy="-6" r="8" fill="#f6f6f0"/>
    <ellipse cx="24" cy="2" rx="9" ry="7" fill="#5b5048"/>
    <circle cx="27" cy="0" r="1.4" fill="#fff"/>
  </g>`;
}

function rat(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="6" rx="20" ry="11" fill="#8a8a8a"/>
    <circle cx="16" cy="0" r="9" fill="#8a8a8a"/>
    <circle cx="20" cy="-3" r="2" fill="#3a2c1a"/>
    <path d="M-20,8 Q-36,16 -34,4" stroke="#8a8a8a" stroke-width="3" fill="none"/>
    <ellipse cx="22" cy="6" rx="3" ry="5" fill="#d99"/>
  </g>`;
}

function webCircle(cx, cy, r, text, color = '#e8e8e8') {
  let rings = '';
  for (let ring = r * 0.3; ring <= r; ring += r * 0.23) {
    rings += `<circle cx="${cx}" cy="${cy}" r="${ring}" fill="none" stroke="${color}" stroke-width="1.4" opacity="0.85"/>`;
  }
  let spokes = '';
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI * 2 * i) / 10;
    const x2 = cx + r * Math.cos(ang);
    const y2 = cy + r * Math.sin(ang);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.2" opacity="0.85"/>`;
  }
  const label = text
    ? `<text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="Baloo 2, cursive" font-size="${r * 0.34}" font-weight="700" fill="#3a2c1a" stroke="#fff" stroke-width="3" paint-order="stroke">${text}</text>`
    : '';
  return `<g>${spokes}${rings}${label}</g>`;
}

function eggSac(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="20" ry="16" fill="#e9e3cf" stroke="#cdbf9a" stroke-width="2"/>
    <line x1="-10" y1="-16" x2="-4" y2="-30" stroke="#cdbf9a" stroke-width="1.5"/>
    <line x1="10" y1="-16" x2="4" y2="-30" stroke="#cdbf9a" stroke-width="1.5"/>
  </g>`;
}

function babySpiders() {
  const positions = [[0,0],[40,-10],[-40,8],[80,10],[-75,-6],[20,30],[-20,34]];
  return positions.map(([dx, dy]) => spiderCharlotte(300 + dx, 230 + dy, 0.55)).join('');
}

function fairTent(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <polygon points="0,-70 70,0 -70,0" fill="#e6e0d0"/>
    <polygon points="0,-70 23,0 -23,0" fill="#c23b3b"/>
    <polygon points="-46,0 -23,-46 0,0" fill="#c23b3b"/>
    <polygon points="46,0 23,-46 0,0" fill="#c23b3b"/>
    <rect x="-70" y="0" width="140" height="50" fill="#f3ecd8"/>
    <line x1="0" y1="-70" x2="0" y2="-86" stroke="#5e3a1c" stroke-width="3"/>
    <polygon points="0,-86 14,-80 0,-74" fill="#c23b3b"/>
  </g>`;
}

function ribbon(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <polygon points="-14,10 14,10 18,40 0,28 -18,40" fill="#3b6fc2"/>
    <circle cx="0" cy="-4" r="22" fill="#5b8fe0"/>
    <circle cx="0" cy="-4" r="14" fill="#fde9a8"/>
    <text x="0" y="0" text-anchor="middle" font-family="Baloo 2, cursive" font-size="11" font-weight="700" fill="#5b3a0e">No.1</text>
  </g>`;
}

function cloud(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <ellipse cx="0" cy="0" rx="34" ry="16" fill="#fff" opacity="0.85"/>
    <ellipse cx="-22" cy="6" rx="20" ry="12" fill="#fff" opacity="0.85"/>
    <ellipse cx="24" cy="6" rx="22" ry="13" fill="#fff" opacity="0.85"/>
  </g>`;
}

function appleTree(x, y, scale = 1) {
  return `
  <g transform="translate(${x},${y}) scale(${scale})">
    <rect x="-8" y="40" width="16" height="50" fill="#7a4e2a"/>
    <circle cx="0" cy="10" r="48" fill="#6fa23f"/>
    <circle cx="-20" cy="20" r="4" fill="#c23b3b"/>
    <circle cx="18" cy="-4" r="4" fill="#c23b3b"/>
    <circle cx="6" cy="30" r="4" fill="#c23b3b"/>
  </g>`;
}

function snowfall() {
  let flakes = '';
  const pos = [[40,40],[120,90],[200,30],[300,70],[380,20],[460,100],[520,50],[80,140],[260,120],[440,150]];
  pos.forEach(([x, y]) => { flakes += `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" opacity="0.9"/>`; });
  return flakes;
}

function heart(x, y, scale = 1, color = '#e0556b') {
  return `<path d="M${x},${y + 8 * scale} C${x - 14 * scale},${y - 8 * scale} ${x - 26 * scale},${y + 10 * scale} ${x},${y + 26 * scale} C${x + 26 * scale},${y + 10 * scale} ${x + 14 * scale},${y - 8 * scale} ${x},${y + 8 * scale} Z" fill="${color}"/>`;
}

window.Illustrations = {
  svgWrap, defsBlock, sky, sun, moonStars, grassHill, fenceRow, barn, farmhouse,
  pigWilbur, spiderCharlotte, girlFern, farmerZuckerman, goose, sheep, rat,
  webCircle, eggSac, babySpiders, fairTent, ribbon, heart, cloud, appleTree, snowfall,
};
