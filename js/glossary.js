/* Tap-to-learn dictionary for words a young reader might not know yet.
   Each entry has a short, simple definition and a tiny hand-drawn icon. */

(function () {
  const INK = '#3a2c1a';

  function icon(bg, inner) {
    return `<svg viewBox="0 0 120 120" width="84" height="84" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="${bg}"/>
      ${inner}
    </svg>`;
  }

  function faceIcon(bg, skin, mouthPath, browPath = '', extra = '') {
    return icon(bg, `
      <circle cx="60" cy="64" r="30" fill="${skin}"/>
      <circle cx="49" cy="58" r="3.4" fill="${INK}"/>
      <circle cx="71" cy="58" r="3.4" fill="${INK}"/>
      ${browPath}
      <path d="${mouthPath}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${extra}
    `);
  }

  function sparkle(cx, cy, r, color) {
    return `<path d="M${cx},${cy - r} L${cx + r * 0.28},${cy - r * 0.28} L${cx + r},${cy} L${cx + r * 0.28},${cy + r * 0.28} L${cx},${cy + r} L${cx - r * 0.28},${cy + r * 0.28} L${cx - r},${cy} L${cx - r * 0.28},${cy - r * 0.28} Z" fill="${color}"/>`;
  }

  const ICONS = {
    terrified: faceIcon('#ffe1de', '#ffd9a0',
      'M50,76 Q60,68 70,76',
      `<path d="M42,46 Q49,40 56,46" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M64,46 Q71,40 78,46" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      `<ellipse cx="38" cy="50" rx="3" ry="6" fill="#bfe6ff"/>`),

    terrible: faceIcon('#ffe9d6', '#ffd9a0', 'M50,80 Q60,70 70,80',
      `<path d="M44,48 Q50,52 56,49" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M64,49 Q70,52 76,48" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      `<ellipse cx="50" cy="68" rx="2.6" ry="5" fill="#bfe6ff"/>`),

    secret: icon('#fde9ff', `
      <rect x="42" y="56" width="36" height="28" rx="6" fill="#cf9bdb"/>
      <path d="M48,56 a12,16 0 0 1 24,0" stroke="#cf9bdb" stroke-width="7" fill="none"/>
      <circle cx="60" cy="70" r="5" fill="#7a4e8f"/>
      <rect x="57" y="72" width="6" height="9" rx="2" fill="#7a4e8f"/>
    `),

    promise: icon('#ffe9e9', `
      <path d="M30,60 C30,40 50,40 50,58 C50,40 70,40 70,58 C70,40 90,40 90,60 C90,78 60,92 60,92 C60,92 30,78 30,60 Z" fill="#e0556b"/>
      <path d="M44,62 l9,9 18,-20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    `),

    patient: icon('#e6f7ff', `
      <circle cx="60" cy="64" r="30" fill="#fff8ec" stroke="#2f8fd0" stroke-width="4"/>
      <path d="M60,64 L60,46" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <path d="M60,64 L76,68" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="60" cy="64" r="3" fill="${INK}"/>
      <path d="M50,90 Q60,98 70,90" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    spinning: icon('#f0e6ff', `
      <path d="M60,60 m0,0 q14,0 14,14 q0,18 -18,18 q-22,0 -22,-22 q0,-26 26,-26 q30,0 30,30" stroke="#7a5fc4" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="60" cy="60" r="3" fill="#7a5fc4"/>
    `),

    wondrous: icon('#fff6da', `
      ${sparkle(60, 60, 26, '#f0b429')}
      ${sparkle(34, 40, 9, '#f0b429')}
      ${sparkle(88, 44, 7, '#f0b429')}
    `),

    grumbled: faceIcon('#e8e8e8', '#cfcfcf', 'M50,76 Q60,70 70,76',
      `<path d="M44,49 Q50,44 57,48" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M63,48 Q70,44 76,49" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      `<path d="M84,40 q10,-4 6,8 q6,-2 4,6" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`),

    dump: icon('#e9e2d2', `
      <ellipse cx="60" cy="86" rx="34" ry="8" fill="#bdb190"/>
      <path d="M34,84 q4,-26 16,-22 q4,-14 18,-8 q14,-6 18,10 q10,-2 10,16 Z" fill="#a9967a"/>
      <path d="M50,68 q4,-6 10,-2" stroke="#7a6850" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="76" cy="70" r="4" fill="#7a6850"/>
    `),

    radiant: icon('#fff3c2', `
      <circle cx="60" cy="60" r="18" fill="#f0b429"/>
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 60 + Math.cos(rad) * 26, y1 = 60 + Math.sin(rad) * 26;
        const x2 = 60 + Math.cos(rad) * 40, y2 = 60 + Math.sin(rad) * 40;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f0b429" stroke-width="5" stroke-linecap="round"/>`;
      }).join('')}
    `),

    sparkled: icon('#fff0f6', `
      ${sparkle(60, 56, 16, '#e8a6c4')}
      ${sparkle(36, 78, 8, '#e8a6c4')}
      ${sparkle(86, 70, 7, '#e8a6c4')}
      ${sparkle(78, 36, 6, '#e8a6c4')}
    `),

    fairground: icon('#e6f0ff', `
      <circle cx="60" cy="56" r="26" fill="none" stroke="#2f8fd0" stroke-width="4"/>
      <line x1="60" y1="30" x2="60" y2="82" stroke="#2f8fd0" stroke-width="3"/>
      <line x1="34" y1="56" x2="86" y2="56" stroke="#2f8fd0" stroke-width="3"/>
      <line x1="42" y1="38" x2="78" y2="74" stroke="#2f8fd0" stroke-width="3"/>
      <line x1="78" y1="38" x2="42" y2="74" stroke="#2f8fd0" stroke-width="3"/>
      <circle cx="60" cy="30" r="5" fill="#e0453f"/>
      <circle cx="60" cy="82" r="5" fill="#3f9e4d"/>
      <circle cx="34" cy="56" r="5" fill="#d8a418"/>
      <circle cx="86" cy="56" r="5" fill="#5a5fd6"/>
      <rect x="50" y="92" width="20" height="8" rx="2" fill="#a9743f"/>
    `),

    buttermilk: icon('#fff8ec', `
      <path d="M46,40 h28 l-6,50 a6,6 0 0 1 -16,0 Z" fill="#fff" stroke="#d8cba0" stroke-width="3"/>
      <path d="M48,56 h24" stroke="#cfe8f7" stroke-width="6"/>
      <path d="M50,56 h20 v32 a4,4 0 0 1 -8,2 a4,4 0 0 1 -12,-2 Z" fill="#eef7ff"/>
    `),

    leftovers: icon('#ffece0', `
      <circle cx="60" cy="64" r="28" fill="#fff" stroke="#e3c79a" stroke-width="4"/>
      <circle cx="60" cy="64" r="18" fill="none" stroke="#e3c79a" stroke-width="2"/>
      <ellipse cx="52" cy="60" rx="7" ry="5" fill="#c23b3b"/>
      <ellipse cx="68" cy="68" rx="6" ry="4" fill="#6fa23f"/>
      <ellipse cx="62" cy="56" rx="5" ry="4" fill="#f0b429"/>
    `),

    enormous: icon('#e6fff0', `
      <circle cx="48" cy="62" r="26" fill="#7fbf6f"/>
      <circle cx="86" cy="78" r="9" fill="#7fbf6f"/>
    `),

    whispered: icon('#f0e9ff', `
      <path d="M36,50 q-6,18 6,32 q14,10 30,4" fill="#dcc7f7" stroke="#9a6fd6" stroke-width="3"/>
      <circle cx="52" cy="58" r="3" fill="${INK}"/>
      <path d="M70,62 q8,-4 8,4" stroke="#9a6fd6" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M80,58 q12,2 8,14" stroke="#9a6fd6" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M86,72 q12,0 10,12" stroke="#9a6fd6" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    judges: icon('#eef0f5', `
      <rect x="44" y="42" width="22" height="14" rx="3" fill="#8c6a45" transform="rotate(-30 55 49)"/>
      <line x1="62" y1="58" x2="80" y2="76" stroke="#8c6a45" stroke-width="6" stroke-linecap="round"/>
      <rect x="40" y="84" width="40" height="10" rx="3" fill="#6a4e30"/>
    `),

    amazement: icon('#fff7e0', `
      <circle cx="46" cy="62" r="13" fill="#fff"/>
      <circle cx="74" cy="62" r="13" fill="#fff"/>
      <circle cx="46" cy="62" r="5" fill="${INK}"/>
      <circle cx="74" cy="62" r="5" fill="${INK}"/>
      <rect x="57" y="32" width="6" height="18" rx="3" fill="#f0b429"/>
      <circle cx="60" cy="56" r="0" />
      <circle cx="60" cy="56" r="3" fill="#f0b429"/>
    `),

    mischievous: faceIcon('#f5e6ff', '#ffd9a0', 'M48,76 Q60,84 74,72',
      `<path d="M42,52 q7,-6 14,0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      `<line x1="64" y1="58" x2="76" y2="58" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`),

    fuss: icon('#ffe9e9', `
      <path d="M34,50 q8,-10 16,0 q8,-10 16,0" stroke="#e0453f" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M64,70 q8,-10 16,0 q8,-10 16,0" stroke="#e0453f" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="88" r="4" fill="#e0453f"/>
      <circle cx="70" cy="40" r="4" fill="#e0453f"/>
    `),

    excitement: icon('#fff0e0', `
      ${sparkle(60, 58, 22, '#e88a2b')}
      <rect x="30" y="34" width="6" height="6" fill="#2f8fd0" transform="rotate(20 33 37)"/>
      <rect x="86" y="36" width="6" height="6" fill="#3f9e4d" transform="rotate(-15 89 39)"/>
      <rect x="34" y="84" width="6" height="6" fill="#a945c4" transform="rotate(10 37 87)"/>
      <rect x="84" y="82" width="6" height="6" fill="#d8a418" transform="rotate(-20 87 85)"/>
    `),

    strength: icon('#e6f5ff', `
      <path d="M38,86 q0,-22 16,-26 q-4,-10 8,-14 q12,-4 14,8 q10,-2 12,10 q2,12 -10,16 q4,12 -8,16 Z" fill="#f3a07a"/>
      <circle cx="60" cy="56" r="9" fill="#f3a07a"/>
    `),

    papery: icon('#f7f3e8', `
      <path d="M40,32 h32 l8,8 v48 h-40 Z" fill="#fff" stroke="#d8cba0" stroke-width="3"/>
      <path d="M72,32 v8 h8 Z" fill="#eee0bd"/>
      <line x1="46" y1="56" x2="74" y2="56" stroke="#d8cba0" stroke-width="3"/>
      <line x1="46" y1="68" x2="74" y2="68" stroke="#d8cba0" stroke-width="3"/>
      <line x1="46" y1="80" x2="64" y2="80" stroke="#d8cba0" stroke-width="3"/>
    `),

    peaceful: icon('#e8f0ff', `
      <path d="M44,40 a24,24 0 1 0 28,38 a20,20 0 1 1 -28,-38 Z" fill="#f4f1e0"/>
      <circle cx="80" cy="36" r="2.4" fill="#fff"/>
      <circle cx="90" cy="50" r="2" fill="#fff"/>
      <circle cx="70" cy="28" r="1.8" fill="#fff"/>
      <path d="M48,78 q4,4 8,0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    precious: icon('#ffe9f0', `
      <path d="M40,58 C40,46 52,46 60,56 C68,46 80,46 80,58 C80,72 60,84 60,84 C60,84 40,72 40,58 Z" fill="#e0556b"/>
      ${sparkle(82, 38, 8, '#f0b429')}
    `),

    drifted: icon('#eaf6ff', `
      <ellipse cx="54" cy="54" rx="22" ry="13" fill="#fff"/>
      <ellipse cx="38" cy="58" rx="13" ry="9" fill="#fff"/>
      <ellipse cx="70" cy="58" rx="15" ry="10" fill="#fff"/>
      <path d="M30,80 q10,4 20,0" stroke="#bcd9ec" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M50,90 q10,4 20,0" stroke="#bcd9ec" stroke-width="3" fill="none" stroke-linecap="round"/>
    `),

    stir: icon('#f0fff0', `
      <ellipse cx="60" cy="70" rx="28" ry="16" fill="#fff" stroke="#cfe3b0" stroke-width="3"/>
      <path d="M60,70 q8,-14 0,-22 q-8,8 0,16" stroke="#6fa23f" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="78" y1="40" x2="62" y2="60" stroke="#a9743f" stroke-width="4" stroke-linecap="round"/>
    `),

    specks: icon('#f5f5f5', `
      <circle cx="40" cy="46" r="3" fill="#9a8b6f"/>
      <circle cx="62" cy="40" r="2" fill="#9a8b6f"/>
      <circle cx="80" cy="52" r="2.6" fill="#9a8b6f"/>
      <circle cx="50" cy="64" r="2.2" fill="#9a8b6f"/>
      <circle cx="72" cy="74" r="3" fill="#9a8b6f"/>
      <circle cx="36" cy="78" r="2" fill="#9a8b6f"/>
      <circle cx="60" cy="86" r="2.4" fill="#9a8b6f"/>
    `),

    breeze: icon('#e6faff', `
      <path d="M28,50 q20,-10 40,0 q14,6 22,-2" stroke="#6fb6d8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M32,66 q20,-8 36,2" stroke="#6fb6d8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M40,82 q14,-6 26,0" stroke="#6fb6d8" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M84,46 q6,4 2,10 q4,2 2,8" fill="#6fa23f"/>
    `),

    crate: icon('#f3e6d2', `
      <rect x="34" y="40" width="52" height="44" fill="#c79257" stroke="#8c5a30" stroke-width="3"/>
      <line x1="34" y1="40" x2="86" y2="84" stroke="#8c5a30" stroke-width="3"/>
      <line x1="86" y1="40" x2="34" y2="84" stroke="#8c5a30" stroke-width="3"/>
      <rect x="34" y="40" width="52" height="44" fill="none" stroke="#8c5a30" stroke-width="4"/>
    `),

    trough: icon('#eef5e6', `
      <path d="M30,52 h60 l-8,28 a6,6 0 0 1 -6,5 h-32 a6,6 0 0 1 -6,-5 Z" fill="#bdb190" stroke="#8c7a52" stroke-width="3"/>
      <path d="M38,58 h44" stroke="#dfe7c9" stroke-width="5"/>
    `),

    memory: icon('#f0eaff', `
      <ellipse cx="58" cy="54" rx="26" ry="18" fill="#fff"/>
      <circle cx="36" cy="76" r="7" fill="#fff"/>
      <circle cx="28" cy="88" r="4" fill="#fff"/>
      <path d="M50,52 C50,46 56,46 58,50 C60,46 66,46 66,52 C66,58 58,64 58,64 C58,64 50,58 50,52 Z" fill="#cf9bdb"/>
    `),
  };

  const DEFINITIONS = {
    terrified: 'So, so scared — much more scared than just a little worried.',
    terrible: 'Very bad, or very upsetting.',
    secret: "Something special that you don't tell everyone.",
    promise: 'When you say you will really, truly do something.',
    patient: 'Waiting calmly, without getting upset, even if it takes a while.',
    spinning: 'Twisting silky thread round and round to make something, like a web.',
    wondrous: 'So amazing it makes you say "wow!"',
    grumbled: 'Said something in a low, grouchy, unhappy voice.',
    dump: "A place where people leave things they don't want anymore.",
    radiant: 'Glowing and bright, like warm sunshine.',
    sparkled: 'Twinkled and shined with little flashes of light.',
    fairground: 'A fun outdoor place with rides, games, and animal shows.',
    buttermilk: 'A creamy drink made from milk.',
    leftovers: 'Food that is left over after everyone has eaten.',
    enormous: 'Extremely, incredibly big.',
    whispered: 'Spoke in a soft, very quiet voice.',
    judges: 'People whose job is to decide who did the best at something.',
    amazement: 'The feeling you get when something surprises and amazes you.',
    mischievous: 'A little bit naughty, in a fun, playful way.',
    fuss: 'A lot of noise and bother over something small.',
    excitement: 'A happy, eager, jumpy feeling inside.',
    strength: 'How strong or powerful someone or something is.',
    papery: 'Thin and a little bit like paper.',
    peaceful: 'Calm, quiet, and gentle, with nothing to worry about.',
    precious: 'Loved very much and very important to someone.',
    drifted: 'Moved slowly and gently, carried along like a leaf on the wind.',
    stir: 'To start moving just a tiny little bit.',
    specks: 'Teeny tiny little dots, almost too small to see.',
    breeze: 'A soft, gentle wind.',
    crate: 'A big wooden box used for carrying things.',
    trough: 'A long, open container that animals eat or drink from.',
    memory: 'Something you remember from a long time ago.',
  };

  const FORMS = {
    terrified: 'terrified',
    terrible: 'terrible', terribly: 'terrible',
    secret: 'secret', secrets: 'secret',
    promise: 'promise', promised: 'promise', promises: 'promise',
    patient: 'patient', patiently: 'patient',
    spinning: 'spinning', spin: 'spinning', spun: 'spinning',
    wondrous: 'wondrous',
    grumbled: 'grumbled', grumbling: 'grumbled', grumbles: 'grumbled',
    dump: 'dump',
    radiant: 'radiant',
    sparkled: 'sparkled', sparkle: 'sparkled', sparkles: 'sparkled',
    fairground: 'fairground', fairgrounds: 'fairground',
    buttermilk: 'buttermilk',
    leftovers: 'leftovers', leftover: 'leftovers',
    enormous: 'enormous',
    whispered: 'whispered', whisper: 'whispered', whispers: 'whispered',
    judges: 'judges', judge: 'judges',
    amazement: 'amazement',
    mischievous: 'mischievous',
    fuss: 'fuss',
    excitement: 'excitement', excited: 'excitement',
    strength: 'strength',
    papery: 'papery',
    peaceful: 'peaceful',
    precious: 'precious',
    drifted: 'drifted', drift: 'drifted',
    stir: 'stir', stirred: 'stir',
    specks: 'specks', speck: 'specks',
    breeze: 'breeze',
    crate: 'crate', crates: 'crate',
    trough: 'trough', troughs: 'trough',
    memory: 'memory', memories: 'memory',
  };

  function normalize(word) {
    return word.toLowerCase().replace(/[^a-z']/g, '').replace(/^'+|'+$/g, '');
  }

  window.WordGlossary = {
    lookup(word) {
      const key = FORMS[normalize(word)];
      if (!key) return null;
      return { key, definition: DEFINITIONS[key], icon: ICONS[key] };
    },
  };
})();
