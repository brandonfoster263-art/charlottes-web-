/* Original retelling — character names and plot beats follow the classic
   farmyard-friendship story, but every sentence below is newly written,
   simplified for an early reader, not quoted from any existing book. */

(function () {
  const I = window.Illustrations;
  const wrap = (inner) => I.svgWrap(I.defsBlock() + inner);

  const illoCover = wrap(`
    ${I.sky('evening')}
    ${I.sun(120, 70, 44)}
    ${I.grassHill()}
    ${I.barn(330, 150, 0.85)}
    ${I.webCircle(150, 120, 78, '')}
    ${I.spiderCharlotte(150, 120, 1.3)}
    ${I.pigWilbur(300, 300, 1.5)}
  `);

  const illoTitle = wrap(`
    ${I.sky('day')}
    ${I.sun(500, 60, 36)}
    ${I.grassHill()}
    ${I.farmhouse(60, 190, 0.9)}
    ${I.barn(330, 170, 0.75)}
    ${I.fenceRow(310)}
  `);

  const illo1 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 30)}
    ${I.grassHill()}
    ${I.farmhouse(360, 170, 0.85)}
    ${I.girlFern(150, 250, 1.1)}
    ${I.pigWilbur(280, 300, 0.6, 'happy')}
  `);

  const illo2 = wrap(`
    ${I.sky('day')}
    ${I.sun(520, 50, 32)}
    ${I.grassHill()}
    ${I.barn(150, 110, 1.1)}
    ${I.fenceRow(330)}
    ${I.pigWilbur(150, 320, 0.85, 'happy')}
  `);

  const illo3 = wrap(`
    ${I.sky('evening')}
    ${I.sun(520, 70, 30)}
    ${I.grassHill()}
    ${I.barn(380, 150, 0.7)}
    ${I.fenceRow(320)}
    ${I.pigWilbur(220, 300, 1, 'sad')}
  `);

  const illo4 = wrap(`
    ${I.sky('day')}
    ${I.sun(520, 50, 30)}
    ${I.grassHill()}
    ${I.fenceRow(330)}
    ${I.goose(140, 300, 1.2)}
    ${I.sheep(420, 300, 1.2)}
    ${I.pigWilbur(290, 320, 1, 'happy')}
  `);

  const illo5 = wrap(`
    ${I.sky('night')}
    ${I.moonStars()}
    ${I.grassHill()}
    ${I.barn(360, 150, 0.7)}
    ${I.webCircle(420, 150, 60, '')}
    ${I.spiderCharlotte(420, 150, 1.1)}
    ${I.pigWilbur(220, 300, 1, 'happy')}
  `);

  const illo6 = wrap(`
    ${I.sky('evening')}
    ${I.sun(520, 90, 26)}
    ${I.grassHill()}
    ${I.fenceRow(320)}
    ${I.farmerZuckerman(440, 230, 0.9)}
    ${I.pigWilbur(230, 300, 1, 'sad')}
  `);

  const illo7 = wrap(`
    ${I.sky('night')}
    ${I.moonStars()}
    ${I.grassHill()}
    ${I.barn(360, 150, 0.65)}
    ${I.webCircle(420, 160, 55, '')}
    ${I.spiderCharlotte(420, 160, 1.2)}
    ${I.pigWilbur(220, 300, 1, 'happy')}
  `);

  const illo8 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 28)}
    ${I.grassHill()}
    ${I.barn(330, 150, 0.7)}
    ${I.webCircle(300, 130, 95, 'SOME PIG')}
    ${I.pigWilbur(300, 320, 1.1, 'happy')}
  `);

  const illo9 = wrap(`
    ${I.sky('day')}
    ${I.sun(500, 50, 28)}
    ${I.grassHill()}
    ${I.barn(220, 150, 0.6)}
    ${I.webCircle(280, 130, 80, 'SOME PIG')}
    ${I.girlFern(80, 300, 0.8)}
    ${I.farmerZuckerman(440, 300, 0.8)}
    ${I.pigWilbur(280, 330, 0.9, 'happy')}
  `);

  const illo10 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 28)}
    ${I.grassHill()}
    ${I.barn(330, 150, 0.7)}
    ${I.webCircle(300, 130, 95, 'TERRIFIC')}
    ${I.pigWilbur(300, 320, 1.1, 'happy')}
  `);

  const illo11 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 26)}
    ${I.grassHill()}
    ${I.fairTent(440, 280, 0.8)}
    ${I.fairTent(170, 290, 0.6)}
    ${I.pigWilbur(300, 320, 1, 'happy')}
    ${I.spiderCharlotte(345, 270, 1)}
  `);

  const illo12 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 26)}
    ${I.grassHill()}
    ${I.fairTent(440, 280, 0.7)}
    ${I.webCircle(180, 130, 70, 'HUMBLE')}
    ${I.ribbon(420, 200, 1.1)}
    ${I.pigWilbur(280, 320, 1.1, 'happy')}
  `);

  const illo13 = wrap(`
    ${I.sky('evening')}
    ${I.sun(520, 80, 26)}
    ${I.grassHill()}
    ${I.fairTent(450, 280, 0.65)}
    ${I.webCircle(260, 140, 65, '')}
    ${I.spiderCharlotte(260, 140, 1.2)}
    ${I.eggSac(310, 175, 1)}
    ${I.pigWilbur(180, 320, 0.9, 'sad')}
  `);

  const illo14 = wrap(`
    ${I.sky('evening')}
    ${I.sun(520, 90, 24)}
    ${I.grassHill()}
    ${I.fairTent(470, 290, 0.55)}
    ${I.pigWilbur(240, 310, 1, 'sad')}
    ${I.eggSac(300, 250, 1.3)}
  `);

  const illo15 = wrap(`
    ${I.sky('day')}
    ${I.sun(60, 50, 30)}
    ${I.grassHill()}
    ${I.barn(360, 160, 0.7)}
    ${I.babySpiders()}
    ${I.pigWilbur(220, 310, 1, 'happy')}
  `);

  const illoEnd = wrap(`
    ${I.sky('evening')}
    ${I.sun(300, 70, 34)}
    ${I.grassHill()}
    ${I.barn(360, 170, 0.55)}
    ${I.webCircle(200, 140, 50, '')}
    ${I.spiderCharlotte(200, 140, 0.9)}
    ${I.pigWilbur(260, 300, 1, 'happy')}
    ${I.heart(420, 110, 1)}
  `);

  const illoBack = wrap(`
    ${I.sky('night')}
    ${I.moonStars()}
    ${I.grassHill()}
    ${I.webCircle(300, 170, 70, '')}
    ${I.spiderCharlotte(300, 170, 1)}
  `);

  window.COVER_ILLUSTRATION = illoCover;

  window.BOOK_PAGES = [
    {
      id: 'title',
      kind: 'title',
      illustration: illoTitle,
      text: "Charlotte's Web",
      sub: 'Retold simply, for little readers',
    },
    {
      id: 'p1',
      illustration: illo1,
      text: 'On a small farm, a tiny pig was born. He was the smallest of them all. A girl named Fern loved him at once. She named him Wilbur.',
    },
    {
      id: 'p2',
      illustration: illo2,
      text: "Wilbur grew bigger every day. Soon he moved to a big red barn. The barn smelled like warm hay. Wilbur had a cozy new pen.",
    },
    {
      id: 'p3',
      illustration: illo3,
      text: 'Wilbur had a soft bed and good food. But he felt lonely. He wanted a friend to play with. He wanted someone to talk to.',
    },
    {
      id: 'p4',
      illustration: illo4,
      text: 'The geese honked hello. The sheep said baa. The animals were friendly. But Wilbur still wished for one true friend.',
    },
    {
      id: 'p5',
      illustration: illo5,
      text: "One quiet night, a small voice said, \"Hello, Wilbur. I will be your friend.\" It was Charlotte, a clever gray spider.",
    },
    {
      id: 'p6',
      illustration: illo6,
      text: 'One day, Wilbur heard sad news. He might not get to stay on the farm forever. Wilbur was very afraid. He needed help.',
    },
    {
      id: 'p7',
      illustration: illo7,
      text: '"Do not worry," said Charlotte softly. "I will think of a plan. I will help you, Wilbur. I promise."',
    },
    {
      id: 'p8',
      illustration: illo8,
      text: 'That night, Charlotte worked in her web. In the morning, it sparkled with two surprising words: SOME PIG.',
    },
    {
      id: 'p9',
      illustration: illo9,
      text: 'People came from all around to see the web. They had never seen anything like it. They said Wilbur must be special indeed.',
    },
    {
      id: 'p10',
      illustration: illo10,
      text: 'Charlotte spun new words to help her friend. One morning the web said TERRIFIC. Wilbur grew more famous every day.',
    },
    {
      id: 'p11',
      illustration: illo11,
      text: 'Soon it was time for the county fair. Wilbur and Charlotte rode there together. It felt like a big, exciting adventure.',
    },
    {
      id: 'p12',
      illustration: illo12,
      text: 'At the fair, Charlotte spun one more word: HUMBLE. Wilbur won a shiny blue ribbon. Everyone cheered for the wonderful pig.',
    },
    {
      id: 'p13',
      illustration: illo13,
      text: 'Charlotte felt very tired. She showed Wilbur her egg sac, full of tiny eggs. "My children will hatch in the spring," she said.',
    },
    {
      id: 'p14',
      illustration: illo14,
      text: 'Charlotte could not go home with Wilbur. So Wilbur gently carried her egg sac all the way back to the barn, close to his heart.',
    },
    {
      id: 'p15',
      illustration: illo15,
      text: 'When spring came, tiny spiders hatched. "Hello, Wilbur!" they squeaked. Wilbur smiled. Charlotte\'s children were his friends now.',
    },
    {
      id: 'end',
      kind: 'end',
      illustration: illoEnd,
      text: 'Wilbur never forgot Charlotte. She was clever, and kind, and brave. That is the tale of Charlotte\'s Web. THE END.',
    },
    {
      id: 'backcover',
      kind: 'end',
      illustration: illoBack,
      text: 'Thank you for reading along!',
      sub: 'Made with love, for curious little readers.',
    },
  ];
})();
